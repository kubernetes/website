---
content_type: task
title: Налагодження Service
weight: 20
---

<!-- overview -->

Досить часто в нових інсталяціях Kubernetes виникає проблема, коли Service не працює належним чином. Ви запустили свої Podʼи за допомогою Deployment (або іншого контролера робочих навантажень) і створили Service, але під час спроби звернутися до нього не отримуєте відповіді. Сподіваємося, цей документ допоможе вам зʼясувати, що пішло не так.

<!-- body -->

## Виконання команд у Podʼі {#running-commands-in-a-pod}

Для багатьох кроків ви захочете побачити, що бачить Pod, який працює в кластері. Найпростіший спосіб зробити це — запустити інтерактивний Pod busybox:

```none
kubectl run -it --rm --restart=Never busybox --image=registry.k8s.io/busybox:1.27.2 sh
```

{{< note >}}
Якщо ви не бачите командний рядок, спробуйте натиснути enter.
{{< /note >}}

Якщо у вас уже є запущений Pod, який ви хочете використати, можна виконати команду в ньому так:

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## Підготовка {#setup}

Для цього покрокового розбору запустімо кілька Podʼів. Оскільки ви, найімовірніше, налагоджуєте власний Service, можете підставити свої дані або виконувати кроки разом з нами, щоб отримати ще одну точку для порівняння.

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```

```none
deployment.apps/hostnames created
```

Команди `kubectl` виводять тип та імʼя створеного або зміненого ресурсу, які потім можна використовувати в подальших командах.

Масштабуймо Deployment до 3 реплік.

```shell
kubectl scale deployment hostnames --replicas=3
```

```none
deployment.apps/hostnames scaled
```

Зверніть увагу, що це те саме, якби ви запустили Deployment з таким YAML:

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

`kubectl create deployment` автоматично встановлює мітці "app" значення імені Deployment.

Можна переконатися, що ваші Podʼи працюють:

```shell
kubectl get pods -l app=hostnames
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

Також можна переконатися, що ваші Podʼи обслуговують запити. Отримайте список IP-адрес Podʼів і перевірте їх безпосередньо.

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```

```none
10.244.0.5
10.244.0.6
10.244.0.7
```

Контейнер з прикладу, використаний у цьому розборі, повертає власне імʼя хоста через HTTP на порту 9376, але якщо ви налагоджуєте власний застосунок, використовуйте номер порту, який слухають ваші Podʼи.

Зсередини Podʼа:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Ви маєте отримати щось на зразок:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Якщо на цьому етапі ви не отримуєте очікуваних відповідей, ваші Podʼи можуть бути несправними або не слухати порт, на який ви розраховуєте. Щоб побачити, що відбувається, може стати в пригоді `kubectl logs`, або, можливо, вам потрібно виконати `kubectl exec` безпосередньо у ваших Podʼах і налагоджувати звідти.

Якщо досі все йшло за планом, можна почати зʼясовувати, чому ваш Service не працює.

## Чи існує Service? {#does-the-service-exist}

Уважний читач може зауважити, що ви фактично ще не створили Service — це навмисно. Це крок, який іноді забувають, і це перше, що треба перевірити.

Що станеться, якщо ви спробуєте отримати доступ до Service, що не існує? Якщо у вас є інший Pod, який використовує цей Service за іменем, ви отримаєте щось на зразок:

```shell
wget -O- hostnames
```

```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

Перше, що треба перевірити, — чи справді існує цей Service:

```shell
kubectl get svc hostnames
```

```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

Створімо Service. Як і раніше, це для нашого розбору — тут ви можете використати дані свого Service.

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```

```none
service/hostnames exposed
```

І перегляньмо його:

```shell
kubectl get svc hostnames
```

```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

Тепер ви знаєте, що Service існує.

Як і раніше, це те саме, якби ви створили Service з таким YAML:

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

Щоб підкреслити повний спектр налаштувань, Service, який ви створили тут, використовує інший номер порту, ніж Podʼи. Для багатьох реальних Service ці значення можуть бути однаковими.

## Чи впливають будь-які правила Network Policy Ingress на цільові Podʼи? {#any-network-policy-ingress-rules-affecting-the-target-pods}

Якщо ви розгорнули будь-які правила Network Policy Ingress, які можуть впливати на вхідний трафік до Podʼів `hostnames-*`, їх потрібно переглянути.

Докладніше дивіться [Мережеві політики](/docs/concepts/services-networking/network-policies/).

## Чи працює Service за DNS-іменем? {#does-the-service-work-by-dns-name}

Один із найпоширеніших способів, яким клієнти користуються Service, — через DNS-імʼя.

З Podʼа в тому самому просторі імен:

```shell
nslookup hostnames
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Якщо це не вдається, можливо, ваш Pod і Service перебувають у різних просторах імен; спробуйте імʼя з простором імен (знову ж таки, зсередини Podʼа):

