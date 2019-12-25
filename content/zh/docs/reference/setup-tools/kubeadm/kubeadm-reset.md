---
title: kubeadm reset
content_template: templates/concept
weight: 60
---
<!-- ---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset
content_template: templates/concept
weight: 60
--- -->

{{% capture overview %}}
<!-- Performs a best effort revert of changes made by `kubeadm init` or `kubeadm join`. -->
该命令尽力还原由 `kubeadm init` 或 `kubeadm join` 所做的更改。
{{% /capture %}}

{{% capture body %}}
{{< include "generated/kubeadm_reset.md" >}}

<!-- ### Reset workflow {#reset-workflow} -->
### Reset 工作流程 {#reset-workflow}

<!-- `kubeadm reset` is responsible for cleaning up a node local file system from files that were created using
the `kubeadm init` or `kubeadm join` commands. For control-plane nodes `reset` also removes the local stacked
etcd member of this node from the etcd cluster and also removes this node's information from the kubeadm
`ClusterStatus` object. `ClusterStatus` is a kubeadm managed Kubernetes API object that holds a list of kube-apiserver endpoints. -->
`kubeadm reset` 负责从使用 `kubeadm init` 或 `kubeadm join` 命令创建的文件中清除节点本地文件系统。对于控制平面节点，`reset` 还从 etcd 集群中删除该节点的本地 etcd 堆成员，还从 kubeadm `ClusterStatus` 对象中删除该节点的信息。
`ClusterStatus` 是一个 kubeadm 管理的 Kubernetes API 对象，该对象包含 kube-apiserver 端点列表。

<!-- `kubeadm reset phase` can be used to execute the separate phases of the above workflow.
To skip a list of phases you can use the `--skip-phases` flag, which works in a similar way to
the `kubeadm join` and `kubeadm init` phase runners. -->
`kubeadm reset phase` 可用于执行上述工作流程的各个阶段。
要跳过阶段列表，您可以使用 `--skip-phases` 参数，该参数的工作方式类似于 `kubeadm join` 和 `kubeadm init` 阶段运行器。

<!-- ### External etcd clean up -->
### 外部 etcd 清理

<!-- `kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters. -->
如果使用了外部 etcd，`kubeadm reset` 将不会删除任何 etcd 中的数据。这意味着，如果再次使用相同的 etcd 端点运行 `kubeadm init`，您将看到先前集群的状态。

<!-- To wipe etcd data it is recommended you use a client like etcdctl, such as: -->
要清理 etcd 中的数据，建议您使用 etcdctl 这样的客户端，例如：

```bash
etcdctl del "" --prefix
```

<!-- See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information. -->
更多详情请参考 [etcd 文档](https://github.com/coreos/etcd/tree/master/etcdctl)。
{{% /capture %}}

{{% capture whatsnext %}}
<!-- * [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster -->
* 参考 [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 来初始化 Kubernetes 主节点。
* 参考 [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 来初始化 Kubernetes 工作节点并加入集群。
{{% /capture %}}
