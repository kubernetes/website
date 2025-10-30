---
title: Referência Rápida do kubectl
content_type: concept
weight: 10 # highlight it
card:
  name: tasks
  weight: 10
---

<!-- overview -->

Esta página contém uma lista de comandos e flags do `kubectl` comumente utilizados.

{{< note >}}
Essas instruções são para o Kubernetes v{{< skew currentVersion >}}. Para verificar a versão, use o comando `kubectl version`.
{{< /note >}}
<!-- body -->

## Autocompletar do kubectl

### BASH

```bash
source <(kubectl completion bash) # configura o autocompletar no bash para o shell atual, o pacote bash-completion deve ser instalado primeiro.
echo "source <(kubectl completion bash)" >> ~/.bashrc # adiciona o autocompletar permanentemente ao seu shell bash.
```

Você também pode usar um alias abreviado para `kubectl` que também funciona com o completion:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # configura o autocompletar no zsh para o shell atual
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # adiciona o autocompletar permanentemente ao seu shell zsh
```

### FISH

{{< note >}}
Requer a versão 1.23 ou superior do kubectl.
{{< /note >}}

```bash
echo 'kubectl completion fish | source' > ~/.config/fish/completions/kubectl.fish && source ~/.config/fish/completions/kubectl.fish
```

### Uma observação sobre `--all-namespaces`

Adicionar `--all-namespaces` acontece com frequência suficiente para que você deva estar ciente da abreviação para `--all-namespaces`:

```kubectl -A```

## Contexto e configuração do kubectl

Define com qual cluster Kubernetes o `kubectl` se comunica e modifica as informações de configuração.
Consulte a documentação [Autenticando entre Clusters com kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
para informações detalhadas sobre o arquivo de configuração.

```bash
kubectl config view # Mostra as configurações mescladas do kubeconfig.

# usa múltiplos arquivos kubeconfig ao mesmo tempo e visualiza a configuração mesclada
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# Mostra as configurações mescladas do kubeconfig e dados brutos de certificado e segredos expostos
kubectl config view --raw 

# obtém a senha para o usuário e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

# obtém o certificado para o usuário e2e
kubectl config view --raw -o jsonpath='{.users[?(.name == "e2e")].user.client-certificate-data}' | base64 -d

kubectl config view -o jsonpath='{.users[].name}'    # exibe o primeiro usuário
kubectl config view -o jsonpath='{.users[*].name}'   # obtém uma lista de usuários
kubectl config get-contexts                          # exibe a lista de contextos
kubectl config get-contexts -o name                  # obtém todos os nomes de contexto
kubectl config current-context                       # exibe o contexto atual
kubectl config use-context my-cluster-name           # define o contexto padrão como my-cluster-name

kubectl config set-cluster my-cluster-name           # define uma entrada de cluster no kubeconfig

# configura a URL para um servidor proxy a ser usado para requisições feitas por este cliente no kubeconfig
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# adiciona um novo usuário ao seu kubeconf que suporta autenticação básica
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# salva permanentemente o namespace para todos os comandos kubectl subsequentes naquele contexto.
kubectl config set-context --current --namespace=ggckad-s2

# define um contexto utilizando um nome de usuário e namespace específicos.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # exclui o usuário foo

# alias abreviado para definir/mostrar contexto/namespace (funciona apenas para bash e shells compatíveis com bash, o contexto atual deve ser definido antes de usar kn para definir o namespace)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## Kubectl apply

