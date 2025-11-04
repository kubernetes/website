---
title: Обмеження поширення топології Podʼів
content_type: concept
weight: 42
---

<!-- overview -->

Ви можете використовувати _обмеження поширення топології_ для контролю того, як {{< glossary_tooltip text="Podʼи" term_id="Pod" >}} розподіляються по вашому кластеру серед доменів відмов, таких як регіони, зони, вузли та інші користувацькі топологічні домени. Це може допомогти забезпечити високу доступність, а також ефективне використання ресурсів.

Ви можете встановлювати типові [обмеження на рівні кластера](#cluster-level-default-constraints) або налаштовувати обмеження поширення топології для окремих навантажень.

<!-- body -->

## Мотивація {#motivation}

Уявіть, що у вас є кластер, в якому до двадцяти вузлів, і ви хочете запустити {{< glossary_tooltip text="навантаження" term_id="workload" >}}, яке автоматично масштабує кількість реплік, які використовує. Тут може бути як два Podʼи, так і пʼятнадцять. Коли є лише два Podʼи, ви б хотіли, щоб обидва ці Podʼи не працювали на одному вузлі: ви ризикуєте, що відмова одного вузла призведе до зникнення доступу до вашого навантаження.

Крім цього основного використання, є деякі приклади використання, які дозволяють вашим навантаженням отримувати переваги високої доступності та використання кластера.

При масштабуванні та запуску більшої кількості Podʼів важливим стає інша проблема. Припустімо, що у вас є три вузли, на яких працюють по пʼять Podʼів кожен. У вузлах достатньо потужності для запуску такої кількості реплік; проте клієнти, які взаємодіють з цим навантаженням, розподілені по трьох різних центрах обробки даних (або зонах інфраструктури). Тепер ви менше хвилюєтеся про відмову одного вузла, але ви помічаєте, що затримка вища, ніж ви хотіли б, і ви платите за мережеві витрати, повʼязані з передачею мережевого трафіку між різними зонами.

Ви вирішуєте, що при нормальній роботі ви б хотіли, щоб у кожній інфраструктурній зоні була приблизно [однакова кількість реплік](/docs/concepts/scheduling-eviction/), і ви хотіли б, щоб кластер самостійно відновлювався у разі виникнення проблеми.

Обмеження поширення топології Podʼів пропонують вам декларативний спосіб налаштування цього.

## Поле `topologySpreadConstraints` {#topologyspreadconstraints-field}

У API Pod є поле `spec.topologySpreadConstraints`. Використання цього поля виглядає так:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Налаштувати обмеження поширення топології
  topologySpreadConstraints:
    - maxSkew: <ціле число>
      minDomains: <ціле число> # необовʼязково
      topologyKey: <рядок>
      whenUnsatisfiable: <рядок>
      labelSelector: <обʼєкт>
      matchLabelKeys: <список> # необовʼязково; бета з v1.27
      nodeAffinityPolicy: [Honor|Ignore] # необовязково; бета з v1.26
      nodeTaintsPolicy: [Honor|Ignore] # необовязково; бета з v1.26
  ### інші поля Pod тут
```

{{< note >}}
Для заданого значення `topologyKey` та `whenUnsatisfiable` може бути лише одне значення `topologySpreadConstraint`. Наприклад, якщо ви визначили `topologySpreadConstraint`, що використовує `topologyKey` "kubernetes.io/hostname" і значення `whenUnsatisfiable` "DoNotSchedule", ви можете додати інший `topologySpreadConstraint` для `topologyKey` "kubernetes.io/hostname" лише в тому випадку, якщо ви використовуєте інше значення `whenUnsatisfiable`.
{{< /note >}}

Додаткову інформацію про це поле можна отримати, запустивши команду `kubectl explain Pod.spec.topologySpreadConstraints` або звернувшись до розділу [планування](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) довідки API для Pod.

### Визначення обмежень поширення топології {#spread-constraints-definition}

Ви можете визначити один або кілька записів `topologySpreadConstraints`, щоб вказати kube-scheduler, як розмістити кожний вхідний Pod у відповідно до наявних Podʼів у всьому кластері. Ці поля включають:

- **maxSkew** описує ступінь нерівномірного поширення Pod. Ви повинні вказати це поле, і число повинно бути більше нуля. Його семантика відрізняється залежно від значення `whenUnsatisfiable`:

  - якщо ви виберете `whenUnsatisfiable: DoNotSchedule`, тоді `maxSkew` визначає максимально допустиму різницю між кількістю відповідних Podʼів у цільовій топології та _глобальним мінімумом_ (мінімальна кількість відповідних Podʼів у прийнятній області або нуль, якщо кількість прийнятних областей менше, ніж MinDomains). Наприклад, якщо у вас є 3 зони з 2, 2 та 1 відповідно відповідних Podʼів, `MaxSkew` встановлено на 1, тоді глобальний мінімум дорівнює 1.
  - якщо ви виберете `whenUnsatisfiable: ScheduleAnyway`, планувальник надає вищий пріоритет топологіям, які допомагають зменшити розрив.

- **minDomains** вказує мінімальну кількість прийнятних областей. Це поле є необовʼязковим. Домен — це певний екземпляр топології. Прийнятний домен — це домен, чиї вузли відповідають селектору вузлів.

  <!-- OK to remove this note once v1.29 Kubernetes is out of support -->
  {{< note >}}
  До Kubernetes v1.30 поле `minDomains` було доступним, якщо [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates-removed/) `MinDomainsInPodTopologySpread` було увімкнено (типово увімкнено починаючи з v1.28). В старіших кластерах Kubernetes воно може бути явно відключеним або поле може бути недоступним.
  {{< /note >}}

  - Значення `minDomains` повинно бути більше ніж 0, коли вказано. Ви можете вказати `minDomains` лише разом з `whenUnsatisfiable: DoNotSchedule`.
  - Коли кількість прийнятних доменів з відповідними ключами топології менше `minDomains`,
    розподіл топології Pod розглядає глобальний мінімум як 0, а потім виконується розрахунок `skew`. Глобальний мінімум — це мінімальна кількість відповідних Podʼів у прийнятному домені, або нуль, якщо кількість прийнятних доменів менше, ніж `minDomains`.
  - Коли кількість прийнятних доменів з відповідними ключами топології дорівнює або більше
    `minDomains`, це значення не впливає на планування.
  - Якщо ви не вказуєте `minDomains`, обмеження поводиться так, як якби `minDomains` дорівнював 1.

- **topologyKey** — ключ [міток вузла](#node-labels). Вузли, які мають мітку з цим ключем і ідентичними значеннями, вважаються присутніми в тій самій топології. Кожен екземпляр топології (іншими словами, пара <ключ, значення>) називається доменом. Планувальник спробує помістити вирівняну кількість Podʼів в кожен домен. Також ми визначаємо прийнятний домен як домен, вузли якої відповідають вимогам nodeAffinityPolicy та nodeTaintsPolicy.

- **whenUnsatisfiable** вказує, як розвʼязувати проблему з Pod, якщо він не відповідає обмеженню поширення:
  - `DoNotSchedule` (типово) вказує планувальнику не планувати його.
  - `ScheduleAnyway` вказує планувальнику все одно його планувати, проте з пріоритетом вибору вузлів, що мінімізують розрив.

- **labelSelector** використовується для знаходження відповідних Podʼів. Podʼи, які відповідають цьому селектору міток, враховуються для визначення кількості Podʼів у відповідному домені топології. Дивіться [селектори міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors) для отримання додаткових відомостей.

- **matchLabelKeys** — це список ключів міток Podʼа для вибору Podʼів, відносно яких буде розраховано поширення. При створенні Podʼа kube-apiserver використовує ці ключі для пошуку значень з вхідних міток Podʼа, і ці мітки ключ-значення будуть обʼєднані з будь-яким наявним `labelSelector`. Існування однакового ключа заборонене як у `matchLabelKeys`, так і в `labelSelector`. `matchLabelKeys` не може бути встановлено, коли `labelSelector` не встановлено. Ключі, яких не існує в мітках Podʼа, будуть проігноровані. Порожній або нульовий список означає, що збіг буде відповідати лише `labelSelector`.

  {{< caution >}}
  Не рекомендується використовувати `matchLabelKeys` з мітками, які можуть бути оновлені безпосередньо на Podʼах. Навіть якщо ви редагуєте мітку Podʼа, яка вказана в `matchLabelKeys` **безпосередньо**, (тобто, ви редагуєте Pod, а не Deployment), kube-apiserver не відображає оновлення мітки на обʼєднаний `labelSelector`.
  {{< /caution >}}

  З `matchLabelKeys` вам не потрібно оновлювати `pod.spec` між різними версіями. Контролер/оператор просто повинен встановити різні значення для того самого ключа мітки для різних версій. Наприклад, якщо ви налаштовуєте Deployment, ви можете використовувати мітку за ключем [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label), яка додається автоматично контролером Deployment, для розрізнення різних версій в одному Deployment.

  ```yaml
      topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            labelSelector:
              matchLabels:
                app: foo
            matchLabelKeys:
              - pod-template-hash
  ```

  {{< note >}}
  Поле `matchLabelKeys` є полем на рівні бета-версії та включено стандартно у 1.27. Ви можете відключити його, вимкнувши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodTopologySpread`.

  До v1.34, `matchLabelKeys` оброблявся неявно. З v1.34, мітки ключ-значення, що відповідають `matchLabelKeys`, явно обʼєднуються з `labelSelector`. Ви можете відключити це і повернутися до попередньої поведінки, вимкнувши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodTopologySpreadSelectorMerge` kube-apiserver.
  {{< /note >}}

- **nodeAffinityPolicy** вказує, як ми будемо обробляти nodeAffinity/nodeSelector Pod, коли розраховуємо розрив поширення топології Podʼів. Опції:
  - Honor: до розрахунків включаються лише вузли, які відповідають nodeAffinity/nodeSelector.
  - Ignore: nodeAffinity/nodeSelector ігноруються. Включаються всі вузли.

  Якщо це значення є null, поведінка еквівалентна політиці Honor.

  {{< note >}}
  Поле `nodeAffinityPolicy` було полем на рівні бета-версії з v1.26 та загальнодоступним з v 1.33. Воно є стандартно увімкеними і ви можете відключити його, вимкнувши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `NodeInclusionPolicyInPodTopologySpread`.
  {{< /note >}}

- **nodeTaintsPolicy** вказує, як ми будемо обробляти заплямованість вузлів при розрахунку
  розриву поширення топології Podʼів. Опції:
  - Honor: включаються вузли без заплямованості, разом з заплямованими вузлами, для яких вхідний Pod має толерантність.
  - Ignore: заплямованість вузла ігноруються. Включаються всі вузли.

  Якщо це значення є null, поведінка еквівалентна політиці Ignore.

  {{< note >}}
  Поле `nodeAffinityPolicy` було полем на рівні бета-версії з v1.26 та загальнодоступним з v 1.33. Воно є стандартно увімкеними і ви можете відключити його, вимкнувши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `NodeInclusionPolicyInPodTopologySpread`.
  {{< /note >}}

Коли Pod визначає більше одного `topologySpreadConstraint`, ці обмеження комбінуються за допомогою операції AND: kube-scheduler шукає вузол для вхідного Podʼа, який задовольняє всі налаштовані обмеження.

### Мітки вузлів {#node-labels}

Обмеження поширення топології ґрунтуються на мітках вузлів для ідентифікації доменів топології, в яких знаходиться кожен {{< glossary_tooltip text="вузол" term_id="node" >}}. Наприклад, вузол може мати такі мітки:

```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
У цьому прикладі не використовуються [відомі](/docs/reference/labels-annotations-taints/) ключі міток `topology.kubernetes.io/zone` та `topology.kubernetes.io/region`. Однак, рекомендується використовувати саме ці зареєстровані ключі міток, а не приватні (непідтверджені) ключі міток `region` та `zone`, які використовуються тут.

Не можна надійно припускати про наявність значення приватного ключа мітки в різних контекстах.
{{< /note >}}

Припустимо, у вас є кластер з 4 вузлами з наступними мітками:

```none
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Тоді кластер логічно виглядає так:

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

## Узгодженість {#consistency}

Вам слід встановити однакові обмеження поширення топології Podʼів для всіх Podʼів у групі.

Зазвичай, якщо ви використовуєте контролер робочого навантаження, такий як Deployment, шаблон Podʼа забезпечує це за вас. Якщо ви комбінуєте різні обмеження поширення, то Kubernetes дотримується визначення API поля; однак, це більш ймовірно призведе до плутанини в поведінці, а усунення несправностей буде менш прямолінійним.

Вам потрібен механізм для забезпечення того, що всі вузли в домені топології (наприклад, регіон хмарного постачальника) мають однакові мітки. Щоб уникнути необхідності ручного маркування вузлів, більшість кластерів автоматично заповнюють відомі мітки, такі як `kubernetes.io/hostname`. Перевірте, чи підтримує ваш кластер це.

## Приклад обмеження розподілу топології {#topology-spread-constraint-example}

### Приклад: одне обмеження розподілу топології {#example-one-topologyspreadconstraint}

Припустимо, у вас є кластер із чотирма вузлами, де 3 Podʼа з міткою `foo: bar` знаходяться на вузлах node1, node2 та node3 відповідно:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Якщо ви хочете, щоб новий Pod рівномірно розподілявся з наявними Podʼами по зонах,
ви можете використовувати маніфест Podʼів, схожий на такий:

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

У цьому маніфесті `topologyKey: zone` означає, що рівномірне поширення буде застосовуватися лише до вузлів, які мають мітку `zone: <будь-яке значення>` (вузли, які не мають мітки `zone`, будуть пропущені). Поле `whenUnsatisfiable: DoNotSchedule` повідомляє планувальнику, що потрібно залишити новий Pod у стані очікування, якщо планувальник не може знайти спосіб задовольнити обмеження.

Якщо планувальник розмістить цей новий Pod у зоні `A`, розподіл Podʼів стане `[3, 1]`. Це означає, що фактичне відхилення складає 2 (розраховане як `3 - 1`), що порушує `maxSkew: 1`. Щоб задовольнити умови обмеження та контекст для цього прикладу, новий Pod може бути розміщений лише на вузлі в зоні `B`.

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

або

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Ви можете змінити специфікацію Podʼа, щоб вона відповідала різним вимогам:

- Змініть `maxSkew` на більше значення, наприклад `2`, щоб новий Pod також можна було розмістити в зоні `A`.
- Змініть `topologyKey` на `node`, щоб рівномірно розподілити Podʼи по вузлах, а не зонам. У вищезазначеному прикладі, якщо `maxSkew` залишиться `1`, новий Pod може бути розміщений лише на вузлі `node4`.
- Змініть `whenUnsatisfiable: DoNotSchedule` на `whenUnsatisfiable: ScheduleAnyway`, щоб гарантувати, що новий Pod завжди можна розмістити (якщо інші API планування задовольняються). Однак перевага надається розміщенню в області топології, яка має менше відповідних Podʼів. (Памʼятайте, що ця перевага спільно нормалізується з іншими внутрішніми пріоритетами планування, такими як відношення використання ресурсів).

### Приклад: декілька обмежень поширення топології {#example-multiple-topologyspreadconstraints}

Цей приклад будується на попередньому. Припустимо, у вашому кластері з 4 вузлами є 3 Podʼа, позначених як `foo: bar`, що знаходяться на вузлі node1, node2 і node3 відповідно:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Ви можете поєднати два обмеження поширення топології, щоб контролювати розподіл Podʼів як за вузлами, так і за зонами:

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

У цьому випадку для збігу з першим обмеженням новий Pod може бути розміщений лише на вузлах у зоні `B`; тоді як для відповідності другому обмеженню новий Pod може бути розміщений лише на вузлі `node4`. Планувальник розглядає лише варіанти, які задовольняють всі визначені обмеження, тому єдине допустиме розташування — це на вузлі `node4`.

### Приклад: конфліктуючі обмеження розподілу топології {#example-conflicting-topologyspreadconstraints}

Кілька обмежень може призвести до конфліктів. Припустимо, у вас є кластер з 3 вузлами у 2 зонах:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Якщо ви застосуєте [`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml) (файл маніфесту з попереднього прикладу) до **цього** кластера, ви побачите, що Pod `mypod` залишається у стані `Pending`. Це трапляється тому, що для задоволення першого обмеження Pod `mypod` може бути розміщений лише у зоні `B`; тоді як для відповідності другому обмеженню Pod `mypod` може бути розміщений лише на вузлі `node2`. Перетин двох обмежень повертає порожній набір, і планувальник не може розмістити Pod.

