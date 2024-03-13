---
title: ConfigMaps
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="ConfigMap це" length="all" >}}

{{< caution >}}
ConfigMap не забезпечує конфіденційності або шифрування. Якщо дані, які ви хочете зберегти, конфіденційні, використовуйте {{< glossary_tooltip text="Secret" term_id="secret" >}} замість ConfigMap, або використовуйте додаткові (зовнішні) інструменти для збереження ваших даних в таємниці.
{{< /caution >}}

<!-- body -->

## Мотивація {#motivation}

Використовуйте ConfigMap для визначення конфігураційних даних окремо від коду застосунку.

Наприклад, уявіть, що ви розробляєте застосунок, який ви можете запускати на своєму власному компʼютері (для розробки) і в хмарі (для обробки реального трафіку). Ви пишете код, який переглядає змінну середовища з назвою `DATABASE_HOST`. Локально ви встановлюєте цю змінну як `localhost`. У хмарі ви встановлюєте її так, щоб вона посилалася на {{< glossary_tooltip text="Service" term_id="service" >}}, який надає доступ до компонент бази даних вашому кластеру. Це дозволяє вам отримати образ контейнера, який працює в хмарі, і в разі потреби налагоджувати той самий код локально.

{{< note >}}
ConfigMap не призначено для зберігання великих обсягів даних. Дані, збережені в ConfigMap, не можуть перевищувати 1 MiB. Якщо потрібно зберегти налаштування, які перевищують це обмеження, варто розглянути можливість монтування тому або використання
окремої бази даних або файлової служби.
{{< /note >}}

## Обʼєкт ConfigMap {#configmap-object}

ConfigMap — це обʼєкт {{< glossary_tooltip text="API" term_id="object" >}}, який дозволяє зберігати конфігураційні дані для використання іншими обʼєктами. На відміну від більшості обʼєктів Kubernetes, у яких є `spec`, ConfigMap має поля `data` та `binaryData`. Ці поля приймають пари ключ-значення як свої значення. Обидва поля `data` і `binaryData` є необовʼязковими. Поле `data` призначене для зберігання рядків UTF-8, тоді як поле `binaryData` призначене для зберігання бінарних даних у вигляді рядків, закодованих у base64.

