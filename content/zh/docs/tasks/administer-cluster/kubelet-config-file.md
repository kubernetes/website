---
reviewers:
- mtaufen
- dawnchen
title: 通过配置文件设置 Kubelet 参数
content_type: task
---
<!--
---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_type: task
---
--->

<!-- overview -->
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



## {{% heading "prerequisites" %}}


<!--
- A v1.10 or higher Kubelet binary must be installed for beta functionality.
--->
- 需要安装 1.10 或更高版本的 Kubelet 二进制文件，才能实现 beta 功能。



<!-- steps -->

<!--
## Create the config file
--->
## 创建配置文件


`KubeletConfiguration` 结构体定义了可以通过文件配置的 Kubelet 配置子集，该结构体在 [这里（v1beta1）](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go) 可以找到, 配置文件必须是这个结构体中参数的 JSON 或 YAML 表现形式。


在单独的文件夹中创建一个名为 `kubelet` 的文件，并保证 Kubelet 可以读取该文件夹及文件。您应该在这个 `kubelet` 文件中编写 Kubelet 配置。

这是一个 Kubelet 配置文件示例：

```
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
evictionHard:
    memory.available:  "200Mi"
```
在这个示例中, 当可用内存低于200Mi 时, Kubelet 将会开始驱逐 Pods。 没有声明的其余配置项都将使用默认值, 命令行中的 flags 将会覆盖配置文件中的对应值。


作为一个小技巧，您可以从活动节点生成配置文件，相关方法请查看 [重新配置活动集群节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet)。


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



<!-- discussion -->

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



