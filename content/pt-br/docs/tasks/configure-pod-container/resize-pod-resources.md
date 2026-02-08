---
title: Redimensionar recursos de CPU e memória atribuídos a Pods
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

Esta página explica como alterar os recursos de CPU e memória definidos no nível do Pod sem recriá-lo.

A funcionalidade de redimensionamento de Pod em vigor permite modificar alocações de recursos para um Pod em execução, evitando a interrupção da aplicação. O processo para redimensionar recursos de contêineres individuais é abordado em [Redimensionar recursos de CPU e memória atribuídos a contêineres](/docs/tasks/configure-pod-container/resize-container-resources).

Esta página destaca o redimensionamento de recursos em vigor no nível do Pod. Os recursos no nível do Pod são definidos em `spec.resources` e atuam como o limite superior dos recursos agregados consumidos por todos os contêineres no Pod. A funcionalidade de redimensionamento de recursos em vigor no nível do Pod permite alterar essas alocações agregadas de CPU e memória para um Pod em execução diretamente.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Os seguintes [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) devem estar habilitados para sua camada de gerenciamento e para todos os nós do seu cluster:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

A versão do cliente kubectl deve ser pelo menos v1.32 para usar a flag `--subresource=resize`.

## Status de redimensionamento do Pod e lógica de retentativa

O mecanismo que o `kubelet` usa para rastrear e tentar efetuar novamente alterações de recursos é compartilhado entre solicitações de redimensionamento no nível do contêiner e no nível do Pod.

Os status, motivos e prioridades de retentativa são idênticos aos definidos para redimensionamento de contêiner:

* Condições de status: O `kubelet` usa PodResizePending (com motivos como Infeasible ou Deferred) e PodResizeInProgress para comunicar o estado da solicitação.

* Prioridade de retentativa: Redimensionamentos adiados são repetidos com base em PriorityClass, depois na classe de QoS (Guaranteed sobre Burstable) e, finalmente, pela duração em que foram adiados.

* Rastreamento: Você pode usar os campos `observedGeneration` para rastrear qual especificação do Pod (metadata.generation) corresponde ao status da última solicitação de redimensionamento processada.

Para uma descrição completa dessas condições e lógica de retentativa, consulte a seção [Status de redimensionamento do Pod](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) na documentação de redimensionamento de contêiner.

## Política de redimensionamento de contêiner e redimensionamento no nível do Pod

O redimensionamento de recursos no nível do Pod não suporta nem requer sua própria política de reinicialização.

* Sem política no nível do Pod: Alterações nos recursos agregados do Pod (spec.resources) são sempre aplicadas em vigor sem acionar uma reinicialização. Isso ocorre porque os recursos no nível do Pod atuam como uma restrição geral no cgroup do Pod e não gerenciam diretamente o agente de execução da aplicação dentro dos contêineres.

* [Política de contêiner](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) ainda governa: A resizePolicy ainda deve ser configurada no nível do contêiner (spec.containers[*].resizePolicy). Esta política determina se um contêiner individual é reiniciado quando suas solicitações ou limites de recursos mudam, independentemente de essa alteração ter sido iniciada por um redimensionamento direto no nível do contêiner ou por uma atualização no envelope geral de recursos no nível do Pod.

## Limitações

