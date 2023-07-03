---
title: Upgrading Linux nodes
content_type: task
weight: 100
---

<!-- overview -->

This page explains how to upgrade a Linux Worker Nodes created with kubeadm.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Linux Worker nodes.

<!-- steps -->

## Upgrading worker nodes

### Upgrade kubeadm

Upgrade kubeadm:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```shell
# replace x in {{< skew currentVersion >}}.x-00 with the latest patch version
apt-mark unhold kubeadm && \
apt-get update && apt-get install -y kubeadm={{< skew currentVersion >}}.x-00 && \
apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```shell
# replace x in {{< skew currentVersion >}}.x-0 with the latest patch version
yum install -y kubeadm-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

### Call "kubeadm upgrade"

For worker nodes this upgrades the local kubelet configuration:

```shell
sudo kubeadm upgrade node
```

### Drain the node

Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

```shell
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Upgrade kubelet and kubectl

1. Upgrade the kubelet and kubectl:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}
   ```shell
   # replace x in {{< skew currentVersion >}}.x-00 with the latest patch version
   apt-mark unhold kubelet kubectl && \
   apt-get update && apt-get install -y kubelet={{< skew currentVersion >}}.x-00 kubectl={{< skew currentVersion >}}.x-00 && \
   apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}
   ```shell
   # replace x in {{< skew currentVersion >}}.x-0 with the latest patch version
   yum install -y kubelet-{{< skew currentVersion >}}.x-0 kubectl-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. Restart the kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Uncordon the node

Bring the node back online by marking it schedulable:

```shell
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).