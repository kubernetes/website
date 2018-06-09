
Creates a bootstrap token to be used for node joining

### Synopsis

Creates a bootstrap token. If no token value is given, kubeadm will generate a random token instead. 

Alternatively, you can use kubeadm token. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase bootstrap-token create [flags]
```

### Options

```
      --config string        Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
      --description string   A human friendly description of how this token is used.
      --groups strings       Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z" (default [system:bootstrappers:kubeadm:default-node-token])
  -h, --help                 help for create
      --skip-token-print     Skip printing of the bootstrap token
      --token string         The token to use for establishing bidirectional trust between nodes and masters. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef
      --token-ttl duration   The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire (default 24h0m0s)
      --usages strings       Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication] (default [signing,authentication])
```

### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```

/tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The token to use for establishing bidirectional trust between nodes and masters</td>
    </tr>

    <tr>
      <td colspan="2">--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire</td>
    </tr>

    <tr>
      <td colspan="2">--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]</td>
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
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster</td>
    </tr>

  </tbody>
</table>



