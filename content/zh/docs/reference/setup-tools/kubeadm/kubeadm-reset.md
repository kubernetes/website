---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset
content_template: templates/concept
weight: 60
---

{{% capture overview %}}
<!--
This command reverts any changes made by `kubeadm init` or `kubeadm join`.
-->
此命令用来将 `kubeadm init` 或 `kubeadm join` 命令所做的改动恢复到之前的状态。
{{% /capture %}}

{{% capture body %}}
{{< include "generated/kubeadm_reset.md" >}}

<!--
### External etcd clean up!

`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters.

To wipe etcd data it is recommended you use a client like etcdctl, such as:
-->

### 外部 etcd 清理

如果使用了外部 etcd，`kubeadm reset` 将不会删除任何 etcd 中的数据。
这意味着，如果再次使用相同的 etcd 端点运行 `kubeadm init`，您将看到先前集群的状态。

要擦除 etcd 中的数据，建议您使用 etcdctl 这样的客户端，例如：

```bash
etcdctl del "" --prefix
```
<!--
See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
-->

更多详情请参考 [etcd 文档](https://github.com/coreos/etcd/tree/master/etcdctl)。

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes master node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
-->

* 参考 [kubeadm init](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/) 来初始化 Kubernetes 主节点。
* 参考 [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 来初始化 Kubernetes 工作节点并加入集群。

{{% /capture %}}
