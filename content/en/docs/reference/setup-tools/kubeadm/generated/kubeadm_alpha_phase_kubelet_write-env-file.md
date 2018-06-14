
Writes an environment file with runtime flags for the kubelet.

### Synopsis


Writes an environment file with flags that should be passed to the kubelet executing on the master or node. This --config flag can either consume a MasterConfiguration object or a NodeConfiguration one, as this function is used for both "kubeadm init" and "kubeadm join". 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet write-env-file [flags]
```

### Examples

```
  # Writes a dynamic environment file with kubelet flags from a MasterConfiguration file.
  kubeadm alpha phase kubelet write-env-file --config masterconfig.yaml
  
  # Writes a dynamic environment file with kubelet flags from a NodeConfiguration file.
  kubeadm alpha phase kubelet write-env-file --config nodeConfig.yaml
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for write-env-file</td>
    </tr>

  </tbody>
</table>



