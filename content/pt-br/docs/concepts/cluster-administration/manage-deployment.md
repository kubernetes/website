---
title: Gerenciando recursos
content_type: concept
weight: 40
---

<!-- overview -->

Você realizou o _deploy_ da sua aplicação e a disponibilizou por meio de um serviço. E agora? O Kubernetes fornece uma variedade de ferramentas para te ajudar a gerenciar o _deployment_ da sua aplicação, incluindo escalonamento e atualizações. Entre as funcionalidades que iremos discutir com mais profundidade estão os [arquivos de configurações](/pt-br/docs/concepts/configuration/overview/) e as [_labels_](/docs/concepts/overview/working-with-objects/labels/).

<!-- body -->

## Organizando configurações de recursos

Muitas aplicações exigem que vários recursos sejam criados, como _Deployment_ e _Service_. O gerenciamento de múltiplos recursos pode ser simplificado agrupando-os no mesmo arquivo(separado por `---` no YAML). Por exemplo:

{{< codenew file="application/nginx-app.yaml" >}}

Múltiplos recursos podem ser criados da mesma forma que um único recurso:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

Os recursos serão criados na mesma ordem em que aparecem no arquivo. Portanto, é melhor especificar o _service_ primeiro, pois isso irá garantir que o escalonador possa distribuir os _pods_ associados ao serviço à medida que são criados pelo(s) _controller(s)_, como _Deployment_.

`kubectl apply` também aceita mútiplos `-f` como argumento:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

E um diretório pode ser especificado em vez ou além de arquivos individuais:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl` lerá qualquer arquivo com sufixos `.yaml`, `.yml`, or `.json`.

É uma prática recomendada colocar recursos relacionados ao mesmo microsserviço ou camada de aplicação no mesmo arquivo, e agrupar todos os arquivos associados com sua aplicação no mesmo diretório. Se as camadas da sua aplicação comunicarem-se entre si usando DNS, você pode realizar o _deploy_ de todos os componentes da sua _stack_ juntos.

Uma URL também pode ser utilizada como fonte de configuração, o que é útil para realizar o _deploy_ diretamente de arquivos de configurações encontrados no GitHub:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## Operações em massa no kubectl

A criação de recursos não é a única operação em massa que o `kubectl` pode realizar. Ele também pode extrair nomes de recursos a partir de arquivos de configurações para realizar outras operações, em particular para excluir os mesmos recursos que você criou:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

No caso de dois recursos, você pode especificar ambos na linha de comando usando a sintaxe _resource/name_:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

Para um maior número de recursos, será mais fácil especificar o seletor (_label query_) especificado usando `-l` ou `--selector`, para filtrar os recursos pelas suas _labels_:

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Como o `kubectl` gera nomes de recursos na sintaxe aceita, você pode encadear operações usando `$()` ou `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service | xargs -i kubectl get {}
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

Com os comandos acima, primeiro criamos recursos em `examples/application/nginx/exibimos os recursos criados com `-o name`com o formato de saída (imprimindo cada recurso no formato _resource/name_). Em seguida filtramos apenas o recurso _Service_, utilizando a ferramenta `grep`, e então o imprimimos com `kubectl get`.

Se você organizar seus recursos em vários subdiretórios dentro de um diretório específico, você também pode executar recursivamente as operações nos subdiretórios, especificando
com `--recursive` ou `-R` junto com a _flag_ `--filename,-f`.

Por exemplo, suponha que exista um diretório `project/k8s/development` que contém todos os {{< glossary_tooltip text="manifestos" term_id="manifest" >}} necessários para o ambiente de desenvolvimento, organizados por tipo de recurso:

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

Por padrão, executar uma operação em massa em `project/k8s/development` irá parar no primeiro nível do diretório, não processando nenhum subdiretório. Se tivéssemos tentado criar os recursos neste diretório usando o seguinte comando, teríamos encontrado um erro:

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Ao invés disso, utilize a _flag_ `--recursive` ou `-R` com a _flag_ `--filename,-f` assim:

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

A _flag_ `--recursive` funciona com qualquer operação que aceite a _flag_ `--filename,-f` como: `kubectl {create,get,delete,describe,rollout}` etc.

A _flag_ `--recursive` também funciona quando múltiplos `-f` são usados como argumento:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Se você está interessado em aprender mais sobre `kubectl`, leia [Visão geral do kubectl](/docs/reference/kubectl/overview/).

## Usando _labels_ efetivamente

Os exemplos que usamos até agora aplicam no máximo uma única _label_ a qualquer recurso. Há muitos cenários em que múltiplas _labels_ devem ser usadas ​​para distinguir conjuntos uns dos outros.

Por exemplo, diferentes aplicações podem usar diferentes valores para a _label_ `app`, mas uma aplicação multi-nível, como [_guestbook example_](https://github.com/kubernetes/examples/tree/master/guestbook/), também precisaria distinguir cada _tier_. O _frontend_ pode carregar as seguintes _labels_:

```yaml
labels:
  app: guestbook
  tier: frontend
