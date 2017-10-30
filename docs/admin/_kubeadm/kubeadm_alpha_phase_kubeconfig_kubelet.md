
Generate a kubeconfig file for the Kubelet to use. Please note that this should *only* be used for bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API.

### Synopsis


Generate a kubeconfig file for the Kubelet to use. Please note that this should *only* be used for bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API.

```
kubeadm alpha phase kubeconfig kubelet
```

### Options

```
      --apiserver-advertise-address string   The IP address or DNS name the API Server is accessible on.
      --apiserver-bind-port int32            The port the API Server is accessible on.
      --cert-dir string                      The path where certificates are stored.
      --config string                        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --node-name string                     The node name that the kubelet client cert should use.
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
