---
title: Actualización de nodos Linux
content_type: task
weight: 40
---

<!-- overview -->

Esta página explica cómo actualizar nodos Worker de Linux creados con kubeadm.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* Familiarízate con [el proceso para actualizar el resto de tu
cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). Querrás
actualizar los nodos del plano de control antes de actualizar tus nodos Worker de Linux.

<!-- steps -->

## Cambiar el repositorio de paquetes

Si estás usando los repositorios de paquetes propiedad de la comunidad (`pkgs.k8s.io`), necesitas 
habilitar el repositorio de paquetes para la versión menor de Kubernetes deseada. Esto se explica en
el documento [Cambiar el repositorio de paquetes de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Actualización de nodos worker

### Actualizar kubeadm

Actualiza kubeadm:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian o HypriotOS" %}}
```shell
# reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS, RHEL o Fedora" %}}
```shell
# reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

### Ejecutar "kubeadm upgrade"

Para nodos worker esto actualiza la configuración local del kubelet:

```shell
sudo kubeadm upgrade node
```

### Drenar el nodo

Prepara el nodo para mantenimiento marcándolo como no programable y desalojando las cargas de trabajo:

```shell
# ejecuta este comando en un nodo del plano de control
# reemplaza <node-to-drain> con el nombre de tu nodo que estás drenando
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Actualizar kubelet y kubectl

1. Actualiza el kubelet y kubectl:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu, Debian o HypriotOS" %}}
   ```shell
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS, RHEL o Fedora" %}}
   ```shell
   # reemplaza x en {{< skew currentVersion >}}.x-* con la última versión de parche
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. Reinicia el kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Descordonar el nodo

Pon el nodo de vuelta en línea marcándolo como programable:

```shell
# ejecuta este comando en un nodo del plano de control
# reemplaza <node-to-uncordon> con el nombre de tu nodo
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

* Ve cómo [Actualizar nodos Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).