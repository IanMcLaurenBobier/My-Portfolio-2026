import type {
  ExperiencePillar,
  NetworkLink,
  NetworkNode,
  ProjectItem,
  TechBadgeItem,
  TechCategory,
  ThemeOption,
} from '../types/portfolio';

export const PERSONAL_PROFILE = {
  fullName: 'Ian Mc Lauren Bobier',
  preferredName: 'Mac',
  headlineRole: 'Junior Software Developer, IT Technical Support & Networking',
  introHook: 'Building practical solutions through software, systems, and technology.',
  aboutSummary:
    'Computer Science graduate from Taguig City University. During my internship at DOST-FNRI, I supported IT operations, built and repaired desktop workstations, configured event routers, and helped redesign the IFNRI web frontend.',
  aboutSecondary:
    'Focused on full-stack web workflows, database architecture, network infrastructure, and practical AI applications.',
  degree: 'Bachelor of Science in Computer Science',
  university: 'Taguig City University',
  location: 'Taguig City, Metro Manila, Philippines',
  graduation: '2026',
  // TODO: replace with real contact details
  contactEmail: 'hello@example.com',
  githubUrlPlaceholder: 'https://github.com/IanMcLaurenBobier',
  linkedinUrlPlaceholder: 'https://www.linkedin.com/',
};

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'red', label: 'Red', swatchHex: '#ef4444', threeColor: 0xef4444 },
  { id: 'blue', label: 'Blue', swatchHex: '#3b82f6', threeColor: 0x3b82f6 },
  { id: 'purple', label: 'Purple', swatchHex: '#a855f7', threeColor: 0xa855f7 },
  { id: 'green', label: 'Green', swatchHex: '#22c55e', threeColor: 0x22c55e },
  { id: 'orange', label: 'Orange', swatchHex: '#f59e0b', threeColor: 0xf59e0b },
];

export const TECH_CATEGORIES: TechCategory[] = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Database Management',
  'UI/UX Design',
  'IT Support & Infrastructure',
  'Networking',
  'AI & Automation',
];

