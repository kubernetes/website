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
Updates settings relevant to the kubelet after TLS bootstrap 
-->
TLS 引導後更新與 kubelet 相關的設定

<!-- ### Synopsis -->
### 概要

<!-- Updates settings relevant to the kubelet after TLS bootstrap -->
TLS 引導後更新與 kubelet 相關的設定

```
kubeadm init phase kubelet-finalize [flags]
```

<!-- ### Examples -->
### 示例

<!--  
```
  # Updates settings relevant to the kubelet after TLS bootstrap
  kubeadm init phase kubelet-finalize all --config
```
-->
```
  # 在 TLS 引導後更新與 kubelet 相關的設定
  kubeadm init phase kubelet-finalize all --config
```

<!-- ### Options -->
### 選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kubelet-finalize</p></td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubelet-finalize 操作的幫助命令</p></td>
</tr>

</tbody>
</table>



<!-- ### Options inherited from parent commands -->
### 繼承於父命令的選項

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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p></td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[實驗] 到'真實'主機根檔案系統的路徑。</p></td>
</tr>

</tbody>
</table>



