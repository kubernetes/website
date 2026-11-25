---
title: Можливості, оголошені вузлом
content_type: concept
weight: 160
---

<!-- overview -->

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Вузли Kubernetes використовують _оголошені можливості_ для повідомлення про доступність конкретних можливостей, які є новими або вмикаються через feature gate. Компоненти панелі управління використовують цю інформацію для прийняття кращих рішень. Kube-scheduler за допомогою втулка `NodeDeclaredFeatures` гарантує, що Podʼи розміщуються тільки на вузлах, які явно підтримують можливості, необхідні для Podʼа. Крім того, контролер допуску `NodeDeclaredFeatureValidator` перевіряє оновлення Podʼів на відповідність оголошеним можливостям вузла.

Цей механізм допомагає керувати розбіжностями версій і покращувати стабільність кластера, особливо під час оновлення кластера або в середовищах зі змішаними версіями, де не на всіх вузлах можуть бути увімкнені однакові можливості. Він призначений для розробників можливостей Kubernetes, які впроваджують нові можливості на рівні вузлів, і працює у фоновому режимі; розробникам застосунків, які розгортають Podʼи, не потрібно безпосередньо взаємодіяти з цим механізмом.

<!-- body -->

## Як це працює {#how-it-works}

Оголошена можливість — це рядок, який вузол перелічує в полі `.status.declaredFeatures` обʼєкта Node. Кожна можливість, яку можна оголосити, ідентифікує можливість на рівні вузла, яка все ще проходить через етапи розвитку можливостей Kubernetes.

1. **Звіт про можливості Kubelet:** під час запуску kubelet на кожному вузлі виявляє, які керовані можливості Kubernetes наразі увімкнені, і повідомляє про них у полі `.status.declaredFeatures` вузла. У це поле включаються лише можливості, що активно розробляються.
2. **Фільтрування планувальника:** стандартний планувальник kube-scheduler використовує втулок `NodeDeclaredFeatures`. Цей втулок:
    * На етапі `PreFilter` перевіряє `PodSpec`, щоб визначити набір можливостей вузла, необхідних для Podʼа.
    * На етапі `Filter` перевіряє, чи можливості, перелічені в `.status.declaredFeatures` вузла, відповідають вимогам, визначеним для Podʼа. Podʼи не плануються на вузлах, які не мають необхідних можливостей.

    Власні планувальники також можуть використовувати поле `.status.declaredFeatures` для застосування подібних обмежень.
3. **Контроль допуску:** Контролер допуску [`NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator) може відхиляти Podʼи, які вимагають можливостей, не оголошених вузлом, до якого вони привʼязані, запобігаючи проблемам під час оновлення Podʼів.
4. **Допуск Kubelet:** Як останній запобіжний захід, kubelet повторно перевіряє вимоги Podʼа до можливостей на відповідність можливостям, доступним на його вузлі, перед запуском Podʼа, і відхиляє Pod, якщо необхідна можливість відсутня.
5. **Очищення після GA:** Коли можливість стає доступною на всіх вузлах кластера (після того, як можливість переходить до GA і підтримувана розбіжність версій між панеллю управління та вузлами минула), вузли припиняють оголошувати можливість. Це досягається шляхом встановлення максимальної версії (`MaxVersion`) для кожної оголошеної можливості: kubeletʼи новіші за цю версію припиняють перелічувати можливість в `.status.declaredFeatures`, а планувальник і контролер допуску вважають можливість загальнодоступною та припиняють її перевіряти. Можливість зрештою видаляється з набору оголошених можливостей у рамках стандартного очищення можливостей після GA.

## Приклад оголошеної можливості {#example-of-a-declared-feature}

Оголошена можливість `RestartAllContainersOnContainerExits` вказує, що вузол підтримує [перезапуск усіх контейнерів у Podʼі на місці](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers). Коли функціональну можливість [`RestartAllContainersOnContainerExits`](/docs/reference/command-line-tools-reference/feature-gates/#RestartAllContainersOnContainerExits) увімкнено для kubelet, kubelet оголошує цю можливість у статусі свого Node:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: example-node
status:
  declaredFeatures:
  - RestartAllContainersOnContainerExits
```

Pod вимагає цю можливість, якщо один із його контейнерів вказує правило перезапуску з дією `RestartAllContainers`:

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
    restartPolicyRules:      # Перезапустити весь Pod на місці за коду виходу 42
    - action: RestartAllContainers
      exitCodes:
        operator: In
        values: [42]
```

Під час планування цього Podʼа kube-scheduler розглядає лише вузли, які перелічують `RestartAllContainersOnContainerExits` у своєму `.status.declaredFeatures`. У кластері, де лише деякі вузли мають увімкнену цю функціональну можливість (наприклад, у середині оновлення кластера), це запобігає призначенню Podʼа вузлу, чий kubelet ігнорував би правило перезапуску.

Оголошені можливості також обмежують оновлення запущених Podʼів. Наприклад, оголошена можливість `InPlacePodVerticalScalingInitContainers` вказує, що вузол підтримує зміну розміру ресурсів init-контейнерів на місці. Якщо є спроба змінити розмір init-контейнера в запущеному Podʼі, контролер допуску `NodeDeclaredFeatureValidator` відхиляє оновлення, якщо вузол, на якому працює цей Pod, не оголошує цю можливість.

## {{% heading "whatsnext" %}} {#whats-next}

* Прочитайте про [контролер допуску `NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator).
* Детальніше читайте в KEP: [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
