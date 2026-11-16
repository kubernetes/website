---
title: ConfigMaps
api_metadata:
- apiVersion: "v1"
  kind: "ConfigMap"
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="ConfigMap — це" length="all" >}}

{{< caution >}}
ConfigMap не забезпечує конфіденційності або шифрування. Якщо дані, які ви хочете зберегти, конфіденційні, використовуйте {{< glossary_tooltip text="Secret" term_id="secret" >}} замість ConfigMap або використовуйте додаткові (сторонні) інструменти для збереження ваших даних в таємниці.
{{< /caution >}}

<!-- body -->

## Мотивація {#motivation}

Використовуйте ConfigMap для визначення конфігураційних даних окремо від коду застосунку.

Наприклад, уявіть, що ви розробляєте застосунок, який ви можете запускати на власному компʼютері (для розробки) і в хмарі (для обробки реального трафіку). Ви пишете код, який читає змінну середовища з назвою `DATABASE_HOST`. Локально ви встановлюєте цю змінну в значення `localhost`. У хмарі ви встановлюєте її так, щоб вона посилалася на {{< glossary_tooltip text="Service" term_id="service" >}}, який надає доступ до компонента бази даних вашому кластеру. Це дозволяє вам отримати образ контейнера, який працює в хмарі, і у разі потреби налагоджувати той самий код локально.

{{< note >}}
ConfigMap не призначено для зберігання великих обсягів даних. Дані, збережені в ConfigMap, не можуть перевищувати 1 MiB. Якщо потрібно зберегти налаштування, які перевищують це обмеження, варто розглянути можливість монтування тому або використання окремої бази даних або файлового сервісу.
{{< /note >}}

## Обʼєкт ConfigMap {#configmap-object}

ConfigMap — це {{< glossary_tooltip text="обʼєкт API" term_id="object" >}}, який дозволяє зберігати конфігураційні дані для використання іншими обʼєктами. На відміну від більшості обʼєктів Kubernetes, у яких є `spec`, ConfigMap має поля `data` та `binaryData`. Ці поля приймають пари ключ-значення як свої значення. Обидва поля `data` і `binaryData` є необовʼязковими. Поле `data` призначене для зберігання рядків UTF-8, тоді як поле `binaryData` призначене для зберігання бінарних даних у вигляді рядків, закодованих у base64.

