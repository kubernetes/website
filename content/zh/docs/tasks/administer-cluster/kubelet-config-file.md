---
title: 通过配置文件设置 Kubelet 参数
content_type: task
---
<!--
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_type: task
--->

<!-- overview -->

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
A subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
This functionality is considered beta in v1.10.
--->
通过保存在硬盘的配置文件设置 kubelet 的部分配置参数，这可以作为命令行参数的替代。
此功能在 v1.10 中为 beta 版。

<!--
Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.
--->
建议通过配置文件的方式提供参数，因为这样可以简化节点部署和配置管理。

## {{% heading "prerequisites" %}}

<!--
- A v1.10 or higher Kubelet binary must be installed for beta functionality.
-->
- 需要安装 1.10 或更高版本的 kubelet 可执行文件，才能使用此 beta 功能。

<!-- steps -->

<!--
## Create the config file

The subset of the Kubelet's configuration that can be configured via a file
is defined by the `KubeletConfiguration` struct
[here (v1beta1)](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go).
-->
## 创建配置文件

`KubeletConfiguration` 结构体定义了可以通过文件配置的 Kubelet 配置子集，
该结构体在 [这里（v1beta1）](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)
可以找到。 

<!--
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the Kubelet has read permissions on the file.

Here is an example of what this file might look like:
-->
配置文件必须是这个结构体中参数的 JSON 或 YAML 表现形式。
确保 kubelet 可以读取该文件。

下面是一个 Kubelet 配置文件示例：

```yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
evictionHard:
    memory.available:  "200Mi"
```

<!--
In the example, the Kubelet is configured to evict Pods when available memory drops below 200Mi.
All other Kubelet configuration values are left at their built-in defaults, unless overridden
by flags. Command line flags which target the same value as a config file will override that value.

For a trick to generate a configuration file from a live node, see
[Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet).
-->
在这个示例中, 当可用内存低于 200Mi 时, kubelet 将会开始驱逐 Pods。
没有声明的其余配置项都将使用默认值，除非使用命令行参数来重载。 
命令行中的参数将会覆盖配置文件中的对应值。

作为一个小技巧，你可以从活动节点生成配置文件，相关方法请查看
[重新配置活动集群节点的 kubelet](/zh/docs/tasks/administer-cluster/reconfigure-kubelet)。

<!--
## Start a Kubelet process configured via the config file

Start the Kubelet with the `--config` flag set to the path of the Kubelet's config file.
The Kubelet will then load its config from this file.
--->

## 启动通过配置文件配置的 Kubelet 进程

启动 Kubelet 需要将 `--config` 参数设置为 Kubelet 配置文件的路径。Kubelet 将从此文件加载其配置。

<!--
Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.
-->
请注意，命令行参数与配置文件有相同的值时，就会覆盖配置文件中的该值。
这有助于确保命令行 API 的向后兼容性。

<!--
Note that relative file paths in the Kubelet config file are resolved relative to the
location of the Kubelet config file, whereas relative paths in command line flags are resolved
relative to the Kubelet's current working directory.
-->
请注意，kubelet 配置文件中的相对文件路径是相对于 kubelet 配置文件的位置解析的，
而命令行参数中的相对路径是相对于 kubelet 的当前工作目录解析的。

<!--
Note that some default values differ between command-line flags and the Kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.
--->
请注意，命令行参数和 Kubelet 配置文件的某些默认值不同。
如果设置了 `--config`，并且没有通过命令行指定值，则 `KubeletConfiguration`
版本的默认值生效。在上面的例子中，version 是 `kubelet.config.k8s.io/v1beta1`。

<!-- discussion -->

<!--
## Relationship to Dynamic Kubelet Config

If you are using the [Dynamic Kubelet Configuration](/docs/tasks/administer-cluster/reconfigure-kubelet)
feature, the combination of configuration provided via `--config` and any flags which override these values
is considered the default "last known good" configuration by the automatic rollback mechanism.
--->
## 与动态 Kubelet 配置的关系

如果你正在使用[动态 kubelet 配置](/zh/docs/tasks/administer-cluster/reconfigure-kubelet)特性，
那么自动回滚机制将认为通过 `--config` 提供的配置与覆盖这些值的任何参数的组合是
 "最后已知正常（last known good）" 的配置。


