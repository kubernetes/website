
<!-- Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter. -->
检查当前可供升级的版本有哪些以及验证你当前的集群是否可以升级。传入可选的 [version] 参数可以跳过联网检查。

<!-- ### Synopsis -->
### 简介


<!-- Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter. -->
检查当前可供升级的版本有哪些以及验证你当前的集群是否可以升级。传入可选的 [version] 参数可以跳过联网检查。

```
kubeadm upgrade plan [version] [flags]
```

<!-- ### Options -->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--allow-experimental-upgrades</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 Kubernetes 的不稳定版本作为升级的替代方案并且允许升级到 alpha/beta/release candidate 状态的 Kubernetes 版本。</td>      
    </tr>

    <tr>
      <td colspan="2">--allow-release-candidate-upgrades</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 Kubernetes 的 release candidate 版本作为升级的替代方案并且允许升级到 release candidate 状态的 Kubernetes 版本。</td>      
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件功能是实验性的）</td>      
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">键值对的结合，用于控制各种功能的开关。可选项有：<br/>Auditing=true|false (ALPHA状态 - 缺省值=false)<br/>CoreDNS=true|false (缺省值=true)<br/>DynamicKubeletConfig=true|false (BETA状态 - 缺省值=false)</td>      
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for plan</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 plan 命令的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">检查项的集合，这些检查项如果发生错误则会被显示为警告。 示例: 'IsPrivilegedUser,Swap'。 如果值为 'all' 则将忽略所有的检查错误。</td>  
    </tr>

    <tr>
      <!-- <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/zarnold/.kube/config"</td> -->
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值： "~/.kube/config"</td>      
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">同集群通信时使用的 KubeConfig 文件。 如果没有设置这个参数，将会通过搜索一系列标准的位置来找到一份已存在的 KubeConfig 文件。</td>      
    </tr>

    <tr>
      <td colspan="2">--print-config</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies whether the configuration file that will be used in the upgrade should be printed or not.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指明是否打印出用于升级的配置文件。</td>      
    </tr>

  </tbody>
</table>



<!-- ### Options inherited from parent commands -->
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
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验性的功能] 相对“真实”宿主机根目录的路径。</td>      
    </tr>

  </tbody>
</table>



