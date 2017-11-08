
Create the in-cluster configuration file for the first time from using flags.

### Synopsis



Using from-flags, you can upload configuration to the ConfigMap in the cluster using the same flags you'd give to kubeadm init.
If you initialized your cluster using a v1.7.x or lower kubeadm client and set some flag; you need to run this command with the
same flags before upgrading to v1.8 using 'kubeadm upgrade'.

The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.


```
kubeadm config upload from-flags
```

### Options

```
      --apiserver-advertise-address string      The IP address the API Server will advertise it's listening on. 0.0.0.0 means the default network interface's address.
      --apiserver-bind-port int32               Port for the API Server to bind to.
      --apiserver-cert-extra-sans stringSlice   Optional extra altnames to use for the API Server serving cert. Can be both IP addresses and dns names.
      --cert-dir string                         The path where to save and store the certificates.
      --feature-gates string                    A set of key=value pairs that describe feature gates for various features. Options are:
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --kubernetes-version string               Choose a specific Kubernetes version for the control plane.
      --node-name string                        Specify the node name.
      --pod-network-cidr string                 Specify range of IP addresses for the pod network; if set, the control plane will automatically allocate CIDRs for every node.
      --service-cidr string                     Use alternative range of IP address for service VIPs.
      --service-dns-domain string               Use alternative domain for services, e.g. "myorg.internal".
      --token string                            The token to use for establishing bidirectional trust between nodes and masters.
      --token-ttl duration                      The duration before the bootstrap token is automatically deleted. 0 means 'never expires'.
```

### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use for talking to the cluster. (default "/etc/kubernetes/admin.conf")
```

