
View the kubeadm configuration stored inside the cluster

### Synopsis



Using this command, you can view the ConfigMap in the cluster where the configuration for kubeadm is located

The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap


```
kubeadm config view
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kubeconfig string                        The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --version version[=true]                   Print version information and quit
```

