import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LoadStatus } from './loadable';

/** Shows system status (skeleton) and recoverable errors for every page. */
@Component({
  selector: 'app-state-host',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @switch (status()) {
      @case ('loading') {
        <div class="placeholder-glow" role="status" aria-live="polite">
          @for (i of [1,2,3]; track i) { <div class="placeholder col-12 rounded-3 mb-3" style="height:96px"></div> }
          <span class="visually-hidden">Loading…</span>
        </div>
      }
      @case ('error') {
        <div class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span><strong>We couldn't load this page.</strong> Check your connection and try again.</span>
          <button class="btn btn-danger btn-sm" (click)="retry.emit()">Try again</button>
        </div>
      }
      @default { <ng-content /> }
    }`,
})
export class StateHost { status = input.required<LoadStatus>(); retry = output<void>(); }
