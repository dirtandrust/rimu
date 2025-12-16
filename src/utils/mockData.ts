import { Assessment } from '../App';

export const generateMockAssessment = (name: string = 'Candidate'): Assessment => {
  const skills = [
    {
      name: 'React',
      score: 8,
      reasoning: 'Candidate mentioned 3 years of React experience with multiple production projects. Strong component architecture understanding evident from project descriptions.',
      weight: 0.15,
      learningCurve: '1-2 weeks for team conventions',
      risks: ['No mention of testing practices', 'Unclear state management approach']
    },
    {
      name: 'Node.js',
      score: 7,
      reasoning: 'Backend experience with Node.js/Express for 2 years. Built REST APIs and worked with databases.',
      weight: 0.12,
      learningCurve: '2-3 weeks',
      risks: ['Limited microservices experience']
    },
    {
      name: 'TypeScript',
      score: 7,
      reasoning: 'Solid TypeScript usage across projects. Shows understanding of type safety and proper typing patterns.',
      weight: 0.10,
      learningCurve: '1 week for advanced patterns',
      risks: ['May need guidance on complex generics']
    },
    {
      name: 'AWS',
      score: 6,
      reasoning: 'Basic AWS experience mentioned (S3, EC2). Unclear depth of DevOps knowledge.',
      weight: 0.10,
      learningCurve: '4-6 weeks for advanced features',
      risks: ['May need DevOps support', 'Infrastructure as code not mentioned']
    }
  ];

  return {
    id: Date.now().toString(),
    candidateName: name,
    date: new Date().toISOString().split('T')[0],
    tags: ['React', 'Node.js', 'AWS'],
    seniority: 'Mid',
    overallScore: 7.2,
    skills,
    summary: 'Mid-level full-stack developer with 3-4 years of experience. Shows solid foundation in React and Node.js with practical project experience. Demonstrates ability to build complete features but may need guidance on architecture decisions and deployment.',
    strengths: [
      'Strong frontend skills with React',
      'Full-stack capability',
      'Multiple production projects delivered',
      'Good understanding of REST APIs'
    ],
    risks: [
      'Testing practices not clearly described',
      'Limited DevOps/infrastructure experience',
      'Unclear team collaboration depth',
      'No mention of code review or mentoring experience'
    ],
    roleFit: {
      junior: 6,
      mid: 9,
      senior: 4,
      bestFit: 'Mid-Level Full-Stack Developer'
    },
    teamCompatibility: [
      'Best in structured teams with established processes',
      'Will benefit from senior developer guidance on architecture',
      'Strong contributor for feature development',
      'May need support for deployment and infrastructure'
    ],
    notes: ''
  };
};
