import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ProblemPort } from '../core/ports';
import { Difficulty } from '../core/models';
import { loadable } from '../shared/loadable';
import { StateHost } from '../shared/state-host';

@Component({
  imports: [StateHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h4 fw-bold mb-0"><i class="bi bi-bar-chart text-primary"></i> Codeforces</h1>
      <button class="btn btn-outline-primary btn-sm" [disabled]="vm.status() === 'loading'" (click)="vm.retry()">
        @if (vm.status() === 'loading') { <span class="spinner-border spinner-border-sm"></span> Syncing… } @else { <i class="bi bi-arrow-repeat"></i> Sync progress }</button>
    </div>
    <app-state-host [status]="vm.status()" (retry)="vm.retry()">
      <div class="d-flex gap-2 mb-3 flex-wrap" role="group" aria-label="Filters">
        @for (f of filters; track f) { <button class="btn btn-sm" [class]="diff() === f ? 'btn-primary' : 'btn-outline-secondary'" (click)="diff.set(f)">{{ f }}</button> }
        <div class="form-check form-switch ms-auto"><input class="form-check-input" id="u" type="checkbox" (change)="unsolved.set(!unsolved())"><label class="form-check-label" for="u">Unsolved only</label></div>
      </div>
      <div class="card-x p-0 overflow-hidden"><table class="table align-middle mb-0">
        <thead><tr><th>Problem</th><th>Difficulty</th><th>Rating</th><th class="text-end">Status</th></tr></thead>
        <tbody>
          @for (p of visible(); track p.url) {
            <tr><td>{{ p.id }}. {{ p.name }}</td><td><span class="badge diff-{{ p.difficulty }}">{{ p.difficulty }}</span></td><td>{{ p.rating }}</td>
              <td class="text-end">@if (p.solved) { <span class="badge text-bg-success"><i class="bi bi-check2"></i> Solved</span> }
                @else { <a class="btn btn-primary btn-sm" [href]="p.url" target="_blank" rel="noopener">Solve <i class="bi bi-box-arrow-up-right"></i></a> }</td></tr>
          } @empty { <tr><td colspan="4" class="text-center muted py-4">No problems match these filters.</td></tr> }
        </tbody></table></div>
    </app-state-host>`,
})
export default class CodeforcesPage {
  private api = inject(ProblemPort);
  vm = loadable(() => this.api.list());
  filters: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
  diff = signal<Difficulty | 'All'>('All');
  unsolved = signal(false);
  visible = computed(() => (this.vm.data() ?? []).filter(p => (this.diff() === 'All' || p.difficulty === this.diff()) && (!this.unsolved() || !p.solved)));
}
