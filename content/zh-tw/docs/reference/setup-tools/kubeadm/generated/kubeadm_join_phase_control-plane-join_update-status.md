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
Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED) 
-->
將新的控制平面節點註冊到 kubeadm-config ConfigMap 維護的 ClusterStatus 中（已棄用）

<!-- 
### Synopsis 
-->

## 概要

<!-- 
Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED)
-->

將新的控制平面節點註冊到 kubeadm-config ConfigMap 維護的 ClusterStatus 中（已棄用）

```
kubeadm join phase control-plane-join update-status [flags]
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
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>如果該節點託管一個新的控制平面例項，則 API 伺服器將公佈其正在偵聽的 IP 地址。如果未設定，則使用預設網路介面。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Path to kubeadm config file.</p>  
-->
<p>kubeadm 配置檔案的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Create a new control plane instance on this node</p> 
-->
<p>在此節點上建立一個新的控制平面例項</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>help for update-status</p> 
-->
<p>update-status 操作的幫助命令</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Specify the node name.</p>  
-->
<p>指定節點名稱。</p>
</td>
</tr>

</tbody>
</table>



<!--
### Options inherited from parent commands
-->

### 從父命令中繼承的選項

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
<p>[實驗] 到 '真實' 主機根檔案系統的路徑。</p>
</td>
</tr>

</tbody>
</table>

