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
Create bootstrap tokens on the server
-->
在伺服器上建立引導令牌

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

這個命令將為你建立一個引導令牌。
你可以設定此令牌的用途，"有效時間" 和可選的人性化的描述。

這裡的 [token] 是指將要生成的實際令牌。
該令牌應該是一個透過安全機制生成的隨機令牌，形式為 "[a-z0-9]{6}.[a-z0-9]{16}"。
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
當與 “--print-join-command” 一起使用時，列印作為控制平面加入叢集時所需的所有 “kubeadm join” 標誌。
要建立新的證書金鑰，你必須使用 “kubeadm init phase upload-certs --upload-certs”。
</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
<p>
kubeadm 配置檔案的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--description string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A human friendly description of how this token is used.
-->
<p>
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
--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：[system:bootstrappers:kubeadm:default-node-token]
</p>
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
-->
<p>
此令牌用於身份驗證時將進行身份驗證的其他組。必須匹配  "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for create
-->
<p>
create 操作的幫助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">--print-join-command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Instead of printing only the token, print the full 'kubeadm join' flag needed to join the cluster using the token.
-->
<p>
不僅僅列印令牌，而是列印使用令牌加入叢集所需的完整 'kubeadm join' 引數。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire
-->
<p>
令牌有效時間，超過該時間令牌被自動刪除。(例如： 1s, 2m, 3h)。如果設定為 '0'，令牌將永遠不過期。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]
-->
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：[signing,authentication]
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]
-->
<p>
描述可以使用此令牌的方式。你可以多次使用 `--usages` 或者提供一個以逗號分隔的選項列表。合法選項有: [signing,authentication]
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
<!--
Whether to enable dry-run mode or not
-->
<p>
是否啟用 `dry-run` 執行模式
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用於和叢集通訊的 KubeConfig 檔案。如果它沒有被設定，那麼 kubeadm 將會搜尋一個已經存在於標準路徑的 KubeConfig 檔案。
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
[實驗] 指向 '真實' 宿主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>

