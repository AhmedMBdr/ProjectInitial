import { signal } from '@angular/core';
import { Observable } from 'rxjs';

export type LoadStatus = 'loading' | 'ready' | 'error';

/** Single responsibility: turn an Observable into loading/ready/error signals with retry. */
export function loadable<T>(source: () => Observable<T>) {
  const status = signal<LoadStatus>('loading');
  const data = signal<T | null>(null);
  const retry = () => {
    status.set('loading');
    source().subscribe({ next: v => { data.set(v); status.set('ready'); }, error: () => status.set('error') });
  };
  retry();
  return { status, data, retry };
}
