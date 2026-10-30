# Grease Busters: complete landing page (V4)

A responsive, single-page website for Cape Town food truck cleaning. The original mascot logo and truck artwork are preserved. No build step, package installation, paid theme or external font is required.

## Open the website

Extract the ZIP and open `index.html` in a browser. Keep the `assets` folder and `site-config.js` beside it. The separately supplied standalone preview contains the images, styles and scripts in one HTML file for easy viewing.

## What is included

- Who Grease Busters is and the family business roots in 2012.
- The new-generation relaunch, purpose and food-truck-only focus.
- Basic, Standard and Deep cleaning packages with starting prices of R800, R1,200 and R1,800.
- A pricing explanation covering the agreed cleaning price and separately confirmed call-out fee.
- A calculator showing the 35% deposit and 65% balance on an approved quote total.
- Booking requests, 48-hour notice information and the 10% referral offer supplied by the owner.
- The family's community work, including Nondzaba Foundation, Lwando and Gugulethu Athletic Club.
- Support for food, education, disability inclusion and sporting opportunities, as described by the owner.
- Festival and carnival food truck work, local cleaning partners and future growth goals.
- Locally sourced product information and general cleaning tips with source links.
- WhatsApp and email contact, a preferred-date field and an enquiry-message builder.
- Mobile navigation, a mobile quick-contact bar, keyboard focus states and no-JavaScript contact fallbacks.

## Contact details used

WhatsApp: 067 721 4589 (international link: 27677214589)

Email: greasebusters2026@gmail.com

Area: Cape Town, South Africa

Availability: on request, subject to confirmation

## What actually works now

The enquiry builder validates the customer's details and prepares a message. The customer opens WhatsApp or their email app, reviews it and presses Send. A copyable message is also shown as a fallback. The page does not send automatically, store form responses or email the business from a server.

Photos are sent separately through WhatsApp. There is no pretend file-upload field. The preferred-date control is a request only, not a live availability calendar. No booking is automatically reserved or confirmed.

The deposit calculator only splits an entered quote total. It does not issue a quote, charge a card or verify a payment.

The page explains the manual iKhokha payment-link process. No live payment integration, API credentials, payment callback or automatic booking system is installed.

## Add your real Google Form or calendar later

Edit `site-config.js`. Paste only the real public form or booking-page URL inside the corresponding empty quotes:

- `googleFormUrl`: your actual Google Form link.
- `calendarBookingUrl`: your actual Google Calendar booking-page link.

The buttons remain hidden until a recognised HTTPS URL is supplied. These are external links, not embedded forms. The script accepts Google Forms links on docs.google.com or forms.gle and Google Calendar links on calendar.google.com or calendar.app.google.

A Google Form and calendar must be created and configured in your own account. Check who receives notifications, whether photo uploads require sign-in, and how enquiries become confirmed bookings. Do not expose a private calendar or collect personal information in a public spreadsheet.

## Add the correct community logos

The organisations are currently identified by name, not by invented or recreated logos. The public wording does not present them as sponsors or formal endorsers.

When you have the correct artwork and approval to display it, put each PNG, JPG or WebP in `assets/`, then set the corresponding file path in `site-config.js`:

- `nondzabaLogo`
- `gugulethuLogo`

Only local files inside `assets/` are accepted. There is no blank or broken logo placeholder in the public layout.

## Facts to confirm before public launch

The business history and community involvement were written from the owner's account, not independently verified as business achievements. No donation amounts, beneficiary counts, event names, awards, testimonials, company-registration numbers, street addresses or nationwide service coverage were invented.

The wording deliberately says the family business has roots in 2012. It does not claim that the Grease Busters brand was registered then or traded continuously since then.

Confirm the starting prices and package inclusions before publishing. They were carried forward from the previous drafts. The deposit examples apply to the starting cleaning prices before any call-out charge. Confirm your VAT position and wording separately; the website makes no VAT-registration claim.

Confirm the full cancellation, refund and rescheduling terms and supply them to customers before payment. No forfeiture or automatic-refund rule has been invented. The referral eligibility and redemption policy have not been expanded beyond the owner's 10% offer.

The owner described locally sourced products. No product names, chemical dilution rates or certificates were provided. The site therefore contains no blanket 'SABS approved' claim and displays no SABS logo. Approval must be checked against the specific product and any mark usage requirements before certification branding is added.

## Low-cost public hosting

