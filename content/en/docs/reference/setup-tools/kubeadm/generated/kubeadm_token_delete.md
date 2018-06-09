
Delete bootstrap tokens on the server.

### Synopsis


This command will delete a given bootstrap token for you.

The [token-value] is the full Token of the form "[a-z0-9]{6}.[a-z0-9]{16}" or the
Token ID of the form "[a-z0-9]{6}" to delete.


```
kubeadm token delete [token-value]
```

### Options

```
  -h, --help   help for delete
```

### Options inherited from parent commands

```
      --dry-run             Whether to enable dry-run mode or not
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. If the flag is not set a set of standard locations are searched for an existing KubeConfig file (default "/etc/kubernetes/admin.conf")
```

oup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Whether to enable dry-run mode or not</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



