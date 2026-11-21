---
title: Автоматичне масштабування служби DNS в кластері
content_type: task
weight: 80
---

<!-- overview -->

Ця сторінка показує, як увімкнути та налаштувати автоматичне масштабування служби DNS у вашому кластері Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Цей посібник передбачає, що ваші вузли використовують архітектуру CPU AMD64 або Intel 64.

* Переконайтеся, що [DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/) увімкнено.

<!-- steps -->

## Визначте, чи вже ввімкнено горизонтальне автоматичне масштабування DNS {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

Перегляньте список {{< glossary_tooltip text="Deployment" term_id="deployment" >}} у вашому кластері в {{< glossary_tooltip text="просторі імен" term_id="namespace" >}} kube-system:

```shell
kubectl get deployment --namespace=kube-system
```

Вивід схожий на такий:

    NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    kube-dns-autoscaler    1/1     1            1           ...
    ...

Якщо ви бачите "kube-dns-autoscaler" у виводі, горизонтальне автоматичне масштабування DNS вже увімкнено, і ви можете перейти до [Налаштування параметрів автоматичного масштабування](#tuning-autoscaling-parameters).

## Отримайте імʼя вашого Deployment DNS {#find-scaling-target}

Перегляньте список Deployment DNS у вашому кластері в просторі імен kube-system:

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

Вивід схожий на такий:

    NAME      READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns   2/2     2            2           ...
    ...

Якщо ви не бачите Deployment для DNS-служб, ви також можете знайти його за імʼям:

```shell
kubectl get deployment --namespace=kube-system
```

і знайдіть Deployment з назвою `coredns`.

Ваша ціль масштабування:

    Deployment/<your-deployment-name>

де `<your-deployment-name>` — це імʼя вашого Deployment DNS. Наприклад, якщо імʼя вашого Deployment для DNS — coredns, ваша ціль масштабування — Deployment/coredns.

{{< note >}}
CoreDNS — це стандартна служба DNS для Kubernetes. CoreDNS встановлює мітку `k8s-app=kube-dns`, щоб працювати в кластерах, які спочатку використовували kube-dns.
{{< /note >}}

## Увімкніть горизонтальне автоматичне масштабування DNS {#enabling-dns-horizontal-autoscaling}

У цьому розділі ви створюєте новий Deployment. Podʼи в Deployment запускають контейнер на основі образу `cluster-proportional-autoscaler-amd64`.

Створіть файл з назвою `dns-horizontal-autoscaler.yaml` з таким вмістом:

{{% code_sample file="admin/dns/dns-horizontal-autoscaler.yaml" %}}

У файлі замініть `<SCALE_TARGET>` на вашу ціль масштабування.

Перейдіть до теки, яка містить ваш файл конфігурації, та введіть цю команду для створення Deployment:

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

Вивід успішної команди:

    deployment.apps/kube-dns-autoscaler created

Тепер горизонтальне автоматичне масштабування DNS увімкнено.

## Налаштування параметрів автоматичного масштабування DNS {#tuning-autoscaling-parameters}

Перевірте, що існує {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} kube-dns-autoscaler:

```shell
kubectl get configmap --namespace=kube-system
```

Вивід схожий на такий:

    NAME                  DATA      AGE
    ...
    kube-dns-autoscaler   1         ...
    ...

Змініть дані в ConfigMap:

```shell
kubectl edit configmap kube-dns-autoscaler --namespace=kube-system
```

Знайдіть цей рядок:

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

Змініть поля відповідно до ваших потреб. Поле "min" вказує мінімальну кількість бекендів DNS. Фактична кількість бекендів обчислюється за цією формулою:

    replicas = max( ceil( cores × 1/coresPerReplica ) , ceil( nodes × 1/nodesPerReplica ) )

Зверніть увагу, що значення як `coresPerReplica`, так і `nodesPerReplica` — це числа з рухомою комою.

Ідея полягає в тому, що, коли кластер використовує вузли з багатьма ядрами, `coresPerReplica` домінує. Коли кластер використовує вузли з меншою кількістю ядер, домінує `nodesPerReplica`.

Існують інші підтримувані шаблони масштабування. Докладні відомості див. у [cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).

## Вимкніть горизонтальне автоматичне масштабування DNS {#disable-dns-horizontal-autoscaling}

Існує кілька варіантів налаштування горизонтального автоматичного масштабування DNS. Який варіант використовувати, залежить від різних умов.

### Варіант 1: Зменшіть кількість реплік Deployment kube-dns-autoscaler до 0 {#option-1-scale-down-the-kube-dns-autoscaler-deployment-to-0-replicas}

Цей варіант працює для всіх ситуацій. Введіть цю команду:

```shell
kubectl scale deployment --replicas=0 kube-dns-autoscaler --namespace=kube-system
```

Вивід:

    deployment.apps/kube-dns-autoscaler scaled

Перевірте, що кількість реплік дорівнює нулю:

```shell
kubectl get rs --namespace=kube-system
```

Вивід показує 0 у стовпцях DESIRED та CURRENT:

    NAME                                  DESIRED   CURRENT   READY   AGE
    ...
    kube-dns-autoscaler-6b59789fc8        0         0         0       ...
    ...

### Варіант 2: Видаліть Deployment kube-dns-autoscaler {#option-2-delete-the-kube-dns-autoscaler-deployment}

Цей варіант працює, якщо kube-dns-autoscaler перебуває під вашим контролем, тобто ніхто не створюватиме його знову:

```shell
kubectl delete deployment kube-dns-autoscaler --namespace=kube-system
```

Вивід:

    deployment.apps "kube-dns-autoscaler" deleted

### Варіант 3: Видаліть файл маніфесту kube-dns-autoscaler з майстер-вузла {#option-3-delete-the-kube-dns-autoscaler-manifest-file-from-the-master-node}

Цей варіант працює, якщо kube-dns-autoscaler перебуває під контролем (застарілого) [Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md), і ви маєте права запису на майстер-вузол.

Увійдіть на майстер-вузол та видаліть відповідний файл маніфесту. Звичайний шлях для цього kube-dns-autoscaler:

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

Після видалення файлу маніфесту Addon Manager видалить Deployment kube-dns-autoscaler.

<!-- discussion -->

## Розуміння того, як працює горизонтальне автоматичне масштабування DNS {#understanding-how-dns-horizontal-autoscaling-works}

* Застосунок cluster-proportional-autoscaler розгортається окремо від служби DNS.

* Pod автомасштабувальника запускає клієнт, який опитує API-сервер Kubernetes, щоб отримати кількість вузлів і ядер у кластері.

* Бажана кількість реплік обчислюється та застосовується до бекендів DNS на основі поточної кількості придатних для планування вузлів і ядер та заданих параметрів масштабування.

* Параметри масштабування та точки даних передаються автомасштабувальнику через ConfigMap, і він оновлює свою таблицю параметрів під час кожного опитування, щоб мати найновіші бажані параметри масштабування.

* Параметри масштабування можна змінювати без перебудови або перезапуску Podʼа автомасштабувальника.

* Автомасштабувальник надає інтерфейс контролера для підтримки двох шаблонів керування: *linear* та *ladder*.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Гарантоване планування для Podʼів критичних надбудов](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
* Дізнайтеся більше про [реалізацію cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
