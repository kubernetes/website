---
title: kubectl Cheat Sheet
reviewers:
- erictune
- krousey
- clove
content_template: templates/concept
card:
  name: reference
  weight: 30
---

{{% capture overview %}}

Veja também: [Visão geral do Kubectl](/docs/reference/kubectl/overview/) e [JsonPath Guide](/docs/reference/kubectl/jsonpath).
git h
Esta página é uma visão geral do comando `kubectl`.

{{% /capture %}}

{{% capture body %}}

# kubectl - Cheat Sheet

## Kubectl Autocomplete

### BASH

```bash
source <(kubectl completion bash) # configuração de autocomplete no bash do shell atual, o pacote bash-completion precisa ter sido instalado primeiro should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # para adicionar o autocomplete permanentemente para o seu shell bash.
```

Você também pode usar um apelido abreviado para `kubectl` que também funciona com o autocomplete:

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # configuração autocomplete no terminal zsh no shell atual
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # adicionar autocomplete permanentemente para o seu shell zsh
```

## Kubectl Contexto e configuração

Defina com qual cluster do Kubernetes o `kubectl` se comunica e modifique a informação da configuração.
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

# adicione um novo cluster ao seu kubeconf que suporte autenticação básica
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

#salve o namespace permanentemente para todos os comandos subsequentes do kubectl nesse contexto.
kubectl config set-context --current --namespace=ggckad-s2

# defina um contexto utilizando um nome de usuário e o namespace.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo                       # excluir usuário foo
```

