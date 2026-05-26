---
title: Release Managers
type: docs
---

"Release Managers" es un término general que abarca al conjunto de colaboradores de Kubernetes
responsables de mantener las ramas de lanzamiento y de crear los lanzamientos utilizando
las herramientas proporcionadas por SIG Release.

Las responsabilidades de cada rol se describen a continuación.

- [Contacto](#contacto)
  - [Política de Embargo de Seguridad](#política de embargo de seguridad)
- [Manuales (Handbooks)](#manuales-handbooks)
- [Release Managers](#release-managers)
  - [Cómo convertirse en Release Manager](#cómo-convertirse-en-release-manager)
- [Release Manager Associates](#release-manager-associates)
  - [Cómo convertirse en Release Manager Associate](#cómo-convertirse-en-release-manager-associate)
- [Líderes de SIG Release (SIG Release Leads)](#lideres-de-sig-release-sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)

## Contacto

| Mailing List | Slack | Visibility | Usage | Membership |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (canal) / @release-managers (grupo de usuarios) | Público | Discusión pública para Release Managers | Todos los Release Managers (incluyendo Associates y SIG Chairs) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Privado | Discusión privada para Release Managers privilegiados | Release Managers, liderazgo de SIG Release |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (canal) / @security-rel-team (grupo de usuarios) | Privado | Coordinación de lanzamientos de seguridad con el Security Response Committee | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Política de Embargo de Seguridad

Cierta información sobre los lanzamientos está sujeta a embargo y hemos definido una política sobre
cómo se establecen dichos embargos. Por favor, consulta la
[Política de Embargo de Seguridad](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)
para obtener más información.

## Manuales (Handbooks)

**NOTA: El manual del Patch Release Team y el de Branch Managers se unificarán en un único documento más adelante.**

- [Patch Release Team][handbook-patch-release]
- [Branch Managers][handbook-branch-mgmt]

## Release Managers

**Nota:** La documentación puede hacer referencia al Patch Release Team y al rol de
Branch Management. Estos dos roles se consolidaron en el
rol de Release Managers.

Los requisitos mínimos para los Release Managers y Release Manager Associates son:

- Familiaridad con comandos básicos de Unix y capacidad para depurar scripts de shell.
- Familiaridad con flujos de trabajo de código fuente basados en ramas mediante
  `git` y las invocaciones asociadas de la línea de comandos de `git`.
- Conocimiento general de Google Cloud (Cloud Build y Cloud Storage).
- Disposición para buscar ayuda y comunicarse con claridad.
- Membresía de la Comunidad de Kubernetes [membership][community-membership].

Los Release Managers son responsables de:

- Coordinar y generar los lanzamientos de Kubernetes:
  - Lanzamientos de parches (`x.y.z`, donde `z` > 0)
  - Lanzamientos menores (`x.y.z`, donde `z` = 0)
  - Prelanzamientos (alpha, beta y release candidates)
  - Trabajar junto con el [Release Team][release-team] a lo largo de cada
    ciclo de lanzamiento
  - Establecer el [calendario y la cadencia para los lanzamientos de parches][patches]
- Mantener las ramas de lanzamiento:
  - Revisar *cherry picks*
  - Garantizar que la rama de lanzamiento permanezca saludable y que no se fusione ningún
    parche no intencionado
- Guiar y asesorar al grupo de [Release Manager Associates](#release-manager-associates)
- Desarrollar activamente características y mantener el código en `k/release`
- Apoyar a los Release Manager Associates y colaboradores mediante la participación activa en el programa de acompañamiento (*Buddy program*)
  - Realizar revisiones mensuales con los Associates, delegar tareas, facultarlos para generar lanzamientos y actuar como mentor
  - Estar disponible para apoyar a los Associates en la incorporación de nuevos colaboradores, por ejemplo, respondiendo preguntas y sugiriendo tareas adecuadas para realizar

Este equipo trabaja en ocasiones en estrecha colaboración con el [Security Response Committee][src] y, por lo tanto, debe cumplir con las directrices establecidas en el [Proceso de Lanzamiento de Seguridad][security-release-process].

Controles de acceso en GitHub: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

Menciones en GitHub: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Cómo convertirse en Release Manager

To convertirse en Release Manager, primero se debe haber desempeñado el rol de Release Manager
Associate. Los Associates ascienden a Release Manager al trabajar activamente en los
lanzamientos durante varios ciclos y al:

- demostrar la voluntad de liderar
- hacer equipo con los Release Managers en los parches, para eventualmente generar un lanzamiento de forma
  independiente
  - debido a que los lanzamientos tienen una función limitante, también consideramos las contribuciones sustanciales a la promoción de imágenes y otras tareas principales de Release Engineering
- cuestionar la forma en que trabajan los Associates, sugiriendo mejoras, recopilando comentarios y coordinando el cambio
- ser confiable y receptivo
- orientarse hacia trabajos avanzados que requieran acceso y 
  privilegios de nivel de Release Manager para completarse.

## Release Manager Associates

Los Release Manager Associates son aprendices de los Release Managers, anteriormente conocidos como "Release Manager shadows". Son responsables de:

- Trabajo relacionado con los lanzamientos de parches y revisión de *cherry picks*
- Contribuir a `k/release`: actualizar dependencias y familiarizarse con la base de código fuente
- Contribuir a la documentación: mantener los manuales y asegurar que los procesos de lanzamiento estén documentados
- Con la ayuda de un Release Manager: trabajar con el Release Team durante el ciclo de lanzamiento y generar lanzamientos de Kubernetes
- Buscar oportunidades para ayudar con la priorización y la comunicación
  - Enviar preanuncios y actualizaciones sobre los lanzamientos de parches
  - Actualizar el calendario, ayudando con las fechas de lanzamiento y los hitos del [cronograma del ciclo de lanzamiento][k-sig-release-releases]
- A través del programa *Buddy*, incorporar a nuevos colaboradores y trabajar en pareja con ellos en distintas tareas.

Menciones en GitHub: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Cómo convertirse en Release Manager Associate

Los colaboradores pueden convertirse en Associates demostrando lo siguiente:

- participación constante, incluyendo de 6 a 12 meses de trabajo activo relacionado con la ingeniería de lanzamientos
- experiencia desempeñando un rol de líder técnico (technical lead) en el Release Team durante un ciclo de lanzamiento
  - esta experiencia proporciona una base sólida para entender cómo funciona SIG Release en general, incluyendo nuestras expectativas sobre habilidades técnicas, comunicación/receptividad y confiabilidad
- trabajar en elementos de `k/release` que mejoren nuestras interacciones con Testgrid, limpiar bibliotecas, etc.
  - estos esfuerzos requieren interactuar y trabajar en pareja con los Release Managers y Associates.

## Líderes de SIG Release (SIG Release Leads)

Los SIG Release Chairs y Technical Leads son responsables de:

- La gobernanza de SIG Release
- Dirigir sesiones de intercambio de conocimientos para Release Managers y Associates
- Ofrecer asesoría sobre liderazgo y priorización

Se mencionan explícitamente aquí ya que son los propietarios de los diversos canales de comunicación y grupos de permisos (equipos de GitHub, acceso a GCP) para cada rol. Como tales, son miembros de la comunidad altamente privilegiados y tienen acceso a algunas comunicaciones privadas, que en ocasiones pueden estar relacionadas con divulgaciones de seguridad de Kubernetes.

Equipo de GitHub: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Chairs

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Technical Leads

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Los Branch Managers anteriores se pueden encontrar en el [directorio de lanzamientos][k-sig-release-releases] del repositorio `kubernetes/sig-release` dentro de `release-x.y/release_team.md`.

Ejemplo: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md