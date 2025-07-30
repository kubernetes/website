---
title: Actualizando nodos Windows
min-kubernetes-server-version: 1.17
content_type: task
weight: 41
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Esta página explica cómo actualizar un nodo Windows creado con kubeadm.

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* Familiarízate con [el proceso para actualizar el resto de tu cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). Querrás actualizar los nodos del control plane antes de actualizar tus nodos Windows.

<!-- steps -->

## Actualizando nodos worker

### Actualizar kubeadm

1.  Desde el nodo Windows, actualiza kubeadm:

    ```/dev/null/powershell#L1-3
    # reemplaza {{< skew currentPatchVersion >}} con la versión deseada
    curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```

### Drenar el nodo

1.  Desde una máquina con acceso a la API de Kubernetes, prepara el nodo para mantenimiento marcándolo como no programable y desalojando las cargas de trabajo:

    ```/dev/null/shell#L1-3
    # reemplaza <node-to-drain> con el nombre de tu nodo que estás drenando
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    Deberías ver una salida similar a esta:

    ```/dev/null/output#L1-3
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### Actualizar la configuración del kubelet

1.  Desde el nodo Windows, ejecuta el siguiente comando para sincronizar la nueva configuración del kubelet:

    ```/dev/null/powershell#L1-2
    kubeadm upgrade node
    ```

### Actualizar kubelet y kube-proxy

1.  Desde el nodo Windows, actualiza y reinicia el kubelet:

    ```/dev/null/powershell#L1-4
    stop-service kubelet
    curl.exe -Lo <path-to-kubelet.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```

2. Desde el nodo Windows, actualiza y reinicia el kube-proxy.

    ```/dev/null/powershell#L1-4
    stop-service kube-proxy
    curl.exe -Lo <path-to-kube-proxy.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```

{{< note >}}
Si estás ejecutando kube-proxy en un contenedor HostProcess dentro de un Pod, y no como un servicio de Windows, puedes actualizar kube-proxy aplicando una versión más nueva de tus manifiestos de kube-proxy.
{{< /note >}}

### Descordonar el nodo

1.  Desde una máquina con acceso a la API de Kubernetes, vuelve a poner el nodo en línea marcándolo como programable:

    ```/dev/null/shell#L1-3
    # reemplaza <node-to-drain> con el nombre de tu nodo
    kubectl uncordon <node-to-drain>
    ```
 ## {{% heading "whatsnext" %}}

* Ve cómo [Actualizar nodos Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).

