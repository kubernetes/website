---
title: Налаштування Ingress у Minikube з використанням NGINX Ingress Controller
content_type: task
weight: 110
min-kubernetes-server-version: 1.19
---

<!-- overview -->

[Ingress](/uk/docs/concepts/services-networking/ingress/) — це API-обʼєкт, який визначає правила, що дозволяють зовнішній доступ до Serviceʼів у кластері. [Ingress-контролер](/uk/docs/concepts/services-networking/ingress-controllers/) виконує правила, встановлені в Ingress.

Ця сторінка показує, як налаштувати простий Ingress, який маршрутизує запити до Service 'web' або 'web2' залежно від HTTP URI.

## {{% heading "prerequisites" %}}

Це завдання передбачає, що ви використовуєте `minikube` для запуску локального Kubernetes кластера. Відвідайте сторінку[Встановлення інструментів](/uk/docs/tasks/tools/#minikube), щоб дізнатися, як встановити `minikube`.

{{< note >}}
Це завдання використовує контейнер, який вимагає архітектури AMD64. Якщо ви використовуєте minikube на компʼютері з іншою архітектурою процесора, ви можете спробувати використовувати minikube з драйвером, який може емулювати AMD64. Наприклад, драйвер Docker Desktop може це робити.
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
Якщо ви використовуєте старішу версію Kubernetes, використовуйте документацію для цієї версії.

### Створіть кластер minikube {#create-a-minikube-cluster}

Якщо ви ще не налаштували кластер локально, виконайте `minikube start`, щоб створити кластер.

<!-- steps -->

## Увімкніть Ingress-контролер {#enable-the-ingress-controller}

1. Для увімкнення NGINX Ingress Controller, виконайте наступну команду:

   ```shell
   minikube addons enable ingress
   ```

1. Переконайтеся, що NGINX Ingress Controller працює:

   ```shell
   kubectl get pods -n ingress-nginx
   ```

   {{< note >}}
   Це може зайняти до хвилини, перш ніж ви побачите що ці Podʼи, що працюють нормально.
   {{< /note >}}

   Вивід подібний до:

   ```none
   NAME                                        READY   STATUS      RESTARTS    AGE
   ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
   ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
   ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
   ```

## Розгорніть застосунок hello world {#deploy-a-hello-world-app}

1. Створіть Deployment за допомогою наступної команди:

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   Вивід має бути:

   ```none
   deployment.apps/web created
   ```

   Переконайтеся, що Deployment перебуває у стані Ready:

   ```shell
   kubectl get deployment web 
   ```  

   Вивід має бути подібний до:

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web    1/1     1            1           53s
   ``` 

1. Опублікуйте Deployment:

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   Вивід має бути:

   ```none
   service/web exposed
   ```

1. Переконайтеся, що Service створено і він доступний на порті вузла:

   ```shell
   kubectl get service web
   ```

   Вивід подібний до:

   ```none
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

1. Відвідайте Service через NodePort, використовуючи команду [`minikube service`](https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-service-with-tunnel). Дотримуйтесь інструкцій для вашої платформи:

   {{< tabs name="minikube_service" >}}
   {{% tab name="Linux" %}}
   
   ```shell
   minikube service web --url
   ```

   Вивід подібний до:

   ```none
   http://172.17.0.15:31637
   ```

   Виконайте запит до URL, отриманого у попередньому кроці:

   ```shell
   curl http://172.17.0.15:31637 
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   # Команду потрібно виконати в окремому терміналі.
   minikube service web --url 
   ```

   Вивід подібний до:

   ```none
   http://127.0.0.1:62445
   ! Оскільки ви використовуєте драйвер Docker на darwin, термінал має бути відкритий для його запуску.
   ```

   В іншому терміналі виконайте запит до URL, отриманого у попередньому кроці:

   ```shell
   curl http://127.0.0.1:62445 
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   Вивід подібний до:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   Тепер ви можете отримати доступ до застосунку прикладу через IP-адресу Minikube і NodePort. Наступний крок дозволяє отримати доступ до застосунку, використовуючи ресурс Ingress.

## Створіть Ingress {#create-an-ingress}

Наступний маніфест визначає Ingress, який надсилає трафік до вашого Service через `hello-world.example`.

1. Створіть файл `example-ingress.yaml` з наступним вмістом:

   {{% code_sample file="service/networking/example-ingress.yaml" %}}

1. Створіть обʼєкт Ingress, виконавши наступну команду:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   Вивід має бути:

   ```none
   ingress.networking.k8s.io/example-ingress created
   ```

1. Переконайтеся, що IP-адреса встановлена:

   ```shell
   kubectl get ingress
   ```

   {{< note >}}
   Це може тривати кілька хвилин.
   {{< /note >}}

   Ви повинні побачити IPv4-адресу у стовпці `ADDRESS`; наприклад:

   ```none
   NAME              CLASS   HOSTS                 ADDRESS        PORTS   AGE
   example-ingress   nginx   hello-world.example   172.17.0.15    80      38s
   ```

1. Перевірте, що Ingress-контролер спрямовує трафік, дотримуючись інструкцій для вашої платформи:

   {{< note >}}
   Мережа обмежена, якщо використовується драйвер Docker на MacOS (Darwin), і IP вузла не доступний безпосередньо. Щоб Ingress працював, потрібно відкрити новий термінал і виконати `minikube tunnel`. Необхідні дозволи `sudo`, тому надайте пароль при запиті.
   {{< /note >}}

   {{< tabs name="ingress" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```

   Вивід подібний до:

   ```none
   Tunnel successfully started

   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   В іншому терміналі виконайте наступну команду:

   ```shell
   curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}

   <br>
   Ви повинні побачити:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

