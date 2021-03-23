---
title: Autenticação
content_type: concept
weight: 10
---
 
<!-- overview -->
Essa página demonstra uma visão geral sobre autenticação
 
<!-- body -->
## Usuários no Kubernetes
 
Todos os clusters Kubernetes possuem duas categorias de usuários: contas de serviço gerenciadas pelo Kubernetes e usuários normais.
 
Assume-se que um serviço independente do cluster gerencia usuários normais das seguintes formas:
 
- Um administrador distribuindo chaves privadas
- Uma base de usuários como Keystone {{< glossary_definition term_id="keystone" length="all" >}} ou Google Accounts
- Um arquivo com uma lista de nomes de usuários e senhas
 
Neste quesito, _Kubernetes não possui objetos que possam representar as contas de um usuário normal._ Usuários normais não podem ser adicionados ao _cluster_ através de uma chamada para a API.
 
Apesar de um usuário normal não poder ser adicionado através de uma chamada para a API, qualquer usuário que apresente um certificado válido e assinado pela autoridade de certificados (CA) do _cluster_ é considerado autenticado. Nesta configuração, Kubernetes determina o nome do usuário baseado no campo de nome comum no sujeito (_subject_) do certificado (por exemplo: "/CN=bob"). A partir daí, o subsistema de controle de acesso baseado em função (RBAC) determina se o usuário é autorizado a realizar uma operação específica sobre o recurso. Para mais detalhes, veja a referência sobre o tópico de usuários normais dentro de [requisição de certificado](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user).
 
Em contraste a usuários normais, contas de serviço são considerados usuários gerenciados pela API do Kubernetes. Elas estão vinculadas à _namespaces_ específicas e criadas automaticamente pelo servidor de API ou manualmente através de chamadas da API. Contas de serviço estão ligadas a um conjunto de credenciais armazenados como `Secrets`, aos quais são montados dentro dos _pods_ assim permitindo que processos internos ao _cluster_  comuniquem-se com a API do Kubernetes.
 
