<!--
Run pre-flight checks
-->
运行预检。

<!-- 
### Synopsis
-->
### 概要

<!--
Run pre-flight checks for kubeadm init.
-->
运行 kubeadm init 前的预检。

```
kubeadm init phase preflight [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
  # Run pre-flight checks for kubeadm init using a config file.
  kubeadm init phase preflight --config kubeadm-config.yaml
```
-->
```
# 使用配置文件对 kubeadm init 进行预检
kubeadm init phase preflight --config kubeadm-config.yaml
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
<p>
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要连接的 CRI 套接字的路径。如果该值为空，kubeadm 将尝试自动检测；
仅当你安装了多个 CRI 或使用非标准的 CRI 套接字时才应使用此选项。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't apply any changes; just output what would be done.
-->
<p>
不做任何更改；只输出将要执行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for preflight
-->
<p>
preflight 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
<p>
错误将显示为警告的检查列表。例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
选择拉取控制平面镜像的容器仓库。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 继承于父命令的选项

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[实验] 到'真实'主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
