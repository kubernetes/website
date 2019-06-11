---
title: kubeadm init phase
weight: 90
---
In v1.8.0, kubeadm introduced the `kubeadm alpha phase` command with the aim of making kubeadm more modular. In v1.13.0 this command graduated to `kubeadm init phase`. This modularity enables you to invoke atomic sub-steps of the bootstrap process. Hence, you can let kubeadm do some parts and fill in yourself where you need customizations.

`kubeadm init phase` is consistent with the [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow),
and behind the scene both use the same code.

## kubeadm init phase preflight {#cmd-phase-preflight}

Using this command you can execute preflight checks on a control-plane node.

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_init_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm init phase certs {#cmd-phase-certs}

Can be used to create all required certificates by kubeadm.

{{< tabs name="tab-certs" >}}
{{< tab name="certs" include="generated/kubeadm_init_phase_certs.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_certs_all.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_init_phase_certs_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_init_phase_certs_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init_phase_certs_apiserver.md" />}}
{{< tab name="ca" include="generated/kubeadm_init_phase_certs_ca.md" />}}
{{< tab name="etcd-ca" include="generated/kubeadm_init_phase_certs_etcd-ca.md" />}}
{{< tab name="healthcheck-client" include="generated/kubeadm_init_phase_certs_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_init_phase_certs_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_init_phase_certs_etcd-server.md" />}}
{{< tab name="front-proxy-ca" include="generated/kubeadm_init_phase_certs_front-proxy-ca.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_init_phase_certs_front-proxy-client.md" />}}
{{< tab name="sa" include="generated/kubeadm_init_phase_certs_sa.md" />}}
{{< /tabs >}}

## kubeadm init phase kubeconfig {#cmd-phase-kubeconfig}

You can create all required kubeconfig files by calling the `all` subcommand or call then individually.

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_init_phase_kubeconfig.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_kubeconfig_all.md" />}}
{{< tab name="admin" include="generated/kubeadm_init_phase_kubeconfig_admin.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init_phase_kubeconfig_controller-manager.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init_phase_kubeconfig_kubelet.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init_phase_kubeconfig_scheduler.md" />}}
{{< /tabs >}}

## kubeadm init phase kubelet-start {#cmd-phase-kubelet-start}

This phase will write the kubelet configuration file and environment file and then start the kubelet.

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_init_phase_kubelet-start.md" />}}
{{< /tabs >}}

## kubeadm init phase control-plane {#cmd-phase-control-plane}

Using this phase you can create all required static Pod files for the control plane components.

{{< tabs name="tab-control-plane" >}}
{{< tab name="control-plane" include="generated/kubeadm_init_phase_control-plane.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_control-plane_all.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init_phase_control-plane_apiserver.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init_phase_control-plane_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init_phase_control-plane_scheduler.md" />}}
{{< /tabs >}}


## kubeadm init phase etcd {#cmd-phase-etcd}

Use the following phase to create a local etcd instance based on a static Pod file.

{{< tabs name="tab-etcd" >}}
{{< tab name="etcd" include="generated/kubeadm_init_phase_etcd.md" />}}
{{< tab name="local" include="generated/kubeadm_init_phase_etcd_local.md" />}}
{{< /tabs >}}


## kubeadm init phase upload-certs {#cmd-phase-upload-certs}

Use the following phase to upload control-plane certificates to the cluster.
By default the certs and encryption key expire after two hours.

{{< tabs name="tab-upload-certs" >}}
{{< tab name="upload-certs" include="generated/kubeadm_init_phase_upload-certs.md" />}}
{{< /tabs >}}


## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}

Use the following phase to label and taint the node with the `node-role.kubernetes.io/master=""` key-value pair.

{{< tabs name="tab-mark-control-plane" >}}
{{< tab name="mark-control-plane" include="generated/kubeadm_init_phase_mark-control-plane.md" />}}
{{< /tabs >}}


## kubeadm init phase bootstrap-token {#cmd-phase-bootstrap-token}

Use the following phase to configure bootstrap tokens.

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="bootstrap-token" include="generated/kubeadm_init_phase_bootstrap-token.md" />}}
{{< /tabs >}}


## kubeadm init phase upload-config {#cmd-phase-upload-config}

You can use this command to upload the kubeadm configuration to your cluster.
Alternatively, you can use [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

{{< tabs name="upload-config" >}}
{{< tab name="upload-config" include="generated/kubeadm_init_phase_upload-config.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_upload-config_all.md" />}}
{{< tab name="kubeadm" include="generated/kubeadm_init_phase_upload-config_kubeadm.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init_phase_upload-config_kubelet.md" />}}
{{< /tabs >}}


## kubeadm init phase addon {#cmd-phase-addon}

You can install all the available addons with the `all` subcommand, or
install them selectively.

{{< tabs name="tab-addon" >}}
{{< tab name="addon" include="generated/kubeadm_init_phase_addon.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_addon_all.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_init_phase_addon_kube-proxy.md" />}}
{{< tab name="coredns" include="generated/kubeadm_init_phase_addon_coredns.md" />}}
{{< /tabs >}}

To use kube-dns instead of CoreDNS you have to pass a configuration file:

```bash
# for installing a DNS addon only
kubeadm init phase addon coredns --config=someconfig.yaml
# for creating a complete control plane node
kubeadm init --config=someconfig.yaml
# for listing or pulling images
kubeadm config images list/pull --config=someconfig.yaml
# for upgrades
kubeadm upgrade apply --config=someconfig.yaml
```

The file has to contain a [`DNS`](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2#DNS) field in[`ClusterConfiguration`](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2#ClusterConfiguration)
and also a type for the addon - `kube-dns` (default value is `CoreDNS`).

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
dns:
  type: "kube-dns"
```

For more details on each field in the `v1beta2` configuration you can navigate to our
[API reference pages.] (https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)

## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
