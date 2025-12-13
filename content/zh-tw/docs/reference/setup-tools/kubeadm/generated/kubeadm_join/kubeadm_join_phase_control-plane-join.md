<!--
### Synopsis
-->
### 概要

<!--
Join a machine as a control plane instance
-->
添加作爲控制平面實例的機器。

```shell
kubeadm join phase control-plane-join [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Joins a machine as a control plane instance
kubeadm join phase control-plane-join all
```
-->
```shell
# 將機器作爲控制平面實例加入
kubeadm join phase control-plane-join all
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for control-plane-join
-->
control-plane-join 操作的幫助命令。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到 '真實' 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
