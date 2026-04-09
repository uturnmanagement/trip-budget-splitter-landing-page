
# Trip Budget Splitter — Landing Page

This is a simple pre-launch landing page for "Trip Budget Splitter". Now includes a local backend for waitlist submissions.

Files:
- [index.html](index.html) — main page
- [styles.css](styles.css) — styling
- [script.js](script.js) — interactions and form submission
- [server.js](server.js) — Express server with SQLite backend
- [package.json](package.json) — dependencies

## Setup and Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **View the landing page:**
   Open your browser and go to: http://localhost:3000

4. **Access the admin page to view leads:**
   Go to: http://localhost:3000/admin

- `config.js` controls the frontend API base URL for local or deployed backends.
- `vercel.json` configures the static frontend deployment.

Editable sections (easy to change):
- **Hero:** Update headline, subheadline, and CTAs in [index.html](index.html) (top).
- **Features:** Edit cards under the `#features` section.
- **Mock Preview:** Modify content inside `.mock-card` elements in the hero or mock section.
- **FAQ:** Edit/add `<details>` blocks inside `#faq`.

Editable sections (easy to change):
- Hero text and CTAs in `index.html` near the top of the file
- Feature cards in the `#features` section
- Mock preview content inside the `.mock-card` elements
- FAQ content inside the `#faq` section (use `<details>` blocks)
