import { ResumeData } from '@/types/resume';

/** Rich sample resume used for template gallery previews and development testing */
export const SAMPLE_RESUME_EN: ResumeData = {
  id: 'sample-en',
  templateId: 'ats-classic',
  locale: 'en',
  direction: 'ltr',
  paperSize: 'a4',
  personal: {
    fullName: 'Alexandra Chen',
    jobTitle: 'Senior Product Manager',
    email: 'alex.chen@example.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.io',
    summary:
      'Strategic product leader with 8+ years driving cross-functional teams to deliver user-centric software at scale. Proven record of launching zero-to-one products generating \$40M+ ARR. Expert at translating ambiguous market signals into crisp product roadmaps.',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Product Manager',
      company: 'TechCorp Global',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led end-to-end launch of a B2B SaaS analytics platform, growing to 12,000 enterprise customers within 18 months.',
        'Collaborated with 3 engineering squads and a design chapter to ship 47 features across 6 quarterly releases.',
        'Increased user retention by 34% by redesigning the onboarding flow based on 1,200-user research study.',
        'Defined and owned OKRs across product, marketing, and customer success; achieved 94% of targets in FY 2023.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Product Manager',
      company: 'StartupAI Inc.',
      location: 'New York, NY',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      bullets: [
        'Owned the full product lifecycle for an ML-powered recommendation engine serving 2M+ daily active users.',
        'Partnered with data science to reduce model inference latency by 60% while maintaining accuracy above 91%.',
        'Drove 0–1 MVP from concept to beta launch in 14 weeks, securing \$8M Series A funding.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Associate Product Manager',
      company: 'FinTech Solutions Ltd.',
      location: 'Chicago, IL',
      startDate: 'Jun 2016',
      endDate: 'Feb 2018',
      current: false,
      bullets: [
        'Managed a consumer mobile banking feature set used by 500,000 customers.',
        'Coordinated regulatory compliance reviews for PCI-DSS and GDPR-ready product updates.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'M.B.A., Product & Innovation',
      school: 'Stanford Graduate School of Business',
      location: 'Stanford, CA',
      endDate: '2016',
      gpa: '3.9',
    },
    {
      id: 'edu-2',
      degree: 'B.S., Computer Science',
      school: 'University of Michigan',
      location: 'Ann Arbor, MI',
      endDate: '2014',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: 's-1', name: 'Product Strategy', category: 'Product' },
    { id: 's-2', name: 'Roadmapping', category: 'Product' },
    { id: 's-3', name: 'SQL & Data Analysis', category: 'Technical' },
    { id: 's-4', name: 'A/B Testing', category: 'Technical' },
    { id: 's-5', name: 'User Research', category: 'Research' },
    { id: 's-6', name: 'Figma', category: 'Design' },
    { id: 's-7', name: 'Agile / Scrum', category: 'Process' },
    { id: 's-8', name: 'OKR Frameworks', category: 'Process' },
    { id: 's-9', name: 'Go-to-Market Strategy', category: 'Business' },
    { id: 's-10', name: 'Stakeholder Management', category: 'Business' },
    { id: 's-11', name: 'Python (Basics)', category: 'Technical' },
    { id: 's-12', name: 'JIRA & Confluence', category: 'Tools' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Open Source: ProductMetrics Dashboard',
      description:
        'Built an open-source React dashboard for PM metric visualization with 1,400+ GitHub stars. Integrates with Mixpanel, Amplitude, and Segment APIs.',
      link: 'github.com/alexchen/productmetrics',
      technologies: ['React', 'TypeScript', 'D3.js', 'REST APIs'],
    },
    {
      id: 'proj-2',
      title: 'AI-Assisted Prioritization Tool',
      description:
        'Prototype tool that uses GPT-based scoring to rank feature requests against strategic themes. Presented at ProductCon 2023.',
      technologies: ['Next.js', 'OpenAI API', 'PostgreSQL'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Product Manager (CPM)',
      issuer: 'Product Management Institute',
      date: '2020',
    },
    {
      id: 'cert-2',
      name: 'Google Analytics Individual Qualification',
      issuer: 'Google',
      date: '2022',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-2', language: 'Mandarin Chinese', proficiency: 'Professional' },
    { id: 'lang-3', language: 'Spanish', proficiency: 'Intermediate' },
  ],
};

/** Arabic RTL sample */
export const SAMPLE_RESUME_AR: ResumeData = {
  id: 'sample-ar',
  templateId: 'ats-classic',
  locale: 'ar',
  direction: 'rtl',
  paperSize: 'a4',
  personal: {
    fullName: 'أحمد الراشد',
    jobTitle: 'مدير مشروع أول',
    email: 'ahmad.alrashid@example.com',
    phone: '+966 50 123 4567',
    location: 'الرياض، المملكة العربية السعودية',
    linkedin: 'linkedin.com/in/ahmadalrashid',
    summary:
      'مدير مشاريع محترف يتمتع بخبرة تزيد على ثماني سنوات في قيادة المشاريع التقنية والرقمية الكبرى. متخصص في منهجيات أجايل وسكرم، وقيادة الفرق متعددة التخصصات لتحقيق الأهداف الاستراتيجية.',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'مدير مشروع أول',
      company: 'شركة التقنية المتقدمة',
      location: 'الرياض',
      startDate: 'يناير 2020',
      endDate: 'الحاضر',
      current: true,
      bullets: [
        'قاد فريقاً مكوناً من 25 مهندساً لتطوير منصة رقمية خدمت أكثر من مليون مستخدم.',
        'خفّض وقت التسليم بنسبة 40% من خلال تطبيق منهجية سكرم المتقدمة.',
        'أشرف على ميزانية تشغيلية تجاوزت 15 مليون ريال سعودي.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'ماجستير إدارة الأعمال',
      school: 'جامعة الملك عبدالله',
      endDate: '2016',
    },
  ],
  skills: [
    { id: 's-1', name: 'إدارة المشاريع', category: 'إدارة' },
    { id: 's-2', name: 'أجايل وسكرم', category: 'منهجيات' },
    { id: 's-3', name: 'تحليل البيانات', category: 'تقني' },
    { id: 's-4', name: 'قيادة الفرق', category: 'مهارات ناعمة' },
    { id: 's-5', name: 'التخطيط الاستراتيجي', category: 'إدارة' },
  ],
  projects: [],
  certifications: [
    { id: 'cert-1', name: 'PMP - محترف إدارة المشاريع', issuer: 'PMI', date: '2019' },
  ],
  languages: [
    { id: 'lang-1', language: 'العربية', proficiency: 'لغة أم' },
    { id: 'lang-2', language: 'الإنجليزية', proficiency: 'احترافي' },
  ],
};

