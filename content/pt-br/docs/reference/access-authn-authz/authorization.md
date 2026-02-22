---
title: Visão Geral de Autorização
content_type: concept
weight: 60
---

<!-- overview -->
Aprenda mais sobre autorização no Kubernetes, incluindo detalhes sobre
criação de políticas utilizando módulos de autorização suportados.

<!-- body -->

No Kubernetes, você deve estar autenticado (conectado) antes que sua requisição possa ser
autorizada (permissão concedida para acesso). Para obter informações sobre autenticação,
visite [Controlando Acesso à API do Kubernetes](/pt-br/docs/concepts/security/controlling-access/).

O Kubernetes espera atributos que são comuns a requisições de APIs REST. Isto significa
que autorização no Kubernetes funciona com sistemas de controle de acesso a nível de organizações
ou de provedores de nuvem que possam lidar com outras APIs além das APIs do Kubernetes.

## Determinar se uma requisição é permitida ou negada

O Kubernetes autoriza requisições de API utilizando o servidor de API. Ele avalia
todos os atributos de uma requisição em relação a todas as políticas disponíveis e permite ou nega a requisição.
Todas as partes de uma requisição de API deve ser permitidas por alguma política para que possa prosseguir.
Isto significa que permissões são negadas por padrão.

(Embora o Kubernetes use o servidor de API, controles de acesso e políticas que
dependem de campos específicos de tipos específicos de objetos são tratados pelos controladores de admissão.)

Quando múltiplos módulos de autorização são configurados, cada um será verificado em sequência.
Se qualquer dos autorizadores aprovarem ou negarem uma requisição, a decisão é imediatamente
retornada e nenhum outro autorizador é consultado. Se nenhum módulo de autorização tiver
nenhuma opinião sobre requisição, então a requisição é negada. Uma negação retorna um
código de status HTTP 403.

## Revisão de atributos de sua requisição

