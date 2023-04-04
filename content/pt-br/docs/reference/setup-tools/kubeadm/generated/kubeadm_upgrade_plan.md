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

Verifique quais versões estão disponíveis para atualizar e verifique se o seu cluster atual é atualizável. 
Para pular a verificação da Internet, passe o parâmetro opcional [versão]

### Sinopse

Verifique quais versões estão disponíveis para atualizar e verifique se o seu cluster atual é atualizável. 
Para pular a verificação da Internet, passe o parâmetro opcional [versão]

```
kubeadm upgrade plan [versão] [flags]
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração kubeadm.</p></td>
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para plan</p></td>
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
<td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>EXPERIMENTAL: Formato de saída. Opções válidas: text|json|yaml.</p></td>
</tr>

<tr>
<td colspan="2">--print-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Especifica se o arquivo de configuração que será usado na atualização deve ser exibido ou não.</p></td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Se verdadeiro, mantém os managedFields ao exibir os objetos no formato JSON ou YAML.</p></td>
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
