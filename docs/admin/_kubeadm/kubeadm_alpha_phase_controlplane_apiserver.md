
Generate apiserver static pod manifest.

### Synopsis


Generate apiserver static pod manifest.

```
kubeadm alpha phase controlplane apiserver
```

### Options

```
      --apiserver-advertise-address string   The IP address or DNS name the API Server is accessible on.
      --apiserver-bind-port int32            The port the API Server is accessible on.
      --cert-dir string                      The path where certificates are stored.
      --config string                        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --kubernetes-version string            Choose a specific Kubernetes version for the control plane.
      --service-cidr string                  The range of IP address used for service VIPs.
```

