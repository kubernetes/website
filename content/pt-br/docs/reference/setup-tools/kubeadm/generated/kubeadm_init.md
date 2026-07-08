Rode este comando para configurar a camada de gerenciamento do Kubernetes

### Sinopse


Rode este comando para configurar a camada de gerenciamento do Kubernetes

O comando "init" executa as fases abaixo:
```
preflight                    Efetua as verificações pré-execução
certs                        Geração de certificados
  /ca                          Gera a autoridade de certificação (CA) auto-assinada do Kubernetes para provisionamento de identidades para outros componentes do Kubernetes
  /apiserver                   Gera o certificado para o servidor da API do Kubernetes
  /apiserver-kubelet-client    Gera o certificado para o servidor da API se conectar ao Kubelet
  /front-proxy-ca              Gera a autoridade de certificação (CA) auto-assinada para provisionamento de identidades para o front proxy
  /front-proxy-client          Gera o certificado para o cliente do front proxy
  /etcd-ca                     Gera a autoridade de certificação (CA) auto-assinada para provisionamento de identidades para o etcd
  /etcd-server                 Gera o certificado para servir o etcd
  /etcd-peer                   Gera o certificado para comunicação entre nós do etcd
  /etcd-healthcheck-client     Gera o certificado para liveness probes fazerem a verificação de integridade do etcd
  /apiserver-etcd-client       Gera o certificado que o servidor da API utiliza para comunicar-se com o etcd
  /sa                          Gera uma chave privada para assinatura de tokens de conta de serviço, juntamente com sua chave pública
kubeconfig                   Gera todos os arquivos kubeconfig necessários para estabelecer a camada de gerenciamento e o arquivo kubeconfig de administração
  /admin                       Gera um arquivo kubeconfig para o administrador e o próprio kubeadm utilizarem
  /kubelet                     Gera um arquivo kubeconfig para o kubelet utilizar *somente* para fins de inicialização do cluster
  /controller-manager          Gera um arquivo kubeconfig para o gerenciador de controladores utilizar
  /scheduler                   Gera um arquivo kubeconfig para o escalonador do Kubernetes utilizar
kubelet-start                Escreve as configurações do kubelet e (re)inicializa o kubelet
control-plane                Gera todos os manifestos de Pods estáticos necessários para estabelecer a camada de gerenciamento
  /apiserver                   Gera o manifesto do Pod estático do kube-apiserver
  /controller-manager          Gera o manifesto do Pod estático do kube-controller-manager
  /scheduler                   Gera o manifesto do Pod estático do kube-scheduler
etcd                         Gera o manifesto do Pod estático para um etcd local
  /local                       Gera o manifesto do Pod estático para uma instância local e de nó único do etcd
upload-config                Sobe a configuração do kubeadm e do kubelet para um ConfigMap
  /kubeadm                     Sobe a configuração ClusterConfiguration do kubeadm para um ConfigMap
  /kubelet                     Sobe a configuração do kubelet para um ConfigMap
upload-certs                 Sobe os certificados para o kubeadm-certs
mark-control-plane           Marca um nó como parte da camada de gerenciamento
bootstrap-token              Gera tokens de autoinicialização utilizados para associar um nó a um cluster
kubelet-finalize             Atualiza configurações relevantes ao kubelet após a inicialização TLS
  /experimental-cert-rotation  Habilita rotação de certificados do cliente do kubelet
addon                        Instala os addons requeridos para passar nos testes de conformidade
  /coredns                     Instala o addon CoreDNS em um cluster Kubernetes
  /kube-proxy                  Instala o addon kube-proxy em um cluster Kubernetes
```


