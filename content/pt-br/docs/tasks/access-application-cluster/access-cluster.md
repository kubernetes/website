---
title: Acessando clusters
weight: 20
content_type: concept
---

<!-- overview -->

Esse tópico fala sobre diversas maneiras de interagir com clusters.

<!-- body -->

## Acessando pela primeira vez com kubectl

Se estiver acessando o Kubernetes API pela primeira vez, recomendamos usar a CLI do Kubernetes, `kubectl`.

Para acessar um cluster, você precisa saber a localização do cluster e ter credenciais para acessá-lo. Geralmente, isso é configurado automaticamente quando você trabalha com um [Guia de instalação](/pt-br/docs/setup/) ou outra pessoa configurou o cluster e forneceu a você credenciais e uma localização. 

Verifique o local e as credenciais que o kubectl conhece com esse comando:

```shell
kubectl config view
```

Muitos dos [exemplos](/docs/reference/kubectl/quick-reference/) fornecem uma introdução ao uso do `kubectl` e a documentação completa pode ser encontrada no [guia de referência do kubectl](/docs/reference/kubectl/).

## Acessando diretamente a API REST {#directly-accessing-the-rest-api}

O Kubectl lida com a localização e a autenticação no servidor de API.
Se você quiser acessar diretamente a API REST com um cliente http como
curl ou wget, ou um navegador, há várias maneiras de localizar e autenticar:

- Executar o kubectl no modo proxy.
  - Método recomendado.
  - Usa a localização previamente armazenada do servidor da API.
  - Verifica a identidade do apiserver usando um certificado autoassinado. Não há possibilidade de ataque MITM (_Man-In-The-Middle_).
  - Autentica-se no servidor da API.
  - No futuro, poderá fazer balanceamento de carga inteligente  no lado do cliente, e transferência em caso de falha.
- Forneça o local e as credenciais diretamente para o cliente http.
  - Método alternativo.
  - Funciona com alguns tipos de código de cliente que são confundidos pelo uso de um proxy.
  - É necessário importar um certificado raiz em seu navegador para se proteger contra ataque MITM (_Man-In-The-Middle_).

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

Os exemplos acima usam a opção `--insecure`. Isso deixa o cluster sujeito a ataques MITM. 
Quando o kubectl acessa o cluster, ele usa um certificado raiz guardado
e certificados de cliente para acessar o servidor. (Esses certificados são instalados no diretório
`~/.kube`). Como os certificados do cluster normalmente são autoassinados, pode ser necessária uma
configuração especial para que seu cliente http use o certificado raiz.

Em alguns clusters, o servidor da API não requer autenticação; ele pode servir
no localhost ou estar protegido por um firewall. Não há um padrão
para isso. A página [Controlando Acesso à API do Kubernetes](/pt-br/docs/concepts/security/controlling-access)  
descreve como um administrador de cluster pode configurar isso.

## Acesso programático à API

O Kubernetes suporta oficialmente as bibliotecas de clientes [Go](#go-client) e [Python](#python-client).

### Cliente Go{#go-client}

* Para obter a biblioteca, execute o seguinte comando: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`,
  consulte [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)
  para obter instruções detalhadas de instalação. Consulte
  [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix)
  para ver quais versões são compatíveis.
* Escreva um aplicativo utilizando o cliente Go. Observe que ela define seus próprios objetos de API,
  portanto, se necessário, importe as definições de API do cliente Go em vez de importá-las do repositório principal.
  Por exemplo, `import "k8s.io/client-go/kubernetes"` está correto.

O cliente Go pode usar o mesmo arquivo [kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
como a CLI do kubectl faz, para localizar e autenticar ao apiserver. Veja esse
[exemplo](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Se o aplicativo for disponibilizado como um pod no cluster, consulte a [próxima seção](#acessando-a-api-a-partir-de-um-pod).

### Cliente Python{#python-client}

Para usar o [cliente Python](https://github.com/kubernetes-client/python), execute o seguinte comando:
`pip install kubernetes`. Consulte [a página Python Client Library](https://github.com/kubernetes-client/python)
para obter mais opções de instalação.

O cliente Python pode usar o mesmo arquivo [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
que a ferramenta kubectl utiliza para localizar e autenticar ao servidor da API. Veja esse
[exemplo](https://github.com/kubernetes-client/python/tree/master/examples).

### Outras bibliotecas

Existem [bibliotecas de clientes](/docs/reference/using-api/client-libraries/) para acessar a API utilizando outras linguagens.
Consulte a documentação de outras bibliotecas para saber como elas se autenticam.

## Acessando a API a partir de um pod

Ao acessar a API a partir de um pod, a localização e a autenticação
para o servidor de API são um pouco diferentes.

Consulte [Acessando a API a partir de um pod](/docs/tasks/run-application/access-api-from-pod/)
para obter mais detalhes.

## Acessando serviços em execução no cluster

A seção anterior descreve como se conectar ao servidor da API do Kubernetes.
Para obter informações sobre como se conectar a outros serviços em execução em um cluster do Kubernetes, consulte
[Acessando serviços em execução em clusters](/pt-br/docs/tasks/access-application-cluster/access-cluster-services/).

## Solicitação de redirecionamentos

Os recursos de redirecionamento foram descontinuados e removidos. Em vez disso, use um proxy (veja abaixo).

## Tantos proxies

Há vários proxies diferentes que você pode encontrar ao usar o Kubernetes:

1. O [kubectl proxy](#directly-accessing-the-rest-api):

   - é executado no computador de um usuário ou em um pod
   - cria um proxy de um endereço localhost para o servidor da API do Kubernetes
   - a conexão do cliente para o proxy usa HTTP
   - a conexão do proxy para o servidor da API usa HTTPS
   - localiza o apiserver
   - adiciona cabeçalhos de autenticação

2. O [proxy do servidor da API](/pt-br/docs/tasks/access-application-cluster/access-cluster-services/#descobrindo-serviços-integrados):

   - é um bastião incorporado ao apiserver
   - conecta um usuário fora do cluster aos IPs do cluster que, de outra forma, poderiam não ser acessíveis
   - é executado no processo do servidor da API
   - cliente para proxy usa HTTPS (ou http se o servidor da API estiver configurado dessa forma)
   - a conexão do proxy para o destino pode usar HTTP ou HTTPS, conforme escolhido pelo proxy usando as informações disponíveis
   - pode ser usado para acessar um Nó, Pod ou Serviço
   - faz o balanceamento de carga quando usado para acessar um serviço

3. O [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

   - é executado em cada nó
   - proxy de UDP e TCP
   - não entende HTTP
   - fornece balanceamento de carga
   - é usado apenas para acessar serviços

4. Um Proxy/balanceador de carga na frente do(s) servidor(es) da API:

   - a existência e a implementação variam de cluster para cluster (por exemplo, nginx)
   - fica entre todos os clientes e um ou mais servidores da API
   - atua como um balanceador de carga se houver vários servidores da API.

6. Balanceadores de carga de provedor de nuvem em serviços externos:

   - são fornecidos por alguns provedores de nuvem computacional (por exemplo, AWS ELB, Google Cloud Load Balancer)
   - são criados automaticamente quando o serviço Kubernetes tem o tipo `LoadBalancer`
   - usam somente UDP/TCP
   - a implementação varia de acordo com o provedor de nuvem.

Normalmente, os usuários do Kubernetes não precisam se preocupar com nada além dos dois primeiros tipos. O administrador do cluster
normalmente garantirá que os últimos tipos sejam configurados corretamente.
