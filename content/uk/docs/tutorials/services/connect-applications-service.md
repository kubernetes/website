---
title: Підключення застосунків за допомогою Service
content_type: tutorial
weight: 20
---

<!-- overview -->

## Модель Kubernetes для підключення контейнерів {#the-kubernetes-model-for-connecting-containers}

Тепер, коли у вас є постійно працюючий, реплікований застосунок, ви можете дати до нього доступ з мережі.

Kubernetes передбачає, що кожен з Podʼів може спілкуватися з іншими, незалежно від того, на якому хості вони опиняються. Kubernetes надає кожному Podʼу власну IP-адресу, що є приватною адресою кластера, тому вам не потрібно явно створювати посилання між Podʼами або перенаправляти порти контейнера на порти хосту. Це означає, що контейнери всередині Podʼів можуть звертатися до портів один одного на localhost, і всі Podʼи в кластері можуть бачити один одного без NAT. У решті цього документа розглянуто, як ви можете запустити надійні сервіси на такій мережевій моделі.

У цьому посібнику використовується простий вебсервер nginx для демонстрації концепції.

<!-- body -->

## Експонування Podʼів в кластер {#exposing-pods-to-the-cluster}

Ми робили це в попередньому прикладі, але зробимо це ще раз і зосередимося на перспективі мережі. Створіть Pod nginx, і зверніть увагу, що він має специфікацію порту контейнера:

{{% code_sample file="service/networking/run-my-nginx.yaml" %}}

Це робить його доступним з будь-якого вузла у вашому кластері. Перевірте вузли, на яких працює Pod:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

Перевірте IP-адреси ваших Podʼів:

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

Ви повинні мати можливість увійти у будь-який вузол у своєму кластері за допомогою SSH і використовувати інструмент, такий як `curl`, щоб робити запити до обох IP-адрес. Зверніть увагу, що контейнери *не* використовують порт 80 на вузлі, і немає жодних спеціальних правил NAT для маршрутизації трафіку до Podʼів. Це означає, що ви можете запустити кілька Podʼів nginx на одному й тому ж вузлі, використовуючи той же `containerPort`, і отримувати доступ до них з будь-якого іншого Podʼа або вузла у вашому кластері, використовуючи призначену IP адресу Podʼа. Якщо ви хочете організувати перенаправлення певного порту на хості Вузла на резервні Podʼи, ви можете це зробити — але модель мережі повинна передбачати, що вам не потрібно цього робити.

Ви можете прочитати більше про [Модель мережі Kubernetes](/docs/concepts/cluster-administration/networking/) якщо вас це цікавить.

## Створення Service {#creating-a-service}

Отже, у нас є Podʼи, що працюють з nginx у плоскому адресному просторі, доступному для всього кластера. Теоретично, ви можете звертатися до цих Podʼів безпосередньо, але що станеться, коли вузол вийде з ладу? Podʼи загинуть разом з ним, і ReplicaSet всередині Deployment створить нові, з іншими IP-адресами. Це проблема, яку вирішує Service.

Service Kubernetes — це абстракція, яка визначає логічний набір Podʼів, що працюють десь у вашому кластері, і всі надають однакову функціональність. Коли створюється Service, йому призначається унікальна IP-адреса (яку називають clusterIP). Ця адреса привʼязана до тривалості життя Service і не змінюється, поки Service живий. Podʼи можуть бути налаштовані для звернення до Service і знати, що звʼязок з Service буде автоматично балансуватися на деякий Pod, що є членом Service.

Ви можете створити Service для ваших двох реплік nginx за допомогою `kubectl expose`:

```shell
kubectl expose deployment/my-nginx
```

```none
service/my-nginx exposed
```

Це еквівалентно `kubectl apply -f` наступного yaml:

{{% code_sample file="service/networking/nginx-svc.yaml" %}}

Ця специфікація створить Service, який буде спрямований на TCP порт 80 на будь-якому Podʼі з міткою `run: my-nginx` і відкриє його на абстрактному порті Service (`targetPort`: це порт, на якому контейнер приймає трафік, `port` — це абстрактний порт Service, який може бути будь-яким портом, що використовується іншими Podʼами для доступу до Service). Перегляньте [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) API обʼєкт, щоб побачити список підтримуваних полів у визначенні Service. Перевірте ваш Service:

```shell
kubectl get svc my-nginx
```

