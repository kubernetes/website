<!--
### Synopsis
-->
### 概要

<!--
Prepare the machine for serving a control plane
-->
準備爲控制平面服務的機器。

```shell
kubeadm join phase control-plane-prepare [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Prepares the machine for serving a control plane
kubeadm join phase control-plane-prepare all
```
-->
```shell
# 準備爲控制平面服務的機器
kubeadm join phase control-plane-prepare all
```

<!--
### Options
-->
### 選項

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for control-plane-prepare
-->
control-plane-prepare 操作的幫助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令中繼承的選項

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
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向 '真實' 宿主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
