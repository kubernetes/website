
Writes kubelet configuration to disk, either based on the --config argument.

### Synopsis


Writes kubelet configuration to disk, based on the kubeadm configuration passed via "--config". 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config write-to-disk [flags]
```

### Examples

```
  # Extracts the kubelet configuration from a kubeadm configuration file
  kubeadm alpha phase kubelet config write-to-disk --config kubeadm.yaml
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for write-to-disk</td>
    </tr>

  </tbody>
</table>



