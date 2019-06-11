
Mark a node as a control-plane

### Synopsis

Mark a node as a control-plane

```
kubeadm init phase mark-control-plane [flags]
```

### Examples

```
  # Applies control-plane label and taint to the current node, functionally equivalent to what executed by kubeadm init.
  kubeadm init phase mark-control-plane --config config.yml
  
  # Applies control-plane label and taint to a specific node
  kubeadm init phase mark-control-plane --node-name myNode
```

### Options

```
      --config string      Path to a kubeadm configuration file.
  -h, --help               help for mark-control-plane
      --node-name string   Specify the node name.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