## Aplique
`apply` gerencia aplicativos através de arquivos que definem os recursos do Kubernetes. Ele cria e atualiza recursos em um cluster através da execução `kubectl apply`.
Esta é a maneira recomendada de gerenciar aplicativos Kubernetes em ambiente de produção. Veja [Livro Kubectl](https://kubectl.docs.kubernetes.io).

## Criando objetos

Manifestos Kubernetes podem ser definidos em YAML ou JSON. A extensão do arquivo `.yaml`,
`.yml`, e `.json` pode ser usado.

```bash
kubectl apply -f ./my-manifest.yaml            # criar recurso (s)
kubectl apply -f ./my1.yaml -f ./my2.yaml      # criar a partir de vários arquivos
kubectl apply -f ./dir                         # criar recurso (s) em todos os arquivos de manifesto no diretório
kubectl apply -f https://git.io/vPieo          # criar recurso (s) a partir de URL
kubectl create deployment nginx --image=nginx  # iniciar uma única instância do nginx
kubectl explain pods,svc                       # obtenha a documentação para pod e svc

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

## Vendo, localizando recursos

```bash
# Obter comandos com saída básica
kubectl get services                          # Listar todos os serviços do namespace
kubectl get pods --all-namespaces             # Listar todos os pods em todos namespaces
kubectl get pods -o wide                      # Listar todos os pods no atual namespace, com mais detalhes
kubectl get deployment my-dep                 # Listar uma implantação específica
kubectl get pods                              # Listar todos os pods no namespace
kubectl get pod my-pod -o yaml                # Obter o YAML de um pod
kubectl get pod my-pod -o yaml --export       # Obtenha o YAML de um pod sem informações específicas do cluster

# Descrever comandos com saída detalhada
kubectl describe nodes my-node
kubectl describe pods my-pod

# Listar serviços classificados por nome
kubectl get services --sort-by=.metadata.name

# Listar pods classificados por contagem de reinicializações
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Lista PersistentVolumes classificado por capacidade
kubectl get pv --sort-by=.spec.capacity.storage

# Obtenha a versão do rótulo de todos os pods com o rótulo app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Obter todos os nós dos workers  (use um seletor para excluir resultados que possuem um rótulo
# nomeado 'node-role.kubernetes.io/master')
kubectl get node --selector='!node-role.kubernetes.io/master'

# Obter todos os pods em execução no espaço para nome
kubectl get pods --field-selector=status.phase=Running

# Obter ExternalIPs de todos os nós
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Listar nomes de pods pertencentes a um particular RC
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

# Listar eventos classificados por carimbo de data / hora
kubectl get events --sort-by=.metadata.creationTimestamp

# Compara o estado atual do cluster com o estado em que o cluster estaria se o manifesto fosse aplicado.
kubectl diff -f ./my-manifest.yaml
```

## Atualizando recursos

A partir da versão 1.11 `rolling-update` foi descontinuado (veja [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.11.md)), utilize o comando `rollout` no lugar deste.

```bash
kubectl set image deployment/frontend www=image:v2               # Aplica o atualização contínua nos containers "www" do deployment "frontend", atualizando a imagem
kubectl rollout history deployment/frontend                      # Verifique o histórico de implantações, incluindo a revisão
kubectl rollout undo deployment/frontend                         # Rollback para a implantação anterior
kubectl rollout undo deployment/frontend --to-revision=2         # Rollback para uma revisão específica
kubectl rollout status -w deployment/frontend                    # Assista ao status do atualização sem interrupçãoe do "front-end" até a conclusão
kubectl rollout restart deployment/frontend                      # Reinício contínuo da implantação "front-end"


# versão inicial descontinuada 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (descontinuada) Atualização contínua dos pods de frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (descontinuada) altere o nome do recurso e atualize a imagem
kubectl rolling-update frontend --image=image:v2                 # (descontinuada) Atualize a imagem dos pods do frontend
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (descontinuada) Interromper o lançamento existente em andamento

cat pod.json | kubectl replace -f -                              # Substitua um pod com base no JSON passado para std

# Forçar o update, excluir e recriar o recurso. Causará uma interrupção do serviço.
kubectl replace --force -f ./pod.json

# Crie um serviço para um nginx replicado, que serve na porta 80 e se conecta aos contêineres na porta 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Atualizar a versão da imagem (tag) de um pod de contêiner único para a v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Adicionar um rótulo
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Adicionar uma anotação
kubectl autoscale deployment foo --min=2 --max=10                # Escalar automaticamente uma implantação "foo"
```

## Recursos de correção

```bash
# Atualizar parcialmente um nó
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Atualizar a imagem de um contêiner; spec.containers[*].name é obrigatório porque é uma chave de mesclagem
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Atualizar a imagem de um contêiner usando um patch json com matrizes posicionais
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

#Desative um livenessProbe de implantação usando um patch json com matrizes posicionais
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

## Escalando recursos

```bash
kubectl scale --replicas=3 rs/foo                                 # Escale um replicaset chamado 'foo' para 3
kubectl scale --replicas=3 -f foo.yaml                            # Escale um recurso especifico em "foo.yaml" para 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Se o tamanho atual do deployment chamado mysql for dois, assim escale para 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Escalar vários replicaset
```

## Exclusão de recursos

```bash
kubectl delete -f ./pod.json                                              # Exclua um pod usando o tipo e o nome especificados em pod.json
kubectl delete pod,service baz foo                                        # Excluir pods e serviços com os mesmos nomes "baz" e "foo"
kubectl delete pods,services -l name=myLabel                              # Excluir pods e serviços com o nome da label = myLabel
kubectl -n my-ns delete pod,svc --all                                     # Exclua todos os pods e serviços no namespace my-ns,
# Excluir todos os pods que correspondem ao awk pattern1 ou pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Interagindo com a execução de Pods

```bash
kubectl logs my-pod                                 # despejar logs de pod (stdout)
kubectl logs -l name=myLabel                        # despejar logs de pod, com nome da label = myLabel (stdout)
kubectl logs my-pod --previous                      # despejar logs de pod (stdout) para a instancia anterior de um contêiner
kubectl logs my-pod -c my-container                 # despejar logs de um específico contêiner em um pod (stdout, no caso de vários contêineres)
kubectl logs -l name=myLabel -c my-container        # despejar logs de pod, com nome da label = myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # despejar logs de um específico contêiner em um pod (stdout, no caso de vários contêineres) para uma instanciação anterior de um contêiner
kubectl logs -f my-pod                              # Fluxo de logs de pod (stdout)
kubectl logs -f my-pod -c my-container              # Fluxo de logs para um específico contêiner em um pod (stdout, caixa com vários contêineres)
kubectl logs -f -l name=myLabel --all-containers    # transmitir todos os logs de pods com nome da label = myLabel (stdout)
kubectl run -i --tty busybox --image=busybox -- sh  # Executar pod como shell interativo
kubectl run nginx --image=nginx --restart=Never -n 
mynamespace                                         # Run pod nginx in a specific namespace
kubectl run nginx --image=nginx --restart=Never     # Run pod nginx and write its spec into a file called pod.yaml
--dry-run -o yaml > pod.yaml

kubectl attach my-pod -i                            # Attach to Running Container
kubectl port-forward my-pod 5000:6000               # Listen on port 5000 on the local machine and forward to port 6000 on my-pod
kubectl exec my-pod -- ls /                         # Run command in existing pod (1 container case)
kubectl exec my-pod -c my-container -- ls /         # Run command in existing pod (multi-container case)
kubectl top pod POD_NAME --containers               # Show metrics for a given pod and its containers
```

## Interacting with Nodes and Cluster

```bash
kubectl cordon my-node                                                # Mark my-node as unschedulable
kubectl drain my-node                                                 # Drain my-node in preparation for maintenance
kubectl uncordon my-node                                              # Mark my-node as schedulable
kubectl top node my-node                                              # Show metrics for a given node
kubectl cluster-info                                                  # Display addresses of the master and services
kubectl cluster-info dump                                             # Dump current cluster state to stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Dump current cluster state to /path/to/cluster-state

# If a taint with that key and effect already exists, its value is replaced as specified.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Resource types

List all supported resource types along with their shortnames, [API group](/docs/concepts/overview/kubernetes-api/#api-groups), whether they are [namespaced](/docs/concepts/overview/working-with-objects/namespaces), and [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Other operations for exploring API resources:

```bash
kubectl api-resources --namespaced=true      # All namespaced resources
kubectl api-resources --namespaced=false     # All non-namespaced resources
kubectl api-resources -o name                # All resources with simple output (just the resource name)
kubectl api-resources -o wide                # All resources with expanded (aka "wide") output
kubectl api-resources --verbs=list,get       # All resources that support the "list" and "get" request verbs
kubectl api-resources --api-group=extensions # All resources in the "extensions" API group
```

### Formatting output

To output details to your terminal window in a specific format, add the `-o` (or `--output`) flag to a supported `kubectl` command.

Output format | Description
--------------| -----------
`-o=custom-columns=<spec>` | Print a table using a comma separated list of custom columns
`-o=custom-columns-file=<filename>` | Print a table using the custom columns template in the `<filename>` file
`-o=json`     | Output a JSON formatted API object
`-o=jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/reference/kubectl/jsonpath) expression
`-o=jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/reference/kubectl/jsonpath) expression in the `<filename>` file
`-o=name`     | Print only the resource name and nothing else
`-o=wide`     | Output in the plain-text format with any additional information, and for pods, the node name is included
`-o=yaml`     | Output a YAML formatted API object

### Kubectl output verbosity and debugging

Kubectl verbosity is controlled with the `-v` or `--v` flags followed by an integer representing the log level. General Kubernetes logging conventions and the associated log levels are described [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Verbosity | Description
--------------| -----------
`--v=0` | Generally useful for this to *always* be visible to a cluster operator.
`--v=1` | A reasonable default log level if you don't want verbosity.
`--v=2` | Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level for most systems.
`--v=3` | Extended information about changes.
`--v=4` | Debug level verbosity.
`--v=6` | Display requested resources.
`--v=7` | Display HTTP request headers.
`--v=8` | Display HTTP request contents.
`--v=9` | Display HTTP request contents without truncation of contents.

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Overview of kubectl](/docs/reference/kubectl/overview/).

* See [kubectl](/docs/reference/kubectl/kubectl/) options.

* Also [kubectl Usage Conventions](/docs/reference/kubectl/conventions/) to understand how to use it in reusable scripts.

* See more community [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).

{{% /capture %}}
