# Product Requirements Document (PRD)
## The Recruitment Thing - v1 MVP
**Last Updated:** December 8, 2025

---

## Executive Summary

**The Recruitment Thing** is a specialized web application designed for non-technical technical recruiters who need to assess software developer candidates with confidence. The product provides a structured, guided assessment framework that helps recruiters evaluate candidates across Junior, Mid, and Senior levels using pre-defined competencies and scoring systems.

### Core Value Proposition
- **For:** Non-technical technical recruiters
- **Who Need:** Confidence and structure when assessing developer candidates
- **The Product:** A web-based assessment tool with guided questions and intelligent scoring
- **That Provides:** Real-time level determination, comparison tools, and educational context
- **Unlike:** Generic interview tools or spreadsheet-based tracking
- **Our Solution:** Offers domain-specific guidance, automated scoring calculations, and educational rationales for every question

---

## Product Vision & Goals

### Primary Goals
1. **Empower non-technical recruiters** to assess technical candidates professionally and accurately
2. **Provide educational context** through comprehensive rationales for all assessment questions
3. **Automate complexity** by handling score calculations, level thresholds, and comparisons
4. **Enable confident decision-making** through visual data representation and side-by-side candidate comparisons

### Success Metrics
- Time to complete candidate assessment
- Confidence level of recruiters in their evaluations
- Accuracy of level determinations (compared to technical validation)
- Adoption rate among non-technical recruiting teams

---

## User Personas

### Primary Persona: Sarah - Non-Technical Technical Recruiter
- **Background:** 3 years in recruiting, primarily hiring for marketing and sales
- **Current Challenge:** Recently assigned to hire developers, feels overwhelmed by technical jargon
- **Pain Points:**
  - Doesn't understand what makes a "good" developer answer
  - Struggles to differentiate between Junior, Mid, and Senior candidates
  - Fears being fooled by candidates who "talk technical" without substance
  - Needs to justify hiring decisions to technical managers
- **Goals:**
  - Conduct professional, credible technical interviews
  - Learn what to listen for in candidate responses
  - Make defensible hiring recommendations
  - Build confidence in technical recruiting

---

## Design System & Visual Identity

### Color Palette
- **Primary Brand:** `#0061FF` (Amplitude-inspired blue)
- **Background:** `#F7F9FC` (Light gray-blue)
- **Level Colors:**
  - **Junior:** `#53C7BE` (Soft Teal/Mint)
    - Background: `#E6F7F5`
    - Dark: `#1E8B82`
    - Border: `#B8E6E1`
  - **Mid:** `#5C6BF3` (Indigo/Blue-Violet)
    - Background: `#ECEEFF`
    - Dark: `#3644C9`
    - Border: `#C5CBFF`
  - **Senior:** `#7A3FFC` (Deep Purple/Plum)
    - Background: `#F2EBFF`
    - Dark: `#5B2BC2`
    - Border: `#D4C5FF`

### Typography
- Clean, professional sans-serif font family
- Consistent hierarchy without custom font-size classes (relies on globals.css defaults)
- Proper use of font weights for visual hierarchy

### UI Principles
- **Polished & Professional:** Amplitude-inspired design with smooth animations
- **Educational First:** Help/question icons with comprehensive tooltips throughout
- **Data Visualization:** Radial gauges for scores, progress bars for competencies
- **Consistent Interactions:** Motion/react animations for state changes and transitions
- **Accessibility:** Comprehensive keyboard navigation with visual indicators

---

## Core Features

### 1. Assessment Screen (Main Feature)

#### Overview
The heart of the application where recruiters conduct candidate assessments. Features a structured, guided interface with real-time score calculation and level determination.

#### Key Components

**Level Tabs with Radial Gauges**
- Three tabs: Junior, Mid, Senior
- Each tab displays:
  - Small radial gauge showing current score vs. threshold
  - Color-coded to level (Junior: teal, Mid: indigo, Senior: purple)
  - Visual indication of threshold met/not met
  - Real-time updates as scores change

