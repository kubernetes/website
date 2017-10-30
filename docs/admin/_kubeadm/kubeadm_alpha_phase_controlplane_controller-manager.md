
Generate controller-manager static pod manifest.

### Synopsis


Generate controller-manager static pod manifest.

```
kubeadm alpha phase controlplane controller-manager
```

### Options

```
      --cert-dir string             The path where certificates are stored.
      --config string               Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane.
      --pod-network-cidr string     The range of IP addresses used for the pod network.
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
