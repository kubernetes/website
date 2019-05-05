
Joins a machine as a control plane instance

### Synopsis

Joins a machine as a control plane instance

```
kubeadm join phase control-plane-join all [flags]
```

### Options

```
      --apiserver-advertise-address string   If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --config string                        Path to kubeadm config file.
      --experimental-control-plane           Create a new control plane instance on this node
  -h, --help                                 help for all
      --node-name string                     Specify the node name.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

