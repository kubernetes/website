
Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized

### Synopsis

Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized

```
kubeadm config images list [flags]
```

### Options

```
      --config string               Path to kubeadm config file.
      --feature-gates string        A set of key=value pairs that describe feature gates for various features. No feature gates are available in this release.
  -h, --help                        help for list
      --image-repository string     Choose a container registry to pull control plane images from (default "k8s.gcr.io")
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane. (default "stable-1")
```

### Options inherited from parent commands

```
      --kubeconfig string   The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --rootfs string       [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

