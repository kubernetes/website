---
title: 在运行中的集群上重新配置节点的 kubelet
content_type: task
min-kubernetes-server-version: v1.11
---

<!--
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_type: task
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="deprecated" >}}

<!--
{{< caution >}}
The [Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/281-dynamic-kubelet-configuration)
feature is deprecated in 1.22 and removed in 1.24.
Please switch to alternative means distributing configuration to the Nodes of your cluster.
{{< /caution >}}
-->
{{< caution >}}
[动态 kubelet 配置](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/281-dynamic-kubelet-configuration)
功能在 Kubernetes 1.22 版本弃用，并在 1.24 版本中移除。
请选择其他方法将配置分发到集群中的节点。
{{< /caution >}}

<!--
[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allowed you to change the configuration of each
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} in a running kubernetes cluster,
by deploying a {{< glossary_tooltip text="kubelet" text="ConfigMap" term_id="configmap" >}} and configuring
each {{< glossary_tooltip term_id="node" >}} to use it.
-->
[动态 kubelet 配置](https://github.com/kubernetes/enhancements/issues/281)
允许你通过部署并配置{{< glossary_tooltip text="节点" term_id="node" >}}使用的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
达到更改正在运行的 Kubernetes 集群的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
配置的目的。

<!--
Please find documentation on this feature in [earlier versions of documentation](https://v1-23.docs.kubernetes.io/docs/tasks/administer-cluster/reconfigure-kubelet/).
-->
请在[早期版本的文档](https://v1-23.docs.kubernetes.io/zh/docs/tasks/administer-cluster/reconfigure-kubelet/)中寻找有关此功能的文档。

<!--
## Migrating from using Dynamic Kubelet Configuration

There is no recommended replacement for this feature that works generically
across various Kubernetes distributions. If you are using managed Kubernetes
version, please consult with the vendor hosting Kubernetes for the best
practices for customizing your Kubernetes. If you are using `kubeadm`, refer to
[Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/).
-->
## 不再使用动态 Kubelet 配置

这里没有跨不同的 Kubernetes 发行版替换这个功能的建议方法。
如果你使用托管 Kubernetes 版本，
请咨询托管 Kubernetes 的供应商，以获得自定义 Kubernetes 的最佳实践。
如果你使用的是 `kubeadm`，
请参考[使用 kubeadm 配置集群中的各个 kubelet](/zh/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)。

<!--
In order to migrate off the Dynamic Kubelet Configuration feature, the
alternative mechanism should be used to distribute kubelet configuration files.
In order to apply configuration, config file must be updated and kubelet restarted.
See the [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
for information.
-->
为了停止使用动态 Kubelet 配置功能，
应该使用替代机制分发 kubelet 配置文件。
为了使配置生效，必须更新配置文件并重新启动 kubelet。
请参考[通过配置文件设置 Kubelet 参数](/zh/docs/tasks/administer-cluster/kubelet-config-file/)。

<!--
Please note, the `DynamicKubeletConfig` feature gate cannot be set on a kubelet
starting v1.24 as it has no effect. However, the feature gate is not removed
from the API server or the controller manager before v1.26. This is designed for
the control plane to support nodes with older versions of kubelets and for
satisfying the [Kubernetes version skew policy](/releases/version-skew-policy/).
-->
请注意，从 v1.24 开始 `DynamicKubeletConfig` 特性门控无法在 kubelet 上设置，
因为不会生效。在 v1.26 之前 API 服务器和控制器管理器不会移除该特性门控。
这是专为控制面支持有旧版本 kubelet 的节点以及满足
[Kubernetes 版本偏差策略](/zh-cn/releases/version-skew-policy/)。

