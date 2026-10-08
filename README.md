# Crystal Kizor

A frontend-only digital exhibition connecting architecture, objects, education, ideas and purpose. “Beyond Form. Into Meaning.”, “Building Beyond Buildings.” and “Design is more than what we build. It is what we make possible.” are proposed creative copy, not verified quotations.

## Run

Requires Node 22.12+; built here with Node 24. From the project folder:

```sh
npm ci
npm run assets
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

The development server normally uses http://localhost:5173; preview uses http://localhost:4173. XAMPP/PHP is not required. Restricted-workspace installation used `npm install --cache .npm-cache`. Run `npm run assets` when supplied images change; generated files are already included.

## Architecture

React 19, strict TypeScript and Vite build static files. GSAP, ScrollTrigger, SplitText and scoped `useGSAP` own motion. Lenis uses the GSAP ticker. Three.js and React Three Fiber v9 provide one optional architectural hero scene; Drei is installed without unused helper imports. Lucide supplies icons. CSS Modules share global tokens. Latin Cormorant Garamond and Manrope are self-hosted; only two above-fold normal fonts are preloaded. Sharp generates image derivatives.

`src/sections` contains eight page sections. `src/components` contains layout, UI, motion and WebGL. `src/data` contains content, navigation and asset mappings; `src/types/content.ts` models verified/placeholder states. `src/lib` contains registration, tokens and analytics. `scripts` contains optimization and browser QA. `submission` holds the written responses. There is no backend, CMS, router or fake submission flow.

## Sources and content integrity

The assessment PDF has been read and checked against the seven initiative descriptions and written submission limits. The PDF specifies **10pm, Saturday 10 October 2026**; the earlier master prompt's 4pm reference differs. The PDF's requests for a deployed link and source submission are reference requirements, not authorization to publish or send anything.

The asset inventory contains **32 source images**: six supplied portraits, one logo collection, 13 Nature Home views, five Community Centre views and seven Nature Home 2 views. All are represented in the page and interactive galleries. Originals in `Crystal_s_pictures` and `Other_assets` remain unchanged.

Names for the three project series come from folder names. Their narratives describe visible imagery. No location, completion date, award or unsupported project credit is invented. Studio COKA attribution for Nature Home is visible in its supplied imagery. Other series remain labelled as supplied design imagery until full credits are approved. Images carry verified status because they were supplied; this does not assert built status for renders.

Studio COKA, personal ideas and speaking have useful internal destinations. Unprovided external and enquiry links remain disabled-style controls with `aria-disabled="true"`, no href, and a “Link coming soon” tooltip. ELEvated product and AKO/Alive and Free community-specific imagery remain clearly labelled placeholders. No supplied architecture imagery is misrepresented as AKO or faith community work.

## Edit content and assets

Edit `siteContent.ts` for biography, themes and enquiry routes; `brands.ts` for initiative destinations; `projects.ts` for the three series; `articles.ts` for verified publications. `assetManifest.ts` assigns imagery to slots. `assetInventory.json` maps every supplied file to its use, alt text and dimensions. `suppliedAssets.json` contains generated responsive URLs and statuses.

| Source | Use |
| --- | --- |
| Architectural Studio Portrait | Hero and social preview |
| Poised in a Warm Design Studio | About |
| Confident Designer in Studio Workspace | About editorial composition |
| Architectural Designer in Her Studio | Perspectives |
| Cozy Architecture Podcast Workspace | Speaking and education preview |
| Earthy Editorial Portrait | Personal brand preview |
| Logo Collection | Supplied header wordmark, intro monogram, signature, primary mark, identity panel and favicon |
| Nature Home, Community Centre, Nature Home 2 | Three cinematic project panels and all 25 gallery images |

`npm run assets` processes the hero first and creates WebP candidates at 640, 960, 1440 and 2000px, capped at original resolution. It never enlarges small originals. It extracts original logo artwork into transparent light/dark PNGs and produces a portrait/wordmark social JPEG. Outputs are in `public/assets/{portraits,projects,brands}`. Hero photo alone is eager/high-priority; editorial and gallery imagery is lazy. Srcsets/sizes describe actual emitted variants. Original source folders are preserved; they need not be uploaded to hosting.

## Motion and fallbacks

Tokens are in `src/lib/motion.ts`. A session-only, skippable intro uses the supplied monogram and five lifting strips. Its lift overlaps one hero entrance timeline: portrait clip reveal, image settle, headline rise, supporting content and scroll cue. **Separate DOM layers own entrance and scroll transforms**, preventing competing hero tweens. On desktop the headline drifts, portrait zooms, camera dollies and a diagonal seam introduces About. Focused section anchors remain at the header offset rather than being moved again by the focus handler.

Desktop fine-pointer visitors receive three pinned project wipes, cursor ring and magnetic CTA. Project links open real internal galleries with keyboard-operable thumbnails and next/previous controls. Ecosystem changes cancel preceding animations; mobile uses a single-open accordion. Community panels have gentle motion. Menu focus is trapped, main/footer become inert, Escape closes it and focus returns to its button.

`?motion=off` disables motion. `?markers=1` exposes text/project debug markers. Reduced motion disables intro, Lenis, WebGL, pins, parallax and cursor effects. Mobile keeps simpler reveals and the accordion. The header follows section themes and returns when focused. Browser history, keyboard scrolling and off-screen focused controls are accommodated.

The WebGL chunk loads after paint only on eligible desktop widths of at least 1200px, with enough logical processors, no Save-Data, motion allowed and WebGL support. It limits DPR to 1.5, pauses off-screen/when hidden and disposes resources. An architectural SVG and error boundary supply a fallback. A four-second boot failsafe dispatches a safe reveal event instead of directly deleting React-owned nodes. If the app fails to load, it inserts the honest static content. No-JavaScript visitors receive all eight sections and seven initiatives as readable static text; this is not prerendering.

## Analytics

The typed adapter is a no-op until a real `VITE_GA4_ID` is set, honours Do Not Track and sends only project/brand/route identifiers. Review the applicable consent requirements before enabling it. No fake ID or enquiry data is used.

Events: `hero_explore_work`, `hero_discover_brands`, `project_open`, `ecosystem_select`, `brand_external_click`, `speaking_enquiry_click`, `contact_route_click`. `contact_submit` is typed but not emitted without an actual submission flow. Placeholder actions never emit conversion events.

## Deployment

For Vercel or Netlify, import the repository, choose Vite, use `npm run build`, and publish `dist`. Use `npm ci` for installation. No server environment is needed; GA4 is optional. The current build targets a domain root. For subdirectory hosting, configure Vite's `base` and root-relative asset URLs together.

Before publishing, set the confirmed absolute canonical URL and absolute social JPEG URL in `index.html`. Replace missing client destinations where available. Person JSON-LD contains only supplied roles/name, with no invented URLs or sameAs claims. `robots.txt` permits indexing. No public deployment or live URL is claimed.

## Remaining client content

- Verified enquiry addresses for architecture/design, partnerships, speaking and other routes.
- Six initiative logos, external destination URLs and approved social links.
- ELEvated product and AKO/Alive and Free community-specific imagery.
- Full project credits, locations/dates where confirmed, and approved extended narratives.
- Verified writing, research and media titles, links and confirmed dates.
- Approval of proposed creative copy and biography, canonical domain and analytics/consent setup.

These appear as `TODO(client)` comments beside the relevant data. Supplied PDF, portrait, personal identity, project imagery and social-image TODOs have been resolved.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm run build` and `npm run preview`. Submission word counts include headings and are checked with `wc -w`; all three files are below their limits.

