---
title: Управління робочими навантаженнями
content_type: concept
weight: 40
---

<!-- overview -->

Ви розгорнули ваш застосунок та експонували його через Service. Що далі? Kubernetes надає ряд інструментів для допомоги в управлінні розгортанням вашого застосунку, включаючи масштабування та оновлення.

<!-- body -->

## Організація конфігурацій ресурсів {#organizing-resource-configurations}

Багато застосунків потребують створення кількох ресурсів, таких як Deployment разом із Service. Управління кількома ресурсами можна спростити, обʼєднавши їх в одному файлі (розділеному `---` у YAML). Наприклад:

{{% code_sample file="application/nginx-app.yaml" %}}

Кілька ресурсів можна створити так само як і один ресурс:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

Ресурси будуть створені в порядку, в якому вони зʼявляються в маніфесті. Тому краще спочатку вказати Service, оскільки це забезпечить, що планувальник зможе розподілити повʼязані з Service podʼи в процесі їх створення контролером(ами), таким як Deployment.

`kubectl apply` також приймає кілька аргументів `-f`:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

Рекомендовано розміщувати ресурси, повʼязані з одним мікросервісом або рівнем застосунку, в одному файлі та групувати всі файли, повʼязані з вашим застосунком, в одній теці. Якщо рівні вашого застосунку звʼязуються один з одним за допомогою DNS, ви можете розгорнути всі компоненти вашого стека разом.

Також можна вказати URL як джерело конфігурації, що зручно для розгортання безпосередньо з маніфестів у вашій системі контролю версій:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

Якщо потрібно визначити більше маніфестів, наприклад, додати ConfigMap, це також можна зробити.

### Зовнішні інструменти {#external-tools}

У цьому розділі перераховані лише найпоширеніші інструменти, які використовуються для керування навантаженнями в Kubernetes. Щоб переглянути більше інструментів, подивіться [Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build) в {{< glossary_tooltip text="CNCF" term_id="cncf" >}} Landscape.

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) — це інструмент для управління пакетами попередньо налаштованих ресурсів Kubernetes. Ці пакети відомі як _Helm чарти_.

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/) проходить по маніфестах Kubernetes, щоб додати, видалити або оновити конфігураційні опції. Він доступний як окремий бінарний файл і як [вбудована функція](/docs/tasks/manage-kubernetes-objects/kustomization/) kubectl.

## Пакетні операції в kubectl {#bulk-operations-in-kubectl}

Створення ресурсів — не єдина операція, яку `kubectl` може виконувати в пакетному режимі. Він також може витягувати імена ресурсів з конфігураційних файлів для виконання інших операцій, зокрема для видалення тих же ресурсів, які ви створили:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

У випадку з двома ресурсами ви можете вказати обидва ресурси в командному рядку, використовуючи синтаксис resource/name:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

Для більшої кількості ресурсів буде зручніше вказати селектор (запит на мітку), використовуючи `-l` або `--selector`, щоб відфільтрувати ресурси за їхніми мітками:

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

### Ланцюги та фільтрація {#chaining-and-filtering}

