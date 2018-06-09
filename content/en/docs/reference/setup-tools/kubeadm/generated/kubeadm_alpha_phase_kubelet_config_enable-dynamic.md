
EXPERIMENTAL: Enables or updates dynamic kubelet configuration for a Node

### Synopsis

Enables or updates dynamic kubelet configuration for a Node, against the kubelet-config-1.X ConfigMap in the cluster, where X is the minor version of the desired kubelet version. 

WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it may have surprising side-effects at this stage. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config enable-dynamic [flags]
```

### Examples

```
  # Enables dynamic kubelet configuration for a Node.
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version v1.11.0
  
  WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it
  may have surprising side-effects at this stage.
```

### Options

```
  -h, --help                     help for enable-dynamic
      --kubeconfig string        The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
      --kubelet-version string   The desired version for the kubelet
      --node-name string         Name of the node that should enable the dynamic kubelet configuration
```

