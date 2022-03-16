---
title: Limites e reservas de ID de processo
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

O Kubernetes permite limitar o número de IDs de processo (PIDs) que um {{< glossary_tooltip term_id="Pod" text="Pod" >}} pode usar.
Você também pode reservar vários PIDs alocáveis para cada {{< glossary_tooltip term_id="node" text="node" >}} para uso pelo sistema operacional e _daemons_ (em vez de Pods).

<!-- body -->

Os IDs de processo (PIDs) são um recurso fundamental nos nós. É trivial acertar o limite de tarefas sem atingir nenhum outro limite de recursos, o que pode causar instabilidade para uma máquina host.

Os administradores de cluster exigem mecanismos para garantir que os pods em execução no cluster não podem induzir a exaustão de PID que impede daemons de host (como o {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} ou {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, e potencialmente também o tempo de execução do contêiner) de execução. Além disso, é importante garantir que os PIDs sejam limitados entre os pods para garantir que tenham impacto limitado em outras cargas de trabalho no mesmo nó.

{{< note >}}
Em certas instalações do Linux, o sistema operacional define o limite de PIDs para um padrão baixo,
como `32768`. Considere aumentar o valor de `/proc/sys/kernel/pid_max`.
{{< /note >}}

Você pode configurar um kubelet para limitar o número de PIDs que um determinado pod pode consumir. Por exemplo, se o sistema operacional do host do seu nó estiver configurado para usar um máximo de PIDs `262144` e espere hospedar menos de `250` Pods, pode-se dar a cada Pod um orçamento de `1000`
PIDs para evitar o uso do número total de PIDs disponíveis desse nó. Se o admin deseja sobrecarregar PIDs semelhantes a CPU ou memória, eles também podem fazê-lo com alguns riscos adicionais. De qualquer forma, um único Pod não será capaz de trazer toda a máquina para baixo. Esse tipo de limitação de recursos ajuda a evitar _fork bombs_ afetem a operação de um cluster inteiro.

A limitação de PID por pod permite que os administradores protejam um pod de outro, mas
não garante que todos os pods agendados nesse host não possam afetar o nó geral. A limitação por pod também não protege os próprios agentes do nó da exaustão do PID.

Você também pode reservar uma quantidade de PIDs para sobrecarga de nó, separada da alocação para Pods. Isso é semelhante a como você pode reservar CPU, memória ou outros recursos para uso pelo sistema operacional e outros recursos fora dos pods e seus recipientes.

A limitação de PID é um irmão importante para [cálculo de recursos](/docs/concepts/configuration/manage-resources-containers/), solicitações e limites. No entanto, você o especifica de uma maneira diferente: em vez de definir um limite de recursos do Pod no `.spec` para um Pod, você configura o limite como um configuração no kubelet. Os limites de PID definidos pelo pod não são compatíveis no momento.

{{< caution >}}
Isso significa que o limite que se aplica a um pod pode ser diferente dependendo onde o pod está agendado. Para simplificar, é mais fácil se todos os Nodes usarem os mesmos limites e reservas de recursos PID.
{{< /caution >}}

## Node PID limits

O Kubernetes permite que você reserve vários IDs de processo para uso do sistema. Para
configurar a reserva, use o parâmetro `pid=<number>` no opções de linha de comando `--system-reserved` e `--kube-reserved` para o kubelet. O valor especificado declara que o número especificado de IDs de processo será reservado para o sistema como um todo e para daemons do sistema Kubernetes, respectivamente.

{{< note >}}
Antes da versão 1.20 do Kubernetes, limitação de recursos PID com nível de nós reservas necessárias para habilitar o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`SupportNodePidsLimit` para funcionar.
{{< /note >}}

## Pod PID limits

O Kubernetes permite limitar o número de processos em execução em um pod. Você especifica esse limite no nível do nó, em vez de configurá-lo como um recurso
limite para um pod específico. Cada nó pode ter um limite PID diferente. Para configurar o limite, você pode especificar o parâmetro de linha de comando `--pod-max-pids` para o kubelet, ou defina `PodPidsLimit` no kubelet [arquivo de configuração](/docs/tasks/administer-cluster/kubelet-config-file/).

{{< note >}}
Antes da versão 1.20 do Kubernetes, a limitação de recursos PID para pods exigia a ativação do [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `SupportPodPidsLimit` para funcionar.
{{< /note >}}

## PID based eviction

Você pode configurar o kubelet para iniciar o encerramento de um pod quando ele estiver se comportando mal e consumindo uma quantidade anormal de recursos. Esse recurso é chamado de despejo. Você pode [Configurar fora da manipulação de recursos](/docs/concepts/scheduling-eviction/node-pressure-eviction/) para vários sinais de despejo. Use o sinal de despejo `pid.available` para configurar o limite para o número de PIDs usados pelo pod. Você pode definir políticas de despejo leves ou rígidas. No entanto, mesmo com a dura política de despejo, se o número de PIDs cresce muito rápido,
o nó ainda pode entrar em estado instável atingindo o limite de PIDs do nó. O valor do sinal de despejo é calculado periodicamente e NÃO impõe o limite.

Limitação de PID, por pod e por nó, define o limite rígido. Quando o limite for atingido, a carga de trabalho começará a apresentar falhas ao tentar obter um novo PID. Pode ou não levar ao reagendamento de um Pod, dependendo de como a carga de trabalho reage a essas falhas e com que vivacidade e prontidão os probes são configurados para o pod. No entanto, se os limites forem definidos corretamente, você pode garantir que a carga de trabalho de outros Pods e os processos do sistema não fiquem sem PIDs quando um Pod está se comportando mal.

## {{% heading "whatsnext" %}}

- Consulte o [documento de aprimoramento de limitação de PID](https://github.com/kubernetes/enhancements/blob/097b4d8276bc9564e56adf72505d43ce9bc5e9e8/keps/sig-node/20190129-pid-limiting.md) para mais informações.
- Para o contexto histórico, leia [Limitação de ID de processo para melhorias de estabilidade no Kubernetes 1.14](/blog/2019/04/15/process-id-limiting-for-stability-improvements-in-kubernetes-1.14/).
- Leia [Gerenciando recursos para contêineres](/docs/concepts/configuration/manage-resources-containers/).
- Saiba como [configurar fora do manuseio de recursos](/docs/concepts/scheduling-eviction/node-pressure-eviction/).