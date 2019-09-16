
Generate the certificate for etcd nodes to communicate with each other

### Synopsis

Generate the certificate for etcd nodes to communicate with each other, and save them into etcd/peer.cert and etcd/peer.key files.

Default SANs are localhost, 127.0.0.1, 127.0.0.1, ::1 

If both files already exist, kubeadm skips the generation step and existing files will be used. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm init phase certs etcd-peer [flags]
```

### Options

```
      --cert-dir string   The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --config string     Path to a kubeadm configuration file.
      --csr-dir string    The path to output the CSRs and private keys to
      --csr-only          Create CSRs instead of generating certificates
  -h, --help              help for etcd-peer
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

