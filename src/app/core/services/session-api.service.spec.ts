import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { environment } from './environment';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const profileId = 'profile-1';
  const sessionId = 'session-1';
  const baseUrl = `${environment.apiUrl}/profiles`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('advanceBlock', () => {
    it('should call PUT with correct URL', () => {
      const blockIndex = 2;
      const mockResponse = {
        blockIndex: 2,
        blockCompleted: true,
        nextBlockIndex: 3,
        sessionCompleted: false,
        completedExercises: 3,
        totalExercises: 3,
      };

      service.advanceBlock(profileId, sessionId, blockIndex).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/${profileId}/sessions/${sessionId}/blocks/${blockIndex}/advance`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should interpolate profileId, sessionId, and blockIndex in URL', () => {
      service.advanceBlock('p-abc', 's-xyz', 5).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/p-abc/sessions/s-xyz/blocks/5/advance`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('getBlockExercises', () => {
    it('should call GET with correct URL', () => {
      const blockIndex = 1;
      const mockExercises = [
        { exerciseIndex: 0, exerciseType: 'MULTIPLE_CHOICE', contentIds: ['c1'], targetCount: 5 },
        { exerciseIndex: 1, exerciseType: 'FILL_BLANK', contentIds: ['c2'], targetCount: 3 },
      ];

      service.getBlockExercises(profileId, sessionId, blockIndex).subscribe((result) => {
        expect(result).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/${profileId}/sessions/${sessionId}/blocks/${blockIndex}/exercises`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should interpolate profileId, sessionId, and blockIndex in URL', () => {
      service.getBlockExercises('p-123', 's-456', 0).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/p-123/sessions/s-456/blocks/0/exercises`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
