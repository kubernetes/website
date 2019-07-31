
Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes

### Synopsis

Generate the kubeconfig file for the kubelet to use and save it to kubelet.conf file. 

Please note that this should only be used for cluster bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API.

```
kubeadm init phase kubeconfig kubelet [flags]
```

### Options

```
      --apiserver-advertise-address string   The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32            Port for the API Server to bind to. (default 6443)
      --cert-dir string                      The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --config string                        Path to a kubeadm configuration file.
  -h, --help                                 help for kubelet
      --kubeconfig-dir string                The path where to save the kubeconfig file. (default "/etc/kubernetes")
      --node-name string                     Specify the node name.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

