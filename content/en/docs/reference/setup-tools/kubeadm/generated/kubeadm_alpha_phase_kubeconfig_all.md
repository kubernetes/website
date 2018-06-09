
Generates all kubeconfig files necessary to establish the control plane and the admin kubeconfig file

### Synopsis

Generates all kubeconfig files necessary to establish the control plane and the admin kubeconfig file. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubeconfig all [flags]
```

### Examples

```
  # Generates all kubeconfig files, functionally equivalent to what generated
  # by kubeadm init.
  kubeadm alpha phase kubeconfig all
  
  # Generates all kubeconfig files using options read from a configuration file.
  kubeadm alpha phase kubeconfig all --config masterconfiguration.yaml
```

### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                        Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help                                 help for all
      --kubeconfig-dir string                The path where to save the kubeconfig file (default "/etc/kubernetes")
      --node-name string                     The node name that should be used for the kubelet client certificate
```

">The path where certificates are stored</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for all</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port where to save the kubeconfig file</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The node name that should be used for the kubelet client certificate</td>
    </tr>

  </tbody>
</table>