```none
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

Як згадувалося раніше, Service підтримується групою Podʼів. Ці Podʼи експонуються через
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}. Селектор Service буде оцінюватися безперервно, і результати будуть надсилатися у EndpointSlice, який підключений до Service за допомогою {{< glossary_tooltip text="мітки" term_id="label" >}}. Коли Pod припиняє існування, він автоматично видаляється з EndpointSlices, який містить його як точку доступу. Нові Podʼи, що відповідають селектору Service, автоматично додаються до EndpointSlice для цього Service. Перевірте точки доступу та зауважте, що IP-адреси збігаються з Podʼами, створеними на першому кроці:

```shell
kubectl describe svc my-nginx
```

```none
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```

```shell
kubectl get endpointslices -l kubernetes.io/service-name=my-nginx
```

```none
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

Тепер ви повинні бути в змозі звертатися до nginx Service на `<CLUSTER-IP>:<PORT>` з будь-якого вузла у вашому кластері. Зауважте, що IP-адреса Service є повністю віртуальною, вона ніколи не передається мережею. Якщо вам цікаво, як це працює, ви можете прочитати більше про [сервіс-проксі](/docs/reference/networking/virtual-ips/).

## Доступ до Service {#accessing-the-service}

Kubernetes підтримує два основні режими знаходження Service — змінні середовища та DNS. Перший режим працює "з коробки", тоді як другий вимагає додаткового модуля [CoreDNS cluster addon](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns).

{{< note >}}
Якщо змінні середовища для сервісів не потрібні (через можливі конфлікти з очікуваннями програмам, занадто багато змінних для обробки, використання лише DNS тощо), ви можете вимкнути цей режим, встановивши прапорець `enableServiceLinks` у значення `false` в [pod spec](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core).
{{< /note >}}

### Змінні середовища {#environment-variables}

Коли Pod запускається на вузлі, kubelet додає набір змінних середовища для кожного активного Service. Це створює проблему з порядком. Щоб зрозуміти чому, перевірте середовище вашого працюючого Pod nginx (назва вашого Pod буде іншою):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```

```none
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

Зверніть увагу, що ваш Service не згадується. Це тому, що ви створили репліки перед створенням Service. Іншим недоліком цього є те, що планувальник може розмістити обидва Podʼи на одній машині, що призведе до припинення роботи всього Service, якщо він вийде з ладу. Ми можемо зробити це прям зараз, видаливши 2 Podʼи та очікуючи, поки Deployment їх відновить. Цього разу Service існує *до* реплік. Це забезпечить рівномірний розподіл ваших Podʼів на рівні планувальника (за умови рівної потужності всіх вузлів), а також правильні змінні середовища:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```

```none
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Ви можете помітити, що Podʼи мають різні імена, оскільки вони були видалені та відтворені.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```

```none
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

Kubernetes пропонує DNS-сервіс, який автоматично призначає DNS-імена іншим Serviceʼам. Ви можете перевірити, чи він працює у вашому кластері:

```shell
kubectl get services kube-dns --namespace=kube-system
```

```none
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

Далі в цьому розділі ми будемо вважати, що у вас є Service із довготривалою IP-адресою (my-nginx), і DNS-сервер, який присвоїв цій IP-адресі імʼя. Ми використовуємо надбудову CoreDNS (назва застосунку `kube-dns`), тому ви можете звертатися до Service з будь-якого Pod у вашому кластері, використовуючи стандартні методи (наприклад, `gethostbyname()`). Якщо CoreDNS не працює, ви можете увімкнути його, звірившись з [README CoreDNS](https://github.com/coredns/deployment/tree/master/kubernetes) або інформацією з [Встановлення CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns). Запустімо ще один застосунок curl для перевірки цього:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```

```none
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Потім натисніть Enter і запустіть `nslookup my-nginx`:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Захист Service {#securing-the-service}

До цього моменту ми отримували доступ до сервера nginx лише всередині кластеру. Перед тим як виставити Service в Інтернет, вам потрібно переконатися, що канал звʼязку захищений. Для цього вам знадобиться:

* Самопідписні сертифікати для https (якщо у вас немає ідентифікаційного сертифіката)
* Сервер nginx, налаштований для використання сертифікатів
* [Secret](/docs/concepts/configuration/secret/), що робить сертифікати доступними для Pod

Ви можете отримати все це з [прикладу nginx https](https://github.com/kubernetes/examples/tree/master/_archived/https-nginx/). Це вимагає встановлення інструментів go та make. Якщо ви не хочете їх встановлювати, тоді дотримуйтесь ручних кроків, описаних нижче. Коротко:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```

```none
secret/nginxsecret created
```

