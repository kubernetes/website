---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Kubeadm alpha
notitle: true
---

# Kubeadm alpha
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
{: .caution}

In v1.8.0, kubeadm introduced `kubeadm alpha phase` command with the aim to make kubeadm more 
modular, letting you invoke atomic sub-steps of the bootstrap process; basically, you can 
let kubeadm do some parts and fill in yourself where you need customizations.

`kubeadm alpha phase` is consistent with [kubeadm init workflow](/docs/admin/kubeadm-init.md#init-workflow), 
and behind the scene both use the same code.

* [Kubeadm alpha phase preflight](#cmd-phase-preflight)
* [Kubeadm token create](#cmd-phase-token)
* [Kubeadm alpha phase certs](#cmd-phase-certs)
* [Kubeadm alpha phase kubeconfig](#cmd-phase-kubeconfig)
* [Kubeadm alpha phase controlplane](#cmd-phase-controlplane)
* [Kubeadm alpha phase etcd](#cmd-phase-etcd)
* [Kubeadm alpha phase mark-master](#cmd-phase-mark-master)
* [Kubeadm alpha phase bootstrap-token](#cmd-phase-bootstrap-token)
* [Kubeadm alpha phase upload-config](#cmd-phase-upload-config)
* [Kubeadm alpha phase addon](#cmd-phase-addon)
* [Kubeadm alpha phase selfhosting](#cmd-phase-self-hosting)

## Kubeadm alpha phase preflight {#cmd-phase-preflight}

You can execute preflight checks both for master node, like in `kubeadm init`, or for worker node
like in `kubeadm join`.

{% capture preflight_master %}
{% include_relative _kubeadm/kubeadm_alpha_phase_preflight_master.md %}
{% endcapture %}

{% capture preflight_node %}
{% include_relative _kubeadm/kubeadm_alpha_phase_preflight_node.md %}
{% endcapture %}

{% assign tab_set_name = "tab-preflight" %}
{% assign tab_names = "master,node" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: preflight_master | push: preflight_node %}

{% include tabs.md %}

## Kubeadm token create {#cmd-phase-token}

Currently there is no a specific command under `kubeadm alpha phase` for creating a token; however
you can use [kubeadm token create](/docs/admin/kubeadm-token.md#cmd-token-create) command.

## Kubeadm alpha phase certs {#cmd-phase-certs}

You can create all required certificates with the `all` sub command or selectively create certificates.

{% capture certs_all %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_all.md %}
{% endcapture %}

{% capture certs_ca %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_ca.md %}
{% endcapture %}

{% capture certs_apiserver %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_apiserver.md %}
{% endcapture %}

{% capture certs_apiserver-kubelet-client %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_apiserver-kubelet-client.md %}
{% endcapture %}

{% capture certs_sa %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_sa.md %}
{% endcapture %}

{% capture certs_front-proxy-ca %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_front-proxy-ca.md %}
{% endcapture %}

{% capture certs_front-proxy-client %}
{% include_relative _kubeadm/kubeadm_alpha_phase_certs_front-proxy-client.md %}
{% endcapture %}

{% assign tab_set_name = "tab-certs" %}
{% assign tab_names = "all,ca,apiserver,apiserver-kubelet-client,sa,front-proxy-ca,front-proxy-client" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: certs_all | push: certs_ca | push: certs_apiserver | push: certs_apiserver-kubelet-client | push: certs_sa | push: certs_front-proxy-ca | push: certs_front-proxy-client %}

{% include tabs.md %}

## Kubeadm alpha phase kubeconfig {#cmd-phase-kubeconfig}

You can create all required kubeconfig files with the `all` sub command, or selectively create the files. Additionally, the `user` sub command supports the creation of kubeconfig files for additional users.

{% capture kubeconfig_all %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_all.md %}
{% endcapture %}

{% capture kubeconfig_admin %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_admin.md %}
{% endcapture %}

{% capture kubeconfig_kubelet %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_kubelet.md %}
{% endcapture %}

{% capture kubeconfig_controller-manager %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_controller-manager.md %}
{% endcapture %}

{% capture kubeconfig_scheduler %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_scheduler.md %}
{% endcapture %}

{% capture kubeconfig_user %}
{% include_relative _kubeadm/kubeadm_alpha_phase_kubeconfig_user.md %}
{% endcapture %}

{% assign tab_set_name = "tab-kubeconfig" %}
{% assign tab_names = "all,admin,kubelet,controller-manager,scheduler,user" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: kubeconfig_all | push: kubeconfig_admin | push: kubeconfig_kubelet | push: kubeconfig_controller-manager | push: kubeconfig_scheduler | push: kubeconfig_user %}

{% include tabs.md %}

## Kubeadm alpha phase controlplane {#cmd-phase-controlplane}

You can create all required static pod files for control plane components with the `all` sub command, 
or selectively create the files.

{% capture controlplane_all %}
{% include_relative _kubeadm/kubeadm_alpha_phase_controlplane_all.md %}
{% endcapture %}

{% capture controlplane_apiserver %}
{% include_relative _kubeadm/kubeadm_alpha_phase_controlplane_apiserver.md %}
{% endcapture %}

{% capture controlplane_controller-manager %}
{% include_relative _kubeadm/kubeadm_alpha_phase_controlplane_controller-manager.md %}
{% endcapture %}

{% capture controlplane_scheduler %}
{% include_relative _kubeadm/kubeadm_alpha_phase_controlplane_scheduler.md %}
{% endcapture %}

{% assign tab_set_name = "tab-controlplane" %}
{% assign tab_names = "all,apiserver,controller-manager,scheduler" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: controlplane_all | push: controlplane_apiserver | push: controlplane_controller-manager | push: controlplane_scheduler %}

{% include tabs.md %}

## Kubeadm alpha phase etcd {#cmd-phase-etcd}

Use the following command to create a self-hosted, local etcd instance based on a static pod file.

{% capture etcd-local %}
{% include_relative _kubeadm/kubeadm_alpha_phase_etcd_local.md %}
{% endcapture %}

{% assign tab_set_name = "tab-etcd" %}
{% assign tab_names = "etcd local" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: etcd-local %}

{% include tabs.md %}

## Kubeadm alpha phase mark-master {#cmd-phase-mark-master}

Use the following command to label the node with the `node-role.kubernetes.io/master` taint.

{% capture mark-master %}
{% include_relative _kubeadm/kubeadm_alpha_phase_mark-master.md %}
{% endcapture %}

{% assign tab_set_name = "tab-mark-master" %}
{% assign tab_names = "mark-master" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: mark-master %}

{% include tabs.md %}

## Kubeadm alpha phase bootstrap-token {#cmd-phase-bootstrap-token}

Use the following actions to fully configure bootstrap tokens.

**Note:** You have to run all commands sequentially to replicate the `kubeadm init` behaviour. 
{: .note}

{% capture bootstrap-token_cluster-info %}
{% include_relative _kubeadm/kubeadm_alpha_phase_bootstrap-token_cluster-info.md %}
{% endcapture %}

{% capture bootstrap-token_node_allow-auto-approve %}
{% include_relative _kubeadm/kubeadm_alpha_phase_bootstrap-token_node_allow-auto-approve.md %}
{% endcapture %}

{% capture bootstrap-token_node_allow-post-csrs %}
{% include_relative _kubeadm/kubeadm_alpha_phase_bootstrap-token_node_allow-post-csrs.md %}
{% endcapture %}

{% assign tab_set_name = "tab-bootstrap-token" %}
{% assign tab_names = "cluster-info,node allow-auto-approve,node allow-post-csrs" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: bootstrap-token_cluster-info | push: bootstrap-token_node_allow-auto-approve | push: bootstrap-token_node_allow-post-csrs %}

{% include tabs.md %}

## Kubeadm alpha phase upload-config {#cmd-phase-upload-config}

You can use this command to upload the configuration of your cluster. Alternatively, you 
can use [kubeadm config](kubeadm-config.md) as well.

{% capture upload-config %}
{% include_relative _kubeadm/kubeadm_alpha_phase_upload-config.md %}
{% endcapture %}

{% assign tab_set_name = "tab-upload-config" %}
{% assign tab_names = "upload-config" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: upload-config %}

{% include tabs.md %}

## Kubeadm alpha phase addon {#cmd-phase-addon}

You can install all the available abbons with the `all` sub command, or 
install them selectively.

{% capture addon-all %}
{% include_relative _kubeadm/kubeadm_alpha_phase_addon_all.md %}
{% endcapture %}

{% capture addon-kube-proxy %}
{% include_relative _kubeadm/kubeadm_alpha_phase_addon_kube-proxy.md %}
{% endcapture %}

{% capture addon-kube-dns %}
{% include_relative _kubeadm/kubeadm_alpha_phase_addon_kube-dns.md %}
{% endcapture %}

{% assign tab_set_name = "tab-addon" %}
{% assign tab_names = "all,kube-proxy,kube-dns" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: addon-all | push: addon-kube-proxy | push: addon-kube-dns %}

{% include tabs.md %}

## Kubeadm alpha phase selfhosting {#cmd-phase-self-hosting}

**Caution:** Self-hosting is an alpha feature in kubeadm 1.8, and is expected to 
become the default in a future version.
{: .caution}

{% capture self-hosting %}
{% include_relative _kubeadm/kubeadm_alpha_phase_selfhosting_convert-from-staticpods.md %}
{% endcapture %}

{% assign tab_set_name = "tab-self-hosting" %}
{% assign tab_names = "self-hosting" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: self-hosting %}

{% include tabs.md %}

## What's next
* [kubeadm init](kubeadm-init.md) to bootstraps a Kubernetes master node
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
