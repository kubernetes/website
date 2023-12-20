<!-- 
Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED) 
-->
将新的控制平面节点注册到 kubeadm-config ConfigMap 维护的 ClusterStatus 中（已弃用）。

<!-- 
### Synopsis 
-->
## 概要

<!-- 
Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED)
-->
将新的控制平面节点注册到 kubeadm-config ConfigMap 维护的 ClusterStatus 中（已弃用）。

```
kubeadm join phase control-plane-join update-status [flags]
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
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>如果该节点托管一个新的控制平面实例，则 API 服务器将公布其正在侦听的 IP 地址。如果未设置，则使用默认网络接口。</p>
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
<p>kubeadm 配置文件的路径。</p>
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
<p>在此节点上创建一个新的控制平面实例。</p>
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
<p>update-status 操作的帮助命令。</p>
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
<p>指定节点名称。</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 从父命令中继承的选项

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
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
