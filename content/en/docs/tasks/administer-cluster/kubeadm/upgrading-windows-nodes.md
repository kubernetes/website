---
title: Upgrading Windows nodes
min-kubernetes-server-version: 1.17
content_template: templates/task
weight: 40
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

This page explains how to upgrade a Windows node [created with kubeadm](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes).

{{% /capture %}}


{{% capture prerequisites %}} 
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Windows nodes.

{{% /capture %}}


{{% capture steps %}}

## Upgrading worker nodes

### Upgrade kubeadm

1.  From the Windows node, upgrade kubeadm:

    ```powershell
    # replace {{< param "fullversion" >}} with your desired version
    curl.exe -Lo C:\k\kubeadm.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubeadm.exe
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

### Upgrade kubelet

1.  From the Windows node, upgrade and restart the kubelet:

    ```powershell
    stop-service kubelet
    curl.exe -Lo C:\k\kubelet.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubelet.exe
    restart-service kubelet
    ```

### Uncordon the node

1.  From a machine with access to the Kubernetes API,
bring the node back online by marking it schedulable:

    ```shell
    # replace <node-to-drain> with the name of your node
    kubectl uncordon <node-to-drain>
    ```
### Upgrade kube-proxy

1. From a machine with access to the Kubernetes API, run the following,
again replacing {{< param "fullversion" >}} with your desired version:

    ```shell
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    ```


{{% /capture %}}
