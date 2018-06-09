
Generates a self-signed kubernetes CA to provision identities for components of the cluster

### Synopsis

Generates the self-signed kubernetes certificate authority and related key, and saves them into ca.crt and ca.key files. 

If both files already exist, kubeadm skips the generation step and existing files will be used. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase certs ca [flags]
```

### Options

```
      --cert-dir string   The path where to save the certificates (default "/etc/kubernetes/pki")
      --config string     Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help              help for ca
```

    <tr>
      <td></td><td style="line-height: 130%">The path where to save the certificates</td>
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
      <td></td><td style="line-height: 130%">help for ca</td>
    </tr>

  </tbody>
</table>



