---
title: Швидкий довідник kubectl
content_type: concept
weight: 10 # highlight it
card:
  name: tasks
  weight: 10
---

<!-- overview -->

Ця сторінка містить перелік загальновживаних команд та прапорців `kubectl`.

{{< note >}}
Ці інструкції призначені для Kubernetes v{{< skew currentVersion >}}. Для перевірки версії скористайтесь командою `kubectl version`.
{{< /note >}}

<!-- body -->

## Автозавершення команд kubeclt {#kubectl-autocomplete}

### BASH

```bash
source <(kubectl completion bash) # встановлення автозавершення для bash в поточному терміналі, пакунок bash-completion повинен бути встановлений.
echo "source <(kubectl completion bash)" >> ~/.bashrc # додавання автозавершення для bash в профіль bash для постіного використання
```

Ви також можете використовувати зручне скорочення для `kubectl`, яке також працює з автозавершенням:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```zsh
source <(kubectl completion zsh)  # встановлення автозавершення для zsh в поточному терміналі
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # додавання автозавершення для zsh в профіль zsh для постіного використання
```

### FISH

{{< note >}}
Вимагається версія kubectl 1.23 або вище.
{{< /note >}}

```fish
echo 'kubectl completion fish | source' > ~/.config/fish/completions/kubectl.fish && source ~/.config/fish/completions/kubectl.fish
```

### `-A` замість `--all-namespaces` {#A-note-on-all-namespaces}

Додавання `--all-namespaces` трапляється досить часто, тому вам слід знати скорочення для `--all-namespaces`:

```kubectl -A```

### Контекст та конфігурація kubectl {#kubectl-context-and-configuration}

Встановіть, з яким кластером Kubernetes `kubectl` спілкується та змінює інформацію про конфігурацію. Див. документацію [Автентифікація між кластерами за допомогою kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) для детальної інформації про конфігураційний файл.

```bash
kubectl config view # Показати обʼєднані налаштування kubeconfig.

# використовувати декілька файлів kubeconfig одночасно та переглядати обʼєднані конфігурації
KUBECONFIG=~/.kube/config:~/.kube/config2

kubectl config view

# показати обʼєднані налаштування kubeconfig, необроблені дані сертифікатів та експоновані секрети
kubectl config view --raw

# отримання пароля для користувача e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

# отримання сертифіката для користувача e2e
kubectl config view --raw -o jsonpath='{.users[?(.name == "e2e")].user.client-certificate-data}' | base64 -d

kubectl config view -o jsonpath='{.users[].name}'    # показати першого користувача
kubectl config view -o jsonpath='{.users[*].name}'   # отримати список користувачів
kubectl config get-contexts                          # показати список контекстів
kubectl config get-contexts -o name                  # отримати всі імена контекстів
kubectl config current-context                       # показати поточний контекст
kubectl config use-context my-cluster-name           # встановити стандартний контекст у my-cluster-name

kubectl config set-cluster my-cluster-name           # встановити запис кластера у kubeconfig

# налаштувати URL проксі-сервера для запитів, зроблених цим клієнтом у kubeconfig
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# додати нового користувача до kubeconf з підтримкою базової автентифікації
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# постійно зберігати простір імен для всіх наступних команд kubectl у цьому контексті
kubectl config set-context --current --namespace=ggckad-s2

# встановити контекст, використовуючи конкретне імʼя користувача та простір імен
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # видалити користувача foo

# скорочення для налаштування/показу контексту/простору імен (працює тільки для bash та сумісних з bash оболонок, поточний контекст має бути встановлений перед використанням kn для налаштування простору імен)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## Kubectl apply {#kubectl-apply}

`apply` керує застосунками через файли, що визначають ресурси Kubernetes. Ця команда створює та оновлює ресурси в кластері, виконуючи команду `kubectl apply`. Це рекомендований спосіб керування застосунками Kubernetes в операційному середовищі. Дивіться [Kubectl Book](https://kubectl.docs.kubernetes.io).

## Створення обʼєктів {#creating-objects}

Маніфести Kubernetes можна визначати у форматах YAML або JSON. Можна використовувати розширення файлів `.yaml`, `.yml` та `.json`.

```bash
kubectl apply -f ./my-manifest.yaml                 # створити ресурс(и)
kubectl apply -f ./my1.yaml -f ./my2.yaml           # створити з декількох файлів
kubectl apply -f ./dir                              # створити ресурс(и) з усіх манифестів у теці
kubectl apply -f https://example.com/manifest.yaml  # створити ресурс(и) з URL (Примітка: це приклад домену і не містить дійсного манифесту)
kubectl create deployment nginx --image=nginx       # запустити один екземпляо nginx

