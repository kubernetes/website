---
cn-approvers:
- tianshapjq
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm 配置
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm config
---
-->
{% capture overview %}
<!--
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called 
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.
-->
从 v1.8.0 版本开始，kubeadm 上传集群的配置信息到 `kube-system` 命名空间下的一个名为 `kubeadm-config` 的 ConfigMap 中，然后在升级的时候读取这个 ConfigMap。
这样可以正确配置系统组件，并提供无缝的用户体验。

<!--
You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.
-->
您可以通过执行 `kubeadm config view` 来查看这个 ConfigMap。如果您使用 kubeadm v1.7.x 或者更低的版本来初始化您的集群，那么在使用 `kubeadm upgrade` 之前，您必须使用 `kubeadm config upload` 来创建 ConfigMap。

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