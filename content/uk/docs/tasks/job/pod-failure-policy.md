---
title: Обробка повторюваних і неповторюваних збоїв Podʼів за допомогою політики збоїв Podʼа
linkTitle: Обробка збоїв Podʼів за допомогою політики збоїв
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

<!-- overview -->

У цьому документі показано, як використовувати [політику збоїв Podʼа](/docs/concepts/workloads/controllers/job#pod-failure-policy) разом зі стандартною [політикою backoff для збоїв Podʼа](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), щоб краще контролювати обробку збоїв на рівні контейнера або Podʼа в межах {{<glossary_tooltip text="Job" term_id="job">}}.

Визначення політики збоїв Podʼа може допомогти:

* краще використовувати обчислювальні ресурси, уникаючи непотрібних повторних запусків Podʼів.
* уникати збоїв Job через порушення роботи Podʼів (такі як {{<glossary_tooltip text="витіснення" term_id="preemption" >}}, {{<glossary_tooltip text="виселення, ініційоване через API" term_id="api-eviction" >}} або виселення на основі {{<glossary_tooltip text="taint" term_id="taint" >}}).

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви вже маєте знати основи використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Сценарії використання {#usage-scenarios}

Розгляньмо такі сценарії використання для Jobs, які визначають політику збоїв Podʼа:

* [Уникнення непотрібних повторних спроб запуску Podʼів](#pod-failure-policy-failjob)
* [Ігнорування порушень роботи Podʼів](#pod-failure-policy-ignore)
* [Уникнення непотрібних повторних спроб запуску Podʼів на основі власних станів Podʼів](#pod-failure-policy-config-issue)
* [Уникнення непотрібних повторних спроб запуску Podʼів за індексами](#backoff-limit-per-index-failindex)

### Використання політики збоїв Podʼа для уникнення непотрібних повторних спроб запуску Podʼів {#pod-failure-policy-failjob}

У наведеному нижче прикладі ви дізнаєтеся, як використовувати політику збоїв Podʼа, щоб уникати непотрібних перезапусків Podʼів, коли збій Podʼа вказує на програмну помилку, яку неможливо усунути повторною спробою.

1. Перегляньте наведений нижче маніфест:

   {{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-failjob.yaml
   ```

1. Приблизно через 30 секунд весь Job має завершитися. Перевірте статус Job, виконавши команду:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
   ```

   У статусі Job відображаються такі стани:

   * Стан `FailureTarget`: має поле `reason` зі значенням `PodFailurePolicy` і поле `message` з додатковою інформацією про завершення, наприклад `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`. Контролер Job додає цей стан, щойно Job вважається невдалим. Докладніше дивіться [Завершення Podʼів Job](/docs/concepts/workloads/controllers/job/#termination-of-job-pods).
   * Стан `Failed`: ті самі `reason` і `message`, що й у стану `FailureTarget`. Контролер Job додає цей стан після завершення всіх Podʼів Job.

   Для порівняння: якби політику збоїв Podʼа було вимкнено, Job повторював би спроби до досягнення `backoffLimit` (6 збоїв). Оскільки повторні спроби використовують експоненційний backoff, а з `parallelism: 2` збої відбуваються парами, затримка між спробами зростає з кожною спробою. У результаті в цьому прикладі мало б минути щонайменше 9 хвилин, перш ніж Job зазнає збою.

#### Очищення {#clean-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

Кластер автоматично очищає Podʼи.

### Використання політики збоїв Podʼа для ігнорування порушень роботи Podʼів {#pod-failure-policy-ignore}

У наведеному нижче прикладі ви дізнаєтеся, як за допомогою політики збоїв Podʼа зробити так, щоб порушення роботи Podʼів не збільшували лічильник повторних спроб Podʼа в межах `.spec.backoffLimit`.

{{< caution >}}
У цьому прикладі важливий час, тому варто прочитати кроки перед виконанням. Щоб спричинити порушення роботи Podʼа, важливо виконати drain вузла, поки Pod працює на ньому (протягом 90 секунд після планування Podʼа).
{{< /caution >}}

1. Перегляньте наведений нижче маніфест:

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-ignore.yaml
   ```

1. Виконайте цю команду, щоб перевірити `nodeName`, на який заплановано Pod:

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

1. Виконайте drain вузла, щоб виселити Pod до його завершення (протягом 90 секунд):

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

1. Перевірте `.status.failed`, щоб переконатися, що лічильник для Job не збільшено:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

1. Виконайте uncordon вузла:

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

Job відновлюється й завершується успішно.

Для порівняння: якби політику збоїв Podʼа було вимкнено, порушення роботи Podʼа призвело б до завершення всього Job (оскільки `.spec.backoffLimit` дорівнює 0).

#### Очищення {#cleaning-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

Кластер автоматично очищає Podʼи.

### Використання політики збоїв Podʼа для уникнення непотрібних повторних спроб запуску Podʼів на основі власних станів Podʼа {#pod-failure-policy-config-issue}

У наведеному нижче прикладі ви дізнаєтеся, як використовувати політику збоїв Podʼа, щоб уникати непотрібних перезапусків Podʼів на основі власних станів Podʼа.

{{< note >}}
Наведений нижче приклад працює з версії 1.27, оскільки спирається на перехід видалених Podʼів у фазі `Pending` до термінальної фази (дивіться [Фаза Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)).
{{< /note >}}

1. Перегляньте наведений нижче маніфест:

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-config-issue.yaml
   ```

   Зверніть увагу, що образ налаштовано неправильно, оскільки його не існує.

1. Перевірте статус Podʼів Job, виконавши команду:

   ```sh
   kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   Ви побачите вивід, подібний до такого:

   ```yaml
   containerStatuses:
   - image: non-existing-repo/non-existing-image:example
      ...
      state:
      waiting:
         message: Back-off pulling image "non-existing-repo/non-existing-image:example"
         reason: ImagePullBackOff
         ...
   phase: Pending
   ```

   Зверніть увагу, що Pod лишається у фазі `Pending`, оскільки не може завантажити неправильно налаштований образ. Це, в принципі, могло б бути тимчасовою проблемою, і образ міг би завантажитися. Однак у цьому випадку образу не існує, тому ми вказуємо на це за допомогою власного стану.

1. Додайте власний стан. Спочатку підготуйте патч, виконавши команду:

   ```sh
   cat <<EOF > patch.yaml
   status:
     conditions:
     - type: ConfigIssue
       status: "True"
       reason: "NonExistingImage"
       lastTransitionTime: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
   EOF
   ```

   По-друге, виберіть один із Podʼів, створених Job, виконавши команду:

   ```
   podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
   ```

   Потім застосуйте патч до одного з Podʼів, виконавши таку команду:

   ```sh
   kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
   ```

   Якщо патч успішно застосовано, ви отримаєте повідомлення такого типу:

   ```sh
   pod/job-pod-failure-policy-config-issue-k6pvp patched
   ```

1. Видаліть Pod, щоб перевести його у фазу `Failed`, виконавши команду:

   ```sh
   kubectl delete pods/$podName
   ```

1. Перевірте статус Job, виконавши:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   У статусі Job ви побачите стан `Failed` з полем `reason`, що дорівнює `PodFailurePolicy`. Крім того, поле `message` містить докладнішу інформацію про завершення Job, наприклад `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`.

{{< note >}}
У промисловому середовищі кроки 3 та 4 має автоматизувати контролер, наданий користувачем.
{{< /note >}}

#### Очищення {#cleaning-up-1}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

Кластер автоматично очищає Podʼи.

### Використання політики збоїв Podʼа для уникнення непотрібних повторних спроб запуску Podʼів за індексами {#backoff-limit-per-index-failindex}

Щоб уникнути непотрібних перезапусків Podʼів для кожного індексу, можна використовувати можливості _політика збоїв Podʼа_ й _обмеження backoff на індекс_. У цьому розділі сторінки показано, як використовувати ці можливості разом.

1. Перегляньте наведений нижче маніфест:

   {{% code_sample file="/controllers/job-backoff-limit-per-index-failindex.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-backoff-limit-per-index-failindex.yaml
   ```

1. Приблизно через 15 секунд перевірте стан Podʼів для Job. Ви можете зробити це, виконавши команду:

   ```shell
   kubectl get pods -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   Ви побачите вивід, подібний до такого:

   ```none
   NAME                                            READY   STATUS      RESTARTS   AGE
   job-backoff-limit-per-index-failindex-0-4g4cm   0/1     Error       0          4s
   job-backoff-limit-per-index-failindex-0-fkdzq   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-1-2bgdj   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-2-vs6lt   0/1     Completed   0          11s
   job-backoff-limit-per-index-failindex-3-s7s47   0/1     Completed   0          6s
   ```

   Зверніть увагу, що вивід показує таке:

   * Два Podʼи мають індекс 0, оскільки обмеження backoff дозволило одну повторну спробу для індексу.
   * Лише один Pod має індекс 1, оскільки код виходу збійного Podʼа збігся з політикою збоїв Podʼа з дією `FailIndex`.

1. Перевірте статус Job, виконавши:

   ```sh
   kubectl get jobs -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   У статусі Job поле `failedIndexes` показує "0,1", оскільки обидва індекси зазнали збою. Оскільки індекс 1 не повторювався, кількість збійних Podʼів, вказана в полі статусу "failed", дорівнює 3.

#### Очищення {#cleaning-up-2}

Видаліть створений Job:

```sh
kubectl delete jobs/job-backoff-limit-per-index-failindex
```

Кластер автоматично очищає Podʼи.

## Альтернативи {#alternatives}

Ви можете покладатися лише на [політику backoff для збоїв Podʼа](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), вказавши поле `.spec.backoffLimit` у Job. Однак у багатьох ситуаціях важко знайти баланс: значення `.spec.backoffLimit` має бути достатньо низьким, щоб уникати непотрібних повторних спроб Podʼів, але достатньо високим, щоб Job не завершувався через порушення роботи Podʼів.
