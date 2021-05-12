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


Generate keys and certificate signing requests

### Synopsis


Generates keys and certificate signing requests (CSRs) for all the certificates required to run the control plane. This command also generates partial kubeconfig files with private key data in the  "users &gt; user &gt; client-key-data" field, and for each kubeconfig file an accompanying ".csr" file is created.

This command is designed for use in [Kubeadm External CA Mode](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). It generates CSRs which you can then submit to your external certificate authority for signing.

The PEM encoded signed certificates should then be saved alongside the key files, using ".crt" as the file extension, or in the case of kubeconfig files, the PEM encoded signed certificate should be base64 encoded and added to the kubeconfig file in the "users &gt; user &gt; client-certificate-data" field.

```
kubeadm certs generate-csr [flags]
```

### Examples

```
  # The following command will generate keys and CSRs for all control-plane certificates and kubeconfig files:
  kubeadm alpha certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
```

### Options

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path where to save the certificates</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a kubeadm configuration file.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for generate-csr</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path where to save the kubeconfig file.</p></td>
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



