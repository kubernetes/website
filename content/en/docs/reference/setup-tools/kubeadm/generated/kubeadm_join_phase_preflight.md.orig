
Run join pre-flight checks

### Synopsis


Run pre-flight checks for kubeadm join.

```
kubeadm join phase preflight [api-server-endpoint] [flags]
```

### Examples

```
  # Run join pre-flight checks using a config file.
  kubeadm join phase preflight --config kubeadm-config.yml
```

### Options

```
      --apiserver-advertise-address string            If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32                     If the node should host a new control plane instance, the port for the API Server to bind to. (default 6443)
      --certificate-key string                        Use this key to decrypt the certificate secrets uploaded by init.
      --config string                                 Path to kubeadm config file.
      --control-plane                                 Create a new control plane instance on this node
      --cri-socket string                             Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
      --discovery-file string                         For file-based discovery, a file or URL from which to load cluster information.
      --discovery-token string                        For token-based discovery, the token used to validate cluster information fetched from the API server.
      --discovery-token-ca-cert-hash strings          For token-based discovery, validate that the root CA public key matches this hash (format: "<type>:<value>").
      --discovery-token-unsafe-skip-ca-verification   For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
      --experimental-control-plane                    Create a new control plane instance on this node
  -h, --help                                          help for preflight
      --ignore-preflight-errors strings               A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --node-name string                              Specify the node name.
      --tls-bootstrap-token string                    Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
      --token string                                  Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
```

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



