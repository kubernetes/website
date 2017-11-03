
Install the kube-dns addon to a Kubernetes cluster.

### Synopsis


Install the kube-dns addon to a Kubernetes cluster.

```
kubeadm alpha phase addon kube-dns
```

### Options

```
      --config string               Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --image-repository string     Choose a container registry to pull control plane images from.
      --kubeconfig string           The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane.
      --service-dns-domain string   Use alternative domain for services, e.g. "myorg.internal.
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
