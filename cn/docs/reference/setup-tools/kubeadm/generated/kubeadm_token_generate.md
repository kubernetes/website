
<!--
Generate and print a bootstrap token, but do not create it on the server.
-->
生成并输出一个 bootstrap token，但不在服务器上创建它。

<!--
### Synopsis
-->
### 摘要



<!--
This command will print out a randomly-generated bootstrap token that can be used with
the "init" and "join" commands.
-->
该命令会输出一个随机生成的 bootstrap token，该 token 可被用于 “init” 和 “join” 命令。

<!--
You don't have to use this command in order to generate a token. You can do so
yourself as long as it is in the format "[a-z0-9]{6}.[a-z0-9]{16}". This
command is provided for convenience to generate tokens in the given format.
-->
不是必须使用该命令来生成 token，您也可以自己来生成，只要保证 token 格式为 “[a-z0-9]{6}.[a-z0-9]{16}”。
该命令的提供是为了方便生成给定格式的 token。

<!--
You can also use "kubeadm init" without specifying a token and it will
generate and print one for you.
-->
您也可以在不指定 token 的情况下使用 “kubeadm init” 命令，它将为您生成并输出一个 token。


```
kubeadm token generate
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

