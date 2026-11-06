---
title: Підключення обробників до подій життєвого циклу контейнера
weight: 180
---

<!-- overview -->

Ця сторінка показує, як підключати обробники до подій життєвого циклу контейнера. Kubernetes підтримує події postStart і preStop. Kubernetes надсилає подію postStart одразу після запуску контейнера, а подію preStop — безпосередньо перед завершенням контейнера. Контейнер може вказати один обробник для кожної події.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Визначення обробників postStart і preStop {#define-poststart-and-prestop-handlers}

У цій вправі ви створюєте Pod з одним контейнером. Контейнер має обробники для подій postStart і preStop.

Ось файл конфігурації Podʼа:

{{% code_sample file="pods/lifecycle-events.yaml" %}}

У файлі конфігурації видно, що команда postStart записує файл `message` у теку `/usr/share` контейнера. Команда preStop коректно зупиняє nginx. Це корисно, якщо контейнер завершується через збій.

Створіть Pod:

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

Перевірте, що контейнер у Podʼі працює:

    kubectl get pod lifecycle-demo

Отримайте доступ до оболонки контейнера, який працює в Podʼі:

    kubectl exec -it lifecycle-demo -- /bin/bash

У своїй оболонці перевірте, що обробник postStart створив файл `message`:

    root@lifecycle-demo:/# cat /usr/share/message

Вивід показує текст, записаний обробником postStart:

    Hello from the postStart handler

<!-- discussion -->

## Обговорення {#discussion}

Kubernetes надсилає подію postStart одразу після створення контейнера. Однак немає гарантії, що обробник postStart буде викликано раніше за точку входу контейнера. Обробник postStart виконується асинхронно відносно коду контейнера, але керування контейнером з боку Kubernetes блокується, доки обробник postStart не завершиться. Статус контейнера не стає RUNNING, доки обробник postStart не завершиться.

Kubernetes надсилає подію preStop безпосередньо перед завершенням контейнера. Керування контейнером з боку Kubernetes блокується до завершення обробника preStop, якщо тільки не минає пільговий період Podʼа. Докладніше дивіться [Життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/).

{{< note >}}
Kubernetes надсилає подію preStop лише тоді, коли Pod або контейнер у Podʼі *завершується примусово* (terminated). Це означає, що хук preStop не викликається, коли Pod *завершив роботу* (completed). Докладніше про це обмеження дивіться в розділі [Хуки контейнера](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks).
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [хуки життєвого циклу контейнера](/docs/concepts/containers/container-lifecycle-hooks/).
* Дізнайтеся більше про [життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/).

### Довідка {#reference}

* [Життєвий цикл](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Контейнер](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* Дивіться `terminationGracePeriodSeconds` у [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
