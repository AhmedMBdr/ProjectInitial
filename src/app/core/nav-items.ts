// Open/Closed: add a page by adding an entry here; the shell template never changes.
export interface NavItem { label: string; icon: string; path: string }
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-house-door', path: '/dashboard' },
  { label: 'Lessons', icon: 'bi-book', path: '/lessons/variables' },
  { label: 'Quizzes', icon: 'bi-journal-check', path: '/quiz/python-basics' },
  { label: 'Codeforces', icon: 'bi-bar-chart', path: '/codeforces' },
  { label: 'Mistake Bank', icon: 'bi-bug', path: '/mistakes' },
];
