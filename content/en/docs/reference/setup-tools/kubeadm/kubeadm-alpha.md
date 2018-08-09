---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm alpha
weight: 90
---
{{< caution >}}
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
{{< /caution >}}

In v1.8.0, kubeadm introduced the `kubeadm alpha phase` command with the aim of making kubeadm more modular. This modularity enables you to invoke atomic sub-steps of the bootstrap process; you can let kubeadm do some parts and fill in yourself where you need customizations.

`kubeadm alpha phase` is consistent with [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow),
and behind the scene both use the same code.

## kubeadm alpha phase preflight {#cmd-phase-preflight}

You can execute preflight checks both for the master node, like in `kubeadm init`, or for the worker node
like in `kubeadm join`.

{{< tabs name="tab-preflight" >}}
{{< tab name="master" include="generated/kubeadm_alpha_phase_preflight_master.md" />}}
{{< tab name="node" include="generated/kubeadm_alpha_phase_preflight_node.md" />}}
{{< /tabs >}}


## kubeadm alpha phase certs {#cmd-phase-certs}

You can create all required certificates with the `all` subcommand or selectively create certificates.

{{< tabs name="tab-certs" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_certs_all.md" />}}
{{< tab name="ca" include="generated/kubeadm_alpha_phase_certs_ca.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_phase_certs_apiserver.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_alpha_phase_certs_apiserver-kubelet-client.md" />}}
{{< tab name="sa" include="generated/kubeadm_alpha_phase_certs_sa.md" />}}
{{< tab name="front-proxy-ca" include="generated/kubeadm_alpha_phase_certs_front-proxy-ca.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_alpha_phase_certs_front-proxy-client.md" />}}
{{< /tabs >}}


## kubeadm alpha phase kubeconfig {#cmd-phase-kubeconfig}

You can create all required kubeconfig files with the `all` subcommand, or selectively create the files.
Additionally, the `user` subcommand supports the creation of kubeconfig files for additional users.

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_kubeconfig_all.md" />}}
{{< tab name="admin" include="generated/kubeadm_alpha_phase_kubeconfig_admin.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_alpha_phase_kubeconfig_kubelet.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_alpha_phase_kubeconfig_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_alpha_phase_kubeconfig_scheduler.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_phase_kubeconfig_user.md" />}}
{{< /tabs >}}


## kubeadm alpha phase controlplane {#cmd-phase-controlplane}

You can create all required static Pod files for the control plane components with the `all` subcommand,
or selectively create the files.

{{< tabs name="tab-controlplane" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_controlplane_all.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_phase_controlplane_apiserver.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_alpha_phase_controlplane_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_alpha_phase_controlplane_scheduler.md" />}}
{{< /tabs >}}


## kubeadm alpha phase etcd {#cmd-phase-etcd}

Use the following command to create a self-hosted, local etcd instance based on a static Pod file.

{{< tabs name="tab-etcd" >}}
{{< tab name="etcd local" include="generated/kubeadm_alpha_phase_etcd_local.md" />}}
{{< /tabs >}}


## kubeadm alpha phase mark-master {#cmd-phase-mark-master}

Use the following command to label and taint the node with the `node-role.kubernetes.io/master=""` key-value pair.

{{< tabs name="tab-mark-master" >}}
{{< tab name="mark-master" include="generated/kubeadm_alpha_phase_mark-master.md" />}}
{{< /tabs >}}


## kubeadm alpha phase bootstrap-token {#cmd-phase-bootstrap-token}

Use the following actions to fully configure bootstrap tokens.
You can fully configure bootstrap tokens with the `all` subcommand,
or selectively configure single elements.

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_bootstrap-token_all.md" />}}
{{< tab name="create" include="generated/kubeadm_alpha_phase_bootstrap-token_create.md" />}}
{{< tab name="cluster-info" include="generated/kubeadm_alpha_phase_bootstrap-token_cluster-info.md " />}}
{{< tab name="node allow-auto-approve" include="generated/kubeadm_alpha_phase_bootstrap-token_node_allow-auto-approve.md" />}}
{{< tab name="node allow-post-csrs" include="generated/kubeadm_alpha_phase_bootstrap-token_node_allow-post-csrs.md" />}}
{{< /tabs >}}


## kubeadm alpha phase upload-config {#cmd-phase-upload-config}

You can use this command to upload the kubeadm configuration to your cluster.
Alternatively, you can use [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

{{< tabs name="upload-config" >}}
{{< tab name="mark-master" include="generated/kubeadm_alpha_phase_upload-config.md" />}}
{{< /tabs >}}


## kubeadm alpha phase addon {#cmd-phase-addon}

You can install all the available addons with the `all` subcommand, or
install them selectively.

{{< note >}}
**Note:** If `kubeadm` is invoked with `--feature-gates=CoreDNS=false`, kube-dns is installed.
{{< /note >}}

{{< tabs name="tab-addon" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_addon_all.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_alpha_phase_addon_kube-proxy.md" />}}
{{< tab name="coredns" include="generated/kubeadm_alpha_phase_addon_coredns.md" />}}
{{< /tabs >}}


## kubeadm alpha phase self-hosting {#cmd-phase-self-hosting}

{{< caution >}}
**Caution:** Self-hosting is an alpha feature. See [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) documentation for self-hosting limitations.
{{< /caution >}}

{{< tabs name="tab-self-hosting" >}}
{{< tab name="self-hosting" include="generated/kubeadm_alpha_phase_selfhosting_convert-from-staticpods.md" />}}
{{< /tabs >}}


## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes master node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
