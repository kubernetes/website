---
title: Configurando un controlador de cgroup
content_type: task
weight: 50
---

<!-- overview -->

Esta página explica cómo configurar el controlador de cgroup del kubelet para que coincida con el controlador de cgroup del runtime de contenedores en clústeres creados con kubeadm.

## {{% heading "prerequisitos" %}}

Debes estar familiarizado con los
[requisitos del runtime de contenedores](/docs/setup/production-environment/container-runtimes) de Kubernetes.

<!-- steps -->

## Configurando el controlador de cgroup del runtime de contenedores

La página de [Runtimes de contenedores](/docs/setup/production-environment/container-runtimes)
explica que se recomienda el controlador `systemd` para instalaciones basadas en kubeadm en lugar del controlador [predeterminado](/docs/reference/config-api/kubelet-config.v1beta1) `cgroupfs` del kubelet,
ya que kubeadm administra el kubelet como un
[servicio systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).

La página también proporciona detalles sobre cómo configurar varios runtimes de contenedores diferentes con el controlador `systemd` por defecto.

## Configurando el controlador de cgroup del kubelet

kubeadm te permite pasar una estructura `KubeletConfiguration` durante `kubeadm init`.
Esta `KubeletConfiguration` puede incluir el campo `cgroupDriver` que controla el controlador de cgroup del kubelet.

{{< note >}}
En la versión v1.22 y posteriores, si el usuario no establece el campo `cgroupDriver` en `KubeletConfiguration`,
kubeadm lo configura por defecto como `systemd`.

En Kubernetes v1.28, puedes habilitar la detección automática del
controlador de cgroup como una característica alfa.
Consulta [systemd cgroup driver](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)
para más detalles.
{{< /note >}}

Un ejemplo mínimo de cómo configurar el campo explícitamente:

```kubeadm-config.yaml#L1-10
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta4
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

Luego, este archivo de configuración puede pasarse al comando kubeadm:

```/dev/null/shell#L1-2
kubeadm init --config kubeadm-config.yaml
```

{{< note >}}
Kubeadm utiliza la misma `KubeletConfiguration` para todos los nodos del clúster.
La `KubeletConfiguration` se almacena en un objeto [ConfigMap](/docs/concepts/configuration/configmap)
bajo el namespace `kube-system`.

Ejecutar los subcomandos `init`, `join` y `upgrade` hará que kubeadm
escriba la `KubeletConfiguration` como un archivo en `/var/lib/kubelet/config.yaml`
y la pase al kubelet del nodo local.
{{< /note >}}

## Usando el controlador `cgroupfs`

Para usar `cgroupfs` y evitar que `kubeadm upgrade` modifique el controlador de cgroup en la `KubeletConfiguration` en instalaciones existentes, debes ser explícito sobre su valor. Esto aplica en el caso de que no desees que futuras versiones de kubeadm apliquen el controlador `systemd` por defecto.

Consulta la siguiente sección "[Modificar el ConfigMap del kubelet](#modify-the-kubelet-configmap)" para más detalles sobre cómo ser explícito con el valor.

Si deseas configurar un runtime de contenedores para usar el controlador `cgroupfs`,
debes consultar la documentación del runtime de contenedores de tu elección.

## Migrando al controlador `systemd`

Para cambiar el controlador de cgroup de un clúster existente de kubeadm de `cgroupfs` a `systemd` en el lugar,
se requiere un procedimiento similar a una actualización del kubelet. Esto debe incluir ambos
pasos que se describen a continuación.

{{< note >}}
Alternativamente, es posible reemplazar los nodos antiguos del clúster por nuevos
que usen el controlador `systemd`. Esto requiere ejecutar solo el primer paso a continuación
antes de unir los nuevos nodos y asegurarse de que las cargas de trabajo puedan moverse de forma segura a los nuevos
nodos antes de eliminar los antiguos.
{{< /note >}}

### Modificar el ConfigMap del kubelet

- Ejecuta `kubectl edit cm kubelet-config -n kube-system`.
- Modifica el valor existente de `cgroupDriver` o agrega un nuevo campo como este:

  ```/dev/null/configmap.yaml#L1-2
  cgroupDriver: systemd
  ```
  Este campo debe estar presente bajo la sección `kubelet:` del ConfigMap.

### Actualizar el controlador de cgroup en todos los nodos

Para cada nodo en el clúster:

- [Drena el nodo](/docs/tasks/administer-cluster/safely-drain-node) usando `kubectl drain <node-name> --ignore-daemonsets`
- Detén el kubelet usando `systemctl stop kubelet`
- Detén el runtime de contenedores
- Modifica el controlador de cgroup del runtime de contenedores a `systemd`
- Establece `cgroupDriver: systemd` en `/var/lib/kubelet/config.yaml`
- Inicia el runtime de contenedores
- Inicia el kubelet usando `systemctl start kubelet`
- [Desbloquea el nodo](/docs/tasks/administer-cluster/safely-drain-node) usando `kubectl uncordon <node-name>`

Ejecuta estos pasos en los nodos uno por uno para asegurar que las cargas de trabajo
tengan suficiente tiempo para programarse en diferentes nodos.

Una vez completado el proceso, asegúrate de que todos los nodos y cargas de trabajo estén saludables.

