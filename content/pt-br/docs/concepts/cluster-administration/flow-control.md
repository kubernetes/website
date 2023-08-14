---
title: Prioridade e imparcialidade da API
content_type: concept
min-kubernetes-server-version: v1.18
---

<!-- overview -->

{{< feature-state state="beta"  for_k8s_version="v1.20" >}}

Controlar o comportamento do servidor da API Kubernetes em uma situação de sobrecarga
é uma tarefa chave para administradores de cluster. O {{< glossary_tooltip
term_id="kube-apiserver" text="kube-apiserver" >}} tem alguns controles disponíveis
(ou seja, as _flags_ `--max-requests-inflight` e `--max-mutating-requests-inflight`)
para limitar a quantidade de trabalho pendente que será aceito,
evitando que uma grande quantidade de solicitações de entrada sobrecarreguem, e
potencialmente travando o servidor da API, mas essas _flags_ não são suficientes para garantir
que as solicitações mais importantes cheguem em um período de alto tráfego.

O recurso de prioridade e imparcialidade da API (do inglês _API Priority and Fairness_, APF) é uma alternativa que melhora
as limitações mencionadas acima. A APF classifica
e isola os pedidos de uma forma mais refinada. Também introduz
uma quantidade limitada de filas, para que nenhuma solicitação seja rejeitada nos casos
de sobrecargas muito breves. As solicitações são despachadas das filas usando uma
técnica de filas justa para que, por exemplo, um
{{< glossary_tooltip text="controller" term_id="controller" >}} não precise
negar as outras requisições (mesmo no mesmo nível de prioridade).

Esse recurso foi projetado para funcionar bem com controladores padrão, que
usam informantes e reagem a falhas de solicitações da API com exponencial
back-off, e outros clientes que também funcionam desta forma.

{{< caution >}}
Solicitações classificadas como "de longa duração" — principalmente _watches_ — não são
sujeitas ao filtro da prioridade e imparcialidade da API. Isso também é verdade para
a _flag_ `--max-requests-inflight` sem o recurso da APF ativado.
{{< /caution >}}

<!-- body -->

## Ativando/Desativando a prioridade e imparcialidade da API

O recurso de prioridade e imparcialidade da API é controlado por um feature gate
e está habilitado por padrão. Veja [Portões de Recurso](/docs/reference/command-line-tools-reference/feature-gates/)
para uma explicação geral dos portões de recursos e como habilitar e
desativá-los. O nome da porta de recurso para APF é
"APIPriorityAndFairness". Este recurso também envolve um {{<
glossary_tooltip term_id="api-group" text="API Group" >}} com: (a) um
Versão `v1alpha1`, desabilitada por padrão, e (b) `v1beta1` e
Versões `v1beta2`, habilitadas por padrão. Você pode desativar o feature gate
e versões beta do grupo de APIs adicionando a seguinte
_flag_ para sua invocação `kube-apiserver`:

```shell
kube-apiserver \
--feature-gates=APIPriorityAndFairness=false \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta1=false,flowcontrol.apiserver.k8s.io/v1beta2=false \
 # …and other flags as usual
```

Como alternativa, você pode habilitar a versão v1alpha1 do grupo de APIs
com `--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true`.

A _flag_ `--enable-priority-and-fairness=false` desabilitará o
recurso de prioridade e imparcialidade da API, mesmo que outras _flags_ o tenha ativado.

## Conceitos

Existem vários recursos distintos envolvidos na APF.
As solicitações recebidas são classificadas por atributos da solicitação usando
_FlowSchemas_ e atribuídos a níveis de prioridade. Os níveis de prioridade adicionam um grau de
isolamento mantendo limites de simultaneidade separados, para que as solicitações atribuídas
a diferentes níveis de prioridade não travem outros. Dentro de um nível de prioridade,
um algoritmo de _fair queuing_ impede que solicitações de diferentes _flows_ fiquem sem energia
entre si, e permite que os pedidos sejam enfileirados para evitar que um alto tráfego
cause falhas nas solicitações quando a carga média é aceitavelmente baixa.

### Níveis de prioridade

