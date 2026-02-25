---
title: Обробка повторюваних і неповторюваних помилок Pod за допомогою політики збоїв Pod
linkTitle: Обробка помилок Pod за допомогою політики збоїв
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

<!-- overview -->

Цей документ показує, як використовувати [політику збоїв Pod](/docs/concepts/workloads/controllers/job#pod-failure-policy), у поєднанні з типовою [політикою відмови Podʼа](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), для покращення контролю над обробкою збоїв на рівні контейнера або Pod у {{<glossary_tooltip text="Job" term_id="job">}}.

Визначення політики збоїв Pod може допомогти вам:

* краще використовувати обчислювальні ресурси, уникаючи непотрібних повторних запусків Podʼів.
* уникати збоїв Job через збої Pod (такі як {{<glossary_tooltip text="випередження" term_id="preemption" >}}, {{<glossary_tooltip text="виселення ініційоване API" term_id="api-eviction" >}} або виселення на основі {{<glossary_tooltip text="taint" term_id="taint" >}}).

## {{% heading "prerequisites" %}}

Ви повинні вже бути знайомі з основним використанням [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Сценарії використання {#usage-scenarios}

Розглянемо такі сценарії використання для Завдань, які визначають політику збоїв Pod:

* [Уникнення непотрібних повторних спроб запуску Podʼів](#pod-failure-policy-failjob)
* [Ігнорування розладів у роботі Podʼів](#pod-failure-policy-ignore)
* [Уникнення непотрібних повторних спроб запуску Podʼів на основі власних станів Podʼів](#pod-failure-policy-config-issue)
* [Уникнення непотрібних повторних спроб запуску Podʼів за індексами](#backoff-limit-per-index-failindex)

## Використання політики збоїв Pod для уникнення непотрібних повторних запусків Podʼів {#pod-failure-policy-failjob}

В наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб уникати непотрібних перезапусків Pod, коли збій Pod вказує на неповторювану помилку програмного забезпечення.

1. Ознайомтесь з наступним маніфестом:

   {{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

1. Застосуйте маніфест%

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-failjob.yaml
   ```

1. Через приблизно 30 секунд весь Job повинен завершитися. Перевірте статус Job, виконавши команду:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
   ```

   У статусі Job відображаються такі умови:

   * Умова `FailureTarget`: має поле `reason`, встановлене в `PodFailurePolicy`, і поле `message` з додатковою інформацією про завершення, наприклад, `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`. Контролер Job додає цю умову, як тільки Job вважається невдалим. Для отримання деталей дивіться [Завершення Job Podʼів](/docs/concepts/workloads/controllers/job/#termination-of-job-pods).
   * Умова `Failed`: те ж саме значення для `reason` і `message`, що й в умови `FailureTarget`. Контролер Job додає цю умову після того, як усі Podʼи Job завершено.

   Для порівняння, якщо політику відмови Podʼа була б вимкнено, Job повторював би спроби до досягнення `backoffLimit` (6 відмов). Оскільки повторні спроби використовують експоненціальне відхилення, а з `parallelism: 2` відмови відбуваються парами, затримка між спробами збільшується з кожною повторною спробою. Як результат, у цьому прикладі знадобилося б щонайменше 9 хвилин, перш ніж Job зазнав би невдачі.

#### Прибирання {#clean-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

Кластер автоматично очищає Pod.

## Використання політики збоїв Pod для ігнорування розладів Pod {#pod-failure-policy-ignore}

На наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб ігнорувати розлади Pod, які збільшують лічильник повторних спроб Pod до межі `.spec.backoffLimit`.

{{< caution >}}
Час має значення для цього прикладу, тому вам слід прочитати про кроки перед їх виконанням. Щоб викликати розлад Podʼа, важливо запустити очищення вузла, поки Pod працює на ньому (протягом 90 секунд після розміщення Pod).
{{< /caution >}}

1. Ознайомтесь з наступним маніфестом:

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-ignore.yaml
   ```

1. Виконайте цю команду, щоб перевірити `nodeName`, на якому розміщено Pod:

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

1. Запустить очищення вузла, щоб виселити Pod до завершення його роботи (протягом 90 секунд):

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

1. Перевірте `.status.failed`, щоб переконатися, що лічильник для Job не збільшено:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

1. Зніміть блокування з вузла:

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

Job відновиться і завершиться успішно.

Для порівняння, якщо політика збоїв Pod була вимкнена, розлад Pod призведе до завершення всього Job (оскільки `.spec.backoffLimit` встановлено на 0).

#### Прибирання {#cleaning-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

Кластер автоматично очищає Pod.

## Використання політики збоїв Pod для уникнення непотрібних повторних запусків Pod на основі власних станів Pod {#pod-failure-policy-config-issue}

В наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб уникати непотрібних перезапусків Pod на основі власних станів Pod.

{{< note >}}
Наведений нижче приклад працює з версії 1.27, оскільки він базується на переході видалених Podʼів з фази `Pending` до термінальної фази (див. [Фази Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)).
{{< /note >}}

1. Ознайомтесь з наступним маніфестом:

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-config-issue.yaml
   ```

   Зверніть увагу, що образ налаштоване неправильно, оскільки його не існує.

1. Перевірте статус Pod Job, виконавши команду:

   ```sh
   kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   Ви побачите результат, подібний до цього:

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

   Зверніть увагу, що Pod залишається у фазі `Pending`, оскільки йому не вдається завантажити неправильно налаштований образ. Це, в принципі, може бути тимчасовою проблемою, і образ може бути завантажений. Однак у цьому випадку образу не існує, тому ми вказуємо на цей факт за допомогою власної умови.

1. Додайте власну умову. Спочатку підготуйте патч, виконавши команду:

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

   По-друге, виберіть один із Pod, створених Job, виконавши команду:

   ```none
   podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
   ```

   Потім застосуйте патч до одного з Pod, виконавши наступну команду:

   ```sh
   kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
   ```

   Якщо патч успішно застосовано, ви отримаєте повідомлення такого типу:

   ```sh
   pod/job-pod-failure-policy-config-issue-k6pvp patched
   ```

1. Видаліть Pod для переходу його до фази `Failed`, виконавши команду:

   ```sh
   kubectl delete pods/$podName
   ```

1. Перевірте статус Job, виконавши:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   У статусі Job перегляньте умову `Failed` з полем `reason`, рівним `PodFailurePolicy`. Додатково, поле `message` містить більш детальну інформацію про завершення завдання, таку як: `Pod default/job-pod-failure-policy-config-issue-k6pvp має умову ConfigIssue, яка відповідає правилу FailJob за індексом 0`.

{{< note >}}
В операційному середовищі кроки 3 та 4 повинні бути автоматизовані контролером, наданим користувачем.
{{< /note >}}

#### Очищення {#cleaning-up-1}

Видаліть створене вами завдання:

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

The cluster automatically cleans up the Pods.

### Використання політики збоїв Pod для уникнення непотрібних повторних запусків Pod на основі індексів{#backoff-limit-per-index-failindex}

Щоб уникнути непотрібних перезапусків Podʼів для кожного індексу, ви можете використовувати функції _Політики збоїв Podʼа_ та _Ліміт відстрочки для кожного індексу_. У цьому розділі сторінки показано, як використовувати ці функції разом.

1. Ознайомтесь з наступним манфіфестом:

   {{% code_sample file="/controllers/job-backoff-limit-per-index-failindex.yaml" %}}

1. Застосуйте маніфест:

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-backoff-limit-per-index-failindex.yaml
   ```

1. Приблизно через 15 секунд перевірте стан Podʼів для Job. Ви можете зробити це, виконавши команду:

   ```shell
   kubectl get pods -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   Ви побачите результат, подібний до цього:

   ```none
   NAME                                            READY   STATUS      RESTARTS   AGE
   job-backoff-limit-per-index-failindex-0-4g4cm   0/1     Error       0          4s
   job-backoff-limit-per-index-failindex-0-fkdzq   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-1-2bgdj   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-2-vs6lt   0/1     Completed   0          11s
   job-backoff-limit-per-index-failindex-3-s7s47   0/1     Completed   0          6s
   ```

   Зверніть увагу, що вивід показує наступне:

   * Два Podʼа мають індекс 0 через обмеження backoff, дозволене для однієї спроби індексування.
   * Тільки один Pod має індекс 1, оскільки код виходу невдалого Podʼа збігався з політикою збою podʼа з дією `FailIndex`.

1. Перевірте стан Job виконавши:

   ```sh
   kubectl get jobs -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   У статусі Job побачите, що поле `failedIndexes` показує "0,1", оскільки обидва індекси зазнали невдачі. Оскільки індекс 1 не було повторено, кількість збійних Podʼів, зазначена в полі статусу "failed", дорівнює 3.

#### Очищення {#cleaning-up-2}

Вилучить створений Job:

```sh
kubectl delete jobs/job-backoff-limit-per-index-failindex
```

Кластер автоматично очищує поди.

## Альтернативи {#alternatives}

Ви можете покладатись виключно на [політику відмови Pod backoff](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), вказавши поле `.spec.backoffLimit` завдання. Однак у багатьох ситуаціях важко знайти баланс між встановленням низького значення для `.spec.backoffLimit` для уникнення непотрібних повторних спроб виконання Podʼів, але достатньо великого, щоб забезпечити, що Job не буде припинено через втручання у роботу Podʼів.
