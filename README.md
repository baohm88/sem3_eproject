# 📺 Project Videos

- **Setup BE + DB + FE (walkthrough):** https://youtu.be/o3eC58XRVAg
- **Data flow + feature tour:** https://youtu.be/e5jnlMyIe3s
# Setup Guide – Backend (API) + Frontend (React)

> Project: **sem3_eproject**  
> Duration to follow: ~15–30 minutes

---

## 0) Prerequisites

Install these tools first:

- **Git**
- **Node.js 18+** and **npm**
- **.NET SDK 8.0+**
- **MySQL Server 8.0+** and (optional) **MySQL Workbench**
- (Optional) VS Code / Rider, Postman/Insomnia
- (Optional) EF Core CLI:  
  ```bash
  dotnet tool install -g dotnet-ef
  ```

> **Ports used**
> - API (Kestrel): `http://localhost:5000`
> - Frontend (Vite): `http://localhost:3000`

---

## 1) Git clone

```bash
# clone
git clone <your-repo-url> sem3_eproject
cd sem3_eproject

# repo structure (key folders)
# ├─ backend/
# │  └─ Api/                  # ASP.NET Core Web API
# ├─ frontend/                # React + Vite app
# └─ db.sql                   # DB schema + dummy data (ready to import)
# └─ README.md                # BE, DB, & FE setup guidelines
# └─ eProject Report.docx     # eProject Report.docx
```

---

## 2) DB setup (MySQL)

### A. Install MySQL

**Windows**
1. Download **MySQL Installer** from mysql.com.
2. Select: *MySQL Server 8.0* and (optional) *MySQL Workbench*.
3. Finish setup and note your **root** password.

**macOS**
```bash
# with Homebrew
brew install mysql
brew services start mysql
# optional hardening
mysql_secure_installation

# optional Workbench
brew install --cask mysqlworkbench
```

### B. Create schema + seed data using `db.sql` (recommended)

You already have `db.sql` in the repo. Just import it and you're done:

**Using MySQL Workbench**
1. Open *MySQL Workbench* → connect to *Local instance*.
2. File → Open SQL Script… → choose `db.sql` from the repo.
3. Click **Run** (lightning icon).  
   It will create the database (e.g., `mvp_platform`) and insert **dummy data**.

**Using CLI**
```bash
# from the repo root (where db.sql lives)
mysql -u root -p < db.sql
```

> If you prefer a dedicated app user:
> ```sql
> CREATE USER 'mvp'@'localhost' IDENTIFIED BY 'mvp123';
> GRANT ALL PRIVILEGES ON mvp_platform.* TO 'mvp'@'localhost';
> FLUSH PRIVILEGES;
> ```

---

## 3) Backend (API) Setup

```bash
cd backend/Api

# 3.1 Create local settings from example
cp appsettings.Development.example.json appsettings.Development.json  # macOS/Linux
# PowerShell on Windows:
# copy appsettings.Development.example.json appsettings.Development.json
```

Edit `appsettings.Development.json`:
```jsonc
{
  "Jwt": { "Key": "dev-super-secret-key-change-me" },
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=mvp_platform;User Id=root;Password=YOUR_PASSWORD;TreatTinyAsBoolean=false;Allow User Variables=true;CharSet=utf8mb4;"
  },
  "Cors": { "AllowedOrigins": [ "http://localhost:3000" ] }
}
```

> **Note:** When using `db.sql`, you **do not** need to run EF migrations.  
> If you really want migrations, ensure your schema matches before running:
> ```bash
> dotnet ef database update
> ```

Build & run:
```bash
dotnet clean && dotnet restore && dotnet build
dotnet run
# API -> http://localhost:5000
# Swagger -> http://localhost:5000/swagger
```

---

## 4) Frontend (React + Vite) Setup

```bash
cd ../../frontend

# 4.1 Install deps
npm install

# 4.2 Create env file
echo 'VITE_API_BASE=http://localhost:5000' > .env.local

# 4.3 Start dev server
npm run dev
# App -> http://localhost:3000
```

---

## 5) Smoke Test (Happy Path)

1. Open `http://localhost:5000/swagger` – verify API is running.
2. Open `http://localhost:3000` – verify UI loads.
3. In Workbench, confirm DB `mvp_platform` exists with tables and sample data.
4. **Auth (mock OTP):**
   - Register via UI (or `POST /api/auth/register`).
   - Console prints an OTP (mock). Verify via `POST /api/auth/verify-otp`.
   - Login via UI.
5. Explore key flows:
   - **Company ↔ Driver**: company invites driver / approves or rejects applications; driver applies / accepts or rejects invites.
   - **Admin**: metrics dashboard, deactivate/reactivate users.

If you see data in lists (drivers, companies) and can submit actions, you’re good.

---

## 6) Useful API Endpoints (Quick refs)

> All paths are relative to `http://localhost:5000`.

### Auth
- `POST /api/auth/register` – register (email, password, role)
- `POST /api/auth/login` – login → `{ token, profile }`

### Drivers
- `GET /api/drivers` – public list
- `GET /api/drivers/me` / `PUT /api/drivers/me` – my profile
- `GET /api/drivers/{userId}/wallet` – wallet (auto-create on first access)
- `POST /api/drivers/{userId}/wallet/topup|withdraw` – balance ops
- `GET /api/drivers/{userId}/transactions` – my tx history
- `GET /api/drivers/{userId}/companies` – companies I’m employed by
- `POST /api/drivers/{userId}/applications` – apply to company
- `DELETE /api/drivers/{userId}/applications/{applicationId}` – cancel
- `GET /api/drivers/{userId}/invitations` + `.../accept|reject`
- `GET /api/drivers/{userId}/employment` – current employment
- `GET /api/drivers/{userId}/public` – public profile

### Admin
- `GET /api/admin/metrics`
- `GET /api/admin/top/companies` / `GET /api/admin/top/drivers`
- `GET /api/admin/users` – paged, filter by role/search
- `POST /api/admin/users/{userId}/deactivate`
- `POST /api/admin/users/{userId}/reactivate`

---

## 7) Troubleshooting

- **Cannot connect to DB**  
  Check host/port/user/password in `appsettings.Development.json`.  
  Ensure MySQL is running:
  ```bash
  # macOS
  brew services start mysql
  # Windows
  # Start the "MySQL80" Windows Service from Services.msc
  ```

- **CORS / 401**  
  Confirm `VITE_API_BASE` points to `http://localhost:5000` and that the origin
  `http://localhost:3000` is allowed in CORS settings.

- **Login but account seems blocked**  
  Admin can deactivate/reactivate users. If deactivated, login returns `ACCOUNT_DISABLED`.

- **Port already in use**  
  Change ports or stop the other process:
  ```bash
  # find process on 5000 (macOS/Linux)
  lsof -i :5000
  kill -9 <pid>
  ```

- **EF migration errors**  
  You can skip migrations if you used `db.sql`. Keep the DB name consistent with your connection string.

---

## 8) Handy Commands (Cheat Sheet)

### Git
```bash
# remove editor/OS files locally + from remote
find . -name ".DS_Store" -delete
echo -e ".DS_Store
.idea/" >> .gitignore
git rm -r --cached .DS_Store .idea
git commit -m "chore: ignore .DS_Store and .idea"
git push
```

### MySQL
```bash
# import schema + seed
mysql -u root -p < db.sql

# open interactive shell
mysql -u root -p
```

### .NET
```bash
dotnet clean && dotnet restore && dotnet build
dotnet run
# or auto-reload
dotnet watch run
```

### Frontend
```bash
npm install
npm run dev
npm run build && npm run preview
```

---