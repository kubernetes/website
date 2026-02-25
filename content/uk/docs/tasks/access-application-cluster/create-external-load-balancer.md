---
title: Створення зовнішнього балансувальника навантаження
content_type: task
weight: 80
---

<!-- overview -->

Ця сторінка показує, як створити зовнішній балансувальник навантаження.

Під час створення {{< glossary_tooltip text="Service" term_id="service" >}} ви маєте можливість автоматично створити балансувальник навантаження в хмарі. Він забезпечує доступну назовні IP-адресу, яка надсилає трафік на відповідний порт ваших вузлів кластера, _за умови, що ваш кластер працює в підтримуваному середовищі та налаштований з відповідним пакетом постачальника хмарного балансувальника навантаження_.

Ви також можете використовувати {{< glossary_tooltip term_id="ingress" >}} замість Service. Для отримання додаткової інформації ознайомтеся з документацією [Ingress](/docs/concepts/services-networking/ingress/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Ваш кластер має працювати в хмарі або іншому середовищі, яке вже підтримує налаштування зовнішніх балансувальників навантаження.

<!-- steps -->

## Створення Service {#create-a-service}

### Створення Service з маніфесту {#create-a-service-from-a-manifest}

Щоб створити зовнішній балансувальник навантаження, додайте до специфікації вашого маніфесту Service наступний рядок :

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

Ви можете також створити Service за допомогою команди `kubectl expose` та її прапорця `--type=LoadBalancer`:

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

Ця команда створює новий Service, використовуючи ті ж селектори, що й вказаний ресурс (у випадку наведеного прикладу — {{< glossary_tooltip text="Deployment" term_id="deployment" >}} під назвою `example`).

Для отримання додаткової інформації, включаючи необовʼязкові прапорці, зверніться до [довідника команди `kubectl expose`](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Пошук вашої IP-адреси {#finding-your-ip-address}

Ви можете знайти IP-адресу, створену для вашого Service, отримавши інформацію про Service через `kubectl`:

```bash
kubectl describe services example-service
```

що повинно дати результат, схожий на цей:

```none
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
Якщо ви запускаєте свій сервіс на Minikube, ви можете знайти призначену IP-адресу та порт за допомогою:

```bash
minikube service example-service --url
```

{{< /note >}}

## Збереження вихідної IP-адреси клієнта {#preserving-the-client-source-ip}

Типово, вихідна IP-адреса, яку бачить цільовий контейнер, _не є оригінальною вихідною IP-адресою_ клієнта. Щоб увімкнути збереження IP-адреси клієнта, можна налаштувати наступні поля в `.spec` Service:

* `.spec.externalTrafficPolicy` — вказує, чи бажає цей Service маршрутизувати зовнішній трафік до вузлів локально або по всьому кластеру. Є два доступні варіанти: `Cluster` (стандартно) і `Local`. `Cluster` приховує вихідну IP-адресу клієнта та може спричинити другий перехід на інший вузол, але має гарне загальне розподілення навантаження. `Local` зберігає вихідну IP-адресу клієнта та уникає другого переходу для сервісів типу LoadBalancer та NodePort, але є ризик потенційно нерівномірного розподілення трафіку.
* `.spec.healthCheckNodePort` — вказує порт для перевірки стану вузлів (числовий номер порту) для Service. Якщо ви не вкажете `healthCheckNodePort`, контролер Service виділить порт з діапазону NodePort вашого кластера. Ви можете налаштувати цей діапазон, встановивши параметр командного рядка API-сервера `--service-node-port-range`. Service використовуватиме значення `healthCheckNodePort`, якщо ви його вкажете, за умови, що `type` Service встановлено як LoadBalancer і `externalTrafficPolicy` встановлено як `Local`.

Встановлення `externalTrafficPolicy` на Local у маніфесті Service активує цю функцію. Наприклад:

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

### Застереження та обмеження при збереженні вихідних IP-адрес{#caveats-and-limitations-when-preserving-source-ips}

Сервіси балансування навантаження деяких хмарних провайдерів не дозволяють налаштувати різну вагу для кожної цілі.

Коли кожна ціль має однакову вагу для надсилання трафіку на вузли, зовнішній трафік нерівномірно розподіляється між різними Podʼами. Зовнішній балансувальник навантаження не знає кількість Podʼів на кожному вузлі, які використовуються як ціль.

Якщо `NumServicePods <<  NumNodes` або `NumServicePods >> NumNodes`, спостерігається майже рівномірний розподіл, навіть без коефіцієнтів.

Внутрішній трафік між Podʼами повинен поводитися подібно до Service типу ClusterIP, з рівною ймовірністю для всіх Podʼів.

## Балансувальники для збору сміття {#garbage-collecting-load-balancers}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

У звичайному випадку, відповідні ресурси балансувальника навантаження у хмарного провайдера повинні бути видалені незабаром після видалення Service типу LoadBalancer. Але відомо, що є різні крайні випадки, коли хмарні ресурси залишаються після видалення асоційованого Service. Для запобігання цьому було введено захист за допомогою завершувачів для Service LoadBalancers. Використовуючи завершувачі, ресурс Service ніколи не буде видалено, поки відповідні ресурси балансувальника навантаження також не будуть видалені.

Зокрема, якщо Service має `type` LoadBalancer, контролер Service додасть завершувач з назвою `service.kubernetes.io/load-balancer-cleanup`. Завершувач буде видалений тільки після видалення ресурсу балансувальника навантаження. Це запобігає залишенню ресурсів балансувальника навантаження навіть у крайніх випадках, таких як падіння контролера сервісу.

## Постачальники зовнішніх балансувальників навантаження {#external-load-balancer-providers}

Важливо зазначити, що шлях даних для цієї функціональності забезпечується зовнішнім для кластера Kubernetes балансувальником навантаження.

Коли `type` Service встановлено як LoadBalancer, Kubernetes забезпечує функціональність, еквівалентну `type` ClusterIP для Podʼів у кластері, і розширює її, програмуючи (зовнішній для Kubernetes) балансувальник навантаження з записами для вузлів, що є місцем розташування відповідних Podʼів Kubernetes. Панель управління Kubernetes автоматизує створення зовнішнього балансувальника навантаження, перевірки стану (якщо необхідно), і правила фільтрації пакетів (якщо необхідно). Після того як хмарний провайдер виділить IP-адресу для балансувальника навантаження, панель управління знаходить цю зовнішню IP-адресу та вносить її в обʼєкт Service.

## {{% heading "whatsnext" %}}

* Ознайомтеся з підручником [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Дізнайтеся більше про [Service](/docs/concepts/services-networking/service/)
* Дізнайтеся більше про [Ingress](/docs/concepts/services-networking/ingress/)
