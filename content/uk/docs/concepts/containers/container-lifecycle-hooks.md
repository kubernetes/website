---
title: Хуки життєвого циклу контейнера
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано, як контейнери, керовані kubelet, можуть використовувати фреймворк хука життєвого циклу контейнера для запуску коду, викликаного подіями під час управління їх життєвим циклом.

<!-- body -->

## Огляд {#overview}

Аналогічно багатьом фреймворкам програмування, які мають хуки життєвого циклу компонентів, таким як Angular, Kubernetes надає контейнерам хуки життєвого циклу. Ці хуки дозволяють контейнерам бути в курсі подій у своєму циклі управління та виконувати код, реалізований в обробнику, коли відповідний хук життєвого циклу виконується.

## Хуки контейнера {#container-hooks}

До контейнерів виносяться два хуки:

`PostStart`

Цей хук виконується негайно після створення контейнера. Однак немає гарантії, що хук виконається до ENTRYPOINT контейнера. До обробника не передаються параметри.

`PreStop`

Цей хук викликається негайно перед тим, як контейнер буде завершено через запит API або подію управління, таку як невдача проби на живучість/запуску, передумови, конфлікт ресурсів та інші. Звернення до хука `PreStop` не вдасться, якщо контейнер вже перебуває у стані завершення або виконання, і хук повинен завершити виконання до того, як може бути відправлений сигнал TERM для зупинки контейнера. Відлік пільгового періоду припинення Pod починається до виконання хуку `PreStop`, тому, незалежно від результату обробника, контейнер врешті-решт закінчиться протягом пільгового періоду припинення Pod. Жодні параметри не передаються обробнику.

Докладний опис поведінки припинення роботи Podʼів можна знайти в [Припинення роботи Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

`StopSignal`

За допомогою хука життєвого циклу StopSignal можна визначити сигнал зупинки, який буде надіслано контейнеру, коли його буде зупинено. Якщо ви встановите цей параметр, він перевизначить будь-яку інструкцію `STOPSIGNAL`, визначену в образі контейнера.

Детальніший опис поведінки завершення за допомогою власних сигналів зупинки можна знайти у [Сигнали зупинки](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-stop-signals).

### Реалізації обробника хуків {#hook-handler-implementations}

Контейнери можуть мати доступ до хука, реалізувавши та реєструючи обробник для цього хука. Існують три типи обробників хука, які можна реалізувати для контейнерів:

* Exec — Виконує конкретну команду, таку як `pre-stop.sh`, всередині cgroups та namespaces контейнера. Ресурси, спожиті командою, зараховуються на рахунок контейнера.
* HTTP — Виконує HTTP-запит до конкретного endpoint в контейнері.
* Sleep — Призупиняє контейнер на вказаний час.

### Виконання обробника хука {#hook-handler-execution}

Коли викликається хук управління життєвим циклом контейнера, система управління Kubernetes виконує обробник відповідно до дії хука, `httpGet`, `tcpSocket` ([застаріло](/docs/reference/generated/kubernetes-api/v1.31/#lifecyclehandler-v1-core)) та `sleep` виконуються процесом kubelet, а `exec` виконується в контейнері.

Виклик обробника хука `PostStart` ініціюється при створенні контейнера, тобто точка входу контейнера ENTRYPOINT і хук `PostStart` спрацьовують одночасно. Однак, якщо хук `PostStart` виконується занадто довго або зависає, це може завадити контейнеру перейти у стан `running`.

Хуки `PreStop` не викликаються асинхронно від сигналу зупинки контейнера; хук повинен завершити своє виконання до того, як може бути відправлений сигнал TERM. Якщо хук `PreStop` затримується під час виконання, фаза Pod буде `Terminating`, і залишиться такою, поки Pod не буде вбито після закінчення його `terminationGracePeriodSeconds`. Цей період припинення роботи застосовується до загального часу, необхідного як для виконання хука `PreStop`, так і для зупинки контейнера. Якщо, наприклад, `terminationGracePeriodSeconds` дорівнює 60, і хук займає 55 секунд для завершення, а контейнер зупиняється нормально через 10 секунд після отримання сигналу, то контейнер буде вбитий перш, ніж він зможе завершити роботу, оскільки `terminationGracePeriodSeconds` менше, ніж загальний час (55+10), необхідний для цих двох подій.

Якщо хук `PostStart` або `PreStop` не вдасться, він вбиває контейнер.

Користувачам слід робити свої обробники хуків якомога легкими. Проте є випадки, коли довгострокові команди мають сенс, наприклад, коли потрібно зберегти стан перед зупинкою контейнера.

### Гарантії доставки хуків {#hook-delivery-guarantees}

Постачання хука призначено бути *принаймні одноразовим*, що означає, що хук може бути викликано кілька разів для будь-якої події, такої як для `PostStart` чи `PreStop`. Це залежить від реалізації хука.

Як правило, здійснюються лише разові доставки. Якщо, наприклад, приймач HTTP-хука не працює і не може приймати трафік, спроба повторно надіслати не відбувається. Однак у деяких рідкісних випадках може статися подвійна доставка. Наприклад, якщо kubelet перезапускається посеред надсилання хука, хук може бути повторно відправлений після того, як kubelet повернеться.

### Налагодження обробників хуків {#debugging-hook-handlers}

Логи обробника хука не відображаються в подіях Pod. Якщо обробник відмовляється з будь-якої причини, він розсилає подію. Для `PostStart` це подія `FailedPostStartHook`, а для `PreStop` це подія `FailedPreStopHook`. Щоб згенерувати подію `FailedPostStartHook`, змініть [lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml) файл, щоб змінити команду postStart на "badcommand" та застосуйте його. Ось приклад виводу події, який ви побачите після виконання `kubectl describe pod lifecycle-demo`:

```none
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"


 Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Середовище контейнера](/docs/concepts/containers/container-environment/).
* Отримайте практичний досвід, [прикріплюючи обробників до подій життєвого циклу контейнера](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
