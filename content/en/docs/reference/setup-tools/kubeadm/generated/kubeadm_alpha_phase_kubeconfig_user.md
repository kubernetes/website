
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

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --client-name string                   The name of user. It will be used as the CN if client certificates are created
  -h, --help                                 help for user
      --kubeconfig-dir string                The path where to save the kubeconfig file (default "/etc/kubernetes")
      --org strings                          The orgnizations of the client certificate. It will be used as the O if client certificates are created
      --token string                         The token that should be used as the authentication mechanism for this kubeconfig, instead of client certificates
```

user. It will be used as the CN if client certificates are created</td>
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



