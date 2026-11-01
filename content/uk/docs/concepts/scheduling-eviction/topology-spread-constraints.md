---
title: Обмеження топології розміщення Podʼів
content_type: concept
weight: 40
---

<!-- overview -->

Ви можете використовувати _обмеження топології розміщення_ для контролю того, як {{< glossary_tooltip text="Podʼи" term_id="Pod" >}} розподіляються по вашому кластеру серед доменів відмов, таких як регіони, зони, вузли та інші визначені користувачем топологічні домени. Це може допомогти забезпечити високу доступність, а також ефективне використання ресурсів.

Ви можете встановити [обмеження на рівні кластера](#cluster-level-default-constraints) як стандартні або налаштувати обмеження топології розміщення для окремих робочих навантажень.

<!-- body -->

## Мотивація {#motivation}

Уявіть, що у вас є кластер, у якому до двадцяти вузлів, і ви хочете запустити {{< glossary_tooltip text="робоче навантаження" term_id="workload" >}}, яке автоматично масштабує кількість реплік, які використовує. Це може бути лише два Podʼи або аж пʼятнадцять. Коли є лише два Podʼи, ви б воліли, щоб обидва ці Podʼи не працювали на одному вузлі: ви ризикуєте, що відмова одного вузла зробить ваше робоче навантаження недоступним.

Крім цього базового використання, є кілька прикладів розширеного використання, які дають вашим робочим навантаженням змогу отримувати переваги у високій доступності та використанні кластера.

Під час масштабування та запуску більшої кількості Podʼів важливою стає інша проблема. Уявіть, що у вас є три вузли, на кожному з яких працює по пʼять Podʼів. Вузли мають достатню місткість для запуску такої кількості реплік; проте клієнти, які взаємодіють із цим робочим навантаженням, розподілені по трьох різних центрах обробки даних (або інфраструктурних зонах). Тепер вас менше турбує відмова одного вузла, але ви помічаєте, що затримка вища, ніж вам хотілося б, і ви платите за мережеві витрати, повʼязані з передаванням мережевого трафіку між різними зонами.

Ви вирішуєте, що за нормальної роботи ви б воліли мати приблизно однакову кількість реплік, [запланованих](/docs/concepts/scheduling-eviction/) у кожну інфраструктурну зону, і хотіли б, щоб кластер самозцілювався в разі виникнення проблеми.

Обмеження топології розміщення Podʼів пропонують вам декларативний спосіб це налаштувати.

## Поле `topologySpreadConstraints` {#topologyspreadconstraints-field}

У API Pod є поле `spec.topologySpreadConstraints`. Використання цього поля виглядає так:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Налаштувати обмеження топології розміщення
  topologySpreadConstraints:
    - maxSkew: <ціле число>
      minDomains: <ціле число> # необовʼязково
      topologyKey: <рядок>
      whenUnsatisfiable: <рядок>
      labelSelector: <обʼєкт>
      matchLabelKeys: <список> # необовʼязково; бета з v1.27
      nodeAffinityPolicy: [Honor|Ignore] # необовʼязково; бета з v1.26
      nodeTaintsPolicy: [Honor|Ignore] # необовʼязково; бета з v1.26
  ### інші поля Pod тут
```

{{< note >}}
Для заданої пари значень `topologyKey` та `whenUnsatisfiable` може бути лише один `topologySpreadConstraint`. Наприклад, якщо ви визначили `topologySpreadConstraint`, що використовує `topologyKey` "kubernetes.io/hostname" і значення `whenUnsatisfiable` "DoNotSchedule", ви можете додати інший `topologySpreadConstraint` для `topologyKey` "kubernetes.io/hostname" лише в тому випадку, якщо використаєте інше значення `whenUnsatisfiable`.
{{< /note >}}

Додаткову інформацію про це поле можна отримати, виконавши команду `kubectl explain Pod.spec.topologySpreadConstraints` або звернувшись до розділу [планування](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) довідки API для Pod.

### Визначення обмеження топології розміщення {#spread-constraint-definition}

Ви можете визначити один або кілька записів `topologySpreadConstraints`, щоб вказати kube-scheduler, як розмістити кожний вхідний Pod відносно наявних Podʼів у вашому кластері. Ці поля такі:

- **maxSkew** описує ступінь нерівномірності розподілу Podʼів. Ви повинні вказати це поле, а його значення має бути більшим за нуль. Його семантика відрізняється залежно від значення `whenUnsatisfiable`:

  - якщо ви виберете `whenUnsatisfiable: DoNotSchedule`, то `maxSkew` визначає максимально допустиму різницю між кількістю відповідних Podʼів у цільовій топології та _глобальним мінімумом_ (мінімальною кількістю відповідних Podʼів у прийнятному домені або нулем, якщо кількість прийнятних доменів менша за MinDomains). Наприклад, якщо у вас є 3 зони, де кількість відповідних Podʼів становить 2, 2 та 1, а `maxSkew` встановлено на 1, то глобальний мінімум дорівнює 1.
  - якщо ви виберете `whenUnsatisfiable: ScheduleAnyway`, планувальник надає вищий пріоритет топологіям, які допомогли б зменшити перекіс.

- **minDomains** вказує мінімальну кількість прийнятних доменів. Це поле є необовʼязковим. Домен — це певний екземпляр топології. Прийнятний домен — це домен, вузли якого відповідають селектору вузлів.

  <!-- OK to remove this note once v1.29 Kubernetes is out of support -->
  {{< note >}}
  До Kubernetes v1.30 поле `minDomains` було доступне лише за умови, що функціональну можливість [`MinDomainsInPodTopologySpread`](/docs/reference/command-line-tools-reference/feature-gates-removed/#MinDomainsInPodTopologySpread) увімкнено (стандартно увімкнена починаючи з v1.28). У старіших кластерах Kubernetes її може бути явно вимкнено, або поле може бути недоступним.
  {{< /note >}}

  - Значення `minDomains` має бути більшим за 0, якщо його вказано. Ви можете вказати `minDomains` лише разом із `whenUnsatisfiable: DoNotSchedule`.
  - Коли кількість прийнятних доменів з відповідними ключами топології менша за `minDomains`, під час розміщення Podʼів за топологією глобальний мінімум вважається рівним 0, а потім виконується обчислення `skew`. Глобальний мінімум — це мінімальна кількість відповідних Podʼів у прийнятному домені або нуль, якщо кількість прийнятних доменів менша за `minDomains`.
  - Коли кількість прийнятних доменів з відповідними ключами топології дорівнює `minDomains` або більша за нього, це значення не впливає на планування.
  - Якщо ви не вказуєте `minDomains`, обмеження поводиться так, ніби `minDomains` дорівнює 1.

- **topologyKey** — ключ [міток вузла](#node-labels). Вузли, які мають мітку з цим ключем та однаковими значеннями, вважаються такими, що належать до однієї топології. Кожен екземпляр топології (іншими словами, пара <ключ, значення>) називається доменом. Планувальник намагатиметься розмістити збалансовану кількість Podʼів у кожному домені. Також ми визначаємо прийнятний домен як домен, вузли якого відповідають вимогам nodeAffinityPolicy та nodeTaintsPolicy.

- **whenUnsatisfiable** вказує, що робити з Podʼом, якщо він не задовольняє обмеження топології розміщення:
  - `DoNotSchedule` (стандартно) вказує планувальнику не планувати його.
  - `ScheduleAnyway` вказує планувальнику все одно його планувати, надаючи пріоритет вузлам, що мінімізують перекіс.

- **labelSelector** використовується для пошуку відповідних Podʼів. Podʼи, які відповідають цьому селектору міток, враховуються для визначення кількості Podʼів у відповідному топологічному домені. Докладніше дивіться в розділі [Селектори міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors).

- **matchLabelKeys** — це список ключів міток Podʼа для вибору групи Podʼів, для яких буде обчислено перекіс розподілу. Під час створення Podʼа kube-apiserver використовує ці ключі для пошуку значень у мітках вхідного Podʼа, і ці мітки ключ-значення буде обʼєднано з наявним `labelSelector`. Один і той самий ключ не може бути одночасно в `matchLabelKeys` і в `labelSelector`. `matchLabelKeys` не можна встановити, якщо не встановлено `labelSelector`. Ключі, яких немає в мітках Podʼа, буде проігноровано. Значення null або порожній список означає відповідність лише `labelSelector`.

  {{< caution >}}
  Не рекомендується використовувати `matchLabelKeys` з мітками, які можуть бути оновлені безпосередньо в Podʼах. Навіть якщо ви **безпосередньо** редагуєте мітку Podʼа, вказану в `matchLabelKeys` (тобто ви редагуєте Pod, а не Deployment), kube-apiserver не відображає оновлення мітки в обʼєднаному `labelSelector`.
  {{< /caution >}}

  З `matchLabelKeys` вам не потрібно оновлювати `pod.spec` між різними ревізіями. Контролеру/оператору достатньо встановити різні значення для того самого ключа мітки для різних ревізій. Наприклад, якщо ви налаштовуєте Deployment, ви можете використовувати мітку з ключем [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label), яка автоматично додається контролером Deployment, щоб розрізняти різні ревізії в одному Deployment.

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
  Поле `matchLabelKeys` є полем рівня бета і стандартно увімкнене у 1.27. Ви можете вимкнути його, вимкнувши функціональну можливість [`MatchLabelKeysInPodTopologySpread`](/docs/reference/command-line-tools-reference/feature-gates/#MatchLabelKeysInPodTopologySpread).

  До v1.34 `matchLabelKeys` оброблявся неявно. Починаючи з v1.34, мітки ключ-значення, що відповідають `matchLabelKeys`, явно обʼєднуються з `labelSelector`. Ви можете вимкнути це й повернутися до попередньої поведінки, вимкнувши функціональну можливість [`MatchLabelKeysInPodTopologySpreadSelectorMerge`](/docs/reference/command-line-tools-reference/feature-gates/#MatchLabelKeysInPodTopologySpreadSelectorMerge) у kube-apiserver.
  {{< /note >}}

- **nodeAffinityPolicy** вказує, як ми будемо обробляти nodeAffinity/nodeSelector Podʼа під час обчислення перекосу топології розміщення Podʼів. Варіанти:
  - Honor: до розрахунків включаються лише вузли, які відповідають nodeAffinity/nodeSelector.
  - Ignore: nodeAffinity/nodeSelector ігноруються. До розрахунків включаються всі вузли.

  Якщо це значення є null, поведінка еквівалентна політиці Honor.

  {{< note >}}
  Поле `nodeAffinityPolicy` було полем рівня бета з v1.26 і стало загальнодоступним (GA) у v1.33. У бета-версії воно стандартно увімкнене, і ви можете вимкнути його, вимкнувши функціональну можливість [`NodeInclusionPolicyInPodTopologySpread`](/docs/reference/command-line-tools-reference/feature-gates/#NodeInclusionPolicyInPodTopologySpread).
  {{< /note >}}

- **nodeTaintsPolicy** вказує, як ми будемо обробляти taints вузлів під час обчислення перекосу топології розміщення Podʼів. Варіанти:
  - Honor: включаються вузли без taints, а також вузли з taints, для яких вхідний Pod має toleration.
  - Ignore: taints вузла ігноруються. Включаються всі вузли.

  Якщо це значення є null, поведінка еквівалентна політиці Ignore.

  {{< note >}}
  Поле `nodeTaintsPolicy` було полем рівня бета з v1.26 і стало загальнодоступним (GA) у v1.33. У бета-версії воно стандартно увімкнене, і ви можете вимкнути його, вимкнувши функціональну можливість [`NodeInclusionPolicyInPodTopologySpread`](/docs/reference/command-line-tools-reference/feature-gates/#NodeInclusionPolicyInPodTopologySpread).
  {{< /note >}}

Коли Pod визначає більше одного `topologySpreadConstraint`, ці обмеження поєднуються за допомогою логічної операції AND: kube-scheduler шукає для вхідного Podʼа вузол, який задовольняє всі налаштовані обмеження.

### Мітки вузлів {#node-labels}

Обмеження топології розміщення ґрунтуються на мітках вузлів, які визначають топологічні домени кожного {{< glossary_tooltip text="вузла" term_id="node" >}}. Наприклад, вузол може мати такі мітки:

```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
Для стислості в цьому прикладі не використовуються [відомі](/docs/reference/labels-annotations-taints/) ключі міток `topology.kubernetes.io/zone` та `topology.kubernetes.io/region`. Однак рекомендується використовувати саме ці зареєстровані ключі міток, а не приватні (некваліфіковані) ключі міток `region` та `zone`, які використовуються тут.

Ви не можете робити надійних припущень щодо значення приватного ключа мітки в різних контекстах.
{{< /note >}}

Припустимо, у вас є кластер із 4 вузлами з такими мітками:

```none
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Тоді кластер логічно виглядає так:

{{< mermaid >}}
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

Вам слід встановити однакові обмеження топології розміщення Podʼів для всіх Podʼів у групі.

Зазвичай, якщо ви використовуєте контролер робочого навантаження, такий як Deployment, шаблон Podʼа подбає про це за вас. Якщо ви змішуєте різні обмеження розподілу, Kubernetes дотримується визначення цього поля в API; однак поведінка з більшою ймовірністю стане заплутаною, а усунення несправностей буде менш простим.

Вам потрібен механізм, що забезпечує узгоджені мітки на всіх вузлах топологічного домену (наприклад, регіону хмарного провайдера). Щоб вам не доводилося додавати мітки до вузлів вручну, більшість кластерів автоматично заповнюють відомі мітки, такі як `kubernetes.io/hostname`. Перевірте, чи підтримує це ваш кластер.

## Приклади обмежень топології розміщення {#topology-spread-constraint-examples}

### Приклад: одне обмеження топології розміщення {#example-one-topologyspreadconstraint}

Припустимо, у вас є кластер із 4 вузлами, де 3 Podʼи з міткою `foo: bar` розташовані на вузлах node1, node2 та node3 відповідно:

{{< mermaid >}}
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

Якщо ви хочете, щоб вхідний Pod був рівномірно розподілений разом із наявними Podʼами по зонах, ви можете використати маніфест, схожий на такий:

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

У цьому маніфесті `topologyKey: zone` означає, що рівномірний розподіл буде застосовуватися лише до вузлів, які мають мітку `zone: <будь-яке значення>` (вузли, які не мають мітки `zone`, буде пропущено). Поле `whenUnsatisfiable: DoNotSchedule` вказує планувальнику залишити вхідний Pod в очікуванні, якщо планувальник не може знайти спосіб задовольнити обмеження.

Якщо планувальник розмістить цей вхідний Pod у зоні `A`, розподіл Podʼів стане `[3, 1]`. Це означає, що фактичний перекіс становить 2 (обчислюється як `3 - 1`), що порушує `maxSkew: 1`. Щоб задовольнити обмеження та умови цього прикладу, вхідний Pod може бути розміщений лише на вузлі в зоні `B`:

{{< mermaid >}}
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

{{< mermaid >}}
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

- Змініть `maxSkew` на більше значення, наприклад `2`, щоб вхідний Pod також можна було розмістити в зоні `A`.
- Змініть `topologyKey` на `node`, щоб рівномірно розподілити Podʼи по вузлах, а не по зонах. У наведеному вище прикладі, якщо `maxSkew` залишиться `1`, вхідний Pod може бути розміщений лише на вузлі `node4`.
- Змініть `whenUnsatisfiable: DoNotSchedule` на `whenUnsatisfiable: ScheduleAnyway`, щоб вхідний Pod завжди був придатним для планування (за умови, що вимоги інших API планування задоволено). Однак перевага надається розміщенню в топологічному домені, який має менше відповідних Podʼів. (Памʼятайте, що ця перевага нормалізується разом з іншими внутрішніми пріоритетами планування, такими як коефіцієнт використання ресурсів.)

### Приклад: кілька обмежень топології розміщення {#example-multiple-topologyspreadconstraints}

Цей приклад базується на попередньому. Припустимо, у вас є кластер із 4 вузлами, де 3 наявні Podʼи з міткою `foo: bar` розташовані на вузлах node1, node2 і node3 відповідно:

{{< mermaid >}}
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

Ви можете поєднати два обмеження топології розміщення, щоб контролювати розподіл Podʼів як за вузлами, так і за зонами:

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

У цьому випадку, щоб відповідати першому обмеженню, вхідний Pod може бути розміщений лише на вузлах у зоні `B`; тоді як згідно з другим обмеженням вхідний Pod може бути запланований лише на вузол `node4`. Планувальник розглядає лише варіанти, які задовольняють усі визначені обмеження, тому єдиним допустимим розміщенням є вузол `node4`.

### Приклад: конфліктні обмеження топології розміщення {#example-conflicting-topologyspreadconstraints}

Кілька обмежень можуть призвести до конфліктів. Припустимо, у вас є кластер із 3 вузлами у 2 зонах:

{{< mermaid >}}
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

Якщо ви застосуєте [`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml) (маніфест із попереднього прикладу) до **цього** кластера, ви побачите, що Pod `mypod` залишається у стані `Pending`. Це відбувається тому, що для задоволення першого обмеження Pod `mypod` може бути розміщений лише в зоні `B`; тоді як згідно з другим обмеженням Pod `mypod` може бути запланований лише на вузол `node2`. Перетин двох обмежень дає порожню множину, і планувальник не може розмістити Pod.

