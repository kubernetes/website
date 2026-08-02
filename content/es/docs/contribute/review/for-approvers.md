---
title: Revisión para aprobadores y revisores
linktitle: Para aprobadores y revisores
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

Los [Revisores](/docs/contribute/participate/#reviewers) y 
[Aprobadores](/docs/contribute/participate/#approvers) de SIG Docs realizan algunas tareas adicionales 
al revisar un cambio.

Cada semana, un aprobador de documentación específico se ofrece como voluntario para clasificar y revisar *pull requests*. 
Esta persona es el "PR Wrangler" de la semana. Consulta el 
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
para obtener más información. Para convertirte en PR Wrangler, asiste a la reunión semanal de SIG Docs
y postúlate. Incluso si no estás en el calendario de la semana actual,
aún puedes revisar *pull requests* (PRs) que no estén bajo revisión activa.

Además de la rotación, un bot asigna revisores y aprobadores
para la PR en función de los propietarios (*owners*) de los archivos afectados.

<!-- body -->

## Revisar una PR

La documentación de Kubernetes sigue el 
[proceso de revisión de código de Kubernetes](https://github.com/kubernetes/community/blob/main/contributors/guide/owners.md#the-code-review-process).

Todo lo descrito en [Revisar una pull request](/docs/contribute/review/reviewing-prs)
aplica aquí, pero los Revisores y Aprobadores también deben hacer lo siguiente:

- Usar el comando de Prow `/assign` para asignar un revisor específico a una PR según sea necesario. Esto es de suma importancia cuando se trata de solicitar una revisión técnica a los colaboradores del código.

  {{< note >}}
  Consulta el campo `reviewers` en el *front-matter* en la parte superior de un archivo Markdown para ver quién puede
  proporcionar la revisión técnica.
  {{< /note >}}

- Asegurarse de que la PR siga las guías de [Contenido](/docs/contribute/style/content-guide/)
  y [Estilo](/docs/contribute/style/style-guide/); enlaza al autor con la parte
  relevante de la(s) guía(s) si no lo hace.
- Utilizar la opción **Request Changes** de GitHub cuando sea aplicable para sugerir cambios al autor de la PR.
- Cambiar tu estado de revisión en GitHub utilizando los comandos de Prow `/approve` o `/lgtm`,
  si se implementan tus sugerencias.

## Hacer commits en la PR de otra persona

Dejar comentarios en la PR es útil, pero puede haber ocasiones en las que necesites hacer *commits*
directamente en la PR de otra persona.

No "tomes el control" de la PR de otra persona a menos que te lo pida explícitamente
o desees rescatar una PR abandonada desde hace mucho tiempo. Aunque pueda ser más rápido
a corto plazo, priva a la persona de la oportunidad de contribuir.

El proceso que utilices dependerá de si necesitas editar un archivo que
ya está dentro del alcance de la PR, o un archivo que la PR aún no ha tocado.

No puedes realizar *commits* en la PR de otra persona si se cumple cualquiera de las siguientes
condiciones:

- Si el autor de la PR envió su rama directamente al repositorio 
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/).
  Solo un revisor con acceso de escritura (*push access*) puede realizar *commits* en la PR de otro usuario.

  {{< note >}}
  Anima al autor a enviar su rama a su *fork* antes de abrir la PR la próxima vez.
  {{< /note >}}

- El autor de la PR prohíbe explícitamente las ediciones por parte de los aprobadores.

## Comandos de Prow para la revisión

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md) es
el sistema de CI/CD basado en Kubernetes que ejecuta trabajos contra las *pull requests* (PRs). Prow
permite comandos estilo chatbot para manejar acciones de GitHub en toda la
organización de Kubernetes, como [añadir y eliminar etiquetas](#adding-and-removing-issue-labels),
cerrar *issues* y asignar un aprobador. Ingresa los comandos de Prow como comentarios de GitHub
usando el formato `/<nombre-del-comando>`.

Los comandos de Prow más comunes que usan los revisores y aprobadores son:

{{< table caption="Comandos de Prow para la revisión" >}}
Comando de Prow | Restricciones de Rol | Descripción
:------------|:------------------|:-----------
`/lgtm` | Miembros de la organización | Señala que has terminado de revisar una PR y estás satisfecho con los cambios.
`/approve` | Aprobadores | Aprueba una PR para su fusión (*merge*).
`/assign` | Cualquiera | Asigna a una persona para revisar o aprobar una PR.
`/close` | Miembros de la organización | Cierra un *issue* o PR.
`/hold` | Cualquiera | Añade la etiqueta `do-not-merge/hold`, indicando que la PR no se puede fusionar automáticamente.
`/hold cancel` | Cualquiera | Elimina la etiqueta `do-not-merge/hold`.
{{< /table >}}

Para ver los comandos que puedes usar en una PR, consulta la 
[Referencia de Comandos de Prow](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite).

## Clasificación y categorización de issues

En general, SIG Docs sigue el proceso de 
[triaje de issues de Kubernetes](https://github.com/kubernetes/community/blob/main/contributors/guide/issue-triage.md)
y utiliza las mismas etiquetas.

Este [filtro](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc) de GitHub
Issues encuentra los *issues* que podrían necesitar triaje.

### Realizar el triaje de un issue

1. Validar el *issue*

   - Asegúrate de que el *issue* sea sobre la documentación del sitio web. Algunos *issues* se pueden cerrar rápidamente respondiendo una pregunta
     o dirigiendo a la persona a un recurso. Consulta la sección
     [Solicitudes de soporte o reportes de errores en el código](#solicitudes-de-soporte-o-reportes-de-errores-en-el-código) para más detalles.
   - Evalúa si el *issue* tiene mérito.
   - Añade la etiqueta `triage/needs-information` si el *issue* no tiene suficiente
     detalle para ser accionable o si la plantilla no está completada adecuadamente.
   - Cierra el *issue* si tiene tanto la etiqueta `lifecycle/stale` como `triage/needs-information`.

2. Añadir una etiqueta de prioridad (las [Guías de Triaje de Issues](https://github.com/kubernetes/community/blob/main/contributors/guide/issue-triage.md#define-priority)
   definen las etiquetas de prioridad en detalle)

  {{< table caption="Etiquetas de issues" >}}
  Etiqueta | Descripción
  :------------|:------------------
  `priority/critical-urgent` | Hacer esto de inmediato.
  `priority/important-soon` | Hacer esto dentro de los próximos 3 meses.
  `priority/important-longterm` | Hacer esto dentro de los próximos 6 meses.
  `priority/backlog` | Aplazable indefinidamente. Hacer cuando haya recursos disponibles.
  `priority/awaiting-more-evidence` | Marcador de posición para un *issue* potencialmente bueno para que no se pierda.
  `help` o `good first issue` | Adecuado para alguien con muy poca experiencia en Kubernetes o SIG Docs. Consulta [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) para más información.

  {{< /table >}}

  A tu discreción, asume la propiedad de un *issue* y envía una PR para él (especialmente si es rápido o se relaciona con un trabajo que ya estás realizando).

Si tienes preguntas sobre cómo triar un *issue*, consulta en `#sig-docs` en Slack o en la 
[lista de correo de kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

## Añadir y eliminar etiquetas de issues

Para añadir una etiqueta, deja un comentario en uno de los siguientes formatos:

- `/<etiqueta-a-añadir>` (por ejemplo, `/good-first-issue`)
- `/<categoría-de-etiqueta> <etiqueta-a-añadir>` (por ejemplo, `/triage needs-information` o `/language es`)

Para eliminar una etiqueta, deja un comentario en uno de los siguientes formatos:

- `/remove-<etiqueta-a-eliminar>` (por ejemplo, `/remove-help`)
- `/remove-<categoría-de-etiqueta> <etiqueta-a-eliminar>` (por ejemplo, `/remove-triage needs-information`)

En ambos casos, la etiqueta ya debe existir. Si intentas añadir una etiqueta que no existe, el comando se
ignorará en silencio.

Para obtener una lista de todas las etiquetas, consulta la [sección de Etiquetas del repositorio del sitio web](https://github.com/kubernetes/website/labels).
No todas las etiquetas son utilizadas por SIG Docs.

### Etiquetas de ciclo de vida de issues

Los *issues* generalmente se abren y cierran rápidamente.
Sin embargo, a veces un *issue* está inactivo después de ser abierto.
Otras veces, un *issue* puede necesitar permanecer abierto durante más de 90 días.

{{< table caption="Etiquetas de ciclo de vida de issues" >}}
Etiqueta | Descripción
:------------|:------------------
`lifecycle/stale` | Después de 90 días sin actividad, un *issue* se marca automáticamente como obsoleto (*stale*). El *issue* se cerrará automáticamente si el ciclo de vida no se revierte manualmente usando el comando `/remove-lifecycle stale`.
`lifecycle/frozen` | Un *issue* con esta etiqueta no se volverá obsoleto después de 90 días de inactividad. Un usuario añade manualmente esta etiqueta a los *issues* que necesitan permanecer abiertos durante mucho más de 90 días, como aquellos con la etiqueta `priority/important-longterm`.
{{< /table >}}

## Manejo de tipos de issues especiales

SIG Docs encuentra los siguientes tipos de *issues* con la suficiente frecuencia como para documentar
cómo manejarlos.

### Issues duplicados

Si un solo problema tiene uno o más *issues* abiertos, combínalos en un solo *issue*. Debes decidir qué *issue* mantener abierto (o
abrir uno nuevo), luego mover toda la información relevante y enlazar los *issues* relacionados.
Finalmente, etiqueta todos los demás *issues* que describan el mismo problema con
`triage/duplicate` y ciérralos. Tener un solo *issue* en el cual trabajar reduce la confusión 
y evita el trabajo duplicado en el mismo problema.

### Issues de enlaces rotos (Dead links)

Si el *issue* de enlace roto se encuentra en la documentación de la API o de `kubectl`, asígnales
`/priority critical-urgent` hasta que el problema se comprenda por completo. Asigna a todos los demás *issues*
de enlaces rotos `/priority important-longterm`, ya que deben corregirse manualmente.

### Issues del blog

Esperamos que las entradas del [Blog de Kubernetes](/blog/) se desactualicen
con el tiempo. Por lo tanto, solo mantenemos entradas de blog que tengan menos de un año de antigüedad.
Si un *issue* está relacionado con una entrada de blog que tiene más de un año,
generalmente debes cerrar el *issue* sin realizar la corrección.

Puedes enviar un enlace a las [actualizaciones y mantenimiento de artículos](/docs/contribute/blog/#maintenance)
como parte del mensaje que envíes cuando cierres la PR.

Está bien hacer una excepción cuando aplique una justificación relevante.

### Solicitudes de soporte o reportes de errores en el código

Algunos *issues* de documentación son en realidad problemas con el código subyacente, o solicitudes de
asistencia cuando algo (por ejemplo, un tutorial) no funciona.
Para *issues* no relacionados con la documentación, cierra el *issue* con la etiqueta `kind/support` y un comentario
que dirija al solicitante a los canales de soporte (Slack, Stack Overflow) y, si es
relevante, al repositorio para presentar un *issue* por errores en las características (`kubernetes/kubernetes`
es un excelente lugar para comenzar).

Respuesta de muestra a una solicitud de soporte:

```none
Este problema parece más una solicitud de soporte y menos
un problema específico de la documentación. Te animo a llevar
tu pregunta al canal `#kubernetes-users` en el 
[Slack de Kubernetes](https://slack.k8s.io/). También puedes buscar
en recursos como 
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
para obtener respuestas a preguntas similares.

También puedes abrir issues para la funcionalidad de Kubernetes en
[https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

Si se trata de un problema de documentación, vuelve a abrir este issue.
```

Respuesta de muestra a un reporte de error de código:

```none
Esto parece más un problema con el código que un problema con
la documentación. Por favor, abre un issue en
[https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues).

Si se trata de un problema de documentación, vuelve a abrir este issue.
```

### Squashing

Como aprobador, cuando revisas pull requests (PRs), hay varios casos
en los que podrías hacer lo siguiente:

- Aconsejar al colaborador que combine (squash) sus commits.
- Hacer squash de los commits por el colaborador.
- Aconsejar al colaborador que aún no haga squash.
- Evitar el squash.

**Aconsejar a los colaboradores que hagan squash**: Es posible que un nuevo colaborador no sepa que debe hacer
squash de sus commits en sus pull requests (PRs). Si este es el caso, aconséjale que lo haga, proporciónale enlaces a
información útil y ofrécele ayuda
si la necesita. Algunos enlaces útiles:

- [Abrir pull requests y hacer squash de tus commits](/docs/contribute/new-content/open-a-pr#squashing-commits)
  para colaboradores de documentación.
- [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/), incluyendo diagramas, para desarrolladores.

**Hacer squash de commits por los colaboradores**: Si un colaborador tiene dificultades para hacer
squash de sus commits o hay presión de tiempo para fusionar una PR, puedes realizar el
squash por él:

- El repositorio kubernetes/website está
  [configurado para permitir squash en las fusiones de pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests).
  Simplemente selecciona el botón Squash commits.
- En la PR, si el colaborador permite que los mantenedores gestionen la PR, puedes hacer
  squash de sus commits y actualizar su fork con el resultado. Antes de hacer squash,
  aconséjale que guarde y envíe (push) sus últimos cambios a la PR. Después de hacer
  squash, aconséjale que traiga (pull) el commit combinado a su clon local.
- Puedes hacer que GitHub realice el squash de los commits utilizando una etiqueta para que Tide / GitHub
  realice el squash, o haciendo clic en el botón Squash commits cuando fusiones la PR.

**Aconsejar a los colaboradores evitar hacer squash**

- Si un commit hace algo defectuoso o no recomendable, y el último commit revierte este
  error, no hagas squash de los commits. Aunque la pestaña "Files changed" en la PR en
  GitHub y la vista previa de Netlify se vean bien, fusionar esta PR podría crear conflictos de
  rebase o merge para otras personas. Intervén como creas conveniente para evitar ese
  riesgo para otros colaboradores.

**Nunca hacer squash**

- Si estás lanzando una localización o publicando la documentación para una nueva versión 
  y estás fusionando una rama que no proviene del fork de un usuario, nunca hagas squash 
  de los commits. No hacer squash es esencial porque debes mantener el historial de 
  commits de esos archivos.
