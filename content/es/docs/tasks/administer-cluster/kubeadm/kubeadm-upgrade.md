---
reviewers:
- sig-cluster-lifecycle
title: Actualización de clusters kubeadm
content_type: task
weight: 30
---

<!-- overview -->

Esta página explica cómo actualizar un cluster de Kubernetes creado con kubeadm desde la versión
{{< skew currentVersionAddMinor -1 >}}.x a la versión {{< skew currentVersion >}}.x, y desde la versión
{{< skew currentVersion >}}.x a {{< skew currentVersion >}}.y (donde `y > x`). Saltar versiones MINOR
al actualizar no está soportado. Para más detalles, por favor visita [Política de Diferencia de Versiones](/releases/version-skew-policy/).

Para ver información sobre actualizar clusters creados usando versiones anteriores de kubeadm,
por favor consulta las siguientes páginas en su lugar:

- [Actualizar un cluster kubeadm desde {{< skew currentVersionAddMinor -2 >}} a {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un cluster kubeadm desde {{< skew currentVersionAddMinor -3 >}} a {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un cluster kubeadm desde {{< skew currentVersionAddMinor -4 >}} a {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Actualizar un cluster kubeadm desde {{< skew currentVersionAddMinor -5 >}} a {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

El proyecto Kubernetes recomienda actualizar a las últimas versiones de parche rápidamente, y
asegurar que estés ejecutando una versión minor soportada de Kubernetes.
Seguir esta recomendación te ayuda a mantenerte seguro.

El flujo de trabajo de actualización a alto nivel es el siguiente:

1. Actualizar un nodo primary control plane.
1. Actualizar nodos control plane adicionales.
1. Actualizar nodos worker.

## {{% heading "prerequisites" %}}

- Asegúrate de leer las [notas de versión](https://git.k8s.io/kubernetes/CHANGELOG) cuidadosamente.
- El cluster debe usar pods estáticos del control plane y etcd o etcd externo.
- Asegúrate de hacer backup de cualquier componente importante, como el estado a nivel de aplicación almacenado en una base de datos.
  `kubeadm upgrade` no toca tus cargas de trabajo, solo componentes internos de Kubernetes, pero los backups siempre son una buena práctica.
- [Swap debe estar deshabilitado](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### Información adicional

- Las instrucciones a continuación describen cuándo drenar cada nodo durante el proceso de actualización.
  Si estás realizando una actualización de versión **minor** para cualquier kubelet, **debes**
  primero drenar el nodo (o nodos) que estás actualizando. En el caso de los nodos control plane,
  podrían estar ejecutando Pods CoreDNS u otras cargas de trabajo críticas. Para más información ver
  [Drenaje de nodos](/docs/tasks/administer-cluster/safely-drain-node/).
- El proyecto Kubernetes recomienda que hagas coincidir las versiones de kubelet y kubeadm.
  Puedes usar en su lugar una versión de kubelet que sea anterior a kubeadm, siempre que esté dentro del
  rango de versiones soportadas.
  Para más detalles, por favor visita [diferencia de kubeadm contra el kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- Todos los contenedores se reinician después de la actualización, porque el valor hash de la especificación del contenedor cambia.
- Para verificar que el servicio kubelet se ha reiniciado exitosamente después de que el kubelet ha sido actualizado,
  puedes ejecutar `systemctl status kubelet` o ver los logs del servicio con `journalctl -xeu kubelet`.
- `kubeadm upgrade` soporta `--config` con un
[tipo de API `UpgradeConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4) que puede
ser usado para configurar el proceso de actualización.
- `kubeadm upgrade` no soporta la reconfiguración de un cluster existente. Sigue los pasos en
  [Reconfiguración de un cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) en su lugar.

### Consideraciones al actualizar etcd

Porque el pod estático `kube-apiserver` está ejecutándose en todo momento (incluso si has
drenado el nodo), cuando realizas una actualización de kubeadm que incluye una
actualización de etcd, las peticiones en vuelo al servidor se detendrán mientras el nuevo pod
estático de etcd se está reiniciando. Como solución, es posible detener activamente el
proceso `kube-apiserver` unos segundos antes de iniciar el comando `kubeadm upgrade
apply`. Esto permite completar las peticiones en vuelo y cerrar las conexiones existentes,
y minimiza la consecuencia del tiempo de inactividad de etcd. Esto se puede
hacer de la siguiente manera en los nodos control plane:

```/dev/null/upgrade_etcd.sh#L1-4
killall -s SIGTERM kube-apiserver # activar un apagado gracioso de kube-apiserver
sleep 20 # esperar un poco para permitir completar peticiones en vuelo
kubeadm upgrade ... # ejecutar un comando de actualización kubeadm
```

<!-- steps -->

## Cambio del repositorio de paquetes

Si estás usando los repositorios de paquetes propiedad de la comunidad (`pkgs.k8s.io`), necesitas
habilitar el repositorio de paquetes para la versión minor deseada de Kubernetes. Esto se explica en el
documento [Cambio del repositorio de paquetes de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Determinar a qué versión actualizar

Encuentra la última versión de parche para Kubernetes {{< skew currentVersion >}} usando el administrador de paquetes del SO:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

```/dev/null/apt_search.sh#L1-4
# Encuentra la última versión {{< skew currentVersion >}} en la lista.
# Debe verse como {{< skew currentVersion >}}.x-*, donde x es el último parche.
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

```/dev/null/yum_search.sh#L1-4
# Encuentra la última versión {{< skew currentVersion >}} en la lista.
# Debe verse como {{< skew currentVersion >}}.x-*, donde x es el último parche.
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

Si no ves la versión que esperas actualizar, [verifica si se están usando los repositorios de paquetes de Kubernetes.](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)

## Actualización de nodos control plane

El procedimiento de actualización en nodos control plane debe ejecutarse un nodo a la vez.
Elige un nodo control plane que desees actualizar primero. Debe tener el archivo `/etc/kubernetes/admin.conf`.

### Llamar "kubeadm upgrade"

**Para el primer nodo control plane**

1. Actualizar kubeadm:

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}

   ```/dev/null/upgrade_kubeadm_apt.sh#L1-4
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}

   ```/dev/null/upgrade_kubeadm_yum.sh#L1-3
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Verificar que la descarga funciona y tiene la versión esperada:

   ```/dev/null/verify_kubeadm.sh#L1
   kubeadm version
   ```

1. Verificar el plan de actualización:

   ```/dev/null/upgrade_plan.sh#L1
   sudo kubeadm upgrade plan
   ```

   Este comando verifica que tu cluster puede ser actualizado, y obtiene las versiones a las que puedes actualizar.
   También muestra una tabla con los estados de versión de configuración de componentes.

   {{< note >}}
   `kubeadm upgrade` también renueva automáticamente los certificados que maneja en este nodo.
   Para optar por no renovar certificados se puede usar la bandera `--certificate-renewal=false`.
   Para más información ver la [guía de gestión de certificados](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   {{</ note >}}

1. Elegir una versión para actualizar, y ejecutar el comando apropiado. Por ejemplo:

   ```/dev/null/upgrade_apply.sh#L1-2
   # reemplaza x con la versión de parche que elegiste para esta actualización
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   Una vez que el comando termine deberías ver:

   ```/dev/null/upgrade_success.txt#L1-4
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   Para versiones anteriores a v1.28, kubeadm usaba por defecto un modo que actualiza los addons (incluyendo CoreDNS y kube-proxy)
   inmediatamente durante `kubeadm upgrade apply`, sin importar si hay otras instancias del control plane que no han
   sido actualizadas. Esto puede causar problemas de compatibilidad. Desde v1.28, kubeadm usa por defecto un modo que verifica si todas
   las instancias del control plane han sido actualizadas antes de comenzar a actualizar los addons. Debes realizar la actualización de las instancias
   del control plane secuencialmente o al menos asegurar que la última actualización de instancia del control plane no se inicie hasta que todas
   las otras instancias del control plane hayan sido actualizadas completamente, y la actualización de addons se realizará después de que la última
   instancia del control plane sea actualizada.
   {{</ note >}}

1. Actualizar manualmente tu plugin proveedor CNI.

   Tu proveedor de Container Network Interface (CNI) puede tener sus propias instrucciones de actualización a seguir.
   Revisa la página de [addons](/docs/concepts/cluster-administration/addons/) para
   encontrar tu proveedor CNI y ver si se requieren pasos de actualización adicionales.

   Este paso no es requerido en nodos control plane adicionales si el proveedor CNI se ejecuta como un DaemonSet.

**Para los otros nodos control plane**

Igual que el primer nodo control plane pero usa:

```/dev/null/upgrade_node.sh#L1
sudo kubeadm upgrade node
```

en lugar de:

```/dev/null/upgrade_apply_alt.sh#L1
sudo kubeadm upgrade apply
```

También llamar `kubeadm upgrade plan` y actualizar el plugin proveedor CNI ya no es necesario.

### Drenar el nodo

Preparar el nodo para mantenimiento marcándolo como no programable y desalojando las cargas de trabajo:

```/dev/null/drain_node.sh#L1-2
# reemplaza <node-to-drain> con el nombre de tu nodo que estás drenando
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Actualizar kubelet y kubectl

1. Actualizar el kubelet y kubectl:

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}

   ```/dev/null/upgrade_kubelet_apt.sh#L1-4
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}

   ```/dev/null/upgrade_kubelet_yum.sh#L1-3
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Reiniciar el kubelet:

   ```/dev/null/restart_kubelet.sh#L1-2
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Descordonar el nodo

Volver a poner el nodo en línea marcándolo como programable:

```/dev/null/uncordon_node.sh#L1-2
# reemplaza <node-to-uncordon> con el nombre de tu nodo
kubectl uncordon <node-to-uncordon>
```

## Actualizar nodos worker

El procedimiento de actualización en nodos worker debe ejecutarse un nodo a la vez o pocos nodos a la vez,
sin comprometer la capacidad mínima requerida para ejecutar tus cargas de trabajo.

Las siguientes páginas muestran cómo actualizar nodos worker Linux y Windows:

* [Actualizar nodos Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
* [Actualizar nodos Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## Verificar el estado del cluster

Después de que el kubelet es actualizado en todos los nodos verifica que todos los nodos estén disponibles nuevamente ejecutando
el siguiente comando desde cualquier lugar donde kubectl pueda acceder al cluster:

```/dev/null/get_nodes.sh#L1
kubectl get nodes
```

La columna `STATUS` debe mostrar `Ready` para todos tus nodos, y el número de versión debe estar actualizado.

## Recuperación de un estado de falla

Si `kubeadm upgrade` falla y no hace rollback, por ejemplo por un apagado inesperado durante la ejecución, puedes ejecutar `kubeadm upgrade` nuevamente.
Este comando es idempotente y eventualmente se asegura de que el estado actual sea el estado deseado que declaras.

Para recuperarse de un mal estado, también puedes ejecutar `sudo kubeadm upgrade apply --force` sin cambiar la versión que tu cluster está ejecutando.

Durante la actualización kubeadm escribe las siguientes carpetas de backup bajo `/etc/kubernetes/tmp`:

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` contiene un backup de los datos del miembro etcd local para este nodo Control plane.
En caso de una falla de actualización de etcd y si el rollback automático no funciona, los contenidos de esta carpeta
pueden ser restaurados manualmente en `/var/lib/etcd`. En caso de que se use etcd externo esta carpeta de backup estará vacía.

`kubeadm-backup-manifests` contiene un backup de los archivos de manifest de Pod estático para este nodo Control plane.
En caso de una falla de actualización y si el rollback automático no funciona, los contenidos de esta carpeta pueden ser
restaurados manualmente en `/etc/kubernetes/manifests`. Si por alguna razón no hay diferencia entre un archivo de manifest
pre-actualización y post-actualización para un cierto componente, un archivo de backup para él no será escrito.

{{< note >}}
Después de la actualización del cluster usando kubeadm, el directorio de backup `/etc/kubernetes/tmp` permanecerá y
estos archivos de backup necesitarán ser limpiados manualmente.
{{</ note >}}

## Cómo funciona

`kubeadm upgrade apply` hace lo siguiente:

- Verifica que tu cluster esté en un estado actualizable:
  - El servidor API es alcanzable
  - Todos los nodos están en estado `Ready`
  - El control plane está saludable
- Aplica las políticas de diferencia de versión.
- Se asegura de que las imágenes del control plane estén disponibles o disponibles para descargar a la máquina.
- Genera reemplazos y/o usa sobreescrituras proporcionadas por el usuario si las configuraciones de componentes requieren actualizaciones de versión.
- Actualiza los componentes del control plane o hace rollback si alguno de ellos falla al iniciarse.
- Aplica los nuevos manifests de `CoreDNS` y `kube-proxy` y se asegura de que todas las reglas RBAC necesarias sean creadas.
- Crea nuevos archivos de certificado y clave del servidor API y hace backup de archivos antiguos si están a punto de expirar en 180 días.

`kubeadm upgrade node` hace lo siguiente en nodos control plane adicionales:

- Obtiene la `ClusterConfiguration` de kubeadm del cluster.
- Opcionalmente hace backup del certificado kube-apiserver.
- Actualiza los manifests de Pod estático para los componentes del control plane.
- Actualiza la configuración del kubelet para este nodo.

`kubeadm upgrade node` hace lo siguiente en nodos worker:

- Obtiene la `ClusterConfiguration` de kubeadm del cluster.
- Actualiza la configuración del kubelet para este nodo.

