---
title: Шпаргалка по kubectl
reviewers:
- erictune
- krousey
- clove
content_type: concept
card:
  name: reference
  weight: 30
---

<!-- overview -->

Смотрите также: [обзор Kubectl](/ru/docs/reference/kubectl/overview/) и [руководство по JsonPath](/ru/docs/reference/kubectl/jsonpath).

Эта команда представляет собой обзор команды `kubectl`.



<!-- body -->

# kubectl - Шпаргалка

## Автодополнение ввода для Kubectl

### BASH

```bash
source <(kubectl completion bash) # настройка автодополнения в текущую сессию bash, предварительно должен быть установлен пакет bash-completion .
echo "source <(kubectl completion bash)" >> ~/.bashrc # добавление автодополнения autocomplete постоянно в командную оболочку bash.
```

Вы также можете использовать короткий псевдоним для `kubectl`, который можно интегрировать с автодополнениями:

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # настройка автодополнения в текущую сессию zsh
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # add autocomplete permanently to your zsh shell
```

## Контекст и конфигурация kubectl

Установка того, с каким Kubernetes-кластером взаимодействует `kubectl` и изменяет конфигурационную информацию. Подробную информацию о конфигурационном файле смотрите на странице [Authenticating Across Clusters with kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).


```bash
kubectl config view # показать объединённые настройки kubeconfig

# использовать несколько файлов kubeconfig одновременно и посмотреть объединённую конфигурацию из этих файлов
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# получить пароль для пользователя e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # показать первого пользователя
kubectl config view -o jsonpath='{.users[*].name}'   # получить список пользователей
kubectl config get-contexts                          # показать список контекстов
kubectl config current-context                       # показать текущий контекст (current-context)
kubectl config use-context my-cluster-name           # установить my-cluster-name как контекст по умолчанию

# добавить новую конфигурацию для кластера в kubeconf с базовой аутентификацией
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# сохранить пространство имен для всех последующих команд kubectl в этом контексте.
kubectl config set-context --current --namespace=ggckad-s2

# установить контекст, используя имя пользователя и пространство имен.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # удалить пользователя foo
```

## Apply

`apply` управляет приложениями с помощью файлов, которые определяют ресурсы Kubernetes. Выполните команду `kubectl apply` для создания и обновления ресурсов. Это рекомендуемый способ управления приложениями Kubernetes в промышленном окружении. Смотрите [Kubectl Book](https://kubectl.docs.kubernetes.io).

## Создание объектов

Манифесты Kubernetes могут быть определены в YAML или JSON. Можно использовать расширение файла `.yaml`, `.yml` и `.json`

```bash
kubectl apply -f ./my-manifest.yaml            # создать ресурсы
kubectl apply -f ./my1.yaml -f ./my2.yaml      # создать ресурсы из нескольких файлов
kubectl apply -f ./dir                         # создать ресурсы из всех файлов манифеста в директории
kubectl apply -f https://git.io/vPieo          # создать ресурсы из URL-адреса
kubectl create deployment nginx --image=nginx  # запустить один экземпляр nginx
kubectl explain pods                           # посмотреть документацию по манифестам подов

# Создать несколько YAML-объектов из stdin
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
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
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# Создать секрет с несколькими ключами
cat <<EOF | kubectl apply -f -
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

## Просмотр и поиск ресурсов

```bash
# Get-команды с основном выводом
kubectl get services                          # Вывести все сервисы в пространстве имён
kubectl get pods --all-namespaces             # Вывести все поды во всех пространств имён
kubectl get pods -o wide                      # Вывести все поды в текущем пространстве имён с подробностями
kubectl get deployment my-dep                 # Вывести определённое развёртывание
kubectl get pods                              # Вывести все поды в пространстве имён
kubectl get pod my-pod -o yaml                # Получить информацию по поду в формате YAML

# Посмотреть дополнительные сведения команды с многословным выводом
kubectl describe nodes my-node
kubectl describe pods my-pod

# Вывести сервисы, отсортированные по имени
kubectl get services --sort-by=.metadata.name

# Вывести поды, отсортированные по количеству перезагрузок
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Вывести постоянные тома (PersistentVolumes), отсортированные по емкости
kubectl get pv --sort-by=.spec.capacity.storage

# Получить метку версии всех подов с меткой app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Получить все рабочие узлы (с помощью селектора исключаем узлы с меткой 'node-role.kubernetes.io/master')
kubectl get node --selector='!node-role.kubernetes.io/master'

# Получить все запущенные поды в пространстве имён
kubectl get pods --field-selector=status.phase=Running

# Получить внешние IP-адреса (ExternalIP) всех узлов
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Вывести имена подов, принадлежащие к определённому RC
# Использование команды "jq" помогает упросить поиск в jsonpath, подробнее смотрите на сайте https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Показать метки всех подов (или любого другого объекта Kubernetes, которым можно прикреплять метки)
kubectl get pods --show-labels

# Получить готовые узлы
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Вывод декодированных секретов без внешних инструментов
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# Вывести все секреты, используемые сейчас в поде.
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Вывести все идентификаторы (containerID) контейнеров инициализации (initContainers) во всех подах.
# Это полезно при очистке остановленных контейнеров, не удаляя при этом контейнеры инициализации.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Вывести события, отсортированные по временной метке
kubectl get events --sort-by=.metadata.creationTimestamp

# Сравнить текущее состояние кластера с состоянием, в котором находился бы кластер в случае применения манифеста.
kubectl diff -f ./my-manifest.yaml
```

