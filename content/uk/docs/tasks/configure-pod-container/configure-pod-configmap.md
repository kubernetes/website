---
title: Налаштування Podʼів для використання ConfigMap
content_type: task
weight: 190
card:
  name: tasks
  weight: 50
---

<!-- overview -->

Багато застосунків покладаються на конфігурацію, яка використовується під час їх ініціалізації або виконання. Найчастіше потрібно коригувати значення, призначені параметрам конфігурації. ConfigMap — це механізм Kubernetes, який дає змогу вводити дані конфігурації в {{< glossary_tooltip text="Podʼи" term_id="pod" >}} застосунків.

Концепція ConfigMap дає змогу відокремити артефакти конфігурації від вмісту образу, щоб контейнеризовані застосунки залишалися переносними. Наприклад, можна завантажити той самий {{< glossary_tooltip text="образ контейнера" term_id="image" >}} і запускати з нього контейнери для локальної розробки, тестування системи або роботи реальних навантажень для кінцевих користувачів.

Ця сторінка містить низку прикладів, які показують, як створювати ConfigMap і налаштовувати Podʼи за допомогою даних, що зберігаються в ConfigMap.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

У вас має бути встановлений інструмент `wget`. Якщо у вас є інший інструмент, наприклад `curl`, а `wget` немає, доведеться адаптувати крок, який завантажує приклади даних.

<!-- steps -->

## Створення ConfigMap {#create-a-configmap}

Щоб створити ConfigMap, можна використати `kubectl create configmap` або генератор ConfigMap у `kustomization.yaml`.

### Створення ConfigMap за допомогою `kubectl create configmap` {#create-a-configmap-using-kubectl-create-configmap}

