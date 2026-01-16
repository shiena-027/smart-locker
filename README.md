🧠 Smart Locker Web App (Frontend)

This repository contains the frontend prototype of the Smart Locker Web Application built using Vue.js + Tailwind CSS.
The backend (Firebase / database / locker control) is handled separately.

📦 Tech Stack

Vue 3

Vue Router

Vite

Tailwind CSS

Node.js & npm

👥 How to Run the Project
✅ 1. Install Requirements
          Make sure you have:
              Node.js (v18+ recommended)
              npm
          Check versions:
              node -v
              npm -v

✅ 2. Clone the Repository
        git clone https://github.com/YOUR-USERNAME/smart-locker.git
        cd smart-locker

✅ 3. Install Dependencies
        npm install

📌 This installs Vue, Tailwind, and all required packages.

✅ 4. Run the Project (Localhost)
        npm run dev
      You should see something like:
            Local: http://localhost:5173/
      Open that link in your browser.

🧭 Application Flow (Frontend Only)

> Enter Unit Page
> User enters the locker unit ID
> Select Locker Page
> Displays lockers
> Shows status:
    🟩 Available
    ⬜ Occupied
> User selects an available locker
> Open Locker Page
> Simulates locker opening
> QR Page
> Displays a QR code to reopen the locker

⚠️ Note:
All locker data and logic are mocked for UI purposes only.

📁 Project Structure
src/
 ├─ views/
 │   ├─ EnterUnit.vue
 │   ├─ SelectLocker.vue
 │   ├─ OpenLocker.vue
 │   └─ QRPage.vue
 ├─ router/
 │   └─ index.js
 ├─ App.vue
 └─ main.js

