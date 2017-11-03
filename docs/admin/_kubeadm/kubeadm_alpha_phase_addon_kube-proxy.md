
Install the kube-proxy addon to a Kubernetes cluster.

### Synopsis


Install the kube-proxy addon to a Kubernetes cluster.

```
kubeadm alpha phase addon kube-proxy
```

### Options

```
      --apiserver-advertise-address string   The IP address the API Server will advertise it's listening on. 0.0.0.0 means the default network interface's address.
      --apiserver-bind-port int32            Port for the API Server to bind to.
      --config string                        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --image-repository string              Choose a container registry to pull control plane images from.
      --kubeconfig string                    The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --kubernetes-version string            Choose a specific Kubernetes version for the control plane.
      --pod-network-cidr string              Specify range of IP addresses for the pod network; if set, the control plane will automatically allocate CIDRs for every node.
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
