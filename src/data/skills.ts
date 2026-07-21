export enum Skill {
  ABAC = "ABAC",
  Ansible = "Ansible",
  ArgoCD = "Argo CD",
  Astro = "Astro",
  AWSEC2 = "AWS EC2",
  AWSLambda = "AWS Lambda",
  CASL = "CASL",
  CleanArchitecture = "Clean Architecture",
  Cloudflare = "Cloudflare",
  CloudFront = "CloudFront",
  CloudWatch = "CloudWatch",
  CQRS = "CQRS",
  ECSFargate = "ECS Fargate",
  EJS = "EJS",
  Electron = "Electron",
  EnvoyGateway = "Envoy Gateway",
  Fastify = "Fastify",
  GitHubActions = "GitHub Actions",
  Grafana = "Grafana",
  GraphQL = "GraphQL",
  GRPC = "gRPC",
  Helm = "Helm",
  InfluxDB = "InfluxDB",
  K3s = "K3s",
  KafkaStreams = "Kafka Streams",
  Kubernetes = "Kubernetes",
  Longhorn = "Longhorn",
  MinIO = "MinIO",
  MongoDB = "MongoDB",
  MDX = "MDX",
  MUI = "MUI",
  MySQL = "MySQL",
  NestJS = "NestJS",
  NodeJS = "Node.js",
  OpenAPI = "OpenAPI",
  OpenSearch = "OpenSearch",
  Proxmox = "Proxmox",
  Puppeteer = "Puppeteer",
  Python = "Python",
  RabbitMQ = "RabbitMQ",
  React = "React",
  ReactHookForm = "React Hook Form",
  ReactRouter = "React Router",
  Redis = "Redis",
  ReduxToolkitQuery = "Redux Toolkit Query",
  RxJS = "RxJS",
  Serverless = "Serverless",
  Snowflake = "Snowflake",
  SQS = "SQS",
  Suspense = "Suspense",
  Zod = "Zod",
}

export interface SkillBearing {
  technologies: readonly Skill[];
}

export interface CoreSkill {
  name: Skill;
  projectCount: number;
}

export type SkillUsage = Readonly<Record<Skill, number>>;

const skills = Object.values(Skill);

/** Count each skill at most once per project. */
export function countSkillUsage(projects: readonly SkillBearing[]): SkillUsage {
  const usage = Object.fromEntries(skills.map((skill) => [skill, 0])) as Record<Skill, number>;

  for (const project of projects) {
    for (const skill of new Set(project.technologies)) {
      usage[skill] += 1;
    }
  }

  return usage;
}

/** Put uncommon skills first while keeping the authored order for frequency ties. */
export function sortSkillsByRarity(technologies: readonly Skill[], usage: SkillUsage): Skill[] {
  return technologies
    .map((skill, authoredIndex) => ({ skill, authoredIndex }))
    .sort((left, right) => usage[left.skill] - usage[right.skill] || left.authoredIndex - right.authoredIndex)
    .map(({ skill }) => skill);
}

/** Select the most frequently demonstrated skills; enum order resolves ties. */
export function selectCoreSkills(usage: SkillUsage, limit: number): CoreSkill[] {
  return skills
    .map((name, enumIndex) => ({ name, projectCount: usage[name], enumIndex }))
    .filter(({ projectCount }) => projectCount > 0)
    .sort((left, right) => right.projectCount - left.projectCount || left.enumIndex - right.enumIndex)
    .slice(0, limit)
    .map(({ name, projectCount }) => ({ name, projectCount }));
}
