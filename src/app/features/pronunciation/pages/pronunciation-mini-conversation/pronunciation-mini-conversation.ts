import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { UtteranceBubble } from '../../components/utterance-bubble/utterance-bubble';
import { RecordButton } from '../../components/record-button/record-button';

@Component({
  selector: 'app-pronunciation-mini-conversation',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, UtteranceBubble, RecordButton],
  templateUrl: './pronunciation-mini-conversation.html',
  styleUrl: './pronunciation-mini-conversation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PronunciationMiniConversation {
  protected readonly state = inject(PronunciationStateService);
  protected readonly speechRec = inject(SpeechRecognitionService);
  protected readonly tts = inject(TtsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly startForm = this.fb.nonNullable.group({
    focus: ['th-sound', Validators.required],
    level: ['b1', Validators.required],
  });

  protected readonly focuses = [
    { value: 'th-sound', label: 'TH Sound' },
    { value: 'sh-vs-s', label: 'SH vs S' },
    { value: 'vowels', label: 'Vowels' },
    { value: 'consonants', label: 'Consonants' },
    { value: 'stress', label: 'Stress' },
  ];

  protected readonly levels = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
    { value: 'c1', label: 'C1' },
    { value: 'c2', label: 'C2' },
  ];

  constructor() {
    effect(() => {
      if (this.state.isMiniConvComplete()) {
        this.router.navigate(['/pronunciation/mini-conversation/summary']);
      }
    });

    effect(() => {
      const recState = this.speechRec.state();
      const transcript = this.speechRec.transcript();
      if (recState === 'idle' && transcript && this.state.miniConvId()) {
        this.state.evaluateTurn(transcript, this.speechRec.wordConfidences());
      }
    });
  }

  protected onStart(): void {
    if (this.startForm.invalid) return;
    const { focus, level } = this.startForm.getRawValue();
    this.state.startMiniConversation(focus, level);
  }

  protected onPlay(): void {
    const turn = this.state.currentTurn();
    if (turn) this.tts.speak(turn.targetPhrase);
  }

  protected onRecordToggle(): void {
    if (this.speechRec.state() === 'recording') {
      this.speechRec.stopRecording();
    } else {
      this.speechRec.startRecording();
    }
  }
}