With preview running:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH="$PWD\.browser-cache"
npx playwright install chromium
node scripts/verify.mjs
node scripts/interactions.mjs
node scripts/hero-check.mjs
node scripts/gallery-check.mjs
```

The matrix checks 320, 375, 390, 768, 1024 and 1440px with normal/reduced motion, captures full-page/viewport screenshots, collects console issues, checks overflow and cycles the menu 20 times per case. Interaction QA covers anchor offsets, rapid hover, roving keyboard focus, focus trapping, tab visibility, resize, accordion and intro skipping/session behaviour. Hero QA records intro timing, photo loading, settled transforms and scroll-return state at mobile/desktop widths. Evidence is written to ignored `qa/`.

Headless matrix runs deliberately disable software GPU to verify SVG/no-WebGL behaviour deterministically. Earlier WebGL-enabled screenshots rendered the scene but produced GPU ReadPixels driver warnings. Hardware smoothness, browser find-in-page and real-device INP remain manual checks. Lighthouse has not been run; performance/accessibility targets are aspirations rather than reported scores. Three.js emits a build size advisory but is absent from initial HTML module preloads and initial static imports.

Verified results: all 12 viewport/motion combinations had no horizontal overflow or console issues; all 25 gallery images decoded successfully and navigation wrapped correctly; the 12 interaction assertions passed. Hero headlines settled to zero translation, portraits loaded, scroll return restored the composition and reduced motion stayed static. Observed intro visibility lasted approximately 1.38–1.58 seconds across 320, 390 and 1440px tests. Submission word counts including headings: design decisions 187/200, AI proposal 259/300, analytics 240/250. TypeScript, ESLint, asset generation and production build pass.

| Final chunk | Raw kB | Gzip kB |
| --- | ---: | ---: |
| Page entry | 92.84 | 24.03 |
| React | 221.90 | 69.05 |
| GSAP | 122.05 | 48.54 |
| Three.js, loaded only when eligible | 880.35 | 237.33 |
| Scene wrapper | 2.12 | 1.12 |
| CSS | 28.09 | 6.52 |
