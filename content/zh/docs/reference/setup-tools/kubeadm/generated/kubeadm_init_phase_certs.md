
<!--
### Synopsis
-->
### 概要



<!--
This command is not meant to be run on its own. See list of available subcommands.
-->
此命令并非设计用来单独运行。请参阅可用子命令列表。

```
kubeadm init phase certs [flags]
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
      help for certs
      -->
       certs 操作的帮助命令
      </td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 从父指令中继承的选项

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
* [kubeadm init phase](kubeadm_init_phase.md)	 - Use this command to invoke single phase of the init workflow
* [kubeadm init phase certs all](kubeadm_init_phase_certs_all.md)	 - Generate all certificates
* [kubeadm init phase certs apiserver](kubeadm_init_phase_certs_apiserver.md)	 - Generate the certificate for serving the Kubernetes API
* [kubeadm init phase certs apiserver-etcd-client](kubeadm_init_phase_certs_apiserver-etcd-client.md)	 - Generate the certificate the apiserver uses to access etcd
* [kubeadm init phase certs apiserver-kubelet-client](kubeadm_init_phase_certs_apiserver-kubelet-client.md)	 - Generate the certificate for the API server to connect to kubelet
* [kubeadm init phase certs ca](kubeadm_init_phase_certs_ca.md)	 - Generate the self-signed Kubernetes CA to provision identities for other Kubernetes components
* [kubeadm init phase certs etcd-ca](kubeadm_init_phase_certs_etcd-ca.md)	 - Generate the self-signed CA to provision identities for etcd
* [kubeadm init phase certs etcd-healthcheck-client](kubeadm_init_phase_certs_etcd-healthcheck-client.md)	 - Generate the certificate for liveness probes to healthcheck etcd
* [kubeadm init phase certs etcd-peer](kubeadm_init_phase_certs_etcd-peer.md)	 - Generate the certificate for etcd nodes to communicate with each other
* [kubeadm init phase certs etcd-server](kubeadm_init_phase_certs_etcd-server.md)	 - Generate the certificate for serving etcd
* [kubeadm init phase certs front-proxy-ca](kubeadm_init_phase_certs_front-proxy-ca.md)	 - Generate the self-signed CA to provision identities for front proxy
* [kubeadm init phase certs front-proxy-client](kubeadm_init_phase_certs_front-proxy-client.md)	 - Generate the certificate for the front proxy client
* [kubeadm init phase certs sa](kubeadm_init_phase_certs_sa.md)	 - Generate a private key for signing service account tokens along with its public key
-->
* [kubeadm init phase](kubeadm_init_phase.md)	 - 使用此命令可以调用 `init` 工作流程的单个阶段
* [kubeadm init phase certs all](kubeadm_init_phase_certs_all.md)	 - 生成所有证书
* [kubeadm init phase certs apiserver](kubeadm_init_phase_certs_apiserver.md)	 - 生成用于服务 Kubernetes API 的证书
* [kubeadm init phase certs apiserver-etcd-client](kubeadm_init_phase_certs_apiserver-etcd-client.md)	 - 生成 apiserver 用于访问 etcd 的证书
* [kubeadm init phase certs apiserver-kubelet-client](kubeadm_init_phase_certs_apiserver-kubelet-client.md)	 - 为 API 服务器生成证书以连接到 kubelet
* [kubeadm init phase certs ca](kubeadm_init_phase_certs_ca.md)	 - 生成自签名的 Kubernetes CA 以提供其他 Kubernetes 组件的身份
* [kubeadm init phase certs etcd-ca](kubeadm_init_phase_certs_etcd-ca.md)	 - 生成自签名 CA 来为 etcd 提供身份
* [kubeadm init phase certs etcd-healthcheck-client](kubeadm_init_phase_certs_etcd-healthcheck-client.md)	 - 生成用于健康检查等活动性探针的证书
* [kubeadm init phase certs etcd-peer](kubeadm_init_phase_certs_etcd-peer.md)	 - 生成 etcd 节点相互通信的证书
* [kubeadm init phase certs etcd-server](kubeadm_init_phase_certs_etcd-server.md)	 - 生成用于提供 etcd 的证书
* [kubeadm init phase certs front-proxy-ca](kubeadm_init_phase_certs_front-proxy-ca.md)	 - 生成自签名 CA 来为前端代理提供身份
* [kubeadm init phase certs front-proxy-client](kubeadm_init_phase_certs_front-proxy-client.md)	 - 为前端代理客户端生成证书
* [kubeadm init phase certs sa](kubeadm_init_phase_certs_sa.md)	 - 生成用于签名 service account 令牌的私钥及其公钥

