
Upload certificates to kubeadm-certs

### Synopsis


This command is not meant to be run on its own. See list of available subcommands.

```
kubeadm init phase upload-certs [flags]
```

### Options

```
      --certificate-key string       Key used to encrypt the control-plane certificates in the kubeadm-certs Secret.
      --config string                Path to a kubeadm configuration file.
  -h, --help                         help for upload-certs
      --skip-certificate-key-print   Don't print the key used to encrypt the control-plane certificates.
      --upload-certs                 Upload control-plane certificates to the kubeadm-certs Secret.
```

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



