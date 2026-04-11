import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProfileStateService } from './profile-state.service';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileResponse } from '../models/api.model';

const PROFILE_ID = 'test-profile-id';

function makeProfileResponse(englishLevel: string | null): UserProfileResponse {
  return {
    id: PROFILE_ID,
    testCompleted: true,
    levelListening: 'b1',
    levelVocabulary: 'b1',
    levelGrammar: 'b1',
    levelPhrases: 'b1',
    levelPronunciation: 'b1',
    sessionCount: 0,
    sessionsThisWeek: 0,
    xp: 0,
    englishLevel,
  };
}

describe('ProfileStateService', () => {
  let service: ProfileStateService;
  let profileApi: ProfileApiService;

  beforeEach(() => {
    localStorage.clear();

    const mockAuth = { profileId: signal<string | null>(PROFILE_ID) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(ProfileStateService);
    profileApi = TestBed.inject(ProfileApiService);
  });

  describe('applyBackendProfile', () => {
    it('sets et_onboarding_completed when englishLevel is truthy', () => {
      vi.spyOn(profileApi, 'getProfile').mockReturnValue(of(makeProfileResponse('B1')));

      service.loadFromBackend();

      expect(localStorage.getItem('et_onboarding_completed')).toBe('true');
    });

    it('does not set et_onboarding_completed when englishLevel is null', () => {
      vi.spyOn(profileApi, 'getProfile').mockReturnValue(of(makeProfileResponse(null)));

      service.loadFromBackend();

      expect(localStorage.getItem('et_onboarding_completed')).toBeNull();
    });
  });
});
