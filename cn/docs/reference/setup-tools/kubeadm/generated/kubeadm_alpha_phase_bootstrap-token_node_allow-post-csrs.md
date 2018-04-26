
<!--
Configures RBAC to allow node bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
-->
配置 RBAC，来允许节点 bootstrap token 发送 CSR（证书签名请求），以使得节点获得长期证书凭证。

<!--
### Synopsis
-->
### 摘要


<!--
Configures RBAC rules to allow node bootstrap tokens to post a certificate signing request, thus enabling nodes joining the cluster to request long term certificate credentials. 
-->
配置 RBAC 规则，以允许节点 bootstrap token 发送证书签名请求，
从而使加入集群的节点能够请求长期证书凭证。

<!--
See online documentation about TLS bootstrapping for more details. 
-->
查看 TLS 初始化相关的在线文档，以了解更多详情。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：该命令当前为 alpha。

```
kubeadm alpha phase bootstrap-token node allow-post-csrs
```

<!--
### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```
-->
### 继承自父命令的选项

```
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

