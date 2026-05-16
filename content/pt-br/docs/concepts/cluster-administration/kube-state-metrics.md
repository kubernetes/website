---
title: Métricas para Estados de Objetos do Kubernetes
content_type: concept
weight: 75
description: >-
   kube-state-metrics, um agente complementar para gerar e expor métricas em nível de cluster.
---

O estado dos objetos do Kubernetes na API do Kubernetes pode ser exposto como métricas.
Um agente complemento chamado [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) pode se conectar ao servidor de API do Kubernetes e expor um endpoint HTTP com métricas geradas a partir do estado de objetos individuais no cluster.
Ele expõe diversas informações sobre o estado dos objetos, como rótulos e anotações, tempos de inicialização e término, status ou a fase em que o objeto se encontra atualmente.
Por exemplo, contêineres em execução em pods criam uma métrica `kube_pod_container_info`.
Isso inclui o nome do contêiner, o nome do pod do qual ele faz parte, o {{< glossary_tooltip text="namespace" term_id="namespace" >}} no qual o pod está em execução, o nome da imagem do contêiner, o ID da imagem, o nome da imagem a partir da especificação do contêiner, o ID do contêiner em execução e o ID do pod como rótulos.

{{% thirdparty-content single="true" %}}

Um componente externo que seja apto e capaz de coletar o endpoint do kube-state-metrics (por exemplo, via Prometheus) pode agora ser utilizado para habilitar os seguintes casos de uso.

## Exemplo: usando métricas do kube-state-metrics para consultar o estado do cluster {#example-kube-state-metrics-query-1}

As séries de métricas geradas pelo kube-state-metrics são úteis para obter mais informações sobre o cluster, pois podem ser usadas para consultas.

Se você usa o Prometheus ou outra ferramenta que utilize a mesma linguagem de consulta, a seguinte consulta PromQL retorna o número de pods que não estão prontos:

```
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## Exemplo: alertas baseados no kube-state-metrics {#example-kube-state-metrics-alert-1}

As métricas geradas pelo kube-state-metrics também permitem o disparo de alertas sobre problemas no cluster.

Se você usa o Prometheus ou uma ferramenta similar que utilize a mesma linguagem de regras de alerta, o seguinte alerta será disparado se houver pods em estado `Terminating` por mais de 5 minutos:

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: Pod {{$labels.namespace}}/{{$labels.pod}} blocked in Terminating state.
```
