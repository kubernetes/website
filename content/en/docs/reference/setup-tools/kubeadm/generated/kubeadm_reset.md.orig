
Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'

### Synopsis

Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'

The "reset" command executes the following phases:
```
preflight              Run reset pre-flight checks
update-cluster-status  Remove this node from the ClusterStatus object.
remove-etcd-member     Remove a local etcd member.
cleanup-node           Run cleanup node.
```


```
kubeadm reset [flags]
```

### Options

```
      --cert-dir string                   The path to the directory where the certificates are stored. If specified, clean this directory. (default "/etc/kubernetes/pki")
      --cri-socket string                 Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
  -f, --force                             Reset the node without prompting for confirmation.
  -h, --help                              help for reset
      --ignore-preflight-errors strings   A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --kubeconfig string                 The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --skip-phases strings               List of phases to be skipped
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

