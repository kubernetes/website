
Generates the scheduler static Pod manifest.

### Synopsis

Generates the static Pod manifest file for the scheduler and saves it into /etc/kubernetes/manifests/kube-scheduler.yaml file. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase controlplane scheduler [flags]
```

### Options

```
      --cert-dir string                        The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                          Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help                                   help for scheduler
      --kubernetes-version string              Choose a specific Kubernetes version for the control plane (default "stable-1.10")
      --scheduler-extra-args mapStringString   A set of extra flags to pass to the Scheduler or override default ones in form of <flagname>=<value>
```

