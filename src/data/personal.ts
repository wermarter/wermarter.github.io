import { countSkillUsage, selectCoreSkills, Skill, sortSkillsByRarity } from "./skills";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface CalendarPeriod {
  startMonth: Month;
  startYear: number;
  endMonth: Month | null;
  endYear: number | null;
}

export interface Project extends CalendarPeriod {
  id: string;
  name: string;
  description: string;
  role: string;
  achievements: string[];
  technologies: Skill[];
  team?: string;
  url?: string;
  featured?: boolean;
}

export interface Experience extends CalendarPeriod {
  company: string;
  title: string;
  summary: string[];
  projects: Project[];
}

export const profile = {
  name: "Hà Minh Chiến",
  handle: "wermarter",
  title: "Senior backend developer",
  tagline: "I build dependable systems and codebases that are easier to understand tomorrow.",
  summary:
    "Software engineer with four years of backend experience, a practical frontend foundation, and a strong interest in distributed systems, observability, and maintainable architecture.",
  location: "District 7, Ho Chi Minh City, Vietnam",
  birthYear: 2000,
  email: "wermarter@gmail.com",
  links: {
    github: "https://github.com/wermarter",
    linkedin: "https://www.linkedin.com/in/haminhchien",
  },
} as const;

export const education = [
  {
    institution: "VNU-HCM International University",
    program: "Software Engineering",
    start: "2018-09",
    end: "2023-03",
    score: "83.8/100",
  },
] as const;

