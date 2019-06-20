
Download the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet

### Synopsis

Download the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. Either kubeadm autodetects the kubelet version by exec-ing "kubelet --version" or respects the --kubelet-version parameter. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha kubelet config download [flags]
```

### Examples

```
  # Download the kubelet configuration from the ConfigMap in the cluster. Autodetect the kubelet version.
  kubeadm alpha phase kubelet config download
  
  # Download the kubelet configuration from the ConfigMap in the cluster. Use a specific desired kubelet version.
  kubeadm alpha phase kubelet config download --kubelet-version 1.14.0
```

### Options

```
  -h, --help                     help for download
      --kubeconfig string        The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --kubelet-version string   The desired version for the kubelet. Defaults to being autodetected from 'kubelet --version'.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

