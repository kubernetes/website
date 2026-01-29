<!-- 
Print default init configuration, that can be used for 'kubeadm init' 
-->
打印用於 'kubeadm init' 的預設 init 設定。

<!--
### Synopsis
-->
### 概要

<!--
This command prints objects such as the default init configuration that is used for 'kubeadm init'.
-->
此命令打印對象，例如用於 'kubeadm init' 的預設 init 設定對象。

<!--
Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like "abcdef.0123456789abcdef" in order to pass validation but
not perform the real computation for creating a token.
-->
請注意，Bootstrap Token 字段之類的敏感值已替換爲 "abcdef.0123456789abcdef"
之類的佔位符值以通過驗證，但不執行創建令牌的實際計算。

```
kubeadm config print init-defaults [flags]
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
<td colspan="2">--component-configs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A comma-separated list for component config API objects to print the default values for. Available values: [KubeProxyConfiguration KubeletConfiguration]. If this flag is not set, no component configs will be printed.</p>
-->
<p>以逗號分隔的組件設定 API 對象的列表，打印其預設值。可用值：[KubeProxyConfiguration KubeletConfiguration]。
如果未設置此參數，則不會打印任何組件設定。</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for init-defaults</p>
-->
<p>init-defaults 操作的幫助命令。</p>
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
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>與叢集通信時使用的 kubeconfig 檔案。如果未設置該參數，則可以在一組標準位置中搜索現有的 kubeconfig 檔案。</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 到 '真實' 主機根檔案系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
