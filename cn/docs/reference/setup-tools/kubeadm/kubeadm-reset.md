---
cn-approvers:
- tianshapjq
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm 重置 
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset 
---
-->
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_reset.md %}

<!--
### External etcd clean up
-->
### 清理外部 etcd

<!--
`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters. 

To wipe etcd data it is recommended you use a client like etcdctl, such as:

```bash
etcdctl del "" --prefix
```

See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
-->
如果使用外部 etcd，`kubeadm reset` 将不会删除任何 etcd 数据。这意味着如果您再次使用相同的 etcd 节点运行 `kubeadm init`，您将看到以前的集群状态。

要删除 etcd 数据，建议您使用像 etcdctl 这样的客户端，例如：

```bash
etcdctl del "" --prefix
```

参阅 [etcd 文档](https://github.com/coreos/etcd/tree/master/etcdctl) 以获得更详细的信息。

{% endcapture %}

{% capture whatsnext %}
<!--
* [kubeadm init](kubeadm-init.md) to bootstrap a Kubernetes master node
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
-->
* [kubeadm init](kubeadm-init.md) 启动一个 Kubernetes master 节点
* [kubeadm join](kubeadm-join.md) 启动一个 Kubernetes 工作 node 并且将其加入到集群中
{% endcapture %}

{% include templates/concept.md %}