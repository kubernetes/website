---
title: Adding Linux worker nodes
content_type: task
weight: 10
---

<!-- overview -->

This page explains how to add Linux worker nodes to a kubeadm cluster.

## {{% heading "prerequisites" %}}

* Each joining worker node has installed the required components from
[Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/), such as,
kubeadm, the kubelet and a {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
* A running kubeadm cluster created by `kubeadm init` and following the steps
in the document [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
* You need superuser access to the node.

<!-- steps -->

## Adding Linux worker nodes

To add new Linux worker nodes to your cluster do the following for each machine:

1. Connect to the machine by using SSH or another method.
1. Run the join command that was output by `kubeadm init` or create a new join command by running `kubeadm token create --print-join-command`. The join command should look like this:
   
  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

## {{% heading "whatsnext" %}}

* See how to [add Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/).
