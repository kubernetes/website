---
title: Upgrading Windows nodes
min-kubernetes-server-version: 1.17
content_type: task
weight: 110
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

This page explains how to upgrade a Windows node created with kubeadm.

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Windows nodes.

<!-- steps -->

## Upgrading worker nodes

### Upgrade kubeadm

1.  From the Windows node, upgrade kubeadm:

    ```powershell
    # replace {{< skew currentPatchVersion >}} with your desired version
    curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```

### Drain the node

1.  From a machine with access to the Kubernetes API,
    prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    You should see output similar to this:

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### Upgrade the kubelet configuration

1.  From the Windows node, call the following command to sync new kubelet configuration:

    ```powershell
    kubeadm upgrade node
    ```

### Upgrade kubelet and kube-proxy

1.  From the Windows node, upgrade and restart the kubelet:

    ```powershell
    stop-service kubelet
    curl.exe -Lo <path-to-kubelet.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```

2. From the Windows node, upgrade and restart the kube-proxy.

    ```powershell
    stop-service kube-proxy
    curl.exe -Lo <path-to-kube-proxy.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```

{{< note >}}
If you are running kube-proxy in a HostProcess container within a Pod, and not as a Windows Service,
you can upgrade kube-proxy by applying a newer version of your kube-proxy manifests.
{{< /note >}}

### Uncordon the node

1.  From a machine with access to the Kubernetes API,
bring the node back online by marking it schedulable:

    ```shell
    # replace <node-to-drain> with the name of your node
    kubectl uncordon <node-to-drain>
    ```
 ## {{% heading "whatsnext" %}}

* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
