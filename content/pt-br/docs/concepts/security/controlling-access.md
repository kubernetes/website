---
title: Controlling Access to the Kubernetes API
content_type: concept
---

<!-- overview -->
Esta página fornece uma visão geral do controle de acesso à API do Kubernetes.


<!-- body -->
Os usuários acessam a [API Kubernetes](/docs/concepts/overview/kubernetes-api/) usando `kubectl`, bibliotecas de cliente ou fazendo solicitações REST. Tanto usuários humanos quanto [Contas de serviço do Kubernetes](/docs/tasks/configure-pod-container/configure-service-account/) podem ser autorizados para acesso à API. Quando uma solicitação chega à API, ela passa por várias etapas, ilustradas no
seguinte diagrama:

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## Transport security

Em um cluster típico do Kubernetes, a API atende na porta 443, protegida por TLS. O servidor de API apresenta um certificado. Este certificado pode ser assinado usando uma autoridade de certificação privada (CA), ou com base em uma infraestrutura de chave pública vinculada para uma CA geralmente reconhecida.

Se seu cluster usa uma autoridade de certificação privada, você precisa de uma cópia desse certificado  CA configurado em seu `~/.kube/config`, para que você possa confiar na conexão e tenha certeza de que ela não foi interceptada.

Seu cliente pode apresentar um certificado de cliente TLS nesta fase.

## Authentication

Depois que o TLS é estabelecido, a solicitação HTTP passa para a etapa de autenticação. Isso é mostrado como etapa **1** no diagrama. O script de criação do cluster ou o administrador do cluster configura o servidor de API para ser executado um ou mais módulos autenticadores. Os autenticadores são descritos com mais detalhes em [Autenticação](/docs/reference/access-authn-authz/authentication/).

A entrada para a etapa de autenticação é toda a solicitação HTTP; no entanto, normalmente examina os cabeçalhos e/ou o certificado do cliente.

Os módulos de autenticação incluem certificados de cliente, senha e tokens simples, tokens de bootstrap e tokens da Web JSON (usados para contas de serviço).

Vários módulos de autenticação podem ser especificados, cada um é tentado em sequência, até que um deles tenha sucesso.

Se a solicitação não puder ser autenticada, ela será rejeitada com o código de status HTTP 401. Caso contrário, o usuário é autenticado como um `username` específico e o nome do usuário está disponível para as etapas subsequentes para usar em suas decisões. Alguns autenticadores também fornecem as associações de grupo do usuário, enquanto outros autenticadores
não.

Enquanto o Kubernetes usa nomes de usuário para decisões de controle de acesso e no registro de solicitações, ele não possui um objeto `User` nem armazena nomes de usuários ou outras informações sobre
usuários em sua API.

## Authorization

Depois que a solicitação é autenticada como proveniente de um usuário específico, a solicitação deve ser autorizada. Isso é mostrado como etapa **2** no diagrama.

Uma solicitação deve incluir o nome de usuário do solicitante, a ação solicitada e o objeto afetado pela ação. A solicitação é autorizada se uma política existente declarar que o usuário tem permissões para concluir a ação solicitada.

Por exemplo, se Bob tiver a política abaixo, ele poderá ler pods apenas no _namespace_ `projectCaribou`:

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
Se Bob fizer a seguinte solicitação, será autorizada porque ele tem permissão para ler objetos no _namespace_ do `projectCaribou`:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
Se Bob fizer uma solicitação para escrever (`create` ou `update`) nos objetos no _namespace_ `projectCaribou`, sua autorização será negada. Se Bob fizer uma solicitação para ler (`get`) objetos em um _namespace_ diferente, como `projectFish`, sua autorização será negada.

A autorização do Kubernetes requer que você use atributos REST comuns para interagir com sistemas de controle de acesso existentes em toda a organização ou em todo o provedor de nuvem. É importante usar a formatação REST porque esses sistemas de controle podem interagir com outras APIs além da API do Kubernetes.

O Kubernetes oferece suporte a vários módulos de autorização, como o modo ABAC, o modo RBAC e o modo Webhook. Quando um administrador cria um cluster, ele configura os módulos de autorização que devem ser usados ​​no servidor de API. Se mais de um módulo de autorização estiver configurado, o Kubernetes verificará cada módulo e, se algum módulo autorizar a solicitação, a solicitação poderá prosseguir. Se todos os módulos negarem a solicitação, a solicitação será negada (código de status HTTP 403).

Para saber mais sobre a autorização do Kubernetes, incluindo detalhes sobre como criar políticas usando os módulos de autorização compatíveis, consulte [Autorização](/docs/reference/access-authn-authz/authorization/).


## Admission control

Os módulos de controle de admissão são módulos de software que podem modificar ou rejeitar solicitações.
Além dos atributos disponíveis para os módulos de Autorização, os módulos de controle de admissão podem acessar o conteúdo do objeto que está sendo criado ou modificado.

Os controladores de admissão atuam em solicitações que criam, modificam, excluem ou se conectam a (proxy) um objeto. Os controladores de admissão não agem em solicitações que apenas lêem objetos. Quando vários controladores de admissão são configurados, eles são chamados em ordem.

Isso é mostrado como etapa **3** no diagrama.

Ao contrário dos módulos de autenticação e autorização, se algum módulo controlador de admissão
rejeita, a solicitação é imediatamente rejeitada.

Além de rejeitar objetos, os controladores de admissão também podem definir padrões complexos para
Campos.

Os módulos de Controle de Admissão disponíveis estão descritos em [Controladores de Admissão](/docs/reference/access-authn-authz/admission-controllers/).

Depois que uma solicitação passa por todos os controladores de admissão, ela é validada usando as rotinas de validação para o objeto de API correspondente e, em seguida, gravados no armazenamento de objetos (mostrado como etapa **4**).


## API server ports and IPs

A discussão anterior se aplica a solicitações enviadas para a porta segura do servidor de API
(o caso típico). O servidor de API pode servir em 2 portas:

Por padrão, o servidor da API Kubernetes atende HTTP em 2 portas:

  1. Porta `localhost`:

      - destina-se a testes e bootstrap, e para outros componentes do nó mestre (scheduler, controller-manager) para falar com a API
      - sem TLS
      - o padrão é a porta 8080
      - o IP padrão é localhost, altere com a flag `--insecure-bind-address`
      - solicitar módulos de autenticação e autorização **bypasses**
      - solicitação tratada pelo(s) módulo(s) de controle de admissão.
      - protegido pela necessidade de ter acesso ao host

  2. “Secure port”:

      - use sempre que possível
      - usa TLS.  Defina cert com `--tls-cert-file` e key com a flag `--tls-private-key-file`.
      - o padrão é a porta 6443, modifique com a flag `--secure-port`
      - IP padrão é a primeira interface de rede não local, mude com a flag `--bind-address`.
      - solicitação tratada por módulos de autenticação e autorização.
      - solicitação tratada pelo(s) módulo(s) de controle de admissão.
      - módulos de autenticação e autorização são executados

## {{% heading "whatsnext" %}}

Read more documentation on authentication, authorization and API access control:

- [Authenticating](/docs/reference/access-authn-authz/authentication/)
   - [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
   - [Role Based Access Control](/docs/reference/access-authn-authz/rbac/)
   - [Attribute Based Access Control](/docs/reference/access-authn-authz/abac/)
   - [Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Authorization](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - including [CSR approval](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     and [certificate signing](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Service accounts
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)

You can learn about:
- how Pods can use
  [Secrets](/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  to obtain API credentials.
