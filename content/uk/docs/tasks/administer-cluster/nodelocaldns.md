---
title: Використання NodeLocal DNSCache в кластерах Kubernetes
content_type: task
weight: 390
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка надає огляд функції NodeLocal DNSCache в Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

 <!-- steps -->

## Вступ {#introduction}

NodeLocal DNSCache поліпшує продуктивність кластерного DNS, запускаючи агента кешування DNS на вузлах кластера як DaemonSet. За поточної архітектури, Podʼи в режимі DNS `ClusterFirst` зазвичай звертаються до `clusterIP` CoreDNS для DNS-запитів. Вони переводяться в точку доступу CoreDNS за допомогою kube-proxy. За цією новою архітектурою Podʼи звертаються до агента кешування DNS, що працює на тому ж вузлі, тим самим уникнувши правил DNAT та відстеження зʼєднань. Локальний агент кешування буде запитувати службу CoreDNS про пропуски кешування для імен кластера (типовий суфікс "`cluster.local`").

## Мотивація {#motivation}

* За поточної архітектури DNS, є можливість того, що Podʼи з найвищим QPS DNS повинні звертатися до іншого вузла, якщо на цьому вузлі немає локального екземпляра CoreDNS. Наявність локального кешу допоможе покращити час відгуку в таких сценаріях.

