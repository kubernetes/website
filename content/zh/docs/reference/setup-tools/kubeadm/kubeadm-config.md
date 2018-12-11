---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm config
content_template: templates/concept
weight: 50
---
<!--
{{% capture overview %}}
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.
-->

{{％capture overview％}}
从v1.8.0开始，kubeadm 将集群的配置上传到名为 `kube-system`的 ConfigMap 中，其在`kubeadm-config` 命名空间，稍后在升级时读取ConfigMap。
这样可以正确配置系统组件，并提供无缝的用户体验。

<!--
You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.
-->

您可以执行`kubeadm config view`来查看ConfigMap。如果使用kubeadm v1.7.x或更低版本来初始化群集
，您必须在使用`kubeadm upgrade`前先使用`kubeadm config upload`创建ConfigMap。

<!--
In Kubernetes v1.11.0, some new commands were added. You can use `kubeadm config print-default`
to print the default configuration and `kubeadm config migrate` to convert your old configuration
files to a newer version. `kubeadm config images list` and `kubeadm config images pull` can be used
to list and pull the images that kubeadm requires.
-->

在Kubernetes v1.11.0中，添加了一些新命令。你可以使用`kubeadm config print-default`
打印默认配置,也可以用 `kubeadm config migrate` 来将就配置文件转换到较新的版本。可以使用`kubeadm config images list`和`kubeadm config images pull`
列出并拉取 kubeadm 所需的镜像。


{{% /capture %}}

{{% capture body %}}
## kubeadm config upload from-file {#cmd-config-from-file}
{{< include "generated/kubeadm_config_upload_from-file.md" >}}

{{< include "generated/kubeadm_config_upload_from-flags.md" >}}

## kubeadm config view {#cmd-config-view}
{{< include "generated/kubeadm_config_view.md" >}}

## kubeadm config print-default {#cmd-config-print-default}
{{< include "generated/kubeadm_config_print-default.md" >}}

## kubeadm config migrate {#cmd-config-migrate}
{{< include "generated/kubeadm_config_migrate.md" >}}

## kubeadm config images list {#cmd-config-images-list}
{{< include "generated/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}
{{< include "generated/kubeadm_config_images_pull.md" >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
{{% /capture %}}
