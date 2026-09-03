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

  enrollCourse: (courseId: string) => void;
  submitAssessmentAttempt: (assessmentId: string, userAnswers: number[], timeSpentSeconds: number) => void;
  addNewGeneratedAssessment: (newAssessment: Assessment) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('LEARNER');
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
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
      title: 'New iGOT Recommendation',
      message: 'Python Foundations for Statistical Analysis recommended based on NSSO microdata requirement.',
      time: '10 mins ago',
      type: 'recommendation',
      read: false,
      linkView: 'learning-path',
    },
    {
      id: 'notif-2',
      title: 'Diagnostic Ready',
      message: 'AI generated 6 questions for Survey Design & Sampling Methodology from 78th Round Manual.',
      time: '1 hour ago',
      type: 'assessment',
      read: false,
      linkView: 'assessment',
    },
    {
      id: 'notif-3',
      title: 'MoSPI Training Priority',
      message: 'Survey Division mandates DPDP Act 2023 compliance certification by Q3.',
      time: '1 day ago',
      type: 'alert',
      read: true,
      linkView: 'skill-gaps',
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

  const navigate = (view: AppView, params?: { courseId?: string; assessmentId?: string }) => {
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
    setUserRole(role);
    if (role === 'ADMIN') {
      setCurrentUser(adminUser);
      if (activeView.startsWith('admin-')) {
        // stay in admin view
      } else {
        setActiveView('admin-dashboard');
      }
    } else {
      setCurrentUser(initialUser);
      if (activeView.startsWith('admin-')) {
        setActiveView('dashboard');
      }
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