```

Enquanto o Redis primário e o secundário teriam _labels_ de diferentes `tier`, e talvez até uma label adicional para `role`:

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

e

```yaml
labels:
  app: guestbook
  tier: backend
  role: slave
```

As _labels_ nos permitem destrinchar nossos recursos em qualquer dimensão especificada por uma _label_:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```

```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## _Canary deployments_

Outro cenário onde múltiplas _labels_ são necessárias é o de distinguir _deployments_ de diferentes _releases_ ou configurações do mesmo componente. É uma prática comum realizar o _canary deployment_ de uma nova _release_ da aplicação (especificada por meio da _tag_ de imagem no _template_ do _pod_) lado a lado com a _release_ anterior para que a nova _release_ possa receber o trafégo de produção antes de implantá-la totalmente.

Por exemplo, você pode usar a _label_ `track` para distinguir diferentes _releases_.

A versão _stable_ poderia ter uma _label_ `track` com o valor de `stable`:

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

E, em seguida, você pode criar uma nova _release_ do _guestbook frontend_ que carrega a _label_ `track` com um valor diferente (ou seja, `canary`), para que os dois conjuntos de _pods_ não se sobreponham:

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

O serviço _frontend_ cobriria ambos os conjuntos de réplicas selecionando o subconjunto comum de suas _labels_ (ou seja, omitindo a _label_ `track`), para que o trafégo seja redirecionado para ambas as aplicações:

```yaml
selector:
  app: guestbook
  tier: frontend
```

Você pode ajustar o número de réplicas da _release_ _stable_ e da _release_ _canary_ para determinar a proporção de tráfego de produção recebido por cada _release_(nesse caso, 3:1).
Quando estiver confiante, você pode atualizar a _track_ _stable_ para a nova _release_ da aplicação e remover a _canary_.

Para um examplo mais concreto, consulte o [_tutorial of deploying Ghost_](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).

## Atualizando _labels_

Às vezes, os _pods_ existentes e outros recursos precisam ter suas _labels_ atualizadas antes de criar novos recursos. Isso pode ser feito com o `kubectl label`.
Por exemplo, se você quiser adicionar uma _label_ _tier_ com o valor _frontend_ em todos os seus _pods_ do nginx, execute:

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Isso primeiro filtra todos os _pods_ com a _label_ "app=nginx", e então adiciona a _label_ "tier=fe".
Para ver as _labels_ que foram adicionadas aos _pods_, execute:

```shell
kubectl get pods -l app=nginx -L tier
```

```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Isso exibe todos os pods com "app=nginx", com uma coluna adicional para a _label_ _tier_ (especificada com `-L` ou `--label-columns`).

