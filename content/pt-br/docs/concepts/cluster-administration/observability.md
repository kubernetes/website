---
title: Observabilidade
weight: 55
content_type: concept
description: >
  Entenda como obter visibilidade de ponta a ponta de um cluster do Kubernetes por meio da coleta de métricas, logs e rastreamentos.
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
    title: Rastreamentos
---

<!-- overview -->

No Kubernetes, observabilidade é o processo de coletar e analisar métricas, logs e rastreamentos — frequentemente chamados de três pilares da observabilidade — para obter um melhor entendimento do estado interno, desempenho e saúde do cluster.

Os componentes do control plane do Kubernetes, assim como muitos add-ons, geram e emitem esses sinais. Ao agregá-los e correlacioná-los, você pode obter uma visão unificada do control plane, dos add-ons e das aplicações em todo o cluster.

A Figura 1 descreve como os componentes do cluster emitem os três tipos primários de sinais.

{{< mermaid >}}
flowchart LR
    A[Componentes do cluster] --> M[Pipeline de métricas]
    A --> L[Pipeline de logs]
    A --> T[Pipeline de rastreamentos]
    M --> S[(Armazenamento e análise)]
    L --> S
    T --> S
    S --> O[Operadores e automação]
{{< /mermaid >}}

*Figura 1. Sinais de alto nível emitidos pelos componentes do cluster e seus consumidores.*

<!-- body -->
## Métricas {#metrics}

Os componentes do Kubernetes emitem métricas no [formato Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) a partir de seus endpoints `/metrics`, incluindo:

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

O kubelet também expõe métricas em `/metrics/cadvisor`, `/metrics/resource` e `/metrics/probes`, e add-ons como o [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/) enriquecem esses sinais do control plane com o status dos objetos do Kubernetes.

Um pipeline típico de métricas do Kubernetes coleta (scrape) esses endpoints periodicamente e armazena as amostras em um banco de dados de séries temporais (por exemplo, com o Prometheus).

Consulte o [guia de métricas do sistema](/pt-br/docs/concepts/cluster-administration/system-metrics/) para obter detalhes e opções de configuração.

A Figura 2 descreve um pipeline comum de métricas do Kubernetes.

{{< mermaid >}}
flowchart LR
    C[Componentes do cluster] --> P[Coletor Prometheus]
    P --> TS[(Armazenamento de séries temporais)]
    TS --> D[Dashboards e alertas]
    TS --> A[Ações automatizadas]
{{< /mermaid >}}

*Figura 2. Componentes de um pipeline típico de métricas do Kubernetes.*

Para visibilidade em múltiplos clusters ou múltiplas nuvens, bancos de dados de séries temporais distribuídos (por exemplo, Thanos ou Cortex) podem complementar o Prometheus.