```shell
kubectl get secrets
```

```none
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

А також configmap:

```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

Ви можете знайти приклад `default.conf` у [репозиторії прикладів Kubernetes](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/).

```none
configmap/nginxconfigmap created
```

```shell
kubectl get configmaps
```

```none
NAME             DATA   AGE
nginxconfigmap   1      114s
```

Ви можете переглянути деталі ConfigMap `nginxconfigmap`, використовуючи наступну команду:

```shell
kubectl describe configmap nginxconfigmap
```

Вихід буде схожим на:

```console
Name:         nginxconfigmap
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
default.conf:
----
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        listen 443 ssl;

        root /usr/share/nginx/html;
        index index.html;

        server_name localhost;
        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        location / {
                try_files $uri $uri/ =404;
        }
}

BinaryData
====

Events:  <none>
```

Ось ручні кроки, яких слід дотримуватись у випадку, якщо у вас виникли проблеми з запуском make (наприклад, у Windows):

```shell
# Створіть пару відкритий/закритий ключ
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# Перетворіть ключі у кодування base64
cat /d/tmp/nginx.key | base64
cat /d/tmp/nginx.crt | base64
```

Скористайтесь виводом з попередньої команди для створення yaml-файлу. Закодовані у base64 значення мають бути в одному рядку.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
 # NOTE: Замініть наступні значення на власний сертифікат та ключ, закодовані у форматі base64.
  tls.crt: "REPLACE_WITH_BASE64_CERT"
  tls.key: "REPLACE_WITH_BASE64_KEY"
```

Тепер створіть Secret, застосувавши файл:

```shell
kubectl apply -f nginxsecret.yaml
kubectl get secrets
```

```none
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

Тепер змініть кількість реплік nginx для запуску сервера https використовуючи сертифікати з Secret та Service для експонування портів (80 та 443):

{{% code_sample file="service/networking/nginx-secure-app.yaml" %}}

Примітні моменти про маніфест nginx-secure-app:

* Він містить як специфікацію Deployment, так і Service в одному файлі.
* [nginx сервер](https://github.com/kubernetes/examples/blob/master/_archived/https-nginx/default.conf) обслуговує HTTP трафік на порту 80 та HTTPS трафік на порту 443, і Service nginx відкриває доступ до обох портів.
* Кожен контейнер має доступ до ключів через том, змонтовану в `/etc/nginx/ssl`. Це налаштовується *до* запуску nginx сервера.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

На цьому етапі ви можете отримати доступ до nginx сервера з будь-якого вузла.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

Зверніть увагу, що ми використовували параметр `-k` для curl на останньому етапі, тому що ми нічого не знаємо про Podʼи, що виконують nginx під час генерації сертифіката, тому ми повинні сказати curl ігнорувати невідповідність CName. Створюючи Service, ми повʼязали CName, який використовується в сертифікаті, з фактичним DNS-імʼям, що використовується Podʼами під час пошуку Service. Перевірмо це з Podʼа (для простоти використовується той же Secret, Podʼу потрібен лише nginx.crt для доступу до Service):

{{% code_sample file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```

```none
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```

```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## Експонування Service {#exposing-the-service}

Для деяких частин ваших застосунків ви можете захотіти експонувати Service на зовнішню IP-адресу. Kubernetes підтримує два способи: NodePorts та LoadBalancers. Service, створений у попередньому розділі, вже використовував `NodePort`, тому ваша репліка nginx HTTPS готова обслуговувати трафік з інтернету, якщо ваш вузол має публічну IP-адресу.

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```

```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

Тепер створімо Service знову, використовуючи хмарний балансувальник навантаження. Змініть `Type` Service `my-nginx` з `NodePort` на `LoadBalancer`:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```

```none
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149   xx.xxx.xxx.xxx     8080:30163/TCP        21s
```

```shell
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

IP-адреса в колонці `EXTERNAL-IP` доступна в інтернеті. `CLUSTER-IP` доступна тільки всередині вашого кластера/приватної хмарної мережі.

Зверніть увагу, що у AWS тип `LoadBalancer` створює ELB, який використовує (довге) імʼя хосту, а не IP. Воно занадто довге, щоб поміститися в стандартному виводі `kubectl get svc`, тому вам потрібно виконати `kubectl describe service my-nginx`, щоб побачити його. Ви побачите щось на кшталт:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Використання Service для доступу до застосунку в кластері](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Дізнайтеся більше про [Зʼєднання фронтенду з бекендом за допомогою Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Дізнайтеся більше про [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
