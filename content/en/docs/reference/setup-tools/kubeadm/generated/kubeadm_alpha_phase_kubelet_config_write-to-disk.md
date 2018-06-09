
Writes kubelet configuration to disk, either based on the --config argument.

### Synopsis

Writes kubelet configuration to disk, based on the kubeadm configuration passed via "--config". 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase kubelet config write-to-disk [flags]
```

### Examples

```
  # Extracts the kubelet configuration from a kubeadm configuration file
  kubeadm alpha phase kubelet config write-to-disk --config kubeadm.yaml
```

### Options

```
      --config string   Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help            help for write-to-disk
```