Назва ConfigMap повинна бути дійсним [піддоменом DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Кожний ключ у полі `data` або `binaryData` повинен складатися з буквено-цифрових символів, `-`, `_` або `.`. Ключі, збережені в `data`, не повинні перетинатися з ключами у полі `binaryData`.

Починаючи з версії v1.19, ви можете додати поле `immutable` до визначення ConfigMap, щоб створити [незмінний ConfigMap](#configmap-immutable).

## ConfigMaps та Podʼи {#configmaps-and-pods}

Ви можете написати `spec` Podʼа, який посилається на ConfigMap і конфігурує контейнер(и) в цьому Podʼі на основі даних з ConfigMap. Pod і ConfigMap повинні бути в тому самому {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}.

{{< note >}}
`spec` {{< glossary_tooltip text="статичного Podʼа" term_id="static-pod" >}} не може посилатися на ConfigMap або на інші обʼєкти API.
{{< /note >}}

Ось приклад ConfigMap, який має деякі ключі з окремими значеннями, а також інші ключі, де значення виглядає як фрагмент формату конфігурації.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # ключі у вигляді властивостей; кожен ключ зіставляється з простим значенням
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # ключі у формі файлів
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

Є чотири різних способи використання ConfigMap для конфігурації контейнера всередині Podʼа:

1. В команді та аргументах контейнера
1. У змінних середовища для контейнера
1. Додайте файл до тому тільки для читання, щоб застосунок міг його читати
1. Напишіть код для виконання всередині Podʼа, який використовує API Kubernetes для читання ConfigMap

Ці різні методи підходять для різних способів моделювання даних, які використовуються. Для перших трьох методів {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} використовує дані з ConfigMap під час запуску контейнера(ів) для Podʼа.

Четвертий метод означає, що вам потрібно написати код для читання ConfigMap та його даних. Однак, оскільки ви використовуєте прямий доступ до API Kubernetes, ваш застосунок може підписатися на отримання оновлень, коли змінюється ConfigMap, і реагувати на це. Завдяки прямому доступу до API Kubernetes цей підхід також дозволяє вам отримувати доступ до ConfigMap в іншому просторі імен.

Ось приклад Podʼа, який використовує значення з `game-demo` для конфігурації Podʼа:

{{% code_sample file="configmap/configure-pod.yaml" %}}

ConfigMap не розрізняє однорядкові значення властивостей та багаторядкові файлоподібні значення. Важливо, як Podʼи та інші обʼєкти використовують ці значення.

У цьому прикладі визначення тому та монтування його всередину контейнера `demo` як `/config` створює два файли, `/config/game.properties` та `/config/user-interface.properties`, хоча в ConfigMap є чотири ключі. Це тому, що визначення Podʼа містить масив `items` в розділі `volumes`. Якщо ви взагалі опустите масив `items`, кожен ключ у ConfigMap стане файлом із такою самою назвою, що й ключ, і ви отримаєте 4 файли.

## Використання ConfigMap {#using-configmaps}

ConfigMap можуть бути змонтовані як томи даних. ConfigMap також можуть бути використані іншими частинами системи без безпосереднього надання Podʼу. Наприклад, ConfigMap можуть містити дані, які повинні використовуватися іншими частинами системи для конфігурації.

Найпоширеніший спосіб використання ConfigMap — це налаштування контейнерів, які працюють у Podʼі в тому самому просторі імен. Ви також можете використовувати ConfigMap окремо.

Наприклад, ви можете зустріти {{< glossary_tooltip text="надбудови" term_id="addons" >}} або {{< glossary_tooltip text="оператори" term_id="operator-pattern" >}}, які налаштовують свою поведінку на основі ConfigMap.

### Використання ConfigMaps як файлів у Podʼі {#using-configmaps-as-files-from-a-pod}

Щоб використовувати ConfigMap в томі в Podʼі:

1. Створіть ConfigMap або використовуйте наявний. Декілька Podʼів можуть посилатися на один ConfigMap.
2. Змініть ваше визначення Podʼа, щоб додати том в `.spec.volumes[]`. Дайте тому будь-яку назву та встановіть поле `.spec.volumes[].configMap.name` для посилання на ваш обʼєкт ConfigMap.
3. Додайте `.spec.containers[].volumeMounts[]` до кожного контейнера, який потребує ConfigMap. Вкажіть `.spec.containers[].volumeMounts[].readOnly = true` та задайте в `.spec.containers[].volumeMounts[].mountPath` назву невикористаної теки, де ви хочете, щоб зʼявився ConfigMap.
4. Змініть ваш образ або командний рядок так, щоб програма шукала файли у цій теці. Кожен ключ у мапі `data` ConfigMap стає імʼям файлу в `mountPath`.

Ось приклад Podʼа, який монтує ConfigMap в том:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configMap:
      name: myconfigmap
```

Кожен ConfigMap, який ви хочете використовувати, слід зазначити в `.spec.volumes`.

Якщо в Podʼі є кілька контейнерів, то кожен контейнер потребує свого власного блоку `volumeMounts`, але потрібно лише одне поле `.spec.volumes` на ConfigMap.

#### Змонтовані ConfigMaps оновлюються автоматично {#mounted-configmaps-are-updated-automatically}

Коли ConfigMap, що наразі використовується в томі, оновлюється, спроєцьовані ключі згодом також оновлюються. Kubelet перевіряє, чи змонтований ConfigMap є актуальним під час кожної періодичної синхронізації. Однак kubelet використовує свій локальний кеш для отримання поточного значення ConfigMap. Тип кешу налаштовується за допомогою поля `configMapAndSecretChangeDetectionStrategy` в [структурі KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/). ConfigMap можна поширити за допомогою watch (типово), на основі ttl або шляхом перенаправлення всіх запитів безпосередньо до API-сервера. Отже, загальна затримка від моменту оновлення ConfigMap до моменту, коли нові ключі буде спроєцьовано в Pod, може дорівнювати періоду синхронізації kubelet + затримці поширення кешу, де затримка поширення кешу залежить від обраного типу кешу (вона дорівнює затримці поширення watch, ttl кешу або нулю відповідно).

ConfigMap, що використовуються як змінні середовища, не оновлюються автоматично і потребують перезапуску Podʼа.

{{< note >}}
Контейнер, який використовує ConfigMap як том з монтуванням [subPath](/docs/concepts/storage/volumes#using-subpath), не отримує оновлення ConfigMap.
{{< /note >}}

### Використання ConfigMaps як змінних середовища {#using-configmaps-as-environment-variables}

Щоб використовувати ConfigMap у {{< glossary_tooltip text="змінних середовища" term_id="container-env-variables" >}} в Podʼі:

1. Для кожного контейнера у вашій специфікації Podʼа додайте змінну середовища для кожного ключа ConfigMap, який ви хочете використовувати, до поля `env[].valueFrom.configMapKeyRef`.
1. Змініть ваш образ та/або командний рядок так, щоб програма шукала значення у вказаних змінних середовища.

Ось приклад визначення ConfigMap як змінної середовища Podʼа:

Цей ConfigMap (myconfigmap.yaml) містить дві властивості: username та access_level:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myconfigmap
data:
  username: k8s-admin
  access_level: "1"
```

Ця команда створить обʼєкт ConfigMap:

```shell
kubectl apply -f myconfigmap.yaml
```

Цей Pod використовує вміст ConfigMap як змінні середовища:

{{% code_sample file="configmap/env-configmap.yaml" %}}

Поле `envFrom` вказує Kubernetes створити змінні середовища з джерел, вкладених у нього. Внутрішній `configMapRef` посилається на ConfigMap за його назвою і вибирає всі його пари ключ-значення. Додайте Pod до свого кластера, а потім перегляньте його логи, щоб побачити виведення команди printenv. Це має підтвердити, що дві пари ключ-значення з ConfigMap були встановлені як змінні середовища:

```shell
kubectl apply -f env-configmap.yaml
```

```shell
kubectl logs pod/env-configmap
```

Вивід буде подібний до цього:

```console
...
username: "k8s-admin"
access_level: "1"
...
```

Іноді Pod не потребуватиме доступу до всіх значень у ConfigMap. Наприклад, можна мати інший Pod, який використовує тільки значення username з ConfigMap. Для цього випадку можна використовувати синтаксис `env.valueFrom`, який дозволяє вибирати окремі ключі в ConfigMap. Імʼя змінної середовища також може відрізнятися від ключа в ConfigMap. Наприклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
  - name: envars-test-container
    image: nginx
    env:
    - name: CONFIGMAP_USERNAME
      valueFrom:
        configMapKeyRef:
          name: myconfigmap
          key: username
```

У Podʼі, створеному з цього маніфесту, ви побачите, що змінна середовища `CONFIGMAP_USERNAME` встановлена на значення `username` з ConfigMap. Інші ключі з даних ConfigMap не будуть скопійовані у середовище.

Важливо зауважити, що набір символів, дозволених для назв змінних середовища в Podʼах, [обмежений](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config). Якщо будь-які ключі не відповідають правилам, ці ключі не будуть доступні вашому контейнеру, хоча Pod може бути запущений.

## Незмінні ConfigMap {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Функція Kubernetes _Immutable Secrets та ConfigMaps_ надає можливість зробити окремі Secrets та ConfigMaps незмінними. Для кластерів, що інтенсивно використовують ConfigMap (принаймні десятки тисяч унікальних монтувань ConfigMap до Podʼів), запобігання змінам їх даних має такі переваги:

- захищає від випадкових (або небажаних) оновлень, які можуть призвести до відмов застосунків
- покращує продуктивність кластера шляхом значного зниження навантаження на kube-apiserver, завдяки закриттю спостережень за ConfigMap, позначеними як незмінні.

Ви можете створити незмінний ConfigMap, встановивши поле `immutable` в `true`. Наприклад:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

Після того, як ConfigMap позначено як незмінний, відмінити цю зміну або змінити вміст поля `data` або `binaryData` неможливо. Ви можете лише видалити та створити ConfigMap знову. Оскільки поточні Podʼи підтримують точку монтування для видаленого ConfigMap, рекомендується створити заново ці Podʼи.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся більше про [Secret](/docs/concepts/configuration/secret/).
- Прочитайте про [Налаштування Podʼа для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
- Дізнайтеся про [зміну ConfigMap (або будь-якого іншого обʼєкта Kubernetes)](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
- Прочитайте про [12-факторні застосунки](https://12factor.net/), щоб зрозуміти мотивацію для відокремлення коду від конфігурації.