**Competency Scoring System**
- Configuration-driven from `/config/rubric.ts`
- Each competency includes:
  - **Competency Label:** Clear name (e.g., "Technical Basics")
  - **Max Score:** Maximum points possible (e.g., 4)
  - **Sample Questions:** 4 guided questions with educational rationales
  - **Current Score:** Tracked via draggable slider

**Full-Width Draggable Slider**
- Visual scoring mechanism for each competency
- Features:
  - Smooth drag interaction from 0 to max score
  - Click-to-set functionality for quick scoring
  - Real-time visual feedback during drag
  - Color-coded based on score level
  - Tooltip showing current score on hover
  - Animated transitions between score changes

**Educational Question System**
- 4 sample questions per competency
- Each question includes:
  - **Question Text:** What to ask the candidate
  - **Educational Rationale:** Why this question matters, what to listen for
  - **Help Icon (?):** Located at end of question text
  - **Tooltip:** Displays rationale on hover
- Comprehensive coverage: 48 total questions (4 questions × 4 competencies × 3 levels)

**Auto-Save Functionality**
- Intelligent debouncing with 800ms delay
- Saves on:
  - Score changes
  - Notes updates
  - Skills modifications
  - Audio note additions
- Visual indicator when saving
- No manual save button required

**Candidate Information Panel**
- Avatar display (custom upload or initials)
- Name and role
- Social links (LinkedIn, GitHub, Portfolio, CodePen) with interactive tooltips
- Last edited timestamp
- Best fit level badge

**Notes System**
- **Text Notes:**
  - Rich text area for written observations
  - Auto-saves with debouncing
  - Searchable from dashboard
- **Audio Notes:**
  - Record voice notes during assessment
  - Display duration and timestamp
  - Mock transcript functionality (placeholder for future speech-to-text)
  - Searchable transcripts from dashboard
  - Playback controls (visual placeholders)

**Skills Tagging**
- Autocomplete dropdown with 40+ common tech skills
- Custom skill entry supported
- Visual skill chips with remove functionality
- Skills used in:
  - Dashboard filtering
  - Search functionality
  - Candidate comparison

**Navigation Between Candidates**
- Keyboard shortcuts:
  - `←` Previous candidate
  - `→` Next candidate
  - Visual indicators showing shortcuts
- Smooth transitions between assessments
- Maintains scroll position and tab selection

#### Scoring Logic
```
Level Score = (Total Current Points / Total Possible Points) × 100

Example for Junior Level:
- Technical Basics: 3/4 points
- Learning Ability: 4/4 points
- Code Quality: 2/3 points
- Team Collaboration: 2/3 points
- Total: 11/14 points = 79%

If Junior threshold = 60%, candidate meets Junior level.
```

#### Level Determination
- Evaluated in priority order: Senior → Mid → Junior
- Candidate receives highest level where score ≥ threshold
- Thresholds (configurable in rubric):
  - Junior: 60/100
  - Mid: 70/100
  - Senior: 80/100

---

### 2. Dashboard & Candidate Management

#### Header Section
**Metric Cards (4 cards displaying):**
1. **Total Assessments:** Count of all candidates
2. **Active This Week:** Assessments edited in last 7 days
3. **Average Score:** Mean score across all candidates
4. **Success Rate:** Percentage of candidates who achieved a level

#### Filter Bar
**Search Functionality:**
- Searches across:
  - Candidate name
  - Role/title
  - Skills tags
  - Text notes
  - Audio note transcripts
- Real-time filtering as user types
- Placeholder: "Search by name, role, skills, notes..."

**Skills Filter:**
- Dropdown with checkbox list
- Shows all unique skills from candidates
- Multi-select capability
- Active filter badges shown below bar
- Quick clear functionality