Скористайтеся командою `kubectl create configmap`, щоб створити ConfigMap з [тек](#create-configmaps-from-directories), [файлів](#create-configmaps-from-files) або [літеральних значень](#create-configmaps-from-literal-values):

```shell
kubectl create configmap <map-name> <data-source>
```

де \<map-name> — це імʼя, яке ви хочете призначити ConfigMap, а \<data-source> — тека, файл або літеральне значення, з якого беруться дані. Імʼя обʼєкта ConfigMap має бути дійсним [імʼям субдомену DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Коли ви створюєте ConfigMap на основі файлу, ключ у \<data-source> стандартно дорівнює базовому імені файлу, а значення — вмісту файлу.

Для отримання інформації про ConfigMap можна використовувати [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) або [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get).

#### Створення ConfigMap з теки {#create-configmaps-from-directories}

Ви можете використовувати `kubectl create configmap`, щоб створити ConfigMap з кількох файлів у тій самій теці. Коли ви створюєте ConfigMap на основі теки, kubectl ідентифікує файли, імʼя яких є допустимим ключем у теці, та пакує кожен з цих файлів у новий ConfigMap. Всі записи теки, окрім звичайних файлів, ігноруються (наприклад: підтеки, символьні посилання, пристрої, канали тощо).

{{< note >}}
Імʼя кожного файлу, яке використовується для створення ConfigMap, має складатися лише з прийнятних символів, а саме: літери (`A` до `Z` та `a` до `z`), цифри (`0` до `9`), '-', '_', або '.'. Якщо ви використовуєте `kubectl create configmap` з текою, де імʼя будь-якого файлу містить неприйнятний символ, команда `kubectl` може завершитись з помилкою.

Команда `kubectl` не виводить повідомлення про помилку, коли зустрічає недопустиме імʼя файлу.
{{< /note >}}

Створіть локальну теку:

```shell
mkdir -p configure-pod-container/configmap/
```

Тепер завантажте приклад конфігурації та створіть ConfigMap:

```shell
# Завантажте файли у теку `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Створіть ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

Вказана вище команда упаковує кожен файл, у цьому випадку `game.properties` та `ui.properties` у теці `configure-pod-container/configmap/` у ConfigMap game-config. Ви можете показати деталі ConfigMap за допомогою такої команди:

```shell
kubectl describe configmaps game-config
```

Вивід буде приблизно таким:

```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Файли `game.properties` та `ui.properties` у теці `configure-pod-container/configmap/` представлені у секції `data` ConfigMap.

```shell
kubectl get configmaps game-config -o yaml
```

Вивід буде приблизно таким:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### Створення ConfigMaps з файлів {#create-configmaps-from-files}

Ви можете використовувати `kubectl create configmap` для створення ConfigMap з окремого файлу або з декількох файлів.

Наприклад,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

створить такий ConfigMap:

```shell
kubectl describe configmaps game-config-2
```

де вивід буде схожий на це:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

Ви можете вказати аргумент `--from-file` кілька разів, щоб створити ConfigMap із кількох джерел даних.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

Можете переглянути деталі ConfigMap `game-config-2` за допомогою такої команди:

```shell
kubectl describe configmaps game-config-2
```

Вивід буде схожий на це:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Використовуйте параметр `--from-env-file` для створення ConfigMap з env-файлу, наприклад:

```shell
# Env-файли містять список змінних середовища.
# На ці синтаксичні правила слід звертати увагу:
#   Кожен рядок у env-файлі повинен бути у форматі VAR=VAL.
#   Рядки, які починаються з # (тобто коментарі), ігноруються.
#   Порожні рядки ігноруються.
#   Особливого врахування лапок немає (тобто вони будуть частиною значення у ConfigMap).

# Завантажте приклад файлів у теку `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Env-файл `game-env-file.properties` виглядає так
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# Цей коментар та порожній рядок вище ігноруються
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

створить ConfigMap. Перегляньте ConfigMap:

```shell
kubectl get configmap game-config-env-file -o yaml
```

вивід буде схожий на:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

Починаючи з Kubernetes v1.23, `kubectl` підтримує аргумент `--from-env-file`, який може бути вказаний кілька разів для створення ConfigMap із кількох джерел даних.

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

створить такий ConfigMap:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

де вивід буде схожий на це:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

#### Визначення ключа для створення ConfigMap з файлу {#define-the-key-to-use-when-creating-a-configmap-from-a-file}

Ви можете визначити ключ, відмінний від імені файлу, який буде використаний у розділі `data` вашого ConfigMap під час використання аргументу `--from-file`:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

де `<my-key-name>` — це ключ, який ви хочете використовувати в ConfigMap, а `<path-to-file>` — це місцезнаходження файлу джерела даних, яке ключ має представляти.

Наприклад:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

створить такий ConfigMap:

```
kubectl get configmaps game-config-3 -o yaml
```

де вивід буде схожий на це:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### Створення ConfigMaps з літеральних значень {#create-configmaps-from-literal-values}

Ви можете використовувати `kubectl create configmap` з аргументом `--from-literal`, щоб визначити літеральне значення з командного рядка:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

Ви можете передати декілька пар ключ-значення. Кожна пара, надана у командному рядку, представлена як окремий запис у розділі `data` ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

Вивід буде схожий на це:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### Створення ConfigMap за допомогою генератора {#create-a-configmap-from-generator}

Також можна створити ConfigMap за допомогою генераторів, а потім застосувати його, щоб створити обʼєкт на API-сервері кластера. Генератори слід вказати у файлі `kustomization.yaml` у теці.

#### Генерація ConfigMaps з файлів {#generate-configmaps-from-files}

Наприклад, для створення ConfigMap з файлів `configure-pod-container/configmap/game.properties`:

```shell
# Створіть файл kustomization.yaml з ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  options:
    labels:
      game-config: config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

Застосуйте теку kustomization для створення обʼєкта ConfigMap:

```shell
kubectl apply -k .
```

```
configmap/game-config-4-m9dm2f92bt created
```

Ви можете перевірити, що ConfigMap був створений так:

```shell
kubectl get configmap
```

```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s
```

а також:

```shell
kubectl describe configmaps/game-config-4-m9dm2f92bt
```

```
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       game-config=config-4
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

Зверніть увагу, що до згенерованої назви ConfigMap додано суфікс хешування вмісту. Це забезпечує генерацію нового ConfigMap кожного разу, коли вміст змінюється.

#### Визначення ключа для використання під час генерації ConfigMap з файлу {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

Ви можете визначити ключ, відмінний від імені файлу, для використання у генераторі ConfigMap. Наприклад, для генерації ConfigMap з файлів `configure-pod-container/configmap/game.properties` з ключем `game-special-key`:

```shell
# Створіть файл kustomization.yaml з ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  options:
    labels:
      game-config: config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

Застосуйте теку kustomization, щоб створити обʼєкт ConfigMap.

```shell
kubectl apply -k .
```

```
configmap/game-config-5-m67dt67794 created
```

#### Генерація ConfigMap з літералів {#generate-configmaps-from-literals}

У цьому прикладі показано, як створити `ConfigMap` з двох пар ключ/значення: `special.type=charm` та `special.how=very`, використовуючи Kustomize та kubectl. Для досягнення цього, ви можете вказати генератор `ConfigMap`. Створіть (або замініть) `kustomization.yaml`, щоб мати наступний вміст:

```yaml
---
# Вміст kustomization.yaml для створення ConfigMap з літералів
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
```

Застосуйте теку kustomization для створення обʼєкта ConfigMap:

```shell
kubectl apply -k .
```

```
configmap/special-config-2-c92b5mmcf2 created
```

## Проміжне очищення {#interim-cleanup}

Перед продовженням, очистіть деякі з ConfigMaps, які ви створили:

```bash
kubectl delete configmap special-config
kubectl delete configmap env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

Тепер, коли ви вивчили, як визначати ConfigMaps, ви можете перейти до наступного розділу і дізнатися, як використовувати ці обʼєкти з Pod.

---

## Визначення змінних середовища контейнера за допомогою даних з ConfigMap {#define-container-environment-variables-using-configmap-data}

### Визначення змінної середовища контейнера за допомогою даних з одного ConfigMap {#define-a-container-environment-variable-with-data-from-a-single-configmap}

1. Визначте змінну середовища як пару ключ-значення в ConfigMap:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

2. Присвойте значення `special.how`, визначене в ConfigMap, змінній середовища `SPECIAL_LEVEL_KEY` у специфікації Pod.

   {{% code_sample file="pods/pod-single-configmap-env-variable.yaml" %}}

   Створіть Pod:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   Тепер вивід Podʼа містить змінну середовища `SPECIAL_LEVEL_KEY=very`.

### Визначення змінних середовища контейнера з даних з кількох ConfigMaps {#define-container-environment-variables-with-data-from-multiple-configmaps}

Так само як у попередньому прикладі, спочатку створіть ConfigMaps. Ось маніфест, який ви будете використовувати:

{{% code_sample file="configmap/configmaps.yaml" %}}

* Створіть ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

* Визначте змінні середовища у специфікації Pod.

  {{% code_sample file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  Створіть Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  Тепер виведення Pod містить змінні середовища `SPECIAL_LEVEL_KEY=very` та `LOG_LEVEL=INFO`.

  Як тільки ви готові перейти далі, видаліть цей Pod та ConfigMaps:

  ```shell
  kubectl delete pod dapi-test-pod --now
  kubectl delete configmap special-config
  kubectl delete configmap env-config
  ```

## Налаштування всіх пар ключ-значення в ConfigMap як змінних середовища контейнера {#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables}

* Створіть ConfigMap, який містить кілька пар ключ-значення.

  {{% code_sample file="configmap/configmap-multikeys.yaml" %}}

  Створіть ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

* Використовуйте `envFrom`, щоб визначити всі дані ConfigMap як змінні середовища контейнера. Ключ з ConfigMap стає іменем змінної середовища в Pod.

  {{% code_sample file="pods/pod-configmap-envFrom.yaml" %}}

  Створіть Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  Тепер виведення Pod містить змінні середовища `SPECIAL_LEVEL=very` та
  `SPECIAL_TYPE=charm`.

  Як тільки ви готові перейти далі, видаліть цей Pod:

  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

## Використання змінних середовища, визначених у ConfigMap, у командах Pod {#use-configmap-defined-environment-variables-in-pod-commands}

Ви можете використовувати змінні середовища, визначені у ConfigMap, у розділі `command` та `args` контейнера за допомогою синтаксису підстановки Kubernetes `$(VAR_NAME)`.

Наприклад, такий маніфест Podʼа:

{{% code_sample file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

Створіть цей Pod, запустивши:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

Цей Pod видає такий вивід від контейнера `test-container`:

```shell
kubectl logs dapi-test-pod
```

```
very charm
```

Як тільки ви готові перейти далі, видаліть цей Pod:

```shell
kubectl delete pod dapi-test-pod --now
```

## Додавання даних ConfigMap до тому {#add-configmap-data-to-a-volume}

Як пояснено у розділі [Створення ConfigMap з файлів](#create-configmaps-from-files), коли ви створюєте ConfigMap, використовуючи `--from-file`, імʼя файлу стає ключем, збереженим у розділі `data` ConfigMap. Вміст файлу стає значенням ключа.

Приклади в цьому розділі відносяться до ConfigMap з іменем `special-config`:

{{% code_sample file="configmap/configmap-multikeys.yaml" %}}

Створіть ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Заповнення тому даними, збереженими в ConfigMap {#populate-a-volume-with-data-stored-in-a-configmap}

Додайте імʼя ConfigMap у розділ `volumes` специфікації Pod. Це додасть дані ConfigMap до теки, вказаної як `volumeMounts.mountPath` (у цьому випадку, `/etc/config`). Розділ `command` перераховує файли теки з іменами, що відповідають ключам у ConfigMap.

{{% code_sample file="pods/pod-configmap-volume.yaml" %}}

Створіть Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

Коли Pod працює, команда `ls /etc/config/` виводить таке:

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

Текстові дані показуються у вигляді файлів з використанням кодування символів UTF-8. Щоб використовувати інше кодування символів, скористайтеся `binaryData` (див. [обʼєкт ConfigMap](/docs/concepts/configuration/configmap/#configmap-object) для докладніших відомостей).

{{< note >}}
Якщо в теці `/etc/config` образу контейнера є будь-які файли, то змонтований том робить ці файли образу недоступними.
{{< /note >}}

Якщо ви готові перейти до наступного кроку, видаліть цей Pod:

```shell
kubectl delete pod dapi-test-pod --now
```

### Додавання даних ConfigMap до певного шляху в томі {#add-configmap-data-to-a-specific-path-in-the-volume}

Використовуйте поле `path`, щоб вказати бажаний шлях до файлів для конкретних елементів ConfigMap. У цьому випадку елемент `SPECIAL_LEVEL` буде змонтовано у томі `config-volume` за адресою `/etc/config/keys`.

{{% code_sample file="pods/pod-configmap-volume-specific-key.yaml" %}}

Створіть Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Коли Pod працює, команда `cat /etc/config/keys` виводить наведене нижче:

```
very
```

{{< caution >}}
Як і раніше, усі попередні файли в теці `/etc/config/` будуть недоступні.
{{< /caution >}}

Видаліть цей Pod:

```shell
kubectl delete pod dapi-test-pod --now
```

### Проєкція ключів на конкретні шляхи та права доступу до файлів {#project-keys-to-specific-paths-and-file-permissions}

Ключі можна проєктувати на конкретні шляхи. Синтаксис дивіться у відповідному розділі [посібника щодо Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths). Для ключів можна встановлювати права доступу POSIX. Синтаксис дивіться у відповідному розділі [посібника щодо Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys).

### Необовʼязкові посилання {#optional-references}

Посилання на ConfigMap можна позначити як _необовʼязкове_. Якщо ConfigMap не існує, змонтований том буде порожнім. Якщо ConfigMap існує, але ключ, на який посилаються, не існує, відповідного шляху в точці монтування не буде. Докладніше дивіться [Необовʼязкові ConfigMap](#optional-configmaps).

### Змонтовані ConfigMap оновлюються автоматично {#mounted-configmaps-are-updated-automatically}

Коли змонтований ConfigMap оновлюється, вміст проєкції зрештою теж оновлюється. Це стосується й випадку, коли ConfigMap, на який посилаються як на необовʼязковий, зʼявляється після запуску Podʼа.

Kubelet перевіряє актуальність змонтованого ConfigMap під час кожної періодичної синхронізації. Однак для отримання поточного значення ConfigMap він використовує свій локальний кеш на основі TTL. У результаті загальна затримка від моменту оновлення ConfigMap до моменту, коли нові ключі проєктуються в Pod, може сягати періоду синхронізації kubelet (стандартно 1 хвилина) + TTL кешу ConfigMap (стандартно 1 хвилина) у kubelet. Негайне оновлення можна викликати, оновивши одну з анотацій Podʼа.

{{< note >}}
Контейнери, які використовують ConfigMap як том [subPath](/docs/concepts/storage/volumes/#using-subpath) не отримуватимуть оновлення ConfigMap.
{{< /note >}}

## Розуміння ConfigMap та Podʼів {#understanding-configmaps-and-pods}

Ресурс API ConfigMap зберігає дані конфігурації у вигляді пар ключ-значення. Дані можна використовувати в Podʼах або для надання конфігурації системним компонентам, таким як контролери. ConfigMap схожий на [Secret](/docs/concepts/configuration/secret/), але надає засоби для роботи з рядками, що не містять конфіденційної інформації. Як користувачі, так і системні компоненти можуть зберігати дані конфігурації в ConfigMap.

{{< note >}}
ConfigMaps повинні посилатися на файли властивостей, а не заміняти їх. Подумайте про ConfigMap як щось подібне до теки `/etc` в Linux та її вмісту. Наприклад, якщо ви створюєте [Том Kubernetes](/docs/concepts/storage/volumes/) з ConfigMap, кожен елемент даних у ConfigMap представлений окремим файлом у томі.
{{< /note >}}

Поле `data` у ConfigMap містить дані конфігурації. Як показано у прикладі нижче, це може бути простим (наприклад, окремі властивості, визначені за допомогою `--from-literal`) або складним (наприклад, файли конфігурації або JSON-фрагменти, визначені за допомогою `--from-file`).

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # приклад простої властивості, визначеної за допомогою --from-literal
  example.property.1: hello
  example.property.2: world
  # приклад складної властивості, визначеної за допомогою --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

Коли `kubectl` створює ConfigMap з вхідних даних, які не є ASCII або UTF-8, цей інструмент поміщає їх у поле `binaryData` ConfigMap, а не в `data`. Як текстові, так і бінарні дані можуть бути поєднані в одному ConfigMap.

Щоб переглянути ключі `binaryData` (і їхні значення) у ConfigMap, можна виконати `kubectl get configmap -o jsonpath='{.binaryData}' <name>`.

Podʼи можуть завантажувати дані з ConfigMap, що використовують як `data`, так і `binaryData`.

## Необовʼязкові ConfigMap {#optional-configmaps}

Посилання на ConfigMap у специфікації Podʼа можна позначити як _необовʼязкове_. Якщо ConfigMap не існує, конфігурація, для якої він надає дані в Podʼі (наприклад, змінна середовища чи змонтований том), буде порожньою. Якщо ConfigMap існує, але ключ, на який посилаються, не існує, дані також будуть порожніми.

Наприклад, така специфікація Podʼа позначає змінну середовища з ConfigMap як необовʼязкову:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "env"]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: a-config
              key: akey
              optional: true # позначає змінну як опціональну
  restartPolicy: Never
```

Якщо ви запустите цей Pod, і ConfigMap з імʼям `a-config` не існує, вивід буде пустим. Якщо ви запустите цей Pod, і ConfigMap з імʼям `a-config` існує, але в цьому ConfigMap немає ключа з імʼям `akey`, вивід також буде пустим. Якщо ж ви задасте значення для `akey` в ConfigMap `a-config`, цей Pod надрукує це значення і потім завершить роботу.

Також можна позначити як необовʼязкові томи та файли, які надає ConfigMap. Kubernetes завжди створює шляхи монтування для тому, навіть якщо ConfigMap або ключ, на які посилаються, не існують. Наприклад, така специфікація Podʼа позначає том, який посилається на ConfigMap, як необовʼязковий:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "ls /etc/config"]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: no-config
        optional: true # позначає ConfigMap як опціональний
  restartPolicy: Never
```

## Обмеження {#restrictions}

- Обʼєкт `ConfigMap` потрібно створити до того, як ви посилатиметеся на нього в специфікації Podʼа. Або ж позначте посилання на ConfigMap у специфікації Podʼа як `optional` (дивіться [Необовʼязкові ConfigMap](#optional-configmaps)). Якщо ви посилаєтеся на ConfigMap, який не існує, і не позначили посилання як `optional`, Pod не запуститься. Так само посилання на ключі, яких немає в ConfigMap, не дадуть Podʼу запуститися, якщо ви не позначите посилання на ключі як `optional`.

- Якщо ви використовуєте `envFrom` для визначення змінних середовища з ConfigMap, ключі, які вважаються недійсними, буде пропущено. Podʼу буде дозволено запуститися, але недійсні імена буде записано в лог подій (`InvalidVariableNames`). Повідомлення логу перелічує кожен пропущений ключ. Наприклад:

  ```shell
  kubectl get events
  ```

  Вивід буде схожий на цей:

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

- ConfigMap розташовані в певному {{< glossary_tooltip term_id="namespace" >}}. Podʼи можуть посилатися лише на ConfigMap, які розташовані в тому самому просторі імен, що й Pod.

- ConfigMap не можна використовувати для {{< glossary_tooltip text="статичних Podʼів" term_id="static-pod" >}}, оскільки kubelet цього не підтримує.

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть ConfigMap і Podʼи, які ви створили:

```bash
kubectl delete configmaps/game-config configmaps/game-config-2 configmaps/game-config-3 \
               configmaps/game-config-env-file
kubectl delete pod dapi-test-pod --now

# Можливо, ви вже видалили наступний набір
kubectl delete configmaps/special-config configmaps/env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

Видаліть файл `kustomization.yaml`, який ви створили для генерації ConfigMap:

```bash
rm kustomization.yaml
```

Якщо ви створили теку `configure-pod-container` і вже не потребуєте її, вам слід також її видалити або перемістити в кошик або місце для видалених файлів.

```bash
rm -r configure-pod-container
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Ознайомтесь з прикладом [налаштування Redis за допомогою ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
* Ознайомтесь з прикладом [оновлення конфігурації через ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
