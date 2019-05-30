
Install the CoreDNS addon to a Kubernetes cluster

### Synopsis

Install the CoreDNS addon components via the API server. Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

```
kubeadm init phase addon coredns [flags]
```

### Options

```
      --config string               Path to a kubeadm configuration file.
      --feature-gates string        A set of key=value pairs that describe feature gates for various features. No feature gates are available in this release.
  -h, --help                        help for coredns
      --image-repository string     Choose a container registry to pull control plane images from (default "k8s.gcr.io")
      --kubeconfig string           The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane. (default "stable-1")
      --service-cidr string         Use alternative range of IP address for service VIPs. (default "10.96.0.0/12")
      --service-dns-domain string   Use alternative domain for services, e.g. "myorg.internal". (default "cluster.local")
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

