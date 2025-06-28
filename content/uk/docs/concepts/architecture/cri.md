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

Kubelet діє як клієнт при підключенні до середовища виконання контейнерів через gRPC. Endpointʼи служби виконання та образів повинні бути доступні в середовищі виконання контейнерів, це може бути налаштовано окремо в kubelet за [допомогою прапорця командного рядка](/docs/reference/command-line-tools-reference/kubelet/) `--container-runtime-endpoint`.

Для Kubernetes v1.26 і пізніших версій kubelet вимагає, щоб середовище виконання контейнерів підтримувало API CRI `v1`. Якщо середовище виконання контейнерів не підтримує API `v1`, kubelet не зареєструє вузол.

## Оновлення {#upgrading}

Під час оновлення версії Kubernetes на вузлі kubelet перезапускається. Якщо середовище виконання контейнерів не підтримує API CRI `v1`, kubelet не зможе зареєструватися і повідомить про помилку. Якщо через оновлення середовища виконання контейнера потрібно повторно зробити виклик gRPC, середовище виконання повинно підтримувати API CRI `v1`, щоб зʼєднання було успішним. Для цього може знадобитися перезапуск kubelet після правильного налаштування середовища виконання контейнера.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [визначення протоколу](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto) CRI
