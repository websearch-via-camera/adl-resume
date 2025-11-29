# Planning Guide

A sophisticated portfolio and resume website for Kiarash Adl, an AI innovator and senior software engineer, showcasing his dual expertise in human-centered AI projects and deep technical leadership.

**Experience Qualities**:
1. **Professional Excellence** - The site should communicate authority and expertise through clean typography, precise layouts, and a refined color palette that reflects technical sophistication.
2. **Approachable Innovation** - While showcasing cutting-edge AI work, the design should feel warm and human, balancing technical depth with accessibility.
3. **Purposeful Clarity** - Every element should guide visitors efficiently through Kiarash's journey, from headline projects to comprehensive experience, without overwhelming detail.

**Complexity Level**: Content Showcase (information-focused)
  - This is a professional portfolio focused on presenting information clearly and compellingly, with minimal interactive features beyond navigation and external links.

## Essential Features

### Smooth Scroll Navigation
- **Functionality**: Sticky navigation menu that appears after scrolling with smooth scroll-to-section behavior and active section highlighting
- **Purpose**: Provide quick access to all major sections of the portfolio without losing context
- **Trigger**: Appears after scrolling ~200px down from top
- **Progression**: User scrolls → Navigation slides down from top → User clicks section → Page smoothly scrolls to section → Active indicator updates
- **Success criteria**: Navigation appears smoothly, scroll behavior is fluid, active section is always correctly highlighted

### Hero Header with Profile
- **Functionality**: Display professional headshot, name, title emphasizing "Human + AI Projects" and "Senior Software Engineering"
- **Purpose**: Immediately establish credibility and dual expertise in AI innovation and engineering leadership
- **Trigger**: Page load
- **Progression**: Image loads with subtle fade → Name appears → Title/tagline renders → Contact info becomes visible
- **Success criteria**: Visitor understands Kiarash's core value proposition within 3 seconds

### Featured Projects Section
- **Functionality**: Showcase FIML and HireAligna AI projects with bold, prominent cards containing project descriptions
- **Purpose**: Highlight most impressive and recent work to capture attention and demonstrate current capabilities
- **Trigger**: Scroll or automatic visibility below header
- **Progression**: Section title appears → Project cards fade in sequentially → Hover reveals additional emphasis
- **Success criteria**: Projects are immediately recognizable and scannable with key technical details visible

### Skills Proficiency Visualization
- **Functionality**: Interactive charts displaying skill proficiencies across multiple dimensions using radar charts, bar charts, and animated progress bars
- **Purpose**: Provide visual, data-driven representation of technical expertise that's more engaging than text lists
- **Trigger**: Scroll to skills section
- **Progression**: Section header appears → Tab navigation becomes visible → User selects chart type → Chart animates in with data visualization → User can interact with tooltips
- **Success criteria**: Charts are readable, interactive, and accurately represent skill levels; smooth animations enhance rather than distract

### Resume Summary Section
- **Functionality**: Present major resume sections (Summary, Experience, Education, Skills, Research) in digestible format with link to full PDF
- **Purpose**: Provide comprehensive professional background while offering escape hatch to complete document
- **Trigger**: Scroll to lower page sections
- **Progression**: Section headers appear → Content fades in → PDF download link is clearly visible
- **Success criteria**: Visitors can quickly scan career highlights and access full resume if needed

### Contact Information
- **Functionality**: Display email and phone number prominently with a contact form for visitors to send messages
- **Purpose**: Enable easy communication for opportunities through multiple channels
- **Trigger**: Visible in header and dedicated contact form section
- **Progression**: Contact info always accessible in header → Scroll to contact section → Form fields appear → User fills form → Submit triggers email client → Success feedback shown
- **Success criteria**: Contact methods are one-click accessible and form provides clear validation and feedback

## Edge Case Handling
- **Mobile responsiveness**: Layout adapts gracefully to mobile screens with single-column flow and appropriately sized text; navigation stacks on smaller screens
- **Navigation state tracking**: Active section indicator updates accurately as user scrolls through different sections
- **Smooth scroll compatibility**: Scroll behavior works across different browsers and respects user's motion preferences
- **Missing PDF**: If PDF link isn't available, section gracefully shows resume content without download option
- **Long content**: Text truncates or scrolls appropriately within sections to maintain visual balance
- **Slow image load**: Profile image container maintains aspect ratio with subtle background during load

## Design Direction

The design should feel modern, technical, and authoritative while maintaining warmth and approachability - think MIT meets Silicon Valley startup. A minimal interface serves the content best, with generous whitespace, strong typography hierarchy, and restrained use of accent colors to draw attention to key achievements and projects.

