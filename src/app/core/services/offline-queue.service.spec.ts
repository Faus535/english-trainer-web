import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OfflineQueueService } from './offline-queue.service';

describe('OfflineQueueService', () => {
  let service: OfflineQueueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OfflineQueueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should start with zero pending requests', () => {
    expect(service.pendingCount()).toBe(0);
  });

  it('should start as online', () => {
    expect(service.online()).toBe(true);
  });

  it('should enqueue a POST request and attempt to flush when online', () => {
    service.enqueue('POST', '/api/test', { data: 'hello' });

    // When online, flush is called immediately so an HTTP request should be made
    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ data: 'hello' });
    req.flush({});

    expect(service.pendingCount()).toBe(0);
  });

  it('should enqueue a PUT request', () => {
    service.enqueue('PUT', '/api/test/1', { data: 'updated' });

    const req = httpMock.expectOne('/api/test/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should enqueue a DELETE request', () => {
    service.enqueue('DELETE', '/api/test/1', null);

    const req = httpMock.expectOne('/api/test/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should persist queue to localStorage', () => {
    // Temporarily make a request that will fail to keep it in queue
    service.enqueue('POST', '/api/test', { data: 1 });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('error'));

    const stored = localStorage.getItem('et_offline_queue');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].url).toBe('/api/test');
  });

  it('should remove request from queue after successful flush', () => {
    service.enqueue('POST', '/api/data', { value: 42 });

    const req = httpMock.expectOne('/api/data');
    req.flush({ ok: true });

    expect(service.pendingCount()).toBe(0);
  });
});
