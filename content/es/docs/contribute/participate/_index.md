---
title: Participar en SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
no_list: true
---

<!-- overview -->

SIG Docs es uno de los
[grupos de interés especial](https://github.com/kubernetes/community/blob/main/sig-list.md)
dentro del proyecto Kubernetes, centrado en escribir, actualizar y mantener
la documentación de Kubernetes en su conjunto. Consulta
[SIG Docs en el repositorio de GitHub de la comunidad](https://github.com/kubernetes/community/tree/main/sig-docs)
para obtener más información sobre el SIG.

SIG Docs recibe con agrado contenido y revisiones de todas las personas
colaboradoras. Cualquiera puede abrir una solicitud de cambios (PR), y
cualquiera puede informar de problemas relacionados con el contenido o
comentar en las solicitudes de cambios en curso.

También puedes convertirte en
[miembro](/docs/contribute/participate/roles-and-responsibilities/#members),
[revisor](/docs/contribute/participate/roles-and-responsibilities/#reviewers) o
[aprobador](/docs/contribute/participate/roles-and-responsibilities/#approvers).
Estos roles requieren un mayor nivel de acceso y conllevan ciertas
responsabilidades para aprobar y hacer commit de cambios. Consulta
[la pertenencia a la comunidad](https://github.com/kubernetes/community/blob/main/community-membership.md)
para obtener más información sobre cómo funciona la pertenencia a la comunidad
de Kubernetes.

El resto de este documento describe algunas formas particulares en las que
funcionan estos roles dentro de SIG Docs, que se encarga de mantener uno de los
aspectos más visibles para el público de Kubernetes: el sitio web y la
documentación de Kubernetes.

<!-- body -->

## Presidencia de SIG Docs

Cada SIG, incluido SIG Docs, elige a uno o más miembros del SIG para ejercer la
presidencia. Estas personas son puntos de contacto entre SIG Docs y otras
partes de la organización de Kubernetes. Requieren un conocimiento amplio de la
estructura del proyecto Kubernetes en su conjunto y del funcionamiento de SIG
Docs. Consulta [Liderazgo](https://github.com/kubernetes/community/tree/main/sig-docs#leadership)
para ver la lista actual de presidentes.

## Equipos y automatización de SIG Docs

La automatización de SIG Docs depende de dos mecanismos diferentes:
los equipos de GitHub y los archivos OWNERS.

### Equipos de GitHub

En GitHub hay dos categorías de
[equipos](https://github.com/orgs/kubernetes/teams?query=sig-docs) de SIG Docs:

- `@sig-docs-{language}-owners` son aprobadores y responsables
- `@sig-docs-{language}-reviews` son revisores

Puedes mencionar a cada equipo con su `@name` en los comentarios de GitHub para
comunicarte con todas las personas que forman parte de ese grupo.

A veces Prow y los equipos de GitHub se solapan sin coincidir exactamente. Para
asignar problemas y solicitudes de cambios, y para respaldar la aprobación de
solicitudes de cambios, la automatización utiliza la información de los
archivos OWNERS.

### Archivos OWNERS y front matter

El proyecto Kubernetes utiliza una herramienta de automatización llamada Prow
para automatizar las incidencias y las solicitudes de cambios de GitHub. El
[repositorio del sitio web de Kubernetes](https://github.com/kubernetes/website)
utiliza dos [plugins de Prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Estos dos plugins utilizan los archivos
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) y
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
del nivel superior del repositorio de GitHub `kubernetes/website` para
controlar el funcionamiento de Prow dentro del repositorio.

Un archivo OWNERS contiene una lista de revisores y aprobadores de SIG Docs. Los
archivos OWNERS también pueden existir en subdirectorios y pueden sustituir a
las personas que pueden actuar como revisores o aprobadores de los archivos de
ese subdirectorio y sus descendientes. Para obtener más información sobre los
archivos OWNERS en general, consulta
[OWNERS](https://github.com/kubernetes/community/blob/main/contributors/guide/owners.md).

Además, un archivo Markdown individual puede incluir revisores y aprobadores en
su front matter, ya sea mediante nombres de usuario individuales de GitHub o
grupos de GitHub.

La combinación de los archivos OWNERS y el front matter de los archivos
Markdown determina los consejos que los propietarios de las solicitudes de
cambios reciben de los sistemas automatizados sobre a quién solicitar una
revisión técnica y editorial.

## Cómo funciona la fusión

Cuando una solicitud de cambios se fusiona en la rama utilizada para publicar
contenido, ese contenido se publica en https://kubernetes.io. Para garantizar
la alta calidad del contenido publicado, limitamos la fusión de solicitudes de
cambios a los aprobadores de SIG Docs. Así es como funciona.

- Cuando una solicitud de cambios tiene las etiquetas `lgtm` y `approve`, no tiene
  etiquetas `hold` y todas las pruebas pasan, la solicitud de cambios se fusiona
  automáticamente.
- Los miembros de la organización Kubernetes y los aprobadores de SIG Docs
  pueden añadir comentarios para impedir la fusión automática de una solicitud
  de cambios (añadiendo un comentario `/hold` o no añadiendo un comentario
  `/lgtm`).
- Cualquier miembro de Kubernetes puede añadir la etiqueta `lgtm` escribiendo un
  comentario `/lgtm`.
- Solo los aprobadores de SIG Docs pueden fusionar una solicitud de cambios
  añadiendo un comentario `/approve`. Algunos aprobadores también desempeñan
  funciones específicas adicionales, como [coordinador de PR](/docs/contribute/participate/pr-wranglers/)
  o [presidente de SIG Docs](#presidencia-de-sig-docs).

## {{% heading "whatsnext" %}}

Para obtener más información sobre cómo participar en SIG Docs, consulta:

- [Roles y responsabilidades](/docs/contribute/participate/roles-and-responsibilities/)
- [Coordinadores de incidencias](/docs/contribute/participate/issue-wrangler/)
- [Coordinadores de PR](/docs/contribute/participate/pr-wranglers/)

Para obtener más información sobre cómo contribuir a la documentación de
Kubernetes, consulta:

- [Contribuir con contenido nuevo](/docs/contribute/new-content/)
- [Revisar contenido](/docs/contribute/review/reviewing-prs)
- [Guía de estilo de la documentación](/docs/contribute/style/)