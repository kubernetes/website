---
title: Depuração de Pods
content_type: task
weight: 10
---

<!-- overview -->

Este guia foi criado para ajudar os usuários a depurar aplicações implantadas no Kubernetes
que não estão se comportando corretamente. Este *não* é um guia para quem deseja depurar seu cluster.
Para isso, você deve conferir [este guia](/docs/tasks/debug/debug-cluster).

<!-- body -->

## Diagnosticando o problema

O primeiro passo na solução de problemas é a triagem. Qual é o problema?
São seus Pods, seu Replication Controller ou seu Service?

   * [Depurando Pods](#debugging-pods)
   * [Depurando Replication Controllers](#debugging-replication-controllers)
   * [Depurando Services](#debugging-services)

### Depurando Pods {#debugging-pods}

O primeiro passo para depurar um Pod é examiná-lo. Verifique o estado atual
do Pod e eventos recentes com o seguinte comando:

```shell
kubectl describe pods ${POD_NAME}
```

Observe o estado dos contêineres no pod. Todos estão em `Running`?
Houve reinicializações recentes?

Continue a depuração dependendo do estado dos pods.

#### Meu pod fica em estado pending

Se um Pod estiver preso em `Pending`, significa que ele não pode ser alocado em um nó.
Geralmente, isso ocorre porque há recursos insuficientes de algum tipo, impedindo a alocação.
Verifique a saída do comando `kubectl describe ...` mencionado acima.
Deve haver mensagens do escalonador explicando por que o Pod não pode ser alocado. As razões incluem:

* **Você não tem recursos suficientes**: Pode ser que você tenha esgotado a capacidade de CPU ou Memória no seu cluster.
  Nesse caso, você precisa excluir Pods, ajustar as solicitações de recursos ou adicionar novos nós ao cluster.
  Consulte o documento [Recursos de Computação](/docs/concepts/configuration/manage-resources-containers/) para mais informações.

* **Você está usando `hostPort`**: Quando você vincula um Pod a um `hostPort`, há um número limitado de locais onde esse Pod pode ser alocado.
  Na maioria dos casos, `hostPort` é desnecessário, tente usar um objeto Service para expor seu Pod.
  Se você realmente precisar de `hostPort`, então só poderá alocar tantos Pods quanto o número de nós no seu cluster Kubernetes.


#### Meu pod fica em estado waiting

Se um Pod estiver preso no estado `Waiting`, significa que ele foi alocado para um nó de trabalho,
mas não pode ser executado nessa máquina. Novamente, as informações do comando `kubectl describe ...`
devem fornecer detalhes úteis.

A causa mais comum para Pods em estado `Waiting` é a falha ao baixar a imagem.
Há três coisas que você deve verificar:

* Certifique-se de que o nome da imagem está correto.
* Você enviou a imagem para o registro?
* Tente baixar a imagem manualmente para verificar se ela pode ser baixada. Por exemplo,
  se você usa Docker no seu PC, execute `docker pull `.

#### Meu pod fica em estado terminating

Se um Pod estiver preso no estado `Terminating`, significa que uma solicitação de exclusão foi emitida,
mas a camada de gerenciamento não conseguiu remover o objeto do Pod.

Isso geralmente ocorre se o Pod possui um [finalizer](/docs/concepts/overview/working-with-objects/finalizers/)
e há um [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
instalado no cluster que impede a camada de gerenciamento de remover o finalizer.

Para identificar esse cenário, verifique se seu cluster possui algum ValidatingWebhookConfiguration ou MutatingWebhookConfiguration que tenha como alvo
operações `UPDATE` para recursos `pods`.

Se o webhook for fornecido por um terceiro:
- Certifique-se de estar usando a versão mais recente.
- Desative o webhook para operações `UPDATE`.
- Relate um problema ao provedor correspondente.

Se você for o autor do webhook:
- Para um webhook de mutação, certifique-se de que ele nunca altere campos imutáveis
  em operações `UPDATE`. Por exemplo, mudanças em contêineres geralmente não são permitidas.
- Para um webhook de validação, garanta que suas regras de validação se apliquem apenas a novas alterações.
  Em outras palavras, você deve permitir que Pods com violações existentes passem pela validação.
  Isso permite que Pods criados antes da instalação do webhook continuem em execução.

#### Meu pod está falhando ou não está íntegro

Depois que seu Pod for alocado, você pode usar os métodos descritos em
[Depurando Pods em Execução](/docs/tasks/debug/debug-application/debug-running-pod/) para depuração.

#### Meu pod está em execução, mas não faz o que eu defini

Se o seu pod não está se comportando como esperado, pode haver um erro na descrição do pod
(por exemplo, no arquivo `mypod.yaml` em sua máquina local) que foi ignorado silenciosamente
ao criar o pod. Muitas vezes, uma seção da descrição do pod pode estar aninhada incorretamente
ou um nome de chave pode ter sido digitado incorretamente, fazendo com que a chave seja ignorada.
Por exemplo, se você digitou `commnd` em vez de `command`, o pod será criado,
mas não usará o comando que você pretendia.

A primeira coisa a fazer é excluir seu pod e tentar criá-lo novamente usando a opção `--validate`.
Por exemplo, execute `kubectl apply --validate -f mypod.yaml`.
Se você digitou `command` incorretamente como `commnd`, verá um erro como este:

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

A próxima coisa a verificar é se o pod no servidor da API corresponde ao pod que você pretendia criar
(por exemplo, no arquivo yaml em sua máquina local).
Por exemplo, execute `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` em seguida,
compare manualmente a descrição original do pod, `mypod.yaml` com a versão obtida do servidor da API, `mypod-on-apiserver.yaml`.  
Normalmente, a versão do "servidor da API" terá algumas linhas extras que não estão na versão original,
o que é esperado. No entanto, se houver linhas na versão original que não aparecem na versão do servidor da API, 
isso pode indicar um problema na especificação do seu pod.

### Depurando Replication Controllers {#debugging-replication-controllers}

Replication Controllers são bastante diretos. Eles podem criar pods ou não.
Se não conseguirem criar pods, consulte as
[instruções acima](#debugging-pods) para depurar seus pods.

Você também pode usar `kubectl describe rc ${CONTROLLER_NAME}` para examinar eventos
relacionados ao replication controller.

### Depurando Services {#debugging-services}

Os Services fornecem balanceamento de carga entre um conjunto de pods.
Existem vários problemas comuns que podem fazer com que os Services não funcionem corretamente.
As instruções a seguir devem ajudar na depuração de problemas com Services.

Primeiro, verifique se há endpoints para o Service.
Para cada objeto Service, o servidor da API disponibiliza um recurso `endpoints`.

Você pode visualizar esse recurso com o seguinte comando:

```shell
kubectl get endpoints ${SERVICE_NAME}
```

Certifique-se de que os endpoints correspondem ao número de pods que você espera que sejam membros do seu service.
Por exemplo, se seu Service estiver associado a um contêiner Nginx com 3 réplicas,
você deve esperar ver três endereços IP diferentes nos endpoints do Service.

#### Meu Service não possui endpoints

Se os endpoints estiverem ausentes, tente listar os pods usando os rótulos que o Service utiliza.
Por exemplo, imagine que você tenha um Service com os seguintes rótulos:

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

Você pode usar:

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

para listar os pods que correspondem a esse seletor. Verifique se a lista corresponde aos pods que você espera que forneçam seu Service.  
Além disso, certifique-se de que o `containerPort` do pod corresponde ao `targetPort` do service.

#### O tráfego de rede não está sendo encaminhado

Consulte [Depurando Services](/docs/tasks/debug/debug-application/debug-service/) para mais informações.

## {{% heading "whatsnext" %}}

Se nenhuma das soluções acima resolver seu problema, siga as instruções no
[documento de Depuração de Services](/docs/tasks/debug/debug-application/debug-service/)
para garantir que seu `Service` está em execução, possui `Endpoints` e que seus `Pods`
estão realmente respondendo; além disso, verifique se o DNS está funcionando,
as regras do iptables estão configuradas corretamente e se o kube-proxy não está com problemas.

Você também pode consultar o [documento de solução de problemas](/docs/tasks/debug/) para mais informações.
