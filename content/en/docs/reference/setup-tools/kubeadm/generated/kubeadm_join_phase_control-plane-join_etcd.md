
Add a new local etcd member

### Synopsis

Add a new local etcd member

```
kubeadm join phase control-plane-join etcd [flags]
```

### Options

```
      --apiserver-advertise-address string   If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --config string                        Path to kubeadm config file.
      --experimental-control-plane           Create a new control plane instance on this node
  -h, --help                                 help for etcd
      --node-name string                     Specify the node name.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

