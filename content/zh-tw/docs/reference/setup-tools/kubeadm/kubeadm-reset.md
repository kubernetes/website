---
title: kubeadm reset
content_type: concept
weight: 60
---
<!-- ---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset
content_type: concept
weight: 60
--- -->

<!-- overview -->
<!-- Performs a best effort revert of changes made by `kubeadm init` or `kubeadm join`. -->
該命令盡力還原由 `kubeadm init` 或 `kubeadm join` 所做的更改。


<!-- body -->
{{< include "generated/kubeadm_reset.md" >}}

<!-- ### Reset workflow {#reset-workflow} -->
### Reset 工作流程 {#reset-workflow}

<!-- `kubeadm reset` is responsible for cleaning up a node local file system from files that were created using
the `kubeadm init` or `kubeadm join` commands. For control-plane nodes `reset` also removes the local stacked
etcd member of this node from the etcd cluster.
-->
`kubeadm reset` 負責從使用 `kubeadm init` 或 `kubeadm join` 命令建立的檔案中清除節點本地檔案系統。
對於控制平面節點，`reset` 還從 etcd 叢集中刪除該節點的本地 etcd Stacked 部署的成員。

<!-- `kubeadm reset phase` can be used to execute the separate phases of the above workflow.
To skip a list of phases you can use the `--skip-phases` flag, which works in a similar way to
the `kubeadm join` and `kubeadm init` phase runners. -->
`kubeadm reset phase` 可用於執行上述工作流程的各個階段。
要跳過階段列表，你可以使用 `--skip-phases` 引數，該引數的工作方式類似於 `kubeadm join` 和 `kubeadm init` 階段執行器。

<!-- ### External etcd clean up -->
### 外部 etcd 清理

<!-- `kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters. -->
如果使用了外部 etcd，`kubeadm reset` 將不會刪除任何 etcd 中的資料。這意味著，如果再次使用相同的 etcd 端點執行 `kubeadm init`，你將看到先前叢集的狀態。

<!-- To wipe etcd data it is recommended you use a client like etcdctl, such as: -->
要清理 etcd 中的資料，建議你使用 etcdctl 這樣的客戶端，例如：

```bash
etcdctl del "" --prefix
```

<!-- See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information. -->
更多詳情請參考 [etcd 文件](https://github.com/coreos/etcd/tree/master/etcdctl)。


## {{% heading "whatsnext" %}}

<!-- * [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster -->
* 參考 [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/) 來初始化 Kubernetes 主節點。
* 參考 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 來初始化 Kubernetes 工作節點並加入叢集。

