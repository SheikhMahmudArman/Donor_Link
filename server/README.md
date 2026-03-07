# A simple node.js backend

### Features

- JWT token-based authentication
- User can perform CRUD operation

### How to run this project

- Clone the repository
- Go to the project directory
- create `.env` file
- Copy everything from the `.env.example` file
- Assign values.
- Run `npm i` and then `npm run dev`

### Running this project inside a docker container

- Clone the repository
- Go to the project directory
- create `.env` file
- Copy everything from the `.env.example` file
- Assign values.
- Run `docker compose up -d --build` command to run this project in a docker container

There is an `ALLOWED_ORIGIN` variable in the `.env` file. The value of this variable will be the url of the frontend. For instant, if the frontend runs on `http://localhost:5173`, the value of the variable will be this url.
Assign a large random string to the `JWT_SECRET` variable, which is used to generate token. To run this project in a Docker container, ensure that the port number specified in the `docker-compose.yml` file matches the port number defined in the `.env` file. This will ensure that the container's ports are mapped correctly.

---

## API Documentation

Base URL: `http://localhost:5000` (or your configured `PORT`).

Authentication is done via a JWT stored in an **httpOnly cookie** named `token`. For protected routes, send requests with `credentials: 'include'` (fetch) or with cookies enabled so the cookie is sent.

---

### Health check

| Method | Endpoint | Auth | Description                  |
| ------ | -------- | ---- | ---------------------------- |
| `GET`  | `/api`   | No   | Check if the API is running. |

**Response** `200 OK`

```json
{ "message": "API is working" }
```

---

### Auth

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| `POST` | `/api/auth/login`  | No   | Log in and get JWT       |
| `POST` | `/api/auth/logout` | Yes  | Log out and clear cookie |

#### `POST /api/auth/login`

**Request body** (JSON)

| Field      | Type   | Required | Description   |
| ---------- | ------ | -------- | ------------- |
| `username` | string | Yes      | User login    |
| `password` | string | Yes      | User password |

**Success** `200 OK`  
Returns the user object (excluding `__v`). Sets the `token` cookie (httpOnly, 1 hour).

**Errors**

- `404` — `{ "error": "User not found" }`
- `400` — `{ "error": "Wrong password" }`

#### `POST /api/auth/logout`

Requires a valid `token` cookie.

**Success** `200 OK`

```json
{ "message": "Logout successful" }
```

**Error** `401` — `{ "error": "Invalid token" }`

---

### Users

| Method   | Endpoint             | Auth | Description         |
| -------- | -------------------- | ---- | ------------------- |
| `GET`    | `/api/users`         | Yes  | List all users      |
| `GET`    | `/api/users/profile` | Yes  | Get current user    |
| `POST`   | `/api/users`         | No   | Register a new user |
| `PUT`    | `/api/users/:id`     | Yes  | Update a user by ID |
| `DELETE` | `/api/users/:id`     | Yes  | Delete a user by ID |
| `DELETE` | `/api/users`         | Yes  | Delete all users    |

#### `GET /api/users`

Returns all users. Password and `__v` are omitted.

**Success** `200 OK`  
Array of user objects, e.g.:

```json
[
  { "_id": "...", "username": "john", "displayName": "John Doe" },
  ...
]
```

**Error** `401` — `{ "error": "Invalid token" }`

#### `GET /api/users/profile`

Returns the profile of the user identified by the JWT in the `token` cookie.

**Success** `200 OK`  
User object (including hashed password).

**Error** `401` — `{ "error": "Invalid token" }`  
**Error** `400` — Validation or other error payload.

#### `POST /api/users` (Register)

**Request body** (JSON)

| Field         | Type   | Required | Description     |
| ------------- | ------ | -------- | --------------- |
| `username`    | string | Yes      | Unique username |
| `displayName` | string | No       | Display name    |
| `password`    | string | Yes      | Plain password  |

**Success** `201 Created`

```json
{ "message": "New user added successfully" }
```

**Errors**

- `400` — `{ "error": "Username already in use" }`
- `400` — Validation or other error payload.

#### `PUT /api/users/:id`

Update the user with the given `id`. Requires a valid `token` cookie.

**URL parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| `id` | string | User MongoDB `_id` |

**Request body** (JSON)

| Field         | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `username`    | string | Yes      | New username     |
| `displayName` | string | No       | New display name |
| `password`    | string | Yes      | New password     |

**Success** `200 OK`  
Updated user object (excluding `__v`).

**Errors**

- `400` — `{ "error": "Username already in use" }` (when username is taken by another user)
- `401` — `{ "error": "Invalid token" }`
- `400` — Validation or other error payload.

#### `DELETE /api/users/:id`

Delete the user with the given `id`. Requires a valid `token` cookie.

**URL parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| `id` | string | User MongoDB `_id` |

**Success** `200 OK`

```json
{ "message": "User deleted" }
```

**Error** `401` — `{ "error": "Invalid token" }`

#### `DELETE /api/users`

Delete all users. Requires a valid `token` cookie.

**Success** `200 OK`

```json
{ "message": "All users deleted" }
```

**Error** `401` — `{ "error": "Invalid token" }`

---

### Error responses (protected routes)

When the JWT is missing or invalid, the API responds with:

- **Status:** `401 Unauthorized`
- **Body:** `{ "error": "Invalid token" }`  
  The `token` cookie may be cleared on invalid verification.