# створити завдання, яке виводить "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# створити CronJob, який виводить "Hello World" кожну хвилину
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # отримати документацію для манифестів pod

# створити декілька YAML обʼєктів зі stdin {#creating-objects}
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# створити секрет з декількома ключами
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF
```

## Перегляд і пошук ресурсів {#viewing-and-finding-resources}

```bash
# Отримати команди з базовим виводом
kubectl get services                          # Вивід усіх сервісів у просторі імен
kubectl get pods --all-namespaces             # Вивід усіх Podʼів у всіх просторах імен
kubectl get pods -o wide                      # Вивід усіх Podʼів у поточному просторі імен, з детальною інформацією
kubectl get deployment my-dep                 # Вивід конкретного deployment
kubectl get pods                              # Вивід усіх Podʼів у просторі імен
kubectl get pod my-pod -o yaml                # Отримати Pod в фоматі YAML

# Опис команд з докладним виводом
kubectl describe nodes my-node
kubectl describe pods my-pod

# Вивід сервісів, відсортованих за назвою
kubectl get services --sort-by=.metadata.name

# Вивід Podʼів, відсортованих за кількістю перезапусків
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Вивід PersistentVolumes, відсортованих за ємністю
kubectl get pv --sort-by=.spec.capacity.storage

# Отримати мітки version усіх Podʼів з міткою app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Отримати значення ключа з крапками, напр. 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# Отримати значення, закодоване у base64, з дефісами замість підкреслень
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# Отримати всі робочі вузли (використовувати селектор для виключення результатів з міткою
# з назвою 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Отримати всі запущені Podʼи у просторі імен
kubectl get pods --field-selector=status.phase=Running

# Отримати ExternalIP усіх вузлів
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Вивід імен Podʼів, що належать певному RC
# Команда "jq" корисна для перетворень, які занадто складні для jsonpath, її можна знайти на https://jqlang.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Показати мітки для всіх Podʼів (або будь-якого іншого обʼєкта Kubernetes, що підтримує мітки)
kubectl get pods --show-labels

# Перевірити, які вузли готові
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Перевірити, які вузли готові з custom-columns
kubectl get node -o custom-columns='NODE_NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].status'

# Вивести розкодовані секрети без зовнішніх інструментів
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# Вивід усіх секретів, які зараз використовуються Podʼом
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Вивід всіх containerID initContainer усіх Podʼів
# Корисно при очищенні зупинених контейнерів, уникаючи видалення initContainer.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Вивід подій, відсортованих за часовою позначкою
kubectl get events --sort-by=.metadata.creationTimestamp

# Вивід всіх попереджувальних подій
kubectl events --types=Warning

# Порівняти поточний стан кластера зі станом, в якому б кластер знаходився, якби було застосовано маніфест.
kubectl diff -f ./my-manifest.yaml

# Створити дерево всіх ключів, розділених крапками, що повертаються для вузлів
# Корисно при пошуку ключа у складній вкладеній структурі JSON
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Створити всіх ключів, розділених крапками, що повертаються для Podʼів тощо
kubectl get pods -o json | jq -c 'paths|join(".")'

# Вивести ENV для всіх Podʼів, за умови, що у вас є типовий контейнер для Podʼів, типовий простір імен і підтримка команди `env`.
# Корисно при виконанні будь-якої підтримуваної команди для всіх Podʼів, не тільки `env`
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Отримати субресурс status для deployment
kubectl get deployment nginx-deployment --subresource=status
```

## Оновлення ресурсів {#updating-resources}

```bash
kubectl set image deployment/frontend www=image:v2               # Rolling update контейнерів "www" в deployment "frontend", оновлення образу
kubectl rollout history deployment/frontend                      # Перегляд історії deployment, включаючи ревізію
kubectl rollout undo deployment/frontend                         # Відкат до попереднього deployment
kubectl rollout undo deployment/frontend --to-revision=2         # Відкат до конкретної ревізії
kubectl rollout status -w deployment/frontend                    # Спостереження за статусом rolling update deployment "frontend" до завершення
kubectl rollout restart deployment/frontend                      # Rolling restart deployment "frontend"

