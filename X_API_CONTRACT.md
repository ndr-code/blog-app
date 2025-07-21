# Comprehensive Social Media Platform API Contract

## Base URL

```
https://blogger-wph-api-production.up.railway.app
```

## Authentication

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {token}`
- **Content-Type**: `application/json` for JSON payloads
- **Content-Type**: `multipart/form-data` for file uploads

---

## Health Check

### GET /

- **Description**: Basic health check endpoint
- **Response**: `200 OK` - "Hello World!"

---

## Authentication Endpoints

### POST /auth/register

- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "name": "test",
    "email": "test@mail.com",
    "password": "abcdef"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 123,
    "email": "test@mail.com"
  }
  ```

### POST /auth/login

- **Description**: Authenticate user and return JWT token
- **Request Body**:
  ```json
  {
    "email": "trial@opmail.com",
    "password": "123456"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

## User Management Endpoints

### GET /users/by-email/{email}

- **Description**: Retrieve user information by email address
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK`
  ```json
  {
    "id": 101,
    "name": "Nicolas Petit",
    "email": "nicolas.petit@wphmail.com",
    "headline": "Frontend Developer",
    "avatarUrl": "/uploads/1751140210004-134271914-Nicolas Petit-min.png"
  }
  ```

### GET /users/{id}

- **Description**: Retrieve user information by user ID
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK` (same structure as above)

### PATCH /users/profile

- **Description**: Update current user's profile information
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
- **Request Body**:
  - `name` (string, optional): User's display name
  - `headline` (string, optional): User's headline/bio
  - `avatar` (file, optional): Profile picture (PNG/JPG, max 5MB)
- **Response**: `200 OK`
  ```json
  {
    "id": 119,
    "name": "Tri Aji",
    "email": "triaji@example.com",
    "headline": "Frontend Developer",
    "avatarUrl": "/uploads/1751535352d7-13496745-Avatar Tri Aji.png"
  }
  ```

### PATCH /users/password

- **Description**: Change user's password
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword",
    "confirmPassword": "newpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true
  }
  ```

---

## Posts Endpoints

### GET /posts/recommended

- **Description**: Get personalized recommended posts for the user
- **Headers**: `Authorization: Bearer {token}` (optional)
- **Query Parameters**:
  - `limit` (optional): Number of posts to return (default: 10, max: 100)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "5 Reasons to Learn Frontend Development in 2025",
        "content": "Frontend development is more than just building beautiful user interfaces...",
        "tags": ["Programming", "Frontend", "Coding"],
        "imageUrl": "https://blogger-wph-api-production.up.railway.app/storage/8d31ecd7ba356c7d8cc0a6ee786618c.png",
        "author": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "headline": "Frontend Developer",
          "avatarUrl": "/uploads/jane-avatar.jpg"
        },
        "createdAt": "2025-05-27T10:00:00.000Z",
        "likes": 42,
        "comments": 18
      }
    ],
    "total": 25,
    "page": 1,
    "lastPage": 3
  }
  ```

### GET /posts/most-liked

- **Description**: Get posts ordered by like count
- **Query Parameters**:
  - `limit` (optional): Number of posts to return (default: 10, max: 100)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: `200 OK` (same structure as recommended posts)

### GET /posts/my-posts

- **Description**: Get posts created by the current user
- **Headers**: `Authorization: Bearer {token}` (required)
- **Query Parameters**:
  - `limit` (optional): Number of posts to return (default: 10, max: 100)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: `200 OK` (same structure as recommended posts)

### GET /posts/search

- **Description**: Search posts by content or hashtags
- **Query Parameters**:
  - `query` (required): Search query string
  - `limit` (optional): Number of results (default: 10, max: 100)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: `200 OK` (same structure as recommended posts)

### POST /posts

- **Description**: Create a new post
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
- **Request Body**:
  - `title` (string, required): Post title
  - `content` (string, required): Post content
  - `tags` (array, required): Array of tag strings
  - `image` (file, required): Image file (PNG/JPG, max 5MB)
- **Response**: `201 Created`
  ```json
  {
    "id": 1,
    "title": "5 Reasons to Learn Frontend Development in 2025",
    "content": "Frontend development is more than just building beautiful user interfaces...",
    "tags": ["Programming", "Frontend", "Coding"],
    "imageUrl": "/storage/images/frontend-2025.jpg",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2025-05-27T08:00:00Z",
    "likes": 0,
    "comments": 0
  }
  ```

### GET /posts/{id}

- **Description**: Get detailed information about a specific post
- **Headers**: `Authorization: Bearer {token}` (optional)
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "title": "5 Reasons to Learn Frontend Development in 2025",
    "content": "Frontend development is more than just building beautiful user interfaces...",
    "tags": ["Programming", "Frontend", "Coding"],
    "imageUrl": "https://blogger-api-production.up.railway.app/storage/1872882d17407ff85c4dfb14936268d8.png",
    "createdAt": "2025-06-28T23:17:59.542Z",
    "likes": 0,
    "comments": 0,
    "author": {
      "id": 1,
      "name": "Antoine Leclerc",
      "email": "antoine.leclerc@gmail.com"
    }
  }
  ```

