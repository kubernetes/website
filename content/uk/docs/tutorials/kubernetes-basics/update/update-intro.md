---
title: Виконання поступового оновлення
weight: 10
---

## {{% heading "objectives" %}}

Виконання постійного оновлення застосунку (rolling update) за допомогою kubectl.

## Оновлення застосунку {#updating-an-application}

{{% alert %}}
_Поступові оновлення дозволяють виконувати оновлення Deployment без зупинки роботи застосунку за допомогою поетапного оновлення екземплярів Podʼів._
{{% /alert %}}

Користувачі очікують, що застосунки будуть доступні постійно, а розробники — випускатимуть нові версії по кілька разів на день. У Kubernetes це робиться за допомогою розгортань з поступовим оновленням. **Поступове оновлення (rolling update)** дозволяє виконати оновлення Deployment без перерви в роботі застосунку. Це досягається поетапною заміною поточних Podʼів новими. Нові Podʼи призначаються Вузлам з вільними ресурсами, а Kubernetes чекає, доки ці нові Podʼи не почнуть працювати, перш ніж вилучити старі Podʼи.

У попередньому розділі ми масштабували наш застосунок для запуску кількох екземплярів. Це є вимогою для виконання оновлень без впливу на доступність застосунку. Стандартно максимальна кількість Podʼів, які можуть бути недоступні під час оновлення, та максимальна кількість нових Podʼів, які можуть бути створені, дорівнює одному. Обидві опції можуть бути налаштовані як у вигляді точної кількості, так і у відсотках (від усіх Podʼів). У Kubernetes оновлення мають версії, і будь-яке оновлення Deployment може бути повернуте до попередньої (стабільної) версії.

## Огляд поступового оновлення {#rolling-updates-overview}

<!-- animation -->

{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_Якщо Deployment публічно доступний, Service буде спрямовувати трафік лише на доступні Podʼи, які оброблятимуть запити. Це гарантує, що користувачі застосунку не відчувають перерв у роботі під час оновлення._
{{% /alert %}}

Під час поступового оновлення така поведінка довзоляє застосункам залишатись доступними спрямовуючи трафік тільки до подів, що обробляють запити. Поступові оновлення дозволяють виконувати наступні дії:

* Поширення застосунку з одного середовища в інше (за допомогою оновлень образів контейнерів)
* Відкат до попередніх версій
* Неперервна інтеграція та постійна доставка застосунків без перерви в роботі

У наступному інтерактивному практикумі ми оновимо наш застосунок до нової версії та виконаємо відкат.

### Оновлення версії застосунку {#update-the-version-of-the-app}

Для виведення списку Deploymentʼів виконайте команду `get deployments`:

```shell
kubectl get deployments
```

Для виведення списку запущених Podʼів виконайте команду `get pods`:

```shell
kubectl get pods
```

Для перегляду поточної версії образу застосунку виконайте команду `describe pods` та шукайте поле `Image`:

```shell
kubectl describe pods
```

Для оновлення образу застосунку до версії 2 використовуйте команду `set image`, за якою йде назва Deployment та нова версія образу:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

Команда повідомляє Deployment про використання іншого образу для вашого застосунку та запускає поступове оновлення. Перевірте стан нових Podʼів та подивіться на той, що припиняє роботу, використовуючи команду `get pods`:

```shell
kubectl get pods
```

### Перевірка оновлення {#verify-an-update}

Спочатку перевірте, чи Service працює, бо ви могли його видалити на попередньому кроці, виконайте `describe services/kubernetes-bootcamp`. Якщо його немає, створіть його знов:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Створіть змінну середовища з іменем `NODE_PORT` зі значенням призначеного порту Вузла:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Потім виконайте `curl` з зовнішньою IP-адресою та портом:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Кожен раз, коли ви виконуєте команду `curl`, ви попадете на різні Podʼи. Зверніть увагу, що всі Podʼи зараз працюють на останній версії (`v2`).

Ви також можете підтвердити оновлення, використовуючи команду `rollout status`:

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

Для перегляду поточної версії образу застосунку виконайте команду `describe pods`:

```shell
kubectl describe pods
```

У полі `Image` перевірите, що ви використовуєте останню версію образу (`v2`).

### Відкат оновлення {#roll-back-an-update}

Виконаймо ще одне оновлення та спробуємо розгорнути образ з теґом `v10`:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

Використовуйте `get deployments`, щоб переглянути стан розгортання:

```shell
kubectl get deployments
```

Зверніть увагу, що вивід не вказує бажану кількість доступних Podʼів. Використайте команду `get pods, щоб вивести список всіх Podʼів:

```shell
kubectl get pods
```

Зверніть увагу, що деякі Podʼи мають статус `ImagePullBackOff`.

Щоб отримати більше відомостей про проблему, використовуйте команду `describe pods`:

```shell
kubectl describe pods
```

У розділі `Events` виводу для проблемних Podʼів, зверніть увагу, що версії образу `v10` немає в репозиторії.

Щоб відкотити розгортання до попередньої робочої версії, використовуйте команду `rollout undo`:

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

Команда `rollout undo` повертає розгортання до попередньо відомого стану (`v2` образу). Оновлення мають версії, і ви можете повернутися до будь-якого раніше відомого стану Deployment.

Використайте команду `get pods`, щоб знову вивести список Podʼів:

```shell
kubectl get pods
```

Щоб перевірити образ, розгорнутий на цих Podʼах, використайте команду `describe pods`:

```shell
kubectl describe pods
```

Deployment знову використовує стабільну версію застосунку (`v2`). Відкат був успішним

Не забудьте очистити свій локальний кластер

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

* Дізнайтесь більше про [Deployments](/docs/concepts/workloads/controllers/deployment/).