O `apply` gerencia aplicações por meio de arquivos que definem recursos do Kubernetes.
Ele cria e atualiza recursos em um cluster executando `kubectl apply`. Esta é a forma
recomendada de gerenciar aplicações Kubernetes em produção. Consulte [Kubectl Book](https://kubectl.docs.kubernetes.io).

## Criando objetos

Os manifestos do Kubernetes podem ser definidos em YAML ou JSON.
As extensões de arquivo `.yaml`, `.yml` e `.json` podem ser utilizadas.

```bash
kubectl apply -f ./my-manifest.yaml                 # cria recurso(s)
kubectl apply -f ./my1.yaml -f ./my2.yaml           # cria a partir de múltiplos arquivos
kubectl apply -f ./dir                              # cria recurso(s) em todos os arquivos de manifesto no diretório
kubectl apply -f https://example.com/manifest.yaml  # cria recurso(s) a partir de url (Nota: este é um domínio de exemplo e não contém um manifesto válido)
kubectl create deployment nginx --image=nginx       # inicia uma única instância do nginx

# cria um Job que imprime "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# cria uma CronJob que imprime "Hello World" a cada minuto
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # obtém a documentação para manifestos de pod

# Cria múltiplos objetos YAML a partir do stdin
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
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
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# Cria um secret com várias chaves
kubectl apply -f - <<EOF
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

## Visualizando e encontrando recursos

```bash
# Comandos get com saída básica
kubectl get services                          # Lista todos os services no namespace
kubectl get pods --all-namespaces             # Lista todos os pods em todos os namespaces
kubectl get pods -o wide                      # Lista todos os pods no namespace atual, com mais detalhes
kubectl get deployment my-dep                 # Lista um deployment específico
kubectl get pods                              # Lista todos os pods no namespace
kubectl get pod my-pod -o yaml                # Obtém o YAML de um pod

# Comandos describe com saída detalhada
kubectl describe nodes my-node
kubectl describe pods my-pod

# Lista Services ordenados por nome
kubectl get services --sort-by=.metadata.name

# Lista pods ordenados por contagem de reinicializações
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Lista PersistentVolumes ordenados por capacidade
kubectl get pv --sort-by=.spec.capacity.storage

# Obtém o rótulo da versão de todos os pods com rótulo app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Recupera o valor de uma chave com pontos, ex.: 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# Recupera um valor codificado em base64 com hífens em vez de sublinhados (underscores).
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# Obtém todos os nós de processamento (usa um seletor para excluir resultados que têm um rótulo
# chamado 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Obtém todos os pods em execução no namespace
kubectl get pods --field-selector=status.phase=Running

# Obtém ExternalIPs de todos os nós
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Lista nomes de Pods que pertencem a um RC específico
# O comando "jq" é útil para transformações complexas demais para jsonpath, pode ser encontrado em https://jqlang.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Mostra rótulos para todos os pods (ou qualquer outro objeto Kubernetes que suporte rotulagem)
kubectl get pods --show-labels

# Verifica quais nós estão prontos
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Verifica quais nós estão prontos com custom-columns
kubectl get node -o custom-columns='NODE_NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].status'

# Saída de secrets decodificados sem ferramentas externas
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# Lista todos os Secrets atualmente em uso por um pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Lista todos os containerIDs de initContainer de todos os pods
# Útil ao limpar contêineres parados, evitando a remoção de initContainers.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Lista eventos ordenados por timestamp
kubectl get events --sort-by=.metadata.creationTimestamp

# Lista todos os eventos de aviso
kubectl events --types=Warning

# Compara o estado atual do cluster com o estado em que o cluster estaria se o manifesto fosse aplicado.
kubectl diff -f ./my-manifest.yaml

# Produz uma árvore delimitada por pontos de todas as chaves retornadas para nós
# Útil ao localizar uma chave dentro de uma estrutura JSON aninhada complexa
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Produz uma árvore delimitada por pontos de todas as chaves retornadas para pods, etc
kubectl get pods -o json | jq -c 'paths|join(".")'

# Produz ENV para todos os pods, assumindo que você tem um contêiner padrão para os pods, namespace padrão e o comando `env` é suportado.
# Útil ao executar qualquer comando suportado em todos os pods, não apenas `env`
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Obtém o subrecurso status de um deployment
kubectl get deployment nginx-deployment --subresource=status
```

## Atualizando recursos

```bash
kubectl set image deployment/frontend www=image:v2                # Atualização gradual dos contêineres "www" do deployment "frontend", atualizando a imagem
kubectl rollout history deployment/frontend                       # Verifica o histórico de deployments incluindo a revisão
kubectl rollout undo deployment/frontend                          # Reverte para o deployment anterior
kubectl rollout undo deployment/frontend --to-revision=2          # Reverte para uma revisão específica
kubectl rollout status -w deployment/frontend                     # Observa o status da atualização gradual do deployment "frontend" até a conclusão
kubectl rollout restart deployment/frontend                       # Reinicialização gradual do deployment "frontend"


cat pod.json | kubectl replace -f -                               # Substitui um pod baseado no JSON passado para o stdin

# Substitui forçadamente, exclui e então recria o recurso. Causará uma interrupção do serviço.
kubectl replace --force -f ./pod.json

# Cria um Service para um nginx replicado, que serve na porta 80 e conecta aos contêineres na porta 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Atualiza a versão da imagem (tag) de um pod de contêiner único para v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                       # Adiciona um rótulo
kubectl label pods my-pod new-label-                              # Remove um rótulo
kubectl label pods my-pod new-label=new-value --overwrite         # Sobrescreve um valor existente
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq        # Adiciona uma anotação
kubectl annotate pods my-pod icon-url-                            # Remove anotação
kubectl autoscale deployment foo --min=2 --max=10                 # Escalonamento automático de um deployment "foo"
```

## Aplicando patches em recursos

```bash
# Atualiza parcialmente um nó
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Atualiza a imagem de um contêiner; spec.containers[*].name é obrigatório porque é uma chave de mesclagem
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Atualiza a imagem de um contêiner usando um json patch com arrays posicionais
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Desabilita uma verificação de operacionalidade de deployment usando um json patch com arrays posicionais
kubectl patch deployment valid-deployment --type json -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Adiciona um novo elemento a um array posicional
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Atualiza a contagem de réplicas de um deployment aplicando patch em seu subrecurso de escalonamento
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## Editando recursos

Edita qualquer recurso da API no seu editor preferido.

```bash
kubectl edit svc/docker-registry                      # Edita o Service chamado docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Usa um editor alternativo
```

## Escalonando recursos

```bash
kubectl scale --replicas=3 rs/foo                                 # Escalona um replicaset chamado 'foo' para 3
kubectl scale --replicas=3 -f foo.yaml                            # Escalona um recurso especificado em "foo.yaml" para 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Se o tamanho atual do deployment chamado mysql for 2, escalona mysql para 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Escalona múltiplos controladores de replicação
```

## Excluindo recursos

```bash
kubectl delete -f ./pod.json                                      # Exclui um pod usando o tipo e nome especificados no pod.json
kubectl delete pod unwanted --now                                 # Exclui um pod sem período de tolerância
kubectl delete pod,service baz foo                                # Exclui pods e services com os mesmos nomes "baz" e "foo"
kubectl delete pods,services -l name=myLabel                      # Exclui pods e services com o rótulo name=myLabel
kubectl -n my-ns delete pod,svc --all                             # Exclui todos os pods e services no namespace my-ns,
# Exclui todos os pods que correspondem ao padrão awk pattern1 ou pattern2
kubectl get pods -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs kubectl delete -n mynamespace pod
```

## Interagindo com Pods em execução

```bash
kubectl logs my-pod                                 # despeja logs do pod (stdout)
kubectl logs -l name=myLabel                        # despeja logs do pod, com rótulo name=myLabel (stdout)
kubectl logs my-pod --previous                      # despeja logs do pod (stdout) para uma instanciação anterior de um contêiner
kubectl logs my-pod -c my-container                 # despeja logs do contêiner do pod (stdout, caso multi-contêiner)
kubectl logs -l name=myLabel -c my-container        # despeja logs do contêiner do pod, com rótulo name=myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # despeja logs do contêiner do pod (stdout, caso multi-contêiner) para uma instanciação anterior de um contêiner
kubectl logs -f my-pod                              # transmite logs do pod (stdout)
kubectl logs -f my-pod -c my-container              # transmite logs do contêiner do pod (stdout, caso multi-contêiner)
kubectl logs -f -l name=myLabel --all-containers    # transmite todos os logs dos pods com rótulo name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # Executa pod como shell interativo
kubectl run nginx --image=nginx -n mynamespace      # Inicia uma única instância do pod nginx no namespace mynamespace
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
                                                    # Gera especificação para executar o pod nginx e escreve em um arquivo chamado pod.yaml
kubectl attach my-pod -i                            # Anexa ao contêiner em execução
kubectl port-forward my-pod 5000:6000               # Escuta na porta 5000 da máquina local e encaminha para a porta 6000 no my-pod
kubectl exec my-pod -- ls /                         # Executa comando em pod existente (caso de 1 contêiner)
kubectl exec --stdin --tty my-pod -- /bin/sh        # Acesso de shell interativo a um pod em execução (caso de 1 contêiner)
kubectl exec my-pod -c my-container -- ls /         # Executa comando em pod existente (caso multi-contêiner)
kubectl debug my-pod -it --image=busybox:1.28       # Cria uma sessão de depuração interativa dentro do pod existente e anexa imediatamente a ela
kubectl debug node/my-node -it --image=busybox:1.28 # Cria uma sessão de depuração interativa em um nó e anexa imediatamente a ela
kubectl top pod                                     # Mostra métricas para todos os pods no namespace padrão
kubectl top pod POD_NAME --containers               # Mostra métricas para um determinado pod e seus contêineres
kubectl top pod POD_NAME --sort-by=cpu              # Mostra métricas para um determinado pod e ordena por 'cpu' ou 'memory'
```
## Copiando arquivos e diretórios de e para contêineres

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # Copia o diretório local /tmp/foo_dir para /tmp/bar_dir em um pod remoto no namespace atual
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto em um contêiner específico
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto no namespace my-namespace
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # Copia /tmp/foo de um pod remoto para /tmp/bar localmente
```
{{< note >}}
O `kubectl cp` requer que o binário 'tar' esteja presente na sua imagem do contêiner. Se o 'tar' não estiver presente, o `kubectl cp` falhará.
Para casos de uso avançados, como links simbólicos, expansão de caracteres curinga ou preservação do modo de arquivo, considere usar o `kubectl exec`.
{{< /note >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # Copia o arquivo local /tmp/foo para /tmp/bar em um pod remoto no namespace my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # Copia /tmp/foo de um pod remoto para /tmp/bar localmente
```


## Interagindo com Deployments e Services
```bash
kubectl logs deploy/my-deployment                         # despeja logs do Pod para um Deployment (caso de contêiner único)
kubectl logs deploy/my-deployment -c my-container         # despeja logs do Pod para um Deployment (caso multi-contêiner)

kubectl port-forward svc/my-service 5000                  # escuta na porta local 5000 e encaminha para a porta 5000 no backend do Service
kubectl port-forward svc/my-service 5000:my-service-port  # escuta na porta local 5000 e encaminha para a porta de destino do Service com nome <my-service-port>

kubectl port-forward deploy/my-deployment 5000:6000       # escuta na porta local 5000 e encaminha para a porta 6000 em um Pod criado por <my-deployment>
kubectl exec deploy/my-deployment -- ls                   # executa comando no primeiro Pod e primeiro contêiner no Deployment (casos de contêiner único ou multi-contêiner)
```

## Interagindo com Nós e cluster

```bash
kubectl cordon my-node                                                # Marca my-node como não alocável
kubectl drain my-node                                                 # Drena my-node em preparação para manutenção
kubectl uncordon my-node                                              # Marca my-node como alocável
kubectl top node                                                      # Mostra métricas para todos os nós
kubectl top node my-node                                              # Mostra métricas para um determinado nó
kubectl cluster-info                                                  # Exibe endereços do master e services
kubectl cluster-info dump                                             # Despeja o estado atual do cluster para stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Despeja o estado atual do cluster para /path/to/cluster-state

# Visualiza taints existentes que existem nos nós atuais.
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# Se um taint com essa chave e efeito já existir, seu valor é substituído conforme especificado.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Tipos de recurso

Lista todos os tipos de recurso suportados junto com seus nomes abreviados,
[grupo de API](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning),
se eles são [namespaced](/docs/concepts/overview/working-with-objects/namespaces),
e [kind](/docs/concepts/overview/working-with-objects/):

```bash
kubectl api-resources
```

Outras operações para explorar recursos da API:

```bash
kubectl api-resources --namespaced=true      # Todos os recursos namespaced
kubectl api-resources --namespaced=false     # Todos os recursos não namespaced
kubectl api-resources -o name                # Todos os recursos com saída simples (apenas o nome do recurso)
kubectl api-resources -o wide                # Todos os recursos com saída expandida (também conhecida como "wide")
kubectl api-resources --verbs=list,get       # Todos os recursos que suportam os verbos de requisição "list" e "get"
kubectl api-resources --api-group=extensions # Todos os recursos no grupo de API "extensions"
```

### Formatando saída

Para exibir detalhes na janela do seu terminal em um formato específico,
adicione a flag `-o` (ou `--output`) a um comando `kubectl` compatível.

Formato de saída | Descrição
--------------| -----------
`-o=custom-columns=<spec>` | Imprime uma tabela usando uma lista separada por vírgulas de colunas personalizadas
`-o=custom-columns-file=<filename>` | Imprime uma tabela usando o modelo de colunas personalizadas no arquivo `<filename>`
`-o=go-template=<template>` | Imprime os campos definidos em um [template golang](https://pkg.go.dev/text/template)
`-o=go-template-file=<filename>` | Imprime os campos definidos pelo [template golang](https://pkg.go.dev/text/template) no arquivo `<filename>`
`-o=json` | Exibe um objeto de API formatado em JSON
`-o=jsonpath=<template>` | Imprime os campos definidos em uma expressão [jsonpath](/docs/reference/kubectl/jsonpath)
`-o=jsonpath-file=<filename>` | Imprime os campos definidos pela expressão [jsonpath](/docs/reference/kubectl/jsonpath) no arquivo `<filename>`
`-o=kyaml` | Exibe um objeto de API formatado em KYAML (alfa, requer a variável de ambiente `KUBECTL_KYAML="true"`). KYAML é um dialeto experimental específico do Kubernetes em YAML, e pode ser interpretado como YAML.
`-o=name` | Imprime apenas o nome do recurso e nada mais
`-o=wide` | Exibe no formato de texto simples com qualquer informação adicional, e para pods, o nome do nó é incluído
`-o=yaml` | Exibe um objeto de API formatado em YAML

Exemplos usando `-o=custom-columns`:

```bash
# Todas as imagens executando em um cluster
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# Todas as imagens executando no namespace: default, agrupadas por Pod
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

# Todas as imagens excluindo "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# Todos os campos sob metadata independentemente do nome
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

Mais exemplos na [documentação de referência](/docs/reference/kubectl/#custom-columns) do kubectl.

### Verbosidade de saída e depuração do kubectl

A verbosidade do kubectl é controlada com as flags `-v` ou `--v` seguidas por um inteiro
representando o nível de log. As convenções gerais de logging do Kubernetes e os níveis
de log associados são descritos [aqui](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Verbosidade | Descrição
--------------| -----------
`--v=0` | Geralmente útil para que isso seja *sempre* visível para um operador de cluster.
`--v=1` | Um nível de log padrão razoável se você não quiser verbosidade.
`--v=2` | Informações úteis de estado estável sobre o service e mensagens de log importantes que podem se correlacionar com mudanças significativas no sistema. Este é o nível de log padrão recomendado para a maioria dos sistemas.
`--v=3` | Informações estendidas sobre mudanças.
`--v=4` | Verbosidade de nível de depuração.
`--v=5` | Verbosidade de nível de rastreamento.
`--v=6` | Exibe recursos requisitados.
`--v=7` | Exibe cabeçalhos de requisição HTTP.
`--v=8` | Exibe conteúdos de requisição HTTP.
`--v=9` | Exibe conteúdos de requisição HTTP sem truncamento de conteúdos.

## {{% heading "whatsnext" %}}

* Leia a [visão geral do kubectl](/docs/reference/kubectl/) e aprenda sobre [JsonPath](/docs/reference/kubectl/jsonpath).

* Consulte as opções do [kubectl](/docs/reference/kubectl/kubectl/).

* Consulte as opções do [kuberc](/docs/reference/kubectl/kuberc).

* Leia também as [Convenções de Uso do kubectl](/docs/reference/kubectl/conventions/) para entender como usar o kubectl em scripts reutilizáveis.

* Veja mais [folhas de dicas do kubectl](https://github.com/dennyzhang/cheatsheet-kubernetes-A4) da comunidade.