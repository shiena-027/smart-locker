🧠 Smart Locker Web App

This repository contains both frontend and backend of the webpage/webapp

📦 Tech Stack

Vue 3

Vue Router

Vite

Tailwind CSS

Node.js & npm

Firebase

👥 How to Run the Project
✅ 1. Install Requirements
          Make sure you have:
              Node.js (v18+ recommended)
              npm
          Check versions:
              node -v
              npm -v

✅ 2. Clone the Repository
        git clone https://github.com/shiena-027/smart-locker.git
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
    🟥 Occupied
    🟧  Busy
> User selects an available locker
> Open Locker Page
> Waits for the sensor to detect item
> QR Page
> Displays a QR code and manual to reopen the locker


📁 Project Structure
src/
 ├─ views/
 │   ├─ EnterUnit.vue
 │   ├─ Dashboard.vue
 │   ├─ SelectLocker.vue
 │   ├─ OpenLocker.vue
 │   └─ QRPage.vue
 ├─ router/
 │   └─ index.js
 ├─ App.vue
 └─ main.js

