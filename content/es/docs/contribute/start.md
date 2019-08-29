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

Si estas buscando información sobre cómo comenzar a contribuir a los repositorios de Kubernetes, entonces dirígete a [las guías de la comunidad Kubernetes](https://github.com/kubernetes/community/blob/master/governance.md)

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

No todas las tareas se pueden realizar desde la interfaz web de GitHub, también
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

Se mantienen unas [guías de estilo](/docs/contribute/style/style-guide/) con la información sobre las elecciones que cada comunidad SIG Docs ha realizado referente a gramática, sintaxis, formato del código fuente y convenciones tipográficas. Revisa la guía de estilos antes de hacer tu primera contribución y úsala para resolver tus dudas.

Los cambios en la guía de estilos se hacen desde el SIG Docs como grupo. Para añadir o proponer cambios [añade esto a tu agenda](https://docs.google.com/document/d/1Ds87eRiNZeXwRBEbFr6Z7ukjbTow5RQcNZLaSvWWQsE/edit#) para las próximas reuniones del SIG Docs y participe en las discusiones durante la reunión. Revisa el apartado [avanzado](/docs/contribute/advanced/) para más información.

### Plantillas para páginas

Se usan plantillas para las páginas de documentación con el objeto de que todas tengan la misma presentación. Asegurate de entender como funcionan estas plantillas y revisa el apartado [Uso de plantillas para páginas](/docs/contribute/style/page-templates/)

### Hugo shortcodes

La documentación de Kubernetes se transforma a partir de Markdown para obtener HTML usando Hugo. Hay que conocer los shortcodes estándar de Hugo, así como algunos que son personalizados para la documentación de Kubernetes. Para más información de como usarlos revisa [Hugo shortcodes personalizados](/docs/contribute/style/hugo-shortcodes/).

### Múltiples idiomas

La documentación original está disponible en múltiples idiomas en `/content/`. Cada idioma tiene su propia carpeta con el código de dos letras determinado por el [estándar ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php). Por ejemplo, la documentación original en Ingles se encuentra en `/content/en/docs/`.

Para más información sobre como contribuir a la documentación en múltiples idiomas revisa ["Localizar contenido"](/docs/contribute/intermediate#localize-content)

Si te interesa empezar una nueva localización revisa ["Localization"](/docs/contribute/localization/).

## Registro de incidencias

Cualquier persona con una cuenta de GitHub puede reportar una incidencia en la documentación de Kubernetes. Si ves algo erróneo, aunque no sepas como resolverlo, [reporta una incidencia](#cómo-reportar-una-incidencia). La única excepción a la regla es si se trata de un pequeño error, como alguno que puedes resolver por ti mismo. En este último caso, puedes tratar de [resolverlo](#improve-existing-content) sin necesidad de reportar una incidencia primero.

### Cómo reportar una incidencia

- **En una página existente**

    Si ves un problema en una página existente en la [documentación de Kuberenetes](/docs/) ve al final de la página y haz clic en el botón **Abrir un Issue**. Si no estas autenticado en GitHub hazlo, un formulario de nueva incidencia aparecerá con contenido pre-cargado.

    Utilizando formato Markdown completa todos los detalles que sea posible. En los lugares en que haya corchetes (`[ ]`) pon una `x` en medio de los corchetes para representar la elección de una opción. Si tienes una posible solución al problema añádela.

- **Solicitar una nueva página**

    Si crees que un contenido debería añadirse, pero no estás seguro de donde debería añadirse o si crees que no encaja en las páginas que ya existen, puedes crear un incidente. También puedes elegir una página ya existente donde pienses que pudiera encajar y crear el incidente desde esa página, o ir directamente a [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/) y crear un nuevo incidente directamente desde allí.

### Cómo reportar correctamente incidencias

Para estar seguros que tu incidencia se entiende y se puede procesar ten en cuenta esta guía:

- Usa la plantilla de incidencia y aporta detalles, cuantos más es mejor.
- Explica de forma clara el impacto de la incidencia en los usuarios.
- Mantén el alcance de una incidencia a una unidad de trabajo razonable. Para problemas con un alcance muy amplio divídela en incidencias más pequeñas.

    Por ejemplo, "Arreglar la documentación de seguridad" no es una incidencia procesable, pero "Añadir detalles en el tema 'Restringir acceso a la red'" si lo es.
- Si la incidencia está relacionada con otra o con una petición de cambio puedes referirte a ella tanto por la URL como con el número de la incidencia o petición de cambio con el carácter `#` delante. Por ejemplo `Introducido por #987654`.
- Se respetuoso y evite desahogarse. Por ejemplo, "La documentación sobre X apesta" no es útil o una critica constructiva. El [Código de conducta](/community/code-of-conduct/) también aplica para las interacciones en los repositorios de Kubernetes en GitHub.

## Participa en las discusiones de SIG Docs

El equipo de SIG Docs se comunica por las siguientes vías:

- [Únete a la instancia Slack de Kubernetes](http://slack.k8s.io/), entonces únete al canal `#sig-docs`, Donde discutimos sobre las incidencias de documentación en tiempo real. Asegurate de presentarte!
- [Únete a la lista de correo `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), donde tienen lugar las discusiones más amplias y se registras las decisiones oficiales.
- Participa en la video-conferencia [semanal de SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs), ésta se anuncia en el canal de Slack y la lista de correo. Actualmente esta reunión tiene lugar usando Zoom, por lo que necesitas descargar el [cliente Zoom](https://zoom.us/download) o llamar usando un teléfono.

{{< note >}}
Puedes revisar la reunión semanal de SIG Docs en el [Calendario de reuniones de la comunidad Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
{{< /note >}}

## Mejorar contenido existente

Para mejorar contenido existente crea una _pull request(PR)_ después de crear un _fork_. Estos términos son [específicos de GitHub](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/). No es necesario conocer todo sobre estos términos porque todo se realiza a traves del navegador web. Cuando continúes con la [guía de contribución de documentación intermedia](/docs/contribute/intermediate/) entonces necesitaras un poco más de conocimiento de la metodología Git.

{{< note >}}
**Desarrolladores de código de Kubernetes**: Si estás documentando una nueva característica para una versión futura de Kubernetes, entonces el proceso es un poco diferente. Mira el proceso y pautas en [Documentar una característica](/docs/contribute/intermediate/#sig-members-documenting-new-features) así como información sobre plazos.
{{< /note >}}

### Firma el CNCF CLA {#firma-el-cla}

Antes de poder contribuir o documentar en Kubernetes **debes** leer [Guía del contribuidor](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) y [firmar el `Contributor License Agreement` (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md). No te preocupes esto no lleva mucho tiempo!

### Busca algo con lo que trabajar

Si ves algo que quieras arreglar directamente, simplemente sigue las instrucciones más abajo. No es necesario que [reportes una incidencia][#file-actionable-issues] (aunque de todas formas puedes).

Si quieres empezar por buscar una incidencia existente para trabajar puedes ir [https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues) y buscar una incidencia con la etiqueta  `good first issue` (puedes usar [este](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) atajo). Lee los comentarios y asegurate de que no hay una petición de cambio abierta para esa incidencia y que nadie a dejado un comentario indicando que están trabajando en esa misma incidencia recientemente (3 días es una buena regla). Deja un  comentario indicando que te gustaría trabajar en la incidencia.

### Elije que rama de Git usar

El aspecto más importante a la hora de mandar una petición de cambio es que rama usar como base para trabajar. Usa estas pautas para tomar la decisión:

- Utiliza `master` para arreglar problemas en contenido ya existente publicado, o hacer mejoras en contenido ya existente.
  - Utiliza una rama de versión (cómo `dev-{{< release-branch >}}` para la versión {{< release-branch>}}) para documentar futuras características o cambios para futuras versiones que todavía no se han publicado.
- Utiliza una rama de características que haya sido acordada por SIG Docs para colaborar en grandes mejoras o cambios en la documentación existente, incluida la reorganización de contenido o cambios en la apariencia del sitio web.

Si todavía no estás seguro con que rama utilizar, pregunta en `#sig-docs`en Slack o atiende una reunión semanal del SIG Docs para aclarar tus dudas.

### Enviar una petición de cambio

Sigue estos pasos para enviar una petición de cambio y mejorar la documentación de Kubernetes.

1.  En la página que hayas visto una incidencia haz clic en el icono del lápiz arriba a la derecha.
    Una nueva página de GitHub aparecerá con algunos textos de ayuda.
2.  Si nunca has creado un copia del repositorio de documentación de Kubernetes le pedirá que lo haga.
    Crea la copia bajo tu usuario de GitHub en lugar de otra organización de la que seas miembro. La copia generalmente tiene una URL como `https://github.com/<username>/website`, a menos que ya tengas un repositorio con un nombre en conflicto con este.

    La razón por la que se pide crear una copia del repositorio es porque tu no tienes permisos para subir cambios directamente a rama en el repositorio definitivo de Kubernetes.
3.  Aparecerá el editor Markdown de GitHub con el fichero Markdown fuente cargado. Realiza tus cambios. Debajo del editor completa el formulario  **Propose file change**. El primer campo es el resumen del mensaje de tu commit y no debe ser más largo de 50 caracteres. El segundo campo es opcional, pero puede incluir más información y detalles si procede.

    {{< note >}}
    No incluyas referencias a otras incidencias o peticiones de cambio de GitHub en el mensaje de los commits. Esto lo puedes añadir después en la descripción de la petición de cambio.
{{< /note >}}

    Haz clic en **Propose file change**. El cambio se guarda en como un commit en una nueva rama de tu copia, automáticamente se llamara algo como `patch-1`.

4.  La siguiente pantalla resume los cambios que has hecho pudiendo comparar la nueva rama (la **head fork** y cajas de selección **compare**) con el estado actual del **base fork** y la rama **base** (`master` en el repositorio por defecto `kubernetes/website`). Puedes cambiar cualquiera de las cajas de selección, pero no lo hagas ahora. Hecha un vistazo a las distintas vistas en la parte baja de la pantalla y si todo parece correcto haz clic en **Create pull request**.

    {{< note >}}
    Si no deseas crear una petición de cambio puedes hacerlo más delante, solo basta con navegar a la URL principal del repositorio de Kubernetes website o de tu copia. La página de GitHub te mostrará un mensaje para crear una petición de cambio si detecta que has subido una nueva rama a tu repositorio copia.
    {{< /note >}}

5.  La pantalla **Open a pull request** aparece. El tema de una petición de cambio es el resumen del commit, pero puedes cambiarlo si lo necesitas. El cuerpo está pre-cargado con el mensaje del commit extendido (si lo hay) junto con una plantilla. Lee la plantilla y llena los detalles requeridos, entonces borra el texto extra de la plantilla. Deja la casilla **Allow edits from maintainers** seleccionada. Haz clic en **Create pull request**.

    Enhorabuena! Tu petición de cambio está disponible en [Pull requests](https://github.com/kubernetes/website/pulls).

    Después de unos minutos ya podrás pre-visualizar la página con los cambios de tu PR aplicados. Ve a la pestaña de **Conversation** en tu PR y haz clic en el enlace **Details** para ver el test `deploy/netlify`, localizado casi al final de la página. Se abrirá en la misma ventana del navegado por defecto.

6.  Espera una revisión. Generalmente `k8s-ci-robot`sugiere unos revisores. Si un revisor te pide que hagas cambios puedes ir a la pestaña **FilesChanged** y hacer clic en el icono del lápiz para hacer tus cambios en cualquiera de los ficheros en la petición de cambio. Cuando guardes los cambios se creará un commit en la rama asociada a la petición de cambio.

7.  Si tu cambio es aceptado, un revisor fusionará tu petición de cambio y tus cambios serán visibles en uno pocos minutos en la el website de Kubernetes.

Esta es solo una forma de mandar una petición de cambio. Si eres un usuario de Git y GitHub avanzado puedes usar una aplicación GUI local o la linea de comandos con el cliente Git en lugar de usar la UI de GitHub. Algunos conceptos básicos sobre el uso de la línea de comandos Git
cliente se discuten en la guía de documentación [intermedia](/docs/contribute/intermediate/).

## Revisar peticiones de cambio de documentación

Las personas que aun no son aprobadores o revisores todavía pueden revisar peticiones de cambio. Las revisiones no se consideran "vinculantes", lo que significa que su revisión por sí sola no hará que se fusionen las peticiones de cambio. Sin embargo, aún puede ser útil. Incluso si no deja ningún comentario de revisión, puede tener una idea de las convenciones y etiquetas en una petición de cambio y acostumbrarse al flujo de trabajo.

1. Ve a [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls). Desde ahí podrás ver una lista de todas las peticiones de cambio en la documentación del website de Kubernetes.

2.  Por defecto el único filtro que se aplica es `open`, por lo que no puedes ver las que ya se han cerrado o fusionado. Es una buena idea aplicar el filtro `cncf-cla: yes` y para tu primera revisión es una buena idea añadir `size/S` o `size/XS`. La etiqueta `size` se aplica automáticamente basada en el número de lineas modificadas en la PR. Puedes aplicar filtros con las cajas de selección al principio de la página, o usar [estos atajos](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS) solo para PRs pequeñas. Los filtros son aplicados con `AND` todos juntos, por lo que no se puede buscar a la vez `size/S` y `size/XS` en la misma consulta.

3.  Ve a la pestaña **Files changed**. Mira los cambios introducidos en la PR, y si aplica, mira también los incidentes enlazados. Si ves un algún problema o posibilidad de mejora pasa el cursor sobre la linea y haz clic en el símbolo `+` que aparece.

    Puedes entonces dejar un comentario seleccionando **Add single comment** o **Start a review**. Normalmente empezar una revisión es mejor porque te permite hacer varios comentarios y avisar a propietario de la PR solo cuando tu revisión este completada, en lugar de notificar cada comentario.

4.  Cuando has acabado, haz clic en **Review changes** en la parte superior de la página. Puedes ver un resumen de la revisión y puedes elegir entre comentar, aprobar o solicitar cambios. Los nuevos contribuidores siempre deben elegir **Comment**.

Gracias por revisar una petición de cambio! Cuando eres nuevo en un proyecto es buena idea solicitar comentarios y opiniones en las revisiones de una petición de cambio. Otro buen lugar para solicitar comentarios es en la canal de Slack `#sig-docs`.

## Escribir un artículo en el blog

Cualquiera puede escribir un articulo en el blog y enviarlo para revisión. Los artículos del blog no deben ser comerciales y deben consistir en contenido que se pueda aplicar de la forma más amplia posible a la comunidad de Kubernetes.

Para enviar un artículo al blog puedes hacerlo también usando el formulario [Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform), o puedes seguir los siguientes pasos.

1.  [Firma el CLA](#sign-the-cla) si no lo has hecho ya.
2.  Revisa el formato Markdown en los artículos del blog existentes en el [repositorio website](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
3.  Escribe tu artículo usando el editor de texto que prefieras.
4.  En el mismo enlace que el paso 2 haz clic en botón **Create new file**. Pega el contenido de tu editor. Nombra el fichero para que coincida con el título del artículo, pero no pongas la fecha en el nombre. Los revisores del blog trabajarán contigo en el nombre final del fichero y la fecha en la que será publicado.
5.  Cuando guardes el fichero GitHub te guiará en el proceso de petición de cambio.
6.  Un revisor de artículos del blog revisará tu envío y trabajará contigo aportando comentarios y los detalles finales. Cuando el artículo sea aprobado se establecerá una fecha de publicación.

## Envía un caso de estudio

Un caso de estudio destaca como organizaciones están usando Kubernetes para resolver problemas del mundo real. Estos se escriben en colaboración con el equipo de marketing de Kubernetes que está dirigido por la {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Revisa el código fuente para ver los [casos de estudio existentes](https://github.com/kubernetes/website/tree/master/content/en/case-studies). Usa el formulario [Kubernetes case study submission form](https://www.cncf.io/people/end-user-community/) para enviar tu propuesta.

{{% /capture %}}

{{% capture whatsnext %}}

Cuando tengas claras las tareas mostradas en este tema y quieras formar parte del equipo de documentación de Kubernetes de una forma más activa lee la [guía intermedia de contribución](/docs/contribute/intermediate/).

{{% /capture %}}
