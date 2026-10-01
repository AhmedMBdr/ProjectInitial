import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardPort } from '../core/ports';
import { loadable } from '../shared/loadable';
import { StateHost } from '../shared/state-host';

@Component({
  imports: [RouterLink, StateHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-state-host [status]="vm.status()" (retry)="vm.retry()">
      @if (vm.data(); as d) {
        <section class="rounded-4 p-4 mb-4 text-white" style="background:linear-gradient(120deg,var(--navy),#1e3a8a)">
          <h1 class="h3 fw-bold">Welcome back, {{ d.name }}! 👋</h1>
          <p class="mb-3" style="color:#c6d3ee">Keep going! You're making great progress.</p>
          <div class="d-flex justify-content-between small"><span>{{ d.level }}</span><span>{{ d.xp }} / {{ d.xpMax }} XP</span></div>
          <div class="progress" role="progressbar" [attr.aria-valuenow]="d.xp" aria-valuemin="0" [attr.aria-valuemax]="d.xpMax" style="height:8px">
            <div class="progress-bar bg-success" [style.width.%]="100 * d.xp / d.xpMax"></div>
          </div>
        </section>
        <div class="row g-3 mb-4">
          @for (s of d.stats; track s.label) {
            <div class="col-6 col-xl-3"><div class="card-x h-100">
              <div class="d-flex gap-3 align-items-center">
                <span class="icon-tile {{ s.tone }}"><i class="bi {{ s.icon }}"></i></span>
                <div><div class="muted">{{ s.label }}</div>
                  <div class="fs-4 fw-bold">{{ s.value }}{{ s.suffix }}@if (s.total) {<span class="muted fw-normal"> / {{ s.total }}</span>}</div></div>
              </div>
              @if (s.total) { <div class="progress mt-3" style="height:5px"><div class="progress-bar" [style.width.%]="100 * s.value / s.total"></div></div> }
            </div></div>
          }
        </div>
        <div class="row g-3">
          <div class="col-lg-7"><section class="card-x h-100"><h2 class="h5 fw-bold mb-3">Your Study Plan</h2>
            @for (p of d.plan; track p.title; let n = $index) {
              <div class="d-flex gap-3 align-items-center p-2 rounded-3 mb-1" [class.bg-primary-subtle]="p.status === 'active'">
                <span class="icon-tile" style="width:34px;height:34px;font-size:1rem"
                  [class]="p.status === 'done' ? 'tone-green' : p.status === 'active' ? 'bg-primary text-white' : 'bg-light text-secondary'">
                  <i class="bi" [class]="p.status === 'done' ? 'bi-check-lg' : p.status === 'locked' ? 'bi-lock' : 'bi-' + (n + 1) + '-circle'"></i></span>
                <div class="flex-grow-1"><div class="fw-semibold">{{ p.title }}</div><div class="muted">{{ p.detail }}</div></div>
                @if (p.link) { <a class="btn btn-primary btn-sm" [routerLink]="p.link">Continue</a> }
              </div>
            }
          </section></div>
          <div class="col-lg-5 d-flex flex-column gap-3">
            <section class="card-x"><h2 class="h5 fw-bold mb-3">Today's Goals</h2>
              @for (g of goals(d.goals); track g.text; let i = $index) {
                <label class="d-flex gap-2 mb-2" style="cursor:pointer">
                  <input class="form-check-input" type="checkbox" [checked]="g.done" (change)="toggle(i)"> <span [class.text-decoration-line-through]="g.done">{{ g.text }}</span>
                </label>
              }
            </section>
            <section class="card-x"><h2 class="h5 fw-bold mb-3">Recent Activity</h2>
              @for (a of d.activity; track a.text) {
                <div class="d-flex gap-3 align-items-center mb-2"><span class="icon-tile {{ a.tone }}" style="width:34px;height:34px;font-size:1rem"><i class="bi {{ a.icon }}"></i></span>
                  <div><div class="small fw-semibold">{{ a.text }}</div><div class="muted">{{ a.when }}</div></div></div>
              }
            </section>
          </div>
        </div>
      }
    </app-state-host>`,
})
export default class DashboardPage {
  private api = inject(DashboardPort);
  vm = loadable(() => this.api.load());
  private done = signal<Record<number, boolean>>({});
  /** Immediate visual feedback: goal state is applied locally, no round trip needed. */
  goals = (base: { text: string; done: boolean }[]) => base.map((g, i) => ({ ...g, done: this.done()[i] ?? g.done }));
  toggle(i: number) { this.done.update(s => ({ ...s, [i]: !(s[i] ?? this.vm.data()!.goals[i].done) })); }
}
