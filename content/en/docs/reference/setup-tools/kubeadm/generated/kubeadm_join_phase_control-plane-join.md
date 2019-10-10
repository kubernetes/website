
### Synopsis


Join a machine as a control plane instance

```
kubeadm join phase control-plane-join [flags]
```

### Examples

```
  # Joins a machine as a control plane instance
  kubeadm join phase control-plane-join all
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for control-plane-join</td>
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
* [kubeadm join phase control-plane-join all](kubeadm_join_phase_control-plane-join_all.md)	 - Join a machine as a control plane instance
* [kubeadm join phase control-plane-join etcd](kubeadm_join_phase_control-plane-join_etcd.md)	 - Add a new local etcd member
* [kubeadm join phase control-plane-join mark-control-plane](kubeadm_join_phase_control-plane-join_mark-control-plane.md)	 - Mark a node as a control-plane
* [kubeadm join phase control-plane-join update-status](kubeadm_join_phase_control-plane-join_update-status.md)	 - Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap

