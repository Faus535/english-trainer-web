import { TestBed } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
function setGlobalGoogle(value: unknown): void {
  (globalThis as any)['google'] = value;
}

function clearGlobalGoogle(): void {
  delete (globalThis as any)['google'];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function mockScriptLoad(): void {
  const mockScript = document.createElement('script');
  vi.spyOn(document, 'createElement').mockReturnValue(mockScript);
  vi.spyOn(document, 'querySelector').mockReturnValue(null);
  vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
    (node as HTMLScriptElement).onload?.(new Event('load'));
    return node;
  });
}

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(() => {
    service = TestBed.inject(GoogleAuthService);
  });

  afterEach(() => {
    clearGlobalGoogle();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reject when Google prompt is dismissed', async () => {
    mockScriptLoad();

    setGlobalGoogle({
      accounts: {
        id: {
          initialize: vi.fn(),
          prompt: vi.fn(
            (
              cb: (n: {
                isNotDisplayed: () => boolean;
                isSkippedMoment: () => boolean;
                isDismissedMoment: () => boolean;
              }) => void,
            ) => {
              cb({
                isNotDisplayed: () => false,
                isSkippedMoment: () => false,
                isDismissedMoment: () => true,
              });
            },
          ),
        },
      },
    });

    await expect(service.signIn()).rejects.toThrow('google_prompt_dismissed');
  });

  it('should resolve with credential when user signs in', async () => {
    mockScriptLoad();

    setGlobalGoogle({
      accounts: {
        id: {
          initialize: vi.fn((config: { callback: (r: { credential: string }) => void }) => {
            setTimeout(() => config.callback({ credential: 'mock-id-token' }), 0);
          }),
          prompt: vi.fn(),
        },
      },
    });

    const token = await service.signIn();
    expect(token).toBe('mock-id-token');
  });
});
