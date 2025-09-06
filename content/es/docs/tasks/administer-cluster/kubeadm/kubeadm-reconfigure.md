---
reviewers:
- sig-cluster-lifecycle
title: Reconfigurando un clúster kubeadm
content_type: task
weight: 90
---

<!-- overview -->

kubeadm no soporta formas automatizadas de reconfigurar componentes que
fueron desplegados en nodos gestionados. Una forma de automatizar esto sería
usando un [operator](/docs/concepts/extend-kubernetes/operator/) personalizado.

Para modificar la configuración de los componentes debes editar manualmente los objetos de clúster
asociados y archivos en disco.

Esta guía muestra la secuencia correcta de pasos que necesitan ser realizados
para lograr la reconfiguración del clúster kubeadm.

## {{% heading "prerequisites" %}}

- Necesitas un clúster que fue desplegado usando kubeadm
- Tener credenciales de administrador (`/etc/kubernetes/admin.conf`) y conectividad de red
a un kube-apiserver en ejecución en el clúster desde un host que tenga kubectl instalado
- Tener un editor de texto instalado en todos los hosts

<!-- steps -->

## Reconfigurando el clúster

kubeadm escribe un conjunto de opciones de configuración de componentes a nivel de clúster en
ConfigMaps y otros objetos. Estos objetos deben ser editados manualmente. El comando `kubectl edit`
puede ser usado para eso.

El comando `kubectl edit` abrirá un editor de texto donde puedes editar y guardar el objeto directamente.

Puedes usar las variables de entorno `KUBECONFIG` y `KUBE_EDITOR` para especificar la ubicación del
archivo kubeconfig consumido por kubectl y el editor de texto preferido.

Por ejemplo:
```/dev/null/example.sh#L1-3
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <parameters>
```

{{< note >}}
Al guardar cualquier cambio a estos objetos de clúster, los componentes ejecutándose en los nodos pueden no ser
actualizados automáticamente. Los pasos a continuación te instruyen sobre cómo realizar eso manualmente.
{{< /note >}}

{{< warning >}}
La configuración de componentes en ConfigMaps se almacena como datos no estructurados (string YAML).
Esto significa que no se realizará validación al actualizar el contenido de un ConfigMap.
Tienes que tener cuidado de seguir el formato de API documentado para una
configuración de componente en particular y evitar introducir errores tipográficos y errores de indentación YAML.
{{< /warning >}}

### Aplicando cambios de configuración del clúster

#### Actualizando el `ClusterConfiguration`

