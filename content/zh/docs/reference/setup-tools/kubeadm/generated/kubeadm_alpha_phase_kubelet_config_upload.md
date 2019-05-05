
基于 kubeadm InitConfiguration 文件将 kubelet 配置上载到 ConfigMap。

<!--
Uploads kubelet configuration to a ConfigMap based on a kubeadm InitConfiguration file.
-->
<!--
### Synopsis
-->
### 概要

<!--
Uploads kubelet configuration extracted from the kubeadm InitConfiguration object to a ConfigMap of the form kubelet-config-1.X in the cluster, where X is the minor version of the current (API Server) Kubernetes version. 
-->

将从 kubeadm InitConfiguration 对象提取的 kubelet 配置上载到集群中 kubelet-config-1.X 形式的 ConfigMap，其中 X 是当前（API 服务器）Kubernetes 版本的次要版本。

<!--
Alpha Disclaimer: this command is currently alpha.
-->

Alpha 免责声明：此命令当前处于 alpha 阶段。

```
kubeadm alpha phase kubelet config upload [flags]
```

<!--
### Examples
-->

### 示例

<!--
```
  # Uploads the kubelet configuration from the kubeadm Config file to a ConfigMap in the cluster.
  kubeadm alpha phase kubelet config upload --config kubeadm.yaml
```
-->

```
  # 将 kubelet 配置从 kubeadm 配置文件上载到集群中的 ConfigMap。
  kubeadm alpha phase kubelet config upload --config kubeadm.yaml
```

<!--
### Options
-->

### 选项

<!--
<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for upload</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

  </tbody>
</table>
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用处于试验阶段）</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">upload 的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">与集群交互时使用的 KubeConfig 文件。如果未设置，将搜索一组标准路径来查找现有的 KubeConfig 文件。</td>
    </tr>

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
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
