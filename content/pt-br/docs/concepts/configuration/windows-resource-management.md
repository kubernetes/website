---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Gerenciamento de recursos para nós do Windows
content_type: concept
weight: 75
---

<!-- overview -->

Esta página descreve as diferenças em como os recursos são gerenciados entre o Linux e o Windows.

<!-- body -->

Em nós do Linux, {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} são usados como um limite de pod para controle de recursos. 
Os contêineres são criados dentro desse limite para o isolamento de rede, processo e sistema de arquivos. 
As APIs Linux cgroup podem ser usadas para coletar estatísticas de uso de CPU, E/S e memória.

Em contraste, o Windows usa um [_objetos de trabalho_](https://docs.microsoft.com/windows/win32/procthread/job-objects) por contêiner com um filtro de namespace do sistema
para conter todos os processos em um contêiner e fornecer isolamento lógico ao hospedar.
(Os objetos de trabalho são um mecanismo de isolamento de processo do Windows e são diferentes dos
que o Kubernetes chama de {{< glossary_tooltip term_id="job" text="Job" >}}).

Não há como executar um contêiner do Windows sem a filtragem de namespace. 
Isso significa que os privilégios do sistema não podem ser declarados no contexto do host e, 
portanto, os contêineres privilegiados não estão disponíveis no Windows.
Os contêineres não podem assumir uma identidade do host porque o Gerente de conta de segurança (SAM) é separado.

## Gerenciamento de memória {#resource-management-memory}

O Windows não possui um eliminador de processo de falta de memória como o Linux. 
O Windows sempre trata todas as alocações de memória do modo de usuário como 
virtuais e os arquivos de paginação são obrigatórios.

Os nós do Windows não sobrecarregam a memória para os processos. O efeito líquido 
é que o Windows não atingirá as condições de falta de memória 
da mesma forma que o Linux, e processará a página em disco em vez de estar 
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
[Classes prioritárias do Windows](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class).
Para garantir que os Pods em execução não prejudiquem o kubelet de ciclos de CPU, defina essa flag como `ABOVE_NORMAL_PRIORITY_CLASS` ou acima.

## Reserva de recursos {#resource-reservation}

Para contabilizar a memória e a CPU usadas pelo sistema operacional, o tempo de execução do contêiner 
e pelos processos de host do Kubernetes, como o kubelet, você pode (e deve) 
reservar recursos de memória e CPU com o  `--kube-reserved` e/ou `--system-reserved` flags de kubelet.
No Windows, esses valores são usados apenas para calcular o nó
[alocável](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) de recursos.

{{< caution >}}
Conforme você implanta cargas de trabalho, defina a memória de recursos e os limites de CPU nos contêineres.
Isso também subtrai de `NodeAllocatable` e ajuda o agendador de todo o cluster a determinar quais pods colocar em quais nós.

Agendar pods sem limites pode superprovisionar os nós do Windows e, em casos extremos, fazer com que os nós não sejam íntegros.
{{< /caution >}}

No Windows, uma boa prática é reservar pelo menos 2GiB de memória.

Para determinar quanta CPU reservar, identifique a densidade máxima do pod para cada 
nó e monitore o uso da CPU dos serviços do sistema em execução, depois escolha um valor que atenda às suas necessidades de carga de trabalho.