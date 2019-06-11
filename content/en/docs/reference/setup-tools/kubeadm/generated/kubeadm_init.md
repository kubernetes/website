
Run this command in order to set up the Kubernetes control plane

### Synopsis

Run this command in order to set up the Kubernetes control plane

The "init" command executes the following phases:
```
preflight                  Run pre-flight checks
kubelet-start              Write kubelet settings and (re)start the kubelet
certs                      Certificate generation
  /etcd-ca                   Generate the self-signed CA to provision identities for etcd
  /apiserver-etcd-client     Generate the certificate the apiserver uses to access etcd
  /etcd-healthcheck-client   Generate the certificate for liveness probes to healtcheck etcd
  /etcd-server               Generate the certificate for serving etcd
  /etcd-peer                 Generate the certificate for etcd nodes to communicate with each other
  /ca                        Generate the self-signed Kubernetes CA to provision identities for other Kubernetes components
  /apiserver                 Generate the certificate for serving the Kubernetes API
  /apiserver-kubelet-client  Generate the certificate for the API server to connect to kubelet
  /front-proxy-ca            Generate the self-signed CA to provision identities for front proxy
  /front-proxy-client        Generate the certificate for the front proxy client
  /sa                        Generate a private key for signing service account tokens along with its public key
kubeconfig                 Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
  /admin                     Generate a kubeconfig file for the admin to use and for kubeadm itself
  /kubelet                   Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
  /controller-manager        Generate a kubeconfig file for the controller manager to use
  /scheduler                 Generate a kubeconfig file for the scheduler to use
control-plane              Generate all static Pod manifest files necessary to establish the control plane
  /apiserver                 Generates the kube-apiserver static Pod manifest
  /controller-manager        Generates the kube-controller-manager static Pod manifest
  /scheduler                 Generates the kube-scheduler static Pod manifest
etcd                       Generate static Pod manifest file for local etcd
  /local                     Generate the static Pod manifest file for a local, single-node local etcd instance
upload-config              Upload the kubeadm and kubelet configuration to a ConfigMap
  /kubeadm                   Upload the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet                   Upload the kubelet component config to a ConfigMap
upload-certs               Upload certificates to kubeadm-certs
mark-control-plane         Mark a node as a control-plane
bootstrap-token            Generates bootstrap tokens used to join a node to a cluster
addon                      Install required addons for passing Conformance tests
  /coredns                   Install the CoreDNS addon to a Kubernetes cluster
  /kube-proxy                Install the kube-proxy addon to a Kubernetes cluster
```


```
kubeadm init [flags]
```

### Options

```
      --apiserver-advertise-address string   The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32            Port for the API Server to bind to. (default 6443)
      --apiserver-cert-extra-sans strings    Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
      --cert-dir string                      The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --certificate-key string               Key used to encrypt the control-plane certificates in the kubeadm-certs Secret.
      --config string                        Path to a kubeadm configuration file.
      --cri-socket string                    Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
      --dry-run                              Don't apply any changes; just output what would be done.
      --feature-gates string                 A set of key=value pairs that describe feature gates for various features. No feature gates are available in this release.
  -h, --help                                 help for init
      --ignore-preflight-errors strings      A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --image-repository string              Choose a container registry to pull control plane images from (default "k8s.gcr.io")
      --kubernetes-version string            Choose a specific Kubernetes version for the control plane. (default "stable-1")
      --node-name string                     Specify the node name.
      --pod-network-cidr string              Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
      --service-cidr string                  Use alternative range of IP address for service VIPs. (default "10.96.0.0/12")
      --service-dns-domain string            Use alternative domain for services, e.g. "myorg.internal". (default "cluster.local")
      --skip-certificate-key-print           Don't print the key used to encrypt the control-plane certificates.
      --skip-phases strings                  List of phases to be skipped
      --skip-token-print                     Skip printing of the default bootstrap token generated by 'kubeadm init'.
      --token string                         The token to use for establishing bidirectional trust between nodes and control-plane nodes. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef
      --token-ttl duration                   The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire (default 24h0m0s)
      --upload-certs                         Upload control-plane certificates to the kubeadm-certs Secret.
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

