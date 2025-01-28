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
`kubeadm reset` also supports the `--config` flag for passing
a [`ResetConfiguration` structure](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
`kubeadm reset` 也支持使用 `--config` 参数来传递
[`ResetConfiguration` 结构](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### Cleanup of external etcd members
-->
### 清理外部 etcd 成员   {#cleanup-of-external-etcd-members}

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
### Cleanup of CNI configuration

CNI plugins use the directory `/etc/cni/net.d` to store their configuration.
The `kubeadm reset` command does not cleanup that directory. Leaving the configuration
of a CNI plugin on a host can be problematic if the same host is later used
as a new Kubernetes node and a different CNI plugin happens to be deployed in that cluster.
It can result in a configuration conflict between CNI plugins.
-->
### 清理 CNI 配置   {#cleanup-of-cni-configuration}

CNI 插件使用 `/etc/cni/net.d` 目录来存储其配置。
`kubeadm reset` 命令不会清理该目录。
如果同一个主机之后被用作新的 Kubernetes 节点，并且另一个 CNI 插件要被部署到该集群中，
那在主机上保留 CNI 插件的配置可能会出现问题。这可能会导致 CNI 插件之间的配置冲突。

<!--
To cleanup the directory, backup its contents if needed and then execute
the following command:
-->
要清理此目录，必要时先备份其内容，再执行以下命令：

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
### 清理网络流量规则   {#cleanup-of-network-traffic-rules}

`kubeadm reset` 命令不会清理由 kube-proxy 应用到主机的任何 iptables、nftables 或 IPVS 规则。
kube-proxy 中的控制循环确保每个节点主机上的规则是同步的。
有关细节请参阅[虚拟 IP 和服务代理](/zh-cn/docs/reference/networking/virtual-ips/)。

<!--
Leaving the rules without cleanup should not cause any issues if the host is
later reused as a Kubernetes node or if it will serve a different purpose.

If you wish to perform this cleanup, you can use the same kube-proxy container
which was used in your cluster and the `--cleanup` flag of the
`kube-proxy` binary:
-->
如果主机之后被重新用作 Kubernetes 节点或将其用于其他目的，不清理这些规则应该不会导致任何问题。

如果你希望执行此清理操作，可以使用集群中使用过的相同 kube-proxy 容器以及
`kube-proxy` 可执行文件的 `--cleanup` 参数：

<!--
The output of the above command should print `DONE` at the end.
Instead of Docker, you can use your preferred container runtime to start the container.
-->
上一条命令的输出应该在最后打印 `DONE`。除了 Docker，你还可以使用自己喜欢的容器运行时来启动容器。

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

`$HOME/.kube` 目录通常包含配置文件和 kubectl 缓存。
虽然不清理 `$HOME/.kube/cache` 的内容不是问题，但该目录中有一个重要文件。
即 `$HOME/.kube/config`，kubectl 使用此文件来对 Kubernetes API 服务器实施身份验证。
在 `kubeadm init` 执行完成后，用户会被指示将 `/etc/kubernetes/admin.conf`
文件复制到 `$HOME/.kube/config` 位置，并授予当前用户对其的访问权限。

<!--
The `kubeadm reset` command does not clean any of the contents of the `$HOME/.kube` directory.
Leaving the `$HOME/.kube/config` file without deleting it, can be problematic depending
on who will have access to this host after `kubeadm reset` was called.
If the same cluster continues to exist, it is highly recommended to delete the file,
as the admin credentials stored in it will continue to be valid.

To cleanup the directory, examine its contents, perform backup if needed and execute
the following command:
-->
`kubeadm reset` 命令不会清理 `$HOME/.kube` 目录中的任何内容。
不删除 `$HOME/.kube/config` 文件可能会产生问题，具体取决于在调用 `kubeadm reset` 之后谁将有权访问此主机。
如果同一集群仍然存在，强烈建议删除此文件，因为存放在其中的管理员凭证将继续有效。

要清理此目录，先检查其内容，必要时执行备份，再执行以下命令：

```bash
rm -rf $HOME/.kube
```

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
