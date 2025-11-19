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
該命令盡力還原由 `kubeadm init` 或 `kubeadm join` 所做的更改。

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
`kubeadm reset` 負責從使用 `kubeadm init` 或 `kubeadm join` 命令創建的文件中清除節點本地文件系統。
對於控制平面節點，`reset` 還從 etcd 集羣中刪除該節點的本地 etcd Stacked 部署的成員。

<!--
`kubeadm reset phase` can be used to execute the separate phases of the above workflow.
To skip a list of phases you can use the `--skip-phases` flag, which works in a similar way to
the `kubeadm join` and `kubeadm init` phase runners.
-->
`kubeadm reset phase` 可用於執行上述工作流程的各個階段。
要跳過階段列表，你可以使用 `--skip-phases` 參數，該參數的工作方式類似於 `kubeadm join` 和 `kubeadm init` 階段運行器。

<!--
`kubeadm reset` also supports the `--config` flag for passing
a [`ResetConfiguration` structure](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
`kubeadm reset` 也支持使用 `--config` 參數來傳遞
[`ResetConfiguration` 結構](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### Cleanup of external etcd members
-->
### 清理外部 etcd 成員   {#cleanup-of-external-etcd-members}

<!--
`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters.
-->
如果使用了外部 etcd，`kubeadm reset` 將不會刪除任何 etcd 中的數據。
這意味着，如果再次使用相同的 etcd 端點運行 `kubeadm init`，你將看到先前集羣的狀態。

<!--
To wipe etcd data it is recommended you use a client like etcdctl, such as:
-->
要清理 etcd 中的數據，建議你使用 etcdctl 這樣的客戶端，例如：

```bash
etcdctl del "" --prefix
```

<!--
See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
-->
更多詳情請參考 [etcd 文檔](https://github.com/coreos/etcd/tree/master/etcdctl)。

<!--
### Cleanup of CNI configuration

CNI plugins use the directory `/etc/cni/net.d` to store their configuration.
The `kubeadm reset` command does not cleanup that directory. Leaving the configuration
of a CNI plugin on a host can be problematic if the same host is later used
as a new Kubernetes node and a different CNI plugin happens to be deployed in that cluster.
It can result in a configuration conflict between CNI plugins.
-->
### 清理 CNI 配置   {#cleanup-of-cni-configuration}

CNI 插件使用 `/etc/cni/net.d` 目錄來存儲其配置。
`kubeadm reset` 命令不會清理該目錄。
如果同一個主機之後被用作新的 Kubernetes 節點，並且另一個 CNI 插件要被部署到該集羣中，
那在主機上保留 CNI 插件的配置可能會出現問題。這可能會導致 CNI 插件之間的配置衝突。

<!--
To cleanup the directory, backup its contents if needed and then execute
the following command:
-->
要清理此目錄，必要時先備份其內容，再執行以下命令：

```bash
sudo rm -rf /etc/cni/net.d
```

<!--
### Cleanup of network traffic rules

The `kubeadm reset` command does not clean any iptables, nftables or IPVS rules applied
to the host by kube-proxy. A control loop in kube-proxy ensures that the rules on each node
host are synchronized. For additional details please see
[Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/).
-->
### 清理網絡流量規則   {#cleanup-of-network-traffic-rules}

`kubeadm reset` 命令不會清理由 kube-proxy 應用到主機的任何 iptables、nftables 或 IPVS 規則。
kube-proxy 中的控制循環確保每個節點主機上的規則是同步的。
有關細節請參閱[虛擬 IP 和服務代理](/zh-cn/docs/reference/networking/virtual-ips/)。

<!--
Leaving the rules without cleanup should not cause any issues if the host is
later reused as a Kubernetes node or if it will serve a different purpose.

If you wish to perform this cleanup, you can use the same kube-proxy container
which was used in your cluster and the `--cleanup` flag of the
`kube-proxy` binary:
-->
如果主機之後被重新用作 Kubernetes 節點或將其用於其他目的，不清理這些規則應該不會導致任何問題。

如果你希望執行此清理操作，可以使用集羣中使用過的相同 kube-proxy 容器以及
`kube-proxy` 可執行文件的 `--cleanup` 參數：

<!--
The output of the above command should print `DONE` at the end.
Instead of Docker, you can use your preferred container runtime to start the container.
-->
上一條命令的輸出應該在最後打印 `DONE`。除了 Docker，你還可以使用自己喜歡的容器運行時來啓動容器。

<!--
### Cleanup of $HOME/.kube

The `$HOME/.kube` directory typically contains configuration files and kubectl cache.
While not cleaning the contents of `$HOME/.kube/cache` is not an issue, there is one important
file in the directory. That is `$HOME/.kube/config` and it is used by kubectl to authenticate
to the Kubernetes API server. After `kubeadm init` finishes, the user is instructed to copy the
`/etc/kubernetes/admin.conf` file to the `$HOME/.kube/config` location and grant the current
user access to it.
-->
### $HOME/.kube 的清理   {#cleanup-of-home-kube}

`$HOME/.kube` 目錄通常包含配置文件和 kubectl 緩存。
雖然不清理 `$HOME/.kube/cache` 的內容不是問題，但該目錄中有一個重要文件。
即 `$HOME/.kube/config`，kubectl 使用此文件來對 Kubernetes API 服務器實施身份驗證。
在 `kubeadm init` 執行完成後，用戶會被指示將 `/etc/kubernetes/admin.conf`
文件複製到 `$HOME/.kube/config` 位置，並授予當前用戶對其的訪問權限。

<!--
The `kubeadm reset` command does not clean any of the contents of the `$HOME/.kube` directory.
Leaving the `$HOME/.kube/config` file without deleting it, can be problematic depending
on who will have access to this host after `kubeadm reset` was called.
If the same cluster continues to exist, it is highly recommended to delete the file,
as the admin credentials stored in it will continue to be valid.

To cleanup the directory, examine its contents, perform backup if needed and execute
the following command:
-->
`kubeadm reset` 命令不會清理 `$HOME/.kube` 目錄中的任何內容。
不刪除 `$HOME/.kube/config` 文件可能會產生問題，具體取決於在調用 `kubeadm reset` 之後誰將有權訪問此主機。
如果同一集羣仍然存在，強烈建議刪除此文件，因爲存放在其中的管理員憑證將繼續有效。

要清理此目錄，先檢查其內容，必要時執行備份，再執行以下命令：

```bash
rm -rf $HOME/.kube
```

<!--
### Graceful kube-apiserver shutdown

If you have your `kube-apiserver` configured with the `--shutdown-delay-duration` flag,
you can run the following commands to attempt a graceful shutdown for the running API server Pod,
before you run `kubeadm reset`:
-->
### 體面關閉 kube-apiserver   {#graceful-kube-apiserver-shutdown}

如果你爲 `kube-apiserver` 配置了 `--shutdown-delay-duration` 標誌，
你可以在運行 `kubeadm reset` 之前，運行以下命令嘗試體面關閉正在運行的 API 服務器 Pod：

```bash
yq eval -i '.spec.containers[0].command = []' /etc/kubernetes/manifests/kube-apiserver.yaml
timeout 60 sh -c 'while pgrep kube-apiserver >/dev/null; do sleep 1; done' || true
```

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
-->
* 參考 [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  來初始化 Kubernetes 控制平面節點。
* 參考 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  來初始化 Kubernetes 工作節點並加入集羣。
