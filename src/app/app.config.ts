import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { DashboardPort, LessonPort, MistakePort, ProblemPort, QuizPort } from './core/ports';
import { MockDashboardApi, MockLessonApi, MockMistakeApi, MockProblemApi, MockQuizApi } from './mock/mock-apis';

// Composition root: the ONLY place that knows concrete implementations.
// To go live, replace each Mock* with an Http* class that extends the same port.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: DashboardPort, useClass: MockDashboardApi },
    { provide: LessonPort, useClass: MockLessonApi },
    { provide: QuizPort, useClass: MockQuizApi },
    { provide: MistakePort, useClass: MockMistakeApi },
    { provide: ProblemPort, useClass: MockProblemApi },
  ],
};
