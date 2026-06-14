---
title: Lanzamientos de parches (Patch Releases)
type: docs
---

Calendario e información de contacto del equipo para los lanzamientos de parches de Kubernetes.

Para obtener información general sobre el ciclo de lanzamientos de Kubernetes, consulta la
[descripción del proceso de lanzamiento].

## Cadencia

Nuestra cadencia habitual para los lanzamientos de parches es mensual. Por lo general,
es un poco más rápida (de 1 a 2 semanas) para los primeros lanzamientos de parches
después de una versión menor 1.X. Las correcciones de errores críticos pueden provocar un
lanzamiento más inmediato fuera de la cadencia normal. También procuramos no realizar
lanzamientos durante los principales periodos de vacaciones.

## Contacto

Consulta la [página de Release Managers][release-managers] para obtener los detalles completos de contacto del equipo de Patch Release.

Por favor, danos un día hábil para responder, ¡es posible que estemos en una zona horaria diferente!

Entre lanzamientos, el equipo revisa las solicitudes de *cherry pick* entrantes de forma semanal.
El equipo se pondrá en contacto con los autores de las solicitudes a través de la PR de GitHub,
los canales de SIG en Slack, mensajes directos en Slack y por [correo electrónico](mailto:release-managers-private@kubernetes.io)
si surgen preguntas sobre la PR.

## Cherry picks

Por favor, sigue el [proceso de cherry pick][cherry-picks].

Los cherry picks deben estar listos para fusionarse en GitHub con las etiquetas adecuadas (por ejemplo,
`approved`, `lgtm`, `release-note`) y haber superado las pruebas de CI antes de la fecha límite de cherry pick.
Esto suele ser dos días antes del lanzamiento previsto, pero podría ser más. Es mejor tener la PR lista lo antes posible,
ya que necesitamos tiempo para obtener la señal de CI después de fusionar tus *cherry picks* antes del lanzamiento real.

Las PR de cherry pick que no cumplan con los criterios de fusión se pospondrán y se les hará seguimiento para el próximo lanzamiento de parches.

## Periodo de soporte

De acuerdo con el [KEP de soporte anual][yearly-support], la comunidad de Kubernetes
soportará las series activas de lanzamientos de parches por un periodo de aproximadamente
catorce (14) meses.

Los primeros doce meses de este marco temporal se considerarán el periodo estándar.

Hacia el final del duodécimo mes, ocurrirá lo siguiente:

- Los [Release Managers][release-managers] generarán un lanzamiento.
- La serie de lanzamientos de parches entrará en modo de mantenimiento.

Durante el periodo de dos meses en modo de mantenimiento, los Release Managers pueden generar
lanzamientos de mantenimiento adicionales para resolver:

- [Vulnerabilidades](/docs/reference/issues-security/official-cve-feed/) que tengan un ID de CVE asignado
  (bajo la asesoría del Security Response Committee).
- Problemas de dependencias (incluyendo actualizaciones de imágenes base).
- Problemas críticos de los componentes principales.

Al final del periodo de dos meses en modo de mantenimiento, la serie de lanzamientos de parches
se considerará EOL (fin de vida útil) y los cherry picks hacia la rama asociada se cerrarán poco tiempo después.

Ten en cuenta que se eligió el día 28 del mes como fecha objetivo para el modo de mantenimiento y EOL por simplicidad (todos los meses lo tienen).

## Próximos lanzamientos mensuales

Los cronogramas pueden variar según la gravedad de las correcciones de errores, pero para facilitar la planificación,
nos fijaremos los siguientes puntos de lanzamiento mensuales. También pueden ocurrir lanzamientos críticos no planificados entre estos.

{{< upcoming-releases >}}

## Historial de lanzamientos detallado para ramas activas

{{< release-branches >}}

## Historial de ramas no activas

Estos lanzamientos ya no cuentan con soporte.

{{< eol-releases >}}

[cherry-picks]: https://github.com/kubernetes/community/blob/main/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[release process description]: /releases/release
[yearly-support]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md