---
title: Обробка повторюваних і неповторюваних помилок Pod за допомогою політики збоїв Pod
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

<!-- overview -->

Цей документ показує, як використовувати [політику збоїв Pod](/uk/docs/concepts/workloads/controllers/job#pod-failure-policy), у поєднанні з типовою [політикою відмови Podʼа](/uk/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), для покращення контролю над обробкою збоїв на рівні контейнера або Pod у {{<glossary_tooltip text="Job" term_id="job">}}.

Визначення політики збоїв Pod може допомогти вам:

* краще використовувати обчислювальні ресурси, уникаючи непотрібних повторних запусків Pod.
* уникати збоїв Job через збої Pod (такі як {{<glossary_tooltip text="випередження" term_id="preemption" >}}, {{<glossary_tooltip text="виселення ініційоване API" term_id="api-eviction" >}} або виселення на основі {{<glossary_tooltip text="taint" term_id="taint" >}}).

## {{% heading "prerequisites" %}}

Ви повинні вже бути знайомі з основним використанням [Job](/uk/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Використання політики збоїв Pod для уникнення непотрібних повторних запусків Pod {#using-pod-failure-policy-to-avoid-unnecessary-pod-retries}

В наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб уникати непотрібних перезапусків Pod, коли збій Pod вказує на неповторювану помилку програмного забезпечення.

Спочатку створіть Job на основі конфігурації:

{{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

виконавши команду:

```sh
kubectl create -f job-pod-failure-policy-failjob.yaml
```

Через приблизно 30 секунд весь Job повинен завершитися. Перевірте статус Job, виконавши команду:

```sh
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```

У статусі Job відображаються такі умови:

* Умова `FailureTarget`: має поле `reason`, встановлене в `PodFailurePolicy`, і поле `message` з додатковою інформацією про завершення, наприклад, `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`. Контролер Job додає цю умову, як тільки Job вважається невдалим. Для отримання деталей дивіться [Завершення Job Podʼів](/uk/docs/concepts/workloads/controllers/job/#termination-of-job-pods).
* Умова `Failed`: те ж саме значення для `reason` і `message`, що й в умови `FailureTarget`. Контролер Job додає цю умову після того, як усі Podʼи Job завершено.

Для порівняння, якщо політика збоїв Pod була вимкнена, це б зайняло 6 спроб повторного запуску Pod, на що треба щонайменше 2 хвилини.

### Прибирання {#clean-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

Кластер автоматично очищає Pod.

## Використання політики збоїв Pod для ігнорування розладів Pod {#using-pod-failure-policy-to-ignore-pod-disruptions}

На наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб ігнорувати розлади Pod, які збільшують лічильник повторних спроб Pod до межі `.spec.backoffLimit`.

{{< caution >}}
Час має значення для цього прикладу, тому вам слід прочитати про кроки перед їх виконанням. Щоб викликати розлад Podʼа, важливо запустити очищення вузла, поки Pod працює на ньому (протягом 90 секунд після розміщення Pod).
{{< /caution >}}

1. Створіть Job на основі конфігурації:

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

   виконавши команду:

   ```sh
   kubectl create -f job-pod-failure-policy-ignore.yaml
   ```

2. Виконайте цю команду, щоб перевірити `nodeName`, на якому розміщено Pod:

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

3. Запустить очищення вузла, щоб виселити Pod до завершення його роботи (протягом 90 секунд):

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

4. Перевірте `.status.failed`, щоб переконатися, що лічильник для Job не збільшено:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

5. Зніміть блокування з вузла:

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

Job відновиться і завершиться успішно.

Для порівняння, якщо політика збоїв Pod була вимкнена, розлад Pod призведе до завершення всього Job (оскільки `.spec.backoffLimit` встановлено на 0).

### Прибирання {#cleaning-up}

Видаліть створений Job:

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

Кластер автоматично очищає Pod.

## Використання політики збоїв Pod для уникнення непотрібних повторних запусків Pod на основі власних умов Pod {#using-pod-failure-policy-to-avoid-unnecessary-pod-retries-based-on-custom-pod-conditions}

В наступному прикладі ви можете навчитися використовувати політику збоїв Pod, щоб уникати непотрібних перезапусків Pod на основі власних умов Pod.

{{< note >}}
Наведений нижче приклад працює з версії 1.27, оскільки він базується на переході видалених Pod з фази `Pending` до термінальної фази (див. [Фази Pod](/uk/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)).
{{< /note >}}

1. Спочатку створіть Job на основі конфігурації:

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

   виконавши команду:

   ```sh
   kubectl create -f job-pod-failure-policy-config-issue.yaml
   ```

   Зверніть увагу, що образ налаштоване неправильно, оскільки його не існує.

2. Перевірте статус Pod Job, виконавши команду:

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

3. Додайте власну умову. Спочатку підготуйте патч, виконавши команду:

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

4. Видаліть Pod для переходу його до фази `Failed`, виконавши команду:

   ```sh
   kubectl delete pods/$podName
   ```

5. Перевірте статус Job, виконавши:

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   У статусі Job перегляньте умову `Failed` з полем `reason`, рівним `PodFailurePolicy`. Додатково, поле `message` містить більш детальну інформацію про завершення завдання, таку як: `Pod default/job-pod-failure-policy-config-issue-k6pvp має умову ConfigIssue, яка відповідає правилу FailJob за індексом 0`.

{{< note >}}
В операційному середовищі кроки 3 та 4 повинні бути автоматизовані контролером, наданим користувачем.
{{< /note >}}

### Очищення {#cleaning-up-2}

Видаліть створене вами завдання:

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

Кластер автоматично очищує поди.

## Альтернативи {#alternatives}

Ви можете покладатись виключно на [політику відмови Pod backoff](/uk/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy), вказавши поле `.spec.backoffLimit` завдання. Однак у багатьох ситуаціях важко знайти баланс між встановленням низького значення для `.spec.backoffLimit` для уникнення непотрібних повторних спроб виконання Podʼів, але достатньо великого, щоб забезпечити, що Job не буде припинено через втручання у роботу Podʼів.
