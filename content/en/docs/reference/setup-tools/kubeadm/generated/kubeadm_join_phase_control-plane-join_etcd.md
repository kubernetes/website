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


Add a new local etcd member

### Synopsis


Add a new local etcd member

```
kubeadm join phase control-plane-join etcd [flags]
```

### Options

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to kubeadm config file.</p></td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Create a new control plane instance on this node</p></td>
</tr>

<tr>
<td colspan="2">--experimental-patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for etcd</p></td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Specify the node name.</p></td>
</tr>

</tbody>
</table>



### Options inherited from parent commands

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p></td>
</tr>

</tbody>
</table>



