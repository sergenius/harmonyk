import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n();

// English translations
const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    continue: 'Continue',
    skip: 'Skip',
    next: 'Next',
    previous: 'Previous',
    done: 'Done',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    required: 'Required',
    optional: 'Optional',
  },

  // Landing Page
  landing: {
    title: 'Transform Your Mind,\nTrack Your Progress',
    subtitle: 'The ultimate balance tracking app for practitioners and individuals seeking personal transformation.',
    getStarted: 'Get Started Free',
    signIn: 'Sign In',
    takeTour: 'Take a Tour',
    sessionsTracked: 'Sessions Tracked',
    successRate: 'Success Rate',
    happyUsers: 'Happy Users',
    whyChoose: 'Why Choose HarmonyK?',
    whyChooseSubtitle: 'Discover the features that make balance tracking effortless and insightful',
    howItWorks: 'How It Works',
    whatUsersSay: 'What Our Users Say',
    readyToTransform: 'Ready to Transform Your Life?',
    readySubtitle: 'Join thousands of users who are already tracking their progress',
    startJourney: 'Start Your Journey',
    madeWithLove: 'Made with ❤️ for the balance tracking community',
    features: {
      balanceTracking: {
        title: 'Balance Session Tracking',
        description: 'Log and monitor your balance sessions with detailed insights and progress tracking.',
      },
      stressReduction: {
        title: 'Stress Reduction',
        description: 'Track stress levels before and after sessions to measure your transformation.',
      },
      goalAchievement: {
        title: 'Goal Achievement',
        description: 'Set and achieve your personal development goals with guided tracking.',
      },
      privateSecure: {
        title: 'Private & Secure',
        description: 'Your data is protected with enterprise-level security and privacy.',
      },
    },
    steps: {
      createAccount: {
        title: 'Create Your Account',
        description: 'Sign up in seconds and set up your personal profile',
      },
      logSessions: {
        title: 'Log Your Sessions',
        description: 'Record balance sessions with detailed information and outcomes',
      },
      trackProgress: {
        title: 'Track Progress',
        description: 'Monitor your transformation with insights and analytics',
      },
    },
  },

  // Onboarding
  onboarding: {
    progressOf: 'of',
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',
    screens: {
      welcome: {
        title: 'Welcome to HarmonyK',
        subtitle: 'Your Balance Journey Begins',
        description: 'Track your balance sessions, monitor progress, and transform your life with our comprehensive balance tracking system.',
      },
      trackWellness: {
        title: 'Track Your Wellness',
        subtitle: 'Monitor Stress & Progress',
        description: 'Log stress levels before and after sessions to see your transformation in real-time with detailed analytics.',
      },
      achieveGoals: {
        title: 'Achieve Your Goals',
        subtitle: 'Personalized Insights',
        description: 'Set meaningful goals and receive personalized insights to help you achieve lasting positive change.',
      },
      visualizeGrowth: {
        title: 'Visualize Growth',
        subtitle: 'Powerful Analytics',
        description: 'See your progress with beautiful charts and detailed statistics that motivate continued growth.',
      },
      privateSecure: {
        title: 'Private & Secure',
        subtitle: 'Your Data is Protected',
        description: 'Enterprise-level security ensures your personal journey remains private and secure at all times.',
      },
    },
  },

  // Authentication
  auth: {
    welcomeBack: 'Welcome Back',
    signInSubtitle: 'Sign in to continue your journey',
    createAccount: 'Create Account',
    signUpSubtitle: 'Start your balance tracking journey',
    resetPassword: 'Reset Password',
    resetSubtitle: 'Enter your email address and we\'ll send you a link to reset your password',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    forgotPassword: 'Forgot your password?',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    checkEmail: 'Check Your Email',
    emailSent: 'We sent you a confirmation email. Please check your inbox and click the link to verify your account.',
    resetEmailSent: 'We\'ve sent a password reset link to {email}. Please check your inbox and follow the instructions.',
    rememberPassword: 'Remember your password?',
    errors: {
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      passwordRequired: 'Password is required',
      passwordTooShort: 'Password must be at least 6 characters',
      fullNameRequired: 'Full name is required',
      confirmPasswordRequired: 'Please confirm your password',
      passwordsMismatch: 'Passwords do not match',
      invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
      emailNotConfirmed: 'Please check your email and click the confirmation link before signing in.',
      tooManyRequests: 'Too many login attempts. Please wait a moment and try again.',
      networkError: 'Network error. Please check your connection and try again.',
      userExists: 'An account with this email already exists. Please try signing in instead.',
    },
  },

  // Profile
  profile: {
    title: 'Profile',
    subtitle: 'Manage your account settings',
    email: 'Email',
    memberSince: 'Member Since',
    fullName: 'Full name',
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile updated successfully',
    signOutConfirm: 'Are you sure you want to sign out?',
    personalInfo: 'Personal Information',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    phone: 'Phone Number',
    personalInfo: 'Personal Information',
    practitionerInfo: 'Practitioner Information',
    certification: 'Certification Level',
    experience: 'Years of Experience',
    specialization: 'Specialization Areas',
    location: 'Location',
    website: 'Website',
    bio: 'Bio',
    goals: 'Personal Goals',
    primaryGoal: 'Primary Goal',
    secondaryGoals: 'Secondary Goals',
    motivations: 'What motivates you?',
    certificationLevels: {
      student: 'Student',
      basic: 'Basic Facilitator',
      advanced: 'Advanced Facilitator',
      instructor: 'Instructor',
      other: 'Other',
    },
    specializations: {
      relationships: 'Relationships',
      health: 'Health & Wellness',
      abundance: 'Abundance & Prosperity',
      spirituality: 'Spirituality',
      performance: 'Performance',
      stress: 'Stress Management',
      other: 'Other',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back!',
    totalSessions: 'Total Sessions',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    avgStressReduction: 'Avg. Stress Reduction',
    completedSessions: 'Completed',
    activeSessions: 'Active',
    followUpNeeded: 'Follow-up Needed',
    recentActivity: 'Recent Activity',
    viewAll: 'View All',
    noRecentActivity: 'No recent activity. Start by creating your first balance session!',
    createFirstBalance: 'Create Your First Balance',
    testConnection: 'Test Database Connection',
    connectionSuccess: 'Connection successful! Database is working properly.',
    connectionError: 'Connection failed. Please check your internet connection.',
  },

  // Balance/Sessions
  balance: {
    createBalance: 'Create Balance',
    editBalance: 'Edit Balance',
    beliefStatement: 'Belief Statement',
    balanceType: 'Balance Type',
    muscleTestResult: 'Muscle Test Result',
    stressBefore: 'Stress Before (1-10)',
    stressAfter: 'Stress After (1-10)',
    sessionStatus: 'Session Status',
    integrationStatus: 'Integration Status',
    outcomeNotes: 'Outcome Notes',
    history: 'History',
    searchSessions: 'Search sessions...',
    filterByStatus: 'Filter by Status',
    filterByType: 'Filter by Type',
    deleteBalance: 'Delete Balance',
    confirmDelete: 'Are you sure you want to delete this balance session?',
    muscleTestResults: {
      strong: 'Strong',
      weak: 'Weak',
      neutral: 'Neutral',
    },
    sessionStatuses: {
      active: 'Active',
      completed: 'Completed',
      followUpNeeded: 'Follow-up Needed',
    },
    integrationStatuses: {
      inProgress: 'In Progress',
      complete: 'Complete',
      needsFollowUp: 'Needs Follow-up',
    },
    balanceTypes: {
      movementBased: 'Movement-Based',
      postureBased: 'Posture-Based',
      wholeBrain: 'Whole-Brain',
      stressTrans: 'Stress-Trans',
      beliefIntegr: 'Belief-Integr',
    },
  },

  // Language Selection
  language: {
    selectLanguage: 'Select Language',
    choosePreferred: 'Choose your preferred language',
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    apply: 'Apply',
  },
};

