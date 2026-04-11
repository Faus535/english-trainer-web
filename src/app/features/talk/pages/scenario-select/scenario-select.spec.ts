import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ScenarioSelect } from './scenario-select';
import { TalkApiService } from '../../services/talk-api.service';
import { QuickChallenge, ScenarioCategory } from '../../models/talk.model';

const MOCK_CHALLENGES: QuickChallenge[] = [
  {
    id: 'order-coffee',
    title: 'Order Coffee',
    description: 'Café ordering',
    difficulty: 'EASY',
    category: 'Food & Dining',
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    description: 'Common Q&A',
    difficulty: 'HARD',
    category: 'Work',
  },
];

const MOCK_CATEGORIES: ScenarioCategory[] = [
  {
    id: 'daily-life',
    name: 'Daily Life',
    scenarios: [
      {
        id: 'scenario-1',
        title: 'At the Store',
        description: 'Shopping',
        cefrLevel: 'a2',
        difficultyOrder: 1,
        category: 'Daily Life',
      },
    ],
  },
];

describe('ScenarioSelect', () => {
  let fixture: ComponentFixture<ScenarioSelect>;
  let talkApi: Partial<TalkApiService>;
  let router: Router;

  beforeEach(() => {
    talkApi = {
      listScenarios: vi.fn().mockReturnValue(of(MOCK_CATEGORIES)),
      listQuickChallenges: vi.fn().mockReturnValue(of(MOCK_CHALLENGES)),
      categoryIcon: vi.fn().mockReturnValue('🏠'),
    };

    TestBed.configureTestingModule({
      imports: [ScenarioSelect],
      providers: [provideRouter([]), { provide: TalkApiService, useValue: talkApi }],
    });

    fixture = TestBed.createComponent(ScenarioSelect);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should load quick challenges in parallel with scenarios', () => {
    expect(talkApi.listScenarios).toHaveBeenCalledTimes(1);
    expect(talkApi.listQuickChallenges).toHaveBeenCalledTimes(1);

    const cards = fixture.debugElement.queryAll(By.css('app-quick-challenge-card'));
    expect(cards.length).toBe(2);
  });

  it('should navigate to conversation with QUICK mode params', () => {
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const component = fixture.componentInstance;

    (
      component as unknown as { onQuickChallengeSelected(c: QuickChallenge): void }
    ).onQuickChallengeSelected(MOCK_CHALLENGES[0]);

    expect(spy).toHaveBeenCalledWith(
      ['/talk', 'conversation'],
      expect.objectContaining({
        queryParams: expect.objectContaining({ mode: 'QUICK', challengeId: 'order-coffee' }),
      }),
    );
  });
});
