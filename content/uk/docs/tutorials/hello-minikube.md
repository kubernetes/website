---
#title: Hello Minikube
title: Привіт Minikube
content_type: tutorial
weight: 5
card: 
  #name: tutorials
  name: навчальні матеріали
  weight: 10
---

<!-- overview -->

<!--This tutorial shows you how to run a simple Hello World Node.js app
on Kubernetes using [Minikube](/docs/setup/learning-environment/minikube) and Katacoda.
Katacoda provides a free, in-browser Kubernetes environment.
-->
З цього навчального матеріалу ви дізнаєтесь, як запустити у Kubernetes простий Hello World застосунок на Node.js за допомогою [Minikube](/docs/setup/learning-environment/minikube) і Katacoda. Katacoda надає безплатне Kubernetes середовище, що доступне у вашому браузері.

<!--{{< note >}}
You can also follow this tutorial if you've installed [Minikube locally](/docs/tasks/tools/install-minikube/).
{{< /note >}}
-->
{{< note >}}
Також ви можете навчатись за цим матеріалом, якщо встановили [Minikube локально](/docs/tasks/tools/install-minikube/).
{{< /note >}}



## {{% heading "objectives" %}}


<!--* Deploy a hello world application to Minikube.
-->
* Розгорнути Hello World застосунок у Minikube.
<!--* Run the app.
-->
* Запустити застосунок.
<!--* View application logs.
-->
* Переглянути логи застосунку.



## {{% heading "prerequisites" %}}


<!--This tutorial provides a container image built from the following files:
-->
У цьому навчальному матеріалі ми використовуємо образ контейнера, зібраний із наступних файлів:

{{% codenew language="js" file="minikube/server.js" %}}

{{% codenew language="conf" file="minikube/Dockerfile" %}}

