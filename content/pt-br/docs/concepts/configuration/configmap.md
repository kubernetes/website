---
title: ConfigMaps
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="Um ConfigMap é" length="all" >}}

{{< caution >}}
O ConfigMap não oferece confidencialidade ou encriptação.
Se os dados que você deseja armazenar são confidenciais, utilize
{{< glossary_tooltip term_id="secret" >}} ao invés de um ConfigMap,
ou utilize ferramentas adicionais (de terceiros) para manter seus dados privados.
{{< /caution >}}


<!-- body -->
## Motivação

Utilize um ConfigMap para manter a configuração separada do código da aplicação.

Por exemplo, imagine que você esteja desenvolvendo uma aplicação que pode ser executada
no seu computador local (para desenvolvimento) e na nuvem (para manipular tráfego real).
Você escreve código para ler a variável de ambiente chamada `DATABASE_HOST`.
No seu ambiente local, você configura essa variável com o valor `localhost`. Na nuvem, você
configura essa variável para referenciar um {{< glossary_tooltip text="serviço" term_id="service" >}}
do Kubernetes que expõe o componente do banco de dados ao seu cluster.
Isto permite que você baixe uma imagem de contêiner que roda na nuvem e depure exatamente
o mesmo código localmente se necessário.

Um ConfigMap não foi planejado para conter grandes quantidades de dados. Os dados armazenados
em um ConfigMap não podem exceder 1 MiB. Se você precisa armazenar configurações que são maiores
que este limite, considere montar um volume ou utilizar um serviço separado de banco de dados
ou de arquivamento de dados.

## Objeto ConfigMap

Um ConfigMap é um [objeto](/docs/concepts/overview/working-with-objects/kubernetes-objects/)
da API que permite o armazenamento de configurações para consumo por outros objetos. Diferentemente
de outros objetos do Kubernetes que contém um campo `spec`, o ConfigMap contém os campos `data` e
`binaryData`. Estes campos aceitam pares chave-valor como valores. Ambos os campos `data` e `binaryData`
são opcionais. O campo `data` foi pensado para conter sequências de bytes UTF-8, enquanto o campo `binaryData`
foi planejado para conter dados binários em forma de strings codificadas em base64.

