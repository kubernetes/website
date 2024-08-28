---
title: kubeadm upgrade phase
weight: 90
content_type: concept
---
In v1.15.0, kubeadm introduced preliminary support for `kubeadm upgrade node` phases.
Phases for other `kubeadm upgrade` sub-commands such as `apply`, could be added in the
following releases.

## kubeadm upgrade node phase {#cmd-node-phase}

Using this phase you can choose to execute the separate steps of the upgrade of
secondary control-plane or worker nodes. Please note that `kubeadm upgrade apply` still has to
be called on a primary control-plane node.

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a kubeadm node
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
