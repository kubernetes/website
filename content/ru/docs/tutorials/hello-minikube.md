---
title: Привет, Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Начало"
    weight: 10
    post: >
      <p>Готовы приступить к делу? Создайте простой кластер Kubernetes и запустите в нём тестовое приложение.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Это руководство демонстрирует, как запустить простое приложение в Kubernetes
с помощью minikube. Для этого используется образ контейнера с NGINX, который
выводит обратно текст всех запросов.


## {{% heading "objectives" %}}

* Развернуть простое приложение в minikube.
* Запустить приложение.
* Посмотреть логи приложения.

## {{% heading "prerequisites" %}}


Руководство подразумевает, что вы уже настроили `minikube`.
См. документацию [minikube start](https://minikube.sigs.k8s.io/docs/start/) для инструкций по его установке.

Вам также потребуется установить `kubectl`.
См. [Установку и настройку kubectl](/ru/docs/tasks/tools/install-kubectl/) для инструкций по его установке.


<!-- lessoncontent -->

## Создание кластера minikube

```shell
minikube start
```

## Запуск панели (dashboard)

Откройте панель Kubernetes. Это можно сделать двумя способами:

{{< tabs name="dashboard" >}}
{{% tab name="Запуск в браузере" %}}
Откройте **новый** терминал и запустите:
```shell
# Запустите в новом терминале и не закрывайте его.
minikube dashboard
```

Теперь можно вернуться к терминалу, где вы запускали `minikube start`.

{{< note >}}
Команда `dashboard` активирует дополнение dashboard и открывает прокси в веб-браузере по умолчанию.
В этой панели можно создавать такие Kubernetes-ресурсы, как Deployment и Service.

Если вы работаете в окружении с правами root, см. вкладку «Копирование URL для запуска».

По умолчанию панель доступна только из внутренней виртуальной сети Kubernetes.
Команда `dashboard` создаёт временный прокси, чтобы панель была доступна извне внутренней виртуальной сети Kubernetes.

Чтобы остановить работу прокси, выполните `Ctrl+C` для завершения процесса.
Когда команда завершит работу, панель останется запущенной внутри кластера Kubernetes.
Вы можете снова выполнить команду `dashboard`, чтобы создать новую прокси для доступа к панели.
{{< /note >}}

{{% /tab %}}
{{% tab name="Копирование URL для запуска" %}}

Если вы не хотите, чтобы minikube запускал веб-браузер, выполните команду `dashboard` с флагом
`--url`. В этом случае `minikube` выведет URL, который вы можете открыть в любом браузере.

Откройте **новый** терминал и запустите:
```shell
# Запустите в новом терминале и не закрывайте его.
minikube dashboard --url
```

Теперь можно вернуться к терминалу, где вы запускали `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Создание деплоймента

[*Под*](/docs/concepts/workloads/pods/pod/) Kubernetes — это группа из одного или более контейнеров, связанных друг с другом для удобного администрирования и организации сети. В данном руководстве под включает в себя один контейнер. Деплоймент ([*Deployment*](/docs/concepts/workloads/controllers/deployment/)) в Kubernetes проверяет здоровье пода и перезагружает контейнер пода в случае, если он прекратил работу. Деплойменты — рекомендуемый способ создания и масштабирования подов.

1. Используйте команду `kubectl create` для создания деплоймента, который будет управлять подом. Под запустит контейнер с указанным Docker-образом.

    ```shell
    # Запуск тестового образа контейнера с веб-сервером
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. Посмотреть информацию о Deployment:

    ```shell
    kubectl get deployments
    ```

    Вывод будет примерно следующим:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

1. Посмотреть информацию о поде:

    ```shell
    kubectl get pods
    ```
    Вывод будет примерно следующим:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Посмотреть события кластера:

    ```shell
    kubectl get events
    ```

1. Посмотреть конфигурацию `kubectl`:

    ```shell
    kubectl config view
    ```

{{< note >}}
Больше информации о командах `kubectl` см. в [обзоре kubectl](/ru/docs/reference/kubectl/).
{{< /note >}}

## Создание сервиса

По умолчанию под доступен только при обращении по его внутреннему IP-адресу внутри кластера Kubernetes. Чтобы сделать контейнер `hello-node` доступным вне виртуальной сети Kubernetes, необходимо представить под как сервис [*Service*](/docs/concepts/services-networking/service/) Kubernetes.

1. Сделать под доступным для публичного интернета можно с помощью команды `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Флаг `--type=LoadBalancer` показывает, что сервис должен быть виден вне кластера.
    
    Код приложения в тестовом образе прослушивает только TCP-порт 8080. Если вы сделали приложение доступным по другому порту командой `kubectl expose`, клиенты не смогут подключиться к этому порту.

2. Посмотреть только что созданный сервис:

    ```shell
    kubectl get services
    ```

    Вывод будет примерно следующим:

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

    Откроется окно браузера, в котором запущено ваше приложение и выводится его ответ.

## Активация дополнений

В minikube есть набор встроенных дополнений ({{< glossary_tooltip text="addons" term_id="addons" >}}), которые могут быть включены, выключены и открыты в локальном окружении Kubernetes.

1. Отобразить текущие поддерживаемые дополнения:

    ```shell
    minikube addons list
    ```

    Вывод будет примерно следующим:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    heapster: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. Включить дополнение, например, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    Вывод:

    ```shell
    metrics-server was successfully enabled
    ```

3. Посмотреть Pod и Service, которые вы только что создали:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Вывод будет примерно следующим:

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Отключить `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    Вывод будет примерно следующим:

    ```
    metrics-server was successfully disabled
    ```

## Очистка

Теперь вы можете освободить ресурсы, созданные в кластере:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Остановите кластер minikube:

```shell
minikube stop
```

Удалите виртуальную машину minikube (опционально):

```shell
minikube delete
```

Если вы планируете использовать minikube в дальнейшем, чтобы больше узнать про Kubernetes, удалять инструмент не нужно.

## {{% heading "whatsnext" %}}


* Руководство по _[деплою первого приложения в Kubernetes с kubectl](/ru/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Больше об [объектах Deployment](/docs/concepts/workloads/controllers/deployment/).
* Больше о [развёртывании приложения](/docs/user-guide/deploying-applications/).
* Больше об [объектах Service](/docs/concepts/services-networking/service/).

