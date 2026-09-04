import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Competency,
  SkillGapItem,
  Course,
  Assessment,
  QuizResult,
  TimelineEvent,
  Certificate,
} from '../types';
import {
  initialUser,
  adminUser,
  initialCompetencies,
  initialSkillGaps,
  allCourses,
  initialAssessments,
  initialTimelineEvents,
  initialCertificates,
} from '../data/mockData';
import { isTechnicalSoftwareSkill } from '../services/groqService';

export type AppView =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'digital-twin'
  | 'skill-gaps'
  | 'learning-path'
  | 'courses'
  | 'course-detail'
  | 'quiz-generator'
  | 'assessment'
  | 'assessment-result'
  | 'assistant'
  | 'history'
  | 'certificates'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-heatmap'
  | 'admin-training-effectiveness'
  | 'admin-predictive'
  | 'admin-training-planner';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'recommendation' | 'assessment' | 'achievement' | 'alert';
  read: boolean;
  linkView?: AppView;
}

interface AppContextType {
  currentUser: User;
  userRole: UserRole;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  navigate: (view: AppView, params?: { courseId?: string; assessmentId?: string }) => void;
  switchRole: (role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  competencies: Competency[];
  skillGaps: SkillGapItem[];
  courses: Course[];
  assessments: Assessment[];
  timelineEvents: TimelineEvent[];
  certificates: Certificate[];

  selectedCompetency: Competency | null;
  setSelectedCompetency: (comp: Competency | null) => void;

  whyRecommendedCourse: Course | null;
  setWhyRecommendedCourse: (course: Course | null) => void;

  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;

  activeAssessmentId: string | null;
  setActiveAssessmentId: (id: string | null) => void;

  lastQuizResult: QuizResult | null;

  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
  targetCareerRole: string;
  setTargetCareerRole: (role: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  loginAsStudent: (data: {
    name: string;
    college: string;
    degree: string;
    year: string;
    targetRole: string;
    email?: string;
    knownSkills?: string[];
  }) => void;
  loginAsAdmin: (passcode: string) => boolean;
  logout: () => void;

  enrollCourse: (courseId: string) => void;
  submitAssessmentAttempt: (assessmentId: string, userAnswers: number[], timeSpentSeconds: number) => void;
  addNewGeneratedAssessment: (newAssessment: Assessment) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('statintel_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('statintel_auth') !== 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('statintel_role') as UserRole;
    return savedRole === 'ADMIN' ? 'ADMIN' : 'LEARNER';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('statintel_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // ignore
      }
    }
    const savedRole = localStorage.getItem('statintel_role');
    return savedRole === 'ADMIN' ? adminUser : initialUser;
  });

