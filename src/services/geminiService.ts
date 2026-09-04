/**
 * StatIntel AI - Google Gemini API Client Service
 * Supports direct client-side calls to Google Gemini REST API using user-provided key,
 * with resilient fallback to built-in curriculum intelligence if no key is configured.
 */

import { Competency, SkillGapItem, CompetencyLevel, CompetencyDomain } from '../types';

export interface GeminiQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceReference: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CareerGuidanceResult {
  role: string;
  readinessScore: number;
  skillsMastered: string[];
  skillsToLearn: { name: string; importance: 'High' | 'Medium'; estimatedHours: number; description: string }[];
  recommendedBooks: {
    title: string;
    author: string;
    level: string;
    coverColor: string;
    keyChapters: string;
    summary: string;
  }[];
  aiAdvice: string;
}

// Curated Book Catalog by Domain
export const CURATED_BOOKS = [
  {
    id: 'book-1',
    title: 'Python for Data Analysis (3rd Edition)',
    author: 'Wes McKinney (Creator of Pandas)',
    roles: ['Data Analyst', 'Machine Learning Engineer', 'Data Scientist', 'Data Engineer'],
    level: 'Essential',
    coverColor: 'from-amber-500 to-orange-600',
    keyChapters: 'Ch 4 (NumPy Basics), Ch 5 (Pandas), Ch 8 (Data Wrangling), Ch 9 (Plotting with Matplotlib & Seaborn)',
    summary: 'The authoritative practical guide for data manipulation and visualization using Python, NumPy, and Pandas.',
  },
  {
    id: 'book-2',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd Edition)',
    author: 'Aurélien Géron',
    roles: ['Machine Learning Engineer', 'Data Scientist', 'AI & Deep Learning Specialist', 'Computer Vision Engineer'],
    level: 'Core Foundation',
    coverColor: 'from-blue-600 to-indigo-700',
    keyChapters: 'Ch 1 (The ML Landscape), Ch 2 (End-to-End ML Project), Ch 3 (Classification), Ch 4 (Training Models), Ch 10 (Neural Networks)',
    summary: 'Best-in-class practical book for learning classification, regression, feature engineering, and neural networks with Scikit-Learn and PyTorch/TensorFlow.',
  },
  {
    id: 'book-3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann (University of Cambridge)',
    roles: ['Backend Developer', 'Full Stack Developer', 'Data Engineer', 'Site Reliability Engineer (SRE)', 'Cloud Solutions Architect'],
    level: 'Industry Standard',
    coverColor: 'from-emerald-700 to-teal-800',
    keyChapters: 'Ch 3 (Storage & Retrieval), Ch 5 (Replication), Ch 6 (Partitioning), Ch 7 (Transactions), Ch 10 (Batch Processing)',
    summary: 'The quintessential system architecture bible covering data models, storage engines, distributed consensus, transactions, and stream processing.',
  },
  {
    id: 'book-4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin (Uncle Bob)',
    roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software QA & Test Automation Engineer'],
    level: 'Must-Read',
    coverColor: 'from-slate-700 to-slate-900',
    keyChapters: 'Ch 2 (Meaningful Names), Ch 3 (Functions), Ch 6 (Objects & Data Structures), Ch 9 (Unit Tests), Ch 10 (Classes)',
    summary: 'The definitive handbook for writing elegant, maintainable, readable, and testable code across all programming languages.',
  },
  {
    id: 'book-5',
    title: 'An Introduction to Statistical Learning (ISLR with Python/R)',
    author: 'Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani',
    roles: ['Data Analyst', 'Data Scientist', 'Statistical Scientist (MoSPI / ISS)'],
    level: 'Gold Standard',
    coverColor: 'from-emerald-600 to-teal-700',
    keyChapters: 'Ch 2 (Statistical Learning Overview), Ch 3 (Linear Regression), Ch 4 (Classification & Logistic), Ch 5 (Resampling & Cross-Validation)',
    summary: 'The gold standard textbook bridging classical statistics with modern machine learning, written by Stanford professors.',
  },
  {
    id: 'book-6',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas & Andrew Hunt',
    roles: ['Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Systems Software & Embedded Engineer'],
    level: 'Classic',
    coverColor: 'from-purple-600 to-indigo-800',
    keyChapters: 'Ch 2 (A Pragmatic Approach), Ch 4 (Pragmatic Paranoia), Ch 5 (Bend, or Break), Ch 7 (While You Are Coding)',
    summary: 'Timeless philosophy, career advice, and best practices for modern developers building software at scale.',
  },
  {
    id: 'book-7',
    title: 'Learning React: Modern Patterns for Developing React Apps',
    author: 'Alex Banks & Eve Porcello',
    roles: ['Frontend Developer', 'Full Stack Developer', 'Mobile App Developer (iOS & Android)'],
    level: 'Frontend Core',
    coverColor: 'from-cyan-500 to-blue-600',
    keyChapters: 'Ch 6 (React State Management), Ch 7 (React Hooks In-Depth), Ch 9 (Suspense & Concurrent Mode), Ch 11 (React Router & Layouts)',
    summary: 'Master functional programming, component lifecycle, custom hooks, and modern frontend application development with React.',
  },
  {
    id: 'book-8',
    title: 'Docker Deep Dive & Kubernetes in Action',
    author: 'Nigel Poulton & Marko Luksa',
    roles: ['DevOps Engineer', 'Cloud Solutions Architect', 'Site Reliability Engineer (SRE)', 'Backend Developer'],
    level: 'Cloud Standard',
    coverColor: 'from-blue-700 to-cyan-800',
    keyChapters: 'Ch 4 (Docker Images & Containers), Ch 9 (Container Networking), Ch 13 (Kubernetes Pods & Deployments), Ch 17 (Services & Ingress)',
    summary: 'Comprehensive hands-on guide for containerizing applications, building CI/CD pipelines, and orchestrating microservices with Kubernetes.',
  },
];

