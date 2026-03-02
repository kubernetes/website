---
content_type: task
title: Налагодження Service
weight: 20
---

<!-- overview -->

Досить часто виникає проблема в нових інсталяціях Kubernetes, коли Service не працює належним чином. Ви запустили свої Podʼи за допомогою Deployment (або іншого контролера робочих навантажень) і створили Service, але не отримуєте відповіді при спробі отримати до нього доступ. Цей документ, сподіваємось, допоможе вам зрозуміти, що йде не так.

<!-- body -->

## Виконання команд у Podʼі {#running-commands-in-a-Pod}

Для багатьох кроків ви захочете побачити, що бачить Pod, який працює в кластері. Найпростіший спосіб зробити це — запустити інтерактивний Pod busybox:

```shell
kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

{{< note >}}
Якщо ви не бачите командний рядок, спробуйте натиснути enter.
{{< /note >}}

Якщо у вас вже є Pod, який ви хочете використовувати для цього, ви можете виконати команду у ньому за допомогою:

```shell
kubectl exec <ІМ'Я-ПОДА> -c <ІМ'Я-КОНТЕЙНЕРА> -- <КОМАНДА>
```

## Підготовка {#setup}

Для цілей цього огляду запустімо кілька Podʼів. Оскільки ви, швидше за все, налагоджуєте власний Service, ви можете використати свої власні дані, або ви можете слідувати разом із нами та отримати інші дані.

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```

```none
deployment.apps/hostnames created
```

Команди `kubectl` будуть виводити тип та імʼя створеного або зміненого ресурсу, які потім можна використовувати в наступних командах.

Масштабуймо Deployment до 3 реплік.

```shell
kubectl scale deployment hostnames --replicas=3
```

```none
deployment.apps/hostnames scaled
```

Зверніть увагу, що це так само, якби ви запустили Deployment за допомогою наступного YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: registry.k8s.io/serve_hostname
```

За допомогою `kubectl create deployment` в значення мітки "app" автоматично встановлюється імʼя Deployment.

Ви можете підтвердити, що ваші Podʼи працюють:

```shell
kubectl get pods -l app=hostnames
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

Ви також можете підтвердити, що ваші Podʼи обслуговуються. Ви можете отримати список IP-адрес Podʼів та протестувати їх безпосередньо.

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```

```none
10.244.0.5
10.244.0.6
10.244.0.7
```

Приклад контейнера, використаного для цього огляду, обслуговує своє власне імʼя хосту через HTTP на порті 9376, але якщо ви налагоджуєте свій власний застосунок, вам потрібно буде використовувати номер порту, на якому слухають ваші Podʼи.

З середини Podʼа:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Ви маєте отримати щось на зразок:

```none
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Якщо ви не отримуєте очікувані відповіді на цьому етапі, ваші Pod\и можуть бути несправними або можуть не прослуховувати порт, який ви вважаєте. Можливо, `kubectl logs` буде корисним для перегляду того, що відбувається, або, можливо, вам потрібно буде виконати `kubectl exec` безпосередньо у вашому Podʼі та робити налагодження звідти.

Якщо все пройшло згідно з планом до цього моменту, ви можете почати розслідування того, чому ваш Service не працює.

## Чи Service існує? {#does-the-service-exist}

Уважний читач може зауважити, що ви фактично ще не створили Service — це навмисно. Це крок, який іноді забувають, і це перше, що треба перевірити.

Що станеться, якщо ви спробуєте отримати доступ до Service, що не існує? Якщо у вас є інший Pod, який використовує цей Service за іменем, ви отримаєте щось на зразок:

```shell
wget -O- hostnames
```

```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

Перше, що треба перевірити — це чи насправді існує цей Service:

```shell
kubectl get svc hostnames
```

```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

Створімо Service. Як і раніше, це для цього огляду — ви можете використовувати свої власні дані Service тут.

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```

```none
service/hostnames exposed
```

І перевіримо:

```shell
kubectl get svc hostnames
```

```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

Тепер ви знаєте, що Service існує.

Як і раніше, це те саме, якби ви запустили Service за допомогою YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

Щоб підкреслити повний спектр налаштувань, Service, який ви створили тут, використовує інший номер порту, ніж Podʼи. Для багатьох реальних Serviceʼів ці значення можуть бути однаковими.

## Чи впливають будь-які правила Network Policy Ingress на цільові Podʼи? {#any-network-policy-ingress-rules-affecting-the-target-pods}

Якщо ви розгорнули будь-які правила Network Policy Ingress, які можуть вплинути на вхідний трафік до `hostnames-*` Pod, їх потрібно переглянути.

Будь ласка, зверніться до [Мережевих політик](/docs/concepts/services-networking/network-policies/) для отримання додаткових відомостей.

