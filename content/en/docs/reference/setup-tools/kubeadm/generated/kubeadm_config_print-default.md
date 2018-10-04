
Print the default values for a kubeadm configuration object.

### Synopsis



This command prints the default InitConfiguration object that is used for 'kubeadm init' and 'kubeadm upgrade',
and the default JoinConfiguration object that is used for 'kubeadm join'.

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list for API objects to print the default values for. Available values: [InitConfiguration ClusterConfiguration JoinConfiguration KubeProxyConfiguration KubeletConfiguration MasterConfiguration]. This flag unset means 'print all known objects'</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



