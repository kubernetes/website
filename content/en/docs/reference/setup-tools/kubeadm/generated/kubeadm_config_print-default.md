
Print the default values for a kubeadm configuration object.

### Synopsis



This command prints the default MasterConfiguration object that is used for 'kubeadm init' and 'kubeadm upgrade',
and the default NodeConfiguration object that is used for 'kubeadm join'.

Note that sensitive values like the Bootstrap Token fields are replaced with silly values like {"abcdef.0123456789abcdef" "" "nil" <nil> [] []} in order to pass validation but
not perform the real computation for creating a token.


```
kubeadm config print-default [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--api-objects stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list for API objects to print the default values for. Available values: [MasterConfiguration NodeConfiguration]. This flag unset means 'print all known objects'</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for print-default</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster.</td>
    </tr>

  </tbody>
</table>



