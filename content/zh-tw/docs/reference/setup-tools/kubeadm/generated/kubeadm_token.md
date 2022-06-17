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
Manage bootstrap tokens
-->
管理引導令牌

<!--
### Synopsis
-->

### 概要

<!--
This command manages bootstrap tokens. It is optional and needed only for advanced use cases.
-->

此命令管理引導令牌（bootstrap token）。它是可選的，僅適用於高階用例。

<!--
In short, bootstrap tokens are used for establishing bidirectional trust between a client and a server.
A bootstrap token can be used when a client (for example a node that is about to join the cluster) needs
to trust the server it is talking to. Then a bootstrap token with the "signing" usage can be used.
-->

簡而言之，引導令牌（bootstrap token）用於在客戶端和伺服器之間建立雙向信任。
當客戶端（例如，即將加入叢集的節點）需要時，可以使用引導令牌相信正在與之通訊的伺服器。
然後可以使用具有 “簽名” 的引導令牌。

<!--
bootstrap tokens can also function as a way to allow short-lived authentication to the API Server
(the token serves as a way for the API Server to trust the client), for example for doing the TLS Bootstrap.
-->

引導令牌還可以作為一種允許對 API 伺服器進行短期身份驗證的方法（令牌用作 API 伺服器信任客戶端的方式），例如用於執行 TLS 載入程式。

<!--
What is a bootstrap token more exactly?
 - It is a Secret in the kube-system namespace of type "bootstrap.kubernetes.io/token".
 - A bootstrap token must be of the form "[a-z0-9]{6}.[a-z0-9]{16}". The former part is the public token ID,
   while the latter is the Token Secret and it must be kept private at all circumstances!
 - The name of the Secret must be named "bootstrap-token-(token-id)".
 -->

引導令牌準確來說是什麼？

- 它是位於 kube-system 名稱空間中型別為 “bootstrap.kubernetes.io/token” 的一個 Secret。
- 引導令牌的格式必須為 “[a-z0-9]{6}.[a-z0-9]{16}”，前一部分是公共令牌 ID，而後者是令牌秘鑰，必須在任何情況下都保密！
- 必須將 Secret 的名稱命名為 “bootstrap-token-(token-id)”。

<!--
You can read more about bootstrap tokens here:
  /docs/admin/bootstrap-tokens/
-->

你可以在此處閱讀有關引導令牌（bootstrap token）的更多資訊：
  /docs/admin/bootstrap-tokens/

```
kubeadm token [flags]
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to enable dry-run mode or not</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether to enable dry-run mode or not
-->
<p>
是否啟用 `dry-run` 模式
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for token</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for token
-->
<p>
token 操作的幫助命令
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
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
與叢集通訊時使用的 kubeconfig 檔案。如果未設定，則搜尋一組標準位置以查詢現有 kubeconfig 檔案。
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
