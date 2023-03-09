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

Atualiza o cluster Kubernetes para uma versão específica

### Sinopse

Atualiza o cluster Kubernetes para uma versão específica

```
kubeadm upgrade apply [versão]
```

### Opções

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-experimental-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Exibe as versões instáveis do Kubernetes como uma alternativa de atualização e permite a atualização para versões alfa/beta/release candidate do Kubernetes.</p></td>
</tr>

<tr>
<td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Exibe as versões candidatas a lançamento do Kubernetes como uma alternativa de atualização e permite a atualização para versões candidatas a lançamento do Kubernetes.</p></td>
</tr>

<tr>
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Executa a renovação dos certificados usados pelo componente alterado durante as atualizações.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração do kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Não aplica as modificações; apenas exibe as alterações que seriam efetuadas.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Atualiza o etcd.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Um conjunto de pares chave=valor que descreve feature gates para várias funcionalidades. As opções são:<br/>
PublicKeysECDSA=true|false (ALPHA - padrão=false)<br/>RootlessControlPlane=true|false (ALPHA - padrão=false)
</p></td>
</tr>

<tr>
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Força a atualização, embora alguns requisitos possam não estar sendo atendidos. Isso também implica o modo não interativo.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para apply</p></td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Uma lista de verificações para as quais erros serão exibidos como avisos. Exemplos: 'IsPrivilegedUser,Swap'. O valor 'all' ignora erros de todas as verificações.</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O arquivo kubeconfig a ser usado para se comunicar com o cluster. Se a flag não estiver definida, um conjunto de locais predefinidos pode ser pesquisado por um arquivo kubeconfig existente.</p></td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Caminho para um diretório contendo arquivos nomeados no padrão &quot;target[suffix][+patchtype].extension&quot;. Por exemplo, &quot;kube-apiserver0+merge.yaml&quot; ou somente &quot;etcd.json&quot;. &quot;target&quot; pode ser um dos seguintes valores: &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; pode ser &quot;strategic&quot;, &quot;merge&quot; ou &quot;json&quot; e corresponde aos formatos de patch suportados pelo kubectl. O valor padrão para &quot;patchtype&quot; é &quot;strategic&quot;. &quot;extension&quot; deve ser &quot;json&quot; ou &quot;yaml&quot;. &quot;suffix&quot; é uma string opcional utilizada para determinar quais patches são aplicados primeiro em ordem alfanumérica.
</p></td>
</tr>

<tr>
<td colspan="2">--print-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Especifica se o arquivo de configuração que será usado na atualização deve ser exibido ou não.</p></td>
</tr>

<tr>
<td colspan="2">-y, --yes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Executa a atualização e não solicita um prompt de confirmação (modo não interativo).</p></td>
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