Para mais informações, por favor visite [_labels_](/docs/concepts/overview/working-with-objects/labels/) e [kubectl _label_](/docs/reference/generated/kubectl/kubectl-commands/#label).

## Atualizando anotações

Às vezes, você gostaria de anexar anotações aos recursos. Anotações são metadados arbitrários não identificadores para serem utilizados pelos clientes da API como ferramentas, bibliotecas, etc. Isso pode ser feito com `kubectl annotate`. Por exemplo:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

Para mais informações, por favor veja os documentos de [_annotations_](/docs/concepts/overview/working-with-objects/annotations/) e [kubectl _annotate_](/docs/reference/generated/kubectl/kubectl-commands/#annotate).

## Escalando sua aplicação

Quando a carga da sua aplicação aumentar ou diminuir, use `kubectl` para escalar sua aplicação. Por exemplo, para diminuir o número de réplicas do nginx de 3 para 1, faça:

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```shell
deployment.apps/my-nginx scaled
```

Agora você tem apenas um _pod_ gerenciado pelo _deployment_.

```shell
kubectl get pods -l app=nginx
```

```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Para que o sistema escolha automaticamente o número de réplicas nginx de acordo com o necessário, variando de 3 para 1, faça:

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Agora as suas réplicas do nginx vão aumentar e diminuir conforme necessário, automaticamente.

Para mais informações, por favor veja os documentos [kubectl _scale_](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl _autoscale_](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) e [horizontal _pod autoscaler_](/docs/tasks/run-application/horizontal-pod-autoscale/).

## Atualização de recursos em execução

Às vezes, é necessário fazer atualizações restritas e sem interrupções nos recursos que você criou.

### kubectl apply

É sugerido manter um conjunto de arquivos de configuração no sistema de controle de versão de código-fonte
(veja [_configuration as code_](https://martinfowler.com/bliki/InfrastructureAsCode.html)),
para que eles possam ser mantidos e versionados junto com o código para os recursos que eles configuram.
Então, você pode usar [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) para enviar suas alterações de configuração para o cluster.

Este comando comparará a versão da configuração que você está enviando com a versão anterior e aplicará as alterações feitas, sem substituir nenhuma alteração automatizada nas propriedades que você não especificou.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

Observe que `kubectl apply` anexa uma anotação ao recurso para determinar as mudanças na configuração desde a chamada anterior. Quando ela é invocada, `kubectl apply` realiza um _three-way diff_ entre a configuração anterior, a entrada fornecida e a configuração atual do recurso, a fim de determinar como modificar o recurso.

Atualmente, os recursos são criados sem essa anotação, portanto, a primeira chamada de `kubectl apply` retornará uma _two-way diff_ entre a entrada fornecida e a configuração atual do recurso. Durante essa primeira chamada, ele não pode detectar a exclusão das propriedades definidas quando o recurso foi criado. Por essa razão, não irá removê-los.

Todas as chamadas subsequente para `kubectl apply`, e outros comandos que modificam a configuração, como `kubectl replace` e `kubectl edit`, irão atualizar a anotação, permitindo que chamadas subsequentes para `kubectl apply` detectem e executem exclusões usando uma _three-way diff_.

### kubectl edit

Alternativamente, você também pode atualizar recursos com `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
```

Isso é equivalente a primeiro obter o recurso através de `kubectl get`, editá-lo no editor de texto e depois aplicar as alterações no cluster, utilizando `kubectl apply` com a versão atualizada:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

Isso permite que você faça alterações mais significativas com mais facilidade. Observe que você pode especificar o editor com suas variáveis ​​de ambiente `EDITOR` ou `KUBE_EDITOR`

Para mais informações, por favor veja o documento [kubectl _edit_](/docs/reference/generated/kubectl/kubectl-commands/#edit).

### kubectl patch

Você pode usar `kubectl patch` para atualizar os objetos da API _in place_. Este comando suporta JSON _patch_,
JSON _merge patch_, e _strategic merge patch_. Veja
[Atualizando objetos da API _in Place_ usando kubectl _patch_](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
e
[kubectl _patch_](/docs/reference/generated/kubectl/kubectl-commands/#patch).

## Atualizações disruptivas

Em alguns casos, você pode precisar atualizar os campos de recursos que não podem ser atualizados depois de inicializados, ou você pode querer fazer uma alteração recursiva imediatamente, como corrigir _pods_ quebrados criados pelo _deployment_. Para mudar estes campos, use `replace --force`, que exclui e recria o recurso. Nesse caso, você pode modificar seu arquivo de configuração original:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## Atualizando sua aplicação sem interrupção do serviço

Em algum ponto, você eventualmente precisará atualizar suas aplicações instaladas, normalmente especificando uma nova imagem ou uma nova _tag_ de imagem, como no cenário de _canary deployment_ acima. `kubectl` suporta várias operações de atualização, cada uma aplicável a diferentes cenários.

Vamos orientá-lo sobre como criar e atualizar seus aplicativos com _Deployments_.

Digamos que você está executando a versão 1.14.2 do nginx:

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```shell
deployment.apps/my-nginx created
```

com 3 réplicas (para que as revisões antigas e novas coexistam):

```shell
kubectl scale deployment my-nginx --current-replicas=1 --replicas=3
```

```
deployment.apps/my-nginx scaled
```

Para atualizar para a versão 1.16.1, altere `.spec.template.spec.containers[0].image` do `nginx:1.14.2` para `nginx:1.16.1 usando os comandos kubectl anteriores.

```shell
kubectl edit deployment/my-nginx
```

É isso! O _Deployment_ irá atualizar declarativamente a aplicação nginx instalada progressivamente por trás das cenas. Ele garante que apenas um certo número de réplicas antigas possam estar inativas enquanto estão sendo atualizadas e que apenas um certo número de réplicas pode ser criado acima do número de _pods_ desejados. Para saber mais detalhes sobre isso, visite a [página de _Deployment_](/docs/concepts/workloads/controllers/deployment/).

## {{% heading "whatsnext" %}}

- Aprenda sobre [como usar `kubectl` para introspecção e depuração de aplicações](/docs/tasks/debug-application-cluster/debug-application-introspection/).
- Veja [Melhores práticas e dicas de configuração](/docs/concepts/configuration/overview/).
