---
title: Автоматичне масштабування служби DNS в кластері
content_type: task
weight: 80
---

<!-- overview -->

Ця сторінка показує, як увімкнути та налаштувати автоматичне масштабування служби DNS у вашому кластері Kubernetes.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Цей посібник передбачає, що ваші вузли використовують архітектуру процесора AMD64 або Intel 64.

* Переконайтеся, що [DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/) увімкнений.

<!-- steps -->

## Визначте, чи вже увімкнуто горизонтальне автоматичне масштабування DNS {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

Перегляньте {{< glossary_tooltip text="Deployment" term_id="deployment" >}}ʼи у вашому кластері у {{< glossary_tooltip text="просторі імен" term_id="namespace" >}} kube-system:

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

Перегляньте Deployment DNS у вашому кластері у просторі імен kube-system:

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

і пошукайте Deployment з назвою `coredns` або `kube-dns`.

Ваша ціль масштабування:

    Deployment/<імʼя вашого розгортання>

де `<імʼя вашого розгортання>` — це імʼя вашого Deployment DNS. Наприклад, якщо імʼя вашого Deployment для DNS — coredns, ваша ціль масштабування — Deployment/coredns.

{{< note >}}
CoreDNS — це стандартна служба DNS в Kubernetes. CoreDNS встановлює мітку `k8s-app=kube-dns`, щоб вона могла працювати в кластерах, які спочатку використовували kube-dns.
{{< /note >}}

## Увімкніть горизонтальне автоматичне масштабування DNS {#enablng-dns-horizontal-autoscaling}

У цьому розділі ви створюєте новий Deployment. Podʼи в Deployment працюють з контейнером на основі образу `cluster-proportional-autoscaler-amd64`.

Створіть файл з назвою `dns-horizontal-autoscaler.yaml` з таким вмістом:

{{% code_sample file="admin/dns/dns-horizontal-autoscaler.yaml" %}}

У файлі замініть `<SCALE_TARGET>` на вашу ціль масштабування.

Перейдіть в теку, яка містить ваш файл конфігурації, та введіть цю команду для створення Deployment:

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
    kube-dns-autoscaler   1

         ...
    ...

Змініть дані в ConfigMap:

```shell
kubectl edit configmap kube-dns-autoscaler --namespace=kube-system
```

Знайдіть цей рядок:

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

Змініть поля відповідно до ваших потреб. Поле "min" вказує на мінімальну кількість резервних DNS. Фактична кількість резервних копій обчислюється за цією формулою:

    replicas = max( ceil( cores × 1/coresPerReplica ) , ceil( nodes × 1/nodesPerReplica ) )

Зверніть увагу, що значення як `coresPerReplica`, так і `nodesPerReplica` — це числа з комою.

Ідея полягає в тому, що, коли кластер використовує вузли з багатьма ядрами, `coresPerReplica` домінує. Коли кластер використовує вузли з меншою кількістю ядер, домінує `nodesPerReplica`.

Існують інші підтримувані шаблони масштабування. Докладні відомості див. у [cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).

## Вимкніть горизонтальне автоматичне масштабування DNS {#disable-dns-horizontal-autoscaling}

Існують декілька варіантів налаштування горизонтального автоматичного масштабування DNS. Який варіант використовувати залежить від різних умов.

### Опція 1: Зменшити масштаб розгортання kube-dns-autoscaler до 0 резервних копій {#option-1-scale-down-the-kube-dns-autoscaler-deployment-to-0-replicas}

Цей варіант працює для всіх ситуацій. Введіть цю команду:

```shell
kubectl scale deployment --replicas=0 kube-dns-autoscaler --namespace=kube-system
```

Вивід:

    deployment.apps/kube-dns-autoscaler scaled

Перевірте, що кількість резервних копій дорівнює нулю:

```shell
kubectl get rs --namespace=kube-system
```

Вивід показує 0 в колонках DESIRED та CURRENT:

    NAME                                  DESIRED   CURRENT   READY   AGE
    ...
    kube-dns-autoscaler-6b59789fc8        0         0         0       ...
    ...

### Опція 2: Видаліть розгортання kube-dns-autoscaler {#option-2-delete-the-kube-dns-autoscaler-deployment}

Цей варіант працює, якщо kube-dns-autoscaler знаходиться під вашим контролем, що означає, що його ніхто не буде знову створювати:

```shell
kubectl delete deployment kube-dns-autoscaler --namespace=kube-system
```

Вивід:

    deployment.apps "kube-dns-autoscaler" deleted

### Опція 3: Видаліть файл маніфесту kube-dns-autoscaler з майстер-вузла {#option-3-delete-the-kube-dns-autoscaler-manifest-file-from-the-master-node}

Цей варіант працює, якщо kube-dns-autoscaler знаходиться під контролем (застарілого) [Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md), і ви маєте права запису на майстер-вузол.

Увійдіть на майстер-вузол та видаліть відповідний файл маніфесту. Загальний шлях для цього kube-dns-autoscaler:

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

Після видалення файлу маніфесту Addon Manager видалить розгортання kube-dns-autoscaler.

<!-- discussion -->

## Розуміння того, як працює горизонтальне автоматичне масштабування DNS {#understanding-how-dns-horizontal-autoscaling-works}

* Застосунок cluster-proportional-autoscaler розгортається окремо від служби DNS.

* Pod автомасштабування працює клієнтом, який опитує сервер API Kubernetes для отримання кількості вузлів та ядер у кластері.

* Обчислюється та застосовується бажана кількість резервних копій на основі поточних запланованих вузлів та ядер та заданих параметрів масштабування.

* Параметри масштабування та точки даних надаються через ConfigMap Podʼа автомасштабування, і він оновлює свою таблицю параметрів щоразу під час періодичного опитування, щоб вона була актуальною з найновішими бажаними параметрами масштабування.

* Зміни параметрів масштабування дозволені без перебудови або перезапуску Podʼа автомасштабування.

* Автомасштабування надає інтерфейс контролера для підтримки двох шаблонів керування: *linear* та *ladder*.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Гарантоване планування для Podʼів критичних надбудов](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
* Дізнайтеся більше про [реалізацію cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
