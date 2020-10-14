
<!-- ### Synopsis -->
### 概要



<!-- Enable kubelet client certificate rotation -->
启用 kubelet 客户端证书轮换

```
kubeadm init phase kubelet-finalize experimental-cert-rotation [flags]
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
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for experimental-cert-rotation</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">experimental-cert-rotation 操作的帮助命令</td>
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



