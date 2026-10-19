---
title: Controlando Acesso à API do Kubernetes
content_type: concept
---

<!-- overview -->
Esta página fornece uma visão geral do controle de acesso à API do Kubernetes.

<!-- body -->
Usuários podem acessar a [API do Kubernetes](/docs/concepts/overview/kubernetes-api/) utilizando `kubectl`,
bibliotecas, ou executando requisições REST.  Ambos, usuários humanos e
[Contas de serviço do Kubernetes](/docs/tasks/configure-pod-container/configure-service-account/) podem ser autorizados
a acessar à API.
Quando uma requisição chega à API, ela passa por diversos estágios,
ilustrados no seguinte diagrama:

![Diagrama de etapas de tratamento de requisições enviadas a API do Kubernetes](/images/docs/admin/access-control-overview.svg)

## Segurança na camada de transporte

Em um cluster Kubernetes típico, a API fica disponível na porta 443, protegida por segurança na camada de transporte (TLS).
O servidor de API apresenta um certificado. Este certificado pode ser assinado utilizando
uma autoridade privada de certificados (CA), ou baseado em uma infraestrutura de chave pública ligada
a uma autoridade de certificados reconhecida publicamente.

Se o seu cluster utiliza uma autoridade privada de certificados, voce precisa de uma cópia do certificado
da autoridade de certificados (CA) dentro do arquivo de configuração `~/.kube/config`, no lado do cliente, para que
voce possa confiar na conexão e tenha a garantia de que não há interceptação de tráfego.

O seu cliente pode apresentar o certificado de cliente TLS neste estágio.

## Autenticação

Uma vez em que a segurança na camada de transporte (TLS) é estabelecida, a requisição HTTP move para o passo de autenticação.
Isto é demonstrado no passo **1** no diagrama acima.
O script de criação do cluster ou configurações de administração configuram o servidor de API para executar
um ou mais módulos autenticadores.

Autenticadores são descritos em maiores detalhes em
[Autenticação](/pt-br/docs/reference/access-authn-authz/authentication/).

A entrada para o passo de autenticação é a requisição HTTP completa; no entanto, tipicamente
são verificados os cabeçalhos e/ou o certificado de cliente.

Módulos de autenticação incluem certificados de cliente, senhas, tokens simples,
tokens de auto-inicialização e JSON Web Tokens (utilizados para contas de serviço).

Vários módulos de autenticação podem ser especificados, em que cada um será verificado em sequência,
até que um deles tenha sucesso.

Se a requisição não pode ser autenticada, será rejeitada com o código de status HTTP 401 (não autorizado).
Caso contrário, o usuário é autenticado com um "nome de usuário" específico e o nome de usuário
está disponível para as etapas subsequentes para usar em suas decisões. Alguns autenticadores
também fornecem as associações de grupo do usuário, enquanto outros autenticadores
não o fazem.

Enquanto o Kubernetes usa nomes de usuário para decisões de controle de acesso e no registro de requisições,
ele não possui um objeto `user` nem armazena nomes de usuários ou outras informações sobre
usuários em sua API.

## Autorização

Após a requisição ser autenticada como originada de um usuário específico, a requisição deve ser autorizada. Isso é mostrado no passo **2** no diagrama.

Uma requisição deve incluir o nome do usuário requerente, a ação requisitada e o objeto afetado pela ação. A requisição é autorizada se uma
política existente declarar que o usuário tem as devidas permissões para concluir a ação requisitada.

Por exemplo, se Bob possui a política abaixo, então ele somente poderá ler pods no namespace `projectCaribou`:

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
Se Bob fizer a seguinte requisição, a requisição será autorizada porque ele tem permissão para ler objetos no namespace `projectCaribou`:
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
Se Bob fizer uma requisição para escrever (`create` ou `update`) em objetos no namespace `projectCaribou`, sua autorização será negada. Se Bob fizer uma requisição para ler (`get`) objetos em um namespace diferente, como `projectFish`, sua autorização será negada.

A autorização do Kubernetes requer que você use atributos comuns a REST para interagir com os sistemas de controle de acesso existentes em toda uma organização ou em todo o provedor de nuvem utilizado. É importante usar a formatação REST porque esses sistemas de controle podem interagir com outras APIs além da API do Kubernetes.

