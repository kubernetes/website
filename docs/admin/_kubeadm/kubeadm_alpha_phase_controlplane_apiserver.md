
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

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
