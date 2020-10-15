
<!-- ### Synopsis -->
### 概要


<!-- Run pre-flight checks for kubeadm upgrade node. -->

执行 kubeadm 升级节点的预检。

```
kubeadm upgrade node phase preflight [flags]
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for preflight</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">preflight 操作的帮助命令</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors stringSlice</td>
</tr>
<tr>
<!-- 
<td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td> 
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">错误将显示为警告的检查清单。示例：'IsPrivilegedUser,Swap'。值为'all'表示忽略所有检查的错误。</td>
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



