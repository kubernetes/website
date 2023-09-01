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


Puxe imagens usadas pelo kubeadm

### Sinopse


Baixa imagens usadas pelo kubeadm

```
kubeadm config images pull [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para se conectar ao socket CRI. Se vazio, o kubeadm tentará detectar automaticamente esse valor; use essa opção somente se você tiver mais de um CRI instalado ou se tiver um socket CRI não padrão.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Um conjunto de pares chave=valor que descrevem feature gates para vários recursos. As opções são:<br/>PublicKeysECDSA=true|false (ALPHA - padrão=false)<br/>RootlessControlPlane=true|false (ALPHA - padrão=false)<br/>UnversionedKubeletConfigMap=true|false (ALPHA - padrão=false)</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para pull</p></td>
</tr>

<tr>
<td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "registry.k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Escolha um registro de contêineres para baixar imagens da camada de gerenciamento</p></td>
</tr>

<tr>
<td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "stable-1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Escolha uma versão específica do Kubernetes para a camada de gerenciamento.</p></td>
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



