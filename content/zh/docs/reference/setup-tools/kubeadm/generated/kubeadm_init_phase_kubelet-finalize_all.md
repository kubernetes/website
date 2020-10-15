
<!-- ### Synopsis -->
### 概要


<!-- Run all kubelet-finalize phases -->
运行所有 kubelet-finalize 阶段

```
kubeadm init phase kubelet-finalize all [flags]
```

<!-- ### Examples -->
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

<!-- ### Options -->
### 选项

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<!-- <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> -->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/pki"</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">保存和存储证书的路径。</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for all</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">all 操作的帮助命令</td>
</tr>

</tbody>
</table>



<!-- ### Options inherited from parent commands -->
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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
</tr>

</tbody>
</table>