Requisições para a API estão ligadas a um usuário normal, conta de serviço ou serão tratadas como [requisições anônimas](#anonymous-requests). Isto significa que cada processo dentro ou fora do _cluster_, desde um usuário humano utilizando o `kubectl` de uma estação de trabalho, a `kubelets` rodando nos nós, a membros da camada de gerenciamento (s/painel de controle) devem autenticar-se ao realizarem suas requisições para o servidor API ou serão tratados como usuário anônimo.
 
## Estratégias de autenticação
 
Kubernetes usa certificados de clientes, _bearer Token_, um proxy realizando autenticação, ou uma autenticação básica HTTP para autenticar requisições para o servidor de API através de plugins. Como requisições HTTP são feitas no servidor de API, plugins tentam associar os seguintes atributos junto a requisição:
 
* Username {{< glossary_definition term_id="username" length="all" >}}: um valor (String) que identifica o usuário final. Valores comuns podem ser `kube-admin` ou `jane@example.com`
* UID {{< glossary_definition term_id="uid" length="all" >}}: um valor (String) que identifica o usuário final e tenta ser mais consistente e único do que username.
* Groups: Um conjunto de valores em que cada item indica a associação de um usuário há uma coleção lógica de usuários. Valores comuns podem ser `system:masters` ou `devops-team`.
* Campos extras: um mapa que pode conter uma lista de atributos que armazena informações adicionais em que autorizadores podem achar útil.
 
Todos os valores são transparentes para o sistema de autenticação e somente trazem significado quando interpretados por um [autorizador](/docs/reference/access-authn-authz/authorization/).
 
É possível habilitar múltiplos métodos de autenticação. Deve-se normalmente usar pelo menos dois métodos:
 
- _Tokens_ para contas de serviço;
- Pelo menos um outro método de autenticação para usuários.
 
Quando múltiplos módulos de autenticação estão habilitados, o primeiro módulo a autenticar com sucesso uma requisição termina o fluxo de avaliação da mesma.
 
O servidor de API não garante a ordem em que os autenticadores são processados.
 
O grupo `system:authenticated` é incluído na lista de grupos de todos os usuários autenticados.
 
Integrações com outros protocolos de autenticação, como LDAP {{< glossary_definition term_id="ldap" length="all" >}}, SAML {{< glossary_definition term_id="saml" length="all" >}}, Kerberos {{< glossary_definition term_id="kerberos" length="all" >}}, alternate x509 schemes {{< glossary_definition term_id="alternate-x509-schemes" length="all" >}}, etc, podem ser alcançadas utilizando-se de um [proxy](#authenticating-proxy) ou [webhook](#webhook-token-authentication) de autenticação.
 
### Certificados de cliente X509
 
Autenticação via certificados de cliente pode ser habilitada ao passar a opção `--client-ca-file=ARQUIVO` para o servidor de API. O arquivo referenciado deve conter um ou mais autoridades de certificação usadas para validar o certificado de cliente passado para o servidor de API. Se o certificado de cliente é apresentado e verificado, o _common name_ {{< glossary_definition term_id="tls-common-name" length="all" >}} do sujeito é usado como o nome de usuário para a requisição. A partir da versão 1.4, certificados de cliente podem também indicar o pertencimento de um usuário a um grupo utilizando o campo de organização do certificado. Para incluir múltiplos grupos para o usuário, deve-se incluir múltiplos campos de organização no certificado.
 
Por exemplo, utilizando o comando de linha `openssl` para gerar uma requisição de assinatura de certificado:
 
``` bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```
 
Isto criaria um arquivo de tipo CSR (requisição de assinatura de certificado) para o usuário "jbeda" pertencendo a dois grupos: "app1" e "app2".
 
Veja como gerar um certificado de cliente em [Gerenciando Certificados](/docs/concepts/cluster-administration/certificates/)
 
### Arquivo estático de Token
 
O servidor de API lê _bearer tokens_ de um arquivo quando recebe uma requisição contendo a opção `--token-auth-file=ARQUIVO` via linha de comando. Atualmente, tokens têm duração indefinida, e a lista de tokens não pode ser modificada sem reiniciar o servidor de API.
 
O arquivo de token é do tipo CSV contendo no mínimo 3 colunas: token, nome de usuário, identificador de usuário (uid), seguido pelos nomes de grupos (opcional).
 
{{< note >}}
Se uma entrada possuir mais de um grupo, a coluna deve ser cercada por aspas duplas, por exemplo:
 
```conf
token,usuario,uid,"grupo1,grupo2,grupo3"
```
{{< /note >}}
 
#### Adicionando um _bearer token_ em uma requisição
 
Quando utilizando-se de _bearer token_ para autenticação de um cliente HTTP, o servidor de API espera um cabeçalho `Authorization` com um valor `Bearer TOKEN`. O token deve ser uma sequência de caracteres que pode ser colocada como valor em um cabeçalho HTTP não utilizando-se mais do que as facilidades de codificação e citação de HTTP. Por exemplo, se o valor de um token é `31ada4fd-adec-460c-809a-9e56ceb75269` então iria aparecer dentro de um cabeçalho HTTP como:
 
```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```
### Tokens de inicialização
 
{{< feature-state for_k8s_version="v1.18" state="stable" >}}
 
Para permitir a inicialização simplificada para novos _clusters_, Kubernetes inclui um token dinamicamente gerenciado denominado *Bootstrap Token*. Estes _tokens_ são armazenados como Secrets dentro do namespace `kube-system`, onde eles podem ser dinamicamente criados e gerenciados. O componente Gerenciador de Controle (Controller Manager) possui um controlador "limpador de tokens" (TokenCleaner) que apaga os _tokens_ de inicialização expirados.
 
Os _tokens_ seguem o formato `[a-z0-9]{6}.[a-z0-9]{16}`. O primeiro componente é um identificador do _token_ e o segundo é o segredo. Você pode especificar o _token_ como um cabeçalho HTTP como:
 
```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```
 
Deve-se habilitar os _tokens_ de inicialização com a opção `--enable-bootstrap-token-auth` no servidor de API. Deve-se habilitar o controlador `TokenCleaner` através da opção `--controllers` no Gerenciador de Controle, isto é feito, por exemplo, como: `--controllers=*,tokencleaner`. `kubeadm`, por exemplo, irá realizar isso caso seja utilizado para a inicialização do cluster.
 
O autenticador o autentica como `system:bootstrap:<Token ID>` e é incluído no grupo `system:bootstrappers`. O nome e grupo são intencionalmente limitados para desencorajar usuários a usarem estes _tokens_ após inicialização. Os nomes de usuários e grupos podem ser utilizados (e são utilizados por `kubeadm`) para elaborar as políticas de autorização para suportar a inicialização de um cluster.
 
Por favor veja [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) para documentação detalhada sobre o autenticador e controladores de _Token_ de inicialização, bem como gerenciar estes _tokens_ com `kubeadm`.
 
### Tokens de Contas de serviço
 
Uma conta de serviço é um autenticador habilitado automaticamente que usa bearer tokens para verificar as requisições. O plugin aceita dois parâmetros opcionais:
 
* `--service-account-key-file` Um arquivo contendo uma chave codificada no formato PEM para assinar _bearer tokens_. Se não especificado, a chave privada de TLS no servidor de API será utilizada
* `--service-account-lookup` Se habilitado, _tokens_ deletados do servidor de API serão revogados.
 
Contas de serviço são normalmente criadas automaticamente pelo servidor de API e associada a _pods_ rodando no cluster através do controlador de admissão [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). `ServiceAccount`. Contas podem ser explicitamente associadas com _pods_ utilizando o campo `serviceAccountName` na especificação do pod (`PodSpec`):
 
{{< note >}}
`serviceAccountName` é normalmente omitida por ser feito automaticamente
{{< /note >}}
 
```yaml
apiVersion: apps/v1 # esta apiVersion é relevante a partir do Kubernetes 1.9
kind: Deployment
metadata:
 name: nginx-deployment
 namespace: default
spec:
 replicas: 3
 template:
   metadata:
   # ...
   spec:
     serviceAccountName: bob-the-bot
     containers:
     - name: nginx
       image: nginx:1.14.2
```
 
Tokens de Contas de serviço são perfeitamente válidos para ser usados fora do cluster e podem ser utilizados para criar identidades para processos de longa duração que desejem comunicar-se com a API do Kubernetes. Para criar manualmente uma conta de serviço, utilize-se simplesmente o comando `kubectl create serviceaccount (NOME)`. Isso cria uma conta de serviço e um segredo associado a ela no namespace atual.
 
```bash
kubectl create serviceaccount jenkins
```
 
```none
serviceaccount "jenkins" created
```
 
Verificando um segredo associado:
 
```bash
kubectl get serviceaccounts jenkins -o yaml
```
 
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
 # ...
secrets:
- name: jenkins-token-1yvwg
```
O segredo criado irá armazenar a autoridade de certificado do servidor de API e um JSON Web Token (JWT) digitalmente assinado.
 
```bash
kubectl get secret jenkins-token-1yvwg -o yaml
```
 
```yaml
apiVersion: v1
data:
 ca.crt: (APISERVER'S CA BASE64 ENCODED)
 namespace: ZGVmYXVsdA==
 token: (BEARER TOKEN BASE64 ENCODED)
kind: Secret
metadata:
 # ...
type: kubernetes.io/service-account-token
```
 
{{< note >}}
Valores são codificados em base64 porque segredos são sempre codificados neste formato.
{{< /note >}}
 
O JWT assinado pode ser usado como um _bearer token_ para autenticar-se como a conta de serviço. Veja [acima](#adicionando-um-bearer-token-em-uma-requisição) como o _token_ pode ser incluído em uma requisição. Normalmente esses segredos são montados no pod para um acesso interno ao cluster ao servidor de API, porém pode ser utilizado fora do cluster também.
 
Contas de serviço são autenticadas com o nome de usuário `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)` e são atribuídas aos grupos `system:serviceaccounts` e `system:serviceaccounts:(NAMESPACE)`.
 
AVISO: porque os _tokens_ das contas de serviço são armazenados em segredos, qualquer usuário com acesso de leitura a esses segredos podem autenticar-se como a conta de serviço. Tome cuidado quando conceder permissões a contas de serviços e capacidade de leitura de segredos.
 
### Tokens OpenID Connect
 
[OpenID Connect](https://openid.net/connect/) é uma variação do framework de autorização OAuth2 que suporta provedores como Azure Active Directory, Salesforce, e Google. A principal extensão do OAuth2 é um campo adicional de _token_ de acesso chamado [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken). Este _token_ é um tipo de JSON Web Token (JWT) com campos bem definidos, como usuário, e-mail e é assinado pelo servidor de autorização.
 
Para identificar o usuário, o autenticador usa o `id_token` (e não `access_token`) do _bearer token_ da resposta de autorização do  OAuth2 [token response](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse). Veja [acima](#adicionando-um-bearer-token-em-uma-requisição) como incluir um _token_ em uma requisição.
 
{{< mermaid >}}
sequenceDiagram
   participant usuário as Usuário
   participant IDP as Provedor<br> de Identidade
   participant kube as Kubectl
   participant API as API Server
 
   usuário ->> IDP: 1. Realizar Login no IdP
   activate IDP
   IDP -->> usuário: 2. Fornece access_token,<br>id_token, e refresh_token
   deactivate IDP
   activate usuário
   usuário ->> kube: 3. Entrar Kubectl<br> com --token sendo id_token<br>ou adiciona tokens no arquivo .kube/config
   deactivate usuário
   activate kube
   kube ->> API: 4. Emite requisição incluindo o cabeçalho HTTP Authorization: Bearer...
   deactivate kube
   activate API
   API ->> API: 5. O token do tipo JWT possui assinatura válida ?
   API ->> API: 6. O token está expirado ? (iat+exp)
   API ->> API: 7. Usuário autorizado ?
   API -->> kube: 8. Autorizado: Realiza<br>ação e retorna resultado
   deactivate API
   activate kube
   kube --x usuário: 9. Retorna resultado
   deactivate kube
{{< /mermaid >}}
 
1.  Login no seu provedor de identidade.
2.  Seu provedor de identidade ira fornecer um  `access_token`, `id_token` e um `refresh_token`.
3.  Quando utilizando `kubectl`, utilize do seu `id_token` com a opção `--token` ou adicione o token diretamente no seu arquivo de configuração `kubeconfig`.
4.  `kubectl` envia o seu `id_token` em um cabeçalho HTTP chamado _Authorization_ para o servidor de API.
5.  O servidor de API irá garantir que a assinatura do token JWT é válida, verificando-o em relação ao certificado mencionado na configuração.
6.  Verificação para garantir que o`id_token` não esteja expirado.
7.  Garantir que o usuário é autorizado.
8.  Uma vez autorizado o servidor de API retorna a resposta para o `kubectl`.
9.  `kubectl` fornece retorno ao usuário.
 
Uma vez que todos os dados necessários para determinar sua identidade encontram-se no `id_token`, Kubernetes não precisa realizar outra chamada para o provedor de identidade. Em um modelo onde cada requisição _sem estado_ fornece uma solução escalável para autenticação. Isso, porem, apresenta alguns desafios:
 
1. Kubernetes não possui uma "interface web" para disparar o processo de autenticação. Não há browser ou interface para coletar credenciais que são necessárias para autenticar-se primeiro no seu provedor de identidade.
2. O `id_token` não pode ser revogado, funcionando como um certificado, portanto deve possuir curta validade (somente alguns minutos) o que pode tornar a experiência um pouco desconfortável, fazendo com que se requisite um novo _token_ toda vez em um curto intervalo (poucos minutos de validade do _token_)
3. Para autenticar-se ao dashboard Kubernetes, você deve executar o comando `kubectl proxy` ou um proxy reverso que consiga injetar o `id_token`.
 
#### Configurando o Servidor de API
 
Para habilitar o plugin de autorização, configure as seguintes opções no servidor de API:
 
| Parâmetro | Descrição | Exemplo | Obrigatório |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL do provedor que permite ao servidor de API descobrir chaves públicas de assinatura. Somente URLS que usam o esquema `https://` são aceitas.  Isto normalmente é o endereço de descoberta do provedor sem o caminho, por exemplo "https://accounts.google.com" ou "https://login.salesforce.com".  Esta URL deve apontar para o nível abaixo do caminho .well-known/openid-configuration | Se o valor da URL de descoberta é `https://accounts.google.com/.well-known/openid-configuration`, entao o valor deve ser `https://accounts.google.com` | Yes |
| `--oidc-client-id` |  Identificador do cliente para o qual todos os tokens são gerados. | kubernetes | Yes |
| `--oidc-username-claim` | Atributo do JWT a ser usado como nome de usuário. Por padrão o valor `sub`, o qual é esperado que seja um identificador único do usuário final. Administradores podem escolher outro atributo, como `email` ou `name`, dependendo de seu provedor de identidade. No entanto, outros atributos além de `email` serão prefixados com a URL do emissor issuer URL para prevenir conflitos de nome com outros plugins. | sub | No |
| `--oidc-username-prefix` | Prefixos adicionados ao atributo de nome de usuário para prevenir conflitos de nomes existentes (como por exemplo usuários `system:`). Por exemplo, o valor `oidc:` irá criar usuários como `oidc:jane.doe`. Se esta opção não for fornecida  `--oidc-username-claim` e um valor diferente de `email` irá conter um prefixo padrão com o valor de `( Issuer URL )#` onde `( Issuer URL )` era o valor da opção `--oidc-issuer-url`. O valor `-` pode ser utilizado para desabilitar todos os prefixos. | `oidc:` | No |
| `--oidc-groups-claim` | Atributo do JWT a ser utilizado para mapear os grupos dos usuários. Se o atributo está presente, ele deve ser do tipo vetor de Strings. | groups | No |
| `--oidc-groups-prefix` | Prefixo adicionados ao atributo de grupo para prevenir conflitos de nomes existentes (como por exemplo `system:` grupos). Por exemplo, o valor `oidc:` irá criar nomes de grupos como `oidc:engineering` e `oidc:infra`. | `oidc:` | No |
| `--oidc-required-claim` | Um par de chave=valor que descreve atributos obrigatórios no _ID Token_. Se configurado, a presença do atributo é verificado dentro do _ID Token_ com um valor relacionado. Repita esta opção para configurar múltiplos atributos obrigatórios. | `claim=value` | No |
| `--oidc-ca-file` | O caminho para o arquivo de certificado da autoridade de certificados (CA) que assinou o certificado do provedor de identidades. | `/etc/kubernetes/ssl/kc-ca.pem` | No |
 
É importante ressaltar que o servidor de API não é um cliente Oauth2, ao contrário, ele só pode ser configurado para confiar em um emissor. Isso permite o uso de emissores públicos, como Google, sem confiar em credenciais emitidas por terceiros. Administradores que desejam utilizar-se de múltiplos clientes OAuth2 devem explorar provedores os quais suportam atributos `azp` (parte autorizada), que é um mecanismo para permitir um cliente a emitir tokens em nome de outro.
 
Kubernetes não oferece um provedor de identidade OpenID Connect. Pode-se utilizar provedores públicos existentes como Google ou [outros](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers). Ou, pode-se rodar o próprio provedor de identidade no cluster, como [dex](https://dexidp.io/),
[Keycloak](https://github.com/keycloak/keycloak),
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa), ou
Tremolo Security's [OpenUnison](https://github.com/tremolosecurity/openunison).
 
Para um provedor de identidades funcionar no Kubernetes, ele deve:
 
1. Suportar o framework [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html); Nem todos suportam.
2. Executar TLS com criptogramas não obsoletos.
3. Possuir certificados assinados por uma Autoridade certificadora (mesmo que o CA não seja comercial ou seja auto-assinado)
 
Uma nota sobre o requisito #3 acima. Se você instalar o seu próprio provedor de identidades (ao invés de utilizar um provedor como Google ou Microsoft) você DEVE ter o certificado web do seu provedor de identidades assinado por um certificado contendo a opção `CA` configurada para `TRUE`, mesmo que seja um certificado auto assinado. Isso deve-se a implementação do cliente TLS em Golang que é bastante restrito quanto aos padrões em torno da validação de certificados. Se você nao possui um CA em facil alcance, você pode usar [este script](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh) criado pelo time Dex para criar um simples CA, um par de chaves e certificado assinados.
Ou você pode usar [este script similar](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh) o qual gera certificados SHA256 com uma vida mais longa e tamanho maior de chave.
 
Instruções de configuração para sistemas específicos podem estar encontrados em:
 
- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)
 
#### Utilizando kubectl
 
##### Opção 1 - Autenticador OIDC
 
A primeira opção é utilizar-se do autenticador `oidc` do kubectl, o qual define o valor do `id_token` como um  _bearer token_ para todas as requisições e irá atualizar o token quando o mesmo expirar. Após você efetuar o login no seu provedor, utilize o kubectl para adicionar os seus `id_token`, `refresh_token`, `client_id`, e `client_secret` para configurar o plugin.
 
Provedores os quais não retornem um `id_token` como parte da sua resposta de _refresh token_ não são suportados por este plugin e devem utilizar a opção 2 abaixo.
 
```bash
kubectl config set-credentials USER_NAME \
  --auth-provider=oidc \
  --auth-provider-arg=idp-issuer-url=( issuer url ) \
  --auth-provider-arg=client-id=( your client id ) \
  --auth-provider-arg=client-secret=( your client secret ) \
  --auth-provider-arg=refresh-token=( your refresh token ) \
  --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
  --auth-provider-arg=id-token=( your id_token )
```
 
Um exemplo, executando o comando abaixo após autenticar-se no seu provedor de identidades:
 
```bash
kubectl config set-credentials mmosley  \
       --auth-provider=oidc  \
       --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
       --auth-provider-arg=client-id=kubernetes  \
       --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
       --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
       --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
       --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```
 
O qual irá produzir a configuração abaixo:
 
```yaml
users:
- name: mmosley
 user:
   auth-provider:
     config:
       client-id: kubernetes
       client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
       id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
       idp-certificate-authority: /root/ca.pem
       idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
       refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
     name: oidc
```
Uma vez que seu `id_token` expire, `kubectl` irá tentar atualizar o seu `id_token` utilizando-se do seu `refresh_token` e `client_secret` armazenando os novos valores para `refresh_token` e `id_token` no seu arquivo de configuração `.kube/config`.
 
##### Opção 2 - Utilize a opção `--token`
 
O comando `kubectl` o permite passar o valor de um token utilizando a opção `--token`. Copie e cole o valor do seu `id_token` nesta opção:
 
```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```
 
### Token de autenticação via Webhook
 
Webhook de autenticação é usado para verificar _bearer tokens_
 
* `--authentication-token-webhook-config-file` arquivo de configuração descrevendo como acessar o serviço remoto de webhook.
* `--authentication-token-webhook-cache-ttl` por quanto tempo guardar em caso decisões de autenticação. Configuração padrão definida para dois minutos.
* `--authentication-token-webhook-version` determina quando usar `authentication.k8s.io/v1beta1` ou `authentication.k8s.io/v1`
 `TokenReview` objetos para enviar/receber informações do  webhook. Valor padrão `v1beta1`.
 
O arquivo de configuração usa o formato de arquivo do [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Dentro do arquivo, `clusters` refere-se ao serviço remoto e `users` refere-se ao servidor de API do webhook. Um exemplo seria:
 
```yaml
# versão da API do Kubernetes
apiVersion: v1
# tipo do objeto da API
kind: Config
# clusters refere-se ao serviço remoto
clusters:
 - name: name-of-remote-authn-service
   cluster:
     certificate-authority: /path/to/ca.pem         # CA para verificar o serviço remoto
     server: https://authn.example.com/authenticate # URL para procurar o serviço remoto. Deve utilizar 'https'.
 
# users refere-se a configuração do webhook do servidor de  API
users:
 - name: name-of-api-server
   user:
     client-certificate: /path/to/cert.pem # certificado para ser utilizado pelo plugin de webhook
     client-key: /path/to/key.pem          # chave referente ao certificado
 
# arquivos kubeconfig requerem um contexto. Especifique um para o servidor de API.
current-context: webhook
contexts:
- context:
   cluster: name-of-remote-authn-service
   user: name-of-api-server
 name: webhook
```
 
Quando um cliente tenta autenticar-se com o servidor de API utilizando um _bearer token_ como discutido [acima](#adicionando-um-bearer-token-em-uma-requisição), o webhook de autenticação envia um objeto JSON serializado do tipo `TokenReview` contendo o valor do _token_ para o serviço remoto.
 
Note que objetos de API do tipo _webhook_ estão sujeitos às mesmas [regras de compatibilidade de versão](/docs/concepts/overview/kubernetes-api/) como outros objetos de API Kubernetes.
Implementadores devem verificar o campo de versão da API (`apiVersion`) da requisição para garantir a correta deserialização e **devem** responder com um objeto do tipo `TokenReview` da mesma versão da requisição.
 
{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
O servidor de API Kubernetes envia por padrão revisão de tokens de versão `authentication.k8s.io/v1beta1` compatibilidade com versões anteriores.
 
Para optar receber revisão de tokens de versão `authentication.k8s.io/v1`, o servidor de API deve ser inicializado com a opção `--authentication-token-webhook-version=v1`.
{{< /note >}}
 
```yaml
{
 "apiVersion": "authentication.k8s.io/v1",
 "kind": "TokenReview",
 "spec": {
   # Bearer token opaco enviado para o servidor de API
   "token": "014fbff9a07c...",
 
   # Lista opcional de identificadores de audiência para o servidor ao qual o token foi apresentado
   # Autenticadores de token  sensíveis a audiência (por exemplo, autenticadores de token OIDC)
   # deve-se verificar que o token foi direcionado a pelo menos um membro da lista de audiência
   # e retornar a interseção desta lista a audiência válida para o token no estado da resposta
   # Isto garante com que o token é válido para autenticar-se no servidor ao qual foi apresentado
   # Se nenhuma audiência for especificada, o token deve ser validado para autenticar-se ao servidor de API do Kubernetes
   "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
 }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
 "apiVersion": "authentication.k8s.io/v1beta1",
 "kind": "TokenReview",
 "spec": {
   # Bearer token opaco enviado para o servidor de API
   "token": "014fbff9a07c...",
 
   # Lista opcional de identificadores de audiência para o servidor ao qual o token foi apresentado
   # Autenticadores de token  sensíveis a audiência (por exemplo, autenticadores de token OIDC)
   # deve-se verificar que o token foi direcionado a pelo menos um membro da lista de audiência
   # e retornar a interseção desta lista a audiência válida para o token no estado da resposta
   # Isto garante com que o token é válido para autenticar-se no servidor ao qual foi apresentado
   # Se nenhuma audiência for especificada, o token deve ser validado para autenticar-se ao servidor de API do Kubernetes
   "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
 }
}
```
{{% /tab %}}
{{< /tabs >}}
 
É esperado que o serviço remoto preencha o campo `status` da requisição para indicar o sucesso do login.
O campo `spec` do corpo de resposta é ignorado e pode ser omitido.
O serviço remoto deverá retornar uma resposta usando a mesma versão de API do objeto `TokenReview` que foi recebido.
Uma validação bem sucedida deveria retornar:
 
{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}
```yaml
{
 "apiVersion": "authentication.k8s.io/v1",
 "kind": "TokenReview",
 "status": {
   "authenticated": true,
   "user": {
     # Obrigatório
     "username": "janedoe@example.com",
     # Opcional
     "uid": "42",
     # Opcional: lista de grupos associados
     "groups": ["developers", "qa"],
     # Opcional: informação adicional  provida pelo autenticador.
     # Isto não deve conter dados confidenciais, pois pode ser registrados em logs ou em objetos de API e estarão disponíveis para webhooks de admissão
     "extra": {
       "extrafield1": [
         "extravalue1",
         "extravalue2"
       ]
     }
   },
   # Lista opcional de Autenticadores de token  sensíveis a audiência que podem ser retornados,
   # contendo as audiências da lista `spec.audiences` válido para o token apresentado.
   # Se este campo for omitido, o token é considerado válido para autenticar-se no servidor de API Kubernetes
   "audiences": ["https://myserver.example.com"]
 }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
 "apiVersion": "authentication.k8s.io/v1beta1",
 "kind": "TokenReview",
 "status": {
   "authenticated": true,
   "user": {
     # Obrigatório
     "username": "janedoe@example.com",
     # Opcional
     "uid": "42",
     # Opcional: lista de grupos associados
     "groups": ["developers", "qa"],
     # Opcional: informação adicional  provida pelo autenticador.
     # Isto não deve conter dados confidenciais, pois pode ser registrados em logs ou em objetos de API e estarão disponíveis para webhooks de admissão
     "extra": {
       "extrafield1": [
         "extravalue1",
         "extravalue2"
       ]
     }
   },
   # Lista opcional de Autenticadores de token  sensíveis a audiência que podem ser retornados,
   # contendo as audiências da lista `spec.audiences` válido para o token apresentado.
   # Se este campo for omitido, o token é considerado válido para autenticar-se no servidor de API Kubernetes
   "audiences": ["https://myserver.example.com"]
 }
}
```
{{% /tab %}}
{{< /tabs >}}
 
Uma requisição mal sucedida retornaria:
 
{{< tabs name="TokenReview_response_error" >}}
{{% tab name="authentication.k8s.io/v1" %}}
```yaml
{
 "apiVersion": "authentication.k8s.io/v1",
 "kind": "TokenReview",
 "status": {
   "authenticated": false,
   # Opcionalmente inclui detalhes sobre o porque a autenticação falhou
   # Se nenhum erro é fornecido, a API irá retornar uma mensagem genérica de "Não autorizado"
   # O campo de erro é ignorado quando authenticated=true.
   "error": "Credenciais expiradas"
 }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
 "apiVersion": "authentication.k8s.io/v1beta1",
 "kind": "TokenReview",
 "status": {
   "authenticated": false,
   # Opcionalmente inclui detalhes sobre o porque a autenticação falhou
   # Se nenhum erro é fornecido, a API irá retornar uma mensagem genérica de "Não autorizado"
   # O campo de erro é ignorado quando authenticated=true.
   "error": "Credenciais expiradas"
 }
}
```
{{% /tab %}}
{{< /tabs >}}
 
### Autenticando com Proxy
 
O servidor de API pode ser configurado para identificar usuários através de valores de cabeçalho de requisição, como por exemplo `X-Remote-User`.
Isto é projetado para o uso em combinação com um proxy de autenticação, o qual irá atribuir o valor do cabeçalho da requisição.
 
* `--requestheader-username-headers` Obrigatório, não faz distinção entre caracteres maiúsculos/minúsculos. Nomes de cabeçalhos a serem verificados, em ordem, para a identidade do usuário. O primeiro cabeçalho contendo um valor será usado para o nome do usuário.
* `--requestheader-group-headers` 1.6+. Opcional, não faz distinção entre caracteres maiúsculos/minúsculos. "X-Remote-Group" é recomendado. Nomes de cabeçalhos a serem verificados, em ordem, para os grupos do usuário. Todos os valores especificados em todos os cabeçalhos serão utilizados como nome dos grupos do usuário.
 
* `--requestheader-extra-headers-prefix` 1.6+. Opcional, não faz distinção entre caracteres maiúsculos/minúsculos. "X-Remote-Extra-" é recomendado. Prefixos de cabeçalhos para serem utilizados para definir informações extras sobre o usuário (normalmente utilizado por um plugin de autorização). Todos os cabeçalhos que começam com qualquer um dos prefixos especificados têm o prefixo removido. O restante do nome do cabeçalho é transformado em letra minúscula, decodificado [percent-decoded](https://tools.ietf.org/html/rfc3986#section-2.1) e torna-se uma chave extra, e o valor do cabeçalho torna-se um valor extra.
 
{{< note >}}
Antes da versão 1.11.3 (e 1.10.7, 1.9.11), a chave extra só poderia conter caracteres os quais fossem [legais em rótulos de cabeçalhos HTTP](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}
 
Por exemplo, com esta configuração:
 
```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```
 
e esta requisição:
 
```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```
 
resultaria nesta informação de usuário:
 
```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
 acme.com/project:
 - some-project
 scopes:
 - openid
 - profile
```
 
Para prevenir falsificação de cabeçalhos, o proxy de autenticação deverá apresentar um certificado de cliente válido para o servidor de API para que possa ser validado com a autoridade de certificados (CA) antes que os cabeçalhos de requisições sejam verificados. AVISO: **não** re-utilize uma autoridade de certificados (CA) que esteja sendo utilizado em um contexto diferente ao menos que você entenda os riscos e os mecanismos de proteção da utilização de uma autoridade de certificados.
 
* `--requestheader-client-ca-file` Obrigatório. Pacote de certificados no formato PEM. Um certificado válido deve ser apresentado e validado com a autoridade de certificados no arquivo especificado antes da verificação de cabeçalhos de requisição para os nomes do usuário.
 
* `--requestheader-allowed-names` Opcional. Lista de valores de nomes comuns (CNs). Se especificado, um certificado de cliente válido contendo uma lista de nomes comuns denominados deve ser apresentado na verificação de cabeçalhos de requisição para os nomes do usuário. Se vazio, qualquer valor de nomes comuns será permitido.
 
## Requisições anônimas
 
Quando habilitado, requisições que não são rejeitadas por outros métodos de autenticação configurados são tratadas como requisições anônimas e são dadas o nome de usuário `system:anonymous` e filiação ao grupo `system:unauthenticated`.
 
Por exemplo, uma requisição especificando um _bearer token_ invalido chega a um servidor com token de autenticação configurado e acesso anônimo habilitado e receberia um erro de acesso não autorizado `401 Unauthorized`. Já uma requisição não especificando nenhum _bearer token_ seria tratada como uma requisição anônima.
 
Nas versões 1.5.1-1.5.x, acesso anônimo é desabilitado por padrão e pode ser habilitado passando a opção `--anonymous-auth=true` durante a inicialização do servidor de API.
 
Na versão 1.6 e acima, acesso anônimo é habilitado por padrão se um modo de autorização diferente de `AlwaysAllow` é utilizado e pode ser desabilitado passando a opção `--anonymous-auth=false` durante a inicialização do servidor de API.
Começando na versão 1.6, os autorizadores _ABAC (Controle de Acesso Baseado em Atributos)_ e _RBAC (Controle de Acesso Baseado em Função)_ requerem autorização explícita do usuário `system:anonymous` e do grupo `system:unauthenticated`, portanto, regras de políticas legadas que permitam acesso a usuário `*` e grupo `*` nao incluíram usuários anônimos.
 
## Personificação de usuário
 
Um usuário pode agir como outro através de cabeçalhos de personificação. Os mesmos permitem que requisições manualmente sobrescrevam as informações ao quais o usuário irá se autenticar como. Por exemplo, um administrador pode utilizar-se desta funcionalidade para investigar um problema com uma política de autorização e assim, temporariamente, personificar um outro usuário e ver se/como sua requisição está sendo negada.
 
Requisições de personificação primeiramente são autenticadas como o usuário requerente, então trocando para os detalhes de informação do usuário personificado.
 
O fluxo é:
 
* Um usuário faz uma chamada de API com suas credenciais _e_ cabeçalhos de personificação.
* O servidor de API autentica o usuário.
* O servidor de API garante que o usuário autenticado possui permissão de personificação.
* Detalhes de informação do usuário da requisição tem seus valores substituídos com os detalhes de personificação.
* A requisição é avaliada e a autorização é feita sobre os detalhes do usuário personificado.
 
Os seguintes cabeçalhos HTTP podem ser usados para realizar uma requisição de personificação:
 
* `Impersonate-User`: O nome do usuário para se executar ações em seu nome.
* `Impersonate-Group`: Um nome de grupo para se executar ações em seu nome. Pode ser especificado múltiplas vezes para fornecer múltiplos grupos. Opcional. Requer "Impersonate-User".
* `Impersonate-Extra-( extra name )`: Um cabeçalho dinâmico usado para associar campos extras do usuário. Opcional. Requer "Impersonate-User". Para que seja preservado consistentemente, `( extra name )` deve ser somente minúsculo, e qualquer caracter que não seja [legal em rótulos de cabeçalhos HTTP](https://tools.ietf.org/html/rfc7230#section-3.2.6) DEVE ser utf8 e [codificado](https://tools.ietf.org/html/rfc3986#section-2.1).
 
{{< note >}}
Antes da versão 1.11.3 (e 1.10.7, 1.9.11), `( extra name )` só poderia conter caracteres que fossem [legais em rótulos de cabeçalhos HTTP](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}
 
Um exemplo de conjunto de cabeçalhos HTTP:
 
```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
```
 
Quando utilizando-se o `kubectl` especifique a opção `--as` para determinar o cabeçalho `Impersonate-User`, especifique a opção `--as-group` para determinar o cabeçalho `Impersonate-Group`.
 
```bash
kubectl drain mynode
```
 
```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```
 
Especificando as opções `--as` e `--as-group`:
 
```bash
kubectl drain mynode --as=superman --as-group=system:masters
```
 
```none
node/mynode cordoned
node/mynode drained
```
 
Para personificar um usuário, grupo ou especificar campos extras, o usuário efetuando a personificação deve possuir a permissão de executar o verbo "impersonate" no tipo de atributo sendo personificado ("user", "group", etc.). Para clusters com o plugin de autorização _RBAC_ habilitados, a seguinte ClusterRole abrange as regras necessárias para definir os cabeçalhos de personificação de usuário e grupo:
 
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: impersonator
rules:
- apiGroups: [""]
 resources: ["users", "groups", "serviceaccounts"]
 verbs: ["impersonate"]
```
 
Campos extras são avaliados como sub-recursos de um recurso denominado "userextras". Para permitir ao usuário que utilize os cabeçalhos de personificação para o campo extra "scopes", o usuário deve receber a seguinte permissão:
 
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: scopes-impersonator
rules:
# Pode definir o cabeçalho "Impersonate-Extra-scopes".
- apiGroups: ["authentication.k8s.io"]
 resources: ["userextras/scopes"]
 verbs: ["impersonate"]
```
Os valores dos cabeçalhos de personificação podem também ser restringidos ao limitar o conjunto de nomes de recursos (`resourceNames`) que um recurso pode ter.
 
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: limited-impersonator
rules:
# Pode personificar o usuário "jane.doe@example.com"
- apiGroups: [""]
 resources: ["users"]
 verbs: ["impersonate"]
 resourceNames: ["jane.doe@example.com"]
 
# Pode assumir os grupos "developers" and "admins"
- apiGroups: [""]
 resources: ["groups"]
 verbs: ["impersonate"]
 resourceNames: ["developers","admins"]
 
# Pode personificar os campos extras "scopes" com valores "view" e "development"
- apiGroups: ["authentication.k8s.io"]
 resources: ["userextras/scopes"]
 verbs: ["impersonate"]
 resourceNames: ["view", "development"]
```
 
## Plugins de credenciais client-go
{{< feature-state for_k8s_version="v1.11" state="beta" >}}
 
Ferramentas como `kubectl` e `kubelet` utilizando-se do `k8s.io/client-go` são capazes de executar um comando externo para receber credenciais de usuário.
 
Esta funcionalidade é direcionada à integração do lado cliente, com protocolos de autenticação não suportados nativamente pelo `k8s.io/client-go` como: LDAP, Kerberos, OAuth2, SAML, etc. O plugin implementa a lógica específica do protocolo e então retorna credenciais opacas para serem utilizadas. Quase todos os casos de usos de plugins de credenciais requerem um componente de lado do servidor com suporte para um [autenticador de token webhook](#token-de-autenticação-via-webhook) para interpretar o formato das credenciais produzidas pelo plugin cliente.
 
### Exemplo de caso de uso
 
Num caso de uso hipotético, uma organização executaria um serviço externo que efetuaria a troca de credenciais LDAP por tokens assinados para um usuário específico. Este serviço seria também capaz de responder requisições do [autenticador de token webhook](#token-de-autenticação-via-webhook) para validar tokens. Usuários seriam obrigados a instalar um plugin de credencial em sua estação de trabalho.
 
Para autenticar na API:
* O usuário entra um comando `kubectl`.
* O plugin de credencial solicita ao usuário a entrada de credenciais LDAP e efetua troca das credenciais por um token via um serviço externo.
* O plugin de credenciais retorna um token para o client-go, o qual o utiliza como um bearer token no servidor de API.
* O servidor de API usa o [autenticador de token webhook](#token-de-autenticação-via-webhook) para submeter um objeto `TokenReview` para o serviço externo.
* O serviço externo verifica a assinatura do token e retorna o nome e grupos do usuário.
 
### Configuração
 
plugins de credencial são configurados através de [arquivos de configuração do kubectl](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) como parte dos campos de usuário.
 
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
 user:
   exec:
     # Comando a ser executado. Obrigatório.
     command: "example-client-go-exec-plugin"
 
     # Versão da API a ser utilizada quando decodificar o recurso  ExecCredentials. Obrigatório
     #
     # A versão da API retornada pelo plugin DEVE ser a mesma versão listada aqui.
     #
     # Para integrar com ferramentas que suportem múltiplas versões (tal como client.authentication.k8s.io/v1alpha1),
     # defina uma variável de ambiente ou passe um argumento para a ferramenta que indique qual versão o plugin de execução deve esperar.
     apiVersion: "client.authentication.k8s.io/v1beta1"
 
     # Variáveis de ambiente a serem configuradas ao executar o plugin. Opcional
     env:
     - name: "FOO"
       value: "bar"
 
     # Argumentos a serem passados ao executar o plugin. Opcional
     args:
     - "arg1"
     - "arg2"
 
     # Texto exibido para o usuário quando o executável não parece estar presente. Opcional
     installHint: |
       example-client-go-exec-plugin é necessário para autenticar no cluster atual. Pode ser instalado via:
 
       Em macOS: brew install example-client-go-exec-plugin
 
       Em Ubuntu: apt-get install example-client-go-exec-plugin
 
       Em Fedora: dnf install example-client-go-exec-plugin
 
       ...
 
     # Deve-se ou não fornecer informações do cluster, que podem potencialmente conter grande quantidade de dados do CA,
     # para esse plugin de execução como parte da variável de ambiente KUBERNETES_EXEC_INFO
     provideClusterInfo: true
clusters:
- name: my-cluster
 cluster:
   server: "https://172.17.4.100:6443"
   certificate-authority: "/etc/kubernetes/ca.pem"
   extensions:
   - name: client.authentication.k8s.io/exec # nome de extensão reservado para configuração exclusiva do cluster
     extension:
       arbitrary: config
       this: pode ser fornecido através da variável de ambiente KUBERNETES_EXEC_INFO na configuracao de provideClusterInfo
       you: ["coloque", "qualquer", "coisa", "aqui"]
contexts:
- name: my-cluster
 context:
   cluster: my-cluster
   user: my-user
current-context: my-cluster
```
 
Os caminhos relativos do comando são interpretados como relativo ao diretório do arquivo de configuração. Se
KUBECONFIG está configurado para o caminho `/home/jane/kubeconfig` e o comando executado é `./bin/example-client-go-exec-plugin`,
o binario `/home/jane/bin/example-client-go-exec-plugin` será executado.
 
```yaml
- name: my-user
 user:
   exec:
     # Caminho relativo para o diretorio do kubeconfig
     command: "./bin/example-client-go-exec-plugin"
     apiVersion: "client.authentication.k8s.io/v1beta1"
```
 
### Formatos de entrada e saída
 
O comando executado imprime um objeto `ExecCredential` para o `stdout`. `k8s.io/client-go`
autentica na API do Kubernetes utilizando as credenciais retornadas no `status`.
 
Quando executando uma sessão interativa, `stdin` é exposto diretamente para o plugin. plugins devem utilizar
um [TTY check](https://godoc.org/golang.org/x/crypto/ssh/terminal#IsTerminal) para determinar se é
apropriado solicitar um usuário interativamente.
 
Para usar credenciais do tipo _bearer token_, o plugin retorna um token no status do objeto `ExecCredential`.
 
```json
{
 "apiVersion": "client.authentication.k8s.io/v1beta1",
 "kind": "ExecCredential",
 "status": {
   "token": "my-bearer-token"
 }
}
```
 
Alternativamente, um certificado de cliente e chave codificados em PEM podem ser retornados para serem utilizados em autenticação de cliente TLS.
Se o plugin retornar um certificado e chave diferentes numa chamada subsequente, `k8s.io/client-go`
Irá fechar conexões existentes com o servidor para forçar uma nova troca TLS.
 
Se especificado, `clientKeyData` e `clientCertificateData` devem ambos estar presentes.
 
`clientCertificateData` pode conter certificados intermediários adicionais a serem enviados para o servidor.
 
```json
{
 "apiVersion": "client.authentication.k8s.io/v1beta1",
 "kind": "ExecCredential",
 "status": {
   "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
   "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
 }
}
```
 
Opcionalmente, a resposta pode incluir a validade da credencial em formato
RFC3339 de data/hora. A presença ou ausência de validade pode ter o seguinte impacto:
 
- Se uma validade está incluída, o _bearer token_ e as credenciais TLS são guardadas em cache até
a o tempo de expiração é atingido ou se o servidor responder com um codigo de status HTTP 401
ou se o processo terminar.
 
- Se uma validate está ausente, o _bearer token_ e as credenciais TLS são guardadas em cache até
o servidor responder com um código de status HTTP 401 ou até o processo terminar.
 
```json
{
 "apiVersion": "client.authentication.k8s.io/v1beta1",
 "kind": "ExecCredential",
 "status": {
   "token": "my-bearer-token",
   "expirationTimestamp": "2018-03-05T17:30:20-08:00"
 }
}
```
 
Para habilitar o plugin de execução para obter informações específicas do cluster, define `provideClusterInfo` no campo `user.exec`
dentro do arquivo de configuração [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
O plugin irá então prover a variável de ambiente `KUBERNETES_EXEC_INFO`.
As informações desta variável de ambiente podem ser utilizadas para executar lógicas de aquisição
de credentiais específicas do cluster.
O manifesto `ExecCredential` abaixo descreve um exemplo de informação de cluster.
 
```json
{
 "apiVersion": "client.authentication.k8s.io/v1beta1",
 "kind": "ExecCredential",
 "spec": {
   "cluster": {
     "server": "https://172.17.4.100:6443",
     "certificate-authority-data": "LS0t...",
     "config": {
       "arbitrary": "config",
       "this": "pode ser fornecido por meio da variável de ambiente KUBERNETES_EXEC_INFO na configuração de provideClusterInfo",
       "you": ["coloque", "qualquer", "coisa", "aqui"]
     }
   }
 }
}
```