Щоб вийти з цієї ситуації, ви можете або збільшити значення `maxSkew`, або змінити одне з обмежень, щоб воно використовувало `whenUnsatisfiable: ScheduleAnyway`. Залежно від обставин, ви також можете вирішити видалити наявний Pod вручну — наприклад, якщо ви зʼясовуєте, чому розгортання виправлення помилки не просувається.

#### Взаємодія зі спорідненістю вузлів та селекторами вузлів {#interaction-with-node-affinity-and-node-selectors}

Планувальник пропустить вузли, що не відповідають, в обчисленнях перекосу, якщо у вхідного Podʼа визначено `spec.nodeSelector` або `spec.affinity.nodeAffinity`.

### Приклад: обмеження топології розміщення зі спорідненістю вузлів {#example-topologyspreadconstraints-with-nodeaffinity}

Припустимо, у вас є кластер із 5 вузлами, розташованими в зонах від A до C:

{{< mermaid >}}
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

{{< mermaid >}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

і ви знаєте, що зону `C` потрібно виключити. У цьому випадку ви можете скласти маніфест, як наведено нижче, щоб Pod `mypod` був розміщений у зоні `B`, а не в зоні `C`. Так само Kubernetes враховує і `spec.nodeSelector`.

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

## Неявні домовленості {#implicit-conventions}

Тут є кілька неявних домовленостей, на які варто звернути увагу:

- Відповідними кандидатами можуть бути лише ті Podʼи, що перебувають у тому самому просторі імен, що й вхідний Pod.

- Планувальник розглядає лише ті вузли, у яких одночасно присутні всі `topologySpreadConstraints[*].topologyKey`. Вузли, у яких відсутній будь-який з цих `topologyKeys`, пропускаються. Це означає, що:

  1. будь-які Podʼи, розташовані на цих пропущених вузлах, не впливають на обчислення `maxSkew` — у наведеному вище [прикладі](#example-conflicting-topologyspreadconstraints), припустимо, що вузол `node1` не має мітки "zone", тоді 2 Podʼи буде проігноровано, тому вхідний Pod буде заплановано в зону `A`.
  2. вхідний Pod не має шансів бути запланованим на такі вузли — у наведеному вище прикладі, припустимо, що вузол `node5` має мітку **з помилкою** `zone-typo: zoneC` (і не має встановленої мітки `zone`). Після приєднання вузла `node5` до кластера його буде пропущено, і Podʼи цього робочого навантаження не плануватимуться на нього.

- Враховуйте, що станеться, якщо `topologySpreadConstraints[*].labelSelector` вхідного Podʼа не відповідає його власним міткам. У наведеному вище прикладі, якщо ви видалите мітки вхідного Podʼа, його все ще можна розмістити на вузлах у зоні `B`, оскільки обмеження все ще виконуються. Проте після цього розміщення ступінь незбалансованості кластера залишається без змін — зона `A` все ще має 2 Podʼи з міткою `foo: bar`, а зона `B` має 1 Pod з міткою `foo: bar`. Якщо це не те, що ви очікуєте, оновіть `topologySpreadConstraints[*].labelSelector` робочого навантаження, щоб він відповідав міткам у шаблоні Podʼа.

## Стандартні обмеження на рівні кластера {#cluster-level-default-constraints}

Для кластера можна встановити стандартні обмеження топології розміщення. Стандартні обмеження топології розміщення застосовуються до Podʼа тоді й лише тоді, коли:

- Він не визначає жодних обмежень у своєму `.spec.topologySpreadConstraints`.
- Він належить до Service, ReplicaSet, StatefulSet або ReplicationController.

Стандартні обмеження можна встановити як частину аргументів втулка `PodTopologySpread` у [профілі планування](/docs/reference/scheduling/config/#profiles). Обмеження задаються за допомогою того самого [API, що описаний вище](#topologyspreadconstraints-field), за винятком того, що `labelSelector` має бути порожнім. Селектори обчислюються на основі Services, ReplicaSets, StatefulSets або ReplicationControllers, до яких належить Pod.

Приклад конфігурації може виглядати так:

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

### Вбудовані стандартні обмеження {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Якщо ви не налаштовуєте жодних стандартних обмежень на рівні кластера для топології розміщення Podʼів, то kube-scheduler діє так, ніби ви вказали такі стандартні обмеження топології:

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

Також застарілий втулок `SelectorSpread`, який забезпечує еквівалентну поведінку, стандартно вимкнений.

{{< note >}}
Втулок `PodTopologySpread` не оцінює вузли, які не мають ключів топології, вказаних в обмеженнях розподілу. Це може призвести до іншої стандартної поведінки порівняно із застарілим втулком `SelectorSpread`, коли використовуються стандартні обмеження топології.

Якщо ви не очікуєте, що на ваших вузлах будуть встановлені **обидві** мітки `kubernetes.io/hostname` та `topology.kubernetes.io/zone`, визначте власні обмеження замість використання стандартних обмежень Kubernetes.
{{< /note >}}

Якщо ви не хочете використовувати стандартні обмеження топології розміщення Podʼів для вашого кластера, ви можете вимкнути їх, встановивши `defaultingType` у `List` і залишивши порожнім `defaultConstraints` у конфігурації втулка `PodTopologySpread`:

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

У Kubernetes [спорідненість та антиспорідненість між Podʼами](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) контролюють те, як Podʼи плануються відносно один одного — щільніше або більш розрізнено.

`podAffinity`
: притягує Podʼи; ви можете спробувати упакувати будь-яку кількість Podʼів у відповідні топологічні домени.

`podAntiAffinity`
: відштовхує Podʼи. Якщо ви встановите режим `requiredDuringSchedulingIgnoredDuringExecution`, то в один топологічний домен може бути запланований лише один Pod; якщо ви виберете `preferredDuringSchedulingIgnoredDuringExecution`, то втратите можливість примусово забезпечити дотримання обмеження.

Для точнішого контролю ви можете вказати обмеження топології розміщення, щоб розподіляти Podʼи по різних топологічних доменах — для досягнення високої доступності або економії коштів. Це також може допомогти під час поетапного оновлення робочих навантажень і плавного масштабування реплік.

Докладнішу інформацію див. у розділі [Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation) пропозиції щодо вдосконалення про обмеження топології розміщення Podʼів.

## Відомі обмеження {#known-limitations}

- Немає гарантії, що обмеження залишаться задоволеними під час видалення Podʼів. Наприклад, зменшення масштабу Deployment може призвести до нерівномірного розподілу Podʼів.

  Ви можете використовувати інструмент, такий як [Descheduler](https://github.com/kubernetes-sigs/descheduler), для перебалансування розподілу Podʼів.
- Відповідні Podʼи на вузлах із taints враховуються. Див. [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921).
- Планувальник не має попереднього знання про всі зони або інші топологічні домени кластера. Вони визначаються на основі наявних вузлів у кластері. Це може призвести до проблем у кластерах з автомасштабуванням, коли пул вузлів (або група вузлів) масштабується до нуля вузлів, а ви очікуєте масштабування кластера, оскільки в цьому випадку ці топологічні домени не будуть враховуватися, поки в них не зʼявиться хоча б один вузол.

  Ви можете обійти це, використовуючи автомасштабувальник вузлів, який враховує обмеження топології розміщення Podʼів і знає про загальний набір топологічних доменів.
- Podʼи, які не відповідають власному labelSelector, створюють «Podʼи-привиди» (ghost pods). Якщо мітки Podʼа не відповідають `labelSelector` у його обмеженні топології розміщення, Pod не враховує себе в обчисленнях розподілу. Це означає:
  - Кілька таких Podʼів можуть просто накопичуватися в одній топології (доки не буде створено або видалено відповідні Podʼи), оскільки планування цих Podʼів не змінює результат обчислення розподілу.
  - Обмеження розподілу працює не так, як передбачалося, і, найімовірніше, не відповідає вашим очікуванням.

  Переконайтеся, що мітки вашого Podʼа відповідають `labelSelector` у ваших обмеженнях розподілу. Зазвичай Pod має відповідати селектору власного обмеження топології розміщення.

## {{% heading "whatsnext" %}} {#whats-next}

- У статті блогу [Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/) докладно пояснюється `maxSkew`, а також розглядаються деякі приклади розширеного використання.
- Прочитайте розділ [планування](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) довідки API для Pod.
