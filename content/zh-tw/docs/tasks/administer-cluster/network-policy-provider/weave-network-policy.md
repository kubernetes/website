---
title: 使用 Weave Net 提供 NetworkPolicy
content_type: task
weight: 60
---

<!--
reviewers:
- bboreham
title: Weave Net for NetworkPolicy
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page shows how to use Weave Net for NetworkPolicy.
-->
本頁展示如何使用 Weave Net 提供 NetworkPolicy。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.
 -->
你需要擁有一個 Kubernetes 集羣。按照
[kubeadm 入門指南](/zh-cn/docs/reference/setup-tools/kubeadm/)
來啓動一個。


<!-- steps -->

<!--
## Install the Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation) guide.

The Weave Net addon for Kubernetes comes with a
[Network Policy Controller](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)
that automatically monitors Kubernetes for any NetworkPolicy annotations on all
namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.
-->
## 安裝 Weave Net 插件 {#install-the-weave-net-addon}

按照[通過插件集成 Kubernetes](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation)
指南執行安裝。

Kubernetes 的 Weave Net 插件帶有
[網絡策略控制器](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)，
可自動監控 Kubernetes 所有名字空間的 NetworkPolicy 註釋，
配置 `iptables` 規則以允許或阻止策略指示的流量。

<!--
## Test the installation

Verify that the weave works.

Enter the following command:
-->
## 測試安裝 {#test-the-installation}

驗證 weave 是否有效。

輸入以下命令：

```shell
kubectl get pods -n kube-system -o wide
```

<!--
The output is similar to this:
-->
輸出類似這樣：

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

<!--
Each Node has a weave Pod, and all Pods are `Running` and `2/2 READY`. (`2/2` means that each Pod has `weave` and `weave-npc`.)
-->
每個 Node 都有一個 weave Pod，所有 Pod 都是 `Running` 和 `2/2 READY`。
（`2/2` 表示每個 Pod 都有 `weave` 和 `weave-npc`。）

## {{% heading "whatsnext" %}}

<!--
Once you have installed the Weave Net addon, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy. If you have any question, contact us at
[#weave-community on Slack or Weave User Group](https://github.com/weaveworks/weave#getting-help).
 -->
安裝 Weave Net 插件後，你可以參考
[聲明網絡策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
來試用 Kubernetes NetworkPolicy。
如果你有任何疑問，請通過
[Slack 上的 #weave-community 頻道或者 Weave 用戶組](https://github.com/weaveworks/weave#getting-help)
聯繫我們。
