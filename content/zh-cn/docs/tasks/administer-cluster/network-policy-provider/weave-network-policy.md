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
本页展示如何使用 Weave Net 提供 NetworkPolicy。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.
 -->
你需要拥有一个 Kubernetes 集群。按照
[kubeadm 入门指南](/zh-cn/docs/reference/setup-tools/kubeadm/)
来启动一个。


<!-- steps -->

<!--
## Install the Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation) guide.

The Weave Net addon for Kubernetes comes with a
[Network Policy Controller](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)
that automatically monitors Kubernetes for any NetworkPolicy annotations on all
namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.
-->
## 安装 Weave Net 插件 {#install-the-weave-net-addon}

按照[通过插件集成 Kubernetes](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation)
指南执行安装。

Kubernetes 的 Weave Net 插件带有
[网络策略控制器](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)，
可自动监控 Kubernetes 所有名字空间的 NetworkPolicy 注释，
配置 `iptables` 规则以允许或阻止策略指示的流量。

<!--
## Test the installation

Verify that the weave works.

Enter the following command:
-->
## 测试安装 {#test-the-installation}

验证 weave 是否有效。

输入以下命令：

```shell
kubectl get pods -n kube-system -o wide
```

<!--
The output is similar to this:
-->
输出类似这样：

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
每个 Node 都有一个 weave Pod，所有 Pod 都是 `Running` 和 `2/2 READY`。
（`2/2` 表示每个 Pod 都有 `weave` 和 `weave-npc`。）

## {{% heading "whatsnext" %}}

<!--
Once you have installed the Weave Net addon, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy. If you have any question, contact us at
[#weave-community on Slack or Weave User Group](https://github.com/weaveworks/weave#getting-help).
 -->
安装 Weave Net 插件后，你可以参考
[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
来试用 Kubernetes NetworkPolicy。
如果你有任何疑问，请通过
[Slack 上的 #weave-community 频道或者 Weave 用户组](https://github.com/weaveworks/weave#getting-help)
联系我们。
