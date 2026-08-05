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


Exibe a configuração padrão do join, que pode ser usada para 'kubeadm join'

### Sinopse

Este comando exibe objetos como a configuração padrão de join que é usada para 'kubeadm join'.

Observe que valores confidenciais, como os campos do Token Bootstrap, são substituídos por valores de exemplo como "abcdef.0123456789abcdef", a fim de passar na validação, mas não executar o cálculo real para criar um token.

```
kubeadm config print join-defaults [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--component-configs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Uma lista dos objetos da API de configuração, separados por vírgulas,  exibirá os valores padrão. Valores disponíveis: [KubeProxyConfiguration KubeletConfiguration]. Se essa flag não estiver definida, nenhuma configuração de componente será impressa.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para join-defaults</p></td>
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



