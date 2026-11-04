import type { ResumeDocument } from '../schemas/resume.schema';

/** Representative English content used by schema tests and future previews. */
export const SAMPLE_RESUME_EN: ResumeDocument = {
  schemaVersion: 1,
  content: {
    id: 'sample-en',
    personal: {
      fullName: 'Alexandra Chen',
      professionalTitle: 'Senior Product Manager',
      email: 'alex.chen@example.com',
      phone: '+1 (415) 555-0192',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/alexchen',
      website: 'https://alexchen.io',
      summary:
        'Product leader with eight years of experience building customer-focused software. Led a portfolio of B2B products to $40M in annual recurring revenue through clear roadmaps, rigorous discovery, and close partnership with engineering and design.',
    },
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Senior Product Manager',
        employer: 'TechCorp Global',
        location: 'San Francisco, CA',
        startDate: 'Jan 2021',
        endDate: 'Present',
        isCurrent: true,
        description: 'Lead product strategy for the company’s analytics platform.',
        achievements: [
          { id: 'exp-1-ach-1', text: 'Launched a B2B analytics platform that reached 12,000 enterprise customers in 18 months.' },
          { id: 'exp-1-ach-2', text: 'Improved user retention by 34% after redesigning onboarding from customer research.' },
          { id: 'exp-1-ach-3', text: 'Aligned three engineering squads around quarterly goals, delivering 47 roadmap features.' },
        ],
      },
      {
        id: 'exp-2',
        jobTitle: 'Product Manager',
        employer: 'StartupAI Inc.',
        location: 'New York, NY',
        startDate: 'Mar 2018',
        endDate: 'Dec 2020',
        isCurrent: false,
        achievements: [
          { id: 'exp-2-ach-1', text: 'Reduced recommendation service latency by 60% while maintaining model quality.' },
          { id: 'exp-2-ach-2', text: 'Took a new product from concept to beta in 14 weeks.' },
        ],
      },
      {
        id: 'exp-3',
        jobTitle: 'Associate Product Manager',
        employer: 'FinTech Solutions Ltd.',
        location: 'Chicago, IL',
        startDate: 'Jun 2016',
        endDate: 'Feb 2018',
        isCurrent: false,
        achievements: [
          { id: 'exp-3-ach-1', text: 'Managed mobile banking features used by more than 500,000 customers.' },
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Stanford Graduate School of Business',
        degree: 'Master of Business Administration',
        fieldOfStudy: 'Product and Innovation',
        location: 'Stanford, CA',
        startDate: '2014',
        endDate: '2016',
        grade: '3.9 GPA',
      },
      {
        id: 'edu-2',
        institution: 'University of Michigan',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        location: 'Ann Arbor, MI',
        startDate: '2010',
        endDate: '2014',
      },
    ],
    skills: [
      { id: 'skill-1', name: 'Product strategy', category: 'Product', proficiency: 'expert' },
      { id: 'skill-2', name: 'Roadmapping', category: 'Product', proficiency: 'advanced' },
      { id: 'skill-3', name: 'SQL and data analysis', category: 'Technical', proficiency: 'advanced' },
      { id: 'skill-4', name: 'User research', category: 'Research' },
      { id: 'skill-5', name: 'Figma', category: 'Design', proficiency: 'intermediate' },
    ],
    projects: [
      {
        id: 'project-1',
        title: 'ProductMetrics Dashboard',
        role: 'Project Lead',
        description: 'Built an open-source dashboard for product metrics with integrations for common analytics platforms.',
        url: 'https://github.com/alexchen/productmetrics',
        technologies: ['React', 'TypeScript', 'D3.js'],
        startDate: '2022',
        endDate: '2023',
      },
    ],
    certifications: [
      { id: 'cert-1', name: 'Certified Product Manager', issuer: 'Product Management Institute', date: '2020' },
      { id: 'cert-2', name: 'Professional Scrum Product Owner I', issuer: 'Scrum.org', date: '2019' },
    ],
    languages: [
      { id: 'lang-1', name: 'English', proficiency: 'Native' },
      { id: 'lang-2', name: 'Mandarin Chinese', proficiency: 'Professional working proficiency' },
      { id: 'lang-3', name: 'Spanish', proficiency: 'Intermediate' },
    ],
    awards: [
      {
        id: 'award-1',
        title: 'Customer Impact Award',
        issuer: 'TechCorp Global',
        date: '2023',
        description: 'Recognized for measurable improvements to customer onboarding and retention.',
      },
    ],
    volunteering: [
      {
        id: 'vol-1',
        role: 'Product Mentor',
        organization: 'Women in Product',
        location: 'San Francisco, CA',
        startDate: '2021',
        isCurrent: true,
        achievements: [
          { id: 'vol-1-ach-1', text: 'Mentor early-career product managers through monthly career and portfolio sessions.' },
        ],
      },
    ],
    publications: [
      {
        id: 'pub-1',
        title: 'A Practical Guide to Product Discovery at Scale',
        publisher: 'Product Practice Journal',
        date: '2022',
        url: 'https://example.com/product-discovery-guide',
      },
    ],
    interests: [
      { id: 'interest-1', name: 'Community mentoring' },
      { id: 'interest-2', name: 'Urban photography' },
    ],
    customSections: [
      {
        id: 'custom-speaking',
        title: 'Selected Speaking',
        entries: [
          {
            id: 'talk-1',
            title: 'Building Products Around Customer Outcomes',
            subtitle: 'ProductCon San Francisco',
            date: '2023',
            details: ['Keynote on research-led product planning for cross-functional teams.'],
          },
          {
            id: 'talk-2',
            title: 'Metrics That Improve Product Decisions',
            subtitle: 'Bay Area Product Meetup',
            date: '2022',
            details: [],
          },
        ],
      },
    ],
  },
  design: {
    templateId: 'ats-classic',
    paperSize: 'a4',
    language: 'en',
    direction: 'ltr',
    fontFamily: 'Arial',
    fontSizes: { name: 25, heading: 15, body: 10.5, small: 9 },
    margins: { top: 14, right: 16, bottom: 14, left: 16 },
    accentColor: '#1E3A8A',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'custom-speaking'],
    sectionVisibility: { summary: true, experience: true, education: true, 'custom-speaking': true },
  },
};

