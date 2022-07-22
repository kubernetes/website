---
reviewers:
- bprashanth
- liggitt
- thockin
title: Configurando Contas de Serviço Para Pods
content_type: task
weight: 90
---

<!-- overview -->
Uma conta de serviço fornece uma identidade para processos que são executados em um Pod.

{{< note >}}
Este documento é uma introdução as Contas de Serviço, e descreve como as contas 
de serviço se comportam em um cluster configurado conforme recomendado pelo projeto Kubernetes. Seu administrador de cluster pode ter
personalizado o comportamento em seu cluster, nesse caso, esta documentação pode
não se aplicar.
{{< /note >}}

Quando você (um humano) acessa o cluster (por exemplo, usando `kubectl`), você é
autenticado pelo servidor de Api como uma conta de usuário específica (atualmente isso é
geralmente `admin`, a menos que o administrador do seu cluster tenha personalizado 
seu cluster). Os processos em contêineres dentro dos pods também podem entrar 
em contato com o servidor de Api.
Quando o fazem, são autenticados como uma conta de serviço específica 
(por exemplo, `default`).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Use a conta de serviço padrão para acessar o servidor da API.

Quando você cria um pod, se você não especificar uma conta de serviço, é
atribuído automaticamente a conta de serviço `default` no mesmo namespace.
Se você pegar o JSON ou YAML para um Pod que você criou (por exemplo, 
`Kubectl get pods/<podname> -o yaml`), você pode ver o campo 
`spec.serviceAccountName` [configurado automaticamente] (/docs/concepts/overview/working-with-objects/object-management/).