Щоб подолати цю ситуацію, ви можете або збільшити значення `maxSkew`, або змінити одне з обмежень, щоб використовувати `whenUnsatisfiable: ScheduleAnyway`. Залежно від обставин, ви також можете вирішити видалити наявний Pod вручну — наприклад, якщо ви розвʼязуєте проблему, чому розгортання виправлення помилки не виконується.

#### Взаємодія з селектором вузла та спорідненістю вузла {#interaction-with-node-affinity-and-node-selector}

Планувальник пропустить вузли, що не відповідають, з обчислень нерівності, якщо у вхідного Podʼа визначено `spec.nodeSelector` або `spec.affinity.nodeAffinity`.

### Приклад: обмеження поширення топології зі спорідненістю вузла {#example-topologyspreadconstraints-with-nodeaffinity}

Припустимо, у вас є 5-вузловий кластер, розташований у зонах A до C:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{</mermaid>}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{</mermaid>}}

і ви знаєте, що зону `C` потрібно виключити. У цьому випадку ви можете скласти маніфест, як наведено нижче, щоб Pod `mypod` був розміщений у зоні `B`, а не у зоні `C`. Так само Kubernetes також враховує `spec.nodeSelector`.

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

## Неявні домовленості {#implicit-conventions}

Тут є кілька неявних домовленостей, на які варто звернути увагу:

