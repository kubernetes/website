---
title: Labels e Seletores
content_type: concept
weight: 40
---

<!-- overview -->

_As labels_ são pares de chave/valor anexados a
{{< glossary_tooltip text="objetos" term_id="object" >}}, como Pods.
As labels se destinam a ser usadas para especificar atributos identificadores de
objetos que são significativos e relevantes para os usuários, mas não implicam diretamente
semântica no sistema principal. As labels podem ser usadas para organizar e selecionar subconjuntos
de objetos. As labels podem ser anexadas a objetos no momento da criação e,
posteriormente, adicionadas e modificadas a qualquer momento. Cada objeto pode ter um conjunto de labels
de chave/valor definido. Cada chave deve ser exclusiva para um determinado objeto.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

As labels permitem consultas e watches eficientes e são ideais para uso em UIs
e CLIs. Informações não identificadoras devem ser registradas usando
[anotações](/docs/concepts/overview/working-with-objects/annotations/).

<!-- body -->

## Motivação

As labels permitem que os usuários mapeiem suas próprias estruturas organizacionais em objetos
do sistema de uma maneira vagamente acoplada, sem exigir que os clientes armazenem esses mapeamentos.

Implantações de services e pipelines de processamento em lote são frequentemente entidades
multidimensionais (por exemplo, múltiplas partições ou implantações, múltiplas linhas de release,
múltiplas camadas (tiers), múltiplos microsserviços por camada). O gerenciamento geralmente requer
operações transversais (cross-cutting), o que quebra o encapsulamento de representações estritamente
hierárquicas, especialmente hierarquias rígidas determinadas pela infraestrutura em vez de pelos usuários.

Exemplo de labels:

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

Estes são exemplos de
[labels comumente usadas](/docs/concepts/overview/working-with-objects/common-labels/);
você é livre para desenvolver suas próprias convenções.
Lembre-se de que a chave da label deve ser exclusiva para um determinado objeto.

## Sintaxe e conjunto de caracteres

_As labels_ são pares de chave/valor. As chaves de label válidas têm dois segmentos: um prefixo
opcional e um nome, separados por uma barra (`/`). O segmento do nome é obrigatório e
deve ter 63 caracteres ou menos, começando e terminando com um caractere alfanumérico
(`[a-z0-9A-Z]`), com travessões (`-`), sublinhados (`_`), pontos (`.`),
e alfanuméricos no meio. O prefixo é opcional. Se especificado, o prefixo
deve ser um subdomínio DNS: uma série de rótulos DNS separados por pontos (`.`),
com no máximo 253 caracteres no total, seguidos por uma barra (`/`).

Se o prefixo for omitido, presume-se que a chave da label seja privada ao usuário.
Os componentes automatizados do sistema (por exemplo, `kube-scheduler`, `kube-controller-manager`,
`kube-apiserver`, `kubectl` ou outras automações de terceiros) que adicionam labels
a objetos de usuário final devem especificar um prefixo.

Os prefixos `kubernetes.io/` e `k8s.io/` são
[reservados](/docs/reference/labels-annotations-taints/) para os componentes principais do Kubernetes.

Um valor de label válido:

* deve ter 63 caracteres ou menos (pode ser vazio),
* a menos que vazio, deve começar e terminar com um caractere alfanumérico (`[a-z0-9A-Z]`),
* pode conter travessões (`-`), sublinhados (`_`), pontos (`.`) e alfanuméricos no meio.

Por exemplo, aqui está um manifesto de um Pod que tem duas labels
`environment: production` e `app: nginx`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## Seletores de labels

Ao contrário de [nomes e UIDs](/pt-br/docs/concepts/overview/working-with-objects/names/), as labels
não fornecem exclusividade. Em geral, esperamos que muitos objetos carreguem a(s) mesma(s) label(s).

Por meio de um _seletor de labels_, o cliente/usuário pode identificar um conjunto de objetos.
O seletor de labels é a primitiva de agrupamento principal (core) do Kubernetes.

Atualmente, a API oferece suporte a dois tipos de seletores: _baseados em igualdade_ (equality-based) e
_baseados em conjuntos_ (set-based). Um seletor de labels pode ser composto por múltiplos
_requisitos_ separados por vírgula. No caso de múltiplos requisitos, todos devem ser satisfeitos, de modo
que o separador de vírgula age como um operador lógico _AND_ (`&&`).

A semântica de seletores vazios ou não especificados depende do contexto,
e os tipos de API que usam seletores devem documentar a validade e o significado
deles.

