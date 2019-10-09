
### Synopsis


Upgrade your cluster smoothly to a newer version with this command

```
kubeadm upgrade [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for upgrade</td>
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

* [kubeadm](kubeadm.md)	 - kubeadm: easily bootstrap a secure Kubernetes cluster
* [kubeadm upgrade apply](kubeadm_upgrade_apply.md)	 - Upgrade your Kubernetes cluster to the specified version
* [kubeadm upgrade diff](kubeadm_upgrade_diff.md)	 - Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
* [kubeadm upgrade node](kubeadm_upgrade_node.md)	 - Upgrade commands for a node in the cluster
* [kubeadm upgrade plan](kubeadm_upgrade_plan.md)	 - Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter

