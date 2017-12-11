---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm config
---
{% capture overview %}
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called 
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.

You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.

{% endcapture %}

{% capture body %}
## kubeadm config upload from-file {#cmd-config-from-file}
{% include_relative generated/kubeadm_config_upload_from-file.md %}

## kubeadm config upload from-flags {#cmd-config-from-flags}
{% include_relative generated/kubeadm_config_upload_from-flags.md %}

## kubeadm config view {#cmd-config-view}
{% include_relative generated/kubeadm_config_view.md %}
{% endcapture %}

{% capture whatsnext %}
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
{% endcapture %}

{% include templates/concept.md %}