1. За бажанням ви також можете відвідати `hello-world.example` зі свого оглядача.

   Додайте рядок у кінець файлу `/etc/hosts` на вашому компʼютері (потрібні права адміністратора):

   {{< tabs name="hosts" >}}
   {{% tab name="Linux" %}}
   Знайдіть зовнішню IP-адресу, як вказано у звіті minikube

   ```none
     minikube ip 
   ``` 

   <br>

   ```none
     172.17.0.15 hello-world.example
   ```

   {{< note >}}
   Змініть IP-адресу відповідно до виводу з `minikube ip`.
   {{< /note >}}
   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```none
   127.0.0.1 hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}

   <br>

   Після цього ваш вебоглядач надсилатиме запити на URL-адреси `hello-world.example` до Minikube.

## Створіть другий Deployment {#create-a-second-deployment}

1. Створіть інший Deployment, виконавши наступну команду:

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```

   Вивід має бути:

   ```none
   deployment.apps/web2 created
   ```

   Переконайтеся, що Deployment перебуває у стані Ready:

   ```shell
   kubectl get deployment web2 
   ```

   Вихід має бути подібний до:

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web2   1/1     1            1           16s
   ```

1. Опублікуйте другий Deployment:

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   Вивід має бути:

   ```none
   service/web2 exposed
   ```

## Редагування поточного Ingress {#edit-ingress}

1. Відредагуйте поточний маніфест `example-ingress.yaml` та додайте наступні рядки в кінці:

    ```yaml
    - path: /v2
      pathType: Prefix
      backend:
        service:
          name: web2
          port:
            number: 8080
    ```

1. Застосуйте зміни:

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   Ви маєте побачити:

   ```none
   ingress.networking/example-ingress configured
   ```

## Перевірка вашого Ingress {#test-your-ingress}

1. Отримайте доступ до першої версії застосунку Hello World.

   {{< tabs name="ingress2-v1" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```

   Вивід подібний до:

   ```none
   Tunnel successfully started

   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   В іншому терміналі виконайте наступну команду:

   ```shell
   curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   Вивід подібний до:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

1. Отримайте доступ до другої версії застосунку Hello World.

   {{< tabs name="ingress2-v2" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example/v2
   ```

   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```

   Вивід подібний до:

   ```none
   Tunnel successfully started

   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   В іншому терміналі виконайте наступну команду:

   ```shell
   curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example/v2
   ```

   {{% /tab %}}
   {{< /tabs >}}

   Вивід подібний до:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   {{< note >}}
   Якщо ви виконали необовʼязковий крок для оновлення `/etc/hosts`, ви також можете відвідати `hello-world.example` та `hello-world.example/v2` зі свого огляача.
   {{< /note >}}

## {{% heading "whatsnext" %}}

* Докладніше про [Ingress](/uk/docs/concepts/services-networking/ingress/)
* Докладніше про [Контролери Ingress](/uk/docs/concepts/services-networking/ingress-controllers/)
* Докладніше про [Service](/uk/docs/concepts/services-networking/service/)
