---
approvers:
- caseydavenport
title: 使用 Calico 来提供 NetworkPolicy
---

<!--
This page shows how to use Calico for NetworkPolicy.
-->
{% capture overview %}
本页展示怎么样使用 Calico 来提供 NetworkPolicy
{% endcapture %}

<!--
* Install Calico for Kubernetes.
-->
{% capture prerequisites %}
* 为 Kubernetes 安装 Calico
{% endcapture %}

{% capture steps %}
<!--
## Deploying a cluster using Calico
-->
## 使用 Calico 部署一个集群

<!--
You can deploy a cluster using Calico for network policy in the default [GCE deployment](/docs/getting-started-guides/gce) using the following set of commands:
-->
使用如下命令，您可以在默认的 [GCE](/docs/getting-started-guides/gce) 上部署出一个为网络策略使用 Calico 的集群环境：

```shell
export NETWORK_POLICY_PROVIDER=calico
export KUBE_NODE_OS_DISTRIBUTION=debian
curl -sS https://get.k8s.io | bash
```

<!--
See the [Calico documentation](http://docs.projectcalico.org/) for more options to deploy Calico with Kubernetes.
-->
更多的部署选项请参考 [Calico 项目文档](http://docs.projectcalico.org/)
{% endcapture %}

{% capture discussion %}
<!--
##  Understanding Calico components
-->
##  理解 Calico 组件

<!--
Deploying a cluster with Calico adds Pods that support Kubernetes NetworkPolicy.  These Pods run in the `kube-system` Namespace.
-->
部署使用 Calico 的集群其实是增加了支持 Kubernetes NetworkPolicy 的 Pod， 这些 Pod 运行在 `kube-system` 命名空间下。

<!--
To see this list of Pods run:
-->
使用如下方式去查看这些运行的 Pod：

```shell
kubectl get pods --namespace=kube-system
```

<!--
You'll see a list of Pods similar to this:
-->
您可以看到类似下面这样的一个 Pod 列表：

```console
NAME                                                 READY     STATUS    RESTARTS   AGE
calico-node-kubernetes-minion-group-jck6             1/1       Running   0          46m
calico-node-kubernetes-minion-group-k9jy             1/1       Running   0          46m
calico-node-kubernetes-minion-group-szgr             1/1       Running   0          46m
calico-policy-controller-65rw1                       1/1       Running   0          46m
...
```

<!--
There are two main components to be aware of:
-->
主要有两种组件

<!--
- One `calico-node` Pod runs on each node in your cluster and enforces network policy on the traffic to/from Pods on that machine by configuring iptables.
-->
- 在集群的每个节点上都会运行一个以 `calico-node` 开头命名的 Pod，用于配置 iptables 去实现那些机器上 Pod 的出/入网络策略
<!--
- The `calico-policy-controller` Pod reads the policy and label information from the Kubernetes API and configures Calico appropriately.
-->
- 整个集群环境只有一个以 `calico-policy-controller` 开头命名的 Pod，用于从 Kubernetes API 中读取策略和标签信息，适当的对 Calico 进行配置
{% endcapture %}

<!--
Once your cluster is running, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
-->
{% capture whatsnext %}
集群部署完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy
{% endcapture %}

{% include templates/task.md %}


