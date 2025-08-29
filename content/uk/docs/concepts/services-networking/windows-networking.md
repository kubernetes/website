---
title: Мережеві аспекти Windows
content_type: concept
weight: 110
---

<!-- overview -->

Kubernetes підтримує використання як вузлів Linux, так і Windows, і можливе одночасне використання обох типів вузлів у межах одного кластеру. Ця сторінка надає огляд мережевих аспектів, специфічних для операційної системи Windows.

<!-- body -->

## Мережева взаємодія контейнерів у Windows {#networking}

Мережевий стек для контейнерів у Windows використовує [CNI-втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Контейнери у Windows працюють схоже до віртуальних машин з погляду мережі. Кожен контейнер має віртуальний мережевий адаптер (vNIC), який підключений до віртуального комутатора Hyper-V (vSwitch). Host Networking Service (HNS) та Host Compute Service (HCS) спільно працюють для створення контейнерів і підключення віртуальних мережевих адаптерів контейнера до мереж. HCS відповідає за управління контейнерами, тоді як HNS відповідає за управління ресурсами мережі, такими як:

* Віртуальні мережі (включаючи створення vSwitches)
* Endpoint / vNIC
* Namespaces
* Політика, включаючи інкапсуляцію пакетів, правила балансування навантаження, ACL, та правила NAT.

Windows HNS та vSwitch реалізують простір імен та можуть створювати віртуальні мережеві адаптери за потреби для Podʼів чи контейнерів. Однак багато конфігурацій,
таких як DNS, маршрути та метрики, зберігаються в базі даних реєстру Windows, а не як файли в `/etc`, як це робить Linux. Реєстр Windows для контейнера відрізняється від реєстру хосту, тому концепції, такі як передавання `/etc/resolv.conf` з хосту в контейнер, не мають такого ж ефекту, як у Linux. Їх потрібно налаштовувати за допомогою API Windows, що виконуються в контексті контейнера. Таким чином, реалізації CNI повинні викликати HNS, а не покладатися на доступ до файлів для передачі мережевих деталей у Pod чи контейнер.

## Режими мережі {#network-modes}

Windows підтримує пʼять різних драйверів/режимів мережі: L2bridge, L2tunnel, Overlay (Beta), Transparent та NAT. У гетерогенному кластері з вузлами Windows і Linux необхідно вибрати мережеве рішення, яке сумісне як з Windows, так і з Linux. У таблиці нижче наведено втулки, що не є частиною Kubernetes, які підтримуються у Windows, з рекомендаціями щодо використання кожного CNI:

| Драйвер мережі | Опис | Модифікації контейнерних пакетів | Втулки мережі | Характеристики втулків мережі |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Контейнери підключені до зовнішнього vSwitch. Контейнери підключені до мережі нижнього рівня, хоча фізична мережа не повинна знати MAC-адреси контейнера, оскільки вони переписуються при вході/виході. | MAC переписується на MAC хосту, IP може бути переписаний на IP хосту за допомогою політики HNS OutboundNAT. | [win-bridge](https://www.cni.dev/plugins/current/main/win-bridge/), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), [Flannel host-gateway](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#host-gw) використовує win-bridge | win-bridge використовує режим мережі L2bridge, підключаючи контейнери до нижнього рівня хостів, пропонуючи найкращу продуктивність. Вимагає маршрутів, визначених користувачем (UDR) для міжвузлової звʼязності. |
| L2Tunnel | Це спеціальний випадок l2bridge, але використовується тільки на Azure. Всі пакети відсилаються на віртуальний хост, де застосовується політика SDN. | MAC переписується, IP видно в мережі нижнього рівня | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI дозволяє інтегрувати контейнери з Azure vNET та використовувати набір можливостей, які [Azure Virtual Network надає](https://azure.microsoft.com/en-us/services/virtual-network/). Наприклад, безпечно підключатися до служб Azure або використовувати NSG Azure. Див. [azure-cni для прикладів](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay | Контейнерам надається vNIC, підключений до зовнішнього vSwitch. Кожна мережа має власну підмережу IP, визначену власним IP-префіксом. Драйвер мережі використовує інкапсуляцію VXLAN. | Інкапсульований в зовнішній заголовок. | [win-overlay](https://www.cni.dev/plugins/current/main/win-overlay/), [Flannel VXLAN](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan) (використовує win-overlay) | win-overlay слід використовувати, коли потрібна ізоляція віртуальних мереж контейнерів від нижнього рівня хостів (наприклад, з міркувань безпеки). Дозволяє використовувати однакові IP для різних віртуальних мереж (які мають різні теґи VNID), якщо у вас обмеження на IP в вашому датацентрі. Цей варіант вимагає [KB4489899](https://support.microsoft.com/help/4489899) у Windows Server 2019. |
| Transparent (спеціальний випадок для [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Вимагає зовнішнього vSwitch. Контейнери підключені до зовнішнього vSwitch, що дозволяє взаємодію всередині Podʼа за допомогою логічних мереж (логічні свічі та маршрутизатори). | Пакет капсулюється через [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) або [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) для доступу до Podʼів, які не знаходяться на тому самому хості. <br/> Пакети пересилаються чи відкидаються через інформацію про тунель, яку надає контролер мережі ovn. <br/> NAT виконується для комунікації північ-південь. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Розгортається за допомогою ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Розподілені ACL можна застосовувати за допомогою політик Kubernetes. Підтримка IPAM. Балансування навантаження можливе без використання kube-proxy. NAT виконується без використання iptables/netsh. |
| NAT (*не використовується в Kubernetes*) | Контейнерам надається віртуальний мережевий адаптер (vNIC), підключений до внутрішнього vSwitch. DNS/DHCP надається за допомогою внутрішнього компонента, називається [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303) | MAC та IP переписуються на MAC/IP хосту. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Включено тут для повноти. |

Як вказано вище, [Flannel](https://github.com/coreos/flannel) [CNI plugin](https://github.com/flannel-io/cni-plugin) також [підтримується](https://github.com/flannel-io/cni-plugin#windows-support-experimental) у Windows через [VXLAN мережевий бекенд](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**Бета-підтримка**; делегує до win-overlay) та [host-gateway мережевий бекенд](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (стабільна підтримка; делегує до win-bridge).

Цей втулок підтримує делегування до одного з втулків CNI за вибором користувача (win-overlay, win-bridge), для співпраці з демоном Flannel у Windows (Flanneld) для автоматичного присвоєння лізингу підмережі вузлу та створення мережі HNS. Цей втулок читає власний файл конфігурації (cni.conf) та агрегує його зі змінними середовища зі створеного FlannelD файлу subnet.env. Потім він делегує одному з втулків CNI для роботи з мережею, надсилаючи правильну конфігурацію, що містить призначену вузлом підмережу до IPAM-втулку (наприклад: `host-local`).

Для обʼєктів Node, Pod та Service підтримуються наступні потоки даних мережі для TCP/UDP-трафіку:

* Pod → Pod (IP)
* Pod → Pod (Імʼя)
* Pod → Сервіс (Кластерний IP)
* Pod → Сервіс (PQDN, але тільки якщо немає ".")
* Pod → Сервіс (FQDN)
* Pod → зовнішній (IP)
* Pod → зовнішній (DNS)
* Node → Pod
* Pod → Node

## Управління IP-адресами (IPAM) {#ipam}

У Windows підтримуються наступні параметри IPAM:

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (тільки для azure-cni)
* [IPAM Windows Server](https://docs.microsoft.com/windows-server/networking/technologies/ipam/ipam-top) (запасна опція, якщо не встановлено IPAM)

## Пряме повернення до сервера (DSR) {#dsr}

{{< feature-state feature_gate_name="WinDSR" >}}

Режим балансування навантаження, у якому встановлення IP-адреси та LBNAT відбувається безпосередньо на порту контейнера vSwitch; трафік сервісу надходить з IP-адресою джерела, встановленою як IP-адреса вихідного pod'а. Це забезпечує оптимізацію продуктивності, дозволяючи зворотному трафіку, що проходить через балансувальник навантаження, оминати його і відповідати безпосередньо клієнту; зменшуючи навантаження на балансувальник навантаження, а також зменшуючи загальну затримку. Для отримання додаткової інформації, прочитайте [Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).

## Балансування навантаження та Service {#load-balancing-and-services}

{{<glossary_tooltip text="Service" term_id="service">}} Kubernetes є абстракцією, яка визначає логічний набір Podʼів та засіб доступу до них мережею. У кластері, який включає вузли Windows, можна використовувати наступні типи Service:

* `NodePort`
* `ClusterIP`
* `LoadBalancer`
* `ExternalName`

Мережева взаємодія контейнерів у Windows відрізняється в деяких важливих аспектах від мережі Linux. [Документація Microsoft з мережевої взаємодії контейнерів у Windows](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture) надає додаткові відомості та контекст.

У Windows можна використовувати наступні налаштування для конфігурації Service та поведінки балансування навантаження:

{{< table caption="Налаштування Сервісів для Windows" >}}
| Функція | Опис | Мінімальна підтримувана версія Windows OS | Як ввімкнути |
| ------- | ----------- | -------------------------- | ------------- |
| Подібність сесій <br> (Session affinity) | Забезпечує, що підключення від певного клієнта передається тому самому Podʼу кожен раз. | Windows Server 2022 | Встановіть у `service.spec.sessionAffinity` значення "ClientIP" |
| Direct Server Return (DSR) | Див [DSR](#dsr) вище | Windows Server 2019 | Встановіть наступні прапорці в kube-proxy (враховуючи, що версія {{< skew currentVersion >}}): `--enable-dsr=true` |
| Збереження-Призначення | Пропускає DNAT-трафік Servicʼу, тим самим зберігаючи віртуальну IP цільового Service в пакетах, що досягають фронтенду Podʼа. Також вимикає пересилання вузол-вузол. | Windows Server, версія 1903 | Встановіть `"preserve-destination": "true"` в анотаціях служби та увімкніть DSR в kube-proxy. |
| Подвійний мережевий стек IPv4/IPv6 | Нативна підтримка IPv4-до-IPv4 поряд з IPv6-до-IPv6 комунікацією до, з і всередині кластера | Windows Server 2019 | Див. [Підтримка подвійного стеку IPv4/IPv6](/docs/concepts/services-networking/dual-stack/#windows-support) |
| Збереження IP клієнта | Забезпечує збереження джерела ingress трафіку. Також вимикає пересилання вузол-вузол. | Windows Server 2019  | Встановіть `service.spec.externalTrafficPolicy` у "Local" та увімкніть DSR в kube-proxy |
{{< /table >}}

## Обмеження {#limitations}

Наступні функції мережі *не* підтримуються на вузлах Windows:

* Режим мережі хосту
* Локальний доступ NodePort з вузла (працює для інших вузлів або зовнішніх клієнтів)
* Більше 64 бекенд-Podʼів (або унікальних адрес призначення) для одного Service
* Звʼязок IPv6 між Pods Windows, підключеними до мереж оверлея
* Local Traffic Policy в режимі без DSR
* Вихідна комунікація за допомогою протоколу ICMP через `win-overlay`, `win-bridge`, або використовуючи втулок Azure-CNI. Зокрема панель даних Windows ([VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/))
  не підтримує ICMP-перетворення пакетів, і це означає:
  * Пакети ICMP, спрямовані до пунктів призначення в одній мережі (наприклад, звʼязок Pod-Pod за допомогою ping), працюють належним чином;
  * TCP/UDP-пакети працюють, як очікується;
  * Пакети ICMP, спрямовані на проходження через віддалену мережу (наприклад, Pod-зовнішньої точки в інтернет через ping), не можуть бути перенесені та, таким чином, не будуть перенаправлені назад до свого джерела;
  * Оскільки TCP/UDP-пакети все ще можуть бути перетворені, ви можете замінити `ping <destination>` на `curl <destination>` при налагодженні зʼєднаності з зовнішнім світом.

Інші обмеження:

* Референсні мережеві втулки Windows, такі як win-bridge та win-overlay, не мають реалізації [специфікації CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0, через відсутність реалізації `CHECK`.
* Втулок Flannel VXLAN має наступні обмеження на Windows:
  * Зʼєднаність Node-Pod можлива лише для локальних Podʼів з Flannel v0.12.0 (або вище).
  * Flannel обмежений використанням VNI 4096 та UDP-порту 4789. Див. офіційну
    [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) документацію про бекенд Flannel VXLAN щодо цих параметрів.
