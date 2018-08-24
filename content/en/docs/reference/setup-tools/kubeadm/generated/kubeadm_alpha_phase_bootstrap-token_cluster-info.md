
Uploads the cluster-info ConfigMap from the given kubeconfig file

### Synopsis


Uploads the "cluster-info" ConfigMap in the "kube-public" namespace, populating it with cluster information extracted from the given kubeconfig file. The ConfigMap is used for the node bootstrap process in its initial phases, before the client trusts the API server. 

See online documentation about Authenticating with Bootstrap Tokens for more details. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase bootstrap-token cluster-info [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for cluster-info</td>
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