Keep the source files in your GitHub repository. For the public commercial website, use a host that supports that purpose, such as Cloudflare Pages. GitHub's current Pages policy restricts using Pages as free hosting to run an online business or a website primarily facilitating commercial transactions. Earlier instructions in the chat to use GitHub Pages for the business should not be treated as a hosting-policy approval.

### Direct upload to Cloudflare Pages

1. Sign in to your own Cloudflare account and open Workers & Pages.
2. Choose the Pages upload flow: Create application, Get started, then Drag and drop your files. UI labels can change; choose the option for deploying existing static assets.
3. Name your project and upload this ZIP, or its extracted contents, with `index.html` at the top level.
4. Deploy and use the public address returned by Cloudflare. Do not assume a project name or public URL is available until the service confirms it.
5. Open that exact address on desktop and mobile and test the WhatsApp and email hand-offs before sharing it.

A direct-upload Pages project cannot be switched to Git integration later; a new project is needed for that workflow. To have GitHub commits publish automatically from the beginning, choose Cloudflare's Git integration instead. This is a plain HTML site with no framework and no build dependencies.

Cloudflare has a free Pages plan subject to its limits. There is no need to purchase a custom domain to use the public pages.dev address it assigns. This deliverable has not created an account, uploaded files or published a live site.

### Save a copy in GitHub

Upload all extracted files and the `assets` folder to the root of `grime-busters-website`, replacing the previous version. Do not upload just the ZIP, and do not put `index.html` inside an extra parent folder.

The `_headers` file supplies basic security headers on Cloudflare Pages. Other hosts may ignore it. The `.nojekyll` file is harmless on hosts that do not use Jekyll.

## Payments and private keys

Start with quote-specific iKhokha payment links after you agree on the scope and date. Check the payment in your own iKhokha account before confirming a booking. A screenshot or redirect alone is not payment verification.

Do not put a secret API key, signing key, access token, webhook secret or private customer information into HTML, browser JavaScript, `site-config.js`, README files or a public GitHub repository. A future automated checkout needs a server-side integration that validates the amount and quote, verifies the payment notification, and prevents duplicate booking/payment processing. That backend is not included here.

## File map

- `index.html`: public copy and page structure.
- `assets/styles.css`: responsive layout, colours and print styling.
- `assets/site.js`: navigation, deposit arithmetic and contact hand-off.
- `site-config.js`: optional public links and authorised community-logo paths.
- `assets/logo.webp`: the existing mascot logo.
- `assets/truck.webp`: the existing truck artwork and watermark.
- `assets/favicon.png`: the existing browser icon.
- `_headers`: Cloudflare static-host security headers.
- `.nojekyll`: static-file marker.
- `README.md`: setup and factual-review notes.

## Checks performed

Rendered and inspected at desktop, laptop, tablet and phone widths: 1440, 1024, 768, 390 and 320 CSS pixels. Checked for page overflow, missing images, JavaScript errors, package preselection, deposit arithmetic, invalid input, mobile navigation and no-JavaScript fallbacks. Outbound contact messages were intercepted in tests; no customer enquiry was sent.

Browser navigation to local files and localhost is restricted in the build environment, so the visual and interaction tests used the self-contained copy loaded directly into Chromium. The final hosting provider, email delivery, WhatsApp account, Google integrations and iKhokha merchant configuration still require real-world checks.

## Sources for technical and cleaning guidance

Checked 12 October 2026. The sources below support platform setup and general advice, not the owner's history or claimed collaborations.

- Cloudflare Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Cloudflare Pages free-plan limits: https://developers.cloudflare.com/pages/platform/limits/
- GitHub Pages usage restrictions: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- iKhokha Pay Link: https://www.ikhokha.com/pay-link
- Cleaning and sanitising guidance: https://www.act.gov.au/business/food-safety-for-businesses/handling-preparing-and-storing-food/cleaning-and-sanitising-food-premises-and-equipment
- CDC chemical-safety guidance: https://www.cdc.gov/hygiene/about/how-to-clean-and-disinfect-early-care-and-education-settings.html
- SABS advice on checking approval claims: https://www.sabs.co.za/sabs-comments-on-the-illegal-use-of-its-mark-on-sanitizers
- Nondzaba Foundation's own website: https://nzafoundation.org.za/
- Western Province Athletics club listing: https://wpa.org.za/wpa-club-list/
