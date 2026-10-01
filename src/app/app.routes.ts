import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', title: 'Dashboard · BaccaCode', loadComponent: () => import('./features/dashboard-page') },
  { path: 'lessons/:id', title: 'Lesson · BaccaCode', loadComponent: () => import('./features/lesson-page') },
  { path: 'quiz/:id', title: 'Quiz · BaccaCode', loadComponent: () => import('./features/quiz-page') },
  { path: 'codeforces', title: 'Codeforces · BaccaCode', loadComponent: () => import('./features/codeforces-page') },
  { path: 'mistakes', title: 'Mistake Bank · BaccaCode', loadComponent: () => import('./features/mistakes-page') },
  { path: '**', redirectTo: 'dashboard' },
];
