---
trigger: always_on
---

 ```markdown
Vibe Coding Workflow Guide - AI-Assisted Development Best Practices
🎯 Purpose
Complete guide for auditing AI-generated projects, identifying common patterns, fixing issues, and maintaining code quality during rapid development cycles.

🤖 1. What is Vibe Coding?
Definition
Vibe Coding (AI-assisted/prompt-driven development) uses AI tools (ChatGPT, Claude, Copilot, v0.dev, Bolt, Lovable) to generate code through natural language.
Common Characteristics
✅ Rapid prototyping - MVP in hours
⚠️ Inconsistent patterns, duplicate code, over-engineering, outdated practices
✅ Good starting point - Working code quickly
Popular AI Coding Tools (2025)
| Tool | Type | Best For | Output Quality |
|------|------|----------|----------------|
| v0.dev | UI Generator | shadcn/ui components | High |
| Bolt.new | Full-stack | Complete apps | Medium |
| Lovable.dev | Full-stack | Production apps | High |
| Claude Artifacts | Components | React components | Medium-High |
| GitHub Copilot | IDE Assistant | Code completion | Variable |
| Cursor | IDE | Full file generation | High |
| Codeium | IDE Assistant | Free Copilot alternative | Medium |

📋 2. Vibe Coding Audit Workflow
2.1 Initial Assessment (30 min)
Step 1: Project Structure Analysis
```bash
tree -I 'node_modules|.next|dist' -L 3 > structure.txt
find . -type f -name "*.tsx" | wc -l
find . -type f -name "*.ts" | wc -l
```
Questions:
- [ ] Clear folder structure?
- [ ] Components organized by feature/type?
- [ ] Duplicate files?
- [ ] Tests folder?
- [ ] TypeScript used properly?

Step 2: Dependency Analysis
```bash
cat package.json | jq '.dependencies'
npm outdated
npm audit
```
Red Flags:
- [ ] Unused dependencies (>30%)
- [ ] Duplicate packages (lodash + lodash-es)
- [ ] Critical vulnerabilities
- [ ] Large bundle size
- [ ] Missing peer dependencies

Step 3: Code Quality Quick Scan
```bash
npx eslint . --ext .ts,.tsx
npx tsc --noEmit
grep -r "TODO\|FIXME" src/ | wc -l
```

2.2 Deep Dive Categories
2.2.1 Component Reusability
Audit Script (analyze-duplicates.js):
```javascript
const fs = require('fs');
const path = require('path');

function findDuplicates(dir) {
  const components = {};
  function walk(directory) {
    fs.readdirSync(directory).forEach(file => {
      const filepath = path.join(directory, file);
      if (fs.statSync(filepath).isDirectory()) walk(filepath);
      else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const name = file.replace(/\.(tsx|jsx)$/, '');
        components[name] = (components[name] || []).concat(filepath);
      }
    });
  }
  walk(dir);
  Object.entries(components).forEach(([name, files]) => {
    if (files.length > 1) console.log(`Duplicate: ${name}\n${files.join('\n')}`);
  });
}
findDuplicates('./src');
```

Checklist:
- [ ] No duplicate components
- [ ] Proper prop interfaces
- [ ] Composition over duplication
- [ ] Generic naming

Example Refactor:
```typescript
// ❌ BAD: Three separate buttons
function PrimaryButton() { return <button className="bg-blue-500">Click</button> }
function SecondaryButton() { return <button className="bg-gray-500">Click</button> }

// ✅ GOOD: Reusable component
type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600',
  };
  return (
    <button className={`${variants[variant]} px-4 py-2 rounded text-white`} onClick={onClick}>
      {children}
    </button>
  );
}
```

2.2.2 State Management Audit
Common Issues:
- Over-using useState
- Prop drilling (5+ levels)
- No server/client state separation
- Global state for local concerns

Audit Script:
```bash
grep -r "useState" src/ | wc -l
grep -r "interface.*Props" src/ -A 20 | grep -E "^\s+\w+:" | wc -l
```

Refactor Strategy:
```typescript
// ❌ BAD: Prop drilling
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} setUser={setUser} />;
}

// ✅ GOOD: Zustand store
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Usage anywhere
function UserMenu() {
  const { user, setUser } = useUserStore();
}
```

2.2.3 Styling Consistency Audit
Check Anti-Patterns:
```bash
grep -r "style={{" src/ | wc -l
grep -r "w-\[.*px\]" src/
grep -r "bg-\|text-" src/ | sort | uniq -c
```

Issues to Flag:
- [ ] Inconsistent colors (10+ shades of blue)
- [ ] Magic numbers in Tailwind
- [ ] Mixed methodologies (Tailwind + styled-components)
- [ ] No CSS variables
- [ ] Heavy inline styles

Standardization:
```css
/* styles/design-tokens.css */
:root {
  --color-primary-500: #3b82f6;
  --color-background: #ffffff;
  --color-success: #10b981;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { 500: 'var(--color-primary-500)' },
        background: 'var(--color-background)',
      }
    }
  }
}
```

2.2.4 API Integration Audit
Common Mistakes:
- Fetching without caching
- No loading/error states
- Exposed API keys
- No request deduplication

Audit:
```bash
grep -r "fetch(" src/
grep -r "axios\." src/
grep -r "api_key\|apiKey\|API_KEY" src/
```

Red Flags:
- [ ] fetch() in component bodies
- [ ] No try-catch blocks
- [ ] Hardcoded endpoints
- [ ] No loading indicators
- [ ] Client-side token management

Best Practice:
```typescript
// ✅ GOOD: TanStack Query
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user.name}</div>;
}

