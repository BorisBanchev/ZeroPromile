# ZeroPromile App Architecture

ZeroPromile consists of a mobile frontend built with **Expo React Native**, a **Node.js Express REST API** backend, **Prisma ORM**, and a **PostgreSQL** database

---

## High-level Architecture

```mermaid
flowchart TD
  User[User] --> App[Expo React Native App]

  App -->|HTTPS REST API| API[Node.js Express API]

  API --> AuthRoutes[Auth Routes]
  API --> SessionRoutes[Session Routes]
  API --> ProfileRoutes[Profile Routes]

  AuthRoutes --> AuthController[Auth Controller]
  SessionRoutes --> SessionController[Session Controller]
  ProfileRoutes --> ProfileController[Update Profile Controller]

  AuthController --> Prisma[Prisma ORM]
  SessionController --> Prisma
  ProfileController --> Prisma

  SessionController --> BACUtils[BAC Calculation Utils]

  Prisma --> DB[(PostgreSQL Database)]

  DB --> UserTable[User]
  DB --> SessionTable[Session]
  DB --> DrinkTable[SessionDrink]
```

---

## Backend Route Overview

```mermaid
flowchart TD
  Client[Frontend Services] --> AuthAPI[/Auth API/]
  Client --> SessionsAPI[/Sessions API/]
  Client --> ProfileAPI[/Profile API/]

  AuthAPI --> Register[POST /auth/register]
  AuthAPI --> Login[POST /auth/login]
  AuthAPI --> Refresh[POST /auth/refresh-token]
  AuthAPI --> Logout[POST /auth/logout]

  SessionsAPI --> GetSessions[GET /sessions]
  SessionsAPI --> StartSession[POST /sessions]
  SessionsAPI --> AddDrink[POST /sessions/drinks]
  SessionsAPI --> EndSession[PATCH /sessions/endsession]
  SessionsAPI --> DeleteSession[DELETE /sessions/:sessionId]

  ProfileAPI --> UpdateProfile[PATCH update/profile]
```

---

## Frontend Service Layer

The frontend communicates with the backend through service modules.

```mermaid
flowchart TD
  Screens[React Native Screens] --> AuthStore[useAuthStore]
  Screens --> SessionService[sessionsService]
  Screens --> DrinksService[drinksService]
  Screens --> ProfileService[updateProfileService]

  SessionService --> APIURL[API_URL]
  DrinksService --> APIURL
  ProfileService --> APIURL

  SessionService --> RefreshToken[refreshAccessToken on 401]
  DrinksService --> RefreshToken
  ProfileService --> RefreshToken

  RefreshToken --> AuthAPI[POST /auth/refresh-token]
```

All authenticated frontend requests include:

```http
Authorization: Bearer <accessToken>
```

If the backend returns `401`, the frontend tries to refresh the access token and retries the original request.

---

# Main Application Flows

## Register Flow

```mermaid
sequenceDiagram
  actor User
  participant App as Expo React Native App
  participant AuthService as Frontend Auth Service
  participant API as Express Auth Route
  participant Parser as newUserParser
  participant Controller as Auth Controller
  participant Bcrypt as bcrypt
  participant Token as JWT Utils
  participant Prisma as Prisma ORM
  participant DB as PostgreSQL

  User->>App: Enters registration details
  App->>AuthService: register user
  AuthService->>API: POST /auth/register
  API->>Parser: Validate request body
  Parser->>Controller: Forward valid data

  Controller->>Prisma: Find user by email
  Prisma->>DB: SELECT User WHERE email
  DB-->>Prisma: Existing user or null
  Prisma-->>Controller: Result

  alt User already exists
    Controller-->>API: Throw AppError 400
    API-->>App: Error response
  else Passwords do not match
    Controller-->>API: Throw AppError 400
    API-->>App: Error response
  else Valid registration
    Controller->>Bcrypt: Hash password
    Bcrypt-->>Controller: Hashed password
    Controller->>Prisma: Create User
    Prisma->>DB: INSERT User
    DB-->>Prisma: Created user
    Prisma-->>Controller: User data

    Controller->>Token: Generate access token
    Controller->>Token: Generate refresh token
    Controller-->>API: 201 success response
    API-->>AuthService: User + tokens
    AuthService-->>App: Store auth state
    App-->>User: User is registered and logged in
  end
```

---

## Start Session Flow

```mermaid
sequenceDiagram
  actor User
  participant App as Expo React Native App
  participant Service as sessionsService
  participant API as Express Sessions Route
  participant Auth as authMiddleware
  participant Parser as newSessionParser
  participant Controller as Session Controller
  participant Prisma as Prisma ORM
  participant DB as PostgreSQL

  User->>App: Starts a new session
  App->>Service: startSession(accessToken, sessionName)
  Service->>API: POST /sessions

  API->>Auth: Validate access token
  Auth-->>API: Attach req.user

  API->>Parser: Validate session body
  Parser-->>Controller: Forward valid request

  Controller->>Prisma: Find active session for user
  Prisma->>DB: SELECT active Session
  DB-->>Prisma: Active session or null
  Prisma-->>Controller: Result

  alt Active session exists
    Controller-->>API: Throw AppError 400
    API-->>Service: Error response
    Service-->>App: Show error
  else No active session
    Controller->>Prisma: Create new Session
    Prisma->>DB: INSERT Session
    DB-->>Prisma: Created session
    Prisma-->>Controller: New session

    Controller-->>API: 201 success response
    API-->>Service: Session data
    Service-->>App: Update UI
    App-->>User: Session started
  end
```

