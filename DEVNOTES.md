# nkno.coffee — Dev Notes

## Startup

### Backend (Terminal 1)
```bash
cd backend
source venv/bin/activate   # or: . venv/bin/activate
python manage.py runserver
```
- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/swagger

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
- Runs on: http://127.0.0.1:5173

```bash
deactivate   # when done with venv
```

---

## Fresh Clone / Rebuilding Dependencies

### Python (from `backend/`)
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node (from `frontend/`)
```bash
npm install
```

---

## Migrations

### Django (venv must be active, from `backend/`)
```bash
python manage.py makemigrations          # all apps
python manage.py makemigrations coffee   # coffee app only
python manage.py migrate
```

### EF Core equivalent
```bash
dotnet ef migrations add Init
dotnet ef database update
```

---

## SQLite

```bash
cd backend
sqlite3 db.sqlite3
.tables
```

### Schema inspection
```sql
.schema coffee_bean
PRAGMA table_info(coffee_beans);
```

### Cleaner table view
```sql
.headers on
.mode column
```

### Example insert
```sql
INSERT INTO beans (name, origin_country)
  VALUES
    ('Kochere', 'Ethiopia'),
    ('Gedeb', 'Ethiopia'),
    ('Aricha', 'Ethiopia');
```

---

## Environment / Config

```bash
cp .env.example .env   # then fill in values
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL — e.g. `http://localhost:8000/api/` |
| `VITE_DEV_BYPASS` | Set `true` to skip auth check in dev |

Vite loads `.env.{mode}` based on run mode:
```bash
npm run dev              # loads .env.development (falls back to .env)
npm run dev --mode foo   # loads .env.foo
```

### First time setup
```bash
python manage.py createsuperuser
```

---

## Auth Notes

JWT stored as **httpOnly cookies** — set by Django, invisible to JS.

- **Access token**: short-lived (5 min default)
- **Refresh token**: longer-lived, blacklisted on logout

CORS must specify origin (not wildcard) when using `withCredentials`:
```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
CORS_ALLOW_CREDENTIALS = True
```

### Insomnia endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `api/auth/login/` | Sets cookies |
| `GET` | `api/auth/valid/` | Checks access token |
| `POST` | `api/auth/logout/` | Clears cookies + blacklists refresh token |

---

## NPM / Dependency Maintenance

```bash
npm audit           # see what's flagged
npm audit fix       # auto-fix semver-safe ones
```

### Bump direct deps manually if needed
```bash
npm install vite@latest
npm install react-router@latest
npm install rollup@latest
```

**Last resolved:** March 2026
- Cleared all Dependabot alerts (rollup, vite, react-router, cross-spawn, nanoid, micromatch, esbuild, babel, etc.)
- High severity hits: rollup, cross-spawn, minimatch, @remix-run/router

---

## Mental Models / Examples

### Bean shape
```js
const beanExample = {
  id: 1,                         // DB primary key (server side)
  bean_name: "House Blend",      // text input
  roaster_id: 2,                 // foreign key -> roaster table
  country_id: 3,                 // foreign key -> country table
  roast_level: "medium",         // enum: "light" | "light_medium" | ...
  is_organic: true,              // true / false
  process: "washed",             // "washed" | "natural"
  is_caffeinated: true,          // true / false
  flavor_notes: [                // tags from the dynamic dropdown
    "chocolate",
    "berry",
    "citrus"
  ]
};
```
