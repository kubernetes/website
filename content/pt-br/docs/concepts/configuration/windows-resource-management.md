---
title: Gerenciamento de recursos para nós Windows
content_type: concept
weight: 75
---

<!-- overview -->

Esta página descreve as diferenças em como os recursos são gerenciados entre o Linux e o Windows.

<!-- body -->

Em nós Linux, {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} são usados ​​como uma divisão para o controle de recursos em Pods. 
Os contêineres são criados dentro desse limite para o isolamento de rede, processo e sistema de arquivos. 
As APIs de cgroup do Linux podem ser usadas para coletar estatísticas de uso de CPU, E/S e memória.

Em contraste, o Windows usa um [_objeto de trabalho_](https://docs.microsoft.com/windows/win32/procthread/job-objects) por contêiner com um filtro de namespace do sistema
para conter todos os processos em um contêiner e fornecer isolamento lógico ao hospedar.
(Os objetos de trabalho são um mecanismo de isolamento de processo do Windows e são diferentes dos
que o Kubernetes chama de {{< glossary_tooltip term_id="job" text="Job" >}}).

Não há como executar um contêiner do Windows sem a filtragem de namespace. 
Isso significa que os privilégios do sistema não podem ser assegurados no contexto do host e, 
portanto, os contêineres privilegiados não estão disponíveis no Windows.
Os contêineres não podem assumir uma identidade do host porque o Gerente de Conta de Segurança (Security Account Manager, ou SAM) é separado.

## Gerenciamento de memória {#resource-management-memory}

O Windows não possui um eliminador de processo por falta de memória como o Linux. 
O Windows sempre trata todas as alocações de memória do modo de usuário como 
virtuais e os arquivos de paginação são obrigatórios.

Os nós Windows não superdimensionam a memória para os processos. O efeito real 
é que o Windows não atingirá as condições de falta de memória 
da mesma forma que o Linux, e estará processando a página em disco em vez de estar 
sujeito ao encerramento por falta de memória (OOM). Se a memória for 
superprovisionada e toda a memória física estiver esgotada, a paginação poderá diminuir o desempenho.

## Gerenciamento de CPU {#resource-management-cpu}

O Windows pode limitar a quantidade de tempo de CPU alocado para diferentes processos, 
mas não pode garantir uma quantidade mínima de tempo de CPU.

No Windows, o kubelet oferece suporte a uma flag de linha de comando para definir a
[prioridade do escalonador](https://docs.microsoft.com/windows/win32/procthread/scheduling-priorities) do processo kubelet:
 `--windows-priorityclass`. Essa flag permite que o processo kubelet obtenha
mais fatias de tempo de CPU quando comparado a outros processos em execução no host do Windows.
Mais informações sobre os valores permitidos e os seus significados estão disponíveis em
[classes de prioridade do Windows](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class).
Para garantir que os Pods em execução não deixem o kubelet sem ciclos de CPU, defina essa flag como `ABOVE_NORMAL_PRIORITY_CLASS` ou acima.

## Reserva de recursos {#resource-reservation}

Para contabilizar a memória e a CPU usadas pelo sistema operacional, o agente de execução de contêiner 
e os processos de host do Kubernetes, como o kubelet, você pode (e deve) 
reservar recursos de memória e CPU com as flags `--kube-reserved` e/ou `--system-reserved` do kubelet.
No Windows, esses valores são usados apenas para calcular o recursos
[alocáveis](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) ​​pelo nó.

{{< caution >}}
Conforme você implanta cargas de trabalho, defina a memória de recursos e os limites de CPU nos contêineres.
Isso também subtrai de `NodeAllocatable` e ajuda o escalonador de todo o cluster a determinar quais pods colocar em quais nós.

Alocar pods sem limites pode superprovisionar os nós do Windows e, em casos extremos, fazer com que os nós não sejam íntegros.
{{< /caution >}}

No Windows, uma boa prática é reservar pelo menos 2GiB de memória.

Para determinar quanta CPU reservar, identifique a densidade máxima do pod para cada 
nó e monitore o uso da CPU dos serviços do sistema em execução, depois escolha um valor que atenda às necessidades das suas cargas de trabalho.