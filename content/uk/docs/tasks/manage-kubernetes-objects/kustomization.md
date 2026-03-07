---
title: Декларативне керування обʼєктами Kubernetes за допомогою Kustomize
content_type: task
weight: 20
---

<!-- overview -->

[Kustomize](https://github.com/kubernetes-sigs/kustomize) — це окремий інструмент для налаштування обʼєктів Kubernetes за допомогою [файлу кастомізації](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization).

Починаючи з версії 1.14, kubectl також підтримує керування обʼєктами Kubernetes за допомогою файлу кастомізації. Для перегляду ресурсів, знайдених у теці, що містить файл кастомізації, виконайте наступну команду:

```shell
kubectl kustomize <kustomization_directory>
```

Щоб застосувати ці ресурси, запустіть `kubectl apply` з прапорцем `--kustomize` або `-k`:

```shell
kubectl apply -k <kustomization_directory>
```

## {{% heading "prerequisites" %}}

Встановіть [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Огляд Kustomize {#overview-of-kustomize}

Kustomize — це інструмент для налаштування конфігурацій Kubernetes. Він має наступні функції для керування файлами конфігурації застосунків:

* генерація ресурсів з інших джерел
* встановлення наскрізних полів для ресурсів
* складання та налаштування колекцій ресурсів

### Генерування ресурсів {#generating-resources}

ConfigMaps та Secrets зберігають конфігураційні або конфіденційні дані, які використовуються іншими обʼєктами Kubernetes, наприклад, Podʼами. Джерело істини для ConfigMaps або Secrets є зазвичай зовнішнім до кластера, наприклад як файл `.properties` або файл ключів SSH. Kustomize має `secretGenerator` та `configMapGenerator`, які створюють Secret та ConfigMap з файлів або літералів.

#### configMapGenerator

Щоб створити ConfigMap з файлу, додайте запис до списку `files` в `configMapGenerator`. Ось приклад створення ConfigMap з елементом даних з файлу `.properties`:

```shell
# Створіть файл application.properties
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

Згенерований ConfigMap можна переглянути за допомогою наступної команди:

```shell
kubectl kustomize ./
```

Згенерований ConfigMap виглядає так:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```

Щоб створити ConfigMap з файлу оточення (env), додайте запис до списку `envs` в `configMapGenerator`. Ось приклад створення ConfigMap з елементом даних з файлу `.env`:

```shell
# Створіть файл .env
cat <<EOF >.env
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  envs:
  - .env
EOF
```

Згенерований ConfigMap можна переглянути за допомогою наступної команди:

```shell
kubectl kustomize ./
```

Згенерований ConfigMap виглядає так:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-42cfbf598f
```

{{< note >}}
Кожна змінна у файлі `.env` стає окремим ключем в ConfigMap, який ви генеруєте. Це відрізняється від попереднього прикладу, в якому вбудовується файл з назвою `application.properties` (та всі його записи) як значення для одного ключа.
{{< /note >}}

ConfigMaps також можна створювати з літеральних пар ключ-значення. Щоб створити ConfigMap з літеральною парою ключ-значення, додайте запис до списку `literals` в `configMapGenerator`. Ось приклад створення ConfigMap з елементом даних з пари ключ-значення:

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

Згенерований ConfigMap можна перевірити за допомогою наступної команди:

```shell
kubectl kustomize ./
```

Згенерований ConfigMap виглядає так:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

Щоб використовувати згенерований ConfigMap у Deployment, посилайтеся на нього за іменем configMapGenerator. Kustomize автоматично замінить це імʼя згенерованим.

Ось приклад Deployment, що використовує згенерований ConfigMap:

```yaml
# Створіть файл application.properties
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

Згенеруйте ConfigMap та Deployment:

```shell
kubectl kustomize ./
```

Згенерований Deployment буде посилатися на згенерований ConfigMap за іменем:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-g4hk9g2ff8
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: my-app
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - image: my-app
        name: app
        volumeMounts:
        - mountPath: /config
          name: config
      volumes:
      - configMap:
          name: example-configmap-1-g4hk9g2ff8
        name: config
```

#### secretGenerator

Ви можете створювати Secrets з файлів або літеральних пар ключ-значення. Щоб створити Secret з файлу, додайте запис до списку `files` в `secretGenerator`. Ось приклад створення Secret з елементом даних з файлу:

```shell
# Створіть файл password.txt
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

Згенерований Secret має наступний вигляд:

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

Щоб створити Secret з літеральною парою ключ-значення, додайте запис до списку `literals` в `secretGenerator`. Ось приклад створення Secret з елементом даних з пари ключ-значення:

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

Згенерований Secret має наступний вигляд:

```yaml
apiVersion: v1
data:
  password: c2VjcmV0
  username: YWRtaW4=
kind: Secret
metadata:
  name: example-secret-2-t52t6g96d8
type: Opaque
```

Подібно до ConfigMaps, створені Secrets можна використовувати у Deployment, посилаючись на імʼя secretGenerator:

```shell
# Створіть файл password.txt
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: password
          mountPath: /secrets
      volumes:
      - name: password
        secret:
          secretName: example-secret-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

#### generatorOptions

Згенеровані ConfigMaps та Secrets мають суфікс хешу вмісту, що додається. Це забезпечує створення нового ConfigMap або Secret при зміні вмісту. Щоб вимкнути поведінку додавання суфікса, можна використовувати `generatorOptions`. Крім того, також можливо вказати загальні опції для згенерованих ConfigMaps та Secrets.

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-3
  literals:
  - FOO=Bar
generatorOptions:
  disableNameSuffixHash: true
  labels:
    type: generated
  annotations:
    note: generated
EOF
```

Виконайте `kubectl kustomize ./`, щоб переглянути згенерований ConfigMap:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  annotations:
    note: generated
  labels:
    type: generated
  name: example-configmap-3
```

### Встановлення загальних наскрізних полів {#setting-cross-cutting-fields}

Досить поширене явище — встановлення загальних наскрізних полів для всіх ресурсів Kubernetes у проєкті. Деякі випадки встановлення загальних полів:

* встановлення одного й того ж простору імен для всіх ресурсів
* додавання одного й того ж префікса чи суфікса до імені
* додавання одного й того ж набору міток
* додавання одного й того ж набору анотацій

Ось приклад:

```shell
# Створіть deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
labels:
  - pairs:
      app: bingo
    includeSelectors: true
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

Виконайте `kubectl kustomize ./`, щоб переглянути, як ці поля встановлені у ресурсі Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```

### Компонування та кастомізація ресурсів {#composing-and-customizing-resources}

Часто в проєкті складають набір ресурсів та керують ними всередині одного файлу чи теки. Kustomize пропонує компонування ресурсів з різних файлів та застосування патчів чи інших налаштувань до них.

#### Компонування {#composing}

Kustomize підтримує компонування різних ресурсів. Поле `resources` у файлі `kustomization.yaml` визначає список ресурсів, які слід включити в конфігурацію. Встановіть шлях до файлу конфігурації ресурсу у списку `resources`. Ось приклад додавання до конфігурації застосунку NGINX, що складається з Deployment та Service:

```shell
# Створіть файл deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Створіть файл service.yaml
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# Створіть файл kustomization.yaml та скомпонуйте їх
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

Ресурси з `kubectl kustomize ./` містять обʼєкти як Deployment, так і Service.

#### Кастомізація {#customizing}

Патчі можуть бути використані для застосування різних кастомізацій до ресурсів. Kustomize підтримує різні механізми патчів через `StrategicMerge` та `Json6902` за допомогою поля `patches`. `patches` може бути файлом або вбудованим рядком, спрямованим на один або декілька ресурсів.

Поле `patches` містить список застосованих патчів у порядку їхнього зазначення. Патч вибирає ресурси за `group`, `version`, `kind`, `name`, `namespace`, `labelSelector` і `annotationSelector`.

Рекомендується створювати невеликі патчі, які виконують одну задачу. Наприклад, створіть один патч для збільшення номера репліки розгортання, а інший — для встановлення ліміту памʼяті. Цільовий ресурс буде знайдено за допомогою полів `group`, `version`, `kind` і `name` з файлу патчу.

```shell
# Створіть файл deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Створіть патч increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# Створіть інший патч set_memory.yaml
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
          limits:
            memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patches:
  - path: increase_replicas.yaml
  - path: set_memory.yaml
EOF
```

Виконайте `kubectl kustomize ./`, щоб переглянути Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 512Mi
```

Не всі ресурси чи поля підтримують патчі  `strategicMerge`. Для підтримки зміни довільних полів у довільних Ресурсах, Kustomize пропонує застосування [JSON патчів](https://tools.ietf.org/html/rfc6902) через `patchesJson6902`. Щоб знайти правильний Ресурс для патча `Json6902`, обовʼязково потрібно вказати поле `target` у файлі `kustomization.yaml`.

Наприклад, збільшити кількість реплік обʼєкта Deployment можна також за допомогою патчу `Json6902`. Цільовий ресурс знаходиться за допомогою `group`, `version`, `kind` та `name` з поля `target`.

```shell
# Створіть файл deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Створіть json патч
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# Створіть kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patches:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

Виконайте `kubectl kustomize ./`, щоб побачити, що поле `replicas` оновлене:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```

Крім патчів, Kustomize також пропонує налаштування контейнерних образів або введення значень полів з інших обʼєктів в контейнери без створення патчів. Наприклад, ви можете змінити використаний образ усередині контейнерів, вказавши новий образ у полі `images` у `kustomization.yaml`.

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: "1.4.0"
EOF
```

Виконайте `kubectl kustomize ./`, щоб переглянути, що використовується оновлений образ:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```

Іноді застосунок, що працює у Podʼі, може потребувати використання значень конфігурації з інших обʼєктів. Наприклад, Pod з обʼєкту Deployment повинен читати відповідне імʼя Service з Env або як аргумент команди. Оскільки імʼя Service може змінюватися через `namePrefix` або `nameSuffix`, додавання імені Service у командний аргумент не рекомендується. Для цього використовується Kustomize, що вводить імʼя Service в контейнери через `replacements`.

```shell
# Створіть файл deployment.yaml (взявши в лапки роздільник документа)
cat <<'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "MY_SERVICE_NAME_PLACEHOLDER"]
EOF

# Створіть файл service.yaml
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

replacements:
- source:
    kind: Service
    name: my-nginx
    fieldPath: metadata.name
  targets:
  - select:
      kind: Deployment
      name: my-nginx
    fieldPaths:
    - spec.template.spec.containers.0.command.2
EOF
```

Виконайте `kubectl kustomize ./`, щоб побачити, що імʼя Service, введене у контейнери, — це `dev-my-nginx-001`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

## Base та Overlay {#bases-and-overlays}

У Kustomize існують концепції **base** та **overlay**. **Base** — це тека з файлом `kustomization.yaml`, яка містить набір ресурсів та повʼязані налаштування. Base може бути як локальною текою, так і текою з віддаленого репозиторію, якщо присутній файл `kustomization.yaml`. **Overlay** — це тека з файлом `kustomization.yaml`, яка посилається на інші теки з налаштуваннями як на свої `base` компоненти. **Base** не знає про overlay і може використовуватися в кількох overlay.

Файл `kustomization.yaml` у теці **overlay** може посилатися на декілька `bases`, обʼєднуючи всі ресурси, визначені у цих базах, в єдину конфігурацію. Крім того, він може застосовувати кастомізації поверх цих ресурсів, щоб задовольнити певні вимоги.

Ось приклад base:

```shell
# Створіть теку для зберігання base
mkdir base
# Створіть файл base/deployment.yaml
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# Створіть файл base/service.yaml
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF
# Створіть файл base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

Цю базу можна використовувати в кількох overlay. Ви можете додавати різний `namePrefix` або інші загальні поля у різних overlay. Ось два overlay, які використовують один і той же base.

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
resources:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
resources:
- ../base
namePrefix: prod-
EOF
```

## Як застосувати/переглядати/видаляти обʼєкти використовуючи Kustomize {#how-to-apply-view-delete-objects-using-kustomize}

Використовуйте `--kustomize` або `-k` у командах `kubectl`, щоб визначити Ресурси, які керуються `kustomization.yaml`. Зверніть увагу, що `-k` повинен посилатися на теку з налаштуваннями kustomization, наприклад,

```shell
kubectl apply -k <тека kustomization>/
```

Враховуючи наступний `kustomization.yaml`,

```shell
# Створіть файл deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Створіть файл kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
labels:
  - pairs:
      app: my-nginx
    includeSelectors: true
resources:
- deployment.yaml
EOF
```

Виконайте наступну команду, щоб застосувати обʼєкт Deployment `dev-my-nginx`:

```shell
> kubectl apply -k ./
deployment.apps/dev-my-nginx створено
```

Виконайте одну з наступних команд, щоб переглянути обʼєкт Deployment `dev-my-nginx`:

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

Виконайте наступну команду, щоб порівняти обʼєкт Deployment `dev-my-nginx` зі станом, в якому буде кластер, якщо маніфест буде застосований:

```shell
kubectl diff -k ./
```

Виконайте наступну команду, щоб видалити обʼєкт Deployment `dev-my-nginx`:

```shell
> kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```

## Перелік елементів Kustomize {#kustomize-feature-list}

| Поле | Тип | Пояснення |
|------|-----|-----------|
| bases | []string | Кожен запис у цьому списку має вказувати на теку, що містить файл kustomization.yaml |
| commonAnnotations | map[string]string | анотації, які додаються до всіх ресурсів |
| commonLabels | map[string]string | мітки, які додаються до всіх ресурсів та селекторів |
| configMapGenerator | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7) | Кожен запис у цьому списку генерує ConfigMap |
| configurations | []string | Кожен запис у цьому списку має вказувати на файл, що містить [конфігурації трансформаторів Kustomize](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds | []string | Кожен запис у цьому списку має вказувати на файл визначення OpenAPI для типів Kubernetes |
| generatorOptions | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | Змінює поведінку всіх генераторів ConfigMap та Secret |
| images | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8) | Кожен запис змінює імʼя, теґи та/або дайджест для одного образу без створення патчів |
| labels | map[string]string | Додає мітки без автоматичної інʼєкції відповідних селекторів |
| namePrefix | string | значення цього поля додається на початок імен всіх ресурсів |
| nameSuffix | string | значення цього поля додається в кінець імен всіх ресурсів | |
| patchesJson6902 | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10) | Кожен запис у цьому списку має вказувати на обʼєкт Kubernetes та Json Patch | |
| patchesStrategicMerge | []string | Кожен запис у цьому списку має вказувати на стратегічний патч злиття обʼєкта Kubernetes |
| replacements | [][Replacements](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/replacement.go#L15) | копіює значення з поля ресурсу в будь-яку кількість зазначених цілей |
| resources | []string | Кожен запис у цьому списку має вказувати на наявний файл конфігурації ресурсу |
| secretGenerator | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7) | Кожен запис у цьому списку генерує Secret |
| vars | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19) | Кожен запис призначений для захоплення тексту з поля одного ресурсу

## {{% heading "whatsnext" %}}

* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Книга Kubectl](https://kubectl.docs.kubernetes.io)
* [Довідник команд Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