// 20+ Comprehensive Software & Tech Industry + MoSPI Official Statistical Role Benchmarks
export const ROLE_SKILL_BENCHMARKS: Record<string, {
  name: string;
  description: string;
  allSkills: { id: string; name: string; category: string; description: string; importance: 'High' | 'Medium' }[];
}> = {
  'Senior Statistical Officer': {
    name: 'Senior Statistical Officer',
    description: 'Lead national statistical data systems, survey sampling methodologies, macro-economic indicator forecasting, and official statistical intelligence.',
    allSkills: [
      { id: 'sso_survey', name: 'Survey Design & Sampling Methodology', category: 'Statistical', description: 'Stratified sampling, multistage clustering, sampling weights, non-response adjustments', importance: 'High' },
      { id: 'sso_python_stats', name: 'Python for Statistical & Microdata Analytics', category: 'Technical', description: 'Pandas, statsmodels, SciPy, microdata processing, NSSO/PLFS pipelines', importance: 'High' },
      { id: 'sso_sql_db', name: 'SQL & Large-Scale Database Systems', category: 'Technical', description: 'Relational data warehouses, PostgreSQL, window functions, statistical aggregation', importance: 'High' },
      { id: 'sso_ai_impute', name: 'AI & Machine Learning for Imputation & Outliers', category: 'Technical', description: 'KNN imputation, MICE algorithms, outlier diagnostics, automated anomaly detection', importance: 'High' },
      { id: 'sso_spatial_gis', name: 'GIS & Spatial Analytics for Surveys', category: 'Technical', description: 'GeoPandas, spatial census mapping, boundary shapefiles, district clustering', importance: 'Medium' },
      { id: 'sso_data_privacy', name: 'Data Privacy, Security & Government Cloud', category: 'Digital Governance', description: 'Differential privacy, anonymization protocols, MeitY compliance', importance: 'Medium' },
    ],
  },
  'Frontend Developer': {
    name: 'Frontend Developer',
    description: 'Build fast, accessible, interactive web interfaces with React, modern JavaScript/TypeScript, and sleek CSS frameworks.',
    allSkills: [
      { id: 'fe_html_css', name: 'HTML5 & Modern CSS3', category: 'Core Web', description: 'Semantic HTML, Flexbox, Grid, CSS animations, Responsive design', importance: 'High' },
      { id: 'fe_js_ts', name: 'JavaScript ES6+ & TypeScript', category: 'Languages', description: 'Closures, async/await, DOM APIs, strict typing, interfaces', importance: 'High' },
      { id: 'fe_react', name: 'React & React Hooks', category: 'Frameworks', description: 'useState, useEffect, useMemo, custom hooks, context API', importance: 'High' },
      { id: 'fe_nextjs', name: 'Next.js & SSR', category: 'Frameworks', description: 'App router, Server Components, static generation, SEO optimization', importance: 'High' },
      { id: 'fe_tailwind', name: 'Tailwind CSS & Styling', category: 'Design & UI', description: 'Utility-first CSS, dark mode, component libraries, responsive breakpoints', importance: 'High' },
      { id: 'fe_state', name: 'State Management (Redux/Zustand)', category: 'State', description: 'Global state, middleware, immutability, selectors', importance: 'Medium' },
      { id: 'fe_perf', name: 'Web Performance & Core Vitals', category: 'Optimization', description: 'Lighthouse audits, bundle splitting, lazy loading, caching', importance: 'Medium' },
      { id: 'fe_testing', name: 'Jest & React Testing Library', category: 'Testing', description: 'Component unit testing, mock handlers, user interaction simulation', importance: 'Medium' },
    ],
  },
  'Backend Developer': {
    name: 'Backend Developer',
    description: 'Engineer scalable APIs, microservices architectures, business logic engines, and secure database integrations.',
    allSkills: [
      { id: 'be_lang', name: 'Node.js / Python / Go / Java', category: 'Languages', description: 'Asynchronous event loops, concurrency, OOP/functional patterns', importance: 'High' },
      { id: 'be_api', name: 'RESTful APIs & GraphQL', category: 'Architecture', description: 'HTTP verbs, status codes, OpenAPI/Swagger, schema design, rate limiting', importance: 'High' },
      { id: 'be_sql', name: 'Relational Databases (PostgreSQL/MySQL)', category: 'Databases', description: 'ACID transactions, schema migrations, complex joins, indexing', importance: 'High' },
      { id: 'be_nosql', name: 'NoSQL & Caching (MongoDB/Redis)', category: 'Databases', description: 'Document stores, in-memory caching, pub/sub, TTL keys', importance: 'High' },
      { id: 'be_auth', name: 'Authentication & Security (JWT/OAuth2)', category: 'Security', description: 'Bcrypt hashing, token rotation, RBAC permissions, CSRF/CORS protection', importance: 'High' },
      { id: 'be_micro', name: 'Microservices & Message Queues', category: 'Architecture', description: 'RabbitMQ, Kafka, event-driven systems, service discovery', importance: 'Medium' },
      { id: 'be_docker', name: 'Docker & Containerization', category: 'DevOps', description: 'Writing Dockerfiles, multi-stage builds, docker-compose', importance: 'Medium' },
      { id: 'be_testing', name: 'Unit & Integration Testing', category: 'Testing', description: 'PyTest/Mocha/JUnit, test coverage, API mocking', importance: 'Medium' },
    ],
  },
  'Full Stack Developer': {
    name: 'Full Stack Developer',
    description: 'Deliver end-to-end applications spanning responsive web frontends, backend REST/GraphQL services, and cloud databases.',
    allSkills: [
      { id: 'fs_react', name: 'React & Frontend UI', category: 'Frontend', description: 'Component architecture, state management, modern CSS', importance: 'High' },
      { id: 'fs_node_py', name: 'Node.js or Python Backend', category: 'Backend', description: 'Express / FastAPI / Django API development', importance: 'High' },
      { id: 'fs_ts', name: 'Full-Stack TypeScript', category: 'Languages', description: 'Shared types between client and server, strict type safety', importance: 'High' },
      { id: 'fs_db', name: 'PostgreSQL & MongoDB', category: 'Databases', description: 'Database modeling, Prisma ORM / Mongoose, query tuning', importance: 'High' },
      { id: 'fs_auth', name: 'Session & Token Auth', category: 'Security', description: 'OAuth, JWT, protected routes, secure cookies', importance: 'High' },
      { id: 'fs_docker', name: 'Docker & Cloud Deployment', category: 'DevOps', description: 'Containerization, deploying to AWS / Vercel / Render', importance: 'Medium' },
      { id: 'fs_git', name: 'Git & CI/CD Pipelines', category: 'Workflow', description: 'Branching strategies, GitHub Actions, automated builds', importance: 'Medium' },
    ],
  },
  'Data Analyst': {
    name: 'Data Analyst',
    description: 'Transform raw datasets into actionable statistical insights, automated dashboards, and strategic business reports.',
    allSkills: [
      { id: 'da_python', name: 'Python Core Syntax', category: 'Programming', description: 'Data structures, list comprehensions, scripting, automation', importance: 'High' },
      { id: 'da_sql', name: 'Advanced SQL & Querying', category: 'Databases', description: 'Window functions, CTEs, self joins, query optimization', importance: 'High' },
      { id: 'da_pandas', name: 'Pandas Data Wrangling', category: 'Libraries', description: 'Cleaning, merging, grouping, reshaping, missing value treatment', importance: 'High' },
      { id: 'da_numpy', name: 'NumPy Arrays & Math', category: 'Libraries', description: 'Vectorized mathematical operations, multi-dimensional slicing', importance: 'High' },
      { id: 'da_viz', name: 'Matplotlib & Seaborn', category: 'Visualization', description: 'Histograms, scatter, box plots, heatmaps, subplots', importance: 'High' },
      { id: 'da_bi', name: 'Tableau / Power BI / Excel', category: 'Business Intelligence', description: 'DAX expressions, calculated fields, dynamic executive dashboards', importance: 'Medium' },
      { id: 'da_stats', name: 'Hypothesis Testing & A/B Testing', category: 'Statistics', description: 'p-values, confidence intervals, t-tests, ANOVA', importance: 'Medium' },
    ],
  },
  'Data Scientist': {
    name: 'Data Scientist',
    description: 'Leverage statistical modeling, machine learning, and advanced feature engineering to extract predictive intelligence.',
    allSkills: [
      { id: 'ds_py_r', name: 'Python & R Data Science', category: 'Languages', description: 'Scientific computing, data manipulation, statistical packages', importance: 'High' },
      { id: 'ds_stats', name: 'Inferential Statistics & Probability', category: 'Mathematics', description: 'Bayesian inference, probability distributions, regression modeling', importance: 'High' },
      { id: 'ds_sklearn', name: 'Scikit-Learn Machine Learning', category: 'Machine Learning', description: 'Supervised/unsupervised algorithms, cross-validation, hyperparameter tuning', importance: 'High' },
      { id: 'ds_feat', name: 'Feature Engineering & Selection', category: 'Data', description: 'Dimensionality reduction (PCA), scaling, encoding categorical variables', importance: 'High' },
      { id: 'ds_nlp_cv', name: 'Applied NLP & Deep Learning', category: 'AI', description: 'Text processing, embedding models, transfer learning', importance: 'Medium' },
      { id: 'ds_sql_bigdata', name: 'SQL & Big Data Tools', category: 'Databases', description: 'Large scale queries, Apache Spark, Snowflake', importance: 'Medium' },
      { id: 'ds_comm', name: 'Data Storytelling & Visualization', category: 'Communication', description: 'Translating model metrics to business outcomes, Streamlit apps', importance: 'Medium' },
    ],
  },
  'Machine Learning Engineer': {
    name: 'Machine Learning Engineer',
    description: 'Develop, scale, optimize, and deploy machine learning models and inference pipelines into production systems.',
    allSkills: [
      { id: 'ml_py', name: 'Python OOP & Performance', category: 'Programming', description: 'Modular architecture, vectorization, memory profiling', importance: 'High' },
      { id: 'ml_pytorch', name: 'PyTorch / TensorFlow', category: 'Deep Learning', description: 'Tensors, backpropagation, loss functions, custom architectures', importance: 'High' },
      { id: 'ml_sklearn', name: 'Scikit-Learn Algorithms', category: 'Machine Learning', description: 'Ensemble methods, XGBoost, LightGBM, Random Forests', importance: 'High' },
      { id: 'ml_mlops', name: 'MLOps & Experiment Tracking', category: 'Engineering', description: 'MLflow, Weights & Biases, DVC, model registry', importance: 'High' },
      { id: 'ml_serving', name: 'Model Serving & FastAPI', category: 'Deployment', description: 'REST inference endpoints, batch processing, latency optimization', importance: 'High' },
      { id: 'ml_docker', name: 'Docker & Kubernetes for ML', category: 'DevOps', description: 'Containerized training, GPU drivers, Triton Inference Server', importance: 'Medium' },
      { id: 'ml_math', name: 'Linear Algebra & Calculus', category: 'Math', description: 'Matrix decomposition, gradient optimization, loss landscapes', importance: 'Medium' },
    ],
  },
  'AI & Deep Learning Specialist': {
    name: 'AI & Deep Learning Specialist',
    description: 'Build cutting-edge generative AI, large language models (LLMs), RAG pipelines, and transformer architectures.',
    allSkills: [
      { id: 'ai_transformers', name: 'Transformers & LLM Architectures', category: 'AI Core', description: 'Attention mechanisms, BERT, GPT, LLaMA architectures', importance: 'High' },
      { id: 'ai_rag', name: 'Retrieval Augmented Generation (RAG)', category: 'Generative AI', description: 'Vector databases (Pinecone, Chroma), chunking, semantic search', importance: 'High' },
      { id: 'ai_langchain', name: 'LangChain & LlamaIndex', category: 'Frameworks', description: 'AI agent workflows, prompt chaining, function calling', importance: 'High' },
      { id: 'ai_finetune', name: 'Fine-Tuning (LoRA & PEFT)', category: 'Deep Learning', description: 'Parameter-efficient fine tuning, dataset preparation, quantization', importance: 'High' },
      { id: 'ai_pytorch', name: 'PyTorch Deep Learning', category: 'Deep Learning', description: 'Custom neural networks, training loops, CUDA acceleration', importance: 'High' },
      { id: 'ai_prompt', name: 'Prompt Engineering & Guardrails', category: 'Safety', description: 'Structured outputs, system instructions, safety mitigations', importance: 'Medium' },
    ],
  },
  'DevOps Engineer': {
    name: 'DevOps Engineer',
    description: 'Automate build, test, and release cycles, maintain CI/CD pipelines, and orchestrate scalable cloud infrastructure.',
    allSkills: [
      { id: 'devops_linux', name: 'Linux System Administration & Bash', category: 'Systems', description: 'Shell scripting, permissions, process monitoring, networking', importance: 'High' },
      { id: 'devops_docker', name: 'Docker & Containerization', category: 'Containers', description: 'Multi-stage builds, security scanning, image optimization', importance: 'High' },
      { id: 'devops_k8s', name: 'Kubernetes (K8s) Orchestration', category: 'Containers', description: 'Deployments, Services, ConfigMaps, Helm charts, Ingress', importance: 'High' },
      { id: 'devops_cicd', name: 'CI/CD with GitHub Actions', category: 'Automation', description: 'Automated testing, building artifacts, release pipelines', importance: 'High' },
      { id: 'devops_iac', name: 'Terraform (Infrastructure as Code)', category: 'Cloud', description: 'Declarative cloud provisioning, state management, modules', importance: 'High' },
      { id: 'devops_cloud', name: 'AWS / Azure Cloud Services', category: 'Cloud', description: 'EC2, S3, IAM, VPC, ECS, Lambda, Route53', importance: 'High' },
      { id: 'devops_monitoring', name: 'Prometheus & Grafana Monitoring', category: 'Observability', description: 'Metric collection, dashboards, alerting rules, log aggregation', importance: 'Medium' },
    ],
  },
  'Cloud Solutions Architect': {
    name: 'Cloud Solutions Architect',
    description: 'Architect resilient, cost-effective, secure cloud-native distributed systems on AWS, Google Cloud, or Azure.',
    allSkills: [
      { id: 'csa_aws_gcp', name: 'AWS / GCP / Azure Architecture', category: 'Cloud', description: 'Well-Architected Framework, multi-region failover, VPC design', importance: 'High' },
      { id: 'csa_serverless', name: 'Serverless & Microservices', category: 'Architecture', description: 'AWS Lambda, API Gateway, EventBridge, Cloud Run', importance: 'High' },
      { id: 'csa_security', name: 'Cloud Security & IAM Governance', category: 'Security', description: 'Least privilege, KMS encryption, Zero Trust architecture', importance: 'High' },
      { id: 'csa_cost', name: 'FinOps & Cloud Cost Optimization', category: 'Operations', description: 'Resource sizing, Reserved Instances, cost monitoring', importance: 'Medium' },
      { id: 'csa_iac', name: 'Terraform & CloudFormation', category: 'IaC', description: 'Automated immutable infrastructure provisioning', importance: 'High' },
    ],
  },
  'Cybersecurity Analyst & Ethical Hacker': {
    name: 'Cybersecurity Analyst & Ethical Hacker',
    description: 'Safeguard systems against vulnerabilities, conduct penetration tests, analyze threat vectors, and ensure security compliance.',
    allSkills: [
      { id: 'sec_network', name: 'Network Security & Protocols', category: 'Networking', description: 'TCP/IP, Wireshark packet analysis, firewalls, VPNs', importance: 'High' },
      { id: 'sec_owasp', name: 'OWASP Top 10 Web Security', category: 'Application Security', description: 'SQL injection, XSS, CSRF, SSRF, broken authentication', importance: 'High' },
      { id: 'sec_pentest', name: 'Penetration Testing & Burp Suite', category: 'Offensive Security', description: 'Vulnerability scanning, exploit analysis, Metasploit', importance: 'High' },
      { id: 'sec_crypto', name: 'Cryptography & PKI', category: 'Security', description: 'Symmetric/asymmetric encryption, hashing, SSL/TLS, digital signatures', importance: 'High' },
      { id: 'sec_siem', name: 'SIEM & Incident Response', category: 'Defense', description: 'Splunk, log analysis, threat intelligence, SOC triage', importance: 'Medium' },
      { id: 'sec_linux', name: 'Linux Security & Hardening', category: 'Systems', description: 'SSH hardening, iptables, auditing, privilege escalation prevention', importance: 'Medium' },
    ],
  },
  'Mobile App Developer (iOS & Android)': {
    name: 'Mobile App Developer (iOS & Android)',
    description: 'Create high-performance native and cross-platform mobile apps for millions of mobile smartphone users.',
    allSkills: [
      { id: 'mob_react_native', name: 'React Native / Flutter', category: 'Cross-Platform', description: 'Component architecture, Dart / JavaScript, cross-platform widgets', importance: 'High' },
      { id: 'mob_swift_kotlin', name: 'Swift (iOS) / Kotlin (Android)', category: 'Native', description: 'Platform-native APIs, memory management, lifecycle', importance: 'High' },
      { id: 'mob_state', name: 'Mobile State Management & Offline', category: 'State', description: 'Redux, Riverpod, SQLite, Realm local persistence', importance: 'High' },
      { id: 'mob_api', name: 'REST & GraphQL API Integration', category: 'Networking', description: 'Axios, caching, optimistic UI updates, error handling', importance: 'High' },
      { id: 'mob_publish', name: 'App Store & Play Store Deployment', category: 'Release', description: 'Signing certificates, Fastlane, testflight, store guidelines', importance: 'Medium' },
    ],
  },
  'Database Administrator & SQL Architect': {
    name: 'Database Administrator & SQL Architect',
    description: 'Ensure maximum database performance, high availability, backup integrity, and optimal schema normalization.',
    allSkills: [
      { id: 'dba_sql', name: 'Expert SQL & Query Optimization', category: 'Querying', description: 'Execution plans (EXPLAIN ANALYZE), index tuning (B-Tree, GIN, GiST)', importance: 'High' },
      { id: 'dba_postgres', name: 'PostgreSQL & MySQL Administration', category: 'RDBMS', description: 'Configuration tuning, vacuuming, connection pooling (PgBouncer)', importance: 'High' },
      { id: 'dba_ha', name: 'Replication & High Availability', category: 'Reliability', description: 'Master-replica, streaming replication, automatic failover, WAL archiving', importance: 'High' },
      { id: 'dba_modeling', name: 'Data Modeling & Normalization', category: 'Architecture', description: '1NF-3NF, star schema, snowflake schema, sharding strategies', importance: 'High' },
      { id: 'dba_nosql', name: 'Redis & In-Memory Databases', category: 'NoSQL', description: 'Cache eviction policies, persistence (RDB/AOF), Redis clusters', importance: 'Medium' },
    ],
  },
  'Data Engineer (Big Data & ETL)': {
    name: 'Data Engineer (Big Data & ETL)',
    description: 'Build reliable data ingestion pipelines, large-scale distributed ETL workflows, and centralized data warehouses.',
    allSkills: [
      { id: 'de_python_sql', name: 'Python & Advanced SQL', category: 'Languages', description: 'Scripting, pipeline development, complex data transformations', importance: 'High' },
      { id: 'de_spark', name: 'Apache Spark & PySpark', category: 'Big Data', description: 'Distributed DataFrames, RDDs, cluster computing, optimization', importance: 'High' },
      { id: 'de_kafka', name: 'Apache Kafka & Streaming', category: 'Streaming', description: 'Producers, consumers, topics, partitions, event streaming', importance: 'High' },
      { id: 'de_airflow', name: 'Apache Airflow (DAGs)', category: 'Orchestration', description: 'Workflow scheduling, backfilling, task dependencies, monitoring', importance: 'High' },
      { id: 'de_dwh', name: 'Data Warehousing (Snowflake/BigQuery)', category: 'Warehousing', description: 'Columnar storage, partitioning, clustering, data lakes (S3/Delta Lake)', importance: 'High' },
    ],
  },
  'Software QA & Test Automation Engineer': {
    name: 'Software QA & Test Automation Engineer',
    description: 'Design robust automated test suites, end-to-end testing frameworks, and quality gates for continuous deployment.',
    allSkills: [
      { id: 'qa_playwright', name: 'Playwright & Cypress E2E Testing', category: 'Web Automation', description: 'Headless browser automation, visual regression, assertions', importance: 'High' },
      { id: 'qa_selenium', name: 'Selenium WebDriver (Java/Python)', category: 'Automation', description: 'Page Object Model, cross-browser compatibility testing', importance: 'High' },
      { id: 'qa_api_test', name: 'API Testing (Postman & REST Assured)', category: 'API Testing', description: 'Automated contract testing, status verification, payload validation', importance: 'High' },
      { id: 'qa_unit', name: 'Jest / PyTest Unit Test Suites', category: 'Unit Testing', description: 'Code coverage metrics, mocking, parameterization', importance: 'High' },
      { id: 'qa_cicd', name: 'CI/CD Integration for Tests', category: 'DevOps', description: 'Running headless tests on pull requests via GitHub Actions', importance: 'Medium' },
    ],
  },
  'Site Reliability Engineer (SRE)': {
    name: 'Site Reliability Engineer (SRE)',
    description: 'Bridge software engineering and IT operations to guarantee system reliability, high uptime, and rapid incident resolution.',
    allSkills: [
      { id: 'sre_linux', name: 'Linux Kernel & System Internals', category: 'Systems', description: 'Process scheduling, memory management, IO profiling, networking', importance: 'High' },
      { id: 'sre_slo', name: 'SLIs, SLOs & Error Budgets', category: 'Reliability', description: 'Defining availability targets, alerting philosophy, incident postmortems', importance: 'High' },
      { id: 'sre_k8s', name: 'Kubernetes & Container Reliability', category: 'Containers', description: 'Pod disruption budgets, autoscaling (HPA/VPA), health probes', importance: 'High' },
      { id: 'sre_obs', name: 'Prometheus, Grafana & OpenTelemetry', category: 'Observability', description: 'Distributed tracing, metric alerts, APM monitoring', importance: 'High' },
      { id: 'sre_automation', name: 'Go / Python Automation Scripting', category: 'Automation', description: 'Eliminating manual toil, self-healing infrastructure', importance: 'High' },
    ],
  },
  'Systems & Embedded Software Engineer': {
    name: 'Systems & Embedded Software Engineer',
    description: 'Develop low-level operating systems code, device drivers, firmware, and real-time embedded systems.',
    allSkills: [
      { id: 'sys_c_cpp', name: 'C & Modern C++ (C++17/20)', category: 'Languages', description: 'Pointers, memory management, RAII, templates, standard library', importance: 'High' },
      { id: 'sys_rust', name: 'Rust Systems Programming', category: 'Languages', description: 'Ownership, borrowing, lifetimes, fearless concurrency, memory safety', importance: 'High' },
      { id: 'sys_os', name: 'Operating Systems & Linux Kernel', category: 'Systems', description: 'System calls, multithreading, synchronization primitives (mutex/semaphores)', importance: 'High' },
      { id: 'sys_rtos', name: 'RTOS & Embedded Firmware', category: 'Embedded', description: 'FreeRTOS, microcontrollers (ARM Cortex, ESP32), GPIO, I2C, SPI, UART', importance: 'High' },
      { id: 'sys_debug', name: 'GDB, Valgrind & Hardware Debugging', category: 'Tools', description: 'Memory leak detection, core dump inspection, logic analyzers', importance: 'Medium' },
    ],
  },
  'Blockchain & Web3 Developer': {
    name: 'Blockchain & Web3 Developer',
    description: 'Architect decentralized applications (dApps), smart contracts, and tokenomics on EVM-compatible networks.',
    allSkills: [
      { id: 'bch_solidity', name: 'Solidity Smart Contracts', category: 'Smart Contracts', description: 'EVM architecture, gas optimization, reentrancy guards, inheritance', importance: 'High' },
      { id: 'bch_hardhat', name: 'Hardhat & Foundry Tooling', category: 'Tooling', description: 'Smart contract testing, local testnet deployment, fuzz testing', importance: 'High' },
      { id: 'bch_web3js', name: 'Ethers.js & Web3.js', category: 'Frontend Integration', description: 'Wallet connections (MetaMask, Wagmi), contract interactions, events', importance: 'High' },
      { id: 'bch_security', name: 'Smart Contract Auditing & Security', category: 'Security', description: 'Preventing flash loan attacks, oracle manipulation, OpenZeppelin standards', importance: 'High' },
      { id: 'bch_defi', name: 'DeFi & Token Protocols (ERC-20/721/1155)', category: 'Protocols', description: 'NFT standards, liquidity pools, automated market makers (AMMs)', importance: 'Medium' },
    ],
  },
  'UI/UX & Product Engineer': {
    name: 'UI/UX & Product Engineer',
    description: 'Design intuitive, human-centered product experiences in Figma and implement pixel-perfect, accessible UI code.',
    allSkills: [
      { id: 'ui_figma', name: 'Figma & Design Systems', category: 'Design', description: 'Auto-layout, variants, design tokens, responsive component libraries', importance: 'High' },
      { id: 'ui_user_research', name: 'User Research & Wireframing', category: 'UX', description: 'User personas, journey mapping, usability testing, heuristics', importance: 'High' },
      { id: 'ui_a11y', name: 'Web Accessibility (WCAG 2.1 AA)', category: 'Accessibility', description: 'ARIA attributes, keyboard navigation, screen reader testing, contrast', importance: 'High' },
      { id: 'ui_code', name: 'HTML5, CSS Animations & Tailwind', category: 'Frontend', description: 'Translating Figma prototypes into responsive, animated production code', importance: 'High' },
      { id: 'ui_micro', name: 'Micro-Interactions & Framer Motion', category: 'Animations', description: 'Spring physics, layout animations, engaging user transitions', importance: 'Medium' },
    ],
  },
  'Computer Vision Engineer': {
    name: 'Computer Vision Engineer',
    description: 'Build automated visual perception models for image recognition, object detection, and video segmentation.',
    allSkills: [
      { id: 'cv_opencv', name: 'OpenCV & Image Processing', category: 'Vision Core', description: 'Filtering, edge detection, color spaces, transformations', importance: 'High' },
      { id: 'cv_pytorch', name: 'PyTorch for Computer Vision', category: 'Deep Learning', description: 'CNNs, ResNet, Vision Transformers (ViT), transfer learning', importance: 'High' },
      { id: 'cv_yolo', name: 'YOLO & Object Detection', category: 'Architectures', description: 'Real-time object detection, bounding box regression, mAP metrics', importance: 'High' },
      { id: 'cv_seg', name: 'Image Segmentation (Mask R-CNN, UNet)', category: 'Segmentation', description: 'Pixel-level segmentation, medical imaging, autonomous driving inputs', importance: 'High' },
      { id: 'cv_deploy', name: 'Edge Deployment (ONNX, TensorRT)', category: 'Deployment', description: 'Model quantization, INT8 inference, edge device optimization', importance: 'Medium' },
    ],
  },
  'NLP & Conversational AI Engineer': {
    name: 'NLP & Conversational AI Engineer',
    description: 'Develop natural language understanding, sentiment analysis, machine translation, and speech AI applications.',
    allSkills: [
      { id: 'nlp_huggingface', name: 'Hugging Face Transformers', category: 'NLP Core', description: 'BERT, RoBERTa, T5, tokenizers, pipelines, model hub', importance: 'High' },
      { id: 'nlp_text', name: 'Text Preprocessing & Embeddings', category: 'Data', description: 'Sentence Transformers, vector embeddings, cosine similarity', importance: 'High' },
      { id: 'nlp_llm', name: 'LLMs & Prompt Orchestration', category: 'Generative AI', description: 'Instruction tuning, structured outputs, agents, RAG', importance: 'High' },
      { id: 'nlp_speech', name: 'Speech Recognition (Whisper)', category: 'Speech', description: 'Audio processing, transcription, text-to-speech pipelines', importance: 'Medium' },
      { id: 'nlp_eval', name: 'NLP Evaluation Metrics (BLEU/ROUGE)', category: 'Evaluation', description: 'Evaluating translation, summarization, and dialogue coherence', importance: 'Medium' },
    ],
  },
};