```shell
nslookup hostnames.default
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Якщо це працює, вам потрібно змінити застосунок так, щоб він використовував імʼя з іншого простору імен, або запустити застосунок і Service в одному просторі імен. Якщо це все ще не працює, спробуйте повне доменне імʼя:

```shell
nslookup hostnames.default.svc.cluster.local
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Зверніть увагу на суфікс: "default.svc.cluster.local". "default" — це простір імен, у якому ви працюєте. "svc" позначає, що це Service. "cluster.local" — це домен вашого кластера, який МОЖЕ бути іншим у вашому кластері.

Ви також можете спробувати це з вузла в кластері:

{{< note >}}
10.0.0.10 — це IP-адреса Service DNS кластера, у вас вона може бути іншою.
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

Якщо пошук за повним доменним імʼям працює, а за відносним — ні, перевірте, чи правильний файл `/etc/resolv.conf` у вашому Podʼі. Зсередини Podʼа:

```shell
cat /etc/resolv.conf
```

Ви повинні побачити щось на зразок:

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

Рядок `nameserver` має вказувати на Service DNS вашого кластера. Його передають у `kubelet` прапорцем `--cluster-dns`.

Рядок `search` має містити відповідний суфікс, щоб ви могли знайти імʼя Service. У цьому випадку пошук іде серед Service у локальному просторі імен ("default.svc.cluster.local"), Service в усіх просторах імен ("svc.cluster.local") і, нарешті, серед імен у кластері ("cluster.local"). Залежно від вашого встановлення після цього можуть бути додаткові записи (загалом до 6). Суфікс кластера передається в `kubelet` прапорцем `--cluster-domain`. У цьому документі вважається, що суфікс кластера — "cluster.local". Ваші кластери можуть бути налаштовані інакше; у такому разі змініть його в усіх попередніх командах.

Рядок `options` має встановлювати `ndots` достатньо високим, щоб ваша клієнтська бібліотека DNS взагалі враховувала шляхи пошуку. Kubernetes стандартно встановлює значення 5, чого достатньо для всіх DNS-імен, які він генерує.

### Чи працює будь-який Service за DNS-іменем? {#does-any-service-exist-in-dns}

Якщо наведене вище досі не працює, DNS-запити для вашого Service не працюють. Можна зробити крок назад і подивитися, що ще не працює. Service майстра Kubernetes має працювати завжди. Зсередини Podʼа:

```shell
nslookup kubernetes.default
```

```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

Якщо це не вдається, перегляньте розділ [kube-proxy](#is-the-kube-proxy-working) цього документа або навіть поверніться на початок документа й почніть знову, але замість власного Service налагоджуйте Service DNS.

## Чи працює Service за IP? {#does-the-service-work-by-ip}

Якщо ви переконалися, що DNS працює, далі слід перевірити, чи працює ваш Service за IP-адресою. З Podʼа у вашому кластері зверніться до IP-адреси Service (з виводу `kubectl get` вище).

```shell
for i in $(seq 1 3); do
    wget -qO- 10.0.1.175:80
