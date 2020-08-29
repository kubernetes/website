---
title: Escalonador do Kubernetes
date: 2020-04-19
content_type: concept
weight: 50
---

<!-- overview -->

No Kubernetes, _escalonamento_ refere-se a garantir que os {{< glossary_tooltip text="Pods" term_id="pod" >}}
sejam correspondidos aos {{< glossary_tooltip text="Nodes" term_id="node" >}} para que o
{{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} possa executá-los.



<!-- body -->

## Visão geral do Escalonamento {#escalonamento}

Um escalonador observa Pods recém-criados que não possuem um Node atribuído. 
Para cada Pod que o escalonador descobre, ele se torna responsável por 
encontrar o melhor Node para execução do Pod. O escalonador chega a essa decisão de alocação levando em consideração os princípios de programação descritos abaixo.

Se você quiser entender por que os Pods são alocados em um Node específico 
ou se planeja implementar um escalonador personalizado, esta página ajudará você a 
aprender sobre escalonamento.

## kube-scheduler

[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
é o escalonador padrão do Kubernetes e é executado como parte do 
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
O kube-scheduler é projetado para que, se você quiser e precisar, possa
escrever seu próprio componente de escalonamento e usá-lo.

Para cada Pod recém-criado ou outros Pods não escalonados, o kube-scheduler 
seleciona um Node ideal para execução. No entanto, todos os contêineres nos Pods 
têm requisitos diferentes de recursos e cada Pod também possui requisitos diferentes. 
Portanto, os Nodes existentes precisam ser filtrados de acordo com os requisitos de 
escalonamento específicos.

Em um cluster, Nodes que atendem aos requisitos de escalonamento para um Pod
são chamados de Nodes _viáveis_. Se nenhum dos Nodes for adequado, o Pod
permanece não escalonado até que o escalonador possa alocá-lo.

O escalonador encontra Nodes viáveis para um Pod e, em seguida, executa um conjunto de
funções para pontuar os Nodes viáveis e escolhe um Node com a maior
pontuação entre os possíveis para executar o Pod. O escalonador então notifica
o servidor da API sobre essa decisão em um processo chamado _binding_.

Fatores que precisam ser levados em consideração para decisões de escalonamento incluem
requisitos individuais e coletivos de recursos,
restrições de hardware / software / política, especificações de afinidade e anti-afinidade,
localidade de dados, interferência entre cargas de trabalho e assim por diante.

### Seleção do Node no kube-scheduler {#implementação-kube-scheduler}

O kube-scheduler seleciona um Node para o Pod em uma operação que consiste em duas etapas:

1. Filtragem
1. Pontuação

A etapa de _filtragem_ localiza o conjunto de Nodes onde é possível
alocar o Pod. Por exemplo, o filtro PodFitsResources verifica se um Node 
candidato possui recursos disponíveis suficientes para atender às solicitações 
de recursos específicas de um Pod. Após esta etapa, a lista de Nodes contém 
quaisquer Nodes adequados; frequentemente, haverá mais de um. Se a lista estiver vazia, 
esse Pod (ainda) não é escalonável.

Na etapa de _pontuação_, o escalonador classifica os Nodes restantes para escolher
o mais adequado. O escalonador atribui uma pontuação a cada Node
que sobreviveu à filtragem, baseando essa pontuação nas regras de pontuação ativa.

Por fim, o kube-scheduler atribui o Pod ao Node com a classificação mais alta.
Se houver mais de um Node com pontuações iguais, o kube-scheduler seleciona
um deles aleatoriamente.

Existem duas maneiras suportadas de configurar o comportamento de filtragem e pontuação
do escalonador:

1. [Políticas de Escalonamento](/docs/reference/scheduling/policies) permitem configurar _Predicados_ para filtragem e _Prioridades_ para pontuação.

1. [Perfis de Escalonamento](/docs/reference/scheduling/profiles) permitem configurar Plugins que implementam diferentes estágios de escalonamento, incluindo: `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, e outros. Você também pode configurar o kube-scheduler para executar diferentes perfis.


## {{% heading "whatsnext" %}}

* Leia sobre [ajuste de desempenho do escalonador](/docs/concepts/scheduling/scheduler-perf-tuning/)
* Leia sobre [restrições de propagação da topologia de pod](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Leia a [documentação de referência](/docs/reference/command-line-tools-reference/kube-scheduler/) para o kube-scheduler
* Aprenda como [configurar vários escalonadores](/docs/tasks/administer-cluster/configure-multiple-schedulers/)
* Aprenda sobre [políticas de gerenciamento de topologia](/docs/tasks/administer-cluster/topology-manager/)
* Aprenda sobre [Pod Overhead](/docs/concepts/configuration/pod-overhead/)