Para o Kubernetes {{< skew currentVersion >}}, o redimensionamento de recursos no nível do Pod em vigor está sujeito a todas as limitações descritas para o redimensionamento de recursos no nível do contêiner, que você pode encontrar aqui: [Redimensionar recursos de CPU e memória atribuídos a contêineres: Limitações](/docs/tasks/configure-pod-container/resize-container-resources/#limitations).

Além disso, a seguinte restrição é específica para o redimensionamento de recursos no nível do Pod:
* Validação de solicitações de contêiner: Um redimensionamento só é permitido se as
  solicitações de recursos resultantes no nível do Pod (spec.resources.requests) forem maiores ou iguais
  à soma das solicitações de recursos correspondentes de todos os contêineres individuais
  dentro do Pod. Isso mantém a disponibilidade mínima garantida de recursos para
  o Pod.

* Validação de limites de contêiner: Um redimensionamento é permitido se os limites de contêineres individuais
  forem menores ou iguais aos limites de recursos no nível do Pod (spec.resources.limits).
  O limite no nível do Pod serve como um limite que nenhum contêiner individual pode exceder, mas
  a soma dos limites de contêineres pode exceder o limite no nível do Pod, permitindo
  o compartilhamento de recursos entre contêineres dentro do Pod.

## Exemplo: Redimensionando recursos no nível do Pod

Primeiro, crie um Pod projetado para redimensionamento de CPU em vigor e redimensionamento de memória que requer reinicialização.

{{% code_sample file="pods/resource/pod-level-resize.yaml" %}}

Crie o Pod:

```shell
kubectl create -f pod-level-resize.yaml
```

Este Pod inicia na classe de QoS Guaranteed, pois as solicitações no nível do Pod são iguais aos limites. Verifique seu estado inicial:

```shell
# Aguarde um momento para o Pod estar em execução
kubectl get pod pod-level-resize-demo --output=yaml
```

Observe o `spec.resources` (200m CPU, 200Mi memória). Note o
`status.containerStatuses[0].restartCount` (deve ser 0) e
`status.containerStatuses[1].restartCount` (deve ser 0).

Agora, aumente a solicitação e o limite de CPU no nível do Pod para `300m`. Você usa `kubectl patch` com o argumento de linha de comando `--subresource resize`.

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Métodos alternativos:
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
O argumento de linha de comando `--subresource resize` requer a versão v1.32.0 ou posterior do cliente `kubectl`.
Versões mais antigas reportarão um erro `invalid subresource`.
{{< /note >}}

Verifique o status do Pod novamente após aplicar o patch:

```shell
kubectl get pod pod-level-resize-demo --output=yaml
```

Você deve ver:
* `spec.resources.requests` e `spec.resources.limits` agora mostram `cpu: 300m`.
* `status.containerStatuses[0].restartCount` permanece `0`, porque a
  `resizePolicy` de CPU era `NotRequired`.
* `status.containerStatuses[1].restartCount` aumentou para `1` indicando que o
  contêiner foi reiniciado para aplicar a alteração de CPU. A reinicialização ocorreu no Contêiner 1 apesar do redimensionamento ser aplicado no nível do Pod, devido à relação intrincada entre limites no nível do Pod e políticas no nível do contêiner. Como o Contêiner 1 não especificou um limite de CPU explícito, sua configuração de recursos subjacente (por exemplo, cgroups) adotou implicitamente o limite geral de CPU do Pod como seu limite máximo efetivo de consumo. Quando o limite de CPU no nível do Pod foi alterado de 200m para 300m, essa ação consequentemente mudou o limite implícito aplicado ao Contêiner 1. Como o Contêiner 1 tinha sua resizePolicy explicitamente definida como RestartContainer para CPU, o `kubelet` foi obrigado a reiniciar o contêiner para aplicar corretamente essa alteração no mecanismo subjacente de aplicação de recursos, confirmando assim que alterar limites no nível do Pod pode acionar políticas de reinicialização de contêiner mesmo quando os limites de contêiner não são definidos diretamente.

## Limpeza

Exclua o Pod:

```shell
kubectl pod-level-resize-demo
```

## {{% heading "whatsnext" %}}


### Para desenvolvedores de aplicações

* [Atribuir recursos de memória a contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Atribuir recursos de CPU a contêineres e Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Atribuir recursos de CPU e memória no nível do Pod](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### Para administradores de cluster

* [Configurar solicitações e limites de memória padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configurar solicitações e limites de CPU padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configurar restrições mínimas e máximas de memória para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configurar restrições mínimas e máximas de CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configurar cotas de memória e CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
