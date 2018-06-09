
Generates a kubeconfig file for the kubelet to use. Please note that this should be used *only* for bootstrapping purposes

### Synopsis

Generates the kubeconfig file for the kubelet to use and saves it to /etc/kubernetes/kubelet.conf file. 

Please note that this should only be used for bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubeconfig kubelet [flags]
```

### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                        Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help                                 help for kubelet
      --kubeconfig-dir string                The path where to save the kubeconfig file (default "/etc/kubernetes")
      --node-name string                     The node name that should be used for the kubelet client certificate
```

he path where certificates are stored</td>
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
      <td></td><td style="line-height: 130%">help for kubelet</td>
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