---

## Add Drink and Live BAC Update Flow

When the user adds a drink, the backend stores the drink and calculates the drink’s BAC contribution. After the frontend refetches sessions, the home screen calculates and updates the user’s current BAC locally every second.

```mermaid
sequenceDiagram
  actor User
  participant Home as HomeScreen
  participant Modal as Add Drink Modal
  participant DrinkService as drinksService
  participant SessionHook as useSessions
  participant API as Express API
  participant Controller as Session Controller
  participant BACBackend as Backend BAC Utils
  participant Prisma as Prisma ORM
  participant DB as PostgreSQL
  participant BACFrontend as Frontend BAC Utils

  User->>Home: Tap "Add Drink"
  Home->>Modal: Navigate to /modals/add-drink

  User->>Modal: Submit drink form
  Modal->>DrinkService: addDrink(accessToken, drink)
  DrinkService->>API: POST /sessions/drinks

  API->>Controller: addDrinkToSession
  Controller->>Prisma: Find active session
  Prisma->>DB: SELECT active Session
  DB-->>Prisma: Active session

  Controller->>BACBackend: Calculate drink BAC contribution
  Controller->>Prisma: Create SessionDrink
  Prisma->>DB: INSERT SessionDrink

  Controller->>Prisma: Load all session drinks
  Prisma->>DB: SELECT SessionDrink records
  DB-->>Prisma: Drinks list

  Controller->>BACBackend: Calculate currentBAC and peakBac
  Controller->>Prisma: Update Session peakBac
  Prisma->>DB: UPDATE Session

  Controller-->>API: Drink added + BAC data
  API-->>DrinkService: Success response

  Modal->>SessionHook: refetchSessions()
  SessionHook->>API: GET /sessions
  API-->>SessionHook: Sessions with drinks
  SessionHook-->>Home: Updated activeSession

  loop Every 1 second
    Home->>BACFrontend: calculateCurrentBAC(activeSession.drinks)
    BACFrontend-->>Home: Current BAC
    Home->>BACFrontend: calculateTimeUntilSober(currentBAC)
    BACFrontend-->>Home: Time remaining
    Home->>Home: Update BacDisplay and ActiveSessionSection
  end
```

---

## Important Note

The backend calculates and stores:

- drink BAC contribution
- session `peakBac`
- drink history

The frontend calculates live display values:

- current BAC
- time until sober
- sober-at time
- automatic session ending when BAC reaches `0`

---

## Get Sessions Flow

```mermaid
sequenceDiagram
  actor User
  participant App as Expo React Native App
  participant Service as sessionsService
  participant API as Express Sessions Route
  participant Auth as authMiddleware
  participant Controller as Session Controller
  participant Prisma as Prisma ORM
  participant DB as PostgreSQL

  User->>App: Opens session history
  App->>Service: getSessions(accessToken)
  Service->>API: GET /sessions

  API->>Auth: Validate access token
  Auth-->>API: Attach req.user

  Controller->>Prisma: Find all sessions for user
  Prisma->>DB: SELECT Sessions with Drinks and drink count
  DB-->>Prisma: Sessions ordered by startedAt desc
  Prisma-->>Controller: Sessions with drinks

  Controller->>Controller: Format response data
  Controller-->>API: 200 success response
  API-->>Service: Sessions data
  Service-->>App: Return sessions
  App-->>User: Display session history
```

---

## Update Profile Flow

```mermaid
sequenceDiagram
  actor User
  participant App as Expo React Native App
  participant Service as updateUserProfileService
  participant API as Express Profile Route
  participant Auth as authMiddleware
  participant Parser as newUpdateProfileParser
  participant Controller as Update Profile Controller
  participant Prisma as Prisma ORM
  participant DB as PostgreSQL

  User->>App: Updates gender or weight
  App->>Service: updateUserProfile(accessToken, profileData)
  Service->>API: PATCH update/profile

  API->>Auth: Validate access token
  Auth-->>API: Attach req.user

  API->>Parser: Validate profile body
  Parser-->>Controller: Forward valid request

  Controller->>Controller: Map gender to Prisma enum
  Controller->>Prisma: Update user gender and weightKg
  Prisma->>DB: UPDATE User
  DB-->>Prisma: Updated profile values
  Prisma-->>Controller: Updated user data

  Controller-->>API: 200 success response
  API-->>Service: Updated gender and weight
  Service-->>App: Update local profile state
  App-->>User: Profile updated
```

---

# Key Design Decisions

## Token-based authentication

The backend uses access tokens for protected routes. Refresh tokens are used to request a new access token when the old one expires.

## Client-side logout

Logout is handled mainly on the client by deleting stored tokens. The backend logout endpoint returns a success response but does not invalidate tokens server-side.

## One active session per user

Before starting a session, the backend checks whether the user already has an active session. This prevents multiple active drinking sessions for the same user.

## Session deletion rules

Only inactive sessions can be deleted. Active sessions must be ended first.

---
