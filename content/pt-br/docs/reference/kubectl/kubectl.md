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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
If true, only write logs to their native severity level (vs also writing to each lower severity level</td>
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

## {{% heading "seealso" %}}

* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Attach to a running container
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspect authorization
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Display cluster info
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modify kubeconfig files
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Mark node as unschedulable
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - Create a resource from a file or from stdin.
* [kubectl debug](/docs/reference/generated/kubectl/kubectl-commands#debug)	 - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Edit a resource on the server
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Execute a command in a container
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentation of resources
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - Display one or many resources
* [kubectl kustomize](/docs/reference/generated/kubectl/kubectl-commands#kustomize)	 - Build a kustomization target from a directory or a remote url.
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - Update the labels on a resource
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Print the logs for a container in a pod
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Update field(s) of a resource
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Manage the rollout of a resource
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - Run a particular image on the cluster
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Set a new size for a Deployment, ReplicaSet or Replication Controller
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - Set specific features on objects
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Update the taints on one or more nodes
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Mark node as schedulable
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - Print the client and server version information
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Experimental: Wait for a specific condition on one or many resources.

