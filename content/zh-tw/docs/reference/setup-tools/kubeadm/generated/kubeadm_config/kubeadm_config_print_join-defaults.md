<!--
Print default join configuration, that can be used for 'kubeadm join'
-->
打印默認的節點添加配置，該配置可用於 'kubeadm join' 命令。

<!--
### Synopsis
-->
### 概要

<!--
This command prints objects such as the default join configuration that is used for 'kubeadm join'.
-->
此命令打印對象，例如用於 'kubeadm join' 的默認 join 配置對象。

<!--
Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like "abcdef.0123456789abcdef" in order to pass validation but
not perform the real computation for creating a token.
-->
請注意，諸如啓動引導令牌字段之類的敏感值已替換爲 "abcdef.0123456789abcdef" 之類的佔位符值以通過驗證，
但不執行創建令牌的實際計算。

```
kubeadm config print join-defaults [flags]
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
<!--
help for join-defaults
-->
<p>
join-defaults 操作的幫助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承的選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
與集羣通信時使用的 kubeconfig 文件。如果未設置該參數，則可以在一組標準位置中搜索現有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
