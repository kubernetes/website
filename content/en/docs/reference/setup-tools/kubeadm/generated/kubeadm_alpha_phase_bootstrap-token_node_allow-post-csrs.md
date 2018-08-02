
Configures RBAC to allow node bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials

### Synopsis


Configures RBAC rules to allow node bootstrap tokens to post a certificate signing request, thus enabling nodes joining the cluster to request long term certificate credentials. 

See online documentation about TLS bootstrapping for more details. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase bootstrap-token node allow-post-csrs [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for allow-post-csrs</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



