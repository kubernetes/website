---
title: kubeadm config
content_type: concept
weight: 50
---
<!--
reviewers:
- luxas
- jbeda
title: kubeadm config
content_type: concept
weight: 50
-->

<!-- overview -->
<!--
During `kubeadm init`, kubeadm uploads the `ClusterConfiguration` object to your cluster
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace. This configuration is then read during
`kubeadm join`, `kubeadm reset` and `kubeadm upgrade`.
-->
在 `kubeadm init` 执行期间，kubeadm 将 `ClusterConfiguration` 对象上传
到你的集群的 `kube-system` 名字空间下名为 `kubeadm-config` 的 ConfigMap 对象中。
然后在 `kubeadm join`、`kubeadm reset` 和 `kubeadm upgrade` 执行期间读取此配置。

<!--
You can use `kubeadm config print` to print the default static configuration that kubeadm
uses for `kubeadm init` and `kubeadm join`.
-->
你可以使用 `kubeadm config print` 命令打印默认静态配置，
kubeadm 运行 `kubeadm init` and `kubeadm join` 时将使用此配置。

{{< note >}}
<!--
The output of the command is meant to serve as an example. You must manually edit the output
of this command to adapt to your setup. Remove the fields that you are not certain about and kubeadm
will try to default them on runtime by examining the host.
-->
此命令的输出旨在作为示例。你必须手动编辑此命令的输出来适配你的设置。
删除你不确定的字段，kubeadm 将通过检查主机来尝试在运行时给它们设默认值。
{{< /note >}}

<!--
For more information on `init` and `join` navigate to
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
or [Using kubeadm join with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).
-->
更多有关 `init` 和 `join`
的信息请浏览[使用带配置文件的 kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
或[使用带配置文件的 kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file)。

<!--
For more information on using the kubeadm configuration API navigate to
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags).
-->
有关使用 kubeadm 的配置 API 的更多信息，
请浏览[使用 kubeadm API 来自定义组件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags)。

<!-- 
You can use `kubeadm config migrate` to convert your old configuration files that contain a deprecated
API version to a newer, supported API version.

`kubeadm config validate` can be used for validating a configuration file.
-->
你可以使用 `kubeadm config migrate` 来转换旧配置文件，
把其中已弃用的 API 版本更新为受支持的 API 版本。

`kubeadm config validate` 可用于验证配置文件。

<!-- 
`kubeadm config images list` and `kubeadm config images pull` can be used to list and pull the images
that kubeadm requires.
-->
`kubeadm config images list` 和 `kubeadm config images pull` 可以用来列出和拉取 kubeadm 所需的镜像。

<!-- body -->
## kubeadm config print {#cmd-config-print}

{{< include "generated/kubeadm_config/kubeadm_config_print.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}

{{< include "generated/kubeadm_config/kubeadm_config_migrate.md" >}}

## kubeadm config validate {#cmd-config-validate}

{{< include "generated/kubeadm_config/kubeadm_config_validate.md" >}}

## kubeadm config images list {#cmd-config-images-list}

{{< include "generated/kubeadm_config/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}

{{< include "generated/kubeadm_config/kubeadm_config_images_pull.md" >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
-->
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  将 Kubernetes 集群升级到更新的版本
