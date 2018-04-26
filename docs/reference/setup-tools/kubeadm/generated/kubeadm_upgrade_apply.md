
Upgrade your Kubernetes cluster to the specified version.

### Synopsis


Upgrade your Kubernetes cluster to the specified version.

```
kubeadm upgrade apply [version]
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Do not change any state, just output what actions would be performed.</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Perform the upgrade of etcd.</td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Force upgrading although some requirements might not be met. This also implies non-interactive mode.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for apply</td>
    </tr>

    <tr>
      <td colspan="2">--image-pull-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum amount of time to wait for the control plane pods to be downloaded.</td>
    </tr>

    <tr>
      <td colspan="2">-y, --yes</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Perform the upgrade and do not prompt for confirmation (non-interactive mode).</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--allow-experimental-upgrades</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.</td>
    </tr>

    <tr>
      <td colspan="2">--allow-release-candidate-upgrades</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!</td>
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



