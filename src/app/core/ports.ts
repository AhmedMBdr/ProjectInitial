import { Observable } from 'rxjs';
import { Dashboard, Lesson, Mistake, Problem, Quiz, QuizResult } from './models';

export abstract class DashboardPort { abstract load(): Observable<Dashboard>; }
export abstract class LessonPort { abstract get(id: string): Observable<Lesson>; }
export abstract class QuizPort {
  abstract get(id: string): Observable<Quiz>;
  abstract submit(id: string, answers: Record<number, number>): Observable<QuizResult>;
}
export abstract class MistakePort { abstract list(): Observable<Mistake[]>; }
export abstract class ProblemPort { abstract list(): Observable<Problem[]>; }