// Spanish translations
const es = {
  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    continue: 'Continuar',
    skip: 'Omitir',
    next: 'Siguiente',
    previous: 'Anterior',
    done: 'Hecho',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    close: 'Cerrar',
    back: 'Atrás',
    required: 'Obligatorio',
    optional: 'Opcional',
  },

  // Landing Page
  landing: {
    title: 'Transforma Tu Mente,\nSigue Tu Progreso',
    subtitle: 'La aplicación definitiva de seguimiento de equilibrio para profesionales e individuos que buscan transformación personal.',
    getStarted: 'Comenzar Gratis',
    signIn: 'Iniciar Sesión',
    takeTour: 'Hacer el Tour',
    sessionsTracked: 'Sesiones Registradas',
    successRate: 'Tasa de Éxito',
    happyUsers: 'Usuarios Satisfechos',
    whyChoose: '¿Por Qué Elegir HarmonyK?',
    whyChooseSubtitle: 'Descubre las características que hacen que el seguimiento de equilibrio sea fácil y perspicaz',
    howItWorks: 'Cómo Funciona',
    whatUsersSay: 'Lo Que Dicen Nuestros Usuarios',
    readyToTransform: '¿Listo Para Transformar Tu Vida?',
    readySubtitle: 'Únete a miles de usuarios que ya están siguiendo su progreso',
    startJourney: 'Comienza Tu Viaje',
    madeWithLove: 'Hecho con ❤️ para la comunidad de seguimiento de equilibrio',
    features: {
      balanceTracking: {
        title: 'Seguimiento de Sesiones de Equilibrio',
        description: 'Registra y monitorea tus sesiones de equilibrio con información detallada y seguimiento de progreso.',
      },
      stressReduction: {
        title: 'Reducción del Estrés',
        description: 'Rastrea los niveles de estrés antes y después de las sesiones para medir tu transformación.',
      },
      goalAchievement: {
        title: 'Logro de Objetivos',
        description: 'Establece y alcanza tus objetivos de desarrollo personal con seguimiento guiado.',
      },
      privateSecure: {
        title: 'Privado y Seguro',
        description: 'Tus datos están protegidos con seguridad y privacidad de nivel empresarial.',
      },
    },
    steps: {
      createAccount: {
        title: 'Crea Tu Cuenta',
        description: 'Regístrate en segundos y configura tu perfil personal',
      },
      logSessions: {
        title: 'Registra Tus Sesiones',
        description: 'Registra sesiones de equilibrio con información detallada y resultados',
      },
      trackProgress: {
        title: 'Sigue Tu Progreso',
        description: 'Monitorea tu transformación con perspectivas y análisis',
      },
    },
  },

  // Onboarding
  onboarding: {
    progressOf: 'de',
    skip: 'Omitir',
    next: 'Siguiente',
    getStarted: 'Comenzar',
    screens: {
      welcome: {
        title: 'Bienvenido a HarmonyK',
        subtitle: 'Tu Viaje de Equilibrio Comienza',
        description: 'Rastrea tus sesiones de equilibrio, monitorea el progreso y transforma tu vida con nuestro sistema integral de seguimiento.',
      },
      trackWellness: {
        title: 'Rastrea Tu Bienestar',
        subtitle: 'Monitorea Estrés y Progreso',
        description: 'Registra los niveles de estrés antes y después de las sesiones para ver tu transformación en tiempo real con análisis detallados.',
      },
      achieveGoals: {
        title: 'Alcanza Tus Objetivos',
        subtitle: 'Perspectivas Personalizadas',
        description: 'Establece objetivos significativos y recibe perspectivas personalizadas para ayudarte a lograr un cambio positivo duradero.',
      },
      visualizeGrowth: {
        title: 'Visualiza el Crecimiento',
        subtitle: 'Análisis Poderosos',
        description: 'Ve tu progreso con gráficos hermosos y estadísticas detalladas que motivan el crecimiento continuo.',
      },
      privateSecure: {
        title: 'Privado y Seguro',
        subtitle: 'Tus Datos Están Protegidos',
        description: 'La seguridad de nivel empresarial asegura que tu viaje personal permanezca privado y seguro en todo momento.',
      },
    },
  },

  // Authentication
  auth: {
    welcomeBack: 'Bienvenido de Vuelta',
    signInSubtitle: 'Inicia sesión para continuar tu viaje',
    createAccount: 'Crear Cuenta',
    signUpSubtitle: 'Comienza tu viaje de seguimiento de equilibrio',
    resetPassword: 'Restablecer Contraseña',
    resetSubtitle: 'Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña',
    email: 'Dirección de correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    fullName: 'Nombre completo',
    forgotPassword: '¿Olvidaste tu contraseña?',
    dontHaveAccount: '¿No tienes una cuenta?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    sendResetLink: 'Enviar Enlace de Restablecimiento',
    backToLogin: 'Volver al Inicio de Sesión',
    checkEmail: 'Revisa Tu Correo Electrónico',
    emailSent: 'Te enviamos un correo de confirmación. Por favor revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.',
    resetEmailSent: 'Hemos enviado un enlace de restablecimiento de contraseña a {email}. Por favor revisa tu bandeja de entrada y sigue las instrucciones.',
    rememberPassword: '¿Recuerdas tu contraseña?',
    errors: {
      emailRequired: 'El correo electrónico es obligatorio',
      emailInvalid: 'Por favor ingresa un correo electrónico válido',
      passwordRequired: 'La contraseña es obligatoria',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      fullNameRequired: 'El nombre completo es obligatorio',
      confirmPasswordRequired: 'Por favor confirma tu contraseña',
      passwordsMismatch: 'Las contraseñas no coinciden',
      invalidCredentials: 'Correo electrónico o contraseña inválidos. Por favor verifica tus credenciales e intenta de nuevo.',
      emailNotConfirmed: 'Por favor revisa tu correo electrónico y haz clic en el enlace de confirmación antes de iniciar sesión.',
      tooManyRequests: 'Demasiados intentos de inicio de sesión. Por favor espera un momento e intenta de nuevo.',
      networkError: 'Error de red. Por favor verifica tu conexión e intenta de nuevo.',
      userExists: 'Ya existe una cuenta con este correo electrónico. Por favor intenta iniciar sesión en su lugar.',
    },
  },

  // Profile
  profile: {
    title: 'Perfil',
    subtitle: 'Administra la configuración de tu cuenta',
    email: 'Correo electrónico',
    memberSince: 'Miembro Desde',
    fullName: 'Nombre completo',
    updateProfile: 'Actualizar Perfil',
    profileUpdated: 'Perfil actualizado exitosamente',
    signOutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
    personalInfo: 'Información Personal',
    preferences: 'Preferencias',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
    phone: 'Número de Teléfono',
    personalInfo: 'Información Personal',
    practitionerInfo: 'Información del Profesional',
    certification: 'Nivel de Certificación',
    experience: 'Años de Experiencia',
    specialization: 'Áreas de Especialización',
    location: 'Ubicación',
    website: 'Sitio Web',
    bio: 'Biografía',
    goals: 'Objetivos Personales',
    primaryGoal: 'Objetivo Principal',
    secondaryGoals: 'Objetivos Secundarios',
    motivations: '¿Qué te motiva?',
    certificationLevels: {
      student: 'Estudiante',
      basic: 'Facilitador Básico',
      advanced: 'Facilitador Avanzado',
      instructor: 'Instructor',
      other: 'Otro',
    },
    specializations: {
      relationships: 'Relaciones',
      health: 'Salud y Bienestar',
      abundance: 'Abundancia y Prosperidad',
      spirituality: 'Espiritualidad',
      performance: 'Rendimiento',
      stress: 'Manejo del Estrés',
      other: 'Otro',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Panel de Control',
    welcome: '¡Bienvenido de vuelta!',
    totalSessions: 'Sesiones Totales',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    avgStressReduction: 'Reducción Promedio de Estrés',
    completedSessions: 'Completadas',
    activeSessions: 'Activas',
    followUpNeeded: 'Requieren Seguimiento',
    recentActivity: 'Actividad Reciente',
    viewAll: 'Ver Todo',
    noRecentActivity: 'No hay actividad reciente. ¡Comienza creando tu primera sesión de equilibrio!',
    createFirstBalance: 'Crea Tu Primer Equilibrio',
    testConnection: 'Probar Conexión de Base de Datos',
    connectionSuccess: '¡Conexión exitosa! La base de datos funciona correctamente.',
    connectionError: 'Conexión fallida. Por favor verifica tu conexión a internet.',
  },

  // Balance/Sessions
  balance: {
    createBalance: 'Crear Equilibrio',
    editBalance: 'Editar Equilibrio',
    beliefStatement: 'Declaración de Creencia',
    balanceType: 'Tipo de Equilibrio',
    muscleTestResult: 'Resultado de Prueba Muscular',
    stressBefore: 'Estrés Antes (1-10)',
    stressAfter: 'Estrés Después (1-10)',
    sessionStatus: 'Estado de Sesión',
    integrationStatus: 'Estado de Integración',
    outcomeNotes: 'Notas de Resultado',
    history: 'Historial',
    searchSessions: 'Buscar sesiones...',
    filterByStatus: 'Filtrar por Estado',
    filterByType: 'Filtrar por Tipo',
    deleteBalance: 'Eliminar Equilibrio',
    confirmDelete: '¿Estás seguro de que quieres eliminar esta sesión de equilibrio?',
    muscleTestResults: {
      strong: 'Fuerte',
      weak: 'Débil',
      neutral: 'Neutral',
    },
    sessionStatuses: {
      active: 'Activa',
      completed: 'Completada',
      followUpNeeded: 'Requiere Seguimiento',
    },
    integrationStatuses: {
      inProgress: 'En Progreso',
      complete: 'Completa',
      needsFollowUp: 'Necesita Seguimiento',
    },
    balanceTypes: {
      movementBased: 'Basado en Movimiento',
      postureBased: 'Basado en Postura',
      wholeBrain: 'Cerebro Completo',
      stressTrans: 'Trans-Estrés',
      beliefIntegr: 'Integr-Creencia',
    },
  },

  // Language Selection
  language: {
    selectLanguage: 'Seleccionar Idioma',
    choosePreferred: 'Elige tu idioma preferido',
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    apply: 'Aplicar',
  },
};

