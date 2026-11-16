---
title: Actualizando nodos Linux
content_type: task
weight: 40
---

<!-- overview -->

Esta página explica cómo actualizar nodos de trabajo Linux creados con kubeadm.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* Familiarízate con [el proceso para actualizar el clúster de
kubeadm](/es/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). Conviene actualizar
los nodos controladores antes de actualizar los nodos de trabajo Linux.

<!-- steps -->

## Cambiando el repositorio de paquetes

Si usas los repositorios de paquetes gestionados por la comunidad (`pkgs.k8s.io`), necesitas
habilitar el repositorio de paquetes de la versión menor de Kubernetes deseada. Esto se explica en el documento
[cambiando el repositorio de paquetes de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Actualizando los nodos de trabajo

### Actualiza kubeadm

Actualiza kubeadm:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
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

### Ejecuta "kubeadm upgrade"

Para los nodos de trabajo, este comando actualiza la configuración local del kubelet:

```shell
sudo kubeadm upgrade node
```

### Drena el nodo

Prepara el nodo para el mantenimiento marcándolo como no programable y desalojando las cargas de trabajo:

```shell
# ejecuta este comando en un nodo controlador
# sustituye <nodo-a-drenar> por el nombre del nodo que estás drenando
kubectl drain <nodo-a-drenar> --ignore-daemonsets
```

### Actualiza kubelet y kubectl

1. Actualiza el kubelet y kubectl:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
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
# ejecuta este comando en un nodo controlador
# sustituye <nodo-a-reincorporar> por el nombre de tu nodo
kubectl uncordon <nodo-a-reincorporar>
```

## {{% heading "whatsnext" %}}

* Consulta cómo [actualizar nodos Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
