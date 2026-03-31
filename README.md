# Marketplace Monorepo

This repository is a frontend monorepo for a marketplace platform built with **pnpm workspaces**, **Turborepo**, **Vite**, **React**, **TypeScript**, and **Tailwind CSS**.

It contains three separate frontend applications:

/// /// ///

* **users** — customer-facing storefront
* **sellers** — seller dashboard and product/order management
* **admin** — platform administration panel

It also contains shared packages for reusable code:

* **@repo/ui** — shared UI components
* **@repo/types** — shared TypeScript types
* **@repo/api** — shared API utilities
* **@repo/tsconfig** — shared TypeScript configuration

## Project structure

```txt
marketplace-monorepo/
  apps/
    admin/
    sellers/
    users/
  packages/
    api/
    tsconfig/
    types/
    ui/
  package.json
  pnpm-workspace.yaml
  turbo.json
```

## Tech stack

* **pnpm** for package management and workspace linking
* **Turborepo** for running tasks across apps/packages
* **Vite** for app bundling and development server
* **React** for UI
* **TypeScript** for type safety
* **Tailwind CSS** for styling

## Requirements

Before running this project, install:

* **Node.js** 20+
* **pnpm** 10+

Check versions:

```bash
node -v
pnpm -v
```

## Installation

From the repository root:

```bash
pnpm install
```

This installs dependencies for the root workspace, all apps, and all shared packages.

## Running the apps

Run one app at a time from the repository root.

### Users app

```bash
pnpm run dev --filter=@repo/users
```

### Sellers app

```bash
pnpm run dev --filter=@repo/sellers
```

### Admin app

```bash
pnpm run dev --filter=@repo/admin
```

You can also use the explicit Turbo command:

```bash
pnpm exec turbo run dev --filter=@repo/users
pnpm exec turbo run dev --filter=@repo/sellers
pnpm exec turbo run dev --filter=@repo/admin
```

## Building the apps

Build all apps and packages from the root:

```bash
pnpm run build
```

Build only one app:

```bash
pnpm exec turbo run build --filter=@repo/users
pnpm exec turbo run build --filter=@repo/sellers
pnpm exec turbo run build --filter=@repo/admin
```

## Linting

Run lint for all workspaces:

```bash
pnpm run lint
```

Run lint for a single app:

```bash
pnpm exec turbo run lint --filter=@repo/users
pnpm exec turbo run lint --filter=@repo/sellers
pnpm exec turbo run lint --filter=@repo/admin
```

## Shared packages

### `@repo/ui`

Reusable UI components shared by all apps.

### `@repo/types`

Shared TypeScript interfaces and types.

### `@repo/api`

Shared API client and API-related utilities.

### `@repo/tsconfig`

Shared TypeScript base config for consistent compiler settings.

## Adding dependencies

### Add a dependency to one app

Example for users app:

```bash
pnpm add package-name --filter=@repo/users
```

### Add a dev dependency to one app

```bash
pnpm add -D package-name --filter=@repo/users
```

### Add a dependency to all three apps

```bash
pnpm add package-name --filter=@repo/users --filter=@repo/sellers --filter=@repo/admin
```

### Add a dependency to a shared package

```bash
pnpm add package-name --filter=@repo/ui
pnpm add package-name --filter=@repo/api
pnpm add package-name --filter=@repo/types
```

### Add a local workspace package to apps

```bash
pnpm add @repo/ui@workspace:* @repo/types@workspace:* @repo/api@workspace:* --filter=@repo/users --filter=@repo/sellers --filter=@repo/admin
```

## Notes

* Always run workspace commands from the **monorepo root**.
* Do not create this monorepo inside another React project folder.
* When adding local packages like `@repo/ui`, use the **workspace protocol** when needed.
* If one app fails to start because of dependency issues, run:

```bash
pnpm install
```

from the root again.

## Current goal

This monorepo is intended to support a marketplace with:

* a customer storefront
* a seller management dashboard
* an admin control panel

with shared code and scalable frontend architecture.
