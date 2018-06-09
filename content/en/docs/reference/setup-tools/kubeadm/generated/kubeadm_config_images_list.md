
Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized.

### Synopsis

Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized.

```
kubeadm config images list [flags]
```

### Options

```
      --config string               Path to kubeadm config file.
      --feature-gates string        A set of key=value pairs that describe feature gates for various features. Options are:
                                    Auditing=true|false (ALPHA - default=false)
                                    CoreDNS=true|false (default=true)
                                    DynamicKubeletConfig=true|false (ALPHA - default=false)
                                    SelfHosting=true|false (ALPHA - default=false)
                                    StoreCertsInSecrets=true|false (ALPHA - default=false)
  -h, --help                        help for list
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane. (default "stable-1.10")
```

### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
```

