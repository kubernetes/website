---
title: Observabilidade
weight: 55
content_type: concept
description: >
  Entenda como obter visibilidade de ponta a ponta de um cluster Kubernetes através
  da coleta de métricas, logs e rastros.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#metrics"
    title: Métricas
  - anchor: "#logs"
    title: Logs
  - anchor: "#traces"
    title: Rastros
---

<!-- overview -->

No Kubernetes, observabilidade é o processo de coletar e analisar métricas, logs e rastros — frequentemente chamados de três pilares da observabilidade — para obter um entendimento melhor do estado interno, do desempenho e da saúde do cluster.

Os componentes da camada de gerenciamento do Kubernetes, assim como muitos complementos, geram e emitem esses sinais. Ao agregá-los e correlacioná-los, é possível obter uma visão unificada da camada de gerenciamento, dos complementos e das aplicações em todo o cluster.

A Figura 1 mostra como os componentes do cluster emitem os três tipos principais de sinal.

{{< mermaid >}}
flowchart LR
    A[Componentes do cluster] --> M[Pipeline de métricas]
    A --> L[Pipeline de logs]
    A --> T[Pipeline de rastros]
    M --> S[(Armazenamento e análise)]
    L --> S
    T --> S
    S --> O[Operadores e automação]
{{< /mermaid >}}

*Figura 1. Sinais de alto nível emitidos pelos componentes do cluster e seus consumidores.*

<!-- body -->
## Métricas

Os componentes do Kubernetes emitem métricas no [formato Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) a partir de seus endpoints `/metrics`, incluindo:

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

O kubelet também expõe métricas em `/metrics/cadvisor`, `/metrics/resource` e `/metrics/probes`, e complementos como o [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/) enriquecem esses sinais da camada de gerenciamento com o status dos objetos do Kubernetes.

Um pipeline de métricas típico do Kubernetes coleta periodicamente esses endpoints e armazena as amostras em um banco de dados de séries temporais (por exemplo, com o Prometheus).

Consulte o [guia de métricas do sistema](/docs/concepts/cluster-administration/system-metrics/) para detalhes e opções de configuração.

A Figura 2 mostra um pipeline de métricas comum no Kubernetes.

{{< mermaid >}}
flowchart LR
    C[Componentes do cluster] --> P[Coletor Prometheus]
    P --> TS[(Armazenamento de séries temporais)]
    TS --> D[Painéis e alertas]
    TS --> A[Ações automatizadas]
{{< /mermaid >}}

*Figura 2. Componentes de um pipeline de métricas típico do Kubernetes.*

Para visibilidade multi-cluster ou multi-cloud, bancos de dados de séries temporais distribuídos (por exemplo, Thanos ou Cortex) podem complementar o Prometheus.

