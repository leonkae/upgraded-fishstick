# Contributing to This Project

Thank you for considering contributing! 🚀  
To ensure a smooth and consistent workflow across all contributors, please follow the guidelines below.

## 📦 Project Structure

This project is a monorepo with the following structure:

```
├── client/   # Next.js frontend (TypeScript + TailwindCSS v4)
├── server/   # Express backend (TypeScript)
```

## 🛠 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (LTS recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [Prettier](https://prettier.io/) (already configured in this repo)

## 🚀 Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <project-directory>
   ```

2. Install dependencies from the root (monorepo-aware):

   Note: You should only ever run the install command from the root folder of the project, and not from the individual client and/or server folders.

   ```bash
   npm install
   ```

3. Husky and `lint-staged` are already configured to run Prettier on staged files before every commit.

## 💅 Code Formatting

This project uses **Prettier** to automatically format code. The rules are defined in `.prettierrc`, and directories/files to ignore are in `.prettierignore`.

### 📜 Formatting Scripts

You can use the following scripts from the root:

- **Format all files**

  ```bash
  npm run format
  ```

- **Check for unformatted files**

  ```bash
  npm run format:check
  ```

These scripts run Prettier recursively in both `client/` and `server/`.

## ✅ Commit Workflow

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to enforce formatting.

On every commit:

- Only staged files will be checked and formatted using Prettier.
- If formatting changes are made, the commit will be updated automatically.

You don’t need to manually run `prettier` before committing — the hook takes care of it.

## 🌍 Line Endings

To ensure consistent line endings across all platforms:

- All files are forced to use **LF** endings (even on Windows)
- This is enforced via `.gitattributes`
