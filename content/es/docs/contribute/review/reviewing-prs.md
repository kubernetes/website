---
title: Revisar pull requests
content_type: concept
main_menu: true
weight: 10
---

<!-- overview -->

Cualquiera puede revisar una *pull request* de documentación. Visita la sección de [*pull requests*](https://github.com/kubernetes/website/pulls)
en el repositorio del sitio web de Kubernetes para ver las PRs abiertas.

Revisar *pull requests* de documentación es una excelente manera de presentarte a la comunidad de Kubernetes.
Te ayuda a conocer la base de código y a construir confianza con otros colaboradores.

Antes de revisar, es una buena idea:

- Leer la [guía de contenido](/docs/contribute/style/content-guide/) y la 
  [guía de estilo](/docs/contribute/style/style-guide/) para que puedas dejar comentarios informados.
- Entender los diferentes
  [roles y responsabilidades](/docs/contribute/participate/roles-and-responsibilities/)
  en la comunidad de documentación de Kubernetes.

<!-- body -->

## Antes de comenzar

Antes de empezar una revisión:

- Lee el [Código de Conducta de la CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
  y asegúrate de cumplirlo en todo momento.
- Sé educado, considerado y servicial.
- Comenta sobre los aspectos positivos de las PRs, no solo sobre los cambios necesarios.
- Sé empático y consciente de cómo puede ser recibida tu revisión.
- Asume buena intención y haz preguntas aclaratorias.
- Si eres un colaborador experimentado, considera trabajar en pareja (*pairing*) con nuevos colaboradores cuyo trabajo requiera cambios extensos.

## Proceso de revisión

En general, revisa las *pull requests* en cuanto a contenido y estilo en español (o inglés según el idioma objetivo). La Figura 1 resume los pasos del
proceso de revisión. A continuación se detallan los pasos.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[Iniciar revisión]
    direction TB
    S[ ] -.-
    M[Añadir comentarios] --> N[Revisar cambios]
    N --> O[Nuevos colaboradores deben<br>elegir Comment]
    end
    subgraph third[Seleccionar PR]
    direction TB
    T[ ] -.-
    J[Leer descripción<br>y comentarios]--> K[Previsualizar cambios en<br>el build de Netlify]
    end
 
  A[Revisar lista de PRs abiertas]--> B[Filtrar PRs abiertas<br>por etiqueta]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

Figura 1. Pasos del proceso de revisión.


1. Ve a [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   Verás una lista de todas las *pull requests* abiertas para el sitio web y la documentación de Kubernetes.

2. Filtra las PRs abiertas usando una o todas las siguientes etiquetas:

   - `cncf-cla: yes` (Recomendado): Las PRs enviadas por colaboradores que no hayan firmado el CLA
      no se pueden fusionar. Consulta [Firmar el CLA](/docs/contribute/new-content/#sign-the-cla)
      para más información.
   - `language/es` (Recomendado): Filtra únicamente las PRs en idioma español.
   - `size/<tamaño>`: Filtra las PRs por un determinado tamaño. Si eres nuevo, comienza con PRs más pequeñas.

   Además, asegúrate de que la PR no esté marcada como trabajo en progreso (*work in
   progress*). Las PRs que utilizan la etiqueta `work in progress` aún no están listas para su revisión.

3. Una vez que hayas seleccionado una PR para revisar, comprende el cambio mediante los siguientes pasos:

   - Lee la descripción de la PR para entender los cambios realizados y lee los *issues* vinculados.
   - Lee los comentarios dejados por otros revisores.
   - Haz clic en la pestaña **Files changed** para ver los archivos y las líneas modificadas.
   - Previsualiza los cambios en la vista previa creada por Netlify desplazándote hasta la sección de comprobaciones de construcción
     (*build checks*) en la parte inferior de la pestaña **Conversation**.
     Aquí tienes una captura de pantalla (muestra el sitio de escritorio de GitHub; si estás revisando
     en una tableta o teléfono inteligente, la interfaz web de GitHub es ligeramente diferente):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="Detalles de la pull request de GitHub, incluyendo el enlace a la vista previa de Netlify" >}}
     Para abrir la vista previa, haz clic en el enlace **Details** de la línea **deploy/netlify** en la
     lista de comprobaciones.

4. Ve a la pestaña **Files changed** para comenzar tu revisión.

   1. Haz clic en el símbolo `+` al lado de la línea que deseas comentar.
   2. Completa los comentarios que tengas sobre la línea y haz clic en **Add single comment** (si solo tienes un comentario) o **Start a review** (si tienes múltiples comentarios por hacer).
   3. Al finalizar, haz clic en **Review changes** en la parte superior de la página. Aquí puedes añadir
      un resumen de tu revisión (¡y dejar algunos comentarios positivos para el colaborador!).
      Utiliza siempre la opción "Comment".

     - Evita hacer clic en el botón "Request changes" al finalizar tu revisión. Si deseas bloquear una PR para que no se fusione antes de realizar cambios adicionales, puedes dejar un comentario "/hold".
       Menciona la razón por la que estás aplicando la retención (*hold*) y opcionalmente especifica las condiciones bajo las cuales tú u otros revisores pueden removerla.

     - Evita hacer clic en el botón "Approve" al finalizar tu revisión. La mayoría de las veces se recomienda dejar un comentario "/approve".

## Lista de verificación para la revisión

Al revisar, utiliza lo siguiente como punto de partida.

### Idioma y gramática

- ¿Hay errores evidentes de idioma o gramática? ¿Existe una mejor manera de redactar algo?
  - Concéntrate en el idioma y la gramática de las partes de la página que el autor está cambiando. A menos que el autor tenga la intención clara de actualizar la página completa, no tiene la obligación de corregir todos los problemas de la página.
  - Cuando un PR actualiza una página existente, debes concentrarte en revisar las partes que se están actualizando. Ese contenido modificado debe revisarse para comprobar su precisión técnica y editorial.
    Si encuentras errores en la página que no se relacionan directamente con lo que el autor intenta solucionar, debe tratarse como un *issue* separado (comprueba primero que no exista un *issue* previo al respecto).
  - Ten cuidado con las *pull requests* que _mueven_ contenido. Si un autor renombra una página o combina dos páginas, nosotros (Kubernetes SIG Docs) generalmente evitamos pedirle que corrija cada pequeño detalle gramatical u ortográfico dentro del contenido movido.
- ¿Hay palabras complicadas o arcaicas que se puedan reemplazar por una palabra más simple?
- ¿Se utilizan palabras, términos o frases que puedan reemplazarse por una alternativa no discriminatoria?
- ¿La elección de palabras y sus mayúsculas cumplen con la [guía de estilo](/docs/contribute/style/style-guide/)?
- ¿Hay oraciones largas que podrían ser más cortas o menos complejas?
- ¿Hay párrafos largos que funcionarían mejor como una lista o una tabla?

### Contenido

- ¿Existe contenido similar en otra parte del sitio de Kubernetes?
- ¿El contenido enlaza excesivamente a sitios externos, a proveedores individuales o a documentación que no es de código abierto?

### Documentación

Algunas comprobaciones a considerar:

- ¿Este PR cambió o eliminó el título de una página, un slug/alias o un enlace de anclaje? Si es así,
  ¿Hay enlaces rotos como resultado de este PR? ¿Existe otra opción, como cambiar el título de la página
  sin modificar el slug?

- ¿El PR agrega una página nueva? Si es así:

  - ¿La página utiliza el [tipo de contenido de página](/docs/contribute/style/page-content-types/) correcto y sus *shortcodes* de Hugo asociados?
  - ¿La página aparece correctamente en la navegación lateral de la sección (o aparece en absoluto)?
  - ¿Debería aparecer la página en el listado del [Inicio de la documentación](/docs/home/)?

- ¿Los cambios se muestran correctamente en la vista previa de Netlify? Presta especial atención a las listas, bloques de código, tablas, notas e imágenes.

### Infraestructura del sitio web

Para cambios que involucren el entorno de trabajo del sitio web (como actualizaciones de Hugo o del tema Docsy),
los Revisores deben pedir al autor de la PR que confirme que el sitio se construye sin errores en modo de producción, o verificarlo ellos mismos.
Esto es necesario porque las vistas previas automatizadas de Netlify pueden no detectar errores específicos en la transformación de recursos
o en la resolución de rutas que solo se activan durante una compilación de producción completa.

Los revisores pueden verificar la compilación utilizando uno de los siguientes métodos:

- **Basado en contenedores (recomendado):** Garantiza la paridad del entorno sin necesidad de tener Hugo instalado localmente.
 
  {{< note >}}
  El objetivo predeterminado `container-serve` se ejecuta en modo de desarrollo.
  Para una compilación equivalente a producción, edita temporalmente el archivo `Makefile` y cambia
  `--environment development` por `--environment production` en el objetivo `container-serve`, luego ejecuta:

  ```bash
  make container-image
  make container-serve
  ```

  {{< /note >}}


- **Hugo local mediante Make:** Utiliza el objetivo del Makefile existente para una compilación de producción. Ten en cuenta que esto realiza una compilación completa y es más lento que servir el sitio.

  ```bash
  make production-build
  ```
 
- **Comando directo de Hugo:** La forma más rápida de realizar la compilación de producción sin servir el sitio.

  ```bash
  hugo --gc --minify --templateMetrics --environment production
  ```

#### Verifica la salida
 
Una compilación exitosa mostrará una tabla de resumen:

```text
| EN  | ZH-CN | JA | ...
---+------+-------+-----+
Pages | 2601 | 2148 | 747 | ...

Built in 95753 ms
Environment: "production"
```

Si la compilación falla, verás registros explícitos de ERROR;
una falla como la de un shortcode o la transformación de un recurso se verá así:

```text
ERROR render of "page" failed: "/src/layouts/shortcodes/cve-feed.html:3:14": 
execute of template failed: template: shortcodes/cve-feed.html:3:14: 
failed to transform "scss/main.scss" (text/x-scss): SCSS processing failed
```

Revisa la vista previa de Netlify para ver cómo se renderiza la falla en el sitio.
Si la compilación de producción falla, la PR no debe fusionarse hasta que el autor
solucione los errores de plantilla o transformación.

### Blog

Los comentarios iniciales sobre las publicaciones del blog son bienvenidos a través de Google Docs o HackMD. Solicita aportes con anticipación desde el [canal de Slack #sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J).

Antes de revisar PRs del blog, familiarízate con las [pautas del blog](/docs/contribute/blog/guidelines/) y
con el envío de [publicaciones de blog y estudios de caso](/docs/contribute/new-content/blogs-case-studies/).

Asegúrate de conocer también los artículos [perennes (*evergreen*)](/docs/contribute/blog/#maintenance-evergreen)
y cómo decidir si un artículo es perenne.

Los artículos de blog pueden contener [citas directas](https://es.wikipedia.org/wiki/Cita) y 
[estilo indirecto](https://es.wikipedia.org/wiki/Estilo_indirecto). Evita sugerir una nueva redacción para 
cualquier cosa que se atribuya a alguien o que sea parte de un diálogo que haya ocurrido, incluso si consideras que la gramática del hablante original no era correcta. 
Para estos casos, intenta también respetar la puntuación sugerida por el autor del artículo, a menos que sea evidentemente errónea.

Como proyecto, solo marcamos los artículos de blog como mantenidos (`evergreen: true` en el *front matter*) si el proyecto Kubernetes 
está dispuesto a comprometerse a mantenerlos indefinidamente. 
Algunos artículos de blog definitivamente lo merecen, y siempre marcamos nuestros anuncios de lanzamiento como perennes (*evergreen*). Consulta con otros colaboradores si no estás seguro de cómo revisar sobre este punto.

La [guía de contenido](/docs/contribute/style/content-guide/) aplica incondicionalmente a los artículos de blog y a las PRs que los añaden. Ten en cuenta que algunas restricciones de la guía indican que solo son relevantes para la documentación; esas restricciones no aplican a los artículos de blog.

Verifica si la fuente Markdown está utilizando el [tipo de contenido de página](/docs/contribute/style/page-content-types/) y/o el `layout` correcto.
### Otros

Ten cuidado con las [ediciones triviales](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits);
  si ves un cambio que consideras trivial, señala esa política (sigue estando bien aceptar el cambio si realmente representa una mejora).

Anima a los autores que estén realizando correcciones de espacios en blanco a que lo hagan en
el primer commit de su PR, y luego añadan otros cambios sobre él. Esto facilita tanto las
fusiones como las revisiones. Presta especial atención a un cambio trivial que ocurra en un solo
commit junto con una gran cantidad de limpieza de espacios en blanco (y si ves eso, anima al
autor a corregirlo).

Como revisor, si identificas pequeños problemas con una PR que no son esenciales para el significado,
como errores tipográficos o espacios en blanco incorrectos, antepone `nit:`: a tus 
comentarios. Esto le permite saber al autor que esa parte de tus comentarios no es crítica.

Si estás considerando aprobar una pull request y todos los comentarios restantes están
marcados como nit, puedes fusionar la PR de todos modos. En ese caso, a menudo es útil abrir
un issue sobre los nits restantes. Considera si puedes cumplir con los requisitos para marcar
ese nuevo issue como [Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue);
si puedes, son una buena fuente para nuevos colaboradores.
