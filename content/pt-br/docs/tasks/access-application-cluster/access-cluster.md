---
title: Acessando clusters
weight: 20
content_type: concept
---

<!-- overview -->

Esse tópico fala sobre diversas maneiras de interagir com clusters..

<!-- body -->

## Acessando pela primeira vez com kubectl

Se tiver acessando o Kubernetes API pela primeira vez, recomendamos usar o Kubernetes CLI, `kubectl`.

Para acessar um cluster, precisa saber a localização do cluster e ter credenciais para acessá-lo. Geralmente, isso é configurado automaticamente quando você trabalha com um [Guia de introdução](/docs/setup/) [Guia de introdução] ou outra pessoa configurou o cluster e forneceu a você credenciais e uma localização. 

Verifique o local e as credenciais que o kubectl conhece com esse comando:

```shell
kubectl config view
```

Muitos dos [exemplos](/docs/reference/kubectl/quick-reference/) fornecem uma introdução ao uso do `kubectl`, e a documentação completa pode ser encontrada na [kubectl referência](/docs/reference/kubectl/).

## Acessando diretamente a API REST

O Kubectl lida com a localização e a autenticação no apiserver.
Se você quiser acessar diretamente a API REST com um cliente http como
curl ou wget, ou um navegador, há várias maneiras de localizar e autenticar:

- executar o kubectl no modo proxy.
  - método recomendado.
  - Usa o local guardado do apiserver.
  - Verifica a identidade do apiserver usando um certificado autoassinado. Não há possibilidade de MITM (Man-In-The-Middle) ataque.
  - Autentica-se no apiserver.
  - No futuro, poderá fazer client-side load-balancing inteligente, e transferência em caso de falha.
- Forneça o local e as credenciais diretamente para o cliente http.
  - método alternativo.
  - Funciona com alguns tipos de código de cliente que são confundidos pelo uso de um proxy.
  - Necessidade de importar um certificado raiz em seu navegador para se proteger contra ataque MITM (Man-In-The-Middle).

### Usando o kubectl proxy

O comando a seguir executa o kubectl em um modo em que ele atua como um proxy reverso. Ele lida com
localização do apiserver e da autenticação.
Execute-o desta forma:

```shell
kubectl proxy --port=8080
```

Consulte [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) para obter mais detalhes.

Em seguida, você pode explorar a API com curl, wget ou um navegador, substituindo localhost
por [::1] para IPv6, da seguinte forma:

```shell
curl http://localhost:8080/api/
```

O resultado é semelhante a este:

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

### Sem kubectl proxy

Use `kubectl apply` e `kubectl describe secret...` para criar um token para a conta de serviço padrão com grep/cut:

Primeiro, crie o Secret, solicitando um token para a ServiceAccount padrão:

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

Em seguida, aguarde até que o controlador de token preencha o Secret com um token:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

Recupere e use o token gerado:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

O resultado é semelhante a este:

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

O resultado é semelhante a este:

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

Os exemplos acima usam a opção `--insecure`. Isso o deixa sujeito a ataques MITM. 
Quando o kubectl acessa o cluster, ele usa um certificado raiz guardado
e certificados de cliente para acessar o servidor. (Esses certificados são instalados no diretório
`~/.kube`). Como os certificados do cluster normalmente são autoassinados, pode ser necessária uma
configuração especial para que seu cliente http use o certificado raiz.

Em alguns clusters, o apiserver não requer autenticação; ele pode servir
no localhost ou estar protegido por um firewall. Não há um padrão
para isso. [Controle de acesso à API](/docs/concepts/security/controlling-access) 
descreve como um administrador de cluster pode configurar isso.

## Acesso programático à API

