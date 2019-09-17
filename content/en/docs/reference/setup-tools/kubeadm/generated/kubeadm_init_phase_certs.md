
### Synopsis


This command is not meant to be run on its own. See list of available subcommands.

```
kubeadm init phase certs [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for certs</td>
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