**Level Filter:**
- Toggle buttons: All Levels | Junior | Mid | Senior
- Color-coded to level system
- Shows count per level
- Works in combination with other filters

#### Candidate Table

**Sortable Columns:**
All columns support three-state sorting (ascending → descending → none)

1. **Checkbox Column:**
   - Select candidates for comparison (max 3)
   - Visual selection state
   - Batch select functionality

2. **Name (Sortable):**
   - Alphabetical asc/desc
   - Avatar display
   - Initials fallback
   - Social link icons with tooltips

3. **Level (Sortable):**
   - Shows best fit level badge
   - Color-coded (Junior/Mid/Senior)
   - Sortable by level hierarchy
   - "Assessment in progress" for incomplete

4. **Score (Sortable):**
   - Percentage display (0-100)
   - Sortable by numerical value
   - Color indication based on level

5. **Best Fit (Sortable):**
   - Job title based on level
   - Examples:
     - Junior → "Junior Frontend Developer"
     - Mid → "Mid-Level Backend Developer"
     - Senior → "Senior Full-Stack Developer"
   - Alphabetically sortable

6. **Skills:**
   - Visual chips showing first 3 skills
   - "+X more" indicator with tooltip
   - Non-sortable

7. **Edited (Sortable):**
   - Relative time display ("2 hours ago")
   - Full date on tooltip hover
   - Sortable by date/time

8. **Notes (Sortable):**
   - Icons for text notes and audio notes
   - Visual indicators:
     - Blue document icon (text notes present)
     - Purple mic icon with count badge (audio notes)
     - Gray icons (no notes)
   - Tooltips showing note previews
   - Sortable by total note count (text + audio)

**Sort Visual Indicators:**
- Inactive columns: Gray `ArrowUpDown` icon
- Active ascending: Blue `ArrowUp` icon
- Active descending: Blue `ArrowDown` icon
- Hover effect: Column header text turns blue

**Table Interactions:**
- Click row to open assessment drawer
- Right-click for context menu (future: duplicate, delete, export)
- Hover effects for better scannability
- Lazy loading for performance (loads 10 at a time)

#### Lazy Loading
- Initial load: 10 candidates
- Scroll to bottom: Loads 10 more
- Skeleton loading states during fetch
- Smooth transition animations

---

### 3. Candidate Comparison

#### Comparison Drawer
Unified table-based comparison view for up to 3 candidates side-by-side.

**Table Structure:**

**Header Row:**
- Each column represents one candidate
- Contains:
  - Avatar (16×16, rounded, with social links tooltip)
  - Candidate name and role
  - Level badge (Junior/Mid/Senior)
  - Overall score radial gauge (100px, color-coded by performance)
  - Sticky positioning for scroll

**Level Scores Section:**
- Three rows: Junior Level, Mid Level, Senior Level
- Each cell shows:
  - Score out of 100
  - Progress bar (color-coded if threshold met)
  - Tooltip with detailed breakdown
- Visual color dots indicating level

**Competency Breakdown Section:**
- One row per competency (from rubric)
- Shows competency name and level designation
- Each candidate cell displays:
  - Score / Max Score (e.g., "3/4")
  - Progress bar indicating percentage
  - Tooltip with detailed information
- Sticky first column for metric labels

**Additional Information Section:**
- **Skills Row:**
  - Displays first 2 skills as chips
  - "+X more" tooltip for additional skills
  - "No skills listed" if none
  
- **Notes Row:**
  - Icons for text and audio notes
  - Interactive tooltips showing:
    - Full text note content
    - Audio note count, durations, and transcripts
  - Visual states for presence/absence

**Save Comparison Feature:**
- Modal dialog for naming comparison
- Auto-suggests name from candidate names
- Saves to "Compare" view for future reference
- Displays list of included candidates

#### Compare View (Separate Page)
- Grid of saved comparisons
- Each card shows:
  - Comparison name
  - Candidate count
  - Date saved
  - Quick action buttons (View, Delete)
