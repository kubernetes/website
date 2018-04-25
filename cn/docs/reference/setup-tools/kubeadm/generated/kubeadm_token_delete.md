
<!--
Delete bootstrap tokens on the server.
-->
在服务器上删除 bootstrap token

<!--
### Synopsis
-->
### 摘要



<!--
This command will delete a given bootstrap token for you.
-->
该命令会为您删除给定的 bootstrap token。

<!--
The [token-value] is the full Token of the form "[a-z0-9]{6}.[a-z0-9]{16}" or the
Token ID of the form "[a-z0-9]{6}" to delete.
-->
其中 [token-value] 是要删除的形式为 “[a-z0-9]{6}.[a-z0-9]{16}” 的完整 Token，
或形式为 “[a-z0-9]{6}” 的 Token ID。


```
kubeadm token delete [token-value]
```

<!--
### Options inherited from parent commands

```
      --dry-run             Whether to enable dry-run mode or not
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```
-->
### 继承自父命令的选项

```
      --dry-run             是否启用 dry-run 模式
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

