
<!--
### Synopsis
-->
### 概要


<!--
This command is not meant to be run on its own. See list of available subcommands.
-->
此命令并非设计用来单独运行。请参阅可用子命令列表。

```
kubeadm alpha certs renew [flags]
```

<!--
### Options
-->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for renew
      -->
       renew 操作的帮助命令
      </td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      [EXPERIMENTAL] The path to the 'real' host root filesystem.
      -->
      [实验] 到 '真实' 主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>



<!--
SEE ALSO
-->
查看其他

<!--
* [kubeadm alpha certs](kubeadm_alpha_certs.md)	 - Commands related to handling kubernetes certificates
* [kubeadm alpha certs renew admin.conf](kubeadm_alpha_certs_renew_admin.conf.md)	 - Renew the certificate embedded in the kubeconfig file for the admin to use and for kubeadm itself
* [kubeadm alpha certs renew all](kubeadm_alpha_certs_renew_all.md)	 - Renew all available certificates
* [kubeadm alpha certs renew apiserver](kubeadm_alpha_certs_renew_apiserver.md)	 - Renew the certificate for serving the Kubernetes API
* [kubeadm alpha certs renew apiserver-etcd-client](kubeadm_alpha_certs_renew_apiserver-etcd-client.md)	 - Renew the certificate the apiserver uses to access etcd
* [kubeadm alpha certs renew apiserver-kubelet-client](kubeadm_alpha_certs_renew_apiserver-kubelet-client.md)	 - Renew the certificate for the API server to connect to kubelet
* [kubeadm alpha certs renew controller-manager.conf](kubeadm_alpha_certs_renew_controller-manager.conf.md)	 - Renew the certificate embedded in the kubeconfig file for the controller manager to use
* [kubeadm alpha certs renew etcd-healthcheck-client](kubeadm_alpha_certs_renew_etcd-healthcheck-client.md)	 - Renew the certificate for liveness probes to healthcheck etcd
* [kubeadm alpha certs renew etcd-peer](kubeadm_alpha_certs_renew_etcd-peer.md)	 - Renew the certificate for etcd nodes to communicate with each other
* [kubeadm alpha certs renew etcd-server](kubeadm_alpha_certs_renew_etcd-server.md)	 - Renew the certificate for serving etcd
* [kubeadm alpha certs renew front-proxy-client](kubeadm_alpha_certs_renew_front-proxy-client.md)	 - Renew the certificate for the front proxy client
* [kubeadm alpha certs renew scheduler.conf](kubeadm_alpha_certs_renew_scheduler.conf.md)	 - Renew the certificate embedded in the kubeconfig file for the scheduler manager to use
-->
* [kubeadm alpha certs](kubeadm_alpha_certs.md)	 - 处理 kubernetes 证书相关的命令
* [kubeadm alpha certs renew admin.conf](kubeadm_alpha_certs_renew_admin.conf.md)	 - 续订 kubeconfig 文件中嵌入的证书，供管理员和 kubeadm 使用
* [kubeadm alpha certs renew all](kubeadm_alpha_certs_renew_all.md)	 - 续订所有可用证书
* [kubeadm alpha certs renew apiserver](kubeadm_alpha_certs_renew_apiserver.md)	 - 续订用于 Kubernetes API 的证书
* [kubeadm alpha certs renew apiserver-etcd-client](kubeadm_alpha_certs_renew_apiserver-etcd-client.md)	 - 续订 apiserver 用于访问 etcd 的证书
* [kubeadm alpha certs renew apiserver-kubelet-client](kubeadm_alpha_certs_renew_apiserver-kubelet-client.md)	 - 续订证书以供 API 服务器连接到 kubelet
* [kubeadm alpha certs renew controller-manager.conf](kubeadm_alpha_certs_renew_controller-manager.conf.md)	 - 续订 kubeconfig 文件中嵌入的证书，以供控制器管理器使用
* [kubeadm alpha certs renew etcd-healthcheck-client](kubeadm_alpha_certs_renew_etcd-healthcheck-client.md)	 - 将健康探针的证书续订到 healthcheck etcd
* [kubeadm alpha certs renew etcd-peer](kubeadm_alpha_certs_renew_etcd-peer.md)	 - 续订 etcd 节点的证书使相互通信
* [kubeadm alpha certs renew etcd-server](kubeadm_alpha_certs_renew_etcd-server.md)	 - 续订服务 etcd 的证书
* [kubeadm alpha certs renew front-proxy-client](kubeadm_alpha_certs_renew_front-proxy-client.md)	 - 续订前端代理客户端的证书
* [kubeadm alpha certs renew scheduler.conf](kubeadm_alpha_certs_renew_scheduler.conf.md)	 - 续订 kubeconfig 文件中嵌入的证书，以供调度程序管理器使用

