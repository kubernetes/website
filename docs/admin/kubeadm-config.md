---
approvers:
- mikedanese
- luxas
- jbeda
title: Kubeadm config
notitle: true
---
{% capture overview %}
# Kubeadm config
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called 
`kubeadm-config` in the `kube-system` namespace, and later reads that configuration when upgrading 
in order to configure system components correctly. This provides a seamless user experience.

With `kubeadm config view` you can view the above ConfigMap, or, if you initialized your cluster
 using kubeadm v1.7.x or lower, you can use the `kubeadm config upload` commands to create this
ConfigMap before executing `kubeadm upgrade`.

{% endcapture %}

{% capture body %}
## Kubeadm config upload from-file {#cmd-config-from-file}
{% include_relative _kubeadm/kubeadm_config_upload_from-file.md %}

## Kubeadm config upload from-flags {#cmd-config-from-flags}
{% include_relative _kubeadm/kubeadm_config_upload_from-flags.md %}

## Kubeadm config view {#cmd-config-view}
{% include_relative _kubeadm/kubeadm_config_view.md %}
{% endcapture %}

{% capture whatsnext %}
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
{% endcapture %}

{% include templates/concept.md %}