
Uploads the currently used configuration for kubeadm to a ConfigMap

### Synopsis


Uploads the kubeadm init configuration of your cluster to a ConfigMap called kubeadm-config in the kube-system namespace. This enables correct configuration of system components and a seamless user experience when upgrading. 

Alternatively, you can use kubeadm config. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase upload-config [flags]
```

### Examples

```
  # uploads the configuration of your cluster
  kubeadm alpha phase upload-config --config=myConfig.yaml
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for upload-config</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