Оскільки `kubectl` виводить імена ресурсів у тому ж синтаксисі, який він приймає, ви можете робити ланцюги операції, використовуючи `$()` або `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

Вивід може бути подібний до:

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

Використовуючи вище наведенні команди, спочатку ви створюєте ресурси в `docs/concepts/cluster-administration/nginx/` і виводите створені ресурси у форматі виводу `-o name` (виводите кожен ресурс як resource/name). Потім ви виконуєте `grep` для вибору Service, а потім виводите його за допомогою [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/).

### Рекурсивні операції з локальними файлами {#recursive-operations-on-local-files}

Якщо ви організували ваші ресурси в кількох підтеках всередині певної теки, ви можете рекурсивно виконувати операції з ними, вказавши `--recursive` або `-R` разом з аргументом `--filename`/`-f`.

Наприклад, припустимо, є тека `project/k8s/development`, яка містить усі {{< glossary_tooltip text="маніфести" term_id="manifest" >}} необхідні для середовища розробки, організовані за типом ресурсу:

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

Стандартно, виконання пакетної операції для `project/k8s/development` зупиниться на першому рівні теки, не обробляючи жодних вкладених тек. Якщо ви спробували б створити ресурси з цієї теки, використовуючи наступну команду, ви б отримали помилку:

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Замість цього, вкажіть аргумент командного рядка `--recursive` або `-R` разом з аргументом `--filename`/`-f`:

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Аргумент `--recursive` працює з будь-якою операцією, яка приймає аргумент `--filename`/`-f`, такою як: `kubectl create`, `kubectl get`, `kubectl delete`, `kubectl describe`, або навіть `kubectl rollout`.

Аргумент `--recursive` також працює, коли вказані кілька аргументів `-f`:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Якщо ви хочете дізнатися більше про `kubectl`, ознайомтеся зі статею [Інструмент командного рядка (kubectl)](/docs/reference/kubectl/).

## Оновлення застосунку без перебоїв у роботі {#updating-your-application-without-an-outage}

В якийсь момент вам, ймовірно, доведеться оновити ваш розгорнутий застосунок, зазвичай шляхом зазначення нового образу чи теґу образу. `kubectl` підтримує кілька операцій оновлення, кожна з яких застосовується до різних сценаріїв.

Ви можете запускати кілька копій вашого застосунку і використовувати _rollout_ для поступового перенаправлення трафіку до нових справних Podʼів. З часом всі запущені Podʼи отримають нове програмне забезпечення.

Цей розділ сторінки проводить вас через процес створення та оновлення застосунків за допомогою Deployments.

Припустимо, ви запускали версію 1.14.2 nginx:

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

Переконайтеся, що є 1 репліка:

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

і дозвольте Kubernetes додавати більше тимчасових реплік під час розгортання, встановивши _максимум сплеску_ на 100%::

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

Щоб оновитись до версії 1.16.1, змініть `.spec.template.spec.containers[0].image` з `nginx:1.14.2` на `nginx:1.16.1`, використовуючи `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
# Змініть маніфест на використання новішого образу контейнера, потім збережіть зміни
```

Ось і все! Deployment оновить розгорнутий застосунок з nginx прогресивно за лаштунками. Він забезпечує, що лише певна кількість старих реплік може бути недоступною під час оновлення, і лише певна кількість нових реплік може бути створена понад бажану кількість podʼів. Щоб дізнатися більше деталей про те, як це відбувається, відвідайте [Deployment](/docs/concepts/workloads/controllers/deployment/).

Ви можете використовувати rollouts з DaemonSets, Deployments або StatefulSets.

### Управління Rollouts {#managing-rollouts}

Ви можете використовувати [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) для управління прогресивним оновленням поточного застосунку.

Наприклад:

```shell
kubectl apply -f my-deployment.yaml

# дочекайтеся завершення rollout
kubectl rollout status deployment/my-deployment --timeout 10m # тайм-аут 10 хвилин
```

або

```shell
kubectl apply -f backing-stateful-component.yaml

# не чекайте завершення rollout, просто перевірте статус
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

Ви також можете призупиняти, відновлювати або скасовувати rollout. Відвідайте [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) для отримання додаткової інформації.

## Canary Deployment {#canary-deployments}

Ще один сценарій, коли потрібні кілька міток, це відрізнення розгортання різних версій або конфігурацій одного й того ж компонента. Загальною практикою є розгортання *canary* нової версії застосунку (зазначеної через теґ образу в шаблоні podʼа) поруч з попередньою версією, щоб нова версія могла отримати реальний трафік перед повним розгортанням.

Наприклад, можна використовувати мітку `track` для розрізнення різних версій.

Основна, стабільна версія буде мати мітку `track` зі значенням `stable`:

```none
name: frontend
replicas: 3
...
labels:
   app: guestbook
   tier: frontend
   track: stable
...
image: gb-frontend:v3
```

А потім ви можете створити нову версію фронтенду для guestbook, яка має мітку `track` з іншим значенням (тобто `canary`), так що два набори podʼів не перетинатимуться:

```none
name: frontend-canary
replicas: 1
...
labels:
   app: guestbook
   tier: frontend
   track: canary
...
image: gb-frontend:v4
```

Сервіс фронтенду охоплюватиме обидва набори реплік, вибираючи загальну підмножину їх міток (тобто пропускаючи мітку `track`), так що трафік буде перенаправлено на обидва застосунки:

```yaml
selector:
   app: guestbook
   tier: frontend
```

Ви можете налаштувати кількість реплік стабільних і canary версій, щоб визначити відношення кожного розгортання, яке отримає реальний трафік (в цьому випадку, 3:1). Коли ви будете впевнені, що нова версія стабільна, ви можете оновити стабільний трек до нової версії застосунку і видалити canary версію.

## Оновлення анотацій {#updating-annotations}

Іноді ви захочете додати анотації до ресурсів. Анотації є довільними метаданими, що не є ідентифікаційними, для отримання API клієнтами, такими як інструменти або бібліотеки. Це можна зробити за допомогою `kubectl annotate`. Наприклад:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```none
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

Для отримання додаткової інформації дивіться [анотації](/docs/concepts/overview/working-with-objects/annotations/) та [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/).

## Масштабування вашого застосунку {#scaling-your-application}

Коли навантаження на ваш застосунок зростає або зменшується, використовуйте `kubectl`, щоб масштабувати ваш застосунок. Наприклад, щоб зменшити кількість реплік nginx з 3 до 1, виконайте:

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

Тепер у вас буде тільки один pod, яким управляє deployment.

```shell
kubectl get pods -l app=my-nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Щоб система автоматично вибирала кількість реплік nginx в межах від 1 до 3, виконайте:

```shell
# Це вимагає існуючого джерела метрик контейнера і Pod
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Тепер ваші репліки nginx будуть масштабуватися вгору і вниз за потреби автоматично.

Для отримання додаткової інформації перегляньте [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/), [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) і [horizontal pod autoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Оновлення ресурсів на місці {#in-place-updates-of-resources}

Іноді необхідно вносити вузькі оновлення до ресурсів які ви створили, не порушуючи роботи.

### kubectl apply {#kubectl-apply}

Рекомендується підтримувати набір конфігураційних файлів у системі контролю версій (див. [конфігурація як код](https://martinfowler.com/bliki/InfrastructureAsCode.html)), щоб їх можна було підтримувати та версіонувати разом з кодом для ресурсів, які вони конфігурують. Тоді ви можете використовувати [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/) для того, щоб надіслати зміни конфігурації в кластер.

Ця команда порівнює версію конфігурації, яку ви надсилаєте, з попередньою версією та застосовує внесені вами зміни, не перезаписуючи зміни властивостей, що відбулись автоматичні, які ви не вказали.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

Щоб дізнатися більше про механізм, що лежить в основі, прочитайте [server-side apply](/docs/reference/using-api/server-side-apply/).

### kubectl edit {#kubectl-edit}

Альтернативно, ви також можете оновлювати ресурси за допомогою [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/):

```shell
kubectl edit deployment/my-nginx
```

Це еквівалентно спочатку отриманню `get` ресурсу, редагуванню його в текстовому редакторі, а потім `apply` ресурсу з оновленою версією:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# зробіть деякі редагування, а потім збережіть файл

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

Це дозволяє легше вносити більш значні зміни. Зверніть увагу, що ви можете вказати редактор за допомогою змінних середовища `EDITOR` або `KUBE_EDITOR`.

Для отримання додаткової інформації дивіться [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/).

### kubectl patch {#kubectl-patch}

Ви можете використовувати [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) для оновлення API обʼєктів на місці. Ця підкоманда підтримує JSON patch, JSON merge patch і стратегічний merge patch.

Дивіться [Оновлення API обʼєктів на місці за допомогою kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) для отримання додаткових деталей.

## Оновлення, що порушують стабільність {#disruptive-updates}

В деяких випадках може знадобитися оновити поля ресурсу, які не можна оновити після його ініціалізації, або може знадобитися зробити рекурсивну зміну негайно, наприклад, щоб виправити пошкоджені podʼи, створені Deployment. Для зміни таких полів використовуйте `replace --force`, що видаляє і перезапускає ресурс. У цьому випадку ви можете змінити ваш оригінальний конфігураційний файл:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## {{% heading "whatsnext" %}}

- Дізнайтеся, [як використовувати `kubectl` для інспекції застосунків та налагодження](/docs/tasks/debug/debug-application/debug-running-pod/).
