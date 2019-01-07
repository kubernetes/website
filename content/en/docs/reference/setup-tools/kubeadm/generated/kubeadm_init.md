
Run this command in order to set up the Kubernetes control plane.

### Synopsis

The `init` command executes the following phases:
```
preflight                  Run master pre-flight checks
kubelet-start              Writes kubelet settings and (re)starts the kubelet
certs                      Certificate generation
  /ca                        Generates the self-signed Kubernetes CA to provision identities for other Kubernetes components
  /apiserver                 Generates the certificate for serving the Kubernetes API
  /apiserver-kubelet-client  Generates the Client certificate for the API server to connect to kubelet
  /front-proxy-ca            Generates the self-signed CA to provision identities for front proxy
  /front-proxy-client        Generates the client for the front proxy
  /etcd-ca                   Generates the self-signed CA to provision identities for etcd
  /etcd-server               Generates the certificate for serving etcd
  /etcd-peer                 Generates the credentials for etcd nodes to communicate with each other
  /etcd-healthcheck-client   Generates the client certificate for liveness probes to healtcheck etcd
  /apiserver-etcd-client     Generates the client apiserver uses to access etcd
  /sa                        Generates a private key for signing service account tokens along with its public key
kubeconfig                 Generates all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
  /admin                     Generates a kubeconfig file for the admin to use and for kubeadm itself
  /kubelet                   Generates a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
  /controller-manager        Generates a kubeconfig file for the controller manager to use
  /scheduler                 Generates a kubeconfig file for the scheduler to use
control-plane              Generates all static Pod manifest files necessary to establish the control plane
  /apiserver                 Generates the kube-apiserver static Pod manifest
  /controller-manager        Generates the kube-controller-manager static Pod manifest
  /scheduler                 Generates the kube-scheduler static Pod manifest
etcd                       Generates static Pod manifest file for local etcd.
  /local                     Generates the static Pod manifest file for a local, single-node local etcd instance.
upload-config              Uploads the kubeadm and kubelet configuration to a ConfigMap
  /kubeadm                   Uploads the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet                   Uploads the kubelet component config to a ConfigMap
mark-control-plane         Mark a node as a control-plane
bootstrap-token            Generates bootstrap tokens used to join a node to a cluster
addon                      Installs required addons for passing Conformance tests
  /coredns                   Installs the CoreDNS addon to a Kubernetes cluster
  /kube-proxy                Installs the kube-proxy addon to a Kubernetes cluster
```


```
kubeadm init [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental.</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the CRI socket to connect to.</td>
    </tr>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Don't apply any changes; just output what would be done.</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/></td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for init</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

    <tr>
      <td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a container registry to pull control plane images from</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane.</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative range of IP address for service VIPs.</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative domain for services, e.g. "myorg.internal".</td>
    </tr>

    <tr>
      <td colspan="2">--skip-phases stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">List of phases to be skipped</td>
    </tr>

    <tr>
      <td colspan="2">--skip-token-print</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Skip printing of the default bootstrap token generated by 'kubeadm init'.</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The token to use for establishing bidirectional trust between nodes and masters. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef</td>
    </tr>

    <tr>
      <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



