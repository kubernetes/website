---
title: Використання NodeLocal DNSCache в кластерах Kubernetes
content_type: task
weight: 390
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка надає огляд функції NodeLocal DNSCache в Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

 <!-- steps -->

## Вступ {#introduction}

NodeLocal DNSCache поліпшує продуктивність кластерного DNS, запускаючи агента кешування DNS на вузлах кластера як DaemonSet. За поточної архітектури Podʼи в режимі DNS `ClusterFirst` зазвичай звертаються до `clusterIP` CoreDNS для DNS-запитів. kube-proxy транслює це звернення в точку доступу CoreDNS. За цією новою архітектурою Podʼи звертаються до агента кешування DNS, що працює на тому ж вузлі, тим самим уникаючи правил DNAT та відстеження зʼєднань. Локальний агент кешування запитуватиме Service CoreDNS у разі промахів кешу для імен хостів кластера (стандартно — суфікс "`cluster.local`").

## Мотивація {#motivation}

* За поточної архітектури DNS можливо, що Podʼам з найвищим QPS DNS доведеться звертатися до іншого вузла, якщо локального екземпляра CoreDNS немає. Локальний кеш допоможе зменшити затримку в таких сценаріях.

* Обхід iptables DNAT та відстеження зʼєднань допоможе зменшити [стани гонитви в conntrack](https://github.com/kubernetes/kubernetes/issues/56903) та уникнути заповнення таблиці conntrack записами UDP DNS.

* Зʼєднання від локального агента кешування до Service CoreDNS можна перевести на TCP. Записи conntrack для TCP видалятимуться після закриття зʼєднання, на відміну від записів UDP, для яких має сплинути тайм-аут ([стандартно](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` становить 30 секунд)

* Переведення DNS-запитів з UDP на TCP зменшить хвостову затримку, спричинену втраченими пакетами UDP та тайм-аутами DNS, зазвичай до 30 секунд (3 повтори + 10 секунд тайм-ауту). Оскільки кеш nodelocal прослуховує UDP DNS-запити, застосунки змінювати не потрібно.

* Метрики та видимість DNS-запитів на рівні вузла.

* Негативне кешування можна знову ввімкнути, тим самим зменшивши кількість запитів до Service CoreDNS.

## Діаграма архітектури {#architecture-diagram}

Ось шлях, яким проходять DNS-запити після ввімкнення NodeLocal DNSCache:

{{< figure src="/images/docs/nodelocaldns.svg" alt="Потік NodeLocal DNSCache" title="Потік NodeLocal DNSCache" caption="Це зображення показує, як NodeLocal DNSCache обробляє DNS-запити." class="diagram-medium" >}}

## Конфігурація {#configuration}

{{< note >}}
Локальна IP-адреса прослуховування для NodeLocal DNSCache може бути будь-якою адресою, яка гарантовано не перетинається з жодною наявною IP-адресою у вашому кластері. Рекомендується використовувати адресу з локальною областю дії, наприклад, з діапазону 'link-local' '169.254.0.0/16' для IPv4 або з діапазону 'Unique Local Address' в IPv6 'fd00::/8'.
{{< /note >}}

Цю функцію можна ввімкнути за допомогою таких кроків:

* Підготуйте маніфест, схожий на зразок [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) та збережіть його як `nodelocaldns.yaml`.

* Якщо використовуєте IPv6, у файлі конфігурації CoreDNS потрібно брати всі IPv6-адреси у квадратні дужки, якщо вони використовуються у форматі 'IP:Port'. Якщо ви використовуєте зразок маніфесту з попереднього пункту, це потребує зміни [рядка конфігурації L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70) таким чином: "`health [__PILLAR__LOCAL__DNS__]:8080`"

* Замініть змінні в маніфесті на правильні значення:

  ```shell
  # З історичних причин Service для CoreDNS називається "kube-dns"
  coredns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`
  domain=<cluster-domain>
  localdns=<node-local-address>
  ```

  `<cluster-domain>` стандартно — "`cluster.local`". `<node-local-address>` — це локальна IP-адреса прослуховування, обрана для NodeLocal DNSCache.

  * Якщо kube-proxy працює в режимі IPTABLES:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$coredns/g" nodelocaldns.yaml
    ```

    `__PILLAR__CLUSTER__DNS__` та `__PILLAR__UPSTREAM__SERVERS__` заповнять Podʼи `node-local-dns`. У цьому режимі Podʼи `node-local-dns` прослуховують як IP-адресу Service CoreDNS, так і `<node-local-address>`, тому Podʼи можуть шукати записи DNS, використовуючи будь-яку з цих IP-адрес.

  * Якщо kube-proxy працює в режимі IPVS:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$coredns/g" nodelocaldns.yaml
    ```

    У цьому режимі Podʼи `node-local-dns` прослуховують лише `<node-local-address>`. Інтерфейс `node-local-dns` не може привʼязатися до cluster IP CoreDNS, оскільки інтерфейс, що використовується для балансування навантаження IPVS, вже використовує цю адресу. `__PILLAR__UPSTREAM__SERVERS__` заповнять Podʼи `node-local-dns`.

* Виконайте `kubectl create -f nodelocaldns.yaml`.

* Якщо використовуєте kube-proxy в режимі IPVS, прапорець `--cluster-dns` для kubelet потрібно змінити так, щоб він використовував `<node-local-address>`, який прослуховує NodeLocal DNSCache. В іншому випадку не потрібно змінювати значення прапорця `--cluster-dns`, оскільки NodeLocal DNSCache прослуховує як IP-адресу Service CoreDNS, так і `<node-local-address>`.

Після ввімкнення Podʼи `node-local-dns` працюватимуть у просторі імен `kube-system` на кожному з вузлів кластера. Цей Pod запускає [CoreDNS](https://github.com/coredns/coredns) у режимі кешування, тому всі метрики CoreDNS, які надають різні втулки, будуть доступні на рівні кожного вузла.

Цю функцію можна вимкнути, видаливши DaemonSet за допомогою `kubectl delete -f <manifest>`. Також слід скасувати всі зміни, внесені до конфігурації kubelet.

## Конфігурація stub-доменів {#stub-domain-configuration}

Corefile у ConfigMap `node-local-dns` можна змінити, додавши конфігурацію stubDomain. Деякі хмарні постачальники можуть не дозволяти змінювати ConfigMap `node-local-dns` безпосередньо; у цьому випадку замість нього можна використовувати ConfigMap `kube-dns` у форматі, який традиційно використовує `kube-dns`:

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

Podʼи `node-local-dns` використовують памʼять для зберігання записів кешу та обробки запитів. Оскільки вони не стежать за обʼєктами Kubernetes, розмір кластера або кількість Service / EndpointSlice безпосередньо не впливає на використання памʼяті. Використання памʼяті залежить від шаблону DNS-запитів. З [документації CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md):

> Стандартний розмір кешу — 10000 записів, що використовує приблизно 30 МБ, коли кеш повністю заповнений.

Таким буде використання памʼяті для кожного серверного блоку (якщо кеш буде повністю заповнений). Використання памʼяті можна зменшити, вказавши менші розміри кешу.

Кількість одночасних запитів повʼязана з потребою в памʼяті, оскільки кожна додаткова goroutine, яка обробляє запит, потребує певної кількості памʼяті. Ви можете встановити верхню межу за допомогою параметра `max_concurrent` у втулку forward.

Якщо Pod `node-local-dns` намагається використовувати більше памʼяті, ніж доступно (через загальні системні ресурси або через налаштоване [обмеження ресурсів](/docs/concepts/configuration/manage-resources-containers/)), операційна система може завершити контейнер цього Podʼа. У такому разі завершений контейнер ("OOMKilled") не очищає власні правила фільтрації пакетів, які він раніше додав під час запуску. Контейнер `node-local-dns` має бути перезапущений (оскільки він керується як частина DaemonSet), але це призводитиме до короткої перерви в роботі DNS щоразу, коли контейнер зазнає збою: правила фільтрації пакетів спрямовують DNS-запити до локального Podʼа, який не є справним.

Ви можете визначити прийнятне обмеження памʼяті, запустивши Podʼи `node-local-dns` без обмеження
та вимірявши максимальне використання. Ви також можете налаштувати та використовувати [VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) у _recommender mode_, а потім перевірити його рекомендації.
