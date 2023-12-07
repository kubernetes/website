---
title: 升级集群
content_type: task
weight: 350
---
<!--
title: Upgrade A Cluster
content_type: task
weight: 350
-->

<!-- overview -->
<!--
This page provides an overview of the steps you should follow to upgrade a
Kubernetes cluster.

The way that you upgrade a cluster depends on how you initially deployed it
and on any subsequent changes.

At a high level, the steps you perform are:
-->
本页概述升级 Kubernetes 集群的步骤。

升级集群的方式取决于你最初部署它的方式、以及后续更改它的方式。

从高层规划的角度看，要执行的步骤是：

<!--
- Upgrade the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
- Upgrade the nodes in your cluster
- Upgrade clients such as {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
- Adjust manifests and other resources based on the API changes that accompany the
  new Kubernetes version
-->
- 升级{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
- 升级集群中的节点
- 升级 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 之类的客户端
- 根据新 Kubernetes 版本带来的 API 变化，调整清单文件和其他资源

## {{% heading "prerequisites" %}}

<!--
You must have an existing cluster. This page is about upgrading from Kubernetes
{{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}}. If your cluster
is not currently running Kubernetes {{< skew currentVersionAddMinor -1 >}} then please check
the documentation for the version of Kubernetes that you plan to upgrade to.
-->
你必须有一个集群。
本页内容涉及从 Kubernetes {{< skew currentVersionAddMinor -1 >}}
升级到 Kubernetes {{< skew currentVersion >}}。
如果你的集群未运行 Kubernetes {{< skew currentVersionAddMinor -1 >}}，
那请参考目标 Kubernetes 版本的文档。

<!--
## Upgrade approaches
-->
## 升级方法 {#upgrade-approaches}

### kubeadm {#upgrade-kubeadm}

<!--
If your cluster was deployed using the `kubeadm` tool, refer to 
[Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
for detailed information on how to upgrade the cluster.

Once you have upgraded the cluster, remember to
[install the latest version of `kubectl`](/docs/tasks/tools/).
-->
如果你的集群是使用 `kubeadm` 安装工具部署而来，
那么升级集群的详细信息，请参阅[升级 kubeadm 集群](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。

升级集群之后，要记得[安装最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/)。

<!--
### Manual deployments
-->
### 手动部署 {#manual-deployments}

{{< caution >}}
<!--
These steps do not account for third-party extensions such as network and storage
plugins.
-->
这些步骤不考虑网络和存储插件等第三方扩展。
{{< /caution >}}

<!--
You should manually update the control plane following this sequence:

- etcd (all instances)
- kube-apiserver (all control plane hosts)
- kube-controller-manager
- kube-scheduler
- cloud controller manager, if you use one
-->
你应该按照下面的操作顺序，手动更新控制平面：

- etcd (所有实例)
- kube-apiserver (所有控制平面的宿主机)
- kube-controller-manager
- kube-scheduler
- cloud controller manager (在你用到时)

<!--
At this point you should
[install the latest version of `kubectl`](/docs/tasks/tools/).

For each node in your cluster, [drain](/docs/tasks/administer-cluster/safely-drain-node/)
that node and then either replace it with a new node that uses the {{< skew currentVersion >}}
kubelet, or upgrade the kubelet on that node and bring the node back into service.
-->
现在，你应该[安装最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/)。

对于集群中的每个节点，
首先需要[腾空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)节点，
然后使用一个运行了 kubelet {{< skew currentVersion >}} 版本的新节点替换它；
或者升级此节点的 kubelet，并使节点恢复服务。

{{< caution >}}
<!--
Draining nodes before upgrading kubelet ensures that pods are re-admitted and containers are
re-created, which may be necessary to resolve some security issues or other important bugs.
-->
在升级 kubelet 之前先进行节点排空，这样可以确保 Pod 被重新准入并且容器被重新创建。
这一步骤对于解决某些安全问题或其他关键错误是非常必要的。
{{</ caution >}}

<!--
### Other deployments {#upgrade-other}

Refer to the documentation for your cluster deployment tool to learn the recommended set
up steps for maintenance.

## Post-upgrade tasks

### Switch your cluster's storage API version
-->
### 其他部署方式 {#upgrade-other}

参阅你的集群部署工具对应的文档，了解用于维护的推荐设置步骤。

## 升级后的任务 {#post-upgrade-tasks}

### 切换集群的存储 API 版本 {#switch-your-clusters-storage-api-version}

<!--
The objects that are serialized into etcd for a cluster's internal
representation of the Kubernetes resources active in the cluster are
written using a particular version of the API.

When the supported API changes, these objects may need to be rewritten
in the newer API. Failure to do this will eventually result in resources
that are no longer decodable or usable by the Kubernetes API server.

For each affected object, fetch it using the latest supported API and then
write it back also using the latest supported API.
-->
对象序列化到 etcd，是为了提供集群中活动 Kubernetes 资源的内部表示法，
这些对象都使用特定版本的 API 编写。

当底层的 API 更改时，这些对象可能需要用新 API 重写。
如果不能做到这一点，会导致再也不能用 Kubernetes API 服务器解码、使用该对象。

对于每个受影响的对象，请使用最新支持的 API 读取它，然后使用所支持的最新 API 将其写回。

<!--
### Update manifests

Upgrading to a new Kubernetes version can provide new APIs.

You can use `kubectl convert` command to convert manifests between different API versions.
For example:
-->
### 更新清单 {#update-manifests}

升级到新版本 Kubernetes 就可以获取到新的 API。

你可以使用 `kubectl convert` 命令在不同 API 版本之间转换清单。
例如：

```shell
kubectl convert -f pod.yaml --output-version v1
```

<!--
The `kubectl` tool replaces the contents of `pod.yaml` with a manifest that sets `kind` to
Pod (unchanged), but with a revised `apiVersion`.
-->
`kubectl` 替换了 `pod.yaml` 的内容，
在新的清单文件中，`kind` 被设置为 Pod（未变），
但 `apiVersion` 则被修订了。

<!--
### Device Plugins

If your cluster is running device plugins and the node needs to be upgraded to a Kubernetes
release with a newer device plugin API version, device plugins must be upgraded to support
both version before the node is upgraded in order to guarantee that device allocations
continue to complete successfully during the upgrade.

Refer to [API compatibility](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-compatibility) and [Kubelet Device Manager API Versions](/docs/reference/node/device-plugin-api-versions/) for more details.
-->
### 设备插件   {#device-plugins}

如果你的集群正在运行设备插件（Device Plugin）并且节点需要升级到具有更新的设备插件（Device Plugin）
API 版本的 Kubernetes 版本，则必须在升级节点之前升级设备插件以同时支持这两个插件 API 版本，
以确保升级过程中设备分配能够继续成功完成。

有关详细信息，请参阅
[API 兼容性](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-compatibility)和
[kubelet 设备管理器 API 版本](/zh-cn/docs/reference/node/device-plugin-api-versions/)。