- Click to reload comparison in drawer

---

### 4. New Assessment Creation

#### New Assessment Drawer
Modal-based workflow for creating new candidate assessments.

**Required Information:**
1. **Candidate Name** (required)
   - Text input with validation
   - Auto-focus on open

2. **Role/Title** (optional)
   - Text input
   - Examples: "Senior Frontend Engineer", "Full-Stack Developer"

3. **Social Links** (all optional)
   - LinkedIn URL
   - GitHub URL
   - Portfolio URL
   - CodePen URL
   - URL validation

**Workflow:**
1. Click "New Assessment" button in top bar
2. Drawer slides in from right
3. Fill in candidate information
4. Click "Start Assessment"
5. Automatically transitions to Assessment Drawer with new candidate
6. Ready to begin scoring immediately

**Immediate Start Feature:**
- Upon creation, assessment drawer opens automatically
- Smooth transition with animation
- All tabs and competencies ready for scoring
- No intermediate steps required

---

## Technical Architecture

### Technology Stack
- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS v4.0
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **State Management:** React hooks (useState, useEffect, useMemo)

### Data Structure

```typescript
interface Assessment {
  id: string;
  candidateName: string;
  role?: string;
  date: string; // ISO date string
  notes: string;
  audioNotes?: AudioNote[];
  avatarUrl?: string;
  skills?: string[];
  links?: {
    linkedin?: string;
    portfolio?: string;
    codepen?: string;
    github?: string;
  };
  scores: {
    junior: Record<string, number>; // competencyId -> score
    mid: Record<string, number>;
    senior: Record<string, number>;
  };
}

interface AudioNote {
  id: string;
  timestamp: string;
  duration: number; // in seconds
  transcript?: string;
  url?: string;
}

interface Competency {
  id: string;
  label: string;
  maxScore: number;
  currentScore: number;
  sampleQuestions: QuestionWithRationale[];
}

interface QuestionWithRationale {
  question: string;
  rationale: string;
}
```

### Configuration System

**Rubric Configuration (`/config/rubric.ts`):**
- Centralized scoring configuration
- Easy to modify thresholds and competencies
- Supports future API integration
- Current structure:
  ```typescript
  {
    junior: {
      threshold: 60,
      competencies: [
        { id: 'technical_basics', label: 'Technical Basics', maxScore: 4, ... },
        { id: 'learning_ability', label: 'Learning Ability', maxScore: 4, ... },
        { id: 'code_quality', label: 'Code Quality Awareness', maxScore: 3, ... },
        { id: 'collaboration', label: 'Team Collaboration', maxScore: 3, ... }
      ]
    },
    mid: { ... },
    senior: { ... }
  }
  ```

### Performance Optimizations
- **Lazy Loading:** Candidates load in batches of 10
- **Memoization:** useMemo for expensive calculations (filtering, sorting)
- **Debouncing:** 800ms debounce on auto-save to reduce API calls
- **Virtual Scrolling:** Implemented via intersection observer
- **Skeleton States:** Loading placeholders for better perceived performance

---

## User Workflows

### Workflow 1: Conducting a New Assessment

1. **Start:** User clicks "New Assessment" in top bar
2. **Create:** User enters candidate name, role, and optional links
3. **Begin:** Clicks "Start Assessment" → Auto-transitions to assessment drawer
4. **Navigate:** User selects appropriate level tab (Junior/Mid/Senior)
5. **Read Questions:** User reviews sample questions and educational rationales (? icons)
6. **Conduct Interview:** User asks questions and listens to candidate responses
7. **Score:** User drags slider to score competency based on candidate's answer quality
8. **Repeat:** User completes all 4 competencies for selected level(s)
9. **Document:** User adds notes (text or audio) about observations
10. **Tag:** User adds relevant skill tags
11. **Auto-Save:** Assessment saves automatically every 800ms
12. **Review:** User checks radial gauges to see if thresholds are met
13. **Close:** User closes drawer when complete

