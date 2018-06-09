
Generates the controller-manager static Pod manifest

### Synopsis

Generates the static Pod manifest file for the controller-manager and saves it into /etc/kubernetes/manifests/kube-controller-manager.yaml file. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase controlplane controller-manager [flags]
```

### Options

```
      --cert-dir string                                 The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                                   Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
      --controller-manager-extra-args mapStringString   A set of extra flags to pass to the Controller Manager or override default ones in form of <flagname>=<value>
  -h, --help                                            help for controller-manager
      --kubernetes-version string                       Choose a specific Kubernetes version for the control plane (default "stable-1.10")
      --pod-network-cidr string                         The range of IP addresses used for the Pod network
```

ller Manager or override default ones in form of &lt;flagname&gt;=&lt;value&gt;</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for controller-manager</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1.10"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Choose a specific Kubernetes version for the control plane</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The range of IP addresses used for the Pod network</td>
    </tr>

  </tbody>
</table>