Назва ConfigMap повинна бути дійсним [піддоменом DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Кожний ключ у полі `data` або `binaryData` повинен складатися з алфавітно-цифрових символів, `-`, `_` або `.`. Ключі, збережені в `data`, не повинні перетинатися з ключами у полі `binaryData`.

Починаючи з версії v1.19, ви можете додати поле `immutable` до визначення ConfigMap,
щоб створити [незмінний ConfigMap](#configmap-immutable).

## ConfigMaps та Podʼи {#configmaps-and-pods}

Ви можете написати `spec` Podʼа, який посилається на ConfigMap і конфігурує контейнер(и) в цьому Podʼі на основі даних з ConfigMap. Pod і ConfigMap повинні бути в тому самому {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

{{< note >}}
`spec` {{< glossary_tooltip text="статичного Podʼа" term_id="static-pod" >}} не може посилатися на ConfigMap або на інші обʼєкти API.
{{< /note >}}

Ось приклад ConfigMap, який має деякі ключі з одними значеннями, та інші ключі, де значення виглядає як фрагмент формату конфігурації.

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
1. В змінних середовища для контейнера
1. Додайте файл до тому тільки для читання, щоб застосунок міг його читати
1. Напишіть код для виконання всередині Podʼа, який використовує Kubernetes API для читання ConfigMap

Ці різні методи підходять для різних способів моделювання даних, які споживаються.
Для перших трьох методів {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} використовує дані з ConfigMap при запуску контейнер(ів) для Podʼа.

Четвертий метод означає, що вам потрібно написати код для читання ConfigMap та його даних. Однак, оскільки ви використовуєте прямий доступ до Kubernetes API, ваш застосунок може підписатися на отримання оновлень, коли змінюється ConfigMap, і реагувати на це. Завдяки прямому доступу до Kubernetes API цей технічний підхід також дозволяє вам отримувати доступ до ConfigMap в іншому namespace.

Ось приклад Podʼа, який використовує значення з `game-demo` для конфігурації Podʼа:

{{% code_sample file="configmap/configure-pod.yaml" %}}

ConfigMap не розрізняє значення властивостей з окремих рядків та багаторядкові файлоподібні значення. Важливо, як Podʼи та інші обʼєкти використовують ці значення.

У цьому прикладі визначення тому та монтування його всередину контейнера `demo` як `/config` створює два файли, `/config/game.properties` та `/config/user-interface.properties`, навіть якщо в ConfigMap є чотири ключі. Це тому, що визначення Podʼу вказує на масив `items` в розділі `volumes`. Якщо ви взагалі опустите масив `items`, кожен ключ у ConfigMap стане файлом з тією ж навою, що й ключ, і ви отримаєте 4 файли.

## Використання ConfigMap {#using-configmaps}

ConfigMap можуть бути змонтувані як томи з даними. ConfigMap також можуть бути використані іншими частинами системи, не піддаючись безпосередньому впливу Podʼу. Наприклад, ConfigMap можуть містити дані, які повинні використовуватися іншими частинами системи для конфігурації.

Найпоширеніший спосіб використання ConfigMap — це конфігурація налаштувань для контейнерів, які запускаються в Podʼі в тому ж namespace. Ви також можете використовувати
ConfigMap окремо.

Наприклад, ви можете зустріти {{< glossary_tooltip text="надбудови" term_id="addons" >}} або {{< glossary_tooltip text="оператори" term_id="operator-pattern" >}}, які налаштовують свою поведінку на основі ConfigMap.

### Використання ConfigMaps як файлів в Pod {#using-configmaps-as-files-from-a-pod}

Щоб використовувати ConfigMap в томі в Podʼі:

1. Створіть ConfigMap або використовуйте наявний. Декілька Podʼів можуть посилатися на один ConfigMap.
2. Змініть ваше визначення Podʼа, щоб додати том в `.spec.volumes[]`. Назвіть том будь-яким імʼям, та встановіть поле `.spec.volumes[].configMap.name` для посилання на ваш обʼєкт ConfigMap.
3. Додайте `.spec.containers[].volumeMounts[]` до кожного контейнера, який потребує ConfigMap. Вкажіть `.spec.containers[].volumeMounts[].readOnly = true` та `.spec.containers[].volumeMounts[].mountPath` в невикористану назву каталогу, де ви хочете, щоб зʼявився ConfigMap.
4. Змініть ваш образ або командний рядок так, щоб програма шукала файли у цьому каталозі. Кожен ключ в ConfigMap `data` стає імʼям файлу в `mountPath`.

Ось приклад Podʼа, який монуує ConfigMap в том:

```yaml
apiVersion: v1
kind:ʼPod {#configmap-object}
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

Якщо в Podʼі є кілька контейнерів, то кожен контейнер потребує свого власного блоку `volumeMounts`, але потрібно лише одне полу `.spec.volumes` на ConfigMap.

#### Змонтовані ConfigMaps оновлюються автоматично {#mounted-configmaps-are-updated-automatically}

Коли ConfigMap, що наразі використовується в томі, оновлюється, ключі, що зіставляються, в кінцевому підсумку також оновлюються. Kubelet перевіряє, чи змонтований ConfigMap є свіжим під час кожної синхронізації. Однак Kubelet використовує свій локальний кеш для отримання поточного значення ConfigMap. Тип кешу настроюється за допомогою поля `configMapAndSecretChangeDetectionStrategy` в [структурі KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/). ConfigMap можна поширити за допомогою watch (типово), на основі ttl або шляхом перенаправлення всіх запитів безпосередньо до сервера API. Отже, загальна затримка від моменту оновлення ConfigMap до моменту коли нові ключі зʼявляться в Pod може становити стільки, скільки й періодична затримка kubelet + затримка поширення кешу, де затримка поширення кешу залежить від обраного типу кешу (вона дорівнює затримці поширення watch, ttl кешу або нулю відповідно).

ConfigMap, що використовуються як змінні оточення, не оновлюються автоматично і потребують перезапуску Podʼа.

{{< note >}}
Контейнер, який використовує ConfigMap як том з монтуванням [subPath](/docs/concepts/storage/volumes#using-subpath), не отримує оновлення ConfigMap.
{{< /note >}}

## Незмінні ConfigMap {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Функція Kubernetes _Immutable Secrets та ConfigMaps_ надає опцію встановлення індивідуальних Secret та ConfigMap як незмінних. Для кластерів, що інтенсивно використовують ConfigMap (принаймні десятки тисяч унікальних монтувань ConfigMap до Podʼів), запобігання змінам їх даних має наступні переваги:

- захищає від випадкових (або небажаних) оновлень, які можуть призвести до відмов застосунків
- покращує продуктивність кластера шляхом значного зниження навантаження на kube-apiserver, закриваючи спостереження за ConfigMap, які позначені як незмінні.

Ви можете створити незмінний ConfigMap, встановивши поле `immutable` в `true`.
Наприклад:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

Після того як ConfigMap позначено як незмінний, змінити цю властивість або змінити вміст поля `data` або `binaryData` неможливо. Ви можете лише видалити та створити ConfigMap знову. Тому що поточні Podʼи підтримують точку монтування для видаленого ConfigMap, рекомендується перестворити ці Podʼи.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Secret](/docs/concepts/configuration/secret/).
- Прочитайте про [Налаштування Podʼа для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
- Дізнайтеся про [зміну ConfigMap (або будь-якого іншого обʼєкту Kubernetes)](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
- Прочитайте про [12-факторні застосунки](https://12factor.net/), щоб зрозуміти мотивацію для відокремлення коду від конфігурації.
