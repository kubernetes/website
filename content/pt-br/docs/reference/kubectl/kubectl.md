---
title: kubectl
content_type: tool-reference
weight: 30
---

## Sinopse

kubectl controla o gerenciador de cluster do Kubernetes.

 Encontre mais informações em: https://kubernetes.io/docs/reference/kubectl/overview/

```
kubectl [flags]
```

## Opções

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se true, adiciona o diretório de arquivos ao cabeçalho das mensagens de log.</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Log para erro padrão, como também arquivos.</td>
</tr>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Nome de usuário para representar para a operação.</td>
</tr>

<tr>
<td colspan="2">--as-group stringArray</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Grupo para representar para a operação, esta flag pode ser repetida para especificar vários grupos.</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Caminho para o arquivo contendo informações de configuração do registro do contêiner do Azure.</td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Diretório de cache padrão.</td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Caminho de um arquivo cert para a autoridade de certificação.</td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Caminho para um arquivo de certificado de cliente para a TLS.</td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Caminho para um arquivo de chave do cliente para a TLS.</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
CIDRs abertos no firewall do GCE para proxy de tráfego L7 LB e health checks.</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs abertos no firewall do GCE para tráfego proxy L4 LB e health checks.</td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">O nome do cluster Kubeconfig para usar.</td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">O nome do contexto Kubeconfig para usar.</td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Indica o tolerationSeconds da tolerância para notReady:NoExecute que foi adicionada por padrão a todos os pods que já não possuem tal tolerância.
</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Indica o tolerationSeconds de uma tolerância para unreachable:NoExecute que é adicionada por padrão a todos os pods que já não possuem tal tolerância.
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Ajuda para o kubectl</td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se true, o certificado do servidor não será verificado para validade. Isso fará com que suas conexões HTTPS sejam inseguras</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Caminho para o arquivo kubeconfig para usar para requisições do CLI.</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Quando o log atingir a linha N do arquivo, emite um rastreamento de pilha.
</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se o diretório não estiver vazio, escreve arquivos de log nele</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se o arquivo não estiver vazio, utiliza esse arquivo de log.</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Define o tamanho máximo ao qual um arquivo de log pode crescer. A unidade é megabytes. Se o valor é 0, o tamanho máximo do arquivo é ilimitado.
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Máximo de segundos entre os flushes de log.</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
log para erros padrões ao invés de arquivos.
</td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Exige versão do servidor para corresponder à versão do client
</td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se estiver presente, o scope do namespace para essa requisição do CLI. 
</td>
</tr>

<tr>
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"> Se true, escreve logs apenas para seus níveis de gravidade (enquanto também escreve para cada nível de gravidade menor)</td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Senha para autenticação básica ao servidor da API.
</td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Nome do perfil a ser capturado. Um dentre (none|cpu|heap|goroutine|threadcreate|block|mutex).
</td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Nome do arquivo no qual será escrito o perfil.
</td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
O tempo a ser esperado antes de desistir de uma única requisição do servidor. Valores diferente de 0 devem conter unidade de tempo correspondente (e.g. 1s, 2m, 3h). O valor 0 significa não dar timeout nas requisições.
.</td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">O endereço e porta do servidor API Kubernetes</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se true, evita prefixos de cabeçalho nas mensagens de log.
</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Se true, evita cabeçalhos quando abrir arquivos de log. 
</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Logs acima ou nesse limiar irão para o stderr
</td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Nome do servidor para usar a validação do certificado do servidor. Se não for fornecido, o nome do host usado para contatar o servidor é usado</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Bearer token para autenticação para o servidor API</td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">O nome do usuário do kubeconfig a usar</td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Nome do usuário para autenticação básica para o servidor da API.</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Número para a verbosity do nível de log.
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Imprime informação de versão e encerra.
</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Lista separada por vírgula de padrões=N de definições para logging de arquivo filtrado.
</td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Trata avisos recebidos pelo servidor como erros e encerra com código de exit diferente de 0.
</tr>

</tbody>
</table>

## Variáveis de ambiente

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">KUBECONFIG</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Caminho para o arquivo de configuração ("kubeconfig") do kubectl
Path to the kubectl configuration ("kubeconfig") file. Padrão: "$HOME/.kube/config"</td>
</tr>

<tr>
<td colspan="2">KUBECTL_COMMAND_HEADERS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
Quando configurado para false, desativa cabeçalhos HTTP detalhando comando kubectl invocado (Kubernetes versão v1.22 ou mais antiga).
</td>
</tr>

</tbody>
</table>

## Veja também

* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Atualizar as anotações em um recurso
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Imprimir os recursos suportados da API no servidor
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Imprimir as versões suportadas da API no servidor em forma de "grupo/versão"
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Aplicar uma configuração a um recurso pelo nome do arquivo ou stdin
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Vincular a um container em execução
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspecionar a autorização
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Escalar automaticamente um Deployment, ReplicaSet ou ReplicationController
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modificar recursos de certificado
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Exibir informações de cluster
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Exibir código de compleção do shell para o shell especificado (bash ou zsh)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modificar arquivos kubeconfig
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Marcar nó como não programável
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copiar arquivos e diretórios de e para contêineres
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - Criar um recurso de um arquivo ou de stdin
* [kubectl debug](/docs/reference/generated/kubectl/kubectl-commands#debug)	 - Criar sessões de debugging para solução de problemas de workloads e nós
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Excluir recursos por nomes de arquivos, stdin, recursos e nomes, ou por recursos e seletor de labels
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Mostrar detalhes de um recurso específico ou grupo de recursos
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - Diferenciar versão live da versão que seria aplicada
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Drenar nó em preparação para manutenção
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Editar um recurso no servidor
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Executar um comando em um contêiner
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentação de recursos
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Pegue um replication controller, service, deployment ou pod e exponha como um novo Kubernetes Service
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - Exibir um ou muitos recursos
* [kubectl kustomize](/docs/reference/generated/kubectl/kubectl-commands#kustomize)	 - Construa um alvo de kustomization de um diretório ou um URL remoto.
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - Atualizar as labels em um recurso
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Imprimir os logs para um contêiner em um pod
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - Imprimir a lista de flags herdadas por todos os comandos
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Atualizar campos de um recurso
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Prover serviços de utilidade para interação com plugins
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Encaminhar uma ou mais portas a um pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Executar um proxy para o servidor do Kubernetes API
Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Substitua um recurso por nome de arquivo ou stdin
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Gerenciar o lançamento de um recurso
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - Executar uma imagem específica no cluster
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Definir um novo tamanho para um Deployment, ReplicaSet ou ReplicationController
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - Definir funcionalidades específicas em objetos
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Atualizar as manchas em um ou mais nós
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - Exibir uso do recurso (CPU / Memória / Armazenamento)
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Marcar o nó como programável
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - Imprima as informações da versão do client e do servidor
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Experimental: Aguardar por uma condição específica em um ou mais recursos

