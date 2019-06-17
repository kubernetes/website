---
reviewers:
- mtaufen
- dawnchen
title: 通过配置文件设置 Kubelet 参数
content_template: templates/task
---
<!--
---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_template: templates/task
---
--->

{{% capture overview %}}
{{< feature-state state="beta" >}}

<!--
A subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
This functionality is considered beta in v1.10.
--->
通过保存在硬盘的配置文件设置 Kubelet 的配置参数子集，可以作为命令行参数的替代。此功能在 v1.10 中为 beta 版。

<!--
Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.
--->
建议通过配置文件的方式提供参数，因为这样可以简化节点部署和配置管理。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
- A v1.10 or higher Kubelet binary must be installed for beta functionality.
--->
- 需要安装 1.10 或更高版本的 Kubelet 二进制文件，才能实现 beta 功能。

{{% /capture %}}

{{% capture steps %}}

<!--
## Create the config file
--->
## 创建配置文件

<!--
The subset of the Kubelet's configuration that can be configured via a file
is defined by the `KubeletConfiguration` struct
[here (v1beta1)](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/pkg/kubelet/apis/config/types.go).
--->
`KubeletConfiguration` 结构体定义了可以通过文件配置的 Kubelet 配置子集，该结构体在 [这里（v1beta1）](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/pkg/kubelet/apis/config/types.go) 可以找到。

<!--
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the Kubelet has read permissions on the file.
--->
配置文件必须是这个结构体中参数的 JSON 或 YAML 表现形式。确保 Kubelet 可以读取该文件。

<!--
Here is an example of what this file might look like:
--->
下面的示例是这个文件的结构
```
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
evictionHard:
    memory.available:  "200Mi"
```
<!--
In the example, the Kubelet is configured to evict Pods when available memory drops below 200Mi.
All other Kubelet configuration values are left at their built-in defaults, unless overridden
by flags. Command line flags which target the same value as a config file will override that value.
--->
在该示例中，Kubelet 的配置是当可用内存低于 200Mi 时驱逐 Pods。除非被参数覆盖，否则其他 Kubelet 配置值都保留其内置默认值。命令行参数与配置文件有相同的值时，将会覆盖配置文件中的该值。

<!--
For a trick to generate a configuration file from a live node, see
[Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet).
--->
有关从活动节点生成配置文件的技巧，请参阅 [重新配置活动集群节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet)。

<!--
## Start a Kubelet process configured via the config file
--->
## 启动通过配置文件配置的 Kubelet 进程

<!--
Start the Kubelet with the `--config` flag set to the path of the Kubelet's config file.
The Kubelet will then load its config from this file.
--->
启动 Kubelet 需要将 `--config` 参数设置为 Kubelet 配置文件的路径。Kubelet 将从此文件加载其配置。

<!--
Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.
--->
请注意，命令行参数与配置文件有相同的值时，就会覆盖配置文件中的该值。这有助于确保命令行 API 的向后兼容性。

<!--
Note that relative file paths in the Kubelet config file are resolved relative to the
location of the Kubelet config file, whereas relative paths in command line flags are resolved
relative to the Kubelet's current working directory.
--->
请注意，Kubelet 配置文件中的相对文件路径是相对于 Kubelet 配置文件的位置解析的，而命令行参数中的相对路径是相对于 Kubelet 的当前工作目录解析的。

<!--
Note that some default values differ between command-line flags and the Kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.
--->
请注意，命令行参数和 Kubelet 配置文件的某些默认值不同。如果设置了 `--config`，并且没有通过命令行指定值，则 `KubeletConfiguration` 版本的默认值生效。在上面的例子中，version 是 `kubelet.config.k8s.io/v1beta1`。

{{% /capture %}}

{{% capture discussion %}}

<!--
## Relationship to Dynamic Kubelet Config
--->
## 与动态 Kubelet 配置的关系

<!--
If you are using the [Dynamic Kubelet Configuration](/docs/tasks/administer-cluster/reconfigure-kubelet)
feature, the combination of configuration provided via `--config` and any flags which override these values
is considered the default "last known good" configuration by the automatic rollback mechanism.
--->
如果您正在使用 [动态 Kubelet 配置](/docs/tasks/administer-cluster/reconfigure-kubelet) 特性，那么自动回滚机制将认为是 "最后已知正常（last known good）" 的配置，通过 `--config` 提供的配置与覆盖这些值的任何参数的结合。
{{% /capture %}}


