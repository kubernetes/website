---
title: kubectl Cheat Sheet
reviewers:
- erictune
- krousey
- clove
content_type: concept
card:
  name: reference
  weight: 30
---

<!-- overview -->

Veja também: [Visão geral do Kubectl](/docs/reference/kubectl/overview/) e [JsonPath Guide](/docs/reference/kubectl/jsonpath).

Esta página é uma visão geral do comando `kubectl`.



<!-- body -->

# kubectl - Cheat Sheet

## Kubectl Autocomplete

### BASH

```bash
source <(kubectl completion bash) # configuração de autocomplete no bash do shell atual, o pacote bash-completion precisa ter sido instalado primeiro.
echo "source <(kubectl completion bash)" >> ~/.bashrc # para adicionar o autocomplete permanentemente no seu shell bash.
```

Você também pode usar uma abreviação para o atalho para `kubectl` que também funciona com o auto completar:

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # configuração para usar autocomplete no terminal zsh no shell atual
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # adicionar auto completar permanentemente para o seu shell zsh
```

##  Contexto e Configuração do Kubectl

Defina com qual cluster Kubernetes o `kubectl` se comunica e modifique os detalhes da configuração.
Veja a documentação [Autenticando entre clusters com o kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) para
informações detalhadas do arquivo de configuração.

```bash
kubectl config view # Mostrar configurações do kubeconfig mergeadas.

# use vários arquivos kubeconfig ao mesmo tempo e visualize a configuração mergeada
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 

kubectl config view

# obtenha a senha para o usuário e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # exibir o primeiro usuário
kubectl config view -o jsonpath='{.users[*].name}'   # obtenha uma lista de usuários
kubectl config get-contexts                          # exibir lista de contextos
kubectl config current-context                       # exibir o contexto atual
kubectl config use-context my-cluster-name           # defina o contexto padrão como my-cluster-name

# adicione um novo cluster ao seu kubeconfig que suporte autenticação básica
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# salve o namespace permanentemente para todos os comandos subsequentes do kubectl nesse contexto.
kubectl config set-context --current --namespace=ggckad-s2

# defina um contexto utilizando um nome de usuário e o namespace.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo                       # excluir usuário foo
```

## Aplicar
`apply` gerencia aplicações através de arquivos que definem os recursos do Kubernetes. Ele cria e atualiza recursos em um cluster através da execução `kubectl apply`.
Esta é a maneira recomendada de gerenciar aplicações Kubernetes em ambiente de produção. Veja a [documentação do Kubectl](https://kubectl.docs.kubernetes.io).

## Criando objetos

Manifestos Kubernetes podem ser definidos em YAML ou JSON. A extensão de arquivo `.yaml`,
`.yml`, e `.json` pode ser usado.

```bash
kubectl apply -f ./my-manifest.yaml            # criar recurso(s)
kubectl apply -f ./my1.yaml -f ./my2.yaml      # criar a partir de vários arquivos
kubectl apply -f ./dir                         # criar recurso(s) em todos os arquivos de manifesto no diretório
kubectl apply -f https://git.io/vPieo          # criar recurso(s) a partir de URL
kubectl create deployment nginx --image=nginx  # iniciar uma única instância do nginx
kubectl explain pods,svc                       # obtenha a documentação de manifesto do pod

# Crie vários objetos YAML a partir de stdin
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

# Crie um segredo com várias chaves
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

## Visualizando e Localizando Recursos

```bash
# Obter comandos com saída simples
kubectl get services                          # Listar todos os serviços do namespace
kubectl get pods --all-namespaces             # Listar todos os pods em todos namespaces
kubectl get pods -o wide                      # Listar todos os pods no namespace atual, com mais detalhes
kubectl get deployment my-dep                 # Listar um deployment específico
kubectl get pods                              # Listar todos os pods no namespace
kubectl get pod my-pod -o yaml                # Obter o YAML de um pod

# Descrever comandos com saída detalhada
kubectl describe nodes my-node
kubectl describe pods my-pod

# Listar serviços classificados por nome
kubectl get services --sort-by=.metadata.name

# Listar pods classificados por contagem de reinicializações
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Listar PersistentVolumes classificado por capacidade
kubectl get pv --sort-by=.spec.capacity.storage

# Obtenha a versão da label de todos os pods com a label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Obter todos os nós workers (use um seletor para excluir resultados que possuem uma label
# nomeado 'node-role.kubernetes.io/master')
kubectl get node --selector='!node-role.kubernetes.io/master'

# Obter todos os pods em execução no namespace
kubectl get pods --field-selector=status.phase=Running

# Obter ExternalIPs de todos os nós
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Listar nomes de pods pertencentes a um RC particular 
# O comando "jq" é útil para transformações que são muito complexas para jsonpath, pode ser encontrado em https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Mostrar marcadores para todos os pods(ou qualquer outro objeto Kubernetes que suporte rotulagem)
kubectl get pods --show-labels

# Verifique quais nós estão prontos
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Listar todos os segredos atualmente em uso por um pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Listar todos os containerIDs de initContainer de todos os pods
# Útil ao limpar contêineres parados, evitando a remoção de initContainers.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Listar eventos classificados por timestamp
kubectl get events --sort-by=.metadata.creationTimestamp

# Compara o estado atual do cluster com o estado em que o cluster estaria se o manifesto fosse aplicado.
kubectl diff -f ./my-manifest.yaml
```

