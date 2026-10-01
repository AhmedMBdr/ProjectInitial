import { Component, HostListener, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAV_ITEMS } from './core/nav-items';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styles: `
    .side { width:250px; background:linear-gradient(180deg,var(--navy),var(--navy-2)); color:#fff; position:sticky; top:0; height:100vh; padding:1.25rem 1rem; flex:none; }
    .nav-link-x { display:flex; gap:.75rem; align-items:center; color:#c6d3ee; padding:.7rem .9rem; border-radius:10px; text-decoration:none; font-weight:500; }
    .nav-link-x:hover { background:rgba(255,255,255,.08); color:#fff; }
    .nav-link-x.active { background:var(--blue); color:#fff; }
    kbd { margin-left:auto; background:rgba(255,255,255,.12); color:#c6d3ee; font-size:.7rem; }
    @media (max-width:850px){ .side{display:none} }`,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <a class="visually-hidden-focusable" href="#main">Skip to content</a>
    <div class="d-flex">
      <nav class="side" aria-label="Main">
        <div class="fs-4 fw-bold mb-1"><i class="bi bi-code-slash text-info"></i> BaccaCode</div>
        <div class="small mb-4" style="color:#9fb2d9">Learn · Practice · Master</div>
        @for (n of items; track n.path; let i = $index) {
          <a class="nav-link-x mb-1" [routerLink]="n.path" routerLinkActive="active" [attr.aria-label]="n.label">
            <i class="bi {{ n.icon }}"></i> {{ n.label }} <kbd>Alt+{{ i + 1 }}</kbd>
          </a>
        }
      </nav>
      <main id="main" class="flex-grow-1 p-3 p-lg-4" style="min-width:0"><router-outlet /></main>
    </div>`,
})
export class AppShell {
  private router = inject(Router);
  protected items = NAV_ITEMS;
  /** Flexibility: expert shortcut Alt+1…5 jumps between sections. */
  @HostListener('window:keydown', ['$event']) shortcut(e: KeyboardEvent) {
    const item = e.altKey ? this.items[Number(e.key) - 1] : undefined;
    if (item) { e.preventDefault(); this.router.navigateByUrl(item.path); }
  }
}
