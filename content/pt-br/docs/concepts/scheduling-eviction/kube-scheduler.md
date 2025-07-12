---
title: Escalonador do Kubernetes
content_type: concept
weight: 10
---

<!-- overview -->

No Kubernetes, _escalonamento_ refere-se a garantir que os {{< glossary_tooltip text="Pods" term_id="pod" >}} 
sejam correspondidos aos {{< glossary_tooltip text="Nós" term_id="node" >}} 
para que o {{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} 
possa executá-los.

<!-- body -->

## Visão geral do Escalonamento {#escalonamento}

Um escalonador observa Pods recém-criados que não possuem um Nó atribuído. 
Para cada Pod que o escalonador descobre, ele se torna responsável por 
encontrar o melhor Nó para execução do Pod. O escalonador chega a essa decisão 
de alocação levando em consideração os princípios de escalonamento descritos abaixo.

Se você quiser entender por que os Pods são alocados em um Nó específico 
ou se planeja implementar um escalonador personalizado, esta página ajudará você a 
aprender sobre escalonamento.

## kube-scheduler

[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)
é o escalonador padrão do Kubernetes e é executado como parte da 
{{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}}.
O kube-scheduler é projetado para que, se você quiser e precisar, possa
escrever seu próprio componente de escalonamento e usá-lo.

O kube-scheduler seleciona um Nó ideal para executar Pods recém-criados ou não 
escalonados (unscheduled). Como os contêineres em Pods — e os próprios Pods — podem 
ter diferentes requisitos, o escalonador filtra os Nós que não atendem às necessidades 
específicas de escalonamento do Pod. Alternativamente, a API permite que você especifique 
um Nó para um Pod ao criá-lo, mas isso é incomum e só é feito em casos especiais.

Em um cluster, Nós que atendem aos requisitos de escalonamento para um Pod são chamados 
de Nós _viáveis_. Se nenhum dos Nós for adequado, o Pod permanece não escalonado até 
que o escalonador consiga alocá-lo.

O escalonador encontra Nós viáveis para um Pod e, em seguida, executa um conjunto de 
funções para classificar esses Nós viáveis e escolhe o Nó com a maior pontuação entre 
os possíveis para executar o Pod. O escalonador então notifica o servidor de API sobre essa 
decisão em um processo chamado _binding_.

Fatores que precisam ser levados em consideração para decisões de escalonamento incluem 
requisitos individuais e coletivos de recursos, restrições de hardware / software / política, 
especificações de afinidade e anti-afinidade, localização de dados, interferência entre cargas de trabalho 
e assim por diante.

### Seleção do Nó no kube-scheduler {#implementação-kube-scheduler}

O kube-scheduler seleciona um Nó para o Pod em uma operação que consiste em duas etapas:

1. Filtragem
1. Pontuação

A etapa de _filtragem_ localiza o conjunto de Nós onde é possível alocar o Pod. Por exemplo, 
o filtro PodFitsResources verifica se um Nó candidato possui recursos disponíveis suficientes 
para atender às solicitações de recursos específicas de um Pod. Após esta etapa, a lista de 
Nós contém quaisquer Nós adequados; frequentemente, haverá mais de um. Se a lista estiver 
vazia, esse Pod (ainda) não é escalonável.

Na etapa de _pontuação_, o escalonador classifica os Nós restantes para escolher o mais 
adequado. O escalonador atribui uma pontuação a cada Nó que passou na filtragem, baseando 
essa pontuação nas regras de pontuação ativas.

Por fim, o kube-scheduler atribui o Pod ao Nó com a classificação mais alta. Se houver mais 
de um Nó com pontuações iguais, o kube-scheduler seleciona um deles aleatoriamente.

Existem duas maneiras suportadas de configurar o comportamento de filtragem e pontuação do escalonador:

1. [Políticas de Escalonamento](/docs/reference/scheduling/policies) permitem configurar _Predicados_ 
para filtragem e _Prioridades_ para pontuação.
2. [Perfis de Escalonamento](/docs/reference/scheduling/config/#profiles) permitem configurar Plugins 
que implementam diferentes estágios de escalonamento, incluindo: `QueueSort`, `Filter`, `Score`, 
`Bind`, `Reserve`, `Permit`, e outros. Você também pode configurar o kube-scheduler para executar 
diferentes perfis.

## {{% heading "whatsnext" %}}

* Leia sobre [ajuste de desempenho do escalonador](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* Leia sobre [restrições de propagação da topologia de pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* Leia a [documentação de referência](/docs/reference/command-line-tools-reference/kube-scheduler/) para o kube-scheduler
* Leia a [referência de configuração do kube-scheduler (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* Aprenda como [configurar vários escalonadores](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
* Aprenda sobre [políticas de gerenciamento de topologia](/docs/tasks/administer-cluster/topology-manager/)
* Aprenda sobre [Sobrecarga de Pod](/pt-br/docs/concepts/scheduling-eviction/pod-overhead/)
* Saiba mais sobre o escalonamento de pods que usam volumes em:
  * [Suporte de topologia de volume](/docs/concepts/storage/storage-classes/#volume-binding-mode)
  * [Rastreamento de capacidade de armazenamento](/docs/concepts/storage/storage-capacity/)
  * [Limites de volumes específicos do nó](/docs/concepts/storage/storage-limits/)