const experienceData: Experience[] = [
  {
    company: "GBG Group Services",
    title: "Senior Backend Developer",
    startMonth: 6,
    startYear: 2025,
    endMonth: null,
    endYear: null,
    summary: [
      "Build ticketing services for a B2B2C marketplace, from affiliate imports and seller inventory to distribution and analytics.",
    ],
    projects: [
      {
        id: "football-ticket-net",
        name: "FootballTicketNet",
        startMonth: 6,
        startYear: 2025,
        endMonth: 9,
        endYear: 2025,
        description: "A football ticket marketplace.",
        role: "Backend developer",
        achievements: [
          "Established safe database transaction and raw SQL patterns.",
          "Refactored and tuned SQL queries with targeted index hints.",
          "Reduced a stream processing workload from 1 GB to 200 MB using AsyncGenerator.",
        ],
        technologies: [Skill.NestJS, Skill.CQRS, Skill.GraphQL, Skill.MySQL],
        team: "16 people: 10 backend, 5 frontend, 1 QA",
        url: "https://www.footballticketnet.com",
      },
      {
        id: "gigsberg",
        name: "Gigsberg",
        startMonth: 10,
        startYear: 2025,
        endMonth: null,
        endYear: null,
        description: "An international event ticket marketplace.",
        role: "Backend developer",
        achievements: [
          "Owned the technical and partner communication for a new ticket affiliate integration.",
          "Troubleshot and hotfixed production services with AWS CloudWatch.",
          "Integrated MaxMind minFraud and introduced stale-while-revalidate caching.",
          "Delivered B2B integrations with partner teams in Spain, the US, and Israel.",
        ],
        technologies: [Skill.Serverless, Skill.AWSLambda, Skill.Fastify, Skill.MySQL, Skill.Redis, Skill.SQS],
        team: "Around 20 people across several countries",
        url: "https://www.gigsberg.com",
        featured: true,
      },
    ],
  },
  {
    company: "NEXON DEV VINA",
    title: "Mid-level Backend Developer",
    startMonth: 2,
    startYear: 2025,
    endMonth: 5,
    endYear: 2025,
    summary: [
      "Joined technical interviews for fresher and junior roles.",
      "Gave an internal talk on distributed systems.",
    ],
    projects: [
      {
        id: "project-cc",
        name: "Project CC",
        startMonth: 6,
        startYear: 2024,
        endMonth: 5,
        endYear: 2025,
        description: "An observability-focused, event-driven web crawling platform.",
        role: "Developer, DevOps, SRE, and lead",
        achievements: [
          "Provisioned AWS infrastructure with Terraform and Ansible, then bootstrapped self-managed K3s with Rancher and Helm.",
          "Migrated to EKS with cluster autoscaling and RabbitMQ-driven external metrics.",
          "Correlated logs, traces, and metrics with OpenTelemetry, Loki, Tempo, and Prometheus.",
          "Maintained crawlers for more than 20 sites.",
        ],
        technologies: [Skill.NestJS, Skill.Kubernetes, Skill.Redis, Skill.RabbitMQ, Skill.Grafana],
        team: "8 people, autoscaling to a minimum of 1",
        featured: true,
      },
      {
        id: "project-af",
        name: "Project AF",
        startMonth: 2,
        startYear: 2025,
        endMonth: 5,
        endYear: 2025,
        description: "A graphic resource management system built with overseas teams.",
        role: "Backend developer and lead",
        achievements: [
          "Set up a backend monorepo around Clean Architecture.",
          "Reviewed backend work and collaborated on schema design and migrations.",
          "Analyzed frontend issues and coordinated backend tasks.",
        ],
        technologies: [Skill.NestJS, Skill.KafkaStreams, Skill.MySQL, Skill.OpenSearch, Skill.CloudFront, Skill.React, Skill.Electron],
        team: "8 people: 3 frontend, 3 backend, 2 Electron",
      },
    ],
  },
  {
    company: "NEXON DEV VINA",
    title: "Junior Backend Developer",
    startMonth: 4,
    startYear: 2023,
    endMonth: 1,
    endYear: 2025,
    summary: [
      "Developed web applications and internal tools for a Korean game company while collaborating in English with overseas managers and developers.",
    ],
    projects: [
      {
        id: "project-bc",
        name: "Project BC",
        startMonth: 11,
        startYear: 2023,
        endMonth: 5,
        endYear: 2025,
        description: "A large-scale distributed crawling system with 800 worker instances.",
        role: "Developer, DBA, and SRE",
        achievements: [
          "Reduced deployment cost by 60% with fault-tolerant workloads on AWS ECS.",
          "Autoscaled workers using custom AWS CloudWatch metrics.",
          "Improved throughput and memory use with streaming and micro-batching.",
          "Used Grafana, InfluxDB, and ad-hoc Redis and MySQL queries for on-call troubleshooting.",
          "Maintained crawlers for YouTube, Bilibili, and Steam.",
          "Built an ingestion pipeline with Snowflake and MySQL stored procedures.",
          "Built a Redis queue with at-least-once delivery from scratch.",
        ],
        technologies: [Skill.NodeJS, Skill.Redis, Skill.InfluxDB, Skill.Grafana, Skill.MySQL, Skill.ECSFargate, Skill.CloudWatch, Skill.Snowflake],
        team: "5 people, including 2 overseas teammates",
        featured: true,
      },
      {
        id: "project-inf",
        name: "Project INF",
        startMonth: 5,
        startYear: 2023,
        endMonth: 10,
        endYear: 2023,
        description: "An NLP pipeline for Excel input with analytical charts and graphs.",
        role: "Backend developer",
        achievements: [
          "Implemented the NLP data processing pipeline.",
          "Integrated proprietary OAuth 2.0 authorization code SSO.",
          "Created a containerized local workflow with Docker Compose.",
        ],
        technologies: [Skill.AWSEC2, Skill.Python, Skill.NestJS, Skill.MongoDB, Skill.RabbitMQ, Skill.Redis],
        team: "4 people",
      },
    ],
  },
  {
    company: "HCMC Center for Disease Control",
    title: "Full Stack Developer",
    startMonth: 9,
    startYear: 2022,
    endMonth: 3,
    endYear: 2023,
    summary: ["Worked directly with a laboratory team to turn their sample-testing workflow into a resilient internal platform."],
    projects: [
      {
        id: "diut",
        name: "DIUT laboratory platform",
        startMonth: 9,
        startYear: 2022,
        endMonth: 3,
        endYear: 2023,
        description: "A multi-tenant laboratory workflow system delivered as a solo full-stack engagement.",
        role: "Solo full-stack developer",
        achievements: [
          "Translated detailed requirements directly with the client.",
          "Deployed a secure, highly available platform onto four empty Ubuntu VMs.",
          "Evolved the architecture from single-host PM2 to Docker, then a three-node Kubernetes cluster with Contour Ingress, and finally four nodes with Envoy Gateway.",
          "Built a multi-tenant React interface with QR-code workflows, schema-validated forms, and CASL authorization.",
          "Built a NestJS monorepo with Redis, MongoDB, gRPC streaming, ABAC authorization, OpenAPI code generation, and PDF export.",
          "Automated on-premise delivery with GitHub Actions, Kubernetes, Helm, Ansible, Argo CD, Envoy Gateway, Longhorn, MinIO, and observability tooling.",
        ],
        technologies: [
          Skill.React,
          Skill.ReduxToolkitQuery,
          Skill.MUI,
          Skill.ReactRouter,
          Skill.Suspense,
          Skill.CASL,
          Skill.ReactHookForm,
          Skill.Zod,
          Skill.NestJS,
          Skill.Redis,
          Skill.MongoDB,
          Skill.GRPC,
          Skill.RxJS,
          Skill.CleanArchitecture,
          Skill.Puppeteer,
          Skill.EJS,
          Skill.ABAC,
          Skill.OpenAPI,
          Skill.GitHubActions,
          Skill.Kubernetes,
          Skill.Helm,
          Skill.Ansible,
          Skill.ArgoCD,
          Skill.EnvoyGateway,
          Skill.Longhorn,
          Skill.MinIO,
        ],
        team: "Solo project",
        url: "https://github.com/wermarter/diut",
        featured: true,
      },
    ],
  },
  {
    company: "Younet Media",
    title: "Web Intern",
    startMonth: 5,
    startYear: 2022,
    endMonth: 8,
    endYear: 2022,
    summary: ["Maintained a social-media analytics product and migrated an internal frontend tool from Vue to a React single-page application."],
    projects: [],
  },
];