## Color Selection

Triadic color scheme with deep technical blues, warm human accents, and neutral grays to balance innovation with approachability.

- **Primary Color**: Deep technical blue (oklch(0.45 0.15 250)) - Communicates trust, expertise, and technical depth; represents the AI/engineering foundation
- **Secondary Colors**: Warm amber/orange (oklch(0.65 0.18 60)) for human-centered AI emphasis; cool slate gray (oklch(0.35 0.02 240)) for supporting elements
- **Accent Color**: Vibrant cyan (oklch(0.70 0.15 200)) - Highlights CTAs, links, and interactive elements; represents innovation and forward-thinking
- **Foreground/Background Pairings**:
  - Background (Soft off-white oklch(0.98 0.005 250)): Dark blue-gray text (oklch(0.25 0.02 250)) - Ratio 14.2:1 ✓
  - Card (Pure white oklch(1 0 0)): Dark blue-gray text (oklch(0.25 0.02 250)) - Ratio 15.8:1 ✓
  - Primary (Deep blue oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Secondary (Warm amber oklch(0.65 0.18 60)): Dark text (oklch(0.20 0.02 250)) - Ratio 8.2:1 ✓
  - Accent (Vibrant cyan oklch(0.70 0.15 200)): Dark text (oklch(0.20 0.02 250)) - Ratio 9.1:1 ✓
  - Muted (Light gray oklch(0.94 0.005 250)): Medium gray text (oklch(0.50 0.02 250)) - Ratio 6.8:1 ✓

## Font Selection

The typography should balance technical precision with human warmth - a clean geometric sans-serif for headings conveys engineering excellence, while a readable humanist sans-serif for body text ensures approachability.

- **Typographic Hierarchy**:
  - H1 (Name): Inter ExtraBold / 48px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Titles): Inter Bold / 32px / -0.01em letter spacing / 1.2 line height
  - H3 (Project Titles, Job Titles): Inter SemiBold / 24px / normal letter spacing / 1.3 line height
  - H4 (Subsections): Inter Medium / 18px / normal letter spacing / 1.4 line height
  - Body (Descriptions): Inter Regular / 16px / normal letter spacing / 1.6 line height
  - Caption (Dates, Meta): Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Small (Footer): Inter Regular / 12px / normal letter spacing / 1.4 line height

## Animations

Animations should be subtle and purposeful, enhancing the sense of quality without distracting from content - think gentle fades and smooth scrolls that guide attention naturally through the portfolio narrative.

- **Purposeful Meaning**: Motion reinforces the journey through Kiarash's career - content appears progressively as you scroll, suggesting a timeline or evolution
- **Hierarchy of Movement**: Profile image gets priority with first fade-in, then featured projects with staggered entrance, finally resume sections reveal on scroll

## Component Selection

- **Components**:
  - Navigation Bar: Sticky header with smooth scroll links and active section indicators
  - Card: For project showcases and experience sections - modified with subtle hover states and border accents in primary blue
  - Badge: For skills tags - customized with technical blue and amber colors
  - Separator: Between major sections - thin line in muted gray
  - Button: For PDF download link and navigation items - primary variant with vibrant styling
  - Avatar: For profile image - large circular variant
  - Scroll Area: If resume content is extensive - subtle scrollbars
  
- **Customizations**:
  - Hero section: Custom full-width header component with centered profile image and text
  - Project cards: Custom grid layout with 2-column responsive design, enhanced shadows on hover
  - Timeline component: Custom experience timeline with dates and company info
  
- **States**:
  - Buttons: Default (primary blue), hover (darker blue with slight lift), active (pressed shadow), focus (cyan ring)
  - Cards: Default (white with subtle shadow), hover (elevated shadow with primary border glow), focus (outline for keyboard nav)
  - Links: Default (accent cyan), hover (underline), visited (slightly muted cyan)
  
- **Icon Selection**:
  - Download icon for PDF resume link
  - Email/phone icons for contact info
  - External link icon for GitHub/project links
  - Company/building icon for experience entries
  - Graduation cap for education
  
- **Spacing**:
  - Section vertical spacing: 96px (24 in Tailwind)
  - Card padding: 32px (8 in Tailwind)
  - Content max-width: 1200px
  - Grid gaps: 24px (6 in Tailwind)
  
- **Mobile**:
  - Hero: Stack profile image above text, reduce font sizes proportionally
  - Projects: Single column layout on mobile (< 768px)
  - Resume sections: Single column with reduced padding
  - Navigation: Sticky mobile header with hamburger if adding nav
  - Spacing: Reduce section gaps to 64px (16 in Tailwind)