Consulte [Ferramentas comuns de observabilidade - ferramentas de métricas](#metrics-tools) para coletores de métricas e bancos de dados de séries temporais.

#### {{% heading "seealso" %}}

- [Métricas do sistema para componentes do Kubernetes](/docs/concepts/cluster-administration/system-metrics/)
- [Monitoramento de uso de recursos com metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [Conceito do kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/)
- [Visão geral do pipeline de métricas de recursos](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

## Logs

Os logs fornecem um registro cronológico de eventos dentro das aplicações, dos componentes do sistema Kubernetes e de atividades relacionadas à segurança, como o log de auditoria.

Os agentes de execução de contêiner (_container runtimes_) capturam a saída de uma aplicação em contêiner a partir dos fluxos de saída padrão (`stdout`) e erro padrão (`stderr`). Embora cada agente de execução implemente isso de formas diferentes, a integração com o kubelet é padronizada através do _formato de log da CRI_, e o kubelet disponibiliza esses logs através do `kubectl logs`.

![Log no nível de nó](/images/docs/user-guide/logging/logging-node-level.png)

*Figura 3a. Arquitetura de log no nível de nó.*

Os logs de componentes do sistema capturam eventos do cluster e costumam ser úteis para depuração e solução de problemas. Esses componentes são classificados de duas formas diferentes: os que são executados em um contêiner e os que não são. Por exemplo, o `kube-scheduler` e o `kube-proxy` geralmente são executados em contêineres, enquanto o `kubelet` e o agente de execução de contêiner são executados diretamente no host.

- Em máquinas com `systemd`, o kubelet e o agente de execução de contêiner escrevem no journald. Caso contrário, eles escrevem em arquivos `.log` no diretório `/var/log`.
- Componentes do sistema que são executados dentro de contêineres sempre escrevem em arquivos `.log` em `/var/log`, contornando o mecanismo padrão de log de contêiner.

Os logs de componentes do sistema e de contêineres armazenados em `/var/log` exigem rotação de log para evitar um crescimento descontrolado. Alguns scripts de provisionamento de cluster instalam a rotação de log por padrão; verifique seu ambiente e ajuste conforme necessário. Veja a [referência de logs do sistema](/docs/concepts/cluster-administration/system-logs/) para detalhes sobre locais, formatos e opções de configuração.

A maioria dos clusters executa um agente de log no nível de nó (por exemplo, Fluent Bit ou Fluentd) que acompanha esses arquivos e encaminha as entradas para um armazenamento central de logs. As [orientações de arquitetura de log](/docs/concepts/cluster-administration/logging/) explicam como projetar esses pipelines, aplicar retenção e encaminhar os fluxos de log para backends.

A Figura 3 mostra um pipeline comum de agregação de logs.

{{< mermaid >}}
flowchart LR
    subgraph Fontes
        A[stdout / stderr da aplicação]
        B[Logs da camada de gerenciamento]
        C[Registros de auditoria]
    end
    A --> N[Agente de log do nó]
    B --> N
    C --> N
    N --> L[Armazenamento central de logs]
    L --> Q[Painéis, alertas, SIEM]
{{< /mermaid >}}

*Figura 3. Componentes de um pipeline de logs típico do Kubernetes.*

Veja [Ferramentas comuns de observabilidade - ferramentas de log](#logging-tools) para conhecer agentes de log e armazenamentos centrais de log.

#### {{% heading "seealso" %}}

- [Arquitetura de log](/docs/concepts/cluster-administration/logging/)
- [Logs do sistema](/docs/concepts/cluster-administration/system-logs/)
- [Tarefas e tutoriais de log](/docs/tasks/debug/logging/)
- [Configurar log de auditoria](/docs/tasks/debug/debug-cluster/audit/)

## Rastros

Os rastros capturam como as requisições se movem entre os componentes do Kubernetes e as aplicações, relacionando latência, tempo e relações entre operações. Ao coletar rastros, é possível visualizar o fluxo de requisições de ponta a ponta, diagnosticar problemas de desempenho e identificar gargalos ou interações inesperadas na camada de gerenciamento, nos complementos ou nas aplicações.

O Kubernetes {{< skew currentVersion >}} pode exportar spans usando o [Protocolo OpenTelemetry](/docs/concepts/cluster-administration/system-traces/) (OTLP), seja diretamente através de exportadores (_exporters_) gRPC embutidos, seja encaminhando-os através de um OpenTelemetry Collector.

O OpenTelemetry Collector recebe spans de componentes e aplicações, os processa (por exemplo, aplicando amostragem ou redação de dados) e os encaminha para um backend de rastros para armazenamento e análise.

A Figura 4 mostra um pipeline típico de rastros distribuído.

{{< mermaid >}}
flowchart LR
    subgraph Fontes
        A[Spans da camada de gerenciamento]
        B[Spans da aplicação]
    end
    A --> X[Exportador OTLP]
    B --> X
    X --> COL[OpenTelemetry Collector]
    COL --> TS[(Backend de rastros)]
    TS --> V[Visualização e análise]
{{< /mermaid >}}

*Figura 4. Componentes de um pipeline de rastros típico do Kubernetes.*

Consulte [Ferramentas comuns de observabilidade - ferramentas de rastros](#tracing-tools) para conhecer coletores e backends de rastros.

#### {{% heading "seealso" %}}

- [Rastros do sistema para componentes do Kubernetes](/docs/concepts/cluster-administration/system-traces/)
- [Guia de introdução ao OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
- [Tarefas de monitoramento e rastros](/docs/tasks/debug/monitoring/)

## Ferramentas comuns de observabilidade

{{% thirdparty-content %}}

Nota: Esta seção contém links para projetos de terceiros que fornecem funcionalidades necessárias ao Kubernetes.
Os autores do projeto Kubernetes não são responsáveis por esses projetos, que estão listados em ordem alfabética. Para adicionar um
projeto a esta lista, leia o [guia de conteúdo](/docs/contribute/style/content-guide/) antes de enviar uma alteração.

### Ferramentas de métricas

- O [Cortex](https://cortexmetrics.io/) oferece armazenamento Prometheus escalável horizontalmente e de longo prazo.
- O [Grafana Mimir](https://grafana.com/oss/mimir/) é um projeto do Grafana Labs que fornece armazenamento multi-tenant compatível com Prometheus e escalável horizontalmente.
- O [Prometheus](https://prometheus.io/) é o sistema de monitoramento que coleta e armazena métricas dos componentes do Kubernetes.
- O [Thanos](https://thanos.io/) estende o Prometheus com consultas globais, downsampling e suporte a armazenamento de objetos.

### Ferramentas de log

- O [Elasticsearch](https://www.elastic.co/elasticsearch/) fornece indexação e busca distribuída de logs.
- O [Fluent Bit](https://fluentbit.io/) coleta e encaminha logs de contêineres e nós com baixo consumo de recursos.
- O [Fluentd](https://www.fluentd.org/) roteia e transforma logs para múltiplos destinos.
- O [Grafana Loki](https://grafana.com/oss/loki/) armazena logs em um formato baseado em rótulos, inspirado no Prometheus.
- O [OpenSearch](https://opensearch.org/) fornece indexação e busca de logs de código aberto compatível com as APIs do Elasticsearch.

### Ferramentas de rastros

- O [Grafana Tempo](https://grafana.com/oss/tempo/) oferece armazenamento de rastros distribuído, escalável e de baixo custo.
- O [Jaeger](https://www.jaegertracing.io/) captura e visualiza rastros distribuídos para microsserviços.
- O [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) recebe, processa e exporta dados de telemetria, incluindo rastros.
- O [Zipkin](https://zipkin.io/) fornece coleta e visualização de rastros distribuído.

## {{% heading "whatsnext" %}}

- Aprenda a [coletar métricas de uso de recursos com o metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- Explore as [tarefas e tutoriais de log](/docs/tasks/debug/logging/)
- Siga os [guias de tarefas de monitoramento e rastros](/docs/tasks/debug/monitoring/)
- Revise o [guia de métricas do sistema](/docs/concepts/cluster-administration/system-metrics/) para endpoints de componentes e sua estabilidade
- Revise a seção [ferramentas comuns de observabilidade](#common-observability-tools) para conhecer opções de terceiros já avaliadas
