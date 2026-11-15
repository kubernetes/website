---
title: Мережа у Windows
content_type: concept
weight: 110
---

<!-- overview -->

Kubernetes підтримує роботу вузлів як на Linux, так і на Windows. Ви можете поєднувати обидва види вузлів в одному кластері. На цій сторінці наведено огляд мережевих аспектів, специфічних для операційної системи Windows.

<!-- body -->

## Мережа контейнерів у Windows {#networking}

Мережа для контейнерів Windows надається через [втулки CNI](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Контейнери Windows працюють подібно до віртуальних машин з погляду мережі. Кожен контейнер має віртуальний мережевий адаптер (vNIC), підключений до віртуального комутатора Hyper-V (vSwitch). Host Networking Service (HNS) та Host Compute Service (HCS) спільно створюють контейнери й підключають vNIC контейнерів до мереж. HCS відповідає за керування контейнерами, а HNS — за керування мережевими ресурсами, такими як:

* Віртуальні мережі (зокрема створення vSwitches)
* Точки доступу / vNIC
* Namespaces
* Політики, зокрема інкапсуляція пакетів, правила балансування навантаження, ACL та правила NAT.

HNS та vSwitch у Windows реалізують простори імен і можуть за потреби створювати віртуальні NIC для Podʼа чи контейнера. Однак багато конфігурацій, таких як DNS, маршрути та метрики, зберігаються в базі даних реєстру Windows, а не у файлах в `/etc`, як у Linux. Реєстр Windows контейнера відокремлений від реєстру хоста, тому такі прийоми, як зіставлення `/etc/resolv.conf` з хоста в контейнер, не дають того ефекту, що в Linux. Це потрібно налаштовувати за допомогою API Windows, що виконуються в контексті цього контейнера. Тому реалізації CNI повинні викликати HNS, а не покладатися на зіставлення файлів, щоб передавати мережеві дані в Pod чи контейнер.

## Режими мережі {#network-modes}

Windows підтримує пʼять різних мережевих драйверів/режимів: L2bridge, L2tunnel, Overlay (Beta), Transparent та NAT. У гетерогенному кластері з робочими вузлами Windows і Linux потрібно вибрати мережеве рішення, сумісне і з Windows, і з Linux. У таблиці нижче наведено зовнішні (out-of-tree) втулки, які підтримуються у Windows, з рекомендаціями щодо використання кожного CNI:

| Мережевий драйвер | Опис | Зміни пакетів контейнерів | Мережеві втулки | Характеристики мережевих втулків |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Контейнери підключені до зовнішнього vSwitch. Контейнери підключені до базової мережі (underlay), хоча фізичній мережі не потрібно знати MAC-адреси контейнерів, оскільки вони переписуються на вході та виході. | MAC переписується на MAC хоста, IP може бути переписаний на IP хоста за допомогою політики HNS OutboundNAT. | [win-bridge](https://www.cni.dev/plugins/current/main/win-bridge/), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), [Flannel host-gateway](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#host-gw) використовує win-bridge | win-bridge використовує режим мережі L2bridge, підключає контейнери до базової мережі хостів і забезпечує найкращу продуктивність. Потребує маршрутів, визначених користувачем (UDR), для звʼязку між вузлами. |
| L2Tunnel | Це особливий випадок l2bridge, який використовується лише в Azure. Усі пакети надсилаються на хост віртуалізації, де застосовується політика SDN. | MAC переписується, IP видно в базовій мережі | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI дозволяє інтегрувати контейнери з Azure vNET і дає їм змогу використовувати набір можливостей, які [надає Azure Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/). Наприклад, безпечно підключатися до сервісів Azure або використовувати NSG Azure. Див. [azure-cni, де є кілька прикладів](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay | Контейнерам надається vNIC, підключений до зовнішнього vSwitch. Кожна оверлейна мережа отримує власну IP-підмережу, визначену власним IP-префіксом. Драйвер оверлейної мережі використовує інкапсуляцію VXLAN. | Інкапсулюється із зовнішнім заголовком. | [win-overlay](https://www.cni.dev/plugins/current/main/win-overlay/), [Flannel VXLAN](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan) (використовує win-overlay) | win-overlay слід використовувати, коли віртуальні мережі контейнерів потрібно ізолювати від базової мережі хостів (наприклад, з міркувань безпеки). Дозволяє повторно використовувати IP-адреси для різних оверлейних мереж (які мають різні теґи VNID), якщо у вашому центрі обробки даних обмаль IP-адрес. Цей варіант потребує [KB4489899](https://support.microsoft.com/help/4489899) у Windows Server 2019. |
| Transparent (особливий випадок для [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Потребує зовнішнього vSwitch. Контейнери підключені до зовнішнього vSwitch, що забезпечує взаємодію всередині Podʼа через логічні мережі (логічні комутатори та маршрутизатори). | Пакет інкапсулюється через тунелювання [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) або [STT](https://datatracker.ietf.org/doc/draft-davie-stt/), щоб досягти Podʼів, які не перебувають на тому самому хості. <br/> Пакети пересилаються або відкидаються на основі метаданих тунелю, які надає мережевий контролер ovn. <br/> NAT виконується для трафіку північ-південь. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Розгортається за допомогою ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Розподілені ACL можна застосовувати за допомогою політик Kubernetes. Підтримка IPAM. Балансування навантаження можливе без kube-proxy. NAT виконується без використання iptables/netsh. |
| NAT (*не використовується в Kubernetes*) | Контейнерам надається vNIC, підключений до внутрішнього vSwitch. DNS/DHCP надається внутрішнім компонентом, який називається [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303) | MAC та IP переписуються на MAC/IP хоста. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Наведено тут для повноти |

Як зазначено вище, [втулок CNI](https://github.com/flannel-io/cni-plugin) [Flannel](https://github.com/coreos/flannel) також [підтримується](https://github.com/flannel-io/cni-plugin#windows-support-experimental) у Windows через [мережевий бекенд VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**бета-підтримка**; делегує до win-overlay) та [мережевий бекенд host-gateway](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (стабільна підтримка; делегує до win-bridge).

Цей втулок підтримує делегування одному з еталонних втулків CNI (win-overlay, win-bridge) для спільної роботи з демоном Flannel у Windows (Flanneld), щоб автоматично призначати оренду підмережі вузла та створювати мережу HNS. Цей втулок читає власний файл конфігурації (cni.conf) і обʼєднує його зі змінними середовища з файлу subnet.env, згенерованого FlannelD. Потім він делегує налаштування мережі одному з еталонних втулків CNI й надсилає правильну конфігурацію з призначеною вузлу підмережею до втулка IPAM (наприклад, `host-local`).

Для обʼєктів Node, Pod та Service підтримуються такі мережеві потоки для трафіку TCP/UDP:

* Pod → Pod (IP)
* Pod → Pod (імʼя)
* Pod → Service (кластерний IP)
* Pod → Service (PQDN, але лише якщо немає ".")
* Pod → Service (FQDN)
* Pod → зовнішній (IP)
* Pod → зовнішній (DNS)
* Node → Pod
* Pod → Node

## Керування IP-адресами (IPAM) {#ipam}

У Windows підтримуються такі варіанти IPAM:

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (лише для azure-cni)
* [IPAM Windows Server](https://docs.microsoft.com/windows-server/networking/technologies/ipam/ipam-top) (запасний варіант, якщо IPAM не встановлено)

## Пряме повернення до сервера (DSR) {#dsr}

{{< feature-state feature_gate_name="WinDSR" >}}

Режим балансування навантаження, у якому виправлення IP-адрес і LBNAT відбуваються безпосередньо на порту vSwitch контейнера; трафік сервісу надходить з IP-адресою джерела, що дорівнює IP-адресі вихідного Podʼа. Це оптимізує продуктивність, дозволяючи зворотному трафіку, що маршрутизується через балансувальники навантаження, оминати балансувальник і відповідати безпосередньо клієнту; це зменшує навантаження на балансувальник і загальну затримку. Докладніше читайте в [Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).

## Балансування навантаження та Services {#load-balancing-and-services}

{{< glossary_tooltip text="Service" term_id="service" >}} Kubernetes — це абстракція, яка визначає логічний набір Podʼів і спосіб доступу до них мережею. У кластері з вузлами Windows можна використовувати такі типи Service:

* `NodePort`
* `ClusterIP`
* `LoadBalancer`
* `ExternalName`

Мережа контейнерів Windows у деяких важливих аспектах відрізняється від мережі Linux. [Документація Microsoft про мережу контейнерів Windows](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture) містить додаткові подробиці та контекст.

У Windows можна використовувати такі налаштування для конфігурації Services та поведінки балансування навантаження:

{{< table caption="Налаштування Services у Windows" >}}
| Можливість | Опис | Мінімальна підтримувана збірка ОС Windows | Як увімкнути |
| ------- | ----------- | -------------------------- | ------------- |
| Спорідненість сесії (session affinity) | Гарантує, що підключення від певного клієнта щоразу передаються тому самому Podʼу. | Windows Server 2022 | Встановіть `service.spec.sessionAffinity` у "ClientIP" |
| Direct Server Return (DSR) | Див. примітки про [DSR](#dsr) вище. | Windows Server 2019 | Встановіть такий аргумент командного рядка (для версії {{< skew currentVersion >}}): `--enable-dsr=true` |
| Preserve-Destination | Пропускає DNAT трафіку сервісу, зберігаючи віртуальну IP-адресу цільового сервісу в пакетах, що досягають Podʼа-бекенда. Також вимикає пересилання між вузлами. | Windows Server, версія 1903 | Встановіть `"preserve-destination": "true"` в анотаціях сервісу та увімкніть DSR у kube-proxy. |
| Двостекова мережа IPv4/IPv6 | Нативний звʼязок IPv4-IPv4 паралельно зі звʼязком IPv6-IPv6 до кластера, з нього та всередині нього | Windows Server 2019 | Див. [Подвійний стек IPv4/IPv6](/docs/concepts/services-networking/dual-stack/#windows-support) |
| Збереження IP клієнта | Гарантує збереження IP-адреси джерела вхідного трафіку. Також вимикає пересилання між вузлами. | Windows Server 2019 | Встановіть `service.spec.externalTrafficPolicy` у "Local" та увімкніть DSR у kube-proxy |
{{< /table >}}

## Обмеження {#limitations}

Така мережева функціональність _не_ підтримується на вузлах Windows:

* Режим мережі хоста
* Локальний доступ до NodePort із самого вузла (працює для інших вузлів або зовнішніх клієнтів)
* Понад 64 Podʼи-бекенди (або унікальні адреси призначення) для одного Service
* Звʼязок IPv6 між Podʼами Windows, підключеними до оверлейних мереж
* Local Traffic Policy в режимі без DSR
* Вихідний звʼязок за протоколом ICMP через `win-overlay`, `win-bridge` або за допомогою втулка Azure-CNI. Зокрема, площина даних Windows ([VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/)) не підтримує транспозицію пакетів ICMP, і це означає:
  * Пакети ICMP, спрямовані до призначень у тій самій мережі (наприклад, звʼязок між Podʼами через ping), працюють як очікується;
  * TCP/UDP-пакети працюють, як очікується;
  * Пакети ICMP, спрямовані через віддалену мережу (наприклад, звʼязок Podʼа із зовнішнім інтернетом через ping), не можуть бути транспоновані, тому не маршрутизуються назад до свого джерела;
  * Оскільки TCP/UDP-пакети все ще можуть бути транспоновані, під час налагодження звʼязку із зовнішнім світом ви можете замінити `ping <destination>` на `curl <destination>`.

Інші обмеження:

* Еталонні мережеві втулки Windows win-bridge та win-overlay не реалізують [специфікацію CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0 через відсутність реалізації `CHECK`.
* Втулок CNI Flannel VXLAN має такі обмеження у Windows:
  * Звʼязок між вузлом і Podʼом можливий лише для локальних Podʼів із Flannel v0.12.0 (або новішим).
  * Flannel обмежений використанням VNI 4096 та UDP-порту 4789. Докладніше про ці параметри див. в офіційній документації бекенда [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan).
