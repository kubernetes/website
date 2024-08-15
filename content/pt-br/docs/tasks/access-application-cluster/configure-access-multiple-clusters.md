---
title: Configurar o acesso a múltiplos clusters
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: Configure access to clusters
---

<!-- overview -->

Esta página mostra como configurar o acesso a vários clusters usando arquivos de configuração. Depois que os clusters, os usuários e os contextos forem definidos em um ou mais arquivos de configuração, você pode alternar rapidamente entre os clusters usando o comando `kubectl config use-context`.

{{< note >}}
Um arquivo usado para configurar o acesso a um cluster às vezes é chamado de arquivo *kubeconfig*. Essa é uma forma genérica de se referir a arquivos de configuração. Isso não significa que exista um arquivo chamado `kubeconfig`.
{{< /note >}}


{{< warning >}}
Use somente arquivos kubeconfig de fontes confiáveis. O uso de um arquivo kubeconfig artificialmente criado, pode resultar em execução de código malicioso ou exposição de arquivos. Se você preciso usar um arquivo kubeconfig não-confiável, inspecione-o cuidadosamente antes, da mesma forma que faria com um script de shell.
{{< /warning>}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Para verificar se {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} está instalado,
execute `kubectl version --client`. A versão do kubectl deve ter [no máximo uma versão menor de diferença](/releases/version-skew-policy/#kubectl) da versão do servidor de API do seu cluster.

<!-- steps -->

## Defina clusters, usuários e contextos

Suponha que você tenha dois clusters, um para o trabalho de desenvolvimento, chamado `development`, e outro para o trabalho de teste, chamado `test`.
No cluster `development`, seus desenvolvedores de front-end trabalham em um namespace chamado `frontend`,
e os desenvolvedores de armazenamento trabalham em um namespace chamado `storage`. Em seu cluster `test`,
os desenvolvedores trabalham no namespace padrão ou criam namespaces auxiliares conforme
acharem adequado. O acesso ao cluster de desenvolvimento requer autenticação por certificado. O acesso
ao cluster de teste requer autenticação por nome de usuário e senha.

Crie um diretório chamado `config-exercise`. Em seu diretório
`config-exercise`, crie um arquivo chamado `config-demo` com este conteúdo:

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: test

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-test
```

Um arquivo de configuração descreve clusters, usuários e contextos. Seu arquivo `config-demo`
tem a estrutura para descrever dois clusters, dois usuários e três contextos.

Vá para o diretório `config-exercise`. Digite estes comandos para adicionar detalhes do cluster ao
seu arquivo de configuração:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

Adicione detalhes do usuário ao seu arquivo de configuração:

{{< caution >}}
O armazenamento de senhas na configuração do cliente do Kubernetes é arriscado. Uma alternativa melhor seria usar um plug-in de credenciais e salvá-las separadamente. Veja: [plugins de credenciais client-go](/pt-br/docs/reference/access-authn-authz/authentication/#plugins-de-credenciais-client-go)
{{< /caution >}}

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}
- Para excluir um usuário, você pode executar `kubectl --kubeconfig=config-demo config unset users.<name>`
- Para remover um cluster, você pode executar `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- Para remover um contexto,  você pode executar `kubectl --kubeconfig=config-demo config unset contexts.<name>`
{{< /note >}}

Adicione detalhes de contexto ao seu arquivo de configuração:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

Abra seu arquivo `config-demo` para ver os detalhes adicionados. Como alternativa para abrir o arquivo `config-demo`, você pode usar o comando `config view`

```shell
kubectl config --kubeconfig=config-demo view
```

O resultado mostra os dois clusters, dois usuários e três contextos:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # Nota de documentação (este comentário NÃO faz parte da saída do comando).
    # Armazenar senhas na configuração do cliente Kubernetes é arriscado.
    # Uma alternativa melhor seria usar um plugin de credenciais
    # e armazenar as credenciais separadamente.
    # Veja https://kubernetes.io/pt-br/docs/reference/access-authn-authz/authentication/#plugins-de-credenciais-client-go
    password: some-password
    username: exp
```

O `fake-ca-file`, o `fake-cert-file` e o `fake-key-file` acima são os espaços reservados
para a localização dos arquivos de certificado. Você precisa alterá-los para a localização real
dos arquivos de certificado em seu ambiente.

Às vezes, você pode querer usar dados codificados em Base64 incorporados aqui, em vez de arquivos de certificado separados.
Nesse caso, é necessário adicionar o sufixo `data` às chaves, por exemplo,
`certificate-authority-data`, `client-certificate-data`, `client-key-data`.

Cada contexto é uma tripla (cluster, usuário, namespace). Por exemplo, o contexto
`dev-frontend` diz: "Use as credenciais do usuário `developer`
para acessar o namespace `frontend` do cluster `development`".

Define o contexto atual:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

Agora, sempre que você use um comando `kubectl`, a ação será aplicada ao cluster,
e ao namespace listados no contexto `dev-frontend`. E o comando usará
as credenciais do usuário listado no contexto `dev-frontend`.

Para ver apenas as informações de configuração associadas ao
o contexto atual, use a opção `--minify`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

O resultado mostra as informações de configuração associadas ao contexto `dev-frontend`:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

Agora, suponha que você queira trabalhar por um tempo no cluster de teste.

Altere o contexto atual para `exp-test`:

```shell
kubectl config --kubeconfig=config-demo use-context exp-test
```

Agora, qualquer comando `kubectl` que você usar, será aplicado ao namespace padrão do cluster `test`. E o comando usará as credenciais do usuário
listado no contexto `exp-test`.

Ver a configuração associada ao novo contexto atual, `exp-test`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Por fim, suponha que você queira trabalhar por um tempo no namespace `storage` do cluster `development`.

Altere o contexto atual para `dev-storage`:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

Ver a configuração associada ao novo contexto atual, `dev-storage`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## Crie um segundo arquivo de configuração

Em seu diretório `config-exercise`, crie um arquivo chamado `config-demo-2` com este conteúdo:

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

O arquivo de configuração anterior define um novo contexto chamado `dev-ramp-up`.

## Defina a variável de ambiente KUBECONFIG

Verifique se você tem uma variável de ambiente chamada `KUBECONFIG`. Em caso afirmativo, salve o valor atual da variável de ambiente `KUBECONFIG` para que você possa restaurá-lo posteriormente.
Por exemplo:

### Linux

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

 A variável de ambiente `KUBECONFIG` é uma lista de caminhos para arquivos de configuração. A lista é
delimitada por dois pontos para Linux e Mac, e delimitada por ponto e vírgula para Windows. Se você tiver
uma variável de ambiente `KUBECONFIG`, familiarize-se com os arquivos de configuração
na lista.

Anexe temporariamente duas localizações à sua variável de ambiente `KUBECONFIG`. Por exemplo:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

Em seu diretório `config-exercise`, digite este comando:

```shell
kubectl config view
```

O resultado mostra informações mescladas de todos os arquivos listados em sua variável de ambiente `KUBECONFIG`. Em particular, observe que as informações mescladas têm o contexto `dev-ramp-up` do arquivo `config-demo-2` e os três contextos do arquivo `config-demo`:

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

Para obter mais informações sobre como os arquivos kubeconfig são mesclados, consulte
[Organizando o acesso ao cluster usando arquivos kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

## Explore o diretório $HOME/.kube

Se você já tiver um cluster e puder usar o `kubectl` para interagir com o
o cluster, então provavelmente você tem um arquivo chamado `config` no diretório `$HOME/.kube`.

Vá para `$HOME/.kube` e veja quais arquivos estão lá. Normalmente, há um arquivo chamado
`config`. Também pode haver outros arquivos de configuração nesse diretório. Em um breve momento
familiarize-se com o conteúdo desses arquivos.

## Acrescente $HOME/.kube/config à sua variável de ambiente KUBECONFIG

Se você tiver um arquivo `$HOME/.kube/config` e ele ainda não estiver listado em sua variável de ambiente
`KUBECONFIG`, acrescente-o à sua variável de ambiente `KUBECONFIG` agora.
Por exemplo:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### Windows Powershell

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

Visualize as informações de configuração mescladas de todos os arquivos que agora estão listados
em sua variável de ambiente `KUBECONFIG`. Em seu diretório config-exercise, digite:

```shell
kubectl config view
```

## Limpar

Retorne sua variável de ambiente `KUBECONFIG` ao seu valor original. Por exemplo:<br>

### Linux

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## Verificar o sujeito representado pelo kubeconfig

Nem sempre é óbvio quais atributos (nome de usuário, grupos) você obterá após a autenticação no cluster. 
Isso pode ser ainda mais desafiador se você estiver gerenciando mais de um cluster ao mesmo tempo.

Há um subcomando de `kubectl` para verificar os atributos do sujeito, como o nome de usuário, para o Kubernetes contexto selecionado: `kubectl auth whoami`.

Leia [Acesso da API às informações de autenticação de um cliente](/docs/reference/access-authn-authz/authentication/#self-subject-review)
para saber mais sobre isso em detalhes.


## {{% heading "whatsnext" %}}

* [Organizando o acesso ao cluster usando arquivos kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)

