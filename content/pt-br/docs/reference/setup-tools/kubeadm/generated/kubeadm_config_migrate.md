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


Leia uma versão mais antiga dos tipos de API de configuração do kubeadm a partir de um arquivo e envie o objeto de configuração semelhante para a versão mais recente

### Sinopse

Esse comando permite converter objetos de configuração de versões mais antigas para a versão mais recente suportada, localmente na ferramenta CLI sem nunca tocar em nada no cluster. Nesta versão do kubeadm, as seguintes versões da API são suportadas:
- Kubeadm.k8s.io/v1beta3

Além disso, o kubeadm só pode escrever a configuração da versão "kubeadm.k8s.io/v1beta3", mas pode ler os dois tipos. Portanto, independentemente da versão que você passar para o parâmetro --old-config , o objeto API será lido, desserializado, padronizado, convertido, validado e serializado novamente quando escrito no stdout ou --new-config, se especificado.

Em outras palavras, a saída deste comando é o que o kubeadm realmente leria internamente se você enviasse este arquivo para "kubeadm init"

```
kubeadm config migrate [flags]
```

### Opções

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para migrate</p></td>
</tr>

<tr>
<td colspan="2">--new-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o arquivo de configuração kubeadm equivalente usando a nova versão da API. Opcional, se não for especificado, a saída será enviada para o STDOUT.</p></td>
</tr>

<tr>
<td colspan="2">--old-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o arquivo de configuração do kubeadm que está usando uma versão antiga da API e que deve ser convertido. Essa flag é obrigatória.</p></td>
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