cat pod.json | kubectl replace -f -                              # Заміна Pod на основі JSON, переданого через stdin

# Примусова заміна, видалення та повторне створення ресурсу. Це призведе до простою сервісу.
kubectl replace --force -f ./pod.json

# Створення сервісу для реплікованого nginx, який працює на порту 80 і підключається до контейнерів на порту 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Оновлення версії (теґа) образу одноконтейнерного Podʼа до v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Додавання мітки
kubectl label pods my-pod new-label-                             # Видалення мітки
kubectl label pods my-pod new-label=new-value --overwrite        # Перезапис поточного значення
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Додавання анотації
kubectl annotate pods my-pod icon-url-                           # Видалення анотації
kubectl autoscale deployment foo --min=2 --max=10                # Автомасштабування deployment "foo"
```

## Накладання патчів на ресурси {#patching-resources}

```bash
# Часткове оновлення вузла
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Оновлення образу контейнера; spec.containers[*].name обовʼязково, тому що це ключ для злиття
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Оновлення образу контейнера за допомогою json patch з позиційними масивами
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Вимкнення livenessProbe у deployment за допомогою json patch з позиційними масивами
kubectl patch deployment valid-deployment --type json -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Додавання нового елементу до позиційного масиву
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Оновлення кількості реплік deployment шляхом накладання патчу на його субресурс scale
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## Редагування ресурсів {#editing-resources}

Ви можете змінювати ресурси, використовуючи ваш улюблений редактор:

```bash
kubectl edit svc/docker-registry                      # Редагування service з назвою docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Використання альтернативного рекактора
```

## Масштабування ресурсів {#scaling-resources}

```bash
kubectl scale --replicas=3 rs/foo                                 # Масштабування replicaset з назвою 'foo' до 3
kubectl scale --replicas=3 -f foo.yaml                            # Масштабування ресурсу вказанеого у "foo.yaml" до 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Якщо deployment з назвою mysql має поточний розмір — 2, масштабувати mysql до 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Масштабувати кілька контролерів реплікації
```

## Видалення ресурсів {#deleting-resources}

```bash
kubectl delete -f ./pod.json                                      # Вилучити Pod використовуючи тип та назву, вказані в pod.json
kubectl delete pod unwanted --now                                 # Вилучити Pod негайно, без його належного завершення
kubectl delete pod,service baz foo                                # Вилучити Podʼи та сервіси з назвами "baz" та "foo"
kubectl delete pods,services -l name=myLabel                      # Вилучити Podʼи та сервіси з міткою name=myLabel
kubectl -n my-ns delete pod,svc --all                             # Вилучити всі Podʼи та сервіси в просторі імен my-ns,
# Вилучити всі Podʼи, що збігаються з шаблоном awk pattern1 або pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Взаємодія з працюючими Podʼами {#interacting-with-running-pods}

```bash
kubectl logs my-pod                                 # вивести логи Podʼа (stdout)
kubectl logs -l name=myLabel                        # вивести логи Podʼів з міткою name=myLabel (stdout)
kubectl logs my-pod --previous                      # вивести логи Podʼа (stdout) для попереднього варіанта контейнера
kubectl logs my-pod -c my-container                 # вивести логи контейнера в Podʼі (stdout, випадок з декількома контейнерами)
kubectl logs -l name=myLabel -c my-container        # вивести логи контейнера в Podʼі з міткою name=myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # вивести логи контейнера в Podʼі (stdout, випадок з декількома контейнерами) для попереднього варіанта контейнера
kubectl logs -f my-pod                              # транслювати логи Podʼа (stdout)
kubectl logs -f my-pod -c my-container              # транслювати логи контейнера в Podʼі (stdout, випадок з декількома контейнерами)
kubectl logs -f -l name=myLabel --all-containers    # транслювати всі логи Podʼів з міткою name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # Запустити Pod як інтерактивну оболонку
kubectl run nginx --image=nginx -n mynamespace      # Запустити один екземпляр Podʼа nginx в просторі імен mynamespace
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
                                                    # Згенерувати специфікацію для запуску Podʼа nginx і записати її у файл pod.yaml
