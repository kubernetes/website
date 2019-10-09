
从集群 ConfigMap kubelet-config-1.X 下载 kubelet 配置，其中 X 是 kubelet 的次要版本。
<!--
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.
-->

<!--
### Synopsis
-->

### 概要

<!--
Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. Either kubeadm autodetects the kubelet version by exec-ing "kubelet --version" or respects the --kubelet-version parameter. 
-->
从集群中名为 "kubelet-config-1.X" 的 ConfigMap 中下载 kubelet 配置信息，其中 X 是kubelet 的次要版本。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase kubelet config download [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Autodetects the kubelet version.
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
-->

```
  # 从集群中的 ConfigMap 下载 kubelet 配置。自动检测 kubelet 版本。
  kubeadm alpha phase kubelet config download
  
  # 从集群中的 ConfigMap 下载 kubelet 配置。使用特定的 kubelet 版本。
  kubeadm alpha phase kubelet config download --kubelet-version v1.12.0
```

<!--
### Options
-->

### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">download 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for download</td>
-->

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/kubelet.conf"</td>
    </tr>
<!--
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/kubelet.conf"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>
<!--
     <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">kubelet 的理想版本，默认通过 'kubelet --version' 自动检测。</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The desired version for the kubelet. Defaults to being autodetected from 'kubelet --version'.</td>
-->

  </tbody>
</table>


<!--
### Options inherited from parent commands
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>
<!--
     <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

  </tbody>
</table>



