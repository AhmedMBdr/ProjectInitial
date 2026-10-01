# BaccaCode Web (Angular)
`npm install && npm start` → http://localhost:4200

Architecture: `core/` (models + small ports = abstractions) · `mock/` (swappable implementations) · `shared/` (loading/error helpers) · `features/` (one page per responsibility).
To connect the ASP.NET API: create `HttpQuizApi extends QuizPort` etc. and change the providers in `app.config.ts` only.
