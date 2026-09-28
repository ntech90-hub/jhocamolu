export interface TimelineItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: 'experience' | 'education' | 'certification';
  location?: string;
  description: string;
  highlights: string[];
}

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "sena-instructor",
    role: "Instructor de Formación Profesional - Programación de Software",
    organization: "Servicio Nacional de Aprendizaje (SENA)",
    period: "2026 – Actualidad",
    type: "experience",
    location: "Ibagué, Tolima, Colombia",
    description: "Orientación formativa integral y pedagógica en desarrollo de software, preparando técnicos y tecnólogos para los retos productivos del sector TI.",
    highlights: [
      "Formación presencial y virtual en lógica de programación, algoritmia y desarrollo web frontend (HTML5, CSS3, JavaScript).",
      "Diseño curricular, guías de aprendizaje, proyectos formativos y bancos de pruebas técnicas.",
      "Acompañamiento integral y mentoría hacia la etapa productiva y certificación técnica laboral.",
      "Gestión de rutas de aprendizaje en plataformas Sofía Plus, Zajuna y entornos colaborativos."
    ]
  },
  {
    id: "snr-profesional",
    role: "Profesional Especializado en Gestión Documental y TI",
    organization: "Superintendencia de Notariado y Registro (SNR)",
    period: "2025 – 2026",
    type: "experience",
    location: "Bogotá D.C., Colombia",
    description: "Supervisión contractual y aseguramiento técnico en proyectos de digitalización masiva y modernización de antecedentes registrales.",
    highlights: [
      "Supervisión de componentes tecnológicos (datos no estructurados) y normativas archivísticas en el programa INHOUSE.",
      "Consultas SQL avanzadas para validación, cruce y consistencia de información documental.",
      "Soporte en la migración de datos hacia el SGDEA desde aplicativos legados como SISG e Iris Documental.",
      "Validación y certificación técnica de entregables finales e indexación digital en discos seguros."
    ]
  },
  {
    id: "vek-director",
    role: "Director de TI / Asesor de Tecnología",
    organization: "Vek Studio Creativo SAS",
    period: "2023 – 2026",
    type: "experience",
    location: "Ibagué, Tolima, Colombia",
    description: "Liderazgo del área tecnológica, definición de arquitecturas de software y dirección de equipos multidisciplinarios de desarrollo.",
    highlights: [
      "Estrategia e implementación de soluciones web de alto impacto en .NET (6, 7 y 8), Laravel y WordPress.",
      "Supervisión de seguridad informática, políticas de despliegue continuo y optimización de infraestructura.",
      "Integración de sistemas multiplataforma garantizando escalabilidad, rendimiento y sostenibilidad operativa."
    ]
  },
  {
    id: "expert-medica",
    role: "Desarrollador Full Stack Senior & Arquitecto Técnico",
    organization: "Expert Médica IPS SAS",
    period: "2022 – 2025",
    type: "experience",
    location: "Colombia",
    description: "Liderazgo técnico en el diseño e implementación de sistemas de salud críticos, historias clínicas y plataformas administrativas.",
    highlights: [
      "Diseño de la Historia Clínica Dinámica para hospitalización y extramural en Blazor (C#) y .NET 6 con componentes reutilizables.",
      "Optimización de procedimientos almacenados en SQL Server, reduciendo tiempos de respuesta en más del 70%.",
      "Construcción de procesos ETL para consolidación de datos clínicos e integración de APIs de terceros.",
      "Arquitectura técnica para la Gestión de Contratos PESS, Portal de Medicamentos y administración PYM."
    ]
  },
  {
    id: "docente-informatica",
    role: "Docente de Informática y Pensamiento Computacional",
    organization: "Colegio Musical La Divina Infancia",
    period: "2024",
    type: "experience",
    location: "Ibagué, Tolima, Colombia",
    description: "Fomento de competencias STEM, lógica computacional y creatividad digital en niños y jóvenes.",
    highlights: [
      "Enseñanza de algoritmos mediante programación por bloques (Scratch, Blockly) y dinámicas unplugged.",
      "Integración de robótica educativa y formación en ciudadanía y seguridad digital responsable."
    ]
  },
  {
    id: "servicios-gb",
    role: "Desarrollador Full Stack",
    organization: "Servicios y Tecnología GB SAS",
    period: "2021 – 2022",
    type: "experience",
    location: "Ibagué, Tolima, Colombia",
    description: "Construcción y despliegue de soluciones empresariales con Java, PHP (Laravel) y Python.",
    highlights: [
      "Diseño de esquemas de bases de datos relacionales y NoSQL de alto volumen.",
      "Implementación de buenas prácticas de código limpio, principios SOLID y control de versiones distribuido."
    ]
  },
  {
    id: "alcanos-desarrollador",
    role: "Desarrollador Backend & Bases de Datos",
    organization: "Alcanos de Colombia SA ESP",
    period: "2019 – 2021",
    type: "experience",
    location: "Tolima, Colombia",
    description: "Desarrollo de módulos clave para Ghestik, el sistema integral de gestión de talento humano de Alcanos S.A.",
    highlights: [
      "Creación de un generador automático de procedimientos almacenados para liquidación de nómina.",
      "Generación dinámica de reportes en múltiples formatos usando SQL Server Reporting Services (SSRS).",
      "Almacenamiento de archivos digitales con Express.js y MongoDB con trazabilidad y auditoría completa."
    ]
  },
  {
    id: "proandina-jr",
    role: "Desarrollador Jr",
    organization: "Proandina Colombia",
    period: "2017 – 2019",
    type: "experience",
    location: "Ibagué, Tolima, Colombia",
    description: "Integración de sistemas ERP y WMS dentro del software Suite Lógica.",
    highlights: [
      "Módulos de informes unificados de inventarios y tableros de indicadores de desempeño (KPIs).",
      "Generación de órdenes de transporte de carga y mantenimiento correctivo en ASP.NET y PHP."
    ]
  },
  {
    id: "cun-especializacion",
    role: "Especialización en Gestión de Tecnologías de la Información",
    organization: "Corporación Unificada Nacional de Educación Superior (CUN)",
    period: "2024 – 2025",
    type: "education",
    location: "Colombia",
    description: "Formación de posgrado orientada a la alineación estratégica de las TI con el negocio, gobierno de TI y gestión de proyectos de transformación digital.",
    highlights: [
      "Gobierno de TI, ciberseguridad, gestión de riesgos y dirección estratégica de proyectos tecnológicos.",
      "Evaluación financiera de inversiones en infraestructura y desarrollo de software."
    ]
  },
  {
    id: "cun-ingenieria",
    role: "Ingeniería de Sistemas",
    organization: "Corporación Unificada Nacional de Educación Superior (CUN)",
    period: "2012 – 2016",
    type: "education",
    location: "Colombia",
    description: "Fundamentos sólidos en ingeniería de software, algoritmia, redes, bases de datos y arquitectura de computadores.",
    highlights: [
      "Graduado con enfoque en desarrollo de software y sistemas distribuidos.",
      "Complementado con Tecnólogo en Diseño y Gestión de Sistemas (2014-2016) y Técnico Profesional (2008-2014)."
    ]
  }
];
