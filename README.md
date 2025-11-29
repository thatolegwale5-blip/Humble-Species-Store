Humble Species — Static Store

This repository contains a small static storefront for Humble Species.

Quick local steps

1. Open the project folder in VS Code.
2. Run a simple local server (or use Live Server extension) to preview `index.html`.
   - Example (PowerShell):
     - `npx http-server -c-1 .` (if you have Node installed)
3. Commit and push changes to GitHub:

```powershell
git add .
git commit -m "prepare site for deployment"
git push origin main
```

Deploying to Netlify (recommended)

1. Create a free Netlify account at https://app.netlify.com/
2. From the Netlify dashboard click **"New site from Git"** → choose **GitHub** and authorize Netlify to access your repo.
3. Pick the `thatolegwale5-blip/Humble-Species-Store` repository and the `main` branch.
4. Build settings: this is a plain static site — leave **Build command** empty and set **Publish directory** to `/` (or `.`). Then click **Deploy site**.
5. After the first deploy completes, go to **Site settings** → **Domain management** → **Add custom domain** and enter `www.humblespecies.co.za`.

DNS configuration options

A. Use Netlify DNS (recommended if you can change nameservers):
   - In Netlify, choose **Set up Netlify DNS** for your domain and Netlify will provide nameservers.
   - At your domain registrar, replace your current nameservers with the Netlify nameservers shown.
   - Netlify will automatically create the necessary DNS records and provision HTTPS.

B. Use your registrar DNS (CNAME method):
   - In Netlify, under **Domain management** you'll see a DNS target value (e.g. `yoursite-xxxx.netlify.app` or a specific DNS target). Copy the target.
   - At your registrar, create a **CNAME** record for the host `www` pointing to the Netlify DNS target (example: `www` → `yoursite-xxxx.netlify.app`).
   - If you want the root domain (`humblespecies.co.za`) to redirect/point to `www`, create an ALIAS/ANAME or use an A record as your registrar recommends. Some registrars allow forwarding the apex to `www`.
   - After DNS changes, return to Netlify and verify the domain; Netlify will provision SSL for HTTPS.

Search engine indexing

1. Once your site is live on `https://www.humblespecies.co.za`, sign up for Google Search Console and add the property.
2. Use **URL Inspection** to request indexing of your homepage.
3. You can also submit the sitemap at `https://www.humblespecies.co.za/sitemap.xml`.

Files added to this repo

- `robots.txt` — basic allow + sitemap reference
- `sitemap.xml` — includes the homepage
- `netlify.toml` — Netlify publish settings
- `README.md` — this file with deploy instructions

If you'd like, I can:
- Deploy the site for you (I cannot log in to Netlify for you, but I will guide each step interactively).
- Prepare DNS records to paste to your registrar (once Netlify gives a DNS target).
- Verify the site in Google Search Console and request indexing.

Tell me which step you want me to do next and I'll guide you through it.