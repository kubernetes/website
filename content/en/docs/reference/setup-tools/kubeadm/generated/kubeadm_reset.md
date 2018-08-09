
Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

### Synopsis


Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

```
kubeadm reset [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the directory where the certificates are stored. If specified, clean this directory.</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the CRI socket to use with crictl when cleaning up containers.</td>
    </tr>

    <tr>
      <td colspan="2">--force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Reset the node without prompting for confirmation.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for reset</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

  </tbody>
</table>



