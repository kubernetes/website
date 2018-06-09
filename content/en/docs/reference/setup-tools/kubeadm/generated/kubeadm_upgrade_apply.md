
Upgrade your Kubernetes cluster to the specified version.

### Synopsis

Upgrade your Kubernetes cluster to the specified version.

```
kubeadm upgrade apply [version]
```

### Options

```
      --dry-run                       Do not change any state, just output what actions would be performed.
      --etcd-upgrade                  Perform the upgrade of etcd. (default true)
  -f, --force                         Force upgrading although some requirements might not be met. This also implies non-interactive mode.
  -h, --help                          help for apply
      --image-pull-timeout duration   The maximum amount of time to wait for the control plane pods to be downloaded. (default 15m0s)
  -y, --yes                           Perform the upgrade and do not prompt for confirmation (non-interactive mode).
```

### Options inherited from parent commands

```
      --allow-experimental-upgrades        Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
      --allow-release-candidate-upgrades   Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
      --config string                      Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!
      --feature-gates string               A set of key=value pairs that describe feature gates for various features.Options are:
                                           Auditing=true|false (ALPHA - default=false)
                                           CoreDNS=true|false (default=true)
                                           DynamicKubeletConfig=true|false (ALPHA - default=false)
                                           SelfHosting=true|false (ALPHA - default=false)
                                           StoreCertsInSecrets=true|false (ALPHA - default=false)
      --ignore-preflight-errors strings    A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --kubeconfig string                  The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
      --print-config                       Specifies whether the configuration file that will be used in the upgrade should be printed or not.
```

d></td><td style="line-height: 130%">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A set of key=value pairs that describe feature gates for various features.Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (BETA - default=false)<br/>DynamicKubeletConfig=true|false (ALPHA - default=false)<br/>SelfHosting=true|false (ALPHA - default=false)<br/>StoreCertsInSecrets=true|false (ALPHA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The KubeConfig file to use when talking to the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--print-config</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Specifies whether the configuration file that will be used in the upgrade should be printed or not.</td>
    </tr>

  </tbody>
</table>



