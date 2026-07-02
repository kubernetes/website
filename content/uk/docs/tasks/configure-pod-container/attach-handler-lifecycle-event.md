---
title: Обробники подій життєвого циклу контейнера
weight: 180
---

<!-- overview -->

Ця сторінка показує, як прикріплювати обробники до подій життєвого циклу контейнера. Kubernetes підтримує події postStart та preStop. Kubernetes надсилає подію postStart безпосередньо після того, як контейнер стартує, і він надсилає подію preStop безпосередньо перед завершенням роботи контейнера. Контейнер може вказати один обробник для кожної події.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Визначте обробники postStart та preStop {#define-poststart-and-prestop-handlers}

У цьому завдані ви створите Pod, який має один контейнер. У контейнері встановлені обробники для подій postStart та preStop.

Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/lifecycle-events.yaml" %}}

У файлі конфігурації ви бачите, що команда postStart записує файл `message` в теку `/usr/share` контейнера. Команда preStop відповідним чином вимикає nginx. Це корисно, якщо контейнер перериває роботу через помилку.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
kubectl get pod lifecycle-demo
```

Отримайте доступ до оболонки контейнера, який працює в Podʼі:

```shell
kubectl exec -it lifecycle-demo -- /bin/bash
```

У своїй оболонці перевірте, що обробник postStart створив файл `message`:

```shell
root@lifecycle-demo:/# cat /usr/share/message
```

Вивід показує текст, записаний обробником postStart:

```none
Hello from the postStart handler
```

<!-- discussion -->

## Обговорення {#discussion}

Kubernetes надсилає подію postStart безпосередньо після створення контейнера. Проте, немає гарантії, що обробник postStart буде викликаний перед тим, як буде викликано точку входу контейнера. Обробник postStart працює асинхронно відносно коду контейнера, але керування Kubernetes блокується до завершення обробника postStart. Статус контейнера не встановлюється як RUNNING до завершення обробника postStart.

Kubernetes надсилає подію preStop безпосередньо перед завершенням роботи контейнера. Керування Kubernetes контейнером блокується до завершення обробника preStop, якщо тайм-аут оновлення Podʼа не закінчився. Докладніше див. [Життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/).

{{< note >}}
Kubernetes надсилає подію preStop лише тоді, коли Pod або контейнер у Podʼі *завершується*. Це означає, що обробник preStop не викликається, коли Pod *завершує роботу*. Про це обмеження дізнайтеся більше в розділі [Контейнерні обробники](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks).
{{< /note >}}

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [обробників життєвого циклу контейнера](/docs/concepts/containers/container-lifecycle-hooks/).
* Дізнайтеся більше про [життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/).

### Довідка {#reference}

* [Життєвий цикл](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Контейнер](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* Дивіться `terminationGracePeriodSeconds` в [Spec Podʼа](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
