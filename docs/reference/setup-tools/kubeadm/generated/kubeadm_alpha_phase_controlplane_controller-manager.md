
Generates the controller-manager static Pod manifest.

### Synopsis

Generates the static Pod manifest file for the controller-manager and saves it into /etc/kubernetes/manifests/kube-controller-manager.yaml file. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase controlplane controller-manager [flags]
```

### Options

```
      --cert-dir string                                 The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                                   Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --controller-manager-extra-args mapStringString   A set of extra flags to pass to the Controller Manager or override default ones in form of <flagname>=<value>
  -h, --help                                            help for controller-manager
      --kubernetes-version string                       Choose a specific Kubernetes version for the control plane (default "stable-1.10")
      --pod-network-cidr string                         The range of IP addresses used for the Pod network
```

