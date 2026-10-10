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


Renove o certificado para `liveness probes` para verificar a integridade do etcd

### Sinopse

Renove o certificado para `liveness probes` para verificar a integridade do etcd.

As renovações são executadas incondicionalmente, independentemente da data de expiração do certificado; atributos extras, como SANs, serão baseados no arquivo/certificados existentes, não há necessidade de informá-los novamente.

A renovação, por padrão, tenta usar a autoridade de certificação na PKI local gerenciada pelo kubeadm; como alternativa, é possível usar o certificado K8s da API para renovação de certificado, ou como última opção, para gerar uma solicitação CSR.

Após a renovação, para tornar as alterações efetivas, é necessário reiniciar os componentes da camada de gerenciamento e, eventualmente, redistribuir o certificado renovado, caso o arquivo seja usado em outro lugar.

```
kubeadm certs renew etcd-healthcheck-client [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O caminho para salvar os certificados</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para etcd-healthcheck-client</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O arquivo kubeconfig a ser usado para se comunicar com o cluster. Se a flag não estiver definida, um conjunto de locais predefinidos pode ser pesquisado por um arquivo kubeconfig existente.</p></td>
</tr>

</tbody>
</table>



### Opções herdadas do comando superior

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] O caminho para o 'real' sistema de arquivos raiz do host.</p></td>
</tr>

</tbody>
</table>



