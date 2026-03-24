import { TestBed } from '@angular/core/testing';
import { IdleWarningModal } from './idle-warning-modal';
import { IdleService } from '../../../core/services/idle.service';

describe('IdleWarningModal', () => {
  let mockIdle: {
    showWarning: ReturnType<typeof vi.fn>;
    remainingDisplay: ReturnType<typeof vi.fn>;
    remainingSeconds: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockIdle = {
      showWarning: vi.fn(() => false),
      remainingDisplay: vi.fn(() => '30'),
      remainingSeconds: vi.fn(() => 30),
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: IdleService, useValue: mockIdle }],
    });
  });

  it('should not render when showWarning is false', () => {
    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.overlay')).toBeNull();
  });

  it('should render overlay when showWarning is true', () => {
    mockIdle.showWarning = vi.fn(() => true);

    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.overlay')).not.toBeNull();
    expect(el.querySelector('.modal')).not.toBeNull();
  });

  it('should display countdown value', () => {
    mockIdle.showWarning = vi.fn(() => true);
    mockIdle.remainingDisplay = vi.fn(() => '45');

    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const countdown = fixture.nativeElement.querySelector('.countdown');
    expect(countdown?.textContent).toContain('45');
  });

  it('should call idle.reset when continue is clicked', () => {
    mockIdle.showWarning = vi.fn(() => true);

    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const continueBtn = fixture.nativeElement.querySelector('.btn--primary');
    continueBtn?.click();

    expect(mockIdle.reset).toHaveBeenCalled();
  });

  it('should emit logoutRequested when close session is clicked', () => {
    mockIdle.showWarning = vi.fn(() => true);

    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.logoutRequested.subscribe(spy);

    const closeBtn = fixture.nativeElement.querySelector('.btn--secondary');
    closeBtn?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should add urgent class when remaining seconds <= 10', () => {
    mockIdle.showWarning = vi.fn(() => true);
    mockIdle.remainingSeconds = vi.fn(() => 8);

    const fixture = TestBed.createComponent(IdleWarningModal);
    fixture.detectChanges();

    const countdown = fixture.nativeElement.querySelector('.countdown');
    expect(countdown?.classList.contains('urgent')).toBe(true);
  });
});
