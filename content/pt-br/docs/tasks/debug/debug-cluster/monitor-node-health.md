---
title: Monitorar a integridade do Nó
content_type: task
weight: 20
---

<!-- overview -->

*Node Problem Detector* é um daemon para monitoramento e relatório sobre a integridade de um nó.
Você pode executar o Node Problem Detector como um `DaemonSet` ou como um daemon independente.
O Node Problem Detector coleta informações sobre problemas do nó de vários daemons
e relata essas condições para o servidor de API como [Condições](/docs/concepts/architecture/nodes/#condition)
do nó ou como [Eventos](/docs/reference/kubernetes-api/cluster-resources/event-v1).

Para aprender como instalar e usar o Node Problem Detector, consulte a
[documentação do projeto Node Problem Detector](https://github.com/kubernetes/node-problem-detector).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Limitações

* O Node Problem Detector usa o formato de log do kernel para relatar problemas do kernel.
 Para aprender como estender o formato de log do kernel, consulte [Adicionar suporte para outro formato de log](#support-other-log-format).

## Habilitando o Node Problem Detector

Alguns provedores de nuvem habilitam o Node Problem Detector como um {{< glossary_tooltip text="complemento" term_id="addons" >}}.
Você também pode habilitar o Node Problem Detector com `kubectl` ou criando um DaemonSet de complemento.

### Usando kubectl para habilitar o Node Problem Detector {#using-kubectl}

`kubectl` fornece o gerenciamento mais flexível do Node Problem Detector.
Você pode sobrescrever a configuração padrão para adequá-la ao seu ambiente ou
para detectar problemas personalizados do nó. Por exemplo:

1. Crie uma configuração do Node Problem Detector similar a `node-problem-detector.yaml`:

   {{% code_sample file="debug/node-problem-detector.yaml" %}}
   
   {{< note >}}
   Você deve verificar se o diretório de log do sistema está correto para sua distribuição de sistema operacional.
   {{< /note >}}

1. Inicie o Node Problem Detector com `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

### Usando um pod de complemento para habilitar o Node Problem Detector {#using-addon-pod}

Se você está usando uma solução personalizada de autoinicialização de cluster e não precisa
sobrescrever a configuração padrão, você pode aproveitar o pod de complemento para
automatizar ainda mais a implantação.

Crie `node-problem-detector.yaml` e salve a configuração no diretório do pod de complemento
`/etc/kubernetes/addons/node-problem-detector` em um nó da camada de gerenciamento.

## Sobrescrever a configuração

A [configuração padrão](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config)
é incorporada ao construir a imagem do contêiner do Node Problem Detector.

No entanto, você pode usar um [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
para sobrescrever a configuração:

1. Altere os arquivos de configuração em `config/`
1. Crie o `ConfigMap` `node-problem-detector-config`:

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. Altere o `node-problem-detector.yaml` para usar o `ConfigMap`:

   {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. Recrie o Node Problem Detector com o novo arquivo de configuração:

   ```shell
   # Se você tem um node-problem-detector em execução, exclua antes de recriar
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
Esta abordagem só se aplica a um Node Problem Detector iniciado com `kubectl`.
{{< /note >}}

Sobrescrever uma configuração não é suportado se um Node Problem Detector executa como um complemento de cluster.
O gerenciador de complementos não suporta `ConfigMap`.

## Daemons de Problema

Um daemon de problema é um sub-daemon do Node Problem Detector. Ele monitora tipos específicos de problemas do nó
e os relata para o Node Problem Detector.
Existem vários tipos de daemons de problema suportados.

- Um daemon do tipo `SystemLogMonitor` monitora os logs do sistema e relata problemas e métricas
  de acordo com regras predefinidas. Você pode personalizar as configurações para diferentes fontes de log
  como [filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json),
  [kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json),
  [kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json),
  [abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json),
  e [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json).

- Um daemon do tipo `SystemStatsMonitor` coleta várias estatísticas do sistema relacionadas à integridade como métricas.
  Você pode personalizar seu comportamento atualizando seu
  [arquivo de configuração](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json).

- Um daemon do tipo `CustomPluginMonitor` invoca e verifica vários problemas do nó executando
  scripts definidos pelo usuário. Você pode usar diferentes monitores de plugin personalizados para monitorar diferentes
  problemas e personalizar o comportamento do daemon atualizando o
  [arquivo de configuração](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json).

- Um daemon do tipo `HealthChecker` verifica a integridade do kubelet e do agente de execução de contêiner em um nó.

### Adicionando suporte para outro formato de log {#support-other-log-format}

O monitor de log do sistema atualmente suporta logs baseados em arquivo, journald e kmsg.
Fontes adicionais podem ser adicionadas implementando um novo
[observador de log](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go).

### Adicionando monitores de plugin personalizados

Você pode estender o Node Problem Detector para executar qualquer script de monitor escrito em qualquer linguagem
desenvolvendo um plugin personalizado. Os scripts de monitor devem estar em conformidade com o protocolo do plugin no código de saída
e saída padrão. Para mais informações, consulte a
[proposta de interface de plugin](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).

## Exportador

Um exportador relata os problemas do nó e/ou métricas para determinados backends.
Os seguintes exportadores são suportados:

- **Kubernetes exporter**: este exportador relata problemas do nó para o servidor de API do Kubernetes.
  Problemas temporários são relatados como Events e problemas permanentes são relatados como Node Conditions.

- **Prometheus exporter**: este exportador relata problemas do nó e métricas localmente como métricas
  Prometheus (ou OpenMetrics). Você pode especificar o endereço IP e porta para o exportador usando argumentos
  de linha de comando.

- **Stackdriver exporter**: este exportador relata problemas do nó e métricas para a
  API de Monitoramento do Stackdriver. O comportamento de exportação pode ser personalizado usando um
  [arquivo de configuração](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json).

<!-- discussion -->

## Recomendações e restrições

É recomendado executar o Node Problem Detector em seu cluster para monitorar a integridade do nó.
Ao executar o Node Problem Detector, você pode esperar sobrecarga adicional de recursos em cada nó.
Geralmente isso é aceitável, porque:

* O log do kernel cresce relativamente devagar.
* Um limite de recurso é definido para o Node Problem Detector.
* Mesmo sob alta carga, o uso de recursos é aceitável. Para mais informações, consulte o
  [resultado de benchmark](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629) do Node Problem Detector.

