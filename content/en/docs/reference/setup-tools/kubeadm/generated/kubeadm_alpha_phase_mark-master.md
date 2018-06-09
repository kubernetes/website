
Mark a node as master

### Synopsis

Applies a label that specifies that a node is a master and a taint that forces workloads to be deployed accordingly. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase mark-master [flags]
```

### Examples

```
  # Applies master label and taint to the current node, functionally equivalent to what executed by kubeadm init.
  kubeadm alpha phase mark-master
  
  # Applies master label and taint to a specific node
  kubeadm alpha phase mark-master --node-name myNode
```

### Options

```
      --config string       Path to kubeadm config file. WARNING: Usage of a configuration file is experimental
  -h, --help                help for mark-master
      --kubeconfig string   The KubeConfig file to use when talking to the cluster (default "/etc/kubernetes/admin.conf")
      --node-name string    The node name to which label and taints should apply
```

n="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for mark-master</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The node name to which label and taints should apply</td>
    </tr>

  </tbody>
</table>



