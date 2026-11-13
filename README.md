# Vemure-Homebrew-Backend

Sebuah RESTful API backend yang dibuat dengan [NestJS](https://nestjs.com/) for managing data modul GURPS (skill dan trait) untuk dikirim kepada vemure-homebrew-react sebagai frontend. API ini dapat mengirim, mengubah, mengunggah, dan menghapus data, walaupun masih bersifat sementara pada array memory

Langkah selanjutnya:
* Menghubungkan dengan database PostgreSQL


---

## Tech Stack & Architecture

- **Framework**: [NestJS 12](https://nestjs.com/) (Node.js framework)
- **Module System**: Pure ECMAScript Modules (ESM with `.js` import extensions and top-level `await`)
- **Validation & Transformation**: `class-validator`, `class-transformer`, and `@nestjs/mapped-types`
- **Testing**: [Vitest](https://vitest.dev/)
- **Linter**: [oxlint](https://oxc.rs/)
- **Runtime Persistence**: In-memory array store initialized on application startup from JSON seeds

---

## Project Structure

```text
vemure-homebrew-backend/
├── src/
│   ├── data/
│   │   ├── gurps_skills.json      # Seed data for GURPS skills
│   │   └── gurps_traits.json      # Seed data for GURPS traits
│   ├── skills/
│   │   ├── dto/
│   │   │   ├── create-skill.dto.ts # Validation rules for creating a skill
│   │   │   └── update-skill.dto.ts # Partial type for updating a skill
│   │   ├── entities/
│   │   │   └── skill.entity.ts     # Skill domain entity
│   │   ├── skills.controller.ts    # HTTP route handlers for /skills
│   │   ├── skills.module.ts        # Skills module declaration
│   │   └── skills.service.ts       # Business logic & in-memory CRUD operations
│   ├── traits/
│   │   ├── dto/
│   │   │   ├── create-trait.dto.ts # Validation rules for creating a trait
│   │   │   └── update-trait.dto.ts # Partial type for updating a trait
│   │   ├── trait.entity.ts         # Trait domain entity
│   │   ├── traits.controller.ts    # HTTP route handlers for /traits
│   │   ├── traits.module.ts        # Traits module declaration
│   │   └── traits.service.ts       # Business logic & in-memory CRUD operations
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts                     # Application entry point with global ValidationPipe
├── package.json
└── README.md
```

---

## Data Models

### 1. Skill
| Field | Type | Description / Validation |
|---|---|---|
| `id` | `number` | Unique identifier (auto-incremented `max(id) + 1`) |
| `skill_name` | `string` | Unique name (case-insensitive check, 2–60 characters) |
| `attribute` | `string` | Base governing attribute: `ST`, `DX`, `IQ`, `HT`, `Per`, or `Will` |
| `difficulty` | `string` | Difficulty level: `Easy`, `Average`, `Hard`, or `Very Hard` |
| `notes` | `string` | Optional description or notes (max 200 characters, default: `""`) |
| `requires_specialization` | `boolean` | Optional flag indicating specialization requirement (default: `false`) |

### 2. Trait
| Field | Type | Description / Validation |
|---|---|---|
| `id` | `number` | Unique identifier (auto-incremented `max(id) + 1`) |
| `trait_name` | `string` | Unique name (case-insensitive check, 2–80 characters) |
| `type` | `string` | Classification: `Physical`, `Mental`, or `Social` |
| `category` | `string` | Category: `advantage`, `disadvantage`, or `quirk` |
| `notes` | `string` | Optional description or notes (max 200 characters, default: `""`) |
| `is_custom` | `boolean` | Server-managed flag (`false` for seed data, `true` for newly created traits) |

---

## API Endpoints

### Skills (`/skills`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/skills` | Retrieve all skills |
| `GET` | `/skills/:id` | Retrieve a skill by numeric ID (`404` if not found) |
| `POST` | `/skills` | Create a new skill (`400` on validation error, `409` on duplicate name) |
| `PATCH` | `/skills/:id` | Update an existing skill partially (`404` if not found, `409` on name conflict) |
| `DELETE` | `/skills/:id` | Remove a skill by ID (`404` if not found) |

#### Example: Create Skill (`POST /skills`)
```json
{
  "skill_name": "Tactics",
  "attribute": "IQ",
  "difficulty": "Hard",
  "notes": "Military planning and tactical maneuver strategy",
  "requires_specialization": false
}
```

#### Example: Update Skill (`PATCH /skills/1`)
```json
{
  "notes": "Updated notes with specialized training details"
}
```

---

### Traits (`/traits`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/traits` | Retrieve all traits |
| `GET` | `/traits?category_eq={category}` | Filter traits by category (`advantage`, `disadvantage`, `quirk`) |
| `GET` | `/traits/:id` | Retrieve a trait by numeric ID (`404` if not found) |
| `POST` | `/traits` | Create a new custom trait (`400` on validation error, `409` on duplicate name) |
| `PATCH` | `/traits/:id` | Update an existing trait partially (`404` if not found, `409` on name conflict) |
| `DELETE` | `/traits/:id` | Remove a trait by ID (`404` if not found) |

#### Example: Create Trait (`POST /traits`)
```json
{
  "trait_name": "Night Vision",
  "type": "Physical",
  "category": "advantage",
  "notes": "Can see normally in dim or dark environments"
}
```

#### Example: Update Trait (`PATCH /traits/1`)
```json
{
  "notes": "Updated description for this trait"
}
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Standard run
npm run start

# Production build and run
npm run build
npm run start:prod
```

By default, the server runs on `http://localhost:3001` (or the port defined by `process.env.PORT`) with CORS enabled for `http://localhost:5173`.

---

## Testing & Quality Assurance

```bash
# Run unit tests via Vitest
npm test

# Run code linter via oxlint
npm run lint

# Build verification
npm run build
```
