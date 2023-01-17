---
title: Limites e reservas de ID de processo (PIDs)
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

O Kubernetes permite limitar o número de IDs de processo (PIDs) que um
{{< glossary_tooltip term_id="pod" text="Pod" >}} pode usar.
Você também pode reservar um número de PIDs alocáveis para cada {{< glossary_tooltip term_id="node" text="nó" >}}
para uso pelo sistema operacional e daemons (em vez de Pods).

<!-- body -->

IDs de processo (PIDs) são um recurso fundamental em nós. É trivial alcançar o
limite de tarefas sem atingir  nenhum outro limite de recurso, o que pode causar
instabilidade para uma máquina host.

Os administradores de cluster necessitam de mecanismos para garantir que os pods em execução no
cluster não podem induzir esgostamentos de PID que impedem daemons do host (como o
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} ou o 
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}},
e potencialmente também o agente de execução de contêiner) da execução.
Além disso, é importante garantir que os PIDs sejam limitados entre os Pods para
para garantir que tenham impacto limitado em outras cargas de trabalho no mesmo nó.

{{< note >}}
Em certas instalações do Linux, o sistema operacional define o limite de PIDs para um padrão 
como por exemplo `32768`. Considere aumentar o valor de `/proc/sys/kernel/pid_max`.
{{< /note >}}

Você pode configurar um kubelet para limitar o número de PIDs que um determinado pod pode consumir.
Como por exemplo, se o sistema operacional do seu nó estiver configurado para usar um máximo de `262144` PIDs e
estiver esperando hospedar menos de `250` Pods, pode-se dar a cada Pod uma quota de `1000`
PIDs para evitar o uso do número geral de PIDs disponíveis desse nó. Se o
administrador deseja sobrecarregar PIDs de forma semelhante à CPU ou memória, ele também pode fazer isso
com alguns riscos adicionais. De qualquer forma, um único Pod não será capaz de derrubar
uma máquina para baixo. Este tipo de limitação de recursos ajuda a evitar que um simples
fork bomb afeta a operação de todo um cluster.

A limitação de PID por pod permite que os administradores protejam um pod de outro, mas
não garante que todos os pods alocados nesse host não possam afetar o nó em geral.
A limitação por pod também não protege os próprios agentes do nó do esgotamento do PID.

Você também pode reservar uma quantidade de PIDs para consumo adicional do nó, separada da
alocação para os pods. Isso é semelhante a como você pode reservar uma CPU, memória ou outros
recursos para uso pelo sistema operacional e outras instalações fora dos Pods
e seus contêineres.

A limitação de PID é um recurso importante relacionado a [recurso
computacional](/pt-br/docs/concepts/configuration/manage-resources-containers/), requerimentos
e limites. No entanto, você o especifica de uma maneira diferente: em vez de definir um
limite de recursos do pod no `.spec` para um pod, você configura o limite como uma
configuração no kubelet. Os limites de PID definidos pelo pod não são suportados no momento.

{{< caution >}}
Isso significa que o limite aplicável a um pod pode ser diferente dependendo
onde o pod está alocado. Para tornar as coisas simples, é mais fácil se todos os nós usarem
os mesmos limites e reservas de recursos PID.
{{< /caution >}}

## Limites de PID de nós

O Kubernetes permite que você reserve vários IDs de processo para uso do sistema. Para
configurar a reserva, use o parâmetro `pid=<número>` no
opções de linha de comando `--system-reserved` e `--kube-reserved` para o kubelet.
O valor especificado declara que o número especificado de IDs de processo será
reservado para o sistema como um todo e para os daemons do sistema Kubernetes
respectivamente.


## Limites de PID do pod

O Kubernetes permite limitar o número de processos em execução em um pod. Você
especifica esse limite no nível do nó, em vez de configurá-lo como um recurso
limite para um pod específico. Cada nó pode ter um limite de PID diferente.
Para configurar o limite, você pode especificar o parâmetro de linha de comando `--pod-max-pids`
para o kubelet ou definir `PodPidsLimit` no arquivo de configuração do kubelet
[arquivo de configuração](/docs/tasks/administer-cluster/kubelet-config-file/).


## Remoção baseada em PID

Você pode configurar o kubelet para iniciar o encerramento de um pod quando ele estiver se comportando mal e consumindo uma quantidade anormal de recursos.
Esse recurso é chamado de despejo. Você pode
[Configurar fora da manipulação de recursos](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
para vários sinais de despejo.
Use o sinal de remoção `pid.available` para configurar o limite para o número de PIDs usados pelo pod.
Você pode definir políticas de despejo flexíveis e rígidas.
Porém, mesmo com a política de despejo rígida, se o número de PIDs crescer muito rápido,
o nó ainda pode entrar em estado instável ao atingir o limite de PIDs do nó.
O valor do sinal de despejo é calculado periodicamente e NÃO impõe o limite.

Limitação de PID - por pod e por nó define o limite rígido.
Assim que o limite for atingido, a carga de trabalho começará a apresentar falhas ao tentar obter um novo PID.
Isso pode ou não levar ao reagendamento de um Pod,
dependendo de como a carga de trabalho reage a essas falhas e como vivacidade e prontidão
os probes são configurados para o pod. No entanto, se os limites forem definidos corretamente,
você pode garantir que a carga de trabalho de outros pods e os processos do sistema não ficarão sem PIDs
quando um Pod está se comportando mal.


## {{% heading "whatsnext" %}}

- Consulte o [Documento de aprimoramento de limitação de PID](https://github.com/kubernetes/enhancements/blob/097b4d8276bc9564e56adf72505d43ce9bc5e9e8/keps/sig-node/20190129-pid-limiting.md) para obter mais informações.
- Para uso de conxtexto histórico, leia:
  [Limitação de ID de processo para melhorias de estabilidade no Kubernetes 1.14](/blog/2019/04/15/process-id-limiting-for-stability-improvements-in-kubernetes-1.14/).
- Leia [Gerenciando recursos para contêineres](/pt-br/docs/concepts/configuration/manage-resources-containers/).
- Aprenda como [Configurar fora da manipulação de recursos](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
