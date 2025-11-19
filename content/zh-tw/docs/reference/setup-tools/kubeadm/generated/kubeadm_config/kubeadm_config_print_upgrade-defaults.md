
<!--
Print default upgrade configuration, that can be used for 'kubeadm upgrade'
-->
打印可用於 `kubeadm upgrade` 的默認升級配置。

<!--
### Synopsis

This command prints objects such as the default upgrade configuration that is used for 'kubeadm upgrade'.

Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like "abcdef.0123456789abcdef" in order to pass validation but
not perform the real computation for creating a token.
-->
### 概要

此命令打印 `kubeadm upgrade` 所用的默認升級配置等這類對象。

請注意，諸如啓動引導令牌（Bootstrap Token）字段這類敏感值已替換爲 "abcdef.0123456789abcdef"
這類佔位符值用來通過合法性檢查，但不執行創建令牌的實際計算。

```
kubeadm config print upgrade-defaults [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for upgrade-defaults
-->
upgrade-defaults 操作的幫助命令。
</p></td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: -->默認值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與集羣通信時所使用的 kubeconfig 文件。
如果該參數未被設置，則可以在一組標準位置中搜索現有的 kubeconfig 文件。
</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p></td>
</tr>

</tbody>
</table>
