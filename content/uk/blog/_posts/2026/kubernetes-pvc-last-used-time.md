---
layout: blog
title: "Kubernetes v1.37: Відстеження моменту останнього використання PersistentVolumeClaim (Бета)"
date: 2026-09-21T10:30:00-08:00
slug: kubernetes-v1-37-pvc-last-used-time
author: >
  [Roman Bednář](https://github.com/RomanBednar) (Red Hat)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

Kubernetes v1.37 переводить функціональну можливість `PersistentVolumeClaimUnusedSinceTime` у Beta (стандартно увімкнену). Завдяки цій функції контролер захисту PersistentVolumeClaim (PVC) додає стан `Unused` до кожного PVC, повідомляючи вам, чи посилається на нього наразі будь-який запущений Pod, без потреби у власних інструментах чи перехресних посиланнях.

Визначення станів PVC в API дивіться у [довіднику API PersistentVolumeClaim](/docs/reference/kubernetes-api/core/persistent-volume-claim-v1/#PersistentVolumeClaimCondition). Читайте далі, щоб дізнатися, як працює стан `Unused` та як його використовувати.

## Чому відстежувати використання PVC? {#why-track-pvc-usage}

У великомасштабних кластерах Kubernetes користувачі часто створюють PVC, а потім видаляють повʼязані Podʼи, не прибираючи сховище, оскільки Kubernetes не видаляє PVC автоматично, коли їхні Podʼи видаляються (щоб захистити від випадкової втрати даних). З часом ці _осиротілі_ PVC можуть накопичуватися, мовчки споживаючи ємність сховища та збільшуючи витрати на хмарні ресурси.

До Kubernetes v1.37 було легко визначити невикористовуваний PersistentVolume, але набагато складніше зʼясувати, чи все ще використовується PVC. Для цього потрібно було зіставляти Podʼи, PersistentVolumes та PVC протягом потенційно великого проміжку часу. Адміністратори часто вдавалися до власних конвеєрів моніторингу або скриптів, щоб відповісти на, здавалося б, просте запитання: _"Чи використовує цей том хтось насправді?"_

Функція `PersistentVolumeClaimUnusedSinceTime` вирішує цю проблему, роблячи відповідь доступною нативно у статусі PVC. Щойно функцію увімкнено, кожен PVC отримує стан `Unused`, яким керує контролер захисту PVC.

### Сценарії використання {#user-stories}

* **Адміністратор сховища**: «Я хочу знати, які PVC у моєму кластері не використовуються жодним Podʼом, щоб безпечно визначити осиротілі томи та запланувати їх видалення».
* **DevOps-інженер**: «Я хочу отримати список PVC, у яких стан `Unused` має значення `True`, щоб автоматизувати очищення в середовищах розробки».

## Як це працює? {#how-does-it-work}

Контролер захисту PVC, який уже стежить за Podʼами, щоб забезпечувати [захист обʼєктів сховища, що використовуються](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection), тепер також керує новим станом `Unused` на PVC.

Стан працює так:

| Сценарій | Статус стану | Причина |
| --- | --- | --- |
| Жоден нетермінальний Pod не посилається на PVC | `Unused=True` | `NoPodsUsingPVC` |
| Принаймні один запущений або очікуючий Pod посилається на PVC | `Unused=False` | `PodUsingPVC` |

Кілька деталей, на які варто звернути увагу:

* **Завершені Podʼи не враховуються**: Pod, який завершився (фаза `Succeeded` або `Failed`), не тримає PVC позначеним як такий, що використовується. Це означає, що пакетні завдання з `restartPolicy: Never` не завадять PVC стати `Unused=True` після їх завершення.
* **Очікуючі Podʼи враховуються**: Навіть Pod, який неможливо запланувати, (наприклад, з неможливим селектором вузла) все одно вважається таким, що використовує PVC. Наміру використати том достатньо.
* **Кілька Podʼів**: Якщо кілька Podʼів посилаються на один і той самий PVC, стан переходить у `Unused=True` лише після того, як **останній** нетермінальний Pod буде видалено або він завершиться.

### Використання lastTransitionTime, щоб дізнатися, коли PVC став неактивним {#using-lasttransitiontime-to-find-when-a-pvc-became-idle}

Як і кожен стан Kubernetes, стан `Unused` має стандартне поле `lastTransitionTime`. Це означає, що ви отримуєте корисний бонус безкоштовно: коли стан переходить з `False` у `True`, `lastTransitionTime` фіксує точний момент, коли PVC став неактивним. Ви можете використовувати цю позначку часу, щоб відповісти на запитання на кшталт _"як довго цей PVC простоює без використання?"_, наприклад, щоб знайти PVC, які були неактивними понад 30 днів (див. [приклад запиту](#finding-unused-pvcs-across-the-cluster) нижче).

## Що змінилося від Alpha до Beta? {#what-changed-from-alpha-to-beta}

Kubernetes v1.36 представив цю функцію як Alpha, де вам доводилося вмикати функціональну можливість `PersistentVolumeClaimUnusedSinceTime` явно. Для Beta у v1.37 функціональну можливість увімкнено стандартно, а функція має повне покриття наскрізними тестами.

## Як це використовувати {#how-to-use-it}

Оскільки функція є Beta і стандартно увімкнена в Kubernetes v1.37, стан `Unused` зʼявлятиметься на PVC автоматично. Ось покроковий приклад, щоб побачити її в дії:

1. Створіть PVC:

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: my-data
   spec:
     accessModes:
     - ReadWriteOnce
     resources:
       requests:
         storage: 1Gi
   ```

2. Через короткий час перевірте стани PVC:

   ```shell
   kubectl get pvc my-data -o jsonpath='{.status.conditions[*]}' | jq .
   ```

   Ви маєте побачити стан `Unused` зі статусом `True` та причиною `NoPodsUsingPVC`:

   ```json
   {
     "lastProbeTime": null,
     "lastTransitionTime": "2026-09-14T12:03:11Z",
     "message": "No pods are currently referencing this PVC",
     "reason": "NoPodsUsingPVC",
     "status": "True",
     "type": "Unused"
   }
   ```

3. Створіть Pod, який використовує PVC:

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: my-app
   spec:
     containers:
     - name: app
       image: busybox
       command: ["sleep", "3600"]
       volumeMounts:
       - name: data
         mountPath: /data
     volumes:
     - name: data
       persistentVolumeClaim:
         claimName: my-data
   ```

4. Перевірте стан знову: тепер він має показувати `Unused=False`:

   ```shell
   kubectl get pvc my-data -o jsonpath='{.status.conditions[?(@.type=="Unused")].status}'
   ```

   Вивід:

   ```none
   False
   ```

5. Видаліть Pod і зачекайте, поки стан перейде назад у `Unused=True`:

   ```shell
   kubectl delete pod my-app
   kubectl get pvc my-data -o jsonpath='{.status.conditions[?(@.type=="Unused")]}'
   ```

   Стан має знову показувати `Unused=True` з причиною `NoPodsUsingPVC`.

### Пошук невикористовуваних PVC у кластері {#finding-unused-pvcs-across-the-cluster}

Щоб отримати список усіх PVC, які не використовувалися понад 30 днів, ви можете скористатися командою на кшталт:

{{< note >}}
Ця команда використовує [`jq`](https://jqlang.org/), командний JSON-процесор.
{{< /note >}}

```shell
kubectl get pvc -A -o json | jq -r '
  .items[]
  | select(.status.conditions[]? | select(.type=="Unused" and .status=="True"))
  | select(
      (.status.conditions[] | select(.type=="Unused") | .lastTransitionTime) as $t
      | (now - ($t | fromdateiso8601)) > (30 * 86400)
    )
  | "\(.metadata.namespace)/\(.metadata.name) unused since \(.status.conditions[] | select(.type=="Unused") | .lastTransitionTime)"
'
```

## Що далі? {#whats-next}

Залежно від відгуків та впровадження, проєкт Kubernetes планує перевести цю функцію до загальної доступності (GA) в одному з майбутніх випусків. Якщо у вас є відгуки щодо цієї функції, будь ласка, створіть тікет у репозиторії [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

Щоб дізнатися більше про це вдосконалення, зверніться до [KEP-5541: час останнього використання PersistentVolumeClaim](https://www.kubernetes.dev/resources/keps/5541/).

## Долучення до спільноти {#getting-involved}

Проєкт Kubernetes завжди вітає нових учасників. Якщо ви хочете долучитися, ви можете приєднатися до нас у [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).

Якщо ви хочете поділитися відгуками, ви можете зробити це на нашому [публічному каналі Slack](https://kubernetes.slack.com/messages/sig-storage) (відвідайте <https://slack.k8s.io/>, щоб отримати запрошення, якщо воно вам потрібне).

Особлива подяка учасникам, які допомогли спроєктувати та реалізувати цю функцію (в алфавітному порядку):

* Arvind Parekh ([ArvindParekh](https://github.com/ArvindParekh))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Kevin Hannon ([kannon92](https://github.com/kannon92))
* Roman Bednář ([RomanBednar](https://github.com/RomanBednar))
