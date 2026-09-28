export interface Project {
  id: string;
  title: string;
  clientOrOrg: string;
  period: string;
  category: 'dotnet' | 'data' | 'web' | 'architecture';
  categoryLabel: string;
  technologies: string[];
  shortDescription: string;
  measurableResult: string;
  problem: string;
  solution: string;
  results: string[];
  image?: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'Todos los proyectos' },
  { id: 'dotnet', label: '.NET & C#' },
  { id: 'data', label: 'Bases de Datos & SQL' },
  { id: 'web', label: 'Desarrollo Web & APIs' },
  { id: 'architecture', label: 'Arquitectura & Liderazgo' }
] as const;

export const PROJECTS_DATA: Project[] = [
  {
    id: "historia-clinica-dinamica",
    title: "Historia Clínica Dinámica Extramural y Hospitalaria",
    clientOrOrg: "Expert Médica IPS SAS",
    period: "2022 – 2024",
    category: "dotnet",
    categoryLabel: ".NET & C#",
    technologies: ["Blazor (C#)", ".NET 6", "SQL Server", "Arquitectura en Capas", "REST API"],
    shortDescription: "Plataforma de formularios clínicos altamente configurables basada en componentes genéricos reutilizables en Blazor, adaptada a hospitalización y atención extramural.",
    measurableResult: "Configuración instantánea de formatos clínicos sin requerir nuevos despliegues de código.",
    problem: 
      "El personal de salud requería registrar historias clínicas especializadas según el tipo de servicio (hospitalario vs. brigadas extramurales con conectividad intermitente). Los esquemas fijos tradicionales obligaban a desarrollar nuevas tablas, formularios y despliegues por cada especialidad médica.",
    solution: 
      "Diseñé e implementé un motor de formularios dinámicos inspirado en el modelo de Google Forms, pero con rigor clínico y validaciones estrictas. Se construyó con Blazor WebAssembly / Server en .NET 6 usando componentes genéricos reutilizables. La estructura almacena esquemas JSON versionados con metadatos de validación y campos condicionales.",
    results: [
      "Reducción del tiempo de puesta en producción de nuevas especialidades médicas de semanas a minutos mediante configuración en panel administrativo.",
      "Reutilización de más del 85% de la lógica de interfaz gracias a la arquitectura de componentes en Blazor.",
      "Garantía de integridad y trazabilidad legal de cada versión de historia clínica completada."
    ],
    image: "/src/assets/images/project_clinical_system_1790626332781.jpg"
  },
  {
    id: "optimizacion-stored-procedures",
    title: "Optimización Avanzada de Procedimientos Almacenados",
    clientOrOrg: "Expert Médica IPS SAS",
    period: "2023 – 2024",
    category: "data",
    categoryLabel: "Bases de Datos & SQL",
    technologies: ["SQL Server", "T-SQL", "Query Execution Plans", "Index Tuning", "Profiler"],
    shortDescription: "Refactorización y reingeniería de procedimientos almacenados de misión crítica con grandes volúmenes de datos clínicos y de facturación.",
    measurableResult: "Mejora superior al 70% en tiempos de respuesta de consultas complejas.",
    problem: 
      "Con el crecimiento exponencial del histórico de pacientes y procedimientos, las consultas de auditoría médica, reportería y facturación tardaban hasta varios minutos, causando bloqueos de tablas (deadlocks) y saturación de la memoria del servidor SQL Server.",
    solution: 
      "Realicé un análisis exhaustivo de planes de ejecución (Execution Plans) con SQL Server Profiler y vistas DMV. Se rediseñaron índices agrupados y no agrupados con inclusión de columnas clave, se eliminaron cursores iterativos reemplazándolos por operaciones basadas en conjuntos, y se reestructuraron las subconsultas correlacionadas.",
    results: [
      "Tiempos de respuesta reducidos de más de 180 segundos a menos de 45 segundos (mejora de más del 70%).",
      "Eliminación total de los episodios de deadlocks en las horas pico de atención hospitalaria.",
      "Disminución del 40% en el consumo promedio de CPU en el motor de base de datos durante cortes de facturación."
    ]
  },
  {
    id: "etl-integracion-apis",
    title: "Procesos ETL e Interoperabilidad con APIs de Terceros",
    clientOrOrg: "Expert Médica IPS SAS",
    period: "2023 – 2025",
    category: "web",
    categoryLabel: "Desarrollo Web & APIs",
    technologies: [".NET Core", "C#", "SQL Server", "RESTful Webhook APIs", "JSON/XML"],
    shortDescription: "Pipelines de consolidación de datos clínicos heterogéneos e integración segura con plataformas de aseguradoras y entes de control.",
    measurableResult: "Consolidación automatizada de miles de registros diarios con trazabilidad de errores.",
    problem: 
      "La información de diagnósticos, autorizaciones y dispensación médica provenía de diferentes fuentes externas y formatos dispares, requiriendo validación manual e integración propensa a inconsistencias.",
    solution: 
      "Implementación de servicios en segundo plano en .NET Core para extracción, transformación y carga (ETL), con colas de reintentos, validación semántica de estructuras y llamadas asíncronas a APIs de aseguradoras y entes de salud.",
    results: [
      "Automatización del 95% de los procesos de conciliación de datos de pacientes.",
      "Reducción a cero de las pérdidas de paquetes de datos mediante logging estructurado y mecanismos idempotentes.",
      "Cumplimiento riguroso de normativas de confidencialidad y protección de datos sensibles en salud."
    ]
  },
  {
    id: "gestion-pess-medicamentos",
    title: "Gestión Estratégica de Contratos PESS y Portal de Medicamentos",
    clientOrOrg: "Expert Médica IPS SAS",
    period: "2023 – 2024",
    category: "architecture",
    categoryLabel: "Arquitectura & Liderazgo",
    technologies: ["Arquitectura en Capas", ".NET", "C#", "SQL Server", "Gobierno TI"],
    shortDescription: "Liderazgo y arquitectura técnica del proceso precontractual, ejecución contractual y administración de farmacia/PYM.",
    measurableResult: "Control integral del ciclo de vida contractual y dispensación con auditoría estricta.",
    problem: 
      "Falta de visibilidad unificada entre los acuerdos de voluntades con EPS (etapa precontractual), la ejecución real de servicios y el abastecimiento de medicamentos en tiempo real.",
    solution: 
      "Actué como arquitecto de software y mediador técnico entre las necesidades del negocio de salud y los desarrolladores. Diseñé un modelo unificado en capas que articula la etapa precontractual, los hitos de ejecución y el Portal de Medicamentos.",
    results: [
      "Trazabilidad completa de auditoría legal y financiera de contratos de salud.",
      "Control de inventario farmacéutico alineado con los techos presupuestales pactados.",
      "Mantenimiento simplificado y reducción de costos operativos en soporte técnico."
    ]
  },
  {
    id: "ghestik-alcanos",
    title: "Ghestik: Sistema Integral de Talento Humano",
    clientOrOrg: "Alcanos de Colombia SA ESP",
    period: "2019 – 2021",
    category: "dotnet",
    categoryLabel: ".NET & C#",
    technologies: [".NET Core 3.1", "Express.js", "SQL Server", "MongoDB", "SSRS", "JavaScript"],
    shortDescription: "Desarrollo de módulos críticos de nómina con generador dinámico de procedimientos almacenados, almacenamiento documental y auditoría.",
    measurableResult: "Generación automática de SPs para liquidación y reducción drástica de errores de cálculo.",
    problem: 
      "Las fórmulas de liquidación de nómina de Alcanos requerían constantes cambios legislativos y convencionales, lo que exigía escribir y probar manualmente cientos de líneas de SQL por cada concepto salarial.",
    solution: 
      "Diseñé un generador dinámico de stored procedures que traducía las fórmulas paramétricas ingresadas por el equipo de nómina a código T-SQL optimizado. Además integré MongoDB y Express.js para la gestión de legajos digitales de empleados y SSRS para reportería.",
    results: [
      "Automatización de la generación de rutinas de liquidación reduciendo el margen de error humano al 0%.",
      "Auditoría granular que registra usuario, fecha, valor previo y valor nuevo en cada modificación sensible.",
      "Generación y exportación de reportes corporativos en PDF, Excel y formatos bancarios oficiales."
    ]
  },
  {
    id: "suite-logica-proandina",
    title: "Suite Lógica: Integración ERP y WMS Logístico",
    clientOrOrg: "Proandina Colombia",
    period: "2017 – 2019",
    category: "web",
    categoryLabel: "Desarrollo Web & APIs",
    technologies: ["ASP.NET", "PHP (CodeIgniter)", "SQL Server", "JavaScript", "HTML5/CSS3"],
    shortDescription: "Integración de procesos de cadena de suministro, inventarios en bodega, transporte de carga y tableros de control de KPIs.",
    measurableResult: "Generación automática de órdenes de despacho y centralización del stock multisede.",
    problem: 
      "Sistemas desconectados entre la bodega física y los despachos a nivel nacional generaban discrepancias en el inventario real y retrasos en la facturación a transportistas.",
    solution: 
      "Desarrollo e integración de módulos en Suite Lógica que comunican las entradas y salidas de WMS con el ERP central, agregando tableros de KPIs comerciales e informes unificados de stock.",
    results: [
      "Visibilidad en tiempo real de inventarios en múltiples centros de distribución.",
      "Agilización del proceso de generación de órdenes de transporte y remisiones.",
      "Consolidación de pruebas psicotécnicas para reclutamiento interno de conductores y operarios."
    ]
  },
  {
    id: "digitalizacion-snr",
    title: "Supervisión y Migración al SGDEA Documental",
    clientOrOrg: "Superintendencia de Notariado y Registro",
    period: "2025 – 2026",
    category: "architecture",
    categoryLabel: "Arquitectura & Liderazgo",
    technologies: ["SQL Server", "SGDEA", "Sistemas SISG e Iris", "Seguridad de Datos"],
    shortDescription: "Aseguramiento de la integridad tecnológica y migración masiva de expedientes del sistema notarial y registral colombiano.",
    measurableResult: "Certificación y validación de cientos de miles de registros de títulos y antecedentes registrales.",
    problem: 
      "Grandes volúmenes de libros de antecedentes registrales requerían digitalización e indexación con estrictos estándares de integridad técnica, no repudio y conformidad archivística nacional.",
    solution: 
      "Supervisión del componente tecnológico, validación mediante scripts SQL de integridad de datos y metadatos no estructurados, y acompañamiento en la migración hacia la plataforma SGDEA institucional.",
    results: [
      "Aseguramiento de cero inconsistencias en los entregables digitales de los contratos de digitalización.",
      "Transición fluida de datos históricos hacia la infraestructura digital del SGDEA.",
      "Garantía de confidencialidad y cadena de custodia en información de propiedad raíz de la nación."
    ]
  }
];
