<!-- 
Renew all available certificates 
-->
续订所有可用证书。

<!--
### Synopsis
-->
### 概要

<!--
Renew all known certificates necessary to run the control plane. Renewals are run unconditionally, regardless of expiration date. Renewals can also be run individually for more control.
-->
续订运行控制平面所需的所有已知证书。续订是无条件进行的，与到期日期无关。续订也可以单独运行以进行更多控制。

```
kubeadm certs renew all [flags]
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
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The path where to save and store the certificates.</p>
-->
<p>存储证书的路径。</p>
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for all</p>
-->
<p>all 操作的帮助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>与集群通信时使用的 kubeconfig 文件。
如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。</p>
</td>
</tr>

<tr>
<td colspan="2">--use-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use the Kubernetes certificate API to renew certificates
-->
使用 Kubernetes 证书 API 续订证书。
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
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
