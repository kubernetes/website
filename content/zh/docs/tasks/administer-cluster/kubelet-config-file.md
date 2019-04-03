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
content_template: templates/task
---


{{% capture overview %}}
{{< feature-state state="alpha" >}}


在 Kubernetes 1.8 版本上，除了可以通过命令行参数外，还可以通过保存在硬盘的配置文件设置 Kubelet 的配置子集。
将来，大部分现存的命令行参数都将被废弃，取而代之以配置文件的方式提供参数，以简化节点部署过程。
{{% /capture %}}

{{% capture prerequisites %}}


- 需要安装 1.8 版本或更高版本的 Kubelet 二进制文件。

{{% /capture %}}

{{% capture steps %}}


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


启动 Kubelet 需要将其 `--init-config-dir` 标志设置为包含 `kubelet` 文件的文件夹路径。Kubelet 将从 `kubelet` 文件中读取由 `KubeletConfiguration` 定义的参数，而不是从参数相关的命令行标志中读取。

{{% /capture %}}

{{% capture discussion %}}


## 与动态 Kubelet 配置的关系


如果您正在使用  [动态 Kubelet 配置（Dynamic Kubelet Configuration）](/docs/tasks/administer-cluster/reconfigure-kubelet) 特性，那么自动回滚机制将认为通过 `--init-config-dir` 提供的配置是“最后已知正常（last known good）”的配置。


请注意，`--init-config-dir` 文件的布局结构镜像了 ConfigMap 中用于动态 Kubelet 配置的数据结构；文件命名和 ConfigMap 的 key 相同，文件的内容是 ConfigMap 中相同数据结构的 JSON 或 YAML 表现形式。虽然以后可能会出现更多，但目前只有 kubelet:KubeletConfiguration 配置对。更多信息请查阅  [重新配置活动集群节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet)。

{{% /capture %}}


