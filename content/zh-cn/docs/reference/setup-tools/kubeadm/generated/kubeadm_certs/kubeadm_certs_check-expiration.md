<!-- 
Check certificates expiration for a Kubernetes cluster 
-->
为一个 Kubernetes 集群检查证书的到期时间。

<!--
### Synopsis
-->
### 概要

<!-- 
Checks expiration for the certificates in the local PKI managed by kubeadm.
-->
检查 kubeadm 管理的本地 PKI 中证书的到期时间。

```
kubeadm certs check-expiration [flags]
```

<!--
### Options
-->
### 选项

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">
<!--
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果为 true，忽略模板中缺少某字段或映射键的错误。仅适用于 golang 和 jsonpath 输出格式。
</p>
</td>
</tr>

<tr>
<!--
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> 
-->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The path where to save the certificates</p> 
-->
<p>保存证书的路径。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Path to a kubeadm configuration file.</p> 
-->
<p>到 kubeadm 配置文件的路径。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"
-->
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："text"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
输出格式。可选值为：
text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>help for check-expiration</p> 
-->
<p>check-expiration 操作的帮助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!-- 
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf" 
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认为："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. 
-->
在和集群连接时使用该 kubeconfig 文件。
如果此标志未被设置，那么将会在一些标准的位置去搜索存在的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果为 true，在以 JSON 或 YAML 格式打印对象时保留 managedFields。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

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
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[实验] 到'真实'主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
