import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MistakePort } from '../core/ports';
import { Difficulty } from '../core/models';
import { loadable } from '../shared/loadable';
import { StateHost } from '../shared/state-host';

@Component({
  imports: [StateHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h1 class="h4 fw-bold mb-3"><i class="bi bi-bug text-danger"></i> Mistake Bank</h1>
    <app-state-host [status]="vm.status()" (retry)="vm.retry()">
      <div class="d-flex gap-2 mb-3" role="group" aria-label="Filter by difficulty">
        @for (f of filters; track f) {
          <button class="btn btn-sm" [class]="filter() === f ? 'btn-primary' : 'btn-outline-secondary'" (click)="filter.set(f)">{{ f }}</button>
        }
      </div>
      @if (undoId() !== null) {
        <div class="alert alert-success d-flex justify-content-between align-items-center py-2" role="status">
          Marked as understood. <button class="btn btn-sm btn-link" (click)="undo()">Undo</button></div>
      }
      @for (m of visible(); track m.id) {
        <div class="card-x d-flex gap-3 align-items-center mb-2">
          <span class="icon-tile tone-red"><i class="bi bi-x-circle"></i></span>
          <div class="flex-grow-1"><div class="fw-semibold">{{ m.title }}</div><div class="muted">{{ m.topic }} · {{ m.when }}</div></div>
          <span class="badge diff-{{ m.difficulty }}">{{ m.difficulty }}</span>
          <button class="btn btn-sm btn-outline-success" (click)="dismiss(m.id)">Understood</button>
        </div>
      } @empty {
        <div class="card-x text-center muted">No mistakes here. Nice work!</div>
      }
    </app-state-host>`,
})
export default class MistakesPage {
  private api = inject(MistakePort);
  vm = loadable(() => this.api.list());
  filters: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
  filter = signal<Difficulty | 'All'>('All');
  private hidden = signal<number[]>([]);
  undoId = signal<number | null>(null);
  visible = computed(() => (this.vm.data() ?? []).filter(m => !this.hidden().includes(m.id) && (this.filter() === 'All' || m.difficulty === this.filter())));
  dismiss(id: number) { this.hidden.update(h => [...h, id]); this.undoId.set(id); }
  undo() { this.hidden.update(h => h.filter(x => x !== this.undoId())); this.undoId.set(null); }   // user control
}
