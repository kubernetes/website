---
title: Перевищення ємності вузла для кластера
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка допоможе вам налаштувати перевищення ємності {{< glossary_tooltip text="вузла" term_id="node" >}} у вашому кластері Kubernetes. Перевищення ємності вузла — це стратегія, яка проактивно резервує частину обчислювальних ресурсів вашого кластера. Це резервування допомагає зменшити час, необхідний для планування нових podʼів під час подій масштабування, підвищуючи чутливість вашого кластера до раптових сплесків трафіку або навантаження.

Підтримуючи деяку невикористану ємність, ви забезпечуєте негайну доступність ресурсів при створенні нових podʼів, запобігаючи їх переходу в стан очікування під час масштабування кластера.

## {{% heading "prerequisites" %}}

- Вам потрібен кластер Kubernetes, і інструмент командного рядка kubectl має бути налаштований для звʼязку з вашим кластером.
- Ви повинні мати базове розуміння про [Deployments](/docs/concepts/workloads/controllers/deployment/), {{< glossary_tooltip text="пріоритет" term_id="pod-priority" >}} podʼів, та {{< glossary_tooltip text="PriorityClasses" term_id="priority-class" >}}.
- У вашому кластері має бути налаштований з [автомасштабувальник](/docs/concepts/cluster-administration/node-autoscaling/), який керує вузлами на основі попиту.

<!-- steps -->

## Створіть PriorityClass {#create-a-priorityclass}

Почніть з визначення PriorityClass для podʼів-заповнювачів. Спочатку створіть PriorityClass з негативним значенням пріоритету, який ви незабаром призначите podʼам-заповнювачам. Пізніше ви налаштуєте Deployment, яке використовує цей PriorityClass.

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

Потім створіть PriorityClass:

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

Далі ви визначите Deployment, який використовує PriorityClass з негативним пріоритетом і запускає мінімальний контейнер. Коли ви додасте його до свого кластера, Kubernetes запустить ці podʼи-заповнювачі для резервування ємності. У разі нестачі ємності, панель управління вибере один з цих podʼів-заповнювачів як першого кандидата для {{< glossary_tooltip text="випередження" term_id="preemption" >}}.

## Запустіть Podʼи, що запитують ємність вузла {#run-pods-that-request-node-capacity}

Перегляньте зразок маніфесту:

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

### Оберіть простір імен для podʼів-заповнювачів {#pick-a-namespace-for-the-placeholder-pods}

Виберіть, або створіть, {{ < glossary_tooltip text="простір імен" term_id="namespace" >}}, в якому ви будете запускати podʼи-заповнювачі.

### Створіть Deployment-заповнювач {#create-the-placeholder-deployment}

Створіть Deployment на основі цього маніфесту:

```shell
# Змініть `example` на простір імен, який ви вибрали
kubectl --namespace example apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

## Налаштуйте запити ресурсів для заповнювачів {#adjust-placeholder-resource-request}

Налаштуйте запити та обмеження ресурсів для podʼів-заповнювачів, щоб визначити кількість зарезервованих ресурсів, які ви хочете підтримувати. Це резервування забезпечує наявність певної кількості CPU та памʼяті для нових podʼів.

Щоб редагувати Deployment, змініть розділ `resources` у файлі маніфесту Deployment, щоб встановити відповідні запити та обмеження. Ви можете завантажити цей файл локально та відредагувати його за допомогою будь-якого текстового редактора.

Ви можете редагувати маніфест Deployment використовуючи kubectl:

```shell
kubectl edit deployment capacity-reservation
```

Наприклад, щоб зарезервувати 0.5 CPU та 1GiB памʼяті для 5 podʼів-заповнювачів, визначте запити та обмеження ресурсів для одного podʼа-заповнювача наступним чином:

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
```

## Встановіть бажану кількість реплік {#set-the-desired-replica-count}

### Розрахуйте загальні зарезервовані ресурси{#calculate-the-total-reserved-resources}

<!-- пробіли в кінці рядків в наступних абзацах треба зберегти -->
Наприклад, з 5 репліками, кожна з яких резервує 0.1 CPU та 200MiB памʼяті:
Загальна зарезервована емність CPU: 5 × 0.1 = 0.5 (у специфікації podʼа ви напишете кількість `500m`)
Загальна зарезервована памʼять: 5 × 200MiB = 1GiB (у специфікації podʼа ви напишете `1 Gi`)

Щоб масштабувати Deployment, налаштуйте кількість реплік відповідно до розміру вашого кластера та очікуваного навантаження:

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

Перевірте масштабування:

```shell
kubectl get deployment capacity-reservation
```

Вихідні дані повинні відображати оновлену кількість реплік:

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

{{< note >}}
Деякі автомасштабувальники, зокрема [Karpenter](/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter), розглядають правила переважної спорідненості як жорсткі правила при розгляді масштабування вузлів. Якщо ви використовуєте Karpenter або інший автомасштабувальник вузлів, який використовує той самий евристичний підхід, кількість реплік, яку ви встановлюєте тут, також встановлює мінімальну кількість вузлів для вашого кластера.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) та як вони впливають на планування podʼів.
- Дізнайтеся більше про [автомасштабування вузлів](/docs/concepts/cluster-administration/node-autoscaling/), щоб динамічно налаштовувати розмір вашого кластера на основі навантаження.
- Зрозумійте [Випередження podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/), ключовий механізм Kubernetes для обробки конфліктів ресурсів. Та ж сторінка охоплює поняття _виселення_, що менш актуально для підходу з podʼами-заповнювачами, але також є механізмом для Kubernetes для реагування на конфлікти ресурсів.
