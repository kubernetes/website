---
title: Utilizando Autorização ABAC
content_type: concept
weight: 80
---

<!-- overview -->
O controle de acesso baseado em atributos (ABAC) define um paradigma de controle de acesso onde os direitos de acesso são concedidos aos usuários por meio do uso de políticas que combinam atributos.

<!-- body -->
## Formato do arquivo de política

Especifique os parametros de inicialização `--authorization-policy-file=NOME_DE_ALGUM_ARQUIVO` e `--authorization-mode=ABAC` para habilitar o modo `ABAC`.

O formato do arquivo é de [um objeto JSON por linha](https://jsonlines.org/). Nele não deve haver lista ou mapa envolvente, apenas um mapa por linha.

Cada linha é um "objeto de política", onde cada objeto é um mapa com as seguintes propriedades:

  - Propriedades de versionamento:
    - `apiVersion`, tipo string; os valores válidos são "abac.authorization.kubernetes.io/v1beta1". Permite controle de versão e conversão do formato da política.
    - `kind`, tipo string: os valores válidos são "Policy". Permite controle de versão e conversão do formato da política.
  - `spec` definida para um mapa com as seguintes propriedades:
    - Propriedades de correspondência de sujeito:
      - `user`, tipo string; a string de usuário de `--token-auth-file`. Se você especificar `user`, ele deve corresponder ao nome do usuário autenticado.
      - `group`, tipo string; se você especificar `group`, ele deve corresponder a um dos grupos do usuário autenticado `system:authenticated` corresponde a todas as requisições autenticadas. `system:unauthenticated` corresponde a todas as requisições não autenticadas.
    - Propriedades de correspondência de recursos:
      - `apiGroup`, tipo string; um grupo de API.
        - Ex: `apps`, `networking.k8s.io`
        - Curinga: `*` corresponde a todos os grupos de API.
      - `namespace`, tipo string; um namespace.
        - Ex: `kube-system`
        - Curinga: `*` corresponde a todas as requisições de recursos.
      - `resource`, tipo string; um tipo de recurso
        - Ex: `pods`, `deployments`
        - Curinga: `*` corresponde a todas as requisições de recursos.
    - Propriedades sem correspondência de recursos:
      - `nonResourcePath`, tipo string; caminhos de solicitação sem recurso.
        - Ex: `/version` ou `/apis`
        - Curinga:
          - `*` corresponde a todas as requisições que não são de recursos.
          - `/foo/*` corresponde a todos os subcaminhos de `/foo/`.
    - `readonly`, tipo booleano. Quando verdadeiro, significa que a política de correspondência de recursos se aplica apenas às operações `get`, `list` e `watch`. Em caso de políticas sem correspondência de recursos se aplica apenas à operação `get`.

{{< note >}}
Uma propriedade não definida é igual a uma propriedade definida com o valor zero para seu tipo
(por exemplo, string vazia, 0, falso). No entanto, indefinido deve ser preferido para legibilidade.

No futuro, as políticas poderão ser expressas no formato JSON e gerenciadas por meio de uma interface REST.
{{< /note >}}

## Algoritmo de Autorização

Uma requisição possui atributos que correspondem às propriedades de um objeto de política.

Quando uma requisição é recebida, os atributos são determinados. Atributos desconhecidos são definidos com o valor zero de seu tipo (por exemplo, string vazia, 0, falso).

Uma propriedade definida como `"*"` corresponderá a qualquer valor do atributo correspondente.

A tupla de atributos é verificada em relação a cada política do arquivo de política. Se pelo menos uma linha corresponder aos atributos da requisição, ela é então autorizada (mas pode falhar em validação posterior).

Para permitir que qualquer usuário autenticado faça algo, escreva uma política com a propriedade do grupo definida como `"system:authenticated"`.

Para permitir que qualquer usuário não autenticado faça algo, escreva uma política com a propriedade do grupo definida como `"system:unauthenticated"`.

Para permitir que um usuário faça qualquer coisa, escreva uma política com as propriedades `apiGroup`, `namespace`, `resource`  e `nonResourcePath` definidas como `"*"`.

## Kubectl

O Kubectl usa os endpoints `/api` e `/apis` do servidor de API para descobrir os tipos de recursos servidos e valida objetos enviados para a API pelas operações criar/atualizar usando informações de esquema localizadas em `/openapi/v2`.

Ao utilizar a autorização ABAC, esses recursos especiais devem ser explicitamente expostos por meio da propriedade `nonResourcePath` em uma política (consulte [exemplos](#exemplos) abaixo):

* `/api`, `/api/*`, `/apis` e `/apis/*` para negociação de versão da API.
* `/version` para recuperar a versão do servidor via `kubectl version`.
* `/swaggerapi/*` para operações de criação/atualização.

Para inspecionar as chamadas HTTP envolvidas em uma operação kubectl específica, você pode aumentar a verbosidade:

```shell
kubectl --v=8 version
```

## Exemplos

 1. Alice pode fazer qualquer coisa em todos os recursos:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
 2. O Kubelet pode ler qualquer Pod:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
 3. O Kubelet pode ler e escrever eventos:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
 4. Bob pode ler Pods somente pertencentes ao namespace "projectCaribou":

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
 5. Qualquer pessoa pode realizar requisições somente-leitura em todos os caminhos que não são de recursos:
 
    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```

[Exemplo de arquivo completo](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## Uma rápida observação sobre contas de serviço

Cada conta de serviço tem um nome de usuário ABAC correspondente, e o nome de usuário dessa conta de serviço é gerado de acordo com a convenção de nomenclatura:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

A criação de um novo namespace leva à criação de uma nova conta de serviço no seguinte formato:

```shell
system:serviceaccount:<namespace>:default
```

Por exemplo, se você quiser conceder à conta de serviço padrão (no namespace `kube-system`) privilégio total à API usando ABAC, adicione esta linha ao seu arquivo de política:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

O servidor de API precisará ser reiniciado para carregar as novas linhas da política.
