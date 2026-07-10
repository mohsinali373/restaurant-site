# London Courtyard — Website Project

A modern, professional, mobile-first website built from scratch for **London Courtyard**, an established fine-dining restaurant in Multan, Pakistan. The site reflects the brand's aesthetic: an English conservatory garden reimagined for Multan's fine-dining scene.

---

## 🎨 Design System & Colors
The design uses custom CSS variables defined in `styles.css` matching the specific color tokens of the London Courtyard brand:
* **Primary Background**: `--stone` (`#EDEAE1`) — Warm paving greige.
* **Primary Brand Color**: `--conservatory` (`#1F3B2C`) — Deep botanical green.
* **Divider & Borders**: `--brass` (`#AD8A4E`) — Warm brass linework.
* **CTAs & Highlights**: `--claret` (`#7A2839`) — Deep wine.
* **Text (Light Backgrounds)**: `--ink` (`#23201B`) — Dark charcoal.
* **Text & Highlights (Dark Backgrounds)**: `--parchment` (`#F4EFE2`) — Soft off-white.

### Typography
* **Headings / Signature Dish Names**: *Fraunces* (warm serif)
* **Body / Nav UI**: *Archivo* (clean sans-serif)

---

## ✨ Features

1. **Pakistan Standard Time (PKT) Hours status**:
   - Calculates time offset dynamically based on PKT (UTC+5) to show an **"Open Now"** or **"Closed Now"** badge on the screen.
   - Weekdays (Mon–Thu) close at 12:00 AM, and Weekends (Fri–Sun) close at 1:00 AM.
   - Highlights the current day row on the visitor schedule table automatically.
2. **Instant Reservations Integration**:
   - Form checks input details and compiles them into pre-formatted, URL-encoded templates.
   - Prompts user to send the booking immediately via **WhatsApp Chat** (popular in Pakistan) or standard **Email** for easy administrative confirmations.
3. **Animated Trellis & Monograms**:
   - Displays custom inline SVG paths of climbing ivy vines and iron pergolas.
   - Animations trigger page-load drawing strokes and scroll-controlled reveal transitions.
4. **Mobile Navigation Bottom Bar**:
   - Displays a sticky action bar on mobile screens with quick-access **Call Now** and **Order Online** buttons for high conversion.
5. **SEO & Accessibility**:
   - Standard semantic structure with Open Graph tags.
   - Configured `Restaurant` Schema JSON-LD structured data for Google Search rich cards.
   - Focus outline highlights, color-contrast considerations, and full `prefers-reduced-motion` safety fallbacks.

---

## 📁 Directory Structure
```text
/
├── index.html       # Main semantic markup, SEO, JSON-LD Schema
├── styles.css       # Layout grid, typography, custom animations
├── app.js           # PST hours logic, gallery filtering, form submissions
├── README.md        # Project guide & verified details
└── images/          # Editorial photograph assets
    ├── ambiance.jpg         # Conservatory backdrop
    ├── oxford-chicken.jpg   # Signature Oxford Chicken dish
    ├── high-tea.jpg         # Multan High Tea platter
    └── sizzling-brownie.jpg # Sizzling brownie skillet
```

---

## 🚀 Running the Project Locally

The project consists of static files and runs directly in any browser. To test interactive features (like hours calculation, form submits, and scroll entries) accurately, serve it locally using a lightweight server:

### Option A: Using Python (Recommended)
Open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then navigate to: **[http://localhost:8000](http://localhost:8000)**

### Option B: Using Node (npx)
Open a terminal in the project directory and run:
```bash
npx -y serve -p 8000
```
Then navigate to: **[http://localhost:8000](http://localhost:8000)**

---

## 📌 Verified Business Information
Ensure these values remain identical if updating:
* **Address**: 35-A, Gulgasht Colony, Multan, Pakistan
* **Phone**: `+92 322 2247111`
* **Email**: `londoncourtyard1@gmail.com`
* **Map Coordinates**: `30.216731, 71.469842`
* **Price Range**: Rs. 2,000–3,000 per person
* **Services**: Dine-in, Takeout, Delivery, Smoking lounge available
