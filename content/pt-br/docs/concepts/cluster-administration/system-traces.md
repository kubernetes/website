---
title: Rastreamentos para Componentes do Sistema Kubernetes
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Os rastreamentos de componentes do sistema registram a latência e os relacionamentos entre as operações no cluster.

Os componentes do Kubernetes emitem rastreamentos usando o
[OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/)
com o exportador gRPC e podem ser coletados e roteados para backends de rastreamento usando um
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector).

<!-- body -->

## Coleta de Rastreamento

Os componentes do Kubernetes possuem exportadores gRPC embutidos para OTLP para exportar rastreamentos,
seja com um OpenTelemetry Collector, ou sem um OpenTelemetry Collector.

Para um guia completo sobre coleta de rastreamentos e uso do coletor, consulte
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/).
No entanto, existem algumas coisas a serem observadas que são específicas dos componentes do Kubernetes.

Por padrão, os componentes do Kubernetes exportam rastreamentos usando o exportador grpc para OTLP na
[porta IANA do OpenTelemetry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry), 4317.
Como exemplo, se o coletor estiver sendo executado como um sidecar de um componente do Kubernetes,
a seguinte configuração de receptor coletará spans e os registrará na saída padrão:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # Substitua este exportador pelo exportador do seu backend
  exporters:
    debug:
      verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
```

Para emitir rastreamentos diretamente para um backend sem utilizar um coletor,
especifique o campo endpoint no arquivo de configuração de rastreamento do Kubernetes com o endereço do backend de rastreamento desejado.
Este método elimina a necessidade de um coletor e simplifica a estrutura geral.

Para configuração de cabeçalhos do backend de rastreamento, incluindo detalhes de autenticação, variáveis de ambiente podem ser usadas com `OTEL_EXPORTER_OTLP_HEADERS`,
consulte [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/).

Além disso, para configuração de atributos de recurso de rastreamento, como nome do cluster Kubernetes, namespace, nome do Pod, etc.,
variáveis de ambiente também podem ser usadas com `OTEL_RESOURCE_ATTRIBUTES`, consulte [OTLP Kubernetes Resource](https://opentelemetry.io/docs/specs/semconv/resource/k8s/).

## Rastreamentos de componentes

### Rastreamentos do kube-apiserver

O kube-apiserver gera spans para requisições HTTP de entrada e para requisições de saída
para webhooks, etcd e requisições reentrantes. Ele propaga o
[W3C Trace Context](https://www.w3.org/TR/trace-context/) com requisições de saída,
mas não faz uso do contexto de rastreamento anexado às requisições de entrada,
pois o kube-apiserver frequentemente é um endpoint público.

#### Habilitando rastreamento no kube-apiserver

Para habilitar o rastreamento, forneça ao kube-apiserver um arquivo de configuração de rastreamento
com `--tracing-config-file=<caminho-para-config>`. Este é um exemplo de configuração que registra
spans para 1 em 10000 requisições e usa o endpoint padrão do OpenTelemetry:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: TracingConfiguration
# valor padrão
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

Para mais informações sobre a estrutura `TracingConfiguration`, consulte
[API server config API (v1)](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-TracingConfiguration).

### Rastreamentos do kubelet

{{< feature-state feature_gate_name="KubeletTracing" >}}

A interface CRI do kubelet e os servidores http autenticados são instrumentados para gerar
spans de rastreamento. Assim como no apiserver, o endpoint e a taxa de amostragem são configuráveis.
A propagação do contexto de rastreamento também é configurada. A decisão de amostragem de um span raiz é sempre respeitada.
Uma taxa de amostragem de configuração de rastreamento fornecida será aplicada a spans sem um span raiz.
Habilitado sem um endpoint configurado, o endereço padrão do receptor do OpenTelemetry Collector de "localhost:4317" é definido.

#### Habilitando rastreamento no kubelet

Para habilitar o rastreamento, aplique a [configuração de rastreamento](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go).
Este é um trecho de exemplo de uma configuração do kubelet que registra spans para 1 em 10000 requisições e usa o endpoint padrão do OpenTelemetry:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
tracing:
  # valor padrão
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

Se o `samplingRatePerMillion` estiver definido como um milhão (`1000000`), então cada
span será enviado para o exportador.

O kubelet no Kubernetes v{{< skew currentVersion >}} coleta spans da
coleta de lixo, rotina de sincronização de pods, bem como de cada método gRPC.
O kubelet propaga o contexto de rastreamento com requisições gRPC para que
agentes de execução de contêiner com instrumentação de rastreamento, como CRI-O e containerd,
possam associar seus spans exportados ao contexto de rastreamento do kubelet.
Os rastreamentos resultantes terão vínculos hierárquicos entre os spans do kubelet e
do agente de execução de contêiner, fornecendo contexto útil ao depurar problemas
do nó.

Observe que a exportação de spans sempre vem com uma pequena sobrecarga de desempenho
no lado de rede e CPU, dependendo da configuração geral do
sistema. Se houver algum problema desse tipo em um cluster que está sendo executado com
rastreamento habilitado, então mitigue o problema reduzindo o
`samplingRatePerMillion` ou desabilitando completamente o rastreamento removendo a
configuração.

## Estabilidade

A instrumentação de rastreamento ainda está em desenvolvimento ativo e pode mudar
de várias maneiras. Isso inclui nomes de span, atributos anexados,
endpoints instrumentados, etc. Até que esta funcionalidade se torne estável,
não há garantias de retrocompatibilidade para a instrumentação de rastreamento.

## {{% heading "whatsnext" %}}

* Leia sobre [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
* Leia sobre [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)