kubectl attach my-pod -i                            # Підʼєднатися до працюючого контейнера
kubectl port-forward my-pod 5000:6000               # Слухати порт 5000 на локальній машині і пересилати на порт 6000 на Podʼі my-pod
kubectl exec my-pod -- ls /                         # Виконати команду в існуючому Podʼі (випадок з 1 контейнером)
kubectl exec --stdin --tty my-pod -- /bin/sh        # Інтерактивний доступ до оболонки працюючого Podʼа (випадок з 1 контейнером)
kubectl exec my-pod -c my-container -- ls /         # Виконати команду в існуючому Podʼі (випадок з декількома контейнерами)
kubectl debug my-pod -it --image=busybox:1.28       # Створити інтерактивну налагоджувальну сесію в існуючому Podʼі і відразу підʼєднатися до неї
kubectl debug node/my-node -it --image=busybox:1.28 # Створити інтерактивну налагоджувальну сесію на вущлі і відразу підʼєднатися до неї
kubectl top pod                                     # Показати метрики для всіх Podʼів в стандартному просторі імен
kubectl top pod POD_NAME --containers               # Показати метрики для заданого Podʼа та його контейнерів
kubectl top pod POD_NAME --sort-by=cpu              # Показати метрики для заданого Podʼа і сортувати їх за 'cpu' або 'memory'
```

## Копіювання файлів та тек до і з контейнерів {#copying-files-and-directories-to-and-from-containers}

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # Скопіювати локальну теку /tmp/foo_dir до /tmp/bar_dir у віддаленому Podʼі в поточному просторі імен
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # Скопіювати локальний файл /tmp/foo до /tmp/bar у віддаленому Podʼі в конкретному контейнері
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # Скопіювати локальний файл /tmp/foo до /tmp/bar у віддаленому Podʼі в просторі імен my-namespace
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # Скопіювати /tmp/foo з віддаленого Podʼа до /tmp/bar локально
```

