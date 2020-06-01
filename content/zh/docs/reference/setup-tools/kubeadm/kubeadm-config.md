---
title: kubeadm config
content_type: concept
weight: 50
---

<!-- overview -->
<!--
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.
-->

从 v1.8.0 开始，kubeadm 将集群的配置上传到名为 kube-system 的 ConfigMap 对象中，对象位于 kube-system 命名空间内。并在以后的升级中读取这个 ConfigMap 配置对象。
这样可以保证系统组件的正确配置，提供无缝的用户体验。

<!--
You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.
-->

您可以执行 kubeadm config view 来查看 ConfigMap。如果使用 kubeadm v1.7.x 或更低版本来初始化群集，必须先使用 kubeadm config upload 创建 ConfigMap，然后才能使用 kubeadm upgrade。

<!--
In Kubernetes v1.11.0, some new commands were added. You can use `kubeadm config print-default`
to print the default configuration and `kubeadm config migrate` to convert your old configuration
files to a newer version. `kubeadm config images list` and `kubeadm config images pull` can be used
to list and pull the images that kubeadm requires.
-->

在 Kubernetes v1.11.0 中，添加了一些新命令。你可以使用 kubeadm config print-default
打印默认配置，可以用 kubeadm config migrate 来将旧的配置文件转换到较新的版本，还可以使用 kubeadm config images list 和 kubeadm config images pull
列出并拉取 kubeadm 所需的镜像。



<!-- body -->
## kubeadm config upload from-file {#cmd-config-from-file}

## kubeadm config view {#cmd-config-view}
{{< include "generated/kubeadm_config_view.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}
{{< include "generated/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}
{{< include "generated/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}
{{< include "generated/kubeadm_config_migrate.md" >}}

## kubeadm config images list {#cmd-config-images-list}
{{< include "generated/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}
{{< include "generated/kubeadm_config_images_pull.md" >}}



## {{% heading "whatsnext" %}}


<!--
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
-->

*  [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 将 Kubernetes 集群升级到更新版本 [kubeadm upgrade]