- Відповідними кандидатами можуть бути лише ті Podʼи, що мають той самий простір імен, що й вхідний Pod.

- Планувальник розглядає лише ті вузли, у яких одночасно присутні всі `topologySpreadConstraints[*].topologyKey`. Вузли, у яких відсутній будь-який з цих `topologyKey`, обминаються. Це означає, що:

  1. будь-які Podʼи, що розташовані на цих обхідних вузлах, не впливають на обчислення `maxSkew` — в прикладі вище, припустимо, що вузол `node1` не має мітки "zone", тоді 2 Podʼи будуть проігноровані, тому вхідний Pod буде заплановано в зону `A`.
  2. вхідний Pod не має шансів бути запланованим на такі вузли — у вищенаведеному прикладі, припустимо, що вузол `node5` має **невірно введену** мітку `zone-typo: zoneC` (і не має жодної встановленої мітки `zone`). Після приєднання вузла `node5` до кластера, він буде обходитися, і Podʼи для цього робочого навантаження не будуть плануватися туди.

- Будьте уважні, якщо `topologySpreadConstraints[*].labelSelector` вхідного Podʼа не відповідає його власним міткам. У вищенаведеному прикладі, якщо ви видалите мітки вхідного Podʼа, він все ще може бути розміщений на вузлах у зоні `B`, оскільки обмеження все ще виконуються. Проте, після цього розміщення ступінь незбалансованості кластера залишається без змін — зона `A` все ще має 2 Podʼи з мітками `foo: bar`, а зона `B` має 1 Pod з міткою `foo: bar`. Якщо це не те, що ви очікуєте, оновіть `topologySpreadConstraints[*].labelSelector` робочого навантаження, щоб відповідати міткам в шаблоні Podʼа.

