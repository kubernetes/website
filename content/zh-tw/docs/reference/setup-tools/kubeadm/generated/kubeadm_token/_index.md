<!--
Manage bootstrap tokens
-->
管理引導令牌。

<!--
### Synopsis
-->
### 概要

<!--
This command manages bootstrap tokens. It is optional and needed only for advanced use cases.
-->
此命令管理引導令牌（bootstrap token）。它是可選的，僅適用於高級用例。

<!--
In short, bootstrap tokens are used for establishing bidirectional trust between a client and a server.
A bootstrap token can be used when a client (for example a node that is about to join the cluster) needs
to trust the server it is talking to. Then a bootstrap token with the "signing" usage can be used.
bootstrap tokens can also function as a way to allow short-lived authentication to the API Server
(the token serves as a way for the API Server to trust the client), for example for doing the TLS Bootstrap.
-->
簡而言之，引導令牌（Bootstrap Token）用於在客戶端和伺服器之間建立雙向信任。
當客戶端（例如，即將加入叢集的節點）需要信任所通信的伺服器時，可以使用引導令牌。
這時可以使用具有 “signing” 用途的引導令牌。引導令牌還可以作爲一種允許對 API
伺服器進行短期身份驗證的方法（令牌用作 API 伺服器信任客戶端的方式），例如用於執行 TLS 引導程式。

<!--
What is a bootstrap token more exactly?
 - It is a Secret in the kube-system namespace of type "bootstrap.kubernetes.io/token".
 - A bootstrap token must be of the form "[a-z0-9]{6}.[a-z0-9]{16}". The former part is the public token ID,
   while the latter is the Token Secret and it must be kept private at all circumstances!
 - The name of the Secret must be named "bootstrap-token-(token-id)".
-->
引導令牌準確來說是什麼？

- 它是位於 kube-system 命名空間中類型爲 “bootstrap.kubernetes.io/token” 的一個 Secret。
- 引導令牌的格式必須爲 “[a-z0-9]{6}.[a-z0-9]{16}”，前一部分是公共令牌 ID，而後者是令牌祕鑰，必須在任何情況下都保密！
- 必須將 Secret 的名稱命名爲 “bootstrap-token-(token-id)”。

<!--
You can read more about bootstrap tokens here:
  https://kubernetes.io/docs/admin/bootstrap-tokens/
-->
你可以在此處閱讀有關引導令牌（bootstrap token）的更多資訊：
  https://kubernetes.io/zh-cn/docs/admin/bootstrap-tokens/

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Whether to enable dry-run mode or not
-->
是否啓用 `dry-run` 模式。
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
help for token
-->
token 操作的幫助命令。
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
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 檔案。如果未設置，則搜索一組標準位置以查找現有 kubeconfig 檔案。
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
到“真實”主機根檔案系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
