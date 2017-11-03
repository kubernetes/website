
Upload the currently used configuration for kubeadm to a ConfigMap in the cluster for future use in reconfiguration and upgrades of the cluster.

### Synopsis


Upload the currently used configuration for kubeadm to a ConfigMap in the cluster for future use in reconfiguration and upgrades of the cluster.

```
kubeadm alpha phase upload-config
```

### Options

```
      --config string       Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --kubeconfig string   The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
