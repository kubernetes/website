
Outputs a kubeconfig file for an additional user

### Synopsis


Outputs a kubeconfig file for an additional user. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubeconfig user [flags]
```

### Examples

```
  # Outputs a kubeconfig file for an additional user named foo
  kubeadm alpha phase kubeconfig user --client-name=foo
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The path where certificates are stored</td>
    </tr>

    <tr>
      <td colspan="2">--client-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The name of user. It will be used as the CN if client certificates are created</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for user</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port where to save the kubeconfig file</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The token that should be used as the authentication mechanism for this kubeconfig (instead of client certificates)</td>
    </tr>

  </tbody>
</table>



