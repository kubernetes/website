---
title: Empieza a contribuir
slug: start
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 10
---

{{% capture overview %}}

Si quieres empezar a contribuir a la documentación de Kubernetes esta página y su temas enlazados pueden ayudarte a empezar. No necesitas ser un desarrollador o saber escribir de forma técnica para tener un gran impacto en la documentación y experiencia de usuario en Kubernetes! Todo lo que necesitas para los temas en esta página es una [Cuenta en GitHub](https://github.com/join) y un navegador web.

Si estas buscando información sobre cómo comenzar a contribuir a los repositorios de Kubernetes, entonces dirígete a [las guías de la comunidad
Kubernetes](https://github.com/kubernetes/community/blob/master/governance.md)

{{% /capture %}}


{{% capture body %}}

## Lo básico sobre nuestra documentación

La documentación de Kuberentes esta escrita usando Markdown, procesada y
desplegada usando Hugo. El código fuente está en GitHub [https://github.com/kubernetes/website](https://github.com/kubernetes/website).
La mayoría de la documentación está en `/content/es/doc`. Alguna de
la documentación de referencia se genera automática con los scripts del
directorio `update-imported-docks/`.

Puedes clasificar incidencias, editar contenido y revisar cambios de otros, todo ello
desde la página de GitHub. También puedes usar la historia embebida de GitHub  y
las herramientas de búsqueda.

No todas las tareas se pueden realizar desde la interfaz web de GitHub, pero esto
se discute en las guías de contribución a la documentación
[intermedia](/docs/contribute/intermediate/) y
[avanzada](/docs/contribute/advanced/)

### Participar en la documentación de los SIG

La documentación de Kubernetes es mantenida por el 
{{< glossary_tooltip text="Special Interest Group" term_id="sig" >}} (SIG) denominado SIG Docs. Nos comunicamos usando un canal de Slack, una lista de correo
y una reunión semana por video-conferencia. Siempre son bienvenidos nuevos
participantes al grupo. Para más información ver
[Participar en SIG Docs](/docs/contribute/participating/).

### Guías de estilo

Se mantienen unas [guías de estilo](/docs/contribute/style/style-guide/) con la información sobre las elecciones que cada comunidad SIG Docs ha realizado referente a gramática, sintáxis, formato del código fuente y convenciones tipográficas. Revisa la guía de estilos antes de hacer tu primera contribución y úsala para resolver tus dudas.

Los cambios en la guía de estilos se hacen desde el SIG Docs como grupo. Para añadir o proponer cambios [añade esto a tu agenda](https://docs.google.com/document/d/1Ds87eRiNZeXwRBEbFr6Z7ukjbTow5RQcNZLaSvWWQsE/edit#) para las próximas reuniones del SIG Docs y atiende a la reunión para participar en las discusiones. Revisa el apartado [avanzado](/docs/contribute/advanced/) para más información.

### Plantillas para páginas

Se usan plantillas para las páginas de documentación con el objeto de que todas tengan la misma presentación. Asegurate de entender como funcionan estas plantillas y revisa la el apartado [Uso de plantillas para páginas](/docs/contribute/style/page-templates/)

### Hugo shortcodes

La documentación de Kubernetes se transforma a partir de Markdown para obtener HTML usando Hugo. Hay que conocer los shortcodes estándar de Hugo, así como algunos que son personalizados para la documentación de Kubernetes. Revisa [Hugo shortcodes personalizados](/docs/contribute/style/hugo-shortcodes/) para más información de como usarlos.

### Múltiples idiomas

La documentación original está disponible en multiples idiomas en `/content/`. Cada idioma tiene su propia carpeta con el código de dos letras determinado por el [estándar ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php). Por ejemplo, la documentación original en Ingles se encuentra en `/content/en/docs/`.

Para más información sobre contribuir a la documentación en múltiples idiomas revisa ["Localizar contenido"](/docs/contribute/intermediate#localize-content)

Si te interesa empezar una nueva localización revisa ["Localization"](/docs/contribute/localization/).

## Registro de incidencias 

Cualquiera con una cuenta de GitHub puede reportar una incidencia en la documentación de Kubernetes. Si ves algo erróneo, aunque no sepas como resolverlo, [reporta ina incidencia](#cómo-reportar-una-incidencia). La única excepción a esta regla es si se trata de un pequeño error como un que puedes resolver por ti mismo. En este último caso, puedes tratar de [resolverlo](#improve-existing-content) sin necesidad de reportar una incidencia primero.

### Cómo reportar una incidencia

- **En una página existente**

    Si ves un problema en una página existente en la [documentación de Kuberenetes](/docs/) ves al final de la página y haz clic en el botón **Abrir un Issue**. Si no estas autenticado en GitHub hazlo, un formulario de nueva incidencia aparecerá con contenido pre-cargado.

    Utilizando formato Markdown completa con todos los detalles que sea posible. En los lugares en que haya corchetes (`[ ]`) pon una `x` en medio de los corchetes para representar la elección de una opción. Si tiene una posible solución al problema añádela.
    
- **Solicitar una nueva página**

    Si crees que un contenido debería añadirse, pero no estás seguro de donde debería añadirse o si crees que no encaja en en las páginas que ya existen, puedes igualmente crear un incidente. Igualmente puedes elegir una página ya existente donde piensas que pudiera encajar y crear el incidente desde esa página, o ir directamente a [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/) y crear un nuevo  incidente directamente desde allí.

### Cómo reportar correctamente incidencias

Para estar seguros que tu incidencia se entiende y se puede procesar ten en cuenta esta guía:

- Usa la plantilla de incidencia y aporta cuantos más detalles mejor.
- Explica de forma clara el impacto de la incidencia en los usuarios.
- Mantén el alcance de una incidencia a una unidad de trabajo razonable. Para problemas con un alcance muy amplio divídela en incidencias más pequeñas.
    
    Por ejemplo, "Arreglar la documentación de seguridad" no es una incidencia procesable, pero "Añadir detalles en eñ tema 'Restringir acceso a la red'" si lo es.
- Si la incidencia está relacionada con otra o con una petición de cambio puedes referirte a ella tanto por la URL como con el número de la incidencia o petición de cambio con el carácter `#` delante. Por ejemplo `Introducido por #987654`.
- Se respetuoso y evite desahogarse. Por ejemplo, "La documentación sober X apesta" no es útil o una critica constructiva. El [Código de conducta](/community/code-of-conduct/) también aplica para las interacciones en los repositorios de Kubernetes en GitHub.

## Participa en las discusiones de SIG Docs

El equipo de SIG Docs se comunica por las siguientes vías:

- [Únete a la instancia Slack de Kubernetes](http://slack.k8s.io/), entonces unete al canal `#sig-docs`, Donde discutimos sobre las incidencias de documentación en tiempo real. Asegurate de presentarte a ti mismo!
- [Únete a la lista de correo `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), donde tienen lugar las discusiones más amplias y se registras las decisiones oficiales.
- Participa en la videoconferencia [semanal de SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs), ésta se anuncai en el canal de Slack y la lista de correo. Actualmente esta reunión tiene  lugar usando Zoom, por lo que necesitas descargar el [cliente Zoom](https://zoom.us/download) o llamar usando un teléfono.

{{< note >}}
Puedes revisar la reunión semanal de SIG Docs en el [Calendario de reuniones de la comunidad Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
{{< /note >}}

## Mejorar contenido existente

Para mejorar contenido existente crea una _pull request(PR)_ después de crear un _fork_. Estos términos son [específicos de GitHub](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/). Para el propósito de éste punto no necesitas conocer todo sobre ellos porque todo se hace usando un navegador web. Cuando continúes con la [guía de contribución de documentación intermedia](/docs/contribute/intermediate/) entonces necesitaras un poco más de conocimiento de la metodología Git.

{{< note >}}
**Desarrolladores de código de Kubernetes**: Si estás documentando una nueva característica para una versión futura de Kubernetes, entonces el proceso es un poco diferente. Mira el proceso y pautas en [Documentar una característica](/docs/contribute/intermediate/#sig-members-documenting-new-features) así como información sober plazos.
{{< /note >}}

### Firma el CNCF CLA {#firma-el-cla}

Antes de porder contribuir o documentar en Kubernets **debes** leer [Gía del contribuidor](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) y [firmar el `Controbutor License Agreement` (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md). No te preocupes esto no lleva mucho tiempo!

### Búsca algo con lo que trabajar

Si ves algo que quieras arreglar directamente, simplemente sigue las instruccuiones más abajo. No es necesario que [reportes una incidencia][#file-actionable-issues] (de todas formas puedes).

Si quieres empezar por búscar una incidencia existente para trabajar puedes ir [https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues) y búscar una incidencia con la etiqueta  `good first issue` (puedes usar [este](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) atajo). Lee los commentarios y asegurate de que no hay una petición de cambio abierta para esa incidencia y que nadie a dejado un comentario indicando que están trabajando en esa misma incidencia recientemente (3 días es una buena regla). Deja un  comentario indicando que te gustaría trabajar en la incidencia.

### Elije que rama de Git usar

El aspecto más importante a la hora de mandar una petición de cambio es que rama usar como base para trabajar. Usa estas pautas para tomar la decisión:

- Utiliza `master` para arreglar problemas en contenido ya existente publicado, o hacer mejoras en contenido ya existente.
  - Utiliza una rama de versión (cómo `dev-{{< release-branch >}}` para la versión {{< release-branch>}}) para documentar futuras caractristicas o cambios para futuras versiones que todavía no se han publicado.
- Utiliza una rama de características que haya sido acordada por SIG Docs para colaborar en grandes mejoras o cambios en la documentación existente, incluida la reorganización de contenido o cambios en la apariencia del sitio web. 

Si todavía no estás seguro con que ráma utilizar, pregunta en `#sig-docs`en Slack o atiende una reunión semanal del SIG Docs para aclarar tus dudas.

### Enviar una petición de cambio

Sigue estos pasos para enviar una petición de cambio y mejorar la documentación de Kubernetes.

1.  En la páguina que hayas visto una incidencia haz clic en el icono del lápiz arriba a la derecha.
    Una nueva página de GitHub aparecerá con algunos textos de ayuda.
2.  Si nunca has creado un cópia del repositorio de documentación de Kuebernetes le pedirá que lo haga.
    Crea la copia bajo tu usuario de GitHub en lugar de otra organización de la que seas miembro. La copia generalmente tiene una URL como `https://github.com/<username>/website`, a menos que ya tengas un repositorio con un nombre en conflicto con este.

    La razón por la que se pide crear una cópia del repositorio es porque tu no tienes permisos para subir cambios directamente a rama en el repositorio definitivo de Kubernetes.
3.  Aparecerá el editor Markdown de GitHub con el fichero Markdown fuente cargado. Realiza tus cambios. Debajo del editor completa el formulario  **Propose file change**. El primer campo es el resumen del mensaje de tu commit y no debe ser más largo de 50 carácteres. El segundo campo es opcional, pero puede inluir más información y detalles si procede.

    {{< note >}}
    No incluyas referencias a otras incidencias o peticiones de cambio de GitHub en el mensaje de los commits. Esto lo puedes añadir después en la descripción de la petición de cambio.
{{< /note >}}

    Haz clic en **Propose file change**. El cambio se guarda en como un commit en una nueva rama de tu copia, automáticamente se llamara algo como `patch-1`.

4.  La siguiente pantalla resume los cambios que has hecho pudiendo comparar la nueva rama (la **head fork** y cajas de selección **compare**) con el estado actual del **base fork** y la rama **base** (`master` en el respositorio por defecto `kubernetes/website`). Puedes cambiar culquiera de las cjas de selección, pero no lo hagas ahora. Hecha un vistazo a a las distintas vistas en la parte baja de la pantalla y si todo parece correcto haz clic en **Create pull request**.

    {{< note >}}
    Si no quieres crear una petición de cambio ahora puedes hacerlo más adelante, basta con navegar a la URL principal del repositorio de Kubernetes website o de ti copia. La página de GitHub te mostrará un mensaje para crear una petición de cambio si detecta que has subido una nueva rama a tu repositorio cópia.
    {{< /note >}}

5.  La pantalla **Open a pull request** aparece. El tema de una petición de cambio es el resumen del commit, pero puedes cambiarlo si lo necesitas. El cuerpo está pre-cargado con el mensaje del commit extendido (si lo hay) junto con una plantilla. Lee la plantilla y rellena los detalles que requiere, entonces borra le texto extra de la plantilla. Deja la casilla **Allow edits from maintainers** seleccionada. Clica en **Create pull request**.

    Enhorabuena! Tu petición de cambio está disponible en [Pull requests](https://github.com/kubernetes/website/pulls).

    Después de unos minutos ya podrás previsualizar la página con los cambios de tu PR aplicados. Vés a la pestaña **Conversation** en tu PR y haz clic en el enlace **Details** para ver el test `deploy/netlify`, casí al final de la página. Se abrirá en la misma ventana del navegado por defecto.

6.  Wait for review. Generally, reviewers are suggested by the `k8s-ci-robot`.
    If a reviewer asks you to make changes, you can go to the **Files changed**
    tab and click the pencil icon on any files that have been changed by the
    pull request. When you save the changed file, a new commit is created in
    the branch being monitored by the pull request.

7.  If your change is accepted, a reviewer merges your pull request, and the
    change is live on the Kubernetes website a few minutes later.

This is only one way to submit a pull request. If you are already a Git and
GitHub advanced user, you can use a local GUI or command-line Git client
instead of using the GitHub UI. Some basics about using the command-line Git
client are discussed in the [intermediate](/docs/contribute/intermediate/) docs
contribution guide.

## Review docs pull requests

People who are not yet approvers or reviewers can still review pull requests.
The reviews are not considered "binding", which means that your review alone
won't cause a pull request to be merged. However, it can still be helpful. Even
if you don't leave any review comments, you can get a sense of pull request
conventions and etiquette and get used to the workflow.

1.  Go to
    [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    You see a list of every open pull request against the Kubernetes website and
    docs.

2.  By default, the only filter that is applied is `open`, so you don't see
    pull requests that have already been closed or merged. It's a good idea to
    apply the `cncf-cla: yes` filter, and for your first review, it's a good
    idea to add `size/S` or `size/XS`. The `size` label is applied automatically
    based on how many lines of code the PR modifies. You can apply filters using
    the selection boxes at the top of the page, or use
    [this shortcut](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS) for only small PRs. All filters are `AND`ed together, so
    you can't search for both `size/XS` and `size/S` in the same query.

3.  Go to the **Files changed** tab. Look through the changes introduced in the
    PR, and if applicable, also look at any linked issues. If you see a problem
    or room for improvement, hover over the line and click the `+` symbol that
    appears.

      You can type a comment, and either choose **Add single comment** or **Start
      a review**. Typically, starting a review is better because it allows you to
      leave multiple comments and notifies the PR owner only when you have
      completed the review, rather than a separate notification for each comment.

4.  When finished, click **Review changes** at the top of the page. You can
    summarize your review, and you can choose to comment, approve, or request
    changes. New contributors should always choose **Comment**.

Thanks for reviewing a pull request! When you are new to the project, it's a
good idea to ask for feedback on your pull request reviews. The `#sig-docs`
Slack channel is a great place to do this.

## Write a blog post

Anyone can write a blog post and submit it for review. Blog posts should not be
commercial in nature and should consist of content that will apply broadly to
the Kubernetes community.

To submit a blog post, you can either submit it using the
[Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform),
or follow the steps below.

1.  [Sign the CLA](#sign-the-cla) if you have not yet done so.
2.  Have a look at the Markdown format for existing blog posts in the
    [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
3.  Write out your blog post in a text editor of your choice.
4.  On the same link from step 2, click the **Create new file** button. Paste
    your content into the editor. Name the file to match the proposed title of
    the blog post, but don't put the date in the file name. The blog reviewers
    will work with you on the final file name and the date the blog will be
    published.
5.  When you save the file, GitHub will walk you through the pull request
    process.
6.  A blog post reviewer will review your submission and work with you on
    feedback and final details. When the blog post is approved, the blog will be
    scheduled for publication.

## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. They are written in collaboration with the Kubernetes
marketing team, which is handled by the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).
Use the [Kubernetes case study submission form](https://www.cncf.io/people/end-user-community/)
to submit your proposal.

{{% /capture %}}

{{% capture whatsnext %}}

When you are comfortable with all of the tasks discussed in this topic and you
want to engage with the Kubernetes docs team in deeper ways, read the
[intermediate docs contribution guide](/docs/contribute/intermediate/).

{{% /capture %}}