## Обновление ресурсов

Начиная с версии 1.11 подкоманда `rolling-update` была удалена (см. [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.11.md)), поэтому вместо неё используйте `rollout`.

```bash
kubectl set image deployment/frontend www=image:v2               # Плавающее обновление контейнеров "www" развёртывания "frontend", обновление образа
kubectl rollout history deployment/frontend                      # Проверить историю развёртывания, включая ревизии.
kubectl rollout undo deployment/frontend                         # Откатиться к предыдущему развёртыванию
kubectl rollout undo deployment/frontend --to-revision=2         # Откатиться к определённой ревизии
kubectl rollout status -w deployment/frontend                    # Отслеживать статус плавающего развёртывания "frontend" до его завершения
kubectl rollout restart deployment/frontend                      # Перезапуск плавающего развёртывания "frontend"


# Объявлено устаревшим, начиная с версии 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (устарело) Плавающее обновление подов frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (устарело) Изменить имя ресурса и обновить образ
kubectl rolling-update frontend --image=image:v2                 # (устарело) Обновить образ подов frontend
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (устарело) Отменить выполняющееся обновление

cat pod.json | kubectl replace -f -                              # Заменить под из определения в JSON-файле, переданного в поток stdin

# Принудительно заменить, удалить, а затем пересоздать ресурс. Это приведет к простою приложения
kubectl replace --force -f ./pod.json

# Создать сервис с реплицированным nginx на порту 80, который подключается к контейнерам на порту 8000.
kubectl expose rc nginx --port=80 --target-port=8000

# Обновить версию (метку) образа пода из одного контейнера single до v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Добавить метку
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Добавить аннотацию
kubectl autoscale deployment foo --min=2 --max=10                # Автоматически масштабировать развёртывание "foo" в диапазоне от 2 до 10 подов
```

## Обновление ресурсов

```bash
# Обновить часть узла
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Обновить образ контейнера; необходимо указать spec.containers[*].name, чтобы произвести слияние
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Обновить образ контейнера через json-патч с позиционными массивами
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Удалить развертывание livenessProbe через json-патч с позиционными массивами
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Добавить нового элемента в позиционный массив
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## Редактирование ресурсов

Вы можете отредактировать API-ресурс в любом редакторе.

```bash
kubectl edit svc/docker-registry                      # Отредактировать сервис docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Использовать другой редактор
```

## Масштабирование ресурсов

```bash
kubectl scale --replicas=3 rs/foo                                 # Масштабирование набора реплик (replicaset) 'foo' до 3
kubectl scale --replicas=3 -f foo.yaml                            # Масштабирование ресурса в "foo.yaml" до 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Если количество реплик в развёртывании mysql равен 2, масштабировать его до 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Масштабирование нескольких контроллеров репликации до 5
```

## Удаление ресурсов

```bash
kubectl delete -f ./pod.json                                              # Удалить под по типу и имени в pod.json
kubectl delete pod,service baz foo                                        # Удалить поды и сервисы с одноимёнными именам "baz" и "foo"
kubectl delete pods,services -l name=myLabel                              # Удалить поды и сервисы с именем метки myLabel
kubectl -n my-ns delete pod,svc --all                                     # Удалить все поды и сервисы в пространстве имен my-ns
# Удалить все поды, соответствующие pattern1 или pattern2 в awk
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Работа с запущенными подами

```bash
kubectl logs my-pod                                 # вывести логи пода (в stdout)
kubectl logs -l name=myLabel                        # вывести логи пода с меткой myLabel (в stdout)
kubectl logs my-pod --previous                      # вывести логи пода (в stdout) по предыдущему экземпляру контейнера
kubectl logs my-pod -c my-container                 # вывести логи контейнера пода (в stdout, при работе с несколькими контейнерами)
kubectl logs -l name=myLabel -c my-container        # вывести логи пода с меткой myLabel (в stdout)
kubectl logs my-pod -c my-container --previous      # вывести логи контейнера пода (в stdout, при работе с несколькими контейнерами) по предыдущему экземпляру контейнера
kubectl logs -f my-pod                              # вывести логи пода в режиме реального времени (в stdout)
kubectl logs -f my-pod -c my-container              # вывести логи контейнера пода в режиме реального времени (в stdout, при работе с несколькими контейнерами)
kubectl logs -f -l name=myLabel --all-containers    # вывести логи всех подов с меткой myLabel (в stdout)
kubectl run -i --tty busybox --image=busybox -- sh  # запустить под как интерактивную оболочку
kubectl run nginx --image=nginx --restart=Never -n
mynamespace                                         # Запустить под nginx в заданном пространстве имён
kubectl run nginx --image=nginx --restart=Never     # Запустить под nginx и записать его спецификацию в файл pod.yaml
--dry-run -o yaml > pod.yaml

kubectl attach my-pod -i                            # Прикрепить к запущенному контейнеру
kubectl port-forward my-pod 5000:6000               # Переадресовать порт 5000 в локальной машине на порт 6000 в поде my-pod
kubectl exec my-pod -- ls /                         # Выполнить команду в существующем поде (в случае одного контейнера).
kubectl exec my-pod -c my-container -- ls /         # Выполнить команду в существующем поде (в случае нескольких контейнеров)
kubectl top pod POD_NAME --containers               # Показать метрики по заданному поду вместе с его контейнерами
```

