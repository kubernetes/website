---
title: Actualizando clústeres de kubeadm
content_type: task
weight: 30
---

<!-- overview -->

Esta página explica cómo actualizar un clúster de Kubernetes creado con kubeadm desde la versión
{{< skew currentVersionAddMinor -1 >}}.x a la versión {{< skew currentVersion >}}.x y desde la versión
{{< skew currentVersion >}}.x a la {{< skew currentVersion >}}.y (donde `y > x`). No se admite omitir
versiones MENORES al actualizar. Para más detalles, visita la [política de desviación de versiones](/releases/version-skew-policy/).

Para ver información sobre cómo actualizar clústeres creados con versiones más antiguas de kubeadm,
consulta en su lugar las siguientes páginas:

- [Actualizar un clúster de kubeadm de {{< skew currentVersionAddMinor -2 >}} a {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un clúster de kubeadm de {{< skew currentVersionAddMinor -3 >}} a {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un clúster de kubeadm de {{< skew currentVersionAddMinor -4 >}} a {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un clúster de kubeadm de {{< skew currentVersionAddMinor -5 >}} a {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

El proyecto de Kubernetes recomienda actualizar cuanto antes a la última versión de parche, así como
asegurarte de que ejecutas una versión menor de Kubernetes con soporte.
Seguir esta recomendación te ayuda a mantener la seguridad.

En líneas generales, el proceso de actualización sigue los siguientes pasos:

1. Actualizar el nodo controlador principal.
1. Actualizar los demás nodos controladores (en el caso de que hubiera más de uno).
1. Actualizar los nodos de trabajo.

## {{% heading "prerequisites" %}}

- Lee detenidamente las [notas de la versión](https://git.k8s.io/kubernetes/CHANGELOG).
- El clúster debe usar pods estáticos para el plano de control y etcd, o un etcd externo.
- Asegúrate de hacer una copia de seguridad de cualquier componente importante, como el estado
  a nivel de aplicación almacenado en una base de datos.
  `kubeadm upgrade` no toca tus cargas de trabajo, solo los componentes internos de Kubernetes, pero las copias de seguridad son siempre una buena práctica.
- [La swap debe estar deshabilitada](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### Información adicional

- Las instrucciones siguientes indican en qué momento drenar cada nodo durante el proceso de actualización.
  Si vas a realizar una actualización de versión **menor** de cualquier kubelet, **debes**
  drenar primero el nodo (o los nodos) que estás actualizando. En el caso de los nodos controladores,
  podrían estar ejecutando pods de CoreDNS u otras cargas de trabajo críticas. Para más información, consulta cómo
  [drenar un nodo de forma segura](/es/docs/tasks/administer-cluster/safely-drain-node/).
- El proyecto de Kubernetes recomienda que las versiones de kubelet y kubeadm coincidan.
  También puedes usar una versión de kubelet más antigua que la de kubeadm, siempre que esté dentro del
  rango de versiones soportadas.
  Para más detalles, visita [la desviación de kubeadm respecto al kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- Todos los contenedores se reinician tras la actualización, porque el valor del hash de la spec del contenedor cambia.
- Para verificar que el servicio del kubelet se ha reiniciado correctamente después de actualizar el kubelet,
  puedes ejecutar `systemctl status kubelet` o ver los logs del servicio con `journalctl -xeu kubelet`.
- `kubeadm upgrade` admite `--config` con un
[tipo de la API `UpgradeConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4) que puede
usarse para configurar el proceso de actualización.
- `kubeadm upgrade` no admite la reconfiguración de un clúster existente. Sigue en su lugar los pasos de
  [reconfigurando un clúster de kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

### Consideraciones al actualizar el etcd

Como el pod estático del `kube-apiserver` se ejecuta en todo momento (incluso si has
drenado el nodo), cuando realizas una actualización de kubeadm que incluye una
actualización del etcd, las peticiones al servidor se quedarán bloqueadas mientras
se reinicia el nuevo pod estático del etcd. Como solución alternativa, es posible detener
activamente el proceso `kube-apiserver` unos segundos antes de lanzar el comando
`kubeadm upgrade apply`. Esto permite completar las peticiones en curso y cerrar las
conexiones existentes, y minimiza las consecuencias de la indisponibilidad del etcd. Para ello,
ejecuta los siguientes comandos en los nodos controladores:

```shell
killall -s SIGTERM kube-apiserver # provoca un apagado controlado de kube-apiserver
sleep 20 # espera un poco para permitir que se completen las peticiones en curso
kubeadm upgrade ... # ejecuta un comando de actualización de kubeadm
```

<!-- steps -->

## Cambiando el repositorio de paquetes

Si usas los repositorios de paquetes gestionados por la comunidad (`pkgs.k8s.io`), necesitas
habilitar el repositorio de paquetes de la versión menor de Kubernetes deseada. Esto se explica en el documento:
[cambiando el repositorio de paquetes de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Determinar a qué versión actualizar

Encuentra la última versión de parche de Kubernetes {{< skew currentVersion >}} usando el gestor de paquetes del sistema operativo:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian o HypriotOS" %}}

```shell
# Busca la última versión {{< skew currentVersion >}} en la lista.
# Debería parecerse a {{< skew currentVersion >}}.x-*, donde x es el último parche.
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS, RHEL o Fedora" %}}

Para sistemas con DNF:
```shell
# Busca la última versión {{< skew currentVersion >}} en la lista.
# Debería parecerse a {{< skew currentVersion >}}.x-*, donde x es el último parche.
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```
Para sistemas con DNF5:
```shell
# Busca la última versión {{< skew currentVersion >}} en la lista.
# Debería parecerse a {{< skew currentVersion >}}.x-*, donde x es el último parche.
sudo yum list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

Si no ves la versión a la que esperas actualizar, [verifica si se están usando los repositorios de paquetes de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used).

## Actualizando los nodos controladores

Los nodos controladores deben actualizarse de uno en uno.
Elige el nodo controlador que quieras actualizar primero. Debe tener el archivo `/etc/kubernetes/admin.conf`.

### Ejecuta "kubeadm upgrade"

**Para el primer nodo controlador**

1. Actualiza kubeadm:

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu, Debian o HypriotOS" %}}

   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL o Fedora" %}}

   Para sistemas con DNF:
   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   Para sistemas con DNF5:
   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Verifica que la descarga funciona y tiene la versión esperada:

   ```shell
   kubeadm version
   ```

1. Verifica el plan de actualización:

   ```shell
   sudo kubeadm upgrade plan
   ```

   Este comando comprueba que tu clúster puede actualizarse y obtiene las versiones a las que puedes actualizar.
   También muestra una tabla con el estado de las versiones de configuración de los componentes.

   {{< note >}}
   `kubeadm upgrade` también renueva automáticamente los certificados que gestiona en este nodo.
   Para desactivar la renovación de certificados puede usarse el flag `--certificate-renewal=false`.
   Para más información, consulta la [guía de gestión de certificados](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   {{</ note >}}

1. Elige una versión a la que actualizar y ejecuta el comando apropiado. Por ejemplo:

   ```shell
   # sustituye x por la versión de parche que elegiste para esta actualización
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   Una vez que el comando termine, deberías ver:

   ```
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   Para las versiones anteriores a v1.28, kubeadm usaba por defecto un modo que actualizaba los complementos
   (incluidos CoreDNS y kube-proxy) inmediatamente durante `kubeadm upgrade apply`, sin importar si hubiera
   otras instancias del plano de control sin actualizar. Esto puede causar problemas de
   compatibilidad. Desde v1.28, kubeadm usa por defecto un modo que comprueba si todas las instancias del
   plano de control se han actualizado antes de empezar a actualizar los complementos. Debes realizar la
   actualización de todas las instancias del plano de control de forma secuencial o, al menos, asegurarte de que
   la actualización de la última instancia del plano de control no comienza hasta que todas las demás
   instancias se hayan actualizado por completo; la actualización de los complementos se realizará después
   de actualizar la última instancia del plano de control.
   {{</ note >}}

1. Actualiza manualmente el plugin de tu proveedor de CNI.

   Tu proveedor de Container Network Interface (CNI) puede tener sus propias instrucciones de actualización.
   Consulta la página de [complementos](/es/docs/concepts/cluster-administration/addons/) para
   encontrar tu proveedor de CNI y ver si se requieren pasos de actualización adicionales.

   Este paso no es necesario en los demás nodos controladores si el proveedor de CNI se ejecuta como un DaemonSet.

**Para los demás nodos controladores**

Igual que en el primer nodo controlador, pero usa:

```shell
sudo kubeadm upgrade node
```

en lugar de:

```shell
sudo kubeadm upgrade apply
```

Además, ya no es necesario ejecutar `kubeadm upgrade plan` ni actualizar el plugin del proveedor de CNI.

### Drena el nodo

Prepara el nodo para el mantenimiento marcándolo como no programable y desalojando las cargas de trabajo:

```shell
# sustituye <nodo-a-drenar> por el nombre del nodo que estás drenando
kubectl drain <nodo-a-drenar> --ignore-daemonsets
```

### Actualiza kubelet y kubectl

{{< note >}}
En los nodos Linux, el kubelet por defecto solo admite cgroups v2.
Para Kubernetes {{< skew currentVersion >}}, la opción de configuración del kubelet `FailCgroupV1` está establecida a `true` por defecto.

Para saber más, consulta la [documentación de Kubernetes sobre la obsolescencia del cgroup v1](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1).
{{</ note >}}

1. Actualiza el kubelet y kubectl:

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu, Debian o HypriotOS" %}}

   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL o Fedora" %}}

   Para sistemas con DNF:
   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   Para sistemas con DNF5:
   ```shell
   # sustituye x en {{< skew currentVersion >}}.x-* por la última versión de parche
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Reinicia el kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Reincorpora el nodo

Vuelve a poner el nodo disponible marcándolo como programable:

```shell
# sustituye <nodo-a-reincorporar> por el nombre de tu nodo
kubectl uncordon <nodo-a-reincorporar>
```

## Actualizar los nodos de trabajo

Los nodos de trabajo deben actualizarse de uno en uno o en pequeños grupos,
sin comprometer la capacidad mínima necesaria para ejecutar tus cargas de trabajo.

Las siguientes páginas muestran cómo actualizar nodos de trabajo Linux y Windows:

* [Actualizar nodos Linux](/es/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
* [Actualizar nodos Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## Verificar el estado del clúster

Después de actualizar el kubelet en todos los nodos, verifica que todos los nodos vuelven a estar
disponibles ejecutando el siguiente comando desde donde kubectl tenga acceso al clúster:

```shell
kubectl get nodes
```

La columna `STATUS` debería mostrar `Ready` para todos tus nodos, y el número de versión debería estar actualizado.

## Recuperarse de un estado de fallo

Si `kubeadm upgrade` falla y no revierte los cambios, por ejemplo debido a un apagado inesperado durante la ejecución, puedes ejecutar `kubeadm upgrade` de nuevo.
Este comando es idempotente y asegura que el estado real sea el que declaras.

Para recuperarte de un estado erróneo, también puedes ejecutar `sudo kubeadm upgrade apply --force` sin cambiar la versión que ejecuta tu clúster.

Durante la actualización, kubeadm escribe los siguientes directorios de copia de seguridad bajo `/etc/kubernetes/tmp`:

- `kubeadm-backup-etcd-<fecha>-<hora>`
- `kubeadm-backup-manifests-<fecha>-<hora>`

`kubeadm-backup-etcd` contiene una copia de seguridad de los datos del miembro local del etcd de este nodo controlador.
En caso de que falle una actualización del etcd y la reversión automática no funcione, el contenido de esta carpeta
puede restaurarse manualmente en `/var/lib/etcd`. Si se usa un etcd externo, esta carpeta de copia de seguridad estará vacía.

`kubeadm-backup-manifests` contiene una copia de seguridad de los archivos de manifiesto de los pods estáticos de este nodo controlador.
En caso de que falle una actualización y la reversión automática no funcione, el contenido de esta carpeta puede
restaurarse manualmente en `/etc/kubernetes/manifests`. Si por alguna razón no hay diferencias entre el archivo de
manifiesto de un componente antes y después de la actualización, no se escribirá un archivo de copia de seguridad para él.

{{< note >}}
Después de actualizar el clúster con kubeadm, el directorio de copias de seguridad `/etc/kubernetes/tmp` permanecerá,
y estos archivos de copia de seguridad deberán limpiarse manualmente.
{{</ note >}}

## Cómo funciona

`kubeadm upgrade apply` hace lo siguiente:

- Comprueba que tu clúster está en un estado actualizable:
  - El servidor de la API es accesible
  - Todos los nodos están en estado `Ready`
  - El plano de control está operativo
- Aplica las políticas de desviación de versiones.
- Se asegura de que las imágenes del plano de control están disponibles o pueden descargarse desde la máquina.
- Genera reemplazos y/o usa las sobrescrituras proporcionadas por el usuario si las configuraciones de los componentes requieren actualizaciones de versión.
- Actualiza los componentes del plano de control, o los revierte si alguno de ellos no consigue arrancar.
- Aplica los nuevos manifiestos de `CoreDNS` y `kube-proxy` y se asegura de que se crean todas las reglas RBAC necesarias.
- Crea nuevos archivos de certificado y clave del servidor de la API, y hace una copia de seguridad de los archivos antiguos si van a expirar en 180 días.

`kubeadm upgrade node` hace lo siguiente en los demás nodos controladores:

- Obtiene la `ClusterConfiguration` de kubeadm del clúster.
- Opcionalmente, hace una copia de seguridad del certificado de kube-apiserver.
- Actualiza los manifiestos de los pods estáticos de los componentes del plano de control.
- Actualiza la configuración del kubelet de este nodo.

`kubeadm upgrade node` hace lo siguiente en los nodos de trabajo:

- Obtiene la `ClusterConfiguration` de kubeadm del clúster.
- Actualiza la configuración del kubelet de este nodo.