Consulte [Ferramentas comuns de observabilidade - ferramentas de métricas](#metrics-tools) para coletores de métricas e bancos de dados de séries temporais.

#### {{% heading "seealso" %}}

- [Métricas para componentes do Kubernetes](/pt-br/docs/concepts/cluster-administration/system-metrics/)
- [Monitoramento do uso de recursos com o metrics-server](/pt-br/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [Conceito do kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/)
- [Visão geral do pipeline de métricas de recursos](/pt-br/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

## Logs {#logs}

Os logs fornecem um registro cronológico de eventos dentro das aplicações, dos componentes do sistema do Kubernetes e de atividades relacionadas à segurança, como a auditoria (audit logging).

Os runtimes de contêiner capturam a saída de uma aplicação em contêiner a partir dos fluxos de saída padrão (`stdout`) e de erro padrão (`stderr`). Embora os runtimes implementem isso de maneiras diferentes, a integração com o kubelet é padronizada por meio do _formato de logs CRI_, e o kubelet disponibiliza esses logs através do `kubectl logs`.

![Node-level logging](/images/docs/user-guide/logging/logging-node-level.png)

*Figura 3a. Arquitetura de logs no nível do nó.*

Os logs dos componentes do sistema capturam eventos do cluster e são frequentemente úteis para depuração e solução de problemas. Esses componentes são classificados de duas maneiras diferentes: os que são executados em um contêiner e os que não são. Por exemplo, o `kube-scheduler` e o `kube-proxy` geralmente são executados em contêineres, enquanto o `kubelet` e o runtime de contêiner são executados diretamente no host.

- Em máquinas com `systemd`, o kubelet e o runtime de contêiner gravam no journald. Caso contrário, eles gravam em arquivos `.log` no diretório `/var/log`.
- Os componentes do sistema que são executados dentro de contêineres sempre gravam em arquivos `.log` em `/var/log`, ignorando o mecanismo padrão de logs de contêiner.

Os logs dos componentes do sistema e dos contêineres armazenados em `/var/log` exigem rotação de logs para evitar crescimento descontrolado. Alguns scripts de provisionamento de cluster instalam a rotação de logs por padrão; verifique seu ambiente e ajuste conforme necessário. Consulte a [referência de logs do sistema](/pt-br/docs/concepts/cluster-administration/system-logs/) para obter detalhes sobre locais, formatos e opções de configuração.

A maioria dos clusters executa um agente de logs no nível do nó (por exemplo, Fluent Bit ou Fluentd) que monitora esses arquivos e encaminha as entradas para um armazenamento central de logs. O [guia de arquitetura de logging](/pt-br/docs/concepts/cluster-administration/logging/) explica como projetar esses pipelines, aplicar retenção e direcionar os fluxos de logs para os backends.

A Figura 3 descreve um pipeline comum de agregação de logs.

{{< mermaid >}}
flowchart LR
    subgraph Fontes
        A[stdout / stderr da aplicação]
        B[Logs do control plane]
        C[Registros de auditoria]
    end
    A --> N[Agente de logs do nó]
    B --> N
    C --> N
    N --> L[Armazenamento central de logs]
    L --> Q[Dashboards, alertas, SIEM]
{{< /mermaid >}}

*Figura 3. Componentes de um pipeline típico de logs do Kubernetes.*

Consulte [Ferramentas comuns de observabilidade - ferramentas de logging](#logging-tools) para agentes de logs e armazenamentos centrais de logs.

#### {{% heading "seealso" %}}

- [Arquitetura de logging](/pt-br/docs/concepts/cluster-administration/logging/)
- [Logs do sistema](/pt-br/docs/concepts/cluster-administration/system-logs/)
- [Tarefas e tutoriais de logging](/docs/tasks/debug/logging/)
- [Configurar auditoria de logs](/docs/tasks/debug/debug-cluster/audit/)

## Rastreamentos {#traces}

Os rastreamentos capturam como as requisições se movem pelos componentes do Kubernetes e pelas aplicações, vinculando latência, tempos e relações entre operações. Ao coletar rastreamentos, você pode visualizar o fluxo de requisições de ponta a ponta, diagnosticar problemas de desempenho e identificar gargalos ou interações inesperadas no control plane, nos add-ons ou nas aplicações.

O Kubernetes {{< skew currentVersion >}} pode exportar spans por meio do [protocolo OpenTelemetry](/pt-br/docs/concepts/cluster-administration/system-traces/) (OTLP), seja diretamente por exportadores gRPC integrados ou encaminhando-os por um OpenTelemetry Collector.

O OpenTelemetry Collector recebe spans de componentes e aplicações, os processa (por exemplo, aplicando amostragem ou redação) e os encaminha a um backend de rastreamento para armazenamento e análise.

A Figura 4 descreve um pipeline típico de rastreamento distribuído.

{{< mermaid >}}
flowchart LR
    subgraph Fontes
        A[Spans do control plane]
        B[Spans da aplicação]
    end
    A --> X[Exportador OTLP]
    B --> X
    X --> COL[OpenTelemetry Collector]
    COL --> TS[(Backend de rastreamentos)]
    TS --> V[Visualização e análise]
{{< /mermaid >}}

*Figura 4. Componentes de um pipeline típico de rastreamentos do Kubernetes.*

Consulte [Ferramentas comuns de observabilidade - ferramentas de rastreamento](#tracing-tools) para coletores e backends de rastreamento.

#### {{% heading "seealso" %}}

- [Rastreamentos para componentes do Kubernetes](/pt-br/docs/concepts/cluster-administration/system-traces/)
- [Guia de primeiros passos do OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
- [Tarefas de monitoramento e rastreamento](/docs/tasks/debug/monitoring/)

## Ferramentas comuns de observabilidade {#common-observability-tools}

{{% thirdparty-content %}}

Nota: Esta seção contém links para projetos de terceiros que fornecem capacidades de observabilidade exigidas pelo Kubernetes.
Os autores do projeto Kubernetes não são responsáveis por esses projetos, que estão listados em ordem alfabética. Para adicionar um
projeto a esta lista, leia o [guia de conteúdo](/pt-br/docs/contribute/style/content-guide/) antes de enviar uma alteração.

### Ferramentas de métricas {#metrics-tools}

- O [Cortex](https://cortexmetrics.io/) oferece armazenamento Prometheus de longo prazo, escalável horizontalmente.
- O [Grafana Mimir](https://grafana.com/oss/mimir/) é um projeto da Grafana Labs que fornece armazenamento compatível com Prometheus, multi-tenant e escalável horizontalmente.
- O [Prometheus](https://prometheus.io/) é o sistema de monitoramento que coleta e armazena métricas dos componentes do Kubernetes.
- O [Thanos](https://thanos.io/) estende o Prometheus com consultas globais, downsampling e suporte a armazenamento de objetos.

### Ferramentas de logging {#logging-tools}

- O [Elasticsearch](https://www.elastic.co/elasticsearch/) entrega indexação e busca distribuída de logs.
- O [Fluent Bit](https://fluentbit.io/) coleta e encaminha logs de contêineres e nós com uma pegada baixa de recursos.
- O [Fluentd](https://www.fluentd.org/) roteia e transforma logs para múltiplos destinos.
- O [Grafana Loki](https://grafana.com/oss/loki/) armazena logs em um formato baseado em labels inspirado no Prometheus.
- O [OpenSearch](https://opensearch.org/) fornece indexação e busca de logs de código aberto compatível com as APIs do Elasticsearch.

### Ferramentas de rastreamento {#tracing-tools}

- O [Grafana Tempo](https://grafana.com/oss/tempo/) oferece armazenamento de rastreamento distribuído escalável e de baixo custo.
- O [Jaeger](https://www.jaegertracing.io/) captura e visualiza rastreamentos distribuídos para microsserviços.
- O [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) recebe, processa e exporta dados de telemetria, incluindo rastreamentos.
- O [Zipkin](https://zipkin.io/) fornece coleta e visualização de rastreamento distribuído.

## {{% heading "whatsnext" %}}

- Aprenda como [coletar métricas de uso de recursos com o metrics-server](/pt-br/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- Explore [tarefas e tutoriais de logging](/docs/tasks/debug/logging/)
- Siga os [guias de tarefas de monitoramento e rastreamento](/docs/tasks/debug/monitoring/)
- Consulte o [guia de métricas do sistema](/pt-br/docs/concepts/cluster-administration/system-metrics/) para endpoints dos componentes e estabilidade
- Revise a seção de [ferramentas comuns de observabilidade](#common-observability-tools) para opções de terceiros aprovadas
