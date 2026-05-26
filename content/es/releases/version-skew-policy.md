---
reviewers:
- sig-docs-es-reviews
title: Política de desfase de versiones (Version Skew Policy)
type: docs
description: >
  El desfase máximo de versiones soportado entre los diferentes componentes de Kubernetes.
---

Este documento describe el desfase máximo de versiones soportado entre los diferentes componentes de Kubernetes.
Las herramientas específicas de despliegue de clusters pueden imponer restricciones adicionales sobre este desfase.

## Versiones soportadas

Las versiones de Kubernetes se expresan como **x.y.z**, donde **x** es la versión mayor,
**y** es la versión menor y **z** es la versión de parche, siguiendo la terminología de
[Alineación de Versiones Semánticas](https://semver.org/). Para más información, consulta
[Kubernetes Release Versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning).

El proyecto Kubernetes mantiene ramas de lanzamiento para las tres versiones menores más recientes
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 y versiones posteriores reciben [aproximadamente 1 año de soporte para parches](/releases/patch-releases/#support-period).
Kubernetes 1.18 y versiones anteriores recibían aproximadamente 9 meses de soporte para parches.

Las correcciones aplicables, incluidas las de seguridad, pueden adaptarse a esas tres ramas de lanzamiento,
dependiendo de la gravedad y la viabilidad. Los lanzamientos de parches se generan desde esas ramas con una
[cadencia regular](/releases/patch-releases/#cadence), además de lanzamientos urgentes adicionales cuando es necesario.

El grupo de [Release Managers](/releases/release-managers/) es el propietario de esta decisión.

Para más información, consulta la página de [lanzamientos de parches](/releases/patch-releases/) de Kubernetes.

## Desfase de versiones soportado

### kube-apiserver

En [clusters de alta disponibilidad (HA)](/docs/setup/production-environment/tools/kubeadm/high-availability/),
las instancias de `kube-apiserver` más recientes y más antiguas deben estar dentro del rango de una versión menor.

Ejemplo:

* el `kube-apiserver` más reciente está en la versión **{{< skew currentVersion >}}**
* las otras instancias de `kube-apiserver` están soportadas en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**

### kubelet

* `kubelet` no debe ser más reciente que `kube-apiserver`.
* `kubelet` puede ser hasta tres versiones menores más antiguo que `kube-apiserver` (`kubelet` < 1.25 solo podía ser hasta dos versiones menores más antiguo que `kube-apiserver`).

Ejemplo:

* `kube-apiserver` está en la versión **{{< skew currentVersion >}}**
* `kubelet` está soportado en las versiones **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** y **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Si existe un desfase de versiones entre las instancias de `kube-apiserver` en un cluster HA, esto reduce el rango de versiones permitidas para `kubelet`.
{{</ note >}}

Ejemplo:

* las instancias de `kube-apiserver` están en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**
* `kubelet` está soportado en las versiones **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  y **{{< skew currentVersionAddMinor -3 >}}** (la versión **{{< skew currentVersion >}}** no está soportada porque sería
  más reciente que la instancia de `kube-apiserver` que se encuentra en la versión **{{< skew currentVersionAddMinor -1 >}}**)

### kube-proxy

* `kube-proxy` no debe ser más reciente que `kube-apiserver`.
* `kube-proxy` puede ser hasta tres versiones menores más antiguo que `kube-apiserver`
  (`kube-proxy` < 1.25 solo podía ser hasta dos versiones menores más antiguo que `kube-apiserver`).
* `kube-proxy` puede ser hasta tres versiones menores más antiguo o más reciente que la instancia de `kubelet`
  con la que se ejecuta conjuntamente (`kube-proxy` < 1.25 solo podía ser hasta dos versiones menores más antiguo o más reciente
  que la instancia de `kubelet` con la que se ejecuta conjuntamente).

Ejemplo:

* `kube-apiserver` está en la versión **{{< skew currentVersion >}}**
* `kube-proxy` está soportado en las versiones **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** y **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Si existe un desfase de versiones entre las instancias de `kube-apiserver` en un cluster HA, esto reduce el rango de versiones permitidas para `kube-proxy`.
{{</ note >}}

Ejemplo:

* las instancias de `kube-apiserver` están en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` está soportado en las versiones **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  y **{{< skew currentVersionAddMinor -3 >}}** (la versión **{{< skew currentVersion >}}** no está soportada porque sería
  más reciente que la instancia de `kube-apiserver` que se encuentra en la versión **{{< skew currentVersionAddMinor -1 >}}**)

### kube-controller-manager, kube-scheduler y cloud-controller-manager

`kube-controller-manager`, `kube-scheduler` y `cloud-controller-manager` no deben ser más recientes que las
instancias de `kube-apiserver` con las que se comunican. Se espera que coincidan con la versión menor de `kube-apiserver`,
pero pueden ser hasta una versión menor más antiguos (para permitir actualizaciones en vivo).

Ejemplo:

* `kube-apiserver` está en la versión **{{< skew currentVersion >}}**
* `kube-controller-manager`, `kube-scheduler` y `cloud-controller-manager` están soportados
  en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Si existe un desfase de versiones entre las instancias de `kube-apiserver` en un cluster HA, y estos componentes
pueden comunicarse con cualquier instancia de `kube-apiserver` en el cluster (por ejemplo, a través de un balanceador de carga),
esto reduce el rango de versiones permitidas para estos componentes.
{{< /note >}}

Ejemplo:

* las instancias de `kube-apiserver` están en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**
* `kube-controller-manager`, `kube-scheduler` y `cloud-controller-manager` se comunican con un balanceador de carga
  que puede enrutar el tráfico a cualquier instancia de `kube-apiserver`
* `kube-controller-manager`, `kube-scheduler` y `cloud-controller-manager` están soportados en la versión
  **{{< skew currentVersionAddMinor -1 >}}** (la versión **{{< skew currentVersion >}}** no está soportada
  porque sería más reciente que la instancia de `kube-apiserver` que se encuentra en la versión **{{< skew currentVersionAddMinor -1 >}}**)

### kubectl

`kubectl` está soportado dentro del rango de una versión menor (más antiguo o más reciente) respecto a `kube-apiserver`.

Ejemplo:

* `kube-apiserver` está en la versión **{{< skew currentVersion >}}**
* `kubectl` está soportado en las versiones **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**,
  y **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Si existe un desfase de versiones entre las instancias de `kube-apiserver` en un cluster HA, esto reduce el rango de versiones soportadas para `kubectl`.
{{< /note >}}

Ejemplo:

* las instancias de `kube-apiserver` están en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**
* `kubectl` está soportado en las versiones **{{< skew currentVersion >}}** y **{{< skew currentVersionAddMinor -1 >}}**
  (otras versiones tendrían un desfase mayor a una versión menor respecto a alguno de los componentes de `kube-apiserver`)

## Orden de actualización de componentes soportado

El desfase de versiones soportado entre los componentes tiene implicaciones en el orden
en el que los componentes deben ser actualizados. Esta sección describe el orden
en el que deben actualizarse los componentes para realizar la transición de un cluster existente desde la versión
**{{< skew currentVersionAddMinor -1 >}}** hacia la versión **{{< skew currentVersion >}}**.

Opcionalmente, al prepararse para una actualización, el proyecto Kubernetes recomienda que
hagas lo siguiente para beneficiarte de la mayor cantidad posible de correcciones de errores y regresiones durante el proceso:

* Asegúrate de que los componentes se encuentren en la versión de parche más reciente de tu versión menor actual.
* Actualiza los componentes a la versión de parche más reciente de la versión menor que tienes como objetivo.

Por ejemplo, si estás ejecutando la versión {{<skew currentVersionAddMinor -1>}},
asegúrate de estar en su versión de parche más reciente. Luego, actualiza a la versión de parche
más reciente de {{<skew currentVersion>}}.

### kube-apiserver

Prerrequisitos:

* En un cluster de una sola instancia, la instancia existente de `kube-apiserver` está en la versión **{{< skew currentVersionAddMinor -1 >}}**.
* En un cluster HA, todas las instancias de `kube-apiserver` están en las versiones **{{< skew currentVersionAddMinor -1 >}}** o
  **{{< skew currentVersion >}}** (esto garantiza un desfase máximo de 1 versión menor entre la instancia de `kube-apiserver` más antigua y la más reciente).
* Las instancias de `kube-controller-manager`, `kube-scheduler` y `cloud-controller-manager` que
  se comunican con este servidor están en la versión **{{< skew currentVersionAddMinor -1 >}}**
  (esto garantiza que no sean más recientes que la versión del API server existente, y que estén dentro del rango de 1 versión menor respecto al nuevo API server).
* Las instancias de `kubelet` en todos los nodos están en las versiones **{{< skew currentVersionAddMinor -1 >}} o **{{< skew currentVersionAddMinor -2 >}}**
  (esto garantiza que no sean más recientes que la versión del API server existente, y que estén dentro del rango de 2 versiones menores respecto al nuevo API server).
* Los webhooks de admisión registrados son capaces de manejar los datos que la nueva instancia de `kube-apiserver` les enviará:
  * Los objetos `ValidatingWebhookConfiguration` y `MutatingWebhookConfiguration` se actualizan para incluir
    cualquier versión nueva de los recursos REST añadidos en **{{< skew currentVersion >}}**
    (o utilizan la opción [`matchPolicy: Equivalent`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) disponible en v1.15+).
  * Los webhooks son capaces de manejar cualquier versión nueva de los recursos REST que se les envíen,
    así como cualquier campo nuevo añadido a las versiones existentes en **{{< skew currentVersion >}}**.

Actualiza `kube-apiserver` a la versión **{{< skew currentVersion >}}**.

{{< note >}}
Las políticas del proyecto para la [deprecación de APIs](/docs/reference/using-api/deprecation-policy/) y las
[guías de cambios en las APIs](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md)
requieren que `kube-apiserver` no se salte versiones menores al actualizar, incluso en clusters de una sola instancia.
{{< /note >}}

### kube-controller-manager, kube-scheduler y cloud-controller-manager

Prerrequisitos:

* Las instancias de `kube-apiserver` con las que se comunican estos componentes están en la versión **{{< skew currentVersion >}}**
  (en clusters HA en los que estos componentes del plano de control pueden comunicarse con cualquier instancia de `kube-apiserver`
  en el cluster, todas las instancias de `kube-apiserver` deben actualizarse antes de actualizar estos componentes).

Actualiza `kube-controller-manager`, `kube-scheduler`, y
`cloud-controller-manager` a la versión **{{< skew currentVersion >}}**. No hay un
orden de actualización requerido entre `kube-controller-manager`, `kube-scheduler` y
`cloud-controller-manager`. Puedes actualizar estos componentes en cualquier orden, o
incluso de forma simultánea.

### kubelet

Prerrequisitos:

* Las instancias de `kube-apiserver` con las que se comunica `kubelet` están en la versión **{{< skew currentVersion >}}**.

Opcionalmente, actualiza las instancias de `kubelet` a la versión **{{< skew currentVersion >}}** (o pueden dejarse en las versiones
**{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** o **{{< skew currentVersionAddMinor -3 >}}**).

{{< note >}}
Antes de realizar una actualización de versión menor de `kubelet`, drena ([drain](/docs/tasks/administer-cluster/safely-drain-node/)) los pods de ese nodo.
Las actualizaciones de versiones menores de `kubelet` en el lugar no están soportadas.
{{</ note >}}

{{< warning >}}
Ejecutar un cluster con instancias de `kubelet` que estén persistentemente tres versiones menores por detrás de
`kube-apiserver` significa que estas deben ser actualizadas antes de que el plano de control pueda actualizarse.
{{</ warning >}}

### kube-proxy

Prerrequisitos:

* Las instancias de `kube-apiserver` con las que se comunica `kube-proxy` están en la versión **{{< skew currentVersion >}}**.

Opcionalmente, actualiza las instancias de `kube-proxy` a la versión **{{< skew currentVersion >}}**
(o pueden dejarse en las versiones **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
o **{{< skew currentVersionAddMinor -3 >}}**).

{{< warning >}}
Ejecutar un cluster con instancias de `kube-proxy` que estén persistentemente tres versiones menores por detrás de
`kube-apiserver` significa que estas deben ser actualizadas antes de que el plano de control pueda actualizarse.
{{</ warning >}}