Sem o APF ativado, a simultaneidade geral no servidor de API é limitada pelo
`kube-apiserver` as _flags_ `--max-requests-inflight` e
`--max-mutating-requests-inflight`. Com o APF ativado, os limites de simultaneidade
definidos por esses sinalizadores são somados e, em seguida, a soma é dividida entre um
conjunto configurável de _níveis de prioridade_. Cada solicitação recebida é atribuída a um
nível de prioridade único, e cada nível de prioridade só despachará tantos
solicitações simultâneas conforme sua configuração permite.

A configuração padrão, por exemplo, inclui níveis de prioridade separados para
solicitações de eleição de líder, solicitações de controladores integrados e solicitações de
_Pods_. Isso significa que um _pod_ mal-comportado que inunda o servidor da API com
solicitações não podem impedir a eleição do líder ou ações dos controladores integrados
de ter sucesso.

### Enfileiramento

Mesmo dentro de um nível de prioridade pode haver um grande número de fontes distintas de
tráfego. Em uma situação de sobrecarga, é importante evitar um fluxo de
pedidos de outros serviços (em particular, no caso relativamente comum de um
único cliente buggy inundando o kube-apiserver com solicitações, esse cliente buggy
idealmente não teria muito impacto em outros clientes). Isto é
tratadas pelo uso de um algoritmo de _fair queuing_ para processar solicitações que são atribuídas
ao mesmo nível de prioridade. Cada solicitação é atribuída a um _flow_, identificado pelo
nome do FlowSchema correspondente mais um _flow distincter_ — que
é o usuário solicitante, o namespace do recurso de destino ou nada — e o
sistema tenta dar peso aproximadamente igual a solicitações em diferentes
fluxos do mesmo nível de prioridade.
Para habilitar o tratamento distinto de instâncias distintas, os controladores que
muitas instâncias devem ser autenticadas com nomes de usuário distintos

Depois de classificar uma solicitação em um fluxo, a APF
pode então atribuir a solicitação a uma fila. Esta atribuição usa
uma técnica conhecida como {{< glossary_tooltip term_id="shuffle-sharding"
text="shuffle sharding" >}}, que faz uso relativamente eficiente de
filas para isolar fluxos de baixa intensidade de fluxos de alta intensidade.

Os detalhes do algoritmo de enfileiramento são ajustáveis ​​para cada nível de prioridade e
permitem que os administradores troquem o uso de memória, justiça (a propriedade que
fluxos independentes irão progredir quando o tráfego total exceder a capacidade),
tolerância para tráfego e a latência adicionada induzida pelo enfileiramento.

### Solicitações de isenção

Alguns pedidos são considerados suficientemente importantes para que não estejam sujeitos a
qualquer uma das limitações impostas por este recurso. Estas isenções impedem uma
configuração de controle de fluxo mal configurada de desabilitar totalmente um servidor da API.

## Recursos

A API de controle de fluxo envolve dois tipos de recursos.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1beta2-flowcontrol-apiserver-k8s-io)
define as classes de isolamento disponíveis, a parte da concorrência disponível
que cada um pode tratar e permite o ajuste fino do comportamento das filas.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1beta2-flowcontrol-apiserver-k8s-io)
são usados ​​para classificar solicitações de entrada individuais, correspondendo cada uma a um
único PriorityLevelConfiguration. Há também uma versão `v1alpha1`
do mesmo grupo de APIs e tem os mesmos tipos com a mesma sintaxe e
semântica.

### PriorityLevelConfiguration

Um PriorityLevelConfiguration representa uma única classe de isolamento. Cada
PriorityLevelConfiguration tem um limite independente no número de solicitações de pendências
e limitações no número de solicitações enfileiradas.

Os limites de simultaneidade para PriorityLevelConfigurations não são especificados no número absoluto
de solicitações, mas sim em "compartilhamentos de simultaneidade". A simultaneidade limite total
para o servidor da API é distribuído entre os PriorityLevelConfigurations existentes
em proporção com esses compartilhamentos. Isso permite um
administrador de cluster aumentar ou diminuir a quantidade total de tráfego para um
servidor reiniciando `kube-apiserver` com um valor diferente para
`--max-requests-inflight` (ou `--max-mutating-requests-inflight`), e todos os
PriorityLevelConfigurations verá sua simultaneidade máxima permitida aumentar (ou
abaixar) pela mesma proporção.