## Работа с узлами и кластером

```bash
kubectl cordon my-node                                                # Отметить узел my-node как неназначаемый
kubectl drain my-node                                                 # Вытеснить узел my-node, чтобы подготовиться к эксплуатации
kubectl uncordon my-node                                              # Отметить узел my-node как назначаемый
kubectl top node my-node                                              # Показать метрики по заданному узлу
kubectl cluster-info                                                  # Показать адреса главного узла и сервисов
kubectl cluster-info dump                                             # Вывести состояние текущего кластера в stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Вывести состояние текущего кластера в /path/to/cluster-state

# Если ограничение с заданным ключом и проявлением уже существует, его значение будет заменено указанным
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Типы ресурсов

Вывести все поддерживаемые типы ресурсов, включая [API-группу](/docs/concepts/overview/kubernetes-api/#api-groups), флаг [namespaced](/docs/concepts/overview/working-with-objects/namespaces) (организован ли ресурс в пространство имён или нет) и [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Другие варианты команды для анализа API-ресурсов:

```bash
kubectl api-resources --namespaced=true      # Все ресурсы с пространством имён
kubectl api-resources --namespaced=false     # Все ресурсы без пространства имён
kubectl api-resources -o name                # Все ресурсы с простым выводом  (только имя ресурса)
kubectl api-resources -o wide                # Все ресурсы с расширенным (с неограниченной длинной) выводом
kubectl api-resources --verbs=list,get       # Все ресурсы, которые поддерживают глаголы запроса "list" и "get"
kubectl api-resources --api-group=extensions # Все ресурсы в API-группе "extensions"
```

### Форматирование вывода

Для вывода подробной информации в окно терминала в определенном формате, добавьте флаг `-o` (или `--output`) в команду `kubectl`, которая поддерживает форматирование.

Формат вывода | Описание
--------------| -----------
`-o=custom-columns=<spec>` | Вывод таблицы из списка пользовательских столбцов через запятую
`-o=custom-columns-file=<filename>` | Вывод таблицы из списка пользовательских столбцов, определённых в файле `<filename>`
`-o=json`     | Вывод API-объекта в формате JSON
`-o=jsonpath=<template>` | Вывод полей, определённых в выражении [jsonpath](/docs/reference/kubectl/jsonpath)
`-o=jsonpath-file=<filename>` | Вывод полей, определённых в выражении [jsonpath](/docs/reference/kubectl/jsonpath) из файла `<filename>`
`-o=name`     | Вывод только имена ресурсов
`-o=wide`     | Вывод дополнительную информации в обычном текстовом формате, в случае подов отображается имя узла
`-o=yaml`     | Вывод API-объекта в формате YAML

### Уровни детальности вывода и отладки в Kubectl

Уровни детальности вывода Kubectl регулируются с помощью флагов `-v` или `--v`, за которыми следует целое число, представляющее уровни логирования. Общие соглашения по логированию Kubernetes и связанные с ними уровни описаны [здесь](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).


Уровень детальности | Описание
--------------| -----------
`--v=0` | Как правило, используется чтобы *всегда* видеть, что происходит
`--v=1` | Достаточный уровень логирования по умолчанию, если вам не нужна большая детальность.
`--v=2` | Полезная информация про стабильное состояние сервиса и важные сообщения логов, которые могут связаны со значительными изменениями в системе. Это рекомендуемый уровень логирования по умолчанию для большинства систем.
`--v=3` | Расширенная информация об изменениях.
`--v=4` | Уровень детальности для отладки.
`--v=6` | Показать запрашиваемые ресурсы.
`--v=7` | Показать заголовки HTTP-запросов.
`--v=8` | Показать содержимое HTTP-запросов.
`--v=9` | Показать содержимого HTTP-запроса в полном виде.



## {{% heading "whatsnext" %}}


* Подробнее о kubectl на странице [обзора](/ru/docs/reference/kubectl/overview/).

* Посмотреть опции [kubectl](/ru/docs/reference/kubectl/kubectl/).

* Ознакомиться с [соглашениями по использованию kubectl](/docs/reference/kubectl/conventions/), чтобы понять, как использовать его в повторно используемых скриптах.

* Посмотреть [шпаргалки по kubectl](https://github.com/dennyzhang/cheatsheet-kubernetes-A4) сообщества.


