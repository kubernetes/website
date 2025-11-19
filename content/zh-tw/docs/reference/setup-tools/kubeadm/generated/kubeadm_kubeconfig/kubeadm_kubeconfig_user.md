<!--
Output a kubeconfig file for an additional user

### Synopsis
-->

### 概要

爲其他用戶輸出一個 kubeconfig 文件。

```shell
kubeadm kubeconfig user [flags]
```

<!--
### Examples

```
# Output a kubeconfig file for an additional user named foo
kubeadm kubeconfig user --client-name=foo

# Output a kubeconfig file for an additional user named foo using a kubeadm config file bar
kubeadm kubeconfig user --client-name=foo --config=bar
```
-->
### 示例

```shell
# 爲一個名爲 foo 的其他用戶輸出 kubeconfig 文件
kubeadm kubeconfig user --client-name=foo

# 使用 kubeadm 配置文件 bar 爲另一個名爲 foo 的用戶輸出 kubeconfig 文件
kubeadm alpha kubeconfig user --client-name=foo --config=bar
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
<p>
<!--
The name of user. It will be used as the CN if client certificates are created
-->
用戶名。如果生成客戶端證書，則用作其 CN。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
指向 kubeadm 配置文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for user
-->
user 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--org strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The organizations of the client certificate. It will be used as the O if client certificates are created
-->
客戶端證書的組織。如果創建客戶端證書，此值將用作其 O 字段值。
</p>
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The token that should be used as the authentication mechanism for this kubeconfig, instead of client certificates
-->
應該用此令牌做爲 kubeconfig 的身份驗證機制，而不是客戶端證書。
</p>
</td>
</tr>

<tr>
<td colspan="2">--validity-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 8760h0m0s-->默認值：8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The validity period of the client certificate. It is an offset from the current time.
-->
客戶證書的合法期限。所設置值爲相對當前時間的偏移。
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
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。設置此標誌將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
