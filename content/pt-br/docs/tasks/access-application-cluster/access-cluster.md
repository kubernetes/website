---
title: Acessando Clusters
weight: 20
content_type: concept
---

<!-- overview -->

Esse tópico discute mútiplas maneiras de interagir com clusters.

<!-- body -->

## Acessando pela primeira vez com kubectl

Ao acessar a API do Kubernetes pela primeira vez, sugerimos usar o
Kubernetes CLI, `kubectl`.

Para acessar um cluster, você precisa saber a localização do cluster e ter credenciais
para acessá-lo.  Normalmente, isso é configurado automaticamente quando você segue o [Guia de instalação](/pt-br/docs/setup/),
ou outra pessoa configurou o cluster e forneceu credenciais e um local.

Verifique o local e as credenciais que o kubectl conhece com este comando:

```shell
kubectl config view
```

Muitos dos [exemplos](/pt-br/docs/reference/kubectl/cheatsheet/) disponibilizam uma introdução usando o
`kubectl`, e a documentação completa encontra-se na
[referễncia do kubectl](/docs/reference/kubectl/).

## Acessando diretamente a API REST

Kubectl lida com localização e autenticação no apiserver.
Se você deseja acessar diretamente a API REST com um cliente http como
curl ou wget, ou um navegador, existem várias maneiras de localizar e autenticar:

  - Execute o kubectl no modo proxy.
    - Abordagem recomendada.
    - Uses stored apiserver location.
    - Verifica a identidade do apiserver usando o certificado autoassinado. Não é possível MITM.
    - Autentica para apiserver.
    - No futuro, pode fazer balanceamento de carga inteligente do lado do cliente e failover.
  - Forneça o local e as credenciais diretamente ao cliente http.
    - Abordagem alternativa.
    - Funciona com alguns tipos de código de cliente que são confundidos com o uso de um proxy.
    - Precisa importar um certificado raiz em seu navegador para proteger contra MITM.

### Usando o proxy kubectl

O comando a seguir executa o kubectl em um modo em que ele atua como um proxy reverso. Ele lida com
localizando o apiserver e autenticando.
Execute assim:

```shell
kubectl proxy --port=8080
```

Veja [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) para mais detalhes.

Então você pode explorar a API com curl, wget ou um navegador, substituindo localhost
com [::1] para IPv6, assim:

```shell
curl http://localhost:8080/api/
```

A saída é semelhante a esta:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```


### Sem proxy kubectl

Use `kubectl apply` e `kubectl describe secret...` para criar um token para a conta de serviço padrão com grep/cut:

Primeiro, crie o segredo, solicitando um token para a ServiceAccount padrão:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
```

Em seguida, aguarde o controlador de token preencher o segredo com um token:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

Capture e use o token gerado:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

A saída será semelhante a esta:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

Usando `jsonpath`:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

A saída será semelhante a esta:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

Os exemplos acima usam a flag `--insecure`. Isso o deixa sujeito a ataques MITM. 
Quando o kubectl acessa o cluster, ele usa um certificado raiz armazenado
e certificados de cliente para acessar o servidor. (Estes são instalados no
diretório `~/.kube`). Como os certificados de cluster geralmente são autoassinados,
pode necessitar uma configuração especial para fazer com que seu cliente http use o certificado root.

Em alguns clusters, o apiserver não requer autenticação; pode servir
em localhost, ou ser protegido por um firewall. Não existe um padrão
para isso. [Controlar o acesso à API](/docs/concepts/security/controlling-access)
descreve como um administrador de cluster pode configurar isso.

## Acesso programático à API