export const TECH_BADGES: TechBadgeItem[] = [
  { id: 'typescript', name: 'TypeScript', category: 'Programming Languages', tier: 'Used in Projects', summary: 'Typed React and Node.js codebases, including this portfolio.' },
  { id: 'javascript', name: 'JavaScript', category: 'Programming Languages', tier: 'Used in Projects', summary: 'Interactive web interfaces and browser scripting.' },
  { id: 'python', name: 'Python', category: 'Programming Languages', tier: 'Hands-on Experience', summary: 'Scripting, data processing, and AI/OCR experiments.' },
  { id: 'java', name: 'Java', category: 'Programming Languages', tier: 'Hands-on Experience', summary: 'Object-oriented programming coursework and academic builds.' },
  { id: 'php', name: 'PHP', category: 'Programming Languages', tier: 'Used in Projects', summary: 'Server-side web development with Laravel.' },
  { id: 'vbnet', name: 'VB.NET', category: 'Programming Languages', tier: 'Hands-on Experience', summary: 'Desktop application development for academic systems.' },
  { id: 'sql', name: 'SQL', category: 'Programming Languages', tier: 'Used in Projects', summary: 'Relational queries, joins, and schema design.' },

  { id: 'react', name: 'React', category: 'Frontend Development', tier: 'Used in Projects', summary: 'Component-driven SPAs with hooks and state management.' },
  { id: 'astro', name: 'Astro', category: 'Frontend Development', tier: 'Hands-on Experience', summary: 'Content-focused static sites with island architecture.' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend Development', tier: 'Used in Projects', summary: 'Utility-first styling and responsive layouts.' },
  { id: 'react-native', name: 'React Native', category: 'Frontend Development', tier: 'Familiar With', summary: 'Cross-platform mobile UI prototyping.' },
  { id: 'html-css', name: 'HTML5 / CSS3', category: 'Frontend Development', tier: 'Used in Projects', summary: 'Semantic markup, accessibility, and modern CSS.' },

  { id: 'nodejs', name: 'Node.js', category: 'Backend Development', tier: 'Used in Projects', summary: 'JavaScript runtime for APIs and tooling.' },
  { id: 'express', name: 'Express.js', category: 'Backend Development', tier: 'Used in Projects', summary: 'REST API routing and middleware.' },
  { id: 'laravel', name: 'Laravel', category: 'Backend Development', tier: 'Used in Projects', summary: 'MVC APIs with Eloquent, FormRequests, and migrations.' },
  { id: 'rest', name: 'REST APIs', category: 'Backend Development', tier: 'Used in Projects', summary: 'Designing and consuming JSON HTTP endpoints.' },

  { id: 'mysql', name: 'MySQL', category: 'Database Management', tier: 'Used in Projects', summary: 'Relational schemas, normalization, and indexing.' },
  { id: 'firebase', name: 'Firebase', category: 'Database Management', tier: 'Hands-on Experience', summary: 'Realtime data and authentication for prototypes.' },

  { id: 'figma', name: 'Figma', category: 'UI/UX Design', tier: 'Used in Projects', summary: 'Wireframes, prototypes, and UI redesigns such as the IFNRI frontend.' },

  { id: 'hardware', name: 'Hardware Diagnostics', category: 'IT Support & Infrastructure', tier: 'Hands-on Experience', summary: 'Troubleshooting and repairing desktop components at DOST-FNRI.' },
  { id: 'workstation', name: 'Workstation & AIO Setup', category: 'IT Support & Infrastructure', tier: 'Hands-on Experience', summary: 'Building, imaging, and deploying desktops and all-in-ones.' },
  { id: 'workspace', name: 'M365 & Google Workspace', category: 'IT Support & Infrastructure', tier: 'Hands-on Experience', summary: 'Account setup and productivity suite support.' },
  { id: 'docker-git', name: 'Docker & Git/GitHub', category: 'IT Support & Infrastructure', tier: 'Familiar With', summary: 'Version control workflows and containerized environments.' },

  { id: 'router', name: 'Router Setup & Config', category: 'Networking', tier: 'Hands-on Experience', summary: 'Configuring routers and access points for events and offices.' },
  { id: 'tcpip', name: 'TCP/IP & Subnets', category: 'Networking', tier: 'Hands-on Experience', summary: 'IP addressing, subnetting, and VLAN fundamentals.' },

  { id: 'ai', name: 'AI Integration', category: 'AI & Automation', tier: 'Technical Interest', summary: 'Integrating LLM APIs into practical applications.' },
  { id: 'ocr', name: 'OCR Pipelines', category: 'AI & Automation', tier: 'Hands-on Experience', summary: 'Extracting structured data from scanned documents.' },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-dpmis-lite',
    slug: 'dpmis-lite',
    title: 'DPMIS Lite',
    subtitle: 'Data & Process Management Information System',
    category: 'Featured',
    domain: 'Web Application',
    summary: 'A lightweight management information system for organizing records, tracking processes, and generating reports.',
    architectureNotes: 'React frontend backed by a REST API and a normalized MySQL schema.',
    features: ['Record management', 'Role-based access', 'Reporting dashboard'],
    technologies: ['React', 'TypeScript', 'Laravel', 'MySQL'],
    imageUrl: '/src/assets/images/dpmis_lite_preview.png',
    repoPlaceholder: 'Repository available on request',
    year: '2025',
  },
  {
    id: 'proj-hyperdiasense',
    slug: 'hyperdiasense',
    title: 'HyperDiaSense',
    subtitle: 'AI-assisted health screening',
    category: 'Featured',
    domain: 'AI & Health',
    summary: 'An AI-assisted application exploring early screening insights for hypertension and diabetes.',
    architectureNotes: 'Client application paired with a data pipeline and AI integration for analysis.',
    features: ['Health data input', 'AI-assisted insights', 'OCR document capture'],
    technologies: ['React Native', 'Python', 'Firebase', 'OCR Pipelines'],
    imageUrl: '/src/assets/images/hyperdiasense_preview.png',
    repoPlaceholder: 'Repository available on request',
    year: '2025',
  },
  {
    id: 'proj-lapse-through-time',
    slug: 'lapse-through-time',
    title: 'Lapse Through Time',
    subtitle: 'Interactive historical experience',
    category: 'Featured',
    domain: 'Interactive Web',
    summary: 'An interactive web experience that walks visitors through a visual timeline.',
    architectureNotes: 'Static frontend with animated, content-driven sections.',
    features: ['Animated timeline', 'Responsive layout', 'Rich media sections'],
    technologies: ['JavaScript', 'HTML5 / CSS3', 'Tailwind CSS'],
    imageUrl: '/src/assets/images/project_lapse_time_1795013815002.jpg',
    repoPlaceholder: 'Repository available on request',
    year: '2024',
  },
  {
    id: 'proj-network-lab',
    slug: 'office-network-lab',
    title: 'Office Network Lab',
    subtitle: 'Simulated office topology',
    category: 'Additional',
    domain: 'Networking',
    summary: 'A simulated office network covering VLAN segmentation, routing, and connectivity testing.',
    architectureNotes: 'Router-on-a-stick design with segmented VLANs for staff, servers, and guests.',
    features: ['VLAN segmentation', 'Subnet planning', 'Connectivity tests'],
    technologies: ['TCP/IP & Subnets', 'Router Setup & Config'],
    imageUrl: '/src/assets/images/project_network_lab_1795013815610.jpg',
    year: '2024',
  },
];

