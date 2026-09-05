/**
 * StatIntel AI — Skill Roadmap & Verification Service
 * Generates structured, multi-phase roadmaps with correct, topic-matched external resources.
 */

export interface SkillRoadmapTopic {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedMins: number;
  whatYouWillLearn: string[];
  practicalExercise: string;
  completed?: boolean;
  score?: number;
  resources: {
    id: string;
    title: string;
    url: string;
    source_domain: string;
    provider: string;
    source_class: 'OFFICIAL_GOVERNMENT' | 'OFFICIAL_DOCUMENTATION' | 'EDUCATIONAL_PLATFORM' | 'YOUTUBE' | 'OTHER';
    resource_type: 'DOCUMENTATION' | 'TUTORIAL' | 'VIDEO' | 'EXERCISE' | 'OFFICIAL_DOC' | 'NOTES';
    verification_status: 'VERIFIED' | 'UNVERIFIED' | 'DISABLED';
    last_verified: string;
    quality_score: number;
    estimated_mins: number;
    completed?: boolean;
  }[];
}

export interface SkillRoadmapPhase {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  completed?: boolean;
  topics: SkillRoadmapTopic[];
  assessmentQuestions?: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SkillRoadmapData {
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  gapLevels: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHours: number;
  roleRelevance: string;
  whyNeedSkill: string;
  phases: SkillRoadmapPhase[];
}

// ── Smart URL lookup table for generic fallback ───────────────────────────────
const SKILL_URL_MAP: { keywords: string[]; officialUrl: string; officialDomain: string; officialProvider: string; freeUrl: string; freeDomain: string; freeProvider: string }[] = [
  { keywords: ['linux', 'bash', 'shell', 'unix'], officialUrl: 'https://www.gnu.org/software/bash/manual/', officialDomain: 'gnu.org', officialProvider: 'GNU Project Official Manual', freeUrl: 'https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['docker', 'container', 'containerization'], officialUrl: 'https://docs.docker.com/get-started/', officialDomain: 'docs.docker.com', officialProvider: 'Docker Official Documentation', freeUrl: 'https://www.freecodecamp.org/news/docker-simplified-96639a35ff36/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['kubernetes', 'k8s', 'orchestration', 'helm'], officialUrl: 'https://kubernetes.io/docs/home/', officialDomain: 'kubernetes.io', officialProvider: 'Kubernetes Official Documentation', freeUrl: 'https://www.freecodecamp.org/news/the-kubernetes-handbook/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['ci/cd', 'cicd', 'github actions', 'jenkins', 'pipeline', 'devops'], officialUrl: 'https://docs.github.com/en/actions', officialDomain: 'docs.github.com', officialProvider: 'GitHub Actions Official Docs', freeUrl: 'https://www.freecodecamp.org/news/what-is-ci-cd/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['terraform', 'infrastructure as code', 'iac', 'hashicorp'], officialUrl: 'https://developer.hashicorp.com/terraform/docs', officialDomain: 'developer.hashicorp.com', officialProvider: 'HashiCorp Terraform Docs', freeUrl: 'https://www.freecodecamp.org/news/terraform-for-beginners/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['aws', 'azure', 'cloud', 'gcp', 'cloud services'], officialUrl: 'https://docs.aws.amazon.com/', officialDomain: 'docs.aws.amazon.com', officialProvider: 'AWS Official Documentation', freeUrl: 'https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-training-2019-free-video-course/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['python', 'pandas', 'numpy', 'scipy', 'matplotlib'], officialUrl: 'https://docs.python.org/3/tutorial/', officialDomain: 'docs.python.org', officialProvider: 'Python Official Documentation', freeUrl: 'https://www.w3schools.com/python/', freeDomain: 'w3schools.com', freeProvider: 'W3Schools' },
  { keywords: ['machine learning', 'scikit', 'sklearn', 'tensorflow', 'pytorch'], officialUrl: 'https://scikit-learn.org/stable/user_guide.html', officialDomain: 'scikit-learn.org', officialProvider: 'Scikit-Learn Official Documentation', freeUrl: 'https://www.freecodecamp.org/news/a-no-code-intro-to-the-9-most-important-machine-learning-algorithms-today/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['sql', 'database', 'postgresql', 'mysql', 'query'], officialUrl: 'https://www.postgresql.org/docs/', officialDomain: 'postgresql.org', officialProvider: 'PostgreSQL Official Docs', freeUrl: 'https://www.w3schools.com/sql/', freeDomain: 'w3schools.com', freeProvider: 'W3Schools' },
  { keywords: ['react', 'javascript', 'typescript', 'frontend', 'vue', 'angular'], officialUrl: 'https://react.dev/', officialDomain: 'react.dev', officialProvider: 'React Official Documentation', freeUrl: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['git', 'version control', 'github', 'gitlab'], officialUrl: 'https://git-scm.com/doc', officialDomain: 'git-scm.com', officialProvider: 'Git Official Documentation', freeUrl: 'https://www.freecodecamp.org/news/git-and-github-crash-course/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
  { keywords: ['statistics', 'sampling', 'hypothesis', 'inference', 'nsso', 'plfs', 'mospi'], officialUrl: 'https://www.mospi.gov.in', officialDomain: 'mospi.gov.in', officialProvider: 'MoSPI Official Portal', freeUrl: 'https://www.khanacademy.org/math/statistics-probability', freeDomain: 'khanacademy.org', freeProvider: 'Khan Academy' },
  { keywords: ['figma', 'design', 'ui', 'ux'], officialUrl: 'https://help.figma.com', officialDomain: 'help.figma.com', officialProvider: 'Figma Help Center', freeUrl: 'https://www.freecodecamp.org/news/figma-crash-course/', freeDomain: 'freecodecamp.org', freeProvider: 'freeCodeCamp' },
];

function getSkillUrls(skill: string) {
  const lower = skill.toLowerCase();
  for (const entry of SKILL_URL_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) return entry;
  }
  return {
    officialUrl: 'https://developer.mozilla.org/en-US/docs/Learn',
    officialDomain: 'developer.mozilla.org',
    officialProvider: 'MDN Web Docs',
    freeUrl: 'https://www.freecodecamp.org',
    freeDomain: 'freecodecamp.org',
    freeProvider: 'freeCodeCamp',
  };
}

// ── PREBUILT ROADMAPS ─────────────────────────────────────────────────────────
const PREBUILT_ROADMAPS: { [key: string]: Partial<SkillRoadmapData> } = {

  // ── LINUX SYSTEM ADMINISTRATION & BASH ─────────────────────────────────────
  'linux system administration & bash': {
    skillName: 'Linux System Administration & Bash',
    estimatedHours: 14,
    whyNeedSkill: 'Linux & Bash are the foundational layer for DevOps, cloud infrastructure, and server-side automation. Proficiency is required for all backend and DevOps career paths.',
    phases: [
      {
        id: 'p-linux-1',
        title: 'Phase 1 — Linux Core Foundations & Shell Basics',
        description: 'Master file system navigation, permissions, processes, and basic Bash scripting.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-linux-1',
            title: 'Linux File System, Permissions & Process Management',
            description: 'Navigate directories, set file permissions, manage processes, and understand Linux architecture.',
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              'Navigate Linux directory hierarchy (/, /etc, /var, /home, /usr)',
              'Set chmod/chown permissions with octal and symbolic notation',
              'Manage running processes with ps, top, kill, nice',
              'Understand inodes, hard links, and symbolic links',
              'Redirect stdin/stdout/stderr and use pipes',
            ],
            practicalExercise: 'Write a Bash script that lists all running processes sorted by CPU usage and kills any process consuming >80% CPU.',
            resources: [
              { id: 'res-linux-1-1', title: 'GNU Bash Official Reference Manual', url: 'https://www.gnu.org/software/bash/manual/', source_domain: 'gnu.org', provider: 'GNU Project', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 30 },
              { id: 'res-linux-1-2', title: 'Linux Command Line Basics — freeCodeCamp Full Tutorial', url: 'https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 25 },
              { id: 'res-linux-1-3', title: 'Linux Tutorial for Beginners — W3Schools', url: 'https://www.w3schools.com/whatis/whatis_linux.asp', source_domain: 'w3schools.com', provider: 'W3Schools', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 91, estimated_mins: 15 },
            ],
          },
          {
            id: 'top-linux-2',
            title: 'Bash Shell Scripting & Automation',
            description: 'Write modular Bash scripts with loops, conditionals, functions, and error handling.',
            orderIndex: 2, estimatedMins: 45,
            whatYouWillLearn: [
              'Write Bash scripts with if/elif/else conditionals',
              'Use for, while, until loops and arrays',
              'Define reusable functions with return values',
              'Handle errors with exit codes and trap signals',
              'Schedule tasks using cron and at',
            ],
            practicalExercise: 'Build a server health monitoring script that logs CPU, memory, and disk usage every 5 minutes and sends an alert when thresholds are exceeded.',
            resources: [
              { id: 'res-linux-2-1', title: 'Bash Scripting Tutorial — Ryan\'s Tutorials', url: 'https://ryanstutorials.net/bash-scripting-tutorial/', source_domain: 'ryanstutorials.net', provider: 'Ryan\'s Tutorials', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 30 },
              { id: 'res-linux-2-2', title: 'Shell Scripting Crash Course — Traversy Media (YouTube)', url: 'https://www.youtube.com/watch?v=v-F3YLd6oMw', source_domain: 'youtube.com', provider: 'Traversy Media', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 35 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-linux-1', question: 'What does chmod 755 set on a file?', options: ['Owner: rwx, Group: r-x, Others: r-x', 'Owner: rwx, Group: rwx, Others: rwx', 'Owner: r-x, Group: r-x, Others: r-x', 'Owner: rw-, Group: r--, Others: r--'], correctIndex: 0, explanation: '7=rwx, 5=r-x, 5=r-x. Owner can read/write/execute; group and others can only read and execute.' },
        ],
      },
      {
        id: 'p-linux-2',
        title: 'Phase 2 — Networking, SSH & System Services',
        description: 'Configure networking, manage SSH keys, and control systemd services.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-linux-3',
            title: 'Networking Tools: curl, wget, netstat, ss, iptables',
            description: 'Diagnose and configure Linux networking from the command line.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Use curl and wget for HTTP requests and file downloads',
              'Inspect open ports with netstat -tulnp and ss',
              'Configure basic iptables firewall rules',
              'Use ping, traceroute, dig, nslookup for diagnostics',
              'Set up static IPs and DNS resolution via /etc/resolv.conf',
            ],
            practicalExercise: 'Set up an iptables rule allowing only SSH (22) and HTTP (80) traffic and block all others.',
            resources: [
              { id: 'res-linux-3-1', title: 'Linux Networking Commands Cheatsheet — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/linux-networking-basics', source_domain: 'digitalocean.com', provider: 'DigitalOcean Tutorials', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 20 },
              { id: 'res-linux-3-2', title: 'Linux Networking Full Course — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=XaCS2QR-93s', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 30 },
            ],
          },
          {
            id: 'top-linux-4',
            title: 'Systemd, SSH & User Management',
            description: 'Control system services and configure secure remote access.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Manage services with systemctl start/stop/enable/status',
              'Generate and deploy SSH key pairs for passwordless login',
              'Configure sshd_config for hardened remote access',
              'Create users and groups with useradd, usermod, visudo',
              'Analyse system logs with journalctl and /var/log/syslog',
            ],
            practicalExercise: 'Harden a Linux server: disable root SSH login, create a sudo user, enable key-based auth, and configure fail2ban.',
            resources: [
              { id: 'res-linux-4-1', title: 'Systemd Service Management Guide — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 20 },
              { id: 'res-linux-4-2', title: 'SSH Key Setup Tutorial — Linux Handbook', url: 'https://linuxhandbook.com/ssh-key-based-authentication/', source_domain: 'linuxhandbook.com', provider: 'Linux Handbook', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 15 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-linux-2', question: 'Which command checks which port a service is listening on?', options: ['ss -tulnp', 'ls -la /etc', 'top -u root', 'df -h'], correctIndex: 0, explanation: 'ss (socket statistics) with -tulnp shows TCP/UDP listeners with PID and port numbers.' },
        ],
      },
      {
        id: 'p-linux-3',
        title: 'Phase 3 — Advanced Sysadmin & DevOps Automation',
        description: 'Master performance tuning, log management, and shell-based DevOps pipelines.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-linux-5',
            title: 'Performance Monitoring: htop, iostat, vmstat, strace',
            description: 'Profile system resource usage and diagnose bottlenecks.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Profile CPU, I/O, and memory bottlenecks with htop and vmstat',
              'Trace system calls with strace and ltrace',
              'Monitor disk I/O with iostat and iotop',
              'Analyse network throughput with iftop and nethogs',
              'Generate automated performance reports with sar',
            ],
            practicalExercise: 'Write a performance dashboard script that outputs CPU, memory, and disk usage in a human-readable report every 60 seconds.',
            resources: [
              { id: 'res-linux-5-1', title: 'Linux Performance Tools Tutorial — Brendan Gregg', url: 'https://www.brendangregg.com/linuxperf.html', source_domain: 'brendangregg.com', provider: 'Brendan Gregg (Netflix)', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-linux-5-2', title: 'Linux Monitoring Tools — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/top-linux-performance-monitoring-tools/', source_domain: 'geeksforgeeks.org', provider: 'GeeksforGeeks', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 92, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-linux-6',
            title: 'Cron Jobs, Log Rotation & Automated Backup Pipelines',
            description: 'Automate recurring tasks with cron, manage logs, and build backup strategies.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Schedule recurring cron jobs with crontab -e',
              'Configure logrotate for automatic log compression',
              'Build rsync-based incremental backup scripts',
              'Use tar, gzip, and scp for remote archiving',
              'Implement automated deployment rollback mechanisms',
            ],
            practicalExercise: 'Set up a daily automated backup script using rsync that rotates and compresses archives older than 7 days.',
            resources: [
              { id: 'res-linux-6-1', title: 'Cron Jobs Guide — Crontab Guru', url: 'https://crontab.guru/', source_domain: 'crontab.guru', provider: 'Crontab Guru', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 10 },
              { id: 'res-linux-6-2', title: 'rsync Backup Tutorial — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-linux-3', question: 'What does the cron expression "0 2 * * 1" mean?', options: ['Every Monday at 2:00 AM', 'Every 2 hours on Monday', 'Every day at 2:00 AM for 1 minute', 'Every minute on the 2nd day'], correctIndex: 0, explanation: 'Cron fields: minute hour day month weekday. "0 2 * * 1" = minute 0, hour 2, any day, any month, Monday (1).' },
        ],
      },
    ],
  },

  // ── DOCKER & CONTAINERIZATION ───────────────────────────────────────────────
  'docker & containerization': {
    skillName: 'Docker & Containerization',
    estimatedHours: 14,
    whyNeedSkill: 'Docker is the industry standard for application packaging and deployment. All modern DevOps, cloud, and microservices roles require containerization proficiency.',
    phases: [
      {
        id: 'p-docker-1',
        title: 'Phase 1 — Docker Fundamentals & Image Architecture',
        description: 'Understand container internals, build optimised images, and run containers.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-docker-1',
            title: 'Docker Engine, Images & Container Lifecycle',
            description: 'Install Docker, pull images, run containers, and understand the image layer model.',
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              'Distinguish containers from VMs and understand namespaces/cgroups',
              'Pull, run, stop, and remove containers with docker CLI',
              'Inspect container logs with docker logs and exec into containers',
              'Understand image layers and the Union File System',
              'Use docker ps, docker inspect, and docker stats',
            ],
            practicalExercise: 'Run an Nginx container, expose it on port 8080, exec into it and inspect the web server config.',
            resources: [
              { id: 'res-docker-1-1', title: 'Docker Official Get Started Guide', url: 'https://docs.docker.com/get-started/', source_domain: 'docs.docker.com', provider: 'Docker Official Documentation', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 30 },
              { id: 'res-docker-1-2', title: 'Docker Tutorial for Beginners — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 45 },
              { id: 'res-docker-1-3', title: 'Docker Simplified — freeCodeCamp Article', url: 'https://www.freecodecamp.org/news/docker-simplified-96639a35ff36/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-docker-2',
            title: 'Writing Dockerfiles & Multi-Stage Builds',
            description: 'Create optimised, production-ready Docker images using best practices.',
            orderIndex: 2, estimatedMins: 45,
            whatYouWillLearn: [
              'Write Dockerfiles with FROM, RUN, COPY, EXPOSE, ENTRYPOINT, CMD',
              'Use multi-stage builds to minimise final image size',
              'Apply .dockerignore to exclude unnecessary build context',
              'Understand ENTRYPOINT vs CMD execution models',
              'Scan images for vulnerabilities with docker scout',
            ],
            practicalExercise: 'Build a multi-stage Dockerfile for a Python FastAPI app — builder stage installs deps, runtime stage is minimal.',
            resources: [
              { id: 'res-docker-2-1', title: 'Dockerfile Best Practices — Docker Official Docs', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', source_domain: 'docs.docker.com', provider: 'Docker Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-docker-2-2', title: 'Multi-Stage Docker Builds Tutorial — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-flask-application-using-docker-on-ubuntu-20-04', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-docker-1', question: 'What is the purpose of ENTRYPOINT in a Dockerfile?', options: ['Sets the default executable that cannot be overridden by docker run args', 'Copies files into the image', 'Exposes a port from the container', 'Sets environment variables'], correctIndex: 0, explanation: 'ENTRYPOINT defines the container\'s main executable. CMD provides default arguments. docker run args override CMD but not ENTRYPOINT (unless --entrypoint flag is used).' },
        ],
      },
      {
        id: 'p-docker-2',
        title: 'Phase 2 — Docker Compose & Networking',
        description: 'Orchestrate multi-container applications and configure container networks.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-docker-3',
            title: 'Docker Compose: Multi-Container Application Orchestration',
            description: 'Define and run multi-service apps with docker-compose.yml.',
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              'Write docker-compose.yml with services, volumes, and networks',
              'Use environment variables and .env files',
              'Configure health checks and restart policies',
              'Scale services with docker compose up --scale',
              'Inspect inter-service networking with docker network ls',
            ],
            practicalExercise: 'Write a docker-compose.yml that runs a FastAPI backend + PostgreSQL + Redis, with health checks and named volumes.',
            resources: [
              { id: 'res-docker-3-1', title: 'Docker Compose Official Getting Started', url: 'https://docs.docker.com/compose/gettingstarted/', source_domain: 'docs.docker.com', provider: 'Docker Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-docker-3-2', title: 'Docker Compose Full Tutorial — TechWorld with Nana (YouTube)', url: 'https://www.youtube.com/watch?v=SXwC9fSwct8', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 40 },
            ],
          },
          {
            id: 'top-docker-4',
            title: 'Container Networking: Bridge, Host & Overlay Networks',
            description: 'Configure Docker networking modes for isolated and cross-host communication.',
            orderIndex: 2, estimatedMins: 35,
            whatYouWillLearn: [
              'Understand bridge, host, none, and overlay network drivers',
              'Create custom networks for container isolation',
              'Use DNS service discovery between containers',
              'Map ports with -p and configure host networking',
              'Inspect network config with docker network inspect',
            ],
            practicalExercise: 'Create two isolated Docker networks, place services on each, and configure a gateway container bridging both.',
            resources: [
              { id: 'res-docker-4-1', title: 'Docker Networking Overview — Official Docs', url: 'https://docs.docker.com/network/', source_domain: 'docs.docker.com', provider: 'Docker Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 20 },
              { id: 'res-docker-4-2', title: 'Docker Networking Tutorial — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-communicate-between-docker-containers', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-docker-2', question: 'In docker-compose.yml, what does "depends_on" guarantee?', options: ['The specified service starts before this one', 'The service waits for a healthy DB connection', 'Services share the same network namespace', 'Volumes are mounted in dependency order'], correctIndex: 0, explanation: 'depends_on ensures startup order only; it does not wait for the service to be ready/healthy. Use healthchecks + condition: service_healthy for readiness.' },
        ],
      },
      {
        id: 'p-docker-3',
        title: 'Phase 3 — Container Registry, Security & CI/CD Integration',
        description: 'Push images to registries, scan for vulnerabilities, and integrate Docker into CI pipelines.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-docker-5',
            title: 'Docker Hub, ECR & Private Registry Management',
            description: 'Tag, push, and pull images from Docker Hub and AWS ECR.',
            orderIndex: 1, estimatedMins: 30,
            whatYouWillLearn: [
              'Tag and push images to Docker Hub and AWS ECR',
              'Set up a private Docker registry with authentication',
              'Configure image pull secrets in CI pipelines',
              'Implement image versioning strategies (latest, semantic, git-sha)',
              'Automate image builds with GitHub Actions',
            ],
            practicalExercise: 'Set up a GitHub Actions workflow that builds, tags, and pushes a Docker image to Docker Hub on every main branch push.',
            resources: [
              { id: 'res-docker-5-1', title: 'Docker Hub Official Documentation', url: 'https://docs.docker.com/docker-hub/', source_domain: 'docs.docker.com', provider: 'Docker Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 15 },
              { id: 'res-docker-5-2', title: 'GitHub Actions Docker Build & Push Tutorial', url: 'https://www.freecodecamp.org/news/how-to-use-docker-with-github-actions/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-docker-6',
            title: 'Container Security: Rootless Docker & Image Scanning',
            description: 'Harden containers with least-privilege principles and vulnerability scanning.',
            orderIndex: 2, estimatedMins: 35,
            whatYouWillLearn: [
              'Run containers as non-root users with USER directive',
              'Scan images with trivy and docker scout for CVEs',
              'Use read-only file systems and drop Linux capabilities',
              'Apply seccomp profiles and AppArmor policies',
              'Implement secrets management with Docker secrets',
            ],
            practicalExercise: 'Harden a Docker image: non-root user, read-only filesystem, trivy scan with zero critical CVEs, drop ALL capabilities.',
            resources: [
              { id: 'res-docker-6-1', title: 'Docker Security Best Practices — Official Docs', url: 'https://docs.docker.com/engine/security/', source_domain: 'docs.docker.com', provider: 'Docker Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 25 },
              { id: 'res-docker-6-2', title: 'Container Security Guide — Aqua Security', url: 'https://www.aquasec.com/cloud-native-academy/docker-container/docker-security/', source_domain: 'aquasec.com', provider: 'Aqua Security', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-docker-3', question: 'Why should containers NOT run as the root user?', options: ['A root container process that escapes can access the host OS with full privileges', 'Root containers are slower due to security checks', 'Docker Hub rejects root-based images', 'Root disables layer caching in Docker builds'], correctIndex: 0, explanation: 'Container breakout exploits give attackers root-level host access if the container runs as root. Non-root USER limits the blast radius.' },
        ],
      },
    ],
  },

  // ── KUBERNETES (K8S) ORCHESTRATION ──────────────────────────────────────────
  'kubernetes (k8s) orchestration': {
    skillName: 'Kubernetes (K8s) Orchestration',
    estimatedHours: 16,
    whyNeedSkill: 'Kubernetes is the de facto container orchestration platform for production microservices. Required for all senior DevOps and platform engineering roles.',
    phases: [
      {
        id: 'p-k8s-1',
        title: 'Phase 1 — Kubernetes Core Concepts & kubectl',
        description: 'Understand Pods, Deployments, Services, and ConfigMaps using kubectl.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-k8s-1',
            title: 'Pods, Deployments, ReplicaSets & Namespaces',
            description: 'Deploy and manage workloads in Kubernetes clusters.',
            orderIndex: 1, estimatedMins: 45,
            whatYouWillLearn: [
              'Understand the Kubernetes control plane (API server, etcd, scheduler)',
              'Create and manage Pods, ReplicaSets, and Deployments',
              'Use kubectl get, describe, logs, exec, apply, delete',
              'Organise resources with Namespaces and labels',
              'Perform rolling updates and rollbacks',
            ],
            practicalExercise: 'Deploy an Nginx app as a Deployment with 3 replicas, perform a rolling update to a new image version, then rollback.',
            resources: [
              { id: 'res-k8s-1-1', title: 'Kubernetes Official Interactive Tutorial', url: 'https://kubernetes.io/docs/tutorials/', source_domain: 'kubernetes.io', provider: 'Kubernetes Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 40 },
              { id: 'res-k8s-1-2', title: 'Kubernetes Handbook — freeCodeCamp', url: 'https://www.freecodecamp.org/news/the-kubernetes-handbook/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 35 },
            ],
          },
          {
            id: 'top-k8s-2',
            title: 'Services, Ingress & ConfigMaps/Secrets',
            description: 'Expose workloads externally and manage configuration.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Differentiate ClusterIP, NodePort, and LoadBalancer Services',
              'Configure Ingress controllers for path-based routing',
              'Manage application config with ConfigMaps and Secrets',
              'Mount ConfigMaps as environment variables or volumes',
              'Use sealed-secrets or Vault for secret encryption',
            ],
            practicalExercise: 'Expose a Deployment via an Ingress with TLS, inject database credentials via Secrets, and app config via ConfigMap.',
            resources: [
              { id: 'res-k8s-2-1', title: 'Kubernetes Services & Networking — Official Docs', url: 'https://kubernetes.io/docs/concepts/services-networking/', source_domain: 'kubernetes.io', provider: 'Kubernetes Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 25 },
              { id: 'res-k8s-2-2', title: 'Kubernetes for Beginners — TechWorld with Nana (YouTube)', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 45 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-k8s-1', question: 'What is the difference between a ClusterIP and LoadBalancer Service type?', options: ['ClusterIP is internal-only; LoadBalancer provisions an external cloud load balancer', 'LoadBalancer is only for database services', 'ClusterIP is for cross-namespace; LoadBalancer for same namespace', 'They are identical in K8s 1.29+'], correctIndex: 0, explanation: 'ClusterIP gives a stable internal virtual IP. LoadBalancer additionally provisions an external cloud load balancer (ELB, GCP LB) making the service internet-accessible.' },
        ],
      },
      {
        id: 'p-k8s-2',
        title: 'Phase 2 — Helm, RBAC & Persistent Storage',
        description: 'Package applications with Helm, secure access with RBAC, and configure persistent volumes.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-k8s-3',
            title: 'Helm Charts: Kubernetes Package Management',
            description: 'Package, version, and deploy Kubernetes applications using Helm.',
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              'Create Helm charts with Chart.yaml, values.yaml, and templates',
              'Use helm install, upgrade, rollback, uninstall',
              'Template YAML with Go template syntax and helper functions',
              'Use Helm repositories and OCI registry',
              'Override values with --set and -f flags',
            ],
            practicalExercise: 'Create a Helm chart for your FastAPI app with configurable replica count, image tag, and resource limits via values.yaml.',
            resources: [
              { id: 'res-k8s-3-1', title: 'Helm Official Getting Started Guide', url: 'https://helm.sh/docs/intro/quickstart/', source_domain: 'helm.sh', provider: 'Helm Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 25 },
              { id: 'res-k8s-3-2', title: 'Helm Tutorial — TechWorld with Nana (YouTube)', url: 'https://www.youtube.com/watch?v=-ykwb1d0DXU', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 35 },
            ],
          },
          {
            id: 'top-k8s-4',
            title: 'RBAC, Resource Quotas & Persistent Volumes',
            description: 'Secure cluster access and configure stateful workloads.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Configure Roles, ClusterRoles, RoleBindings, and ServiceAccounts',
              'Set ResourceQuota and LimitRange for namespace isolation',
              'Provision PersistentVolumes and PersistentVolumeClaims',
              'Use StorageClass for dynamic volume provisioning',
              'Run StatefulSets for ordered pod identity',
            ],
            practicalExercise: 'Create a read-only RBAC role for a developer ServiceAccount scoped to a dev namespace with resource quota enforcement.',
            resources: [
              { id: 'res-k8s-4-1', title: 'Kubernetes RBAC — Official Documentation', url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/', source_domain: 'kubernetes.io', provider: 'Kubernetes Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-k8s-4-2', title: 'Kubernetes RBAC Tutorial — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/an-introduction-to-kubernetes', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-k8s-2', question: 'What Kubernetes object grants a ServiceAccount permission to list pods in a namespace?', options: ['RoleBinding associating a Role to the ServiceAccount', 'A ClusterRoleBinding to cluster-admin', 'A LimitRange resource', 'An Ingress rule'], correctIndex: 0, explanation: 'A RoleBinding links a Role (permissions) to a Subject (ServiceAccount/User) within a specific namespace.' },
        ],
      },
      {
        id: 'p-k8s-3',
        title: 'Phase 3 — Observability, Auto-Scaling & Production Hardening',
        description: 'Configure HPA, monitoring with Prometheus/Grafana, and production best practices.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-k8s-5',
            title: 'HPA, VPA & Cluster Autoscaling',
            description: 'Automatically scale workloads based on CPU, memory, and custom metrics.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Configure HorizontalPodAutoscaler with CPU and custom metrics',
              'Set resource requests and limits correctly for scheduling',
              'Use VPA for automatic resource recommendation',
              'Configure Cluster Autoscaler for node scaling',
              'Use KEDA for event-driven autoscaling',
            ],
            practicalExercise: 'Configure HPA on a Deployment to scale from 2 to 10 pods based on 70% CPU utilisation threshold.',
            resources: [
              { id: 'res-k8s-5-1', title: 'Kubernetes HPA Documentation', url: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/', source_domain: 'kubernetes.io', provider: 'Kubernetes Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-k8s-5-2', title: 'Kubernetes Autoscaling Guide — freeCodeCamp', url: 'https://www.freecodecamp.org/news/kubernetes-autoscaling/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-k8s-6',
            title: 'Prometheus, Grafana & Kubernetes Observability',
            description: 'Set up monitoring, alerting, and log aggregation for Kubernetes.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Deploy Prometheus & Grafana using kube-prometheus-stack Helm chart',
              'Write PromQL queries for pod/node metrics',
              'Configure AlertManager rules for SLO violations',
              'Aggregate logs with Loki & Promtail',
              'Create Grafana dashboards for production dashboards',
            ],
            practicalExercise: 'Deploy the kube-prometheus-stack, create a Grafana dashboard for pod memory usage, and configure an alert for pod restarts > 5.',
            resources: [
              { id: 'res-k8s-6-1', title: 'Prometheus Official Documentation', url: 'https://prometheus.io/docs/introduction/overview/', source_domain: 'prometheus.io', provider: 'Prometheus Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 25 },
              { id: 'res-k8s-6-2', title: 'K8s Monitoring with Prometheus & Grafana — TechWorld with Nana', url: 'https://www.youtube.com/watch?v=QoDqxm7ybLc', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 40 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-k8s-3', question: 'What is the difference between HPA and VPA in Kubernetes?', options: ['HPA scales pod count; VPA adjusts CPU/memory requests of existing pods', 'HPA scales nodes; VPA scales pods', 'VPA is deprecated in K8s 1.28+', 'They both scale based on node count'], correctIndex: 0, explanation: 'HPA (Horizontal Pod Autoscaler) adds/removes pod replicas. VPA (Vertical Pod Autoscaler) adjusts resource requests/limits for the same pods.' },
        ],
      },
    ],
  },

  // ── CI/CD WITH GITHUB ACTIONS ───────────────────────────────────────────────
  'ci/cd with github actions': {
    skillName: 'CI/CD with GitHub Actions',
    estimatedHours: 12,
    whyNeedSkill: 'CI/CD automation is essential for modern software delivery. GitHub Actions is the most widely adopted CI/CD platform with native GitHub integration.',
    phases: [
      {
        id: 'p-cicd-1',
        title: 'Phase 1 — GitHub Actions Fundamentals',
        description: 'Build your first workflows with triggers, jobs, steps, and runners.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-cicd-1',
            title: 'Workflows, Events, Jobs & Steps',
            description: 'Create YAML workflows triggered by push, PR, and schedule events.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Understand workflow YAML structure (on, jobs, steps)',
              'Use common triggers: push, pull_request, workflow_dispatch, schedule',
              'Configure GitHub-hosted runners (ubuntu-latest, windows-latest)',
              'Use actions/checkout, actions/setup-python, actions/setup-node',
              'Pass environment variables and secrets to steps',
            ],
            practicalExercise: 'Write a workflow that runs pytest on every PR to main, installs dependencies, and reports test coverage.',
            resources: [
              { id: 'res-cicd-1-1', title: 'GitHub Actions Official Documentation', url: 'https://docs.github.com/en/actions', source_domain: 'docs.github.com', provider: 'GitHub Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 30 },
              { id: 'res-cicd-1-2', title: 'GitHub Actions Full Tutorial — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 40 },
            ],
          },
          {
            id: 'top-cicd-2',
            title: 'Matrix Builds, Caching & Artifact Management',
            description: 'Optimise workflows with parallel matrix strategies and dependency caching.',
            orderIndex: 2, estimatedMins: 35,
            whatYouWillLearn: [
              'Configure matrix builds for multi-version testing (Python 3.10, 3.11, 3.12)',
              'Cache pip/npm/yarn dependencies with actions/cache',
              'Upload and download build artifacts between jobs',
              'Set job dependencies with needs: and conditional execution',
              'Use concurrency groups to cancel redundant runs',
            ],
            practicalExercise: 'Create a matrix workflow that tests a Python app across 3 Python versions and uploads coverage reports as artifacts.',
            resources: [
              { id: 'res-cicd-2-1', title: 'GitHub Actions Matrix Builds Docs', url: 'https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs', source_domain: 'docs.github.com', provider: 'GitHub Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 20 },
              { id: 'res-cicd-2-2', title: 'GitHub Actions CI Tutorial — freeCodeCamp', url: 'https://www.freecodecamp.org/news/what-is-ci-cd/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-cicd-1', question: 'How do you securely pass API keys to a GitHub Actions workflow?', options: ['Store in repository Secrets and reference as ${{ secrets.MY_KEY }}', 'Hardcode in the workflow YAML file', 'Pass as query parameters in the trigger URL', 'Store in .env file committed to the repo'], correctIndex: 0, explanation: 'GitHub Secrets are encrypted and injected as environment variables. They are never exposed in logs.' },
        ],
      },
      {
        id: 'p-cicd-2',
        title: 'Phase 2 — Docker Build & Deployment Pipelines',
        description: 'Automate Docker image builds, pushes, and Kubernetes deployments.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-cicd-3',
            title: 'Docker Build, Tag & Push in GitHub Actions',
            description: 'Automate container image delivery to Docker Hub or AWS ECR.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Use docker/build-push-action for efficient image builds',
              'Configure BuildKit caching with cache-from and cache-to',
              'Tag images with git SHA, semantic version, and latest',
              'Push to Docker Hub with docker/login-action',
              'Build multi-platform images (amd64, arm64) with QEMU',
            ],
            practicalExercise: 'Build a full CI pipeline: lint → test → Docker build → push to Docker Hub → deploy to a remote server via SSH.',
            resources: [
              { id: 'res-cicd-3-1', title: 'docker/build-push-action Official Docs', url: 'https://github.com/docker/build-push-action', source_domain: 'github.com', provider: 'Docker GitHub Actions', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-cicd-3-2', title: 'Build and Push Docker with GitHub Actions — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-docker-application-to-digital-ocean-using-github-actions', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 25 },
            ],
          },
          {
            id: 'top-cicd-4',
            title: 'CD to Kubernetes: kubectl, Helm & ArgoCD',
            description: 'Deploy to Kubernetes clusters from GitHub Actions workflows.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Use azure/k8s-deploy and helm/helm-deploy actions',
              'Authenticate to EKS/GKE clusters using OIDC',
              'Implement GitOps with ArgoCD for declarative deployments',
              'Run smoke tests post-deployment with health checks',
              'Configure environment-based approvals with GitHub Environments',
            ],
            practicalExercise: 'Create a CD workflow that deploys a Helm chart to a staging K8s namespace on PR merge and production after manual approval.',
            resources: [
              { id: 'res-cicd-4-1', title: 'GitHub Actions Kubernetes Deployment Guide', url: 'https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-kubernetes', source_domain: 'docs.github.com', provider: 'GitHub Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 25 },
              { id: 'res-cicd-4-2', title: 'GitOps with ArgoCD — TechWorld with Nana (YouTube)', url: 'https://www.youtube.com/watch?v=MeU5_k9ssrs', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 40 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-cicd-2', question: 'What is GitOps and how does ArgoCD implement it?', options: ['Git is the source of truth for infra state; ArgoCD syncs cluster state to match the Git repo', 'GitOps means running git commands in CI pipelines', 'ArgoCD replaces kubectl for all K8s commands', 'GitOps requires a monorepo structure'], correctIndex: 0, explanation: 'GitOps uses Git as the single source of truth. ArgoCD watches a Git repo and automatically reconciles cluster state to match the declared manifests.' },
        ],
      },
      {
        id: 'p-cicd-3',
        title: 'Phase 3 — Advanced Pipelines: Security, Notifications & Custom Actions',
        description: 'Add SAST scanning, Slack notifications, and author reusable custom actions.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-cicd-5',
            title: 'SAST, Dependency Scanning & Security Gates',
            description: 'Integrate security scanning into CI pipelines with CodeQL and Trivy.',
            orderIndex: 1, estimatedMins: 30,
            whatYouWillLearn: [
              'Run CodeQL static analysis on every PR',
              'Scan container images with trivy-action',
              'Check dependency CVEs with dependabot and safety',
              'Fail pipelines on critical severity findings',
              'Publish security reports to GitHub Security tab',
            ],
            practicalExercise: 'Add a security gate to your CI pipeline that fails on any critical CVE in dependencies or Docker image.',
            resources: [
              { id: 'res-cicd-5-1', title: 'CodeQL GitHub Actions Documentation', url: 'https://docs.github.com/en/code-security/code-scanning/using-codeql-code-scanning-with-your-existing-ci-system', source_domain: 'docs.github.com', provider: 'GitHub Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 20 },
              { id: 'res-cicd-5-2', title: 'DevSecOps CI Pipeline Tutorial — freeCodeCamp', url: 'https://www.freecodecamp.org/news/devsecops-with-github-actions/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 25 },
            ],
          },
          {
            id: 'top-cicd-6',
            title: 'Custom Actions, Reusable Workflows & Slack Notifications',
            description: 'Build reusable composite actions and notify teams of deployment outcomes.',
            orderIndex: 2, estimatedMins: 30,
            whatYouWillLearn: [
              'Create composite actions with action.yml',
              'Build JavaScript actions with @actions/core and @actions/github',
              'Call reusable workflows with workflow_call trigger',
              'Send rich Slack notifications on success/failure',
              'Use slackapi/slack-github-action for formatted messages',
            ],
            practicalExercise: 'Author a composite action that posts a formatted deployment summary to Slack including commit SHA, author, and environment name.',
            resources: [
              { id: 'res-cicd-6-1', title: 'Creating Custom GitHub Actions — Official Guide', url: 'https://docs.github.com/en/actions/creating-actions', source_domain: 'docs.github.com', provider: 'GitHub Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-cicd-6-2', title: 'Slack GitHub Actions Integration Guide', url: 'https://github.com/slackapi/slack-github-action', source_domain: 'github.com', provider: 'Slack API', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 15 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-cicd-3', question: 'What is the benefit of reusable workflows in GitHub Actions?', options: ['They allow sharing pipeline logic across multiple repositories via workflow_call', 'They run faster due to precompiled YAML', 'They bypass branch protection rules', 'They automatically scale based on commit volume'], correctIndex: 0, explanation: 'Reusable workflows (workflow_call trigger) allow any repo to call a centralized workflow, eliminating copy-paste duplication across teams.' },
        ],
      },
    ],
  },

  // ── TERRAFORM ───────────────────────────────────────────────────────────────
  'terraform (infrastructure as code)': {
    skillName: 'Terraform (Infrastructure as Code)',
    estimatedHours: 14,
    whyNeedSkill: 'Terraform is the leading IaC tool for provisioning cloud infrastructure declaratively. Required for DevOps, cloud engineering, and platform engineering roles.',
    phases: [
      {
        id: 'p-tf-1',
        title: 'Phase 1 — Terraform Fundamentals',
        description: 'Understand HCL syntax, providers, resources, variables, and state.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-tf-1',
            title: 'HCL Syntax, Providers & Core Resource Management',
            description: 'Write and apply Terraform configurations to provision cloud resources.',
            orderIndex: 1, estimatedMins: 45,
            whatYouWillLearn: [
              'Write HCL (HashiCorp Configuration Language) configurations',
              'Configure AWS/Azure/GCP providers with authentication',
              'Declare resources, data sources, and outputs',
              'Run terraform init, plan, apply, destroy lifecycle',
              'Use terraform state list, show, and pull',
            ],
            practicalExercise: 'Use Terraform to provision an AWS VPC, public subnet, security group, and EC2 instance from scratch.',
            resources: [
              { id: 'res-tf-1-1', title: 'Terraform Official Getting Started Guide (AWS)', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started', source_domain: 'developer.hashicorp.com', provider: 'HashiCorp Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 35 },
              { id: 'res-tf-1-2', title: 'Terraform for Beginners — freeCodeCamp', url: 'https://www.freecodecamp.org/news/terraform-for-beginners/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 30 },
            ],
          },
          {
            id: 'top-tf-2',
            title: 'Variables, Locals, Outputs & tfvars',
            description: 'Parameterise configurations with input variables and manage secrets.',
            orderIndex: 2, estimatedMins: 35,
            whatYouWillLearn: [
              'Declare input variables with type, default, and validation',
              'Use locals for reusable computed expressions',
              'Export values with outputs for cross-module references',
              'Use .tfvars files for environment-specific configurations',
              'Mark sensitive variables to hide from plan output',
            ],
            practicalExercise: 'Refactor an EC2 module to accept instance_type, ami_id, and environment as input variables with validation rules.',
            resources: [
              { id: 'res-tf-2-1', title: 'Terraform Input Variables Documentation', url: 'https://developer.hashicorp.com/terraform/language/values/variables', source_domain: 'developer.hashicorp.com', provider: 'HashiCorp Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-tf-2-2', title: 'Terraform Tutorial — TechWorld with Nana (YouTube)', url: 'https://www.youtube.com/watch?v=l5k1ai_GBDE', source_domain: 'youtube.com', provider: 'TechWorld with Nana', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 40 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-tf-1', question: 'What does "terraform plan" do?', options: ['Shows what changes will be made without applying them', 'Applies changes to the cloud immediately', 'Destroys all resources in the state', 'Initialises provider plugins'], correctIndex: 0, explanation: 'terraform plan creates an execution plan showing which resources will be added, changed, or destroyed. No infrastructure is modified.' },
        ],
      },
      {
        id: 'p-tf-2',
        title: 'Phase 2 — Modules & Remote State',
        description: 'Build reusable modules and manage state with remote backends.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-tf-3',
            title: 'Terraform Modules: Reusable Infrastructure Components',
            description: 'Create modular, version-controlled Terraform modules.',
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              'Structure root and child modules with main.tf, variables.tf, outputs.tf',
              'Call public Terraform Registry modules',
              'Pass variables and consume outputs across modules',
              'Version-lock modules with source and version constraints',
              'Use count and for_each for dynamic resource creation',
            ],
            practicalExercise: 'Build a reusable VPC module with public/private subnets and NAT gateway, consumed by dev and prod root configs.',
            resources: [
              { id: 'res-tf-3-1', title: 'Terraform Modules Documentation', url: 'https://developer.hashicorp.com/terraform/language/modules', source_domain: 'developer.hashicorp.com', provider: 'HashiCorp Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-tf-3-2', title: 'Terraform Modules Guide — freeCodeCamp', url: 'https://www.freecodecamp.org/news/terraform-modules-explained/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-tf-4',
            title: 'Remote State: S3 + DynamoDB & Workspaces',
            description: 'Store Terraform state remotely for team collaboration and state locking.',
            orderIndex: 2, estimatedMins: 35,
            whatYouWillLearn: [
              'Configure S3 + DynamoDB remote backend for state locking',
              'Use terraform workspace for environment management',
              'Implement state file encryption with S3 SSE-KMS',
              'Import existing infrastructure with terraform import',
              'Use moved blocks for safe resource refactoring',
            ],
            practicalExercise: 'Migrate local state to S3 backend with DynamoDB locking, configure dev/staging/prod workspaces.',
            resources: [
              { id: 'res-tf-4-1', title: 'Terraform Remote State Backends — HashiCorp', url: 'https://developer.hashicorp.com/terraform/language/backend', source_domain: 'developer.hashicorp.com', provider: 'HashiCorp Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-tf-4-2', title: 'Terraform Remote State Tutorial — DigitalOcean', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-terraform-with-digitalocean', source_domain: 'digitalocean.com', provider: 'DigitalOcean', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-tf-2', question: 'Why is DynamoDB used alongside S3 for Terraform remote state?', options: ['To provide state locking and prevent concurrent modifications', 'To store Terraform plan output permanently', 'To encrypt the .tfstate file', 'To cache provider plugin downloads'], correctIndex: 0, explanation: 'DynamoDB provides distributed locking via a LockID attribute, preventing two terraform apply operations from running simultaneously and corrupting state.' },
        ],
      },
      {
        id: 'p-tf-3',
        title: 'Phase 3 — Terraform in CI/CD & Production Best Practices',
        description: 'Integrate Terraform into automated pipelines with Atlantis or GitHub Actions.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-tf-5',
            title: 'Terraform CI/CD: GitHub Actions & Atlantis',
            description: 'Automate plan and apply in CI/CD pipelines with PR-based workflows.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Run terraform plan in GitHub Actions on PR open',
              'Auto-apply on merge to main with proper approval gates',
              'Use Atlantis for PR-based GitOps Terraform workflows',
              'Manage Terraform Cloud remote runs via API',
              'Integrate terraform-docs for automatic documentation',
            ],
            practicalExercise: 'Configure a GitHub Actions workflow that runs fmt, validate, and plan on PR, and applies on merge after manual approval.',
            resources: [
              { id: 'res-tf-5-1', title: 'Terraform GitHub Actions Integration', url: 'https://developer.hashicorp.com/terraform/tutorials/automation/github-actions', source_domain: 'developer.hashicorp.com', provider: 'HashiCorp Tutorials', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-tf-5-2', title: 'Terraform in CI/CD — freeCodeCamp', url: 'https://www.freecodecamp.org/news/how-to-manage-terraform-with-github-actions/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-tf-6',
            title: 'Security: tfsec, Checkov & Least-Privilege IAM',
            description: 'Scan Terraform for misconfigurations and enforce least-privilege IAM.',
            orderIndex: 2, estimatedMins: 30,
            whatYouWillLearn: [
              'Run tfsec and checkov for IaC security scanning',
              'Enforce least-privilege IAM with resource-specific policies',
              'Use aws_iam_policy_document with condition blocks',
              'Detect public S3 bucket exposure with Terraform checks',
              'Integrate security gates into CI pipelines',
            ],
            practicalExercise: 'Add tfsec and checkov to a CI pipeline and fix all HIGH severity findings in a VPC + EC2 Terraform configuration.',
            resources: [
              { id: 'res-tf-6-1', title: 'tfsec Terraform Security Scanner', url: 'https://aquasecurity.github.io/tfsec/', source_domain: 'aquasecurity.github.io', provider: 'Aqua Security', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 15 },
              { id: 'res-tf-6-2', title: 'Terraform Security Best Practices — freeCodeCamp', url: 'https://www.freecodecamp.org/news/terraform-security-best-practices/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-tf-3', question: 'What does "terraform fmt" do?', options: ['Formats HCL files to canonical style automatically', 'Validates provider configuration', 'Runs security scanning on resources', 'Generates documentation from variable descriptions'], correctIndex: 0, explanation: 'terraform fmt rewrites Terraform configuration files to the canonical format and style, ensuring consistency across the team.' },
        ],
      },
    ],
  },

  // ── AWS / AZURE CLOUD SERVICES ──────────────────────────────────────────────
  'aws / azure cloud services': {
    skillName: 'AWS / Azure Cloud Services',
    estimatedHours: 16,
    whyNeedSkill: 'Cloud platform proficiency is required for all modern DevOps and backend engineering roles. AWS is the market-leading provider with the widest enterprise adoption.',
    phases: [
      {
        id: 'p-aws-1',
        title: 'Phase 1 — Cloud Fundamentals & Core AWS Services',
        description: 'Understand cloud concepts and master EC2, S3, VPC, IAM, and RDS.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-aws-1',
            title: 'EC2, S3, VPC & IAM Core Services',
            description: 'Provision compute, storage, networking, and identity resources on AWS.',
            orderIndex: 1, estimatedMins: 50,
            whatYouWillLearn: [
              'Launch EC2 instances and configure security groups',
              'Create and manage S3 buckets with versioning and policies',
              'Build VPCs with public/private subnets and NAT gateway',
              'Configure IAM users, groups, roles, and policies',
              'Use AWS CLI for resource management and automation',
            ],
            practicalExercise: 'Architect a 3-tier VPC (public web, private app, private DB) with EC2 instances and an S3 bucket for static assets.',
            resources: [
              { id: 'res-aws-1-1', title: 'AWS Official Documentation', url: 'https://docs.aws.amazon.com/', source_domain: 'docs.aws.amazon.com', provider: 'AWS Official Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 40 },
              { id: 'res-aws-1-2', title: 'AWS Cloud Practitioner Full Course — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=ubCNZFQZZWg', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 60 },
              { id: 'res-aws-1-3', title: 'AWS Free Tier Hands-On Labs', url: 'https://aws.amazon.com/free/', source_domain: 'aws.amazon.com', provider: 'AWS Free Tier', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'EXERCISE', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 30 },
            ],
          },
          {
            id: 'top-aws-2',
            title: 'ECS, Lambda, API Gateway & CloudWatch',
            description: 'Build serverless and container-based applications on AWS.',
            orderIndex: 2, estimatedMins: 45,
            whatYouWillLearn: [
              'Deploy containerised applications with ECS Fargate',
              'Write and deploy AWS Lambda functions with Python/Node',
              'Configure API Gateway REST and HTTP APIs',
              'Set up CloudWatch alarms, dashboards, and log groups',
              'Use X-Ray for distributed tracing',
            ],
            practicalExercise: 'Build a serverless REST API: API Gateway → Lambda (Python) → DynamoDB with CloudWatch logging and X-Ray tracing.',
            resources: [
              { id: 'res-aws-2-1', title: 'AWS Lambda Developer Guide', url: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html', source_domain: 'docs.aws.amazon.com', provider: 'AWS Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 30 },
              { id: 'res-aws-2-2', title: 'AWS Lambda & Serverless Tutorial — freeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-lambda-tutorial/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-aws-1', question: 'What is the difference between an IAM Role and an IAM User?', options: ['Roles are assumed temporarily by services/users; Users have permanent long-term credentials', 'Users can assume other roles; Roles cannot', 'Roles have passwords; Users have access keys', 'They are identical in AWS IAM'], correctIndex: 0, explanation: 'IAM Roles provide temporary credentials via STS AssumeRole. Users have permanent access keys/passwords. Roles are preferred for EC2/Lambda to avoid hardcoding credentials.' },
        ],
      },
      {
        id: 'p-aws-2',
        title: 'Phase 2 — Infrastructure Automation & Cost Optimisation',
        description: 'Automate AWS infrastructure with CDK/CloudFormation and optimise spend.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-aws-3',
            title: 'AWS CDK & CloudFormation: Infrastructure as Code',
            description: 'Define AWS infrastructure programmatically using CDK (Python/TypeScript).',
            orderIndex: 1, estimatedMins: 45,
            whatYouWillLearn: [
              'Define stacks with AWS CDK constructs in Python or TypeScript',
              'Deploy CDK stacks with cdk synth, diff, and deploy',
              'Use L1, L2, and L3 constructs for increasing abstraction',
              'Write CloudFormation templates with YAML/JSON',
              'Manage drift detection and stack updates safely',
            ],
            practicalExercise: 'Create an AWS CDK stack that provisions an ECS Fargate service with an Application Load Balancer and RDS PostgreSQL.',
            resources: [
              { id: 'res-aws-3-1', title: 'AWS CDK Official Developer Guide', url: 'https://docs.aws.amazon.com/cdk/v2/guide/home.html', source_domain: 'docs.aws.amazon.com', provider: 'AWS Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 30 },
              { id: 'res-aws-3-2', title: 'AWS CDK Crash Course — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=T-H4nJQyMig', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 35 },
            ],
          },
          {
            id: 'top-aws-4',
            title: 'Cost Optimisation, Reserved Instances & AWS Budgets',
            description: 'Monitor and reduce AWS spend with cost management tools.',
            orderIndex: 2, estimatedMins: 30,
            whatYouWillLearn: [
              'Use AWS Cost Explorer to analyse spending patterns',
              'Set budget alerts with AWS Budgets',
              'Choose between On-Demand, Reserved, and Spot instances',
              'Right-size EC2 instances with Compute Optimiser',
              'Implement S3 lifecycle policies for storage tiering',
            ],
            practicalExercise: 'Analyse your AWS account with Cost Explorer, identify top 3 cost drivers, and implement S3 lifecycle policy to cut storage costs.',
            resources: [
              { id: 'res-aws-4-1', title: 'AWS Cost Management Documentation', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html', source_domain: 'docs.aws.amazon.com', provider: 'AWS Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 20 },
              { id: 'res-aws-4-2', title: 'AWS Cost Optimisation Guide — freeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-cost-optimization/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-aws-2', question: 'When should you choose Spot Instances over On-Demand?', options: ['For fault-tolerant, interruptible batch workloads that can restart on termination', 'For production databases requiring guaranteed uptime', 'For all web servers to save cost', 'When you need predictable long-term pricing'], correctIndex: 0, explanation: 'Spot Instances can be reclaimed by AWS with 2-minute notice at up to 90% discount. Ideal for batch processing, ML training, and stateless workers that tolerate interruption.' },
        ],
      },
      {
        id: 'p-aws-3',
        title: 'Phase 3 — Security, Compliance & Multi-Region Architecture',
        description: 'Design secure, highly available, multi-region AWS architectures.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-aws-5',
            title: 'AWS Security: KMS, Secrets Manager & GuardDuty',
            description: 'Implement encryption, secrets management, and threat detection.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              'Encrypt data at rest with KMS CMKs and SSE-KMS',
              'Store and rotate secrets with AWS Secrets Manager',
              'Enable GuardDuty for threat intelligence monitoring',
              'Use SecurityHub for compliance aggregation',
              'Implement MFA enforcement via IAM policies',
            ],
            practicalExercise: 'Configure a Lambda that retrieves database credentials from Secrets Manager with automatic rotation every 30 days.',
            resources: [
              { id: 'res-aws-5-1', title: 'AWS Security Documentation Hub', url: 'https://docs.aws.amazon.com/security/', source_domain: 'docs.aws.amazon.com', provider: 'AWS Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-aws-5-2', title: 'AWS Security Best Practices — freeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-security-best-practices/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-aws-6',
            title: 'Multi-Region Failover, Route 53 & Global Load Balancing',
            description: 'Design resilient multi-region architectures with automatic failover.',
            orderIndex: 2, estimatedMins: 40,
            whatYouWillLearn: [
              'Configure Route 53 health checks and failover routing',
              'Use CloudFront as a global CDN with Lambda@Edge',
              'Implement cross-region RDS read replicas and failover',
              'Design for RTO/RPO with active-passive/active-active patterns',
              'Use AWS Global Accelerator for consistent latency',
            ],
            practicalExercise: 'Set up Route 53 failover routing with health checks between us-east-1 and eu-west-1 regions for a production API.',
            resources: [
              { id: 'res-aws-6-1', title: 'AWS Route 53 Developer Guide', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html', source_domain: 'docs.aws.amazon.com', provider: 'AWS Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 25 },
              { id: 'res-aws-6-2', title: 'AWS Architecture: Disaster Recovery — freeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-disaster-recovery-strategies/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-aws-3', question: 'What is the difference between RPO and RTO in disaster recovery?', options: ['RPO = max acceptable data loss (time); RTO = max acceptable downtime (time)', 'RPO = recovery time; RTO = recovery point', 'They are the same metric measured differently', 'RPO applies to compute; RTO applies to databases'], correctIndex: 0, explanation: 'RPO (Recovery Point Objective) defines how much data loss is acceptable. RTO (Recovery Time Objective) defines how long the system can be down. Both drive backup and failover strategy.' },
        ],
      },
    ],
  },

  // ── FIGMA & DESIGN SYSTEMS ──────────────────────────────────────────────────
  'figma & design systems': {
    skillName: 'Figma & Design Systems',
    estimatedHours: 14,
    whyNeedSkill: 'Figma and design systems are critical for consistent, scalable UI/UX engineering and enterprise product design.',
    phases: [
      {
        id: 'p1',
        title: 'Phase 1 — Figma Fundamentals & Layout Mechanics',
        description: 'Master vectors, frame architecture, auto layout nesting, and responsive component constraints.',
        orderIndex: 1,
        topics: [
          {
            id: 'top-f1',
            title: 'Figma Interface, Canvas Navigation & Vector Networks',
            description: 'Navigate the Figma canvas, artboards, coordinate systems, and vector path manipulation.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: ['Navigate canvas coordinates and pixel grids', 'Differentiate frames, groups, and sections', 'Use pen tool and vector networks for custom iconography', 'Configure responsive constraints (Scale, Top/Left, Center)', 'Export production SVG and PNG assets'],
            practicalExercise: 'Design an accessible navigation bar component with custom vector icons on an 8px grid.',
            resources: [
              { id: 'res-f1-1', title: 'Figma Official User Guide: Getting Started', url: 'https://help.figma.com/hc/en-us/categories/360002042553-Using-Figma', source_domain: 'help.figma.com', provider: 'Figma Official Documentation', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 15 },
              { id: 'res-f1-2', title: 'Figma Crash Course — freeCodeCamp', url: 'https://www.freecodecamp.org/news/figma-crash-course/', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 20 },
            ],
          },
          {
            id: 'top-f2',
            title: 'Auto Layout 5.0, Nested Stacks & Dynamic Padding',
            description: 'Implement dynamic resizing layouts using horizontal/vertical auto layout stacks.',
            orderIndex: 2, estimatedMins: 45,
            whatYouWillLearn: ['Configure horizontal and vertical auto-layout stacks', 'Set Hug Contents, Fill Container, and Fixed Dimensions', 'Implement negative spacing and min/max width constraints', 'Create auto-wrapping tag and chip containers', 'Build responsive multi-column card layouts'],
            practicalExercise: 'Create a responsive statistical card that adapts from mobile (320px) to desktop (1280px).',
            resources: [
              { id: 'res-f2-1', title: 'Figma Auto Layout Deep Dive', url: 'https://help.figma.com/hc/en-us/articles/5731482952599-Using-auto-layout', source_domain: 'help.figma.com', provider: 'Figma Help Center', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
              { id: 'res-f2-2', title: 'Figma UI Design Masterclass — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=jwCmdqW9qzg', source_domain: 'youtube.com', provider: 'freeCodeCamp', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-f1', question: 'When an Auto Layout container is set to "Fill Container", what does it do?', options: ['It shrinks to fit its children', 'It stretches to fill all remaining space in its parent', 'It fixes to 100 pixels', 'It converts to a vector network'], correctIndex: 1, explanation: '"Fill container" makes the layer stretch to fill all available width or height in its parent auto layout frame.' },
        ],
      },
      {
        id: 'p2',
        title: 'Phase 2 — Design Tokens & Component Systems',
        description: 'Architect design token hierarchies and build a complete component library.',
        orderIndex: 2,
        topics: [
          {
            id: 'top-f3',
            title: 'Design Tokens Architecture & Semantic Color Schemes',
            description: 'Establish semantic color roles and export JSON token specifications.',
            orderIndex: 1, estimatedMins: 45,
            whatYouWillLearn: ['Structure 3-tier token architecture (Global → Alias → Component)', 'Configure light and dark mode variable modes', 'Map WCAG 2.1 AA color contrast ratios', 'Generate W3C-standard JSON design tokens', 'Integrate tokens with CSS variables and Tailwind'],
            practicalExercise: 'Build a dark/light semantic color palette with token variables passing WCAG 4.5:1 text contrast.',
            resources: [
              { id: 'res-f3-1', title: 'MDN CSS Custom Properties & Design Tokens', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties', source_domain: 'developer.mozilla.org', provider: 'Mozilla Developer Network', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 99, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-f2', question: 'Which feature allows toggling optional elements without creating separate variants?', options: ['Boolean Component Property', 'Vector Union', 'Masking Layer', 'Smart Animate'], correctIndex: 0, explanation: 'Boolean component properties bind layer visibility to a true/false toggle on the component instance.' },
        ],
      },
      {
        id: 'p3',
        title: 'Phase 3 — Prototyping & Developer Handoff',
        description: 'Create interactive prototypes and prepare pixel-perfect developer specifications.',
        orderIndex: 3,
        topics: [
          {
            id: 'top-f4',
            title: 'Interactive Prototyping with Smart Animate',
            description: 'Build high-fidelity interactive prototypes for usability testing.',
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: ['Connect frames with interaction triggers', 'Use Smart Animate for smooth motion transitions', 'Configure overlays, scrolling, and sticky elements', 'Add micro-interactions to button and card states', 'Share prototypes for stakeholder review'],
            practicalExercise: 'Create a fully interactive onboarding flow prototype with 5 screens, transitions, and overlay modals.',
            resources: [
              { id: 'res-f4-1', title: 'Figma Prototyping Guide', url: 'https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma', source_domain: 'help.figma.com', provider: 'Figma Docs', source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 98, estimated_mins: 20 },
              { id: 'res-f4-2', title: 'Figma Prototyping Tutorial — Flux Academy (YouTube)', url: 'https://www.youtube.com/watch?v=3q3FV65ZrUs', source_domain: 'youtube.com', provider: 'Flux Academy', source_class: 'YOUTUBE', resource_type: 'VIDEO', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-f3', question: 'What does Smart Animate require to create smooth transitions between frames?', options: ['Matching layer names and types in both frames', 'Identical frame dimensions only', 'The same background colour', 'Auto Layout enabled on both frames'], correctIndex: 0, explanation: 'Smart Animate matches layers by name across frames and interpolates their properties (position, opacity, size) for smooth keyframe animation.' },
        ],
      },
    ],
  },
};

// ── Main export function ────────────────────────────────────────────────────
export const getSkillRoadmap = (
  skillName: string,
  userCurrentLevel: string = 'L1',
  userTargetLevel: string = 'L4',
  roleName: string = 'Senior Statistical Officer'
): SkillRoadmapData => {
  const normKey = skillName.trim().toLowerCase();

  if (PREBUILT_ROADMAPS[normKey]) {
    const prebuilt = PREBUILT_ROADMAPS[normKey];
    return {
      skillName: prebuilt.skillName || skillName,
      currentLevel: userCurrentLevel,
      targetLevel: userTargetLevel,
      gapLevels: Math.max(1, parseInt(userTargetLevel.replace(/\D/g, '')) - parseInt(userCurrentLevel.replace(/\D/g, '')) || 2),
      priority: 'HIGH',
      estimatedHours: prebuilt.estimatedHours || 14,
      roleRelevance: roleName,
      whyNeedSkill: prebuilt.whyNeedSkill || `Your Competency Digital Twin reveals a critical gap in ${skillName} required for ${roleName}.`,
      phases: prebuilt.phases as SkillRoadmapPhase[],
    };
  }

  // ── Smart fallback with topic-matched URLs ────────────────────────────────
  const urls = getSkillUrls(skillName);
  return {
    skillName,
    currentLevel: userCurrentLevel,
    targetLevel: userTargetLevel,
    gapLevels: Math.max(1, parseInt(userTargetLevel.replace(/\D/g, '')) - parseInt(userCurrentLevel.replace(/\D/g, '')) || 2),
    priority: 'HIGH',
    estimatedHours: 14,
    roleRelevance: roleName,
    whyNeedSkill: `Your Competency Digital Twin benchmark requires elevated proficiency in ${skillName} to transition from ${userCurrentLevel} to ${userTargetLevel} for ${roleName}.`,
    phases: [
      {
        id: 'phase-1',
        title: `Phase 1 — ${skillName} Core Foundations`,
        description: `Master fundamental syntax, tools, and core patterns of ${skillName}.`,
        orderIndex: 1,
        topics: [
          {
            id: 'top-1-1',
            title: `${skillName} Environment Setup & Fundamental Constructs`,
            description: `Configure local toolchains and understand core concepts of ${skillName}.`,
            orderIndex: 1, estimatedMins: 35,
            whatYouWillLearn: [
              `Understand the core architecture and execution environment of ${skillName}`,
              `Apply industry best practices for configuration and project setup`,
              `Write clean, deterministic, and modular code routines`,
              `Implement error handling and edge case validation`,
              `Benchmark execution performance and resource usage`,
            ],
            practicalExercise: `Implement a baseline verification module demonstrating foundational ${skillName} workflows.`,
            resources: [
              { id: 'res-gen-1', title: `Official Documentation for ${skillName}`, url: urls.officialUrl, source_domain: urls.officialDomain, provider: urls.officialProvider, source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 20 },
              { id: 'res-gen-2', title: `Free Interactive ${skillName} Tutorial`, url: urls.freeUrl, source_domain: urls.freeDomain, provider: urls.freeProvider, source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 15 },
            ],
          },
          {
            id: 'top-1-2',
            title: `Advanced Application & Integration Pipelines in ${skillName}`,
            description: `Build robust processing pipelines with verified testing.`,
            orderIndex: 2, estimatedMins: 45,
            whatYouWillLearn: [
              `Integrate ${skillName} with production databases and API endpoints`,
              `Optimise memory footprint and compute efficiency`,
              `Conduct unit testing and automated continuous validation`,
              `Enforce security and input sanitization protocols`,
              `Deploy production-ready artifacts with logging`,
            ],
            practicalExercise: `Construct an end-to-end processing pipeline implementing standard error handling for ${skillName}.`,
            resources: [
              { id: 'res-gen-3', title: `${skillName} Advanced Tutorials — freeCodeCamp`, url: 'https://www.freecodecamp.org/learn', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 95, estimated_mins: 25 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-gen-1', question: `What is the primary architectural principle when building scalable ${skillName} solutions?`, options: ['Separation of concerns and modular reusable abstractions', 'Writing all logic into a single unformatted script', 'Bypassing input validation checks', 'Hardcoding secrets in frontend code'], correctIndex: 0, explanation: 'Modular design and separation of concerns ensure code maintainability, testability, and high performance.' },
        ],
      },
      {
        id: 'phase-2',
        title: `Phase 2 — Intermediate ${skillName} Patterns`,
        description: `Apply intermediate patterns, testing strategies, and performance optimisation.`,
        orderIndex: 2,
        topics: [
          {
            id: 'top-2-1',
            title: `Testing, Debugging & Performance Profiling in ${skillName}`,
            description: `Write unit tests, profile performance, and debug production issues.`,
            orderIndex: 1, estimatedMins: 40,
            whatYouWillLearn: [
              `Write unit and integration tests with standard testing frameworks`,
              `Profile and identify performance bottlenecks`,
              `Debug with logging, breakpoints, and trace analysis`,
              `Measure code coverage and set quality gates`,
              `Implement CI-ready test suites`,
            ],
            practicalExercise: `Write a comprehensive test suite for your ${skillName} module achieving >85% code coverage.`,
            resources: [
              { id: 'res-gen-4', title: `${skillName} Testing Guide`, url: urls.officialUrl, source_domain: urls.officialDomain, provider: urls.officialProvider, source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 96, estimated_mins: 20 },
              { id: 'res-gen-5', title: `${skillName} Testing Tutorial — freeCodeCamp`, url: 'https://www.freecodecamp.org/learn', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 93, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-gen-2', question: `Which testing approach isolates a single unit of ${skillName} logic from external dependencies?`, options: ['Unit testing with mocks/stubs', 'End-to-end integration testing', 'Manual user acceptance testing', 'Load/performance testing'], correctIndex: 0, explanation: 'Unit tests with mocks isolate the system under test, making tests fast, deterministic, and dependency-free.' },
        ],
      },
      {
        id: 'phase-3',
        title: `Phase 3 — Advanced ${skillName} & Production Deployment`,
        description: `Apply advanced patterns, security hardening, and production deployment strategies.`,
        orderIndex: 3,
        topics: [
          {
            id: 'top-3-1',
            title: `Production Deployment & Security Hardening for ${skillName}`,
            description: `Deploy and secure ${skillName} applications in production environments.`,
            orderIndex: 1, estimatedMins: 45,
            whatYouWillLearn: [
              `Deploy ${skillName} applications with zero-downtime strategies`,
              `Implement authentication, authorisation, and input validation`,
              `Configure logging, monitoring, and alerting`,
              `Apply security scanning and dependency auditing`,
              `Set up automated backup and disaster recovery`,
            ],
            practicalExercise: `Deploy a production-ready ${skillName} application with health checks, logging, and security scanning.`,
            resources: [
              { id: 'res-gen-6', title: `${skillName} Production Deployment Guide`, url: urls.officialUrl, source_domain: urls.officialDomain, provider: urls.officialProvider, source_class: 'OFFICIAL_DOCUMENTATION', resource_type: 'DOCUMENTATION', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 97, estimated_mins: 30 },
              { id: 'res-gen-7', title: `${skillName} Security Best Practices — freeCodeCamp`, url: 'https://www.freecodecamp.org/learn', source_domain: 'freecodecamp.org', provider: 'freeCodeCamp', source_class: 'EDUCATIONAL_PLATFORM', resource_type: 'TUTORIAL', verification_status: 'VERIFIED', last_verified: '2026-09-04', quality_score: 94, estimated_mins: 20 },
            ],
          },
        ],
        assessmentQuestions: [
          { id: 'aq-gen-3', question: `Which deployment strategy minimises downtime when releasing a new ${skillName} version?`, options: ['Rolling update or Blue-Green deployment', 'Stopping all instances then deploying', 'Deleting and recreating all resources', 'Manual copy of files to servers'], correctIndex: 0, explanation: 'Rolling updates replace instances gradually; Blue-Green switches traffic between two identical environments, both achieving near-zero downtime.' },
        ],
      },
    ],
  };
};
