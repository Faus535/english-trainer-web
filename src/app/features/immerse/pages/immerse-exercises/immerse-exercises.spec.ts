import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ImmerseExercises } from './immerse-exercises';
import { ImmerseStateService } from '../../services/immerse-state.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { environment } from '../../../../core/services/environment';

const mockTts = {
  speak: vi.fn((_text: string, onEnd?: () => void) => onEnd?.()),
  stop: vi.fn(),
  speaking: vi.fn(() => false),
};

const mockExercises = [
  {
    id: 'ex-1',
    type: 'LISTENING_CLOZE',
    prompt: 'Q1',
    options: ['quick', 'slow'],
    correctAnswer: 'quick',
    listenText: 'The quick fox',
    blankPosition: 1,
  },
];

describe('ImmerseExercises', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ImmerseExercises>>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ImmerseExercises],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: TtsService, useValue: mockTts },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImmerseExercises);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(ImmerseStateService).cancelGeneration();
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should show Reading Mode as default', () => {
    const el: HTMLElement = fixture.nativeElement;
    const readingBtn = Array.from(el.querySelectorAll<HTMLElement>('.mode-btn')).find((b) =>
      b.textContent?.includes('Reading Mode'),
    );
    expect(readingBtn?.classList.contains('active')).toBe(true);
  });

  it('should switch to ListeningClozeCard when Listening Mode toggled', () => {
    const stateService = TestBed.inject(ImmerseStateService);

    // Load exercises so the page has content
    stateService['_currentContentId'] = 'content-1';
    stateService['_exercises'].set(mockExercises as any);
    fixture.detectChanges();

    // Toggle to listening mode
    const el: HTMLElement = fixture.nativeElement;
    const listeningBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('.mode-btn')).find((b) =>
      b.textContent?.includes('Listening Mode'),
    );
    listeningBtn?.click();

    // Flush the reload request
    const req = httpMock.expectOne(
      `${environment.apiUrl}/immerse/content/content-1/exercises?type=LISTENING_CLOZE`,
    );
    req.flush(mockExercises);
    fixture.detectChanges();

    expect(el.querySelector('app-listening-cloze-card')).not.toBeNull();
  });

  it('should reload exercises with type filter on toggle', () => {
    const stateService = TestBed.inject(ImmerseStateService);
    stateService['_currentContentId'] = 'content-1';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const listeningBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('.mode-btn')).find((b) =>
      b.textContent?.includes('Listening Mode'),
    );
    listeningBtn?.click();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/immerse/content/content-1/exercises?type=LISTENING_CLOZE`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
