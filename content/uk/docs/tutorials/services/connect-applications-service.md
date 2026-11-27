---
title: Підключення застосунків за допомогою Service
content_type: tutorial
weight: 20
---

<!-- overview -->

## Модель Kubernetes для підключення контейнерів {#the-kubernetes-model-for-connecting-containers}

Тепер, коли у вас є реплікований застосунок, який постійно працює, ви можете відкрити до нього доступ у мережі.

Kubernetes передбачає, що Podʼи можуть взаємодіяти з іншими Podʼами, незалежно від того, на якому хості вони опиняються. Kubernetes надає кожному Podʼу власну IP-адресу, приватну в межах кластера, тому вам не потрібно явно створювати звʼязки між Podʼами або зіставляти порти контейнерів з портами хоста. Це означає, що всі контейнери всередині Podʼа можуть звертатися до портів один одного на localhost, а всі Podʼи в кластері можуть бачити один одного без NAT. У решті цього документа розглянуто, як запускати надійні сервіси на такій мережевій моделі.

У цьому посібнику використовується простий вебсервер nginx для демонстрації концепції.

<!-- body -->

## Відкриття доступу до Podʼів у кластері {#exposing-pods-to-the-cluster}

Ми робили це в попередньому прикладі, але зробімо це ще раз і зосередьмося на мережевому аспекті. Створіть Pod nginx і зверніть увагу, що він має специфікацію порту контейнера:

{{% code_sample file="service/networking/run-my-nginx.yaml" %}}

Це робить його доступним з будь-якого вузла у вашому кластері. Перевірте вузли, на яких працює Pod:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```

```
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

Ви повинні мати змогу підʼєднатися через SSH до будь-якого вузла у своєму кластері та за допомогою інструмента на кшталт `curl` надсилати запити на обидві IP-адреси. Зверніть увагу, що контейнери *не* використовують порт 80 на вузлі, і немає жодних спеціальних правил NAT для маршрутизації трафіку до Podʼа. Це означає, що ви можете запустити кілька Podʼів nginx на одному вузлі з однаковим `containerPort` і звертатися до них з будь-якого іншого Podʼа або вузла у вашому кластері за призначеною Podʼу IP-адресою. Якщо ви хочете перенаправити певний порт вузла-хоста на Podʼи, що стоять за ним, ви можете це зробити, але мережева модель передбачає, що потреби в цьому немає.

