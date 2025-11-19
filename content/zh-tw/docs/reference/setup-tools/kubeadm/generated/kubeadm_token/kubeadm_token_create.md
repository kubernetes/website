<!--
Create bootstrap tokens on the server
-->
在伺服器上創建引導令牌。

<!--
### Synopsis
-->
### 概要

<!--
This command will create a bootstrap token for you.
You can specify the usages for this token, the "time to live" and an optional human friendly description.

The [token] is the actual token to write.
This should be a securely generated random token of the form "[a-z0-9]{6}.[a-z0-9]{16}".
If no [token] is given, kubeadm will generate a random token instead.
-->
這個命令將爲你創建一個引導令牌。
你可以設置此令牌的用途，"有效時間" 和可選的人性化的描述。

這裏的 [token] 是指將要生成的實際令牌。
該令牌應該是一個通過安全機制生成的隨機令牌，形式爲 "[a-z0-9]{6}.[a-z0-9]{16}"。
如果沒有給出 [token]，kubeadm 將生成一個隨機令牌。

```
kubeadm token create [token]
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
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used together with '--print-join-command', print the full 'kubeadm join' flag needed to join the cluster as a control-plane. To create a new certificate key you must use 'kubeadm init phase upload-certs --upload-certs'.
-->
當與 “--print-join-command” 一起使用時，打印作爲控制平面加入叢集時所需的所有 “kubeadm join” 標誌。
要創建新的證書密鑰，你必須使用 “kubeadm init phase upload-certs --upload-certs”。
</p></td>
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
kubeadm 設定文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--description string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A human friendly description of how this token is used.
-->
針對令牌用途的人性化的描述。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [system:bootstrappers:kubeadm:default-node-token]
-->
<p>
--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：[system:bootstrappers:kubeadm:default-node-token]
</p>
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
-->
此令牌用於身份驗證時將對其他組進行身份驗證。必須匹配 "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
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
help for create
-->
create 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--print-join-command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Instead of printing only the token, print the full 'kubeadm join' flag needed to join the cluster using the token.
-->
不僅僅打印令牌，而是打印使用令牌加入叢集所需的完整 'kubeadm join' 參數。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire
-->
令牌有效時間，超過該時間令牌被自動刪除。(例如：1s, 2m, 3h)。如果設置爲 '0'，令牌將永遠不過期。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]
-->
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：[signing,authentication]
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]
-->
描述可以使用此令牌的方式。你可以多次使用 `--usages` 或者提供一個以逗號分隔的選項列表。
合法選項有：[signing,authentication]
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Whether to enable dry-run mode or not
-->
是否啓用 `dry-run` 運行模式。
</p>
</td>
</tr>

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
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用於和叢集通信的 kubeconfig 文件。如果它沒有被設置，那麼 kubeadm 將會搜索一個已經存在於標準路徑的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
