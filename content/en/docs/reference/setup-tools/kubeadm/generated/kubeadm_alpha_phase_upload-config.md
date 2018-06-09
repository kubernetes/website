
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

```
      --config string       Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help                help for upload-config
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```

a configuration file is experimental!</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for upload-config</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



