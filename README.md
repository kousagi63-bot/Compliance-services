# Stackly — Compliance Solutions Landing Page

A pixel-perfect implementation of the **Stackly** regulatory compliance landing page, faithfully matching the Figma reference designs down to typography, color palette, component hierarchy, copy, and layout.

## Design Details

- **Typography**:
  - **Headings & Editorial**: `Fraunces` (Google Font: elegant high-contrast serif)
  - **Overlines, Step numbers, Badges**: `IBM Plex Mono` (Google Font: technical monospace)
  - **Body & Actions**: `Inter` (Google Font: crisp UI sans-serif)
- **Palette**:
  - **Downriver Canvas**: `#070913` (Deep midnight dark background)
  - **Hero Ambient Glow**: `#7C3AED` / `#4F46E5` radial blur
  - **Biscay Blue**: `#153356` (Call-to-Action banner)
  - **Equator / Hokey Pokey**: `#D4A348` (Gold accent, badges, buttons)
  - **Albescent White / Athens Gray**: `#F8F9FA` / `#F1F3F5` (Light background sections)
  - **Dark Cards**: `#0C101D` with `#1C2538` borders

## Page Sections Included

1. **Fixed Header & Navigation**:
   - Stackly logo mark & typography
   - Navigation links: Home, Services, About, Insights, Contact
   - "Client Portal" outline pill button
   - "Schedule Consultation" gold accent pill button
   - Mobile hamburger menu and drawer
2. **Hero Section**:
   - "Regulatory Advisory • Est. 2008" pill badge with pulsating indicator
   - "Compliance solutions for regulated enterprises" headline
   - Subtitle on audit, examination, and due diligence
   - "Schedule Consultation →" and "Explore Services" buttons
   - Proof bar: PCI DSS Mastery, ISO 27001 Lead Auditors, SOC 2 Practitioners, IAPP Qualified Member
3. **Why Stackly**:
   - 4-card grid: Expertise, Track Record, Technology, Support
4. **Services (Light Section)**:
   - Data Privacy & GDPR Compliance
   - SOX Compliance
   - HIPAA Compliance
   - "Explore All Services" CTA button
5. **How It Works (Dark Section)**:
   - 5-stage sequential engagement model: 01 Assessment, 02 Strategy, 03 Implementation, 04 Monitoring, 05 Reporting
6. **Client Perspective (Light Section)**:
   - Testimonials with 5-star ratings from CFO (Heliosync Corp), General Counsel (Northbridge Hire), and Head of Risk (Canvas Health)
7. **Insights (Dark Section)**:
   - 3-card grid: EU AI Act, SOX Programmes Drift, DORA Third-Party Registers
   - "View All Articles" CTA
8. **Call to Action Banner (Biscay Blue)**:
   - "Ready to strengthen your compliance posture?"
   - "Schedule a Call" and "Download Compliance Guide" buttons
9. **Footer (Dark Section)**:
   - Stackly bio, LinkedIn link
   - Services column, Company column, Contact info (email, phone, NYC address)
   - "Monthly regulatory brief" newsletter subscribe form
   - Legal copyright & notice links
10. **Interactive Modal & Toasts**:
    - Consultation request modal with form inputs
    - Toast feedback for interactions

## How to View

You can open `index.html` directly in your browser:
```bash
open index.html
```

Or run a local static server:
```bash
python3 -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.
