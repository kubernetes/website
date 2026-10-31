---
title: Init-контейнери
content_type: concept
weight: 40
---

<!-- overview -->
Ця сторінка надає загальний огляд init-контейнерів: спеціалізованих контейнерів, які запускаються перед запуском контейнерів застосунків в {{< glossary_tooltip text="Podʼі" term_id="pod" >}}. Init-контейнери можуть містити утиліти або сценарії налаштування, які відсутні в образі застосунку.

Ви можете вказати init-контейнери в специфікації Podʼа разом із масивом `containers` (який описує контейнери застосунку).

У Kubernetes [sidecar-контейнер](/docs/concepts/workloads/pods/sidecar-containers/) — це контейнер, який запускається перед основним контейнером застосунку і _продовжує працювати_. Цей документ стосується init-контейнерів — контейнерів, які виконуються до завершення під час ініціалізації Podʼа.

<!-- body -->

## Що таке init-контейнери {#understanding-init-containers}

У {{< glossary_tooltip text="Podʼі" term_id="pod" >}} може бути кілька контейнерів, які виконують застосунки, але також може бути один чи кілька init-контейнерів, які виконуються до того, як стартують контейнери застосунків.

Init-контейнери точно такі самі, як і звичайні контейнери, за винятком того, що:

* Init-контейнери завжди виконуються до завершення.
* Кожен init-контейнер повинен успішно завершити свою роботу, перш ніж почне роботу наступний.

Якщо init-контейнер Podʼа зазнає збою, kubelet повторно перезапускає цей init-контейнер, доки він не завершиться успішно. Однак якщо `restartPolicy` Podʼа дорівнює Never, і init-контейнер зазнає збою під час запуску цього Podʼа, Kubernetes вважає весь Pod невдалим.

Щоб вказати init-контейнер для Podʼа, додайте поле `initContainers` у [специфікацію Podʼа](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec), у вигляді масиву обʼєктів `container` (аналогічно полю `containers` застосунку та його вмісту). Дивіться [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) в
довідці API для отримання докладнішої інформації.

Статус init-контейнерів повертається у полі `.status.initContainerStatuses` у вигляді масиву статусів контейнерів (аналогічно полю `.status.containerStatuses`).

### Відмінності від звичайних контейнерів {#differences-from-regular-containers}

