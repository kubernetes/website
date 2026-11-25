---
title: Обмеження використання сховища
content_type: task
weight: 240
---

<!-- overview -->

Цей приклад демонструє, як обмежити обсяг використання сховища в просторі імен.

У демонстрації використовуються такі ресурси: [ResourceQuota](/docs/concepts/policy/resource-quotas/), [LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/), та [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Сценарій: Обмеження використання сховища {#scenario-limiting-storage-consumption}

Адміністратор кластера керує кластером від імені користувачів і хоче контролювати, скільки сховища може використати один простір імен, щоб контролювати витрати.

Адміністратор хоче обмежити:

1. Кількість PersistentVolumeClaim у просторі імен
2. Обсяг сховища, який може запитати кожен PVC
3. Загальний обсяг сховища, який може мати простір імен

## LimitRange для обмеження запитів на сховище {#limitrange-to-limit-requests-for-storage}

Додавання `LimitRange` до простору імен встановлює мінімальний і максимальний розмір запитів на сховище. Сховище запитується через `PersistentVolumeClaim`. Контролер допуску, який забезпечує дотримання LimitRange, відхилить будь-який PVC, розмір якого більший або менший за значення, встановлені адміністратором.

У цьому прикладі PVC, що запитує 10Gi сховища, буде відхилено, оскільки це перевищує максимум у 2Gi.

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```

Мінімальні запити на сховище використовуються, коли базовий постачальник сховища вимагає певних мінімумів. Наприклад, томи AWS EBS мають мінімум 1Gi.

## ResourceQuota для обмеження кількості PVC та загальної місткості сховища {#resourcequota-to-limit-pvc-count-and-cumulative-storage-capacity}

Адміністратори можуть обмежити кількість PVC в просторі імен, а також загальну місткість цих PVC. Нові PVC, які перевищують будь-яке максимальне значення, будуть відхилені.

У цьому прикладі шостий PVC у просторі імен буде відхилено, оскільки це перевищує максимальну кількість 5. Крім того, максимальна квота 5Gi у поєднанні з наведеним вище максимальним обмеженням 2Gi не дозволить мати 3 PVC по 2Gi кожен. Це було б 6Gi, запитаних для простору імен з обмеженням 5Gi.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

## Підсумок {#summary}

LimitRange може встановити верхню межу обсягу запитуваного сховища, тоді як квота ресурсів може ефективно обмежити обсяг сховища, який використовує простір імен, через кількість PVC і загальну місткість сховища. Це дає змогу адміністратору кластера планувати бюджет сховища кластера без ризику, що якийсь проєкт перевищить виділений йому обсяг.
