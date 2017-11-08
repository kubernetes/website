
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

