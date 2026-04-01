# Aurora Roastery

Aurora Roastery is a production-ready Next.js coffee storefront with Prisma, Neon PostgreSQL, NextAuth, rewards, admin tools, and AI-guided recommendations.

## Required Project Files

Keep these in the repository:

- `src/`
- `public/`
- `prisma/`
- `.env.example`
- `.gitignore`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `prisma.config.ts`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `eslint.config.mjs`
- `tsconfig.json`
- `README.md`

Do not upload your real `.env` file.

## Environment Variables

Create a local `.env` file from `.env.example`.

Local development:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/neondb?sslmode=verify-full&channel_binding=require"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Production on Vercel:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/neondb?sslmode=verify-full&channel_binding=require"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="https://your-project-name.vercel.app"
```

## Start Here First

Before uploading anything:

1. make sure the app works locally
2. make sure `.env` is not being committed
3. run a production build successfully

Commands:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Then test the production build:

```bash
npm run build
```

## First Time GitHub Upload

If you have never pushed this project to GitHub before, follow these steps in order.

### 1. Open terminal in the project folder

```bash
cd aurora-roastery
```

### 2. Check whether Git is already initialized

```bash
git status
```

If Git says this is not a repository, run:

```bash
git init
```

Then run:

```bash
git status
```

### 3. Make sure `.env` is not included

Run:

```bash
git status
```

If `.env` appears in the list, stop and fix `.gitignore` first.

### 4. Create your first commit

```bash
git add -A
git commit -m "Production-ready for Vercel"
```

### 5. Create the GitHub repository

Go to GitHub and do this:

1. sign in
2. click `New repository`
3. enter the repository name
4. do not add README, `.gitignore`, or license there if your local project already has files
5. click `Create repository`

### 6. Connect local project to GitHub

Copy your GitHub repository URL, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

If Git says `origin` already exists, use:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### 7. Push the project to GitHub

```bash
git branch -M main
git push -u origin main
```

After this, your project is on GitHub.

## Import GitHub Project Into Vercel

After pushing to GitHub:

1. open [https://vercel.com](https://vercel.com)
2. sign in with GitHub
3. click `Add New...`
4. click `Project`
5. choose your repository
6. click `Import`

Vercel should auto-detect:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`

Leave output directory empty.

## Add Environment Variables In Vercel

In the Vercel project settings, add:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Use:

- `DATABASE_URL` = your Neon connection string
- `NEXTAUTH_SECRET` = your production secret
- `NEXTAUTH_URL` = your Vercel domain

Example:

```text
https://aurora-roastery.vercel.app
```

## Deploy On Vercel

After adding environment variables:

1. click `Deploy`
2. wait for the build to finish
3. open the live URL

## What To Test After Deployment

Check:

- homepage loads
- navbar works
- menu filters work
- locations page works
- rewards page works
- AI guide works
- login works
- checkout works
- profile works
- admin dashboard works
- admin products works
- admin users works
- admin orders works

Also test:

- `/api/stores`
- `/api/auth/session`
- `/api/admin/stats` after admin login

## Later Updates After GitHub Upload

If you change code later and want to update GitHub:

### 1. Check changed files

```bash
git status
```

### 2. Add changes

```bash
git add -A
```

### 3. Commit changes

```bash
git commit -m "your update message"
```

Example:

```bash
git commit -m "Fix admin users and menu filters"
```

### 4. Push changes to GitHub

```bash
git push origin main
```

If Vercel is connected to GitHub, it will usually redeploy automatically.

## If Vercel Does Not Update Automatically

Go to Vercel:

1. open your project
2. open `Deployments`
3. click the latest deployment
4. click `Redeploy`

## Useful Git Commands

First-time setup:

```bash
git init
git add -A
git commit -m "Production-ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Later updates:

```bash
git status
git add -A
git commit -m "your update message"
git push origin main
```

Check remote:

```bash
git remote -v
```

## Important Notes

- never commit `.env`
- keep Neon credentials only in `.env` and Vercel settings
- use `sslmode=verify-full` in `DATABASE_URL`
- use `http://localhost:3000` only for local `NEXTAUTH_URL`
- use your Vercel domain for production `NEXTAUTH_URL`
- if you rotate the Neon password, update both local `.env` and Vercel settings

## Recommended Safe Order

1. finish local changes
2. test locally
3. run `npm run build`
4. commit locally
5. push to GitHub
6. import to Vercel
7. add env vars
8. deploy
9. test the live site
