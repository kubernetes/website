---
title: Desligamentos de Nó
content_type: concept
weight: 10
---

<!-- overview -->

Em um cluster Kubernetes, um {{< glossary_tooltip text="nó" term_id="node" >}}
pode ser desligado de forma planejada e controlada ou inesperadamente devido a razões como
uma queda de energia ou algo externo. Um desligamento de nó pode levar a falhas na
carga de trabalho se o nó não for drenado antes do desligamento. Um desligamento de nó
pode ser **controlado** ou **não controlado**.

<!-- body -->

## Desligamento controlado de nó {#graceful-node-shutdown}

O kubelet tenta detectar o desligamento do sistema do nó e encerra os Pods em execução no nó.

O Kubelet garante que os Pods sigam o
[processo normal de encerramento de Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
durante o desligamento do nó. Durante o desligamento do nó, o kubelet não aceita novos
Pods (mesmo que esses Pods já estejam vinculados ao nó).

### Habilitando o desligamento controlado de nó

{{< tabs name="graceful_shutdown_os" >}}
{{% tab name="Linux" %}}
{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

No Linux, a funcionalidade de desligamento controlado de nó é controlada com o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`GracefulNodeShutdown` que está habilitado por padrão na versão 1.21.

{{< note >}}
A funcionalidade de desligamento controlado de nó depende do systemd, pois aproveita os
[bloqueios inibidores do systemd](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) para
atrasar o desligamento do nó por uma determinada duração.
{{</ note >}}
{{% /tab %}}

{{% tab name="Windows" %}}
{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

No Windows, a funcionalidade de desligamento controlado de nó é controlada com o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`WindowsGracefulNodeShutdown` que foi introduzido na versão 1.32 como uma funcionalidade alfa. No Kubernetes 1.34 a funcionalidade está em Beta
e está habilitada por padrão.

{{< note >}}
A funcionalidade de desligamento controlado de nó no Windows depende do kubelet sendo executado como um serviço do Windows,
ele terá então um [manipulador de controle de serviço](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function) registrado
para atrasar o evento de pré-desligamento por uma determinada duração.
{{</ note >}}

O desligamento controlado de nó no Windows não pode ser cancelado.

Se o kubelet não estiver sendo executado como um serviço do Windows, ele não será capaz de definir e monitorar
o evento [Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info),
o nó terá que passar pelo procedimento de [Desligamento Não Controlado de Nó](#non-graceful-node-shutdown) mencionado acima.
No caso em que a funcionalidade de desligamento controlado de nó no Windows está habilitada, mas o kubelet não está
sendo executado como um serviço do Windows, o kubelet continuará em execução em vez de falhar. No entanto,
ele registrará um erro indicando que precisa ser executado como um serviço do Windows.
{{% /tab %}}

{{< /tabs >}}

### Configurando o desligamento controlado de nó

Observe que, por padrão, ambas as opções de configuração descritas abaixo,
`shutdownGracePeriod` e `shutdownGracePeriodCriticalPods`, são definidas como zero,
portanto não ativando a funcionalidade de desligamento controlado de nó.
Para ativar a funcionalidade, ambas as opções devem ser configuradas adequadamente e
definidas com valores diferentes de zero.

Uma vez que o kubelet é notificado sobre um desligamento de nó, ele define uma condição `NotReady` no
Node, com o `reason` definido como `"node is shutting down"`. O kube-scheduler respeita esta condição
e não aloca nenhum Pod no nó afetado; espera-se que outros agendadores de terceiros
sigam a mesma lógica. Isso significa que novos Pods não serão alocados naquele nó
e, portanto, nenhum será iniciado.

O kubelet **também** rejeita Pods durante a fase `PodAdmission` se um
desligamento de nó em andamento for detectado, de modo que mesmo Pods com uma
{{< glossary_tooltip text="tolerância" term_id="toleration" >}} para
`node.kubernetes.io/not-ready:NoSchedule` não sejam iniciados lá.

Quando o kubelet está definindo essa condição em seu Nó via API,
o kubelet também começa a encerrar quaisquer Pods que estejam em execução localmente.

Durante um desligamento controlado, o kubelet encerra os Pods em duas fases:

1. Encerra Pods regulares em execução no nó.
1. Encerra [Pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   em execução no nó.

A funcionalidade de desligamento controlado de nó é configurada com duas
opções do [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/):

- `shutdownGracePeriod`:

  Especifica a duração total que o nó deve atrasar o desligamento. Esta é a duração
  total de tolerância para o encerramento de Pods tanto para Pods regulares quanto para
  [Pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

- `shutdownGracePeriodCriticalPods`:

  Especifica a duração utilizada para encerrar
  [Pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  durante um desligamento de nó. Este valor deve ser menor que `shutdownGracePeriod`.

{{< note >}}

Existem casos em que o encerramento do Nó foi cancelado pelo sistema (ou talvez manualmente
por um administrador). Em qualquer uma dessas situações, o Nó retornará ao estado `Ready`.
No entanto, os Pods que já iniciaram o processo de encerramento não serão restaurados pelo kubelet
e precisarão ser reagendados.

{{< /note >}}

Por exemplo, se `shutdownGracePeriod=30s` e
`shutdownGracePeriodCriticalPods=10s`, o kubelet atrasará o desligamento do nó em
30 segundos. Durante o desligamento, os primeiros 20 (30-10) segundos serão reservados
para encerrar gradualmente os Pods normais, e os últimos 10 segundos serão
reservados para encerrar [Pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

{{< note >}}
Quando os Pods foram removidos durante o desligamento controlado do nó, eles são marcados como desligados.
Executar `kubectl get pods` mostra o status dos Pods removidos como `Terminated`.
E `kubectl describe pod` indica que o Pod foi removido devido ao desligamento do nó:

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### Desligamento controlado de nó baseado em prioridade de Pod {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

Para fornecer mais flexibilidade durante o desligamento controlado de nó em relação à ordenação
de Pods durante o desligamento, o desligamento controlado de nó respeita a PriorityClass para
Pods, desde que você tenha habilitado esta funcionalidade em seu cluster. A funcionalidade
permite que administradores de cluster definam explicitamente a ordenação de Pods
durante o desligamento controlado de nó com base em
[classes de prioridade](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).

A funcionalidade de [Desligamento Controlado de Nó](#graceful-node-shutdown), conforme descrita
acima, desliga Pods em duas fases, Pods não críticos, seguidos por Pods
críticos. Se flexibilidade adicional for necessária para definir explicitamente a ordenação de
Pods durante o desligamento de uma forma mais granular, o desligamento
controlado baseado em prioridade de Pod pode ser usado.
Quando o desligamento controlado de nó respeita as prioridades de Pod, isso torna possível fazer
o desligamento controlado de nó em múltiplas fases, cada fase desligando uma
classe de prioridade específica de Pods. O kubelet pode ser configurado com as fases exatas
e o tempo de desligamento por fase.

Assumindo as seguintes
[classes de prioridade](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
personalizadas de Pod em um cluster,

| Nome da classe de prioridade do Pod | Valor da classe de prioridade do Pod |
| ------------------------------------ | ------------------------------------ |
| `custom-class-a`                     | 100000                               |
| `custom-class-b`                     | 10000                                |
| `custom-class-c`                     | 1000                                 |
| `regular/unset`                      | 0                                    |

Dentro da [configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/)
as configurações para `shutdownGracePeriodByPodPriority` poderiam ser assim:

| Valor da classe de prioridade do Pod | Período de desligamento |
| ------------------------------------- | ----------------------- |
| 100000                                | 10 segundos             |
| 10000                                 | 180 segundos            |
| 1000                                  | 120 segundos            |
| 0                                     | 60 segundos             |

A configuração YAML correspondente do kubelet seria:

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

A tabela acima implica que qualquer Pod com valor de `priority` >= 100000 terá
apenas 10 segundos para desligar, qualquer Pod com valor >= 10000 e < 100000 terá 180
segundos para desligar, qualquer Pod com valor >= 1000 e < 10000 terá 120 segundos para desligar.
Finalmente, todos os outros Pods terão 60 segundos para desligar.

Não é necessário especificar valores correspondentes a todas as classes. Por
exemplo, você poderia usar estas configurações:

| Valor da classe de prioridade do Pod | Período de desligamento |
| ------------------------------------- | ----------------------- |
| 100000                                | 300 segundos            |
| 1000                                  | 120 segundos            |
| 0                                     | 60 segundos             |

No caso acima, os Pods com `custom-class-b` irão para o mesmo grupo
que `custom-class-c` para o desligamento.

Se não houver Pods em um intervalo específico, então o kubelet não espera
por Pods naquele intervalo de prioridade. Em vez disso, o kubelet pula imediatamente para o
próximo intervalo de valor de classe de prioridade.

Se esta funcionalidade estiver habilitada e nenhuma configuração for fornecida, então nenhuma ação de
ordenação será realizada.

Usar esta funcionalidade requer habilitar o
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`GracefulNodeShutdownBasedOnPodPriority` e definir `ShutdownGracePeriodByPodPriority` na
[configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/)
para a configuração desejada contendo os valores de classe de prioridade do Pod e
seus respectivos períodos de desligamento.

{{< note >}}
A capacidade de levar em conta a prioridade do Pod durante o desligamento controlado de nó foi introduzida
como uma funcionalidade Alfa no Kubernetes v1.23. No Kubernetes {{< skew currentVersion >}}
a funcionalidade está em Beta e está habilitada por padrão.
{{< /note >}}

As métricas `graceful_shutdown_start_time_seconds` e `graceful_shutdown_end_time_seconds`
são emitidas sob o subsistema do kubelet para monitorar os desligamentos de nó.

## Tratamento de desligamento não controlado de nó {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

Uma ação de desligamento de nó pode não ser detectada pelo Gerenciador de Desligamento de Nó do kubelet,
seja porque o comando não aciona o mecanismo de bloqueios inibidores usado pelo
kubelet ou devido a um erro do usuário, ou seja, o ShutdownGracePeriod e
ShutdownGracePeriodCriticalPods não estão configurados adequadamente. Por favor, consulte a
seção acima [Desligamento Controlado de Nó](#graceful-node-shutdown) para mais detalhes.

Quando um nó é desligado mas não detectado pelo Gerenciador de Desligamento de Nó do kubelet, os Pods
que fazem parte de um {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
ficarão presos no status de encerramento no nó desligado e não podem se mover para um novo nó em execução.
Isso ocorre porque o kubelet no nó desligado não está disponível para excluir os Pods, então
o StatefulSet não pode criar um novo Pod com o mesmo nome. Se houver volumes usados pelos Pods,
os VolumeAttachments não serão excluídos do nó desligado original, então os volumes
usados por esses Pods não podem ser anexados a um novo nó em execução. Como resultado, a
aplicação em execução no StatefulSet não pode funcionar adequadamente. Se o nó
desligado original voltar, os Pods serão excluídos pelo kubelet e novos Pods serão
criados em um nó diferente em execução. Se o nó desligado original não voltar,
esses Pods ficarão presos no status de encerramento no nó desligado para sempre.

Para mitigar a situação acima, um usuário pode adicionar manualmente um taint `node.kubernetes.io/out-of-service`
com efeito `NoExecute` ou `NoSchedule` a um Nó marcando-o como fora de serviço.
Se um Nó for marcado como fora de serviço com este taint, os Pods no nó serão excluídos forçadamente
se não houver tolerâncias correspondentes nele e as operações de desanexação de volume para os Pods encerrando no
nó acontecerão imediatamente. Isso permite que os Pods no nó fora de serviço se recuperem rapidamente
em um nó diferente.

Durante um desligamento não controlado, os Pods são encerrados em duas fases:
1. Excluir forçadamente os Pods que não possuem tolerâncias `out-of-service` correspondentes.
1. Executar imediatamente a operação de desanexação de volume para tais Pods.

{{< note >}}

- Antes de adicionar um taint `node.kubernetes.io/out-of-service`, deve ser verificado
  que o nó já está em estado de desligamento ou desligado (não no meio de uma reinicialização).
- O usuário é obrigado a remover manualmente o taint out-of-service depois que os Pods forem
  movidos para um novo nó e o usuário tiver verificado que o nó desligado foi
  recuperado, já que o usuário foi quem originalmente adicionou o taint.

{{< /note >}}

### Desanexação forçada de armazenamento por tempo limite {#storage-force-detach-on-timeout}

Em qualquer situação em que a exclusão de um Pod não tenha sido bem-sucedida por 6 minutos, o kubernetes irá
desanexar forçadamente os volumes sendo desmontados se o nó não estiver íntegro naquele instante. Qualquer
carga de trabalho ainda em execução no nó que usa um volume desanexado forçadamente causará uma
violação da
[especificação CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume),
que afirma que `ControllerUnpublishVolume` "**deve** ser chamado após todas as
`NodeUnstageVolume` e `NodeUnpublishVolume` no volume serem chamadas e bem-sucedidas".
Em tais circunstâncias, os volumes no nó em questão podem encontrar corrupção de dados.

O comportamento de desanexação forçada de armazenamento é opcional; os usuários podem optar por usar a funcionalidade de "Desligamento
não controlado de nó" em vez disso.

A desanexação forçada de armazenamento por tempo limite pode ser desabilitada definindo o campo de configuração
`disable-force-detach-on-timeout` no `kube-controller-manager`. Desabilitar a funcionalidade de desanexação forçada por tempo limite significa
que um volume que está hospedado em um nó que não está íntegro por mais de 6 minutos não terá
seu [VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)
associado excluído.

Após esta configuração ter sido aplicada, Pods não íntegros ainda anexados a volumes devem ser recuperados
através do procedimento de [Desligamento Não Controlado de Nó](#non-graceful-node-shutdown) mencionado acima.

{{< note >}}

- Cuidado deve ser tomado ao usar o procedimento de [Desligamento Não Controlado de Nó](#non-graceful-node-shutdown).
- O desvio das etapas documentadas acima pode resultar em corrupção de dados.

{{< /note >}}

## {{% heading "whatsnext" %}}

Saiba mais sobre o seguinte:

- Blog: [Desligamento Não Controlado de Nó](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)
- Arquitetura do Cluster: [Nós](/docs/concepts/architecture/nodes/)