done
```

Це має видати щось подібне:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Якщо ваш Service працює, ви маєте отримати правильні відповіді. Якщо ні, щось може бути не так з кількох причин. Читайте далі.

## Чи правильно визначено Service? {#is-the-service-defined-correctly}

Це може звучати безглуздо, але вам справді варто двічі й тричі перевірити, що ваш Service правильний і відповідає порту вашого Podʼа. Перегляньте свій Service і перевірте його:

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

* Чи вказано в `spec.ports[]` порт Service, до якого ви намагаєтеся звернутися?
* Чи правильний `targetPort` для ваших Podʼів (деякі Podʼи використовують інший порт, ніж Service)?
* Якщо ви мали на увазі використання числового порту, це число (9376) чи рядок "9376"?
* Якщо ви хотіли використати іменований порт, чи відкривають ваші Podʼи порт з таким самим імʼям?
* Чи правильний `protocol` порту для ваших Podʼів?

## Чи має Service будь-які EndpointSlices? {#does-the-service-have-any-endpointslices}

Якщо ви дійшли сюди, ви вже переконалися, що ваш Service правильно визначено і DNS його розвʼязує. Тепер перевірмо, що Service справді вибирає запущені вами Podʼи.

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

Стовпець "AGE" показує, що цим Podʼам приблизно година, тобто вони працюють нормально й не завершуються аварійно.

Стовпець "RESTARTS" показує, що ці Podʼи не завершуються аварійно часто й не перезапускаються. Часті перезапуски можуть спричиняти періодичні проблеми зі зʼєднанням. Якщо кількість перезапусків висока, дізнайтеся більше про те, як [налагоджувати Podʼи](/docs/tasks/debug/debug-application/debug-pods).

У системі Kubernetes є цикл керування, який обчислює селектор кожного Service і зберігає результати в одному або кількох обʼєктах EndpointSlice.

```shell
kubectl get endpointslices -l kubernetes.io/service-name=hostnames

NAME              ADDRESSTYPE   PORTS   ENDPOINTS
hostnames-ytpni   IPv4          9376    10.244.0.5,10.244.0.6,10.244.0.7
```

Це підтверджує, що контролер EndpointSlice знайшов правильні Podʼи для вашого Service. Якщо стовпець `ENDPOINTS` має значення `<none>`, перевірте, чи поле `spec.selector` вашого Service справді вибирає значення `metadata.labels` ваших Podʼів. Поширена помилка — описка чи інша неточність, наприклад, Service вибирає `app=hostnames`, а Deployment вказує `run=hostnames`, як у версіях до 1.18, де команду `kubectl run` також можна було використовувати для створення Deployment.

## Чи працюють Podʼи? {#are-the-pods-working}

На цьому етапі ви знаєте, що ваш Service існує і вибрав ваші Podʼи. На початку цього розбору ви перевірили самі Podʼи. Перевірмо ще раз, що Podʼи справді працюють: можна оминути механізм Service і звернутися безпосередньо до Podʼів, перелічених в Endpoints вище.

{{< note >}}
Ці команди використовують порт Podʼа (9376), а не порт Service (80).
{{< /note >}}

Зсередини Podʼа:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Це повинно показати щось на зразок:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Очікується, що кожен Pod у списку точок доступу поверне власне імʼя хоста. Якщо цього не відбувається (або не відбувається того, що є правильною поведінкою для ваших Podʼів), слід дослідити, що там відбувається.

## Чи працює kube-proxy? {#is-the-kube-proxy-working}

Якщо ви дісталися сюди, ваш Service працює, має EndpointSlice, а ваші Podʼи справді обслуговують запити. На цьому етапі під підозрою весь механізм проксіювання Service. Перевірмо його крок за кроком.

Стандартна реалізація Service, яку використовують у більшості кластерів, — це kube-proxy. Це програма, яка працює на кожному вузлі й налаштовує один з невеликого набору механізмів для забезпечення абстракції Service. Якщо ваш кластер не використовує kube-proxy, наведені нижче розділи до нього не застосовні, і вам доведеться дослідити ту реалізацію Service, яку ви використовуєте.

### Чи запущено kube-proxy? {#is-kube-proxy-running}

Переконайтеся, що `kube-proxy` працює на ваших вузлах. Виконавши команду безпосередньо на вузлі, ви маєте отримати щось подібне:

```shell
ps auxw | grep kube-proxy
```

```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

Далі переконайтеся, що в нього немає очевидних збоїв, наприклад, під час звʼязку з майстром. Для цього потрібно переглянути логи. Доступ до логів залежить від ОС вашого вузла. В одних ОС це файл, наприклад /var/log/kube-proxy.log, а в інших для доступу до логів використовують `journalctl`. Ви маєте побачити щось подібне:

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

Якщо ви бачите повідомлення про помилки звʼязку з майстром, ще раз перевірте конфігурацію вузла та кроки встановлення.

kube-proxy може працювати в одному з кількох режимів. У наведеному вище фрагменті логу рядок `Using iptables Proxier` вказує, що kube-proxy працює в режимі "iptables". Інший найпоширеніший режим — "ipvs".

#### Режим iptables {#iptables-mode}

У режимі "iptables" на вузлі ви маєте побачити щось подібне:

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

