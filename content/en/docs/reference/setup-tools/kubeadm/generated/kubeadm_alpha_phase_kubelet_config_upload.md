
Uploads kubelet configuration to a ConfigMap based on a kubeadm MasterConfiguration file.

### Synopsis


Uploads kubelet configuration extracted from the kubeadm MasterConfiguration object to a ConfigMap of the form kubelet-config-1.X in the cluster, where X is the minor version of the current (API Server) Kubernetes version. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config upload [flags]
```

### Examples

```
  # Uploads the kubelet configuration from the kubeadm Config file to a ConfigMap in the cluster.
  kubeadm alpha phase kubelet config upload --config kubeadm.yaml
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for upload</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



