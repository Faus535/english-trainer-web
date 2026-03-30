import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PhoneticsApiService } from './phonetics-api.service';
import { environment } from '../../../core/services/environment';

describe('PhoneticsApiService', () => {
  let service: PhoneticsApiService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl;
  const profileId = 'profile-1';
  const phonemeId = 'phoneme-1';
  const phraseId = 'phrase-1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PhoneticsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getPhonemes', () => {
    it('should call GET /api/phonetics/phonemes', () => {
      const mockPhonemes = [{ id: '1', symbol: '/iː/', name: 'Long E' }];

      service.getPhonemes().subscribe((result) => {
        expect(result).toEqual(mockPhonemes);
      });

      const req = httpMock.expectOne(`${baseUrl}/phonetics/phonemes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPhonemes);
    });
  });

  describe('getPhonemeDetail', () => {
    it('should call GET /api/phonetics/phonemes/:id', () => {
      const mockDetail = {
        id: phonemeId,
        symbol: '/iː/',
        name: 'Long E',
        mouthPosition: 'test',
        tips: [],
      };

      service.getPhonemeDetail(phonemeId).subscribe((result) => {
        expect(result).toEqual(mockDetail);
      });

      const req = httpMock.expectOne(`${baseUrl}/phonetics/phonemes/${phonemeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetail);
    });
  });

  describe('getPhrases', () => {
    it('should call GET /api/phonetics/phonemes/:id/phrases', () => {
      const mockPhrases = [
        { id: '1', text: 'test phrase', difficulty: 'easy', targetWords: [], phonemeId },
      ];

      service.getPhrases(phonemeId).subscribe((result) => {
        expect(result).toEqual(mockPhrases);
      });

      const req = httpMock.expectOne(`${baseUrl}/phonetics/phonemes/${phonemeId}/phrases`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPhrases);
    });
  });

  describe('getTodayPhoneme', () => {
    it('should call GET /api/profiles/:profileId/phonetics/today', () => {
      const mockToday = { phoneme: { id: '1' }, assignedDate: '2026-03-30', progress: 40 };

      service.getTodayPhoneme(profileId).subscribe((result) => {
        expect(result).toEqual(mockToday);
      });

      const req = httpMock.expectOne(`${baseUrl}/profiles/${profileId}/phonetics/today`);
      expect(req.request.method).toBe('GET');
      req.flush(mockToday);
    });
  });

  describe('submitAttempt', () => {
    it('should call POST with score body', () => {
      const mockResponse = {
        id: 'a1',
        score: 85,
        passed: true,
        phraseId,
        phonemeId,
        createdAt: '',
      };

      service.submitAttempt(profileId, phonemeId, phraseId, { score: 85 }).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/profiles/${profileId}/phonetics/phonemes/${phonemeId}/phrases/${phraseId}/attempt`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ score: 85 });
      req.flush(mockResponse);
    });
  });

  describe('completePhoneme', () => {
    it('should call PUT with empty body', () => {
      const mockResponse = { phonemeId, completed: true, completedAt: '2026-03-30T14:35:00Z' };

      service.completePhoneme(profileId, phonemeId).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/profiles/${profileId}/phonetics/phonemes/${phonemeId}/complete`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });
});
