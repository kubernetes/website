---
title: Привет Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Начало"
    weight: 10
    post: >
      <p>Готовы испачкать руки? Создайте простой кластер Kubernetes с запуском "Hello World" на Node.js</p>
card: 
  name: tutorials
  weight: 10
---

{{% capture overview %}}

Это руководство покажет вам, как запустить простое Hello World Node.js приложение
на Kubernetes используя [Minikube](/docs/getting-started-guides/minikube) и Katacoda.
Katacoda предоставляет бесплатную, встроенную в браузер Kubernetes среду. 

{{< note >}}
Вы также можете следовать этому руководству, если вы установили [Minikube locally](/docs/tasks/tools/install-minikube/).
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Разверните hello world приложение в Minikube.
* Запустите приложение.
* Посмотрите логи приложения.

{{% /capture %}}

{{% capture prerequisites %}}

Для этого примера создан образ контейнера, собранный на основе следующих файлов:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

Чтобы получить больше информации по запуску команды `docker build`, ознакомьтесь с [документацией по Docker](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Создание кластера Minikube

1. Нажмите **Запуск Терминала** 

    {{< kat-button >}}

    {{< note >}}Если у вас локально установлен Minikube, выполните `minikube start`.{{< /note >}}

2. Откройте панель Kubernetes в браузере:

    ```shell
    minikube dashboard
    ```

3. Только для окружения Katacoda: В верхней части панели нажмите знак "плюч", а затем нажмите на **Select port to view on Host 1** (**Выберите порт для отображения на хосте 1**). 

4. Только для окружения Katacoda: Type `30000`, and then click **Display Port** (**Показать порт**). 

## Создание Deployment

[*Под*](/docs/concepts/workloads/pods/pod/) Kubernetes - это группа из одного или более контейнеров, связанных друг с другом с целью адмистрирования и организации сети. В данном руководстве под включает в себя один контейнер. [*Deployment*](/docs/concepts/workloads/controllers/deployment/) в Kubernetes проверяет здоровье пода и перезагружает контейнер пода в случае его отказа. Deployment-ы являются рекоммендуемым способом организации создания и масштабирования подов.

1. Используйте команду `kubectl create` для создание деплоймента для управления подом. Под запускает контейнер на основе предоставленного Docker образа.

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. Посмотреть информацию о Deployment:

    ```shell
    kubectl get deployments
    ```

    Вывод:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. Посмотреть информацию о поде:

    ```shell
    kubectl get pods
    ```
    Вывод:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Посмотреть события кластера:

    ```shell
    kubectl get events
    ```

5. Посмотреть `kubectl` конфигурацию:

    ```shell
    kubectl config view
    ```
  
    {{< note >}}Больше информации о командах `kubectl` можно найти по ссылке [обзор kubectl](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Создание сервиса

По-умолчанию под доступен только при обращении по его внутреннему IP адресу внутри кластера Kubernetes. Чтобы сделать контейнер `hello-node` доступным вне виртульной сети Kubernetes, необходимо представить под как [*сервис*](/docs/concepts/services-networking/service/) Kubernetes.

1. Представить под для видимости в публичной сети Интернет можно с помощью команды `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
  
    Флаг `--type=LoadBalancer` показывает, что сервис должен быть виден вне кластера.

2. Посмотреть только что созданный сервис:

    ```shell
    kubectl get services
    ```

    Вывод:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Для облачных провайдеров, поддерживающих балансировщики нагрузки, для доступа к сервису будет предоставлен внешний IP адрес. В Minikube тип `LoadBalancer` делает сервис доступным при обращении с помощью команды `minikube service`.

3. Выполните следующую команду:

    ```shell
    minikube service hello-node
    ```

4. Только для окружения Katacoda: Нажмите на знак "Плюс", затем нажмите **Select port to view on Host 1**.

5. Только для окружения Katacoda: Введите `30369` (порт указан рядом с `8080` в выводе сервиса), затем нажмите ???. 

    Откроется окно браузера, в котором запущено ваше приложение и будет отображено сообщение "Hello World".

## Добавление аддонов

В Minikube есть набор встроенных аддонов, которые могут быть включены, выключены и открыты в локальном окружении Kubernetes.

1. Отобразить текущие поддерживаемые аддоны:

    ```shell
    minikube addons list
    ```

    Вывод:

    ```shell
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```
   
2. Включить расширение, например, `heapster`:

    ```shell
    minikube addons enable heapster
    ```
  
    Вывод:

    ```shell
    heapster was successfully enabled
    ```

3. Посмотреть Pod и Service, которые вы только что создали:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Вывод:

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Отключить `heapster`:

    ```shell
    minikube addons disable heapster
    ```
  
    Вывод:

    ```shell
    heapster was successfully disabled
    ```

## Освобождение ресурсов

Теперь вы можете освободить ресурсы созданного вами кластера:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Остановите выполнение виртуальной машины Minikube (опционально):

```shell
minikube stop
```

Удалите виртуальную машину Minikube (опционально):

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* Больше об [объекте(ах?) деплоймента](/docs/concepts/workloads/controllers/deployment/).
* Большо о [развёртывании приложения](/docs/user-guide/deploying-applications/).
* Больше об [объектах сервиса](/docs/concepts/services-networking/service/).

{{% /capture %}}
