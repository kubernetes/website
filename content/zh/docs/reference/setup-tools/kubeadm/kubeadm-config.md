---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm 配置
content_template: templates/concept
weight: 50
---
<!--
---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm config
content_template: templates/concept
weight: 50
---
-->
{{% capture overview %}}

从 v1.8.0 开始，kubeadm 将集群的配置上传到一个名为 `kubeadm-config` 的 ConfigMap 对象中，
对象位于 `kube-system` 命名空间内。并在以后的升级中读取这个 ConfigMap 配置对象。
这样可以保证系统组件的正确配置，提供无缝的用户体验。

<!--
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.
-->
您可以执行 `kubeadm config view` 命令来查看 ConfigMap。如果使用 kubeadm v1.7.x
或更低版本初始化集群，则必须先使用 `kubeadm config upload` 创建 ConfigMap，
然后才能使用 `kubeadm upgrade`。
<!--
You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.
-->

在 Kubernetes v1.11.0 中，添加了一些新命令。您可以使用 `kubeadm config print-default`  
打印默认配置 `kubeadm config migrate` 并将旧配置文件转换为较新版本。
`kubeadm config images list` 并且 `kubeadm config images pull` 可以用来列出和拉 kubeadm 需要的图像。
<!--
In Kubernetes v1.11.0, some new commands were added. You can use `kubeadm config print-default`
to print the default configuration and `kubeadm config migrate` to convert your old configuration
files to a newer version. `kubeadm config images list` and `kubeadm config images pull` can be used
to list and pull the images that kubeadm requires.
-->

{{% /capture %}}

{{% capture body %}}
## kubeadm 从文件上传配置 {#cmd-config-from-file}
{{< include "generated/kubeadm_config_upload_from-file.md" >}}

<!--
## kubeadm config upload from-file {#cmd-config-from-file}
-->

## kubeadm 从标记上传配置 {#cmd-config-from-flags}
{{< include "generated/kubeadm_config_upload_from-flags.md" >}}

<!--
## kubeadm config upload from-flags {#cmd-config-from-flags}
-->

## kubeadm 视图配置 {#cmd-config-view}
{{< include "generated/kubeadm_config_view.md" >}}

<!--
## kubeadm config view {#cmd-config-view}
-->

## kubeadm 打印默认配置 {#cmd-config-print-default}
{{< include "generated/kubeadm_config_print-default.md" >}}

<!--
## kubeadm config print-default {#cmd-config-print-default}
-->

## kubeadm 迁移配置 {#cmd-config-migrate}
{{< include "generated/kubeadm_config_migrate.md" >}}

<!--
## kubeadm config migrate {#cmd-config-migrate}
-->

## kubeadm 镜像列表配置 {#cmd-config-images-list}
{{< include "generated/kubeadm_config_images_list.md" >}}

<!--
## kubeadm config images list {#cmd-config-images-list}
-->

## kubeadm 拉镜像 {#cmd-config-images-pull}
{{< include "generated/kubeadm_config_images_pull.md" >}}

<!--
## kubeadm config images pull {#cmd-config-images-pull}
-->

{{% /capture %}}

<!--
{{% capture whatsnext %}}
-->

{{% 下一步做什么 %}}
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 将 Kubernetes 集群升级到更新版本
{{% /capture %}}

<!--
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
-->