{{< caution >}}
Com o recurso prioridade e imparcialidade ativado, o limite total de simultaneidade para
o servidor é definido como a soma de `--max-requests-inflight` e
`--max-mutating-requests-inflight`. Já não há distinção
entre solicitações mutantes e não mutantes; se você quiser tratá-las
separadamente para um determinado recurso, faça FlowSchemas separados que correspondam ao
verbos mutantes e não mutantes, respectivamente.
{{< /caution >}}

Quando o volume de solicitações de entrada atribuídas a um único
PriorityLevelConfiguration é maior do que o permitido por seu nível de simultaneidade, o
O campo `type` de sua especificação determina o que acontecerá com solicitações extras.
Um tipo de 'Reject' significa que o excesso de tráfego será imediatamente rejeitado com
um erro HTTP 429 (Too Many Requests). Um tipo de `Queue` significa que as solicitações
acima do limite será enfileirado, com as técnicas de
_shuffle sharding_ e _fair queuing_ usadas
para equilibrar o progresso entre os fluxos de solicitação.

A configuração de enfileiramento permite ajustar o algoritmo de _fair queuing_ para um
nível de prioridade. Os detalhes do algoritmo podem ser lidos no
[proposta de melhoria](#whats-next), mas resumindo:

- Aumentar as 'filas' reduz a taxa de colisões entre diferentes fluxos,
  o custo do aumento do uso de memória. Um valor de 1 aqui efetivamente desabilita a
  lógica de _fair queuing_, mas ainda permite que as solicitações sejam enfileiradas.

- Aumentar o `queueLengthLimit` permite que tráfegos maiores sejam
  sustentados sem deixar de lado nenhum pedido, ao custo de aumento
  latência e uso de memória.

- Alterar `handSize` permite ajustar a probabilidade de colisões entre
  fluxos diferentes e a simultaneidade geral disponível para um único fluxo em um
  situação de sobrecarga.

  {{< note >}}
  Um 'handSize' maior torna menos provável que dois fluxos individuais colidam
  (e, portanto, um bloqueie a solicitação do outro), mas é mais provável que
  um pequeno número de fluxos pode dominar o apiserver. Um `handSize` maior também
  aumenta potencialmente a quantidade de latência que um único fluxo de alto tráfego
  pode causar. O número máximo de solicitações enfileiradas possíveis de um
  fluxo único é `handSize * queueLengthLimit`.
  {{< /note >}}

A seguir está uma tabela mostrando uma coleção interessante de configurações do
_shuffle sharding_, mostrando para cada uma a probabilidade de que um
determinado rato (fluxo de baixa intensidade) é esmagado pelos elefantes (fluxo de alta intensidade) para
uma coleção ilustrativa de números de elefantes. Veja
https://play.golang.org/p/Gi0PLgVHiUg , que calcula esta tabela.

{{< table caption = "Example Shuffle Sharding Configurations" >}}
HandSize | Filas | 1 elefante | 4 elefantes | 16 elefantes
|----------|-----------|------------|----------------|--------------------|
| 12 | 32 | 4.428838398950118e-09 | 0.11431348830099144 | 0.9935089607656024 |
| 10 | 32 | 1.550093439632541e-08 | 0.0626479840223545 | 0.9753101519027554 |
| 10 | 64 | 6.601827268370426e-12 | 0.00045571320990370776 | 0.49999929150089345 |
| 9 | 64 | 3.6310049976037345e-11 | 0.00045501212304112273 | 0.4282314876454858 |
| 8 | 64 | 2.25929199850899e-10 | 0.0004886697053040446 | 0.35935114681123076 |
| 8 | 128 | 6.994461389026097e-13 | 3.4055790161620863e-06 | 0.02746173137155063 |
| 7 | 128 | 1.0579122850901972e-11 | 6.960839379258192e-06 | 0.02406157386340147 |
| 7 | 256 | 7.597695465552631e-14 | 6.728547142019406e-08 | 0.0006709661542533682 |
| 6 | 256 | 2.7134626662687968e-12 | 2.9516464018476436e-07 | 0.0008895654642000348 |
| 6 | 512 | 4.116062922897309e-14 | 4.982983350480894e-09 | 2.26025764343413e-05 |
| 6 | 1024 | 6.337324016514285e-16 | 8.09060164312957e-11 | 4.517408062903668e-07 |
{{< /table >}}

### FlowSchema

Um FlowSchema corresponde a algumas solicitações de entrada e as atribui a um
nível de prioridade. Cada solicitação de entrada é testada em relação a cada
FlowSchema, por sua vez, começando com aqueles com valores numericamente mais baixos ---
que consideramos ser o logicamente mais alto --- `matchingPrecedence` e
trabalhando adiante. A primeira correspondência ganha.

{{< caution >}}
Somente o primeiro FlowSchema correspondente para uma determinada solicitação é importante. Se vários
FlowSchemas correspondem a uma única solicitação de entrada, ela será atribuída com base na
com o maior em `matchingPrecedence`. Se vários FlowSchemas com igual
`matchingPrecedence` corresponde ao mesmo pedido, aquele com menor
`name` lexicográfico vencerá, mas é melhor não confiar nisso e, em vez disso,
certifique-se de que dois FlowSchemas não tenham o mesmo `matchingPrecedence`.
{{< /caution >}}

Um FlowSchema corresponde a uma determinada solicitação se pelo menos uma de suas `regras`
são correspondidas. Uma regra corresponde se pelo menos um de seus `assuntos` _e_ pelo menos
uma de suas `resourceRules` ou `nonResourceRules` (dependendo se a
solicitação de entrada é para um recurso ou URL de não-recurso) corresponde à solicitação.

Para o campo `name` em assuntos, e os campos `verbs`, `apiGroups`, `resources`,
`namespaces` e `nonResourceURLs` de regras de recursos e não recursos,
o _wildcard_ `*` pode ser especificado para corresponder a todos os valores do campo fornecido,
efetivamente removendo-o de consideração.

O `distinguisherMethod.type` de um FlowSchema determina como as solicitações correspondentes a esse
esquema será separado em fluxos. Pode ser
ou `ByUser`, caso em que um usuário solicitante não poderá ser bloqueado por outros,
ou `ByNamespace`, caso em que solicitações de recursos
em um namespace não será capaz de privar os pedidos de recursos em outros
namespaces de capacidade, ou pode estar em branco (ou `distinguisherMethod` pode ser
omitido inteiramente), caso em que todas as solicitações correspondidas por este FlowSchema serão
considerados parte de um único fluxo. A escolha correta para um determinado FlowSchema
depende do recurso e do seu ambiente específico.

## Padrões

Cada kube-apiserver mantém dois tipos de objetos de configuração APF:
obrigatória e sugerida.

### Objetos de configuração obrigatórios

Os quatro objetos de configuração obrigatórios refletem no
comportamento do _guardrail_ embutido. Este é o comportamento que os servidores tinham antes
desses objetos existirem e, quando esses objetos existem, suas especificações refletem
esse comportamento. Os quatro objetos obrigatórios são os seguintes.

- O nível de prioridade obrigatório `exempt` é usado para solicitações que são
  não sujeito a controle de fluxo: eles sempre serão despachados
  imediatamente. O FlowSchema obrigatório `exempt` classifica todos
  solicitações do grupo `system:masters` para este nível de prioridade.
  Você pode definir outros FlowSchemas que direcionam outras solicitações
  a este nível de prioridade, se apropriado.

- O nível de prioridade obrigatório `catch-all` é usado em combinação com
  o FlowSchema `catch-all` obrigatório para garantir que todas as solicitações
  recebam algum tipo de classificação. Normalmente você não deve confiar
  nesta configuração catch-all, e deve criar seu próprio FlowSchema catch-all
  e PriorityLevelConfiguration (ou use o
  nível de prioridade `global-default` que é instalado por padrão) como
  apropriado. Como não se espera que seja usado normalmente, o
  o nível de prioridade obrigatório `catch-all` tem uma simultaneidade muito pequena
  compartilha e não enfileira solicitações.

### Objetos de configuração sugeridos

Os FlowSchemas e PriorityLevelConfigurations sugeridos constituem uma
configuração padrão razoável. Você pode modificá-los e/ou criar
objetos de configuração adicionais, se desejar. Se o seu cluster tiver a
probabilidade de experimentar carga pesada, então você deve considerar qual
configuração funcionará melhor.

A configuração sugerida agrupa as solicitações em seis níveis de prioridade:

- O nível de prioridade `node-high` é para atualizações de integridade dos nós.

- O nível de prioridade `system` é para solicitações não relacionadas à integridade do
  grupo `system:nodes`, ou seja, Kubelets, que deve ser capaz de contatar
  o servidor de API para que as cargas de trabalho possam ser agendadas
  eles.

- O nível de prioridade `leader-election` é para solicitações de eleição de líder de
  controladores embutidos (em particular, solicitações para `endpoints`, `configmaps`,
  ou `leases` vindo do `system:kube-controller-manager` ou
  usuários `system:kube-scheduler` e contas de serviço no namespace `kube-system`).
  Estes são importantes para isolar de outro tráfego porque as falhas
  na eleição do líder fazem com que seus controladores falhem e reiniciem, o que por sua vez
  causa tráfego mais caro à medida que os novos controladores sincronizam seus informantes.

- O nível de prioridade `workload-high` é para outras solicitações de controladores built-in.

- O nível de prioridade `workload-low` é para solicitações de qualquer outra conta de serviço,
  que normalmente incluirá todas as solicitações de controladores em execução
  _Pods_.

- O nível de prioridade `global-default` trata de todos os outros tráfegos, por exemplo,
  comandos `kubectl` interativos executados por usuários não privilegiados.

Os FlowSchemas sugeridos servem para direcionar as solicitações para os
níveis de prioridade acima, e não são enumerados aqui.

### Manutenção dos Objetos de Configuração Obrigatórios e Sugeridos

Cada `kube-apiserver` mantém independentemente os requisitos obrigatórios e
objetos de configuração sugeridos, usando comportamento inicial e periódico.
Assim, em uma situação com uma mistura de servidores de diferentes versões
pode haver _thrashing_ desde que servidores diferentes tenham
opiniões sobre o conteúdo adequado desses objetos.

Para os objetos de configuração obrigatórios, a manutenção consiste em
garantir que o objeto existe e, se existir, tem a especificação adequada.
O servidor se recusa a permitir uma criação ou atualização com uma especificação que é
inconsistente com o comportamento do guarda-corpo do servidor.

A manutenção de objetos de configuração sugeridos é projetada para permitir
que suas especificações sejam substituídas. A exclusão, por outro lado, não é
respeitada: a manutenção restaurará o objeto. Se você não quer um
objeto de configuração sugerido, então você precisa mantê-lo por perto, mas defina
sua especificação para ter consequências mínimas. Manutenção de objetos
sugeridos também é projetada para suportar a migração automática quando uma nova
versão do `kube-apiserver` é lançada, embora potencialmente com
_thrashing_ enquanto há uma população mista de servidores.

A manutenção de um objeto de configuração sugerido consiste em cria-lo
--- com a especificação sugerida pelo servidor --- se o objeto não
existir. OTOH, se o objeto já existir, o comportamento de manutenção
depende se os `kube-apiservers` ou os usuários controlam o
objeto. No primeiro caso, o servidor garante que a especificação do objeto
é o que o servidor sugere; no último caso, a especificação é deixada
sozinho.

A questão de quem controla o objeto é respondida primeiro olhando
para uma anotação com a chave `apf.kubernetes.io/autoupdate-spec`. Se
existe tal anotação e seu valor é `true` então o
kube-apiservers controlam o objeto. Se houver tal anotação
e seu valor for `false`, os usuários controlarão o objeto. Se
nenhuma dessas condições é satisfeita entaão a `metadata.generation` do
objeto é consultado. Se for 1, o kube-apiservers controla
o objeto. Caso contrário, os usuários controlam o objeto. Essas regras foram
introduzido na versão 1.22 e sua consideração de
`metadata.generation` é para migrar do mais simples
comportamento anterior. Usuários que desejam controlar um objeto de configuração sugerido
deve definir sua anotação `apf.kubernetes.io/autoupdate-spec`
para 'falso'.

A manutenção de um objeto de configuração obrigatório ou sugerido também
inclui garantir que ele tenha uma anotação `apf.kubernetes.io/autoupdate-spec`
que reflete com precisão se os kube-apiservers
controlam o objeto.

A manutenção também inclui a exclusão de objetos que não são obrigatórios
nem sugeridos, mas são anotados
`apf.kubernetes.io/autoupdate-spec=true`.

## Isenção de simultaneidade da verificação de integridade

A configuração sugerida não dá nenhum tratamento especial a checagem de saúde das requisições
verifique solicitações em kube-apiservers de seus kubelets locais --- que
tendem a usar a porta segura, mas não fornecem credenciais. Com o
configuração sugerida, essas solicitações são atribuídas ao `global-default`
FlowSchema e o nível de prioridade "global-default" correspondente,
onde outro tráfego pode bloqueá-los.

Se você adicionar o seguinte FlowSchema adicional, isso isenta aquelas
solicitações de limitação de taxa.

{{< caution >}}
Fazer essa alteração também permite que qualquer parte hostil envie
solicitações de verificação de integridade que correspondam a este FlowSchema, em qualquer volume.
Se você tiver um filtro de tráfego da Web ou outro mecanismo de segurança externa semelhante
para proteger o servidor de API do seu cluster do trafego geral de internet,
você pode configurar regras para bloquear qualquer solicitação de verificação de integridade
que se originam de fora do seu cluster.
{{< /caution >}}

{{% codenew file="priority-and-fairness/health-for-strangers.yaml" %}}

## Diagnóstico

Cada resposta HTTP de um servidor da API com o recurso de prioridade e justiça
ativado tem dois cabeçalhos extras: `X-Kubernetes-PF-FlowSchema-UID` e
`X-Kubernetes-PF-PriorityLevel-UID`, observando o esquema de fluxo que corresponde à solicitação
e o nível de prioridade ao qual foi atribuído, respectivamente. Os nomes dos objetos da API
não são incluídos nesses cabeçalhos caso o usuário solicitante não
tenha permissão para visualizá-los, então ao depurar você pode usar um comando como

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

para obter um mapeamento de UIDs de nomes para FlowSchemas e
PriorityLevelConfigurations.

## Observabilidade

### Metricas

{{< note >}}
Nas versões do Kubernetes anteriores à v1.20, as _labels_ `flow_schema` e
`priority_level` foram nomeados de forma inconsistente como `flowSchema` e `priorityLevel`,
respectivamente. Se você estiver executando versões do Kubernetes v1.19 ou anteriores, você
deve consultar a documentação da sua versão.
{{< /note >}}

Quando você ativa o APF, o kube-apiserver
exporta métricas adicionais. Monitorá-los pode ajudá-lo a determinar se a sua
configuração está limitando indevidamente o tráfego importante, ou encontrar
cargas de trabalho mal comportadas que podem estar prejudicando a integridade do sistema.

- `apiserver_flowcontrol_rejected_requests_total` é um vetor de contador
  (cumulativo desde o início do servidor) de solicitações que foram rejeitadas,
  dividido pelos rótulos `flow_schema` (indicando aquele que
  correspondeu ao pedido), `priority_level` (indicando aquele para o qual
  a solicitação foi atribuída) e `reason`. A _label_ `reason` pode
  ter um dos seguintes valores:

  - `queue-full`, indicando que muitos pedidos já foram enfileirados,
  - `concurrency-limit`, indicando que o
    PriorityLevelConfiguration está configurado para rejeitar em vez de
    enfileirar solicitações em excesso ou
  - `time-out`, indicando que a solicitação ainda estava na fila
    quando seu limite de tempo de fila expirou.

- `apiserver_flowcontrol_dispatched_requests_total` é um vetor contador
  (cumulativo desde o início do servidor) de solicitações que começaram
  executando, dividido pelos rótulos `flow_schema` (indicando o
  um que corresponda à solicitação) e `priority_level` (indicando o
  aquele ao qual o pedido foi atribuído).

- `apiserver_current_inqueue_requests` é um vetor de medidor de
  limites máximos do número de solicitações enfileiradas, agrupadas por uma
  _label_ chamado `request_kind` cujo valor é `mutating` ou `readOnly`.
  Essas marcas d'água altas descrevem o maior número visto em uma
  segunda janela concluída recentemente. Estes complementam o mais antigo
  vetor medidor `apiserver_current_inflight_requests` que contém o
  marca d'água alta da última janela de número de solicitações sendo ativamente
  servido.

- `apiserver_flowcontrol_read_vs_write_request_count_samples` é um
  vetor de histograma de observações do número atual de
  solicitações, divididas pelos rótulos `phase` (que assume o
  valores `waiting` e `executing`) e `request_kind` (que assume
  os valores `mutating` e `readOnly`). As observações são feitas
  periodicamente a uma taxa elevada.

- `apiserver_flowcontrol_read_vs_write_request_count_watermarks` é um
  vetor de histograma de marcas d'água altas ou baixas do número de
  solicitações divididas pelos rótulos `phase` (que assume o
  valores `waiting` e `executing`) e `request_kind` (que assume
  os valores `mutating` e `readOnly`); o rótulo `mark` assume
  valores `high` e `low`. As marcas d'água são acumuladas ao longo de
  janelas delimitadas pelos tempos em que uma observação foi adicionada a
  `apiserver_flowcontrol_read_vs_write_request_count_samples`. Esses
  marcas d'água mostram o intervalo de valores que ocorreram entre as amostras.

- `apiserver_flowcontrol_current_inqueue_requests` é um vetor de medidor
  mantendo o número instantâneo de solicitações enfileiradas (não em execução),
  dividido pelos rótulos `priority_level` e `flow_schema`.

- `apiserver_flowcontrol_current_executing_requests` é um vetor de medidor
  segurando o número instantâneo de execução (não esperando em uma
  queue), divididas pelos rótulos `priority_level` e
  `flow_schema`.

- `apiserver_flowcontrol_request_concurrency_in_use` é um vetor de medidor
  ocupando o número instantâneo de assentos ocupados, diferenciados pelas
  _labels_ `priority_level` e `flow_schema`.

- `apiserver_flowcontrol_priority_level_request_count_samples` é um
  vetor de histograma de observações do número atual de
  solicitações divididas pelas _labels_ `phase` (que assume o
  valores `waiting` e `executing`) e `priority_level`. Cada
  histograma obtém observações feitas periodicamente, até a última
  atividade do tipo relevante. As observações são feitas em nota alta.

- `apiserver_flowcontrol_priority_level_request_count_watermarks` é um
  vetor de histograma de marcas d'água altas ou baixas do número de
  solicitações divididas pelas _labels_ `phase` (que assume o
  valores `waiting` e `executing`) e `priority_level`; a _label_
  `mark` assume valores `high` e `low`. As marcas da água são
  acumulada em janelas delimitadas pelos tempos em que uma observação
  foi adicionado a
  `apiserver_flowcontrol_priority_level_request_count_samples`. Esses
  marcas d'água mostram o intervalo de valores que ocorreram entre as amostras.

- `apiserver_flowcontrol_request_queue_length_after_enqueue` é um
  vetor de histograma de comprimentos de fila para as filas, dividido pelas
  _labels_ `priority_level` e `flow_schema`, conforme mostrado pelas
  solicitações enfileiradas. Cada solicitação enfileirada contribui com uma
  amostra para seu histograma, relatando o comprimento da fila imediatamente
  depois que o pedido foi adicionado. Observe que isso produz diferentes
  estatísticas do que uma pesquisa imparcial faria.

  {{< note >}}
  Um valor discrepante em um histograma aqui significa que é provável que um único fluxo
  (ou seja, solicitações de um usuário ou de um namespace, dependendo da
  configuração) está inundando o servidor de API e sendo limitado. Por contraste,
  se o histograma de um nível de prioridade mostrar que todas as filas para essa prioridade
  são mais longos do que os de outros níveis de prioridade, pode ser apropriado
  aumentar os compartilhamentos de simultaneidade desse PriorityLevelConfiguration.
  {{< /note >}}

- `apiserver_flowcontrol_request_concurrency_limit` é um vetor de medidor
  mantendo o limite de simultaneidade calculado (com base no limite total de simultaneidade do servidor da API
  e na simultaneidade de PriorityLevelConfigurations share), divididos pela _label_ `priority_level`.

- `apiserver_flowcontrol_request_wait_duration_seconds` é um vetor de histograma
  de quanto tempo as solicitações ficaram na fila, divididas pelas _labels_
  `flow_schema` (indicando qual corresponde à solicitação),
  `priority_level` (indicando aquele para o qual o pedido foi
  atribuído) e `execute` (indicando se a solicitação foi iniciada
  executando).

  {{< note >}}
  Como cada FlowSchema sempre atribui solicitações a um único
  PriorityLevelConfiguration, você pode adicionar os histogramas para todos os
  FlowSchemas para um nível de prioridade para obter o histograma efetivo para
  solicitações atribuídas a esse nível de prioridade.
  {{< /note >}}

- `apiserver_flowcontrol_request_execution_seconds` é um vetor de histograma
  de quanto tempo as solicitações levaram para realmente serem executadas, divididas pelas
  _labels_ `flow_schema` (indicando qual corresponde à solicitação)
  e `priority_level` (indicando aquele para o qual o pedido foi
  atribuído).

### _Debug endpoints_

Quando você ativa A APF, o `kube-apiserver`
serve os seguintes caminhos adicionais em suas portas HTTP[S].

- `/debug/api_priority_and_fairness/dump_priority_levels` - uma lista de
  todos os níveis de prioridade e o estado atual de cada um. Você pode buscar assim:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  A saída é parecido com isto:

  ```none
  PriorityLevelName, ActiveQueues, IsIdle, IsQuiescing, WaitingRequests, ExecutingRequests,
  workload-low,      0,            true,   false,       0,               0,
  global-default,    0,            true,   false,       0,               0,
  exempt,            <none>,       <none>, <none>,      <none>,          <none>,
  catch-all,         0,            true,   false,       0,               0,
  system,            0,            true,   false,       0,               0,
  leader-election,   0,            true,   false,       0,               0,
  workload-high,     0,            true,   false,       0,               0,
  ```

- `/debug/api_priority_and_fairness/dump_queues` - uma listagem de todas as
  filas e seu estado atual. Você pode buscar assim:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  A saída é parecido com isto:

  ```none
  PriorityLevelName, Index,  PendingRequests, ExecutingRequests, VirtualStart,
  workload-high,     0,      0,               0,                 0.0000,
  workload-high,     1,      0,               0,                 0.0000,
  workload-high,     2,      0,               0,                 0.0000,
  ...
  leader-election,   14,     0,               0,                 0.0000,
  leader-election,   15,     0,               0,                 0.0000,
  ```

- `/debug/api_priority_and_fairness/dump_requests` - uma lista de todos os pedidos
  que estão atualmente esperando em uma fila. Você pode buscar assim:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  A saída é parecido com isto:

  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,
  exempt,            <none>,         <none>,     <none>,              <none>,                <none>,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:26:57.179170694Z,
  ```

  Além das solicitações enfileiradas, a saída inclui uma linha fantasma
  para cada nível de prioridade isento de limitação.

  Você pode obter uma lista mais detalhada com um comando como este:

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  A saída é parecido com isto:

  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,                     UserName,              Verb,   APIPath,                                                     Namespace, Name,   APIVersion, Resource, SubResource,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:31:03.583823404Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  system,            system-nodes,   12,         1,                   system:node:127.0.0.1, 2020-07-23T15:31:03.594555947Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  ```

## {{% heading "whatsnext" %}}

Para obter informações básicas sobre detalhes de design para prioridade e justiça da API, consulte
a [proposta de aprimoramento](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
Você pode fazer sugestões e solicitações de recursos por meio do [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)
ou do [canal do slack](https://kubernetes.slack.com/messages/api-priority-and-fairness).
