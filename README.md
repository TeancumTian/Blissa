# Blissa - Skincare Consultation Platform

## Overview

Blissa is a comprehensive skincare consultation platform that connects users with professionals and provides personalized skincare advice through AI-powered features.

### Key Features

- [x] **User Authentication**

  - [x] Secure email/password registration and login
  - [ ] Google OAuth integration
  - [x] JWT token-based authentication

- [x] **Skincare Assessment**

  - [x] Interactive skin type questionnaire
  - [x] AI-powered skin analysis
  - [x] Personalized skincare recommendations
  - [x] Progress tracking and history

- [ ] **Professional Consultation**

  - [ ] Real-time chat with skincare professionals
  - [ ] Video consultation scheduling
  - [ ] Appointment management

- [ ] **AI Chatbot**
  - [ ] Personalized skincare advice
  - [ ] Real-time responses
  - [ ] Follow-up question suggestions

### Technologies

#### Frontend

- [x] React + Vite
- [ ] TailwindCSS for styling (in progress)
- [x] React Router for navigation
- [ ] WebSocket for real-time features (in progress)
- [x] Responsive design

#### Backend

- [x] Node.js/Express
- [x] MongoDB for data storage // User info, Inspiration, Test history
- [x] JWT authentication
- [x] WebSocket server
- [x] RESTful API endpoints
- [x] Third-party integrations (Google OAuth, LiveKit)

### API Endpoints

- [ ] **Authentication**

  - [x] POST /api/auth/login
  - [x] POST /api/auth/create
  - [ ] POST /api/auth/google (in progress)

- [x] **Skin Test**

  - [x] POST /api/skintest/submit
  - [x] GET /api/skintest/latest
  - [x] PUT /api/skintest/update

- [ ] **Chat**

  - [x] POST /api/chat
  - [ ] WebSocket connections for real-time messaging

- [ ] **Appointments** (in progress)
  - [ ] POST /api/appointments/create
  - [ ] GET /api/appointments/list
  - [ ] PUT /api/appointments/update
  - [ ] DELETE /api/appointments/cancel

### Database Schema

- [x] **Users Collection**

  - [x] Authentication credentials
  - [x] Profile information
  - [x] Test history

- [x] **Skin Tests Collection**

  - [x] Test results
  - [x] AI analysis

- [ ] **Chat History** (in Progress)
  - [ ] User messages
  - [ ] AI responses
  - [ ] Timestamps

### Security Features

- [x] JWT token authentication
- [x] Secure password hashing
- [x] Protected routes
- [x] CORS configuration
- [x] Environment variable management

## Development Status

- [x] User Authentication
- [x] Skin Test Implementation
- [x] AI Chat Integration
- [x] Professional Consultation (In Progress)
- [x] Responsive UI
- [ ] Google OAuth Integration (In Progress)
- [ ] WebSocket Real-time Features (In Progress)
