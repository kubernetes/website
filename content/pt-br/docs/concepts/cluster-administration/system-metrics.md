---
title: Métricas para componentes do sistema Kubernetes
content_type: concept
weight: 60
---

<!-- overview -->

Métricas dos componentes do sistema podem dar uma visão melhor do que acontece internamente. Métricas são particularmente úteis para construir _dashboards_ e alertas.

Componentes do Kubernetes emitem métricas no [formato Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/). Esse formato é um texto simples estruturado, projetado para que pessoas e máquinas possam lê-lo.

<!-- body -->

## Métricas no Kubernetes

Na maioria dos casos, as métricas estão disponíveis no _endpoint_ `/metrics` do servidor HTTP. Para componentes que não expõem o _endpoint_ por padrão, ele pode ser ativado usando a _flag_ `--bind-address`.

Exemplos desses componentes:

- {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
- {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
- {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
- {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
- {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

Em um ambiente de produção, você pode querer configurar o [Servidor Prometheus](https://prometheus.io/) ou algum outro coletor de métricas e disponibilizá-las em algum tipo de banco de dados temporais.

Observe que o {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} também expõe métricas nos _endpoints_ `/metrics/cadvisor`, `/metrics/resource` e `/metrics/probes`. Essas métricas não possuem o mesmo ciclo de vida.

Se o seu _cluster_ usa {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, ler as métricas requer autorização por meio de um usuário, grupo ou _ServiceAccount_ com um _ClusterRole_ que conceda o acesso ao `/metrics`.

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

Métrica alfa → Métrica estável → Métrica ultrapassada → Métrica oculta → Métrica excluída

A métrica alfa não tem garantias de estabilidade. Essas métricas podem ser modificadas ou deletadas a qualquer momento.

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

Métricas ocultas não são mais publicadas para extração, mas ainda estão disponíveis para uso. Para usar uma métrica oculta, por favor consulte a seção [mostrar métricas ocultas](#mostrar-métricas-ocultas).

Métricas excluídas não estão mais disponíveis e não podem mais ser usadas.

## Mostrar métricas ocultas

Como descrito anteriormente, administradores podem habilitar métricas ocultas por meio de uma _flag_ de linha de comando em um binário específico. Isso pode ser usado como uma saída de emergência para os administradores caso percam a migração das métricas ultrapassadas na última versão.

A _flag_ `show-hidden-metrics-for-version` usa uma versão para a qual você deseja mostrar métricas ultrapassadas nessa versão. A versão é expressada como x.y, onde x é a versão principal e y a versão secundária. A versão de _patch_ não é necessária mesmo que uma métrica possa ser descontinuada em uma versão de _patch_, o motivo é que a política de descontinuação de métricas é executada na versão secundária.

A _flag_ só pode usar a versão secundária anterior como seu valor. Todas as métricas ocultas no anterior serão emitidas se os administradores definirem a versão anterior como `show-hidden-metrics-for-version`. A versão muito antiga não é permitida porque viola a política de métricas ultrapassadas.

Utilize a métrica `A` como exemplo, assumindo que `A` está obsoleto em 1.n. De acordo com a política de métricas ultrapassadas, podemos chegar à seguinte conclusão:

- Na versão `1.n`, a métrica está ultrapassada, e pode ser emitida por padrão.
- Na versão `1.n+1`, a métrica está oculta por padrão e pode ser emitida via linha de comando `show-hidden-metrics-for-version=1.n`.
- Na versão `1.n+2`, a métrica deve ser removida do código fonte. Não há mais _escape hatch_.

Se você está atualizando da versão `1.12` para `1.13`, mas ainda depende da métrica `A` ultrapassada em `1.12`, você deve definir métricas ocultas via linha de comando: `--show-hidden-metrics=1.12` e lembre-se de remover essa dependência de métrica antes de atualizar para `1.14`.

## Desativar métricas do _accelerator_

O kubelet coleta métricas do _accelerator_ por meio do cAdvisor. Para coletar essas métricas, para _accelerator_ como as GPUs NVIDIA, o kubelet mantinha uma alça aberta no driver. Isso significava que, para realizar alterações na infraestrutura (por exemplo, atualizar o _driver_), um administrador do _cluster_ precisa interromper o agente kubelet.

A responsabilidade de colear métricas do _accelerator_ agora pertence ao fornecedor, e não ao kubelet. Os fornecedores devem providenciar um contêiner que colete métricas e as exponha ao serviço de métricas (por exemplo, Prometheus).

O [`DisableAcceleratorUsageMetrics` _feature gate_](/docs/reference/command-line-tools-reference/feature-gates/) desabilita as métricas coletadas pelo kubelet, com uma [_timeline_ para habilitar esse recurso por padrão](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria).

## Métricas de componentes

### Métricas do _kube-controller-manager_

As métricas do _controller manager_ fornecem informações importantes sobre o desempenho e a integridade do _controller manager_.
Essas métricas incluem métricas comuns do agente de execução da linguagem Go, tais como a quantidade de _go_routine_ e métricas específicas do _controller_, como latência de requisições etcd ou latência da _API_ dos provedores de serviços de nuvem (AWS, GCE, OpenStack), que podem ser usadas para medir a integridade de um _cluster_.

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

### Métricas do _kube-scheduler_

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

O _scheduler_ expõe métricas opcionais que relatam os recursos solicitados e os limites desejados de todos os _pods_ em execução. Essas métricas podem ser usadas para criar _dashboards_ de planejamento de capacidade, avaliar os limites de agendamentos atuais ou históricos, identificar rapidamente cargas de trabalho que não podem ser agendadas devido à falta de recursos e comparar o uso atual com a solicitação do _pod_.

O _kube-scheduler_ identifica as requisições de [recursos e limites](/docs/concepts/configuration/manage-resources-containers/) configurado para cada _Pod_; quando uma requisição ou limite é diferente de zero o _kube-scheduler_ relata uma _timeseries_ de métricas. Essa _timeseries_ é etiquetada por:

- _namespace_
- nome do _pod_
- o nó onde o _pod_ está programado ou uma _string_ vazia caso ainda não esteja programado
- prioridade
- o _scheduler_ atribuído para esse _pod_
- o nome do recurso (por exemplo, `cpu`)
- a unidade do recurso, se conhecida (por exemplo, `cores`)

Uma vez que o _pod_ alcança um estado de conclusão (sua `restartPolicy` está como `Never` ou `onFailure` e está na fase de `Succeeded` ou `Failed`, ou foi deletado e todos os contêineres tem um estado de terminado), a série não é mais relatada já que o _scheduler_ agora está livre para agendar a execução de outros _pods_. As duas métricas são chamadas de `kube_pod_resource_request` e `kube_pod_resource_limit`.

As métricas são expostas no _endpoint_ HTTP `/metrics/resources` e requerem a mesma autorização que o _endpoint_ `/metrics` no _scheduler_. Você deve usar a _flag_ `--show-hidden-metrics-for-version=1.20` para expor essas métricas de estabilidade alfa.

## Desativando métricas

Você pode desativar explicitamente as métricas via linha de comando utilizando a _flag_ `--disabled-metrics`. Isso pode ser desejado se, por exemplo, uma métrica estiver causando um problema de desempenho. A entrada é uma lista de métricas desabilitadas (ou seja, `--disabled-metrics=metric1,metric2`).

## Aplicação de cardinalidade de métrica

As métricas com dimensões sem limites podem causar problemas de memória nos componentes que elas instrumentam. Para limitar a utilização de recursos você pode usar a opção de linha de comando `--allow-label-value` para dinamicamente configurar uma lista de permissões de valores de _label_ para uma métrica.

No estágio alfa, a _flag_ pode receber apenas uma série de mapeamentos como lista de permissões de _labels_ para uma métrica.
Cada mapeamento tem o formato `<metric_name>,<label_name>=<allowed_labels>` onde `<allowed_labels>` é uma lista separada por vírgulas de nomes aceitáveis para a _label_.

O formato geral se parece com:
`--allow-label-value <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...`.

Por exemplo:
`--allow-label-value number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'`

## {{% heading "whatsnext" %}}

- Leia sobre o [formato de texto do Prometheus](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format) para métricas
- Veja a lista de [métricas estáveis ​​do Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
- Leia sobre a [Política de suspensão de uso do Kubernetes](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
