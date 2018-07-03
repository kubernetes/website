
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.

### Synopsis


Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. kubeadm uses the --kubelet-version parameter to determine what the desired kubelet version is. Give

```
kubeadm upgrade node config [flags]
```

### Examples

```
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
  kubeadm upgrade node config --kubelet-version v1.11.0
  
  # Simulates the downloading of the kubelet configuration from the ConfigMap in the cluster with a specific desired
  # version. Does not change any state locally on the node.
  kubeadm upgrade node config --kubelet-version v1.11.0 --dry-run
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Do not change any state, just output the actions that would be performed.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for config</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/kubelet.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The *desired* version for the kubelet after the upgrade.</td>
    </tr>

  </tbody>
</table>