### PATCH /posts/{id}

- **Description**: Update an existing post (only by author)
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
- **Request Body**:
  - `title` (string, optional): Post title
  - `content` (string, optional): Post content
  - `tags` (array, optional): Array of tag strings
  - `image` (file, optional): Image file (PNG/JPG, max 5MB)
- **Response**: `200 OK` (same structure as single post)

### DELETE /posts/{id}

- **Description**: Delete a post (only by author or admin)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK`
  ```json
  {
    "success": true
  }
  ```

### POST /posts/{id}/like

- **Description**: Toggle like status on a post
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK`
  ```json
  {
    "id": 52,
    "title": "5 Reasons to Learn Frontend Development in 2025",
    "content": "Frontend development is more than just building beautiful user interfaces...",
    "tags": ["Programming", "Frontend"],
    "imageUrl": "https://yourcdn.com/images/frontend-2025.jpg",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "headline": "Software Engineer",
      "avatarUrl": "/uploads/avatar.jpg"
    },
    "createdAt": "2025-05-27T10:00:00.000Z",
    "likes": 25,
    "comments": 8
  }
  ```

### GET /posts/{id}/likes

- **Description**: Get list of users who liked the post
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "clarissa",
      "headline": "Frontend Developer",
      "avatarUrl": "/uploads/clarissa.jpg"
    },
    {
      "id": 2,
      "name": "marco",
      "headline": "Frontend Developer",
      "avatarUrl": "/uploads/marco.jpg"
    }
  ]
  ```

### GET /posts/by-user/{userId}

- **Description**: Get all posts created by a specific user
- **Query Parameters**:
  - `limit` (optional): Number of posts to return (default: 10, max: 100)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "5 Reasons to Learn Frontend Development in 2025",
        "content": "Frontend development is more than just building beautiful user interfaces...",
        "tags": ["Programming", "Frontend", "Coding"],
        "imageUrl": "https://yourcdn.com/images/frontend-2025.jpg",
        "author": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "headline": "Frontend Developer",
          "avatarUrl": "/uploads/avatar.jpg"
        },
        "createdAt": "2025-05-27T08:00:00Z",
        "likes": 25,
        "comments": 15
      }
    ],
    "total": 5,
    "page": 1,
    "lastPage": 1,
    "user": {
      "id": 1,
      "name": "taufik@email.com",
      "email": "taufik@email.com",
      "headline": null,
      "avatarUrl": null
    }
  }
  ```

---

## Comments Endpoints

### POST /comments/{postId}

- **Description**: Add a comment to a post
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "content": "This is an amazing post! Thanks for sharing."
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 1,
    "content": "Finally understand when to use SSG vs SSR!",
    "author": {
      "id": 1,
      "name": "Quentin Bonnet",
      "email": "quentin.bonnet@email.com"
    },
    "post": 1,
    "createdAt": "2025-05-30T10:08:00.000Z"
  }
  ```

### GET /comments/{postId}

- **Description**: Get comments for a specific post
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "content": "This is super insightful — thanks for sharing!",
      "createdAt": "2025-05-27T01:00:00Z",
      "author": {
        "id": 1,
        "name": "clarissa",
        "headline": "Frontend Developer",
        "avatarUrl": "/uploads/clarissa.jpg"
      }
    },
    {
      "id": 2,
      "content": "Exactly what I needed to read today. Frontend is evolving so fast!",
      "createdAt": "2025-05-27T01:00:00Z",
      "author": {
        "id": 2,
        "name": "marco",
        "headline": "Frontend Developer",
        "avatarUrl": "/uploads/marco.jpg"
      }
    }
  ]
  ```

---

## Data Models

### User Object

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "headline": "string|null",
  "avatarUrl": "string|null"
}
```

### Post Object

```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "imageUrl": "string",
  "author": "User",
  "createdAt": "string (ISO 8601)",
  "likes": "number",
  "comments": "number"
}
```

### Comment Object

```json
{
  "id": "number",
  "content": "string",
  "author": "User",
  "post": "number",
  "createdAt": "string (ISO 8601)"
}
```

### Pagination Object

```json
{
  "total": "number",
  "page": "number",
  "lastPage": "number"
}
```

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Access denied to resource
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Read operations**: 100 requests per minute
- **Write operations**: 30 requests per minute
- **General**: 1000 requests per hour per IP address

---

## CORS Configuration

- **Allowed Origins**: `https://blogger-wph-api-production.up.railway.app`
- **Allowed Methods**: `GET, POST, PATCH, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `Authorization, Content-Type, Accept`
- **Credentials**: Supported

---

## Notes

- Avatar URLs are relative paths that should be prefixed with the base URL
- The `headline` field represents a user's professional title or bio
- Null values are returned for optional fields when not set
- User objects maintain consistent structure across all endpoints
- All timestamps are in ISO 8601 format (UTC)
- Image uploads are limited to PNG/JPG formats with maximum size of 5MB
- Posts are cached for 5 minutes to improve response times
- Maximum `limit` parameter value is 100
- Page numbers start from 1 (not 0-indexed)
