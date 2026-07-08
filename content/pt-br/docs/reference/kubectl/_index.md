---
title: Ferramenta de linha de comando (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  title: Ferramenta de linha de comando kubectl
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="Kubernetes fornece um" term_id="kubectl" length="short" >}}

Esta ferramenta é chamada `kubectl`.

Para configuração, `kubectl` procura por um arquivo chamado `config` no diretório `$HOME/.kube`.
Você pode especificar outros arquivos [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
definindo a variável de ambiente `KUBECONFIG` ou configurando a
flag [`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

Esta visão geral abrange a sintaxe do `kubectl`, descreve as operações de comando e fornece exemplos comuns.
Para detalhes sobre cada comando, incluindo todas as opções e subcomandos suportados, consulte a
documentação de referência do [kubectl](/docs/reference/kubectl/generated/kubectl/).

Para instruções de instalação, consulte [Instalando kubectl](/docs/tasks/tools/#kubectl);
para um guia rápido, consulte a [folha de dicas](/docs/reference/kubectl/quick-reference/).
Se você está acostumado a usar a ferramenta de linha de comando `docker`,
[`kubectl` para Usuários Docker](/docs/reference/kubectl/docker-cli-to-kubectl/) explica alguns comandos equivalentes para Kubernetes.

<!-- body -->

## Sintaxe

Use a seguinte sintaxe para executar comandos `kubectl` da janela do seu terminal:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

onde `command`, `TYPE`, `NAME` e `flags` são:

* `command`: Especifica a operação que você deseja executar em um ou mais recursos,
 por exemplo `create`, `get`, `describe`, `delete`.

* `TYPE`: Especifica o [tipo de recurso](#tipos-de-recursos). Tipos de recursos não diferenciam maiúsculas de minúsculas e
 você pode especificar as formas singular, plural ou abreviada.
 Por exemplo, os seguintes comandos produzem a mesma saída:

  ```shell
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

* `NAME`: Especifica o nome do recurso. Nomes diferenciam maiúsculas de minúsculas. Se o nome for omitido,
 detalhes para todos os recursos são exibidos, por exemplo `kubectl get pods`.

  Ao realizar uma operação em vários recursos, você pode especificar cada recurso por
 tipo e nome ou especificar um ou mais arquivos:

  * Para especificar recursos por tipo e nome:

    * Para agrupar recursos se todos forem do mesmo tipo: `TYPE1 name1 name2 name<#>`.<br/>
      Exemplo: `kubectl get pod example-pod1 example-pod2`

    * Para especificar vários tipos de recursos individualmente: `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
      Exemplo: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

  * Para especificar recursos com um ou mais arquivos: `-f file1 -f file2 -f file<#>`

    * [Use YAML em vez de JSON](/docs/concepts/configuration/overview/#dicas-gerais-de-configuração)
      já que YAML tende a ser mais amigável ao usuário, especialmente para arquivos de configuração.<br/>
      Exemplo: `kubectl get -f ./pod.yaml`

* `flags`: Especifica flags opcionais. Por exemplo, você pode usar as flags `-s` ou `--server`
 para especificar o endereço e porta do servidor de API do Kubernetes.<br/>

{{< caution >}}
Flags que você especifica da linha de comando sobrescrevem valores padrão e quaisquer variáveis de ambiente correspondentes.
{{< /caution >}}

Se você precisar de ajuda, execute `kubectl help` da janela do terminal.

## Autenticação dentro do cluster e sobrescritas de namespace

Por padrão, `kubectl` primeiro determinará se está sendo executado dentro de um pod, ou seja, em um cluster.
Ele começa verificando as variáveis de ambiente `KUBERNETES_SERVICE_HOST` e `KUBERNETES_SERVICE_PORT`
e a existência de um arquivo de token de conta de serviço em `/var/run/secrets/kubernetes.io/serviceaccount/token`.
Se todos os três forem encontrados, a autenticação dentro do cluster é assumida.

Para manter a retrocompatibilidade, se a variável de ambiente `POD_NAMESPACE` for definida
durante a autenticação dentro do cluster, ela sobrescreverá o namespace padrão do
token da conta de serviço. Quaisquer manifestos ou ferramentas que dependam do namespace padrão serão afetados por isso.

**Variável de ambiente `POD_NAMESPACE`**

Se a variável de ambiente `POD_NAMESPACE` for definida, operações de linha de comando em recursos com namespace
usarão por padrão o valor da variável. Por exemplo, se a variável for definida como `seattle`,
`kubectl get pods` retornaria pods no namespace `seattle`. Isso ocorre porque pods são
um recurso com namespace, e nenhum namespace foi fornecido no comando. Revise a saída
de `kubectl api-resources` para determinar se um recurso possui namespace.

O uso explícito de `--namespace <value>` sobrescreve este comportamento.

**Como o kubectl lida com tokens de ServiceAccount**

Se:

* há um arquivo de token de conta de serviço do Kubernetes montado em
`/var/run/secrets/kubernetes.io/serviceaccount/token`, e
* a variável de ambiente `KUBERNETES_SERVICE_HOST` está definida, e
* a variável de ambiente `KUBERNETES_SERVICE_PORT` está definida, e
* você não especifica explicitamente um namespace na linha de comando do kubectl

então o kubectl assume que está sendo executado no seu cluster. A ferramenta kubectl procura o
namespace daquela ServiceAccount (que é o mesmo namespace do Pod)
e atua com esse namespace. Isso é diferente do que acontece fora de um
cluster; quando o kubectl é executado fora de um cluster e você não especifica um namespace,
o comando kubectl atua com o namespace definido para o contexto atual na sua
configuração do cliente. Para alterar o namespace padrão para seu kubectl você pode usar o
seguinte comando:

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## Operações

A seguinte tabela inclui descrições curtas e a sintaxe geral para todas as operações do `kubectl`:

Operação       | Sintaxe    |       Descrição
-------------------- | -------------------- | --------------------
`alpha`    | `kubectl alpha SUBCOMMAND [flags]` | Lista os comandos disponíveis que correspondem às funcionalidades alfa, que não são habilitadas por padrão nos clusters Kubernetes.
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Adiciona ou atualiza as anotações de um ou mais recursos.
`api-resources`    | `kubectl api-resources [flags]` | Lista os recursos de API que estão disponíveis.
`api-versions`    | `kubectl api-versions [flags]` | Lista as versões de API que estão disponíveis.
`apply`            | `kubectl apply -f FILENAME [flags]`| Aplica uma alteração de configuração a um recurso de um arquivo ou stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Conecta a um contêiner em execução para visualizar o fluxo de saída ou interagir com o contêiner (stdin).
`auth`    | `kubectl auth [flags] [options]` | Inspeciona autorização.
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | Escalona automaticamente o conjunto de pods que são gerenciados por um controlador de replicação.
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | Modifica recursos de certificado.
`cluster-info`    | `kubectl cluster-info [flags]` | Exibe informações de endpoint sobre o nó principal e serviços no cluster.
`completion`    | `kubectl completion SHELL [options]` | Gera código de completar automaticamente para o shell especificado (bash ou zsh).
`config`        | `kubectl config SUBCOMMAND [flags]` | Modifica arquivos kubeconfig. Consulte os subcomandos individuais para detalhes.
`convert`    | `kubectl convert -f FILENAME [options]` | Converte arquivos de configuração entre diferentes versões de API. Ambos os formatos YAML e JSON são aceitos. Nota - requer que o plugin `kubectl-convert` esteja instalado.
`cordon`    | `kubectl cordon NODE [options]` | Marca o nó como não agendável.
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | Copia arquivos e diretórios "de" e "para" contêineres.
`create`        | `kubectl create -f FILENAME [flags]` | Cria um ou mais recursos de um arquivo ou stdin.
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | Exclui recursos de um arquivo, stdin, ou especificando seletores de rótulo, nomes, seletores de recursos, ou recursos.
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | Exibe o estado detalhado de um ou mais recursos.
`diff`        | `kubectl diff -f FILENAME [flags]`| Compara arquivo ou stdin contra a configuração ativa.
`drain`    | `kubectl drain NODE [options]` | Drena o nó em preparação para manutenção.
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | Edita e atualiza a definição de um ou mais recursos no servidor usando o editor padrão.
`events`      | `kubectl events` | Lista eventos
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Executa um comando contra um contêiner em um pod.
`explain`    | `kubectl explain TYPE [--recursive=false] [flags]` | Obtém documentação de vários recursos. Por exemplo pods, nós, serviços, etc.
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | Expõe um controlador de replicação, service, ou pod como um novo serviço Kubernetes.
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | Lista um ou mais recursos.
`kustomize`    | `kubectl kustomize <dir> [flags] [options]` | Lista um conjunto de recursos de API gerados a partir de instruções em um arquivo kustomization.yaml. O argumento deve ser o caminho para o diretório contendo o arquivo, ou uma URL de repositório git com um sufixo de caminho especificando o mesmo em relação à raiz do repositório.
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Adiciona ou atualiza os rótulos de um ou mais recursos.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Imprime os logs de um contêiner em um pod.
`options`    | `kubectl options` | Lista de opções globais de linha de comando, que se aplicam a todos os comandos.
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Atualiza um ou mais campos de um recurso usando o processo de merge estratégico de patch.
`plugin`    | `kubectl plugin [flags] [options]` | Fornece utilitários para interagir com plugins.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Encaminha uma ou mais portas locais para um pod.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Executa um proxy para o servidor de API do Kubernetes.
`replace`        | `kubectl replace -f FILENAME` | Substitui um recurso de um arquivo ou stdin.
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | Gerencia o rollout de um recurso. Tipos de recursos válidos incluem: deployments, daemonsets e statefulsets.
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | Executa uma imagem especificada no cluster.
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | Atualiza o tamanho do controlador de replicação especificado.
`set`    | `kubectl set SUBCOMMAND [options]` | Configura recursos de aplicação.
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | Atualiza os taints em um ou mais nós.
`top`    | <code>kubectl top (POD &#124; NODE) [flags] [options]</code> | Exibe o uso de recursos (CPU/Memória/Armazenamento) de pod ou nó.
`uncordon`    | `kubectl uncordon NODE [options]` | Marca o nó como agendável.
`version`        | `kubectl version [--client] [flags]` | Exibe a versão do Kubernetes em execução no cliente e servidor.
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | Experimental: Aguarda uma condição específica em um ou muitos recursos.

Para saber mais sobre operações de comando, consulte a documentação de referência do [kubectl](/docs/reference/kubectl/kubectl/).

## Tipos de recursos

A seguinte tabela inclui uma lista de todos os tipos de recursos suportados e seus pseudônimos (aliases) abreviados.

(Esta saída pode ser obtida de `kubectl api-resources`, e estava precisa a partir do Kubernetes 1.25.0)

| NAME | SHORTNAMES | APIVERSION | NAMESPACED | KIND |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## Opções de saída

Use as seguintes seções para informações sobre como você pode formatar ou classificar a saída
de determinados comandos. Para detalhes sobre quais comandos suportam as várias opções de saída,
consulte a documentação de referência do [kubectl](/docs/reference/kubectl/kubectl/).

### Formatando a saída

O formato de saída padrão para todos os comandos `kubectl` é o formato de texto simples legível por humanos.
Para exibir detalhes na janela do seu terminal em um formato específico, você pode adicionar as flags `-o`
ou `--output` a um comando `kubectl` suportado.

#### Sintaxe

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

Dependendo da operação do `kubectl`, os seguintes formatos de saída são suportados:

Formato de saída | Descrição
--------------| -----------
`-o custom-columns=<spec>` | Imprime uma tabela usando uma lista separada por vírgulas de [colunas personalizadas](#colunas-personalizadas).
`-o custom-columns-file=<filename>` | Imprime uma tabela usando o template de [colunas personalizadas](#colunas-personalizadas) no arquivo `<filename>`.
`-o json` | Gera um objeto de API formatado em JSON.
`-o jsonpath=<template>` | Imprime os campos definidos em uma expressão [jsonpath](/docs/reference/kubectl/jsonpath/).
`-o jsonpath-file=<filename>` | Imprime os campos definidos pela expressão [jsonpath](/docs/reference/kubectl/jsonpath/) no arquivo `<filename>`.
`-o kyaml` | Gera um objeto de API formatado em KYAML (alfa, requer variável de ambiente `KUBECTL_KYAML="true"`).
`-o name` | Imprime apenas o nome do recurso e nada mais.
`-o wide` | Saída no formato de texto simples com qualquer informação adicional. Para pods, o nome do nó é incluído.
`-o yaml` | Gera um objeto de API formatado em YAML. KYAML é um dialeto experimental específico do Kubernetes do YAML, e pode ser interpretado como YAML.

##### Exemplo

Neste exemplo, o seguinte comando gera os detalhes para um único pod como um objeto formatado em YAML:

```shell
kubectl get pod web-pod-13je7 -o yaml
```

Lembre-se: Consulte a documentação de referência do [kubectl](/docs/reference/kubectl/kubectl/)
para detalhes sobre qual formato de saída é suportado por cada comando.

#### Colunas personalizadas

Para definir colunas personalizadas e gerar apenas os detalhes que você deseja em uma tabela, você pode usar a opção `custom-columns`.
Você pode escolher definir as colunas personalizadas inline ou usar um arquivo de template: `-o custom-columns=<spec>` ou `-o custom-columns-file=<filename>`.

##### Exemplos

Inline:

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

Arquivo de template:

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

onde o arquivo `template.txt` contém:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```
O resultado da execução de qualquer comando é similar a:

```
NAME           RSRC
submit-queue   610995
```

#### Colunas do lado do servidor

`kubectl` suporta receber informações específicas de colunas do servidor sobre objetos.
Isso significa que para qualquer recurso dado, o servidor retornará colunas e linhas relevantes para esse recurso, para o cliente imprimir.
Isso permite uma saída legível por humanos consistente entre clientes usados contra o mesmo cluster, fazendo com que o servidor encapsule os detalhes da impressão.

Esta funcionalidade está habilitada por padrão. Para desabilitá-la, adicione a
flag `--server-print=false` ao comando `kubectl get`.

##### Exemplos

Para imprimir informações sobre o status de um pod, use um comando como o seguinte:

```shell
kubectl get pods <pod-name> --server-print=false
```

A saída é similar a:

```
NAME       AGE
pod-name   1m
```

### Classificando objetos de lista

Para gerar objetos em uma lista classificada na janela do seu terminal, você pode adicionar a flag `--sort-by`
a um comando `kubectl` suportado. Classifique seus objetos especificando qualquer campo numérico ou string
com a flag `--sort-by`. Para especificar um campo, use uma expressão [jsonpath](/docs/reference/kubectl/jsonpath/).

#### Sintaxe

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### Exemplo

Para imprimir uma lista de pods classificados por nome, você executa:

```shell
kubectl get pods --sort-by=.metadata.name
```

## Exemplos: Operações comuns

Use o seguinte conjunto de exemplos para ajudar você a se familiarizar com a execução das operações `kubectl` comumente usadas:

`kubectl apply` - Aplica ou atualiza um recurso de um arquivo ou stdin.

```shell
# Cria um serviço usando a definição em example-service.yaml.
kubectl apply -f example-service.yaml

# Cria um controlador de replicação usando a definição em example-controller.yaml.
kubectl apply -f example-controller.yaml

# Cria os objetos que são definidos em qualquer arquivo .yaml, .yml ou .json dentro do diretório <directory>.
kubectl apply -f <directory>
```

`kubectl get` - Lista um ou mais recursos.

```shell
# Lista todos os pods em formato de saída de texto simples.
kubectl get pods

# Lista todos os pods em formato de saída de texto simples e inclui informações adicionais (como nome do nó).
kubectl get pods -o wide

# Lista o controlador de replicação com o nome especificado em formato de saída de texto simples. Dica: Você pode encurtar e substituir o tipo de recurso 'replicationcontroller' com o alias 'rc'.
kubectl get replicationcontroller <rc-name>

# Lista todos os controladores de replicação e services juntos em formato de saída de texto simples.
kubectl get rc,services

# Lista todos os daemon sets em formato de saída de texto simples.
kubectl get ds

# Lista todos os pods executando no nó server01
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - Exibe o estado detalhado de um ou mais recursos, incluindo os não inicializados por padrão.

```shell
# Exibe os detalhes do nó com nome <node-name>.
kubectl describe nodes <node-name>

# Exibe os detalhes do pod com nome <pod-name>.
kubectl describe pods/<pod-name>

# Exibe os detalhes de todos os pods que são gerenciados pelo controlador de replicação chamado <rc-name>.
# Lembre-se: Qualquer pod que seja criado pelo controlador de replicação recebe um prefixo com o nome do controlador de replicação.
kubectl describe pods <rc-name>

# Descreve todos os pods
kubectl describe pods
```

{{< note >}}
O comando `kubectl get` é geralmente usado para recuperar um ou mais
recursos do mesmo tipo de recurso. Ele possui um rico conjunto de flags que permite
personalizar o formato de saída usando a flag `-o` ou `--output`, por exemplo.
Você pode especificar a flag `-w` ou `--watch` para começar a observar atualizações para um
objeto específico. O comando `kubectl describe` é mais focado em descrever os muitos
aspectos relacionados de um recurso especificado. Ele pode realizar várias chamadas de API
para o servidor de API para construir uma visualização para o usuário. Por exemplo, o comando `kubectl describe node`
recupera não apenas as informações sobre o nó, mas também um resumo dos
pods executando nele, os eventos gerados para o nó, etc.
{{< /note >}}

`kubectl delete` - Exclui recursos de um arquivo, stdin, ou especificando seletores de rótulo, nomes, seletores de recursos, ou recursos.

```shell
# Exclui um pod usando o tipo e nome especificados no arquivo pod.yaml.
kubectl delete -f pod.yaml

# Exclui todos os pods e services que têm o rótulo '<label-key>=<label-value>'.
kubectl delete pods,services -l <label-key>=<label-value>

# Exclui todos os pods, incluindo os não inicializados.
kubectl delete pods --all
```

`kubectl exec` - Executa um comando contra um contêiner em um pod.

```shell
# Obtém saída da execução de 'date' do pod <pod-name>. Por padrão, a saída é do primeiro contêiner.
kubectl exec <pod-name> -- date

# Obtém saída da execução de 'date' no contêiner <container-name> do pod <pod-name>.
kubectl exec <pod-name> -c <container-name> -- date

# Obtém um TTY interativo e executa /bin/bash do pod <pod-name>. Por padrão, a saída é do primeiro contêiner.
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` - Imprime os logs de um contêiner em um pod.

```shell
# Retorna um snapshot dos logs do pod <pod-name>.
kubectl logs <pod-name>

# Inicia o streaming dos logs do pod <pod-name>. Isso é similar ao comando Linux 'tail -f'.
kubectl logs -f <pod-name>
```

`kubectl diff` - Visualiza um diff das atualizações propostas para um cluster.

```shell
# Compara recursos incluídos em "pod.json".
kubectl diff -f pod.json

# Compara arquivo lido do stdin.
cat service.yaml | kubectl diff -f -
```

## Exemplos: Criando e usando plugins

Use o seguinte conjunto de exemplos para ajudar você a se familiarizar com a escrita e uso de plugins do `kubectl`:

```shell
# cria um plugin simples em qualquer linguagem e nomeia o arquivo executável resultante
# para que comece com o prefixo "kubectl-"
cat ./kubectl-hello
```
```shell
#!/bin/sh

# este plugin imprime as palavras "hello world"
echo "hello world"
```
Com um plugin escrito, vamos torná-lo executável:
```bash
chmod a+x ./kubectl-hello

# e movê-lo para um local no nosso PATH
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# Você agora criou e "instalou" um plugin kubectl.
# Você pode começar a usar este plugin invocando-o do kubectl como se fosse um comando regular
kubectl hello
```
```
hello world
```

```shell
# Você pode "desinstalar" um plugin, removendo-o da pasta no seu
# $PATH onde você o colocou
sudo rm /usr/local/bin/kubectl-hello
```

Para visualizar todos os plugins que estão disponíveis para `kubectl`, use
o subcomando `kubectl plugin list`:

```shell
kubectl plugin list
```
A saída é similar a:
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

`kubectl plugin list` também avisa sobre plugins que não são
executáveis, ou que são sombreados por outros plugins; por exemplo:

```shell
sudo chmod -x /usr/local/bin/kubectl-foo # remove permissão de execução
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

Você pode pensar em plugins como um meio de construir funcionalidades mais complexas sobre
os comandos kubectl existentes:

```shell
cat ./kubectl-whoami
```

Os próximos exemplos assumem que você já fez `kubectl-whoami` ter
o seguinte conteúdo:

```shell
#!/bin/bash

# este plugin faz uso do comando `kubectl config` para gerar
# informações sobre o usuário atual, baseado no contexto atualmente selecionado
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

Executar o comando acima fornece uma saída contendo o usuário para o
contexto atual no seu arquivo KUBECONFIG:

```shell
# torna o arquivo executável
sudo chmod +x ./kubectl-whoami

# e o move para o seu PATH
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}}

* Leia a documentação de referência do `kubectl`:
  * a [referência de comandos](/docs/reference/kubectl/kubectl/) kubectl
  * a referência de [argumentos de linha de comando](/docs/reference/kubectl/generated/kubectl/)
* Aprenda sobre [convenções de uso do `kubectl`](/docs/reference/kubectl/conventions/)
* Leia sobre [suporte ao JSONPath](/docs/reference/kubectl/jsonpath/) no kubectl
* Leia sobre como [estender kubectl com plugins](/docs/tasks/extend-kubectl/kubectl-plugins)
  * Para descobrir mais sobre plugins, veja [plugin CLI de exemplo](https://github.com/kubernetes/sample-cli-plugin).