## Atualizando Recursos

A partir da versão 1.11 `rolling-update` foi descontinuado (veja [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.11.md)), utilize o comando `rollout` no lugar deste.

```bash
kubectl set image deployment/frontend www=image:v2               # Aplica o rollout nos containers "www" do deployment "frontend", atualizando a imagem
kubectl rollout history deployment/frontend                      # Verifica o histórico do deployment, incluindo a revisão
kubectl rollout undo deployment/frontend                         # Rollback para o deployment anterior
kubectl rollout undo deployment/frontend --to-revision=2         # Rollback para uma revisão específica
kubectl rollout status -w deployment/frontend                    # Acompanhe o status de atualização do "frontend" até sua conclusão sem interrupção 
kubectl rollout restart deployment/frontend                      # Reinício contínuo do deployment "frontend"


# versão inicial descontinuada 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (descontinuada) Atualização contínua dos pods de frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (descontinuada) Altera o nome do recurso e atualiza a imagem
kubectl rolling-update frontend --image=image:v2                 # (descontinuada) Atualize a imagem dos pods do frontend
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (descontinuada) Interromper o lançamento existente em andamento

cat pod.json | kubectl replace -f -                              # Substitua um pod com base no JSON passado para std

# Força a substituição, exclui e recria o recurso. Causará uma interrupção do serviço.
kubectl replace --force -f ./pod.json

# Crie um serviço para um nginx replicado, que serve na porta 80 e se conecta aos contêineres na porta 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Atualizar a versão da imagem (tag) de um pod de contêiner único para a v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Adicionar uma label
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Adicionar uma anotação
kubectl autoscale deployment foo --min=2 --max=10                # Escalar automaticamente um deployment "foo"
```

## Recursos de Correção

```bash
# Atualizar parcialmente um nó
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Atualizar a imagem de um contêiner; spec.containers[*].name é obrigatório porque é uma chave de mesclagem
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Atualizar a imagem de um contêiner usando um patch json com matrizes posicionais
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Desative um livenessProbe de deployment usando um patch json com matrizes posicionais
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Adicionar um novo elemento a uma matriz posicional
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## Editando Recursos
Edite qualquer recurso da API no seu editor preferido.

```bash
kubectl edit svc/docker-registry                      # Edite o serviço chamado docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Use um editor alternativo
```

## Escalando Recursos

```bash
kubectl scale --replicas=3 rs/foo                                 # Escale um replicaset chamado 'foo' para 3
kubectl scale --replicas=3 -f foo.yaml                            # Escale um recurso especificado em "foo.yaml" para 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Se o tamanho atual do deployment chamado mysql for dois, assim escale para 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Escalar vários replicaset
```

## Exclusão de Recursos

```bash
kubectl delete -f ./pod.json                                              # Exclua um pod usando o tipo e o nome especificados em pod.json
kubectl delete pod,service baz foo                                        # Excluir pods e serviços com os mesmos nomes "baz" e "foo"
kubectl delete pods,services -l name=myLabel                              # Excluir pods e serviços com o nome da label = myLabel
kubectl -n my-ns delete pod,svc --all                                     # Exclua todos os pods e serviços no namespace my-ns,
# Excluir todos os pods que correspondem ao awk pattern1 ou pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Interagindo com Pods em execução

