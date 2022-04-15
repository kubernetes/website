---
title: Secrets
content_type: concept
feature:
  title: Secrets e gerenciamento de configuração
  description: >
    Crie e atualize Secrets e configurações da aplicação sem reconstruir sua imagem
    de contêiner e sem expor credenciais na configuração da sua aplicação.
weight: 30
---

<!-- overview -->

Um Secret é um objeto que contém uma pequena quantidade de informação sensível,
como senhas, tokens ou chaves. Este tipo de informação poderia, em outras
circunstâncias, ser colocada diretamente em uma configuração de
{{< glossary_tooltip term_id="pod" >}} ou em uma
{{< glossary_tooltip text="imagem de contêiner" term_id="image" >}}. O uso de
Secrets evita que você tenha de incluir dados confidenciais no seu código.

Secrets podem ser criados de forma independente dos Pods que os consomem. Isto
reduz o risco de que o Secret e seus dados sejam expostos durante o processo de
criação, visualização e edição ou atualização de Pods. O Kubernetes e as
aplicações que rodam no seu cluster podem também tomar outras precauções com
Secrets, como por exemplo evitar a escrita de dados confidenciais em local de
armazenamento persistente (não-volátil).

Secrets são semelhantes a
{{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}, mas foram
especificamente projetados para conter dados confidenciais.

{{< caution >}}
Os Secrets do Kubernetes são, por padrão, gravados não-encriptados no sistema
de armazenamento de dados utilizado pelo servidor da API (etcd). Qualquer pessoa
com acesso à API ou ao etcd consegue obter ou modificar um Secret.
Além disso, qualquer pessoa que possui autorização para criar Pods em um namespace
consegue utilizar este privilégio para ler qualquer Secret naquele namespace. Isso
inclui acesso indireto, como por exemplo a permissão para criar Deployments.

Para utilizar Secrets de forma segura, siga pelo menos as instruções abaixo:
1. [Habilite encriptação em disco](/docs/tasks/administer-cluster/encrypt-data/) para Secrets.
1. Habilite ou configure [regras de RBAC](/docs/reference/access-authn-authz/authorization/)
que restrinjam o acesso de leitura a Secrets (incluindo acesso indireto).
1. Quando apropriado, utilize mecanismos como RBAC para limitar quais perfis e
usuários possuem permissão para criar novos Secrets ou substituir Secrets
existentes.

{{< /caution >}}

Consulte [Segurança da informação para Secrets](#information-security-for-secrets)
para mais detalhes.

<!-- body -->

## Usos para Secrets

Existem três formas principais para um Pod utilizar um Secret:
- Como [arquivos](#using-secrets-as-files-from-a-pod) em um
{{< glossary_tooltip text="volume" term_id="volume" >}} montado em um ou mais de
seus contêineres.
- Como uma [variável de ambiente](#using-secrets-as-environment-variables) de um
contêiner.
- Pelo [kubelet ao baixar imagens de contêiner](#using-imagepullsecrets) para o
Pod.

A camada de gerenciamento do Kubernetes também utiliza Secrets. Por exemplo,
os [Secrets de tokens de autoinicialização](#bootstrap-token-secrets) são um
mecanismo que auxilia a automação do registro de nós.

### Alternativas a Secrets

Ao invés de utilizar um Secret para proteger dados confidenciais, você pode
escolher uma maneira alternativa. Algumas das opções são:

- se o seu componente cloud native precisa autenticar-se a outra aplicação que
está rodando no mesmo cluster Kubernetes, você pode utilizar uma
[ServiceAccount](/pt-br/docs/reference/access-authn-authz/authentication/#tokens-de-contas-de-serviço)
e seus tokens para identificar seu cliente.
- existem ferramentas fornecidas por terceiros que você pode rodar, no seu
cluster ou externamente, que providenciam gerenciamento de Secrets. Por exemplo,
um serviço que Pods accessam via HTTPS, que revelam um Secret se o cliente
autenticar-se corretamente (por exemplo, utilizando um token de ServiceAccount).
- para autenticação, você pode implementar um serviço de assinatura de
certificados X.509 personalizado, e utilizar
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
para permitir ao serviço personalizado emitir certificados a pods que os
necessitam.
- você pode utilizar um [plugin de dispositivo](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
para expor a um Pod específico um hardware de encriptação conectado a um nó. Por
exemplo, você pode agendar Pods confiáveis em nós que oferecem um _Trusted
Platform Module_, configurado em um fluxo de dados independente.

Você pode também combinar duas ou mais destas opções, incluindo a opção de
utilizar objetos do tipo Secret.

Por exemplo: implemente (ou instale) um
{{< glossary_tooltip text="operador" term_id="operator-pattern" >}}
que solicite tokens de sessão de curta duração a um serviço externo, e crie
Secrets baseado nestes tokens. Pods rodando no seu cluster podem fazer uso de
tokens de sessão, e o operador garante que estes permanecem válidos. Esta
separação significa que você pode rodar Pods que não precisam ter conhecimento
do mecanismo exato para geração e atualização de tais tokens de sessão.

## Trabalhando com Secrets

### Criando um Secret

Existem diversas formas de criar um Secret:

- [crie um Secret utilizando o comando `kubectl`](/pt-br/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [crie um Secret a partir de um arquivo de configuração](/pt-br/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [crie um Secret utilizando a ferramenta kustomize](/pt-br/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

#### Restrições de nomes de Secret e dados {#restriction-names-data}

O nome de um Secret deve ser um [subdomínio DNS válido](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Você pode especificar o campo `data` e/ou o campo `stringData` na criação de um
arquivo de configuração de um Secret. Ambos os campos `data` e `stringData` são
opcionais. Os valores das chaves no campo `data` devem ser strings codificadas
no formato base64. Se a conversão para base64 não for desejável, você pode
optar por informar os dados no campo `stringData`, que aceita strings arbitrárias
como valores.

As chaves dos campos `data` e `stringData` devem consistir de caracteres
alfanuméricos, `-`, `_`, ou `.`. Todos os pares chave-valor no campo `stringData`
são internamente combinados com os dados do campo `data`. Se uma chave aparece
em ambos os campos, o valor informado no campo `stringData` toma a precedência.

#### Limite de tamanho {#restriction-data-size}

Secrets individuais são limitados a 1MiB em tamanho. Esta limitação tem por
objetivo desencorajar a criação de Secrets muito grandes que possam exaurir o
servidor da API e a memória do kubelet. No entanto, a criação de vários Secrets
pequenos pode também exaurir a memória. Você pode utilizar uma
[quota de recurso](/docs/concepts/policy/resource-quotas/) a fim de limitar o
número de Secrets (ou outros recursos) em um namespace.

### Editando um Secret

Você pode editar um Secret existente utilizando kubectl:

```shell
kubectl edit secrets mysecret
```

Este comando abre o seu editor padrão configurado e permite a modificação dos
valores do Secret codificados em base64 no campo `data`. Por exemplo:

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

Este manifesto de exemplo define um Secret com duas chaves no campo `data`:
`username` and `password`.
Os valores são strings codificadas em formato base64. No entanto, quando um
Secret é utilizado em um Pod, o kubelet fornece os dados _decodificados_ ao Pod
e seus contêineres.

Você pode especificar muitas chaves e valores em um Secret só, ou utilizar
muitos Secrets. Escolha a opção que for mais conveniente para o caso de uso.

### Utilizando Secrets

Secrets podem ser montados como volumes de dados ou expostos como
{{< glossary_tooltip text="variáveis de ambiente" term_id="container-env-variables" >}}
para serem utilizados num container de um Pod. Secrets também podem ser
utilizados por outras partes do sistema, sem serem diretamente expostos ao Pod.
Por exemplo, Secrets podem conter credenciais que outras partes do sistema devem
utilizar para interagir com sistemas externos no lugar do usuário.

Secrets montados como volumes são verificados para garantir que o nome
referenciado realmente é um objeto do tipo Secret. Portanto, um Secret deve ser
criado antes de quaisquer Pods que o referenciam.

Se um Secret não puder ser encontrado (porque não existe, ou devido a um problema
de conectividade com o servidor da API) o kubelet tenta periodicamente reiniciar
aquele Pod. O kubelet também relata um evento para aquele Pod, incluindo detalhes
do problema ao buscar o Secret.

### Utilizando Secrets como arquivos em um Pod {#using-secrets-as-files-from-a-pod}

Para consumir um Secret em um volume em um Pod:
1. Crie um Secret ou utilize um previamente existente. Múltiplos Pods podem
referenciar o mesmo secret.
1. Modifique sua definição de Pod para adicionar um volume na lista
`.spec.volumes[]`. Escolha um nome qualquer para o seu volume e adicione um
campo `.spec.volumes[].secret.secretName` com o mesmo valor do seu objeto
Secret.
1. Adicione um ponto de montagem de volume à lista
`.spec.containers[].volumeMounts[]` de cada contêiner que requer o Secret.
Especifique `.spec.containers[].volumeMounts[].readOnly = true` e especifique o
valor do campo `.spec.containers[].volumeMounts[].mountPath` com o nome de um
diretório não utilizado onde você deseja que os Secrets apareçam.
1. Modifique sua imagem ou linha de comando de modo que o programa procure por
arquivos naquele diretório. Cada chave no campo `data` se torna um nome de
arquivo no diretório especificado em `mountPath`.

Este é um exemplo de Pod que monta um Secret em um volume:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

Cada Secret que você deseja utilizar deve ser referenciado na lista
`.spec.volumes`.

Se existirem múltiplos contêineres em um Pod, cada um dos contêineres necessitará
seu próprio bloco `volumeMounts`, mas somente um volume na lista `.spec.volumes`
é necessário por Secret.

Você pode armazenar vários arquivos em um Secret ou utilizar vários Secrets
distintos, o que for mais conveniente.

#### Projeção de chaves de Secrets a caminhos específicos

Você pode também controlar os caminhos dentro do volume onde as chaves do Secret
são projetadas. Você pode utilizar o campo `.spec.volumes[].secret.items` para
mudar o caminho de destino de cada chave:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

Neste caso:
* O valor da chave `username` é armazenado no arquivo
`/etc/foo/my-group/my-username` ao invés de `/etc/foo/username`.
* O valor da chave `password` não é projetado no sistema de arquivos.

Se `.spec.volumes[].secret.items` for utilizado, somente chaves especificadas
na lista `items` são projetadas. Para consumir todas as chaves do Secret, deve
haver um item para cada chave no campo `items`. Todas as chaves listadas precisam
existir no Secret correspondente. Caso contrário, o volume não é criado.

#### Permissões de arquivos de Secret

Você pode trocar os bits de permissão de uma chave avulsa de Secret.
Se nenhuma permissão for especificada, `0644` é utilizado por padrão.
Você pode também especificar uma permissão padrão para o volume inteiro de
Secret e sobrescrever esta permissão por chave, se necessário.

Por exemplo, você pode especificar uma permissão padrão da seguinte maneira:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

Dessa forma, o Secret será montado em `/etc/foo` e todos os arquivos criados
no volume terão a permissão `0400`.

Note que a especificação JSON não suporta notação octal. Neste caso, utilize o
valor 256 para permissões equivalentes a 0400. Se você utilizar YAML ao invés
de JSON para o Pod, você pode utilizar notação octal para especificar permissões
de uma forma mais natural.

Perceba que se você acessar o Pod com `kubectl exec`, você precisará seguir o
vínculo simbólico para encontrar a permissão esperada. Por exemplo,

Verifique as permissões do arquivo de Secret no pod.
```
kubectl exec mypod -it sh

cd /etc/foo
ls -l
```

O resultado é semelhante ao abaixo:
```
total 0
lrwxrwxrwx 1 root root 15 May 18 00:18 password -> ..data/password
lrwxrwxrwx 1 root root 15 May 18 00:18 username -> ..data/username
```

Siga o vínculo simbólico para encontrar a permissão correta do arquivo.
```
cd /etc/foo/..data
ls -l
```

O resultado é semelhante ao abaixo:
```
total 8
-r-------- 1 root root 12 May 18 00:18 password
-r-------- 1 root root  5 May 18 00:18 username
```

Você pode também utilizar mapeamento, como no exemplo anterior, e especificar
permissões diferentes para arquivos diferentes conforme abaixo:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
        mode: 0777
```

Neste caso, o arquivo resultante em `/etc/foo/my-group/my-username` terá as
permissões `0777`. Se você utilizar JSON, devido às limitações do formato,
você precisará informar as permissões em base decimal, ou o valor `511` neste
exemplo.

Note que os valores de permissões podem ser exibidos em formato decimal se você
ler essa informação posteriormente.

#### Consumindo valores de Secrets em volumes

Dentro do contêiner que monta um volume de Secret, as chaves deste Secret
aparecem como arquivos e os valores dos Secrets são decodificados do formato
base64 e armazenados dentro destes arquivos. Ao executar comandos dentro do
contêiner do exemplo anterior, obteremos os seguintes resultados:

```shell
ls /etc/foo
```

O resultado é semelhante a:
```
username
password
```

```shell
cat /etc/foo/username
```

O resultado é semelhante a:
```
admin
```

```shell
cat /etc/foo/password
```

O resultado é semelhante a:
```
1f2d1e2e67df
```

A aplicação rodando dentro do contêiner é responsável pela leitura dos Secrets
dentro dos arquivos.

#### Secrets montados são atualizados automaticamente

Quando um Secret que está sendo consumido a partir de um volume é atualizado, as
chaves projetadas são atualizadas após algum tempo também. O kubelet verifica
se o Secret montado está atualizado a cada sincronização periódica. No entanto,
o kubelet utiliza seu cache local para buscar o valor corrente de um Secret. O
tipo do cache é configurável utilizando o campo `ConfigMapAndSecretChangeDetectionStrategy`
na estrutura [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
Um Secret pode ser propagado através de um _watch_ (comportamento padrão), que
é o sistema de propagação de mudanças incrementais em objetos do Kubernetes;
baseado em TTL (_time to live_, ou tempo de expiração); ou redirecionando todas
as requisições diretamente para o servidor da API.

Como resultado, o tempo decorrido total entre o momento em que o Secret foi
atualizado até o momento em que as novas chaves são projetadas nos Pods pode
ser tão longo quanto o tempo de sincronização do kubelet somado ao tempo de
propagação do cache, onde o tempo de propagação do cache depende do tipo de
cache escolhido: o tempo de propagação pode ser igual ao tempo de propagação
do _watch_, TTL do cache, ou zero, de acordo com cada um dos tipos de cache.

{{< note >}}
Um contêiner que utiliza Secrets através de um ponto de montagem com a
propriedade
[subPath](/docs/concepts/storage/volumes#using-subpath) não recebe atualizações
deste Secret.
{{< /note >}}

### Utilizando Secrets como variáveis de ambiente {#using-secrets-as-environment-variables}

Para utilizar um secret em uma {{< glossary_tooltip text="variável de ambiente" term_id="container-env-variables" >}}
em um Pod:

1. Crie um Secret ou utilize um já existente. Múltiplos Pods podem referenciar o
mesmo Secret.
1. Modifique a definição de cada contêiner do Pod em que desejar consumir o
Secret, adicionando uma variável de ambiente para cada uma das chaves que deseja
consumir.
A variável de ambiente que consumir o valor da chave em questão deverá popular o
nome do Secret e a sua chave correspondente no campo
`env[].valueFrom.secretKeyRef`.
1. Modifique sua imagem de contêiner ou linha de comando de forma que o programa
busque os valores nas variáveis de ambiente especificadas.

Este é um exemplo de um Pod que utiliza Secrets em variáveis de ambiente:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
    - name: SECRET_USERNAME
      valueFrom:
        secretKeyRef:
          name: mysecret
          key: username
    - name: SECRET_PASSWORD
      valueFrom:
        secretKeyRef:
          name: mysecret
          key: password
  restartPolicy: Never
```

#### Consumindo valores de Secret em variáveis de ambiente

Dentro de um contêiner que consome um Secret em variáveis de ambiente, a chave
do Secret aparece como uma variável de ambiente comum, contendo os dados do
Secret decodificados do formato base64. Ao executar comandos no contêiner do
exemplo anterior, obteremos os resultados abaixo:

```shell
echo $SECRET_USERNAME
```

O resultado é semelhante a:

```
admin
```

```shell
echo $SECRET_PASSWORD
```

O resultado é semelhante a:

```
1f2d1e2e67df
```

#### Variáveis de ambiente não são atualizadas após uma atualização no Secret

Se um contêiner já consome um Secret em uma variável de ambiente, uma atualização
dos valores do Secret não será refletida no contêiner a menos que o contêiner
seja reiniciado.
Existem ferramentas de terceiros que oferecem reinicializações automáticas
quando Secrets são atualizados.

## Tipos de Secrets {#secret-types}

Ao criar um Secret, você pode especificar o seu tipo utilizando o campo `type`
do objeto Secret, ou algumas opções de linha de comando equivalentes no comando
`kubectl`, quando disponíveis. O campo `type` de um Secret é utilizado para
facilitar a manipulação programática de diferentes tipos de dados confidenciais.

O Kubernetes oferece vários tipos embutidos de Secret para casos de uso comuns.
Estes tipos variam em termos de validações efetuadas e limitações que o
Kubernetes impõe neles.

| Tipo embutido                          | Caso de uso                                        |
|----------------------------------------|----------------------------------------------------|
| `Opaque`                               | dados arbitrários definidos pelo usuário           |
| `kubernetes.io/service-account-token`  | token de service account (conta de serviço)        |
| `kubernetes.io/dockercfg`              | arquivo `~/.dockercfg` serializado                 |
| `kubernetes.io/dockerconfigjson`       | arquivo `~/.docker/config.json` serializado        |
| `kubernetes.io/basic-auth`             | credenciais para autenticação básica (basic auth)  |
| `kubernetes.io/ssh-auth`               | credenciais para autenticação SSH                  |
| `kubernetes.io/tls`                    | dados para um cliente ou servidor TLS              |
| `bootstrap.kubernetes.io/token`        | dados de token de autoinicialização                |

Você pode definir e utilizar seu próprio tipo de Secret definindo o valor do
campo `type` como uma string não-nula em um objeto Secret. Uma string em branco
é tratada como o tipo `Opaque`. O Kubernetes não restringe nomes de tipos. No
entanto, quando tipos embutidos são utilizados, você precisa atender a todos os
requisitos daquele tipo.

### Secrets tipo Opaque

`Opaque` é o tipo predefinido de Secret quando o campo `type` não é informado
em um arquivo de configuração. Quando um Secret é criado usando o comando
`kubectl`, você deve usar o subcomando `generic` para indicar que um Secret é
do tipo `Opaque`. Por exemplo, o comando a seguir cria um Secret vazio do tipo
`Opaque`:
```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

O resultado será semelhante ao abaixo:

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

A coluna `DATA` demonstra a quantidade de dados armazenados no Secret. Neste
caso, `0` significa que este objeto Secret está vazio.

### Secrets de token de service account (conta de serviço)

Secrets do tipo `kubernetes.io/service-account-token` são utilizados para
armazenar um token que identifica uma service account (conta de serviço). Ao
utilizar este tipo de Secret, você deve garantir que a anotação
`kubernetes.io/service-account.name` contém um nome de uma service account
existente. Um controlador do Kubernetes preenche outros campos, como por exemplo
a anotação `kubernetes.io/service-account.uid` e a chave `token` no campo `data`
com o conteúdo do token.

O exemplo de configuração abaixo declara um Secret de token de service account:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account-name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # Você pode incluir pares chave-valor adicionais, da mesma forma que faria com
  # Secrets do tipo Opaque
  extra: YmFyCg==
```

Ao criar um {{< glossary_tooltip text="Pod" term_id="pod" >}}, o Kubernetes
automaticamente cria um Secret de service account e automaticamente atualiza o
seu Pod para utilizar este Secret. O Secret de token de service account contém
credenciais para acessar a API.

A criação automática e o uso de credenciais de API podem ser desativados se
desejado. Porém, se tudo que você necessita é poder acessar o servidor da API
de forma segura, este é o processo recomendado.

Veja a documentação de
[ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
para mais informações sobre o funcionamento de service accounts. Você pode
verificar também os campos `automountServiceAccountToken` e `serviceAccountName`
do [`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
para mais informações sobre como referenciar service accounts em Pods.

### Secrets de configuração do Docker

Você pode utilizar um dos tipos abaixo para criar um Secret que armazena
credenciais para accesso a um registro de contêineres compatível com Docker
para busca de imagens:
- `kubernetes.io/dockercfg`
- `kubernetes.io/dockerconfigjson`

O tipo `kubernetes.io/dockercfg` é reservado para armazenamento de um arquivo
`~/.dockercfg` serializado. Este arquivo é o formato legado para configuração
do utilitário de linha de comando do Docker. Ao utilizar este tipo de Secret,
é preciso garantir que o campo `data` contém uma chave `.dockercfg` cujo valor
é o conteúdo do arquivo `~/.dockercfg` codificado no formato base64.

O tipo `kubernetes.io/dockerconfigjson` foi projetado para armazenamento de um
conteúdo JSON serializado que obedece às mesmas regras de formato que o arquivo
`~/.docker/config.json`. Este arquivo é um formato mais moderno para o conteúdo
do arquivo `~/.dockercfg`. Ao utilizar este tipo de Secret, o conteúdo do campo
`data` deve conter uma chave `.dockerconfigjson` em que o conteúdo do arquivo
`~/.docker/config.json` é fornecido codificado no formato base64.

Um exemplo de um Secret do tipo `kubernetes.io/dockercfg`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-dockercfg
type: kubernetes.io/dockercfg
data:
  .dockercfg: |
    "<base64 encoded ~/.dockercfg file>"
```

{{< note >}}
Se você não desejar fazer a codificação em formato base64, você pode utilizar o
campo `stringData` como alternativa.
{{< /note >}}

Ao criar estes tipos de Secret utilizando um manifesto (arquivo YAML), o servidor
da API verifica se a chave esperada existe no campo `data` e se o valor fornecido
pode ser interpretado como um conteúdo JSON válido. O servidor da API não verifica
se o conteúdo informado é realmente um arquivo de configuração do Docker.

Quando você não tem um arquivo de configuração do Docker, ou quer utilizar o
comando `kubectl` para criar um Secret de registro de contêineres compatível
com o Docker, você pode executar:
```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-username=tiger \
  --docker-password=pass113 \
  --docker-email=tiger@acme.com \
  --docker-server=my-registry.example:5000
```

Esse comando cria um secret do tipo `kubernetes.io/dockerconfigjson`, cujo
conteúdo é semelhante ao exemplo abaixo:

```json
{
    "apiVersion": "v1",
    "data": {
        ".dockerconfigjson": "eyJhdXRocyI6eyJteS1yZWdpc3RyeTo1MDAwIjp7InVzZXJuYW1lIjoidGlnZXIiLCJwYXNzd29yZCI6InBhc3MxMTMiLCJlbWFpbCI6InRpZ2VyQGFjbWUuY29tIiwiYXV0aCI6ImRHbG5aWEk2Y0dGemN6RXhNdz09In19fQ=="
    },
    "kind": "Secret",
    "metadata": {
        "creationTimestamp": "2021-07-01T07:30:59Z",
        "name": "secret-tiger-docker",
        "namespace": "default",
        "resourceVersion": "566718",
        "uid": "e15c1d7b-9071-4100-8681-f3a7a2ce89ca"
    },
    "type": "kubernetes.io/dockerconfigjson"
}
```

Se você extrair o conteúdo da chave `.dockerconfigjson`, presente no campo
`data`, e decodificá-lo do formato base64, você irá obter o objeto JSON abaixo,
que é uma configuração válida do Docker criada automaticamente:

```json
{
  "auths":{
    "my-registry:5000":{
      "username":"tiger",
      "password":"pass113",
      "email":"tiger@acme.com",
      "auth":"dGlnZXI6cGFzczExMw=="
    }
  }
}
```

### Secret de autenticação básica

O tipo `kubernetes.io/basic-auth` é fornecido para armazenar credenciais
necessárias para autenticação básica. Ao utilizar este tipo de Secret, o campo
`data` do Secret deve conter as duas chaves abaixo:
- `username`: o usuário utilizado para autenticação;
- `password`: a senha ou token para autenticação.

Ambos os valores para estas duas chaves são textos codificados em formato base64.
Você pode fornecer os valores como texto simples utilizando o campo `stringData`
na criação do Secret.

O arquivo YAML abaixo é um exemplo de configuração para um Secret de autenticação
básica:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
stringData:
  username: admin
  password: t0p-Secret
```

O tipo de autenticação básica é fornecido unicamente por conveniência. Você pode
criar um Secret do tipo `Opaque` utilizado para autenticação básica. No entanto,
utilizar o tipo embutido de Secret auxilia a unificação dos formatos das suas
credenciais. O tipo embutido também fornece verificação de presença das chaves
requeridas pelo servidor da API.

### Secret de autenticação SSH

O tipo embutido `kubernetes.io/ssh-auth` é fornecido para armazenamento de dados
utilizados em autenticação SSH. Ao utilizar este tipo de Secret, você deve
especificar um par de chave-valor `ssh-privatekey` no campo `data` ou no campo
`stringData` com a credencial SSH a ser utilizada.

O YAML abaixo é um exemplo de configuração para um Secret de autenticação SSH:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # os dados estão abreviados neste exemplo
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```

O Secret de autenticação SSH é fornecido apenas para a conveniência do usuário.
Você pode criar um Secret do tipo `Opaque` para credentials utilizadas para
autenticação SSH. No entanto, a utilização do tipo embutido auxilia na
unificação dos formatos das suas credenciais e o servidor da API fornece
verificação dos campos requeridos em uma configuração de Secret.

{{< caution >}}
Chaves privadas SSH não estabelecem, por si só, uma comunicação confiável
entre um cliente SSH e um servidor. Uma forma secundária de estabelecer
confiança é necessária para mitigar ataques "machine-in-the-middle", como
por exemplo um arquivo `known_hosts` adicionado a um ConfigMap.
{{< /caution >}}

### Secrets TLS

O Kubernetes fornece o tipo embutido de Secret `kubernetes.io/tls` para
armazenamento de um certificado e sua chave associada que são tipicamente
utilizados para TLS. Estes dados são utilizados primariamente para a
finalização TLS do recurso Ingress, mas podem ser utilizados com outros
recursos ou diretamente por uma carga de trabalho. Ao utilizar este tipo de
Secret, as chaves `tls.key` e `tls.crt` devem ser informadas no campo `data`
(ou `stringData`) da configuração do Secret, embora o servidor da API não
valide o conteúdo de cada uma destas chaves.

O YAML a seguir tem um exemplo de configuração para um Secret TLS:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # os dados estão abreviados neste exemplo
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```

O tipo TLS é fornecido para a conveniência do usuário. Você pode criar um
Secret do tipo `Opaque` para credenciais utilizadas para o servidor e/ou
cliente TLS. No entanto, a utilização do tipo embutido auxilia a manter a
consistência dos formatos de Secret no seu projeto; o servidor da API
valida se os campos requeridos estão presentes na configuração do Secret.

Ao criar um Secret TLS utilizando a ferramenta de linha de comando `kubectl`,
você pode utilizar o subcomando `tls` conforme demonstrado no exemplo abaixo:
```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file  \
  --key=path/to/key/file
```

O par de chaves pública/privada deve ser criado separadamente. O certificado
de chave pública a ser utilizado no argumento `--cert` deve ser codificado em
formato .PEM (formato DER codificado em texto base64) e deve corresponder à
chave privada fornecida no argumento `--key`.
A chave privada deve estar no formato de chave privada PEM não-encriptado. Em
ambos os casos, as linhas inicial e final do formato PEM (por exemplo,
`--------BEGIN CERTIFICATE-----` e `-------END CERTIFICATE----` para um
certificado) *não* são incluídas.

### Secret de token de autoinicialização {#bootstrap-token-secrets}

Um Secret de token de autoinicialização pode ser criado especificando o tipo de
um Secret explicitamente com o valor `bootstrap.kubernetes.io/token`. Este tipo
de Secret é projetado para tokens utilizados durante o processo de inicialização
de nós. Este tipo de Secret armazena tokens utilizados para assinar ConfigMaps
conhecidos.

Um Secret de token de autoinicialização é normalmente criado no namespace
`kube-system` e nomeado na forma `bootstrap-token-<id-do-token>`, onde
`<id-do-token>` é um texto com 6 caracteres contendo a identificação do token.

No formato de manifesto do Kubernetes, um Secret de token de autoinicialização
se assemelha ao exemplo abaixo:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```

Um Secret do tipo token de autoinicialização possui as seguintes chaves no campo
`data`:
- `token-id`: Uma string com 6 caracteres aleatórios como identificador do
  token. Requerido.
- `token-secret`: Uma string de 16 caracteres aleatórios como o conteúdo do
  token. Requerido.
- `description`: Uma string contendo uma descrição do propósito para o qual este
  token é utilizado. Opcional.
- `expiration`: Um horário absoluto UTC no formato RFC3339 especificando quando
  o token deve expirar. Opcional.
- `usage-bootstrap-<usage>`: Um conjunto de flags booleanas indicando outros
  usos para este token de autoinicialização.
- `auth-extra-groups`: Uma lista separada por vírgulas de nomes de grupos que
  serão autenticados adicionalmente, além do grupo `system:bootstrappers`.

O YAML acima pode parecer confuso, já que os valores estão todos codificados em
formato base64. Você pode criar o mesmo Secret utilizando este YAML:
```yaml
apiVersion: v1
kind: Secret
metadata:
  # Observe como o Secret é nomeado
  name: bootstrap-token-5emitj
  # Um Secret de token de inicialização geralmente fica armazenado no namespace
  # kube-system
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # Esta identificação de token é utilizada no nome
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # Este token pode ser utilizado para autenticação.
  usage-bootstrap-authentication: "true"
  # e pode ser utilizado para assinaturas
  usage-bootstrap-signing: "true"
```

## Secrets imutáveis {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

A funcionalidade do Kubernetes _Secrets e ConfigMaps imutáveis_ fornece uma
opção para marcar Secrets e ConfigMaps individuais como imutáveis. Em clusters
que fazem uso extensivo de Secrets (pelo menos dezenas de milhares de montagens
únicas de Secrets em Pods), prevenir alterações aos dados dos Secrets traz as
seguintes vantagens:
- protege você de alterações acidentais ou indesejadas que poderiam provocar
disrupções na execução de aplicações;
- melhora a performance do seu cluster através da redução significativa de carga
no kube-apiserver, devido ao fechamento de _watches_ de Secrets marcados como
imutáveis.

Esta funcionalidade é controlada pelo
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ImmutableEphemeralVolumes`, que está habilitado por padrão desde a versão
v1.19. Você pode criar um Secret imutável adicionando o campo `immutable` com
o valor `true`. Por exemplo:
```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```

{{< note >}}
Uma vez que um Secret ou ConfigMap seja marcado como imutável, _não_ é mais
possível reverter esta mudança, nem alterar os conteúdos do campo `data`. Você
pode somente apagar e recriar o Secret. Pods existentes mantém um ponto de
montagem referenciando o Secret removido - é recomendado recriar tais Pods.
{{< /note >}}

### Usando `imagePullSecrets` {#using-imagepullsecrets}

O campo `imagePullSecrets` é uma lista de referências para Secrets no mesmo
namespace. Você pode utilizar a lista `imagePullSecrets` para enviar Secrets
que contém uma senha para acesso a um registro de contêineres do Docker (ou
outros registros de contêineres) ao kubelet. O kubelet utiliza essa informação
para baixar uma imagem privada no lugar do seu Pod.
Veja a [API PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
para maiores detalhes sobre o campo `imagePullSecrets`.

#### Especificando `imagePullSecrets` manualmente

Você pode ler sobre como especificar `imagePullSecrets` em um Pod na
[documentação de imagens de contêiner](/pt-br/docs/concepts/containers/images/#especificando-imagepullsecrets-em-um-pod).

### Configurando `imagePullSecrets` para serem vinculados automaticamente

Você pode criar manualmente `imagePullSecrets` e referenciá-los em uma
ServiceAccount. Quaisquer Pods criados com esta ServiceAccount, especificada
explicitamente ou por padrão, têm o campo `imagePullSecrets` populado com os
mesmos valores existentes na service account.
Veja [adicionando `imagePullSecrets` a uma service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
para uma explicação detalhada do processo.

## Detalhes

### Restrições

Referências a Secrets em volumes são validadas para garantir que o objeto
especificado realmente existe e é um objeto do tipo Secret. Portanto, um Secret
precisa ser criado antes de quaisquer Pods que dependam deste.

Objetos Secret residem em um {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Secrets podem ser referenciados somente por Pods no mesmo namespace.

Secrets individuais são limitados ao tamanho de 1MiB. Esta limitação ter por
objetivo desencorajar a criação de Secrets muito grandes que poderiam exaurir
a memória do servidor da API e do kubelet. No entanto, a criação de muitos
Secrets pequenos também pode exaurir a memória. Limites mais completos de uso
de memória em função de Secrets é uma funcionalidade prevista para o futuro.

O kubelet suporta apenas o uso de Secrets em Pods onde os Secrets são obtidos
do servidor da API. Isso inclui quaisquer Pods criados usando o comando
`kubectl`, ou indiretamente através de um controlador de replicação, mas não
inclui Pods criados como resultado das flags `--manifest-url` e `--config` do
kubelet, ou a sua API REST (estas são formas incomuns de criar um Pod).
A `spec` de um {{< glossary_tooltip text="Pod estático" term_id="static-pod" >}}
não pode se referir a um Secret ou a qualquer outro objeto da API.

Secrets precisam ser criados antes de serem consumidos em Pods como variáveis de
ambiente, exceto quando são marcados como opcionais. Referências a Secrets que
não existem provocam falhas na inicialização do Pod.

Referências (campo `secretKeyRef`) a chaves que não existem em um Secret nomeado
provocam falhas na inicialização do Pod.

Secrets utilizados para popular variáveis de ambiente através do campo `envFrom`
que contém chaves inválidas para utilização como nome de uma variável de ambiente
terão tais chaves ignoradas. O Pod inicializará normalmente. Porém, um evento
será gerado com a razão `InvalidVariableNames` e a mensagem gerada conterá a lista
de chaves inválidas que foram ignoradas. O exemplo abaixo demonstra um Pod que se
refere ao Secret default/mysecret, contendo duas chaves inválidas: `1badkey` e
`2alsobad`.

```shell
kubectl get events
```

O resultado é semelhante a:

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

### Interações do ciclo de vida entre Secrets e Pods

Quando um Pod é criado através de chamadas à API do Kubernetes, não há validação
da existência de um Secret referenciado. Uma vez que um Pod seja agendado, o
kubelet tentará buscar o valor do Secret. Se o Secret não puder ser encontrado
porque não existe ou porque houve uma falha de comunicação temporária entre o
kubelet e o servidor da API, o kubelet fará novas tentativas periodicamente.
O kubelet irá gerar um evento sobre o Pod, explicando a razão pela qual o Pod
ainda não foi inicializado. Uma vez que o Secret tenha sido encontrado, o
kubelet irá criar e montar um volume contendo este Secret. Nenhum dos contêineres
do Pod irá iniciar até que todos os volumes estejam montados.

## Casos de uso

### Caso de uso: Como variáveis de ambiente em um contêiner

Crie um manifesto de Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```

Crie o Secret no seu cluster:

```shell
kubectl apply -f mysecret.yaml
```

Utilize `envFrom` para definir todos os dados do Secret como variáveis de
ambiente do contêiner. Cada chave do Secret se torna o nome de uma variável de
ambiente no Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

### Caso de uso: Pod com chaves SSH

Crie um Secret contendo chaves SSH:

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

O resultado é semelhante a:

```
secret "ssh-key-secret" created
```

Você também pode criar um manifesto `kustomization.yaml` com um campo
`secretGenerator` contendo chaves SSH.

{{< caution >}}
Analise cuidadosamente antes de enviar suas próprias chaves SSH: outros usuários
do cluster podem ter acesso a este Secret. Utilize uma service account que você
deseje que seja acessível a todos os usuários com os quais você compartilha o
cluster do Kubernetes em questão. Desse modo, você pode revogar esta service
account caso os usuários sejam comprometidos.
{{< /caution >}}

Agora você pode criar um Pod que referencia o Secret com a chave SSH e consome-o
em um volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Ao rodar o comando do contêiner, as partes da chave estarão disponíveis em:

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

O contêiner então pode utilizar os dados do secret para estabelecer uma conexão
SSH.

### Caso de uso: Pods com credenciais de ambientes de produção ou testes

Este exemplo ilustra um Pod que consome um Secret contendo credenciais de um
ambiente de produção e outro Pod que consome um Secret contendo credenciais de
um ambiente de testes.

Você pode criar um manifesto `kustomization.yaml` com um `secretGenerator` ou
rodar `kubectl create secret`.

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

O resultado é semelhante a:

```
secret "prod-db-secret" created
```

Você pode também criar um Secret com credenciais para o ambiente de testes.

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

O resultado é semelhante a:

```
secret "test-db-secret" created
```

{{< note >}}
Caracteres especiais como `$`, `\`, `*`, `+` e `!` serão interpretados pelo seu
[shell](https://pt.wikipedia.org/wiki/Shell_(computa%C3%A7%C3%A3o)) e precisam de
sequências de escape. Na maioria dos shells, a forma mais fácil de gerar sequências
de escape para suas senhas é escrevê-las entre aspas simples (`'`). Por exemplo,
se a sua senha for `S!B\*d$zDsb=`, você deve executar o comando da seguinte
forma:

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

Não é necessário gerar sequências de escape para caracteres especiais em arquivos
(utilizados com a opção `--from-file`).
{{< /note >}}

Agora, crie os Pods:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

Adicione os Pods a um manifesto `kustomization.yaml`:

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

Crie todos estes objetos no servidor da API rodando o comando:

```shell
kubectl apply -k .
```

Ambos os contêineres terão os seguintes arquivos presentes nos seus sistemas de
arquivos, com valores para cada um dos ambientes dos contêineres:

```
/etc/secret-volume/username
/etc/secret-volume/password
```

Observe como as `spec`s para cada um dos Pods diverge somente em um campo. Isso
facilita a criação de Pods com capacidades diferentes a partir de um template
mais genérico.

Você pode simplificar ainda mais a definição básica do Pod através da utilização
de duas service accounts diferentes:

1. `prod-user` com o Secret `prod-db-secret`
1. `test-user` com o Secret `test-db-secret`

A especificação do Pod é reduzida para:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### Caso de uso: _dotfiles_ em um volume de Secret

Você pode fazer com que seus dados fiquem "ocultos" definindo uma chave que se
inicia com um ponto (`.`). Este tipo de chave representa um _dotfile_, ou
arquivo "oculto". Por exemplo, quando o Secret abaixo é montado em um volume,
`secret-volume`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: k8s.gcr.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Este volume irá conter um único arquivo, chamado `.secret-file`, e o contêiner
`dotfile-test-container` terá este arquivo presente no caminho
`/etc/secret-volume/.secret-file`.

{{< note >}}
Arquivos com nomes iniciados por um caractere de ponto são ocultos do resultado
do comando `ls -l`. Você precisa utilizar `ls -la` para vê-los ao listar o
conteúdo de um diretório.
{{< /note >}}

### Caso de uso: Secret visível somente em um dos contêineres de um pod {#use-case-secret-visible-to-one-container-in-a-pod}

Suponha que um programa necessita manipular requisições HTTP, executar regras
de negócio complexas e então assinar mensagens com HMAC. Devido à natureza
complexa da aplicação, pode haver um _exploit_ despercebido que lê arquivos
remotos no servidor e que poderia expor a chave privada para um invasor.

Esta aplicação poderia ser dividida em dois processos, separados em dois
contêineres distintos: um contêiner de _front-end_, que manipula as interações
com o usuário e a lógica de negócio, mas não consegue ver a chave privada; e
um contêiner assinador, que vê a chave privada e responde a requisições simples
de assinatura do _front-end_ (por exemplo, através de rede local).

Com essa abordagem particionada, um invasor agora precisa forçar o servidor de
aplicação a rodar comandos arbitrários, o que é mais difícil de ser feito do que
apenas ler um arquivo presente no disco.

<!-- TODO: explain how to do this while still using automation. -->

## Melhores práticas

### Clientes que utilizam a API de Secrets

Ao instalar aplicações que interajam com a API de Secrets, você deve limitar o
acesso utilizando [políticas de autorização](/docs/reference/access-authn-authz/authorization/)
como [RBAC](/docs/reference/access-authn-authz/rbac/).

Secrets frequentemente contém valores com um espectro de importância, muitos dos
quais podem causar escalações dentro do Kubernetes (por exemplo, tokens de service
account) e de sistemas externos. Mesmo que um aplicativo individual possa
avaliar o poder do Secret com o qual espera interagir, outras aplicações dentro
do mesmo namespace podem tornar estas suposições inválidas.

Por estas razões, as requisições `watch` (observar) e `list` (listar) de
Secrets dentro de um namespace são permissões extremamente poderosas e devem
ser evitadas, pois a listagem de Secrets permite a clientes inspecionar os
valores de todos os Secrets presentes naquele namespace. A habilidade de listar
e observar todos os Secrets em um cluster deve ser reservada somente para os
componentes mais privilegiados, que fazem parte do nível de aplicações de sistema.

Aplicações que necessitam acessar a API de Secret devem realizar uma requisição
`get` nos Secrets que precisam. Isto permite que administradores restrinjam o
acesso a todos os Secrets, enquanto
[utilizam uma lista de autorização a instâncias individuais](/docs/reference/access-authn-authz/rbac/#referring-to-resources)
que a aplicação precise.

Para melhor desempenho em uma requisição `get` repetitiva, clientes podem criar
objetos que referenciam o Secret e então utilizar a requisição `watch` neste
novo objeto, requisitando o Secret novamente quando a referência mudar.
Além disso, uma [API de "observação em lotes"](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)
para permitir a clientes observar recursos individuais também foi proposta e
provavelmente estará disponível em versões futuras do Kubernetes.

## Propriedades de segurança

### Proteções

Como Secrets podem ser criados de forma independente de Pods que os utilizam,
há menos risco de um Secret ser exposto durante o fluxo de trabalho de criação,
visualização, e edição de Pods. O sistema pode também tomar precauções adicionais
com Secrets, como por exemplo evitar que sejam escritos em disco quando possível.

Um Secret só é enviado para um nó se um Pod naquele nó requerê-lo. O kubelet
armazena o Secret num sistema de arquivos `tmpfs`, de forma a evitar que o Secret
seja escrito em armazenamento persistente. Uma vez que o Pod que depende do
Secret é removido, o kubelet apaga sua cópia local do Secret também.

Secrets de vários Pods diferentes podem existir no mesmo nó. No entanto, somente
os Secrets que um Pod requerer estão potencialmente visíveis em seus contêineres.
Portanto, um Pod não tem acesso aos Secrets de outro Pod.

Um Pod pode conter vários contêineres. Porém, cada contêiner em um Pod precisa
requerer o volume de Secret nos seus `volumeMounts` para que este fique visível
dentro do contêiner. Esta característica pode ser utilizada para construir
[partições de segurança ao nível do Pod](#use-case-secret-visible-to-one-container-in-a-pod).

Na maioria das distribuições do Kubernetes, a comunicação entre usuários e o
servidor da API e entre servidor da API e os kubelets é protegida por SSL/TLS.
Secrets são protegidos quando transmitidos através destes canais.

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Você pode habilitar [encriptação em disco](/docs/tasks/administer-cluster/encrypt-data/)
em dados de Secret para evitar que estes sejam armazenados em texto plano no
{{< glossary_tooltip term_id="etcd" >}}.

### Riscos

- No servidor da API, os dados de Secret são armazenados no
  {{< glossary_tooltip term_id="etcd" >}}; portanto:
  - Administradores devem habilitar encriptação em disco para dados do cluster
    (requer Kubernetes v1.13 ou posterior).
  - Administradores devem limitar o acesso ao etcd somente para usuários
    administradores.
  - Administradores podem desejar apagar definitivamente ou destruir discos
    previamente utilizados pelo etcd que não estiverem mais em uso.
  - Ao executar o etcd em um cluster, administradores devem garantir o uso de
    SSL/TLS para conexões ponto-a-ponto do etcd.
- Se você configurar um Secret utilizando um arquivo de manifesto (JSON ou
  YAML) que contém os dados do Secret codificados como base64, compartilhar
  este arquivo ou salvá-lo num sistema de controle de versão de código-fonte
  compromete este Secret. Codificação base64 _não_ é um método de encriptação
  e deve ser considerada idêntica a texto plano.
- Aplicações ainda precisam proteger o valor do Secret após lê-lo de um volume,
  como por exemplo não escrever seu valor em logs ou enviá-lo para um sistema
  não-confiável.
- Um usuário que consegue criar um Pod que utiliza um Secret também consegue
  ler o valor daquele Secret. Mesmo que o servidor da API possua políticas para
  impedir que aquele usuário leia o valor do Secret, o usuário poderia criar um
  Pod que expõe o Secret.

## {{% heading "whatsnext" %}}

- Aprenda a [gerenciar Secrets utilizando `kubectl`](/pt-br/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Aprenda a [gerenciar Secrets utilizando arquivos de configuração](/pt-br/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Aprenda a [gerenciar Secrets utilizando kustomize](/pt-br/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Leia a [documentação de referência da API](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) de `Secrets`
