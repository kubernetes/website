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


Gerar chaves e solicitações de assinatura de certificados

### Sinopse

Gera as chaves e as solicitações de assinatura de certificados (CSRs) para todos os certificados necessários para executar a camada de gerenciamento. Este comando também gera os arquivos kubeconfig parciais com dados de chave privada no campo "users &gt; user &gt; client-key-data" e, para cada arquivo kubeconfig, um arquivo ".csr" correspondente é criado.

Esse comando foi projetado para uso no [modo de CA externo do Kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). Ele gera CSRs que você pode enviar à sua autoridade de certificação externa para assinatura.

Os certificados PEM assinados e codificados devem ser salvos juntamente com os arquivos da chave, usando ".crt" como extensão de arquivo ou, no caso de arquivos kubeconfig, o certificado assinado codificado no formato PEM deve ser codificado em base64 e adicionado ao arquivo kubeconfig no campo "users &gt; user &gt; client-certificate-data".

```
kubeadm certs generate-csr [flags]
```

### Exemplos

```
  # O comando a seguir gera as chaves e CSRs para todos os certificados do plano de controle e arquivos kubeconfig: 
  kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
```

### Opções

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para generate-csr</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O caminho para salvar o arquivo kubeconfig.</p></td>
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



