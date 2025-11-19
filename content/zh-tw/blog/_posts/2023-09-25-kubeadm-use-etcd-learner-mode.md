---
layout: blog
title: 'kubeadm：使用 etcd Learner 安全地接入控制平面節點'
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

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The [`kubeadm`](/docs/reference/setup-tools/kubeadm/) tool now supports etcd learner mode, which
allows you to enhance the resilience and stability
of your Kubernetes clusters by leveraging the [learner mode](https://etcd.io/docs/v3.4/learning/design-learner/#appendix-learner-implementation-in-v34)
feature introduced in etcd version 3.4.
This guide will walk you through using etcd learner mode with kubeadm. By default, kubeadm runs
a local etcd instance on each control plane node.
-->
[`kubeadm`](/zh-cn/docs/reference/setup-tools/kubeadm/) 工具現在支持 etcd learner 模式，
藉助 etcd 3.4 版本引入的
[learner 模式](https://etcd.io/docs/v3.4/learning/design-learner/#appendix-learner-implementation-in-v34)特性，
可以提高 Kubernetes 集羣的彈性和穩定性。本文將介紹如何在 kubeadm 中使用 etcd learner 模式。
默認情況下，kubeadm 在每個控制平面節點上運行一個本地 etcd 實例。

<!--
In v1.27, kubeadm introduced a new feature gate `EtcdLearnerMode`. With this feature gate enabled,
when joining a new control plane node, a new etcd member will be created as a learner and
promoted to a voting member only after the etcd data are fully aligned.
-->
在 v1.27 中，kubeadm 引入了一個新的特性門控 `EtcdLearnerMode`。
啓用此特性門控後，在加入新的控制平面節點時，一個新的 etcd 成員將被創建爲 learner，
只有在 etcd 數據被完全對齊後此成員纔會晉升爲投票成員。

<!--
## What are the advantages of using learner mode?

etcd learner mode offers several compelling reasons to consider its adoption
in Kubernetes clusters:
-->
## 使用 etcd learner 模式的優勢是什麼？   {#what-are-advantages-of-using-learner-mode}

在 Kubernetes 集羣中採用 etcd learner 模式具有以下幾個優點：

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
1. **增強了彈性**：etcd learner 節點是非投票成員，在完全進入角色之前會追隨領導者的日誌。
   這樣可以防止新的集羣成員干擾投票結果或引起領導者選舉，從而使集羣在成員變更期間更具彈性。
1. **減少了集羣不可用時間**：傳統的添加新成員的方法通常會造成一段時間集羣不可用，特別是在基礎設施遲緩或誤配的情況下更爲明顯。
   而 etcd learner 模式可以最大程度地減少此類干擾。
1. **簡化了維護**：learner 節點提供了一種更安全、可逆的方式來添加或替換集羣成員。
   這降低了由於誤配或在成員添加過程中出錯而導致集羣意外失效的風險。
1. **改進了網絡容錯性**：在涉及網絡分區的場景中，learner 模式允許更優雅的處理。
   根據新成員所落入的分區，它可以無縫地與現有集羣集成，而不會造成中斷。

<!--
In summary, the etcd learner mode improves the reliability and manageability of Kubernetes clusters
during member additions and changes, making it a valuable feature for cluster operators.
-->
總之，etcd learner 模式可以在成員添加和變更期間提高 Kubernetes 集羣的可靠性和可管理性，
這個特性對集羣運營人員很有價值。

<!--
## How nodes join a cluster that's using the new mode

### Create a Kubernetes cluster backed by etcd in learner mode {#create-K8s-cluster-etcd-learner-mode}
-->
## 節點如何接入使用這種新模式的集羣   {#how-nodes-join-cluster-that-using-new-node}

### 創建以 etcd learner 模式支撐的 Kubernetes 集羣  {#create-K8s-cluster-etcd-learner-mode}

<!--
For a general explanation about creating highly available clusters with kubeadm, you can refer to
[Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

To create a Kubernetes cluster, backed by etcd in learner mode, using kubeadm, follow these steps:
-->
關於使用 kubeadm 創建高可用集羣的通用說明，
請參閱[使用 kubeadm 創建高可用集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)。

要使用 kubeadm 創建一個後臺是 learner 模式的 etcd 的 Kubernetes 集羣，按照以下步驟操作：

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
這裏，kubeadm 工具部署單節點 Kubernetes 集羣，其中的 etcd 被設置爲 learner 模式。

<!--
### Join nodes to the Kubernetes cluster

Before joining a control-plane node to the new Kubernetes cluster, ensure that the existing control plane nodes
and all etcd members are healthy.

Check the cluster health with `etcdctl`. If `etcdctl` isn't available, you can run this tool inside a container image.
You would do that directly with your container runtime using a tool such as `crictl run` and not through Kubernetes

Here is an example on a client command that uses secure communication to check the cluster health of the etcd cluster:
-->
### 將節點接入 Kubernetes 集羣   {#join-nodes-to-the-kubernetes-cluster}

在將控制平面節點接入新的 Kubernetes 集羣之前，確保現有的控制平面節點和所有 etcd 成員都健康。

使用 `etcdctl` 檢查集羣的健康狀況。如果 `etcdctl` 不可用，你可以運行在容器鏡像內的這個工具。
你可以直接使用 `crictl run` 這類容器運行時工具而不是通過 Kubernetes 來執行此操作。

以下是一個使用安全通信來檢查 etcd 集羣健康狀況的客戶端命令示例：

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
要檢查 Kubernetes 控制平面是否健康，運行 `kubectl get node -l node-role.kubernetes.io/control-plane=`
並檢查節點是否就緒。

{{< note >}}
<!--
It is recommended to have an odd number of members in an etcd cluster.
-->
建議在 etcd 集羣中的成員個數爲奇數。
{{< /note >}}

<!--
Before joining a worker node to the new Kubernetes cluster, ensure that the control plane nodes are healthy.
-->
在將工作節點接入新的 Kubernetes 集羣之前，確保控制平面節點健康。

<!--
## What's next

- The feature gate `EtcdLearnerMode` is alpha in v1.27 and we expect it to graduate to beta in the next
  minor release of Kubernetes (v1.29).
- etcd has an open issue that may make the process more automatic:
  [Support auto-promoting a learner member to a voting member](https://github.com/etcd-io/etcd/issues/15107).
- Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
## 接下來的步驟   {#whats-next}

- 特性門控 `EtcdLearnerMode` 在 v1.27 中爲 Alpha，預計會在 Kubernetes 的下一個小版本發佈（v1.29）中進階至 Beta。
- etcd 社區有一個開放問題，目的是使這個過程更加自動化：
  [支持自動將 learner 成員晉升爲投票成員](https://github.com/etcd-io/etcd/issues/15107)。
- 更多細節參閱 kubeadm [配置格式](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)。

<!--
## Feedback

Was this guide helpful? If you have any feedback or encounter any issues, please let us know.
Your feedback is always welcome! Join the bi-weekly [SIG Cluster Lifecycle meeting](https://docs.google.com/document/d/1Gmc7LyCIL_148a9Tft7pdhdee0NBHdOfHS1SAF0duI4/edit)
or weekly [kubeadm office hours](https://docs.google.com/document/d/130_kiXjG7graFNSnIAgtMS1G8zPDwpkshgfRYS0nggo/edit).
Or reach us via [Slack](https://slack.k8s.io/) (channel **#kubeadm**), or the
[SIG's mailing list](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle).
-->
## 反饋   {#feedback}

本文對你有幫助嗎？如果你有任何反饋或遇到任何問題，請告訴我們。
非常歡迎你提出反饋！你可以參加 [SIG Cluster Lifecycle 雙週例會](https://docs.google.com/document/d/1Gmc7LyCIL_148a9Tft7pdhdee0NBHdOfHS1SAF0duI4/edit)
或 [kubeadm 每週討論會](https://docs.google.com/document/d/130_kiXjG7graFNSnIAgtMS1G8zPDwpkshgfRYS0nggo/edit)。
你還可以通過 [Slack](https://slack.k8s.io/)（頻道 **#kubeadm**）或
[SIG 郵件列表](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle)聯繫我們。
