---
title: Controle de Admissão Dinâmico
content_type: concept
weight: 45
---

<!-- overview -->
Além dos [plugins de admissão compilados](/docs/reference/access-authn-authz/admission-controllers/),
plugins de admissão podem ser desenvolvidos como extensões e executados como webhooks configurados em tempo de execução.
Esta página descreve como construir, configurar, usar e monitorar webhooks de admissão.

<!-- body -->

## O que são webhooks de admissão?

Webhooks de admissão são callbacks HTTP que recebem requisições de admissão e
realizam alguma ação com elas. Você pode definir dois tipos de webhooks de admissão:
[webhook de admissão de validação](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
e
[webhook de admissão de mutação](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
Webhooks de admissão de mutação são invocados primeiro e podem modificar objetos enviados ao servidor de API para aplicar padrões personalizados.
Após todas as modificações nos objetos serem concluídas e depois que o objeto recebido for validado pelo servidor de API,
os webhooks de admissão de validação são invocados e podem rejeitar requisições para aplicar políticas personalizadas.

{{< note >}}
Webhooks de admissão que precisam garantir que visualizam o estado final do objeto para aplicar políticas
devem usar um webhook de admissão de validação, pois os objetos podem ser modificados após serem processados pelos webhooks de mutação.
{{< /note >}}

## Experimentando com webhooks de admissão

Webhooks de admissão são essencialmente parte da camada de gerenciamento do cluster. Você deve
escrevê-los e implantá-los com grande cautela. Por favor, leia os
[guias do usuário](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)
para instruções caso pretenda escrever/implantar webhooks de admissão para uso em produção.
A seguir, descrevemos como experimentar rapidamente com webhooks de admissão.

### Pré-requisitos

* Certifique-se de que os controladores de admissão MutatingAdmissionWebhook e ValidatingAdmissionWebhook
  estão habilitados.
  [Aqui](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  está um conjunto recomendado de controladores de admissão para habilitar de forma geral.

* Certifique-se de que a API `admissionregistration.k8s.io/v1` está habilitada.

### Escreva um servidor de webhook de admissão

Por favor, consulte a implementação do [servidor de webhook de admissão](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)
que é validado em um teste e2e do Kubernetes. O webhook trata a
requisição `AdmissionReview` enviada pelos servidores de API, e envia de volta sua decisão
como um objeto `AdmissionReview` na mesma versão em que foi recebida.

Consulte a seção [requisição do webhook](#request) para detalhes sobre os dados enviados aos webhooks.

Consulte a seção [resposta do webhook](#response) para os dados esperados dos webhooks.

O exemplo de servidor de webhook de admissão deixa o campo `ClientAuth`
[vazio](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39),
cujo padrão é `NoClientCert`. Isso significa que o servidor de webhook não
autentica a identidade dos clientes, supostamente servidores de API. Se você precisar
de TLS mútuo ou outras formas de autenticar os clientes, veja
como [autenticar servidores de API](#authenticate-apiservers).

### Implante o serviço de webhook de admissão

O servidor de webhook no teste e2e é implantado no cluster Kubernetes, por meio
da [API de Deployment](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps).
O teste também cria um [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
como front-end do servidor de webhook. Veja o
[código](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748).

Você também pode implantar seus webhooks fora do cluster. Será necessário atualizar
suas configurações de webhook de acordo.

### Configure webhooks de admissão dinamicamente

Você pode configurar dinamicamente quais recursos estão sujeitos a quais webhooks
de admissão por meio de
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
ou
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).

A seguir, um exemplo de `ValidatingWebhookConfiguration`, uma configuração de webhook de mutação é semelhante.
Consulte a seção [configuração de webhook](#webhook-configuration) para detalhes sobre cada campo de configuração.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups:   [""]
    apiVersions: ["v1"]
    operations:  ["CREATE"]
    resources:   ["pods"]
    scope:       "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: <CA_BUNDLE>
  admissionReviewVersions: ["v1"]
  sideEffects: None
  timeoutSeconds: 5
```

{{< note >}}
Você deve substituir o `<CA_BUNDLE>` no exemplo acima por um pacote de CA válido,
que é um pacote de CA codificado em PEM (o valor do campo é codificado em Base64) para validar o certificado do servidor do webhook.
{{< /note >}}

O campo `scope` especifica se apenas recursos com escopo de cluster ("Cluster") ou recursos
com escopo de namespace ("Namespaced") corresponderão a esta regra. "&lowast;" significa que não há restrições de escopo.

{{< note >}}
Ao usar `clientConfig.service`, o certificado do servidor deve ser válido para
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

{{< note >}}
O tempo limite padrão para uma chamada de webhook é de 10 segundos.
Você pode definir o `timeout` e é recomendado usar um tempo limite curto para webhooks.
Se a chamada do webhook expirar, a requisição é tratada de acordo com a
política de falha do webhook.
{{< /note >}}

Quando um servidor de API recebe uma requisição que corresponde a uma das `rules`, o
servidor de API envia uma requisição `admissionReview` ao webhook conforme especificado no
`clientConfig`.

Após criar a configuração do webhook, o sistema levará alguns segundos
para aplicar a nova configuração.

### Autenticar servidores de API   {#authenticate-apiservers}

Se seus webhooks de admissão requerem autenticação, você pode configurar os
servidores de API para usar autenticação básica, token bearer ou um certificado para se autenticar
nos webhooks. Há três etapas para concluir a configuração.

* Ao iniciar o servidor de API, especifique a localização do arquivo de
  configuração de controle de admissão por meio da flag `--admission-control-config-file`.

* No arquivo de configuração de controle de admissão, especifique onde o
  controlador MutatingAdmissionWebhook e o controlador ValidatingAdmissionWebhook
  devem ler as credenciais. As credenciais são armazenadas em arquivos kubeConfig
  (sim, o mesmo esquema usado pelo kubectl), então o nome do campo é
  `kubeConfigFile`. Aqui está um exemplo de arquivo de configuração de controle de admissão:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
```

Para mais informações sobre `AdmissionConfiguration`, consulte a
[referência de AdmissionConfiguration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/).
Consulte a seção [configuração de webhook](#webhook-configuration) para detalhes sobre cada campo de configuração.

No arquivo kubeConfig, forneça as credenciais:

```yaml
apiVersion: v1
kind: Config
users:
# name deve ser definido como o nome DNS do serviço ou o host (incluindo a porta) da URL para a qual o webhook está configurado para se comunicar.
# Se uma porta diferente de 443 for usada para serviços, ela deve ser incluída no name ao configurar servidores de API na versão 1.16+.
#
# Para um webhook configurado para se comunicar com um serviço na porta padrão (443), especifique o nome DNS do serviço:
# - name: webhook1.ns1.svc
#   user: ...
#
# Para um webhook configurado para se comunicar com um serviço em uma porta não padrão (por exemplo, 8443), especifique o nome DNS e a porta do serviço na versão 1.16+:
# - name: webhook1.ns1.svc:8443
#   user: ...
# e opcionalmente crie uma segunda entrada usando apenas o nome DNS do serviço para compatibilidade com servidores de API na versão 1.15:
# - name: webhook1.ns1.svc
#   user: ...
#
# Para webhooks configurados para se comunicar com uma URL, use o host (e porta) especificado na URL do webhook correspondente. Exemplos:
# Um webhook com `url: https://www.example.com`:
# - name: www.example.com
#   user: ...
#
# Um webhook com `url: https://www.example.com:443`:
# - name: www.example.com:443
#   user: ...
#
# Um webhook com `url: https://www.example.com:8443`:
# - name: www.example.com:8443
#   user: ...
#
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: "<pem encoded certificate>"
    client-key-data: "<pem encoded key>"
# O `name` suporta o uso de * para corresponder prefixos de segmentos com curinga.
- name: '*.webhook-company.org'
  user:
    password: "<password>"
    username: "<name>"
# '*' é a correspondência padrão.
- name: '*'
  user:
    token: "<token>"
```

Naturalmente, você precisa configurar o servidor de webhook para tratar essas requisições de autenticação.

## Requisição e resposta do webhook

### Requisição {#request}

Webhooks são enviados como requisições POST, com `Content-Type: application/json`,
com um objeto de API `AdmissionReview` no grupo de API `admission.k8s.io`
serializado em JSON como corpo.

Webhooks podem especificar quais versões dos objetos `AdmissionReview` eles aceitam
com o campo `admissionReviewVersions` em sua configuração:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1", "v1beta1"]
```

`admissionReviewVersions` é um campo obrigatório ao criar configurações de webhook.
Webhooks são obrigados a suportar pelo menos uma versão de `AdmissionReview`
compreendida pelo servidor de API atual e pelo anterior.

Os servidores de API enviam a primeira versão de `AdmissionReview` na lista `admissionReviewVersions` que eles suportam.
Se nenhuma das versões na lista for suportada pelo servidor de API, a configuração não poderá ser criada.
Se um servidor de API encontrar uma configuração de webhook criada anteriormente que não suporta nenhuma das versões de `AdmissionReview`
que o servidor de API sabe enviar, as tentativas de chamada ao webhook falharão e estarão sujeitas à [política de falha](#failure-policy).

Este exemplo mostra os dados contidos em um objeto `AdmissionReview`
para uma requisição de atualização do recurso aninhado `scale` de um objeto `Deployment` do grupo de API `apps/v1`:

```yaml
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # uid aleatório que identifica exclusivamente esta chamada de admissão
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # group/version/kind totalmente qualificado do objeto recebido
    "kind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # group/version/kind totalmente qualificado do recurso sendo modificado
    "resource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # Recurso aninhado, se a requisição for para um recurso aninhado
    "subResource": "scale",

    # group/version/kind totalmente qualificado do objeto recebido na requisição original ao servidor de API
    # Isso só difere de `kind` se o webhook especificou `matchPolicy: Equivalent` e a requisição
    # original ao servidor de API foi convertida para uma versão para a qual o webhook se registrou
    "requestKind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # group/version/kind totalmente qualificado do recurso sendo modificado na requisição original ao servidor de API
    # Isso só difere de `resource` se o webhook especificou `matchPolicy: Equivalent` e a requisição
    # original ao servidor de API foi convertida para uma versão para a qual o webhook se registrou
    "requestResource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # Recurso aninhado, se a requisição for para um recurso aninhado
    # Isso só difere de `subResource` se o webhook especificou `matchPolicy: Equivalent` e a requisição
    # original ao servidor de API foi convertida para uma versão para a qual o webhook se registrou
    "requestSubResource": "scale",

    # Nome do recurso sendo modificado
    "name": "my-deployment",

    # Namespace do recurso sendo modificado, se o recurso tiver escopo de namespace (ou for um objeto Namespace)
    "namespace": "my-namespace",

    # operation pode ser CREATE, UPDATE, DELETE ou CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # Nome de usuário do usuário autenticado fazendo a requisição ao servidor de API
      "username": "admin",

      # UID do usuário autenticado fazendo a requisição ao servidor de API
      "uid": "014fbff9a07c",

      # Associações a grupos do usuário autenticado fazendo a requisição ao servidor de API
      "groups": [
        "system:authenticated",
        "my-admin-group"
      ],

      # Informações extras arbitrárias associadas ao usuário fazendo a requisição ao servidor de API
      # Isso é preenchido pela camada de autenticação do servidor de API
      "extra": {
        "some-key": [
          "some-value1",
          "some-value2"
        ]
      }
    },

    # object é o novo objeto sendo admitido. É nulo para operações DELETE
    "object": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # oldObject é o objeto existente. É nulo para operações CREATE e CONNECT
    "oldObject": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # options contém as opções para a operação sendo admitida, como meta.k8s.io/v1 CreateOptions,
    # UpdateOptions ou DeleteOptions. É nulo para operações CONNECT
    "options": {
      "apiVersion": "meta.k8s.io/v1",
      "kind": "UpdateOptions"
    },

    # dryRun indica que a requisição de API está sendo executada em modo de simulação e não será persistida
    # Webhooks com efeitos colaterais devem evitar executar esses efeitos colaterais quando dryRun for true
    "dryRun": false
  }
}
```

### Resposta {#response}

Webhooks respondem com um código de status HTTP 200, `Content-Type: application/json`,
e um corpo contendo um objeto `AdmissionReview` (na mesma versão em que foi enviado),
com a seção `response` preenchida, serializada em JSON.

No mínimo, a seção `response` deve conter os seguintes campos:

* `uid`, copiado do `request.uid` enviado ao webhook
* `allowed`, definido como `true` ou `false`

Exemplo de uma resposta mínima de um webhook para permitir uma requisição:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true
  }
}
```

Exemplo de uma resposta mínima de um webhook para rejeitar uma requisição:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false
  }
}
```

Ao rejeitar uma requisição, o webhook pode personalizar o código HTTP e a mensagem retornada ao usuário
usando o campo `status`. O objeto status especificado é retornado ao usuário.
Consulte a [documentação da API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta)
para detalhes sobre o tipo `status`.
Exemplo de uma resposta para rejeitar uma requisição, personalizando o código de status HTTP e a mensagem apresentada ao usuário:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false,
    "status": {
      "code": 403,
      "message": "You cannot do this because it is Tuesday and your name starts with A"
    }
  }
}
```

Ao permitir uma requisição, um webhook de admissão de mutação pode opcionalmente modificar o objeto recebido também.
Isso é feito usando os campos `patch` e `patchType` na resposta.
O único `patchType` atualmente suportado é `JSONPatch`.
Consulte a documentação de [JSON patch](https://jsonpatch.com/) para mais detalhes.
Para `patchType: JSONPatch`, o campo `patch` contém um array codificado em base64 de operações JSON patch.

Como exemplo, uma única operação de patch que definiria `spec.replicas` seria
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Codificado em base64, isso seria `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

Portanto, uma resposta de webhook para adicionar esse rótulo seria:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "patchType": "JSONPatch",
    "patch": "W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0="
  }
}
```

Webhooks de admissão podem opcionalmente retornar mensagens de aviso que são devolvidas ao cliente solicitante
em cabeçalhos HTTP `Warning` com um código de aviso 299. Avisos podem ser enviados com respostas de admissão permitidas ou rejeitadas.

Se você está implementando um webhook que retorna um aviso:

* Não inclua o prefixo "Warning:" na mensagem
* Use mensagens de aviso para descrever problemas que o cliente fazendo a requisição de API deve corrigir ou estar ciente
* Limite os avisos a 120 caracteres, se possível

{{< caution >}}
Mensagens de aviso individuais com mais de 256 caracteres podem ser truncadas pelo servidor de API antes de serem retornadas aos clientes.
Se mais de 4096 caracteres de mensagens de aviso forem adicionados (de todas as fontes), mensagens de aviso adicionais serão ignoradas.
{{< /caution >}}

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "warnings": [
      "duplicate envvar entries specified with name MY_ENV",
      "memory request less than 4MB specified for container mycontainer, which will not start successfully"
    ]
  }
}
```

## Configuração de webhook

Para registrar webhooks de admissão, crie objetos de API `MutatingWebhookConfiguration` ou `ValidatingWebhookConfiguration`.
O nome de um objeto `MutatingWebhookConfiguration` ou `ValidatingWebhookConfiguration` deve ser um
[nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

Cada configuração pode conter um ou mais webhooks.
Se múltiplos webhooks forem especificados em uma única configuração, cada um deve receber um nome único.
Isso é necessário para facilitar a correspondência dos logs de auditoria e métricas resultantes com as
configurações ativas.

Cada webhook define os seguintes itens.

### Correspondência de requisições: rules

Cada webhook deve especificar uma lista de regras usadas para determinar se uma requisição ao servidor de API deve ser enviada ao webhook.
Cada regra especifica uma ou mais operações, apiGroups, apiVersions e resources, além de um escopo de recurso:

* `operations` lista uma ou mais operações para corresponder. Pode ser `"CREATE"`, `"UPDATE"`, `"DELETE"`, `"CONNECT"`,
  ou `"*"` para corresponder a todas.
* `apiGroups` lista um ou mais grupos de API para corresponder. `""` é o grupo de API principal. `"*"` corresponde a todos os grupos de API.
* `apiVersions` lista uma ou mais versões de API para corresponder. `"*"` corresponde a todas as versões de API.
* `resources` lista um ou mais recursos para corresponder.

  * `"*"` corresponde a todos os recursos, mas não a recursos aninhados.
  * `"*/*"` corresponde a todos os recursos e recursos aninhados.
  * `"pods/*"` corresponde a todos os recursos aninhados de pods.
  * `"*/status"` corresponde a todos os recursos aninhados de status.

* `scope` especifica um escopo para corresponder. Valores válidos são `"Cluster"`, `"Namespaced"` e `"*"`.
  Recursos aninhados correspondem ao escopo de seu recurso pai. O padrão é `"*"`.

  * `"Cluster"` significa que apenas recursos com escopo de cluster corresponderão a esta regra (objetos de API Namespace têm escopo de cluster).
  * `"Namespaced"` significa que apenas recursos com escopo de namespace corresponderão a esta regra.
  * `"*"` significa que não há restrições de escopo.

Se uma requisição recebida corresponder a uma das `operations`, `groups`, `versions`,
`resources` e `scope` especificados para qualquer uma das `rules` de um webhook, a requisição é enviada ao webhook.

Aqui estão outros exemplos de regras que podem ser usadas para especificar quais recursos devem ser interceptados.

Corresponder requisições `CREATE` ou `UPDATE` para `deployments` e `replicasets` de `apps/v1` e `apps/v1beta1`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: ["apps"]
    apiVersions: ["v1", "v1beta1"]
    resources: ["deployments", "replicasets"]
    scope: "Namespaced"
  ...
```

Corresponder requisições de criação para todos os recursos (mas não recursos aninhados) em todos os grupos e versões de API:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "*"
```

Corresponder requisições de atualização para todos os recursos aninhados `status` em todos os grupos e versões de API:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["UPDATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*/status"]
        scope: "*"
```

### Correspondência de requisições: objectSelector

Webhooks podem opcionalmente limitar quais requisições são interceptadas com base nos rótulos dos
objetos que seriam enviados, especificando um `objectSelector`. Se especificado, o objectSelector
é avaliado tanto para o object quanto para o oldObject que seriam enviados ao webhook,
e é considerado correspondente se qualquer um dos objetos corresponder ao seletor.

Um objeto nulo (`oldObject` no caso de criação, ou `newObject` no caso de exclusão),
ou um objeto que não pode ter rótulos (como um objeto `DeploymentRollback` ou `PodProxyOptions`)
não é considerado correspondente.

Use o seletor de objeto apenas se o webhook for opcional, pois os usuários finais podem ignorar
o webhook de admissão definindo os rótulos.

Este exemplo mostra um webhook de mutação que corresponderia a um `CREATE` de qualquer recurso (mas não recursos aninhados) com o rótulo `foo: bar`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  objectSelector:
    matchLabels:
      foo: bar
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
```

Consulte o [conceito de rótulos](/docs/concepts/overview/working-with-objects/labels)
para mais exemplos de seletores de rótulos.

### Correspondência de requisições: namespaceSelector

Webhooks podem opcionalmente limitar quais requisições para recursos com escopo de namespace são interceptadas,
com base nos rótulos do namespace que os contém, especificando um `namespaceSelector`.

O `namespaceSelector` decide se o webhook deve ser executado em uma requisição para um recurso com escopo de namespace
(ou um objeto Namespace), com base em se os rótulos do namespace correspondem ao seletor.
Se o próprio objeto for um namespace, a correspondência é realizada em object.metadata.labels.
Se o objeto for um recurso com escopo de cluster diferente de um Namespace, o `namespaceSelector` não tem efeito.

Este exemplo mostra um webhook de mutação que corresponde a um `CREATE` de qualquer recurso com escopo de namespace dentro de um namespace
que não possui um rótulo "runlevel" com valor "0" ou "1":

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: runlevel
          operator: NotIn
          values: ["0","1"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

Este exemplo mostra um webhook de validação que corresponde a um `CREATE` de qualquer recurso com escopo de namespace dentro
de um namespace que está associado ao "environment" de "prod" ou "staging":

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: environment
          operator: In
          values: ["prod","staging"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

Consulte o [conceito de rótulos](/docs/concepts/overview/working-with-objects/labels)
para mais exemplos de seletores de rótulos.

### Correspondência de requisições: matchPolicy {#matching-requests-matchpolicy}

Servidores de API podem disponibilizar objetos por meio de múltiplos grupos ou versões de API.

Por exemplo, se um webhook especificou apenas uma regra para alguns grupos/versões de API
(como `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
e uma requisição foi feita para modificar o recurso por meio de outro grupo/versão de API (como `extensions/v1beta1`),
a requisição não seria enviada ao webhook.

O `matchPolicy` permite que um webhook defina como suas `rules` são usadas para corresponder requisições recebidas.
Os valores permitidos são `Exact` ou `Equivalent`.

* `Exact` significa que uma requisição deve ser interceptada apenas se corresponder exatamente a uma regra especificada.
* `Equivalent` significa que uma requisição deve ser interceptada se modificar um recurso listado em `rules`,
  mesmo por meio de outro grupo ou versão de API.

No exemplo dado acima, o webhook que se registrou apenas para `apps/v1` poderia usar `matchPolicy`:

* `matchPolicy: Exact` significaria que a requisição `extensions/v1beta1` não seria enviada ao webhook
* `matchPolicy: Equivalent` significa que a requisição `extensions/v1beta1` seria enviada ao webhook
  (com os objetos convertidos para uma versão que o webhook especificou: `apps/v1`)

Especificar `Equivalent` é recomendado e garante que os webhooks continuem a interceptar os
recursos que esperam quando atualizações habilitam novas versões do recurso no servidor de API.

Quando um recurso deixa de ser servido pelo servidor de API, ele não é mais considerado equivalente a
outras versões desse recurso que ainda são servidas.
Por exemplo, Deployments `extensions/v1beta1` foram primeiro descontinuados e depois removidos (no Kubernetes v1.16).

Desde essa remoção, um webhook com a regra `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]`
não intercepta Deployments criados por meio das APIs `apps/v1`. Por esse motivo, webhooks devem preferencialmente se registrar
para versões estáveis dos recursos.

Este exemplo mostra um webhook de validação que intercepta modificações em Deployments (independentemente do grupo ou versão de API),
e sempre recebe um objeto `Deployment` `apps/v1`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
```

O `matchPolicy` para webhooks de admissão tem como padrão `Equivalent`.

### Correspondência de requisições: `matchConditions`

{{< feature-state feature_gate_name="AdmissionWebhookMatchConditions" >}}

Você pode definir _condições de correspondência_ para webhooks se precisar de filtragem refinada de requisições. Essas
condições são úteis se você constatar que regras de correspondência, `objectSelectors` e `namespaceSelectors` ainda
não fornecem a filtragem desejada para quando realizar chamadas via HTTP. Condições de correspondência são
[expressões CEL](/docs/reference/using-api/cel/). Todas as condições de correspondência devem ser avaliadas como verdadeiras para que o
webhook seja chamado.

Aqui está um exemplo ilustrando alguns usos diferentes para condições de correspondência:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['*']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Ignore' # Fail-open (opcional)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitido>'
    # Você pode ter até 64 matchConditions por webhook
    matchConditions:
      - name: 'exclude-leases' # Cada condição de correspondência deve ter um nome único
        expression: '!(request.resource.group == "coordination.k8s.io" && request.resource.resource == "leases")' # Corresponder recursos que não são leases.
      - name: 'exclude-kubelet-requests'
        expression: '!("system:nodes" in request.userInfo.groups)' # Corresponder requisições feitas por usuários que não são nós.
      - name: 'rbac' # Ignorar requisições RBAC, que são tratadas pelo segundo webhook.
        expression: 'request.resource.group != "rbac.authorization.k8s.io"'
  
  # Este exemplo ilustra o uso do 'authorizer'. A verificação de autorização é mais custosa
  # do que uma expressão simples, então neste exemplo ela é limitada apenas a requisições RBAC usando um segundo
  # webhook. Ambos os webhooks podem ser servidos pelo mesmo endpoint.
  - name: rbac.my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['rbac.authorization.k8s.io']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Fail' # Fail-closed (o padrão)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitido>'
    # Você pode ter até 64 matchConditions por webhook
    matchConditions:
      - name: 'breakglass'
        # Ignorar requisições feitas por usuários autorizados a executar 'breakglass' neste webhook.
        # O verbo de API 'breakglass' não precisa existir fora desta verificação.
        expression: '!authorizer.group("admissionregistration.k8s.io").resource("validatingwebhookconfigurations").name("my-webhook.example.com").check("breakglass").allowed()'
```

{{< note >}}
Você pode definir até 64 elementos no campo `matchConditions` por webhook.
{{< /note >}}

Condições de correspondência têm acesso às seguintes variáveis CEL:

- `object` - O objeto da requisição recebida. O valor é nulo para requisições DELETE. A versão
  do objeto pode ser convertida com base no [matchPolicy](#matching-requests-matchpolicy).
- `oldObject` - O objeto existente. O valor é nulo para requisições CREATE.
- `request` - A parte da requisição do [AdmissionReview](#request), excluindo `object` e `oldObject`.
- `authorizer` - Um Autorizador CEL. Pode ser usado para realizar verificações de autorização para o perfil
  (usuário autenticado) da requisição. Consulte
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) na documentação da biblioteca CEL
  do Kubernetes para mais detalhes.
- `authorizer.requestResource` - Um atalho para uma verificação de autorização configurada com o recurso
  da requisição (group, resource, (subresource), namespace, name).

Para mais informações sobre expressões CEL, consulte a
[referência de Common Expression Language no Kubernetes](/docs/reference/using-api/cel/).

No caso de um erro ao avaliar uma condição de correspondência, o webhook nunca é chamado. A decisão de rejeitar
a requisição é determinada da seguinte forma:

1. Se **qualquer** condição de correspondência for avaliada como `false` (independentemente de outros erros), o servidor de API ignora o webhook.
2. Caso contrário:
    - para [`failurePolicy: Fail`](#failure-policy), rejeitar a requisição (sem chamar o webhook).
    - para [`failurePolicy: Ignore`](#failure-policy), prosseguir com a requisição, mas ignorar o webhook.

### Contactando o webhook

Uma vez que o servidor de API tenha determinado que uma requisição deve ser enviada a um webhook,
ele precisa saber como contactar o webhook. Isso é especificado na seção `clientConfig`
da configuração do webhook.

Webhooks podem ser chamados por meio de uma URL ou de uma referência de serviço,
e podem opcionalmente incluir um pacote de CA personalizado para verificar a conexão TLS.

#### URL

`url` fornece a localização do webhook, no formato de URL padrão
(`scheme://host:port/path`).

O `host` não deve se referir a um serviço em execução no cluster; use
uma referência de serviço especificando o campo `service` em vez disso.
O host pode ser resolvido por meio de DNS externo em alguns servidores de API
(por exemplo, `kube-apiserver` não pode resolver DNS dentro do cluster, pois isso seria
uma violação de camadas). `host` também pode ser um endereço IP.

Observe que usar `localhost` ou `127.0.0.1` como `host` é
arriscado, a menos que você tenha grande cuidado para executar este webhook em todos os hosts
que executam um servidor de API que possa precisar fazer chamadas para este
webhook. Tais instalações provavelmente não são portáveis ou não são facilmente
executadas em um novo cluster.

O esquema deve ser "https"; a URL deve começar com "https://".

A tentativa de usar autenticação de usuário ou básica (por exemplo `user:password@`) não é permitida.
Fragmentos (`#...`) e parâmetros de consulta (`?...`) também não são permitidos.

Aqui está um exemplo de um webhook de mutação configurado para chamar uma URL
(e espera que o certificado TLS seja verificado usando as raízes de confiança do sistema, portanto não especifica um caBundle):

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
```

#### Referência de serviço

A seção `service` dentro de `clientConfig` é uma referência ao serviço para este webhook.
Se o webhook estiver em execução dentro do cluster, então você deve usar `service` em vez de `url`.
O namespace e o nome do serviço são obrigatórios. A porta é opcional e tem como padrão 443.
O caminho é opcional e tem como padrão "/".

Aqui está um exemplo de um webhook de mutação configurado para chamar um serviço na porta "1234"
no subcaminho "/my-path", e para verificar a conexão TLS com o ServerName
`my-service-name.my-service-namespace.svc` usando um pacote de CA personalizado:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: <CA_BUNDLE>
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
```

{{< note >}}
Você deve substituir o `<CA_BUNDLE>` no exemplo acima por um pacote de CA válido,
que é um pacote de CA codificado em PEM para validar o certificado do servidor do webhook.
{{< /note >}}

### Efeitos colaterais

Webhooks normalmente operam apenas no conteúdo do `AdmissionReview` enviado a eles.
Alguns webhooks, no entanto, fazem alterações de fluxo de dados independente como parte do processamento de requisições de admissão.

Webhooks que fazem alterações de fluxo de dados independente ("efeitos colaterais") também devem ter um mecanismo de reconciliação
(como um controlador) que periodicamente determina o estado real do mundo e ajusta
os dados de fluxo independente modificados pelo webhook de admissão para refletir a realidade.
Isso ocorre porque uma chamada a um webhook de admissão não garante que o objeto admitido será persistido como está, ou sequer que será persistido.
Webhooks posteriores podem modificar o conteúdo do objeto, um conflito pode ser encontrado ao gravar no armazenamento,
ou o servidor pode ser desligado antes de persistir o objeto.

Além disso, webhooks com efeitos colaterais devem ignorar esses efeitos colaterais quando requisições de admissão com `dryRun: true` são tratadas.
Um webhook deve indicar explicitamente que não terá efeitos colaterais quando executado com `dryRun`,
ou a requisição de simulação não será enviada ao webhook e a requisição de API falhará.

Webhooks indicam se possuem efeitos colaterais usando o campo `sideEffects` na configuração do webhook:

* `None`: chamar o webhook não terá efeitos colaterais.
* `NoneOnDryRun`: chamar o webhook possivelmente terá efeitos colaterais, mas se uma requisição com
  `dryRun: true` for enviada ao webhook, o webhook suprimirá os efeitos colaterais (o webhook
  é compatível com `dryRun`).

Aqui está um exemplo de um webhook de validação indicando que não possui efeitos colaterais em requisições `dryRun: true`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    sideEffects: NoneOnDryRun
```

### Tempos limite

Como webhooks adicionam latência às requisições de API, eles devem ser avaliados o mais rápido possível.
`timeoutSeconds` permite configurar quanto tempo o servidor de API deve aguardar a resposta de um webhook
antes de tratar a chamada como uma falha.

Se o tempo limite expirar antes de o webhook responder, a chamada do webhook será ignorada ou
a chamada de API será rejeitada com base na [política de falha](#failure-policy).

O valor do tempo limite deve estar entre 1 e 30 segundos.

Aqui está um exemplo de um webhook de validação com um tempo limite personalizado de 2 segundos:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    timeoutSeconds: 2
```

O tempo limite para um webhook de admissão tem como padrão 10 segundos.

### Política de repetição de invocação {#reinvocation-policy}

Uma única ordenação de plugins de admissão de mutação (incluindo webhooks) não funciona para todos os casos
(veja https://issue.k8s.io/64333 como exemplo). Um webhook de mutação pode adicionar uma nova subestrutura
ao objeto (como adicionar um `container` a um `pod`), e outros plugins de mutação que já foram
executados podem ter opiniões sobre essas novas estruturas (como definir uma `imagePullPolicy` em todos os contêineres).

Para permitir que plugins de admissão de mutação observem alterações feitas por outros plugins,
os plugins de admissão de mutação embutidos são novamente executados se um webhook de mutação modificar um objeto,
e webhooks de mutação podem especificar uma `reinvocationPolicy` para controlar se também serão executados novamente.

`reinvocationPolicy` pode ser definido como `Never` ou `IfNeeded`. O padrão é `Never`.

* `Never`: o webhook não deve ser chamado mais de uma vez em uma única avaliação de admissão.
* `IfNeeded`: o webhook pode ser chamado novamente como parte da avaliação de admissão se o objeto
  sendo admitido for modificado por outros plugins de admissão após a chamada inicial do webhook.

Os elementos importantes a observar são:

* O número de execuções adicionais não é garantido ser exatamente um.
* Se execuções adicionais resultarem em mais modificações no objeto, os webhooks não têm
  garantia de serem executados novamente.
* Webhooks que usam esta opção podem ser reordenados para minimizar o número de execuções adicionais.
* Para validar um objeto após todas as mutações estarem garantidamente completas, use um webhook
  de admissão de validação (recomendado para webhooks com efeitos colaterais).

Aqui está um exemplo de um webhook de mutação optando por ser invocado novamente se plugins de admissão posteriores
modificarem o objeto:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
```

Webhooks de mutação devem ser [idempotentes](#idempotence), capazes de processar com sucesso um objeto que já admitiram
e potencialmente modificaram. Isso é verdadeiro para todos os webhooks de admissão de mutação, uma vez que qualquer alteração que possam fazer
em um objeto pode já existir no objeto fornecido pelo usuário, mas é essencial para webhooks que optam pela repetição de execução.

### Política de falha {#failure-policy}

`failurePolicy` define como erros não reconhecidos e erros de tempo limite do webhook de admissão
são tratados. Os valores permitidos são `Ignore` ou `Fail`.

* `Ignore` significa que um erro ao chamar o webhook é ignorado e a requisição de API é permitida a continuar.
* `Fail` significa que um erro ao chamar o webhook causa a falha da admissão e a rejeição da requisição de API.

Aqui está um webhook de mutação configurado para rejeitar uma requisição de API se erros forem encontrados ao chamar o webhook de admissão:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
```

O `failurePolicy` padrão para webhooks de admissão é `Fail`.

## Monitoramento de webhooks de admissão

O servidor de API fornece maneiras de monitorar os comportamentos dos webhooks de admissão. Esses
mecanismos de monitoramento ajudam os administradores do cluster a responder perguntas como:

1. Qual webhook de mutação alterou o objeto em uma requisição de API?

2. Que alteração o webhook de mutação aplicou ao objeto?

3. Quais webhooks estão frequentemente rejeitando requisições de API? Qual é o motivo da rejeição?

### Anotações de auditoria de webhook de mutação

Às vezes é útil saber qual webhook de mutação alterou o objeto em uma requisição de API, e que alteração o
webhook aplicou.

O servidor de API do Kubernetes realiza [auditoria](/docs/tasks/debug/debug-cluster/audit/) em cada
invocação de webhook de mutação. Cada invocação gera uma anotação de auditoria
registrando se um objeto de requisição foi mutado pela invocação, e opcionalmente gera uma anotação
registrando o patch aplicado da resposta de admissão do webhook. As anotações são definidas no
evento de auditoria para uma determinada requisição em um determinado estágio de sua execução, que é então pré-processado
de acordo com uma determinada política e gravado em um backend.

O nível de auditoria de um evento determina quais anotações são registradas:

- No nível de auditoria `Metadata` ou superior, uma anotação com a chave
  `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` é registrada com um
  payload JSON indicando que um webhook foi invocado para uma determinada requisição e se ele alterou o objeto ou não.

  Por exemplo, a seguinte anotação é registrada para um webhook sendo invocado novamente. O webhook é
  o terceiro na cadeia de webhooks de mutação, e não alterou o objeto da requisição durante a
  invocação.

  ```yaml
  # o evento de auditoria registrado
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_1_index_2": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook.example.com\",\"mutated\": false}"
          # outras anotações
          ...
      }
      # outros campos
      ...
  }
  ```
  
  ```yaml
  # o valor da anotação desserializado
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook.example.com",
      "mutated": false
  }
  ```
  
  A seguinte anotação é registrada para um webhook sendo invocado na primeira rodada. O webhook
  é o primeiro na cadeia de webhooks de mutação, e alterou o objeto da requisição durante a
  invocação.

  ```yaml
  # the audit event recorded
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_0_index_0": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"mutated\": true}"
          # outras anotações
          ...
      }
      # outros campos
      ...
  }
  ```
  
  ```yaml
  # o valor da anotação desserializado
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "mutated": true
  }
  ```

- No nível de auditoria `Request` ou superior, uma anotação com a chave
  `patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` é registrada com um payload JSON indicando
  que um webhook foi invocado para uma determinada requisição e qual patch foi aplicado ao objeto da requisição.

  Por exemplo, a seguinte anotação é registrada para um webhook sendo reinvocado. O webhook é o quarto na
  cadeia de webhooks de mutação, e respondeu com um JSON patch que foi aplicado ao objeto da requisição.
  
  ```yaml
  # o evento de auditoria registrado
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "patch.webhook.admission.k8s.io/round_1_index_3": "{\"configuration\":\"my-other-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"patch\":[{\"op\":\"add\",\"path\":\"/data/mutation-stage\",\"value\":\"yes\"}],\"patchType\":\"JSONPatch\"}"
          # outras anotações
          ...
      }
      # outros campos
      ...
  }
  ```
  
  ```yaml
  # o valor da anotação desserializado
  {
      "configuration": "my-other-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "patchType": "JSONPatch",
      "patch": [
          {
              "op": "add",
              "path": "/data/mutation-stage",
              "value": "yes"
          }
      ]
  }
  ```

### Métricas de webhook de admissão

O servidor de API expõe métricas Prometheus a partir do endpoint `/metrics`, que podem ser usadas para monitoramento e
diagnóstico do status do servidor de API. As seguintes métricas registram o status relacionado aos webhooks de admissão.

#### Contagem de rejeições de webhook de admissão do servidor de API

Às vezes é útil saber quais webhooks de admissão estão frequentemente rejeitando requisições de API, e o
motivo da rejeição.

O servidor de API expõe uma métrica de contador Prometheus registrando rejeições de webhooks de admissão. As
métricas são rotuladas para identificar as causas das rejeições do webhook:

- `name`: o nome do webhook que rejeitou uma requisição.
- `operation`: o tipo de operação da requisição, pode ser um dos seguintes: `CREATE`,
  `UPDATE`, `DELETE` e `CONNECT`.
- `type`: o tipo de webhook de admissão, pode ser `admit` ou `validating`.
- `error_type`: identifica se um erro ocorreu durante a invocação do webhook
  que causou a rejeição. Seu valor pode ser um dos seguintes:

  - `calling_webhook_error`: erros não reconhecidos ou erros de tempo limite do webhook de admissão ocorreram e a
    [política de falha](#failure-policy) do webhook está definida como `Fail`.
  - `no_error`: nenhum erro ocorreu. O webhook rejeitou a requisição com `allowed: false` na resposta
    de admissão. O rótulo de métrica `rejection_code` registra o `.status.code` definido na resposta de admissão.
  - `apiserver_internal_error`: um erro interno do servidor de API ocorreu.

- `rejection_code`: o código de status HTTP definido na resposta de admissão quando um
  webhook rejeitou uma requisição.

Exemplo das métricas de contagem de rejeições:

```
# HELP apiserver_admission_webhook_rejection_count [ALPHA] Admission webhook rejection count, identified by name and broken out for each admission type (validating or admit) and operation. Additional labels specify an error type (calling_webhook_error or apiserver_internal_error if an error occurred; no_error otherwise) and optionally a non-zero rejection code if the webhook rejects the request with an HTTP status code (honored by the apiserver when the code is greater or equal to 400). Codes greater than 600 are truncated to 600, to keep the metrics cardinality bounded.
# TYPE apiserver_admission_webhook_rejection_count counter
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="always-timeout-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="invalid-admission-response-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="no_error",name="deny-unwanted-configmap-data.example.com",operation="CREATE",rejection_code="400",type="validating"} 13
```

## Melhores práticas e avisos

Para recomendações e considerações ao escrever webhooks de admissão de mutação,
consulte
[Boas Práticas para Webhooks de Admissão](/docs/concepts/cluster-administration/admission-webhooks-good-practices).
