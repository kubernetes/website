
Create the in-cluster configuration file for the first time from using flags.

### Synopsis



Using this command, you can upload configuration to the ConfigMap in the cluster using the same flags you gave to 'kubeadm init'.
If you initialized your cluster using a v1.7.x or lower kubeadm client and set certain flags, you need to run this command with the
same flags before upgrading to v1.8 using 'kubeadm upgrade'.

The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.


```
kubeadm config upload from-flags [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/></td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for from-flags</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane.</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative range of IP address for service VIPs.</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative domain for services, e.g. "myorg.internal".</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



