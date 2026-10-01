import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { DashboardPort, LessonPort, MistakePort, ProblemPort, QuizPort } from '../core/ports';
import { Quiz } from '../core/models';

const lag = <T>(v: T) => of(v).pipe(delay(450)); // simulated latency so loading states are visible

@Injectable() export class MockDashboardApi extends DashboardPort {
  load() { return lag({
    name: 'Ahmed', level: 'Level 3 · Python Beginner', xp: 320, xpMax: 500,
    stats: [
      { label: 'Total Lessons', value: 24, total: 60, icon: 'bi-book', tone: 'tone-blue' },
      { label: 'Quizzes Completed', value: 8, total: 15, icon: 'bi-journal-check', tone: 'tone-purple' },
      { label: 'Problems Solved', value: 37, total: 100, icon: 'bi-code-slash', tone: 'tone-blue' },
      { label: 'Current Mastery', value: 62, suffix: '%', icon: 'bi-trophy', tone: 'tone-amber' }],
    plan: [
      { title: 'Introduction to Python', detail: 'Completed · 2/2 lessons', status: 'done' as const },
      { title: 'Variables and Data Types', detail: 'In progress · 1/3 lessons', status: 'active' as const, link: '/lessons/variables' },
      { title: 'Control Flow', detail: 'Locked · needs 80% on the current topic', status: 'locked' as const },
      { title: 'Functions', detail: 'Locked · needs Control Flow', status: 'locked' as const }],
    goals: [{ text: 'Complete Variables and Data Types', done: true }, { text: 'Solve 3 practice problems', done: false },
            { text: 'Take the short quiz', done: false }, { text: 'Review 2 mistakes', done: false }],
    activity: [
      { text: 'Solved A. Helpful Maths', when: '2 hours ago', icon: 'bi-check-lg', tone: 'tone-green' },
      { text: 'Quiz: Python Basics · 8/10', when: '4 hours ago', icon: 'bi-journal-text', tone: 'tone-purple' },
      { text: 'Mistake Review: Loops', when: 'Yesterday', icon: 'bi-exclamation-triangle', tone: 'tone-amber' }] }); }
}

@Injectable() export class MockLessonApi extends LessonPort {
  get(id: string) { return lag({ id, title: 'Variables and Data Types', quizId: 'python-basics',
    theory: "Variables store data values. In Python you don't need to declare the type; it is inferred automatically.",
    code: '# Example\nname = "Ahmed"\nage = 17\nis_student = True',
    keyPoints: ['Variable names are case-sensitive.', 'Use meaningful names.', 'Python uses dynamic typing.'] }); }
}

const QUIZ: Quiz = { id: 'python-basics', title: 'Python Basics', questions: [
  { id: 1, text: 'What will be the output of the following code?', code: 'x = 5\nx += 3\nprint(x)', options: ['3', '5', '8', '53'], answer: 2 },
  { id: 2, text: 'Which of these is a valid variable name?', options: ['2cool', 'my_age', 'my-age', 'class'], answer: 1 },
  { id: 3, text: 'What type is the value 3.14?', options: ['int', 'str', 'float', 'bool'], answer: 2 }] };

@Injectable() export class MockQuizApi extends QuizPort {
  get() { return lag(QUIZ); }
  submit(_: string, answers: Record<number, number>) {   // grading belongs to the backend; mocked here
    const correct = QUIZ.questions.filter(q => answers[q.id] === q.answer).length;
    return lag({ correct, total: QUIZ.questions.length, score: Math.round(100 * correct / QUIZ.questions.length) }); }
}

@Injectable() export class MockMistakeApi extends MistakePort {
  list() { return lag([
    { id: 1, title: 'Using = instead of == in condition', topic: 'Control Flow', when: '2 days ago', difficulty: 'Medium' as const },
    { id: 2, title: 'Off-by-one error in loop', topic: 'Loops', when: '3 days ago', difficulty: 'Easy' as const },
    { id: 3, title: 'Wrong variable scope', topic: 'Functions', when: '5 days ago', difficulty: 'Medium' as const },
    { id: 4, title: 'Forgetting to handle edge cases', topic: 'Arrays', when: '1 week ago', difficulty: 'Hard' as const }]); }
}

@Injectable() export class MockProblemApi extends ProblemPort {
  list() { const u = 'https://codeforces.com/problemset/problem/';
    return lag([
    { id: 'A', name: 'Helpful Maths', rating: 800, difficulty: 'Easy' as const, solved: true, url: u + '339/A' },
    { id: 'B', name: 'Opposite Direction', rating: 900, difficulty: 'Easy' as const, solved: false, url: u + '1766/A' },
    { id: 'C', name: 'Polycarp and Divisors', rating: 1200, difficulty: 'Medium' as const, solved: false, url: u + '1759/B' },
    { id: 'D', name: 'Game with Sticks', rating: 1300, difficulty: 'Medium' as const, solved: false, url: u + '451/A' },
    { id: 'E', name: 'Two Permutations', rating: 1700, difficulty: 'Hard' as const, solved: false, url: u + '1552/A' }]); }
}