// Portuguese translations
const pt = {
  // Common
  common: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    continue: 'Continuar',
    skip: 'Pular',
    next: 'Próximo',
    previous: 'Anterior',
    done: 'Pronto',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não',
    ok: 'OK',
    close: 'Fechar',
    back: 'Voltar',
    required: 'Obrigatório',
    optional: 'Opcional',
  },

  // Landing Page
  landing: {
    title: 'Transforme Sua Mente,\nAcompanhe Seu Progresso',
    subtitle: 'O aplicativo definitivo de rastreamento de equilíbrio para profissionais e indivíduos em busca de transformação pessoal.',
    getStarted: 'Começar Grátis',
    signIn: 'Entrar',
    takeTour: 'Fazer o Tour',
    sessionsTracked: 'Sessões Rastreadas',
    successRate: 'Taxa de Sucesso',
    happyUsers: 'Usuários Satisfeitos',
    whyChoose: 'Por Que Escolher HarmonyK?',
    whyChooseSubtitle: 'Descubra os recursos que tornam o rastreamento de equilíbrio fácil e perspicaz',
    howItWorks: 'Como Funciona',
    whatUsersSay: 'O Que Nossos Usuários Dizem',
    readyToTransform: 'Pronto Para Transformar Sua Vida?',
    readySubtitle: 'Junte-se a milhares de usuários que já estão acompanhando seu progresso',
    startJourney: 'Comece Sua Jornada',
    madeWithLove: 'Feito com ❤️ para a comunidade de rastreamento de equilíbrio',
    features: {
      balanceTracking: {
        title: 'Rastreamento de Sessões de Equilíbrio',
        description: 'Registre e monitore suas sessões de equilíbrio com insights detalhados e acompanhamento de progresso.',
      },
      stressReduction: {
        title: 'Redução do Estresse',
        description: 'Rastreie os níveis de estresse antes e depois das sessões para medir sua transformação.',
      },
      goalAchievement: {
        title: 'Conquista de Objetivos',
        description: 'Defina e alcance seus objetivos de desenvolvimento pessoal com acompanhamento guiado.',
      },
      privateSecure: {
        title: 'Privado e Seguro',
        description: 'Seus dados são protegidos com segurança e privacidade de nível empresarial.',
      },
    },
    steps: {
      createAccount: {
        title: 'Crie Sua Conta',
        description: 'Cadastre-se em segundos e configure seu perfil pessoal',
      },
      logSessions: {
        title: 'Registre Suas Sessões',
        description: 'Registre sessões de equilíbrio com informações detalhadas e resultados',
      },
      trackProgress: {
        title: 'Acompanhe o Progresso',
        description: 'Monitore sua transformação com insights e análises',
      },
    },
  },

  // Onboarding
  onboarding: {
    progressOf: 'de',
    skip: 'Pular',
    next: 'Próximo',
    getStarted: 'Começar',
    screens: {
      welcome: {
        title: 'Bem-vindo ao HarmonyK',
        subtitle: 'Sua Jornada de Equilíbrio Começa',
        description: 'Rastreie suas sessões de equilíbrio, monitore o progresso e transforme sua vida com nosso sistema abrangente de acompanhamento.',
      },
      trackWellness: {
        title: 'Acompanhe Seu Bem-estar',
        subtitle: 'Monitore Estresse e Progresso',
        description: 'Registre os níveis de estresse antes e depois das sessões para ver sua transformação em tempo real com análises detalhadas.',
      },
      achieveGoals: {
        title: 'Alcance Seus Objetivos',
        subtitle: 'Insights Personalizados',
        description: 'Defina metas significativas e receba insights personalizados para ajudá-lo a alcançar mudanças positivas duradouras.',
      },
      visualizeGrowth: {
        title: 'Visualize o Crescimento',
        subtitle: 'Análises Poderosas',
        description: 'Veja seu progresso com gráficos bonitos e estatísticas detalhadas que motivam o crescimento contínuo.',
      },
      privateSecure: {
        title: 'Privado e Seguro',
        subtitle: 'Seus Dados Estão Protegidos',
        description: 'A segurança de nível empresarial garante que sua jornada pessoal permaneça privada e segura o tempo todo.',
      },
    },
  },

  // Authentication
  auth: {
    welcomeBack: 'Bem-vindo de Volta',
    signInSubtitle: 'Entre para continuar sua jornada',
    createAccount: 'Criar Conta',
    signUpSubtitle: 'Comece sua jornada de rastreamento de equilíbrio',
    resetPassword: 'Redefinir Senha',
    resetSubtitle: 'Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha',
    email: 'Endereço de e-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    fullName: 'Nome completo',
    forgotPassword: 'Esqueceu sua senha?',
    dontHaveAccount: 'Não tem uma conta?',
    alreadyHaveAccount: 'Já tem uma conta?',
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    signOut: 'Sair',
    sendResetLink: 'Enviar Link de Redefinição',
    backToLogin: 'Voltar ao Login',
    checkEmail: 'Verifique Seu E-mail',
    emailSent: 'Enviamos um e-mail de confirmação. Por favor, verifique sua caixa de entrada e clique no link para verificar sua conta.',
    resetEmailSent: 'Enviamos um link de redefinição de senha para {email}. Por favor, verifique sua caixa de entrada e siga as instruções.',
    rememberPassword: 'Lembra sua senha?',
    errors: {
      emailRequired: 'E-mail é obrigatório',
      emailInvalid: 'Por favor, digite um e-mail válido',
      passwordRequired: 'Senha é obrigatória',
      passwordTooShort: 'A senha deve ter pelo menos 6 caracteres',
      fullNameRequired: 'Nome completo é obrigatório',
      confirmPasswordRequired: 'Por favor, confirme sua senha',
      passwordsMismatch: 'As senhas não coincidem',
      invalidCredentials: 'E-mail ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.',
      emailNotConfirmed: 'Por favor, verifique seu e-mail e clique no link de confirmação antes de fazer login.',
      tooManyRequests: 'Muitas tentativas de login. Por favor, aguarde um momento e tente novamente.',
      networkError: 'Erro de rede. Por favor, verifique sua conexão e tente novamente.',
      userExists: 'Já existe uma conta com este e-mail. Por favor, tente fazer login em vez disso.',
    },
  },

  // Profile
  profile: {
    title: 'Perfil',
    subtitle: 'Gerencie as configurações da sua conta',
    email: 'E-mail',
    memberSince: 'Membro Desde',
    fullName: 'Nome completo',
    updateProfile: 'Atualizar Perfil',
    profileUpdated: 'Perfil atualizado com sucesso',
    signOutConfirm: 'Tem certeza de que deseja sair?',
    personalInfo: 'Informações Pessoais',
    preferences: 'Preferências',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificações',
    phone: 'Número de Telefone',
    personalInfo: 'Informações Pessoais',
    practitionerInfo: 'Informações do Profissional',
    certification: 'Nível de Certificação',
    experience: 'Anos de Experiência',
    specialization: 'Áreas de Especialização',
    location: 'Localização',
    website: 'Site',
    bio: 'Biografia',
    goals: 'Objetivos Pessoais',
    primaryGoal: 'Objetivo Principal',
    secondaryGoals: 'Objetivos Secundários',
    motivations: 'O que te motiva?',
    certificationLevels: {
      student: 'Estudante',
      basic: 'Facilitador Básico',
      advanced: 'Facilitador Avançado',
      instructor: 'Instrutor',
      other: 'Outro',
    },
    specializations: {
      relationships: 'Relacionamentos',
      health: 'Saúde e Bem-estar',
      abundance: 'Abundância e Prosperidade',
      spirituality: 'Espiritualidade',
      performance: 'Performance',
      stress: 'Gerenciamento de Estresse',
      other: 'Outro',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Painel',
    welcome: 'Bem-vindo de volta!',
    totalSessions: 'Sessões Totais',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mês',
    avgStressReduction: 'Redução Média de Estresse',
    completedSessions: 'Concluídas',
    activeSessions: 'Ativas',
    followUpNeeded: 'Precisam de Acompanhamento',
    recentActivity: 'Atividade Recente',
    viewAll: 'Ver Tudo',
    noRecentActivity: 'Nenhuma atividade recente. Comece criando sua primeira sessão de equilíbrio!',
    createFirstBalance: 'Crie Seu Primeiro Equilíbrio',
    testConnection: 'Testar Conexão do Banco de Dados',
    connectionSuccess: 'Conexão bem-sucedida! O banco de dados está funcionando corretamente.',
    connectionError: 'Conexão falhou. Por favor, verifique sua conexão com a internet.',
  },

  // Balance/Sessions
  balance: {
    createBalance: 'Criar Equilíbrio',
    editBalance: 'Editar Equilíbrio',
    beliefStatement: 'Declaração de Crença',
    balanceType: 'Tipo de Equilíbrio',
    muscleTestResult: 'Resultado do Teste Muscular',
    stressBefore: 'Estresse Antes (1-10)',
    stressAfter: 'Estresse Depois (1-10)',
    sessionStatus: 'Status da Sessão',
    integrationStatus: 'Status de Integração',
    outcomeNotes: 'Notas de Resultado',
    history: 'Histórico',
    searchSessions: 'Pesquisar sessões...',
    filterByStatus: 'Filtrar por Status',
    filterByType: 'Filtrar por Tipo',
    deleteBalance: 'Excluir Equilíbrio',
    confirmDelete: 'Tem certeza de que deseja excluir esta sessão de equilíbrio?',
    muscleTestResults: {
      strong: 'Forte',
      weak: 'Fraco',
      neutral: 'Neutro',
    },
    sessionStatuses: {
      active: 'Ativa',
      completed: 'Concluída',
      followUpNeeded: 'Precisa de Acompanhamento',
    },
    integrationStatuses: {
      inProgress: 'Em Progresso',
      complete: 'Completa',
      needsFollowUp: 'Precisa de Acompanhamento',
    },
    balanceTypes: {
      movementBased: 'Baseado em Movimento',
      postureBased: 'Baseado em Postura',
      wholeBrain: 'Cérebro Inteiro',
      stressTrans: 'Trans-Estresse',
      beliefIntegr: 'Integr-Crença',
    },
  },

  // Language Selection
  language: {
    selectLanguage: 'Selecionar Idioma',
    choosePreferred: 'Escolha seu idioma preferido',
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    apply: 'Aplicar',
  },
};

