import { TestBed } from '@angular/core/testing';
import { GoogleSignInButton } from './google-sign-in-button';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

describe('GoogleSignInButton', () => {
  const mockGoogleAuth = {
    signIn: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: GoogleAuthService, useValue: mockGoogleAuth }],
    });
  });

  it('should render with default label', () => {
    const fixture = TestBed.createComponent(GoogleSignInButton);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Continuar con Google');
  });

  it('should render with custom label', () => {
    const fixture = TestBed.createComponent(GoogleSignInButton);
    fixture.componentRef.setInput('label', 'Registrarse con Google');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Registrarse con Google');
  });

  it('should emit authenticated with token on success', async () => {
    mockGoogleAuth.signIn.mockResolvedValue('mock-token');

    const fixture = TestBed.createComponent(GoogleSignInButton);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.authenticated.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    await vi.waitFor(() => {
      expect(spy).toHaveBeenCalledWith('mock-token');
    });
  });

  it('should emit error when sign-in fails', async () => {
    mockGoogleAuth.signIn.mockRejectedValue(new Error('google_prompt_not_available'));

    const fixture = TestBed.createComponent(GoogleSignInButton);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.authError.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    await vi.waitFor(() => {
      expect(spy).toHaveBeenCalledWith('google_prompt_not_available');
    });
  });

  it('should not emit error when prompt is dismissed', async () => {
    mockGoogleAuth.signIn.mockRejectedValue(new Error('google_prompt_dismissed'));

    const fixture = TestBed.createComponent(GoogleSignInButton);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.authError.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    await new Promise((r) => setTimeout(r, 50));
    expect(spy).not.toHaveBeenCalled();
  });
});
