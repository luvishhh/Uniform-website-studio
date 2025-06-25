# Uniform Website Studio

## Mock Data Toggle

This project supports toggling between real MongoDB data and mock data for local development and testing.

- **To use mock data:**  
  Set the environment variable `USE_MOCK_DATA=true` before starting the server.
- **To use real MongoDB:**  
  Unset `USE_MOCK_DATA` or set it to `false`.

**Example:**

### Unix/Mac

```sh
USE_MOCK_DATA=true npm run dev
```

### Windows (PowerShell)

```powershell
$env:USE_MOCK_DATA="true"; npm run dev
```

### To revert to real MongoDB

#### Unix/Mac

```sh
unset USE_MOCK_DATA; npm run dev
```

#### Windows (PowerShell)

```powershell
Remove-Item Env:USE_MOCK_DATA; npm run dev
```

All API endpoints (authentication, user profile, orders, reviews, etc.) will respect this toggle.

---

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
