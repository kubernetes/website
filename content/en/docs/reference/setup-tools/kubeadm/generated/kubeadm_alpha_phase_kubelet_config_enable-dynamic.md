
EXPERIMENTAL: Enables or updates dynamic kubelet configuration for a Node

### Synopsis


Enables or updates dynamic kubelet configuration for a Node, against the kubelet-config-1.X ConfigMap in the cluster, where X is the minor version of the desired kubelet version. 

WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it may have surprising side-effects at this stage. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config enable-dynamic [flags]
```

### Examples

```
  # Enables dynamic kubelet configuration for a Node.
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version v1.11.0
  
  WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it
  may have surprising side-effects at this stage.
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for enable-dynamic</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The desired version for the kubelet</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of the node that should enable the dynamic kubelet configuration</td>
    </tr>

  </tbody>
</table>



