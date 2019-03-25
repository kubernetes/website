
Generates the manifests for the new control plane components

### Synopsis

Generates the manifests for the new control plane components

```
kubeadm join phase control-plane-prepare control-plane [flags]
```

### Options

```
      --apiserver-advertise-address string   If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32            If the node should host a new control plane instance, the port for the API Server to bind to. (default 6443)
      --config string                        Path to kubeadm config file.
      --experimental-control-plane           Create a new control plane instance on this node
  -h, --help                                 help for control-plane
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