// Set the translations
i18n.translations = { en, es, pt };

// Set the default locale
i18n.defaultLocale = 'en';

// Get the device locale
const getDeviceLocale = () => {
  const locale = Localization.locale;
  const languageCode = locale.split('-')[0]; // Get just the language code (e.g., 'en' from 'en-US')
  
  // Map common language codes to our supported languages
  if (languageCode === 'es') return 'es';
  if (languageCode === 'pt') return 'pt';
  return 'en'; // Default to English
};

// Initialize the locale
const initializeLocale = async () => {
  try {
    // Try to get saved locale from storage
    const savedLocale = await AsyncStorage.getItem('user_locale');
    if (savedLocale && ['en', 'es', 'pt'].includes(savedLocale)) {
      i18n.locale = savedLocale;
    } else {
      // Fall back to device locale
      i18n.locale = getDeviceLocale();
    }
  } catch (error) {
    console.error('Error initializing locale:', error);
    i18n.locale = 'en'; // Fallback to English
  }
};

// Change language function
export const changeLanguage = async (locale: string) => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem('user_locale', locale);
  } catch (error) {
    console.error('Error saving locale:', error);
  }
};

// Get current language
export const getCurrentLanguage = () => i18n.locale;

// Translation function
export const t = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// Initialize locale on module load
initializeLocale();

export default i18n;