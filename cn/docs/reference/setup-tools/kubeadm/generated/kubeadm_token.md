
<!--
Manage bootstrap tokens.
-->
管理 bootstrap token

<!--
### Synopsis
-->
### 摘要



<!--
This command manages bootstrap tokens. It is optional and needed only for advanced use cases.
-->
该命令用于管理 bootstrap token。 该命令是可选的，只在高级用例中需要。

<!--
In short, bootstrap tokens are used for establishing bidirectional trust between a client and a server.
A bootstrap token can be used when a client (for example a node that is about to join the cluster) needs
to trust the server it is talking to. Then a bootstrap token with the "signing" usage can be used.
bootstrap tokens can also function as a way to allow short-lived authentication to the API Server
(the token serves as a way for the API Server to trust the client), for example for doing the TLS Bootstrap.
-->
简而言之，bootstrap token 用于在客户端和服务器端建立双向信任。
当一个客户端（如一个即将加入集群的节点）需要信任正在通信的服务器，这时可以使用带有 “签名” 的 bootstrap token。
Bootstrap token 也可以作为一种允许对 API 服务器进行短时间身份认证的方式（ bootstrap token 作为 API 服务器信任客户端的一种方式），如执行 TLS 初始化。


<!--
What is a bootstrap token more exactly?
 - It is a Secret in the kube-system namespace of type "bootstrap.kubernetes.io/token".
 - A bootstrap token must be of the form "[a-z0-9]{6}.[a-z0-9]{16}". The former part is the public token ID,
   while the latter is the Token Secret and it must be kept private at all circumstances!
 - The name of the Secret must be named "bootstrap-token-(token-id)".
-->
更确切地说，bootstrap token 是什么呢？
 - 它是 kube-system namespace 下的一个 Secret，其类型为 “bootstrap.kubernetes.io/token”。
 - bootstrap token 的形式为 “[a-z0-9]{6}.[a-z0-9]{16}”。 前一部分是 public token ID，而后一部分是
   Token Secret，并且它在任何情况下都必须保密。
 - Secret 必须以 “bootstrap-token-(token-id)” 的形式命名。

<!--
You can read more about bootstrap tokens here:
  https://kubernetes.io/docs/admin/bootstrap-tokens/
-->
您可以在这里阅读更多关于 bootstrap token 的信息：
  https://kubernetes.io/docs/admin/bootstrap-tokens/

```
kubeadm token
```

<!--
### Options

```
      --dry-run             Whether to enable dry-run mode or not
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```
-->
### 选项

```
      --dry-run             是否启用 dry-run 模式
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