  const [userSkills, setUserSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('statintel_skills');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(isTechnicalSoftwareSkill);
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('statintel_skills', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  const [targetCareerRole, setTargetCareerRole] = useState<string>(() => {
    return localStorage.getItem('statintel_target_role') || 'Data Analyst';
  });

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    const isAuth = localStorage.getItem('statintel_auth') === 'true';
    if (!isAuth) return 'landing';
    return 'dashboard';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [competencies, setCompetencies] = useState<Competency[]>(initialCompetencies);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(initialSkillGaps);
  const [courses, setCourses] = useState<Course[]>(allCourses);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimelineEvents);
  const [certificates] = useState<Certificate[]>(initialCertificates);

  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [whyRecommendedCourse, setWhyRecommendedCourse] = useState<Course | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>('crs-001');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>('asmt-001');
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'New Skill Benchmark Available',
      message: 'Python & Data Analytics Foundations benchmark updated for students.',
      time: '10 mins ago',
      type: 'recommendation',
      read: false,
      linkView: 'learning-path',
    },
    {
      id: 'notif-2',
      title: 'Diagnostic Ready',
      message: 'AI generated 5 adaptive questions for your chosen career track.',
      time: '1 hour ago',
      type: 'assessment',
      read: false,
      linkView: 'assessment',
    },
    {
      id: 'notif-3',
      title: 'Roadmap Milestone',
      message: 'Check off your skills in the Learning Path to calculate your career readiness score.',
      time: '1 day ago',
      type: 'alert',
      read: true,
      linkView: 'learning-path',
    },
  ]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Ctrl+K hotkey for spotlight search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const loginAsStudent = (data: {
    name: string;
    college: string;
    degree: string;
    year: string;
    targetRole: string;
    email?: string;
    knownSkills?: string[];
  }) => {
    const studentName = data.name?.trim() || (data.email ? data.email.split('@')[0] : 'Student Scholar');
    const studentSkills = (data.knownSkills || []).filter(isTechnicalSoftwareSkill);
    const calculatedCompetency = studentSkills.length > 0 ? Math.min(95, studentSkills.length * 15) : 40;

    const studentUser: User = {
      ...initialUser,
      id: `stu-${Date.now()}`,
      name: studentName,
      designation: `${data.degree?.trim() || 'Data Science'} Scholar`,
      department: `Department of Statistics & Analytics`,
      institution: data.college?.trim() || 'University / Institute',
      degree: data.degree?.trim() || 'Degree Program',
      academicYear: data.year || 'Undergraduate',
      targetGoal: data.targetRole || 'Data Analyst',
      cadre: `Student Roll #STU-${Math.floor(1000 + Math.random() * 9000)} • ${data.year || 'Student'}`,
      employeeId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      email: data.email?.trim() || `${studentName.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      role: 'LEARNER',
      overallCompetency: calculatedCompetency,
      roleReadiness: calculatedCompetency + 5,
    };
    setCurrentUser(studentUser);
    setUserRole('LEARNER');
    setIsAuthenticated(true);
    if (studentSkills.length > 0) {
      setUserSkills(studentSkills);
      localStorage.setItem('statintel_skills', JSON.stringify(studentSkills));
    }
    if (data.targetRole) {
      setTargetCareerRole(data.targetRole);
      localStorage.setItem('statintel_target_role', data.targetRole);
    }
    localStorage.setItem('statintel_auth', 'true');
    localStorage.setItem('statintel_user', JSON.stringify(studentUser));
    localStorage.setItem('statintel_role', 'LEARNER');
    setIsAuthModalOpen(false);
    setActiveView('dashboard');
  };

  const loginAsAdmin = (passcode: string): boolean => {
    if (passcode.trim() === 'admin2026' || passcode.trim() === 'admin123') {
      setCurrentUser(adminUser);
      setUserRole('ADMIN');
      setIsAuthenticated(true);
      localStorage.setItem('statintel_auth', 'true');
      localStorage.setItem('statintel_user', JSON.stringify(adminUser));
      localStorage.setItem('statintel_role', 'ADMIN');
      setIsAdminAuthModalOpen(false);
      setIsAuthModalOpen(false);
      setActiveView('admin-dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('statintel_auth');
    localStorage.removeItem('statintel_user');
    localStorage.removeItem('statintel_role');
    setUserRole('LEARNER');
    setCurrentUser(initialUser);
    setActiveView('landing');
    setIsAuthModalOpen(true);
  };

  const navigate = (view: AppView, params?: { courseId?: string; assessmentId?: string }) => {
    const isAuth = isAuthenticated || localStorage.getItem('statintel_auth') === 'true';
    // If not authenticated and attempting to view internal dashboard routes
    if (!isAuth && view !== 'landing' && view !== 'login') {
      setIsAuthModalOpen(true);
      return;
    }
    // If attempting to access admin route without admin role
    if (view.startsWith('admin-') && userRole !== 'ADMIN') {
      setIsAdminAuthModalOpen(true);
      return;
    }

    if (params?.courseId) {
      setActiveCourseId(params.courseId);
    }
    if (params?.assessmentId) {
      setActiveAssessmentId(params.assessmentId);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      // Require authentication
      setIsAdminAuthModalOpen(true);
      return;
    }
    // Switching back to student
    setUserRole('LEARNER');
    sessionStorage.setItem('statintel_role', 'LEARNER');
    const savedStudent = sessionStorage.getItem('statintel_user');
    if (savedStudent) {
      try {
        setCurrentUser(JSON.parse(savedStudent));
      } catch (e) {
        setCurrentUser(initialUser);
      }
    } else {
      setCurrentUser(initialUser);
    }
    if (activeView.startsWith('admin-')) {
      setActiveView('dashboard');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const enrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, status: 'In Progress', progress: c.progress || 10 }
          : c
      )
    );
    // Add notification
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Course Enrolled',
          message: `You enrolled in "${course.title}". Start module 1 now.`,
          time: 'Just now',
          type: 'achievement',
          read: false,
          linkView: 'course-detail',
        },
        ...prev,
      ]);
    }
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const isComplete = progress >= 100;
          return {
            ...c,
            progress,
            status: isComplete ? 'Completed' : 'In Progress',
          };
        }
        return c;
      })
    );
  };

  // Submit an assessment and execute the closed-loop competency intelligence feedback!
  const submitAssessmentAttempt = (
    assessmentId: string,
    userAnswers: number[],
    timeSpentSeconds: number
  ) => {
    const asmt = assessments.find((a) => a.id === assessmentId);
    if (!asmt) return;

    let correctCount = 0;
    const answerDetails = asmt.questions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect,
      };
    });

    const accuracy = Math.round((correctCount / asmt.questions.length) * 100);

    // Find the target competency to boost
    const comp = competencies.find(
      (c) => c.name === asmt.targetCompetency || c.domain === asmt.domain
    ) || competencies[0];

    const currentScore = comp.currentScore;
    // Calculate intelligent competency gain based on assessment accuracy
    const gainPoints = accuracy >= 80 ? 8 : accuracy >= 60 ? 5 : 2;
    const newScore = Math.min(100, currentScore + gainPoints);

    // Update level if threshold crossed (L1: <40, L2: 40-59, L3: 60-79, L4: 80-92, L5: 93+)
    let newLevel = comp.currentLevel;
    if (newScore >= 80 && comp.requiredScore <= 85) newLevel = 'L4';
    else if (newScore >= 60) newLevel = 'L3';

    // Update competencies state
    const updatedCompetencies = competencies.map((c) => {
      if (c.id === comp.id) {
        return {
          ...c,
          currentScore: newScore,
          currentLevel: newLevel,
          gap: newScore - c.requiredScore,
          status:
            newScore >= c.requiredScore
              ? ('Target Met' as const)
              : newScore - c.requiredScore >= -5
              ? ('Moderate Gap' as const)
              : ('Critical Gap' as const),
          evidenceSources: [
            {
              type: 'Assessment' as const,
              title: asmt.title,
              date: 'Today',
              score: `${accuracy}%`,
            },
            ...c.evidenceSources,
          ],
          historicalScores: [
            ...c.historicalScores,
            { date: 'Today', score: newScore },
          ],
        };
      }
      return c;
    });

    setCompetencies(updatedCompetencies);

    // Update Skill gaps list
    setSkillGaps((prevGaps) =>
      prevGaps.map((g) => {
        if (g.competencyName === comp.name) {
          const remainingGap = Math.max(0, g.requiredScore - newScore);
          return {
            ...g,
            currentScore: newScore,
            currentLevel: newLevel,
            gapLevels: remainingGap <= 0 ? 0 : Math.max(0, g.gapLevels - 1),
            severity: remainingGap <= 0 ? 'Low' : remainingGap <= 8 ? 'Medium' : 'Critical',
          };
        }
        return g;
      })
    );

    // Update Current User KPIs
    const newOverall = Math.round(
      updatedCompetencies.reduce((acc, c) => acc + c.currentScore, 0) /
        updatedCompetencies.length
    );
    const criticalCount = updatedCompetencies.filter((c) => c.status === 'Critical Gap').length;
    const newReadiness = Math.min(98, currentUser.roleReadiness + Math.round(gainPoints / 2));

    setCurrentUser((prev) => ({
      ...prev,
      overallCompetency: newOverall,
      roleReadiness: newReadiness,
      criticalGapsCount: criticalCount,
      assessmentAverage: Math.round((prev.assessmentAverage + accuracy) / 2),
      learningHours: prev.learningHours + Math.round(timeSpentSeconds / 3600) + 1,
    }));

    // Record Result
    const resultObj: QuizResult = {
      assessmentId: asmt.id,
      assessmentTitle: asmt.title,
      targetCompetency: comp.name,
      score: correctCount,
      total: asmt.questions.length,
      accuracy,
      timeSpentSeconds,
      competencyBefore: currentScore,
      competencyAfter: newScore,
      competencyGain: gainPoints,
      answers: answerDetails,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLastQuizResult(resultObj);

    // Record Timeline event
    const newEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date: 'Today',
      type: 'competency_upgraded',
      title: `Assessment Completed: ${asmt.title}`,
      description: `Scored ${accuracy}% (${correctCount}/${asmt.questions.length}). Competency "${comp.name}" improved from ${currentScore}% to ${newScore}%.`,
      badge: 'Competency Boost',
      competencyAffected: comp.name,
      levelChange: `${currentScore}% → ${newScore}% (+${gainPoints}%)`,
    };

    setTimelineEvents((prev) => [newEvent, ...prev]);

    // Send Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Competency Score Upgraded!',
        message: `${comp.name} improved by +${gainPoints}% to ${newScore}%. Role readiness increased to ${newReadiness}%.`,
        time: 'Just now',
        type: 'achievement',
        read: false,
        linkView: 'digital-twin',
      },
      ...prev,
    ]);

    // Navigate to Results page
    setActiveView('assessment-result');
  };

  const addNewGeneratedAssessment = (newAssessment: Assessment) => {
    setAssessments((prev) => [newAssessment, ...prev]);
    setActiveAssessmentId(newAssessment.id);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New AI Assessment Generated',
        message: `Successfully created "${newAssessment.title}" with ${newAssessment.totalQuestions} validated questions.`,
        time: 'Just now',
        type: 'assessment',
        read: false,
        linkView: 'assessment',
      },
      ...prev,
    ]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        activeView,
        setActiveView,
        navigate,
        switchRole,
        isDarkMode,
        toggleDarkMode,
        competencies,
        skillGaps,
        courses,
        assessments,
        timelineEvents,
        certificates,
        selectedCompetency,
        setSelectedCompetency,
        whyRecommendedCourse,
        setWhyRecommendedCourse,
        activeCourseId,
        setActiveCourseId,
        activeAssessmentId,
        setActiveAssessmentId,
        lastQuizResult,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        searchOpen,
        setSearchOpen,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        userSkills,
        setUserSkills,
        targetCareerRole,
        setTargetCareerRole,
        geminiApiKey,
        setGeminiApiKey,
        loginAsStudent,
        loginAsAdmin,
        logout,
        enrollCourse,
        submitAssessmentAttempt,
        addNewGeneratedAssessment,
        updateCourseProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
