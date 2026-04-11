import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ListeningClozeCard } from './listening-cloze-card';
import { TtsService } from '../../../../shared/services/tts.service';
import { ImmerseExercise } from '../../models/immerse.model';

const mockExercise: ImmerseExercise = {
  id: 'ex-1',
  type: 'LISTENING_CLOZE',
  prompt: 'What did you hear?',
  options: ['quick', 'slow', 'lazy', 'big'],
  correctAnswer: 'quick',
  listenText: 'The quick brown fox',
  blankPosition: 1,
};

const mockTts = {
  speak: vi.fn((_text: string, onEnd?: () => void) => onEnd?.()),
  stop: vi.fn(),
  speaking: vi.fn(() => false),
};

describe('ListeningClozeCard', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ListeningClozeCard>>;
  let component: ListeningClozeCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeningClozeCard],
      providers: [{ provide: TtsService, useValue: mockTts }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeningClozeCard);
    fixture.componentRef.setInput('exercise', mockExercise);
    fixture.detectChanges();
  });

  it('should show play button in idle state', () => {
    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector('.play-btn');
    expect(btn).not.toBeNull();
    expect(el.textContent).toContain('Tap to listen');
  });

  it('should transition to playing state on play click', () => {
    // Override speak to NOT call onEnd so we stay in playing state
    mockTts.speak.mockImplementationOnce(() => undefined);

    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector<HTMLButtonElement>('.play-btn')!;
    btn.click();
    fixture.detectChanges();

    expect(el.querySelector('.pulse-ring')).not.toBeNull();
    expect(el.textContent).toContain('Listening...');
  });

  it('should transition to answering state when TTS ends', () => {
    // Default mockTts.speak calls onEnd immediately
    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector<HTMLButtonElement>('.play-btn')!;
    btn.click();
    fixture.detectChanges();

    expect(el.querySelector('.state-answering')).not.toBeNull();
    expect(el.textContent).toContain('What did you hear?');
  });

  it('should emit answered with correct=true when correct answer selected', () => {
    // Put card in answering state
    component = fixture.componentInstance;
    component['_cardState'].set('answering');
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.answered.subscribe(spy);

    const el: HTMLElement = fixture.nativeElement;
    const optionBtns = el.querySelectorAll<HTMLButtonElement>('.option-btn');
    const correctBtn = Array.from(optionBtns).find((b) => b.textContent?.trim() === 'quick');
    correctBtn?.click();
    fixture.detectChanges();

    // click Next
    const nextBtn = el.querySelector<HTMLButtonElement>('.next-btn');
    nextBtn?.click();

    expect(spy).toHaveBeenCalledWith({ correct: true, answer: 'quick' });
  });

  it('should show sentence with highlighted word in feedback state', () => {
    component = fixture.componentInstance;
    component['_cardState'].set('feedback');
    component['_isCorrect'].set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const mark = el.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark?.textContent?.trim()).toBe('quick');
  });
});