O Kubernetes oferece suporte a vários módulos de autorização, como o modo de controle de acesso baseado em atributos (ABAC), o modo de controle de acesso baseado em função (RBAC) e o modo Webhook. Quando um administrador cria um cluster, ele configura os módulos de autorização que devem ser utilizados no servidor de API. Se mais de um módulo de autorização for configurado, o Kubernetes verificará cada módulo e, se algum módulo autorizar a requisição, a requisição poderá prosseguir. Se todos os módulos negarem a requisição, a requisição será negada (com código de status HTTP 403 - Acesso Proibido).

Para saber mais sobre a autorização do Kubernetes, incluindo detalhes sobre como criar políticas usando os módulos de autorização compatíveis, consulte [Visão Geral de Autorização](/pt-br/docs/reference/access-authn-authz/authorization/).

## Controle de admissão

Os módulos de controle de admissão são módulos de software que podem modificar ou rejeitar requisições.
Além dos atributos disponíveis para os módulos de Autorização, os módulos do controlador de admissão
podem acessar o conteúdo do objeto que está sendo criado ou modificado.

Os controladores de admissão atuam em requisições que criam, modificam, excluem ou age como um proxy para outro objeto.
Os controladores de admissão não agem em requisições que apenas leem objetos.
Quando vários controladores de admissão são configurados, eles são chamados em ordem.

Isso é mostrado como etapa **3** no diagrama.

Ao contrário dos módulos de autenticação e autorização, se algum módulo controlador de admissão
rejeita, a solicitação é imediatamente rejeitada.

Além de rejeitar objetos, os controladores de admissão também podem definir valores padrão complexos para
campos.

Os módulos de Controle de Admissão disponíveis são descritos em [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).

Após uma requisição passar por todos os controladores de admissão, ela é validada usando as rotinas de validação
para o objeto de API correspondente e, em seguida, gravados no armazenamento de objetos (mostrado como etapa **4** no diagrama).

## Auditoria

A auditoria do Kubernetes fornece um conjunto de registros cronológicos relevantes para a segurança que documentam a sequência de ações em um cluster.
O cluster audita as atividades geradas pelos usuários, pelos aplicativos que usam a API do Kubernetes e pela própria camada de gerenciamento.

Para mais informações, consulte [Auditing](/docs/tasks/debug/debug-cluster/audit/).

## Portas e IPs do servidor de API

A discussão anterior se aplica a requisições enviadas para a porta segura do servidor de API
(o caso típico). O servidor de API pode realmente servir em 2 portas.

Por padrão, o servidor da API Kubernetes atende HTTP em 2 portas:

  1. Porta `localhost`:

       - destina-se a testes e auto-inicialização e a outros componentes do nó mestre
         (scheduler, controller-manager) para falar com a API
       - sem segurança na camada de transporte (TLS)
       - o padrão é a porta 8080
       - IP padrão é localhost, mude com a flag `--insecure-bind-address`.
       - a requisição **ignora** os módulos de autenticação e autorização .
       - requisição tratada pelo(s) módulo(s) de controle de admissão.
       - protegido pela necessidade de ter acesso ao host

  2. “Porta segura”:

       - utilize sempre que possível
       - utiliza segurança na camada de transporte (TLS). Defina o certificado com `--tls-cert-file` e a chave com a flag `--tls-private-key-file`.
       - o padrão é a porta 6443, mude com a flag `--secure-port`.
       - IP padrão é a primeira interface de rede não localhost, mude com a flag `--bind-address`.
       - requisição tratada pelos módulos de autenticação e autorização.
       - requisição tratada pelo(s) módulo(s) de controle de admissão.
       - módulos de autenticação e autorização executados.

## {{% heading "whatsnext" %}}

Consulte mais documentação sobre autenticação, autorização e controle de acesso à API:

- [Autenticação](/pt-br/docs/reference/access-authn-authz/authentication/)
   - [Autenticando com Tokens de Inicialização](/pt-br/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Autorização](/pt-br/docs/reference/access-authn-authz/authorization/)
   - [Using RBAC Authorization](/docs/reference/access-authn-authz/rbac/)
   - [Using ABAC Authorization](/docs/reference/access-authn-authz/abac/)
   - [Using Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Mode](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - incluindo [Approval or rejection of Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     e [Signing certificates](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Contas de serviço
  - [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)

Você pode aprender mais sobre:
- como os pods podem usar [Secrets](/docs/concepts/configuration/secret/) para obter credenciais de API.
