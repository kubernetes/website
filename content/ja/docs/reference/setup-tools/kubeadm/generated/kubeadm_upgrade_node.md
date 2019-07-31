
Upgrade commands for a node in the cluster

### Synopsis

Upgrade commands for a node in the cluster

The "node" command executes the following phases:
```
control-plane   Upgrade the control plane instance deployed on this node, if any
kubelet-config  Upgrade the kubelet configuration for this node
```


```
kubeadm upgrade node [flags]
```

### Options

```
      --dry-run                  Do not change any state, just output the actions that would be performed.
  -h, --help                     help for node
      --kubeconfig string        The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --kubelet-version string   The *desired* version for the kubelet config after the upgrade. If not specified, the KubernetesVersion from the kubeadm-config ConfigMap will be used
      --skip-phases strings      List of phases to be skipped
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

