
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
      --experimental-upload-certs    Upload control-plane certificates to the kubeadm-certs Secret.
  -h, --help                         help for upload-certs
      --skip-certificate-key-print   Don't print the key used to encrypt the control-plane certificates.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

