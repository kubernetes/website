<!--
Upgrade your Kubernetes cluster to the specified version.

### Synopsis


Upgrade your Kubernetes cluster to the specified version.

```
kubeadm upgrade apply [version]
```

### Options
-->

将Kubernetes集群升级到指定版本。

### 简介


将Kubernetes集群升级到指定版本。

```
kubeadm upgrade apply [version]
```

### 选项


<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>
  
<!--
    <tr>
      <td colspan="2">--allow-experimental-upgrades</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.</td>
    </tr>

    <tr>
      <td colspan="2">--allow-release-candidate-upgrades</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Do not change any state, just output what actions would be performed.</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Perform the upgrade of etcd.</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Force upgrading although some requirements might not be met. This also implies non-interactive mode.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for apply</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

    <tr>
      <td colspan="2">--image-pull-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum amount of time to wait for the control plane pods to be downloaded.</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/zarnold/.kube/config"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

    <tr>
      <td colspan="2">--print-config</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies whether the configuration file that will be used in the upgrade should be printed or not.</td>
    </tr>

    <tr>
      <td colspan="2">-y, --yes</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Perform the upgrade and do not prompt for confirmation (non-interactive mode).</td>
    </tr>

  </tbody>
</table>
-->

  <tr>
      <td colspan="2">--allow-experimental-upgrades</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 Kubernetes 的不稳定版本作为升级替代方案，并允许升级到 Kubernetes 的 alpha/beta 或 RC 版本。</td>
    </tr>

  <tr>
      <td colspan="2">--allow-release-candidate-upgrades</td>
    </tr>
    <tr>  
      <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 Kubernetes 的候选版本作为升级替代方案，并允许升级到 Kubernetes 的 RC 版本。</td>
    </tr>

  <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>
    </tr>

  <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定要连接的 CRI 套接字。</td>
    </tr>

  <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">不要更改任何状态，只输出要执行的操作。</td>
    </tr>

  <tr>
      <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">执行 etcd 的升级。</td>
    </tr>

  <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组键值对，用于描述各种功能的功能门。选项包括：<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td>
    </tr>

  <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">强制升级，但可能无法满足某些要求。这也意味着非交互模式。</td>
    </tr>

  <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">帮助</td>
    </tr>

  <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一系列检查，其错误将显示为警告。示例：'IsPrivilegedUser,Swap'。值'all'忽略所有检查的错误。</td>
    </tr>

  <tr>
      <td colspan="2">--image-pull-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">等待控制面 pod 下载的最长时间。</td>
    </tr>

  <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/zarnold/.kube/config"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">与集群通信时使用的 KubeConfig 文件。如果未设置标志，则在相关目录下搜索以查找现有KubeConfig文件。</td>
    </tr>

  <tr>
      <td colspan="2">--print-config</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否应打印将在升级中使用的配置文件。</td>
    </tr>

  <tr>
      <td colspan="2">-y, --yes</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">执行升级，不提示确认（非交互模式）。</td>
    </tr>

  </tbody>
</table>


<!--
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
-->

### 从父命令继承的选项

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] 宿主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

