---
title: Оголошені функції вузла
content_type: concept
weight: 160
---

<!-- overview -->

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Вузли Kubernetes використовують _заявлені функції_ для повідомлення про доступність конкретних нових або обмежених функцій. Компоненти панелі управління використовують цю інформацію для прийняття кращих рішень. Kube-scheduler за допомогою втулка `NodeDeclaredFeatures` гарантує, що Podʼи розміщуються тільки на вузлах, які явно підтримують функції, необхідні для Podʼа. Крім того, контролер допуску `NodeDeclaredFeatureValidator` перевіряє оновлення Podʼів на відповідність оголошеним функціям вузла.

Цей механізм допомагає керувати розбіжностями версій і покращувати стабільність кластера, особливо під час оновлення кластера або в середовищах зі змішаними версіями, де не всі вузли можуть мати однакові функції. Він призначений для розробників функцій Kubernetes, які впроваджують нові функції на рівні вузлів, і працює у фоновому режимі; розробники застосунків, які розгортають Podʼи, не повинні безпосередньо взаємодіяти з цією структурою.

<!-- body -->

## Як це працює {#how-it-works}

Заявлена функція — це рядок, який вузол перелічує в полі `.status.declaredFeatures` обʼєкта Node. Кожна функція, яку можна заявити, ідентифікує функцію на рівні вузла, яка все ще проходить через етапи функцій Kubernetes.

1. **Звіт про функції Kubelet:** під час запуску kubelet на кожному вузлі виявляє, які керовані функції Kubernetes наразі ввімкнені, і повідомляє про них у полі `.status.declaredFeatures` вузла. У це поле включаються лише функції, що активно розробляються.
2. **Фільтрування планувальника:** стандартний планувальник kube-scheduler використовує втулок `NodeDeclaredFeatures`. Цей втулок:
    * На етапі `PreFilter` перевіряє `PodSpec`, щоб визначити набір функцій вузла, необхідних для Podʼа.
    * На етапі `Filter` перевіряє, чи функції, перелічені в `.status.declaredFeatures` вузла, відповідають вимогам, визначеним для Podʼа. Podʼи не плануються на вузлах, які не мають необхідних функцій.

    Настроювані планувальники також можуть використовувати поле `.status.declaredFeatures` для застосування подібних обмежень.
3. **Контроль допуску:** Контролер допуску [`NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator) може відхиляти Podʼи, які вимагають функцій, не оголошених вузлом, до якого вони привʼязані, запобігаючи проблемам під час оновлення Podʼів.
4. **Допуск Kubelet:** Як останній запобіжний захід, kubelet повторно перевіряє вимоги Podʼа до функцій на відповідність функціям, доступним на його вузлі, перед запуском Podʼа, і відхиляє Pod, якщо необхідна функція відсутня.
5. **Очищення після GA:** Коли функція стає доступною на всіх вузлах кластера (після того, як функція переходить до GA і підтримувана розбіжність версій між панеллю управління та вузлами минула), вузли припиняють оголошувати функцію. Це досягається шляхом встановлення максимальної версії (`MaxVersion`) для кожної оголошеної функції: kubeletʼи новіші за цю версію припиняють перелічувати функцію в `.status.declaredFeatures`, а планувальник і контролер допуску вважають функцію загальнодоступною та припиняють її перевіряти. Функція зрештою видаляється з набору оголошених функцій у рамках стандартного очищення функцій після GA.

## Приклад оголошеної функції {#example-of-a-declared-feature}

Оголошена функція `RestartAllContainersOnContainerExits` вказує, що вузол підтримує [перезапуск усіх контейнерів у Podʼі на місці](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers). Коли функціональну можливість [`RestartAllContainersOnContainerExits`](/docs/reference/command-line-tools-reference/feature-gates/#RestartAllContainersOnContainerExits) увімкнено для kubelet, kubelet оголошує цю функцію у статусі свого Node:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: example-node
status:
  declaredFeatures:
  - RestartAllContainersOnContainerExits
```

Pod вимагає цю функцію, якщо один із його контейнерів вказує правило перезапуску з дією `RestartAllContainers`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: main
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Never     # Якщо визначено правила, необхідно вказати політику перезапуску контейнера
    restartPolicyRules:      # Перезапустити весь Pod без перезавантаження при коді завершення 42
    - action: RestartAllContainers
      exitCodes:
        operator: In
        values: [42]
```

Під час планування цього Podʼа kube-scheduler розглядає лише вузли, які перелічують `RestartAllContainersOnContainerExits` у своєму `.status.declaredFeatures`. У кластері, де лише деякі вузли мають увімкнену цю функціональну можливість (наприклад, у середині оновлення кластера), це запобігає призначенню Podʼа вузлу, чий kubelet ігнорував би правило перезапуску.

Оголошені функції також обмежують оновлення запущених Podʼів. Наприклад, оголошена функція `InPlacePodVerticalScalingInitContainers` вказує, що вузол підтримує зміну розміру ресурсів init-контейнерів на місці. Якщо є спроба змінити розмір init-контейнера в запущеному Podʼі, контролер допуску `NodeDeclaredFeatureValidator` відхиляє оновлення, якщо вузол, на якому працює цей Pod, не оголошує цю функцію.

## {{% heading "whatsnext" %}}

* Прочитайте про [контролер допуску NodeDeclaredFeatureValidator](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator).
* Детальніше читайте в KEP: [KEP-5328: Оголошені функції вузла](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
