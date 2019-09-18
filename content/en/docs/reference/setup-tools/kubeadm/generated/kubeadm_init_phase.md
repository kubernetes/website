
### Synopsis


Use this command to invoke single phase of the init workflow

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for phase</td>
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

* [kubeadm init](kubeadm_init.md)	 - Run this command in order to set up the Kubernetes control plane
* [kubeadm init phase addon](kubeadm_init_phase_addon.md)	 - Install required addons for passing Conformance tests
* [kubeadm init phase bootstrap-token](kubeadm_init_phase_bootstrap-token.md)	 - Generates bootstrap tokens used to join a node to a cluster
* [kubeadm init phase certs](kubeadm_init_phase_certs.md)	 - Certificate generation
* [kubeadm init phase control-plane](kubeadm_init_phase_control-plane.md)	 - Generate all static Pod manifest files necessary to establish the control plane
* [kubeadm init phase etcd](kubeadm_init_phase_etcd.md)	 - Generate static Pod manifest file for local etcd
* [kubeadm init phase kubeconfig](kubeadm_init_phase_kubeconfig.md)	 - Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
* [kubeadm init phase kubelet-start](kubeadm_init_phase_kubelet-start.md)	 - Write kubelet settings and (re)start the kubelet
* [kubeadm init phase mark-control-plane](kubeadm_init_phase_mark-control-plane.md)	 - Mark a node as a control-plane
* [kubeadm init phase preflight](kubeadm_init_phase_preflight.md)	 - Run pre-flight checks
* [kubeadm init phase upload-certs](kubeadm_init_phase_upload-certs.md)	 - Upload certificates to kubeadm-certs
* [kubeadm init phase upload-config](kubeadm_init_phase_upload-config.md)	 - Upload the kubeadm and kubelet configuration to a ConfigMap

