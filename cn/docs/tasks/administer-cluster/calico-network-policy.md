---
approvers:
- caseydavenport
title: 使用 Calico 来提供 NetworkPolicy
---


{% capture overview %}
本页展示怎么样使用 Calico 来提供 NetworkPolicy
{% endcapture %}


{% capture prerequisites %}
* 为 Kubernetes 安装 Calico
{% endcapture %}

{% capture steps %}

## 使用 Calico 部署一个集群


使用如下命令，您可以在默认的 [GCE 部署环境中](/docs/getting-started-guides/gce) 部署一个使用 Calico 来提供网络策略的集群：

```shell
export NETWORK_POLICY_PROVIDER=calico
export KUBE_NODE_OS_DISTRIBUTION=debian
curl -sS https://get.k8s.io | bash
```


如果希望了解其它的部署选项，请您参考 [Calico 项目文档](http://docs.projectcalico.org/)
{% endcapture %}

{% capture discussion %}

##  理解 Calico 组件


部署使用 Calico 的集群其实是增加了支持 Kubernetes NetworkPolicy 的 Pods， 这些 Pods 运行在 `kube-system` 命名空间下。


使用如下方式去查看这些运行的 Pods：

```shell
kubectl get pods --namespace=kube-system
```


您可以看到类似下面这样的一个 Pods 列表：

```console
NAME                                                 READY     STATUS    RESTARTS   AGE
calico-node-kubernetes-minion-group-jck6             1/1       Running   0          46m
calico-node-kubernetes-minion-group-k9jy             1/1       Running   0          46m
calico-node-kubernetes-minion-group-szgr             1/1       Running   0          46m
calico-policy-controller-65rw1                       1/1       Running   0          46m
...
```


主要有两种组件


- 在集群的每个节点上都会运行一个以 `calico-node` 开头命名的 Pod，用于配置 iptables 去实现那些机器上 Pods 的出/入网络策略

- 整个集群环境只有一个以 `calico-policy-controller` 开头命名的 Pod，用于从 Kubernetes API 中读取策略和标签信息，适当的对 Calico 进行配置
{% endcapture %}


{% capture whatsnext %}
集群部署完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy
{% endcapture %}

{% include templates/task.md %}
