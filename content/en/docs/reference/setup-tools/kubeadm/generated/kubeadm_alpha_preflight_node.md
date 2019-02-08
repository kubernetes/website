
Run node pre-flight checks

### Synopsis


Run node pre-flight checks, functionally equivalent to what implemented by kubeadm join. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha preflight node [flags]
```

### Examples

```
  # Run node pre-flight checks.
  kubeadm alpha preflight node
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for node</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
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
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



