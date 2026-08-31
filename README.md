# Weeb Frontend

A React single-page application for Weeb — an article platform with authentication (classic and GitHub OAuth), a personal profile with a satisfaction/recommendation history, and a contact form. It consumes the [Weeb Backend](https://github.com/mylenasayumi/weeb-backend) REST API.

[![Run Frontend Tests](https://github.com/PierreSaumet/DST-P1/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/PierreSaumet/DST-P1/actions/workflows/frontend-tests.yml)

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP client**: Axios
- **Animations**: Framer Motion
- **Markdown rendering**: react-markdown
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
- **Linting/Formatting**: ESLint + Prettier (with `prettier-plugin-tailwindcss`)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (20+)
- [npm](https://www.npmjs.com/)
- A running instance of the [Weeb Backend](https://github.com/mylenasayumi/weeb-backend) (or a reachable API URL)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PierreSaumet/DST-P1.git weeb-frontend
   cd weeb-frontend/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_GITHUB_CALL=http://127.0.0.1:8000/api/auth/github/
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app is served at `http://localhost:5173` by default.

## 🎯 Usage / Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run test` | Run the test suite once |
| `npm run test:coverage` | Run the test suite with a coverage report |

### Running a subset of tests

```bash
# A single file
npm run test -- src/__tests__/pages/ErrorPage.test.jsx

# All tests in a folder
npm run test -- src/__tests__/pages/

# Tests matching a name, with coverage
npm run test:coverage -- -t "calls login with email and password on form submit"
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components, grouped by feature
│   │   ├── Article/
│   │   ├── Contact/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── MotionAnimation/
│   │   ├── Profile/
│   │   ├── ResetPassword/
│   │   ├── Signup/
│   │   ├── ToggleMode/
│   │   ├── UserContext.jsx
│   │   └── LanguageContext.jsx
│   ├── pages/           # Route-level views (Home, Articles, Login, Profile, ...)
│   ├── assets/          # Static assets
│   └── __tests__/       # Vitest test suites, mirroring the src structure
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
└── .env.example
```

## 🧪 Testing & CI

Tests run automatically on every push and pull request via [GitHub Actions](.github/workflows/frontend-tests.yml). Run them locally with:

```bash
npm run test:coverage
```

## 👨‍💻 Development Workflow

### Git Workflow

1. **Create an Issue**
   - Add a clear description
   - Include images or links if necessary
   - Use appropriate labels

2. **Branch Naming Convention**
   ```
   <type>/<scope>
   ```

   **Examples:**
   - `fix/login-redirect`
   - `feat/articles-pagination`
   - `refactor/user-context`

   **Types:**
   - `fix`: Bug fixes
   - `feat`: New features
   - `refactor`: Code refactoring
   - `docs`: Documentation updates

3. **Pull Request Guidelines**
   - Link related issue(s)
   - Provide a clear description of changes
   - Include tests for new features/fixes
   - Ensure all tests and lint checks pass
   - Require approval before merging

## 📚 Documentation

- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/
- Framer Motion: https://www.framer.com/motion/
- Lucide React: https://lucide.dev/guide/packages/lucide-react
- Vitest: https://vitest.dev/
- Prettier: https://prettier.io/docs/configuration

## 🔗 Backend

This frontend expects the [Weeb Backend](https://github.com/mylenasayumi/weeb-backend) API to be running and reachable at `VITE_API_URL`.

## 🤝 Contributing

Contributions are welcome! Please follow the development workflow outlined above.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: Remember to keep your `.env` file secure and never commit it to version control.
