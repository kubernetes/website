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


Crie tokens de inicialização no servidor

### Sinopse

Este comando criará um token de inicialização. Você pode especificar os usos para este token, o "tempo de vida" e uma descrição amigável, que é opcional.

O [token] é o token real para gravar. Este deve ser um token aleatório gerado com segurança da forma "[a-z0-9]{6}.[a-z0-9]{16}". Se nenhum [token] for fornecido, o kubeadm gerará um token aleatório.

```
kubeadm token create [token]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Quando usado em conjunto com '--print-join-command', exibe a flag completa 'kubeadm join' necessária para se unir ao cluster como um nó de camada de gerenciamento. Para criar uma nova chave de certificado, você deve usar 'kubeadm init phase upload-certs --upload-certs'.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o arquivo de configuração kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--description string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Uma descrição amigável de como esse token é usado.</p></td>
</tr>

<tr>
<td colspan="2">--groups strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "system:bootstrappers:kubeadm:default-node-token"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Grupos extras que este token autenticará quando usado para autenticação. Deve corresponder &quot;\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\z&quot;</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para create</p></td>
</tr>

<tr>
<td colspan="2">--print-join-command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Em vez de exibir apenas o token, exibe a flag completa 'kubeadm join' necessária para se associar ao cluster usando o token.</p></td>
</tr>

<tr>
<td colspan="2">--ttl duração&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A duração antes do token ser excluído automaticamente (por exemplo, 1s, 2m, 3h). Se definido como '0', o token nunca expirará</p></td>
</tr>

<tr>
<td colspan="2">--usages strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "signing,authentication"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Descreve as maneiras pelas quais esse token pode ser usado. Você pode passar --usages várias vezes ou fornecer uma lista de opções separada por vírgulas. Opções válidas: [signing,authentication]</p></td>
</tr>

</tbody>
</table>



### Opções herdadas dos comandos superiores

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Ativar ou não o modo de execução dry-run</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O arquivo kubeconfig a ser usado para se comunicar com o cluster. Se a flag não estiver definida, um conjunto de locais predefinidos pode ser pesquisado por um arquivo kubeconfig existente.</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] O caminho para o 'real' sistema de arquivos raiz do host.</p></td>
</tr>

</tbody>
</table>
