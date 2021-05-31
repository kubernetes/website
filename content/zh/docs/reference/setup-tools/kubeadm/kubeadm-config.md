---
title: kubeadm config
content_type: concept
weight: 50
---

<!-- overview -->
<!--
During `kubeadm init`, kubeadm uploads the `ClusterConfiguration` object to your cluster
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace. This configuration is then read during
`kubeadm join`, `kubeadm reset` and `kubeadm upgrade`. To view this ConfigMap call `kubeadm config view`.
-->
在 `kubeadm init` 执行期间，kubeadm 将 `ClusterConfiguration` 对象上传
到你的集群的 `kube-system` 名字空间下名为 `kubeadm-config` 的 ConfigMap 对象中。
然后在 `kubeadm join`、`kubeadm reset` 和 `kubeadm upgrade` 执行期间读取此配置。 
要查看此 ConfigMap，请调用 `kubeadm config view`。

<!--
You can use `kubeadm config print` to print the default configuration and `kubeadm config migrate` to
convert your old configuration files to a newer version. `kubeadm config images list` and
`kubeadm config images pull` can be used to list and pull the images that kubeadm requires.
-->
你可以使用 `kubeadm config print` 命令打印默认配置，
并使用 `kubeadm config migrate` 命令将旧版本的配置转化成新版本。
`kubeadm config images list` 和 `kubeadm config images pull`
命令可以用来列出并拉取 kubeadm 所需的镜像。

<!--
For more information navigate to
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
or [Using kubeadm join with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).
-->
更多信息请浏览[使用带配置文件的 kubeadm init](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
或[使用带配置文件的 kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).

<!--
You can also configure several kubelet-configuration options with `kubeadm init`. These options will be the same on any node in your cluster. 
See [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
-->
你也可以在使用 `kubeadm init` 命令时配置若干 kubelet 配置选项。
这些选项对于集群中所有节点而言都是相同的。
参阅[使用 kubeadm 来配置集群中的各个 kubelet](/zh/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)
了解详细信息。
 
<!--
In Kubernetes v1.13.0 and later to list/pull kube-dns images instead of the CoreDNS image
the `--config` method described [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
has to be used.
-->
在 Kubernetes v1.13.0 及更高版本中，要列出/拉取 kube-dns 镜像而不是 CoreDNS 镜像，
必须使用[这里](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
所描述的 `--config` 方法。

<!-- body -->
## kubeadm config upload from-file {#cmd-config-from-file}

## kubeadm config print{#cmd-config-view}
{{< include "generated/kubeadm_config_print.md" >}}

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

* [kubeadm upgrade](/zh/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  将 Kubernetes 集群升级到更新版本 [kubeadm upgrade]


