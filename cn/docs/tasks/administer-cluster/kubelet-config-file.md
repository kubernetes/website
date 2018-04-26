---
approvers:
- mtaufen
- dawnchen
cn-approvers:
- xiaosuiba
cn-reviwers:
- pigletfly
- zjj2wry
- chentao1596
title: 通过配置文件设置 Kubelet 参数
---
<!--
title: Set Kubelet parameters via a config file
-->

{% capture overview %}
{% include feature-state-alpha.md %}

<!--
As of Kubernetes 1.8, a subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags. In the
future, most of the existing command-line flags will be deprecated in favor of
providing parameters via a config file, which simplifies node deployment.
-->
在 Kubernetes 1.8 版本上，除了可以通过命令行参数外，还可以通过保存在硬盘的配置文件设置 Kubelet 的配置子集。
将来，大部分现存的命令行参数都将被废弃，取而代之以配置文件的方式提供参数，以简化节点部署过程。
{% endcapture %}

{% capture prerequisites %}

<!--
- A v1.8 or higher Kubelet binary must be installed.
  -->
- 需要安装 1.8 版本或更高版本的 Kubelet 二进制文件。

{% endcapture %}

{% capture steps %}

<!--
## Create the config file
-->
## 创建配置文件

<!--
The subset of the Kubelet's configuration that can be configured via a file
is defined by the `KubeletConfiguration` struct
[here (v1alpha1)](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/apis/kubeletconfig/v1alpha1/types.go).
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Note that this structure, and thus the config file API,
is still considered alpha and is not subject to stability gurarantees.
-->
`KubeletConfiguration` 结构体定义了可以通过文件配置的 Kubelet 配置子集，该结构体在 [这里（v1alpha1）](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/apis/kubeletconfig/v1alpha1/types.go) 可以找到。配置文件必须是这个结构体中参数的 JSON 或 YAML 表现形式。请注意，这个结构体及配置文件 API 仍然为 alpha 版本，对其稳定性不作保证。

<!--
Create a file named `kubelet` in its own directory and make sure the directory
and file are both readable by the Kubelet. You should write your intended
Kubelet configuration in this `kubelet` file.
-->
在单独的文件夹中创建一个名为 `kubelet` 的文件，并保证 Kubelet 可以读取该文件夹及文件。您应该在这个 `kubelet` 文件中编写 Kubelet 配置。

<!--
For a trick to generate a configuration file from a live node, see
[Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet).
-->
作为一个小技巧，您可以从活动节点生成配置文件，相关方法请查看 [重新配置活动集群节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet)。

<!--
## Start a Kubelet process configured via the config file
-->
## 启动通过配置文件配置的 Kubelet 进程

<!--
Start the Kubelet with the `KubeletConfigFile` feature gate enabled and the 
Kubelet's `--init-config-dir` flag set to the location of the directory
containing the `kubelet` file. The Kubelet will then load the parameters defined
by `KubeletConfiguration` from the `kubelet` file, rather than from their 
associated command-line flags.
-->
启动 Kubelet，需要打开 `KubeletConfigFile` 特性开关（feature gate）并将其 `--init-config-dir` 标志设置为包含 `kubelet` 文件的文件夹路径。Kubelet 将从 `kubelet` 文件中读取由 `KubeletConfiguration` 定义的参数，而不是从参数相关的命令行标志中读取。

{% endcapture %}

{% capture discussion %}

<!--
## Relationship to Dynamic Kubelet Config
-->
## 与动态 Kubelet 配置的关系

<!--
If you are using the [Dynamic Kubelet Configuration](/docs/tasks/administer-cluster/reconfigure-kubelet)
feature, the configuration provided via `--init-config-dir` will be considered
the "last known good" configuration by the automatic rollback mechanism.
-->
如果您正在使用  [动态 Kubelet 配置（Dynamic Kubelet Configuration）](/docs/tasks/administer-cluster/reconfigure-kubelet) 特性，那么自动回滚机制将认为通过 `--init-config-dir` 提供的配置是“最后已知正常（last known good）”的配置。

<!--
Note that the layout of the files in the `--init-config-dir` mirrors the layout
of data in the ConfigMaps used for Dynamic Kubelet Config; the file names are
the same as the keys of the ConfigMap, and the file contents are JSON or YAML
representations of the same structures. Today, the only pair is 
`kubelet:KubeletConfiguration`, though more may emerge in the future.
See [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet)
for more information.
-->
请注意，`--init-config-dir` 文件的布局结构镜像了 ConfigMap 中用于动态 Kubelet 配置的数据结构；文件命名和 ConfigMap 的 key 相同，文件的内容是 ConfigMap 中相同数据结构的 JSON 或 YAML 表现形式。虽然以后可能会出现更多，但目前只有 kubelet:KubeletConfiguration 配置对。更多信息请查阅  [重新配置活动集群节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet)。

{% endcapture %}

{% include templates/task.md %}