Якщо вам цікаво, ви можете прочитати більше про [мережеву модель Kubernetes](/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

## Створення Service {#creating-a-service}

Отже, у нас є Podʼи з nginx, що працюють у плоскому адресному просторі, спільному для всього кластера. Теоретично ви могли б звертатися до цих Podʼів напряму, але що станеться, коли вузол вийде з ладу? Podʼи зникнуть разом з ним, а ReplicaSet всередині Deployment створить нові, з іншими IP-адресами. Саме цю проблему вирішує Service.

Service Kubernetes — це абстракція, яка визначає логічний набір Podʼів, що працюють десь у вашому кластері й надають однакову функціональність. Під час створення кожному Service призначається унікальна IP-адреса (також відома як clusterIP). Ця адреса привʼязана до часу існування Service і не змінюється, поки Service існує. Podʼи можна налаштувати на звернення до Service, і звʼязок із Service автоматично балансуватиметься між Podʼами, що входять до складу Service.

Ви можете створити Service для ваших двох реплік nginx за допомогою `kubectl expose`:

```shell
kubectl expose deployment/my-nginx
```

```
service/my-nginx exposed
```

Це еквівалентно `kubectl apply -f` для такого YAML:

{{% code_sample file="service/networking/nginx-svc.yaml" %}}

Ця специфікація створить Service, який спрямовує трафік на TCP-порт 80 будь-якого Podʼа з міткою `run: my-nginx` і відкриває його на абстрактному порту Service (`targetPort` — це порт, на якому контейнер приймає трафік, `port` — це абстрактний порт Service, який може бути будь-яким портом, що його інші Podʼи використовують для доступу до Service). Перегляньте обʼєкт API [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core), щоб побачити список підтримуваних полів у визначенні Service. Перевірте ваш Service:

```shell
kubectl get svc my-nginx
```

```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

Як згадувалося раніше, за Service стоїть група Podʼів. Ці Podʼи доступні через {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}. Селектор Service оцінюється безперервно, і результати надсилаються (POST) до EndpointSlice, повʼязаного з Service за допомогою {{< glossary_tooltip text="міток" term_id="label" >}}. Коли Pod припиняє існування, його автоматично видаляють з EndpointSlice, які містять його як точку доступу. Нові Podʼи, що відповідають селектору Service, автоматично додаються до EndpointSlice цього Service. Перевірте точки доступу та зверніть увагу, що IP-адреси збігаються з адресами Podʼів, створених на першому кроці:

```shell
kubectl describe svc my-nginx
```

```
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

```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

Тепер ви можете за допомогою curl звертатися до Service nginx на `<CLUSTER-IP>:<PORT>` з будь-якого вузла у вашому кластері. Зверніть увагу, що IP-адреса Service повністю віртуальна, вона ніколи не передається мережею. Якщо вам цікаво, як це працює, ви можете прочитати більше про [проксі Service](/docs/reference/networking/virtual-ips/).

## Доступ до Service {#accessing-the-service}

Kubernetes підтримує два основні способи виявлення Service — змінні середовища та DNS. Перший працює «з коробки», а другий потребує [надбудови кластера CoreDNS](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns).

{{< alert color="info" title="Примітка" >}}
Якщо змінні середовища Service небажані (через можливі конфлікти з очікуваними змінними програм, забагато змінних для обробки, використання лише DNS тощо), ви можете вимкнути цей режим, встановивши прапорець `enableServiceLinks` у `false` у [специфікації Pod](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core).
{{< /alert >}}

### Змінні середовища {#environment-variables}

Коли Pod запускається на вузлі, kubelet додає набір змінних середовища для кожного активного Service. Це створює проблему з порядком. Щоб зрозуміти чому, перегляньте середовище ваших запущених Podʼів nginx (назва вашого Podʼа буде іншою):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```

```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

Зверніть увагу, що ваш Service не згадується. Це тому, що ви створили репліки до створення Service. Іншим недоліком цього є те, що планувальник може розмістити обидва Podʼи на одній машині, і тоді весь ваш Service перестане працювати, якщо ця машина вийде з ладу. Ми можемо зробити це правильно, видаливши 2 Podʼи й дочекавшись, поки Deployment створить їх знову. Цього разу Service існує *до* реплік. Це забезпечить розподіл ваших Podʼів для Service на рівні планувальника (за умови, що всі ваші вузли мають однакову потужність), а також правильні змінні середовища:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```

```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Ви можете помітити, що Podʼи мають інші імена, оскільки їх видалили та створили знову.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```

```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS {#dns}

Kubernetes пропонує Service надбудови кластера DNS, який автоматично призначає DNS-імена іншим Service. Ви можете перевірити, чи він працює у вашому кластері:

```shell
kubectl get services kube-dns --namespace=kube-system
```

```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

Далі в цьому розділі ми вважатимемо, що у вас є Service із довготривалою IP-адресою (my-nginx) і DNS-сервер, який призначив цій IP-адресі імʼя. Тут ми використовуємо надбудову кластера CoreDNS (назва застосунку `kube-dns`), тож ви можете звертатися до Service з будь-якого Podʼа у вашому кластері стандартними методами (наприклад, `gethostbyname()`). Якщо CoreDNS не працює, ви можете увімкнути його, звірившись з [README CoreDNS](https://github.com/coredns/deployment/tree/master/kubernetes) або [Встановленням CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns). Запустімо ще один застосунок curl, щоб перевірити це:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```

```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Потім натисніть Enter і виконайте `nslookup my-nginx`:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Захист Service {#securing-the-service}

Досі ми зверталися до сервера nginx лише зсередини кластера. Перш ніж відкрити доступ до Service з інтернету, переконайтеся, що канал звʼязку захищений. Для цього вам знадобляться:

* Самопідписані сертифікати для https (якщо у вас ще немає сертифіката, що засвідчує особу)
* Сервер nginx, налаштований для використання сертифікатів
* [Secret](/docs/concepts/configuration/secret/), що робить сертифікати доступними для Podʼів

Ви можете отримати все це з [прикладу nginx https](https://github.com/kubernetes/examples/tree/master/_archived/https-nginx/). Це вимагає встановлення інструментів go та make. Якщо ви не хочете їх встановлювати, тоді дотримуйтесь ручних кроків, описаних нижче. Коротко:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```

```
secret/nginxsecret created
```

```shell
kubectl get secrets
```

```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

А також ConfigMap:

```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

Ви можете знайти приклад `default.conf` у [репозиторії прикладів Kubernetes](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/).

```
configmap/nginxconfigmap created
```

```shell
kubectl get configmaps
```

```
NAME             DATA   AGE
nginxconfigmap   1      114s
```

Ви можете переглянути подробиці ConfigMap `nginxconfigmap` за допомогою цієї команди:

```shell
kubectl describe configmap  nginxconfigmap
```

Вивід подібний до цього:

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
openssl req -x509 -noenc -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# Перетворіть ключі у кодування base64
cat /d/tmp/nginx.crt | base64 | tr -d '\n'
cat /d/tmp/nginx.key | base64 | tr -d '\n'
```

Скористайтеся виводом попередніх команд, щоб створити YAML-файл, як показано нижче. Закодовані у base64 значення мають бути в одному рядку.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
 # NOTE: Замініть ці значення на власний сертифікат та ключ, закодовані у форматі base64.
  tls.crt: "REPLACE_WITH_BASE64_CERT" 
  tls.key: "REPLACE_WITH_BASE64_KEY"
```

Тепер створіть Secret, застосувавши файл:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```

```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

Тепер змініть ваші репліки nginx, щоб вони запускали сервер https із сертифікатом із Secret, а також Service, щоб відкрити доступ до обох портів (80 і 443):

{{% code_sample file="service/networking/nginx-secure-app.yaml" %}}

Примітні моменти про маніфест nginx-secure-app:

* Він містить як специфікацію Deployment, так і Service в одному файлі.
* [Сервер nginx](https://github.com/kubernetes/examples/blob/master/_archived/https-nginx/default.conf) обслуговує HTTP-трафік на порту 80 і HTTPS-трафік на порту 443, а Service nginx відкриває доступ до обох портів.
* Кожен контейнер має доступ до ключів через том, змонтований у `/etc/nginx/ssl`. Це налаштовується *до* запуску сервера nginx.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

На цьому етапі ви можете звертатися до сервера nginx з будь-якого вузла.

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

Зверніть увагу, що на останньому кроці ми передали curl параметр `-k`: під час генерування сертифіката ми нічого не знаємо про Podʼи, у яких працює nginx, тому маємо сказати curl ігнорувати невідповідність CName. Створивши Service, ми повʼязали CName, що використовується в сертифікаті, з фактичним DNS-імʼям, яке Podʼи використовують під час пошуку Service. Перевірмо це з Podʼа (для простоти повторно використовується той самий Secret, Podʼу потрібен лише nginx.crt для доступу до Service):

{{% code_sample file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```

```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```

```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## Відкриття доступу до Service {#exposing-the-service}

Для деяких частин ваших застосунків вам може знадобитися відкрити доступ до Service через зовнішню IP-адресу. Kubernetes підтримує два способи: NodePort і LoadBalancer. Service, створений у попередньому розділі, вже використовував `NodePort`, тому ваша репліка nginx HTTPS готова обслуговувати трафік з інтернету, якщо ваш вузол має публічну IP-адресу.

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

Тепер створімо Service заново, щоб він використовував хмарний балансувальник навантаження. Змініть `Type` Service `my-nginx` з `NodePort` на `LoadBalancer`:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```

```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149     xx.xxx.xxx.xxx     8080:30163/TCP        21s
```

```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

IP-адреса в стовпці `EXTERNAL-IP` доступна в публічному інтернеті. `CLUSTER-IP` доступна тільки всередині вашого кластера або приватної хмарної мережі.

Зверніть увагу, що в AWS тип `LoadBalancer` створює ELB, який використовує (довге) імʼя хоста, а не IP. Воно занадто довге, щоб поміститися у стандартний вивід `kubectl get svc`, тому вам потрібно виконати `kubectl describe service my-nginx`, щоб побачити його. Ви побачите щось на кшталт:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Використання Service для доступу до застосунку у кластері](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Дізнайтеся більше про [Зʼєднання фронтенду з бекендом за допомогою Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Дізнайтеся більше про [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
