---
title: kubeadm reset phase
weight: 90
---
`kubeadm reset phase` enables you to invoke atomic steps of the node reset process.
Hence, you can let kubeadm do some of the work and you can fill in the gaps
if you wish to apply customization.

`kubeadm reset phase` is consistent with the [kubeadm reset workflow](/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow),
and behind the scene both use the same code.

## kubeadm reset phase {#cmd-reset-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_reset_phase.md" />}}
{{< /tabs >}}

## kubeadm reset phase preflight {#cmd-reset-phase-preflight}

Using this phase you can execute preflight checks on a node that is being reset.

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_reset_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm reset phase update-cluster-status {#cmd-reset-phase-update-cluster-status}

Using this phase you can remove this control-plane node from the ClusterStatus object.

{{< tabs name="tab-update-cluster-status" >}}
{{< tab name="update-cluster-status" include="generated/kubeadm_reset_phase_update-cluster-status.md" />}}
{{< /tabs >}}

## kubeadm reset phase remove-etcd-member {#cmd-reset-phase-remove-etcd-member}

Using this phase you can remove this control-plane node's etcd member from the etcd cluster.

{{< tabs name="tab-remove-etcd-member" >}}
{{< tab name="remove-etcd-member" include="generated/kubeadm_reset_phase_remove-etcd-member.md" />}}
{{< /tabs >}}

## kubeadm reset phase cleanup-node {#cmd-reset-phase-cleanup-node}

Using this phase you can perform cleanup on this node.

{{< tabs name="tab-cleanup-node" >}}
{{< tab name="cleanup-node" include="generated/kubeadm_reset_phase_cleanup-node.md" />}}
{{< /tabs >}}

## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
