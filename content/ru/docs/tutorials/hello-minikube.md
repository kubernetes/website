---
title: Привет, Minikube
content_type: tutorial
weight: 5
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
См. __шаг 1__ в документации [minikube start](https://minikube.sigs.k8s.io/docs/start/) для инструкций по его установке.
{{< alert color="info" title="Примечание" >}}
Выполните только инструкции из __шага 1 «Установка»__. Остальные шаги описаны на этой странице.
{{< /alert >}}

Вам также потребуется установить `kubectl`.
См. [Установку инструментов](/docs/tasks/tools/#kubectl) для инструкций по его установке.


<!-- lessoncontent -->

## Создание кластера minikube

```shell
minikube start
```

{{< alert color="info" title="Примечание" >}}
Команда `minikube start` создаёт кластер с одним узлом. Этот узел одновременно выполняет функции управляющего слоя и рабочего узла. В отличие от него, во многих production-кластерах Kubernetes узлы управляющего слоя обычно изолированы от рабочих узлов с помощью
[ограничений (taints)](/docs/concepts/scheduling-eviction/taint-and-toleration/) или полностью скрыты от пользователя.
{{< /alert >}}

## Проверка состояния кластера minikube

Проверьте состояние кластера minikube, чтобы убедиться, что все компоненты работают.

```shell
minikube status
```

В выводе команды все компоненты должны иметь состояние Running или Configured, как в примере ниже:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
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

{{< alert color="info" title="Примечание" >}}
Команда `dashboard` активирует дополнение dashboard и открывает прокси в веб-браузере по умолчанию.
В этой панели можно создавать такие Kubernetes-ресурсы, как Deployment и Service.

Чтобы узнать, как получить URL панели, не запуская браузер непосредственно из терминала, см. вкладку «Копирование URL для запуска».

По умолчанию панель доступна только из внутренней виртуальной сети Kubernetes.
Команда `dashboard` создаёт временный прокси, чтобы панель была доступна извне внутренней виртуальной сети Kubernetes.

Чтобы остановить работу прокси, выполните `Ctrl+C` для завершения процесса.
Когда команда завершит работу, панель останется запущенной внутри кластера Kubernetes.
Вы можете снова выполнить команду `dashboard`, чтобы создать новую прокси для доступа к панели.
{{< /alert >}}

{{% /tab %}}
{{% tab name="Копирование URL для запуска" %}}

Если вы не хотите, чтобы minikube запускал веб-браузер, выполните команду `dashboard` с флагом
`--url`. В этом случае `minikube` выведет URL, который вы можете открыть в любом браузере.

Откройте **новый** терминал и запустите:
```shell
# Запустите в новом терминале и не закрывайте его.
minikube dashboard --url
```

Теперь можно открыть этот URL и вернуться к терминалу, где вы запускали `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Создание деплоймента

[*Под*](/docs/concepts/workloads/pods/) Kubernetes — это группа из одного или более контейнеров, связанных друг с другом для удобного администрирования и организации сети. В данном руководстве под включает в себя один контейнер. Деплоймент ([*Deployment*](/docs/concepts/workloads/controllers/deployment/)) в Kubernetes проверяет здоровье пода и перезагружает контейнер пода в случае, если он прекратил работу. Деплойменты — рекомендуемый способ создания и масштабирования подов.

1. Используйте команду `kubectl create` для создания деплоймента, который будет управлять подом. Под запустит контейнер с указанным Docker-образом.

    ```shell
    # Запуск тестового образа контейнера с веб-сервером
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

1. Посмотреть информацию о Deployment:

    ```shell
    kubectl get deployments
    ```

    Вывод будет примерно следующим:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Может потребоваться некоторое время, прежде чем под станет доступен. Если вы видите «0/1», повторите попытку через несколько секунд.)

1. Посмотреть информацию о поде:

    ```shell
    kubectl get pods
    ```
    Вывод будет примерно следующим:

    ```
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

1. Посмотреть логи приложения для контейнера в поде (замените имя пода на полученное с помощью `kubectl get pods`).

   {{< alert color="info" title="Примечание" >}}
   Замените `hello-node-5f76cf6ccf-br9b5` в команде `kubectl logs` на имя пода из вывода команды `kubectl get pods`.
   {{< /alert >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   Вывод будет примерно следующим:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< alert color="info" title="Примечание" >}}
Больше информации о командах `kubectl` см. в [обзоре kubectl](/ru/docs/reference/kubectl/).
{{< /alert >}}

## Создание сервиса

По умолчанию под доступен только при обращении по его внутреннему IP-адресу внутри кластера Kubernetes. Чтобы сделать контейнер `hello-node` доступным вне виртуальной сети Kubernetes, необходимо представить под как сервис [*Service*](/docs/concepts/services-networking/service/) Kubernetes.

{{< alert color="danger" title="Предупреждение" >}}
В контейнере agnhost есть конечная точка `/shell`, которая полезна для
отладки, но открывать к ней доступ из публичного интернета опасно. Не запускайте этот контейнер
в кластере, доступном из интернета, или в production-кластере.
{{< /alert >}}

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

    ```
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

    Вывод будет примерно следующим:

    ```
    The 'metrics-server' addon is enabled
    ```

3. Посмотреть Pod и Service, созданные при установке этого дополнения:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Вывод будет примерно следующим:

    ```
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

4. Проверить вывод `metrics-server`:

    ```shell
    kubectl top pods
    ```

    Вывод будет примерно следующим:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    Если появится следующее сообщение, подождите и повторите попытку:

    ```
    error: Metrics API not available
    ```

5. Отключить `metrics-server`:

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
# Необязательно
minikube delete
```

Если вы планируете использовать minikube в дальнейшем, чтобы больше узнать про Kubernetes, удалять инструмент не нужно.

## Заключение

На этой странице рассмотрены основные шаги создания и запуска кластера minikube. Теперь вы готовы развёртывать приложения.

## {{% heading "whatsnext" %}}


* Руководство по _[деплою первого приложения в Kubernetes с kubectl](/ru/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Больше об [объектах Deployment](/docs/concepts/workloads/controllers/deployment/).
* Больше о [развёртывании приложения](/docs/tasks/run-application/run-stateless-application-deployment/).
* Больше об [объектах Service](/docs/concepts/services-networking/service/).