## Чи працює Service за DNS-іменем? {#does-the-service-work-by-dns-name}

Один із найпоширеніших способів, яким клієнти використовують Service, — це через DNS-імʼя.

З Podʼа в тому ж Namespace:

```shell
nslookup hostnames
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Якщо це не вдається, можливо, ваш Pod і Service знаходяться в різних Namespace, спробуйте використати імʼя з Namespace (знову ж таки, зсередини Podʼа):

```shell
nslookup hostnames.default
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Якщо це працює, вам потрібно налаштувати свій застосунок на використання імені, яке входить у Namespace, або запустіть ваш застосунок та Service в тому ж Namespace. Якщо це все ще не працює, спробуйте повне імʼя:

```shell
nslookup hostnames.default.svc.cluster.local
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Зверніть увагу на суфікс тут: "default.svc.cluster.local". "default" — це Namespace, в якому ви працюєте. "svc" позначає, що це Service. "cluster.local" — це ваш домен кластера, який МОЖЕ відрізнятися у вашому власному кластері.

Ви також можете спробувати це з вузла в кластері:

{{< note >}}
10.0.0.10 - це IP-адреса Service DNS кластера, ваша може бути іншою.
{{< /note >}}

```shell
nslookup hostnames.default.svc.cluster.local 10.0.0.10
```

```none
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

Якщо ви можете зробити пошук повного імені, але не відноснлшл, вам потрібно перевірити, чи правильний ваш файл `/etc/resolv.conf` в Podʼі. Зсередини Podʼа:

```shell
cat /etc/resolv.conf
```

Ви повинні побачити щось на зразок:

```none
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

Рядок `nameserver` повинен вказувати на Service DNS вашого кластера. Це передається в `kubelet` з прапорцем `--cluster-dns`.

Рядок `search` повинен включати відповідний суфікс, щоб ви змогли знайти імʼя Serviceʼу. У цьому випадку він шукає Serviceʼи в локальному Namespace ("default.svc.cluster.local"), Serviceʼи у всіх Namespace ("svc.cluster.local"), і наостанок для імен в кластері ("cluster.local"). Залежно від вашого власного налаштування, у вас можуть бути додаткові записи після цього (до 6 загалом). Суфікс кластера передається в `kubelet` з прапорцем `--cluster-domain`. У цьому документі передбачається, що суфікс кластера — "cluster.local". У ваших власних кластерах це може бути налаштовано по-іншому, у такому випадку вам слід змінити це в усіх попередніх командах.

### Чи працює будь-який Service за допомогою DNS-імені? {#does-any-service-exist-in-dns}

Якщо вищезазначене все ще не працює, DNS-запити не працюють для вашого Service. Ви можете зробити крок назад і побачити, що ще не працює. Service майстра Kubernetes повинен завжди працювати. Зсередини Podʼа:

```shell
nslookup kubernetes.default
```

```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

