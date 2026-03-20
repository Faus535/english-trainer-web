import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { LevelTestService } from './level-test.service';
import { StateService } from '../../../shared/services/state.service';

describe('LevelTestService', () => {
  let service: LevelTestService;
  let state: StateService;

  beforeEach(() => {
    localStorage.clear();
    state = TestBed.inject(StateService);
    service = TestBed.inject(LevelTestService);
  });

  it('should start at intro phase', () => {
    expect(service.phase()).toBe('intro');
  });

  it('should move to vocabulary phase on startTest', () => {
    service.startTest();
    expect(service.phase()).toBe('vocabulary');
    expect(service.currentQuestion()).toBe(0);
  });

  it('should advance vocab questions', () => {
    service.startTest();
    service.submitVocabAnswer('house');
    expect(service.currentQuestion()).toBe(1);
  });

  it('should accept alternative answers for vocab', () => {
    service.startTest();
    // Skip first 4 A1 questions
    for (let i = 0; i < 4; i++) service.skipVocab();
    // Question 5 is "cita / reunion" with alt "meeting"
    service.submitVocabAnswer('meeting');
    expect(service.currentQuestion()).toBe(5);
  });

  it('should skip vocab questions', () => {
    service.startTest();
    service.skipVocab();
    expect(service.currentQuestion()).toBe(1);
  });

  it('should transition from vocabulary to grammar after 20 questions', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) {
      service.skipVocab();
    }
    expect(service.phase()).toBe('grammar');
    expect(service.currentQuestion()).toBe(0);
  });

  it('should transition from grammar to listening after 15 questions', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    expect(service.phase()).toBe('listening');
  });

  it('should transition from listening to pronunciation after 10 questions', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    for (let i = 0; i < 10; i++) service.skipListening();
    expect(service.phase()).toBe('pronunciation');
  });

  it('should transition to results after pronunciation', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    for (let i = 0; i < 10; i++) service.skipListening();
    for (let i = 0; i < 8; i++) service.submitPronunciationAnswer(0);
    expect(service.phase()).toBe('results');
  });

  it('should mark test completed after results', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    for (let i = 0; i < 10; i++) service.skipListening();
    for (let i = 0; i < 8; i++) service.submitPronunciationAnswer(0);
    expect(state.testCompleted()).toBe(true);
  });

  it('should have results data after completing test', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    for (let i = 0; i < 10; i++) service.skipListening();
    for (let i = 0; i < 8; i++) service.submitPronunciationAnswer(0);

    const results = service.results();
    expect(results).not.toBeNull();
    expect(results!.profileType).toBeTruthy();
    expect(results!.sessions).toBeTruthy();
  });

  it('should skip test with selected level', () => {
    service.skipTestWithLevel('b1');
    expect(state.testCompleted()).toBe(true);
    expect(state.getModuleLevel('listening')).toBe('b1');
    expect(state.getModuleLevel('vocabulary')).toBe('b1');
  });

  it('should show progress during vocab phase', () => {
    service.startTest();
    const p = service.progress();
    expect(p).not.toBeNull();
    expect(p!.label).toBe('Vocabulario');
    expect(p!.total).toBe(20);
  });

  it('should calculate A1 level when all wrong', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(99);
    for (let i = 0; i < 10; i++) service.skipListening();
    for (let i = 0; i < 8; i++) service.submitPronunciationAnswer(99);

    expect(state.getModuleLevel('vocabulary')).toBe('a1');
    expect(state.getModuleLevel('grammar')).toBe('a1');
  });

  it('should accept listening answer with 60% word match', () => {
    service.startTest();
    for (let i = 0; i < 20; i++) service.skipVocab();
    for (let i = 0; i < 15; i++) service.submitGrammarAnswer(0);
    // First listening question: "I would like a glass of water, please."
    // 60% of 8 words = 5 words needed
    service.submitListeningAnswer('I would like a glass of water');
    // Should not throw and should advance
    expect(service.currentQuestion()).toBe(1);
  });
});
