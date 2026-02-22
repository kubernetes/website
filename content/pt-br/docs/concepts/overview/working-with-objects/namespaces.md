---
title: Namespaces
content_type: concept
weight: 30
---

<!-- overview -->

No Kubernetes, _namespaces_ disponibilizam um mecanismo para isolar grupos de recursos dentro de um único cluster. Nomes de recursos precisam ser únicos dentro de um namespace, porém podem se repetir em diferentes namespaces. Escopos baseados em namespaces são aplicáveis apenas para objetos com namespace _(como: Deployments, Services, etc)_ e não em objetos que abrangem todo o cluster _(como: StorageClass, Nodes, PersistentVolumes, etc)_.

<!-- body -->

## Quando Utilizar Múltiplos Namespaces

Namespaces devem ser utilizados em ambientes com múltiplos usuários espalhados por diversos times ou projetos. Para clusters com poucos ou até algumas dezenas de usuários, você não deveria precisar criar ou pensar a respeito de namespaces. Comece a utilizar namespaces quando você precisar das funcionalidades que eles oferecem.

Namespaces oferecem escopo para nomes. Nomes de recursos precisam ser únicos dentro de um namespace, porém não em diferentes namespaces. Namespaces não podem ser aninhados dentro de outros namespaces e cada recurso Kubernetes pode pertencer à apenas um namespace.

Namespaces nos permitem dividir os recursos do cluster entre diferentes usuários (via [resource quota](/docs/concepts/policy/resource-quotas/)).

Não é necessário utilizar múltiplos namespaces para separar recursos levemente diferentes, como diferentes versões de um mesmo software: use {{< glossary_tooltip text="labels" term_id="label" >}} para distinguir recursos dentro de um mesmo namespace.

{{< note >}}
Para clusters em produção, considere _não_ utilizar o namespace `default`. Em vez disso, crie e utilize outros namespaces.
{{< /note >}}

## Namespaces Iniciais

O Kubernetes é inicializado com quatro namespaces:

`default`
: O Kubernetes inclui esse namespace para que você possa começar a usar seu novo cluster sem precisar criar um namespace primeiro.

`kube-node-lease`
: Este namespace contém os objetos de [Lease](/docs/concepts/architecture/leases/) associados com cada node. Node leases permitem que o kubelet envie [heartbeats](/docs/concepts/architecture/nodes/#node-heartbeats) para que a camada de gerenciamento detecte falhas nos nodes.

`kube-public`
: Este namespace é criado automaticamente e é legível por _todos_ os clientes (incluindo clientes não autenticados). Este namespace é reservado principalmente para uso do cluster, no caso de alguns recursos que precisem ser visíveis e legíveis publicamente por todo o cluster. O aspecto público deste namespace é apenas uma convenção, não um requisito.

`kube-system`
: O namespace para objetos criados pelo sistema Kubernetes

## Trabalhando com Namespaces

Criação e eliminação de namespaces estão descritas na 
[documentação de namespaces do guia de administradores](/docs/tasks/administer-cluster/namespaces).

{{< note >}}
Evite criar namespaces com o prefixo `kube-`, já que este prefixo é reservado para namespaces do sistema Kubernetes.
{{< /note >}}

### Visualizando namespaces

Você pode obter uma lista dos namespaces atuais dentro de um cluster com:

```shell
kubectl get namespace
```
```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

### Preparando o namespace para uma requisição

Para preparar o namespace para a requisição atual, utilize o parâmetro `--namespace`. Por exemplo:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Configurando a preferência de namespaces

Você pode salvar permanentemente o namespace para todos os comandos `kubectl` subsequentes no mesmo contexto:

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validando
kubectl config view --minify | grep namespace:
```

## Namespaces e DNS

Quando você cria um [Serviço](/docs/concepts/services-networking/service/), ele cria uma
[entrada DNS](/docs/concepts/services-networking/dns-pod-service/) correspondente.
Esta entrada possui o formato: `<service-name>.<namespace-name>.svc.cluster.local`, de forma que se um contêiner utilizar apenas `<service-name>` ele será resolvido para um serviço que é local ao namespace.
Isso é útil para utilizar a mesma configuração em vários namespaces, por exemplo em Desenvolvimento, `Staging` e Produção. Se você quiser acessar múltiplos namespaces, precisará utilizar um _Fully Qualified Domain Name_ (FQDN).

Nomes de namespaces devem ser válidos conforme a [RFC 1123 para rótulos DNS](/docs/concepts/overview/working-with-objects/names/#dns-label-names).

{{< warning >}}  
Ao criar namespaces com o mesmo nome de [domínios de topo públicos (TLDs)](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), os Services dentro desses namespaces podem ter nomes DNS curtos que colidem com registros DNS públicos. Com isso, cargas de trabalho de qualquer namespace que realizem consultas DNS sem um [ponto final (trailing dot)](https://datatracker.ietf.org/doc/html/rfc1034#page-8) podem ser redirecionadas para esses serviços, tendo precedência sobre o DNS público.

Para mitigar esse risco, limite a criação de namespaces apenas a usuários confiáveis. Se necessário, você também pode configurar controles de segurança de terceiros, como [admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/), para bloquear a criação de namespaces com nomes que coincidam com [TLDs públicos](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
{{< /warning >}}

## Nem todos os objetos pertencem a algum Namespace

A maior parte dos recursos Kubernetes (como Pods, Services, controladores de replicação e outros) pertencem a algum namespace. Entretanto, recursos de namespaces não pertencem a nenhum namespace. Além deles, recursos de baixo nível, como [nodes](/docs/concepts/architecture/nodes/) e [persistentVolumes](/docs/concepts/storage/persistent-volumes/), também não pertencem a nenhum namespace.

Para visualizar quais recursos Kubernetes pertencem ou não a algum namespace, utilize:

```shell
# Em um namespace
kubectl api-resources --namespaced=true

# Sem namespace
kubectl api-resources --namespaced=false
```

## Rotulamento Automático

{{< feature-state for_k8s_version="1.22" state="stable" >}}

A camada de gerenciamento Kubernetes configura um {{< glossary_tooltip text="label" term_id="label" >}} imutável `kubernetes.io/metadata.name` em todos os namespaces. 
O valor do label é o nome do namespace.

## {{% heading "whatsnext" %}}

* Leia sobre [a criação de um novo namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Leia sobre [a eliminação de um namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).

