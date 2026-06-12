# API Documentation

Base URL: `http://localhost:8000/api`

All protected endpoints require: `Authorization: Bearer <access_token>`

---

## Authentication

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "full_name": "John Farmer",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response 201:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "full_name": "John Farmer",
    "email": "john@example.com",
    "profile_image": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST /auth/login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response 200:** Same as register.

---

### POST /auth/refresh

**Request:**
```json
{ "refresh_token": "eyJ..." }
```

**Response 200:** New token pair.

---

### POST /auth/logout

Clears session (client must discard tokens).

---

## Users

### GET /users/me

Returns current user profile.

### PATCH /users/me

**Request:**
```json
{
  "full_name": "John Updated"
}
```

---

## Predictions

### POST /predictions/predict

Upload a crop leaf image for disease detection.

**Request:** `multipart/form-data`
- `file`: image file (JPG/JPEG/PNG, max 10MB)

**Response 201:**
```json
{
  "crop": "Tomato",
  "disease": "Early blight",
  "confidence": 0.9421,
  "description": "Early blight of tomato is caused by Alternaria solani...",
  "symptoms": ["Dark brown lesions with concentric rings...", "..."],
  "treatment": ["Apply fungicides every 7-10 days...", "..."],
  "prevention": ["Use disease-free certified seed...", "..."],
  "prediction_id": "uuid",
  "image_url": "/uploads/user_id/filename.jpg"
}
```

---

### GET /predictions/history

Returns paginated diagnosis history.

**Query params:**
- `skip` (default: 0)
- `limit` (default: 20, max: 100)

---

### GET /predictions/history/{prediction_id}

Returns a specific prediction with full disease info.

---

### DELETE /predictions/history/{prediction_id}

Deletes a prediction. Returns 204 No Content.

---

## Health

### GET /health

```json
{ "status": "ok", "version": "1.0.0" }
```

---

## Error Responses

All errors follow:

```json
{
  "detail": "Human-readable error message"
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad request |
| 401 | Unauthorized / invalid token |
| 404 | Not found |
| 409 | Conflict (email already exists) |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
