---
title: Empacotamento de Recursos (Bin Packing)
content_type: concept
weight: 80
---

<!-- overview -->

{{< note >}}
Este artigo se aplica ao bin packing de recursos no contexto do agendamento de um único pod. Para o bin packing
no agendamento de grupos de pods, leia o [artigo sobre Agendamento ciente de Topologia](/docs/concepts/scheduling-eviction/topology-aware-scheduling/).
{{< /note >}}

No [plugin de agendamento](/docs/reference/scheduling/config/#scheduling-plugins) `NodeResourcesFit` do kube-scheduler, existem duas
estratégias de pontuação que suportam o bin packing de recursos: `MostAllocated` e `RequestedToCapacityRatio`.

<!-- body -->

## Habilitando o bin packing usando a estratégia MostAllocated
A estratégia `MostAllocated` pontua os nós com base na utilização dos recursos, favorecendo aqueles com maior alocação.
Para cada tipo de recurso, você pode definir um peso para modificar sua influência na pontuação do nó.

Para definir a estratégia `MostAllocated` para o plugin `NodeResourcesFit`, use uma
[configuração do agendador](/docs/reference/scheduling/config) semelhante à seguinte:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: cpu
          weight: 1
        - name: memory
          weight: 1
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        type: MostAllocated
    name: NodeResourcesFit
```

Com essa configuração, os nós são pontuados usando uma média ponderada da utilização de todos os quatro
recursos. Como `intel.com/foo` e `intel.com/bar` carregam cada um um peso de `3`, contra `1` para
CPU e memória, a utilização desses recursos estendidos tem três vezes mais influência na
pontuação final do nó. O agendador seleciona o nó com a pontuação mais alta, com o objetivo de agendar pods em
nós altamente utilizados. Isso ajuda a se preparar para a redução de escala dos nós menos utilizados.

Para saber mais sobre outros parâmetros e sua configuração padrão, consulte a documentação da API do
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

## Habilitando o bin packing usando RequestedToCapacityRatio

A estratégia `RequestedToCapacityRatio` permite que os usuários especifiquem os recursos junto com os pesos de
cada recurso para pontuar os nós com base na proporção entre solicitação (request) e capacidade. Isso
permite que os usuários façam bin packing de recursos estendidos usando parâmetros apropriados
para melhorar a utilização de recursos escassos em clusters grandes. Ela favorece nós de acordo com uma
função configurada dos recursos alocados. O comportamento do `RequestedToCapacityRatio` na
função de pontuação do `NodeResourcesFit` pode ser controlado pelo campo
[scoringStrategy](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-ScoringStrategy).
Dentro do campo `scoringStrategy`, você pode configurar dois parâmetros: `requestedToCapacityRatio` e
`resources`. O `shape` no parâmetro `requestedToCapacityRatio`
permite que o usuário ajuste a função como menos solicitado ou mais
solicitado com base nos valores de `utilization` e `score`. O parâmetro `resources`
compreende tanto o `name` do recurso a ser considerado durante a pontuação
quanto o seu `weight` correspondente, que especifica o peso de cada recurso.

Abaixo está um exemplo de configuração que define o comportamento de bin packing
para os recursos estendidos `intel.com/foo` e `intel.com/bar`
usando o campo `requestedToCapacityRatio`.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        requestedToCapacityRatio:
          shape:
          - utilization: 0
            score: 0
          - utilization: 100
            score: 10
        type: RequestedToCapacityRatio
    name: NodeResourcesFit
```

Neste exemplo, apenas os recursos estendidos `intel.com/foo` e `intel.com/bar` estão listados em
`resources`. Portanto, o plugin `NodeResourcesFit` pontua os nós com base apenas na utilização
desses dois recursos; a CPU e a memória não contribuem para a pontuação deste plugin. Como a
forma (shape) configurada atribui uma pontuação mais alta à medida que a utilização aumenta (`score: 0` com `utilization: 0`
subindo para `score: 10` com `utilization: 100`), o agendador prefere nós onde mais desses
recursos estendidos já estão em uso, agrupando (bin-packing) as solicitações deles no menor número possível de nós.

Para incluir a CPU e a memória nesta estratégia de pontuação, adicione-os à lista `resources`. Observe que todos os
recursos da lista compartilham a mesma função `shape`, de modo que fazer isso aplicará a mesma curva de
bin-packing a esses recursos também.

Referenciar o arquivo `KubeSchedulerConfiguration` com a flag `--config=/path/to/config/file`
do kube-scheduler passará a configuração ao
agendador.

Para saber mais sobre outros parâmetros e sua configuração padrão, consulte a documentação da API do
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

### Ajustando a função de pontuação

O `shape` é usado para especificar o comportamento da função `RequestedToCapacityRatio`.

```yaml
shape:
  - utilization: 0
    score: 0
  - utilization: 100
    score: 10
```

Os argumentos acima dão ao nó uma `score` de 0 se a `utilization` for de 0% e 10 para
`utilization` de 100%, habilitando assim o comportamento de bin packing. Para habilitar o comportamento de
menos solicitado (least requested), o valor da pontuação deve ser invertido da seguinte forma.

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

O parâmetro `resources` é opcional e tem como padrão:

```yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

Ele pode ser usado para adicionar recursos estendidos da seguinte forma:

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

O parâmetro `weight` é opcional e é definido como 1 se não for especificado. Além disso, o
`weight` não pode ser definido com um valor negativo.

### Pontuação de nós para alocação de capacidade

Esta seção destina-se àqueles que desejam entender os detalhes internos
desse recurso.
Abaixo está um exemplo de como a pontuação do nó é calculada para um determinado conjunto de valores.

Recursos solicitados:

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

Pesos dos recursos:

```
intel.com/foo : 5
memory: 1
cpu: 3
```

FunctionShapePoint {{0, 0}, {100, 10}}

Especificação do Nó 1:

```
Available:
  intel.com/foo: 4
  memory: 1 GB
  cpu: 8

Used:
  intel.com/foo: 1
  memory: 256MB
  cpu: 1
```

Pontuação do nó:

```
intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4))
               = (100 - 25)
               = 75                       # requested + used = 75% * available
               = rawScoringFunction(75)
               = 7                        # floor(75/10)

memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50                       # requested + used = 50% * available
               = rawScoringFunction(50)
               = 5                        # floor(50/10)

cpu            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5                     # requested + used = 37.5% * available
               = rawScoringFunction(37.5)
               = 3                        # floor(37.5/10)

NodeScore   =  ((7 * 5) + (5 * 1) + (3 * 3)) / (5 + 1 + 3)
            =  5
```

Especificação do Nó 2:

```
Available:
  intel.com/foo: 8
  memory: 1GB
  cpu: 8

Used:
  intel.com/foo: 2
  memory: 512MB
  cpu: 6
```

Pontuação do nó:

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 50)
               =  50
               =  rawScoringFunction(50)
               = 5

memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

cpu            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  ((5 * 5) + (7 * 1) + (10 * 3)) / (5 + 1 + 3)
            =  7

```

## {{% heading "whatsnext" %}}

- Leia mais sobre o [framework de agendamento](/docs/concepts/scheduling-eviction/scheduling-framework/)
- Leia mais sobre a [configuração do agendador](/docs/reference/scheduling/config/)
