import { Rubric } from '../types';

// This rubric configuration drives the entire assessment UI
// In the future, this can be replaced with an API call
export const RUBRIC: Rubric = {
  junior: {
    threshold: 60,
    competencies: [
      {
        id: 'technical_basics',
        label: 'Technical Basics',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Can you explain what a variable is and give an example?',
            rationale: 'Variables are fundamental to programming. If a candidate can explain this clearly in their own words, they have basic conceptual understanding rather than just copying code from tutorials.'
          },
          {
            question: 'Have you worked with version control like Git?',
            rationale: 'Git is essential for professional development. Junior candidates should at least have exposure to basic commands (commit, push, pull) which indicates they can work in team environments.'
          },
          {
            question: 'Can you describe the difference between frontend and backend?',
            rationale: 'Understanding the web stack fundamentals shows architectural awareness. Even juniors should grasp where their code runs and how different parts of a system interact.'
          },
          {
            question: 'Have you debugged code using console logs or a debugger?',
            rationale: 'Debugging is a core developer skill. Junior candidates should demonstrate basic troubleshooting ability beyond just trying random fixes until something works.'
          }
        ]
      },
      {
        id: 'learning_ability',
        label: 'Learning Ability',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Tell me about a time you learned a new technology or framework',
            rationale: 'Technology changes constantly. A junior\'s ability to self-learn and adapt is often more important than current knowledge. Look for structured learning approaches, not just "I watched YouTube."'
          },
          {
            question: 'How do you approach learning something new in development?',
            rationale: 'This reveals learning methodology. Strong juniors have a process: read docs, build small projects, ask questions. Weak ones just copy-paste from Stack Overflow without understanding.'
          },
          {
            question: 'Have you completed any online courses or bootcamps?',
            rationale: 'Formal learning shows commitment and structured knowledge. Bootcamp grads often have practical project experience, while self-taught developers show strong initiative and resourcefulness.'
          },
          {
            question: 'Can you describe a problem you solved by researching online?',
            rationale: 'Modern development requires effective Googling and documentation reading. This tests whether they can find solutions independently rather than getting stuck on every obstacle.'
          }
        ]
      },
      {
        id: 'code_quality',
        label: 'Code Quality Awareness',
        maxScore: 3,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Do you know what "clean code" means?',
            rationale: 'Awareness of code quality principles (readable naming, small functions, etc.) indicates they think beyond "does it work" to "is it maintainable." Even basic awareness is valuable.'
          },
          {
            question: 'Have you received code review feedback before?',
            rationale: 'Code reviews are how juniors grow. Experience receiving feedback shows they\'ve worked in collaborative environments and can learn from others\' expertise.'
          },
          {
            question: 'Do you write comments in your code?',
            rationale: 'While over-commenting is bad, juniors who add helpful comments show they think about future readers (including their future self). It demonstrates consideration for maintainability.'
          },
          {
            question: 'Have you heard of coding standards or style guides?',
            rationale: 'Awareness of standards (like Airbnb style guide) shows exposure to professional practices. Teams need developers who can follow established conventions, not just personal preferences.'
          }
        ]
      },
      {
        id: 'collaboration',
        label: 'Team Collaboration',
        maxScore: 3,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Have you worked on a team project before?',
            rationale: 'Team experience reveals collaboration fundamentals: coordinating with others, handling merge conflicts, and integrating work. Solo developers often struggle when joining teams.'
          },
          {
            question: 'How do you handle feedback on your code?',
            rationale: 'Ego can kill growth. Juniors who are defensive about feedback struggle to improve. Look for humility and willingness to learn from critique.'
          },
          {
            question: 'Do you feel comfortable asking for help when stuck?',
            rationale: 'Juniors who stay stuck for hours hurt velocity. Those who know when to ask for help (after trying themselves) learn faster and integrate better into teams.'
          },
          {
            question: 'Have you pair programmed with someone?',
            rationale: 'Pair programming teaches collaboration, communication, and real-time problem solving. Experience with it shows comfort working closely with others and thinking out loud.'
          }
        ]
      }
    ]
  },
  mid: {
    threshold: 70,
    competencies: [
      {
        id: 'technical_depth',
        label: 'Technical Depth',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Can you explain how async/await works in JavaScript?',
            rationale: 'Asynchronous programming is crucial for modern web development. Mid-level developers should understand promises, event loops, and async patterns beyond just using the syntax.'
          },
          {
            question: 'Have you optimized database queries before?',
            rationale: 'Database performance separates mid from junior developers. Real optimization experience (indexes, query planning, N+1 fixes) shows they handle production-scale data problems.'
          },
          {
            question: 'Can you describe different types of API authentication?',
            rationale: 'Security awareness is essential at mid-level. Understanding OAuth, JWT, API keys, etc. shows they build production-ready features, not just prototypes.'
          },
          {
            question: 'Have you worked with state management libraries?',
            rationale: 'Complex UIs require state management (Redux, Zustand, Context). Experience with these tools indicates they\'ve built real applications beyond simple CRUD forms.'
          }
        ]
      },
      {
        id: 'problem_solving',
        label: 'Problem Solving',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Describe a complex bug you debugged and how you approached it',
            rationale: 'Debugging methodology reveals problem-solving skills. Strong mid-level developers use systematic approaches (reproduction steps, hypothesis testing, tools) rather than random trial and error.'
          },
          {
            question: 'Have you refactored legacy code? What was your process?',
            rationale: 'Most professional work is enhancing existing systems, not greenfield. Refactoring experience shows they can understand unfamiliar code, improve it safely, and manage technical debt.'
          },
          {
            question: 'How do you break down a large feature into smaller tasks?',
            rationale: 'Task decomposition is critical for mid-level autonomy. Good developers break work into reviewable chunks, identify dependencies, and deliver incrementally rather than big-bang releases.'
          },
          {
            question: 'Tell me about a technical trade-off you had to make',
            rationale: 'Engineering is about trade-offs, not perfect solutions. This reveals awareness of competing priorities (speed vs quality, simplicity vs flexibility) and mature decision-making.'
          }
        ]
      },
      {
        id: 'autonomy',
        label: 'Autonomy & Ownership',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Have you owned a feature from start to finish?',
            rationale: 'End-to-end ownership demonstrates mid-level capability. This includes requirements, design, implementation, testing, deployment, and monitoring - the full development lifecycle.'
          },
          {
            question: 'Do you take initiative to improve code or processes?',
            rationale: 'Mid-level developers don\'t just complete tickets. They proactively improve things: refactor messy code, update docs, suggest better tools. This shows ownership beyond assigned tasks.'
          },
          {
            question: 'How do you prioritize your work when you have multiple tasks?',
            rationale: 'Prioritization is a mid-level responsibility. Strong candidates consider urgency, impact, dependencies, and stakeholder needs - not just what\'s easiest or most interesting.'
          },
          {
            question: 'Have you made architectural decisions for a project?',
            rationale: 'Mid-level developers start influencing architecture: choosing libraries, designing data models, planning folder structure. This shows growing technical leadership beyond just coding.'
          }
        ]
      },
      {
        id: 'communication',
        label: 'Communication',
        maxScore: 3,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'How do you explain technical concepts to non-technical people?',
            rationale: 'Developers must communicate with PMs, designers, and stakeholders. Ability to translate technical details into business language is crucial for mid-level effectiveness.'
          },
          {
            question: 'Have you written technical documentation?',
            rationale: 'Documentation multiplies impact. READMEs, API docs, architecture decisions - these help teams scale knowledge beyond the original author and reduce future support burden.'
          },
          {
            question: 'Do you participate in code reviews?',
            rationale: 'Code reviews are two-way learning. Mid-level developers should both give and receive feedback, catching bugs, sharing knowledge, and maintaining code standards across the team.'
          },
          {
            question: 'How do you handle disagreements about technical approaches?',
            rationale: 'Technical disagreements are normal. Strong communicators listen, present data, seek to understand, and find compromise - rather than digging into positions or deferring everything.'
          }
        ]
      }
    ]
  },
  senior: {
    threshold: 85,
    competencies: [
      {
        id: 'technical_depth',
        label: 'Technical Depth',
        maxScore: 5,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Have you designed a system that handles 10M+ daily active users?',
            rationale: 'Scale experience reveals understanding of distributed systems, caching strategies, and performance optimization. Senior developers should have battle-tested knowledge from real production challenges.'
          },
          {
            question: 'Can you explain database indexing trade-offs without looking it up?',
            rationale: 'Deep technical knowledge should be internalized, not just searchable. This tests whether they truly understand performance fundamentals or rely heavily on documentation.'
          },
          {
            question: 'Have you fixed a live app that was slow because it was making too many database calls?',
            rationale: 'When an app queries the database once for a list, then queries again for each item in that list (called "N+1 queries"), it creates major slowdowns. Senior developers have encountered and fixed this common performance problem in real production environments.'
          },
          {
            question: 'Do you regularly consider memory allocation patterns when writing code?',
            rationale: 'Senior developers think beyond \"does it work\" to \"does it work efficiently.\" Memory awareness separates those who write code from those who write production-grade systems.'
          }
        ]
      },
      {
        id: 'practical_judgment',
        label: 'Practical Judgment',
        maxScore: 5,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Describe a time you chose a simpler solution over a "clever" one',
            rationale: 'Senior developers prioritize maintainability over cleverness. This reveals their ability to balance technical elegance with team velocity and long-term code health.'
          },
          {
            question: 'How do you decide when to refactor vs ship as-is?',
            rationale: 'Perfect code ships never. This tests business judgment alongside technical skills - understanding trade-offs between quality, speed, and customer value delivery.'
          },
          {
            question: 'Have you made build vs buy decisions for your team?',
            rationale: 'Senior engineers influence technology choices. This reveals strategic thinking, vendor evaluation skills, and understanding of total cost of ownership beyond just writing code.'
          },
          {
            question: 'Can you give an example of technical debt you decided to take on strategically?',
            rationale: 'Not all technical debt is bad. Strategic debt can accelerate learning or time-to-market. This tests mature judgment about when to compromise and how to manage it.'
          }
        ]
      },
      {
        id: 'communication_leadership',
        label: 'Communication & Leadership',
        maxScore: 5,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'Have you mentored junior developers? What was your approach?',
            rationale: 'Senior developers multiply their impact through others. Mentoring experience shows they can grow talent, share knowledge effectively, and contribute beyond their individual output.'
          },
          {
            question: 'Describe how you influence technical direction without formal authority',
            rationale: 'Leadership isn\'t about titles. This reveals ability to build consensus, communicate vision, and drive change through influence - critical for senior IC roles.'
          },
          {
            question: 'Have you led technical discussions or design reviews?',
            rationale: 'Senior engineers facilitate technical decisions. Leading design reviews demonstrates ability to guide conversations, weigh options objectively, and build alignment across teams.'
          },
          {
            question: 'How do you handle pushback on your technical recommendations?',
            rationale: 'Disagreement is inevitable. This tests emotional intelligence, ability to listen to other perspectives, and skill in finding collaborative solutions rather than winning arguments.'
          }
        ]
      },
      {
        id: 'experience_quality',
        label: 'Experience Quality',
        maxScore: 4,
        currentScore: 0,
        sampleQuestions: [
          {
            question: 'What\'s the most complex system you\'ve designed from scratch?',
            rationale: 'System design from scratch reveals architectural thinking, component planning, and ability to handle ambiguity. Complexity of past work often predicts capability.'
          },
          {
            question: 'Have you been on-call for production systems? Describe an incident',
            rationale: 'Production ownership builds accountability and systems thinking. On-call experience shows they understand real-world reliability, monitoring, and the full software lifecycle.'
          },
          {
            question: 'Tell me about a project that failed and what you learned',
            rationale: 'Failure teaches better than success. Senior candidates should have perspective on what went wrong, ownership of mistakes, and demonstrate growth mindset.'
          },
          {
            question: 'Have you worked on systems with compliance requirements (GDPR, SOC2, etc.)?',
            rationale: 'Enterprise-grade systems often have regulatory constraints. This experience shows ability to balance technical requirements with legal/compliance needs in real products.'
          }
        ]
      }
    ]
  }
};