---
title: Acessando a API do Kubernetes a partir de um Pod
content_type: task
weight: 120
---

<!-- overview -->

Este guia demonstra como acessar a API do Kubernetes de dentro de um Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Acessando a API de dentro de um Pod

Ao acessar a API a partir de um Pod, localizar e autenticar-se no servidor de API são processos
ligeiramente diferentes do caso de um cliente externo.

A maneira mais fácil de usar a API do Kubernetes a partir de um Pod é utilizar uma
das [bibliotecas clientes](/docs/reference/using-api/client-libraries/) oficiais.
Essas bibliotecas conseguem descobrir automaticamente o servidor de API e autenticar-se.

### Usando Bibliotecas Clientes Oficiais

De dentro de um Pod, as formas recomendadas de se conectar à API do Kubernetes são:

- Para clientes em Go, utilize a
  [biblioteca cliente oficial em Go](https://github.com/kubernetes/client-go/).
  A função `rest.InClusterConfig()` lida automaticamente com a descoberta do host da API e a autenticação.
  Veja [um exemplo aqui](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Para clientes em Python, utilize a
  [biblioteca cliente oficial em Python](https://github.com/kubernetes-client/python/).
  A função `config.load_incluster_config()` lida automaticamente com a descoberta do host da API e a autenticação.
  Veja [um exemplo aqui](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Há diversas outras bibliotecas disponíveis. Consulte a página de
  [Bibliotecas Clientes](/docs/reference/using-api/client-libraries/).

Em todos os casos, as credenciais da conta de serviço do Pod são utilizadas
para se comunicar com segurança com o servidor de API.

### Acessando diretamente a API REST

Enquanto estiver em execução em um Pod, seu contêiner pode criar uma URL HTTPS para o servidor de API do Kubernetes
obtendo as variáveis de ambiente `KUBERNETES_SERVICE_HOST` e `KUBERNETES_SERVICE_PORT_HTTPS`.
O endereço do servidor de API dentro do cluster também é publicado em um Service chamado `kubernetes` no namespace
`default`, para que os Pods possam referenciar `kubernetes.default.svc` como um nome DNS para o servidor de API local.

{{< note >}}
O Kubernetes não garante que o servidor de API tenha um certificado válido para o nome de host `kubernetes.default.svc`;
no entanto, espera-se que a camada de gerenciamento **apresente** um certificado válido para o nome de host ou endereço
IP representado por `$KUBERNETES_SERVICE_HOST`.
{{< /note >}}

A forma recomendada de autenticar-se no servidor de API é com uma credencial
de [conta de serviço](/docs/tasks/configure-pod-container/configure-service-account/).
Por padrão, um Pod é associado a uma conta de serviço, e uma credencial (token) para essa conta de serviço é colocada no
sistema de arquivos de cada contêiner nesse Pod, em `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Se disponível, um pacote de certificados é colocado no sistema de arquivos de cada contêiner em `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`,
e deve ser utilizado para verificar o certificado de serviço do servidor de API.

Por fim, o namespace padrão a ser usado para operações da API com escopo de namespace é colocado em um arquivo em
`/var/run/secrets/kubernetes.io/serviceaccount/namespace` em cada contêiner.

### Usando o kubectl proxy

Se você quiser consultar a API sem utilizar uma biblioteca cliente oficial, pode executar o `kubectl proxy`
como o [comando](/docs/tasks/inject-data-application/define-command-argument-container/) de um novo contêiner sidecar no Pod.
Dessa forma, o `kubectl proxy` irá se autenticar na API e expô-la na interface `localhost` do Pod,
permitindo que outros contêineres no Pod a utilizem diretamente.

### Sem usar um proxy

É possível evitar o uso do kubectl proxy passando o token de autenticação diretamente para o servidor de API.
O certificado interno garante a segurança da conexão.

```shell
# Aponte para o nome de host interno do servidor de API
APISERVER=https://kubernetes.default.svc

# Caminho para o token da Conta de Serviço
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Ler o namespace deste Pod
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Ler o token de portador da Conta de Serviço
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Referenciar a autoridade certificadora (CA) interna
CACERT=${SERVICEACCOUNT}/ca.crt

# Explorar a API com o TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

A saída será semelhante a esta:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
