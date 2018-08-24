
Generates a kubeconfig file for the kubelet to use. Please note that this should be used *only* for bootstrapping purposes

### Synopsis


Generates the kubeconfig file for the kubelet to use and saves it to /etc/kubernetes/kubelet.conf file. 

Please note that this should only be used for bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubeconfig kubelet [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where certificates are stored</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubelet</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The node name that should be used for the kubelet client certificate</td>
    </tr>

  </tbody>
</table>



