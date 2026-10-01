export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export interface Stat { label: string; value: number; total?: number; suffix?: string; icon: string; tone: string }
export interface PlanStep { title: string; detail: string; status: 'done' | 'active' | 'locked'; link?: string }
export interface Goal { text: string; done: boolean }
export interface Activity { text: string; when: string; icon: string; tone: string }
export interface Dashboard { name: string; level: string; xp: number; xpMax: number; stats: Stat[]; plan: PlanStep[]; goals: Goal[]; activity: Activity[] }
export interface Lesson { id: string; title: string; theory: string; code: string; keyPoints: string[]; quizId: string }
export interface Question { id: number; text: string; code?: string; options: string[]; answer: number }
export interface Quiz { id: string; title: string; questions: Question[] }
export interface QuizResult { score: number; correct: number; total: number }
export interface Mistake { id: number; title: string; topic: string; when: string; difficulty: Difficulty }
export interface Problem { id: string; name: string; rating: number; difficulty: Difficulty; solved: boolean; url: string }
