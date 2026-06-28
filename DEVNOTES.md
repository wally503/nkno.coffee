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

## Add New DB App

### Creating the app
```bash
(If not in venv already)
source venv/bin/activate

cd backend
python manage.py startapp brew
```

Then register in `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'brew',
]
```

### Migrations (brew app only)
```bash
python manage.py makemigrations brew
python manage.py migrate
```

### App structure
```
brew/
├── models.py        # all brew models
├── serializers.py
├── views.py
├── urls.py
└── admin.py
```

Register URLs in `backend/urls.py`:
```python
path('api/brew/', include('brew.urls')),
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


## Docker Reference

### Starting & Stopping

| Command | Description |
|---|---|
| `docker-compose up` | Start all services |
| `docker-compose down` | Stop and remove containers |
| `docker-compose up --build` | Rebuild images then start (after Dockerfile changes) |
| `docker-compose up --build backend` | Rebuild only backend |
| `docker-compose up --build frontend` | Rebuild only frontend |
| `docker-compose up -d` | Start detached (background) |

### Viewing Logs

| Command | Description |
|---|---|
| `docker-compose logs -f` | Follow all services live |
| `docker-compose logs -f backend` | Follow backend only |
| `docker-compose logs -f frontend` | Follow frontend only |

### Attaching to a Running Container

| Command | Description |
|---|---|
| `docker-compose exec backend bash` | Shell into backend |
| `docker-compose exec frontend sh` | Shell into frontend (slim uses `sh` not `bash`) |

### After PC Sleep/Wake

Containers resume automatically via `restart: unless-stopped`. If something dropped:

```bash
docker-compose ps       # check what's running
docker-compose up -d    # restart detached if needed
\```

### Key Pointers

| What | Where |
|---|---|
| Django API URL (Vite proxy) | `frontend/vite.config.js` → `proxy: { '/api': 'http://backend:8000' }` |
| Vite host binding | `frontend/Dockerfile` → `CMD` flag `--host 0.0.0.0` |
| Django bind address | `backend/Dockerfile` → `CMD` arg `0.0.0.0:8000` |
| Port mappings | `docker-compose.yml` → `ports` under each service |
```