// lib/api-client.ts
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
  async get<T>(endpoint: string) { return this.request<T>(endpoint); }
  async post<T>(endpoint: string, data: unknown) { 
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }); 
  }
}
export const api = new ApiClient();
```

🔧 3. Automated Audit Tools
3.1 Setup Linting & Formatting
```bash
npm install -D eslint prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

.eslintrc.json:
```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

.prettierrc:
```json
{ "semi": true, "trailingComma": "es5", "singleQuote": true, "printWidth": 80, "tabWidth": 2 }
```

package.json scripts:
```json
"lint": "eslint . --ext .ts,.tsx", "lint:fix": "eslint . --ext .ts,.tsx --fix", "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
```

3.2 Code Quality Analysis
```bash
npm install -D sonarqube-scanner
# sonar-project.properties
# sonar.projectKey=my-vibe-project
# sonar.sources=src
npx sonar-scanner
```

3.3 Bundle Size Analysis
```bash
npm install -D @next/bundle-analyzer
# next.config.js: const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
ANALYZE=true npm run build
```

3.4 Accessibility Testing
```bash
npm install -D @axe-core/react eslint-plugin-jsx-a11y
# Add to _app.tsx: if (process.env.NODE_ENV !== 'production') import('@axe-core/react').then(axe => axe.default(React, ReactDOM, 1000));
```

📊 4. Performance Optimization
4.1 Common Issues
```bash
find src/ -name "*.tsx" -exec wc -l {} \; | sort -rn | head -10
grep -L "React.memo\|memo(" src/**/*.tsx
npm install -D @welldone-software/why-did-you-render
```

4.2 Quick Wins
1. React.memo for Pure Components
```typescript
export const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{/* complex rendering */}</div>;
});
```

2. Lazy Loading
```typescript
const Dashboard = lazy(() => import('./Dashboard'));
<Suspense fallback={<Spinner />}><Dashboard /></Suspense>
```

3. Optimize Images
```typescript
import Image from 'next/image';
<Image src="/large-image.jpg" alt="Hero" width={800} height={600} quality={75} loading="lazy" />
```

4. useCallback for Event Handlers
```typescript
const handleDelete = useCallback((id) => deleteTodo(id), []);
```

🎯 5. Vibe Coding Best Practices
5.1 Prompting Strategies
✅ Good: "Create reusable Button component in TypeScript with variants (primary, secondary, danger) using Tailwind"
❌ Bad: "Make a button", "Create everything for a todo app", "Fix this code"

5.2 Iterative Refinement
1. Generate with AI
2. Run linter
3. Fix type errors
4. Test in browser
5. Refine prompt
6. Extract reusable parts

5.3 Documentation
```bash
npm install -D typedoc
npx typedoc --out docs src/
npx sb init # Storybook
```

✅ 6. Audit Completion Checklist
Pre-Audit (1h)
- [ ] Clone repo, npm install, npm run dev
- [ ] Review package.json, env vars, npm audit

Code Quality (2-3h)
- [ ] ESLint setup, TypeScript strict mode
- [ ] Identify duplicates, review state management
- [ ] Error handling, API best practices

Performance (1-2h)
- [ ] Lighthouse audit, bundle size check
- [ ] Add React.memo, optimize images, lazy loading

Security (1h)
- [ ] No API keys in code, .env in .gitignore
- [ ] Auth implementation, input validation, CORS

Styling (1h)
- [ ] Consistency check, design tokens
- [ ] Responsive design, dark mode

Testing (2h)
- [ ] Testing framework, critical path tests
- [ ] Integration tests, error scenarios

Documentation (1h)
- [ ] README, env docs, inline comments
- [ ] Component docs, API endpoints

Final Report Template:
```markdown
# Vibe Coding Audit Report
**Project**: [Name] | **Date**: [Date] | **Auditor**: [Name]

## Executive Summary
[2-3 sentences]

## Metrics
- Files: X | TypeScript: X% | Test: X% | Bundle: X MB | Lighthouse: X/100

## Critical Issues
1. [Issue]

## High Priority
1. [Improvement]

## Technical Debt
1. [Debt]

## Recommendations
1. [Rec]

## Est. Refactor Time
- Critical: Xh | High: Xh | Debt: Xh
```

📚 7. Resources & Tools
AI Tools: v0.dev, bolt.new, lovable.dev, cursor.sh
Quality: ESLint, Prettier, SonarQube
Performance: Lighthouse, webpack-bundle-analyzer, React DevTools
Learning: reactpatterns.com, typescriptlang.org, web.dev
```