
Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

### Synopsis

Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

```
kubeadm reset [flags]
```

### Options

```
      --cert-dir string                   The path to the directory where the certificates are stored. If specified, clean this directory. (default "/etc/kubernetes/pki")
      --cri-socket string                 The path to the CRI socket to use with crictl when cleaning up containers. (default "/var/run/dockershim.sock")
      --force                             Reset the node without prompting for confirmation.
  -h, --help                              help for reset
      --ignore-preflight-errors strings   A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
```

aning up containers.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for reset</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

  </tbody>
</table>



