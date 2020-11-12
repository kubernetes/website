---
title: kubeadm alpha
content_type: concept
weight: 90
---

{{< caution >}}
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
{{< /caution >}}

## kubeadm alpha kubeconfig user {#cmd-phase-kubeconfig}

The `user` subcommand can be used for the creation of kubeconfig files for additional users.

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_alpha_kubeconfig.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_kubeconfig_user.md" />}}
{{< /tabs >}}

## kubeadm alpha kubelet config {#cmd-phase-kubelet}

Use the following command to enable the DynamicKubeletConfiguration feature.

{{< tabs name="tab-kubelet" >}}
{{< tab name="kubelet" include="generated/kubeadm_alpha_kubelet.md" />}}
{{< tab name="enable-dynamic" include="generated/kubeadm_alpha_kubelet_config_enable-dynamic.md" />}}
{{< /tabs >}}

## kubeadm alpha selfhosting pivot {#cmd-selfhosting}

The subcommand `pivot` can be used to convert a static Pod-hosted control plane into a self-hosted one.

[Documentation](/docs/setup/production-environment/tools/kubeadm/self-hosting/)

{{< tabs name="selfhosting" >}}
{{< tab name="selfhosting" include="generated/kubeadm_alpha_selfhosting.md" />}}
{{< tab name="pivot" include="generated/kubeadm_alpha_selfhosting_pivot.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
