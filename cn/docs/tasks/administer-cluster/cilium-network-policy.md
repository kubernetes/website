---
assignees:
- danwent
title: 使用 Cilium 来提供 NetworkPolicy
cn-approvers:
- chentao1596
---

{% capture overview %}
<!--
This page shows how to use Cilium for NetworkPolicy.
-->
本页展示怎么样使用 Cilium 来提供 NetworkPolicy

<!--
For background on Cilium, read the [Introduction to Cilium](http://cilium.readthedocs.io/en/latest/intro/).
-->
如果想了解 Cilium 的更多信息，请参考 [Cilium 介绍](http://cilium.readthedocs.io/en/latest/intro/)。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
<!--
## Deploying Cilium on Minikube for Basic Testing
-->
## 在 Minikube 上部署 Cilium 进行基本测试

<!--
To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](http://www.cilium.io/try)
to perform a basic DaemonSet installation of Cilium in minikube.
-->
为了更容易熟悉 Cilium，您可以参考 [Cilium Kubernetes 入门指南](http://www.cilium.io/try)，在 minikube 上执行基本的 Cilium DaemonSet 安装 。

<!--
Installation in a minikube setup uses a simple ''all-in-one'' YAML
file that includes DaemonSet configurations for Cilium and a key-value store
(consul) as well as appropriate RBAC settings:
-->
在 minikube 上的安装是使用一个简单的 ''all-in-one'' YAML 文件完成的，该文件包含 Cilium 的 DaemonSet 配置、一个 key-value 存储（consul），以及相应的 RBAC 设置：

```shell
$ kubectl create -f https://raw.githubusercontent.com/cilium/cilium/master/examples/minikube/cilium-ds.yaml
clusterrole "cilium" created
serviceaccount "cilium" created
clusterrolebinding "cilium" created
daemonset "cilium-consul" created
daemonset "cilium" created
```

<!--
The remainder of the Getting Started Guide explains how to enforce both L3/L4 (i.e., IP address + port) security
policies, as well as L7 (e.g., HTTP) security policies using an example application.
-->
入门指南的其它部分解释了如何实现 L3/L4 （即：IP 地址+端口）这两种安全策略，并用一个应用程序示例描述了如何实现 L7（例如：HTTP）安全策略。

<!--
## Deploying Cilium for Production Use
-->
## 在生产环境中部署 Cilium

<!--
For detailed instructions around deploying Cilium for production, see:
[Cilium Administrator Guide](http://cilium.readthedocs.io/en/latest/admin/) This
documentation includes detailed requirements, instructions and example production DaemonSet files.
-->
关于在生产环境中部署 Cilium 的详细说明，请您参考 [Cilium 管理员指南](http://cilium.readthedocs.io/en/latest/admin/)，该文档包含了详细的要求、说明以及生成 DaemonSet 文件的示例。

{% endcapture %}

{% capture discussion %}
<!--
##  Understanding Cilium components
-->
## 理解 Cilium 组件

<!--
Deploying a cluster with Cilium adds Pods to the `kube-system` namespace.  To see this list of Pods run:
-->
部署使用 Cilium 的集群，将在 `kube-system` 命名空间下增加 pod。运行下面命令可以查看到 pod 列表：

```shell
kubectl get pods --namespace=kube-system
```

<!--
You'll see a list of Pods similar to this:
-->
查看到的列表信息跟下面类似：

```console
NAME            DESIRED   CURRENT   READY     NODE-SELECTOR   AGE
cilium          1         1         1         <none>          2m
...
```

<!--
There are two main components to be aware of:
-->
有两个主要部分需要注意：

<!--
- One `cilium` Pod runs on each node in your cluster and enforces network policy on the traffic to/from Pods on that node using Linux BPF.
-->
- 集群中的每个节点上都会有一个名称为 `cilium` 的 pod，它使用 Linux BPF 实现节点上进/出 pod 的网络策略。
<!--
- For production deployments, Cilium should leverage the key-value store cluster (e.g., etcd) used by Kubernetes, which typically runs on the Kubernetes master nodes.   The [Cilium Administrator Guide](http://cilium.readthedocs.io/en/latest/admin/) includes an example DaemonSet which can be customized to point to this key-value store cluster.   The simple ''all-in-one'' DaemonSet for minikube requires no such configuration because it automatically deploys a `cilium-consul` Pod to provide a key-value store.
-->
- 对于生产环境的部署，Cilium 应该使用 Kubernetes 使用的 key-value 存储集群（例如：etcd），这些存储集群通常运行在 Kubernetes 的 master 节点上。[Cilium 管理员指南](http://cilium.readthedocs.io/en/latest/admin/) 包含了一个定制 key-value 存储集群的 DaemonSet 的例子。对于 minikube 使用的 ''all-in-one'' DaemonSet，就不需要这样子配置，因为它会自动部署一个 `cilium-consul` pod 来提供 key-value 存储。

{% endcapture %}

{% capture whatsnext %}
<!--
Once your cluster is running, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy with Cilium.  Have fun, and if you have questions, contact us using the [Cilium Slack Channel](https://cilium.herokuapp.com/).
-->
集群正常运行后，您可以参考 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough) 去尝试使用 Cilium 提供的 Kubernetes NetworkPolicy。如果您有其它问题，可以通过 [Cilium Slack 频道](https://cilium.herokuapp.com/) 联系我们。
{% endcapture %}

{% include templates/task.md %}
