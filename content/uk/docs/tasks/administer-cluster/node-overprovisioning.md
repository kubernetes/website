---
title: Надлишкове резервування ємності вузлів кластера
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка допоможе вам налаштувати надлишкове резервування ємності {{< glossary_tooltip text="вузлів" term_id="node" >}} у вашому кластері Kubernetes. Надлишкове резервування ємності вузлів — це стратегія, яка проактивно резервує частину обчислювальних ресурсів вашого кластера. Це резервування допомагає зменшити час, необхідний для планування нових Podʼів під час подій масштабування, підвищуючи швидкість реагування вашого кластера на раптові сплески трафіку або потреб робочих навантажень.

Підтримуючи деяку невикористану ємність, ви забезпечуєте негайну доступність ресурсів при створенні нових Podʼів, запобігаючи їх переходу в стан очікування під час масштабування кластера.

## {{% heading "prerequisites" %}} {#before-you-begin}

- Вам потрібен кластер Kubernetes, і інструмент командного рядка kubectl має бути налаштований для звʼязку з вашим кластером.
- Ви вже повинні мати базове розуміння [Deployment](/docs/concepts/workloads/controllers/deployment/), {{< glossary_tooltip text="пріоритету" term_id="pod-priority" >}} Podʼів та {{< glossary_tooltip text="PriorityClass" term_id="priority-class" >}}.
- У вашому кластері має бути налаштований [автомасштабувальник](/docs/concepts/cluster-administration/cluster-autoscaling/), який керує вузлами відповідно до попиту.

<!-- steps -->

## Створіть PriorityClass {#create-a-priorityclass}

Почніть з визначення PriorityClass для Podʼів-заповнювачів. Спочатку створіть PriorityClass з негативним значенням пріоритету, який ви незабаром призначите Podʼам-заповнювачам. Пізніше ви налаштуєте Deployment, який використовує цей PriorityClass.

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

Потім створіть PriorityClass:

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

Далі ви визначите Deployment, який використовує PriorityClass з негативним пріоритетом і запускає мінімальний контейнер. Коли ви додасте його до свого кластера, Kubernetes запустить ці Podʼи-заповнювачі для резервування ємності. Щоразу, коли бракує ємності, панель управління вибере один з цих Podʼів-заповнювачів як першого кандидата для {{< glossary_tooltip text="витіснення" term_id="preemption" >}}.

## Запустіть Podʼи, що запитують ємність вузлів {#run-pods-that-request-node-capacity}

Перегляньте зразок маніфесту:

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

### Оберіть простір імен для Podʼів-заповнювачів {#pick-a-namespace-for-the-placeholder-pods}

Вам слід вибрати або створити {{< glossary_tooltip term_id="namespace" text="простір імен">}}, у якому розміщуватимуться Podʼи-заповнювачі.

### Створіть Deployment-заповнювач {#create-the-placeholder-deployment}

Створіть Deployment на основі цього маніфесту:

```shell
# Змініть назву простору імен "example"
kubectl --namespace example apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

## Налаштуйте запити ресурсів для заповнювачів {#adjust-placeholder-resource-requests}

Налаштуйте запити та обмеження ресурсів для Podʼів-заповнювачів, щоб визначити обсяг надлишково зарезервованих ресурсів, який ви хочете підтримувати. Це резервування гарантує, що певний обсяг CPU та памʼяті залишається доступним для нових Podʼів.

Щоб редагувати Deployment, змініть розділ `resources` у файлі маніфесту Deployment, щоб встановити відповідні запити та обмеження. Ви можете завантажити цей файл локально та відредагувати його за допомогою будь-якого текстового редактора, якому ви надаєте перевагу.

Ви також можете редагувати Deployment за допомогою kubectl:

```shell
kubectl edit deployment capacity-reservation
```

Наприклад, щоб зарезервувати загалом 0.5 CPU та 1GiB памʼяті для 5 Podʼів-заповнювачів, визначте запити та обмеження ресурсів для одного Podʼа-заповнювача таким чином:

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
```

## Встановіть бажану кількість реплік {#set-the-desired-replica-count}

### Розрахуйте загальний обсяг зарезервованих ресурсів {#calculate-the-total-reserved-resources}

<!-- пробіли в кінці рядків у наступному абзаці є значущими -->
Наприклад, з 5 репліками, кожна з яких резервує 0.1 CPU та 200MiB памʼяті:  
Загалом зарезервовано CPU: 5 × 0.1 = 0.5 (у специфікації Podʼа ви вкажете кількість `500m`)  
Загалом зарезервовано памʼяті: 5 × 200MiB = 1GiB (у специфікації Podʼа ви вкажете `1 Gi`)  

Щоб масштабувати Deployment, налаштуйте кількість реплік відповідно до розміру вашого кластера та очікуваного навантаження:

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

Перевірте масштабування:

```shell
kubectl get deployment capacity-reservation
```

Вивід має відображати оновлену кількість реплік:

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

{{< note >}}
Деякі автомасштабувальники, зокрема [Karpenter](/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter), розглядають правила переважної спорідненості як жорсткі правила при розгляді масштабування вузлів. Якщо ви використовуєте Karpenter або інший автомасштабувальник вузлів, який використовує ту саму евристику, кількість реплік, яку ви встановлюєте тут, також встановлює мінімальну кількість вузлів для вашого кластера.
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) та як вони впливають на планування Podʼів.
- Ознайомтеся з [автомасштабуванням вузлів](/docs/concepts/cluster-administration/cluster-autoscaling/), щоб динамічно змінювати розмір вашого кластера відповідно до потреб робочих навантажень.
- Зрозумійте [витіснення Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/) — ключовий механізм, за допомогою якого Kubernetes розвʼязує конкуренцію за ресурси. На тій самій сторінці описано _виселення_, яке менш актуальне для підходу з Podʼами-заповнювачами, але також є механізмом, за допомогою якого Kubernetes реагує на конкуренцію за ресурси.
