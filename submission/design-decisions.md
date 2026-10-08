# Design decisions

The landing page treats Crystal Kizor as the connecting person, with architecture anchoring the visual narrative. Studio COKA leads the work section; the ecosystem then gives every initiative a clear place under four purpose-based pathways. These labels supplement official names.

Oversized serif typography, architectural rules, ivory surfaces and restrained sage accents create an exhibition-like rhythm. The hero offers two immediate destinations. Project enquiries, partnerships, speaking and other conversations remain distinct at the finale. Supplied portraits, identity and three project series provide visual evidence; unresolved initiative imagery and destinations remain explicitly labelled.

Desktop visitors get a pinned project sequence and sticky initiative preview. Mobile visitors get stacked projects and a keyboard-accessible accordion. Motion uses a shared GSAP token system; the short, skippable introduction and architectural wireframe establish atmosphere without becoming navigation requirements. Reduced-motion visitors receive a static experience, and WebGL is optional.

React, TypeScript and Vite keep this frontend maintainable and deployable as static files. Content lives in typed data files, CSS Modules contain component styling, and the Three.js scene loads separately. Semantic landmarks, visible focus and unavailable-link states support understandable journeys across input methods.
