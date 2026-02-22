---
title: kubectl Cheat Sheet
content_type: concept
card:
  name: reference
  weight: 30
---

<!-- overview -->

Esta página contém uma lista de comandos `kubectl` e flags frequentemente usados.

<!-- body -->

## Kubectl Autocomplete

### BASH

```bash
source <(kubectl completion bash) # configuração de autocomplete no bash do shell atual, o pacote bash-completion precisa ter sido instalado primeiro.
echo "source <(kubectl completion bash)" >> ~/.bashrc # para adicionar o autocomplete permanentemente no seu shell bash.
```

Você também pode usar uma abreviação para o atalho para `kubectl` que também funciona com o auto completar:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # configuração para usar autocomplete no terminal zsh no shell atual
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # adicionar auto completar permanentemente para o seu shell zsh
```

### Uma nota sobre `--all-namespaces`

Acrescentar `--all-namespaces` acontece com bastante frequência, onde você deve estar ciente da abreviação de `--all-namespaces`:

```kubectl -A```

##  Contexto e Configuração do Kubectl

Define com qual cluster Kubernetes o `kubectl` se comunica e modifica os detalhes da configuração.
Veja a documentação [Autenticando entre clusters com o kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) para
informações detalhadas do arquivo de configuração.

```bash
kubectl config view # Mostra configurações do kubeconfig mergeadas

# use vários arquivos kubeconfig ao mesmo tempo e visualize a configuração mergeada
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 

kubectl config view

# obtenha a senha para o usuário e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # exibe o primeiro usuário
kubectl config view -o jsonpath='{.users[*].name}'   # obtém uma lista de usuários
kubectl config get-contexts                          # exibe lista de contextos
kubectl config current-context                       # exibe o contexto atual
kubectl config use-context my-cluster-name           # define o contexto padrão como my-cluster-name

kubectl config set-cluster my-cluster-name           # define uma entrada de cluster no kubeconfig

# configura a URL para um servidor proxy a ser usado para solicitações feitas por este cliente no kubeconfig
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# adiciona um novo cluster ao seu kubeconfig que suporte autenticação básica
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# salva o namespace permanentemente para todos os comandos subsequentes do kubectl nesse contexto
kubectl config set-context --current --namespace=ggckad-s2

# define um contexto utilizando um nome de usuário e o namespace
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo                       # exclui usuário foo

# alias curto para definir/mostrar contexto/namespace (funciona apenas para bash e shells compatíveis com bash, contexto atual a ser definido antes de usar kn para definir namespace)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## Kubectl apply

