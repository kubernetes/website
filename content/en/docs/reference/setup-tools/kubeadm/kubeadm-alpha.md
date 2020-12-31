---
title: kubeadm alpha
content_type: concept
weight: 90
---

{{< caution >}}
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!

`kubeadm alpha` is deprecated in 1.21 and will be removed in 1.22.
{{< /caution >}}

## kubeadm alpha kubeconfig user {#cmd-phase-kubeconfig}

{{< caution >}}
`kubeadm alpha kubeconfig` is deprecated in 1.21 and will be removed in 1.22.

Please use the same command under "kubeadm kubeconfig"
{{< /caution >}}

The `user` subcommand can be used for the creation of kubeconfig files for additional users.

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_alpha_kubeconfig.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_kubeconfig_user.md" />}}
{{< /tabs >}}

## kubeadm alpha selfhosting pivot {#cmd-selfhosting}

{{< caution >}}
`kubeadm alpha selfhosting` is deprecated in 1.21, self-hosting support in kubeadm is deprecated 
and will be removed in 1.22.
{{< /caution >}}

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
