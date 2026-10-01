import { Component, HostListener, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuizPort } from '../core/ports';
import { QuizResult } from '../core/models';
import { loadable } from '../shared/loadable';
import { StateHost } from '../shared/state-host';

@Component({
  imports: [RouterLink, StateHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-state-host [status]="vm.status()" (retry)="vm.retry()">
      @if (result(); as r) {
        <section class="card-x text-center mx-auto" style="max-width:520px" role="status">
          <div class="display-4 fw-bold" [class]="r.score >= 70 ? 'text-success' : 'text-warning'">{{ r.score }}%</div>
          <p>You answered {{ r.correct }} of {{ r.total }} correctly.</p>
          <div class="d-flex gap-2 justify-content-center">
            <a class="btn btn-primary" routerLink="/mistakes">Review mistakes</a>
            <a class="btn btn-outline-secondary" routerLink="/dashboard">Dashboard</a>
          </div>
        </section>
      } @else if (vm.data(); as quiz) {
        @if (question(); as q) {
          <section class="card-x mx-auto" style="max-width:760px">
            <div class="d-flex justify-content-between muted mb-1"><span>Question {{ index() + 1 }} of {{ quiz.questions.length }}</span><span>{{ answered() }} answered</span></div>
            <div class="progress mb-4" style="height:6px"><div class="progress-bar" [style.width.%]="100 * (index() + 1) / quiz.questions.length"></div></div>
            <h1 class="h5 fw-bold">{{ q.text }}</h1>
            @if (q.code) { <pre class="code mb-3">{{ q.code }}</pre> }
            <div role="radiogroup" [attr.aria-label]="q.text">
              @for (o of q.options; track o; let i = $index) {
                <button class="btn w-100 text-start mb-2 border" role="radio" [attr.aria-checked]="answers()[q.id] === i"
                  [class]="answers()[q.id] === i ? 'btn-primary-subtle border-primary' : 'btn-light'" (click)="pick(i)">
                  <strong class="me-2">{{ 'ABCD'[i] }}</strong>{{ o }}</button>
              }
            </div>
            @if (confirming()) {
              <div class="alert alert-warning d-flex justify-content-between align-items-center mt-3" role="alert">
                <span>{{ unanswered() }} question(s) are still unanswered. Submit anyway?</span>
                <span class="d-flex gap-2"><button class="btn btn-sm btn-outline-secondary" (click)="confirming.set(false)">Keep working</button>
                  <button class="btn btn-sm btn-warning" (click)="submit(true)">Submit</button></span>
              </div>
            }
            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-outline-secondary" [disabled]="index() === 0" (click)="go(-1)">Previous</button>
              @if (index() < quiz.questions.length - 1) { <button class="btn btn-primary" (click)="go(1)">Next</button> }
              @else { <button class="btn btn-success" [disabled]="submitting()" (click)="submit()">
                @if (submitting()) { <span class="spinner-border spinner-border-sm"></span> Grading… } @else { Submit quiz } </button> }
            </div>
            <p class="muted mt-3 mb-0">Shortcuts: 1–4 choose, ← → navigate.</p>
          </section>
        }
      }
    </app-state-host>`,
})
export default class QuizPage {
  private api = inject(QuizPort);
  private id = inject(ActivatedRoute).snapshot.paramMap.get('id')!;
  vm = loadable(() => this.api.get(this.id));
  index = signal(0);
  answers = signal<Record<number, number>>({});
  result = signal<QuizResult | null>(null);
  confirming = signal(false);
  submitting = signal(false);
  question = computed(() => this.vm.data()?.questions[this.index()]);
  answered = computed(() => Object.keys(this.answers()).length);
  unanswered = computed(() => (this.vm.data()?.questions.length ?? 0) - this.answered());

  pick(i: number) { const q = this.question(); if (q) { this.answers.update(a => ({ ...a, [q.id]: i })); this.confirming.set(false); } }
  go(step: number) { const n = this.vm.data()!.questions.length; this.index.update(i => Math.min(n - 1, Math.max(0, i + step))); }
  submit(force = false) {
    if (this.unanswered() > 0 && !force) { this.confirming.set(true); return; }   // error prevention
    this.confirming.set(false); this.submitting.set(true);
    this.api.submit(this.id, this.answers()).subscribe(r => { this.result.set(r); this.submitting.set(false); });
  }
  @HostListener('window:keydown', ['$event']) keys(e: KeyboardEvent) {
    if (this.result() || !this.question() || e.altKey) return;
    const n = Number(e.key);
    if (n >= 1 && n <= this.question()!.options.length) this.pick(n - 1);
    else if (e.key === 'ArrowRight' && this.index() < this.vm.data()!.questions.length - 1) this.go(1);
    else if (e.key === 'ArrowLeft') this.go(-1);
  }
}
