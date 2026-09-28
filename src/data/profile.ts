export interface SocialLink {
  name: string;
  url: string;
  label: string;
  icon: 'facebook' | 'linkedin' | 'instagram' | 'github' | 'mail' | 'whatsapp';
}

export interface Metric {
  value: string;
  label: string;
  description: string;
}

export const PROFILE_DATA = {
  name: "Jhonatan Camilo Moreno Luna",
  tagline: "Ingeniero de Sistemas · Especialista en Gestión de TI · Instructor SENA · Desarrollador Fullstack",
  valueProposition: "Transformo requerimientos complejos en arquitecturas de software de alto rendimiento y formo a la próxima generación de talento tecnológico.",
  location: "Ibagué, Tolima / Bogotá D.C., Colombia",
  email: "jhocamolu2010@gmail.com",
  phone: "+57 311 289 2173",
  avatarUrl: "/src/assets/images/fotomejorada.png",
  summary: 
    "Desarrollador fullstack y líder tecnológico con más de 8 años de trayectoria articulando soporte, redes, desarrollo de software e innovación formativa. Como instructor en el SENA, lidero la enseñanza de algoritmia, lógica y desarrollo web moderno. En la industria, he liderado arquitecturas críticas en .NET, C#, Blazor y SQL Server, alcanzando optimizaciones de hasta un 70% en tiempos de respuesta de bases de datos y orquestando soluciones empresariales resilientes y seguras desde el diseño.",
  
  metrics: [
    {
      value: "+8",
      label: "Años de experiencia",
      description: "Desarrollo fullstack, arquitectura de software y gestión tecnológica."
    },
    {
      value: ">70%",
      label: "Optimización SQL",
      description: "Mejora medible en tiempos de respuesta en procedimientos almacenados críticos."
    },
    {
      value: "100+",
      label: "Horas de mentoría",
      description: "Formación profesional de aprendices en el SENA en algoritmia y web."
    },
    {
      value: "4+",
      label: "Sectores impactados",
      description: "Salud (IPS), sector público (SNR), servicios públicos (Alcanos) y educación."
    }
  ] as Metric[],

  technologies: {
    backend: [".NET (6/7/8)", "C#", "Blazor", "Java (Spring Boot)", "PHP (Laravel, CodeIgniter)", "Express.js", "Python"],
    frontend: ["JavaScript (ES6+)", "Angular", "HTML5", "CSS3 / Tailwind", "TypeScript"],
    databases: ["SQL Server", "MongoDB", "ETL Pipelines", "SSRS"],
    principles: ["Ciberseguridad desde el diseño", "Principios SOLID", "Arquitectura en capas", "Optimización de consultas", "Algoritmia & Lógica"]
  },

  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jhonatan-camilo-moreno-luna/",
      label: "Perfil de LinkedIn de Camilo, se abre en una pestaña nueva",
      icon: "linkedin"
    },
    {
      name: "GitHub",
      url: "https://github.com/jhocamolu/",
      label: "Perfil de GitHub de Camilo con proyectos de código abierto, se abre en una pestaña nueva",
      icon: "github"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/jhonatan.c.moreno",
      label: "Perfil de Facebook de Camilo, se abre en una pestaña nueva",
      icon: "facebook"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/jhocamolu",
      label: "Perfil de Instagram de Camilo, se abre en una pestaña nueva",
      icon: "instagram"
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/573112892173?text=Hola%20Camilo,%20vi%20tu%20sitio%20web%20y%20me%20gustar%C3%ADa%20contactarte",
      label: "Iniciar chat directo de WhatsApp con Camilo, se abre en una pestaña nueva",
      icon: "whatsapp"
    },
    {
      name: "Correo Electrónico",
      url: "mailto:jhocamolu2010@gmail.com",
      label: "Enviar correo directo a jhocamolu2010@gmail.com",
      icon: "mail"
    }
  ] as SocialLink[]
};
