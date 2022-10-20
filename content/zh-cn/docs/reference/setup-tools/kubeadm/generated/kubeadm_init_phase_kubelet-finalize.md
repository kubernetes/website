<!-- 
Updates settings relevant to the kubelet after TLS bootstrap 
-->
TLS 引导后更新与 kubelet 相关的设置

<!--
### Synopsis
-->
### 概要

<!-- Updates settings relevant to the kubelet after TLS bootstrap -->
TLS 引导后更新与 kubelet 相关的设置

```
kubeadm init phase kubelet-finalize [flags]
```

<!--
### Examples
-->
### 示例

<!--  
```
  # Updates settings relevant to the kubelet after TLS bootstrap
  kubeadm init phase kubelet-finalize all --config
```
-->
```
  # 在 TLS 引导后更新与 kubelet 相关的设置
  kubeadm init phase kubelet-finalize all --config
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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kubelet-finalize</p></td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubelet-finalize 操作的帮助命令</p></td>
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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p></td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[实验] 到'真实'主机根文件系统的路径。</p></td>
</tr>

</tbody>
</table>

