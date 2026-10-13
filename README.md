# SK Beauty Spot — Full Cinematic Website

A responsive single-page beauty studio website built with **HTML, CSS and JavaScript**, inspired by the structural flow of Queen Bee Beauty Studio but customized for SK Beauty Spot. No Node.js, build pipeline, server API or paid library is required.

## What's included

- Supplied **SK Beauty Spot cinematic logo-reveal video** as an 8-second opening intro. It plays once per browser tab, can be skipped, and can be replayed from the homepage.
- Supplied salon video trimmed to the hair-styling footage for the looping hero, plus a play/pause control.
- Transparent PNG version of the supplied logo (cropped to its visible artwork, not a solid black background).
- Luxury white / ivory / gold theme; Montserrat headings/navigation and elegant Cormorant Garamond details.
- Sections: Home, About, Latest Looks (15 filtered images + pop-up photo viewer), Luxury Services (12 cards), Our Outlet, Opening Hours, Our Experience, Signature Services, Artistry, Why Choose Us, Happy Clients, Get in Touch + Google Maps, WhatsApp enquiry, and Footer.
- Mobile menu, responsive image galleries, scroll effects, smooth anchors, back-to-top, and floating WhatsApp button.

## Start on Windows

1. Extract the ZIP file.
2. Open `SK_Beauty_Spot_Full_Website` in Visual Studio Code.
3. For a simple local preview, double-click `index.html`. For the most reliable video preview, open a terminal in the project folder and run:

   ```powershell
   py -m http.server 8000
   ```

4. Visit `http://localhost:8000` in Chrome.

You can also deploy all the files to GitHub Pages, Netlify, or other static hosting. **The homepage is `index.html`**.

## Edit business contact details (important)

Open **`assets/js/config.js`** and change:

- `phoneDisplay`: currently `+91 90000 00000` (temporary dummy number).
- `phoneDigits`: currently `919000000000` (dummy WhatsApp/call number, with country code).
- `instagramUrl`: currently points to Instagram's homepage, not the business's account.
- `enquiryGreeting`: customizable WhatsApp enquiry text.

The map uses the coordinates you supplied: `9.8796279, 78.0567816`. If the location needs correction, edit the Google Maps links and iframe in `index.html`.

## Replace image references before going live

- Beauty gallery and services use temporary **remote images from images.unsplash.com**. Internet is necessary for these to appear. Replace with real SK Beauty Spot photos whenever available.
- The **Our Outlet** images are expressly marked as style references, **not pictures of the actual SK studio**.
- The **Artistry** images are beauty inspiration, not photographs or identities of your employees.
- No unverified customer reviews, team names, working hours or service prices have been invented. Opening hours show **PLEASE ENQUIRE** until you supply the actual schedule. The Happy Clients section showcases brand promises instead of fake reviews.
- Replace demo service descriptions to match the business's *actual* services before publication.

To replace an image: find its `https://images.unsplash.com/...` URL in `index.html`, change it to a path such as `assets/images/my-bridal-look.jpg`, and add that image file to `assets/images/`. Gallery tiles have **two image URLs**: the thumbnail `src` and the larger `data-image` for pop-up viewing; update both.

## Files

```text
SK_Beauty_Spot_Full_Website/
├── index.html
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/config.js
    ├── js/main.js
    ├── images/
    │   ├── sk-beauty-spot-logo.png
    │   ├── hero-poster.jpg
    │   └── photo-fallback.svg
    └── video/
        ├── sk-logo-intro.mp4       (your supplied entrance video)
        └── salon-hero.mp4          (hair-styling clip from your supplied second video)
```

### Important before launch

The design and front-end interactions are ready for customization. Replace the dummy number, link to the exact Instagram account, confirm official service offerings, prices and opening times, and replace stock/gallery placeholders with authorized SK Beauty Spot photography. The enquiry form opens WhatsApp and **does not store bookings** or send email.


## Mobile-first refinement
- A persistent bottom bar on phone screens has Instagram, WhatsApp, and Book Now actions.
- Desktop includes a floating Instagram button above WhatsApp.
- Both desktop and mobile navigation link to Instagram (configured in `assets/js/config.js`).
- Mobile typography uses a consistent Cormorant Garamond editorial headline style and readable Montserrat text. Form fields are 16px to prevent automatic zoom on iPhone.
- Gallery filters scroll horizontally on phones. Outlet photos swipe horizontally; no outlet images are hidden.
- Tap targets, margins, small phones, notch/safe-area insets, and overflow have been reviewed.
- The Instagram URL remains a temporary placeholder; replace it in `assets/js/config.js` with the **actual business profile URL** before publishing. Same for the placeholder phone number.


## Royal black-and-gold update (13 October 2026)

- Scroll-triggered navbar is nearly black with gold links and a subtle glowing gold active item.
- Mobile slide-down navigation uses the same black-and-gold colors.
- Instagram and WhatsApp shortcuts are icon-only on desktop, tablet/mobile and footer; their accessible labels remain available for screen readers.
- Curated newer Indian beauty/bridal portrait imagery replaces older dated/pink-toned photos in the about, gallery, services, signature, artistry and lifestyle sections; hair/nail-specific imagery and salon interiors remain contextually appropriate.
- Elegant card reveals, staggered entrance animations, polished hover zoom, subtle gold CTA shimmer and reduced-motion support.
- Photos are hosted on Unsplash URLs and require an internet connection, as requested for easy future swapping. These are temporary inspiration images, not actual SK Beauty Spot portfolio work. Replace with authorized client photographs for production.
- Update instagramUrl and phoneDigits in assets/js/config.js before publishing.
