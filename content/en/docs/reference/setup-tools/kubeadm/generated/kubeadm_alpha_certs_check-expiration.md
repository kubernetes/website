
Check certificates expiration for a Kubernetes cluster

### Synopsis

Checks expiration for the certificates in the local PKI managed by kubeadm.

```
kubeadm alpha certs check-expiration [flags]
```

### Options

```
      --cert-dir string   The path where to save the certificates (default "/etc/kubernetes/pki")
      --config string     Path to a kubeadm configuration file.
  -h, --help              help for check-expiration
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

