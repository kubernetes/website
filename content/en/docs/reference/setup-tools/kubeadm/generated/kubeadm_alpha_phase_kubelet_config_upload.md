
Uploads kubelet configuration to a ConfigMap based on a kubeadm MasterConfiguration file.

### Synopsis

Uploads kubelet configuration extracted from the kubeadm MasterConfiguration object to a ConfigMap of the form kubelet-config-1.X in the cluster, where X is the minor version of the current (API Server) Kubernetes version. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config upload [flags]
```

### Examples

```
  # Uploads the kubelet configuration from the kubeadm Config file to a ConfigMap in the cluster.
  kubeadm alpha phase kubelet config upload --config kubeadm.yaml
```

### Options

```
      --config string       Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help                help for upload
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
```

