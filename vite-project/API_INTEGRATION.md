# Dictionary API Integration Guide

## Overview

The Geez-Amharic Dictionary app now uses an API service layer that abstracts data access. This makes it easy to switch between local data and a real API endpoint in the future.

## Current Setup

The app currently uses **local dictionary data** with a **mock API layer** that simulates network delays. This provides a realistic user experience while we wait for a real API to become available.

## API Service Location

```
vite-project/src/services/dictionaryApi.js
```

## Available API Methods

### 1. `searchByGeez(geezText)`

Search for verbs by Geez text.

```javascript
import { searchByGeez } from "./services/dictionaryApi.js";

const result = await searchByGeez("ሎሀ");
// Returns: { success: true, data: [...], count: 1 }
```

### 2. `getSuggestions(query, limit)`

Get autocomplete suggestions.

```javascript
import { getSuggestions } from "./services/dictionaryApi.js";

const result = await getSuggestions("ሎ", 8);
// Returns: { success: true, data: [...], count: 8 }
```

### 3. `getAllVerbs(page, pageSize)`

Get paginated dictionary entries.

```javascript
import { getAllVerbs } from "./services/dictionaryApi.js";

const result = await getAllVerbs(1, 50);
// Returns: { success: true, data: [...], pagination: {...} }
```

### 4. `getVerbsByRootLetter(rootLetter)`

Filter verbs by root letter.

```javascript
import { getVerbsByRootLetter } from "./services/dictionaryApi.js";

const result = await getVerbsByRootLetter("ሀ");
// Returns: { success: true, data: [...], count: 150 }
```

### 5. `getVerbsByType(verbType)`

Filter verbs by type.

```javascript
import { getVerbsByType } from "./services/dictionaryApi.js";

const result = await getVerbsByType("ገቢር ግሥ");
// Returns: { success: true, data: [...], count: 200 }
```

### 6. `advancedSearch(filters)`

Search with multiple filters.

```javascript
import { advancedSearch } from "./services/dictionaryApi.js";

const result = await advancedSearch({
  geez: "ሎ",
  rootLetter: "ሀ",
  verbType: "ገቢር ግሥ",
});
// Returns: { success: true, data: [...], count: 10 }
```

## Configuration

You can configure the API behavior:

```javascript
import { updateApiConfig } from "./services/dictionaryApi.js";

// Disable mock API (use local data directly, no delay)
updateApiConfig({ useMockApi: false });

// Change network delay
updateApiConfig({ networkDelay: 500 });

// Add real API endpoint (future)
updateApiConfig({
  useMockApi: false,
  apiEndpoint: "https://api.geez-dictionary.com/v1",
});
```

## Switching to a Real API

When a real API becomes available, follow these steps:

### Step 1: Update the configuration

Edit `vite-project/src/services/dictionaryApi.js`:

```javascript
const API_CONFIG = {
  useMockApi: false, // Disable mock
  networkDelay: 0, // No artificial delay
  apiEndpoint: "https://your-api-endpoint.com/v1", // Add real endpoint
};
```

### Step 2: Update the API methods

Replace the local data access with actual fetch calls:

```javascript
export const searchByGeez = async (geezText) => {
  try {
    const response = await fetch(
      `${API_CONFIG.apiEndpoint}/search?geez=${encodeURIComponent(geezText)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.results || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error searching dictionary:", error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};
```

### Step 3: Add authentication (if needed)

```javascript
const API_CONFIG = {
  useMockApi: false,
  apiEndpoint: "https://your-api-endpoint.com/v1",
  apiKey: "your-api-key-here", // Add API key
};

// Add headers to fetch calls
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${API_CONFIG.apiKey}`,
    "Content-Type": "application/json",
  },
});
```

## About the Softonic Link

**Important Note:** The link you provided (https://geez-amharic-dictionary.en.softonic.com/android) is **not an API**. It's a download page for an Android app. There is no public API available from that source.

### Options for Getting a Real API:

1. **Build your own backend API** using:

   - Node.js + Express
   - Python + Flask/FastAPI
   - Firebase/Supabase

2. **Use a cloud database** with REST API:

   - Firebase Firestore
   - MongoDB Atlas
   - Supabase

3. **Contact the app developers** to see if they have an API available

4. **Continue using local data** (current approach) - works perfectly fine for most use cases

## Testing

The app is fully functional with the current mock API setup. All features work as expected:

- ✅ Search by Geez verb
- ✅ Autocomplete suggestions
- ✅ Related words
- ✅ Recent searches
- ✅ Grammar guides

## Performance

The mock API includes a 300ms delay to simulate real network conditions. This helps ensure the loading states and user experience are properly tested.

To disable the delay for faster development:

```javascript
updateApiConfig({ useMockApi: false });
```

## Questions?

If you need help setting up a real backend API or have questions about the integration, feel free to ask!