export const DOST_FNRI_EXPERIENCE: {
  organization: string;
  fullOrganization: string;
  role: string;
  location: string;
  summary: string;
  pillars: ExperiencePillar[];
} = {
  organization: 'DOST-FNRI',
  fullOrganization: 'Department of Science and Technology – Food and Nutrition Research Institute',
  role: 'IT Intern',
  location: 'Taguig City, Philippines',
  summary:
    'Supported IT operations, built and repaired desktop workstations, configured event routers, and helped redesign the IFNRI web frontend.',
  pillars: [
    {
      title: 'IT Support & Troubleshooting',
      items: [
        'Diagnosed and repaired desktop hardware issues',
        'Built and set up workstations and all-in-one units',
        'Assisted staff with M365 and Google Workspace accounts',
      ],
    },
    {
      title: 'Networking & Infrastructure',
      items: [
        'Configured routers and access points for institute events',
        'Assisted with cabling and connectivity checks',
        'Documented IP and network assignments',
      ],
    },
    {
      title: 'IFNRI Web Development',
      items: [
        'Helped redesign the IFNRI web frontend',
        'Created UI mockups in Figma',
        'Implemented responsive layouts and components',
      ],
    },
  ],
};

export const NETWORK_NODES: NetworkNode[] = [
  { id: 'isp', label: 'ISP Gateway', role: 'Internet Uplink', ip: '203.0.113.1', vlan: 'WAN', x: 80, y: 165, notes: 'Upstream connection to the internet service provider.', status: 'Simulated' },
  { id: 'router', label: 'Core Router', role: 'Routing & NAT', ip: '192.168.1.1', vlan: 'VLAN 1', x: 230, y: 165, notes: 'Handles inter-VLAN routing, NAT, and DHCP.', status: 'Active' },
  { id: 'switch', label: 'Core Switch', role: 'Layer 2 Switching', ip: '192.168.1.2', vlan: 'Trunk', x: 400, y: 165, notes: '802.1Q trunk carrying all office VLANs.', status: 'Active' },
  { id: 'staff', label: 'Staff PCs', role: 'Workstations', ip: '192.168.10.0/24', vlan: 'VLAN 10', x: 600, y: 60, notes: 'Office workstations and all-in-one units.', status: 'Active' },
  { id: 'server', label: 'File Server', role: 'Shared Storage', ip: '192.168.20.10', vlan: 'VLAN 20', x: 640, y: 165, notes: 'Central file shares and backups.', status: 'Simulated' },
  { id: 'wifi', label: 'Event AP', role: 'Wireless Access', ip: '192.168.30.0/24', vlan: 'VLAN 30', x: 600, y: 270, notes: 'Guest and event wireless network, isolated from staff.', status: 'Active' },
];

export const NETWORK_LINKS: NetworkLink[] = [
  { id: 'l1', from: 'isp', to: 'router', bandwidth: '100 Mbps', protocol: 'PPPoE' },
  { id: 'l2', from: 'router', to: 'switch', bandwidth: '1 Gbps', protocol: '802.1Q' },
  { id: 'l3', from: 'switch', to: 'staff', bandwidth: '1 Gbps', protocol: 'Ethernet' },
  { id: 'l4', from: 'switch', to: 'server', bandwidth: '1 Gbps', protocol: 'Ethernet' },
  { id: 'l5', from: 'switch', to: 'wifi', bandwidth: '1 Gbps', protocol: 'Ethernet' },
];