## Типові обмеження на рівні кластера {#cluster-level-default-constraints}

Можливо встановити типові обмеження поширення топології для кластера. Типово обмеження поширення топології застосовуються до Podʼа лише в тому випадку, якщо:

- Він не визначає жодних обмежень у своєму `.spec.topologySpreadConstraints`.
- Він належить до Service, ReplicaSet, StatefulSet або ReplicationController.

Типові обмеження можна встановити як частину аргументів втулка `PodTopologySpread` в [профілі планувальника](/docs/reference/scheduling/config/#profiles). Обмеження вказуються з тими ж [API вище](#topologyspreadconstraints-field), за винятком того, що `labelSelector` повинен бути пустим. Селектори обчислюються з Service, ReplicaSet, StatefulSet або ReplicationControllers, до яких належить Pod.

Приклад конфігурації може виглядати наступним чином:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```

### Вбудовані типові обмеження {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Якщо ви не налаштовуєте жодних типових обмежень для поширення топології Podʼа на рівні кластера, то kube-scheduler діє так, ніби ви вказали наступні обмеження:

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

Також, типово відключений застарілий втулок `SelectorSpread`, який забезпечує еквівалентну поведінку.

{{< note >}}
Втулок `PodTopologySpread` не оцінює вузли, які не мають вказаних ключів топології в обмеженнях поширення. Це може призвести до іншої типової поведінки порівняно з застарілим втулком `SelectorSpread`, коли використовуються типові обмеження поширення топології.

Якщо ви не очікуєте, що ваші вузли матимуть **обидві** мітки `kubernetes.io/hostname` та `topology.kubernetes.io/zone` встановлені, визначте свої власні обмеження замість використання стандартних значень Kubernetes.
{{< /note >}}

Якщо ви не хочете використовувати типові обмеження поширення топології Podʼа для вашого кластера, ви можете відключити ці типові значення, встановивши `defaultingType` у `List` і залишивши порожніми `defaultConstraints` у конфігурації втулка `PodTopologySpread`:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

## Порівняння з podAffinity та podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

У Kubernetes, [між-Podʼова (анти)спорідненість](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) контролює те, як Podʼи розміщуються відносно один одного — чи ущільнені, чи розріджені.

`podAffinity`
: притягує Podʼи; ви можете намагатися упакувати будь-яку кількість Podʼів в кваліфікуючі топологічні домени.

`podAntiAffinity`
: відштовхує Podʼи. Якщо ви встановите це у режим `requiredDuringSchedulingIgnoredDuringExecution`, тоді тільки один Pod може бути запланований в один топологічний домен; якщо ви виберете   `preferredDuringSchedulingIgnoredDuringExecution`, то ви втратите можливість змусити виконання обмеження.

Для більш точного контролю ви можете вказати обмеження поширення топології для розподілу podʼів по різним топологічним доменам — для досягнення як високої доступності, так і економії коштів. Це також може допомогти в роботі з оновленнями без відмов та плавному
масштабуванні реплік.

Для отримання більш детальної інформації, див. розділ [Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation) пропозиції щодо покращення про обмеження поширення топології Podʼів.

## Відомі обмеження {#known-limitations}

- Немає гарантії, що обмеження залишаться задоволеними при видаленні Podʼів. Наприклад, зменшення масштабування Deployment може призвести до нерівномірного розподілу Podʼів.

  Ви можете використовувати інструменти, такі як [Descheduler](https://github.com/kubernetes-sigs/descheduler), для перебалансування розподілу Podʼів.
- Podʼи, що відповідають заплямованим вузлам, враховуються. Див. [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921).
- Планувальник не має попереднього знання всіх зон або інших топологічних доменів, які має кластер. Вони визначаються на основі наявних вузлів у кластері. Це може призвести до проблем у автоматизованих кластерах, коли вузол (або група вузлів) масштабується до нуля вузлів, і ви очікуєте масштабування кластера, оскільки в цьому випадку ці топологічні домени не будуть враховуватися, поки в них є хоча б один вузол.

  Ви можете обійти це, використовуючи інструменти автоматичного масштабування Вузлів, які враховують обмеження розподілу топології Podʼів та також знають загальний набір топологічних доменів.

## {{% heading "whatsnext" %}}

- У статті блогу [Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/) докладно пояснюється `maxSkew`, а також розглядаються деякі приклади використання.
- Прочитайте розділ [scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) з довідки API для Pod.
