
Run cleanup node.

### Synopsis

Run cleanup node.

```
kubeadm reset phase cleanup-node [flags]
```

### Options

```
      --cert-dir string     The path to the directory where the certificates are stored. If specified, clean this directory. (default "/etc/kubernetes/pki")
      --cri-socket string   Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
  -h, --help                help for cleanup-node
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

