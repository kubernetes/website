
Installs all addons to a Kubernetes cluster

### Synopsis

Installs the CoreDNS and the kube-proxys addons components via the API server. Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase addon all [flags]
```

### Examples

```
  # Installs the CoreDNS and the kube-proxys addons components via the API server,
  # functionally equivalent to what installed by kubeadm init.
  
  kubeadm alpha phase selfhosting from-staticpods
```

### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --config string                        Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental
      --feature-gates string                 A set of key=value pairs that describe feature gates for various features.Options are:
                                             Auditing=true|false (ALPHA - default=false)
                                             CoreDNS=true|false (default=true)
                                             DynamicKubeletConfig=true|false (ALPHA - default=false)
                                             SelfHosting=true|false (ALPHA - default=false)
                                             StoreCertsInSecrets=true|false (ALPHA - default=false)
  -h, --help                                 help for all
      --image-repository string              Choose a container registry to pull control plane images from (default "k8s.gcr.io")
      --kubeconfig string                    The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
      --kubernetes-version string            Choose a specific Kubernetes version for the control plane (default "stable-1.10")
      --pod-network-cidr string              The range of IP addresses used for the Pod network
      --service-cidr string                  The range of IP address used for service VIPs (default "10.96.0.0/12")
      --service-dns-domain string            Alternative domain for services (default "cluster.local")
```

colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster</td>
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

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The range of IP address used for service VIPs</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Alternative domain for services</td>
    </tr>

  </tbody>
</table>



