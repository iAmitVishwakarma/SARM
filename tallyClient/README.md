#  SARM - Smart Accounting Record Manager
### Har Dukandaar ka Digital Hisaab

SARM is a modern, simple, web-based accounting application designed for small Indian business owners (kirana shops, stationery stores, etc.) who currently manage their accounts in notebooks. It provides the power of an accounting system like Tally with the simplicity of a spreadsheet.

This project is the **frontend client**, built with React, Vite, and Tailwind CSS.



## Features

* **📈 Dashboard:** At-a-glance view of daily sales, total stock value, and pending payments (debtors).
* **➕ Add Entry:** A single, simple form to record all transaction types (Sale, Purchase, Returns).
* **📦 Stock Management:** Live-updating stock levels. Adding a "Sale" automatically decreases stock; a "Purchase" increases it.
* **📒 Party Ledger:** Automatically maintains the balance for every customer (Debtor) and supplier (Creditor).
* **🤖 AI Alerts:** Rule-based smart alerts for "Low Stock" and "Pending Payments".
* **📊 Reports:** A visual sales chart to track performance over time.
* **📄 Exports:**
    * Export party ledgers to **Excel** (`.xlsx`).
    * Generate and download simple PDF **invoices**.

## 💻 Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM v6
* **State Management:** React Context + `useReducer`
* **Charting:** `Chart.js` (via `react-chartjs-2`)
* **File Exports:** `SheetJS (xlsx)` and `jsPDF`

## 🚀 How to Run Locally

This project contains only the `client` (frontend).

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/sarm-app.git](https://github.com/your-username/sarm-app.git)
    cd sarm-app/client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) in your browser.

**Demo Credentials:**
* **Email:** `admin@sarm.com`
* **Password:** `1234`

## 🏗️ Project Structure

The client application follows a feature-based, modular structure: