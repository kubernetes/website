---
title: Керування робочими навантаженнями
content_type: concept
weight: 40
---

<!-- overview -->

Ви розгорнули ваш застосунок та відкрили до нього доступ через Service. Що далі? Kubernetes надає низку інструментів, які допомагають керувати розгортанням вашого застосунку, зокрема масштабуванням та оновленням.

<!-- body -->

## Організація конфігурацій ресурсів {#organizing-resource-configurations}

Багато застосунків потребують створення кількох ресурсів, таких як Deployment разом із Service. Керування кількома ресурсами можна спростити, обʼєднавши їх в одному файлі (розділивши їх `---` у YAML). Наприклад:

{{% code_sample file="application/nginx-app.yaml" %}}

Кілька ресурсів можна створити так само, як і один ресурс:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

Ресурси будуть створені в порядку, в якому вони зʼявляються в маніфесті. Тому краще спочатку вказати Service, оскільки це забезпечить, що планувальник зможе розподілити повʼязані з Service Podʼи в процесі їх створення контролером(ами), такими як Deployment.

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

У цьому розділі перераховані лише найпоширеніші інструменти, які використовуються для керування робочими навантаженнями в Kubernetes. Щоб переглянути більше інструментів, подивіться [Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build) в {{< glossary_tooltip text="CNCF" term_id="cncf" >}} Landscape.

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) — це інструмент для керування пакетами попередньо налаштованих ресурсів Kubernetes. Ці пакети відомі як _Helm-чарти_.

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/) проходить по маніфестах Kubernetes, щоб додати, видалити або оновити конфігураційні опції. Він доступний як окремий бінарний файл і як [вбудована можливість](/docs/tasks/manage-kubernetes-objects/kustomization/) kubectl.

## Пакетні операції в kubectl {#bulk-operations-in-kubectl}

Створення ресурсів — не єдина операція, яку `kubectl` може виконувати в пакетному режимі. Він також може витягувати назви ресурсів з конфігураційних файлів для виконання інших операцій, зокрема для видалення тих же ресурсів, які ви створили:

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

Для більшої кількості ресурсів буде зручніше вказати селектор (запит за мітками), використовуючи `-l` або `--selector`, щоб відфільтрувати ресурси за їхніми мітками:

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

### Ланцюжки та фільтрація {#chaining-and-filtering}

Оскільки `kubectl` виводить назви ресурсів у тому ж синтаксисі, який він приймає, ви можете обʼєднувати операції в ланцюжки, використовуючи `$()` або `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

Вивід може бути подібний до:

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

За допомогою наведених вище команд ви спочатку створюєте ресурси в `docs/concepts/cluster-administration/nginx/` і виводите створені ресурси у форматі виводу `-o name` (виводите кожен ресурс як resource/name). Потім за допомогою `grep` ви вибираєте лише Service, а потім виводите його за допомогою [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/).

### Рекурсивні операції з локальними файлами {#recursive-operations-on-local-files}

Якщо ви організували ваші ресурси в кількох підтеках всередині певної теки, ви можете рекурсивно виконувати операції і з підтеками, вказавши `--recursive` або `-R` разом з аргументом `--filename`/`-f`.

Наприклад, припустимо, є тека `project/k8s/development`, яка містить усі {{< glossary_tooltip text="маніфести" term_id="manifest" >}}, необхідні для середовища розробки, організовані за типом ресурсу:

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

Стандартно виконання пакетної операції для `project/k8s/development` зупиниться на першому рівні теки, не обробляючи жодних вкладених тек. Якщо ви спробували б створити ресурси з цієї теки, використовуючи наступну команду, ви б отримали помилку:

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Натомість вкажіть аргумент командного рядка `--recursive` або `-R` разом з аргументом `--filename`/`-f`:

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Аргумент `--recursive` працює з будь-якою операцією, яка приймає аргумент `--filename`/`-f`, такою як: `kubectl create`, `kubectl get`, `kubectl delete`, `kubectl describe` або навіть `kubectl rollout`.

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

Якщо ви хочете дізнатися більше про `kubectl`, ознайомтеся зі статтею [Інструмент командного рядка (kubectl)](/docs/reference/kubectl/).

## Оновлення застосунку без перебоїв у роботі {#updating-your-application-without-an-outage}

В якийсь момент вам, ймовірно, доведеться оновити ваш розгорнутий застосунок, зазвичай шляхом зазначення нового образу чи теґу образу. `kubectl` підтримує кілька операцій оновлення, кожна з яких застосовується до різних сценаріїв.

Ви можете запускати кілька копій вашого застосунку і використовувати _розгортання_ (rollout) для поступового перенаправлення трафіку до нових справних Podʼів. З часом всі запущені Podʼи отримають нове програмне забезпечення.

У цьому розділі сторінки показано, як створювати та оновлювати застосунки за допомогою Deployments.

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

і дозвольте Kubernetes додавати більше тимчасових реплік під час розгортання, встановивши _максимальне перевищення_ (surge maximum) на 100%:

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

Щоб оновитись до версії 1.16.1, змініть `.spec.template.spec.containers[0].image` з `nginx:1.14.2` на `nginx:1.16.1`, використовуючи `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
# Змініть маніфест, щоб використовувати новіший образ контейнера, потім збережіть зміни
```

Ось і все! Deployment декларативно й поступово оновить розгорнутий застосунок nginx у фоновому режимі. Він забезпечує, що лише певна кількість старих реплік може бути недоступною під час оновлення, і лише певна кількість нових реплік може бути створена понад бажану кількість Podʼів. Щоб дізнатися більше про те, як це відбувається, перегляньте сторінку [Deployment](/docs/concepts/workloads/controllers/deployment/).

Ви можете використовувати розгортання з DaemonSets, Deployments або StatefulSets.

### Керування розгортаннями {#managing-rollouts}

Ви можете використовувати [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) для керування поступовим оновленням наявного застосунку.

Наприклад:

```shell
kubectl apply -f my-deployment.yaml

# дочекайтеся завершення розгортання
kubectl rollout status deployment/my-deployment --timeout 10m # тайм-аут 10 хвилин
```

або

```shell
kubectl apply -f backing-stateful-component.yaml

# не чекайте завершення розгортання, просто перевірте статус
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

Ви також можете призупиняти, відновлювати або скасовувати розгортання. Перегляньте [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) для отримання додаткової інформації.

## Канаркові розгортання {#canary-deployments}

Ще один сценарій, коли потрібні кілька міток, — розрізнення розгортань різних версій або конфігурацій одного й того ж компонента. Поширеною практикою є *канаркове* розгортання нової версії застосунку (зазначеної через теґ образу в шаблоні Podʼа) поруч з попередньою версією, щоб нова версія могла отримати реальний промисловий трафік перед повним розгортанням.

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

А потім ви можете створити нову версію фронтенду для guestbook, яка має мітку `track` з іншим значенням (тобто `canary`), так що два набори Podʼів не перетинатимуться:

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

Service фронтенду охоплюватиме обидва набори реплік, вибираючи спільну підмножину їх міток (тобто пропускаючи мітку `track`), так що трафік буде перенаправлено на обидва застосунки:

```yaml
selector:
   app: guestbook
   tier: frontend
```

Ви можете налаштувати кількість реплік стабільної та канаркової версій, щоб визначити частку реального промислового трафіку, яку отримає кожна з них (у цьому випадку 3:1). Коли ви будете впевнені в новій версії, ви можете оновити стабільний канал випуску до нової версії застосунку і видалити канаркову.

Щоб дізнатися, що це передбачає, пройдіть навчальний матеріал [Розгортання релізу за допомогою канаркового розгортання](/docs/tutorials/stateless-application/canary-deployment/).

## Оновлення анотацій {#updating-annotations}

Іноді ви захочете додати анотації до ресурсів. Анотації — це довільні неідентифікувальні метадані, які можуть отримувати API-клієнти, такі як інструменти або бібліотеки. Це можна зробити за допомогою `kubectl annotate`. Наприклад:

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

Тепер у вас буде тільки один Pod, яким керує Deployment.

```shell
kubectl get pods -l app=my-nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Щоб система автоматично вибирала кількість реплік nginx в межах від 1 до 3, виконайте:

```shell
# Для цього потрібне наявне джерело метрик контейнерів і Podʼів
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Тепер ваші репліки nginx будуть масштабуватися вгору і вниз за потреби автоматично.

Для отримання додаткової інформації перегляньте [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/), [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) і [горизонтальне автомасштабування Podʼів](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Оновлення ресурсів на місці {#in-place-updates-of-resources}

Іноді потрібно вносити до створених вами ресурсів вузькі оновлення, що не переривають роботу.

### kubectl apply {#kubectl-apply}

Рекомендується підтримувати набір конфігураційних файлів у системі контролю версій (див. [конфігурація як код](https://martinfowler.com/bliki/InfrastructureAsCode.html)), щоб їх можна було підтримувати та версіонувати разом з кодом для ресурсів, які вони конфігурують. Тоді ви можете використовувати [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/) для того, щоб надіслати зміни конфігурації в кластер.

Ця команда порівнює версію конфігурації, яку ви надсилаєте, з попередньою версією та застосовує внесені вами зміни, не перезаписуючи автоматичні зміни властивостей, які ви не вказали.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

Щоб дізнатися більше про механізм, що лежить в основі, прочитайте [server-side apply](/docs/reference/using-api/server-side-apply/).

### kubectl edit {#kubectl-edit}

Також ви можете оновлювати ресурси за допомогою [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/):

```shell
kubectl edit deployment/my-nginx
```

Це еквівалентно тому, щоб спочатку виконати `get` для ресурсу, відредагувати його в текстовому редакторі, а потім виконати `apply` для ресурсу з оновленою версією:

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

Ви можете використовувати [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) для оновлення обʼєктів API на місці. Ця підкоманда підтримує JSON patch, JSON merge patch і strategic merge patch.

Дивіться [Оновлення обʼєктів API на місці за допомогою kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) для отримання додаткових деталей.

## Оновлення з перериванням роботи {#disruptive-updates}

В деяких випадках може знадобитися оновити поля ресурсу, які не можна оновити після його ініціалізації, або може знадобитися зробити рекурсивну зміну негайно, наприклад, щоб виправити несправні Podʼи, створені Deployment. Для зміни таких полів використовуйте `replace --force`, що видаляє і повторно створює ресурс. У цьому випадку ви можете змінити ваш оригінальний конфігураційний файл:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся, [як використовувати `kubectl` для інспекції застосунків та налагодження](/docs/tasks/debug/debug-application/debug-running-pod/).