O Kubernetes suporta oficialmente as bibliotecas de clientes [Go](#go-client) e [Python](#python-client).

### Biblioteca Go client

* Para obter a biblioteca, execute o seguinte comando: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`,
  consulte [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)
  para obter instruções detalhadas de instalação. Consulte
  [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix)
  para ver quais versões são compatíveis.
* Escreva um aplicativo utilizando a biblioteca Go Client. Observe que ela define seus próprios objetos de API,
  portanto, se necessário, importe as definições de API da biblioteca Go Client em vez de importá-las do repositório principal.
  Por exemplo, `import "k8s.io/client-go/kubernetes"` está correto.

A biblioteca Go Client pode usar o mesmo arquivo [kubeconfig] (/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
como a CLI do kubectl faz, para localizar e autenticar ao apiserver. Veja esse
[exemplo](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Se o aplicativo for disponibilizado como um pod no cluster, consulte a [próxima seção] (#acessar-o-api-deum-pod).

### Biblioteca Python client

Para usar o [cliente Python](https://github.com/kubernetes-client/python), execute o seguinte comando:
`pip install kubernetes`. Consulte [a página Python Client Library](https://github.com/kubernetes-client/python)
para obter mais opções de instalação.

O cliente Python pode usar o mesmo arquivo [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
como a CLI do kubectl faz, para localizar e autenticar ao apiserver. Veja esse
[exemplo](https://github.com/kubernetes-client/python/tree/master/examples).

### Outras bibliotecas

Existem [bibliotecas de clientes](/docs/reference/using-api/client-libraries/) para acessar a API de outras linguagens.
Consulte a documentação de outras bibliotecas para saber como elas se autenticam.

## Acessando a API a partir de um pod

Ao acessar a API de um pod, a localização e a autenticação
para o servidor de API são um pouco diferentes.

Consulte [Acessando a API a partir de um pod](/docs/tasks/run-application/access-api-from-pod/)
para obter mais detalhes.

## Acessando serviços em execução no cluster

A seção anterior descreve como se conectar ao servidor da API do Kubernetes.
Para obter informações sobre como se conectar a outros serviços em execução em um cluster do Kubernetes, consulte
[Acessando cluster serviços](/docs/tasks/access-application-cluster/access-cluster-services/).

## Solicitação de redirecionamentos

Os recursos de redirecionamento foram descontinuados e removidos. Em vez disso, use um proxy (veja abaixo).

## Tantos proxies

Há vários proxies diferentes que você pode encontrar ao usar o Kubernetes:

1. O [kubectl proxy](#directly-accessing-the-rest-api):

   - é executado no computador de um usuário ou em um pod
   - configure proxy de um endereço localhost para o apiserver do Kubernetes
   - cliente para proxy usa HTTP
   - proxy para o apiserver usa HTTPS
   - localiza o apiserver
   - adiciona headers de autenticação

2. O [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

   - é um bastião incorporado ao apiserver
   - conecta um usuário fora do cluster aos IPs do cluster que, de outra forma, poderiam não ser acessíveis
   - é executado no processo do apiserver
   - cliente para proxy usa HTTPS (ou http se o apiserver estiver configurado dessa forma)
   - O proxy para o alvo pode usar HTTP ou HTTPS, conforme escolhido pelo proxy usando as informações disponíveis
   - pode ser usado para acessar um Nó, Pod ou Serviço
   - faz o load balancing quando usado para acessar um serviço

3. O [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

   - é executado em cada nó
   - proxy de UDP e TCP
   - não entende HTTP
   - fornece load balancing
   - é usado apenas para acessar serviços

4. Um Proxy/Load-balancer na frente do(s) apiserver(es):

   - a existência e a implementação variam de cluster para cluster (por exemplo, nginx)
   - fica entre todos os clientes e um ou mais apiservers
   - atua como load balancer se houver vários apiservers.

5. Cloud Load Balancers em serviços externos:

   - são fornecidos por alguns provedores de Cloud (por exemplo, AWS ELB, Google Cloud Load Balancer)
   - são criados automaticamente quando o serviço Kubernetes tem o tipo `LoadBalancer`
   - usam somente UDP/TCP
   - A implementação varia de acordo com o provedor de Cloud.

Normalmente, os usuários do Kubernetes não precisam se preocupar com nada além dos dois primeiros tipos. O administrador do cluster
normalmente garantirá que os últimos tipos sejam configurados corretamente.
