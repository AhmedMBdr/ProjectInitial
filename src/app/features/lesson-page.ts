import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonPort } from '../core/ports';
import { loadable } from '../shared/loadable';
import { StateHost } from '../shared/state-host';

@Component({
  imports: [RouterLink, StateHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-state-host [status]="vm.status()" (retry)="vm.retry()">
      @if (vm.data(); as l) {
        <article class="card-x" style="max-width:820px">
          <nav class="muted mb-2"><a routerLink="/dashboard">Dashboard</a> / Lessons / {{ l.title }}</nav>
          <h1 class="h4 fw-bold">{{ l.title }}</h1>
          <h2 class="h6 mt-4">What are variables?</h2>
          <p style="max-width:65ch">{{ l.theory }}</p>
          <div class="position-relative">
            <pre class="code" tabindex="0">{{ l.code }}</pre>
            <button class="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2" (click)="copy(l.code)">
              <i class="bi" [class]="copied() ? 'bi-check2' : 'bi-clipboard'"></i> {{ copied() ? 'Copied' : 'Copy' }}</button>
          </div>
          <aside class="rounded-3 bg-primary-subtle p-3 mt-3"><strong><i class="bi bi-info-circle"></i> Key points</strong>
            <ul class="mb-0 mt-2">@for (k of l.keyPoints; track k) { <li>{{ k }}</li> }</ul></aside>
          <div class="d-flex justify-content-between mt-4">
            <a class="btn btn-outline-secondary" routerLink="/dashboard">Back to dashboard</a>
            <a class="btn btn-primary" [routerLink]="['/quiz', l.quizId]">Take the quiz</a>
          </div>
        </article>
      }
    </app-state-host>`,
})
export default class LessonPage {
  private api = inject(LessonPort);
  private id = inject(ActivatedRoute).snapshot.paramMap.get('id')!;
  vm = loadable(() => this.api.get(this.id));
  copied = signal(false);
  async copy(text: string) { await navigator.clipboard.writeText(text); this.copied.set(true); setTimeout(() => this.copied.set(false), 1500); }
}