### Workflow 2: Comparing Candidates

1. **Select:** User checks boxes next to 2-3 candidates in dashboard
2. **Open:** User clicks "Compare" button that appears
3. **Review:** Comparison drawer opens showing unified table
4. **Analyze:** User scans across candidates, comparing:
   - Overall scores (radial gauges in header)
   - Level scores (progress bars by level)
   - Individual competency scores
   - Skills and notes
5. **Decide:** User identifies best candidate based on data
6. **Save (Optional):** User clicks "Save Comparison" to store for later
7. **Name:** User provides meaningful name (auto-suggested)
8. **Confirm:** Comparison saved to Compare view

### Workflow 3: Searching and Filtering

1. **Navigate:** User on dashboard
2. **Search:** User types in search bar (name, role, skills, notes)
3. **Filter Skills:** User opens skills dropdown, selects relevant technologies
4. **Filter Level:** User clicks level toggle (Junior/Mid/Senior)
5. **Review:** Table updates in real-time showing only matching candidates
6. **Sort:** User clicks column headers to sort by different criteria
7. **Select:** User clicks candidate row to open full assessment
8. **Clear:** User clears filters to see all candidates again

---

## Keyboard Navigation

### Global Shortcuts
- **Assessment Drawer:**
  - `←` (Left Arrow): Previous candidate
  - `→` (Right Arrow): Next candidate
  - `Esc`: Close drawer
  - `Tab`: Navigate through competencies and inputs
  - `1-3`: Switch between Junior/Mid/Senior tabs

### Visual Indicators
- Keyboard shortcut hints displayed near navigation buttons
- `KeyboardKey` component shows available shortcuts
- Focus states clearly visible throughout interface

---

## Educational Features

### Rationale System
Every question includes a comprehensive rationale explaining:
- **Why the question matters:** Context for importance
- **What to listen for:** Specific indicators of quality answers
- **What good looks like:** Examples of strong responses
- **Red flags:** Warning signs in responses
- **Level differentiation:** How answers differ between Junior/Mid/Senior

### Example Rationale
**Question:** "Can you explain what a variable is and give an example?"

**Rationale:** "Variables are fundamental to programming. If a candidate can explain this clearly in their own words, they have basic conceptual understanding rather than just copying code from tutorials."

### Help Icons (?)
- Positioned at end of each question
- Consistent placement for predictability
- Tooltip interaction (hover to reveal)
- Dark background with white text for readability

---

## Component Architecture

### Core Components

1. **App.tsx:** Main application container, routing, state management
2. **Dashboard.tsx:** Candidate table, metrics, filtering, sorting
3. **AssessmentDrawer.tsx:** Full assessment interface with scoring
4. **ComparisonDrawer.tsx:** Unified comparison table
5. **NewAssessmentDrawer.tsx:** Candidate creation workflow
6. **FilterBar.tsx:** Search and filtering controls
7. **Tooltip.tsx:** Educational tooltips throughout app
8. **BaseDrawer.tsx:** Reusable drawer component
9. **MetricCard.tsx:** Dashboard metric displays
10. **AudioNoteRecorder.tsx:** Audio recording interface
11. **KeyboardKey.tsx:** Keyboard shortcut visual indicators

### Reusable UI Components
- **RadialGauge:** Circular progress indicators for scores
- **DraggableScoreSlider:** Full-width slider for competency scoring
- **SkeletonRow:** Loading state placeholders
- **ContextMenu:** Right-click menu (future enhancement)

---

## Future Enhancements (Out of Scope for v1)

### Phase 2 Features
- **Backend Integration:**
  - User authentication
  - Cloud data persistence
  - Team collaboration features
  - API for rubric configuration

