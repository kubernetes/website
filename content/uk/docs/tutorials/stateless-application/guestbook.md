---
title: "Приклад: Розгортання PHP застосунку гостьової книги з Redis"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "Приклад Stateless: Гостьова книга на PHP з Redis"
min-kubernetes-server-version: v1.14
source: https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook
---

<!-- overview -->

Цей посібник показує, як створити та розгорнути простий *(але не готовий до промислового використання)* багатошаровий вебзастосунок, використовуючи Kubernetes та [Docker](https://www.docker.com/). Цей приклад складається з наступних компонентів:

* Одно-екземплярний [Redis](https://www.redis.io/) для зберігання записів у гостьовій книзі
* Кілька веб-фронтендів

## {{% heading "objectives" %}}

* Запустити Redis-лідер.
* Запустити двох Redis-фолловерів.
* Запустити фронтенд гостьової книги.
* Опублікувати та переглянути Frontend Service.
* Виконати очищення.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

## Запуск бази даних Redis {#start-up-the-redis-database}

Застосунок гостьової книги використовує Redis для зберігання своїх даних.

### Створення Deployment Redis {#creating-the-redis-deployment}

Файл маніфесту, наведений нижче, визначає контролер Deployment, який запускає одну репліку Redis Pod.

{{% code_sample file="application/guestbook/redis-leader-deployment.yaml" %}}

1. Відкрийте вікно термінала в теці, куди ви завантажили файли маніфестів.
1. Застосуйте Deployment Redis з файлу `redis-leader-deployment.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml
   ```

1. Перевірте список Podʼів, щоб переконатися, що Pod Redis запущений:

   ```shell
   kubectl get pods
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME                           READY   STATUS    RESTARTS   AGE
   redis-leader-fb76b4755-xjr2n   1/1     Running   0          13s
   ```

1. Виконайте наступну команду, щоб переглянути лог з Podʼа Redis лідера:

   ```shell
   kubectl logs -f deployment/redis-leader
   ```

### Створення Service Redis-лідера {#creating-the-redis-leader-service}

Застосунок гостьової книги потребує звʼязку з Redis для запису своїх даних. Вам потрібно застосувати [Service](/docs/concepts/services-networking/service/), щоб спрямовувати трафік до Pod Redis. Service визначає політику доступу до Podʼів.

{{% code_sample file="application/guestbook/redis-leader-service.yaml" %}}

1. Застосуйте Service Redis з файлу `redis-leader-service.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml
   ```

2. Перевірте список Serviceʼів, щоб переконатися, що Service Redis запущений:

   ```shell
   kubectl get service
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
   kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
   redis-leader   ClusterIP   10.103.78.24 <none>        6379/TCP   16s
   ```

{{< note >}}
Цей файл маніфесту створює Service з іменем `redis-leader` з набором міток, які відповідають раніше визначеним міткам, тому Service спрямовує мережевий трафік до Pod Redis.
{{< /note >}}

### Налаштування Redis-фолловерів {#set-up-redis-followers}

Хоча Redis-лідер є одним Pod, ви можете зробити його високо доступним і задовольняти потреби в трафіку, додавши кілька фолловерів Redis або реплік.

{{% code_sample file="application/guestbook/redis-follower-deployment.yaml" %}}

1. Застосуйте Deployment Redis з файлу `redis-follower-deployment.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml
   ```

1. Перевірте, що дві репліки Redis-фолловерів запущені, виконавши запит списку Podʼів:

   ```shell
   kubectl get pods
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME                             READY   STATUS    RESTARTS   AGE
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          37s
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          38s
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          11m
   ```

### Створення Service Redis-фолловера {#creating-the-redis-follower-service}

Застосунок гостьової книги потребує зʼязку з фолловерами Redis для читання даних. Щоб зробити фолловерів Redis доступними, потрібно налаштувати інший [Service](/docs/concepts/services-networking/service/).

{{% code_sample file="application/guestbook/redis-follower-service.yaml" %}}

1. Застосуйте сервіс Redis з файлу `redis-follower-service.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml
   ```

1. Перевірте список Serviceʼів, щоб переконатися, що Service Redis запущений:

   ```shell
   kubectl get service
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   9s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   6m10s
   ```

{{< note >}}
Цей файл маніфесту створює Service з іменем `redis-follower` з набором міток, які відповідають раніше визначеним міткам, тому сервіс спрямовує мережевий трафік до Pod Redis.
{{< /note >}}

## Налаштування та експонування фронтенда гостьової книги {#set-up-and-expose-the-guestbook-frontend}

Тепер, коли ви запустили сховище Redis для своєї гостьової книги, запустіть вебсервери фронтенду. Як і фолловери Redis, фронтенд розгортається за допомогою контролера Deployment Kubernetes.

Застосунок гостьової книги використовує PHP фронтенд. Він налаштований для звʼязку з Serviceʼами фолловера або лідера Redis, залежно від того, чи є запит читанням або записом. Фронтенд відкриває інтерфейс JSON та забезпечує UX на основі jQuery-Ajax.

### Створення Deployment фронтенду гостьової книги {#creating-the-guestbook-frontend-deployment}

{{% code_sample file="application/guestbook/frontend-deployment.yaml" %}}

1. Застосуйте розгортання фронтенду з файлу `frontend-deployment.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
   ```

1. Перевірте список Podʼів, щоб переконатися, що три репліки фронтенду запущені:

   ```shell
   kubectl get pods -l app=guestbook -l tier=frontend
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME                        READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5tqhb   1/1     Running   0          47s
   frontend-85595f5bf9-qbzwm   1/1     Running   0          47s
   frontend-85595f5bf9-zchwc   1/1     Running   0          47s
   ```

### Створення Service для Фронтенду {#creating-the-frontend-service}

Serviceʼи `Redis`, які ви створили, доступні тільки всередині кластера Kubernetes, оскільки типовий тип для Service — [ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types). `ClusterIP` надає одну IP-адресу для набору Podʼів, на які вказує Service. Ця IP-адреса доступна тільки всередині кластера.

Якщо ви хочете, щоб гості могли отримати доступ до вашої гостьової книги, ви повинні налаштувати Service фронтенду таким чином, щоб він був видимий зовні, щоб клієнт міг запитувати Service ззовні кластера Kubernetes. Проте користувачі Kubernetes можуть скористатися командою `kubectl port-forward`, щоб отримати доступ до Service, навіть якщо він використовує `ClusterIP`.

{{< note >}}
Деякі хмарні провайдери, такі як Google Compute Engine або Google Kubernetes Engine, підтримують зовнішні балансувальники навантаження. Якщо ваш хмарний провайдер підтримує балансувальники навантаження і ви хочете його використовувати, розкоментуйте `type: LoadBalancer`.
{{< /note >}}

{{% code_sample file="application/guestbook/frontend-service.yaml" %}}

1. Застосуйте Service фронтенду з файлу `frontend-service.yaml`:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
   ```

2. Виконайте запит для отримання списку Service, щоб переконатися, що Service фронтенду запущений:

   ```shell
   kubectl get services
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   frontend         ClusterIP   10.97.28.230    <none>        80/TCP     19s
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   5m48s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   11m
   ```

### Перегляд Service Фронтенду через `kubectl port-forward` {#view-the-frontend-service-via-kubectl-port-forward}

1. Виконайте наступну команду, щоб перенаправити порт `8080` на вашій локальній машині на порт `80` на сервісі.

   ```shell
   kubectl port-forward svc/frontend 8080:80
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   Forwarding from 127.0.0.1:8080 -> 80
   Forwarding from [::1]:8080 -> 80
   ```

1. Завантажте сторінку [http://localhost:8080](http://localhost:8080) у вашому оглядачі, щоб переглянути вашу гостьову книгу.

### Перегляд Service Фронтенду через `LoadBalancer` {#view-the-frontend-service-via-loadbalancer}

Якщо ви розгорнули маніфест `frontend-service.yaml` з типом `LoadBalancer`, вам потрібно знайти IP-адресу, щоб переглянути вашу гостьову книгу.

1. Виконайте наступну команду, щоб отримати IP-адресу для Service фронтенду.

   ```shell
   kubectl get service frontend
   ```

   Відповідь повинна бути схожою на цю:

   ```none
   NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
   frontend   LoadBalancer   10.51.242.136   109.197.92.229     80:32372/TCP   1m
   ```

1. Скопіюйте зовнішню IP-адресу та завантажте сторінку у вашому оглядачі, щоб переглянути вашу гостьову книгу.

{{< note >}}
Спробуйте додати кілька записів у гостьову книгу, ввівши повідомлення та натиснувши "Submit". Повідомлення, яке ви ввели, зʼявиться на фронтенді. Це повідомлення свідчить про те, що дані успішно додані до Redis через Serviceʼи, які ви створили раніше.
{{< /note >}}

## Масштабування Веб-Фронтенду {#scale-the-web-frontend}

Ви можете збільшувати або зменшувати кількість реплік за потребою, оскільки ваші сервери визначені як Service, що використовує контролер Deployment.

1. Виконайте наступну команду, щоб збільшити кількість Podʼів фронтенду:

   ```shell
   kubectl scale deployment frontend --replicas=5
   ```

1. Виконайте запит для отримання списку Podʼів, щоб перевірити кількість запущених Podʼів фронтенду:

   ```shell
   kubectl get pods
   ```

   Відповідь повинна виглядати приблизно так:

   ```none
   NAME                             READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5df5m        1/1     Running   0          83s
   frontend-85595f5bf9-7zmg5        1/1     Running   0          83s
   frontend-85595f5bf9-cpskg        1/1     Running   0          15m
   frontend-85595f5bf9-l2l54        1/1     Running   0          14m
   frontend-85595f5bf9-l9c8z        1/1     Running   0          14m
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          97m
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          97m
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          108m
   ```

1. Виконайте наступну команду, щоб зменшити кількість Pods фронтенду:

   ```shell
   kubectl scale deployment frontend --replicas=2
   ```

1. Виконайте запит для отримання списку Podʼів, щоб перевірити кількість запущених Podʼів фронтенду:

   ```shell
   kubectl get pods
   ```

   Відповідь повинна виглядати приблизно так:

   ```none
   NAME                             READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-cpskg        1/1     Running   0          16m
   frontend-85595f5bf9-l9c8z        1/1     Running   0          15m
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          98m
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          98m
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          109m
   ```

## {{% heading "cleanup" %}}

Видалення Deployment та Serviceʼів також видаляє всі запущені Podʼи. Використовуйте мітки для видалення кількох ресурсів однією командою.

1. Виконайте наступні команди, щоб видалити всі Pods, Deployment і Serviceʼи.

   ```shell
   kubectl delete deployment -l app=redis
   kubectl delete service -l app=redis
   kubectl delete deployment frontend
   kubectl delete service frontend
   ```

   Відповідь повинна виглядати приблизно так:

   ```none
   deployment.apps "redis-follower" deleted
   deployment.apps "redis-leader" deleted
   deployment.apps "frontend" deleted
   service "frontend" deleted
   ```

1. Виконайте запит списку Podʼів, щоб переконатися, що жоден Pod не працює:

   ```shell
   kubectl get pods
   ```

   Відповідь повинна виглядати приблизно так:

   ```none
   No resources found in default namespace.
   ```

## {{% heading "whatsnext" %}}

* Пройдіть інтерактивні навчальні посібники [Основи Kubernetes](/docs/tutorials/kubernetes-basics/)
* Використовуйте Kubernetes для створення блогу з використанням [постійних томів для MySQL і WordPress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* Дізнайтеся більше про [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Дізнайтеся більше про [ефективне використання міток](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)
