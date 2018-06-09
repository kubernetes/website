
Writes an environment file with runtime flags for the kubelet.

### Synopsis

Writes an environment file with flags that should be passed to the kubelet executing on the master or node. This --config flag can either consume a MasterConfiguration object or a NodeConfiguration one, as this function is used for both "kubeadm init" and "kubeadm join". 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet write-env-file [flags]
```

### Examples

```
  # Writes a dynamic environment file with kubelet flags from a MasterConfiguration file.
  kubeadm alpha phase kubelet write-env-file --config masterconfig.yaml
  
  # Writes a dynamic environment file with kubelet flags from a NodeConfiguration file.
  kubeadm alpha phase kubelet write-env-file --config nodeConfig.yaml
```

### Options

```
      --config string   Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help            help for write-env-file
```