class GeminiService {
  /**
   * Returns the currently configured Gemini API Key from localStorage or environment
   */
  public getApiKey(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored && stored.trim().length > 5) return stored.trim();
    }
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

  public setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key.trim());
    }
  }

  /**
   * Generate grounded multiple-choice questions for any topic using Google Gemini REST API,
   * falling back to smart dynamic generation if offline or API key is absent.
   */
  public async generateTopicQuiz(params: {
    topic: string;
    numQuestions: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    apiKey?: string;
  }): Promise<GeminiQuizQuestion[]> {
    const key = params.apiKey || this.getApiKey();

    if (key) {
      try {
        const prompt = `You are a Senior Statistical & Computer Science Examiner for university students and data science aspirants.
Generate exactly ${params.numQuestions} high-quality Multiple Choice Questions (MCQs) on the topic: "${params.topic}".
Target Difficulty: ${params.difficulty}.

Ensure questions test practical understanding (e.g. what function in NumPy/Pandas/Scikit-Learn to use, formula interpretation, or statistical reasoning).
Provide the result as a strict JSON array of objects with keys:
- "id": string like "q-1", "q-2"
- "question": string with the question text
- "options": array of exactly 4 strings
- "correctIndex": integer 0 to 3
- "explanation": string explaining why the correct answer is right and why others are wrong
- "sourceReference": string specifying the textbook or library documentation (e.g. "NumPy v1.26 Docs", "Wes McKinney Python for Data Analysis Ch 4")
- "difficulty": "${params.difficulty}"

Output ONLY the raw JSON array. No markdown code blocks, no backticks, no conversational text.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        }
      } catch (err) {
        console.warn('[GeminiService] Live Gemini API call failed, falling back to smart generation:', err);
      }
    }

    // Dynamic offline generator matching the topic
    return this.generateSmartFallbackQuiz(params.topic, params.numQuestions, params.difficulty);
  }

  /**
   * Smart fallback questions covering NumPy, Matplotlib, Pandas, ML, Statistics, and MoSPI sampling
   */
  private generateSmartFallbackQuiz(
    topic: string,
    numQuestions: number,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): GeminiQuizQuestion[] {
    const topicLower = topic.toLowerCase();

    const pool: GeminiQuizQuestion[] = [];

    if (topicLower.includes('numpy') || topicLower.includes('array') || topicLower.includes('python')) {
      pool.push(
        {
          id: 'q-num-1',
          question: 'In NumPy, how do you perform element-wise multiplication between two 2D arrays A and B of identical shape?',
          options: ['A * B', 'np.dot(A, B)', 'np.multiply_matrices(A, B)', 'A @ B'],
          correctIndex: 0,
          explanation: 'In NumPy, the "*" operator performs element-wise multiplication. Matrix multiplication is done using "@" or "np.matmul()".',
          sourceReference: 'NumPy v1.26 Reference Manual • Vectorized Arithmetic',
          difficulty,
        },
        {
          id: 'q-num-2',
          question: 'Which NumPy method creates an array of 50 evenly spaced numbers between 0 and 10, inclusive?',
          options: ['np.arange(0, 10, 50)', 'np.linspace(0, 10, 50)', 'np.interval(0, 10, 50)', 'np.grid(0, 10, 50)'],
          correctIndex: 1,
          explanation: 'np.linspace(start, stop, num) specifies the exact number of evenly spaced samples including both endpoints by default.',
          sourceReference: 'Python for Data Analysis by Wes McKinney • Ch 4',
          difficulty,
        },
        {
          id: 'q-num-3',
          question: 'What is the shape of a NumPy array created by arr = np.zeros((3, 4, 2))?',
          options: ['3 rows, 4 columns, 2 depth (3D tensor)', '2 rows, 4 columns, 3 depth', '12 rows, 2 columns', '24 elements in a 1D vector'],
          correctIndex: 0,
          explanation: 'The tuple (3, 4, 2) represents 3 matrices of size 4 rows by 2 columns, totaling 24 elements in 3 dimensions.',
          sourceReference: 'NumPy Array Manipulation Architecture',
          difficulty,
        }
      );
    }

    if (topicLower.includes('matplot') || topicLower.includes('plot') || topicLower.includes('visual')) {
      pool.push(
        {
          id: 'q-plt-1',
          question: 'In Matplotlib (pyplot), which function creates a grid of subplots returning both the Figure and Axes array?',
          options: ['plt.figure_grid()', 'plt.subplots(nrows, ncols)', 'plt.make_axes()', 'plt.multiplot()'],
          correctIndex: 1,
          explanation: 'fig, axes = plt.subplots(nrows, ncols) is the standard object-oriented interface for generating multiple subplots.',
          sourceReference: 'Storytelling with Data & Matplotlib Documentation',
          difficulty,
        },
        {
          id: 'q-plt-2',
          question: 'When visualizing the probability distribution of a continuous statistical variable, which Matplotlib function is most appropriate?',
          options: ['plt.bar()', 'plt.hist(data, bins=30, density=True)', 'plt.pie()', 'plt.scatter_matrix()'],
          correctIndex: 1,
          explanation: 'plt.hist() with density=True normalizes bin heights so the total area equals 1, representing probability density.',
          sourceReference: 'Practical Statistics for Data Scientists Ch 1',
          difficulty,
        },
        {
          id: 'q-plt-3',
          question: 'How do you prevent overlapping axis labels and titles across multiple subplots in Matplotlib?',
          options: ['plt.tight_layout()', 'plt.clear_overlap()', 'plt.adjust_padding()', 'plt.autoscale(False)'],
          correctIndex: 0,
          explanation: 'plt.tight_layout() automatically adjusts subplot params so that subplots and labels fit cleanly within the figure area.',
          sourceReference: 'Python Data Science Handbook • Visualization',
          difficulty,
        }
      );
    }

    if (topicLower.includes('pandas') || topicLower.includes('wrangling') || topicLower.includes('data')) {
      pool.push(
        {
          id: 'q-pan-1',
          question: 'In Pandas, which method groups data by categorical columns and computes aggregate statistical measures (mean, sum)?',
          options: ['df.aggregate_by()', 'df.groupby()', 'df.pivot_table()', 'df.cluster()'],
          correctIndex: 1,
          explanation: 'df.groupby(["column"]).agg({"metric": "mean"}) implements the split-apply-combine workflow for grouped summaries.',
          sourceReference: 'Wes McKinney Python for Data Analysis • Ch 10',
          difficulty,
        },
        {
          id: 'q-pan-2',
          question: 'How do you check for and count missing (null / NaN) values per column in a Pandas DataFrame df?',
          options: ['df.isnull().sum()', 'df.count_missing()', 'df.dropna(axis=1)', 'df.isna().count()'],
          correctIndex: 0,
          explanation: 'df.isnull().sum() creates a boolean mask of missing values and sums True (1) per column.',
          sourceReference: 'Pandas User Guide • Missing Data Handling',
          difficulty,
        }
      );
    }

    if (topicLower.includes('learning') || topicLower.includes('machine') || topicLower.includes('model') || topicLower.includes('scikit')) {
      pool.push(
        {
          id: 'q-ml-1',
          question: 'In Scikit-Learn, why must the StandardScaler be fit ONLY on the training set (fit_transform) and NOT on the test set (transform only)?',
          options: [
            'To prevent data leakage from the test set into training',
            'Because the test set has no mean or standard deviation',
            'To reduce training computational time',
            'Scikit-Learn raises a ValueError if you fit on test data',
          ],
          correctIndex: 0,
          explanation: 'Fitting scalers on test data causes data leakage, as test distribution statistics would bias model training.',
          sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 2',
          difficulty,
        },
        {
          id: 'q-ml-2',
          question: 'Which metric is most informative when evaluating a classification model trained on a heavily imbalanced dataset (e.g. 99% negative, 1% positive)?',
          options: ['Overall Accuracy', 'Precision-Recall AUC (PR-AUC) or F1-score', 'Mean Squared Error (MSE)', 'R-squared (R²)'],
          correctIndex: 1,
          explanation: 'A trivial model predicting always negative gets 99% accuracy. PR-AUC and F1-score specifically evaluate true positive discovery under severe imbalance.',
          sourceReference: 'An Introduction to Statistical Learning (ISLR) • Ch 4',
          difficulty,
        }
      );
    }

    // Default statistical and sampling questions if specific topic pool is short
    pool.push(
      {
        id: 'q-stat-gen-1',
        question: `Regarding ${topic}: What is the primary difference between Population Parameter and Sample Statistic?`,
        options: [
          'Parameters describe the whole population (fixed, often unknown); statistics are calculated from sample data',
          'Statistics are always larger than parameters',
          'Parameters are estimated with Python, statistics with Excel',
          'There is no difference in modern data science',
        ],
        correctIndex: 0,
        explanation: 'A parameter is a fixed numerical characteristic of the entire population (e.g. μ), while a statistic is an estimator computed from sample data (e.g. x̄).',
        sourceReference: 'Sampling Techniques by William G. Cochran • Ch 2',
        difficulty,
      },
      {
        id: 'q-stat-gen-2',
        question: `When building an analytical pipeline for ${topic}, what is the Central Limit Theorem (CLT) guarantee?`,
        options: [
          'The sample mean distribution approaches normal as sample size increases, regardless of population distribution shape',
          'Every population must follow a bell-shaped normal curve',
          'Larger samples always produce a smaller mean',
          'All variance drops to zero if n > 30',
        ],
        correctIndex: 0,
        explanation: 'The Central Limit Theorem guarantees that the distribution of sample means approaches normality as n increases, provided variance is finite.',
        sourceReference: 'Practical Statistics for Data Scientists • Ch 2',
        difficulty,
      }
    );

    return pool.slice(0, numQuestions);
  }

  /**
   * Search what a student should learn for their target career job,
   * calculating exact gap metrics and book recommendations.
   */
  public async getCareerRoadmapGuidance(
    targetRole: string,
    knownSkills: string[],
    apiKey?: string
  ): Promise<CareerGuidanceResult> {
    const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS['Data Analyst'];

    const mastered = benchmark.allSkills.filter((s) =>
      knownSkills.some((k) => k.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(k.toLowerCase()))
    );

    const toLearn = benchmark.allSkills.filter((s) => !mastered.some((m) => m.id === s.id)).map((s) => ({
      name: s.name,
      importance: s.importance,
      estimatedHours: s.importance === 'High' ? 14 : 8,
      description: s.description,
    }));

    const readinessScore = Math.round((mastered.length / (benchmark.allSkills.length || 1)) * 100);

    const books = CURATED_BOOKS.filter((b) => b.roles.includes(targetRole) || b.roles.includes('Data Analyst')).slice(0, 4);

    let aiAdvice = `Based on your profile, you already have ${mastered.length} core competencies. Focus your next 3 weeks on ${toLearn.slice(0, 2).map((s) => s.name).join(' and ')} to reach job-readiness for 2026 entry-level roles.`;

    const key = apiKey || this.getApiKey();
    if (key) {
      try {
        const prompt = `Student knows: ${knownSkills.join(', ')}. Target role: ${targetRole}.
In 2 concise, highly encouraging sentences, tell them the exact modern library, tool, and study tip they should focus on next for 2026 hiring standards.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) aiAdvice = reply.trim();
        }
      } catch (e) {
        // keep fallback advice
      }
    }

    return {
      role: targetRole,
      readinessScore,
      skillsMastered: mastered.map((s) => s.name),
      skillsToLearn: toLearn,
      recommendedBooks: books,
      aiAdvice,
    };
  }
}