{{< note >}}
`kubectl cp` потребує наявності бінарного файлу 'tar' у вашому образі контейнера. Якщо 'tar' відсутній, `kubectl cp` завершиться з помилкою. Для розширених випадків використання, таких як символічні посилання, розширення шаблонів або збереження режимів файлів, розгляньте можливість використання `kubectl exec`.
{{< /note >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # Скопіювати локальний файл /tmp/foo до /tmp/bar у віддаленому Podʼі в просторі імен my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar              # Скопіювати /tmp/foo з віддаленого Podʼа до /tmp/bar локально
```

## Взаємодія з Deployment та Service {#interacting-with-deployments-and-services}

```bash
kubectl logs deploy/my-deployment                         # Вивести логи Podʼа для Deployment (одноконтейнерний випадок)
kubectl logs deploy/my-deployment -c my-container         # Вивести логи Podʼа для Deployment (багатоконтейнерний випадок)

kubectl port-forward svc/my-service 5000                  # Слухати на локальному порту 5000 і переадресувати на порт 5000 на Service бекенд
kubectl port-forward svc/my-service 5000:my-service-port  # Слухати на локальному порту 5000 і переадресувати на порт цільового Service з імʼям <my-service-port>

kubectl port-forward deploy/my-deployment 5000:6000       # Слухати на локальному порту 5000 і переадресувати на порт 6000 на Podʼі, створеному <my-deployment>
kubectl exec deploy/my-deployment -- ls                   # Виконати команду в першому Podʼі та першому контейнері в Deployment (одноконтейнерний або багатоконтейнерний випадок)
```

## Взаємодія з вузлами та кластером {#interacting-with-nodes-and-cluster}

```bash
kubectl cordon my-node                                                # Позначити my-node як непридатний до планування
kubectl drain my-node                                                 # Вивільнити my-node для підготовки до обслуговування
kubectl uncordon my-node                                              # Позначити my-node як придатний до планування
kubectl top node                                                      # Показати метрики для всіх вузлів
kubectl top node my-node                                              # Показати метрики для певного вузла
kubectl cluster-info                                                  # Показати адреси майстра та сервісів
kubectl cluster-info dump                                             # Вивести поточний стан кластера у stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Вивести поточний стан кластера у /path/to/cluster-state

# Переглянути наявні taint, які є на поточних вузлах.
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# Якщо taint з таким ключем та ефектом вже існує, його значення замінюється, як зазначено.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Типи ресурсів {#resource-types}

Для виводу всіх підтримуваних типів ресурсів разом з їх короткими іменами, [API групою](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), чи вони [просторово обмежені](/docs/concepts/overview/working-with-objects/namespaces), та [kind](/docs/concepts/overview/working-with-objects/):

```bash
kubectl api-resources
```

Інші операції для дослідження ресурсів API:

```bash
kubectl api-resources --namespaced=true      # Всі ресурси, які просторово обмежені
kubectl api-resources --namespaced=false     # Всі ресурси, які не є просторово обмеженими
kubectl api-resources -o name                # Усі ресурси з простим виведенням (тільки назва ресурсу)
kubectl api-resources -o wide                # Усі ресурси з розширеним виведенням (так званий "wide" формат)
kubectl api-resources --verbs=list,get       # Усі ресурси, які підтримують запити "list" та "get"
kubectl api-resources --api-group=extensions # Усі ресурси в API групі "extensions"
```

### Форматування виводу {#formatting-output}

Щоб вивести деталі у вікні термінала у певному форматі, додайте прапорець `-o` (або `--output`) до відповідної команди `kubectl`.

Формат виводу | Опис
--------------| -----------
`-o=custom-columns=<spec>` | Вивести таблицю, використовуючи список власних стовпців, розділених комами
`-o=custom-columns-file=<filename>` | Вивести таблицю, використовуючи шаблон власних стовпців з файлу `<filename>`
`-o=go-template=<template>`     | Вивести поля, визначені за допомогою [шаблону на основі golang](https://pkg.go.dev/text/template)
`-o=go-template-file=<filename>` | Вивести поля, визначені за допомогою шаблону на основі [golang з файлу](https://pkg.go.dev/text/template) `<filename>`
`-o=json`     | Вивести API обʼєкт у форматі JSON
`-o=jsonpath=<template>` | Вивести поля, визначені за допомогою виразу [jsonpath](/docs/reference/kubectl/jsonpath)
`-o=jsonpath-file=<filename>` | Вивести поля, визначені за допомогою виразу [jsonpath](/docs/reference/kubectl/jsonpath) з файлу `<filename>`
`-o=kyaml` (бета) | Вивести API обʼєкт у форматі [KYAML](/docs/reference/encodings/kyaml). KYAML є діалектом YAML, специфічним для Kubernetes, і може бути оброблений як YAML.
`-o=name`     | Вивести лише назву ресурсу і нічого більше
`-o=wide`     | Вивести в текстовому форматі з додатковою інформацією, включаючи імʼя вузла для Podʼів
`-o=yaml`     | Вивести API обʼєкт у форматі YAML

Приклади використання `-o=custom-columns`:

```bash
# Усі образи, що працюють в кластері
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# Усі образи, що працюють в просторі імен: default, згруповані по Pod
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

# Усі образи, за винятком "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# Усі поля metadata незалежно від назви
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

Додаткові приклади можна знайти в документації kubectl [reference documentation](/docs/reference/kubectl/#custom-columns).

### Рівні деталізації виводу та налагодження для kubectl {#kubectl-output-verbosity-and-debugging}

Деталізація виводу в kubectl контролюється за допомогою прапорця `-v` або `--v`, за яким слідує ціле число, що представляє рівень логування. Загальні конвенції щодо логування Kubernetes та повʼязані рівні описані [тут](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Рівень деталізації | Опис
--------------| -----------
`--v=0` | Загалом корисно, щоб цей рівень *завжди* був видимим для оператора кластера.
`--v=1` | Прийнятний стандартний рівень логування, якщо вам не потрібна висока деталізація.
`--v=2` | Корисна стабільна інформація про сервіс та важливі повідомлення логу, які можуть корелювати зі значними змінами в системі. Рекомендований стандартний рівень логування для більшості систем.
`--v=3` | Розширена інформація про зміни.
`--v=4` | Рівень логування для налагодження.
`--v=5` | Рівень логування для налагодження з трасуванням.
`--v=6` | Показати запитані ресурси.
`--v=7` | Показати заголовки HTTP-запитів.
`--v=8` | Показати вміст HTTP-запитів.
`--v=9` | Показати вміст HTTP-запитів без обрізання вмісту.

## {{% heading "whatsnext" %}}

* Прочитайте [огляд kubectl](/docs/reference/kubectl/) і дізнайтеся про [JsonPath](/docs/reference/kubectl/jsonpath).

* Перегляньте опції [kubectl](/docs/reference/kubectl/kubectl/).

* Перегляньте опції [kuberc](/docs/reference/kubectl/kuberc/).

* Також ознайомтеся з [конвенціями використання kubectl](/docs/reference/kubectl/conventions/), щоб зрозуміти, як використовувати kubectl в скриптах.

* Дивіться більше у [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4) спільноти.