<!--For more information on the `docker build` command, read the [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).
-->
Більше інформації про команду `docker build` ви знайдете у [документації Docker](https://docs.docker.com/engine/reference/commandline/build/).



<!-- lessoncontent -->

<!--## Create a Minikube cluster
-->
## Створення Minikube кластера

<!--1. Click **Launch Terminal** 
-->
1. Натисніть кнопку **Запуск термінала** 

    {{< kat-button >}}

    <!--{{< note >}}If you installed Minikube locally, run `minikube start`.{{< /note >}}
    -->
    {{< note >}}Якщо Minikube встановлений локально, виконайте команду `minikube start`.{{< /note >}}

<!--2. Open the Kubernetes dashboard in a browser:
-->
2. Відкрийте Kubernetes дашборд у браузері:

    ```shell
    minikube dashboard
    ```

<!--3. Katacoda environment only: At the top of the terminal pane, click the plus sign, and then click **Select port to view on Host 1**.
-->
3. Тільки для Katacoda: у верхній частині вікна термінала натисніть знак плюс, а потім -- **Select port to view on Host 1**.

<!--4. Katacoda environment only: Type `30000`, and then click **Display Port**.
-->
4. Тільки для Katacoda: введіть `30000`, а потім натисніть **Display Port**. 

<!--## Create a Deployment
-->
## Створення Deployment

<!--A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.
-->
[*Pod*](/docs/concepts/workloads/pods/pod/) у Kubernetes -- це група з одного або декількох контейнерів, що об'єднані разом з метою адміністрування і роботи у мережі. У цьому навчальному матеріалі Pod має лише один контейнер. Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) перевіряє стан Pod'а і перезапускає контейнер Pod'а, якщо контейнер перестає працювати. Створювати і масштабувати Pod'и рекомендується за допомогою Deployment'ів.

<!--1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
Pod runs a Container based on the provided Docker image.
-->
1. За допомогою команди `kubectl create` створіть Deployment, який керуватиме Pod'ом. Pod запускає контейнер на основі наданого Docker образу.

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
    ```

<!--2. View the Deployment:
-->
2. Перегляньте інформацію про запущений Deployment:

    ```shell
    kubectl get deployments
    ```

    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

<!--3. View the Pod:
-->
3. Перегляньте інформацію про запущені Pod'и:

    ```shell
    kubectl get pods
    ```

    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

<!--4. View cluster events:
-->
4. Перегляньте події кластера:

    ```shell
    kubectl get events
    ```

<!--5. View the `kubectl` configuration:
-->
5. Перегляньте конфігурацію `kubectl`:

    ```shell
    kubectl config view
    ```
  
    <!--{{< note >}}For more information about `kubectl`commands, see the [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}
    -->
    {{< note >}}Більше про команди `kubectl` ви можете дізнатися зі статті [Загальна інформація про kubectl](/docs/user-guide/kubectl-overview/).{{< /note >}}

<!--## Create a Service
-->
## Створення Service

<!--By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).
-->
За умовчанням, Pod доступний лише за внутрішньою IP-адресою у межах Kubernetes кластера. Для того, щоб контейнер `hello-node` став доступний за межами віртуальної мережі Kubernetes, Pod необхідно відкрити як Kubernetes [*Service*](/docs/concepts/services-networking/service/).

<!--1. Expose the Pod to the public internet using the `kubectl expose` command:
-->
1. Відкрийте Pod для публічного доступу з інтернету за допомогою команди `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
    
    <!--The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.
    -->
    Прапорець `--type=LoadBalancer` вказує, що ви хочете відкрити доступ до Service за межами кластера.

<!--2. View the Service you just created:
-->
2. Перегляньте інформацію про Service, який ви щойно створили:

    ```shell
    kubectl get services
    ```

    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    <!--On cloud providers that support load balancers,
    an external IP address would be provisioned to access the Service. On Minikube,
    the `LoadBalancer` type makes the Service accessible through the `minikube service`
    command.
    -->
    Для хмарних провайдерів, що підтримують балансування навантаження, доступ до Service надається через зовнішню IP-адресу. Для Minikube, тип `LoadBalancer` робить Service доступним ззовні за допомогою команди `minikube service`.

<!--3. Run the following command:
-->
3. Виконайте наступну команду:

    ```shell
    minikube service hello-node
    ```

<!--4. Katacoda environment only: Click the plus sign, and then click **Select port to view on Host 1**.
-->
4. Тільки для Katacoda: натисніть знак плюс, а потім -- **Select port to view on Host 1**.

<!--5. Katacoda environment only: Note the 5 digit port number displayed opposite to `8080` in services output. This port number is randomly generated and it can be different for you. Type your number in the port number text box, then click Display Port. Using the example from earlier, you would type `30369`.
-->
5. Тільки для Katacoda: запишіть п'ятизначний номер порту, що відображається напроти `8080` у виводі сервісу. Номер цього порту генерується довільно і тому може бути іншим у вашому випадку. Введіть номер порту у призначене для цього текстове поле і натисніть Display Port. У нашому прикладі номер порту `30369`.

    <!--This opens up a browser window that serves your app and shows the "Hello World" message.
    -->
    Це відкриє вікно браузера, в якому запущений ваш застосунок, і покаже повідомлення "Hello World".

<!--## Enable addons
-->
## Увімкнення розширень

<!--Minikube has a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.
-->
Minikube має ряд вбудованих {{< glossary_tooltip text="розширень" term_id="addons" >}}, які можна увімкнути, вимкнути і відкрити у локальному Kubernetes оточенні.

<!--1. List the currently supported addons:
-->
1. Перегляньте перелік підтримуваних розширень:

    ```shell
    minikube addons list
    ```

    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

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
   
<!--2. Enable an addon, for example, `metrics-server`:
-->
2. Увімкніть розширення, наприклад `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```
  
    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

    ```
    metrics-server was successfully enabled
    ```

<!--3. View the Pod and Service you just created:
-->
3. Перегляньте інформацію про Pod і Service, які ви щойно створили:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

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

<!--4. Disable `metrics-server`:
-->
4. Вимкніть `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```
  
    <!--The output is similar to:
    -->
    У виводі ви побачите подібну інформацію:

    ```
    metrics-server was successfully disabled
    ```

<!--## Clean up
-->
## Вивільнення ресурсів

<!--Now you can clean up the resources you created in your cluster:
-->
Тепер ви можете видалити ресурси, які створили у вашому кластері:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

<!--Optionally, stop the Minikube virtual machine (VM):
-->
За бажанням, зупиніть віртуальну машину (ВМ) з Minikube:

```shell
minikube stop
```

<!--Optionally, delete the Minikube VM:
-->
За бажанням, видаліть ВМ з Minikube:

```shell
minikube delete
```



## {{% heading "whatsnext" %}}


<!--* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
-->
* Дізнайтеся більше про [об'єкти Deployment](/docs/concepts/workloads/controllers/deployment/).
<!--* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/).
-->
* Дізнайтеся більше про [розгортання застосунків](/docs/user-guide/deploying-applications/).
<!--* Learn more about [Service objects](/docs/concepts/services-networking/service/).
-->
* Дізнайтеся більше про [об'єкти Service](/docs/concepts/services-networking/service/).


