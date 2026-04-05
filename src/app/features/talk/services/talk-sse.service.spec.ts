import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TalkSseService, SseEvent } from './talk-sse.service';
import { AuthService } from '../../../core/services/auth.service';

describe('TalkSseService', () => {
  let service: TalkSseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            token: () => 'test-token',
          },
        },
      ],
    });
    service = TestBed.inject(TalkSseService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('streamMessage() should return an Observable', () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      body: null,
    });
    globalThis.fetch = mockFetch;

    const result = service.streamMessage('conv-1', 'Hello');
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });

  it('streamMessage() should error on non-200 response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      body: null,
    });
    globalThis.fetch = mockFetch;

    const events: SseEvent[] = [];
    let errorOccurred = false;

    await new Promise<void>((resolve) => {
      service.streamMessage('conv-1', 'Hello').subscribe({
        next: (e) => events.push(e),
        error: () => {
          errorOccurred = true;
          resolve();
        },
        complete: () => resolve(),
      });
    });

    expect(errorOccurred).toBe(true);
    expect(events.length).toBe(0);
  });
});
