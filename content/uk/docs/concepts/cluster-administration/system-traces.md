---
title: Трейси для системних компонентів Kubernetes
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Трейси системних компонентів реєструють затримки операцій у кластері та звʼязки між ними.

Компоненти Kubernetes надсилають трейси за допомогою [протоколу OpenTelemetry](https://opentelemetry.io/docs/specs/otlp/) з експортером gRPC, а зібрати їх і спрямувати до бекендів трасування можна за допомогою [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector).

<!-- body -->

## Збір трейсів {#trace-collection}

Компоненти Kubernetes мають вбудовані експортери gRPC для OTLP, які експортують трейси через OpenTelemetry Collector або без нього.

Повний посібник зі збору трейсів і використання колектора дивіться в розділі [Початок роботи з OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/). Однак є кілька особливостей, специфічних для компонентів Kubernetes.

Стандартно компоненти Kubernetes експортують трейси за допомогою експортера grpc для OTLP на [порт IANA OpenTelemetry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry), 4317. Наприклад, якщо колектор працює як sidecar-контейнер поруч із компонентом Kubernetes, така конфігурація приймача збиратиме відрізки й записуватиме їх у стандартний вивід:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # Замініть цей експортер на експортер для вашого бекенду
  exporters:
    debug:
      verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
```

Щоб надсилати трейси безпосередньо до бекенду без колектора, вкажіть у полі `endpoint` файлу конфігурації трасування Kubernetes адресу потрібного бекенду трасування. Цей метод усуває потребу в колекторі та спрощує загальну структуру.

Для налаштування заголовків бекенду трасування, зокрема даних автентифікації, можна використовувати змінну середовища `OTEL_EXPORTER_OTLP_HEADERS`, дивіться [Конфігурація експортера OTLP](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/).

Крім того, для налаштування атрибутів ресурсів трейсів, таких як назва кластера Kubernetes, простір імен, назва Podʼа тощо, також можна використовувати змінну середовища `OTEL_RESOURCE_ATTRIBUTES`, дивіться [Ресурс Kubernetes в OTLP](https://opentelemetry.io/docs/specs/semconv/resource/k8s/).

## Трейси компонентів {#component-traces}

### Трейси kube-apiserver {#kube-apiserver-traces}

kube-apiserver генерує відрізки для вхідних HTTP-запитів, а також для вихідних запитів до вебхуків, etcd та повторно вхідних запитів. Він передає [W3C Trace Context](https://www.w3.org/TR/trace-context/) з вихідними запитами, але не використовує контекст трейса, доданий до вхідних запитів, оскільки kube-apiserver часто є публічною точкою доступу.

#### Увімкнення трасування в kube-apiserver {#enabling-tracing-in-the-kube-apiserver}

Щоб увімкнути трасування, передайте kube-apiserver файл конфігурації трасування за допомогою `--tracing-config-file=<шлях-до-конфігурації>`. Ось приклад конфігурації, яка записує відрізки для 1 з 10000 запитів і використовує стандартну точку доступу OpenTelemetry:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: TracingConfiguration
# стандартне значення
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

Докладніше про структуру `TracingConfiguration` дивіться в [API конфігурації API-сервера (v1)](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-TracingConfiguration).

### Трейси kubelet {#kubelet-traces}

{{< feature-state feature_gate_name="KubeletTracing" >}}

Інтерфейс CRI kubelet та його автентифіковані http-сервери інструментовано для генерації відрізків трейсів. Як і для apiserver, точку доступу та частоту відбору можна налаштувати. Поширення контексту трейсів також налаштовується. Рішення батьківського відрізка щодо відбору завжди враховується. Частота відбору з наданої конфігурації трасування застосовується до відрізків без батьківського. Якщо трасування ввімкнено без налаштованої точки доступу, використовується стандартна адреса приймача OpenTelemetry Collector "localhost:4317".

#### Увімкнення трасування в kubelet {#enabling-tracing-in-the-kubelet}

Щоб увімкнути трасування, застосуйте [конфігурацію трасування](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go). Ось приклад фрагмента конфігурації kubelet, що записує відрізки для 1 з 10000 запитів і використовує стандартну точку доступу OpenTelemetry:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
tracing:
  # стандартне значення
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

Якщо `samplingRatePerMillion` встановлено на мільйон (`1000000`), кожен відрізок буде надіслано до експортера.

kubelet у Kubernetes v{{< skew currentVersion >}} збирає відрізки зі збору сміття, процедури синхронізації Podʼів, а також з кожного методу gRPC. kubelet передає контекст трейсів із запитами gRPC, щоб середовища виконання контейнерів з інструментуванням трейсів, такі як CRI-O та containerd, могли повʼязувати свої експортовані відрізки з контекстом трейсів від kubelet. Отримані трейси матимуть звʼязки батько-нащадок між відрізками kubelet і середовища виконання контейнерів, що дає корисний контекст під час налагодження проблем вузла.

Зверніть увагу, що експорт відрізків завжди спричиняє невеликі накладні витрати на мережу та CPU, залежно від загальної конфігурації системи. Якщо в кластері з увімкненим трасуванням виникає така проблема, помʼякшіть її, зменшивши `samplingRatePerMillion` або повністю вимкнувши трасування через видалення конфігурації.

## Стабільність {#stability}

Інструментування трасування все ще активно розробляється і може змінюватися різними способами. Це стосується назв відрізків, приєднаних атрибутів, інструментованих точок доступу тощо. Поки ця можливість не стане стабільною, гарантій зворотної сумісності для інструментування трасування немає.

## {{% heading "whatsnext" %}} {#whats-next}

* Прочитайте про [початок роботи з OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
* Прочитайте про [конфігурацію експортера OTLP](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