```
kubeadm init [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O endereço IP que o servidor da API irá divulgar que está escutando. Quando não informado, a interface de rede padrão é utilizada.</p></td>
</tr>

<tr>
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: 6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Porta para o servidor da API conectar-se.</p></td>
</tr>

<tr>
<td colspan="2">--apiserver-cert-extra-sans strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Nomes alternativos (<i>Subject Alternative Names</i>, ou SANs) opcionais a serem adicionados ao certificado utilizado pelo servidor da API. Pode conter endereços IP ou nomes DNS.</p></td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O caminho para salvar e armazenar certificados.</p></td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Chave utilizada para encriptar os certificados da camada de gerenciamento no Secret kubeadm-certs.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para um arquivo de configuração do kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Especifica um endereço IP estável ou nome DNS para a camada de gerenciamento.</p></td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Caminho para o soquete CRI se conectar. Se vazio, o kubeadm tentará autodetectar este valor; utilize esta opção somente se você possui mais que um CRI instalado ou se você possui um soquete CRI fora do padrão.</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Não aplica as modificações; apenas imprime as alterações que seriam efetuadas.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Um conjunto de pares chave=valor que descreve <i>feature gates</i> para várias funcionalidades. As opções são:<br/>PublicKeysECDSA=true|false (ALFA - padrão=false)<br/>RootlessControlPlane=true|false (ALFA - padrão=false)<br/>UnversionedKubeletConfigMap=true|false (BETA - padrão=true)</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ajuda para init</p></td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Uma lista de verificações para as quais erros serão exibidos como avisos. Exemplos: 'IsPrivilegedUser,Swap'. O valor 'all' ignora erros de todas as verificações.</p></td>
</tr>

<tr>
<td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "registry.k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Seleciona um registro de contêineres de onde baixar imagens.</p></td>
</tr>

<tr>
<td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "stable-1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Seleciona uma versão do Kubernetes específica para a camada de gerenciamento.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
Caminho para um diretório contendo arquivos nomeados no padrão &quot;target[suffix][+patchtype].extension&quot;. Por exemplo, &quot;kube-apiserver0+merge.yaml&quot; ou somente &quot;etcd.json&quot;.
&quot;target&quot; pode ser um dos seguintes valores: &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;.
&quot;patchtype&quot; pode ser &quot;strategic&quot;, &quot;merge&quot; ou &quot;json&quot; e corresponde aos formatos de patch suportados pelo kubectl. O valor padrão para &quot;patchtype&quot; é &quot;strategic&quot;.
&quot;extension&quot; deve ser &quot;json&quot; ou &quot;yaml&quot;. &quot;suffix&quot; é uma string opcional utilizada para determinar quais patches são aplicados primeiro em ordem alfanumérica.
</p></td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Especifica um intervalo de endereços IP para a rede do Pod. Quando especificado, a camada de gerenciamento irá automaticamente alocar CIDRs para cada nó.</p></td>
</tr>

<tr>
<td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "10.96.0.0/12"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Utiliza um intervalo alternativo de endereços IP para VIPs de serviço.</p></td>
</tr>

<tr>
<td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: "cluster.local"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Utiliza um domínio alternativo para os serviços. Por exemplo, &quot;myorg.internal&quot;.</p></td>
</tr>

<tr>
<td colspan="2">--skip-certificate-key-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Não exibe a chave utilizada para encriptar os certificados da camada de gerenciamento.</p></td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Lista de fases a serem ignoradas.</p></td>
</tr>

<tr>
<td colspan="2">--skip-token-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Pula a impressão do token de autoinicialização padrão gerado pelo comando 'kubeadm init'.</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>O token a ser utilizado para estabelecer confiança bidirecional entre nós de carga de trabalho e nós da camada de gerenciamento. O formato segue a expressão regular [a-z0-9]{6}.[a-z0-9]{16} - por exemplo, abcdef.0123456789abcdef.</p></td>
</tr>

<tr>
<td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Padrão: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A duração de tempo de um token antes deste ser automaticamente apagado (por exemplo, 1s, 2m, 3h). Quando informado '0', o token não expira.</p></td>
</tr>

<tr>
<td colspan="2">--upload-certs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Sobe os certificados da camada de gerenciamento para o Secret kubeadm-certs.</p></td>
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



