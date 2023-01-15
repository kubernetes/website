<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

Mostra quais diferenças serão aplicadas aos manifestos dos Pods estáticos existentes. Veja também: kubeadm upgrade apply --dry-run

### Sinopse

Mostra quais diferenças serão aplicadas aos manifestos dos Pods estáticos existentes. Veja também: kubeadm upgrade apply --dry-run

```
kubeadm upgrade diff [versão] [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o manifesto do servidor da API</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração do kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: 3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Quantidade de linhas de contexto do diff</p></td>
</tr>

<tr>
<td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o manifesto do controlador de gerenciadores</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Ajuda para diff</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O arquivo kubeconfig a ser usado para se comunicar com o cluster. Se a flag não estiver definida, um conjunto de locais predefinidos pode ser pesquisado por um arquivo kubeconfig existente.</p></td>
</tr>

<tr>
<td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o manifesto do escalonador</p></td>
</tr>

</tbody>
</table>

### Opções herdadas de comandos superiores

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] O caminho para o sistema de arquivos raiz 'real' do host.</p></td>
</tr>

</tbody>
</table>
