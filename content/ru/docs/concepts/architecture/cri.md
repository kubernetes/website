---
title: Container Runtime Interface (CRI)
content_type: concept
weight: 50
---

<!-- overview -->

Интерфейс CRI позволяет kubelet работать с различными исполняемыми средами контейнеров без необходимости перекомпиляции компонентов кластера.

{{<glossary_tooltip text="Исполняемая среда контейнеров" term_id="container-runtime">}} должна работать на всех узлах кластера, чтобы {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} мог запускать {{< glossary_tooltip text="Pod'ы" term_id="pod" >}} и их контейнеры.

{{< glossary_definition prepend="Интерфейс Kubernetes Container Runtime Interface (CRI)" term_id="container-runtime-interface" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet выступает в роли клиента при подключении к исполняемой среде через gRPC. Конечные точки ImageService и RuntimeService должны быть доступны в исполняемой среде контейнеров; в kubelet их можно настроить независимо с помощью [флагов командной строки](/docs/reference/command-line-tools-reference/kubelet) `--image-service-endpoint` и `--container-runtime-endpoint`.

В Kubernetes v{{< skew currentVersion >}} kubelet предпочитает использовать CRI `v1`. Если исполняемая среда контейнера не поддерживает `v1` CRI, kubelet пытается перейти на более старую поддерживаемую версию. В версии v{{< skew currentVersion >}} kubelet также может работать с CRI `v1alpha2`, но эта версия считается устаревшей. Если согласовать поддерживаемую версию CRI не удается, узел не регистрируется.

## Обновление

При обновлении Kubernetes kubelet автоматически выбирает последнюю версию CRI при перезапуске компонента. Если это не удается, происходит откат, как описано выше. Если повторный вызов gRPC произошел из-за обновления исполняемой среды контейнера, последняя также должна поддерживать первоначально выбранную версию, иначе повторный вызов будет неудачным. Для этого требуется перезапуск kubelet'а.

## {{% heading "whatsnext" %}}

- Дополнительная информация о [протоколе CRI](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