```bash
kubectl logs my-pod                                 # despejar logs de pod (stdout)
kubectl logs -l name=myLabel                        # despejar logs de pod, com a label de name=myLabel (stdout)
kubectl logs my-pod --previous                      # despejar logs de pod (stdout) para a instância anterior de um contêiner
kubectl logs my-pod -c my-container                 # despejar logs de um específico contêiner em um pod (stdout, no caso de vários contêineres)
kubectl logs -l name=myLabel -c my-container        # despejar logs de pod, com nome da label = myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # despejar logs de um contêiner específico em um pod (stdout, no caso de vários contêineres) para uma instanciação anterior de um contêiner
kubectl logs -f my-pod                              # Fluxo de logs de pod (stdout)
kubectl logs -f my-pod -c my-container              # Fluxo de logs para um específico contêiner em um pod (stdout, caixa com vários contêineres)
kubectl logs -f -l name=myLabel --all-containers    # transmitir todos os logs de pods com a label name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox -- sh  # Executar pod como shell interativo
kubectl run nginx --image=nginx --restart=Never -n 
mynamespace                                         # Execute o pod nginx em um namespace específico
kubectl run nginx --image=nginx --restart=Never     # Execute o pod nginx e salve suas especificações em um arquivo chamado pod.yaml
--dry-run -o yaml > pod.yaml

kubectl attach my-pod -i                            # Anexar ao contêiner em execução
kubectl port-forward my-pod 5000:6000               # Ouça na porta 5000 na máquina local e encaminhe para a porta 6000 no my-pod
kubectl exec my-pod -- ls /                         # Executar comando no pod existente (1 contêiner)
kubectl exec my-pod -c my-container -- ls /         # Executar comando no pod existente (pod com vários contêineres)
kubectl top pod POD_NAME --containers               # Mostrar métricas para um determinado pod e seus contêineres
```

## Interagindo com Nós e Cluster

```bash
kubectl cordon my-node                                                # Marcar o nó my-node como não agendável
kubectl drain my-node                                                 # Drene o nó my-node na preparação para manutenção
kubectl uncordon my-node                                              # Marcar nó my-node como agendável
kubectl top node my-node                                              # Mostrar métricas para um determinado nó
kubectl cluster-info                                                  # Exibir endereços da master e serviços
kubectl cluster-info dump                                             # Despejar o estado atual do cluster no stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Despejar o estado atual do cluster em /path/to/cluster-state

# Se uma `taint` com essa chave e efeito já existir, seu valor será substituído conforme especificado.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Tipos de Recursos

Listar todos os tipos de recursos suportados, juntamente com seus nomes abreviados, [Grupo de API](/docs/concepts/overview/kubernetes-api/#api-groups), se eles são por [namespaces](/docs/concepts/overview/working-with-objects/namespaces), e [objetos](/docs/concepts/overview/working-with-objects/kubernetes-objects):

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

### Formatação de Saída

Para enviar detalhes para a janela do terminal em um formato específico, adicione a flag `-o` (ou `--output`) para um comando `kubectl` suportado.

Formato de saída | Descrição
--------------| -----------
`-o=custom-columns=<spec>` | Imprimir uma tabela usando uma lista separada por vírgula de colunas personalizadas
`-o=custom-columns-file=<filename>` | Imprima uma tabela usando o modelo de colunas personalizadas no arquivo `<nome do arquivo>`
`-o=json`     | Saída de um objeto de API formatado em JSON
`-o=jsonpath=<template>` | Imprima os campos definidos em uma expressão [jsonpath](/docs/reference/kubectl/jsonpath) 
`-o=jsonpath-file=<filename>` | Imprima os campos definidos pela expressão [jsonpath](/docs/reference/kubectl/jsonpath) no arquivo `<nome do arquivo>`
`-o=name`     | Imprima apenas o nome do recurso e nada mais
`-o=wide`     | Saída no formato de texto sem formatação com qualquer informação adicional e, para pods, o nome do nó está incluído
`-o=yaml`     | Saída de um objeto de API formatado em YAML

### Verbosidade da Saída do Kubectl e Debugging

A verbosidade do Kubectl é controlado com os sinalizadores `-v` ou` --v` seguidos por um número inteiro representando o nível do log. As convenções gerais de log do Kubernetes e os níveis de log associados são descritos [aqui](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Verbosidade | Descrição
--------------| -----------
`--v=0` | Geralmente útil para *sempre* estar visível para um operador de cluster.
`--v=1` | Um nível de log padrão razoável se você não deseja verbosidade.
`--v=2` | Informações úteis sobre o estado estacionário sobre o serviço e mensagens importantes de log que podem se correlacionar com alterações significativas no sistema. Este é o nível de log padrão recomendado para a maioria dos sistemas.
`--v=3` | Informações estendidas sobre alterações.
`--v=4` | Detalhamento no nível de debugging.
`--v=6` | Exibir os recursos solicitados.
`--v=7` | Exibir cabeçalhos de solicitação HTTP.
`--v=8` | Exibir conteúdo da solicitação HTTP.
`--v=9` | Exiba o conteúdo da solicitação HTTP sem o truncamento do conteúdo.



## {{% heading "whatsnext" %}}


* Saiba mais em [Visão geral do kubectl](/docs/reference/kubectl/overview/).

* Veja as opções do [kubectl](/docs/reference/kubectl/kubectl/).

* Veja as [Convenções de uso do kubectl](/docs/reference/kubectl/conventions/) para entender como usá-lo em scripts reutilizáveis.

* Ver mais comunidade [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).


