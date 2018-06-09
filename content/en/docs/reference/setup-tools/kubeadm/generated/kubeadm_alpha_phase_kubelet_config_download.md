
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.

### Synopsis

Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. Either kubeadm autodetects the kubelet version by exec-ing "kubelet --version" or respects the --kubelet-version parameter. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config download [flags]
```

### Examples

```
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Autodetects the kubelet version.
  kubeadm alpha phase kubelet config download
  
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
  kubeadm alpha phase kubelet config download --kubelet-version v1.11.0
```

### Options

```
  -h, --help                     help for download
      --kubeconfig string        The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/kubelet.conf")
      --kubelet-version string   The desired version for the kubelet. Defaults to being autodetected from 'kubelet --version'.
```

