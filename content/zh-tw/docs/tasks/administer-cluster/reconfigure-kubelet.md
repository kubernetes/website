---
title: 在執行中的叢集上重新配置節點的 kubelet
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
[動態 kubelet 配置](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/281-dynamic-kubelet-configuration)
功能在 Kubernetes 1.22 版本棄用，並在 1.24 版本中移除。
請選擇其他方法將配置分發到叢集中的節點。
{{< /caution >}}

<!--
[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allowed you to change the configuration of each
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} in a running kubernetes cluster,
by deploying a {{< glossary_tooltip text="kubelet" text="ConfigMap" term_id="configmap" >}} and configuring
each {{< glossary_tooltip term_id="node" >}} to use it.
-->
[動態 kubelet 配置](https://github.com/kubernetes/enhancements/issues/281)
允許你透過部署並配置{{< glossary_tooltip text="節點" term_id="node" >}}使用的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
達到更改正在執行的 Kubernetes 叢集的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
配置的目的。

<!--
Please find documentation on this feature in [earlier versions of documentation](https://v1-23.docs.kubernetes.io/docs/tasks/administer-cluster/reconfigure-kubelet/).
-->
請在[早期版本的文件](https://v1-23.docs.kubernetes.io/zh-cn/docs/tasks/administer-cluster/reconfigure-kubelet/)中尋找有關此功能的文件。

<!--
## Migrating from using Dynamic Kubelet Configuration

There is no recommended replacement for this feature that works generically
across various Kubernetes distributions. If you are using managed Kubernetes
version, please consult with the vendor hosting Kubernetes for the best
practices for customizing your Kubernetes. If you are using `kubeadm`, refer to
[Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/).
-->
## 不再使用動態 Kubelet 配置

這裡沒有跨不同的 Kubernetes 發行版替換這個功能的建議方法。
如果你使用託管 Kubernetes 版本，
請諮詢託管 Kubernetes 的供應商，以獲得自定義 Kubernetes 的最佳實踐。
如果你使用的是 `kubeadm`，
請參考[使用 kubeadm 配置叢集中的各個 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)。

<!--
In order to migrate off the Dynamic Kubelet Configuration feature, the
alternative mechanism should be used to distribute kubelet configuration files.
In order to apply configuration, config file must be updated and kubelet restarted.
See the [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
for information.
-->
為了停止使用動態 Kubelet 配置功能，
應該使用替代機制分發 kubelet 配置檔案。
為了使配置生效，必須更新配置檔案並重新啟動 kubelet。
請參考[透過配置檔案設定 Kubelet 引數](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。

<!--
Please note, the `DynamicKubeletConfig` feature gate cannot be set on a kubelet
starting v1.24 as it has no effect. However, the feature gate is not removed
from the API server or the controller manager before v1.26. This is designed for
the control plane to support nodes with older versions of kubelets and for
satisfying the [Kubernetes version skew policy](/releases/version-skew-policy/).
-->
請注意，從 v1.24 開始 `DynamicKubeletConfig` 特性門控無法在 kubelet 上設定，
因為不會生效。在 v1.26 之前 API 伺服器和控制器管理器不會移除該特性門控。
這是專為控制面支援有舊版本 kubelet 的節點以及滿足
[Kubernetes 版本偏差策略](/zh-cn/releases/version-skew-policy/)。

