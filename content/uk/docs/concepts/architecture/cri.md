---
title: Інтерфейс середовища виконання контейнерів (CRI)
aka:
  - Container Runtime Interface
  - CRI
content_type: concept
weight: 60
---

<!-- overview -->

CRI — це інтерфейс втулка, який дозволяє kubelet використовувати різноманітні середовища виконання контейнерів, не маючи потреби перекомпілювати компоненти кластера.

Для того, щоб {{<glossary_tooltip text="kubelet" term_id="kubelet">}} міг запускати
{{< glossary_tooltip text="Podʼи" term_id="pod" >}} та їхні контейнери, потрібне справне {{<glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime">}} на кожному вузлі в кластері.

{{< glossary_definition prepend="Інтерфейс середовища виконання контейнерів (CRI) —" term_id="cri" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet діє як клієнт при підключенні до середовища виконання контейнерів через gRPC. Endpointʼи служби виконання та образів повинні бути доступні в середовищі виконання контейнерів, це може бути налаштовано окремо в kubelet за допомогою прапорців командного рядка `--image-service-endpoint` [command line flags](/uk/docs/reference/command-line-tools-reference/kubelet).

Для Kubernetes v{{< skew currentVersion >}}, kubelet вибирає CRI `v1`. Якщо середовище виконання контейнерів не підтримує `v1` CRI, то kubelet намагається домовитися про будь-яку підтримувану старішу версію. Kubelet v{{< skew currentVersion >}} також може домовитися про CRI `v1alpha2`, але ця версія вважається застарілою. Якщо kubelet не може домовитися про підтримувану версію CRI, то kubelet припиняє спроби та не реєструє вузол.

## Оновлення {#upgrading}

При оновленні Kubernetes kubelet намагається автоматично вибрати останню версію CRI при перезапуску компонента. Якщо це не вдається, то відбувається відновлення згідно з зазначеними вище. Якщо потрібен перезапуск kubelet через gRPC через оновлення середовища виконання контейнерів, то середовище виконання контейнерів також повинне підтримувати вибрану спочатку версію, інакше очікується що відновлення не відбудеться. Це вимагає перезапуску kubelet.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [визначення протоколу](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto) CRI
