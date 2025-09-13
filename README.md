# 🧠 Recapcha

**Recapcha** is a full-stack web app that helps students convert their notes into quizzes for more effective studying. Write or upload your notes, and Recapcha will intelligently create quiz questions to test your memory and reinforce learning.

---

## 🚀 Features

- 📝 Save and manage plain text notes
- 🧠 Automatically generate quizzes based on notes
- 🔐 User authentication (Register / Login)
- 📎 Associate quizzes with their original notes
- ⏬ Download `.txt` notes or `.json` quizzes
- 🧑‍💻 Built with MERN Stack (MongoDB, Express, React Native, Node.js)

---

## 📁 Folder Structure

```bash
Recapcha/
├── client/             # React Native frontend
│   ├── screens/        # App screens (Home, Login, Register, etc.)
│   ├── components/     # Shared UI components
│   ├── types/          # TypeScript types
│   └── ...             # Additional client logic
├── server/             # Node.js + Express backend
│   ├── models/         # Mongoose models (User, Note, Quiz)
│   ├── routes/         # API endpoints
│   └── app.js          # Server entry point
├── .env                # Environment variables
└── README.md           # Project documentation
```

---

## 🧑‍💻 Tech Stack

| Layer        | Technology          |
|--------------|---------------------|
| Frontend     | React Native (Expo) |
| Backend      | Node.js + Express   |
| Database     | MongoDB + Mongoose  |
| Auth         | Custom Bearer Token |
| Language     | TypeScript & JavaScript |

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g expo-cli`

### 🛠️ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside the `/server` folder:

```env
MONGO_URI=mongodb://localhost:27017/recapcha
PORT=5050
```

### 📱 Frontend Setup

```bash
cd client
npm install
npx expo start
```

---

## 🔐 Authentication Flow

- Upon login, the user receives a simple token (user ID)
- This token is stored in `localStorage` on the device
- It is sent in the `Authorization: Bearer <token>` header for all secured requests

---

## 📡 API Endpoints

### Auth

```http
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login and get token
GET    /api/auth/user/me      # Get current logged-in user (via token)
```

### Notes

```http
POST   /api/notes             # Create new note (requires token)
```

### Quizzes

```http
POST   /api/quizzes           # Create new quiz associated with a note (requires token)
```

---

## 📦 Data Structure

### 📄 Note

```ts
{
  uuid: string;
  txt: string;
  createdAt: Date;
}
```

### ❓ Quiz

```ts
{
  q: string;
  a: {
    a1: boolean;
    a2: boolean;
    a3: boolean;
    a4: boolean;
  };
  note: string;       // references note UUID
  user: string;       // user UUID
  createdAt: Date;
}
```

---

## 🧪 How It Works

1. **User creates a note** → Stored in backend and linked to user
2. **User generates a quiz** → Tied to the specific note
3. Both are stored and retrievable per user
4. Downloads available as `.txt` and `.json`

---

## 📌 Notes

- Notes and quizzes are embedded arrays in the User schema
- Quizzes reference notes via UUID (fastest for embedded schema)
- Authentication is simplified with user ID tokens


## 📃 License

This project is licensed under the [MIT License](LICENSE)