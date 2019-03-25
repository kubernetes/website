
Prepares the machine for serving a control plane.

### Synopsis

Prepares the machine for serving a control plane.

```
kubeadm join phase control-plane-prepare all [api-server-endpoint] [flags]
```

### Options

```
      --apiserver-advertise-address string            If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32                     If the node should host a new control plane instance, the port for the API Server to bind to. (default 6443)
      --certificate-key string                        Use this key to decrypt the certificate secrets uploaded by init.
      --config string                                 Path to kubeadm config file.
      --discovery-file string                         For file-based discovery, a file or URL from which to load cluster information.
      --discovery-token string                        For token-based discovery, the token used to validate cluster information fetched from the API server.
      --discovery-token-ca-cert-hash strings          For token-based discovery, validate that the root CA public key matches this hash (format: "<type>:<value>").
      --discovery-token-unsafe-skip-ca-verification   For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
      --experimental-control-plane                    Create a new control plane instance on this node
  -h, --help                                          help for all
      --node-name string                              Specify the node name.
      --tls-bootstrap-token string                    Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
      --token string                                  Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

