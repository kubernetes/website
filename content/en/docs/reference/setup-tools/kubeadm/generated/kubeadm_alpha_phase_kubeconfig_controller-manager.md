
Generates a kubeconfig file for the controller manager to use

### Synopsis

Generates the kubeconfig file for the controller manager to use and saves it to /etc/kubernetes/controller-manager.conf file. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubeconfig controller-manager [flags]
```

### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                        Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help                                 help for controller-manager
      --kubeconfig-dir string                The path where to save the kubeconfig file (default "/etc/kubernetes")
```

;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The path where certificates are stored</td>
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
      <td></td><td style="line-height: 130%">help for controller-manager</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port where to save the kubeconfig file</td>
    </tr>

  </tbody>
</table>



