
Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file.

### Synopsis


Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file.

```
kubeadm alpha phase kubeconfig all
```

### Options

```
      --apiserver-advertise-address string   The IP address or DNS name the API Server is accessible on.
      --apiserver-bind-port int32            The port the API Server is accessible on.
      --cert-dir string                      The path where certificates are stored.
      --config string                        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --node-name string                     The node name that the kubelet client cert should use.
```

