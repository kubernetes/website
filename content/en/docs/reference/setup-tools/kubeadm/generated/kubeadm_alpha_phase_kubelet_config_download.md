
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.

### Synopsis


Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. Either kubeadm autodetects the kubelet version by exec-ing "kubelet --version" or respects the --kubelet-version parameter. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config download [flags]
```

### Examples

```
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Autodetects the kubelet version.
  kubeadm alpha phase kubelet config download
  
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
  kubeadm alpha phase kubelet config download --kubelet-version v1.11.0
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for download</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/kubelet.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The desired version for the kubelet. Defaults to being autodetected from 'kubelet --version'.</td>
    </tr>

  </tbody>
</table>



