<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Output a kubeconfig file for an additional user

### Synopsis

Output a kubeconfig file for an additional user.
-->
為其他使用者輸出一個 kubeconfig 檔案。

### 概要

為其他使用者輸出一個 kubeconfig 檔案。

```
kubeadm alpha kubeconfig user [flags]
```

<!--
### Examples

```
  # Output a kubeconfig file for an additional user named foo using a kubeadm config file bar
  kubeadm alpha kubeconfig user --client-name=foo --config=bar
```
-->
### 示例

```
# 使用名為 bar 的 kubeadm 配置檔案為名為 foo 的另一使用者輸出 kubeconfig 檔案
kubeadm kubeconfig user --client-name=foo --config=bar
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
<td colspan="2">--client-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of user. It will be used as the CN if client certificates are created
-->
使用者名稱。如果生成客戶端證書，則用作其 CN。
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
指向 kubeadm 配置檔案的路徑
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for user
-->
user 操作的幫助命令
</td>
</tr>

<tr>
<td colspan="2">--org strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The orgnizations of the client certificate. It will be used as the O if client certificates are created
-->
客戶端證書的組織。如果建立客戶端證書，此值將用作其 O 欄位值。
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The token that should be used as the authentication mechanism for this kubeconfig, instead of client certificates
-->
應該用此令牌做為 kubeconfig 的身份驗證機制，而不是客戶端證書
</td>
</tr>

<tr>
<td colspan="2">--validity-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><!--The validity period of the client certificate. It is an offset from the current time.-->
<p>
客戶證書的合法期限。所設定值為相對當前時間的偏移。
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
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向 '真實' 宿主機的根目錄。
</td>
</tr>

</tbody>
</table>

