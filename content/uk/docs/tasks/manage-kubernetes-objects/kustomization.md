---
title: Декларативне керування обʼєктами Kubernetes за допомогою Kustomize
content_type: task
weight: 20
---

<!-- overview -->

[Kustomize](https://github.com/kubernetes-sigs/kustomize) — це окремий інструмент для налаштування обʼєктів Kubernetes за допомогою [файлу kustomization](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization).

Починаючи з версії 1.14, kubectl також підтримує керування обʼєктами Kubernetes за допомогою файлу kustomization. Щоб переглянути ресурси, знайдені в теці з файлом kustomization, виконайте таку команду:

```shell
kubectl kustomize <kustomization_directory>
```

Щоб застосувати ці ресурси, виконайте `kubectl apply` із прапорцем `--kustomize` або `-k`:

```shell
kubectl apply -k <kustomization_directory>
```

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Огляд Kustomize {#overview-of-kustomize}

Kustomize — це інструмент для налаштування конфігурацій Kubernetes. Він має такі можливості для керування файлами конфігурації застосунків:

* генерування ресурсів з інших джерел
* встановлення наскрізних полів для ресурсів
* компонування та налаштування колекцій ресурсів

### Генерування ресурсів {#generating-resources}

ConfigMaps і Secrets зберігають конфігураційні або конфіденційні дані, які використовуються іншими обʼєктами Kubernetes, наприклад Podʼами. Джерело істини для ConfigMaps або Secrets зазвичай розташоване поза кластером, наприклад це файл `.properties` або файл ключа SSH. Kustomize має `secretGenerator` і `configMapGenerator`, які генерують Secret і ConfigMap із файлів або літералів.

#### configMapGenerator

Щоб згенерувати ConfigMap з файлу, додайте запис до списку `files` у `configMapGenerator`. Ось приклад генерування ConfigMap з елементом даних із файлу `.properties`:

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

Згенерований ConfigMap можна переглянути за допомогою такої команди:

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

Щоб згенерувати ConfigMap з файлу env, додайте запис до списку `envs` у `configMapGenerator`. Ось приклад генерування ConfigMap з елементом даних із файлу `.env`:

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

Згенерований ConfigMap можна переглянути за допомогою такої команди:

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
Кожна змінна у файлі `.env` стає окремим ключем у згенерованому ConfigMap. Це відрізняється від попереднього прикладу, де файл з назвою `application.properties` (з усіма його записами) вбудовується як значення одного ключа.
{{< /note >}}

ConfigMaps також можна генерувати з літеральних пар ключ-значення. Щоб згенерувати ConfigMap з літеральної пари ключ-значення, додайте запис до списку `literals` у configMapGenerator. Ось приклад генерування ConfigMap з елементом даних із пари ключ-значення:

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

Згенерований ConfigMap можна перевірити за допомогою такої команди:

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

Щоб використати згенерований ConfigMap у Deployment, посилайтеся на нього за назвою configMapGenerator. Kustomize автоматично замінить цю назву згенерованою.

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

Згенерований Deployment посилатиметься на згенерований ConfigMap за назвою:

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

Ви можете генерувати Secrets із файлів або літеральних пар ключ-значення. Щоб згенерувати Secret з файлу, додайте запис до списку `files` у `secretGenerator`. Ось приклад генерування Secret з елементом даних із файлу:

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

Згенерований Secret має такий вигляд:

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

Щоб згенерувати Secret з літеральної пари ключ-значення, додайте запис до списку `literals` у `secretGenerator`. Ось приклад генерування Secret з елементом даних із пари ключ-значення:

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

Згенерований Secret має такий вигляд:

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

Подібно до ConfigMaps, згенеровані Secrets можна використовувати в Deployments, посилаючись на назву secretGenerator:

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

До згенерованих ConfigMaps і Secrets додається суфікс із хешем вмісту. Це гарантує, що під час зміни вмісту генерується новий ConfigMap або Secret. Щоб вимкнути додавання суфікса, можна використати `generatorOptions`. Крім того, можна вказати наскрізні параметри для згенерованих ConfigMaps і Secrets.

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

### Встановлення наскрізних полів {#setting-cross-cutting-fields}

Досить поширена практика — встановлювати наскрізні поля для всіх ресурсів Kubernetes у проєкті. Деякі випадки використання наскрізних полів:

* встановлення того самого простору імен для всіх ресурсів
* додавання того самого префікса або суфікса назви
* додавання того самого набору міток
* додавання того самого набору анотацій

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

Виконайте `kubectl kustomize ./`, щоб побачити, що всі ці поля встановлено в ресурсі Deployment:

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

### Компонування та налаштування ресурсів {#composing-and-customizing-resources}

Часто в проєкті компонують набір ресурсів і керують ними в одному файлі чи теці. Kustomize дає змогу компонувати ресурси з різних файлів і застосовувати до них патчі або інші налаштування.

#### Компонування {#composing}

Kustomize підтримує компонування різних ресурсів. Поле `resources` у файлі `kustomization.yaml` визначає список ресурсів, які слід включити в конфігурацію. Вкажіть шлях до файлу конфігурації ресурсу у списку `resources`. Ось приклад застосунку NGINX, що складається з Deployment і Service:

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

Ресурси з `kubectl kustomize ./` містять обидва обʼєкти: Deployment і Service.

#### Налаштування {#customizing}

Патчі можна використовувати для застосування різних налаштувань до ресурсів. Kustomize підтримує різні механізми патчів через `StrategicMerge` і `Json6902` за допомогою поля `patches`. `patches` може бути файлом або вбудованим рядком, спрямованим на один або кілька ресурсів.

Поле `patches` містить список патчів, які застосовуються в порядку їх зазначення. Ціль патча вибирає ресурси за `group`, `version`, `kind`, `name`, `namespace`, `labelSelector` і `annotationSelector`.

Рекомендовано створювати невеликі патчі, які роблять щось одне. Наприклад, створіть один патч для збільшення кількості реплік Deployment, а інший — для встановлення обмеження памʼяті. Цільовий ресурс визначається за полями `group`, `version`, `kind` і `name` з файлу патча.

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

Не всі ресурси чи поля підтримують патчі `strategicMerge`. Для зміни довільних полів у довільних ресурсах Kustomize пропонує застосування [JSON patch](https://tools.ietf.org/html/rfc6902) через `Json6902`. Щоб знайти правильний ресурс для патча `Json6902`, обовʼязково потрібно вказати поле `target` у файлі `kustomization.yaml`.

Наприклад, збільшити кількість реплік обʼєкта Deployment можна також за допомогою патча `Json6902`. Цільовий ресурс визначається за `group`, `version`, `kind` і `name` з поля `target`.

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

Виконайте `kubectl kustomize ./`, щоб побачити, що поле `replicas` оновлено:

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

Крім патчів, Kustomize також дає змогу налаштовувати образи контейнерів або вставляти значення полів з інших обʼєктів у контейнери без створення патчів. Наприклад, можна змінити образ, що використовується в контейнерах, вказавши новий образ у полі `images` у `kustomization.yaml`.

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

Виконайте `kubectl kustomize ./`, щоб побачити, що використовуваний образ оновлено:

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

Іноді застосунку, що працює в Podʼі, потрібні значення конфігурації з інших обʼєктів. Наприклад, Pod з обʼєкта Deployment має прочитати відповідну назву Service зі змінної середовища або з аргументу команди. Оскільки назва Service може змінюватися, коли у файлі `kustomization.yaml` додається `namePrefix` або `nameSuffix`, не рекомендовано жорстко задавати назву Service в аргументі команди. Для цього Kustomize може вставити назву Service у контейнери через `replacements`.

```shell
# Створіть файл deployment.yaml (взявши в лапки роздільник here doc)
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

Виконайте `kubectl kustomize ./`, щоб побачити, що назва Service, вставлена в контейнери, — це `dev-my-nginx-001`:

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

У Kustomize є поняття **base** і **overlay**. **Base** — це тека з файлом `kustomization.yaml`, яка містить набір ресурсів і повʼязані налаштування. Base може бути локальною текою або текою з віддаленого репозиторію, якщо всередині є файл `kustomization.yaml`. **Overlay** — це тека з файлом `kustomization.yaml`, яка посилається на інші теки kustomization як на свої `bases`. **Base** нічого не знає про overlay і може використовуватися в кількох overlay.

Файл `kustomization.yaml` у теці **overlay** може посилатися на кілька `bases`, обʼєднуючи всі ресурси, визначені в цих base, в єдину конфігурацію. Крім того, він може застосовувати налаштування поверх цих ресурсів для задоволення певних вимог.

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

Цей base можна використовувати в кількох overlay. Ви можете додавати різні `namePrefix` або інші наскрізні поля в різних overlay. Ось два overlay, які використовують той самий base.

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

## Як застосовувати, переглядати й видаляти обʼєкти за допомогою Kustomize {#how-to-apply-view-delete-objects-using-kustomize}

Використовуйте `--kustomize` або `-k` у командах `kubectl`, щоб розпізнавати ресурси, якими керує `kustomization.yaml`. Зверніть увагу, що `-k` має вказувати на теку kustomization, наприклад,

```shell
kubectl apply -k <kustomization directory>/
```

Для такого `kustomization.yaml`,

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

Виконайте таку команду, щоб застосувати обʼєкт Deployment `dev-my-nginx`:

```shell
> kubectl apply -k ./
deployment.apps/dev-my-nginx created
```

Виконайте одну з наведених нижче команд, щоб переглянути обʼєкт Deployment `dev-my-nginx`:

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

Виконайте таку команду, щоб порівняти обʼєкт Deployment `dev-my-nginx` зі станом, у якому був би кластер, якби маніфест було застосовано:

```shell
kubectl diff -k ./
```

Виконайте таку команду, щоб видалити обʼєкт Deployment `dev-my-nginx`:

```shell
> kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```

## Перелік можливостей Kustomize {#kustomize-feature-list}

| Поле | Тип | Пояснення |
|------|-----|-----------|
| bases | []string | Кожен запис у цьому списку має вказувати на теку, що містить файл kustomization.yaml |
| commonAnnotations | map[string]string | анотації, які додаються до всіх ресурсів |
| commonLabels | map[string]string | мітки, які додаються до всіх ресурсів та селекторів |
| configMapGenerator | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7) | Кожен запис у цьому списку генерує ConfigMap |
| configurations | []string | Кожен запис у цьому списку має вказувати на файл, що містить [конфігурації трансформаторів Kustomize](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds | []string | Кожен запис у цьому списку має вказувати на файл визначення OpenAPI для типів Kubernetes |
| generatorOptions | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | Змінює поведінку всіх генераторів ConfigMap та Secret |
| images | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8) | Кожен запис змінює назву, теґи та/або дайджест для одного образу без створення патчів |
| labels | map[string]string | Додає мітки без автоматичного додавання відповідних селекторів |
| namePrefix | string | значення цього поля додається на початок назв усіх ресурсів |
| nameSuffix | string | значення цього поля додається в кінець назв усіх ресурсів |
| patchesJson6902 | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10) | Кожен запис у цьому списку має вказувати на обʼєкт Kubernetes та Json Patch |
| patchesStrategicMerge | []string | Кожен запис у цьому списку має вказувати на strategic merge patch обʼєкта Kubernetes |
| replacements | [][Replacements](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/replacement.go#L15) | копіює значення з поля ресурсу в будь-яку кількість зазначених цілей |
| resources | []string | Кожен запис у цьому списку має вказувати на наявний файл конфігурації ресурсу |
| secretGenerator | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7) | Кожен запис у цьому списку генерує Secret |
| vars | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19) | Кожен запис призначений для захоплення тексту з поля одного ресурсу |

## {{% heading "whatsnext" %}} {#what-s-next}

* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Довідник команд kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
