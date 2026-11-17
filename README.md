# BloomCart 🌸🛒

BloomCart is a responsive, frontend-only e-commerce web application designed for a flower and gift shop. This project was built as an internship assignment for **Pynexia**. It provides a seamless user experience for browsing products, managing a shopping cart, and simulating a checkout process with a modern UI.

## ✨ Features

Here is a list of the core functionalities implemented in this project:

- **Product Catalog:** Displays a grid of products with images, prices, and ratings.
- **Category Filtering:** Interactive navigation bar to filter products by category (Home, Flowers, Gifts, Promo), dynamically updating the page content.
- **Real-time Search:** A debounced search input to filter products by name instantly without causing performance issues.
- **Shopping Cart (Drawer):** A slide-out cart drawer allowing users to add, remove, and adjust the quantity of items.
- **Persistent State (LocalStorage):** Cart data, user login status, and theme preferences are saved in the browser's `localStorage`, so they won't be lost upon refreshing the page.
- **Simulated Authentication:** A login modal for users to "sign in" and a profile panel displaying the active user's information.
- **Checkout System:** A functional checkout modal that calculates the total price, accepts simulated user details, and processes a fake transaction.
- **User Settings:** A settings panel where users can toggle **Dark Mode** for the entire website.
- **Toast Notifications:** Non-intrusive pop-up notifications to provide feedback for user actions (e.g., "Added to cart", "Transaction Successful").
- **Fully Responsive Design:** A mobile-first approach ensuring the layout looks great on smartphones, tablets, and desktop screens.

## 🚀 How to Run

This project is built using pure Vanilla JavaScript and does not require any complex build tools or package managers. 

1. **Clone or Download:** Download the project files to your local machine.
2. **Open the Project:**
   - **Method 1 (Direct):** Simply double-click the `index.html` file to open it in your default web browser.
   - **Method 2 (Live Server - Recommended):** Open the project folder in **Visual Studio Code**, and use the **Live Server** extension. Right-click on `index.html` and select "Open with Live Server". This is recommended for a smoother development experience and to avoid potential local file path issues.

## 🛠️ Technologies Used

- **HTML5:** For semantic and accessible markup structure.
- **CSS3:** For styling, utilizing CSS Variables (for Dark Mode), Flexbox, CSS Grid (for the product layout), and Media Queries (for responsiveness).
- **Vanilla JavaScript (ES6+):** For all the logic, including:
  - DOM Manipulation
  - Event Delegation
  - Array methods (`.filter`, `.find`, `.map`)
  - `localStorage` API for state management
  - Custom utility functions (Debounce, Format Rupiah, Toast Notification)

## 📁 Folder Structure

```text
bloomcart/
│
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── script.js           # Application logic and interactivity
└── assets/             # Static assets
    ├── icons/          # SVG icons (menu, credit card, etc.)
    └── images/         # Product images (local)