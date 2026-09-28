export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'Ingeniería de software' | 'Educación tecnológica' | 'Reflexiones';
  date: string;
  readTime: string;
  excerpt: string;
  image?: string;
  content: string; // rich markdown-formatted text
  tags: string[];
}

export const BLOG_CATEGORIES = [
  'Todas',
  'Ingeniería de software',
  'Educación tecnológica',
  'Reflexiones'
] as const;

export const ARTICLES_DATA: Article[] = [
  {
    id: "blazor-historia-clinica",
    slug: "arquitectura-componentes-dinamicos-blazor-historia-clinica",
    title: "Arquitectura de componentes dinámicos en Blazor: cómo construimos una historia clínica configurable",
    category: "Ingeniería de software",
    date: "14 de agosto de 2026",
    readTime: "7 min de lectura",
    excerpt: "Cómo diseñar un motor de formularios clínicos en C# y Blazor capaz de adaptarse a múltiples especialidades médicas y entornos extramurales sin recompilar código.",
    image: "/src/assets/images/blog_blazor_architecture_1790626344408.jpg",
    tags: ["Blazor", "C#", ".NET 6", "Arquitectura de Software", "HealthTech"],
    content: `
### El desafío en el sector salud: la rigidez de los formularios fijos

En el desarrollo de software médico para instituciones prestadoras de salud (IPS), una de las fricciones más costosas es la variabilidad constante de los formatos de historia clínica. Una consulta médica general tiene requerimientos muy distintos a los de una brigada de vacunación extramural, un control prenatal o una evolución hospitalaria de cuidados intermedios.

Tradicionalmente, las soluciones de software hospitalario abordan esto creando tablas fijas por cada especialidad. El resultado suele ser insostenible:
1. Cada nuevo requerimiento normativo o especialidad médica requiere crear migraciones de base de datos.
2. Se necesita escribir nuevos controladores, DTOs y componentes de interfaz específicos.
3. El ciclo de despliegue puede tardar semanas para un cambio que conceptualmente es un nuevo campo de texto o una casilla de verificación.

---

### La solución: un motor de renderizado declarativo en Blazor

Inspirándonos en la versatilidad de herramientas como Google Forms, pero incorporando las exigencias de validación estricta y trazabilidad legal de los registros médicos en Colombia, diseñamos una arquitectura basada en **definiciones de esquema en JSON** y **componentes genéricos en Blazor**.

#### 1. Definición del modelo de esquema
Cada sección de la historia clínica se describe mediante una estructura jerárquica de campos:

\`\`\`csharp
public class FormFieldDefinition
{
    public string FieldKey { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public FieldType Type { get; set; } // Text, Number, Select, Checkbox, VitalSign, Signature
    public bool IsRequired { get; set; }
    public string? ValidationRegex { get; set; }
    public List<SelectOption>? Options { get; set; }
    public VisibilityCondition? Condition { get; set; }
}
\`\`\`

#### 2. El despachador de componentes dinámicos
Blazor ofrece \`DynamicComponent\`, una primitiva poderosa que permite instanciar componentes de forma programática en tiempo de ejecución:

\`\`\`razor
@foreach (var field in Section.Fields)
{
    if (Evaluator.IsVisible(field, FormData))
    {
        <div class="field-container my-3">
            <DynamicComponent 
                Type="@GetComponentTypeFor(field.Type)" 
                Parameters="@GetParametersFor(field)" />
        </div>
    }
}
\`\`\`

Esta abstracción desacopla completamente el diseño visual de los datos subyacentes. Si un médico internista requiere agregar una escala de dolor o un cálculo automático del índice de masa corporal (IMC), un administrador con perfil autorizado puede crear o actualizar la plantilla desde un panel de gestión en minutos.

---

### Consideraciones de rendimiento y estado

En Blazor WebAssembly, el renderizado de formularios con cientos de campos dinámicos puede degradar la fluidez si no se cuida la reactividad. Implementamos dos optimizaciones clave:
- **Renderizado granular**: En lugar de disparar el ciclo \`StateHasChanged()\` en toda la página ante cada pulsación de tecla, cada celda dinámica gestiona su propio estado local y solo notifica al formulario padre al desenfocarse (\`onblur\`) o con un debounce controlado de 300 ms.
- **Inmutabilidad y versionado**: Cada guardado de historia clínica se almacena como una instantánea inmutable vinculada al ID de la versión de la plantilla con la que fue diligenciada. Esto garantiza que si la plantilla cambia a futuro, los registros históricos conservan su estructura exacta para auditoría legal.

### Conclusión
La adopción de Blazor en entornos empresariales no solo ofrece la comodidad de un lenguaje unificado (C# tanto en el cliente como en el servidor), sino que permite crear interfaces declarativas altamente dinámicas que reducen drásticamente la deuda técnica y los tiempos de entrega.
    `
  },
  {
    id: "pedagogia-programacion-sena",
    slug: "estrategias-pedagogicas-logica-programacion-web-sena",
    title: "De la lógica elemental al desarrollo web: estrategias pedagógicas para formar la próxima generación de programadores en el SENA",
    category: "Educación tecnológica",
    date: "22 de julio de 2026",
    readTime: "6 min de lectura",
    excerpt: "Reflexiones y metodologías prácticas aplicadas en el aula para transformar la frustración inicial de la algoritmia en pensamiento computacional sólido y código web estructurado.",
    image: "/src/assets/images/blog_sena_education_1790626356637.jpg",
    tags: ["Educación TI", "SENA", "Algoritmos", "Pensamiento Computacional", "Pedagogía"],
    content: `
### La paradoja del aprendizaje en programación

Uno de los errores más comunes al enseñar programación a personas que recién inician su camino técnico es apresurarse a enseñar la sintaxis de un lenguaje antes de consolidar el razonamiento lógico. Cuando un estudiante intenta aprender al mismo tiempo qué es una variable, cómo estructurar un bucle, qué significa la sintaxis de corchetes de JavaScript y cómo lidiar con un compilador, la sobrecarga cognitiva es inevitable.

Como instructor de Formación Profesional en el Servicio Nacional de Aprendizaje (SENA), mi prioridad metodológica ha sido invertir la pirámide: primero construir **estructuras mentales algorítmicas**, luego experimentar con **pseudocódigo estructurado**, y finalmente aterrizar los conceptos en aplicaciones web reales.

---

### Las tres etapas del andamiaje pedagógico

#### Etapa 1: La desmitificación de la lógica (Actividades Unplugged)
Antes de abrir un editor de código, trabajamos con problemas del mundo real. El estudiante debe descomponer tareas cotidianas en secuencias de instrucciones no ambiguas:
- ¿Cómo explicarías a alguien con los ojos vendados cómo preparar un café o atar un zapato sin dar pasos por sentados?
- La resolución de acertijos de cruce de ríos, torres de Hanoi y diagramas de flujo en pizarra.

Este ejercicio revela que los computadores no son inteligentes; son increíblemente rápidos ejecutando instrucciones tontas y literales. Cuando el aprendiz comprende que el error de un programa no es un defecto mágico, sino una instrucción imprecisa, la frustración se convierte en curiosidad investigativa.

#### Etapa 2: Pseudocódigo y pruebas de escritorio
La prueba de escritorio (el rastreo manual de variables con lápiz y papel fila por fila) es, en mi experiencia, la herramienta pedagógica más poderosa. Un estudiante que puede simular en papel el valor de un acumulador dentro de un ciclo \`para\` (for) o \`mientras\` (while) nunca volverá a tropezar con errores comunes de desfase por uno (*off-by-one errors*).

\`\`\`text
Proceso CalcularPromedioAprobados
    Definir notas, suma, contador, notaActual como Real
    suma <- 0
    contador <- 0
    Para i <- 1 Hasta TotalEstudiantes Con Paso 1 Hacer
        Leer notaActual
        Si notaActual >= 3.0 Entonces
            suma <- suma + notaActual
            contador <- contador + 1
        FinSi
    FinPara
    // Prueba de escritorio asegura que no haya división por cero
FinProceso
\`\`\`

#### Etapa 3: El salto al frontend interactivo
Una vez que el razonamiento lógico está afianzado, la transición a HTML5, CSS3 y JavaScript resulta natural. Ya no están memorizando sintaxis vacía; están aplicando condiciones y eventos para resolver problemas tangibles:
- Validar un formulario de registro antes de enviarlo.
- Filtrar una lista de productos en tiempo real con métodos de arreglos (\`map\`, \`filter\`, \`reduce\`).
- Entender el DOM no como un laberinto, sino como un árbol de objetos manipulable lógicamente.

---

### La formación para la etapa productiva
El objetivo del SENA no es formar codificadores que copien y peguen fragmentos de código, sino profesionales integrales que comprendan el ciclo de vida del software, el control de versiones con Git, el trabajo en equipo y la ética profesional. Cuando un aprendiz conecta la algoritmia con una oportunidad real de transformar la calidad de vida de su familia, la vocación docente adquiere todo su sentido.
    `
  },
  {
    id: "optimizacion-sql-salud",
    slug: "optimizacion-sql-server-salud-reduccion-70-porciento",
    title: "Optimización de SQL Server en salud: lecciones de una reducción del 70% en tiempos de consulta",
    category: "Ingeniería de software",
    date: "05 de junio de 2026",
    readTime: "8 min de lectura",
    excerpt: "Análisis técnico de cómo desmantelamos cuellos de botella en un motor transaccional de salud mediante índices cubiertos, eliminación de cursores y planes de ejecución.",
    image: "/src/assets/images/project_clinical_system_1790626332781.jpg",
    tags: ["SQL Server", "Bases de Datos", "T-SQL", "Performance", "Índices"],
    content: `
### El síntoma: cuando el sistema se congela a fin de mes

En cualquier institución de salud, el cierre mensual de facturación y la consolidación de auditoría de historias clínicas es el momento de mayor estrés operativo. En una base de datos con millones de registros de atenciones y prescripciones, una sola consulta mal planificada puede secuestrar los recursos de CPU y generar una cascada de bloqueos (\`LCK_M_X\`) que paraliza la recepción de urgencias.

Nos enfrentábamos a procedimientos almacenados que tardaban más de 3 minutos en devolver resultados para un solo centro médico. Tras una intervención quirúrgica de optimización, logramos reducir esos tiempos a menos de 45 segundos: una reducción superior al 70%. A continuación, comparto las lecciones más determinantes del proceso.

---

### Diagnóstico con Dynamic Management Views (DMVs)

El primer paso nunca debe ser adivinar ni agregar índices a ciegas. Usamos las vistas de rendimiento de SQL Server para identificar las consultas que consumían la mayor cantidad de tiempo de CPU y lecturas lógicas:

\`\`\`sql
-- Identificar los procedimientos almacenados con mayor costo de E/S lógica
SELECT TOP 10 
    d.object_id,
    DB_NAME(d.database_id) AS DatabaseName,
    OBJECT_NAME(object_id, database_id) AS ProcedureName,
    d.total_logical_reads / d.execution_count AS AvgLogicalReads,
    d.total_elapsed_time / d.execution_count / 1000 AS AvgDurationMs,
    d.execution_count
FROM sys.dm_exec_procedure_stats AS d
ORDER BY AvgLogicalReads DESC;
\`\`\`

El análisis reveló dos culpables recurrentes:
1. **Cursores iterativos**: Bucles \`CURSOR\` que recorrían fila por fila para calcular acumulados de copagos y cuotas moderadoras.
2. **Table Scans masivos** causados por funciones escalares no determinísticas dentro de cláusulas \`WHERE\`.

---

### Tres transformaciones técnicas críticas

#### 1. Reemplazo de cursores por funciones de ventana (\`OVER()\`)
Un cursor que procesaba 50,000 registros de atención realizaba 50,000 lecturas individuales. Al reescribirlo usando funciones de ventana (\`SUM(...) OVER (PARTITION BY ... ORDER BY ...)\`), el motor de base de datos resolvió la operación en un único pase de memoria, reduciendo el tiempo de 82 segundos a 3.4 segundos.

#### 2. Creación de índices cubiertos (Covering Indexes) con \`INCLUDE\`
Cuando una consulta requiere columnas que no forman parte del índice agrupado, el motor se ve forzado a realizar un costoso *Key Lookup*. Al diseñar un índice no agrupado sobre los campos de filtrado y agregar las columnas de salida en la cláusula \`INCLUDE\`, convertimos operaciones de búsqueda completa en simples *Index Seeks*:

\`\`\`sql
-- Antes: Generaba Key Lookup contra la tabla principal de millones de filas
-- Ahora: Índice cubierto que resuelve la consulta íntegramente en el árbol B
CREATE NONCLUSTERED INDEX IX_Atenciones_Fecha_Estado
ON dbo.AtencionesMedicas (FechaAtencion, IdEstado)
INCLUDE (IdPaciente, CodigoDiagnostico, ValorTotal);
\`\`\`

#### 3. Erradicación de conversiones implícitas de tipos
Descubrimos que un parámetro recibido en la API como \`VARCHAR\` se comparaba contra una columna indexada declarada como \`NVARCHAR\`. Esto obligaba a SQL Server a aplicar una conversión de tipo implícita (\`CONVERT_IMPLICIT\`) sobre cada fila de la tabla, invalidando el uso del índice. Al corregir el tipo de dato en el procedimiento almacenado, el tiempo de búsqueda cayó instantáneamente de 14 segundos a 220 milisegundos.

---

### Resultados medibles y conclusiones
- **Latencia media**: Reducción superior al 70% en los reportes críticos de auditoría.
- **Concurrencia**: Cero reportes de deadlocks durante los cortes de fin de mes.
- **Costo de hardware**: Se postergó la necesidad de escalar los recursos de hardware del servidor, generando un ahorro tangible para la organización.

La optimización de bases de datos no es magia; es una disciplina de medición rigurosa, comprensión de los planes de ejecución y respeto por la forma en que los motores relacionales manejan los datos en disco y memoria.
    `
  }
];