O Kubernetes revisa somente os seguintes atributos de uma requisição de API:

 * **user** - O string de `user` fornecido durante a autenticação.
 * **group** - A lista de nomes de grupos aos quais o usuário autenticado pertence.
 * **extra** - Um mapa de chaves de string arbitrárias para valores de string, fornecido pela camada de autenticação.
 * **API** - Indica se a solicitação é para um recurso de API.
 * **Caminho da requisição** - Caminho para diversos endpoints que não manipulam recursos, como `/api` ou `/healthz`.
 * **Verbo de requisição de API** - Verbos da API como `get`, `list`, `create`, `update`, `patch`, `watch`, `delete` e `deletecollection` que são utilizados para solicitações de recursos. Para determinar o verbo de requisição para um endpoint de recurso de API , consulte [Determine o verbo da requisição](/pt-br/docs/reference/access-authn-authz/authorization/#determine-the-request-verb).
 * **Verbo de requisição HTTP** - Métodos HTTP em letras minúsculas como `get`, `post`, `put` e `delete` que são utilizados para requisições que não são de recursos.
 * **Recurso** - O identificador ou nome do recurso que está sendo acessado (somente para requisições de recursos) - para requisições de recursos usando os verbos `get`, `update`, `patch` e `delete`, deve-se fornecer o nome do recurso.
 * **Subrecurso** - O sub-recurso que está sendo acessado (somente para solicitações de recursos).
 * **Namespace** - O namespace do objeto que está sendo acessado (somente para solicitações de recursos com namespace).
 * **Grupo de API** - O {{< glossary_tooltip text="API Group" term_id="api-group" >}} sendo acessado (somente para requisições de recursos). Uma string vazia designa o [Grupo de API](/docs/reference/using-api/#api-groups) _core_.

## Determine o verbo da requisição {#determine-the-request-verb}

**Requisições de não-recursos**
Requisições sem recursos de `/api/v1/...` ou `/apis/<group>/<version>/...`
são considerados "requisições sem recursos" e usam o método HTTP em letras minúsculas da solicitação como o verbo.
Por exemplo, uma solicitação `GET` para endpoints como `/api` ou `/healthz` usaria `get` como o verbo.

**Requisições de recursos**
Para determinar o verbo de requisição para um endpoint de API de recurso, revise o verbo HTTP
utilizado e se a requisição atua ou não em um recurso individual ou em uma
coleção de recursos:

Verbo HTTP | Verbo de Requisição
---------- |---------------
POST       | create
GET, HEAD  | get (para recursos individuais), list (para coleções, includindo o conteúdo do objeto inteiro), watch (para observar um recurso individual ou coleção de recursos)
PUT        | update
PATCH      | patch
DELETE     | delete (para recursos individuais), deletecollection (para coleções)

{{< caution >}}
Os verbos `get`, `list` e `watch` podem retornar todos os detalhes de um recurso. Eles são equivalentes em relação aos dados retornados. Por exemplo, `list` em `secrets` revelará os atributos de `data` de qualquer recurso retornado.
{{< /caution >}}

Às vezes, o Kubernetes verifica a autorização para permissões adicionais utilizando verbos especializados. Por exemplo:

* [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/)
  * Verbo `use` em recursos `podsecuritypolicies` no grupo `policy` de API.
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * Verbos `bind` e `escalate` em `roles` e recursos `clusterroles` no grupo `rbac.authorization.k8s.io` de API.
* [Authentication](/pt-br/docs/reference/access-authn-authz/authentication/)
  * Verbo `impersonate` em `users`, `groups`, e `serviceaccounts` no grupo de API `core`, e o `userextras` no grupo `authentication.k8s.io` de API.

## Modos de Autorização {#authorization-modules}

O servidor da API Kubernetes pode autorizar uma solicitação usando um dos vários modos de autorização:

 * **Node** - Um modo de autorização de finalidade especial que concede permissões a ```kubelets``` com base nos ```Pods``` que estão programados para execução. Para saber mais sobre como utilizar o modo de autorização do nó, consulte [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC), ou Controle de acesso baseado em atributos, define um paradigma de controle de acesso pelo qual os direitos de acesso são concedidos aos usuários por meio do uso de políticas que combinam atributos. As políticas podem usar qualquer tipo de atributo (atributos de usuário, atributos de recurso, objeto, atributos de ambiente, etc.). Para saber mais sobre como usar o modo ABAC, consulte [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC), ou controle de acesso baseado em função, é um método de regular o acesso a recursos computacionais ou de rede com base nas funções de usuários individuais dentro de uma empresa. Nesse contexto, acesso é a capacidade de um usuário individual realizar uma tarefa específica, como visualizar, criar ou modificar um arquivo. Para saber mais sobre como usar o modo RBAC, consulte [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * Quando especificado RBAC (Role-Based Access Control) usa o grupo de API `rbac.authorization.k8s.io` para orientar as decisões de autorização, permitindo que os administradores configurem dinamicamente as políticas de permissão por meio da API do Kubernetes.
   * Para habilitar o modo RBAC, inicie o servidor de API (apiserver) com a opção `--authorization-mode=RBAC`.
 * **Webhook** - Um WebHook é um retorno de chamada HTTP: um HTTP POST que ocorre quando algo acontece; uma simples notificação de evento via HTTP POST. Um aplicativo da Web que implementa WebHooks postará uma mensagem em um URL quando um determinado evento ocorrer. Para saber mais sobre como usar o modo Webhook, consulte [Webhook Mode](/docs/reference/access-authn-authz/webhook/).

#### Verificando acesso a API

`kubectl` fornece o subcomando `auth can-i` para consultar rapidamente a camada de autorização da API.
O comando usa a API `SelfSubjectAccessReview` para determinar se o usuário atual pode executar
uma determinada ação e funciona independentemente do modo de autorização utilizado.


```bash
# "can-i create" = "posso criar"
kubectl auth can-i create deployments --namespace dev
```

A saída é semelhante a esta:

```
yes
```

```shell
# "can-i create" = "posso criar"
kubectl auth can-i create deployments --namespace prod
```

A saída é semelhante a esta:

```
no
```

Os administradores podem combinar isso com [personificação de usuário](/pt-br/docs/reference/access-authn-authz/authentication/#personificação-de-usuário)
para determinar qual ação outros usuários podem executar.

```bash
# "can-i list" = "posso listar"

kubectl auth can-i list secrets --namespace dev --as dave
```

A saída é semelhante a esta:

```
no
```

Da mesma forma, para verificar se uma ServiceAccount chamada `dev-sa` no Namespace `dev`
pode listar ```Pods``` no namespace `target`:

```bash
# "can-i list" = "posso listar"
kubectl auth can-i list pods \
	--namespace target \
	--as system:serviceaccount:dev:dev-sa
```

A saída é semelhante a esta:

```
yes
```

`SelfSubjectAccessReview` faz parte do grupo de API `authorization.k8s.io`, que
expõe a autorização do servidor de API para serviços externos. Outros recursos
neste grupo inclui:

* `SubjectAccessReview` - Revisão de acesso para qualquer usuário, não apenas o atual. Útil para delegar decisões de autorização para o servidor de API. Por exemplo, o ```kubelet``` e extensões de servidores de API utilizam disso para determinar o acesso do usuário às suas próprias APIs.

* `LocalSubjectAccessReview` - Similar a `SubjectAccessReview`, mas restrito a um namespace específico.

* `SelfSubjectRulesReview` - Uma revisão que retorna o conjunto de ações que um usuário pode executar em um namespace. Útil para usuários resumirem rapidamente seu próprio acesso ou para interfaces de usuário mostrarem ações.

Essas APIs podem ser consultadas criando recursos normais do Kubernetes, onde a resposta no campo `status`
do objeto retornado é o resultado da consulta.

```bash
kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    verb: create
    namespace: dev
EOF
```

A `SelfSubjectAccessReview` gerada seria:
```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

## Usando flags para seu módulo de autorização

Você deve incluir uma flag em sua política para indicar qual módulo de autorização
suas políticas incluem:

As seguintes flags podem ser utilizadas:

  * `--authorization-mode=ABAC` O modo de controle de acesso baseado em atributos (ABAC) permite configurar políticas usando arquivos locais.
  * `--authorization-mode=RBAC` O modo de controle de acesso baseado em função (RBAC) permite que você crie e armazene políticas usando a API do Kubernetes.
  * `--authorization-mode=Webhook` WebHook é um modo de retorno de chamada HTTP que permite gerenciar a autorização usando endpoint REST.
  * `--authorization-mode=Node` A autorização de nó é um modo de autorização de propósito especial que autoriza especificamente requisições de API feitas por ```kubelets```.
  * `--authorization-mode=AlwaysDeny` Esta flag bloqueia todas as requisições. Utilize esta flag somente para testes.
  * `--authorization-mode=AlwaysAllow` Esta flag permite todas as requisições. Utilize esta flag somente se não existam requisitos de autorização para as requisições de API.

Você pode escolher mais de um modulo de autorização. Módulos são verificados
em ordem, então, um modulo anterior tem maior prioridade para permitir ou negar uma requisição.

## Escalonamento de privilégios através da criação ou edição da cargas de trabalho {#privilege-escalation-via-pod-creation}

Usuários que podem criar ou editar ```pods``` em um namespace diretamente ou através de um [controlador](/pt-br/docs/concepts/architecture/controller/)
como, por exemplo, um operador, conseguiriam escalar seus próprios privilégios naquele namespace.

{{< caution >}}
Administradores de sistemas, tenham cuidado ao permitir acesso para criar ou editar cargas de trabalho.
Detalhes de como estas permissões podem ser usadas de forma maliciosa podem ser encontradas em [caminhos para escalonamento](#escalation-paths).

{{< /caution >}}

### Caminhos para escalonamento {#escalation-paths}

- Montagem de Secret arbitrários nesse namespace
   - Pode ser utilizado para acessar Secret destinados a outras cargas de trabalho
   - Pode ser utilizado para obter um token da conta de serviço com maior privilégio
- Uso de contas de serviço arbitrárias nesse namespace
   - Pode executar ações da API do Kubernetes como outra carga de trabalho (personificação)
   - Pode executar quaisquer ações privilegiadas que a conta de serviço tenha acesso
- Montagem de configmaps destinados a outras cargas de trabalho nesse namespace
   - Pode ser utilizado para obter informações destinadas a outras cargas de trabalho, como nomes de host de banco de dados.
- Montagem de volumes destinados a outras cargas de trabalho nesse namespace
   - Pode ser utilizado para obter informações destinadas a outras cargas de trabalho e alterá-las.

{{< caution >}}
Administradores de sistemas devem ser cuidadosos ao instalar CRDs que
promovam mudanças nas áreas mencionadas acima. Estes podem abrir caminhos para escalonamento.
Isto deve ser considerado ao decidir os controles de acesso baseado em função (RBAC).
{{< /caution >}}

## {{% heading "whatsnext" %}}

* Para aprender mais sobre autenticação, visite **Authentication** in [Controlando acesso a APIs do Kubernetes](/pt-br/docs/concepts/security/controlling-access/).
* Para aprender mais sobre Admission Control, visite [Utilizando Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).