Init-контейнери підтримують всі поля та можливості контейнерів застосунків, включаючи обмеження ресурсів, [томи](/docs/concepts/storage/volumes/) та налаштування безпеки. Однак
запити та обмеження ресурсів для init-контейнера обробляються по-іншому, як описано в розділі [Спільне використання ресурсів всередині контейнерів](#resource-sharing-within-containers).

Звичайні init-контейнери (іншими словами, виключаючи sidecar-контейнери) не підтримують поля `lifecycle`, `livenessProbe`, `readinessProbe` чи `startupProbe`. Init-контейнери повинні успішно завершити свою роботу перед тим, як Pod може бути готовий; sidecar-контейнери продовжують працювати протягом життєвого циклу Podʼа і _підтримують_ деякі проби. Дивіться [sidecar-контейнер](/docs/concepts/workloads/pods/sidecar-containers/) для отримання додаткової інформації про ці контейнери.

Якщо ви вказали кілька init-контейнерів для Podʼа, kubelet виконує кожен такий контейнер послідовно. Кожен init-контейнер повинен успішно завершити свою роботу, перш ніж може бути запущено наступний. Коли всі init-контейнери завершать свою роботу, kubelet ініціалізує контейнери застосунків для Podʼа та запускає їх як зазвичай.

### Відмінності від sidecar-контейнерів {#differences-from-sidecar-containers}

Init-контейнери запускаються і завершують свої завдання до того, як розпочнеться робота основного контейнера застосунку. На відміну від [sidecar-контейнерів](/docs/concepts/workloads/pods/sidecar-containers), init-контейнери не продовжують працювати паралельно з основними контейнерами.

Init-контейнери запускаються і завершують свою роботу послідовно, і основний контейнер не починає свою роботу, доки всі init-контейнери успішно не завершать свою роботу.

Init-контейнери не підтримують `lifecycle`, `livenessProbe`, `readinessProbe` чи `startupProbe`, у той час, як sidecar-контейнери підтримують всі ці [проби](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe), щоб керувати своїм життєвим циклом.

Init-контейнери використовують ті самі ресурси (CPU, памʼять, мережу), що й основні контейнери застосунків, але не взаємодіють з ними напряму. Однак вони можуть використовувати спільні томи для обміну даними.

## Використання init-контейнерів {#using-init-containers}

Оскільки init-контейнери мають образи, окремі від контейнерів застосунків, вони мають кілька переваг для коду, повʼязаного із запуском:

* Init-контейнери можуть містити утиліти або власний код для налаштування, які відсутні в образі застосунку. Наприклад, немає потреби створювати образ `FROM` іншого образу лише для використання інструменту, такого як `sed`, `awk`, `python` чи `dig` під час налаштування.
* Ролі створення та розгортання образу застосунку можуть працювати незалежно одна від одної без необхідності спільного створення єдиного образу застосунку.
* Init-контейнери можуть працювати з іншим поданням файлової системи, ніж контейнери застосунків у тому самому Podʼі. Отже, їм можна надати доступ до {{< glossary_tooltip text="Secrets" term_id="secret" >}}, до яких контейнери застосунків не мають доступу.
* Оскільки init-контейнери завершують свою роботу, перш ніж будь-які контейнери застосунків розпочнуть свою роботу, вони пропонують механізм блокування або затримки запуску контейнера застосунку до виконання певних умов. Після того, як умови виконані, всі контейнери застосунків у Podʼі можуть стартувати паралельно.
* Init-контейнери можуть безпечно виконувати утиліти або власний код, який інакше зробив би образ контейнера застосунку менш безпечним. Відокремлюючи непотрібні інструменти, ви можете обмежити поверхню атаки вашого образу контейнера застосунку.

### Приклади {#examples}

Ось кілька ідей, як використовувати init-контейнери:

* Очікування на створення {{< glossary_tooltip text="Service" term_id="service">}}, використовуючи команду оболонки у вигляді одного рядка, наприклад:

  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

* Реєстрація Podʼа на віддаленому сервері зі значеннями, отриманими з Downward API за допомогою команди, подібної цій:

  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* Очікування певного часу перед запуском контейнера застосунку за допомогою команди, подібної цій:

  ```shell
  sleep 60
  ```

* Клонування репозиторію Git у {{< glossary_tooltip text="том" term_id="volume" >}}

* Додавання значень у файл конфігурації та виклик інструменту шаблонування для динамічного створення файлу конфігурації для основного контейнера застосунку. Наприклад, додайте значення `POD_IP` у конфігурацію та створіть основний файл конфігурації застосунку за допомогою Jinja.

#### Init-контейнери в роботі {#init-containers-in-use}

У цьому прикладі визначається простий Pod, який має два init-контейнери. Перший чекає на `myservice`, а другий — на `mydb`. Як тільки обидва init-контейнери завершаться, Pod запускає контейнер застосунку зі свого розділу `spec`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

Ви можете запустити цей Pod, виконавши:

```shell
kubectl apply -f myapp.yaml
```

Вивід буде подібний до цього:

```none
pod/myapp-pod created
```

І перевірте його статус за допомогою:

```shell
kubectl get -f myapp.yaml
```

Вивід буде подібний до цього:

```none
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

або докладніше:

```shell
kubectl describe -f myapp.yaml
```

Вивід буде подібний до цього:

```none
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container init-myservice
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container init-myservice
```

Щоб переглянути логи init-контейнерів у цьому Podʼі, виконайте:

```shell
kubectl logs myapp-pod -c init-myservice # Огляд першого init-контейнера
kubectl logs myapp-pod -c init-mydb      # Огляд другого init-контейнера
```

На цей момент ці init-контейнери будуть чекати виявлення {{< glossary_tooltip text="Services" term_id="service" >}} з назвами `mydb` та `myservice`.

Ось конфігурація, яку ви можете використовувати для того, щоб ці Services зʼявилися:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

Щоб створити Services `mydb` та `myservice`:

```shell
kubectl apply -f services.yaml
```

Вивід буде подібний до цього:

```none
service/myservice created
service/mydb created
```

Потім ви побачите, що ці init-контейнери завершаться, і Pod `myapp-pod` переходить у стан Running:

```shell
kubectl get -f myapp.yaml
```

Вивід буде подібний до цього:

```none
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

Цей простий приклад повинен дати вам натхнення для створення ваших власних init-контейнерів. У розділі [Що далі](#what-s-next) є посилання на більш детальний приклад.

## Докладний опис поведінки {#detailed-behavior}

Під час запуску Podʼа kubelet затримує виконання init-контейнерів, доки мережа та сховище не будуть готові. Після цього kubelet виконує init-контейнери Podʼа в порядку, в якому вони зазначені в специфікації Podʼа.

Кожен init-контейнер має успішно завершитися перед тим, як буде запущений наступний контейнер. Якщо контейнер не вдалося запустити через помилку середовища виконання або він завершується з помилкою, його перезапускають згідно з політикою перезапуску Podʼа (`restartPolicy`). Однак якщо політика перезапуску Podʼа (`restartPolicy`) встановлена на `Always`, init-контейнери використовують політику перезапуску `OnFailure`.

Pod не може бути `Ready`, поки всі init-контейнери не завершаться успішно. Порти init-контейнерів не агрегуються в Service. Pod, що ініціалізується, перебуває в стані `Pending`, але повинен мати умову `Initialized`, встановлену на false.

Якщо Pod [перезапускається](#pod-restart-reasons) або був перезапущений, всі init-контейнери мають виконатися знову.

Зміни в специфікації init-контейнерів обмежуються полем образу контейнера. Безпосередня зміна поля `image` init-контейнера _не призводить_ до перезапуску Podʼа або його перестворення. Якщо Pod ще не було запущено, ці зміни можуть вплинути на те, як він завантажиться.

Для [шаблону Podʼа](/docs/concepts/workloads/pods/#pod-templates) ви зазвичай можете змінити будь-яке поле init-контейнера; наслідки цієї зміни залежать від того, де використовується шаблон Podʼа.

Оскільки init-контейнери можуть бути перезапущені, повторно виконані або виконані заново, код init-контейнерів повинен бути ідемпотентним. Зокрема, код, що записує дані в будь-який том `emptyDir`, має бути підготовлений до того, що файл виводу вже може існувати.

Init-контейнери мають усі поля контейнера застосунку. Проте Kubernetes забороняє використання `readinessProbe`, оскільки init-контейнери не можуть визначати готовність окремо від завершення. Це забезпечується під час валідації.

Використовуйте `activeDeadlineSeconds` в Podʼі, щоб запобігти нескінченним збоям init-контейнерів. Активний крайній термін охоплює init-контейнери. Однак рекомендується використовувати `activeDeadlineSeconds` лише якщо команди розгортають свій застосунок як Job, оскільки `activeDeadlineSeconds` впливає навіть після завершення роботи init-контейнера. Pod, який вже працює правильно, буде завершено через `activeDeadlineSeconds`, якщо ви його налаштуєте.

Назва кожного контейнера застосунку та init-контейнера в Podʼі має бути унікальною; для контейнера, назва якого збігається з назвою іншого, буде згенеровано помилку валідації.

### Спільне використання ресурсів всередині контейнерів {#resource-sharing-within-containers}

З урахуванням порядку виконання init-контейнерів, sidecar-контейнерів і контейнерів застосунків застосовуються такі правила
використання ресурсів:

* Найвищий запит чи обмеження будь-якого конкретного ресурсу, визначеного у всіх init-контейнерах, вважається _ефективним запитом/обмеженням ініціалізації_. Якщо для будь-якого ресурсу не вказано обмеження, це вважається найвищим обмеженням.
* _Ефективний запит/обмеження Podʼа_ для ресурсу — це більше з:
  * суми запитів/обмежень усіх контейнерів застосунків для ресурсу
  * ефективного запиту/обмеження ініціалізації для ресурсу
* Планування виконується на основі ефективних запитів/обмежень, що означає, що init-контейнери можуть резервувати ресурси для ініціалізації, які не використовуються протягом життя Podʼа.
* Рівень якості обслуговування (QoS), _ефективний рівень QoS Podʼа_, — це рівень QoS як для init-контейнерів, так і для контейнерів застосунків.

Квоти та обмеження застосовуються на основі ефективного запиту та обмеження Podʼа.

### Init-контейнери та cgroups Linux {#cgroups}

У Linux розподіл ресурсів для контрольних груп (cgroups) рівня Podʼа ґрунтується на ефективному запиті та обмеженні Podʼа, так само як і для планувальника.

{{< comment >}}
Цей розділ також присутній на сторінці [sidecar-контейнерів](/docs/concepts/workloads/pods/sidecar-containers/). Якщо ви редагуєте цей розділ, змінюйте ці обидва місця.
{{< /comment >}}

### Причини перезапуску Podʼа {#pod-restart-reasons}

Pod може перезапускатися, що призводить до повторного виконання init-контейнерів, з таких причин:

* Перезапускається контейнер інфраструктури Podʼа. Це трапляється рідко, і це мав би зробити хтось із root-доступом до вузлів.
* Всі контейнери в Podʼі завершуються, коли `restartPolicy` встановлено в `Always`, що примушує до перезапуску, а запис про завершення init-контейнера було втрачено через {{< glossary_tooltip text="збір сміття" term_id="garbage-collection" >}}.

Pod не буде перезапущено, коли змінюється образ init-контейнера, або запис про завершення init-контейнера було втрачено через збір сміття. Це стосується Kubernetes v1.20 і пізніших версій. Якщо ви використовуєте старішу версію Kubernetes, ознайомтеся з документацією версії, яку ви використовуєте.

## {{% heading "whatsnext" %}} {#what-s-next}

Дізнайтеся більше про таке:

* [Створення Podʼа з init-контейнером](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* [Налагодження init-контейнерів](/docs/tasks/debug/debug-application/debug-init-containers/).
* Огляд [kubelet](/docs/reference/command-line-tools-reference/kubelet/) та [kubectl](/docs/reference/kubectl/).
* [Види проб](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup.
* [Sidecar-контейнери](/docs/concepts/workloads/pods/sidecar-containers).