- **Advanced Audio:**
  - Real speech-to-text transcription
  - Audio playback functionality
  - Waveform visualization

- **Reporting:**
  - PDF export of assessments
  - Analytics dashboard
  - Hiring funnel metrics
  - Team performance insights

- **Collaboration:**
  - Share assessments with team
  - Comment threads on candidates
  - Approval workflows
  - Interview scheduling integration

- **Custom Rubrics:**
  - User-defined competencies
  - Custom scoring systems
  - Role-specific assessment templates
  - Industry specializations (Web, Mobile, DevOps, etc.)

- **AI Features:**
  - Suggested questions based on candidate background
  - Answer quality analysis
  - Bias detection in notes
  - Interview preparation tips

### Phase 3 Features
- **Candidate Portal:**
  - Self-assessment tools
  - Portfolio submission
  - Interview scheduling

- **Integration Ecosystem:**
  - ATS integration (Greenhouse, Lever, etc.)
  - Calendar sync
  - Slack notifications
  - Email automation

---

## Design Decisions & Rationale

### Why Full-Width Sliders?
- **Visual Prominence:** Makes scoring the primary interaction
- **Precision:** Easier to achieve exact scores vs. small sliders
- **Touch-Friendly:** Better mobile experience (future consideration)
- **Accessibility:** Larger click/drag target area

### Why Educational Tooltips?
- **Core User Need:** Non-technical recruiters need constant guidance
- **Just-in-Time Learning:** Information available when needed, not overwhelming
- **Confidence Building:** Understanding "why" builds interviewer competence
- **Knowledge Transfer:** Recruiters learn technical concepts over time

### Why Three-State Sorting?
- **Flexibility:** Users can return to default view easily
- **Clear Intent:** Explicit visual feedback on sort direction
- **Standard Pattern:** Familiar from Excel and other data tools

### Why Auto-Save?
- **Reduce Cognitive Load:** Users focus on interview, not saving
- **Prevent Data Loss:** Especially important during live interviews
- **Modern UX:** Aligns with contemporary web application expectations

### Why Unified Comparison Table?
- **Better Scannability:** Single vertical scroll vs. multiple sections
- **Clear Relationships:** Direct visual connection between overall score and details
- **Efficiency:** Reduced eye travel distance when comparing
- **Professional Feel:** Resembles analytical tools users trust

---

## Design Constraints

### Technical Constraints
- Client-side only (no backend in v1)
- Local storage for persistence
- No real audio recording/playback (UI placeholders only)
- No user authentication

### UX Constraints
- Maximum 3 candidates in comparison (prevents overwhelming UI)
- Rubric is fixed (no user customization in v1)
- English language only
- Desktop-first design (responsive mobile is secondary)

### Data Constraints
- Assessments stored in browser local storage
- No data sync across devices
- Export/import not available in v1

---

## Success Criteria for v1 MVP

### Functional Requirements (Must Have)
✅ Complete assessment workflow from creation to scoring
✅ All 3 levels (Junior/Mid/Senior) with unique competencies
✅ 48 total questions with educational rationales
✅ Real-time score calculation and level determination
✅ Draggable slider scoring system
✅ Auto-save functionality
✅ Search across all candidate data
✅ Multi-level filtering (skills, level)
✅ Sortable table with 6+ columns
✅ Candidate comparison (up to 3)
✅ Notes system (text + audio UI)
✅ Skills tagging with autocomplete
✅ Keyboard navigation
✅ Social links with tooltips

### Quality Requirements
✅ Polished UI matching Amplitude design inspiration
✅ Smooth animations throughout
✅ Consistent color system for levels
✅ Comprehensive tooltips on all educational elements
✅ Responsive interactions (hover, focus, active states)
✅ Loading states for async operations
✅ Error handling and validation

### Performance Requirements
✅ Lazy loading for large candidate lists
✅ Debounced auto-save (800ms)
✅ Optimized filtering and sorting (useMemo)
✅ Fast drawer transitions (<300ms)