export const geminiService = new GeminiService();

/**
 * Dynamically generates Grounded Competencies & Skill Gaps for any student based on
 * their target career role and selected technical skills.
 */
export function generateCompetenciesAndGapsForRole(
  targetRole: string,
  knownSkills: string[] = []
): { competencies: Competency[]; skillGaps: SkillGapItem[]; overallCompetency: number; roleReadiness: number } {
  const benchmark =
    ROLE_SKILL_BENCHMARKS[targetRole] ||
    ROLE_SKILL_BENCHMARKS['Senior Statistical Officer'] ||
    ROLE_SKILL_BENCHMARKS['Data Analyst'];
  const allSkills = benchmark.allSkills || [];

  const competencies: Competency[] = allSkills.map((s, idx) => {
    const isMastered = knownSkills.some(
      (k) =>
        k.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(k.toLowerCase()) ||
        s.id.toLowerCase().includes(k.toLowerCase())
    );

    const currentScore = isMastered ? Math.min(95, 82 + (idx % 12)) : Math.max(20, 28 + (idx % 18));
    const requiredScore = s.importance === 'High' ? 85 : 75;
    const currentLevel = (currentScore >= 80 ? 'L4' : currentScore >= 60 ? 'L3' : currentScore >= 40 ? 'L2' : 'L1') as CompetencyLevel;
    const requiredLevel = (requiredScore >= 80 ? 'L4' : 'L3') as CompetencyLevel;
    const status = currentScore >= requiredScore ? 'Target Met' : (requiredScore - currentScore >= 35 ? 'Critical Gap' : 'Moderate Gap');

    const domain: CompetencyDomain =
      s.category.includes('Data') || s.category.includes('Statistics') || s.category.includes('Math')
        ? 'Statistical'
        : s.category.includes('Security') || s.category.includes('Governance')
        ? 'Digital Governance'
        : 'Technical';

    return {
      id: `comp-${s.id || idx}`,
      name: s.name,
      domain,
      currentLevel,
      requiredLevel,
      currentScore,
      requiredScore,
      gap: currentScore - requiredScore,
      confidence: 94,
      status,
      description: s.description,
      evidenceSources: isMastered
        ? [
            { type: 'Assessment', title: `${s.name} Validation Diagnostic`, date: '04 Sep 2026', score: `${currentScore}%` },
            { type: 'Experience', title: `Hands-on Project & Practical Artifacts`, date: '02 Sep 2026' },
          ]
        : [
            { type: 'Assessment', title: `Initial Baseline Self-Audit`, date: '04 Sep 2026', score: `${currentScore}%` },
          ],
      trend: isMastered ? 'increasing' : 'needs_refresh',
      lastAssessed: '04 Sep 2026',
      historicalScores: [
        { date: 'Aug 2026', score: Math.max(10, currentScore - 15) },
        { date: 'Sep 2026', score: currentScore },
      ],
      recommendedCourseIds: [`crs-00${(idx % 5) + 1}`],
    };
  });

  const skillGaps: SkillGapItem[] = competencies
    .filter((c) => c.status === 'Critical Gap' || c.status === 'Moderate Gap' || c.gap < 0)
    .map((c, idx) => {
      const deficit = c.requiredScore - c.currentScore;
      return {
        id: `gap-${c.id}`,
        competencyId: c.id,
        competencyName: c.name,
        domain: c.domain,
        currentLevel: c.currentLevel,
        requiredLevel: c.requiredLevel,
        currentScore: c.currentScore,
        requiredScore: c.requiredScore,
        gapLevels: Math.max(1, parseInt(c.requiredLevel.replace('L', '')) - parseInt(c.currentLevel.replace('L', ''))),
        severity: c.status === 'Critical Gap' ? 'Critical' : 'Medium',
        roleRelevance: 95 - idx * 3,
        priorityRank: idx + 1,
        estimatedTimeToBridge: c.status === 'Critical Gap' ? '12-16 hours' : '6-8 hours',
        recommendedCourseId: c.recommendedCourseIds[0] || 'crs-001',
        rationale: `Target career role (${targetRole}) requires high proficiency in ${c.name}. Current verified capability has a ${deficit}% deficit.`,
      };
    });

  const avgCompetency = Math.round(
    competencies.reduce((acc, c) => acc + c.currentScore, 0) / (competencies.length || 1)
  );
  const masteredCount = competencies.filter((c) => c.status === 'Target Met' || c.currentScore >= c.requiredScore).length;
  const roleReadiness = Math.round((masteredCount / (competencies.length || 1)) * 100);

  return { competencies, skillGaps, overallCompetency: avgCompetency, roleReadiness };
}
