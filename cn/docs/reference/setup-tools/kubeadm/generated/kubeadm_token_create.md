
<!--
Create bootstrap tokens on the server.
-->
在服务器上创建 bootstrap token。

<!--
### Synopsis
-->
### 摘要



<!--
This command will create a bootstrap token for you.
You can specify the usages for this token, the "time to live" and an optional human friendly description.
-->
该命令会为您创建 bootstrap token。
您可以指定该 token 的用法，包括 “生存时间” 和可选的人性化描述。


<!--
The [token] is the actual token to write.
This should be a securely generated random token of the form "[a-z0-9]{6}.[a-z0-9]{16}".
If no [token] is given, kubeadm will generate a random token instead.
-->
其中 [token] 是要写入的实际 token。
它应该是一个安全生成的随机 token，其形式为 “[a-z0-9]{6}.[a-z0-9]{16}”。
如果没有给定 [token]，kubeadm 会生成一个随机 token。


```
kubeadm token create [token]
```

<!--
### Options

```
      --description string   A human friendly description of how this token is used.
      --groups stringSlice   Extra groups that this token will authenticate as when used for authentication. Must match "system:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]". (default [system:bootstrappers:kubeadm:default-node-token])
      --print-join-command   Instead of printing only the token, print the full 'kubeadm join' flag needed to join the cluster using the token.
      --ttl duration         The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire. (default 24h0m0s)
      --usages stringSlice   Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]. (default [signing,authentication])
```
-->
### 选项

```
      --description string   关于该 token 如何使用的人性化描述
      --groups stringSlice   当用于认证时，该 token 会以这些额外组身份进行认证。 必须和 “system:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]” 的格式匹配。（默认为 [system:bootstrappers:kubeadm:default-node-token]）
      --print-join-command   输出使用 token 加入集群所需的完整 'kubeadm join' 参数，而不是只输出 token。
      --ttl duration         token 自动删除前的持续时间（例如 1s、 2m 或 3h）。 如果设为 '0'，该 token 将永不过期（默认为 24h0m0s）
      --usages stringSlice   描述该 token 允许的使用方式。 您可以传入 --usages 多次，或者提供一个逗号分隔的选项列表。 有效的选项： [signing,authentication]。（默认为[signing,authentication]）
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
