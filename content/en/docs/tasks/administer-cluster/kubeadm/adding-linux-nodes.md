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
1. Run the command that was output by `kubeadm init`. For example:

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

### Additional information for kubeadm join

{{< note >}}
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[2001:db8::101]:2073`.
{{< /note >}}

If you do not have the output of `kubeadm init` any more, you can get a new command / token by running the following command on the control plane node:

```bash
# Run this on a control plane node
kubeadm token create --print-join-command
```

The output should be similar to this:

```console
kubeadm join 172.30.1.2:6443 --token mp0y8w.2xymsdfeu0d16ge --discovery-token-ca-cert-hash sha256:0aa971e33a03d70c69cb0cefe3de...
```

Running this command on the node should produce an output simiar to this:

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

A few seconds later, you should notice this node in the output from `kubectl get nodes`.
(for example, run `kubectl` on a  control plane node).

{{< note >}}
As the cluster nodes are usually initialized sequentially, the CoreDNS Pods are likely to all run
on the first control plane node. To provide higher availability, please rebalance the CoreDNS Pods
with `kubectl -n kube-system rollout restart deployment coredns` after at least one new node is joined.
{{< /note >}}

## {{% heading "whatsnext" %}}

* See how to [add Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/).
