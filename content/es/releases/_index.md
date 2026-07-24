---
linktitle: Historial de versiones
title: Versiones
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

El proyecto Kubernetes mantiene ramas de lanzamiento para las tres versiones menores más recientes
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 y versiones posteriores reciben
[aproximadamente 1 año de soporte para parches](/releases/patch-releases/#support-period).
Kubernetes 1.18 y versiones anteriores recibieron aproximadamente 9 meses de soporte para parches.

Las versiones de Kubernetes se expresan como **x.y.z**,
donde **x** es la versión mayor, **y** es la versión menor, y **z** es la versión de parche,
siguiendo la [Nomenclatura de Versionado Semántico](https://semver.org/).

Más información en el documento de [política de desviación de versión](/releases/version-skew-policy/).

<!-- body -->

## Historial de versiones

{{< release-data >}}

## Versiones al final de su vida útil

Las versiones anteriores de Kubernetes que ya no se mantienen se enumeran a continuación.

<details>
  <summary>Versiones al final de su vida útil</summary>
  {{< note >}}
  Estas versiones ya no son compatibles y no reciben actualizaciones de seguridad ni correcciones de errores.
  Si está ejecutando una de estas versiones, el proyecto Kubernetes recomienda encarecidamente actualizar a una [versión compatible](#release-history).
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## Próxima versión

¡Consulta el [calendario](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
para la próxima versión de Kubernetes **{{< skew nextMinorVersion >}}**!

{{< note >}}
Este enlace al calendario puede no estar disponible temporalmente durante las primeras fases de planificación de la versión.
Consulta el [repositorio de SIG Release](https://github.com/kubernetes/sig-release/tree/master/releases) para conocer las últimas actualizaciones.
{{< /note >}}

## Recursos útiles

Consulte los recursos del [Equipo de lanzamiento de Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)
para obtener información clave sobre las funciones y el proceso de lanzamiento.

