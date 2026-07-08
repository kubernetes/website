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


Rode este comando em qualquer máquina que você deseje adicionar a um cluster
existente

### Sinopse



Ao associar um novo nó a um cluster inicializado com kubeadm, temos que
estabelecer a confiança bidirecional. Este processo é dividido entre a descoberta
(em que o nó estabelece a confiança na camada de gerenciamento do Kubernetes) e
a inicialização TLS (em que a camada de gerenciamento do Kubernetes estabelece a
confiança no nó).

Existem duas principais formas de descoberta. A primeira delas é o uso de um
token compartilhado, juntamente com o endereço IP do servidor da API. A segunda
é o fornecimento de um arquivo - um subconjunto do arquivo kubeconfig padrão. O
arquivo de descoberta/kubeconfig suporta autenticação por token, plugins de
autenticação do client-go ("exec"), "tokenFile" e "authProvider". Este arquivo
pode ser um arquivo local ou um arquivo baixado através de uma URL HTTPS. Os
formatos são `kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443`,
`kubeadm join --discovery-file caminho/para/arquivo.conf`, ou
`kubeadm join --discovery-file https://endereco/arquivo.conf`. Somente um formato
pode ser utilizado. Se os dados para a descoberta são carregados de uma URL,
o protocolo HTTPS deve ser utilizado. Neste caso, o conjunto de CAs instalado no
host é utilizado para verificar a conexão.

Se você utilizou um token compartilhado para descoberta, você deve também passar
a opção `--discovery-token-ca-cert-hash` para validar a chave pública da
autoridade de certificação raiz (CA) apresentada pela camada de gerenciamento do
Kubernetes. O valor desta opção é especificado no formato
"&lt;tipo-de-hash&gt;:&lt;valor-codificado-em-hexadecimal&gt;", onde o tipo de
hash suportado é "sha256". O hash é calculado a partir dos bytes do objeto
Subject Public Key Info (SPKI), como especificado pela RFC7469. Este valor fica
disponível na saída do comando `kubeadm init` ou pode ser calculado utilizando
ferramentas padronizadas. A opção `--discovery-token-ca-cert-hash` pode ser
especificada múltiplas vezes para permitir informar mais que uma chave pública.

Se você não puder obter o _hash_ da chave pública da autoridade de certificação
de antemão, você pode passar a opção `--discovery-token-unsafe-skip-ca-verification`
para desabilitar esta verificação. Esta opção enfraquece o modelo de segurança
do kubeadm, já que outros nós podem potencialmente personificar a camada de
gerenciamento do Kubernetes.

O mecanismo de inicialização TLS também é conduzido por um token compartilhado.
Este token é utilizado para temporariamente autenticar-se com a camada de
gerenciamento do Kubernetes para enviar uma requisição de assinatura de
certificado (CSR) para um par de chaves criado localmente. Por padrão, o kubeadm
irá configurar a camada de gerenciamento do Kubernetes para automaticamente
aprovar estas requisições de assinatura. O token é enviado através da opção
`--tls-bootstrap-token abcdef.1234567890abcdef`.

Frequentemente, o mesmo token é utilizado para ambas as partes. Neste caso, a
opção `--token` pode ser utilizada ao invés de especificar cada token
individualmente.

O comando `join [api-server-endpoint]` executa as seguintes fases:
```
preflight               Executa as verificações pré-execução
control-plane-prepare   Prepara a máquina para servir um nó da camada de gerenciamento
  /download-certs        [EXPERIMENTAL] Baixa certificados compartilhados entre nós da camada de gerenciamento do Secret kubeadm-certs
  /certs                 Gera os certificados para os novos componentes da camada de gerenciamento
  /kubeconfig            Gera o arquivo kubeconfig para os novos componentes da camada de gerenciamento
  /control-plane         Gera os manifestos para os novos componentes da camada de gerenciamento
kubelet-start          Escreve as configurações do kubelet, os certificados, e (re)inicia o kubelet
control-plane-join     Associa uma máquina como uma instância da camada de gerenciamento
  /etcd                  Adiciona como um novo membro do etcd local
  /update-status         Registra o novo nó da camada de gerenciamento no objeto ClusterStatus mantido no ConfigMap kubeadm-config (DESCONTINUADO)
  /mark-control-plane    Marca um nó como nó da camada de gerenciamento
```

```
kubeadm join [api-server-endpoint] [flags]
```

### Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Se o nó hospedar uma nova instância da camada de gerenciamento, este é o endereço IP que servidor da API irá anunciar que
está aguardando conexões. Quando não especificado, a interface de rede padrão é utilizada.
</p></td>
</tr>

<tr>
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Se o nó hospedar uma nova instância da camada de gerenciamento, a porta que o servidor da API deve conectar-se.
</p></td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Chave utilizada para decriptar as credenciais do certificado enviadas pelo comando init.
</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Caminho para um arquivo de configuração do kubeadm.
</p></td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Cria uma nova instância da camada de gerenciamento neste nó.
</p></td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Caminho para o soquete CRI conectar-se. Se vazio, o kubeadm tentará autodetectar este valor; utilize esta opção somente se você possui mais que um CRI instalado ou se você possui um soquete CRI fora do padrão.</p></td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Para descoberta baseada em arquivo, um caminho de arquivo ou uma URL de onde a informação do cluster deve ser carregada.
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Para descoberta baseada em token, o token utilizado para validar a informação do cluster obtida do servidor da API.
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Para descoberta baseada em token, verifica que a chave pública do CA raiz corresponde a este <i>hash</i>
(formato: &quot;&lt;tipo&gt;:&lt;valor&gt;&quot;).
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Para descoberta baseada em token, permite associar-se ao cluster sem fixação da
autoridade de certificação (opção --discovery-token-ca-cert-hash).
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Não aplica as modificações; apenas imprime as alterações que seriam efetuadas.
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para join</p></td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Uma lista de verificações para as quais erros serão exibidos como avisos. Exemplos: 'IsPrivilegedUser,Swap'. O valor 'all' ignora erros de todas as verificações.</p></td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Especifica o nome do nó.</p></td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um diretório contendo arquivos nomeados no padrão "target[suffix][+patchtype].extension". Por exemplo, "kube-apiserver0+merge.yaml" ou somente "etcd.json". "target" pode ser um dos seguintes valores: "kube-apiserver", "kube-controller-manager", "kube-scheduler", "etcd". "patchtype" pode ser "strategic", "merge" ou "json" e corresponde aos formatos de patch suportados pelo kubectl. O valor padrão para "patchtype" é "strategic". "extension" deve ser "json" ou "yaml". "suffix" é uma string opcional utilizada para determinar quais patches são aplicados primeiro em ordem alfanumérica.</p></td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Lista de fases a serem ignoradas.</p></td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Especifica o token a ser utilizado para autenticar temporariamente com a camada de gerenciamento do Kubernetes durante
o processo de associação do nó ao cluster.
</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Utiliza este token em ambas as opções discovery-token e tls-bootstrap-token quando tais valores não são informados.
</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] O caminho para o sistema de arquivos raiz 'real' do host.
</p></td>
</tr>

</tbody>
</table>
