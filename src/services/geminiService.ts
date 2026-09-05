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
   * Smart fallback quiz — large shuffled, difficulty-aware question bank.
   * Supports up to 25 questions with different questions every generation.
   */
  private generateSmartFallbackQuiz(
    topic: string,
    numQuestions: number,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): GeminiQuizQuestion[] {
    const topicLower = topic.toLowerCase();

    /** Fisher-Yates shuffle for randomisation each call */
    const shuffle = <T>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // ── NUMPY / PYTHON ────────────────────────────────────────────────────────
    const numpyPool: GeminiQuizQuestion[] = [
      { id: 'np-1', difficulty: 'Beginner',
        question: 'Which NumPy function creates a 1-D array from a Python list?',
        options: ['np.array(list)', 'np.from_list(list)', 'np.vector(list)', 'np.create(list)'],
        correctIndex: 0,
        explanation: 'np.array() is the primary constructor for converting Python sequences into NumPy arrays.',
        sourceReference: 'NumPy v1.26 Quickstart Tutorial' },
      { id: 'np-2', difficulty: 'Beginner',
        question: 'What does arr.shape return for a 3×4 NumPy matrix?',
        options: ['(3, 4)', '(4, 3)', '12', '[3, 4]'],
        correctIndex: 0,
        explanation: 'shape returns a tuple (rows, cols). A 3-row, 4-column matrix returns (3, 4).',
        sourceReference: 'NumPy Array Basics Documentation' },
      { id: 'np-3', difficulty: 'Beginner',
        question: 'Which function fills an array with zeros of a given shape?',
        options: ['np.zeros(shape)', 'np.empty(shape)', 'np.null(shape)', 'np.blank(shape)'],
        correctIndex: 0,
        explanation: 'np.zeros(shape) initialises every element to 0.0. np.empty() leaves memory uninitialised.',
        sourceReference: 'NumPy Reference Manual • Array Creation' },
      { id: 'np-4', difficulty: 'Beginner',
        question: 'What is the result of np.arange(0, 10, 2)?',
        options: ['[0, 2, 4, 6, 8]', '[0, 2, 4, 6, 8, 10]', '[2, 4, 6, 8, 10]', '[0, 10, 2]'],
        correctIndex: 0,
        explanation: 'np.arange(start, stop, step) — stop is exclusive, so 10 is not included.',
        sourceReference: 'NumPy v1.26 Reference Manual' },
      { id: 'np-5', difficulty: 'Beginner',
        question: 'How do you obtain the total number of elements in a NumPy array arr?',
        options: ['arr.size', 'arr.count()', 'len(arr)', 'arr.total'],
        correctIndex: 0,
        explanation: 'arr.size returns the product of all dimension lengths — total element count.',
        sourceReference: 'NumPy Array Attributes' },
      { id: 'np-6', difficulty: 'Intermediate',
        question: 'In NumPy, how do you perform element-wise multiplication between two 2D arrays A and B of identical shape?',
        options: ['A * B', 'np.dot(A, B)', 'np.multiply_matrices(A, B)', 'A @ B'],
        correctIndex: 0,
        explanation: '"*" is element-wise (Hadamard product). Matrix multiplication uses "@" or np.matmul().',
        sourceReference: 'NumPy v1.26 Reference Manual • Vectorized Arithmetic' },
      { id: 'np-7', difficulty: 'Intermediate',
        question: 'Which NumPy method creates 50 evenly spaced numbers between 0 and 10 inclusive?',
        options: ['np.arange(0,10,50)', 'np.linspace(0,10,50)', 'np.interval(0,10,50)', 'np.grid(0,10,50)'],
        correctIndex: 1,
        explanation: 'np.linspace(start, stop, num) includes both endpoints by default.',
        sourceReference: 'Python for Data Analysis by Wes McKinney • Ch 4' },
      { id: 'np-8', difficulty: 'Intermediate',
        question: 'What is the shape of np.zeros((3, 4, 2))?',
        options: ['(3, 4, 2)', '(4, 3, 2)', '(3, 2, 4)', '24'],
        correctIndex: 0,
        explanation: 'The tuple directly defines the shape: 3 matrices of 4 rows × 2 columns.',
        sourceReference: 'NumPy Array Manipulation Architecture' },
      { id: 'np-9', difficulty: 'Intermediate',
        question: 'Which NumPy function stacks arrays along a new axis?',
        options: ['np.stack()', 'np.concatenate()', 'np.append()', 'np.merge()'],
        correctIndex: 0,
        explanation: 'np.stack() joins arrays along a NEW axis; np.concatenate() joins along an EXISTING axis.',
        sourceReference: 'NumPy Array Manipulation Routines' },
      { id: 'np-10', difficulty: 'Intermediate',
        question: 'What does np.where(condition, x, y) return?',
        options: [
          'Elements from x where condition is True, else from y',
          'Indices where condition is True',
          'Filtered rows of x',
          'Boolean mask of condition',
        ],
        correctIndex: 0,
        explanation: 'np.where(cond, x, y) is the vectorised ternary — returns x value when True, y when False.',
        sourceReference: 'NumPy Logic Functions Documentation' },
      { id: 'np-11', difficulty: 'Intermediate',
        question: 'How do you transpose a 2D NumPy array A?',
        options: ['A.T or np.transpose(A)', 'A.flip()', 'np.rotate(A)', 'A.reshape(-1)'],
        correctIndex: 0,
        explanation: 'The .T attribute and np.transpose() both swap rows and columns.',
        sourceReference: 'NumPy Linear Algebra Guide' },
      { id: 'np-12', difficulty: 'Advanced',
        question: 'What is NumPy broadcasting and when does it apply?',
        options: [
          'Automatic shape expansion allowing arithmetic on arrays with compatible shapes',
          'Broadcasting data over a network socket',
          'Replicating scalar values across GPU cores',
          'Converting float64 to float32 automatically',
        ],
        correctIndex: 0,
        explanation: 'Broadcasting stretches smaller arrays along size-1 dimensions to match a larger array without copying data.',
        sourceReference: 'NumPy Broadcasting Documentation' },
      { id: 'np-13', difficulty: 'Advanced',
        question: 'What does np.einsum("ij,jk->ik", A, B) compute?',
        options: ['Matrix multiplication of A and B', 'Element-wise product', 'Outer product', 'Kronecker product'],
        correctIndex: 0,
        explanation: 'Einstein summation "ij,jk->ik" contracts the shared j index — equivalent to A @ B (matrix multiply).',
        sourceReference: 'NumPy Einstein Summation Guide' },
      { id: 'np-14', difficulty: 'Advanced',
        question: 'Which NumPy function computes the eigenvalues and eigenvectors of a square matrix?',
        options: ['np.linalg.eig()', 'np.linalg.det()', 'np.linalg.svd()', 'np.linalg.norm()'],
        correctIndex: 0,
        explanation: 'np.linalg.eig(A) returns (eigenvalues, eigenvectors). SVD factorises into U Σ Vᵀ instead.',
        sourceReference: 'NumPy Linear Algebra Module' },
      { id: 'np-15', difficulty: 'Advanced',
        question: 'What is the difference between np.copy() and a view (slice) in NumPy?',
        options: [
          'A copy owns its data; a view shares memory with the original array',
          'A copy is faster; a view is slower',
          'Views own their own memory; copies share',
          'There is no difference in NumPy 2.x',
        ],
        correctIndex: 0,
        explanation: 'Modifying a view modifies the original; a copy is independent. Use arr.base is None to check ownership.',
        sourceReference: 'NumPy Memory Layout & Views Documentation' },
    ];

    // ── MATPLOTLIB / VISUALISATION ────────────────────────────────────────────
    const matplotPool: GeminiQuizQuestion[] = [
      { id: 'plt-1', difficulty: 'Beginner',
        question: 'Which function draws a basic line plot in Matplotlib?',
        options: ['plt.plot(x, y)', 'plt.draw(x, y)', 'plt.line(x, y)', 'plt.render(x, y)'],
        correctIndex: 0,
        explanation: 'plt.plot() is the primary Matplotlib function for 2-D line and scatter charts.',
        sourceReference: 'Matplotlib Pyplot Tutorial' },
      { id: 'plt-2', difficulty: 'Beginner',
        question: 'How do you add a title to a Matplotlib figure?',
        options: ['plt.title("Title")', 'plt.header("Title")', 'plt.label("Title")', 'plt.caption("Title")'],
        correctIndex: 0,
        explanation: 'plt.title() sets the axes title; fig.suptitle() sets a figure-level super-title.',
        sourceReference: 'Matplotlib Axes API' },
      { id: 'plt-3', difficulty: 'Beginner',
        question: 'Which call saves the current Matplotlib figure to a file?',
        options: ['plt.savefig("file.png")', 'plt.export("file.png")', 'plt.write("file.png")', 'plt.render("file.png")'],
        correctIndex: 0,
        explanation: 'plt.savefig() supports PNG, PDF, SVG and more via the format argument.',
        sourceReference: 'Matplotlib Figure Saving Guide' },
      { id: 'plt-4', difficulty: 'Beginner',
        question: 'What does plt.show() do?',
        options: ['Renders and displays the current figure', 'Clears the figure', 'Saves the figure', 'Refreshes axis limits'],
        correctIndex: 0,
        explanation: 'plt.show() flushes the figure to the display backend and blocks until the window is closed.',
        sourceReference: 'Matplotlib Interactive Mode Documentation' },
      { id: 'plt-5', difficulty: 'Intermediate',
        question: 'Which Matplotlib function creates a grid of subplots returning Figure and Axes objects?',
        options: ['plt.subplots(nrows, ncols)', 'plt.figure_grid()', 'plt.make_axes()', 'plt.multiplot()'],
        correctIndex: 0,
        explanation: 'fig, axes = plt.subplots(r, c) is the standard OO interface for subplot grids.',
        sourceReference: 'Storytelling with Data & Matplotlib Documentation' },
      { id: 'plt-6', difficulty: 'Intermediate',
        question: 'For visualising a continuous statistical variable\'s distribution, which call is most appropriate?',
        options: ['plt.bar()', 'plt.hist(data, bins=30, density=True)', 'plt.pie()', 'plt.scatter_matrix()'],
        correctIndex: 1,
        explanation: 'density=True normalises so total area = 1, producing a probability density estimate.',
        sourceReference: 'Practical Statistics for Data Scientists Ch 1' },
      { id: 'plt-7', difficulty: 'Intermediate',
        question: 'How do you prevent overlapping labels across multiple subplots?',
        options: ['plt.tight_layout()', 'plt.clear_overlap()', 'plt.adjust_padding()', 'plt.autoscale(False)'],
        correctIndex: 0,
        explanation: 'tight_layout() auto-adjusts padding so tick labels and titles do not collide.',
        sourceReference: 'Python Data Science Handbook • Visualization' },
      { id: 'plt-8', difficulty: 'Intermediate',
        question: 'Which Seaborn function produces a heatmap of a correlation matrix?',
        options: ['sns.heatmap(df.corr())', 'sns.corrplot(df)', 'sns.matrix(df)', 'sns.pairplot(df)'],
        correctIndex: 0,
        explanation: 'sns.heatmap() renders a colour-encoded matrix; df.corr() computes Pearson correlations.',
        sourceReference: 'Seaborn Statistical Data Visualization' },
      { id: 'plt-9', difficulty: 'Intermediate',
        question: 'What is the purpose of plt.legend() in Matplotlib?',
        options: [
          'Displays a key mapping line colours/styles to their labels',
          'Adds a watermark',
          'Hides the axis ticks',
          'Exports chart metadata',
        ],
        correctIndex: 0,
        explanation: 'plt.legend() reads the label= kwargs passed to plot calls and renders an explanatory key.',
        sourceReference: 'Matplotlib Legend Guide' },
      { id: 'plt-10', difficulty: 'Advanced',
        question: 'In Matplotlib\'s object-oriented API, how do you set a log scale on the y-axis of an Axes object ax?',
        options: ['ax.set_yscale("log")', 'ax.log_y(True)', 'ax.yaxis.log = True', 'plt.yscale("log")'],
        correctIndex: 0,
        explanation: 'ax.set_yscale("log") changes the y-axis to logarithmic. plt.yscale() is the pyplot equivalent.',
        sourceReference: 'Matplotlib Axes API Reference' },
    ];

    // ── PANDAS ────────────────────────────────────────────────────────────────
    const pandasPool: GeminiQuizQuestion[] = [
      { id: 'pan-1', difficulty: 'Beginner',
        question: 'How do you read a CSV file into a Pandas DataFrame?',
        options: ['pd.read_csv("file.csv")', 'pd.load("file.csv")', 'pd.import_csv("file.csv")', 'pd.DataFrame.from_csv("file.csv")'],
        correctIndex: 0,
        explanation: 'pd.read_csv() is the standard Pandas function to parse CSV files into DataFrames.',
        sourceReference: 'Pandas IO Tools Documentation' },
      { id: 'pan-2', difficulty: 'Beginner',
        question: 'Which method displays the first 5 rows of a DataFrame df?',
        options: ['df.head()', 'df.top(5)', 'df.first(5)', 'df.show(5)'],
        correctIndex: 0,
        explanation: 'df.head(n) returns the first n rows (default 5).',
        sourceReference: 'Pandas DataFrame API' },
      { id: 'pan-3', difficulty: 'Beginner',
        question: 'How do you select a single column "age" from DataFrame df?',
        options: ['df["age"]', 'df.get("age")', 'df.col("age")', 'df.select("age")'],
        correctIndex: 0,
        explanation: 'df["col"] returns a Series; df[["col"]] returns a one-column DataFrame.',
        sourceReference: 'Pandas Indexing and Selecting Data' },
      { id: 'pan-4', difficulty: 'Beginner',
        question: 'What does df.shape return?',
        options: ['(rows, columns)', '(columns, rows)', 'Total element count', 'dtypes tuple'],
        correctIndex: 0,
        explanation: 'df.shape is a tuple (n_rows, n_cols), matching NumPy array convention.',
        sourceReference: 'Pandas DataFrame Attributes' },
      { id: 'pan-5', difficulty: 'Intermediate',
        question: 'How do you count missing values per column in a Pandas DataFrame df?',
        options: ['df.isnull().sum()', 'df.count_missing()', 'df.dropna(axis=1)', 'df.isna().count()'],
        correctIndex: 0,
        explanation: 'isnull() returns a boolean mask; .sum() counts True values per column.',
        sourceReference: 'Pandas User Guide • Missing Data Handling' },
      { id: 'pan-6', difficulty: 'Intermediate',
        question: 'In Pandas, which method groups rows by a column and computes aggregates?',
        options: ['df.groupby()', 'df.aggregate_by()', 'df.pivot_table()', 'df.cluster()'],
        correctIndex: 0,
        explanation: 'df.groupby("col").agg({"val": "mean"}) implements split-apply-combine.',
        sourceReference: 'Wes McKinney Python for Data Analysis • Ch 10' },
      { id: 'pan-7', difficulty: 'Intermediate',
        question: 'What does df.merge(df2, on="id", how="left") produce?',
        options: [
          'All rows from df, matched rows from df2; NaN where no match',
          'Only rows present in both DataFrames',
          'All rows from both DataFrames including duplicates',
          'Rows only in df2',
        ],
        correctIndex: 0,
        explanation: 'A left join keeps every row in the left DataFrame and fills unmatched right-side columns with NaN.',
        sourceReference: 'Pandas Merge, Join & Concatenate Guide' },
      { id: 'pan-8', difficulty: 'Intermediate',
        question: 'Which Pandas method removes duplicate rows?',
        options: ['df.drop_duplicates()', 'df.remove_dupes()', 'df.unique()', 'df.distinct()'],
        correctIndex: 0,
        explanation: 'drop_duplicates() returns a DataFrame with duplicate rows removed; keep= controls which to retain.',
        sourceReference: 'Pandas Data Cleaning Guide' },
      { id: 'pan-9', difficulty: 'Intermediate',
        question: 'How do you apply a custom function to every element of a DataFrame column?',
        options: ['series.apply(func)', 'series.map_func(func)', 'series.transform(func)', 'series.eval(func)'],
        correctIndex: 0,
        explanation: 'Series.apply() passes each element to func; DataFrame.apply() applies along rows or columns.',
        sourceReference: 'Pandas Apply vs Map Guide' },
      { id: 'pan-10', difficulty: 'Advanced',
        question: 'What is the difference between df.loc[] and df.iloc[] in Pandas?',
        options: [
          'loc uses label-based indexing; iloc uses integer position-based indexing',
          'iloc is faster; loc is slower',
          'loc uses boolean masks; iloc uses column names',
          'They are identical in Pandas 2.x',
        ],
        correctIndex: 0,
        explanation: 'df.loc[row_label, col_label] selects by name; df.iloc[row_pos, col_pos] selects by zero-based integer position.',
        sourceReference: 'Pandas Indexing and Selecting Data' },
      { id: 'pan-11', difficulty: 'Advanced',
        question: 'What does df.pivot_table(values="sales", index="region", aggfunc="sum") produce?',
        options: [
          'A table of total sales summed by region',
          'A sorted DataFrame by region',
          'A crosstab of region vs sales categories',
          'A normalised frequency table',
        ],
        correctIndex: 0,
        explanation: 'pivot_table groups data and applies aggfunc — here summing sales per region.',
        sourceReference: 'Wes McKinney Python for Data Analysis • Ch 11' },
    ];

    // ── MACHINE LEARNING ──────────────────────────────────────────────────────
    const mlPool: GeminiQuizQuestion[] = [
      { id: 'ml-1', difficulty: 'Beginner',
        question: 'What is supervised learning?',
        options: [
          'Learning from labelled input-output pairs to predict outputs for new inputs',
          'Learning without any labels or targets',
          'Reinforcement-based learning through rewards',
          'Copying patterns from a pretrained model',
        ],
        correctIndex: 0,
        explanation: 'Supervised learning uses labelled examples (X, y) to train a model that can predict y for unseen X.',
        sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 1' },
      { id: 'ml-2', difficulty: 'Beginner',
        question: 'What does train_test_split() do in Scikit-Learn?',
        options: [
          'Partitions arrays into random train and test subsets',
          'Validates model performance on training data',
          'Splits features from target labels',
          'Balances class distributions',
        ],
        correctIndex: 0,
        explanation: 'train_test_split shuffles and splits arrays/DataFrames into train/test portions for unbiased evaluation.',
        sourceReference: 'Scikit-Learn Model Selection Documentation' },
      { id: 'ml-3', difficulty: 'Beginner',
        question: 'What does a confusion matrix show?',
        options: [
          'Counts of TP, FP, FN, TN predictions for a classifier',
          'Feature correlations',
          'Loss curve over epochs',
          'Hyperparameter tuning results',
        ],
        correctIndex: 0,
        explanation: 'A confusion matrix tabulates True Positives, False Positives, False Negatives, and True Negatives.',
        sourceReference: 'An Introduction to Statistical Learning • Ch 4' },
      { id: 'ml-4', difficulty: 'Intermediate',
        question: 'Why must StandardScaler be fit ONLY on training data, then transform both sets?',
        options: [
          'To prevent data leakage from test statistics biasing model training',
          'Because test data has no standard deviation',
          'To reduce CPU time',
          'Scikit-Learn raises an error otherwise',
        ],
        correctIndex: 0,
        explanation: 'Fitting on test data exposes test distribution statistics during training — data leakage that inflates performance estimates.',
        sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 2' },
      { id: 'ml-5', difficulty: 'Intermediate',
        question: 'Which metric is best for an imbalanced classification dataset (99% negative, 1% positive)?',
        options: ['Overall Accuracy', 'Precision-Recall AUC or F1-score', 'Mean Squared Error', 'R²'],
        correctIndex: 1,
        explanation: 'A classifier always predicting negative gets 99% accuracy — PR-AUC/F1 properly measures positive class detection.',
        sourceReference: 'An Introduction to Statistical Learning (ISLR) • Ch 4' },
      { id: 'ml-6', difficulty: 'Intermediate',
        question: 'What does cross-validation address that a single train/test split does not?',
        options: [
          'High variance in performance estimates due to a single random split',
          'Overfitting to validation data automatically',
          'Feature importance ranking',
          'Hyperparameter optimisation',
        ],
        correctIndex: 0,
        explanation: 'k-fold CV rotates the test fold across all data subsets, giving a lower-variance estimate of generalisation performance.',
        sourceReference: 'Scikit-Learn Cross Validation Guide' },
      { id: 'ml-7', difficulty: 'Intermediate',
        question: 'What is regularisation in machine learning?',
        options: [
          'Adding a penalty term to the loss function to reduce model complexity and prevent overfitting',
          'Normalising input features to [0, 1]',
          'Removing duplicate training samples',
          'Balancing class labels via resampling',
        ],
        correctIndex: 0,
        explanation: 'L1 (Lasso) and L2 (Ridge) regularisation shrink coefficients, reducing overfitting by penalising large weights.',
        sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 4' },
      { id: 'ml-8', difficulty: 'Intermediate',
        question: 'What does the Random Forest algorithm do differently from a single Decision Tree?',
        options: [
          'Trains many trees on bootstrap samples and random feature subsets, averaging predictions',
          'Prunes a single deep tree to reduce variance',
          'Uses gradient boosting to correct previous errors',
          'Applies SVM kernel trick to decision boundaries',
        ],
        correctIndex: 0,
        explanation: 'Random Forests reduce variance through bagging (bootstrap + feature randomness) and ensemble averaging.',
        sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 7' },
      { id: 'ml-9', difficulty: 'Advanced',
        question: 'What is the bias-variance trade-off in machine learning?',
        options: [
          'High bias → underfitting; high variance → overfitting; optimal models balance both',
          'High bias means large coefficients; high variance means many features',
          'Bias measures training time; variance measures prediction speed',
          'They are independent and can both be minimised simultaneously',
        ],
        correctIndex: 0,
        explanation: 'Total error = Bias² + Variance + Irreducible Noise. Reducing one typically increases the other.',
        sourceReference: 'An Introduction to Statistical Learning • Ch 2' },
      { id: 'ml-10', difficulty: 'Advanced',
        question: 'What does XGBoost\'s "gradient boosting" mean?',
        options: [
          'Sequentially fitting trees to the negative gradient of the loss, correcting previous errors',
          'Averaging predictions of independently trained deep trees',
          'Applying gradient descent inside each decision node',
          'Boosting training speed via GPU gradients',
        ],
        correctIndex: 0,
        explanation: 'XGBoost fits each tree to residuals (negative gradient), then adds it with a learning-rate shrinkage to the ensemble.',
        sourceReference: 'XGBoost Documentation • Introduction to Boosted Trees' },
    ];

    // ── STATISTICS / SAMPLING ─────────────────────────────────────────────────
    const statPool: GeminiQuizQuestion[] = [
      { id: 'stat-1', difficulty: 'Beginner',
        question: 'What is the difference between a population parameter and a sample statistic?',
        options: [
          'Parameters describe the whole population (fixed); statistics are computed from sample data',
          'Statistics are always larger than parameters',
          'Parameters are estimated in Python; statistics in Excel',
          'There is no difference in modern data science',
        ],
        correctIndex: 0,
        explanation: 'μ is a population parameter; x̄ is a sample statistic that estimates μ.',
        sourceReference: 'Sampling Techniques by William G. Cochran • Ch 2' },
      { id: 'stat-2', difficulty: 'Beginner',
        question: 'What does the Central Limit Theorem (CLT) state?',
        options: [
          'Sample means approach a normal distribution as sample size grows, regardless of population shape',
          'All populations are normally distributed',
          'Larger samples always have smaller means',
          'Variance drops to zero for n > 30',
        ],
        correctIndex: 0,
        explanation: 'CLT guarantees approximate normality of x̄ when n is large and population variance is finite.',
        sourceReference: 'Practical Statistics for Data Scientists • Ch 2' },
      { id: 'stat-3', difficulty: 'Beginner',
        question: 'What is the p-value in hypothesis testing?',
        options: [
          'Probability of obtaining results at least as extreme as observed, assuming H₀ is true',
          'Probability that the null hypothesis is true',
          'Probability of Type II error',
          'Significance level α',
        ],
        correctIndex: 0,
        explanation: 'p-value < α (e.g. 0.05) leads to rejecting H₀; it does NOT measure H₀ truth probability.',
        sourceReference: 'Statistical Inference by Casella & Berger • Ch 8' },
      { id: 'stat-4', difficulty: 'Intermediate',
        question: 'Why is Neyman optimum allocation preferred over proportional allocation in stratified sampling?',
        options: [
          'It minimises variance for a fixed n by allocating more units to larger and more variable strata',
          'It gives equal sample sizes to all strata',
          'It eliminates the need for sampling weights',
          'It requires no prior stratum standard deviations',
        ],
        correctIndex: 0,
        explanation: 'Neyman allocation: nₕ ∝ Nₕσₕ. Larger, more variable strata get more samples.',
        sourceReference: 'Sampling Techniques by William G. Cochran • Ch 5' },
      { id: 'stat-5', difficulty: 'Intermediate',
        question: 'What does a 95% confidence interval (CI) mean?',
        options: [
          'If repeated many times, 95% of such CIs would contain the true parameter',
          'There is a 95% chance the parameter lies in this specific interval',
          'The sample mean is within 95% of the population mean',
          'The margin of error is 5%',
        ],
        correctIndex: 0,
        explanation: 'CI is a frequentist concept about the procedure, not the probability for a specific interval.',
        sourceReference: 'Practical Statistics for Data Scientists • Ch 3' },
      { id: 'stat-6', difficulty: 'Intermediate',
        question: 'What is the difference between Type I and Type II errors?',
        options: [
          'Type I: rejecting a true H₀ (false positive); Type II: failing to reject a false H₀ (false negative)',
          'Type I: accepting a false H₀; Type II: rejecting a true H₁',
          'Type I relates to sample size; Type II to significance level',
          'They are inverses of each other with no trade-off',
        ],
        correctIndex: 0,
        explanation: 'α = P(Type I error); β = P(Type II error); Power = 1 − β.',
        sourceReference: 'Statistical Inference by Casella & Berger • Ch 8' },
      { id: 'stat-7', difficulty: 'Advanced',
        question: 'What does the coefficient of variation (CV) measure and why is it useful?',
        options: [
          'Relative variability (SD / Mean × 100%) — useful for comparing dispersion across different scales',
          'Absolute spread around the median',
          'Correlation between two random variables',
          'Variance explained by the regression model',
        ],
        correctIndex: 0,
        explanation: 'CV = (σ/μ)×100 allows comparing variability of datasets with different units or magnitudes.',
        sourceReference: 'Statistics: Principles and Methods by Johnson & Bhattacharyya' },
      { id: 'stat-8', difficulty: 'Advanced',
        question: 'In multiple linear regression, what does multicollinearity cause?',
        options: [
          'Unstable, high-variance coefficient estimates that are hard to interpret individually',
          'Biased predictions on new data',
          'Lower R² on the training set',
          'Heteroscedasticity in residuals',
        ],
        correctIndex: 0,
        explanation: 'Multicollinearity inflates standard errors of correlated predictors, making individual coefficients unreliable.',
        sourceReference: 'Applied Regression Analysis by Draper & Smith • Ch 8' },
    ];

    // ── Assemble pool based on topic ──────────────────────────────────────────
    let combined: GeminiQuizQuestion[] = [];
    const inTopic = (...words: string[]) => words.some(w => topicLower.includes(w));

    if (inTopic('numpy', 'array', 'python', 'scipy')) combined.push(...numpyPool);
    if (inTopic('matplot', 'plot', 'visual', 'seaborn', 'chart')) combined.push(...matplotPool);
    if (inTopic('pandas', 'wrangling', 'dataframe')) combined.push(...pandasPool);
    if (inTopic('machine', 'learning', 'scikit', 'sklearn', 'model', 'classification', 'regression', 'xgboost', 'forest')) combined.push(...mlPool);
    if (inTopic('statistic', 'sampling', 'hypothesis', 'survey', 'mospi', 'inference', 'nsso', 'plfs')) combined.push(...statPool);

    // If no specific category matched, use all pools
    if (combined.length === 0) {
      combined = [...numpyPool, ...matplotPool, ...pandasPool, ...mlPool, ...statPool];
    }

    // ── Filter by difficulty first, fall back to full pool if not enough ─────
    const difficultyFiltered = combined.filter(q => q.difficulty === difficulty);
    const pool = difficultyFiltered.length >= numQuestions ? difficultyFiltered : combined;

    // ── Shuffle so questions differ every generation ──────────────────────────
    const shuffled = shuffle(pool);

    // ── If we still don't have enough, cycle through shuffled pool ───────────
    const result: GeminiQuizQuestion[] = [];
    let i = 0;
    while (result.length < numQuestions) {
      const q = shuffled[i % shuffled.length];
      result.push({ ...q, id: `${q.id}-${result.length}`, difficulty });
      i++;
    }

    return result;
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
