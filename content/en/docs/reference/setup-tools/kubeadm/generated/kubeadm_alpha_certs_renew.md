
### Synopsis


This command is not meant to be run on its own. See list of available subcommands.

```
kubeadm alpha certs renew [flags]
```

### Options

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for renew</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



SEE ALSO

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

