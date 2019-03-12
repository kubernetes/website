
Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap

### Synopsis

Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap

```
kubeadm join phase control-plane-join update-status [flags]
```

### Options

```
      --apiserver-advertise-address string   If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --config string                        Path to kubeadm config file.
      --experimental-control-plane           Create a new control plane instance on this node
  -h, --help                                 help for update-status
      --node-name string                     Specify the node name.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