{{< note >}}
Para alguns tipos de API, como ReplicaSets, os seletores de labels de duas instâncias não devem
se sobrepor dentro de um namespace, ou o controlador pode ver isso como instruções conflitantes
e falhar ao determinar quantas réplicas devem estar presentes.
{{< /note >}}

{{< caution >}}
Tanto para condições baseadas em igualdade quanto baseadas em conjuntos, não há operador lógico _OR_ (`||`).
Certifique-se de que suas declarações de filtro sejam estruturadas adequadamente.
{{< /caution >}}

### Requisito _baseado em igualdade_

Os requisitos _baseados em igualdade_ ou _desigualdade_ permitem filtrar por chaves e valores de label.
Os objetos correspondentes devem satisfazer todas as restrições de label especificadas, embora possam
ter labels adicionais também. Três tipos de operadores são aceitos: `=`, `==`, `!=`.
Os dois primeiros representam _igualdade_ (e são sinônimos), enquanto o último representa _desigualdade_.
Por exemplo:

```
environment = production
tier != frontend
```

O primeiro seleciona todos os recursos com a chave igual a `environment` e o valor igual a `production`.
O último seleciona todos os recursos com a chave igual a `tier` e o valor distinto de `frontend`,
e todos os recursos sem labels com a chave `tier`. Pode-se filtrar recursos em `production`
excluindo `frontend` usando o operador vírgula: `environment=production,tier!=frontend`

Um cenário de uso para o requisito de label baseado em igualdade é para os Pods especificarem
critérios de seleção de nós. Por exemplo, o Pod de exemplo abaixo seleciona nós onde
a label `accelerator` existe e está definida como `nvidia-tesla-p100`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### Requisito _baseado em conjuntos_

Os requisitos de label _baseados em conjuntos_ permitem filtrar chaves de acordo com um conjunto de valores.
Três tipos de operadores são suportados: `in`, `notin` e `exists` (apenas o identificador da chave).
Por exemplo:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

- O primeiro exemplo seleciona todos os recursos com a chave igual a `environment` e o valor
  igual a `production` ou `qa`.
- O segundo exemplo seleciona todos os recursos com a chave igual a `tier` e valores diferentes
  de `frontend` e `backend`, e todos os recursos sem labels com a chave `tier`.
- O terceiro exemplo seleciona todos os recursos que incluem uma label com a chave `partition`;
  nenhum valor é verificado.
- O quarto exemplo seleciona todos os recursos sem uma label com a chave `partition`;
  nenhum valor é verificado.

Da mesma forma, o separador de vírgula age como um operador _AND_. Portanto, filtrar recursos
com uma chave `partition` (independente do valor) e com `environment` diferente
de `qa` pode ser alcançado usando `partition,environment notin (qa)`.
O seletor de labels _baseado em conjuntos_ é uma forma generalizada de igualdade, pois
`environment=production` é equivalente a `environment in (production)`;
da mesma forma para `!=` e `notin`.

Requisitos _baseados em conjuntos_ podem ser misturados com requisitos _baseados em igualdade_.
Por exemplo: `partition in (customerA, customerB),environment!=qa`.

## API

### Filtragem de LIST e WATCH

Para operações de **list** e **watch**, você pode especificar seletores de labels para filtrar os conjuntos
de objetos retornados; você especifica o filtro usando um parâmetro de consulta.
(Para saber detalhadamente sobre watches no Kubernetes, leia
[detecção eficiente de alterações](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)).
Ambos os requisitos são permitidos
(apresentados aqui como apareceriam em uma query string de URL):

* requisitos _baseados em igualdade_: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* requisitos _baseados em conjuntos_: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Ambos os estilos de seletores de labels podem ser usados para listar ou observar recursos por meio de um
cliente REST. Por exemplo, direcionando o `apiserver` com o `kubectl` e usando requisitos
_baseados em igualdade_, pode-se escrever:

```shell
kubectl get pods -l environment=production,tier=frontend
```

ou usando requisitos _baseados em conjuntos_:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Como já mencionado, os requisitos _baseados em conjuntos_ são mais expressivos.
Por exemplo, eles podem implementar o operador _OR_ nos valores:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

ou restringir correspondências negativas por meio do operador _notin_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### Referências a conjuntos em objetos da API

Alguns objetos do Kubernetes, como [`services`](/pt-br/docs/concepts/services-networking/service/)
e [`replicationcontrollers`](/docs/concepts/workloads/controllers/replicationcontroller/),
também usam seletores de labels para especificar conjuntos de outros recursos, como
[pods](/pt-br/docs/concepts/workloads/pods/).

