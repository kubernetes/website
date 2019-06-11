
Generate the self-signed CA to provision identities for front proxy

### Synopsis

Generate the self-signed CA to provision identities for front proxy, and save them into front-proxy-ca.cert and front-proxy-ca.key files. 

If both files already exist, kubeadm skips the generation step and existing files will be used. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm init phase certs front-proxy-ca [flags]
```

### Options

```
      --cert-dir string   The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --config string     Path to a kubeadm configuration file.
  -h, --help              help for front-proxy-ca
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