const personalProjectData: Project[] = [
  {
    id: "homelab",
    name: "Homelab",
    startMonth: 11,
    startYear: 2023,
    endMonth: null,
    endYear: null,
    description: "A small, highly available K3s environment running on a Proxmox bare-metal laptop cluster.",
    role: "Owner and operator",
    achievements: [
      "Automated a three-node HA K3s cluster with Ansible.",
      "Configured Cloudflare dynamic DNS and remote VS Code tunneling.",
      "Use the lab as a safe place to learn infrastructure by operating it.",
    ],
    technologies: [Skill.Proxmox, Skill.Ansible, Skill.K3s, Skill.Cloudflare],
    url: "https://github.com/wermarter/homelab",
    featured: true,
  },
];

export const certifications = [
  { name: "TOEIC", score: "990/990", issuer: "IIG Vietnam", issued: "2023-01" },
  { name: "IELTS", score: "7.5/9.0", issuer: "IDP Education Ltd", issued: "2017-07" },
] as const;

const sourceProjects = [...personalProjectData, ...experienceData.flatMap((item) => item.projects)];
const skillUsage = countSkillUsage(sourceProjects);
const orderProjectSkills = (project: Project): Project => ({
  ...project,
  technologies: sortSkillsByRarity(project.technologies, skillUsage),
});

export const experience: Experience[] = experienceData.map((item) => ({
  ...item,
  projects: item.projects.map(orderProjectSkills),
}));
export const personalProjects: Project[] = personalProjectData.map(orderProjectSkills);
export const allProjects = [...personalProjects, ...experience.flatMap((item) => item.projects)];
export const coreSkills = selectCoreSkills(skillUsage, 3);
export const featuredProjects = allProjects.filter((project) => project.featured);

export const publicProfileData = {
  profile,
  education,
  coreSkills,
  experience,
  projects: allProjects,
  certifications,
};