---

## User Testing Scenarios

### Scenario 1: First-Time User
**Given:** Sarah has never used the app before
**When:** She opens the app and clicks "New Assessment"
**Then:** 
- She should immediately understand how to create a candidate
- The educational tooltips should guide her through questions
- She should feel confident scoring after reading rationales
- Auto-save should prevent any data loss

### Scenario 2: Comparing Multiple Candidates
**Given:** Sarah has assessed 5 candidates for a Senior role
**When:** She selects 3 candidates and opens comparison
**Then:**
- She should easily identify the strongest candidate
- The unified table should make differences obvious
- She should understand why one candidate scored higher
- She should be able to save the comparison for her manager

### Scenario 3: Finding a Specific Candidate
**Given:** Sarah needs to find "the React developer from last Tuesday"
**When:** She uses search and filters
**Then:**
- Search should quickly surface matching candidates
- Skills filter should narrow to React developers
- Date sorting should help find recent assessments
- The candidate should be clickable to view full assessment

---

## Appendix

### Competency Breakdown by Level

**Junior Level (Threshold: 60/100):**
1. Technical Basics (4 points)
2. Learning Ability (4 points)
3. Code Quality Awareness (3 points)
4. Team Collaboration (3 points)
**Total: 14 points**

**Mid Level (Threshold: 70/100):**
1. Architecture Understanding (4 points)
2. Problem Solving (5 points)
3. Code Review Skills (4 points)
4. Mentorship Capability (3 points)
**Total: 16 points**

**Senior Level (Threshold: 80/100):**
1. System Design (5 points)
2. Technical Leadership (5 points)
3. Strategic Thinking (4 points)
4. Communication Skills (4 points)
**Total: 18 points**

### Mock Data
- **Total Mock Candidates:** 12
- **Variety:** Mix of Junior, Mid, Senior levels
- **Diversity:** Different roles (Frontend, Backend, Full-Stack)
- **Skills:** Range of technologies (React, Node.js, Python, etc.)
- **States:** Some with notes, some without; some with skills, some without

### Browser Support
- **Primary:** Chrome, Firefox, Safari (latest 2 versions)
- **Mobile:** iOS Safari, Chrome Mobile (basic support)
- **Not Supported:** IE11, older mobile browsers

---

## Version History

**v1.0 (Current) - December 2025:**
- Initial MVP release
- All core features implemented
- 48 questions with comprehensive rationales
- Full keyboard navigation
- Unified comparison table
- Enhanced search (including notes and audio transcripts)
- Complete sorting system (6 columns)
- Auto-save with debouncing
- Educational tooltip system
- Polished Amplitude-inspired design

---

## Glossary

**Assessment:** A complete evaluation record for a single candidate, including scores across all levels, notes, and metadata.

**Competency:** A specific skill or ability area being evaluated (e.g., "Technical Basics", "Problem Solving").

**Level:** One of three seniority classifications: Junior, Mid, or Senior.

**Threshold:** The minimum percentage score required to achieve a specific level (e.g., 60% for Junior).

**Radial Gauge:** A circular progress indicator showing score relative to threshold.

**Rationale:** Educational explanation for why a question matters and what to listen for in answers.

**Best Fit:** The highest level a candidate qualifies for based on their scores.

**Auto-Save:** Automatic background saving of assessment changes without user action.

**Lazy Loading:** Performance optimization that loads data in batches as needed.

**Debouncing:** Delay technique that prevents excessive function calls (e.g., saving on every keystroke).

---

## Contact & Support

**Product Owner:** [Your Name]
**Development Team:** [Team Name]
**Documentation:** This PRD and inline code comments
**Feedback:** [Feedback mechanism TBD]

---

*This PRD reflects the current state of The Recruitment Thing v1 MVP as of December 8, 2025. All features described herein are implemented and functional in the production build.*
