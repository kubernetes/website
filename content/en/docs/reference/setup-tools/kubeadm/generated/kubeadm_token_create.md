
Create bootstrap tokens on the server.

### Synopsis


This command will create a bootstrap token for you.
You can specify the usages for this token, the "time to live" and an optional human friendly description.

The [token] is the actual token to write.
This should be a securely generated random token of the form "[a-z0-9]{6}.[a-z0-9]{16}".
If no [token] is given, kubeadm will generate a random token instead.


```
kubeadm token create [token]
```

### Options

```
      --config string        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --description string   A human friendly description of how this token is used.
      --groups strings       Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z" (default [system:bootstrappers:kubeadm:default-node-token])
  -h, --help                 help for create
      --print-join-command   Instead of printing only the token, print the full 'kubeadm join' flag needed to join the cluster using the token.
      --token-ttl duration   The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire (default 24h0m0s)
      --usages strings       Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication] (default [signing,authentication])
```

### Options inherited from parent commands

```
      --dry-run             Whether to enable dry-run mode or not
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. If the flag is not set a set of standard locations are searched for an existing KubeConfig file (default "/etc/kubernetes/admin.conf")
```

bsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire.</td>
    </tr>

    <tr>
      <td colspan="2">--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication].</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

<table style="width: 100%;">
  <colgroup>
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



