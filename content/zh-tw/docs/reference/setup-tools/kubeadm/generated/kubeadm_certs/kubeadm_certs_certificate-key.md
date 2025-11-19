<!--
Generate certificate keys
-->
生成證書密鑰。

<!--
### Synopsis
-->
### 概要

<!--
This command will print out a secure randomly-generated certificate key that can be used with
the "init" command.
-->
該命令將打印出可以與 "init" 命令一起使用的安全的隨機生成的證書密鑰。

<!--
You can also use "kubeadm init -upload-certs" without specifying a certificate key and it will generate and print one for you.
-->
你也可以使用 `kubeadm init --upload-certs` 而無需指定證書密鑰；
此命令將爲你生成並打印一個證書密鑰。

```
kubeadm certs certificate-key [flags]
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
help for certificate-key
-->
certificate-key 操作的幫助命令。
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
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
