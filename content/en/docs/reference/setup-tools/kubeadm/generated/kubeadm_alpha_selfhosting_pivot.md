
Converts a static Pod-hosted control plane into a self-hosted one

### Synopsis


Converts static Pod files for control plane components into self-hosted DaemonSets configured via the Kubernetes API. 

See the documentation for self-hosting limitations. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha selfhosting pivot [flags]
```

### Examples

```
  # Converts a static Pod-hosted control plane into a self-hosted one.
  
  kubeadm alpha phase self-hosting convert-from-staticpods
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Pivot the cluster without prompting for confirmation</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for pivot</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

    <tr>
      <td colspan="2">-s, --store-certs-in-secrets</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable storing certs in secrets</td>
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
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



