
Generate and print a bootstrap token, but do not create it on the server.

### Synopsis



This command will print out a randomly-generated bootstrap token that can be used with
the "init" and "join" commands.

You don't have to use this command in order to generate a token. You can do so
yourself as long as it is in the format "[a-z0-9]{6}.[a-z0-9]{16}". This
command is provided for convenience to generate tokens in the given format.

You can also use "kubeadm init" without specifying a token and it will
generate and print one for you.


```
kubeadm token generate [flags]
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for generate</td>
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