É obrigatório que o nome de um ConfigMap seja um
[subdomínio DNS válido](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Cada chave sob as seções `data` ou `binaryData` pode conter quaisquer caracteres alfanuméricos,
`-`, `_` e `.`. As chaves armazenadas na seção `data` não podem colidir com as chaves armazenadas
na seção `binaryData`.

A partir da versão v1.19 do Kubernetes, é possível adicionar o campo `immutable` a uma definição de ConfigMap
para criar um [ConfigMap imutável](#configmap-immutable).

## ConfigMaps e Pods

Você pode escrever uma `spec` para um Pod que se refere a um ConfigMap e configurar o(s) contêiner(es)
neste Pod baseados em dados do ConfigMap. O Pod e o ConfigMap devem estar no mesmo
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

{{< note >}}
A `spec` de um {{< glossary_tooltip text="Pod estático" term_id="static-pod" >}} não pode se referir a um
ConfigMap ou a quaisquer outros objetos da API.
{{< /note >}}

Exemplo de um ConfigMap que contém algumas chaves com valores avulsos e outras chaves com valores semelhantes
a fragmentos de arquivos de configuração:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # chaves com valores de propriedades; cada chave mapeia para um valor avulso
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # chaves semelhantes a fragmentos de arquivos
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

Existem quatro formas diferentes para consumo de um ConfigMap na configuração de um
contêiner dentro de um Pod:

1. Dentro de um comando de contêiner e seus argumentos.
1. Variáveis de ambiente para um contêiner.
1. Criando um arquivo em um volume somente leitura, para consumo pela aplicação.
1. Escrevendo código para execução dentro do Pod que utilize a API do Kubernetes para ler um ConfigMap.

Os diferentes métodos de consumo oferecem diferentes formas de modelar os dados sendo consumidos.
Para os três primeiros métodos, o {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} utiliza
os dados de um ConfigMap quando o(s) contêiner(es) do Pod são inicializados.

O quarto método envolve escrita de código para leitura do ConfigMap e dos seus dados. No entanto,
como a API do Kubernetes está sendo utilizada diretamente, a aplicação pode solicitar atualizações
sempre que o ConfigMap for alterado e reagir quando isso ocorre. Acessar a API do Kubernetes
diretamente também permite ler ConfigMaps em outros namespaces.

Exemplo de um Pod que utiliza valores do ConfigMap `game-demo` para configurar um Pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # Define as variáveis de ambiente
        - name: PLAYER_INITIAL_LIVES # Note que aqui a variável está definida em caixa alta,
                                     # diferente da chave no ConfigMap.
          valueFrom:
            configMapKeyRef:
              name: game-demo           # O ConfigMap de onde esse valor vem.
              key: player_initial_lives # A chave que deve ser buscada.
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # Volumes são definidos no escopo do Pod, e os pontos de montagem são definidos
    # nos contêineres dentro dos pods.
    - name: config
      configMap:
        # Informe o nome do ConfigMap que deseja montar.
        name: game-demo
        # Uma lista de chaves do ConfigMap para serem criadas como arquivos.
        items:
        - key: "game.properties"
          path: "game.properties"
        - key: "user-interface.properties"
          path: "user-interface.properties"
```

ConfigMaps não diferenciam entre propriedades com valores simples ou valores complexos,
que ocupam várias linhas. O importante é a forma que Pods e outros objetos consomem tais valores.

Neste exemplo, definir um volume e montar ele dentro do contêiner `demo` no caminho `/config`
cria dois arquivos: `/config/game.properties` e `/config/user-interface.properties`, embora existam
quatro chaves distintas no ConfigMap. Isso se deve ao fato de que a definição do Pod contém uma lista
`items` na seção `volumes`.
Se a lista `items` for omitida, cada chave do ConfigMap torna-se um arquivo cujo nome é a sua chave
correspondente, e quatro arquivos serão criados.

## Usando ConfigMaps

ConfigMaps podem ser montados como volumes de dados. ConfigMaps também podem ser utilizados
por outras partes do sistema sem serem diretamente expostos ao Pod. Por exemplo, ConfigMaps
podem conter dados que outras partes do sistema devem usar para configuração.

A forma mais comum de utilização de ConfigMaps é a configuração de contêineres executando em
Pods no mesmo namespace. Você também pode utilizar um ConfigMap separadamente.

Por exemplo, existem {{< glossary_tooltip text="complementos" term_id="addons" >}} ou
{{< glossary_tooltip text="operadores" term_id="operator-pattern" >}} que adaptam seus comportamentos
de acordo com dados de um ConfigMap.

### Utilizando ConfigMaps como arquivos em um Pod

Para consumir um ConfigMap em um volume em um Pod:
1. Crie um ConfigMap ou utilize um ConfigMap existente. Múltiplos Pods
   podem referenciar o mesmo ConfigMap.
1. Modifique sua definição de Pod para adicionar um volume em
   `.spec.volumes[]`. Escolha um nome qualquer para o seu volume, e
   referencie o seu objeto ConfigMap no campo
   `.spec.volumes[].configMap.name`.
1. Adicione um campo `.spec.containers[].volumeMounts[]` a cada um dos
   contêineres que precisam do ConfigMap. Especifique
   `.spec.containers[].volumeMounts[].readOnly = true` e informe no campo
   `.spec.containers[].volumeMounts[].mountPath` um caminho de um diretório
   não utilizado onde você deseja que este ConfigMap apareça.
1. Modifique sua imagem ou linha de comando de modo que o programa procure
   por arquivos no diretório especificado no passo anterior. Cada chave no
   campo `data` do ConfigMap será transformado em um nome de arquivo no
   diretório especificado por `mountPath`.

Exemplo de um Pod que monta um ConfigMap em um volume:
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
    configMap:
      name: myconfigmap
```

Cada ConfigMap que você deseja utilizar precisa ser referenciado em
`.spec.volumes`.

Se houver múltiplos contêineres no Pod, cada contêiner deve ter seu
próprio bloco `volumeMounts`, mas somente uma instância de `.spec.volumes`
é necessária por ConfigMap.

### ConfigMaps montados são atualizados automaticamente

Quando um ConfigMap que está sendo consumido em um volume é atualizado, as chaves projetadas são
eventualmente atualizadas também. O Kubelet checa se o ConfigMap montado está atualizado em cada
sincronização periódica.
No entanto, o kubelet utiliza o cache local para buscar o valor atual do ConfigMap.
O tipo de cache é configurável utilizando o campo `ConfigMapAndSecretChangeDetectionStrategy` na
[configuração do Kubelet (KubeletConfiguration)](/docs/reference/config-api/kubelet-config.v1beta1/).
Um ConfigMap pode ter sua propagação baseada em um _watch_ (comportamento padrão), que é o sistema
de propagação de mudanças incrementais em objetos do Kubernetes; baseado em TTL (_time to live_,
ou tempo de expiração); ou redirecionando todas as requisições diretamente para o servidor da API.
Como resultado, o tempo decorrido total entre o momento em que o ConfigMap foi atualizado até o momento
quando as novas chaves são projetadas nos Pods pode ser tão longo quanto o tempo de sincronização
do kubelet somado ao tempo de propagação do cache, onde o tempo de propagação do cache depende do
tipo de cache escolhido: o tempo de propagação pode ser igual ao tempo de propagação do _watch_,
TTL do cache, ou zero, de acordo com cada um dos tipos de cache.

ConfigMaps que são consumidos como variáveis de ambiente não atualizam automaticamente e requerem uma
reinicialização do pod.

## ConfigMaps imutáveis {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable">}}

A funcionalidade _Secrets e ConfigMaps imutáveis_ do Kubernetes fornece uma opção
para marcar Secrets e ConfigMaps individuais como imutáveis. Para clusters que utilizam
ConfigMaps extensivamente (ao menos centenas de milhares de mapeamentos únicos de
ConfigMaps para Pods), prevenir alterações dos seus dados traz as seguintes vantagens:

- protege de atualizações acidentais ou indesejadas que podem causar disrupção na execução
  de aplicações
- melhora o desempenho do cluster através do fechamento de _watches_ de ConfigMaps marcados
  como imutáveis, diminuindo significativamente a carga no kube-apiserver

Essa funcionalidade é controlada pelo [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ImmutableEphemeralVolumes`. É possível criar um ConfigMap imutável adicionando o campo
`immutable` e marcando seu valor com `true`.
Por exemplo:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

Após um ConfigMap ser marcado como imutável, _não_ é possível reverter a alteração, nem
alterar o conteúdo dos campos `data` ou `binaryData`. É possível apenas apagar e recriar
o ConfigMap. Como Pods existentes que consomem o ConfigMap em questão mantém um ponto de
montagem que continuará referenciando este objeto após a remoção, é recomendado recriar
estes pods.

## {{% heading "whatsnext" %}}

* Leia sobre [Secrets](/docs/concepts/configuration/secret/) (em inglês).
* Leia [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) (em inglês).
* Leia [The Twelve-Factor App](https://12factor.net/) (em inglês) para entender a motivação da separação de código
e configuração.
