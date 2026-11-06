---
title: Створення зовнішнього балансувальника навантаження
content_type: task
weight: 80
---

<!-- overview -->

На цій сторінці показано, як створити зовнішній балансувальник навантаження.

Під час створення {{< glossary_tooltip text="Service" term_id="service" >}} ви можете автоматично створити хмарний балансувальник навантаження. Він надає доступну ззовні IP-адресу, яка спрямовує трафік на потрібний порт вузлів кластера, _за умови, що ваш кластер працює в підтримуваному середовищі й налаштований із відповідним пакетом постачальника хмарного балансувальника навантаження_.

Ви також можете використовувати {{< glossary_tooltip term_id="ingress" >}} замість Service. Докладніше дивіться в документації про [Ingress](/docs/concepts/services-networking/ingress/).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Ваш кластер має працювати в хмарі або іншому середовищі, яке вже підтримує налаштування зовнішніх балансувальників навантаження.

<!-- steps -->

## Створення Service {#create-a-service}

### Створення Service з маніфесту {#create-a-service-from-a-manifest}

Щоб створити зовнішній балансувальник навантаження, додайте такий рядок до маніфесту Service:

```yaml
    type: LoadBalancer
```

Ваш маніфест може виглядати так:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

### Створення Service за допомогою kubectl {#create-a-service-using-kubectl}

Також можна створити сервіс командою `kubectl expose` із прапорцем `--type=LoadBalancer`:

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

Ця команда створює новий Service із тими самими селекторами, що й у вказаного ресурсу (у наведеному прикладі — {{< glossary_tooltip text="Deployment" term_id="deployment" >}} з назвою `example`).

Докладніше, зокрема про необовʼязкові прапорці, дивіться в [довіднику `kubectl expose`](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Пошук вашої IP-адреси {#finding-your-ip-address}

Щоб знайти IP-адресу, створену для вашого сервісу, отримайте інформацію про сервіс через `kubectl`:

```bash
kubectl describe services example-service
```

що має дати вивід, подібний до такого:

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

IP-адреса балансувальника навантаження вказана поруч з `LoadBalancer Ingress`.

{{< note >}}
Якщо ви запускаєте сервіс у Minikube, призначену IP-адресу й порт можна знайти за допомогою:

```bash
minikube service example-service --url
```

{{< /note >}}

## Збереження вихідної IP-адреси клієнта {#preserving-the-client-source-ip}

Стандартно вихідна IP-адреса, яку бачить цільовий контейнер, *не є початковою вихідною IP-адресою* клієнта. Щоб увімкнути збереження IP-адреси клієнта, можна налаштувати такі поля в `.spec` Service:

* `.spec.externalTrafficPolicy` — визначає, чи має цей Service маршрутизувати зовнішній трафік до точок доступу на локальному вузлі чи до точок доступу в усьому кластері. Є два варіанти: `Cluster` (стандартно) і `Local`. `Cluster` приховує вихідну IP-адресу клієнта й може спричинити другий перехід на інший вузол, але має добре загальне розподілення навантаження. `Local` зберігає вихідну IP-адресу клієнта й уникає другого переходу для Services типів LoadBalancer і NodePort, але створює ризик нерівномірного розподілення трафіку.
* `.spec.healthCheckNodePort` — задає порт вузла для перевірки справності (числовий номер порту) для сервісу. Якщо ви не вкажете `healthCheckNodePort`, контролер сервісів виділить порт із діапазону NodePort вашого кластера. Цей діапазон можна налаштувати параметром командного рядка API-сервера `--service-node-port-range`. Service використовуватиме вказане користувачем значення `healthCheckNodePort`, якщо ви його задасте, за умови, що `type` Service — LoadBalancer, а `externalTrafficPolicy` — `Local`.

Значення Local для `externalTrafficPolicy` у маніфесті Service вмикає цю можливість. Наприклад:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

### Застереження й обмеження під час збереження вихідних IP-адрес {#caveats-and-limitations-when-preserving-source-ips}

Сервіси балансування навантаження деяких хмарних провайдерів не дозволяють налаштувати різну вагу для кожної цілі.

Коли всі цілі мають однакову вагу під час надсилання трафіку на вузли, зовнішній трафік розподіляється між різними Podʼами нерівномірно. Зовнішній балансувальник навантаження не знає, скільки Podʼів на кожному вузлі використовується як ціль.

Коли `NumServicePods <<  NumNodes` або `NumServicePods >> NumNodes`, розподіл буде досить близьким до рівномірного навіть без ваг.

Внутрішній трафік між Podʼами має поводитися так само, як у Services типу ClusterIP, з однаковою ймовірністю для всіх Podʼів.

## Збір сміття балансувальників навантаження {#garbage-collecting-load-balancers}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Зазвичай відповідні ресурси балансувальника навантаження в хмарного провайдера мають бути очищені незабаром після видалення Service типу LoadBalancer. Але відомо, що існують різні крайні випадки, коли хмарні ресурси лишаються без власника після видалення повʼязаного Service. Щоб цьому запобігти, було введено захист Service типу LoadBalancer завершувачами. Завдяки завершувачам ресурс Service не буде видалено, доки не будуть видалені й відповідні ресурси балансувальника навантаження.

Зокрема, якщо Service має `type` LoadBalancer, контролер сервісів додає завершувач з назвою `service.kubernetes.io/load-balancer-cleanup`. Завершувач вилучається лише після очищення ресурсу балансувальника навантаження. Це запобігає появі завислих ресурсів балансувальника навантаження навіть у крайніх випадках, наприклад під час збою контролера сервісів.

## Постачальники зовнішніх балансувальників навантаження {#external-load-balancer-providers}

Важливо зазначити, що шлях даних для цієї можливості забезпечує балансувальник навантаження, зовнішній щодо кластера Kubernetes.

Коли `type` Service встановлено в LoadBalancer, Kubernetes надає Podʼам у кластері можливості, рівнозначні `type` ClusterIP, і розширює їх, програмуючи (зовнішній щодо Kubernetes) балансувальник навантаження записами для вузлів, на яких розміщені відповідні Podʼи Kubernetes. Панель управління Kubernetes автоматизує створення зовнішнього балансувальника навантаження, перевірки справності (за потреби) і правила фільтрації пакетів (за потреби). Після того як хмарний провайдер виділить IP-адресу для балансувальника навантаження, панель управління отримує цю зовнішню IP-адресу й заносить її в обʼєкт Service.

## {{% heading "whatsnext" %}} {#what-s-next}

* Скористайтеся навчальним матеріалом [Підключення застосунків за допомогою Services](/docs/tutorials/services/connect-applications-service/)
* Прочитайте про [Service](/docs/concepts/services-networking/service/)
* Прочитайте про [Ingress](/docs/concepts/services-networking/ingress/)
