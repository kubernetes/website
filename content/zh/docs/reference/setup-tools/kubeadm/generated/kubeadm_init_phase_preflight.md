
<!-- 
### Synopsis
-->

### 概要

<!--
Run pre-flight checks for kubeadm init.
-->

运行 kubeadm init 前的启动检查。

```
kubeadm init phase preflight [flags]
```

<!--
### Examples
-->

### 案例

<!--
# Run pre-flight checks for kubeadm init using a config file.
-->

```
# 使用配置文件对 kubeadm init 进行启动检查。
kubeadm init phase preflight --config kubeadm-config.yml
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
kubeadm 配置文件的路径。
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
preflight 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
错误将显示为警告的检查列表：例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
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
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