Якщо це не вдається, будь ласка, перегляньте розділ [kube-proxy](#is-the-kube-proxy-working) цього документа, або навіть поверніться до початку цього документа і почніть знову, але замість налагодження вашого власного Service, спробуйте Service DNS.

## Чи працює Service за IP? {#does-the-service-work-by-ip}

Припускаючи, що ви підтвердили, що DNS працює, наступне, що варто перевірити, — це чи ваш Service працює за його IP-адресою. З Podʼа в вашому кластері, зверніться до IP-адреси Service (з вищезазначеного виводу `kubectl get`).

```shell
for i in $(seq 1 3); do
    wget -qO- 10.0.1.175:80
done
```

Це має видати щось подібне:

```none
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Якщо ваш Service працює, ви повинні отримати правильні відповіді. Якщо ні, існує кілька можливих причин, через які це може не працювати. Дивіться далі.

## Чи правильно визначений Service? {#is-the-service-defined-correctly}

Це може звучати дивно, але ви справді повинні подеколи перевірити, що ваш Service вірний і відповідає порту вашого Podʼа. Перегляньте свій Service і перевірте його:

```shell
kubectl get service hostnames -o json
```

```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

* Чи вказано порт Serviceʼу, який ви намагаєтеся отримати доступ в `spec.ports[]`?
* Чи правильний `targetPort` для ваших Podʼів (деякі Podʼи використовують інший порт, ніж Service)?
* Якщо ви мали на увазі використання числового порту, це число (9376) чи рядок "9376"?
* Якщо ви мали на увазі використання порту за іменем, чи ваші Podʼи використовують порт з тим самим імʼям?
* Чи правильний протокол порту для ваших Podʼів?

## Чи має Service будь-які EndpointSlices? {#does-the-service-have-any-endpointslices}

Якщо ви дійшли до цього пункту, ви підтвердили, що ваш Service правильно визначений і його можна знайти через DNS. Тепер перевірмо, що Podʼи, які ви запустили, фактично вибираються Serviceʼом.

Раніше ви бачили, що Podʼи працюють. Ви можете перевірити це ще раз:

```shell
kubectl get pods -l app=hostnames
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          1h
hostnames-632524106-ly40y   1/1       Running   0          1h
hostnames-632524106-tlaok   1/1       Running   0          1h
```

Аргумент `-l app=hostnames` — це селектор міток, налаштований у Service.

Стовпець "AGE" вказує, що ці Podʼи працюють добре і не мали збоїв.

Стовпець "RESTARTS" вказує, що ці Podʼи не часто мають збої або не перезавантажуються. Часті перезапуски можуть призвести до періодичних проблем зі зʼєднанням. Якщо кількість перезапусків висока, прочитайте більше про те, як [налагоджувати Podʼи](/docs/tasks/debug/debug-application/debug-pods).

У межах системи Kubernetes є цикл керування, який оцінює селектор кожного Service і зберігає результати до одного чи більше обʼєктів EndpointSlice.

```shell
kubectl get endpointslices -l k8s.io/service-name=hostnames

NAME              ADDRESSTYPE   PORTS   ENDPOINTS
hostnames-ytpni   IPv4          9376    10.244.0.5,10.244.0.6,10.244.0.7
```

Це підтверджує, що контролер EndpointSlice знайшов правильні Podʼи для вашого Service. Якщо стовпець `ENDPOINTS` має значення `<none>`, вам слід перевірити, що поле `spec.selector` вашого Service дійсно вибирає значення `metadata.labels` у ваших Podʼах. Частою помилкою є наявність хибодруку або іншої помилки, наприклад, Service вибирає `app=hostnames`, але Deployment вказує `run=hostnames`, як у версіях до 1.18, де команда `kubectl run` також могла бути використана для створення Deployment.

## Чи працюють Podʼи? {#are-the-pods-working}

На цьому етапі ви знаєте, що ваш Service існує і вибрав ваші Podʼи. На початку цього кроку ви перевірили самі Podʼи. Давайте ще раз перевіримо, що Podʼи дійсно працюють — ви можете оминути механізм Service і звернутися безпосередньо до Podʼів, які вказані в Endpoints вище.

{{< note >}}
Ці команди використовують порт Podʼа (9376), а не порт Service (80).
{{< /note >}}

З середини Podʼа:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Це повинно показати щось на зразок:

```none
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Ви очікуєте, що кожний Pod в списку endpoints поверне свій власний hostname. Якщо це не те, що відбувається (або будь-яка інша правильна поведінка для ваших власних Podʼів), вам слід дослідити, що відбувається там.

## Чи працює kube-proxy? {#is-the-kube-proxy-working}

Якщо ви дісталися до цього моменту, ваш Service працює, має EndpointSlices, і ваші Podʼи фактично обслуговують запити. На цьому етапі увесь механізм проксі Service під підозрою. Підтвердьмо це крок за кроком.

Стандартна реалізація Service, і та, яка використовується в більшості кластерів, — це kube-proxy. Це програма, яка працює на кожному вузлі і конфігурує один з невеликого набору механізмів для надання абстракції Service. Якщо ваш кластер не використовує kube-proxy, наступні розділи не застосовуються, і вам доведеться дослідити будь-яку реалізацію Service, яку ви використовуєте.

### Чи запущено kube-proxy? {#is-kube-proxy-running}

Підтвердіть, що `kube-proxy` працює на ваших Вузлах. Запустіть команду безпосередньо на Вузлі, і ви повинні побачити щось на зразок такого:

```shell
ps auxw | grep kube-proxy
```

```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

Далі переконайтесь, що він не має явних проблем, таких як неможливість звʼязатися з майстром. Для цього вам доведеться переглянути логи. Доступ до логів залежить від вашої ОС Вузла. На деяких ОС це файл, наприклад /var/log/kube-proxy.log, тоді як на інших ОС використовується `journalctl` для доступу до логів. Ви повинні побачити щось на зразок:

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

Якщо ви бачите повідомлення про помилки щодо неможливості звʼязатися з майстром, вам слід перевірити конфігурацію і кроки інсталяції вашого Вузла.

Kube-proxy може працювати в одному з декількох режимів. У вищенаведеному журналі рядок `Using iptables Proxier` вказує на те, що kube-proxy працює в режимі "iptables". Ще один поширений режим — "ipvs".

#### Режим iptables {#iptables-mode}

У режимі "iptables" ви повинні побачити щось на зразок наступного на Вузлі:

```shell
iptables-save | grep hostnames
```

```none
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

Для кожного порту кожного Service повинно бути 1 правило у `KUBE-SERVICES` і один ланцюжок `KUBE-SVC-<хеш>`. Для кожного endpoint Podʼа повинна бути невелика кількість правил у цьому `KUBE-SVC-<хеш>` і один ланцюжок `KUBE-SEP-<хеш>` з невеликою кількістю правил. Точні правила будуть варіюватися залежно від вашої конфігурації (включаючи порти вузлів та балансувальники навантаження).

#### Режим IPVS {#ipvs-mode}

У режимі "ipvs" ви повинні побачити щось на зразок наступного на Вузлі:

```shell
ipvsadm -ln
```

```none
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

Для кожного порту кожного Service, плюс будь-які NodePorts, зовнішні IP-адреси та IP-адреси балансувальника навантаження, kube-proxy створить віртуальний сервер. Для кожного endpoint Podʼа він створить відповідні реальні сервери. У цьому прикладі служба hostnames(`10.0.1.175:80`) має 3 endpoint (`10.244.0.5:9376`, `10.244.0.6:9376`, `10.244.0.7:9376`).

### Чи kube-proxy керує трафіком? {#is-kube-proxy-proxying}

Якщо ви бачите один із вищезазначених випадків, спробуйте ще раз отримати доступ до вашого Service за допомогою IP з одного з ваших Вузлів:

```shell
curl 10.0.1.175:80
```

```none
hostnames-632524106-bbpiw
```

Якщо це все ще не вдається, перегляньте логи `kube-proxy` на наявність конкретних рядків, подібних до:

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

Якщо ви не бачите цього, спробуйте перезапустити `kube-proxy` з прапорцем `-v`, встановленим на 4, і потім знову перегляньте логи.

### Крайній випадок: Pod не може звернутися до себе за допомогою IP-адреси Service {#a-pod-fails-to-reach-itself-via-the-service-ip}

Це може здатися малоймовірним, але це може трапитися і має працювати.

Це може статися, коли мережа не належним чином налаштована для "зачісування" трафіку, зазвичай коли `kube-proxy` працює в режимі `iptables`, а Podʼи підключені за допомогою мережі bridge. `Kubelet` надає [прапорець](/docs/reference/command-line-tools-reference/kubelet/) `hairpin-mode`, який дозволяє точкам доступу Service балансувати навантаження поверненням до себе, якщо вони намагаються отримати доступ до своєї власної VIP-адреси Service. Прапорець `hairpin-mode` має бути встановлено на значення `hairpin-veth` або `promiscuous-bridge`.

Загальні кроки для розвʼязання цього випадку мають бути такими:

* Підтвердіть, що `hairpin-mode` встановлено у значення `hairpin-veth` або `promiscuous-bridge`. Можливий вигляд нижченаведеного. У наступному прикладі `hairpin-mode` встановлено на `promiscuous-bridge`.

```shell
ps auxw | grep kubelet
```

```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* Підтвердіть поточний `hairpin-mode`. Для цього вам потрібно переглянути логи `kubelet`. Доступ до логів залежить від вашої операційної системи. На деяких ОС це файл, наприклад /var/log/kubelet.log, тоді як на інших ОС використовується `journalctl` для доступу до логів. Зверніть увагу, що поточний режим hairpin може не відповідати прапорцю `--hairpin-mode` через сумісність. Перевірте, чи є будь-які рядки в лозі з ключовим словом `hairpin` в kubelet.log. Повинні бути рядки в лозі, які показують поточний режим hairpin, схожі на наступне:

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* Якщо поточний режим hairpin — `hairpin-veth`, переконайтеся, що `Kubelet` має дозвіл на роботу в `/sys` на вузлі. Якщо все працює належним чином, ви побачите щось на зразок:

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
```

```none
1
1
1
1
```

* Якщо поточний режим hairpin — `promiscuous-bridge`, переконайтеся, що `Kubelet` має дозвіл на маніпулювання bridge в Linux на вузлі. Якщо bridge `cbr0` використовується і налаштований належним чином, ви побачите:

```shell
ifconfig cbr0 |grep PROMISC
```

```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* Зверніться за допомогою, якщо жоден з вищезазначених методів не працює.

## Пошук допомоги {#seek-help}

Якщо ви дійшли до цього моменту, відбувається щось дуже дивне. Ваш Service працює, має EndpointSlices, і ваші Podʼи насправді обслуговують запити. DNS працює, і `kube-proxy` схоже не діє неправильно. Проте ваш Service не працює. Будь ласка, дайте нам знати, що відбувається, щоб ми могли допомогти вам розслідувати цю проблему!

Звертайтеся до нас у [Slack](https://slack.k8s.io/) або на [Форум](https://discuss.kubernetes.io) чи у [GitHub](https://github.com/kubernetes/kubernetes).

## {{% heading "whatsnext" %}}

Відвідайте [документ про загальні відомості про усунення несправностей](/docs/tasks/debug/) для отримання додаткової інформації.
