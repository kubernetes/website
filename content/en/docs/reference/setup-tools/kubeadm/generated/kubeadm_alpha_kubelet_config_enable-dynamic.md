
EXPERIMENTAL: Enable or update dynamic kubelet configuration for a Node

### Synopsis

Enable or update dynamic kubelet configuration for a Node, against the kubelet-config-1.X ConfigMap in the cluster, where X is the minor version of the desired kubelet version. 

WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it may have surprising side-effects at this stage. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha kubelet config enable-dynamic [flags]
```

### Examples

```
  # Enable dynamic kubelet configuration for a Node.
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version 1.14.0
  
  WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it
  may have surprising side-effects at this stage.
```

### Options

```
  -h, --help                     help for enable-dynamic
      --kubeconfig string        The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --kubelet-version string   The desired version for the kubelet
      --node-name string         Name of the node that should enable the dynamic kubelet configuration
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

