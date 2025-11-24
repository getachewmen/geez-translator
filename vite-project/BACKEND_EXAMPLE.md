# Building a Backend API (Optional)

If you want to create a real backend API for your dictionary, here are some simple options:

## Option 1: Node.js + Express (Simplest)

### Setup

```bash
# Create a new folder for backend
mkdir geez-dictionary-api
cd geez-dictionary-api

# Initialize npm
npm init -y

# Install dependencies
npm install express cors
```

### Create server.js

```javascript
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors());
app.use(express.json());

// Import your dictionary data
const dictionary = require("./dictionary.json");

// Search endpoint
app.get("/api/search", (req, res) => {
  const { geez } = req.query;

  if (!geez) {
    return res.status(400).json({ error: "Geez parameter required" });
  }

  const results = dictionary.filter((verb) => verb.geez === geez);

  res.json({
    success: true,
    data: results,
    count: results.length,
  });
});

// Suggestions endpoint
app.get("/api/suggestions", (req, res) => {
  const { query, limit = 8 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter required" });
  }

  const results = dictionary
    .filter(
      (verb) =>
        verb.geez?.toLowerCase().includes(query.toLowerCase()) ||
        verb.amharic?.toLowerCase().includes(query.toLowerCase()) ||
        verb.english?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    data: results,
    count: results.length,
  });
});

// Get all verbs (paginated)
app.get("/api/verbs", (req, res) => {
  const { page = 1, pageSize = 50 } = req.query;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + parseInt(pageSize);
  const paginatedData = dictionary.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedData,
    pagination: {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total: dictionary.length,
      totalPages: Math.ceil(dictionary.length / pageSize),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Dictionary API running on http://localhost:${PORT}`);
});
```

### Run the server

```bash
node server.js
```

### Update your frontend

In `vite-project/src/services/dictionaryApi.js`:

```javascript
const API_CONFIG = {
  useMockApi: false,
  apiEndpoint: "http://localhost:3001/api",
};
```

---

## Option 2: Firebase (No Backend Code Needed)

### Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Upload your dictionary data

### Install Firebase SDK

```bash
cd vite-project
npm install firebase
```

### Create firebase.js

```javascript
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const searchByGeez = async (geezText) => {
  const q = query(collection(db, "dictionary"), where("geez", "==", geezText));

  const querySnapshot = await getDocs(q);
  const results = [];

  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });

  return {
    success: true,
    data: results,
    count: results.length,
  };
};
```

---

## Option 3: Supabase (PostgreSQL + REST API)

### Setup

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Create a table called `dictionary`
4. Upload your data

### Install Supabase SDK

```bash
cd vite-project
npm install @supabase/supabase-js
```

### Create supabase.js

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export const searchByGeez = async (geezText) => {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*")
    .eq("geez", geezText);

  if (error) {
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }

  return {
    success: true,
    data: data,
    count: data.length,
  };
};

export const getSuggestions = async (query, limit = 8) => {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*")
    .or(
      `geez.ilike.%${query}%,amharic.ilike.%${query}%,english.ilike.%${query}%`
    )
    .limit(limit);

  if (error) {
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }

  return {
    success: true,
    data: data,
    count: data.length,
  };
};
```

---

## Option 4: Deploy Static API (JSON Server)

For a quick deployment without a real backend:

### Install json-server

```bash
npm install -g json-server
```

### Create db.json

```json
{
  "dictionary": [
    // Your dictionary data here
  ]
}
```

### Run json-server

```bash
json-server --watch db.json --port 3001
```

### Deploy to Vercel/Netlify

You can deploy json-server to cloud platforms for free!

---

## Recommendation

For your use case, I recommend:

1. **Keep using local data** (current setup) - It's fast, reliable, and works offline
2. **If you need a backend**, use **Supabase** - It's free, easy to set up, and provides a REST API automatically
3. **For learning purposes**, build a **Node.js + Express** API

The current implementation with the API service layer makes it easy to switch to any of these options later without changing your React components!
