
### Synopsis


Prepare the machine for serving a control plane

```
kubeadm join phase control-plane-prepare [flags]
```

### Examples

```
  # Prepares the machine for serving a control plane
  kubeadm join phase control-plane-prepare all
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for control-plane-prepare</td>
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

* [kubeadm join phase](kubeadm_join_phase.md)	 - Use this command to invoke single phase of the join workflow
* [kubeadm join phase control-plane-prepare all](kubeadm_join_phase_control-plane-prepare_all.md)	 - Prepare the machine for serving a control plane
* [kubeadm join phase control-plane-prepare certs](kubeadm_join_phase_control-plane-prepare_certs.md)	 - Generate the certificates for the new control plane components
* [kubeadm join phase control-plane-prepare control-plane](kubeadm_join_phase_control-plane-prepare_control-plane.md)	 - Generate the manifests for the new control plane components
* [kubeadm join phase control-plane-prepare download-certs](kubeadm_join_phase_control-plane-prepare_download-certs.md)	 - [EXPERIMENTAL] Download certificates shared among control-plane nodes from the kubeadm-certs Secret
* [kubeadm join phase control-plane-prepare kubeconfig](kubeadm_join_phase_control-plane-prepare_kubeconfig.md)	 - Generate the kubeconfig for the new control plane components

