
Writes kubelet settings, certificates and (re)starts the kubelet

### Synopsis

Writes a file with KubeletConfiguration and an environment file with node specific kubelet settings, and then (re)starts kubelet.

```
kubeadm join phase kubelet-start [api-server-endpoint] [flags]
```

### Options

```
      --config string                                 Path to kubeadm config file.
      --cri-socket string                             Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
      --discovery-file string                         For file-based discovery, a file or URL from which to load cluster information.
      --discovery-token string                        For token-based discovery, the token used to validate cluster information fetched from the API server.
      --discovery-token-ca-cert-hash strings          For token-based discovery, validate that the root CA public key matches this hash (format: "<type>:<value>").
      --discovery-token-unsafe-skip-ca-verification   For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
  -h, --help                                          help for kubelet-start
      --node-name string                              Specify the node name.
      --tls-bootstrap-token string                    Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
      --token string                                  Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