Você pode acessar a API de dentro de um Pod usando credenciais de conta de serviço 
montadas automaticamente, conforme descrito em
[Acessando o Cluster](/docs/tasks/access-application-cluster/access-cluster).
As permissões da API da conta de serviço dependem de [`plugin` e políticas de autorização]
(/docs/reference/access-authn-authz/authorization/#authorization-modules) em uso.

Você pode optar por não ter credenciais de API de automação em 
`/var/run/secrets/kubernetes.io/serviceaccount/token` para uma conta de serviço, 
definindo `automountServiceAcCountToken: false` na serviceAcCount:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

Em versões 1.6+, você também pode optar por não ter credenciais de API 
automaticamente no pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

A especificação do pod tem precedência sobre a conta de serviço, se ambos 
especificarem um valor `automountServiceAccountToken`.

## Use Multiplas Contas de Serviço

Todo namespace tem um recurso de conta de serviço padrão, chamado `default`.

Você pode lista-lo e qualquer outro recurso de conta de serviço em seu 
namespace com o comando:

```shell
kubectl get serviceaccounts
```

A saída é semelhante a esta:

```
NAME      SECRETS    AGE
default   1          1d
```

Você pode criar objetos contas de serviço adicionais dessa forma:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

O nome de um objeto contas de serviço precisa ser um [DNS subdomain name]
(/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

Se você pegar um `dump` completo do objeto do serviço de conta, como este:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

A saída é semelhante a esta:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

Então você verá que um token foi criado automaticamente 
e é referenciado pela conta de serviço.

Você pode usar plugins de autorização para [definir permissões em contas de serviço]
(/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Para usar uma conta de serviço não-padrão, defina o campo `spec.serviceAccountName'
de um pod para o nome da conta de serviço que você deseja usar.

A conta de serviço deve existir no momento em que o pod for criado, ou será rejeitado.

Você não pode atualizar a conta de serviço de um pod já criado.

Você pode limpar a conta de serviço deste exemplo, como a seguir:

```shell
kubectl delete serviceaccount/build-robot
```

## Manualmente crie um API token para uma conta de serviço.

Suponha que temos uma conta de serviço existente chamada "build-robot" 
como mencionado acima, e nós criamos um novo `secret` manualmente.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

Agora você pode confirmar que o segredo recém criado é preenchido com um token 
de API para o serviço de conta "build-robot".

Quaisquer tokens para contas de serviço inexistentes, 
serão limpos pelo controlador de token.

```shell
kubectl describe secrets/build-robot-secret
```

A saída é semelhante a esta:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
O conteúdo de `token` é eliminado aqui.
{{< /note >}}

## Adicione `ImagePullSecrets` à conta de serviço

### Crie uma `imagePullSecret`

- Crie como `imagePullSecret`, como descrito em [Especificando `ImagePullSecrets` para o Pod]
(/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

    ```shell
    kubectl create secret docker-registry myregistrykey --docker-server=DUMMY_SERVER \
            --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
            --docker-email=DUMMY_DOCKER_EMAIL
    ```

- Verifique se foi criado.

   ```shell
   kubectl get secrets myregistrykey
   ```

    A saída é semelhante a esta:

    ```
    NAME             TYPE                              DATA    AGE
    myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
    ```

### Adicione uma `imagePullSecret` a conta de serviço

Em seguida, modifique a conta de serviço padrão para o namespace para usar este 
segredo como um `imagePullSecret`.


```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

Você pode usar `kubectl edit`, ou editar manualmente o manifesto YAML como mostrado a seguir:

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml
```

A saída do arquivo `sa.yaml` é semelhante a esta:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
```

Usando seu editor de escolha (por exemplo `vi`), abra o arquivo `sa.yaml`, exclua 
a linha com a chave `resourceVersion:`, adicione a linha com `imagePullSecrets:` e salve-o.

A saída do arquivo `sa.yaml` é semelhante a esta:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
```

Finalmente substitua a conta de serviço pelo arquivo atualizado `sa.yaml`.

```shell
kubectl replace serviceaccount default -f ./sa.yaml
```

### Verifique se `imagePullSecrets` foi adicionado as especificações do pod

Agora, quando um novo pod é criado no namespace atual e usando a conta de seviço padrão, 
o novo Pod tem seu campo `spec.imagePullSecrets` definido automaticamente:

```shell
kubectl run nginx --image=nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

A saída é:

```
myregistrykey
```

<!--## Adicionando segredos a uma conta de serviço.

TODO: Teste e explique como usar secrets adicionais, em um não K8s com uma 
conta de serviço existente.
-->

## Serviço de Conta com Projeção de token de volume

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
Para ativar e usar projeção de solicitação de token, você deve especificar cada 
um dos seguintes argumentos de linha de comando para `kube-apiserver`:

* `--service-account-issuer`

     Pode ser usado como identificador do emissor de token da conta de serviço. 
     Você pode especificar o argumento `--service-account-issuer` múltiplas vezes, 
     isso pode ser útil para permitir uma mudança não disruptiva do emissor. 
     Quando esta flag é especificada várias vezes, a primeira é usado para gerar tokens 
     e todas são usadas para determinar quais emissores são aceitos. 
     Você deve estar executado o Kubernetes v1.22 ou uma versão mais recente 
     para poder especificar `--service-account-issuer` múltiplas vezes.
* `--service-account-key-file`

     Arquivo contendo chaves PEM-encoded x509 RSA ou ECDSA, privadas ou publicas, 
     usadas para verificar tokens de contas de serviço. O arquivo especificado pode 
     conter múltiplas chaves, e a flag pode ser especificada múltiplas vezes 
     com arquivos diferentes. Se especificado várias vezes, tokens assinados 
     por qualquer uma das chaves especificadas são consideradas válidas pelo 
     servidor de API do Kubernetes.
* `--service-account-signing-key-file`

     Caminho para o arquivo que contém a atual chave privada do emissor de token 
     da conta de serviço. O emissor assina os `ID tokens` emitidos com esta chave privada.
* `--api-audiences` (podem ser omitidas)

     O token autenticador da conta de serviço valida se os tokens que são usados contra 
     a API estão vinculados a pelo menos um desses destinatários. 
     Se uma `api-audiences` é especificada múltiplas vezes, tokens para qualquer 
     um dos destinatários especificados, são considerados válidos pelo servidor 
     de APi do Kubernetes. Se a flag `--service-account-issuer` está configura 
     e esta flag for `not`, este campo é padronizado para uma lista de elementos 
     única contendo o URL do emissor.

{{< /note >}}

O kubelet pode também projetar o token da conta de serviço em um Pod. 
Você pode especificar propriedades desejadas do token, como o destinatário 
e o tempo de validade. Essas propriedades não são configuráveis no token da conta 
de serviço padrão. O toker da conta de serviço também se tornará inválido 
na API quando o Pod ou a conta de serviço for excluído.

Este comportamento é configurado em `PodSpec` usando um tipo `ProjectedVolume` chamado
[ServiceAccountToken](/docs/concepts/storage/volumes/#projected). Para fornecer o
pod com um token apontando para um "vault" e duração de validade de duas horas, 
você configuraria o seguinte em sua especificação do Pod:

{{< codenew file="pods/pod-projected-svc-token.yaml" >}}

Crie o Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

O kubelet solicitará e armazenará o token em nome do pod, tornando o token disponível 
para o pod em um caminho de arquivo configurável, e atualiza o token à medida 
que se aproxima da expiração.
O Kubelet rotaciona proativamente o token se tiver passado mais de 80% 
do seu TTL total, ou se o token tiver mais de 24 horas.

A aplicação é responsável por recarregar o token quando ele for rotacionado. 
Recarregamento periódico (por exemplo uma vez a cada 5 minutos) 
é suficiente para a maioria dos casos de uso.

## Descoberta do emissor da conta de serviço

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

O recurso de descoberta do emissor da conta de serviço é ativado quando, 
o recurso de projeção de token da conta de serviço está ativado, conforme descrito
[acima](#service-account-token-volume-projection).

{{< note >}}
O URL do emissor deve cumprir a [especificação de descoberta OIDC]
(https://openid.net/specs/openid-connect-discovery-1_0.html). 
Na prática, isso significa que ele deve usar o esquema `https`, 
e deve servir uma configuração do provedor `OpenID` em 
`{service-account-issuer}/.well-known/openid-configuration`.

Se o URL não cumprir a especificação de descoberta OIDC, o `endpoint` `ServiceAccountIssuerDiscovery` 
não será registrado, mesmo se o recurso estiver ativado.
{{< /note >}}

O recurso de descoberta de emissor de conta de serviço, permite a Federação dos tokens 
de conta de serviço emitidos por um cluster Kubernetes (o _identity provider_), com
sistemas externos (_relying parties_).

Quando habilitado, o servidor de Api do Kubernetes fornece um documento 
de configuração do provedor `OpenID` em `/.well-known/openid-configuration` 
e a associada `Web key` JSON (JWKS) em `/openid/v1/jwks`. A configuração 
do provedor `OpenID` as vezes é referido como o _discovery document_.

Os clusters incluem um `ClusterRole RBAC` padrão chamado
`system:service-account-issuer-discovery`. Um `ClusterRoleBinding RBAC` padrão
atribui essa função ao grupo `system:serviceaccounts`, ao qual todas as contas 
de serviço pertencem implicitamente. Isso permite que os Pods sejam executados 
no cluster para acessar o documento de descoberta de conta de serviço através 
de seu token de conta de serviço montado.
Administradores devem, adicionalmente, optar por vincular o `role` a
`system:authenticated` ou `system:unauthenticated` dependendo de seus requisitos 
de segurança e em quais sistemas externos eles pretendem se federar.

{{< note >}}
As respostas servidas em `/.well-known/openid-configuration` e
`/openid/v1/jwks` são projetadas para serem compatíveis com OIDC, 
mas não estritamente OIDC compatível. Esses documentos contêm apenas os parâmetros 
necessários para executar a validação dos tokens da conta de serviço do Kubernetes.
{{< /note >}}

A resposta JWKS contém chaves públicas que uma parte que confia pode usar para validar
os tokens da conta de serviço do Kubernetes. Parceiros de confiança primeiro consultam a
configuração do provedor `OpenID`, e usam o campo `jwks_uri` na resposta para encontrar o JWKS.

Em muitos casos, o servidor de API do Kubernetes não esta disponível na internet 
pública, mas endpoints públicos, que servem respostas em cache do servidor de API podem 
ser disponibilizados por usuários ou provedores de serviços. Nesses casos, é possível
substituir o `jwks_uri` pelo provedor de configuração OpenID para que aponte para 
o endpoint público, em vez do endereço do servidor de API, ao passar a
 flag `--service-account-jwks-uri` ao servidor de API. 
 Como o URL do emissor, o URI JWKS é obrigado a usar o esquema `https`.


## {{% heading "whatsnext" %}}

Veja tmabém:

- [Guia de administração de contas de serviço em cluster](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Recuperação de chave de assinatura de conta de serviço KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
- [Especificações de descoberta OIDC](https://openid.net/specs/openid-connect-discovery-1_0.html)
