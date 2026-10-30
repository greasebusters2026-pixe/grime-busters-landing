# Grease Busters: cleaning, municipal readiness and responsible recovery

Static website for the existing `greasebusters2026-pixe/grime-busters-landing` repository. No build dependencies or server are required. Serve the repository root on the existing static host.

## Revamp

- Three service routes: cleaning, inspection-readiness support and planned specialist FOG/recovery work.
- Municipal-readiness page with roles, authorisation, safe delivery and evidence close-out.
- Printable blank service and waste-transfer record; no live client portal or online record storage.
- Institutional enquiries include optional organisation and project/PO reference. The WhatsApp/email handoff is manual; users review and send messages themselves.
- Existing private food truck prices, deposit calculator, contact details and branding retained. Municipal work follows its contract terms.
- Official City logo and descriptive footer tags added at the owner's request. Approval was reported by the owner; the signed agreement was not available for clause-by-clause verification.
- Updated sitemap, metadata and CSP-compatible external styles.

## Files

- `index.html`: services, food truck prices and enquiry builder.
- `municipal-readiness.html`: public service framework and official guidance.
- `impact.html`: planned growth, employment and recovery outcomes.
- `service-record.html`: blank printable record, completed privately after printing.
- `assets/site.js`, `assets/styles.css`: live scripts/styles. Root copies are kept identical for compatibility.
- `site-config.js`: optional public integrations only.
- `docs/municipal-operating-framework.md`: responsibilities, job gates and pending agreement mapping.
- `docs/asset-provenance.md`: official logo source and use context.
- `docs/previous-site-notes.md`: retained previous implementation notes; historical claims and checks are not validation of this revision.

## Verification

Run `node --check assets/site.js` and `python scripts/check_site.py`.
Browser checks cover responsive layouts and enquiry preparation. No enquiry is sent and no payment is processed during testing.

## Contract completion

The public service framework is not evidence of legal compliance. Reconcile the private signed municipal agreement with `docs/municipal-operating-framework.md`, including scope, authority, reporting, supplier evidence, branding conditions and payment terms. Do not commit confidential agreements, customer records, permit identifiers, tax PINs, identity documents or keys to this public repository.
