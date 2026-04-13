import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TtsService } from '../../../../shared/services/tts.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { AnalysisPanel } from '../../components/analysis-panel/analysis-panel';
import { RecordButton } from '../../components/record-button/record-button';
import { FeedbackPanel } from '../../components/feedback-panel/feedback-panel';

@Component({
  selector: 'app-pronunciation-lab',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    AnalysisPanel,
    RecordButton,
    FeedbackPanel,
  ],
  templateUrl: './pronunciation-lab.html',
  styleUrl: './pronunciation-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PronunciationLab {
  protected readonly state = inject(PronunciationStateService);
  protected readonly tts = inject(TtsService);
  protected readonly speechRec = inject(SpeechRecognitionService);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    text: ['', [Validators.required, Validators.minLength(1)]],
    level: ['b1', Validators.required],
  });

  protected readonly levels = [
    { value: 'a1', label: 'A1 — Beginner' },
    { value: 'a2', label: 'A2 — Elementary' },
    { value: 'b1', label: 'B1 — Intermediate' },
    { value: 'b2', label: 'B2 — Upper Intermediate' },
    { value: 'c1', label: 'C1 — Advanced' },
    { value: 'c2', label: 'C2 — Mastery' },
  ];

  constructor() {
    effect(() => {
      const recState = this.speechRec.state();
      const transcript = this.speechRec.transcript();
      if (recState === 'idle' && transcript) {
        const analysisResult = this.state.analysisResult();
        if (analysisResult) {
          this.state.submitFeedback(
            analysisResult.text,
            transcript,
            this.speechRec.wordConfidences(),
          );
        }
      }
    });
  }

  protected onAnalyze(): void {
    if (this.form.invalid) return;
    const { text, level } = this.form.getRawValue();
    this.state.analyze(text, level);
  }

  protected onPlay(): void {
    const result = this.state.analysisResult();
    if (result) {
      this.tts.speak(result.text);
    }
  }

  protected onRecordToggle(): void {
    if (this.speechRec.state() === 'recording') {
      this.speechRec.stopRecording();
    } else {
      this.speechRec.startRecording();
    }
  }
}