Kubernetes apoia oficialmente as bibliotecas de cliente do [Go](#cliente-go) e do [Python](#cliente-python).

### Cliente Go

* Para pegar a biblioteca, use o seguinte comando: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, veja [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user) para uma intrução detalhada de instalação. Veja [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) para ver quais versões são suportadas.
* Escreva um aplicativo sobre os clientes client-go. Observe que client-go define seus próprios objetos de API, portanto, se necessário, importe as definições de API do client-go em vez do repositório principal, e.g., `import "k8s.io/client-go/kubernetes"` está correto.

O cliente Go pode usar o mesmo [arquivo kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
que o kubectl CLI faz para localizar e autenticar para o apiserver. Veja esse [exemplo](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Se o aplicativo for implantado como um Pod no cluster, consulte a [próxima seção](#acessando-a-api-de-um-pod).

### Cliente Python

Para usar o [cliente Python](https://github.com/kubernetes-client/python), use o comando: `pip install kubernetes`. Veja página sobre [Biblioteca de Cliente Python](https://github.com/kubernetes-client/python) para mais opções de instalação.

O cliente Python pode usar o mesmo [arquivo kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
que o kubectl CLI faz para localizar e autenticar para o apiserver. Veja esse [exemplo](https://github.com/kubernetes-client/python/tree/master/examples).

### Outras linguagens

Existe [bibliotecas de cliente](/docs/reference/using-api/client-libraries/) para acessar a API de outras linguagens.
Consulte a documentação de outras bibliotecas para saber como elas autentificam.

## Acessando a API de um Pod

Ao acessar a API de um pod, localizar e autenticar
para o servidor de API é um pouco diferentes.

Por favor, verifique [Acessando a API de dentro de um Pod](/docs/tasks/run-application/access-api-from-pod/)
para mais detalhes.

## Acessando serviços em execução no cluster

A seção anterior descreve como se conectar ao servidor da API do Kubernetes.
Para obter informações sobre como se conectar a outros serviços executando em um cluster Kubernetes, consulte
[Acessando Serviços Cluster](/docs/tasks/access-application-cluster/access-cluster-services/).

## Solicitando redirecionamentos

Os recursos de redirecionamento foram descontinuados e removidos.  Por favor, use um proxy (veja abaixo) em vez disso.

## Tantos proxys

Existem vários proxies diferentes que você pode encontrar ao usar o Kubernetes:

1.  O [kubectl proxy](#acessando-diretamente-a-api-rest):

    - é executado no Desktop de um usuário ou em um pod
    - proxies de um endereço de host local para o apiserver Kubernetes
    - cliente para proxy usa HTTP
    - proxy para apiserver usa HTTPS
    - localiza apiserver
    - adiciona cabeçalhos de autenticação

1.  O [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - é um bastião embutido no apiserver
    - conecta um usuário fora do cluster a IPs de cluster que, de outra forma, podem não ser alcançáveis
    - é executado nos processos apiserver
    - cliente para proxy usa HTTPS (ou http se o apiserver estiver configurado)
    - proxy para destino pode usar HTTP ou HTTPS conforme escolhido pelo proxy usando as informações disponíveis
    - pode ser usado para alcançar um nó, pod ou serviço
    - faz balanceamento de carga quando usado para alcançar um serviço

1.  O [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - roda em cada nó
    - faz o proxy em UDP e TCP
    - não entende HTTP
    - fornece balanceamento de carga
    - é usado apenas para alcançar serviços

1.  Um proxy/balanceador de carga na frente de apiserver(s):

    - existência e implementação varia de cluster para cluster (por exemplo, nginx)
    - fica entre todos os clientes e um ou mais apiservers
    - atua como balanceador de carga se houver vários apiservers

1.  Cloud Load Balancers em serviços externos:

    - são fornecidos por alguns provedores de serviços de nuvem (por exemplo, AWS ELB, Google Cloud Load Balancer)
    - são criados automaticamente quando o serviço Kubernetes tem o tipo `LoadBalancer`
    - usa apenas UDP/TCP
    - a implementação varia de acordo com o provedor de serviços na nuvem.

Os usuários do Kubernetes normalmente não precisarão se preocupar com nada além dos dois primeiros tipos. O administrador do cluster normalmente garantirá que os últimos tipos sejam configurados corretamente.

