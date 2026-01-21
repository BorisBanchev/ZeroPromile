![Staging CI](https://github.com/BorisBanchev/ZeroPromile/actions/workflows/staging.yaml/badge.svg?branch=staging)

# ZeroPromile 🍺⏱️

ZeroPromile is a full-stack mobile application that estimates a user’s blood alcohol concentration (BAC) and calculates the estimated time until complete sobriety (0.00‰).  
The app uses deterministic, formula-based calculations and presents the results in a clear, mobile-first user experience.

> ⚠️ **Disclaimer:** This application provides estimates only and must not be used for medical, legal, or driving decisions.

---

## 📌 Problem we are solving

People often underestimate how long alcohol remains in their bloodstream, which can lead to unsafe decisions.  
ZeroPromile helps users understand how alcohol intake affects their body by estimating BAC levels and predicting when they will be sober again.

## BAC Calculation Logic

ZeroPromile uses a simplified **Widmark-based formula** to estimate blood alcohol concentration:

BAC = (Total Alcohol Consumed in grams / (Body Weight × Distribution Factor)) − (Elimination Rate × Time)

- Distribution factor varies by gender
- Elimination rate ≈ **0.15‰ per hour**
- Time-to-sobriety is calculated as:
  - Time Until Sober = Current BAC / Elimination Rate

---

## 🚀 Features

### Core Features (MVP)

- User registration and authentication
- User profile with weight and gender
- Alcohol intake input (volume, alcohol percentage, time of last drink)
- Estimated BAC (‰)
- Estimated time until 0.00‰ (sobriety)
- Session history tracking
- Clear legal and medical disclaimers

---

## Tech Stack

### 📱 Frontend

- **React Native**
- **TypeScript**

### 🌐 Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- RESTful API architecture
- JWT-based authentication

### 🗄 Database

- **PostgreSQL**

### 🚀 DevOps / CI-CD

- Automated linting and testing
- Build and deployment pipelines (e.g. GitHub Actions)

---

## 🔐 Authentication & Security

- JWT-based authentication
- Protected API routes
- Password hashing
