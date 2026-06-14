---
title: Ciclo de lanzamientos de Kubernetes
type: docs
auto_generated: true
---
<!-- THIS CONTENT IS AUTO-GENERATED via https://github.com/kubernetes/website/blob/main/scripts/releng/update-release-info.sh -->

{{% pageinfo color="light" %}}
This content is auto-generated and links may not function. The source of the document is located
[here](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-release/release.md).
{{% /pageinfo %}}
<!-- Localization note: omit the pageinfo block when localizing -->
## Orientación de mejoras, Issues y PRs hacia los hitos de lanzamiento (Release Milestones)

Este documento está enfocado en los desarrolladores y colaboradores de Kubernetes que necesitan crear una mejora (*enhancement*), un *issue* o una solicitud de extracción (*pull request* o PR) que esté orientada a un hito de lanzamiento (*release milestone*) específico.

- [TL;DR](#tldr)
  - [Desarrollo Normal (Semanas 1-11)](#desarrollo-normal-semanas-1-11)
  - [Congelación de Código - Code Freeze (Semanas 12-14)](#congelación-de-código---code-freeze-semanas-12-14)
  - [Post-Lanzamiento (Semanas 14+)](#post-lanzamiento-semanas-14)
- [Definiciones](#definiciones)
- [El ciclo de lanzamiento](#el-ciclo-de-lanzamiento)
- [Eliminación de elementos del hito](#eliminación-de-elementos-del-hito)
- [Añadir un elemento al hito](#añadir-un-elemento-al-hito)
  - [Mantenedores del Hito (Milestone Maintainers)](#mantenedores-del-hito-milestone-maintainers)
  - [Adiciones de características](#adiciones-de-características)
  - [Adiciones de issues](#adiciones-de-issues)
  - [Adiciones de PRs](#adiciones-de-prs)
- [Otras etiquetas obligatorias](#otras-etiquetas-obligatorias)
  - [Etiqueta del SIG propietario](#etiqueta-del-sig-propietario)
  - [Etiqueta de prioridad](#etiqueta-de-prioridad)
  - [Etiqueta de tipo de Issue/PR (Kind Label)](#etiqueta-de-tipo-de-issuepr-kind-label)

El proceso para guiar las mejoras, *issues* y *pull requests* dentro de un lanzamiento de Kubernetes abarca a múltiples partes interesadas:

- el propietario o propietarios de la mejora, *issue* o *pull request*
- el liderazgo del SIG
- el [Release Team][release-team]

La información sobre los flujos de trabajo y las interacciones se describe a continuación.

Como propietario de una mejora, *issue* o *pull request* (PR), es tu responsabilidad asegurarse de que se cumplan los requisitos del hito de lanzamiento. La automatización y el Release Team se pondrán en contacto contigo si se requieren actualizaciones, pero la inacción puede dar lugar a que tu trabajo sea eliminado del hito. Existen requisitos adicionales cuando el hito de destino es un lanzamiento anterior (consulta el [proceso de cherry pick][cherry-picks] para más información).

## TL;DR

Si quieres que tu PR se fusione, necesita las siguientes etiquetas e hitos obligatorios, representados aquí por los comandos de Prow que se necesitarían para añadirlos:

### Desarrollo Normal (Semanas 1-11)

- `/sig {nombre}`
- `/kind {tipo}`
- `/lgtm`
- `/approved`

### [Code Freeze][code-freeze] (Semanas 12-14)

- `/milestone {v1.y}`
- `/sig {nombre}`
- `/kind {bug, failing-test}`
- `/lgtm`
- `/approved`

### Post-Lanzamiento (Semanas 14+)

Regresar a los requisitos de la fase de 'Desarrollo Normal':

- `/sig {nombre}`
- `/kind {tipo}`
- `/lgtm`
- `/approved`

Las fusiones en la rama `1.y` se realizan ahora [a través de cherry picks][cherry-picks], aprobados por los [Release Managers][release-managers].

En el pasado, existía el requisito de que una *pull request* orientada a un hito tuviera un *issue* de GitHub asociado abierto, pero este ya no es el caso. Las características o mejoras son efectivamente *issues* de GitHub o [KEPs][keps] que conducen a PRs posteriores.

El proceso general de etiquetado debe ser consistente en todos los tipos de artefactos.

## Definiciones

- *propietarios del issue*: Creador, asignados y el usuario que movió el *issue* a un hito de lanzamiento.

- *Release Team*: Cada lanzamiento de Kubernetes cuenta con un equipo que realiza las tareas de gestión de proyectos descritas [aquí][release-team].
  La información de contacto del equipo asociado a cualquier lanzamiento dado se puede encontrar [aquí](https://git.k8s.io/sig-release/releases/).

- *Días Y*: Se refiere a días hábiles o comerciales.

- *mejora (enhancement)*: consulta "[¿Es mi propuesta una mejora?](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)"

- *[Enhancements Freeze][enhancements-freeze]*: la fecha límite en la que los [KEPs][keps] deben completarse para que las mejoras formen parte del lanzamiento actual.

- *[Exception Request][exceptions]*: El proceso de solicitar una extensión de la fecha límite para una mejora en particular.

- *[Code Freeze][code-freeze]*: El periodo de aproximadamente 4 semanas antes de la fecha de lanzamiento final, durante el cual solo se fusionan correcciones de errores (*bugs*) críticos en el código base del lanzamiento.

- *[Pruning](https://git.k8s.io/sig-release/releases/release_phases.md#pruning) (Poda)*: El proceso de eliminar una mejora de un hito de lanzamiento si no está completamente implementada o si se considera inestable.

- *hito de lanzamiento (release milestone)*: cadena de versión semántica o [hito de GitHub](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests) que se refiere a una versión MAJOR.MINOR `vX.Y` de un lanzamiento.
  Consulta también la [ingeniería de versiones de lanzamiento](https://git.k8s.io/sig-release/release-engineering/versioning.md).

- *rama de lanzamiento (release branch)*: Rama de Git `release-X.Y` creada para el hito `vX.Y`.
  Se crea en el momento del lanzamiento de `vX.Y-rc.0` y se mantiene después del lanzamiento durante aproximadamente 12 meses con lanzamientos de parches `vX.Y.Z`.
  Nota: los lanzamientos 1.19 y más recientes reciben 1 año de soporte para lanzamientos de parches, y los lanzamientos 1.18 y anteriores recibían 9 meses de soporte.

## El ciclo de lanzamiento

![Imagen de un ciclo de lanzamiento de Kubernetes](/images/releases/release-cycle.jpg)

Los lanzamientos de Kubernetes ocurren actualmente aproximadamente tres veces al año.

El proceso de lanzamiento se puede concebir como un proceso que consta de tres fases principales:

- Definición de mejoras
- Implementación
- Estabilización

Pero en realidad, este es un proyecto de código abierto y ágil, donde la planificación y la implementación de características ocurren en todo momento. Dada la escala del proyecto y la base de desarrolladores distribuida globalmente, es fundamental para la velocidad del proyecto no depender de una fase de estabilización tardía, sino contar con pruebas de integración continua que aseguren que el proyecto sea siempre estable, de modo que las confirmaciones (*commits*) individuales puedan marcarse si han roto algo.

Con la definición continua de características a lo largo del año, un conjunto de elementos se destacará como destinado a un lanzamiento determinado. **[Enhancements Freeze][enhancements-freeze]** comienza aproximadamente en la semana 4 del ciclo de lanzamiento. Para este momento, todo el trabajo de características planificado para el lanzamiento en cuestión ya se ha definido en los artefactos de planificación adecuados junto con el [Líder de Mejoras (Enhancements Lead)](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md) del Release Team.

Después del Enhancements Freeze, el seguimiento de los hitos en las PRs e *issues* es importante. Los elementos dentro del hito se utilizan como una lista de tareas pendientes para completar el lanzamiento. *En los issues*, los hitos deben aplicarse correctamente, mediante el triaje por parte del SIG, de modo que el [Release Team][release-team] pueda realizar el seguimiento de los errores y las mejoras (cualquier *issue* relacionado con una mejora necesita un hito).

Existe cierta automatización implementada para ayudar a asignar hitos automáticamente a las PRs.

Esta automatización se aplica actualmente a los siguientes repositorios:

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

Al momento de su creación, las PRs orientadas a la rama `master` necesitan que los humanos den una pista sobre qué hito desean que tenga como objetivo la PR. Una vez fusionadas, las PRs contra la rama `master` reciben hitos aplicados automáticamente, por lo que a partir de ese momento la gestión humana del hito de esa PR es menos necesaria. En las PRs contra ramas de lanzamiento, los hitos se aplican automáticamente cuando se crea la PR, por lo que nunca es necesaria la gestión humana del hito.

Cualquier otro esfuerzo que deba ser rastreado por el Release Team y que no caiga bajo ese paraguas de automatización debe tener un hito aplicado.

La implementación y la corrección de errores son continuas a lo largo del ciclo, pero culminan en un periodo de congelación de código (*code freeze*).

**[Code Freeze][code-freeze]** comienza aproximadamente en la semana 12 y continúa durante unas 2 semanas. Solo se aceptan correcciones de errores críticos en el código base del lanzamiento durante este tiempo.

Hay aproximadamente dos semanas consecutivas al Code Freeze, y precedentes al lanzamiento, durante las cuales se deben resolver todos los problemas críticos restantes antes del lanzamiento. Esto también da tiempo para la finalización de la documentación.

Cuando el código base es lo suficientemente estable, la rama `master` se reabre para el desarrollo general y comienza el trabajo allí para el próximo hito de lanzamiento. Cualquier modificación restante para el lanzamiento actual se traslada (*cherry picked*) desde `master` de vuelta a la rama de lanzamiento. El lanzamiento se construye a partir de la rama de lanzamiento.

Cada lanzamiento es parte de un ciclo de vida de Kubernetes más amplio:

![Imagen del ciclo de vida de lanzamiento de Kubernetes que abarca tres lanzamientos](/images/releases/release-lifecycle.jpg)

## Eliminación de elementos del hito

Antes de profundizar demasiado en el proceso para añadir un elemento al hito, ten en cuenta lo siguiente:

Los miembros del [Release Team][release-team] pueden eliminar *issues* del hito si ellos o el SIG responsable determinan que el problema no está bloqueando realmente el lanzamiento y es poco probable que se resuelva de manera oportuna.

Los miembros del Release Team pueden eliminar PRs del hito por cualquiera de las siguientes razones, o similares:

- La PR es potencialmente desestabilizadora y no es necesaria para resolver un problema bloqueante.
- La PR es una característica nueva y tardía que no ha pasado por el proceso de mejoras o el [proceso de excepción][exceptions].
- No hay un SIG responsable que esté dispuesto a asumir la propiedad de la PR y resolver cualquier problema posterior con ella.
- La PR no está correctamente etiquetada.
- El trabajo se ha detenido visiblemente en la PR y las fechas de entrega son inciertas o tardías.

Si bien los miembros del Release Team ayudarán con el etiquetado y el contacto con los SIGs, es responsabilidad del remitente categorizar las PRs y asegurar el apoyo del SIG pertinente para garantizar que cualquier ruptura causada por la PR se resuelva rápidamente.

Cuando se requiera una acción adicional, el Release Team intentará realizar una escalación de persona a persona a través de los siguientes canales:

- Comentario en GitHub mencionando al equipo del SIG y a los miembros del SIG según corresponda para el tipo de problema.
- Envío de un correo electrónico a la lista de correo del SIG:
  - configurada inicialmente con las direcciones de correo electrónico grupales de la [lista de SIGs de la comunidad][sig-list].
  - opcionalmente, dirigiéndose también directamente al liderazgo del SIG o a otros miembros del SIG.
- Envío de un mensaje al canal de Slack del SIG:
  - configurado inicialmente con el canal de slack y el liderazgo del SIG de la [lista de SIGs de la comunidad][sig-list].
  - opcionalmente, mencionando directamente con "@" al liderazgo del SIG u otros por su nombre de usuario.

## Añadir un elemento al hito

### Mantenedores del Hito (Milestone Maintainers)

Los miembros del equipo de GitHub [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members) tienen encomendada la responsabilidad de especificar el hito de lanzamiento en los artefactos de GitHub.

Este grupo es [mantenido](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers) por SIG Release y cuenta con representación del liderazgo de los diversos SIGs.

Añadir el hito de lanzamiento en curso a las pull requests después del Code Freeze está estrictamente prohibido, ya que puede comprometer la estabilidad del lanzamiento. Antes de realizar dichos cambios, se debe obtener la aprobación tanto del Release Team Lead como del Emeritus Advisor(s).

### Adiciones de características

La planificación y definición de características adopta muchas formas hoy en día, pero un ejemplo típico podría ser una gran pieza de trabajo descrita en un [KEP][keps], con *issues* de tareas asociadas en GitHub. Cuando el plan ha alcanzado un estado implementable y el trabajo está en marcha, la mejora o partes de la misma se orientan para un próximo hito creando *issues* en GitHub y marcándolos con el comando `/milestone` de Prow.

Durante las primeras ~4 semanas del ciclo de lanzamiento, el Líder de Mejoras del Release Team interactuará con los SIGs y los propietarios de características a través de GitHub, Slack y las reuniones de los SIGs para capturar todos los artefactos de planificación requeridos.

Si tienes una mejora para orientar a un próximo hito de lanzamiento, inicia una conversación con el liderazgo de tu SIG y con el Líder de Mejoras de ese lanzamiento.

### Adiciones de issues

Los *issues* se marcan para orientarse a un hito mediante el comando `/milestone` de Prow.

El [Líder de Triaje de Errores (Bug Triage Lead)](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md) del Release Team y la comunidad en general vigilan los *issues* entrantes y realizan el triaje de los mismos, tal como se describe en la sección de la guía del colaborador sobre [triaje de issues](https://k8s.dev/docs/guide/issue-triage/).

Marcar los *issues* con el hito proporciona a la comunidad una mejor visibilidad respecto a cuándo se observó un problema y para cuándo la comunidad siente que debe resolverse. Durante el [Code Freeze][code-freeze], se debe establecer un hito para poder fusionar una PR.

Ya no se requiere un *issue* abierto para una PR, pero los *issues* abiertos y las PRs asociadas deben tener etiquetas sincronizadas. Por ejemplo, es posible que una PR asociada a un error de alta prioridad no se fusione si la PR solo está marcada con una prioridad más baja.

### Adiciones de PRs

Las PRs se marcan para orientarse a un hito mediante el comando `/milestone` de Prow.

Este es un requisito bloqueante durante el Code Freeze, tal como se describió anteriormente.

## Otras etiquetas obligatorias

[Aquí está la lista de etiquetas y su uso y propósito.](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)

### Etiqueta del SIG propietario

La etiqueta del SIG propietario define al SIG al que escalamos si un *issue* de hito está demorándose o necesita atención adicional. Si no hay actualizaciones después de la escalación, el *issue* puede ser eliminado automáticamente del hito.

Estas se añaden con el comando `/sig` de Prow. Por ejemplo, para añadir la etiqueta que indica que el SIG Storage es responsable, comenta con `/sig storage`.

### Etiqueta de prioridad

Las etiquetas de prioridad se utilizan para determinar una ruta de escalación antes de mover los *issues* fuera del hito de lanzamiento. También se utilizan para determinar si un lanzamiento debe bloquearse o no debido a la resolución del problema.

- `priority/critical-urgent`: Nunca se mueve automáticamente fuera de un hito de lanzamiento; se escala continuamente al colaborador y al SIG a través de todos los canales disponibles.
  - considerado un problema que bloquea el lanzamiento (*release blocking issue*)
  - requiere actualizaciones diarias por parte de los propietarios del *issue* durante el [Code Freeze][code-freeze]
  - requeriría un lanzamiento de parche si no se descubre hasta después del lanzamiento menor
- `priority/important-soon`: Se escala a los propietarios del *issue* y al SIG propietario; se mueve fuera del hito después de varios intentos fallidos de escalación.
  - no se considera un problema que bloquee el lanzamiento
  - no requeriría un lanzamiento de parche
  - se moverá automáticamente fuera del hito de lanzamiento en el Code Freeze después de un periodo de gracia de 4 días
- `priority/important-longterm`: Se escala a los propietarios del *issue*; se mueve fuera del hito después de 1 intento.
  - aún menos urgente / crítico que `priority/important-soon`
  - se mueve fuera del hito de forma más agresiva que `priority/important-soon`

### Etiqueta de tipo de Issue/PR (Kind Label)

El tipo de *issue* se utiliza para ayudar a identificar los tipos de cambios que van entrando en el lanzamiento a lo largo del tiempo. Esto puede permitir al Release Team desarrollar una mejor comprensión de qué tipos de problemas nos perderíamos con una cadencia de lanzamiento más rápida.

Para los *issues* destinados al lanzamiento, incluidas las *pull requests*, se debe establecer una de las siguientes etiquetas de tipo de hito:

- `kind/api-change`: Añade, elimina o cambia una API.
- `kind/bug`: Corrige un error recientemente descubierto.
- `kind/cleanup`: Añade pruebas, refactorización, corrección de errores antiguos.
- `kind/design`: Relacionado con el diseño.
- `kind/documentation`: Añade documentación.
- `kind/failing-test`: El caso de prueba de CI está fallando consistentemente.
- `kind/feature`: Nueva funcionalidad.
- `kind/flake`: El caso de prueba de CI muestra fallas intermitentes.

[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs