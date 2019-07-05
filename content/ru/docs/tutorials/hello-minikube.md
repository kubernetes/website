---
title: Привет Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Начало работы"
    weight: 10
    post: >
      <p>Готовы испачкать свои руки? Создайте простой Kubernetes кластер который запускает "Hello World" для Node.js.</p>
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

Это руководство предоставляет образ контейнера, созданный из следующих файлов:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

Для получения дополнительной информации о команде `docker build`, смотрите [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Создайте Minikube кластер

1. Нажмите **Запустить терминал** 

    {{< kat-button >}}

    {{< note >}}Если Minikube установлен локально, запустите `minikube start`.{{< /note >}}

2. Откройте Kubernetes dashboard в браузере:

    ```shell
    minikube dashboard
    ```

3. Только для Katacoda среды: В верхней части панели терминала, нажмите значок плюса,затем нажмите на **Выберите порт для просмотра на Host 1**.

4. Только для Katacoda среды: Введите `30000`, затем нажмите **Показать Порт**. 

## Создайте Deployment

Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) это група из одного или более контейнеров,
связанные между собой в целях администрирования и создания сетей. Pod в этом руководстве имеет только один контейнер.
Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) проверяет состояние вашего
Pod и перезапускает его контейнер Pod если он завершился. Deployment'ы рекомендованный способ для управления создания и расширения Pod'ов.

1. Используйте `kubectl create` команду для создания Deployment'a который управляет Pod'ом. 
Pod запускает контейнер на основе предоставленного образа Docker. 

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. Посмотреть Deployment:

    ```shell
    kubectl get deployments
    ```

    Вывод:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. Посмотреть Pod:

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
  
    {{< note >}}Для получения дополнительной информации о команде `kubectl`, смотрите [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Создать Service

По умолчанию, Pod доступен только по внутреннему IP-адресу внутри Kubernetes кластера.
Для того чтобы сделать `hello-node` контейнер доступным вне
Kubernetes виртуальной сети, вы должны раскрыть Pod для доступа как
Kubernetes [*Service*](/docs/concepts/services-networking/service/).

1. Открыть Pod для публичного доступа в интернет используя команду `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
    
    Флаг `--type=LoadBalancer` означает, что вы хотите раскрыть для доступа свой Service вне кластера.

2. Посмотреть Service который вы только что создали:

    ```shell
    kubectl get services
    ```

    Вывод:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    У облачных провайдеров, которые поддерживают балансировку нагрузки,
    внешний IP-адрес будет предоставлен для доступа к Service. В Minikube,
    `LoadBalancer` тип делает Service доступным через команду `minikube service`.

3. Запустите следующую команду:

    ```shell
    minikube service hello-node
    ```

4. Только для Katacoda среды: Нажмите на знак плюса, затем нажмите **Выберите порт для просмотра на Host 1**.

5. Только для Katacoda среды: Введите `30369` (see port opposite to `8080` in services output), затем нажмите

   Это откроет окно браузера который обслуживает ваше приложение и выводит "Hello World" сообщение.

## Включить расширения

Minikube имеет набор встроенных расширений, которые могут быть включены, выключены и открыты в локальной Kubernetes среде.

1. Вывести список поддерживаемых в настоящем времени расширений:

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

3. Посмотреть Pod и Service которые вы только что создали:

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

## Очистка

Теперь вы можете очистить ресурсы, созданные в вашем кластере:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

По желанию, остановить Minikube виртуальную машину (VM):

```shell
minikube stop
```

По желанию, удалить Minikube VM:

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* Узнать больше про [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Узнать больше про [Deploying applications](/docs/user-guide/deploying-applications/).
* Узнать больше про [Service objects](/docs/concepts/services-networking/service/).

{{% /capture %}}
