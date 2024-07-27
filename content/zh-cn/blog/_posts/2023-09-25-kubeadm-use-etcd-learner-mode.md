---
layout: blog
title: 'kubeadm：使用 etcd Learner 安全地接入控制平面节点'
date: 2023-09-25
slug: kubeadm-use-etcd-learner-mode
---
<!--
layout: blog
title: 'kubeadm: Use etcd Learner to Join a Control Plane Node Safely'
date: 2023-09-25
slug: kubeadm-use-etcd-learner-mode
-->

<!--
**Author:** Paco Xu (DaoCloud)
-->
**作者:** Paco Xu (DaoCloud)

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The [`kubeadm`](/docs/reference/setup-tools/kubeadm/) tool now supports etcd learner mode, which
allows you to enhance the resilience and stability
of your Kubernetes clusters by leveraging the [learner mode](https://etcd.io/docs/v3.4/learning/design-learner/#appendix-learner-implementation-in-v34)
feature introduced in etcd version 3.4.
This guide will walk you through using etcd learner mode with kubeadm. By default, kubeadm runs
a local etcd instance on each control plane node.
-->
[`kubeadm`](/zh-cn/docs/reference/setup-tools/kubeadm/) 工具现在支持 etcd learner 模式，
借助 etcd 3.4 版本引入的
[learner 模式](https://etcd.io/docs/v3.4/learning/design-learner/#appendix-learner-implementation-in-v34)特性，
可以提高 Kubernetes 集群的弹性和稳定性。本文将介绍如何在 kubeadm 中使用 etcd learner 模式。
默认情况下，kubeadm 在每个控制平面节点上运行一个本地 etcd 实例。

<!--
In v1.27, kubeadm introduced a new feature gate `EtcdLearnerMode`. With this feature gate enabled,
when joining a new control plane node, a new etcd member will be created as a learner and
promoted to a voting member only after the etcd data are fully aligned.
-->
在 v1.27 中，kubeadm 引入了一个新的特性门控 `EtcdLearnerMode`。
启用此特性门控后，在加入新的控制平面节点时，一个新的 etcd 成员将被创建为 learner，
只有在 etcd 数据被完全对齐后此成员才会晋升为投票成员。

<!--
## What are the advantages of using learner mode?

etcd learner mode offers several compelling reasons to consider its adoption
in Kubernetes clusters:
-->
## 使用 etcd learner 模式的优势是什么？   {#what-are-advantages-of-using-learner-mode}

在 Kubernetes 集群中采用 etcd learner 模式具有以下几个优点：

<!--
1. **Enhanced Resilience**: etcd learner nodes are non-voting members that catch up with
   the leader's logs before becoming fully operational. This prevents new cluster members
   from disrupting the quorum or causing leader elections, making the cluster more resilient
   during membership changes.
1. **Reduced Cluster Unavailability**: Traditional approaches to adding new members often
   result in cluster unavailability periods, especially in slow infrastructure or misconfigurations.
   etcd learner mode minimizes such disruptions.
1. **Simplified Maintenance**: Learner nodes provide a safer and reversible way to add or replace
   cluster members. This reduces the risk of accidental cluster outages due to misconfigurations or
   missteps during member additions.
1. **Improved Network Tolerance**: In scenarios involving network partitions, learner mode allows
   for more graceful handling. Depending on the partition a new member lands, it can seamlessly
   integrate with the existing cluster without causing disruptions.
-->
1. **增强了弹性**：etcd learner 节点是非投票成员，在完全进入角色之前会追随领导者的日志。
   这样可以防止新的集群成员干扰投票结果或引起领导者选举，从而使集群在成员变更期间更具弹性。
1. **减少了集群不可用时间**：传统的添加新成员的方法通常会造成一段时间集群不可用，特别是在基础设施迟缓或误配的情况下更为明显。
   而 etcd learner 模式可以最大程度地减少此类干扰。
1. **简化了维护**：learner 节点提供了一种更安全、可逆的方式来添加或替换集群成员。
   这降低了由于误配或在成员添加过程中出错而导致集群意外失效的风险。
1. **改进了网络容错性**：在涉及网络分区的场景中，learner 模式允许更优雅的处理。
   根据新成员所落入的分区，它可以无缝地与现有集群集成，而不会造成中断。

<!--
In summary, the etcd learner mode improves the reliability and manageability of Kubernetes clusters
during member additions and changes, making it a valuable feature for cluster operators.
-->
总之，etcd learner 模式可以在成员添加和变更期间提高 Kubernetes 集群的可靠性和可管理性，
这个特性对集群运营人员很有价值。

<!--
## How nodes join a cluster that's using the new mode

### Create a Kubernetes cluster backed by etcd in learner mode {#create-K8s-cluster-etcd-learner-mode}
-->
## 节点如何接入使用这种新模式的集群   {#how-nodes-join-cluster-that-using-new-node}

### 创建以 etcd learner 模式支撑的 Kubernetes 集群  {#create-K8s-cluster-etcd-learner-mode}

<!--
For a general explanation about creating highly available clusters with kubeadm, you can refer to
[Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

To create a Kubernetes cluster, backed by etcd in learner mode, using kubeadm, follow these steps:
-->
关于使用 kubeadm 创建高可用集群的通用说明，
请参阅[使用 kubeadm 创建高可用集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)。

要使用 kubeadm 创建一个后台是 learner 模式的 etcd 的 Kubernetes 集群，按照以下步骤操作：

```shell
# kubeadm init --feature-gates=EtcdLearnerMode=true ...
kubeadm init --config=kubeadm-config.yaml
```

<!--
The kubeadm configuration file is like below:
-->
kubeadm 配置文件如下：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
featureGates:
  EtcdLearnerMode: true
```

<!--
The kubeadm tool deploys a single-node Kubernetes cluster with etcd set to use learner mode.
-->
这里，kubeadm 工具部署单节点 Kubernetes 集群，其中的 etcd 被设置为 learner 模式。

<!--
### Join nodes to the Kubernetes cluster

Before joining a control-plane node to the new Kubernetes cluster, ensure that the existing control plane nodes
and all etcd members are healthy.

Check the cluster health with `etcdctl`. If `etcdctl` isn't available, you can run this tool inside a container image.
You would do that directly with your container runtime using a tool such as `crictl run` and not through Kubernetes

Here is an example on a client command that uses secure communication to check the cluster health of the etcd cluster:
-->
### 将节点接入 Kubernetes 集群   {#join-nodes-to-the-kubernetes-cluster}

在将控制平面节点接入新的 Kubernetes 集群之前，确保现有的控制平面节点和所有 etcd 成员都健康。

使用 `etcdctl` 检查集群的健康状况。如果 `etcdctl` 不可用，你可以运行在容器镜像内的这个工具。
你可以直接使用 `crictl run` 这类容器运行时工具而不是通过 Kubernetes 来执行此操作。

以下是一个使用安全通信来检查 etcd 集群健康状况的客户端命令示例：

```shell
ETCDCTL_API=3 etcdctl --endpoints 127.0.0.1:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
...
dc543c4d307fadb9, started, node1, https://10.6.177.40:2380, https://10.6.177.40:2379, false
```

<!--
To check if the Kubernetes control plane is healthy, run `kubectl get node -l node-role.kubernetes.io/control-plane=`
and check if the nodes are ready.
-->
要检查 Kubernetes 控制平面是否健康，运行 `kubectl get node -l node-role.kubernetes.io/control-plane=`
并检查节点是否就绪。

{{< note >}}
<!--
It is recommended to have an odd number of members in an etcd cluster.
-->
建议在 etcd 集群中的成员个数为奇数。
{{< /note >}}

<!--
Before joining a worker node to the new Kubernetes cluster, ensure that the control plane nodes are healthy.
-->
在将工作节点接入新的 Kubernetes 集群之前，确保控制平面节点健康。

<!--
## What's next

- The feature gate `EtcdLearnerMode` is alpha in v1.27 and we expect it to graduate to beta in the next
  minor release of Kubernetes (v1.29).
- etcd has an open issue that may make the process more automatic:
  [Support auto-promoting a learner member to a voting member](https://github.com/etcd-io/etcd/issues/15107).
- Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
## 接下来的步骤   {#whats-next}

- 特性门控 `EtcdLearnerMode` 在 v1.27 中为 Alpha，预计会在 Kubernetes 的下一个小版本发布（v1.29）中进阶至 Beta。
- etcd 社区有一个开放问题，目的是使这个过程更加自动化：
  [支持自动将 learner 成员晋升为投票成员](https://github.com/etcd-io/etcd/issues/15107)。
- 更多细节参阅 kubeadm [配置格式](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)。

<!--
## Feedback

Was this guide helpful? If you have any feedback or encounter any issues, please let us know.
Your feedback is always welcome! Join the bi-weekly [SIG Cluster Lifecycle meeting](https://docs.google.com/document/d/1Gmc7LyCIL_148a9Tft7pdhdee0NBHdOfHS1SAF0duI4/edit)
or weekly [kubeadm office hours](https://docs.google.com/document/d/130_kiXjG7graFNSnIAgtMS1G8zPDwpkshgfRYS0nggo/edit).
Or reach us via [Slack](https://slack.k8s.io/) (channel **#kubeadm**), or the
[SIG's mailing list](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle).
-->
## 反馈   {#feedback}

本文对你有帮助吗？如果你有任何反馈或遇到任何问题，请告诉我们。
非常欢迎你提出反馈！你可以参加 [SIG Cluster Lifecycle 双周例会](https://docs.google.com/document/d/1Gmc7LyCIL_148a9Tft7pdhdee0NBHdOfHS1SAF0duI4/edit)
或 [kubeadm 每周讨论会](https://docs.google.com/document/d/130_kiXjG7graFNSnIAgtMS1G8zPDwpkshgfRYS0nggo/edit)。
你还可以通过 [Slack](https://slack.k8s.io/)（频道 **#kubeadm**）或
[SIG 邮件列表](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle)联系我们。
