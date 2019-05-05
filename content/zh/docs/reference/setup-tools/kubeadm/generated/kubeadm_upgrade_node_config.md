
<!--
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.
-->
从集群 ConfigMap kubelet-config-1.X 下载 kubelet 配置。其中 X 是 kubelet 的次要版本。

<!--
### Synopsis
-->
### 概要

<!--
Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. kubeadm uses the --kubelet-version parameter to determine what the desired kubelet version is. Give
-->
从群集中 "kubelet-config-1.X" 的 ConfigMap 下载 kubelet 配置，其中 X 是kubelet 的次要版本。kubeadm 使用 --kubelet-version 参数来确定所需的 kubelet 版本。

```
kubeadm upgrade node config [flags]
```

<!--
### Examples
-->
<!--
# Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
# Simulates the downloading of the kubelet configuration from the ConfigMap in the cluster with a specific desired
# version. Does not change any state locally on the node
-->

### 例子

```
  # 从集群中的 ConfigMap 下载 kubelet 配置，使用特定的 kubelet 版本。
  kubeadm upgrade node config --kubelet-version v1.12.0
  
  # 模拟从集群中的 ConfigMap 下载具有特定版本的 kubelet 配置。节点上的任何本地状态没有改变吗？
  kubeadm upgrade node config --kubelet-version v1.12.0 --dry-run
```

<!--
### Options
-->

### 选项

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Do not change any state, just output the actions that would be performed.</td>
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for config</td>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are sear    ched for an existing KubeConfig file.</td>
<td></td><td style="line-height: 130%; word-wrap: break-word;">The *desired* version for the kubelet after the upgrade.</td>
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">不改变任何状态，只输出将要执行的操作</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">配置操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/kubelet.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">升级后的 kubelet 的*期望*版本。</td>
    </tr>

  </tbody>
</table>


### 从父命令继承的选项

<!--
### Options inherited from parent commands
-->

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

  </tbody>
</table>

<!-
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->