#### Service e ReplicationController

O conjunto de pods que um `service` direciona é definido com um seletor de labels.
Da mesma forma, a população de pods que um `replicationcontroller` deve
gerenciar também é definida com um seletor de labels.

Os seletores de labels para ambos os objetos são definidos em arquivos `json` ou `yaml` usando mapas,
e apenas seletores de requisitos _baseados em igualdade_ são suportados:

```json
"selector": {
    "component" : "redis",
}
```

ou

```yaml
selector:
  component: redis
```

Este seletor (respectivamente no formato `json` ou `yaml`) é equivalente a
`component=redis` ou `component in (redis)`.

#### Recursos que suportam requisitos baseados em conjuntos

Recursos mais recentes, como [`Job`](/docs/concepts/workloads/controllers/job/),
[`Deployment`](/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/pt-br/docs/concepts/workloads/controllers/replicaset/) e
[`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/),
também suportam requisitos _baseados em conjuntos_.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

`matchLabels` é um mapa de pares `{key,value}`. Um único `{key,value}` no
mapa `matchLabels` é equivalente a um elemento de `matchExpressions`, cujo campo `key`
é "key", o `operator` é "In" e o array `values` contém apenas "value".
`matchExpressions` é uma lista de requisitos de seletores de pods. Os operadores válidos incluem
In, NotIn, Exists e DoesNotExist. O conjunto de valores deve ser não vazio no caso de
In e NotIn. Todos os requisitos, tanto de `matchLabels` quanto de `matchExpressions`,
são combinados com AND -- todos devem ser satisfeitos para haver correspondência.

#### Selecionando conjuntos de nós

Um caso de uso para seleção por labels é restringir o conjunto de nós nos quais
um pod pode ser agendado. Consulte a documentação sobre
[seleção de nós](/pt-br/docs/concepts/scheduling-eviction/assign-pod-node/) para obter mais informações.

## Usando labels de forma eficaz

Você pode aplicar uma única label a quaisquer recursos, mas nem sempre esta é a
melhor prática. Existem muitos cenários em que múltiplas labels devem ser usadas para
distinguir conjuntos de recursos uns dos outros.

Por exemplo, aplicações diferentes usariam valores diferentes para a label `app`, mas uma
aplicação de múltiplas camadas, como o [exemplo guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/),
precisaria adicionalmente distinguir cada camada.

Nos exemplos a seguir, a label `app` é incluída por conveniência em consultas manuais
e uso simples da CLI. A label `app.kubernetes.io/name` segue as convenções de
labeling recomendadas pelo Kubernetes e é mais adequada para ferramentas e automação.

O frontend pode carregar as seguintes labels:

```yaml
labels:
  app: guestbook
  app.kubernetes.io/name: guestbook
  tier: frontend
```

enquanto o master e a réplica do Redis teriam labels `tier` diferentes e, talvez, até
uma label `role` adicional:

```yaml
labels:
  app: guestbook
  app.kubernetes.io/name: guestbook
  tier: backend
  role: master
```

e

```yaml
labels:
  app: guestbook
  app.kubernetes.io/name: guestbook
  tier: backend
  role: replica
```

As labels permitem fatiar e filtrar os recursos ao longo de qualquer dimensão especificada por uma label:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

## Atualizando labels

Às vezes, você pode querer rotular novamente pods e outros recursos existentes antes de criar
novos recursos. Isso pode ser feito com `kubectl label`.
Por exemplo, se você quiser rotular todos os seus Pods NGINX como camada frontend, execute:

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Isso primeiro filtra todos os pods com a label "app=nginx" e, em seguida, os rotula com "tier=fe".
Para ver os pods que você rotulou, execute:

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Isso produz todos os pods "app=nginx", com uma coluna adicional da label tier dos
pods (especificada com `-L` ou `--label-columns`).

Para obter mais informações, consulte [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## {{% heading "whatsnext" %}}

- Aprenda como [adicionar uma label a um nó](/pt-br/docs/tasks/configure-pod-container/assign-pods-nodes/)
- Encontre [Labels, Anotações e Taints conhecidos](/docs/reference/labels-annotations-taints/)
- Veja as [labels recomendadas](/docs/concepts/overview/working-with-objects/common-labels/)
- [Aplique os Padrões de Segurança de Pod com Labels de Namespace](/pt-br/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- Leia um blog sobre [Escrevendo um Controlador para Labels de Pods](/blog/2021/06/21/writing-a-controller-for-pod-labels/)
