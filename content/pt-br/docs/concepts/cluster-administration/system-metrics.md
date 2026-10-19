---
title: Métricas para Componentes do Sistema Kubernetes
content_type: concept
weight: 70
---

<!-- overview -->

Métricas dos componentes do sistema podem dar uma visão melhor do que acontece internamente. Métricas são particularmente úteis para construir _dashboards_ e alertas.

Componentes do Kubernetes emitem métricas no [formato Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/). Esse formato é um texto simples estruturado, projetado para que pessoas e máquinas possam lê-lo.

<!-- body -->

## Métricas no Kubernetes

Na maioria dos casos, as métricas estão disponíveis no endpoint `/metrics` do servidor HTTP. Para componentes que não expõem o endpoint por padrão, ele pode ser ativado usando a flag `--bind-address`.

Exemplos desses componentes:

- {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
- {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
- {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
- {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
- {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

Em um ambiente de produção, você pode querer configurar o [Servidor Prometheus](https://prometheus.io/) ou algum outro coletor de métricas e disponibilizá-las em algum tipo de banco de dados de séries temporais.

Observe que o {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} também expõe métricas nos endpoints `/metrics/cadvisor`, `/metrics/resource` e `/metrics/probes`. Essas métricas não possuem o mesmo ciclo de vida.

Se o seu cluster usa {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, ler as métricas requer autorização por meio de um usuário, grupo ou ServiceAccount com um ClusterRole que conceda o acesso ao `/metrics`.

Por exemplo:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

## Ciclo de vida da métrica

Métrica alfa → Métrica beta → Métrica estável → Métrica ultrapassada → Métrica oculta → Métrica excluída

A métrica alfa não tem garantias de estabilidade. Essas métricas podem ser modificadas ou deletadas a qualquer momento.

Métricas beta seguem um contrato de API menos rígido do que suas contrapartes estáveis. Nenhum rótulo pode ser removido de métricas beta durante sua vida útil, no entanto, rótulos podem ser adicionados enquanto a métrica estiver no estágio beta.

Métricas estáveis possuem a garantia de que não serão alteradas. Isso significa:

- Uma métrica estável sem uma assinatura ultrapassada não será deletada ou renomeada
- O tipo de uma métrica estável não será modificado

As métricas ultrapassadas estão programadas para exclusão, mas ainda estão disponíveis para uso.
Essas métricas incluem uma anotação sobre a versão em que se tornarão ultrapassadas.

Por exemplo:

- Antes de se tornar ultrapassado

  ```
  # HELP some_counter isso conta coisas
  # TYPE some_counter contador
  some_counter 0
  ```

- Depois de se tornar ultrapassado

  ```
  # HELP some_counter (obsoleto desde 1.15.0) isso conta coisas
  # TYPE some_counter contador
  some_counter 0
  ```

Métricas ocultas não são mais publicadas para extração, mas ainda estão disponíveis para uso.
Uma métrica ultrapassada se torna uma métrica oculta após um período de tempo, com base em seu nível de estabilidade:
* Métricas **ESTÁVEIS** se tornam ocultas após um mínimo de 3 versões ou 9 meses, o que for mais longo.
* Métricas **BETA** se tornam ocultas após um mínimo de 1 versão ou 4 meses, o que for mais longo.
* Métricas **ALFA** podem ser ocultadas ou removidas na mesma versão em que são ultrapassadas.

Para usar uma métrica oculta, você deve habilitá-la. Para mais detalhes, consulte a seção [mostrar métricas ocultas](#mostrar-métricas-ocultas).

Métricas excluídas não estão mais disponíveis e não podem mais ser usadas.

## Mostrar métricas ocultas

Como descrito anteriormente, administradores podem habilitar métricas ocultas por meio de uma _flag_ de linha de comando em um binário específico. Isso pode ser usado como uma saída de emergência para os administradores caso percam a migração das métricas ultrapassadas na última versão.

A _flag_ `show-hidden-metrics-for-version` usa uma versão para a qual você deseja mostrar métricas ultrapassadas nessa versão. A versão é expressada como x.y, onde x é a versão principal e y a versão secundária. A versão de patch não é necessária mesmo que uma métrica possa ser descontinuada em uma versão de patch, o motivo é que a política de descontinuação de métricas é executada na versão secundária.

A _flag_ só pode usar a versão secundária anterior como seu valor. Se você quiser mostrar todas as métricas ocultas na versão anterior, pode definir a _flag_ `show-hidden-metrics-for-version` para a versão anterior. Usar uma versão muito antiga não é permitido porque viola a política de descontinuação de métricas.

Por exemplo, vamos supor que a métrica `A` seja descontinuada na versão `1.29`. A versão na qual a métrica `A` se torna oculta depende de seu nível de estabilidade:
* Se a métrica `A` for **ALFA**, ela poderá ser ocultada na versão `1.29`.
* Se a métrica `A` for **BETA**, ela será ocultada na versão `1.30` no mínimo. Se você estiver atualizando para a versão `1.30` e ainda precisar de `A`, você deve usar a opção de linha de comando `--show-hidden-metrics-for-version=1.29`.
* Se a métrica `A` for **ESTÁVEL**, ela será ocultada na versão `1.32` no mínimo. Se você estiver atualizando para a versão `1.32` e ainda precisar de `A`, você deve usar a opção de linha de comando `--show-hidden-metrics-for-version=1.31`.

## Métricas de componentes

### Métricas do kube-controller-manager

As métricas do controller manager fornecem informações importantes sobre o desempenho e a integridade do controller manager.
Essas métricas incluem métricas comuns do agente de execução da linguagem Go, tais como a quantidade de go_routine e métricas específicas do controller, como latência de requisições etcd ou latência da API dos provedores de serviços de nuvem (AWS, GCE, OpenStack), que podem ser usadas para medir a integridade de um cluster.

A partir do Kubernetes 1.7, métricas detalhadas de provedores de serviços de nuvem estão disponíveis para operações de armazenamento para o GCE, AWS, Vsphere e OpenStack.
Essas métricas podem ser usadas para monitorar a integridade das operações de volumes persistentes.

Por exemplo, para o GCE as seguintes métricas são chamadas:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

### Métricas do kube-scheduler

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

O scheduler expõe métricas opcionais que reportam os recursos solicitados e os limites desejados de todos os pods em execução. Essas métricas podem ser usadas para criar dashboards de planejamento de capacidade, avaliar os limites de agendamentos atuais ou históricos, identificar rapidamente cargas de trabalho que não podem ser agendadas devido à falta de recursos e comparar o uso atual com a solicitação do pod.

O kube-scheduler identifica as requisições de [recursos e limites](/docs/concepts/configuration/manage-resources-containers/) configurado para cada Pod; quando uma requisição ou limite é diferente de zero o kube-scheduler relata uma série temporal de métricas. Essa série temporal é etiquetada por:

- namespace
- nome do pod
- o nó onde o pod está agendado ou uma string vazia caso ainda não esteja agendado
- prioridade
- o scheduler atribuído para esse pod
- o nome do recurso (por exemplo, `cpu`)
- a unidade do recurso, se conhecida (por exemplo, `cores`)

Uma vez que o pod alcança um estado de conclusão (sua `restartPolicy` está como `Never` ou `OnFailure` e está na fase `Succeeded` ou `Failed`, ou foi deletado e todos os contêineres têm um estado de terminado), a série não é mais relatada já que o scheduler agora está livre para agendar a execução de outros pods. As duas métricas são chamadas de `kube_pod_resource_request` e `kube_pod_resource_limit`.

As métricas são expostas no endpoint HTTP `/metrics/resources`. Elas requerem
autorização para o endpoint `/metrics/resources`, geralmente concedida por uma
ClusterRole com o verbo `get` para a URL não-recurso `/metrics/resources`.

No Kubernetes 1.21 você deve usar a opção
`--show-hidden-metrics-for-version=1.20` para expor essas métricas de estabilidade alfa.

### Métricas de Pressure Stall Information (PSI) do kubelet

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

Como uma funcionalidade beta, o Kubernetes permite que você configure o kubelet para coletar informações de
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) do kernel Linux para uso de CPU, memória e I/O.
As informações são coletadas no nível de nó, Pod e contêiner.
As métricas são expostas no endpoint `/metrics/cadvisor` com os seguintes nomes:
```
container_pressure_cpu_stalled_seconds_total
container_pressure_cpu_waiting_seconds_total
container_pressure_memory_stalled_seconds_total
container_pressure_memory_waiting_seconds_total
container_pressure_io_stalled_seconds_total
container_pressure_io_waiting_seconds_total
```

Esta funcionalidade está habilitada por padrão, ao definir o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletPSI`. As informações também são expostas na
[API Summary](/docs/reference/instrumentation/node-metrics#psi).

Você pode aprender como interpretar as métricas PSI em [Entender Métricas PSI](/docs/reference/instrumentation/understand-psi-metrics/).

#### Requisitos

Pressure Stall Information requer:

- [Versões do kernel Linux 4.20 ou posterior](/docs/reference/node/kernel-version-requirements#requirements-psi)
- [cgroup v2](/docs/concepts/architecture/cgroups)

## Desativando métricas

Você pode desativar explicitamente as métricas via linha de comando utilizando a flag `--disabled-metrics`. Isso pode ser desejado se, por exemplo, uma métrica estiver causando um problema de desempenho. A entrada é uma lista de métricas desabilitadas (ou seja, `--disabled-metrics=metric1,metric2`).

## Aplicação de cardinalidade de métrica

As métricas com dimensões sem limites podem causar problemas de memória nos componentes que elas instrumentam. Para limitar a utilização de recursos você pode usar a opção de linha de comando `--allow-label-value` para dinamicamente configurar uma lista de valores de label permitidos para uma métrica.

No estágio alfa, a flag pode receber apenas uma série de mapeamentos como lista de permissões de labels para uma métrica.
Cada mapeamento tem o formato `<metric_name>,<label_name>=<allowed_labels>` onde `<allowed_labels>` é uma lista separada por vírgulas de nomes aceitáveis para a label.

O formato geral se parece com:

```
--allow-metric-labels <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

Por exemplo:

```none
--allow-metric-labels number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

Além de especificar isso pela CLI, isso também pode ser feito dentro de um arquivo de configuração. Você
pode especificar o caminho para esse arquivo de configuração usando o argumento de linha de comando
`--allow-metric-labels-manifest` para um componente. Aqui está um exemplo do conteúdo desse arquivo de configuração:

```yaml
"metric1,label2": "v1,v2,v3"
"metric2,label1": "v1,v2,v3"
```

Além disso, a meta-métrica `cardinality_enforcement_unexpected_categorizations_total` registra a
contagem de categorizações inesperadas durante a aplicação de cardinalidade, isto é, sempre que um valor de rótulo
é encontrado que não é permitido em relação às restrições da lista de permissões.

## {{% heading "whatsnext" %}}

- Leia sobre o [formato de texto do Prometheus](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format) para métricas
- Veja a lista de [métricas estáveis ​​do Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
- Leia sobre a [Política de suspensão de uso do Kubernetes](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
