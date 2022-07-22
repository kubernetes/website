---
title: Configurando um Pod Para Usar um ConfigMap
content_type: task
weight: 150
card:
  name: tasks
  weight: 50
---

<!-- overview -->
Muitas aplicações dependem da configuração que é usada durante a inicialização do aplicativo ou do agente de execução.
Na maioria das vezes, há um requisito para ajustar os valores atribuídos aos parâmetros de configuração.
`ConfigMaps` é a maneira usada no Kubernetes para injetar dados de configuração em Pods de aplicativos. O mapa de configurações permite que você desacople os artefatos de configuração do conteúdo da imagem, para manter os aplicativos de contêiner portáveis. Esta página fornece uma série de exemplos de uso, demonstrando como criar mapas de configurações e configurar Pods usando dados armazenados em mapas de configurações.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->


## Crie um mapa de configurações

Você pode usar `kubectl create configmap` ou um gerador de mapa de configuração, em um `kustomization.yaml` para criar um mapa de configuração. Perceba que o `kubectl` começou a suportar o `kustomization.yaml` desde a versão 1.14.

### Crie um mapa de configuração Usando `kubectl create configmap`

Use o comando `kubectl create configmap` para criar um mapa de configuração a partir de [diretórios](#create-configmaps-from-directories), [arquivos](#create-configmaps-from-files), ou [valores literais](#create-configmaps-from-literal-values):

```shell
kubectl create configmap <map-name> <data-source>
```

Onde \<map-name> é o nome que você quer atribuir ao mapa de configuração e \<data-source> é o diretório, arquivo, ou o valor literal de onde buscar os dados.
O nome de um objeto mapa de configuração precisa ser um [nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.
Quando você estiver criando um mapa de configuração baseado em um arquivo, a chave no \<data-source> indica o nome-base do arquivo, e o valor indica o conteúdo do arquivo.

Você pode usar [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) ou
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) para recuperar informações
sobre um mapa de configuração.

#### Crie um mapa de configuração a partir de diretórios

Você pode usar `kubectl create configmap` para criar um mapa de configuração a partir de vários arquivos no mesmo diretório. Quando você está criando um mapa de configuração baseado em um diretório, o kubectl identifica arquivos cujo nome-base é uma chave válida no diretório e empacota cada um desses arquivos no novo mapa de configuração. Quaisquer entradas de diretório, exceto que arquivos regulares são ignorados (ex. subdiretórios, links simbólicos, dispositivos, pipes, etc).

Por exemplo:

```shell
# Criando o diretório local

mkdir -p configure-pod-container/configmap/

# Baixe os arquivos de amostra no diretório `configure-pod-container/configmap/` 

wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Crie o mapa de configuração

kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

O comando acima empacota cada arquivo, neste caso, `game.properties` e `ui.properties` no diretório `configure-pod-container/configmap/` dentro do mapa de configuração de nome game-config. Você pode exibir detalhes do mapa de configuração usando o seguinte comando:

```shell
kubectl describe configmaps game-config
```

A saída é semelhante a esta:
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Os arquivos `game.properties` e `ui.properties` no diretório `configure-pod-container/configmap/` estão representados na seção `data` do mapa de configuração.

```shell
kubectl get configmaps game-config -o yaml
```
A saída é semelhante a esta:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### Crie mapa de configuração a partir de arquivos

Você pode usar `kubectl create configmap` para criar um mapa de configuração a partir de um arquivo individual, ou a partir de múltiplos arquivos.

Por exemplo,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

Produziria o seguinte mapa de configurações:

```shell
kubectl describe configmaps game-config-2
```

Onde a saída é semelhante a esta:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

Você pode passar o argumento `--from-file` múltiplas vezes para criar um mapa de configuração a partir de múltiplas fontes de dados.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

Você pode exibir detalhes do mapa de configuração `game-config-2` usando o comando a seguir:

```shell
kubectl describe configmaps game-config-2
```

A saída é semelhante a esta:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Quando o `kubectl` cria um mapa de configuração a partir de entradas que não são ASCII ou UTF-8, a ferramenta os coloca no campo `binaryData` do mapa de configuração, e não no `data`. Fontes de dados de texto e binário podem ser combinadas em um mapa de configuração.
Se você quiser ver a chave `binaryData` (e seus valores) em um mapa de configuração, você pode executar `kubectl get configmap -o jsonpath='{.binaryData}' <name>`.

Use a opção `--from-env-file` para criar um mapa de configuração a partir de um arquivo de ambiente, por exemplo:

```shell
# Os arquivos de ambiente contêm uma lista de variáveis de ambiente.
# Essas regras de sintaxe se aplicam:
#   Cada linha em um arquivo de ambiente deve estar em formato VAR=VAL.
#   Linhas começando com # (ex. comentários) são ignoradas.
#   Linhas em branco são ignoradas.
#   Não há manuseio especial de aspas (ex. eles farão parte dos valores do mapa de configuração).

# Baixe os arquivos de amostra no diretório `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# O arquivo de ambiente `game-env-file.properties` se parece como o abaixo
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# Este comentário e a linha vazia acima dela são ignorados
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

Produziria o seguinte mapa de configuração:

```shell
kubectl get configmap game-config-env-file -o yaml
```

onde a saída é semelhante a esta:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

Começando com Kubernetes v1.23, o `kubectl` suporta o argumento `--from-env-file` ser
especificado várias vezes para criar um mapa de configuração para múltiplas fontes de dados.

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

Produziria o seguinte mapa de configuração:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

Onde a saída é semelhante a esta:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

#### Defina a chave a ser usada ao criar um mapa de configuração a partir de um arquivo

Você pode definir uma chave que não seja o nome do arquivo, para usar na seção `data` do seu mapa de configuração quando usar o argumento `--from-file`:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

Onde `<my-key-name>` é a chave que você deseja usar no mapa de configuração e `<path-to-file>` é a localização do arquivo fonte de dados, que você deseja que a chave represente.

Por exemplo:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

Produziria o seguinte mapa de configuração:

```
kubectl get configmaps game-config-3 -o yaml
```

Onde a saída é semelhante a esta:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### Criando um mapa de configuração a partir de valores literais

Você pode usar `kubectl create configmap` com o argumento `--from-literal` para definir um valor literal a partir da linha de comando:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

Você pode passar vários pares de chave-valor. Cada par fornecido na linha de comando é representado como uma entrada separada na seção `data` do mapa de configuração.

```shell
kubectl get configmaps special-config -o yaml
```

A saída é semelhante a esta:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### Crie um mapa de configuração de um gerador

O `kubectl` suporta `kustomization.yaml` desde a versão 1.14.
Você também pode criar um mapa de configuração a partir de geradores, e então aplicá-lo na criação de objetos no `Apiserver`. 
Os geradores devem ser especificado em um `kustomization.yaml` dentro de um diretório.

#### Gere o mapa de configuração a partir de arquivos

Por exemplo, para gerar um mapa de configuração a partir de arquivos `configure-pod-container/configmap/game.properties`

```shell
# Criando um arquivo kustomization.yaml com o `ConfigMapGenerator`
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

Aplique o diretório de kustomization para criar o objeto mapa de configuração.

```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

Você pode verificar se o mapa de configuração foi criado, assim:

```shell
kubectl get configmap
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s


kubectl describe configmaps/game-config-4-m9dm2f92bt
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

Observe que o nome gerado para o mapa de configuração tem um sufixo anexado, que é o `hash` do conteúdo. Isso garante que um
novo mapa de configuração é gerado cada vez que o seu conteúdo é modificado.

#### Defina a chave a ser usada ao gerar um mapa de configuração a partir de um arquivo

Você pode definir uma chave que não seja o nome do arquivo para usar no gerador do mapa de configuração.
Por exemplo, para gerar um mapa de configuração a partir de arquivos `configure-pod-container/configmap/game.properties`
com a chave `game-special-key`

```shell
# Criando um arquivo kustomization.yaml com o ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

Aplicar o diretório kustomization para criar o objeto mapa de configuração.

```shell
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### Gere mapa de configuração a partir de literais

Para gerar um mapa de configuração a partir de literais `special.type=charm` e `special.how=very`,
você pode especificar o gerador do mapa de configuração em `kustomization.yaml` como

```shell
# Criando um aruivo kustomization.yaml com o `ConfigMapGenerator`
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```
Aplicar o diretório kustomization para criar o objeto mapa de configuração.

```shell
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## Definir variáveis de ambiente de contêineres usando dados mapa de configuração

### Defina uma variável de ambiente de contêiner com dados de um único mapa de configuração

1. Defina uma variável de ambiente como um par de chave-valor em um mapa de configuração:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

2. Atribua o valor `special.how` definido no mapa de configuração para a variável de ambiente `SPECIAL_LEVEL_KEY` na especificação do pod.

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   Crie o Pod:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   Agora, a saída do Pod inclui a variável de ambiente `SPECIAL_LEVEL_KEY=very`.

### Defina variáveis de ambiente de contêineres com dados de múltiplos mapas de configuração

* Como no exemplo anterior, crie primeiro o mapa de configuração.

  {{< codenew file="configmap/configmaps.yaml" >}}

  Crie o mapa de configuração:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

* Defina as variáveis de ambiente na especificação do Pod.

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  Crie o Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  Agora, a saída do Pod inclui as variáveis de ambiente `SPECIAL_LEVEL_KEY=very` e `LOG_LEVEL=INFO`.

## Configure todos os pares de chave-valor em um mapa de configuração como variáveis de ambiente de contêineres

{{< note >}}
Esta funcionalidade está disponível em Kubernetes v1.6 e posterior.
{{< /note >}}

* Criando um mapa de configuração contendo vários pares de chave-valor.

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  Crie o mapa de configuração:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

* Use `envFrom` para definir todos os dados do mapa de configuração como variáveis de ambiente do contêiner. A chave do mapa de configuração torna-se o nome da variável de ambiente no Pod.

  {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

  Crie o Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  Agora, a saída do Pod inclui as variáveis de ambiente `SPECIAL_LEVEL=very` e `SPECIAL_TYPE=charm`.


## Use variáveis de ambiente definidas no mapa de configuração em comandos do Pod

Você pode usar variáveis de ambiente definidas no mapa de configuração no `command` e `args` de um contêiner usando a sintaxe de substituição do Kubernetes `$(VAR_NAME)`.

Por exemplo, a seguinte especificação de Pod

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

criado pela execução

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

produz a seguinte saída no contêiner `test-container`:

```
very charm
```

## Adicione dados do mapa de configuração em um Volume

Conforme explicado [Criando um mapa de configuração a partir de arquivos](#create-configmaps-from-files), quando você cria um mapa de configuração usando ``--from-file``, o nome do arquivo se torna uma chave armazenada na seção `data` do mapa de configuração. O conteúdo do arquivo se torna o valor da chave.

Os exemplos nesta seção se referem a um mapa de configuração de nome' special-config, mostrado abaixo.

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

Crie o mapa de configuração:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Preencher um volume com dados armazenados em um ConfigMap

Adicione o nome do mapa de configuração debaixo da seção `volumes` das especificações do Pod.
Isso adiciona os dados do mapa de configuração ao diretório especificado como `volumeMounts.mountPath` (nesse caso, `/etc/config`).
A seção `command` lista arquivos do diretório com nomes que correspondem às chaves no mapa de configuração.

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

Crie o Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

Quando o Pod executa, o comando `ls /etc/config/` produz a saída abaixo:

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
Se houver alguns arquivos no diretório `/etc/config/`, eles serão excluídos.
{{< /caution >}}

{{< note >}}
Os dados de texto são expostos como arquivos, usando a codificação de caracteres UTF-8. Para usar outra codificação de caracteres, use `binaryData`.
{{< /note >}}

### Adicione dados mapa de configuração para um caminho específico no volume

Use o campo `path` para especificar o caminho de arquivo desejado para ítens específicos do mapa de configuração.
Nesse caso, o item `SPECIAL_LEVEL` será montado no volume `config-volume` em `/etc/config/keys`.

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Crie o Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Quando o Pod executar, o comando `cat /etc/config/keys` produz a saída abaixo:

```
very
```

{{< caution >}}
Como antes, todos os arquivos préviamente existentes no diretório `/etc/config/` serão apagados.
{{< /caution >}}

### Projete chaves para caminhos específicos e permissões de arquivos

Você pode projetar chaves para caminhos específicos e permissões específicas em uma base por-arquivo. 
O guia do usuário [Segredos](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) explica a sintaxe.

### Referências Opcionais

Uma referência de mapa de configuração pode ser marcada "opcional".  Se o mapa de configuração for inexistente, o volume montado estará vazio. Se o mapa de configuração existir, mas a chave referenciada
é inexistente, o caminho estará ausente no ponto de montagem.

### mapas de configuração montados são atualizados automaticamente

Quando um mapa de configuração montado é atualizado, o conteúdo projetado é eventualmente atualizado também.  Isso se aplica no caso em que um mapa de configuração referenciado opcionalmente, passe a existir após o Pod ser iniciado.

O Kubelet verifica se o mapa de configuração montado está atualizado em cada sincronização periódica. No entanto, ele usa seu cache local baseado em TTL para obter o valor atual do mapa de configuração. Como resultado, o atraso total, desde o momento em que o mapa de configuração foi atualizado até o momento em que novas chaves são projetadas para o pod, pode ser tão longo quanto o
período de sincronização do Kubelet (1 minuto por padrão) + TTL de cache do mapa de configuração (1 minuto por padrão) no kubelet.

{{< note >}}
Um contêiner usando um mapa de configuração como um [sub caminho](/docs/concepts/storage/volumes/#using-subpath) o volume não receberá atualizações de configuração.
{{< /note >}}



<!-- discussion -->

## Compreendendo mapa de configuração e Pods

A Api de recursos do mapa de configuração armazena dados de configuração como pares de chave-valor. Os dados podem ser consumidos em Pods, ou fornecer as configurações para componentes do sistema, como controladores. O mapa de configuração é similar a [Segredos](/docs/concepts/configuration/secret/), mas fornece um meio de trabalhar com `strings` que não contêm informações confidenciais. Usuários e componentes do sistema podem armazenar dados de configuração em mapas de configuração.

{{< note >}}
Os mapas de configuração devem fazer referência a arquivos de propriedades, não substituí-los. Pense no mapa de configuração como representando algo semelhante ao diretório `/etc` do Linux e seus conteúdos. Por exemplo, se você criar um [Volume Kubernetes](/docs/concepts/storage/volumes/) a partir de um mapa de configuração, cada item de dados no mapa de configuração é representado por um arquivo individual no volume.
{{< /note >}}

O campo `data` do mapa de configuração contem os dados de configuração. Como mostrado no exemplo abaixo, isso pode ser simples -- como propriedades individuais definidas usando `--from-literal` -- ou complexo -- como arquivos de configuração ou `blobs` JSON definidos usando `--from-file`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # exemplo de uma propriedade simples definida usando --from-literal
  example.property.1: hello
  example.property.2: world
  # exemplo de uma propriedade complexa definida usando --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

### Restrições

- Você deve criar um mapa de configuração antes de referenciá-lo em uma especificação de Pod (a menos que você marque o mapa de configuração como "optional"). Se você referenciar um mapa de configuração que não existe, O pod não vai iniciar. Da mesma forma, referências a chaves que não existem no mapa de configuração, impedirá o pod de iniciar.

- Se você usar `envFrom` para definir variáveis de ambiente do mapa de configuração, chaves que são consideradas inválidas serão ignoradas. O pod poderá começar, mas os nomes inválidos serão registrados no log de eventos (`InvalidVariableNames`). A mensagem de log lista cada chave pulada. Por exemplo:

  ```shell
  kubectl get events
  ```

  A saída é semelhante a esta:

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

- O mapa de configuração reside em um {{< glossary_tooltip term_id="namespace" >}} específico. Um mapa de configuração só pode ser referenciado por Pods residentes no mesmo namespace.

- Você não pode usar um mapa de configuração para {{< glossary_tooltip text="Pods estáticos" term_id="static-pod" >}}, porque o kubelet não oferece suporte a isso.



## {{% heading "whatsnext" %}}

* Siga um exemplo do mundo real [configurando Redis usando um ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

