---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Установка Kubernetes с помощью Minikube
weight: 30
content_type: concept
---

<!-- overview -->

Minikube — это инструмент, позволяющий легко запускать Kubernetes на локальной машине. Для тех, кто хочет попробовать Kubernetes или рассмотреть возможность его использования в повседневной разработке, Minikube станет отличным вариантом, потому что он запускает одноузловой кластер Kubernetes внутри виртуальной машины (VM) на компьютере пользователя.



<!-- body -->

## Возможности Minikube

Minikube поддерживает следующие возможности Kubernetes:

* DNS
* Сервисы NodePort
* Словари конфигурации (ConfigMaps) и секреты (Secrets)
* Панель управления (Dashboard)
* Среда выполнения контейнера: Docker, [CRI-O](https://cri-o.io/) и [containerd](https://github.com/containerd/containerd)
* Поддержка CNI (Container Network Interface)
* Ingress

## Установка

Посмотрите страницу [Установка Minikube](/ru/docs/tasks/tools/install-minikube/).

## Краткое руководство

Эта простая демонстрация поможет запустить, использовать и удалить Minikube на локальной машине. Следуйте перечисленным ниже шагам, чтобы начать знакомство с Minikube.

1. Запустите Minikube и создайте кластер:

    ```shell
    minikube start
    ```

    Вывод будет примерно следующим:

    ```
    Starting local Kubernetes cluster...
    Running pre-create checks...
    Creating machine...
    Starting local Kubernetes cluster...
    ```

    Дополнительную информацию о запуске кластера в определенной версии Kubernetes, виртуальной машине или среде выполнения контейнера смотрите в разделе [Запуск кластера](#запуск-кластера).

2. Теперь вы можете работать со своим кластером через CLI-инструмент kubectl. Для получения дополнительной информации смотрите раздел [Работа с кластером](#работа-с-кластером).

    Давайте создадим развёртывание (Deployment) в Kubernetes, используя существующий образ `echoserver`, представляющий простой HTTP-сервер, и сделаем его доступным на порту 8080 с помощью `--port`.

    ```shell
    kubectl create deployment hello-minikube --image=registry.k8s.io/echoserver:1.10
    ```

    Вывод будет примерно следующим:

    ```
    deployment.apps/hello-minikube created
    ```

3. Чтобы получить доступ к объекту Deployment `hello-minikube` извне, создайте объект сервиса (Service):

    ```shell
    kubectl expose deployment hello-minikube --type=NodePort --port=8080
    ```

    Опция `--type=NodePort` определяет тип сервиса.

    Вывод будет примерно следующим:

    ```
    service/hello-minikube exposed
    ```

4. Под (Pod) `hello-minikube` теперь запущен, но нужно подождать, пока он начнёт функционировать, прежде чем обращаться к нему.

    Проверьте, что под работает:

    ```shell
    kubectl get pod
    ```

    Если в столбце вывода `STATUS` выводится `ContainerCreating`, значит под все еще создается:

    ```
    NAME                              READY     STATUS              RESTARTS   AGE
    hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
    ```

    Если в столбце `STATUS` указано `Running`, то под теперь в рабочем состоянии:

    ```
    NAME                              READY     STATUS    RESTARTS   AGE
    hello-minikube-3383150820-vctvh   1/1       Running   0          13s
    ```

5. Узнайте URL-адрес открытого (exposed) сервиса, чтобы просмотреть подробные сведения о сервисе:

    ```shell
    minikube service hello-minikube --url
    ```

6. Чтобы ознакомиться с подробной информацией о локальном кластере, скопируйте и откройте полученный из вывода команды на предыдущем шаге URL-адрес в браузере.

    Вывод будет примерно следующим:

    ```
    Hostname: hello-minikube-7c77b68cff-8wdzq

    Pod Information:
        -no pod information available-

    Server values:
        server_version=nginx: 1.13.3 - lua: 10008

    Request Information:
        client_address=172.17.0.1
        method=GET
        real path=/
        query=
        request_version=1.1
        request_scheme=http
        request_uri=http://192.168.99.100:8080/

    Request Headers:
        accept=*/*
        host=192.168.99.100:30674
        user-agent=curl/7.47.0

    Request Body:
        -no body in request-
    ```

    Если сервис и кластер вам больше не нужны, их можно удалить.

7. Удалите сервис `hello-minikube`:

    ```shell
    kubectl delete services hello-minikube
    ```

    Вывод будет примерно следующим:

    ```
    service "hello-minikube" deleted
    ```

8. Удалите развёртывание `hello-minikube`:

    ```shell
    kubectl delete deployment hello-minikube
    ```

    Вывод будет примерно следующим:

    ```
    deployment.extensions "hello-minikube" deleted
    ```

9. Остановите локальный кластер Minikube:

    ```shell
    minikube stop
    ```

    Вывод будет примерно следующим:

    ```
    Stopping "minikube"...
    "minikube" stopped.
    ```

    Подробности смотрите в разделе [Остановка кластера](#остановка-кластера).

10. Удалите локальный кластер Minikube:

    ```shell
    minikube delete
    ```

    Вывод будет примерно следующим:

    ```
    Deleting "minikube" ...
    The "minikube" cluster has been deleted.
    ```

    Подробности смотрите в разделе [Удаление кластера](#удаление-кластера).

## Управление кластером

### Запуск кластера

Команда `minikube start` используется для запуска кластера.
Эта команда создаёт и конфигурирует виртуальную машину, которая запускает одноузловой кластер Kubernetes.
Эта команда также настраивает вашу установку [kubectl](/docs/user-guide/kubectl-overview/) для взаимодействия с этим кластером.

{{< note >}}
Если вы работаете из-под веб-прокси, вам нужно указать данные прокси в команде `minikube start`:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

К сожалению, установка переменных окружения не cработает.

Minikube также создает контекст "minikube" и устанавливает его по умолчанию в kubectl.
Чтобы вернуться к этому контексту, выполните следующую команду: `kubectl config use-context minikube`.
{{< /note >}}

#### Указание версии Kubernetes

Вы можете указать используемую версию Kubernetes в Minikube, добавив параметр `--kubernetes-version` в команду `minikube start`. Например, чтобы запустить Minikube из-под версии {{< skew currentPatchVersion >}}, вам нужно выполнить следующую команду:

```shell
minikube start --kubernetes-version {{< skew currentPatchVersion >}}
```

#### Указание драйвера виртуальной машины

Вы можете изменить драйвер виртуальной машины, добавив флаг `--vm-driver=<enter_driver_name>` в команду `minikube start`.

Тогда команда будет выглядеть так:

```shell
minikube start --vm-driver=<driver_name>
```

Minikube поддерживает следующие драйверы:

{{< note >}}
Смотрите страницу [DRIVERS](https://minikube.sigs.k8s.io/docs/reference/drivers/) для получения подробной информации о поддерживаемых драйверах и как устанавливать плагины.
{{< /note >}}

* virtualbox
* vmwarefusion
* docker (ЭКСПЕРИМЕНТАЛЬНЫЙ)
* kvm2 ([установка драйвера](https://minikube.sigs.k8s.io/docs/reference/drivers/kvm2/))
* hyperkit ([установка драйвера](https://minikube.sigs.k8s.io/docs/reference/drivers/hyperkit/))
* hyperv ([установка драйвера](https://minikube.sigs.k8s.io/docs/reference/drivers/hyperv/))
Обратите внимание, что указанный IP-адрес на этой странице является динамическим и может изменяться. Его можно получить с помощью `minikube ip`.
* vmware ([установка драйвера](https://minikube.sigs.k8s.io/docs/reference/drivers/vmware/)) (VMware unified driver)
* parallels ([установка драйвера](https://minikube.sigs.k8s.io/docs/reference/drivers/parallels/))
* none (Запускает компоненты Kubernetes на хосте, а не на виртуальной машине. Использование этого драйвера требует использование Linux и установленного {{< glossary_tooltip term_id="docker" >}}.)

{{< caution >}}
Если вы используете драйвер `none`, некоторые компоненты Kubernetes запускаются как привилегированные контейнеры, которые имеют побочные эффекты вне окружения Minikube. Эти побочные эффекты означают, что драйвер `none` не рекомендуется использовать в личных рабочих станций.
{{< /caution >}}

#### Запуск кластера в других средах выполнения контейнеров

Вы можете запустить Minikube в следующих средах выполнения контейнеров.

{{< tabs name="container_runtimes" >}}
{{% tab name="containerd" %}}
Чтобы использовать [containerd](https://github.com/containerd/containerd) в качестве среды выполнения контейнера, выполните команду ниже:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

Также можете использовать расширенную вариант команды:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{% tab name="CRI-O" %}}
Чтобы использовать [CRI-O](https://cri-o.io/) в качестве среды выполнения контейнера, выполните команду ниже:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

Также можете использовать расширенную вариант команды:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{< /tabs >}}

#### Использование локальных образов путём повторного использования демона Docker

При использовании одной виртуальной машины для Kubernetes легко повторно использовать демон Docker, встроенный в Minikube. В этом случае нет необходимости создавать реестр Docker на вашей хост-машине и отправлять образ туда. Вместо этого вы можете создать реестр внутри того же демона Docker, который использует Minikube, что позволит ускорить локальные запуски.

{{< note >}}
Обязательно пометьте собственным тегом Docker-образ, и затем при получении образа всегда указывайте его. Так как `:latest` — это тег по умолчанию, поэтому наряду с соответствующей стандартной политикой получения образа, равной `Always`, в конечном итоге возникнет ошибка при получении образа (`ErrImagePull`), если Docker-образ не найден в базовом реестре Docker (как правило, в DockerHub).
{{< /note >}}

Для работы с Docker-демоном на вашем хосте под управлением Mac/Linux, запустите последнюю строку из вывода команды `minikube docker-env`.

Теперь вы можете использовать Docker в командной строке вашего хост-компьютера на Mac/Linux для взаимодействия с демоном Docker внутри виртуальной машины Minikube:

```shell
docker ps
```

{{< note >}}
На Centos 7 Docker может возникнуть следующая ошибка:

```
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

Для исправления этой ошибки обновите файл `/etc/sysconfig/docker`, чтобы учитывались изменения в среде Minikube:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```
{{< /note >}}

### Конфигурация Kubernetes

Minikube имеет такую возможность как "конфигуратор" ("configurator"), позволяющая пользователям настраивать компоненты Kubernetes произвольными значениями.
Чтобы использовать эту возможность, используйте флаг `--extra-config` в команде `minikube start`.

Этот флаг можно дублировать, поэтому вы можете указать его несколько раз с несколькими разными значениями, чтобы установить несколько опций.

Этот флаг принимает строку вида `component.key=value`, где `component` — это одно из значение в приведённом ниже списка, `key` — ключ из структуры конфигурации, а `value` — значение, которое нужно установить.

Допустимые ключи можно найти в документации по `componentconfigs` в Kubernetes каждого компонента.
Ниже вы найдете документации по каждой поддерживаемой конфигурации:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### Примеры

Чтобы изменить настройку `MaxPods` на значение 5 в Kubelet, передайте этот флаг `--extra-config=kubelet.MaxPods=5`.

Эта возможность также поддерживает вложенные структуры. Для изменения настройки `LeaderElection.LeaderElect` на значение `true` в планировщике, передайте флаг `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

Чтобы изменить настройку `AuthorizationMode` в `apiserver` на значение `RBAC`, используйте флаг `--extra-config=apiserver.authorization-mode=RBAC`.

### Остановка кластера

Команда `minikube stop` используется для остановки кластера.
Эта команда выключает виртуальную машины Minikube, но сохраняет всё состояние кластера и данные.
Повторный запуск кластера вернет его в прежнее состояние.

### Удаление кластера

Команда `minikube delete` используется для удаления кластера.
Эта команда выключает и удаляет виртуальную машину Minikube.
Данные или состояние не сохраняются.

### Обновление minikube

Смотрите [инструкцию по обновлению minikube](https://minikube.sigs.k8s.io/docs/start/macos/).

## Работа с кластером

### Kubectl

Команда `minikube start` создает [контекст kubectl](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) под именем "minikube".
Этот контекст содержит конфигурацию для взаимодействия с кластером Minikube.

Minikube автоматически устанавливает этот контекст, но если вам потребуется явно использовать его в будущем, выполните команду ниже:

```shell
kubectl config use-context minikube
```

Либо передайте контекст при выполнении команды следующим образом: `kubectl get pods --context=minikube`.

### Панель управления

Чтобы получить доступ к [веб-панели управления Kubernetes](/docs/tasks/access-application-cluster/web-ui-dashboard/), запустите эту команду в командной оболочке после запуска Minikube, чтобы получить адрес:

```shell
minikube dashboard
```

### Сервисы

Чтобы получить доступ к сервису, открытой через порт узла, выполните команду в командной оболочке после запуска Minikube, чтобы получить адрес:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## Организация сети

Виртуальная машина Minikube доступна только хост-системе через IP-адрес, который можно получить с помощью команды `minikube ip`.
Вы можете использовать IP-адрес для доступа к любому сервису типа `NodePort`.

Чтобы определить NodePort для вашего сервиса, вы можете использовать такую команду `kubectl`:

```shell
kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'
```

## Постоянные тома

Minikube поддерживает [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) типа `hostPath`.
Эти постоянные тома монтируются в виртуальную машину Minikube.

Виртуальная машина Minikube загружается в файловую систему tmpfs, поэтому большинство директорий не будет сохранено при перезагрузках (`minikube stop`).
Однако Minikube сконфигурирован на сохранение файлов, хранящихся в перечисленных ниже директорий хоста.

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

Пример конфигурации PersistentVolume для сохранения данных в директории `/data`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## Смонтированные директории хоста

Некоторые драйверы монтируют директорию хоста в виртуальную машину, чтобы можно было легко обмениваться файлами между виртуальной машиной и хостом. В настоящее время это не настраивается и отличается от используемого драйвера и ОС.

{{< note >}}
Совместное использование директории хоста еще не реализовано в драйвере KVM.
{{< /note >}}

| Driver        | OS      | HostFolder | VM              |
|---------------|---------|------------|-----------------|
| VirtualBox    | Linux   | /home      | /hosthome       |
| VirtualBox    | macOS   | /Users     | /Users          |
| VirtualBox    | Windows | C://Users  | /c/Users        |
| VMware Fusion | macOS   | /Users     | /mnt/hgfs/Users |
| Xhyve         | macOS   | /Users     | /Users          |

## Приватные реестры контейнеров

Для доступа к реестру приватных контейнеров, выполните шаги, описанные на [этой странице](/docs/concepts/containers/images/).

Мы рекомендуем использовать `ImagePullSecrets`, но если вам нужно обратиться к нему из виртуальной машины Minikube, нужно поместить файл `.dockercfg` в директорию `/home/docker` или `config.json` в директорию `/home/docker/.docker`.

## Дополнения

Для того, чтобы Minikube смог запустить или перезапустить пользовательские дополнения, поместите дополнения, которые вы хотите запускать с помощью Minikube, в директорию `~/.minikube/addons`. Дополнения в этой директории будут перемещены в виртуальную машину Minikube и запускаться каждый раз при запуске или перезапуске Minikube.

## Использование Minikube с помощью HTTP-прокси

Minikube создаёт виртуальную машину, включающая в себя Kubernetes и демон Docker.
Когда Kubernetes планирует выполнение контейнеров с использованием Docker, демону Docker может потребоваться доступ к внешней сети для получения контейнеров.

Если вы работаете через HTTP-прокси, вам нужно сконфигурировать настройки прокси для Docker.
Для этого нужно передать необходимые переменные окружения в флаги перед выполнением команды `minikube start`.

Например:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

Если адрес вашей виртуальной машины 192.168.99.100, то, скорее всего, настройки прокси помешают `kubectl` обратиться к ней.
Чтобы прокси игнорировал этот IP-адрес, нужно скорректировать настройки no_proxy следующим образом:

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## Известные проблемы

Функциональность, для которой требуется несколько узлов, не будет работать в Minikube.

## Реализация

Minikube использует [libmachine](https://github.com/docker/machine/tree/master/libmachine) для подготовки виртуальных машин и [kubeadm](https://github.com/kubernetes/kubeadm) для инициализации кластера Kubernetes.

Для получения дополнительной информации о Minikube посмотрите [статью](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Дополнительные ссылки

* **Цели**: цели проекта Minikube смотрите в [дорожной карте](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Руководство по разработке**: посмотрите [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md), чтобы ознакомиться с тем, как отправлять пулрексты.
* **Сборка Minikube**: инструкции по сборке/тестированию Minikube из исходного кода смотрите в [руководстве по сборке](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Добавление новой зависимости**: инструкции по добавлению новой зависимости в Minikube смотрите в [руководстве по добавлению зависимостей](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Добавление нового дополнения**: инструкции по добавлению нового дополнения для Minikube смотрите в [руководстве по добавлению дополнений](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8**: пользователи Linux, которые не хотят использовать виртуальную машину, могут в качестве альтернативы посмотреть в сторону [MicroK8s](https://microk8s.io/).

## Сообщество

Помощь, вопросы и комментарии приветствуются и поощряются! Разработчики Minikube проводят время на [Slack](https://kubernetes.slack.com) в канале #minikube (получить приглашение можно [здесь](http://slack.kubernetes.io/)). У нас также есть [список рассылки dev@kubernetes на Google Groups](https://groups.google.com/a/kubernetes.io/g/dev/). Если вы отправляете сообщение в список, пожалуйста, начните вашу тему с "minikube: ".
