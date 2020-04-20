---
title: Escalonador Kubernetes
date: 2020-04-19
content_template: templates/concept
weight: 50
---

{{% capture overview %}}

No Kubernetes, _escalonamento_ refere-se a garantir que os {{< glossary_tooltip text="Pods" term_id="pod" >}}
sejam correspondidos aos {{< glossary_tooltip text="Nodes" term_id="node" >}} para que o
{{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} possa executá-los.


{{% /capture %}}

{{% capture body %}}

## Visão geral do Escalonamento {#scheduling}

Um escalonadordor observa Pods recém-criados que não possuem Nó designado. 
Para cada Pod que o planejador descobre, ele se torna responsável por 
encontrar o melhor Node para execução do Pod. O escalonador chega a essa decisão de alocação levando em consideração os princípios de programação descritos abaixo.

Se você quiser entender por que os Pods são alocados em um nó específico 
ou se planeja implementar um escalonador personalizado, esta página ajudará você a 
aprender sobre escalonamento.


## kube-scheduler

[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
é o escalonador padrão do Kubernetes e é executado como parte do 
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
O kube-scheduler foi projetado para que, se você quiser e precisar, possa
escreva seu próprio componente de escalonamento e use-o.

Para cada pod recém-criado ou outros pods não escalonados, o kube-scheduler 
seleciona um Nó ideal para execução. No entanto, todos os contêineres nos pods 
têm requisitos diferentes de recursos e cada pod também possui requisitos diferentes. 
Portanto, os Nodes existentes precisam ser filtrados de acordo com os requisitos de 
escalonamento específicos.

Em um cluster, Nodes que atendem aos requisitos de escalonamento para um Pod
são chamados de Nodes _viáveis_. Se nenhum dos Nodes for adequado, o pod
permanece não escalonado até que o escalonador possa alocá-lo.

O escalonador encontra Nodes viáveis para um Pod e, em seguida, executa um conjunto de
funções para pontuar os Nodes viáveis e escolhe um Node com a maior
pontuação entre os possíveis para executar o Pod. O agendador então notifica
o servidor da API sobre essa decisão em um processo chamado _binding_.

Fatores que precisam ser levados em consideração para decisões de escalonamento incluem
requisitos individuais e coletivos de recursos,
restrições de política hardware / software /, especificações de afinidade e anti-afinidade,
localidade de dados, interferência entre cargas de trabalho e assim por diante.


### Seleção do Node no kube-scheduler {#kube-scheduler-implementation}

O kube-scheduler seleciona um Node para o pod em uma operação que consiste em duas etapas:

1. Filtragem
1. Pontuação

A etapa _filtragem_ localiza o conjunto de Nós onde é possível
agendar o Pod. Por exemplo, o filtro PodFitsResources verifica se um Node 
candidato possui recursos disponíveis suficientes para atender às solicitações 
de recursos específicas de um Pod. Após esta etapa, a lista de Nodes contém 
quaisquer nós adequados; frequentemente, haverá mais de um. Se a lista estiver vazia, 
esse Pod (ainda) não é escalonável.

Na etapa _pontuação_, o escalonador classifica os nós restantes para escolher
o posicionamento do Pod mais adequado. O escalonador atribui uma pontuação a cada Nó
que sobreviveram à filtragem, baseando essa pontuação nas regras de pontuação ativa.

Por fim, o kube-scheduler atribui o Pod ao Nó com a classificação mais alta.
Se houver mais de um Nó com pontuações iguais, o kube-scheduler seleciona
um deles aleatoriamente.

Existem duas maneiras suportadas de configurar o comportamento de filtragem e pontuação
do escalonador:

1. [Políticas de Escalonamento](/docs/reference/scheduling/policies) permitem configurar _Predicados_ para filtragem e _Prioridades_ para pontuação.

1. [Perfis de Escalonamento](/docs/reference/scheduling/profiles) permitem configurar Plugins que implementam diferentes estágios de escalonamento, incluindo: `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, e outros. Você também pode configurar o kube-scheduler para executar diferentes perfis.

{{% /capture %}}
{{% capture whatsnext %}}
* Leia sobre [scheduler performance tuning](/docs/concepts/scheduling/scheduler-perf-tuning/)
* Leia sobre [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Leia o [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) para o kube-scheduler
* Aprenda sobre [configuring multiple schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/)
* Aprenda sobre [topology management policies](/docs/tasks/administer-cluster/topology-manager/)
* Aprenda sobre [Pod Overhead](/docs/concepts/configuration/pod-overhead/)
{{% /capture %}}