Для кожного порту кожного Service має бути 1 правило в `KUBE-SERVICES` і один ланцюжок `KUBE-SVC-<hash>`. Для кожної точки доступу Podʼа має бути невелика кількість правил у цьому `KUBE-SVC-<hash>` і один ланцюжок `KUBE-SEP-<hash>` з невеликою кількістю правил. Точні правила залежать від вашої конфігурації (зокрема від node-port і балансувальників навантаження).

#### Режим IPVS {#ipvs-mode}

У режимі "ipvs" на вузлі ви маєте побачити щось подібне:

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

Для кожного порту кожного Service, а також для всіх NodePort, зовнішніх IP-адрес і IP-адрес балансувальників навантаження kube-proxy створює віртуальний сервер. Для кожної точки доступу Podʼа він створює відповідні реальні сервери. У цьому прикладі Service hostnames(`10.0.1.175:80`) має 3 точки доступу (`10.244.0.5:9376`, `10.244.0.6:9376`, `10.244.0.7:9376`).

### Чи проксіює kube-proxy трафік? {#is-kube-proxy-proxying}

Якщо ви бачите один із наведених вище випадків, спробуйте ще раз звернутися до свого Service за IP з одного з ваших вузлів:

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

Якщо ви їх не бачите, спробуйте перезапустити `kube-proxy` з прапорцем `-v`, встановленим у 4, і знову перегляньте логи.

### Граничний випадок: Pod не може звернутися до себе через IP-адресу Service {#a-pod-fails-to-reach-itself-via-the-service-ip}

Це може здатися малоймовірним, але таке трапляється, і це має працювати.

Це може статися, коли мережу не налаштовано належним чином для трафіку "hairpin", зазвичай коли `kube-proxy` працює в режимі `iptables`, а Podʼи зʼєднано мережею bridge. `Kubelet` надає [прапорець](/docs/reference/command-line-tools-reference/kubelet/) `hairpin-mode`, який дозволяє точкам доступу Service балансувати навантаження назад на себе, якщо вони звертаються до VIP власного Service. Прапорець `hairpin-mode` має мати значення `hairpin-veth` або `promiscuous-bridge`.

Звичайні кроки для усунення цієї несправності такі:

* Переконайтеся, що `hairpin-mode` має значення `hairpin-veth` або `promiscuous-bridge`. Ви маєте побачити щось подібне до наведеного нижче. У цьому прикладі `hairpin-mode` має значення `promiscuous-bridge`.

```shell
ps auxw | grep kubelet
```

```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* Перевірте фактичний `hairpin-mode`. Для цього потрібно переглянути лог kubelet. Доступ до логів залежить від ОС вашого вузла. В одних ОС це файл, наприклад /var/log/kubelet.log, а в інших для доступу до логів використовують `journalctl`. Зверніть увагу, що через сумісність фактичний режим hairpin може не збігатися з прапорцем `--hairpin-mode`. Перевірте, чи є в kubelet.log рядки з ключовим словом `hairpin`. Мають бути рядки логу, що показують фактичний режим hairpin, приблизно такі:

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* Якщо фактичний режим hairpin — `hairpin-veth`, переконайтеся, що `Kubelet` має дозвіл працювати в `/sys` на вузлі. Якщо все працює належним чином, ви побачите щось подібне:

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
```

```none
1
1
1
1
```

* Якщо фактичний режим hairpin — `promiscuous-bridge`, переконайтеся, що `Kubelet` має дозвіл керувати Linux bridge на вузлі. Якщо використовується bridge `cbr0` і його налаштовано правильно, ви побачите:

```shell
ifconfig cbr0 |grep PROMISC
```

```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* Зверніться по допомогу, якщо жоден із наведених кроків не допоміг.

## Пошук допомоги {#seek-help}

Якщо ви дійшли сюди, відбувається щось дуже дивне. Ваш Service працює, має EndpointSlice, а ваші Podʼи справді обслуговують запити. DNS працює, і `kube-proxy`, схоже, поводиться правильно. Проте ваш Service не працює. Повідомте нам, що відбувається, щоб ми могли допомогти розібратися!

Звертайтеся до нас у [Slack](https://slack.k8s.io/), на [форумі](https://discuss.kubernetes.io) або в [GitHub](https://github.com/kubernetes/kubernetes).

## {{% heading "whatsnext" %}} {#what-s-next}

Докладніше дивіться [загальний документ з усунення несправностей](/docs/tasks/debug/).