Durante la creación y actualización del clúster, kubeadm escribe su
[`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/)
en un ConfigMap llamado `kubeadm-config` en el namespace `kube-system`.

Para cambiar una opción particular en el `ClusterConfiguration` puedes editar el ConfigMap con este comando:

```/dev/null/shell.sh#L1-3
kubectl edit cm -n kube-system kubeadm-config
```

La configuración se encuentra bajo la clave `data.ClusterConfiguration`.

{{< note >}}
El `ClusterConfiguration` incluye una variedad de opciones que afectan la configuración de componentes individuales
como kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd y kube-proxy.
Los cambios a la configuración deben ser reflejados en los componentes de nodo manualmente.
{{< /note >}}

#### Reflejando cambios del `ClusterConfiguration` en nodos del control plane

kubeadm gestiona los componentes del control plane como manifiestos de Pod estáticos ubicados en
el directorio `/etc/kubernetes/manifests`.
Cualquier cambio al `ClusterConfiguration` bajo las claves `apiServer`, `controllerManager`, `scheduler` o `etcd`
debe ser reflejado en los archivos asociados en el directorio manifests en un nodo del control plane.

Tales cambios pueden incluir:
- `extraArgs` - requiere actualizar la lista de flags pasados a un contenedor de componente
- `extraVolumes` - requiere actualizar los montajes de volumen para un contenedor de componente
- `*SANs` - requiere escribir nuevos certificados con Subject Alternative Names actualizados

Antes de proceder con estos cambios, asegúrate de haber respaldado el directorio `/etc/kubernetes/`.

Para escribir nuevos certificados puedes usar:
```/dev/null/shell.sh#L1-3
kubeadm init phase certs <component-name> --config <config-file>
```

Para escribir nuevos archivos de manifiesto en `/etc/kubernetes/manifests` puedes usar:

```/dev/null/shell.sh#L1-6
# Para componentes del control plane de Kubernetes
kubeadm init phase control-plane <component-name> --config <config-file>
# Para etcd local
kubeadm init phase etcd local --config <config-file>
```

El contenido de `<config-file>` debe coincidir con el `ClusterConfiguration` actualizado.
El valor `<component-name>` debe ser un nombre de un componente del control plane de Kubernetes (`apiserver`, `controller-manager` o `scheduler`).

{{< note >}}
Actualizar un archivo en `/etc/kubernetes/manifests` le dirá al kubelet que reinicie el Pod estático para el componente correspondiente.
Trata de hacer estos cambios un nodo a la vez para dejar el clúster sin tiempo de inactividad.
{{< /note >}}

### Aplicando cambios de configuración del kubelet

#### Actualizando el `KubeletConfiguration`

Durante la creación y actualización del clúster, kubeadm escribe su
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
en un ConfigMap llamado `kubelet-config` en el namespace `kube-system`.

Puedes editar el ConfigMap con este comando:

```/dev/null/shell.sh#L1-3
kubectl edit cm -n kube-system kubelet-config
```

La configuración se encuentra bajo la clave `data.kubelet`.

#### Reflejando los cambios del kubelet

Para reflejar el cambio en nodos kubeadm debes hacer lo siguiente:
- Iniciar sesión en un nodo kubeadm
- Ejecutar `kubeadm upgrade node phase kubelet-config` para descargar el último contenido del ConfigMap
`kubelet-config` en el archivo local `/var/lib/kubelet/config.yaml`
- Editar el archivo `/var/lib/kubelet/kubeadm-flags.env` para aplicar configuración adicional con
flags
- Reiniciar el servicio kubelet con `systemctl restart kubelet`

{{< note >}}
Haz estos cambios un nodo a la vez para permitir que las cargas de trabajo sean reprogramadas correctamente.
{{< /note >}}

{{< note >}}
Durante `kubeadm upgrade`, kubeadm descarga el `KubeletConfiguration` del
ConfigMap `kubelet-config` y sobrescribe el contenido de `/var/lib/kubelet/config.yaml`.
Esto significa que la configuración local del nodo debe ser aplicada ya sea por flags en
`/var/lib/kubelet/kubeadm-flags.env` o actualizando manualmente el contenido de
`/var/lib/kubelet/config.yaml` después de `kubeadm upgrade`, y luego reiniciando el kubelet.
{{< /note >}}

### Aplicando cambios de configuración de kube-proxy

#### Actualizando el `KubeProxyConfiguration`

Durante la creación y actualización del clúster, kubeadm escribe su
[`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
en un ConfigMap en el namespace `kube-system` llamado `kube-proxy`.

Este ConfigMap es usado por el DaemonSet `kube-proxy` en el namespace `kube-system`.

Para cambiar una opción particular en el `KubeProxyConfiguration`, puedes editar el ConfigMap con este comando:

```/dev/null/shell.sh#L1-3
kubectl edit cm -n kube-system kube-proxy
```

La configuración se encuentra bajo la clave `data.config.conf`.

#### Reflejando los cambios de kube-proxy

Una vez que el ConfigMap `kube-proxy` es actualizado, puedes reiniciar todos los Pods kube-proxy:

Eliminar los Pods con:

```/dev/null/shell.sh#L1-3
kubectl delete po -n kube-system -l k8s-app=kube-proxy
```

Se crearán nuevos Pods que usan el ConfigMap actualizado.

{{< note >}}
Debido a que kubeadm despliega kube-proxy como un DaemonSet, la configuración específica de nodo no es soportada.
{{< /note >}}

### Aplicando cambios de configuración de CoreDNS

#### Actualizando el Deployment y Service de CoreDNS

kubeadm despliega CoreDNS como un Deployment llamado `coredns` y con un Service `kube-dns`,
ambos en el namespace `kube-system`.

Para actualizar cualquiera de las configuraciones de CoreDNS, puedes editar los objetos Deployment y
Service:

```/dev/null/shell.sh#L1-4
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

#### Reflejando los cambios de CoreDNS

Una vez que los cambios de CoreDNS son aplicados puedes reiniciar el deployment de CoreDNS:

```/dev/null/shell.sh#L1-3
kubectl rollout restart deployment -n kube-system coredns
```

{{< note >}}
kubeadm no permite la configuración de CoreDNS durante la creación y actualización del clúster.
Esto significa que si ejecutas `kubeadm upgrade apply`, tus cambios a los objetos CoreDNS
se perderán y deben ser reaplicados.
{{< /note >}}

## Persistiendo la reconfiguración

Durante la ejecución de `kubeadm upgrade` en un nodo gestionado, kubeadm podría sobrescribir la configuración
que fue aplicada después de que el clúster fue creado (reconfiguración).

### Persistiendo la reconfiguración del objeto Node

kubeadm escribe Labels, Taints, socket CRI y otra información en el objeto Node para un
nodo particular de Kubernetes. Para cambiar cualquier contenido de este objeto Node puedes usar:

```/dev/null/shell.sh#L1-3
kubectl edit no <node-name>
```

Durante `kubeadm upgrade` el contenido de tal Node podría ser sobrescrito.
Si quisieras persistir tus modificaciones al objeto Node después de la actualización,
puedes preparar un [kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
y aplicarlo al objeto Node:

```/dev/null/shell.sh#L1-3
kubectl patch no <node-name> --patch-file <patch-file>
```

#### Persistiendo la reconfiguración de componentes del control plane

La fuente principal de configuración del control plane es el objeto `ClusterConfiguration`
almacenado en el clúster. Para extender la configuración de manifiestos de Pod estáticos,
se pueden usar [patches](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches).

Estos archivos de patch deben permanecer como archivos en los nodos del control plane para asegurar que
puedan ser usados por el `kubeadm upgrade ... --patches <directory>`.

Si se hace reconfiguración al `ClusterConfiguration` y manifiestos de Pod estáticos en disco,
el conjunto de patches específicos del nodo debe ser actualizado en consecuencia.

#### Persistiendo la reconfiguración del kubelet

Cualquier cambio al `KubeletConfiguration` almacenado en `/var/lib/kubelet/config.yaml` será sobrescrito en
`kubeadm upgrade` descargando el contenido del ConfigMap `kubelet-config` a nivel de clúster.
Para persistir la configuración específica del nodo kubelet, ya sea el archivo `/var/lib/kubelet/config.yaml`
tiene que ser actualizado manualmente post-actualización o el archivo `/var/lib/kubelet/kubeadm-flags.env` puede incluir flags.
Los flags del kubelet anulan las opciones asociadas del `KubeletConfiguration`, pero nota que
algunos de los flags están deprecados.

Se requerirá un reinicio del kubelet después de cambiar `/var/lib/kubelet/config.yaml` o
`/var/lib/kubelet/kubeadm-flags.env`.

## {{% heading "whatsnext" %}}

- [Actualizando clústeres kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Personalizando componentes con la API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Gestión de certificados con kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [Encuentra más sobre la configuración de kubeadm](/docs/reference/setup-tools/kubeadm/)