* Пропускаючи iptables DNAT та відстеження зʼєднань допоможе зменшити [гонитви з відстеженням зʼєднань](https://github.com/kubernetes/kubernetes/issues/56903) та уникнути заповнення таблиці conntrack UDP DNS-записами.

* Зʼєднання від локального агента кешування до служби CoreDNS можуть бути підвищені до TCP. Записи conntrack для TCP будуть видалені при закритті зʼєднання, на відміну від записів UDP, які мусять перейти у режим очікування ([типово](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` становить 30 секунд)

* Перехід DNS-запитів з UDP до TCP зменшить хвостовий час відповіді, спричинений втратою пакетів UDP та зазвичай таймаутами DNS до 30 секунд (3 повтори + 10 секунд таймауту). Оскільки кеш NodeLocal прослуховує UDP DNS-запити, застосунки не потребують змін.

* Метрики та видимість DNS-запитів на рівні вузла.

* Відʼємне кешування можна повторно включити, тим самим зменшивши кількість запитів до служби CoreDNS.

## Діаграма архітектури {#architecture-diagram}

Це шлях, яким йдуть DNS-запити після ввімкнення NodeLocal DNSCache:

{{< figure src="/images/docs/nodelocaldns.svg" alt="Потік NodeLocal DNSCache" title="Потік NodeLocal DNSCache" caption="Ця картинка показує, як NodeLocal DNSCache обробляє DNS-запити." class="diagram-medium" >}}

## Конфігурація {#configuration}

{{< note >}}
Локальна IP-адреса прослуховування для NodeLocal DNSCache може бути будь-якою адресою, яка гарантовано не перетинається з будь-яким наявним IP у вашому кластері. Рекомендується використовувати адресу з місцевою областю, наприклад, з діапазону 'link-local' '169.254.0.0/16' для IPv4 або з діапазону 'Unique Local Address' у IPv6 'fd00::/8'.
{{< /note >}}

Цю функцію можна ввімкнути за допомогою таких кроків:

* Підготуйте маніфест, схожий на зразок [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) та збережіть його як `nodelocaldns.yaml`.

* Якщо використовуєте IPv6, файл конфігурації CoreDNS потрібно закрити всі IPv6-адреси у квадратні дужки, якщо вони використовуються у форматі 'IP:Port'. Якщо ви використовуєте зразок маніфесту з попереднього пункту, це потребує зміни [рядка конфігурації L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70) таким чином: "`health [__PILLAR__LOCAL__DNS__]:8080`"

* Підставте змінні в маніфест з правильними значеннями:

  ```shell
  # З історичних причин Service для CoreDNS називається "kube-dns"
  coredns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`
  domain=<cluster-domain>
  localdns=<node-local-address>
  ```

  `<cluster-domain>` типово "`cluster.local`". `<node-local-address>` — це локальна IP-адреса прослуховування, обрана для NodeLocal DNSCache.

  * Якщо kube-proxy працює в режимі IPTABLES:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$coredns/g" nodelocaldns.yaml
    ```

    `__PILLAR__CLUSTER__DNS__` та `__PILLAR__UPSTREAM__SERVERS__` будуть заповнені під час роботи підсистеми `node-local-dns`. У цьому режимі підсистеми `node-local-dns` прослуховують як IP-адресу служби CoreDNS, так і `<node-local-address>`, тому Podʼи можуть шукати записи DNS, використовуючи будь-яку з цих IP-адрес.

  * Якщо kube-proxy працює в режимі IPVS:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$coredns/g" nodelocaldns.yaml
    ```

    У цьому режимі підсистеми `node-local-dns` прослуховують лише `<node-local-address>`. Інтерфейс `node-local-dns` не може привʼязати кластерну IP CoreDNS, оскільки інтерфейс, що використовується для IPVS-балансування навантаження, вже використовує цю адресу. `__PILLAR__UPSTREAM__SERVERS__` буде заповнено підсистемами `node-local-dns`.

* Запустіть `kubectl create -f nodelocaldns.yaml`.

* Якщо використовуєте kube-proxy в режимі IPVS, прапорець `--cluster-dns` для kubelet потрібно змінити на `<node-local-address>`, який прослуховує NodeLocal DNSCache. В іншому випадку не потрібно змінювати значення прапорця `--cluster-dns`, оскільки NodeLocal DNSCache прослуховує як IP-адресу служби CoreDNS, так і `<node-local-address>`.

Після ввімкнення, Podʼи `node-local-dns` будуть працювати у просторі імен `kube-system` на кожному з вузлів кластера. Цей Pod працює з [CoreDNS](https://github.com/coredns/coredns) у режимі кешування, тому всі метрики CoreDNS, що надаються різними втулками, будуть доступні на рівні кожного вузла.

Цю функцію можна вимкнути, видаливши DaemonSet, використовуючи `kubectl delete -f <manifest>`. Також слід скасувати будь-які зміни, внесені до конфігурації kubelet.

## Конфігурація Stub-доменів {#stub-domain-configuration}

Corefile у ConfigMap `node-local-dns` можна змінити з конфігурацією stubDomain. Деякі хмарні постачальники можуть не дозволяти змінювати ConfigMap `node-local-dns` безпосередньо; у цьому випадку можна використовувати ConfigMap `kube-dns` у форматі, який традиційно використовувався `kube-dns`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: kube-dns
data:
  stubDomains: |
    {"abc.com" : ["1.2.3.4"], "my.cluster.local" : ["2.3.4.5"]}
```

## Налаштування обмежень памʼяті {#setting-memory-limits}

Podʼи `node-local-dns` використовують памʼять для зберігання записів кешу та обробки запитів. Оскільки вони не стежать за обʼєктами Kubernetes, розмір кластера або кількість Service / EndpointSlice не впливає на використання памʼяті безпосередньо. Використання памʼяті впливає на шаблон DNS-запитів. З [документації CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md):

> Типовий розмір кешу — 10000 записів, що використовує приблизно 30 МБ, коли повністю заповнений.

Це буде використання памʼяті для кожного блоку сервера (якщо кеш буде повністю заповнений). Використання памʼяті можна зменшити, вказавши менші розміри кешу.

Кількість одночасних запитів повʼязана з попитом памʼяті, оскільки кожен додатковий goroutine, використаний для обробки запиту, потребує певної кількості памʼяті. Ви можете встановити верхню межу за допомогою опції `max_concurrent` у втулку forward.

Якщо Pod `node-local-dns` намагається використовувати більше памʼяті, ніж доступно (через загальні системні ресурси або через налаштовані [обмеження ресурсів](/docs/concepts/configuration/manage-resources-containers/)), операційна система може вимкнути контейнер цього Podʼа. У разі цього, контейнер, якого вимкнено ("OOMKilled"), не очищає власні правила фільтрації пакетів, які він раніше додавав під час запуску. Контейнер `node-local-dns` повинен бути перезапущений (оскільки він керується як частина DaemonSet), але це призведе до короткої перерви у роботі DNS кожного разу, коли контейнер зазнає збою: правила фільтрації пакетів направляють DNS-запити до локального Podʼа, який не є справним.

Ви можете визначити прийнятне обмеження памʼяті, запустивши Podʼи `node-local-dns` без обмеження
та вимірявши максимальне використання. Ви також можете налаштувати та використовувати [VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) у _recommender mode_, а потім перевірити його рекомендації.
