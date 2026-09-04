---
title: Escalonamento automático de nós
linkTitle: Escalonamento automático de nós
description: >-
  Provisione e consolide automaticamente os nós do seu cluster para se adaptar à demanda e otimizar custos.
content_type: concept
weight: 15
---

Para executar cargas de trabalho (workloads) no seu cluster, você precisa de
{{< glossary_tooltip text="Nós" term_id="node" >}}. Os nós do seu cluster podem ter _escalonamento automático_ (autoscaling) —
[_provisionados_](#provisioning) dinamicamente ou [_consolidados_](#consolidation) para fornecer a
capacidade necessária enquanto otimizam os custos. O escalonamento automático é realizado por [_autoscalers_](#autoscalers) de nós.

## Provisionamento de nós {#provisioning}

Se houver Pods em um cluster que não possam ser agendados nos Nós existentes, novos Nós podem ser
adicionados automaticamente ao cluster&mdash;_provisionados_&mdash;para acomodá-los. Isso é
especialmente útil se o número de Pods muda ao longo do tempo, por exemplo, como resultado da
[combinação de carga de trabalho horizontal com escalonamento automático de nós](#horizontal-workload-autoscaling).

Os autoscalers provisionam os Nós criando e excluindo os recursos do provedor de nuvem que os sustentam. Mais
comumente, os recursos que sustentam os Nós são máquinas virtuais.

O objetivo principal do provisionamento é tornar todos os Pods agendáveis. Esse objetivo nem sempre é atingível
devido a várias limitações, incluindo o alcance dos limites de provisionamento configurados, a
configuração de provisionamento não ser compatível com um conjunto específico de pods ou a falta de
capacidade do provedor de nuvem. Durante o provisionamento, os autoscalers de nós frequentemente tentam atingir objetivos adicionais (por exemplo,
minimizar o custo dos Nós provisionados ou equilibrar o número de Nós entre
domínios de falha).

Há duas entradas principais para um autoscaler de nós ao determinar quais Nós
provisionar&mdash;[restrições de agendamento de Pods](#provisioning-pod-constraints)
e [restrições de Nós impostas pela configuração do autoscaler](#provisioning-node-constraints).

A configuração do autoscaler também pode incluir outros gatilhos de provisionamento de Nós (por exemplo, o número
de Nós caindo abaixo de um limite mínimo configurado).

{{< note >}}
O provisionamento era anteriormente conhecido como _scale-up_ no Cluster Autoscaler.
{{< /note >}}

### Restrições de agendamento de Pods {#provisioning-pod-constraints}

Os Pods podem expressar [restrições de agendamento](/pt-br/docs/concepts/scheduling-eviction/assign-pod-node/) para
impor limitações sobre o tipo de Nós em que podem ser agendados. Os autoscalers de nós levam essas
restrições em consideração para garantir que os Pods pendentes possam ser agendados nos Nós provisionados.

O tipo mais comum de restrições de agendamento são as solicitações de recursos (resource requests) especificadas pelos
contêineres do Pod. Os autoscalers garantirão que os Nós provisionados tenham recursos suficientes para satisfazer
as solicitações. No entanto, eles não levam diretamente em consideração o uso real de recursos dos Pods
depois de começarem a ser executados. Para escalonar automaticamente os Nós com base no uso real de recursos
da carga de trabalho, você pode combinar o [escalonamento automático de carga de trabalho horizontal](#horizontal-workload-autoscaling) com o
escalonamento automático de nós.

Outras restrições comuns de agendamento de Pods incluem
[afinidade de nó](/pt-br/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity),
[afinidade entre Pods](/pt-br/docs/concepts/scheduling-eviction/assign-pod-node/)
ou um requisito por um determinado [volume de armazenamento](/pt-br/docs/concepts/storage/volumes/).

### Restrições de nós impostas pela configuração do autoscaler {#provisioning-node-constraints}

As especificidades dos Nós provisionados (por exemplo, a quantidade de recursos, a presença de um
determinado label) dependem da configuração do autoscaler. Os autoscalers podem escolhê-las a partir de um conjunto
pré-definido de configurações de Nós, ou usar [provisionamento automático](#autoprovisioning).

### Provisionamento automático {#autoprovisioning}

O provisionamento automático de nós é um modo de provisionamento no qual o usuário não precisa configurar totalmente as
especificidades dos Nós que podem ser provisionados. Em vez disso, o autoscaler escolhe dinamicamente a
configuração do Nó com base nos Pods pendentes aos quais está reagindo, bem como nas restrições pré-configuradas (por
exemplo, a quantidade mínima de recursos ou a necessidade de um determinado label).

## Consolidação de nós {#consolidation}

A principal consideração ao executar um cluster é garantir que todos os pods agendáveis estejam em execução,
mantendo o custo do cluster o mais baixo possível. Para conseguir isso, as solicitações de recursos
dos Pods devem utilizar o máximo possível dos recursos dos Nós. Sob essa perspectiva, a
utilização geral dos Nós em um cluster pode ser usada como um indicador (proxy) de quão econômico o cluster é.

{{< note >}}
Definir corretamente as solicitações de recursos dos seus Pods é tão importante para a
efetividade de custo geral de um cluster quanto otimizar a utilização dos Nós.
Combinar o escalonamento automático de nós com o [escalonamento automático de carga de trabalho vertical](#vertical-workload-autoscaling) pode
ajudá-lo a conseguir isso.
{{< /note >}}

Os Nós do seu cluster podem ser automaticamente _consolidados_ para melhorar a utilização geral dos Nós
e, por sua vez, a efetividade de custo do cluster. A consolidação acontece através da
remoção de um conjunto de Nós subutilizados do cluster. Opcionalmente, um conjunto diferente de Nós pode
ser [provisionado](#provisioning) para substituí-los.

A consolidação, assim como o provisionamento, considera apenas as solicitações de recursos dos Pods e não o uso real de recursos
ao tomar decisões.

Para fins de consolidação, um Nó é considerado _vazio_ se tiver apenas Pods de DaemonSet e
Pods estáticos em execução nele. Remover Nós vazios durante a consolidação é mais simples do que os não vazios,
e os autoscalers geralmente têm otimizações projetadas especificamente para consolidar Nós vazios.

Remover Nós não vazios durante a consolidação é disruptivo&mdash;os Pods em execução neles são
terminados e possivelmente precisam ser recriados (por exemplo, por um Deployment). No entanto, todos esses
Pods recriados devem poder ser agendados nos Nós existentes do cluster ou nos Nós de
substituição provisionados como parte da consolidação. __Nenhum Pod deveria normalmente ficar pendente como resultado
da consolidação.__

{{< note >}}
Os autoscalers preveem como um Pod recriado provavelmente será agendado depois que um Nó for provisionado ou
consolidado, mas eles não controlam o agendamento real. Por causa disso, alguns Pods podem
ficar pendentes como resultado da consolidação — se, por exemplo, um Pod completamente novo aparecer enquanto
a consolidação está sendo executada.
{{< /note >}}

A configuração do autoscaler também pode permitir o acionamento da consolidação por outras condições (por exemplo,
o tempo decorrido desde a criação de um Nó), para otimizar diferentes propriedades (por exemplo,
o tempo de vida máximo dos Nós em um cluster).

Os detalhes de como a consolidação é executada dependem da configuração de um determinado autoscaler.

{{< note >}}
A consolidação era anteriormente conhecida como _scale-down_ no Cluster Autoscaler.
{{< /note >}}

## Autoscalers {#autoscalers}

As funcionalidades descritas nas seções anteriores são fornecidas pelos _autoscalers_ de nós. Além
da API do Kubernetes, os autoscalers também precisam interagir com as APIs do provedor de nuvem para provisionar e
consolidar Nós. Isso significa que eles precisam ser explicitamente integrados a cada provedor de nuvem
suportado. O desempenho e o conjunto de recursos de um determinado autoscaler podem diferir entre as integrações
com provedores de nuvem.

{{< mermaid >}}
graph TD
    na[Autoscaler de nós]
    k8s[Kubernetes]
    cp[Provedor de nuvem]

    k8s --> |obter Pods/Nós|na
    na --> |drenar nós|k8s
    na --> |criar/remover recursos subjacentes aos nós|cp
    cp --> |obter recursos subjacentes aos nós|na

    classDef white_on_blue fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef blue_on_white fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class na blue_on_white;
    class k8s,cp white_on_blue;
{{</ mermaid >}}

### Implementações de autoscalers

O [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
e o [Karpenter](https://github.com/kubernetes-sigs/karpenter) são os dois autoscalers de nós atualmente
patrocinados pelo [SIG Autoscaling](https://github.com/kubernetes/community/tree/main/sig-autoscaling).

Da perspectiva de um usuário de cluster, ambos os autoscalers devem fornecer uma experiência semelhante de escalonamento
automático de nós. Ambos provisionarão novos Nós para Pods não agendáveis, e ambos consolidarão os
Nós que não estiverem mais sendo utilizados de forma otimizada.

Autoscalers diferentes também podem fornecer recursos fora do escopo do escalonamento automático de nós descrito nesta
página, e esses recursos adicionais podem diferir entre eles.

Consulte as seções abaixo e a documentação vinculada dos autoscalers individuais para decidir
qual autoscaler se adapta melhor ao seu caso de uso.

#### Cluster Autoscaler

O Cluster Autoscaler adiciona ou remove Nós de _grupos de nós_ (Node groups) pré-configurados. Os grupos de nós geralmente correspondem
a algum tipo de grupo de recursos do provedor de nuvem (mais comumente um grupo de máquinas virtuais). Uma única
instância do Cluster Autoscaler pode gerenciar simultaneamente múltiplos grupos de nós. Durante o provisionamento,
o Cluster Autoscaler adicionará Nós ao grupo que melhor se adequa às solicitações dos Pods pendentes. Ao
consolidar, o Cluster Autoscaler sempre seleciona Nós específicos para remover, em vez de apenas
redimensionar o grupo de recursos subjacente do provedor de nuvem.

Contexto adicional:

* [Visão geral da documentação](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [Integrações com provedores de nuvem](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [FAQ do Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [Contato](https://github.com/kubernetes/community/tree/main/sig-autoscaling#contact)

#### Karpenter

O Karpenter provisiona automaticamente Nós com base nas configurações de [NodePool](https://karpenter.sh/docs/concepts/nodepools/)
fornecidas pelo operador do cluster. O Karpenter cuida de todos os aspectos do ciclo de vida dos nós,
não apenas do escalonamento automático. Isso inclui atualizar automaticamente os Nós quando eles atingem um determinado
tempo de vida, e atualizar automaticamente os Nós quando novas imagens de worker Node são lançadas. Ele funciona diretamente com
recursos individuais do provedor de nuvem (mais comumente máquinas virtuais individuais) e não depende de
grupos de recursos do provedor de nuvem.

Contexto adicional:

* [Documentação](https://karpenter.sh/)
* [Integrações com provedores de nuvem](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [FAQ do Karpenter](https://karpenter.sh/docs/faq/)
* [Contato](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)

#### Comparação de implementações

Principais diferenças entre o Cluster Autoscaler e o Karpenter:

* O Cluster Autoscaler fornece recursos relacionados apenas ao escalonamento automático de nós. O Karpenter tem um escopo
  mais amplo e também fornece recursos destinados a gerenciar o ciclo de vida dos Nós por completo (por exemplo,
  utilizando a disrupção para recriar automaticamente os Nós quando atingem um determinado tempo de vida, ou
  atualizá-los automaticamente para novas versões).
* O Cluster Autoscaler não suporta provisionamento automático; os grupos de nós a partir dos quais ele pode provisionar
  precisam ser pré-configurados. O Karpenter suporta provisionamento automático, de modo que o usuário só precisa configurar um
  conjunto de restrições para os Nós provisionados, em vez de configurar totalmente grupos homogêneos.
* O Cluster Autoscaler fornece integrações com provedores de nuvem diretamente, o que significa que elas fazem
  parte do projeto Kubernetes. No caso do Karpenter, o projeto Kubernetes publica o Karpenter como uma biblioteca
  com a qual os provedores de nuvem podem se integrar para construir um autoscaler de nós.
* O Cluster Autoscaler fornece integrações com numerosos provedores de nuvem, incluindo provedores menores e menos
  populares. Há menos provedores de nuvem que se integram ao Karpenter, incluindo a
  [AWS](https://github.com/aws/karpenter-provider-aws) e o
  [Azure](https://github.com/Azure/karpenter-provider-azure).

## Combine o escalonamento automático de cargas de trabalho e de nós

### Escalonamento automático horizontal de cargas de trabalho {#horizontal-workload-autoscaling}

O escalonamento automático de nós geralmente funciona em resposta aos Pods&mdash;ele provisiona novos Nós para acomodar
Pods não agendáveis e, em seguida, consolida os Nós quando eles não são mais necessários.

O [escalonamento automático horizontal de cargas de trabalho](/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)
escala automaticamente o número de réplicas da carga de trabalho para manter uma utilização média de recursos
desejada entre as réplicas. Em outras palavras, ele cria automaticamente novos Pods em resposta à
carga da aplicação e, em seguida, remove os Pods quando a carga diminui.

Você pode usar o escalonamento automático de nós junto com o escalonamento automático horizontal de cargas de trabalho para escalonar automaticamente os Nós do
seu cluster com base na utilização média real de recursos dos seus Pods.

Se a carga da aplicação aumentar, a utilização média de seus Pods também deve aumentar,
levando o escalonamento automático da carga de trabalho a criar novos Pods. O escalonamento automático de nós deve, então, provisionar novos Nós
para acomodar os novos Pods.

Quando a carga da aplicação diminui, o escalonamento automático da carga de trabalho deve remover os Pods desnecessários. O escalonamento
automático de nós deve, por sua vez, consolidar os Nós que não são mais necessários.

Se configurado corretamente, esse padrão garante que sua aplicação sempre tenha a capacidade de Nós necessária para
lidar com picos de carga, se necessário, mas você não precisa pagar pela capacidade quando ela não é necessária.

### Escalonamento automático vertical de cargas de trabalho {#vertical-workload-autoscaling}

Ao usar o escalonamento automático de nós, é importante definir corretamente as solicitações de recursos dos Pods. Se as solicitações
de um determinado Pod forem muito baixas, provisionar um novo Nó para ele pode não ajudar o Pod a realmente executar.
Se as solicitações de um determinado Pod forem muito altas, isso pode impedir incorretamente a consolidação de seu Nó.

O [escalonamento automático vertical de cargas de trabalho](/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)
ajusta automaticamente as solicitações de recursos dos seus Pods com base no seu uso histórico de recursos.

Você pode usar o escalonamento automático de nós junto com o escalonamento automático vertical de cargas de trabalho para ajustar
as solicitações de recursos dos seus Pods, preservando as capacidades de escalonamento automático de nós no seu cluster.

{{< caution >}}
Ao usar o escalonamento automático de nós, não é recomendado configurar o escalonamento automático vertical de cargas de trabalho para
Pods de DaemonSet. Os autoscalers precisam prever como serão os Pods de DaemonSet em um novo Nó
para prever os recursos disponíveis do Nó. O escalonamento automático vertical de cargas de trabalho pode tornar essas
previsões não confiáveis, levando a decisões de escalonamento incorretas.
{{</ caution >}}

## Componentes relacionados

Esta seção descreve componentes que fornecem funcionalidades relacionadas ao escalonamento automático de nós.

### Descheduler

O [descheduler](https://github.com/kubernetes-sigs/descheduler) é um componente que fornece funcionalidade de
consolidação de nós com base em políticas personalizadas, além de outros recursos relacionados à
otimização de Nós e Pods (por exemplo, excluir Pods que reiniciam com frequência).

### Autoscalers de cargas de trabalho baseados no tamanho do cluster

O [Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)
e o [Cluster Proportional Vertical
Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler) fornecem
escalonamento automático horizontal e vertical de cargas de trabalho com base no número de Nós no cluster. Você pode
ler mais em
[escalonamento automático baseado no tamanho do cluster](/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size).

## {{% heading "whatsnext" %}}

- Leia sobre [escalonamento automático no nível da carga de trabalho](/docs/concepts/workloads/autoscaling/)
