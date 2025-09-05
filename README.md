# Cimion ToDo App

A simple **ToDo web application** built with **Next.js**, **Prisma ORM**, and **PostgreSQL**.  
Deployed on **Vercel**: [Cimion ToDo App](https://cimion-todo-qng6c9qrv-cimgehelp-4935s-projects.vercel.app/)

---

## 🚀 Features

- **User Authentication:** Registration and login with JWT stored in HTTP-only cookies  
- **Task Management:** Create, update, and delete tasks  
- **Subtasks:** Nested subtasks within tasks  
- **Task Status:** Track progress with statuses (`Not completed`, `In progress`, `Done`)  
- **Responsive UI:** Clean and simple interface with dynamic header  
- **Client-Side Session:** No Context API, state managed automatically on page refresh  

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router, Server & Client Components)  
- **Backend:** Node.js, Prisma ORM  
- **Database:** PostgreSQL (via Neon)  
- **Authentication:** JWT  
- **Styling:** Tailwind CSS  
- **Development DB:** Docker (for local PostgreSQL)

---

## 💻 Getting Started (Local)

### Using Docker for local database

To make local development easy, you can run PostgreSQL in a Docker container:

```bash
docker run --name cimion-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo -p 5432:5432 -d postgres:15
```
** Database URL for .env:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/todo
JWT_SECRET_KEY=your_secret_key
```
1. Clone the repository:
```bash
git clone https://github.com/your-username/cimion-todo.git
cd cimion-todo
```
2.Install dependencies
```bash
npm install
```
3. Initialize the database and run development
```bash
npx prisma migrate dev
npm run dev
```
☁️ Deployment
Run Prisma migrations in production with:
```bash
npx prisma migrate deploy
```
🎯 Usage:
```bash
Register a new account
Log in with your credentials
Add tasks and subtasks
Update task statuses or delete tasks/subtasks
```

📄 License
This project is licensed under the MIT License.
