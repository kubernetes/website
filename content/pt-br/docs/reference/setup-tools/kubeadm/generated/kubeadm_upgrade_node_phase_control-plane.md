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


Atualiza a instância da camada de gerenciamento instalada nesse nó, se houver

### Sinopse

Atualiza a instância da camada de gerenciamento instalada nesse nó, se houver

```
kubeadm upgrade node phase control-plane [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Executa a renovação dos certificados usados pelo componente alterado durante as atualizações.</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Não altera nenhum estado, apenas produz as ações que seriam executadas.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Atualiza o etcd.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para o comando control-plane</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O arquivo kubeconfig a ser usado para se comunicar com o cluster. Se a flag não estiver definida, uma série de locais predefinidos pode ser pesquisado por um arquivo kubeconfig existente.</p></td>
</tr>


<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O caminho para um diretório que contém arquivos chamados &quot;target[suffix][+patchtype].extension&quot;. Por exemplo, &quot;kube-apiserver0+merge.yaml&quot; ou apenas &quot;etcd.json&quot;. &quot;target&quot; são &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;. &quot;patchtype&quot; pode ser um dos &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot;e eles correspondem aos formatos de patch suportados pelo kubectl. O padrão &quot;patchtype&quot; é &quot;strategic&quot;. &quot;extension&quot; deve ser &quot;json&quot; ou &quot;yaml&quot;. &quot;suffix&quot; é uma string opcional que pode ser usada para determinar a ordem de aplicação dos patches alfanumericamente.</p></td>
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
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] O caminho para o 'real' sistema de arquivos raiz do host.</p></td>
</tr>

</tbody>
</table>