/** Arabic-language RTL fixture with examples from all standard content groups. */
export const SAMPLE_RESUME_AR: ResumeDocument = {
  schemaVersion: 1,
  content: {
    id: 'sample-ar',
    personal: {
      fullName: 'أحمد الراشد',
      professionalTitle: 'مدير مشاريع تقنية أول',
      email: 'ahmad.alrashid@example.com',
      phone: '+966 50 123 4567',
      location: 'الرياض، المملكة العربية السعودية',
      linkedIn: 'https://linkedin.com/in/ahmadalrashid',
      website: 'https://ahmadalrashid.example.com',
      summary:
        'قائد مشاريع تقنية بخبرة تزيد على عشر سنوات في تسليم المنتجات والمنصات الرقمية. يقود فرقاً متعددة التخصصات، ويحسن كفاءة العمليات، ويربط المبادرات التقنية بأهداف الأعمال واحتياجات العملاء.',
    },
    experience: [
      {
        id: 'exp-ar-1',
        jobTitle: 'مدير مشاريع تقنية أول',
        employer: 'شركة التقنية المتقدمة',
        location: 'الرياض',
        startDate: 'يناير 2020',
        isCurrent: true,
        description: 'قيادة تنفيذ خارطة الطريق الرقمية وإدارة فرق المنتج والهندسة.',
        achievements: [
          { id: 'exp-ar-1-ach-1', text: 'قاد فريقاً من 25 مهندساً لإطلاق منصة رقمية تخدم أكثر من مليون مستخدم.' },
          { id: 'exp-ar-1-ach-2', text: 'خفض مدة تسليم المشاريع بنسبة 35٪ عبر تحسين التخطيط وإدارة الاعتماديات.' },
          { id: 'exp-ar-1-ach-3', text: 'أدار ميزانية تقنية سنوية تجاوزت 12 مليون ريال مع الالتزام بمؤشرات الأداء.' },
        ],
      },
      {
        id: 'exp-ar-2',
        jobTitle: 'مدير مشروع',
        employer: 'حلول الأعمال الرقمية',
        location: 'جدة',
        startDate: 'مارس 2016',
        endDate: 'ديسمبر 2019',
        isCurrent: false,
        achievements: [
          { id: 'exp-ar-2-ach-1', text: 'نسق إطلاق بوابة خدمات إلكترونية خفضت وقت معالجة الطلبات بنسبة 40٪.' },
        ],
      },
    ],
    education: [
      {
        id: 'edu-ar-1',
        institution: 'جامعة الملك سعود',
        degree: 'ماجستير إدارة الأعمال',
        fieldOfStudy: 'إدارة التقنية',
        location: 'الرياض',
        startDate: '2013',
        endDate: '2015',
      },
      {
        id: 'edu-ar-2',
        institution: 'جامعة الملك فهد للبترول والمعادن',
        degree: 'بكالوريوس العلوم',
        fieldOfStudy: 'هندسة الحاسب الآلي',
        location: 'الظهران',
        startDate: '2007',
        endDate: '2012',
        grade: 'امتياز مع مرتبة الشرف',
      },
    ],
    skills: [
      { id: 'skill-ar-1', name: 'إدارة المشاريع', category: 'إدارة', proficiency: 'expert' },
      { id: 'skill-ar-2', name: 'منهجيات أجايل وسكرم', category: 'منهجيات', proficiency: 'advanced' },
      { id: 'skill-ar-3', name: 'إدارة أصحاب المصلحة', category: 'قيادة' },
      { id: 'skill-ar-4', name: 'تحليل البيانات', category: 'تقني', proficiency: 'intermediate' },
    ],
    projects: [
      {
        id: 'project-ar-1',
        title: 'منصة موحدة للخدمات الرقمية',
        role: 'مدير البرنامج',
        description: 'إشراف على توحيد تجربة المستخدم وربط الخدمات الحكومية عبر واجهات آمنة.',
        url: 'https://example.com/digital-platform',
        technologies: ['واجهات API', 'الحوسبة السحابية', 'تحليل البيانات'],
        startDate: '2021',
        endDate: '2023',
      },
    ],
    certifications: [
      { id: 'cert-ar-1', name: 'محترف إدارة المشاريع PMP', issuer: 'معهد إدارة المشاريع', date: '2018' },
      { id: 'cert-ar-2', name: 'محترف سكرم معتمد', issuer: 'Scrum Alliance', date: '2019' },
    ],
    languages: [
      { id: 'lang-ar-1', name: 'العربية', proficiency: 'اللغة الأم' },
      { id: 'lang-ar-2', name: 'الإنجليزية', proficiency: 'متقدم' },
    ],
    awards: [
      {
        id: 'award-ar-1',
        title: 'جائزة التميز في التحول الرقمي',
        issuer: 'شركة التقنية المتقدمة',
        date: '2022',
      },
    ],
    volunteering: [
      {
        id: 'vol-ar-1',
        role: 'مرشد مهني للطلاب',
        organization: 'مبادرة مهارات المستقبل',
        location: 'الرياض',
        startDate: '2021',
        isCurrent: true,
        achievements: [
          { id: 'vol-ar-1-ach-1', text: 'قدم جلسات إرشاد شهرية حول إدارة المشاريع والمسارات المهنية التقنية.' },
        ],
      },
    ],
    publications: [
      {
        id: 'pub-ar-1',
        title: 'إدارة التغيير في برامج التحول الرقمي',
        publisher: 'مجلة الإدارة والتقنية',
        date: '2021',
        url: 'https://example.com/digital-change',
      },
    ],
    interests: [
      { id: 'interest-ar-1', name: 'التوجيه المهني' },
      { id: 'interest-ar-2', name: 'القراءة في الابتكار' },
    ],
    customSections: [
      {
        id: 'custom-ar-initiatives',
        title: 'مبادرات مختارة',
        entries: [
          {
            id: 'initiative-ar-1',
            title: 'مجتمع مديري المشاريع',
            subtitle: 'مؤسس مشارك',
            date: '2020 – الآن',
            details: ['تنظيم لقاءات معرفية وتبادل الخبرات بين المتخصصين في إدارة المشاريع.'],
          },
        ],
      },
    ],
  },
  design: {
    templateId: 'academic-research',
    paperSize: 'a4',
    language: 'ar',
    direction: 'rtl',
    fontFamily: 'Noto Sans Arabic',
    fontSizes: { name: 25, heading: 16, body: 11, small: 9 },
    margins: { top: 15, right: 16, bottom: 15, left: 16 },
    accentColor: '#1D4ED8',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'publications', 'custom-ar-initiatives'],
    sectionVisibility: { summary: true, experience: true, education: true, 'custom-ar-initiatives': true },
  },
};
