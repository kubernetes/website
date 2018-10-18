---
reviewers:
- bboreham
title: 使用 Weave Net 作为 NetworkPolicy
content_template: templates/task
weight: 50
---

{{% capture overview %}}

<!-- This page shows how to use Weave Net for NetworkPolicy. -->

本页展示了如何使用使用 Weave Net 作为 NetworkPolicy。

{{% /capture %}}

{{% capture prerequisites %}}
<!-- 
You need to have a Kubernetes cluster. Follow the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/) to bootstrap one.
 -->
您需要拥有一个 Kubernetes 集群。按照[kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)来引导一个。
{{% /capture %}}

{{% capture steps %}}
<!-- 
## Install the Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.

The Weave Net addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.
 -->
## 安装 Weave Net 插件

按照[通过插件集成Kubernetes](https://www.weave.works/docs/net/latest/kube-addon/)指南。

Kubernetes 的 Weave Net 插件带有[网络策略控制器](https://www.weave.works/docs/net/latest/kube-addon/#npc)，可自动监控 Kubernetes 所有名称空间中的任何 NetworkPolicy 注释。 配置`iptables`规则以允许或阻止策略指示的流量。
<!-- 
## Test the installation

Verify that the weave works.

Enter the following command:
 -->

## 测试安装

验证 weave 是否有效。

输入以下命令：

```shell
kubectl get po -n kube-system -o wide
```

<!-- The output is similar to this: -->
输出类似这样：

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

<!-- Each Node has a weave Pod, and all Pods are `Running` and `2/2 READY`. (`2/2` means that each Pod has `weave` and `weave-npc`.) -->
每个 Node 都有一个 weave Pod，所有 Pod 都是`Running`和`2/2 READY`。（`2/2`表示每个Pod都有`weave`和`weave-npc`。）

{{% /capture %}}

{{% capture whatsnext %}}
<!-- 
Once you have installed the Weave Net addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy. If you have any question, contact us at [#weave-community on Slack or Weave User Group](https://github.com/weaveworks/weave#getting-help).
 -->

安装Weave Net插件后，您可以按照[声明网络策略](/docs/tasks/administration-cluster/declare-network-policy/)来试用 Kubernetes NetworkPolicy。 如果您有任何疑问，请联系我们[#weave-community on Slack 或 Weave User Group](https://github.com/weaveworks/weave#getting-help)。
{{% /capture %}}

