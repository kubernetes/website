---
title: Acerca de cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

En Linux, los {{< glossary_tooltip text="grupos de control" term_id="cgroup" >}}
restringen los recursos que se asignan a los procesos.

El {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} y el
container runtime subyacente necesitan interactuar con los cgroups para aplicar la
[gestión de recursos para Pods y contenedores](/docs/concepts/configuration/manage-resources-containers/), que
incluye solicitudes y límites de CPU/memoria para las cargas de trabajo en contenedores.

Existen dos versiones de cgroups en Linux: cgroup v1 y cgroup v2. cgroup v2 es
la nueva generación de la API `cgroup`.

<!-- body -->


## ¿Qué es cgroup v2? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 es la siguiente versión de la API `cgroup` de Linux. cgroup v2 proporciona un
sistema de control unificado con capacidades mejoradas de gestión de
recursos.

cgroup v2 ofrece varias mejoras con respecto a cgroup v1, como las siguientes:

- Diseño de jerarquía unificada única en la API
- Delegación de subárboles más segura hacia los contenedores
- Funcionalidades más recientes como [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Gestión y aislamiento mejorados de la asignación de recursos entre múltiples recursos
  - Contabilización unificada para diferentes tipos de asignaciones de memoria (memoria de red, memoria del kernel, etc.)
  - Contabilización de cambios de recursos no inmediatos, como las escrituras de la caché de páginas

Algunas funcionalidades de Kubernetes usan exclusivamente cgroup v2 para una gestión
y un aislamiento de recursos mejorados. Por ejemplo, la funcionalidad
[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) mejora la QoS de memoria
y se basa en primitivas de cgroup v2.


## Usar cgroup v2 {#using-cgroupv2}

La forma recomendada de usar cgroup v2 es utilizar una distribución de Linux con
cgroup v2 habilitado y configurado de forma predeterminada.

Para comprobar si tu distribución usa cgroup v2, consulta [Identificar la versión de cgroup en los nodos Linux](#check-cgroup-version).

### Requisitos

cgroup v2 tiene los siguientes requisitos:

* La distribución del sistema operativo habilita cgroup v2
* La versión del kernel de Linux es 5.8 o posterior
* El container runtime es compatible con cgroup v2. Por ejemplo:
  * [containerd](https://containerd.io/) v1.4 y posteriores
  * [cri-o](https://cri-o.io/) v1.20 y posteriores
* El kubelet y el container runtime están configurados para usar el [driver de cgroup systemd](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Compatibilidad de las distribuciones de Linux con cgroup v2

Para obtener una lista de distribuciones de Linux que usan cgroup v2, consulta la [documentación de cgroup v2](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (desde M97)
* Ubuntu (desde 21.10, se recomienda 22.04+)
* Debian GNU/Linux (desde Debian 11 bullseye)
* Fedora (desde 31)
* Arch Linux (desde abril de 2021)
* RHEL y distribuciones similares a RHEL (desde 9)

Para comprobar si tu distribución está usando cgroup v2, consulta la documentación
de tu distribución o sigue las instrucciones en [Identificar la versión de cgroup en los nodos Linux](#check-cgroup-version).

También puedes habilitar cgroup v2 manualmente en tu distribución de Linux modificando
los argumentos de arranque de la línea de comandos del kernel. Si tu distribución usa GRUB,
`systemd.unified_cgroup_hierarchy=1` debe añadirse en `GRUB_CMDLINE_LINUX`
dentro de `/etc/default/grub`, seguido de `sudo update-grub`. Sin embargo, el
enfoque recomendado es usar una distribución que ya habilite cgroup v2 de forma
predeterminada.

### Migrar a cgroup v2 {#migrating-cgroupv2}

Para migrar a cgroup v2, asegúrate de cumplir los [requisitos](#requisitos) y luego actualiza
a una versión del kernel que habilite cgroup v2 de forma predeterminada.

El kubelet detecta automáticamente que el sistema operativo está ejecutando cgroup v2 y
actúa en consecuencia, sin necesidad de configuración adicional.

No debería haber ninguna diferencia perceptible en la experiencia de usuario al
cambiar a cgroup v2, a menos que los usuarios accedan directamente al sistema de archivos
de cgroup, ya sea en el nodo o desde dentro de los contenedores.

cgroup v2 usa una API diferente a la de cgroup v1, por lo que si hay
aplicaciones que acceden directamente al sistema de archivos de cgroup, deben
actualizarse a versiones más recientes que sean compatibles con cgroup v2. Por ejemplo:

* Algunos agentes de monitorización y seguridad de terceros pueden depender del sistema de archivos de cgroup.
 Actualiza estos agentes a versiones que sean compatibles con cgroup v2.
* Si ejecutas [cAdvisor](https://github.com/google/cadvisor) como un
 DaemonSet independiente para monitorizar Pods y contenedores, actualízalo a v0.43.0 o posterior.
* Si despliegas aplicaciones Java, es preferible usar versiones que sean totalmente compatibles con cgroup v2:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 y posteriores
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0 y posteriores
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 y posteriores
* Si usas el paquete [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs), asegúrate de que
  la versión que usas sea v1.5.1 o superior.
* Si despliegas aplicaciones [Node.js](https://nodejs.org/), es preferible usar versiones que detecten los límites
  de memoria de cgroup v2. Node.js lee los límites de memoria de cgroup v2 (a través de [libuv](https://libuv.org/))
  a partir de Node.js v20.3.0. La línea de versiones v18 no detecta de forma fiable los límites de memoria de cgroup v2.
  Las versiones sin esta compatibilidad pueden leer la memoria total del host en lugar del
  límite aplicado al Pod, lo que puede provocar un heap de tamaño incorrecto y terminaciones
  por falta de memoria (OOM). En las versiones afectadas, establece el tamaño del heap explícitamente, por ejemplo con la
  bandera `--max-old-space-size`.

## Identificar la versión de cgroup en los nodos Linux {#check-cgroup-version}

La versión de cgroup depende de la distribución de Linux que se esté usando y de la
versión de cgroup predeterminada configurada en el sistema operativo. Para comprobar qué versión de cgroup usa tu
distribución, ejecuta el comando `stat -fc %T /sys/fs/cgroup/` en
el nodo:

```shell
stat -fc %T /sys/fs/cgroup/
```

Para cgroup v2, la salida es `cgroup2fs`.

Para cgroup v1, la salida es `tmpfs.`

## Obsolescencia de cgroup v1

{{< feature-state for_k8s_version="v1.35" state="deprecated" >}}

Kubernetes ha declarado obsoleto cgroup v1.
Su eliminación seguirá la [política de obsolescencia de Kubernetes](/docs/reference/using-api/deprecation-policy/).

Kubelet ya no se iniciará de forma predeterminada en un nodo con cgroup v1.
Para desactivar este comportamiento, un administrador del clúster debe establecer `failCgroupV1` en false en el [archivo de configuración de kubelet](/docs/tasks/administer-cluster/kubelet-config-file/).

## {{% heading "whatsnext" %}}

- Aprende más sobre los [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Aprende más sobre el [container runtime](/docs/concepts/architecture/cri)
- Aprende más sobre los [drivers de cgroup](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
