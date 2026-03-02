# FriendKitchen

A stylish application for managing menu items and creating beautiful, printable menu templates that can be saved as images.

## 🚀 Features

- **Menu Management**: Add, edit, and delete menu items (name, weight, price, category).
- **Template Generation**: Create visually appealing menu templates organized by categories.
- **Export to PNG**: Download ready-to-use templates as image files with a single click.
- **Automation**: Convenient data entry (support for Enter/Esc hotkeys) and automatic date formatting.
- **Responsive Design**: Modern, premium design featuring the Comfortaa font and sleek color palettes.

## 🛠 Technologies

### Frontend
- **React 19** + **TypeScript**
- **Vite** (Build tool)
- **SCSS Modules** (Styling)
- **html2canvas** (Export to PNG)

### Backend
- **Node.js** + **Express**
- **SQLite** (Database)
- **sql.js** (SQLite for Node.js)
- **concurrently** (Run frontend and backend simultaneously)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Serginho915/FriendKitchen.git
   cd FriendKitchen
   ```

2. **Install dependencies**:
   In the root directory, run:
   ```bash
   npm install
   ```
   *This will install dependencies for the root, frontend, and backend automatically thanks to **NPM Workspaces**.*

3. **Configure Environment Variables**:
   The project uses environment variables for configuration. Rename the `.env.sample` files to `.env` in both the `FriendKitchen` and `backend` directories and update the values if necessary.

   **Frontend (`FriendKitchen/.env`)**:
   ```bash
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

   **Backend (`backend/.env`)**:
   ```bash
   PORT=3000
   ```

To start the entire application (frontend + backend) with a single command from the root:

```bash
npm run dev
```

- **Frontend**: available at [http://localhost:5173/](http://localhost:5173/)
- **Backend**: running at [http://localhost:3000/](http://localhost:3000/)

### Individual Commands
- To start only the frontend: `npm run dev:frontend`
- To start only the backend: `npm run dev:backend`

## 🐳 Docker (Nginx + API)

The project includes a ready production setup with:
- `frontend` container: React build served by **Nginx**
- `backend` container: Express API
- Reverse proxy from Nginx (`/api/*`) to backend
- Persistent backend database volume

### Run with Docker Compose

From the repository root:

```bash
docker compose up -d --build
```

After startup:
- App: [http://localhost:8003/](http://localhost:8003/)
- API (through Nginx): [http://localhost:8003/api/menu](http://localhost:8003/api/menu)

Backend DB file is persisted on host in:
- `backend/database.db`

### Stop containers

```bash
docker compose down
```

### Stop and remove DB volume (full reset)

```bash
docker compose down -v
```

## ⚙️ Deployment

### Backend (Node.js)
For production deployment:
1. Ensure the `PORT` environment variable is set (defaults to 3000).
2. Start the server:
   ```bash
   cd backend
   npm start
   ```

### Frontend (Vite)
1. Build the project:
   ```bash
   cd FriendKitchen
   npm run build
   ```
2. The `dist` folder will contain the static files. You can host these on any service such as Vercel, Netlify, or Nginx.
3. Important: Ensure the API URL in your frontend code points to your deployed backend's address.

## 📁 Project Structure

```text
FriendKitchen/
├── FriendKitchen/    # Frontend source code (React)
├── backend/          # Backend source code (Express + DB)
├── package.json      # Root scripts for project management
└── README.md         # Project documentation
```
