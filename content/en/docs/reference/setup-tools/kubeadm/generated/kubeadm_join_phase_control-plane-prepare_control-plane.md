
Generate the manifests for the new control plane components

### Synopsis

Generate the manifests for the new control plane components

```
kubeadm join phase control-plane-prepare control-plane [flags]
```

### Options

```
      --apiserver-advertise-address string   If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32            If the node should host a new control plane instance, the port for the API Server to bind to. (default 6443)
      --config string                        Path to kubeadm config file.
      --control-plane                        Create a new control plane instance on this node
      --experimental-control-plane           Create a new control plane instance on this node
  -h, --help                                 help for control-plane
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