`apply` gerencia aplicações através de arquivos que definem os recursos do Kubernetes. Ele cria e atualiza recursos em um cluster através da execução `kubectl apply`.
Esta é a maneira recomendada para gerenciar aplicações Kubernetes em ambiente de produção. Veja a [documentação do Kubectl](https://kubectl.docs.kubernetes.io).

## Criando objetos

Manifestos Kubernetes podem ser definidos em YAML ou JSON. As extensões de arquivo `.yaml`,
`.yml`, e `.json` podem ser usadas.

```bash
kubectl apply -f ./my-manifest.yaml            # cria recurso(s)
kubectl apply -f ./my1.yaml -f ./my2.yaml      # cria a partir de vários arquivos
kubectl apply -f ./dir                         # cria recurso(s) em todos os arquivos de manifesto no diretório
kubectl apply -f https://git.io/vPieo          # cria recurso(s) a partir de URL
kubectl create deployment nginx --image=nginx  # inicia uma única instância do nginx

# cria um Job que exibe "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# cria um CronJob que exibe "Hello World" a cada minuto
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # obtém a documentação de manifesto do pod

# Cria vários objetos YAML a partir de stdin
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# Cria um segredo com várias chaves
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## Visualizando e localizando recursos

```bash
# Comandos get com saída simples
kubectl get services                          # Lista todos os serviços do namespace
kubectl get pods --all-namespaces             # Lista todos os Pods em todos namespaces
kubectl get pods -o wide                      # Lista todos os Pods no namespace atual, com mais detalhes
kubectl get deployment my-dep                 # Lista um deployment específico
kubectl get pods                              # Lista todos os Pods no namespace
kubectl get pod my-pod -o yaml                # Obtém o YAML de um pod

# Comandos describe com saída detalhada
kubectl describe nodes my-node
kubectl describe pods my-pod

# Lista serviços classificados por nome
kubectl get services --sort-by=.metadata.name

# Lista Pods classificados por contagem de reinicializações
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Lista PersistentVolumes classificados por capacidade
kubectl get pv --sort-by=.spec.capacity.storage

# Obtém a versão da label de todos os Pods com a label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Recupera o valor de uma chave com pontos, por exemplo 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# Recupera um valor codificado em base64 com traços em vez de sublinhados
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# Obtém todos os nós workers (use um seletor para excluir resultados que possuem uma label
# nomeado 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Obtém todos os Pods em execução no namespace
kubectl get pods --field-selector=status.phase=Running

# Obtém ExternalIPs de todos os nós
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Lista nomes de Pods pertencentes a um RC particular
# O comando "jq" é útil para transformações que são muito complexas para jsonpath, pode ser encontrado em https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Exibe marcadores para todos os Pods (ou qualquer outro objeto Kubernetes que suporte rotulagem)
kubectl get pods --show-labels

# Verifica quais nós estão prontos
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Exibe o segredo decodificado sem utilizar ferramentas externas
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# Lista todos os segredos atualmente em uso por um pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Lista todos os containerIDs de initContainer de todos os Pods
# Útil ao limpar contêineres parados, evitando a remoção de initContainers.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Lista eventos classificados por timestamp
kubectl get events --sort-by=.metadata.creationTimestamp

# Lista todos eventos do tipo Warning
kubectl events --types=Warning

# Compara o estado atual do cluster com o estado em que o cluster estaria se o manifesto fosse aplicado.
kubectl diff -f ./my-manifest.yaml

# Produz uma árvore delimitada por ponto de todas as chaves retornadas para nós
# Útil ao localizar uma chave em uma estrutura JSON aninhada complexa
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Produz uma árvore delimitada por ponto de todas as chaves retornadas para Pods, etc.
kubectl get pods -o json | jq -c 'paths|join(".")'

# Produz ENV para todos os Pods, supondo que você tenha um contêiner padrão para os Pods, namespace padrão e o comando `env` é compatível.
# Útil ao executar qualquer comando suportado em todos os Pods, não apenas `env`
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Obtém o status de um sub-recurso de uma implantação
kubectl get deployment nginx-deployment --subresource=status
```

## Atualizando recursos

```bash
kubectl set image deployment/frontend www=image:v2               # Aplica o rollout nos containers "www" do deployment "frontend", atualizando a imagem
kubectl rollout history deployment/frontend                      # Verifica o histórico do deployment, incluindo a revisão
kubectl rollout undo deployment/frontend                         # Rollback para o deployment anterior
kubectl rollout undo deployment/frontend --to-revision=2         # Rollback para uma revisão específica
kubectl rollout status -w deployment/frontend                    # Acompanha o status de atualização do "frontend" até sua conclusão sem interrupção 
kubectl rollout restart deployment/frontend                      # Reinicia contínuo do deployment "frontend"

cat pod.json | kubectl replace -f -                              # Substitue um pod com base no JSON passado para stdin

# Força a substituição, exclui e recria o recurso. Causará uma interrupção do serviço.
kubectl replace --force -f ./pod.json

# Cria um serviço para um nginx replicado, que serve na porta 80 e se conecta aos contêineres na porta 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Atualiza a versão da imagem (tag) de um pod de contêiner único para a v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Adiciona uma label
kubectl label pods my-pod new-label-                             # Remove a label new-label
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Adiciona uma anotação
kubectl autoscale deployment foo --min=2 --max=10                # Escala automaticamente um deployment "foo"
```

## Recursos de correção

```bash
# Atualiza parcialmente um nó
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Atualiza a imagem de um contêiner; spec.containers[*].name é obrigatório porque é uma chave de mesclagem
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Atualiza a imagem de um contêiner usando um patch json com matrizes posicionais
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Desativa um livenessProbe de deployment usando um patch json com matrizes posicionais
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Adiciona um novo elemento a uma matriz posicional
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Atualiza a contagem de réplicas de uma implantação corrigindo seu sub-recurso de escala
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## Editando recursos

Edita qualquer recurso da API no seu editor preferido.

```bash
kubectl edit svc/docker-registry                      # Edita o serviço chamado docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Usa um editor alternativo
```

## Escalando recursos

```bash
kubectl scale --replicas=3 rs/foo                                 # Escala um replicaset chamado 'foo' para 3
kubectl scale --replicas=3 -f foo.yaml                            # Escala um recurso especificado em "foo.yaml" para 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Se o tamanho atual do deployment chamado mysql for 2, escala para 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Escala vários controladores de replicaset
```

## Deletando resources

```bash
kubectl delete -f ./pod.json                                              # Exclui um Pod usando o tipo e o nome especificados em pod.json
kubectl delete pod unwanted --now                          ........       # Exclui um Pod imediatamente sem esperar pelo tempo configurado
kubectl delete pod,service baz foo                                        # Exclui Pods e serviços com os mesmos nomes "baz" e "foo"
kubectl delete pods,services -l name=myLabel                              # Exclui Pods e serviços com o nome da label = myLabel
kubectl -n my-ns delete pod,svc --all                                     # Exclui todos os Pods e serviços no namespace my-ns,
# Exclui todos os Pods que correspondem ao awk pattern1 ou pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Interagindo com Pods em execução

```bash
kubectl logs my-pod                                 # despeja logs de pod (stdout)
kubectl logs -l name=myLabel                        # despeja logs de pod, com a label de name=myLabel (stdout)
kubectl logs my-pod --previous                      # despeja logs de pod (stdout) para a instância anterior de um contêiner
kubectl logs my-pod -c my-container                 # despeja logs de um específico contêiner em um pod (stdout, no caso de vários contêineres)
kubectl logs -l name=myLabel -c my-container        # despeja logs de pod, com nome da label = myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # despeja logs de um contêiner específico em um pod (stdout, no caso de vários contêineres) para uma instanciação anterior de um contêiner
kubectl logs -f my-pod                              # Fluxo de logs de pod (stdout)
kubectl logs -f my-pod -c my-container              # Fluxo de logs para um específico contêiner em um pod (stdout, caixa com vários contêineres)
kubectl logs -f -l name=myLabel --all-containers    # transmite todos os logs de Pods com a label name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # Executa pod como shell interativo
kubectl run nginx --image=nginx -n mynamespace      # Inicia uma única instância do pod nginx no namespace de mynamespace
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
                                                    # Gera a especificação para executar o pod nginx e grave-a em um arquivo chamado pod.yaml 
kubectl attach my-pod -i                            # Anexa ao contêiner em execução
kubectl port-forward my-pod 5000:6000               # Ouça na porta 5000 na máquina local e encaminhe para a porta 6000 no my-pod
kubectl exec my-pod -- ls /                         # Executa comando no pod existente (1 contêiner)
kubectl exec --stdin --tty my-pod -- /bin/sh        # Acesso de shell interativo a um pod em execução (apenas 1 contêiner)
kubectl exec my-pod -c my-container -- ls /         # Executa comando no pod existente (pod com vários contêineres)
kubectl top pod POD_NAME --containers               # Mostra métricas para um determinado pod e seus contêineres
kubectl top pod POD_NAME --sort-by=cpu              # Mostra métricas para um determinado pod e classificá-lo por 'cpu' ou 'memória'
```

## Copiando arquivos e diretórios de e para contêineres

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # Copia o diretório local /tmp/foo_dir para /tmp/bar_dir em um pod remoto no namespace atual
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto em um contêiner específico
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto no namespace my-namespace
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # Copia /tmp/foo de um pod remoto para /tmp/bar localmente
```
{{< note >}}
`kubectl cp` requer que o binário 'tar' esteja presente em sua imagem de contêiner. Se 'tar' não estiver presente, `kubectl cp` falhará.
Para casos de uso avançado, como links simbólicos, expansão curinga ou preservação do modo de arquivo, considere usar `kubectl exec`.
{{< /note >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto no namespace my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # Copia /tmp/foo de um pod remoto para /tmp/bar localmente
```

## Interagindo com implantações e serviços

```bash
kubectl logs deploy/my-deployment                         # despeja logs de pod para uma implantação (caso de contêiner único)
kubectl logs deploy/my-deployment -c my-container         # despeja logs de pod para uma implantação (caso de vários contêineres)

kubectl port-forward svc/my-service 5000                  # escuta na porta local 5000 e encaminhe para a porta 5000 no back-end do serviço
kubectl port-forward svc/my-service 5000:my-service-port  # escuta na porta local 5000 e encaminhe para a porta de destino do serviço com o nome <my-service-port>

kubectl port-forward deploy/my-deployment 5000:6000       # escuta na porta local 5000 e encaminhe para a porta 6000 em um pod criado por <my-deployment>
kubectl exec deploy/my-deployment -- ls                   # executa o comando no primeiro pod e primeiro contêiner na implantação (casos de um ou vários contêineres)
```

## Interagindo com Nós e Cluster

```bash
kubectl cordon my-node                                                # Marca o nó my-node como não agendável
kubectl drain my-node                                                 # Drena o nó my-node na preparação para manutenção
kubectl uncordon my-node                                              # Marca nó my-node como agendável
kubectl top node my-node                                              # Mostra métricas para um determinado nó
kubectl cluster-info                                                  # Exibe endereços da master e serviços
kubectl cluster-info dump                                             # Despeja o estado atual do cluster no stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Despeja o estado atual do cluster em /path/to/cluster-state

# Veja os taints existentes nos nós atuais.
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# Se uma `taint` com essa chave e efeito já existir, seu valor será substituído conforme especificado.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Tipos de Recursos

Lista todos os tipos de recursos suportados junto com seus nomes abreviados, [grupo de API](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), sejam eles [namespaced](/docs/concepts/overview/working-with-objects/namespaces) e [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Outras operações para explorar os recursos da API:

```bash
kubectl api-resources --namespaced=true      # Todos os recursos com namespace
kubectl api-resources --namespaced=false     # Todos os recursos sem namespace
kubectl api-resources -o name                # Todos os recursos com saída simples (apenas o nome do recurso)
kubectl api-resources -o wide                # Todos os recursos com saída expandida (também conhecida como "ampla")
kubectl api-resources --verbs=list,get       # Todos os recursos que suportam os verbos de API "list" e "get"
kubectl api-resources --api-group=extensions # Todos os recursos no grupo de API "extensions"
```

### Formatação de saída

Para enviar detalhes para a janela do terminal em um formato específico, adicione a flag `-o` (ou `--output`) para um comando `kubectl` suportado.

Formato de saída | Descrição
--------------| -----------
`-o=custom-columns=<spec>` | Exibe uma tabela usando uma lista separada por vírgula de colunas personalizadas
`-o=custom-columns-file=<filename>` | Exibe uma tabela usando o modelo de colunas personalizadas no arquivo `<nome do arquivo>`
`-o=json`     | Saída de um objeto de API formatado em JSON
`-o=jsonpath=<template>` | Exibe os campos definidos em uma expressão [jsonpath](/docs/reference/kubectl/jsonpath) 
`-o=jsonpath-file=<filename>` | Exibe os campos definidos pela expressão [jsonpath](/docs/reference/kubectl/jsonpath) no arquivo `<nome do arquivo>`
`-o=name`     | Exibe apenas o nome do recurso e nada mais
`-o=wide`     | Saída no formato de texto sem formatação com qualquer informação adicional e, para Pods, o nome do nó está incluído
`-o=yaml`     | Saída de um objeto de API formatado em YAML

Exemplos usando `-o=custom-columns`:

```bash
# Todas as imagens em execução em um cluster
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# Todas as imagens em execução no namespace: padrão, agrupadas por pod
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

 # Todas as imagens excluindo "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# Todos os campos sob metadados, independentemente do nome
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

Mais exemplos na [documentação de referência](/docs/reference/kubectl/#custom-columns) do kubectl.

### Verbosidade de saída do Kubectl e depuração

A verbosidade do Kubectl é controlado com as flags `-v` ou` --v` seguidos por um número inteiro representando o nível do log. As convenções gerais de log do Kubernetes e os níveis de log associados são descritos [aqui](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Verbosidade | Descrição
--------------| -----------
`--v=0` | Geralmente útil para *sempre* estar visível para um operador de cluster.
`--v=1` | Um nível de log padrão razoável se você não deseja verbosidade.
`--v=2` | Informações úteis sobre o estado estacionário sobre o serviço e mensagens importantes de log que podem se correlacionar com alterações significativas no sistema. Este é o nível de log padrão recomendado para a maioria dos sistemas.
`--v=3` | Informações estendidas sobre alterações.
`--v=4` | Detalhamento no nível de debugging.
`--v=5` | Verbosidade do nível de rastreamento.
`--v=6` | Exibe os recursos solicitados.
`--v=7` | Exibe cabeçalhos de solicitação HTTP.
`--v=8` | Exibe conteúdo da solicitação HTTP.
`--v=9` | Exibe o conteúdo da solicitação HTTP sem o truncamento do conteúdo.

## {{% heading "whatsnext" %}}

* Leia a [visão geral do kubectl](/docs/reference/kubectl/) e aprenda sobre [JsonPath](/docs/reference/kubectl/jsonpath).

* Veja as opções do [kubectl](/docs/reference/kubectl/kubectl/).

* Leia as [Convenções de uso do kubectl](/docs/reference/kubectl/conventions/) para entender como usá-lo em scripts reutilizáveis.

* Ver mais comunidade [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).
