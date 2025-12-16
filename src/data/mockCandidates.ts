import { Assessment } from '../types';

export const mockCandidates: Assessment[] = [
  {
    id: '1',
    candidateName: 'Stevie Nicks',
    role: 'Senior Full-Stack Developer',
    date: '2024-11-28',
    notes: 'Excellent system design skills. Strong communication. Would be great for the platform team.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    tags: ['strong communicator', 'team player', 'leadership potential'],
    avatarUrl: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDgzMDg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/stevienicks',
      github: 'https://github.com/stevienicks',
      portfolio: 'https://stevienicks.dev'
    },
    audioNotes: [
      {
        id: 'audio-1',
        duration: 145,
        transcript: 'Stevie demonstrated excellent problem-solving skills during the system design discussion. Her approach to scalability was particularly impressive.'
      }
    ],
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 4,
        'practical_judgment': 4,
        'communication_leadership': 4,
        'experience_quality': 3
      }
    }
  },
  {
    id: '2',
    candidateName: 'Robert Plant',
    role: 'Mid-Level Backend Developer',
    date: '2024-11-27',
    notes: 'Solid backend fundamentals. Needs more experience with distributed systems.',
    skills: ['Python', 'Django', 'Redis', 'Docker'],
    tags: ['independent worker', 'detail-oriented'],
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ4NTk2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/robertplant',
      linkedin: 'https://linkedin.com/in/robertplant'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 2
      },
      senior: {}
    }
  },
  {
    id: '3',
    candidateName: 'Janis Joplin',
    role: 'Junior Frontend Developer',
    date: '2024-11-25',
    notes: 'Great potential. Strong CSS skills and attention to detail. Needs mentorship on JS fundamentals.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    tags: ['eager to learn', 'creative thinker', 'needs mentorship'],
    avatarUrl: 'https://images.unsplash.com/photo-1712799891569-f651f9110365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXRpbmElMjB3b21hbnxlbnwxfHx8fDE3NjQ5MDIwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      portfolio: 'https://janisjoplin.com',
      codepen: 'https://codepen.io/janisjoplin'
    },
    audioNotes: [
      {
        id: 'audio-2',
        duration: 89,
        transcript: 'Janis showed great enthusiasm and willingness to learn. Her CSS animations were impressive for a junior developer.'
      },
      {
        id: 'audio-3',
        duration: 62,
        transcript: 'Follow-up: Discussed career growth path and mentorship opportunities.'
      }
    ],
    scores: {
      junior: {
        'technical_basics': 3,
        'learning_ability': 3,
        'code_quality': 2,
        'collaboration': 2
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '4',
    candidateName: 'Eddie Vedder',
    role: 'Senior Full-Stack Developer',
    date: '2024-11-20',
    notes: 'Exceptional technical depth. Has led teams of 5+ engineers. Strong culture fit.',
    skills: ['TypeScript', 'React', 'GraphQL', 'Kubernetes'],
    tags: ['natural leader', 'mentor', 'culture fit'],
    avatarUrl: 'https://images.unsplash.com/photo-1701980889802-55ff39e2e973?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbnxlbnwxfHx8fDE3NjQ4MTM5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/eddievedder',
      github: 'https://github.com/eddievedder'
    },
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 5,
        'communication_leadership': 5,
        'experience_quality': 4
      }
    }
  },
  {
    id: '5',
    candidateName: 'Joni Mitchell',
    role: 'Mid-Level Frontend Developer',
    date: '2024-11-18',
    notes: 'Strong React and TypeScript knowledge. Good eye for UX. Could improve testing practices.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Jest'],
    avatarUrl: 'https://images.unsplash.com/photo-1670223364099-eb3f7738cd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbnxlbnwxfHx8fDE3NjQ5MDIwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      portfolio: 'https://jonimitchell.io',
      github: 'https://github.com/jonimitchell'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 2,
        'communication': 3
      },
      senior: {}
    }
  },
  {
    id: '6',
    candidateName: 'John Lennon',
    role: 'Junior Backend Developer',
    date: '2024-11-15',
    notes: 'Recent bootcamp grad. Enthusiastic learner. Needs real-world project experience.',
    skills: ['Node.js', 'Express', 'MongoDB'],
    avatarUrl: 'https://images.unsplash.com/photo-1524538198441-241ff79d153b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NjQ4NTM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/johnlennon',
      linkedin: 'https://linkedin.com/in/johnlennon'
    },
    scores: {
      junior: {
        'technical_basics': 2,
        'learning_ability': 4,
        'code_quality': 2,
        'collaboration': 3
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '7',
    candidateName: 'Debbie Harry',
    role: 'Senior Frontend Architect',
    date: '2024-11-12',
    notes: 'Incredible expertise in frontend architecture. Has built design systems at scale. Would be perfect for our component library initiative.',
    skills: ['React', 'TypeScript', 'Design Systems', 'Storybook', 'Figma'],
    avatarUrl: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMHdvbWFufGVufDF8fHx8MTc2NDkwMjAxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      portfolio: 'https://debbieharry.com',
      linkedin: 'https://linkedin.com/in/debbieharry',
      github: 'https://github.com/debbieharry'
    },
    audioNotes: [
      {
        id: 'audio-4',
        duration: 203,
        transcript: 'Debbie presented her work on building a design system from scratch. Her approach to accessibility and component composition was world-class.'
      }
    ],
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 4,
        'communication_leadership': 5,
        'experience_quality': 4
      }
    }
  },
  {
    id: '8',
    candidateName: 'Anthony Kiedis',
    role: 'Mid-Level DevOps Engineer',
    date: '2024-11-10',
    notes: 'Strong infrastructure knowledge. Good with CI/CD pipelines. Limited programming background.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Jenkins'],
    avatarUrl: 'https://images.unsplash.com/photo-1724260793422-7754e5d06fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBlbmdpbmVlciUyMG1hbnxlbnwxfHx8fDE3NjQ5MDIwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/anthonykiedis'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 2
      },
      senior: {}
    }
  },
  {
    id: '9',
    candidateName: 'Aretha Franklin',
    role: 'Senior Backend Architect',
    date: '2024-11-08',
    notes: 'Expert in microservices architecture. Strong experience with cloud-native technologies. Great mentor.',
    skills: ['Go', 'Microservices', 'Kafka', 'Redis', 'GCP'],
    avatarUrl: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtaWRkbGUlMjBlYXN0ZXJuJTIwd29tYW58ZW58MXx8fHwxNzY0OTAyMzE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/arethafranklin',
      github: 'https://github.com/arethafranklin'
    },
    audioNotes: [
      {
        id: 'audio-5',
        duration: 178,
        transcript: 'Aretha shared her experience scaling services to handle millions of requests. Her approach to event-driven architecture was impressive.'
      }
    ],
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 5,
        'communication_leadership': 4,
        'experience_quality': 4
      }
    }
  },
  {
    id: '10',
    candidateName: 'Kurt Cobain',
    role: 'Mid-Level Full-Stack Developer',
    date: '2024-11-05',
    notes: 'Balanced skills across frontend and backend. Good team player. Would benefit from more complex project exposure.',
    skills: ['Vue.js', 'Node.js', 'MySQL', 'AWS'],
    avatarUrl: 'https://images.unsplash.com/photo-1697043667053-9f7798f19e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoaXNwYW5pYyUyMG1hbnxlbnwxfHx8fDE3NjQ4ODYxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/kurtcobain',
      portfolio: 'https://kurtcobain.dev'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 3
      },
      senior: {}
    }
  },
  {
    id: '11',
    candidateName: 'Keisha Washington',
    role: 'Senior Security Engineer',
    date: '2024-10-30',
    notes: 'Deep security expertise. Previously worked at major fintech companies. Excellent at threat modeling.',
    skills: ['Security', 'Penetration Testing', 'Python', 'DevSecOps'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMHdvbWFufGVufDF8fHx8MTc2NDkwMjMxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/keishawashington',
      github: 'https://github.com/kwashington'
    },
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 4,
        'practical_judgment': 4,
        'communication_leadership': 4,
        'experience_quality': 3
      }
    }
  },
  {
    id: '12',
    candidateName: 'Ryan O\'Brien',
    role: 'Junior Full-Stack Developer',
    date: '2024-10-28',
    notes: 'Self-taught developer with impressive portfolio projects. Quick learner but lacks professional experience.',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    avatarUrl: 'https://images.unsplash.com/photo-1696219448339-ce614b610462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDg3MzEyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/robrien',
      portfolio: 'https://ryanobrien.tech',
      codepen: 'https://codepen.io/robrien'
    },
    scores: {
      junior: {
        'technical_basics': 3,
        'learning_ability': 4,
        'code_quality': 2,
        'collaboration': 2
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '13',
    candidateName: 'Yuki Tanaka',
    role: 'Mid-Level Mobile Developer',
    date: '2024-10-22',
    notes: 'Strong React Native experience. Has shipped multiple apps to production. Looking to expand into web.',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Firebase'],
    avatarUrl: 'https://images.unsplash.com/photo-1752170080622-18196de87763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzY0OTAyMzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/ytanaka',
      portfolio: 'https://yukitanaka.dev'
    },
    audioNotes: [
      {
        id: 'audio-6',
        duration: 112,
        transcript: 'Yuki demonstrated strong mobile development skills and showed enthusiasm about transitioning to web development.'
      }
    ],
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 3
      },
      senior: {}
    }
  },
  {
    id: '14',
    candidateName: 'Fatima Hassan',
    role: 'Senior Data Engineer',
    date: '2024-10-18',
    notes: 'Exceptional data pipeline design. Experience with large-scale ETL. Strong Python and SQL skills.',
    skills: ['Python', 'SQL', 'Spark', 'Airflow', 'AWS', 'Snowflake'],
    avatarUrl: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc2NDg5MzkxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/fatimahassan',
      github: 'https://github.com/fhassan'
    },
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 4,
        'communication_leadership': 4,
        'experience_quality': 4
      }
    }
  },
  {
    id: '15',
    candidateName: 'James Anderson',
    role: 'Mid-Level Frontend Developer',
    date: '2024-10-15',
    notes: 'Solid React skills with good design sense. Works well independently. Could improve on testing practices.',
    skills: ['React', 'JavaScript', 'CSS', 'Figma'],
    avatarUrl: 'https://images.unsplash.com/photo-1752859951149-7d3fc700a7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWNoJTIwbWFufGVufDF8fHx8MTc2NDkwMjMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/janderson',
      portfolio: 'https://jamesanderson.design'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 2,
        'problem_solving': 2,
        'autonomy': 3,
        'communication': 2
      },
      senior: {}
    }
  },
  {
    id: '16',
    candidateName: 'Nina Volkov',
    role: 'Junior QA Engineer',
    date: '2024-10-10',
    notes: 'Strong attention to detail. Good understanding of test automation. Eager to learn more about development.',
    skills: ['Selenium', 'Jest', 'JavaScript', 'Cypress'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496358773-bdcdbd984982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjB3b21hbnxlbnwxfHx8fDE3NjQ5MDIzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/nvolkov',
      linkedin: 'https://linkedin.com/in/ninavolkov'
    },
    scores: {
      junior: {
        'technical_basics': 3,
        'learning_ability': 3,
        'code_quality': 2,
        'collaboration': 3
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '17',
    candidateName: 'Jamal Thompson',
    role: 'Senior Platform Engineer',
    date: '2024-10-05',
    notes: 'Deep Kubernetes expertise. Has built internal developer platforms. Great at infrastructure as code.',
    skills: ['Kubernetes', 'Terraform', 'Go', 'Python', 'AWS', 'Azure'],
    avatarUrl: 'https://images.unsplash.com/photo-1495603889488-42d1d66e5523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMG1hbnxlbnwxfHx8fDE3NjQ5MDIzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/jthompson',
      linkedin: 'https://linkedin.com/in/jamalthompson'
    },
    audioNotes: [
      {
        id: 'audio-7',
        duration: 195,
        transcript: 'Jamal discussed his experience building a complete platform engineering solution. His knowledge of cloud infrastructure is exceptional.'
      }
    ],
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 4,
        'communication_leadership': 4,
        'experience_quality': 4
      }
    }
  },
  {
    id: '18',
    candidateName: 'Sophie Dubois',
    role: 'Mid-Level Backend Developer',
    date: '2024-09-28',
    notes: 'Strong Java and Spring Boot background. Good database design skills. Transitioning from enterprise to startup environment.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker'],
    avatarUrl: 'https://images.unsplash.com/photo-1580983218547-8333cb1d76b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBlbmdpbmVlciUyMHdvbWFufGVufDF8fHx8MTc2NDkwMjMxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/sdubois',
      linkedin: 'https://linkedin.com/in/sophiedubois'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 4,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 2
      },
      senior: {}
    }
  },
  {
    id: '19',
    candidateName: 'Liam O\'Connor',
    role: 'Junior DevOps Engineer',
    date: '2024-09-22',
    notes: 'Strong Linux fundamentals. Good scripting skills. Needs more exposure to cloud platforms.',
    skills: ['Linux', 'Bash', 'Python', 'Docker', 'Git'],
    avatarUrl: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDg2MTM5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/loconnor'
    },
    scores: {
      junior: {
        'technical_basics': 2,
        'learning_ability': 3,
        'code_quality': 1,
        'collaboration': 2
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '20',
    candidateName: 'Maya Gupta',
    role: 'Senior ML Engineer',
    date: '2024-09-18',
    notes: 'PhD in Machine Learning. Strong production ML experience. Looking to work on product-facing ML features.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS', 'Kubernetes'],
    avatarUrl: 'https://images.unsplash.com/photo-1573495804669-ec82ad00f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRldmVsb3BlcnxlbnwxfHx8fDE3NjQ4Njk3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/mayagupta',
      github: 'https://github.com/mgupta',
      portfolio: 'https://mayagupta.ai'
    },
    audioNotes: [
      {
        id: 'audio-8',
        duration: 220,
        transcript: 'Maya presented her research on production ML systems. Her understanding of both theoretical and practical aspects is outstanding.'
      }
    ],
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 4,
        'communication_leadership': 3,
        'experience_quality': 4
      }
    }
  },
  {
    id: '21',
    candidateName: 'Diego Silva',
    role: 'Mid-Level Full-Stack Developer',
    date: '2024-09-12',
    notes: 'Strong problem-solving skills. Good communication. Experience with modern web frameworks.',
    skills: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    avatarUrl: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0ODk4OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/dsilva',
      portfolio: 'https://diegosilva.dev'
    },
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 3
      },
      senior: {}
    }
  },
  {
    id: '22',
    candidateName: 'Isabella Martinez',
    role: 'Junior UI/UX Developer',
    date: '2024-09-08',
    notes: 'Design school graduate with coding skills. Great eye for detail. Still building technical confidence.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Adobe XD'],
    avatarUrl: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMGRldmVsb3BlcnxlbnwxfHx8fDE3NjQ5MDIzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      portfolio: 'https://isabellamartinez.design',
      codepen: 'https://codepen.io/imartinez'
    },
    audioNotes: [
      {
        id: 'audio-9',
        duration: 95,
        transcript: 'Isabella showcased impressive portfolio pieces. Her design-to-code workflow is efficient.'
      }
    ],
    scores: {
      junior: {
        'technical_basics': 3,
        'learning_ability': 3,
        'code_quality': 2,
        'collaboration': 3
      },
      mid: {},
      senior: {}
    }
  },
  {
    id: '23',
    candidateName: 'Thomas Berg',
    role: 'Senior Cloud Architect',
    date: '2024-09-02',
    notes: 'Multi-cloud expert. Has designed enterprise-scale cloud migrations. Strong cost optimization skills.',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'CloudFormation'],
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdHxlbnwxfHx8fDE3NjQ4MzU3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      linkedin: 'https://linkedin.com/in/thomasberg',
      github: 'https://github.com/tberg'
    },
    scores: {
      junior: {},
      mid: {},
      senior: {
        'technical_depth': 5,
        'practical_judgment': 5,
        'communication_leadership': 5,
        'experience_quality': 4
      }
    }
  },
  {
    id: '24',
    candidateName: 'Amara Okafor',
    role: 'Mid-Level Product Engineer',
    date: '2024-08-25',
    notes: 'Great product sense combined with solid engineering. Works well with PMs. Strong at prototyping.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Figma'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMHdvbWFufGVufDF8fHx8MTc2NDkwMjMxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    links: {
      github: 'https://github.com/aokafor',
      portfolio: 'https://amaraokafor.com',
      linkedin: 'https://linkedin.com/in/amaraokafor'
    },
    audioNotes: [
      {
        id: 'audio-10',
        duration: 156,
        transcript: 'Amara demonstrated excellent product thinking. Her ability to balance user needs with technical constraints is impressive.'
      }
    ],
    scores: {
      junior: {},
      mid: {
        'technical_depth': 3,
        'problem_solving': 3,
        'autonomy': 3,
        'communication': 3
      },
      senior: {}
    }
  }
];