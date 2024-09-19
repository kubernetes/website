---
title: kubeadm reset
content_type: concept
weight: 60
---
<!--
reviewers:
- luxas
- jbeda
title: kubeadm reset
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
Performs a best effort revert of changes made by `kubeadm init` or `kubeadm join`.
-->
该命令尽力还原由 `kubeadm init` 或 `kubeadm join` 所做的更改。

<!-- body -->

{{< include "generated/kubeadm_reset/_index.md" >}}

<!--
### Reset workflow {#reset-workflow}
-->
### Reset 工作流程 {#reset-workflow}

<!--
`kubeadm reset` is responsible for cleaning up a node local file system from files that were created using
the `kubeadm init` or `kubeadm join` commands. For control-plane nodes `reset` also removes the local stacked
etcd member of this node from the etcd cluster.
-->
`kubeadm reset` 负责从使用 `kubeadm init` 或 `kubeadm join` 命令创建的文件中清除节点本地文件系统。
对于控制平面节点，`reset` 还从 etcd 集群中删除该节点的本地 etcd Stacked 部署的成员。

<!--
`kubeadm reset phase` can be used to execute the separate phases of the above workflow.
To skip a list of phases you can use the `--skip-phases` flag, which works in a similar way to
the `kubeadm join` and `kubeadm init` phase runners.
-->
`kubeadm reset phase` 可用于执行上述工作流程的各个阶段。
要跳过阶段列表，你可以使用 `--skip-phases` 参数，该参数的工作方式类似于 `kubeadm join` 和 `kubeadm init` 阶段运行器。

<!--
### External etcd clean up
-->
### 外部 etcd 清理   {#external-etcd-clean-up}

<!--
`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters.
-->
如果使用了外部 etcd，`kubeadm reset` 将不会删除任何 etcd 中的数据。
这意味着，如果再次使用相同的 etcd 端点运行 `kubeadm init`，你将看到先前集群的状态。

<!--
To wipe etcd data it is recommended you use a client like etcdctl, such as:
-->
要清理 etcd 中的数据，建议你使用 etcdctl 这样的客户端，例如：

```bash
etcdctl del "" --prefix
```

<!--
See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
-->
更多详情请参考 [etcd 文档](https://github.com/coreos/etcd/tree/master/etcdctl)。

<!--
### Graceful kube-apiserver shutdown

If you have your `kube-apiserver` configured with the `--shutdown-delay-duration` flag,
you can run the following commands to attempt a graceful shutdown for the running API server Pod,
before you run `kubeadm reset`:
-->
### 体面关闭 kube-apiserver   {#graceful-kube-apiserver-shutdown}

如果你为 `kube-apiserver` 配置了 `--shutdown-delay-duration` 标志，
你可以在运行 `kubeadm reset` 之前，运行以下命令尝试体面关闭正在运行的 API 服务器 Pod：

```bash
yq eval -i '.spec.containers[0].command = []' /etc/kubernetes/manifests/kube-apiserver.yaml
timeout 60 sh -c 'while pgrep kube-apiserver >/dev/null; do sleep 1; done' || true
```

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
-->
* 参考 [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  来初始化 Kubernetes 控制平面节点。
* 参考 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  来初始化 Kubernetes 工作节点并加入集群。
