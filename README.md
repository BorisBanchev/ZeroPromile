![Staging CI](https://github.com/BorisBanchev/ZeroPromile/actions/workflows/staging.yaml/badge.svg?branch=staging)
![Production CI](https://github.com/BorisBanchev/ZeroPromile/actions/workflows/production.yaml/badge.svg?branch=main)

## Documentation

- [käynnistysohjeet](https://github.com/BorisBanchev/ZeroPromile/blob/main/documentation/setup.md)
- [tuntikirjanpito](https://github.com/BorisBanchev/ZeroPromile/blob/main/documentation/tuntikirjanpito.md)
- User manual for ZeroPromile:
  - [authentication manual](https://github.com/BorisBanchev/ZeroPromile/blob/main/documentation/userManual/authenticationScreens/authenticationScreens.md)
  - [home screen manual](https://github.com/BorisBanchev/ZeroPromile/tree/main/documentation/userManual/homeScreens)
  - [profile screen manual](https://github.com/BorisBanchev/ZeroPromile/blob/main/documentation/userManual/profileScreens/profileScreen.md)
  - [sessions screen manual](https://github.com/BorisBanchev/ZeroPromile/tree/main/documentation/userManual/sessionsScreens)

# ZeroPromile

ZeroPromile is a full-stack mobile application that estimates a user’s blood alcohol concentration (BAC) and calculates the estimated time until complete sobriety (0.00‰).  
The app uses deterministic, formula-based calculations and presents the results in a clear, mobile-first user experience.

> ⚠️ **Disclaimer:** This application provides estimates only and must not be used for medical, legal, or driving decisions.

---

## Problem we are solving

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

## Features

### Core Features

- User **registration** and **authentication**
- User profile with **weight** and **gender**
- User can **edit** own weight and gender
- User can **start** a session, **add** drinks to the session through **quick select** or **custom select**
- User can see how own **BAC (in promilles) changes** over time and after drink addition
- Session **ends automatically** after user hits **0.00 promilles** or after **manually ending** the session
- The app estimates time until 0.00‰ (sobriety) in **hours**, **minutes** and **seconds** **(date and time HH:MM)**
- User can track and search his **active** and **past sessions** data from sessions screen
- User can **delete** past sessions from that session screen
- User can view more specific session data from session's screen including **BAC over time chart**
- Clear legal and medical **disclaimers**

---

## Tech Stack

### Frontend

- **React Native (Expo)**
- **Zustand (authentication and notification state management)**
- **TypeScript**

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **RESTful API architecture**
- **JWT-based authentication**

### Database

- **PostgreSQL (Prisma ORM)**

### DevOps / CI-CD

- staging and production **ci (building, testing, linting)**, **build-image (GHCR)** and **deploy (Fly.io)** pipelines with **GitHub Actions**

---
