---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Service"
content_type: "api_reference"
description: "Service — це іменована абстракція служб програмного забезпечення (наприклад, mysql), що складається з локального порту (наприклад, 3306), який прослуховує проксі, і селектора, який визначає, які Podʼи будуть відповідати на запити, надіслані через проксі."
title: "Service"
weight: 1
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Service {#Service}

Service — це іменована абстракція служб програмного забезпечення (наприклад, mysql), що складається з локального порту (наприклад, 3306), який прослуховує проксі, і селектора, який визначає, які Podʼи будуть відповідати на запити, надіслані через проксі.

---

- **apiVersion**: v1

- **kind**: Service

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/service-v1#ServiceSpec" >}}">ServiceSpec</a>)

  Специфікація бажаної поведінки Service. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../service-resources/service-v1#ServiceStatus" >}}">ServiceStatus</a>)

  Останній зафіксований статус Service. Заповнюється системою. Тільки для читання. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ServiceSpec {#ServiceSpec}

ServiceSpec описує атрибути, які користувач створює для служби.

---

- **selector** (map[string]string)

  Направляє трафік до Podʼів з ключами та значеннями міток, які відповідають цьому селектору. Якщо селектор порожній або не вказаний, передбачається, що Service має зовнішній процес, який керує його точками доступу, і Kubernetes не буде їх змінювати. Застосовується лише до типів ClusterIP, NodePort і LoadBalancer. Ігнорується, якщо тип — ExternalName. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/](/docs/concepts/services-networking/service/)

- **ports** ([]ServicePort)

  *Patch strategy: злиття по ключу `port`*

  *Map: унікальні значення за ключами `port, protocol` зберігатимуться під час злиття*

  Список портів, які відкриває Service. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)

  <a name="ServicePort"></a>
  *ServicePort містить інформацію про порт Service.*

  - **ports.port** (int32), обовʼязково

    Порт, який буде відкритий цим Service.

  - **ports.targetPort** (IntOrString)

    Номер або імʼя порту для доступу до Podʼів, на які спрямовано Service. Номер повинен бути в діапазоні від 1 до 65535. Імʼя повинно бути IANA_SVC_NAME. Якщо це рядок, він буде шукатися як іменований порт у портах контейнера цільового Podʼа. Якщо не вказано, використовується значення поля ʼportʼ (identity map). Це поле ігнорується для Service із clusterIP=None і має бути пропущене або встановлене рівним полю ʼportʼ. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service](/docs/concepts/services-networking/service/#defining-a-service)

    <a name="IntOrString"></a>
    *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

  - **ports.protocol** (string)

    IP-протокол для цього порту. Підтримуються "TCP", "UDP" і "SCTP". Стандартне значення — TCP.

    Можливі значення переліку (enum):
    - `"SCTP"` — SCTP протокол
    - `"TCP"` — TCP протокол
    - `"UDP"` — UDP протокол

  - **ports.name** (string)

    Імʼя цього порту в Service. Воно повинно бути DNS_LABEL. Усі порти в межах ServiceSpec повинні мати унікальні імена. При аналізі точок доступу для Service, вони повинні відповідати полю ʼnameʼ в EndpointPort. Необовʼязкове, якщо визначено лише один ServicePort для цього Service.

  - **ports.nodePort** (int32)

    Порт на кожному вузлі, на якому цей Service буде доступний, коли тип — NodePort або LoadBalancer. Зазвичай призначається системою. Якщо значення вказано, знаходиться в діапазоні та не використовується, воно буде використано, інакше операція завершиться невдачею. Якщо не вказано, порт буде виділено, якщо Service його потребує. Якщо це поле вказано під час створення Service, яка не потребує його, створення не вдасться. Це поле буде видалено під час оновлення Service, щоб більше не потребувати його (наприклад, змінюючи тип з NodePort на ClusterIP). Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport](/docs/concepts/services-networking/service/#type-nodeport)

  - **ports.appProtocol** (string)

    Протокол застосунків для цього порту. Він використовується як підказка для реалізацій, щоб запропонувати багатший функціонал для протоколів, які вони розуміють. Це поле відповідає стандартному синтаксису міток Kubernetes. Допустимі значення - або:

    - Протоколи без префіксів — зарезервовані для стандартних імен служб IANA (згідно з RFC-6335 і <https://www.iana.org/assignments/service-names>).

    - Протоколи з префіксами, визначеними Kubernetes:

      - 'kubernetes.io/h2c' — HTTP/2 з попередніми знаннями без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior-
      - 'kubernetes.io/ws' — WebSocket без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc6455
      - 'kubernetes.io/wss' — WebSocket через TLS, як описано в https://www.rfc-editor.org/rfc/rfc6455

    - Інші протоколи повинні використовувати імена з префіксами, визначеними реалізацією, такі як mycompany.com/my-custom-protocol.

- **type** (string)

  Тип визначає, як Service буде відкрито. Стандартне значення — ClusterIP. Допустимі варіанти: ExternalName, ClusterIP, NodePort та LoadBalancer. "ClusterIP" виділяє точкам доступу внутрішню IP-адресу кластера для балансування навантаження. Точки доступу визначаються селектором або, якщо його не вказано, ручним створенням обʼєкта Endpoints або обʼєктів EndpointSlice. Якщо clusterIP має значення "None", жодна віртуальна IP-адреса не виділяється, і точки доступу публікуються як набір точок доступу, а не віртуальна IP-адреса. "NodePort" базується на ClusterIP і виділяє порт на кожному вузлі, який маршрутизується до тих самих точок доступу, що і clusterIP. "LoadBalancer" базується на NodePort і створює зовнішній балансувальник навантаження (якщо підтримується в поточній хмарі), який маршрутизується до тих самих точок доступу, що і clusterIP. "ExternalName" привʼязує цей Service до вказаного externalName. Декілька інших полів не застосовуються до Service ExternalName. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types](/docs/concepts/services-networking/service/#publishing-services-service-types)

  Можливі значення переліку (enum):
  - `"ClusterIP"` означає, що сервіс буде доступний тільки всередині кластера через IP-адресу кластера.
  - `"ExternalName"` означає, що сервіс складається лише з посилання на зовнішнє імʼя, яке kubedns або еквівалент поверне як запис CNAME, без відкриття або проксирування будь-яких повʼязаних подів.
  - `"LoadBalancer"` означає, що сервіс буде експонований через зовнішній балансувальник навантаження (якщо це підтримується постачальником хмари), на додачу до типу 'NodePort'.
  - `"NodePort"` означає, що сервіс буде експонований на одному порту кожного вузла, на додачу до типу 'ClusterIP'.

- **ipFamilies** ([]string)

  *Atomic: буде замінено під час злиття*

  IPFamilies — це список IP-сімейств (наприклад, IPv4, IPv6), призначених цьому Serviceʼу. Це поле зазвичай призначається автоматично на основі конфігурації кластера та поля ipFamilyPolicy. Якщо це поле вказано вручну, запитане сімейство доступне в кластері, і ipFamilyPolicy дозволяє це, воно буде використане; інакше створення Service не вдасться. Це поле змінюється відповідно до умов: дозволяє додавати або видаляти вторинне IP-сімейство, але не дозволяє змінювати первинне IP-сімейство Service. Допустимі значення: "IPv4" і "IPv6". Це поле застосовується лише до Service типів ClusterIP, NodePort та LoadBalancer, і не застосовується до "headless" Service. Це поле буде очищено під час оновлення Service до типу ExternalName.

  Це поле може містити максимум два записи (двостекові сімейство, у будь-якому порядку). Ці сімейства повинні відповідати значенням поля clusterIPs, якщо вказано. Поля clusterIPs та ipFamilies керуються полем ipFamilyPolicy.

- **ipFamilyPolicy** (string)

  IPFamilyPolicy представляє вимоги до подвійного стека для цього Service. Якщо значення не надано, це поле буде встановлено на SingleStack. Service можуть бути "SingleStack" (одне IP-сімейство), "PreferDualStack" (два IP-сімейства в конфігураціях з подвійним стеком або одне IP-сімейство в конфігураціях з одним стеком) або "RequireDualStack" (два IP-сімейства в конфігураціях з подвійним стеком, інакше буде збій). Поля ipFamilies та clusterIPs залежать від значення цього поля. Це поле буде очищено під час оновлення Service до типу ExternalName.

  Можливі значення переліку (enum):
  - `"PreferDualStack"` вказує, що цей сервіс віддає перевагу подвійному стеку, коли кластер налаштований для роботи з подвійним стеком. Якщо кластер не налаштований для роботи з подвійним стеком, сервісу буде призначено єдину IPFamily. Якщо IPFamily не встановлено в service.spec.ipFamilies, сервісу буде призначено стандартну IPFamily, налаштовану в кластері.
  - `"RequireDualStack"` вказує, що цей сервіс вимагає подвійного стеку. Використання IPFamilyPolicyRequireDualStack в кластері з одним стеком призведе до помилок валідації. IPFamilies (і їх порядок), призначені цьому сервісу, базуються на service.spec.ipFamilies. Якщо service.spec.ipFamilies не було надано, то воно буде призначено відповідно до того, як вони налаштовані в кластері. Якщо service.spec.ipFamilies має лише один запис, то альтернативна IPFamily буде додана apiserver.
  - `"SingleStack"` вказує, що цей сервіс зобовʼязаний мати єдину IPFamily. Призначена IPFamily базується на стандартній IPFamily, що використовується кластером, або на основі поля service.spec.ipFamilies.

- **clusterIP** (string)

  clusterIP — це IP-адреса Service, яка зазвичай призначається випадковим чином. Якщо адреса вказана вручну, знаходиться в діапазоні (згідно з конфігурацією системи) і не використовується, вона буде виділена Service; інакше створення Service не вдасться. Це поле не може бути змінено через оновлення, якщо тип поля також не змінюється на ExternalName (що вимагає, щоб це поле було порожнім) або тип поля змінюється з ExternalName (у цьому випадку це поле може бути зазначено опціонально, як описано вище). Допустимі значення: "None", порожній рядок (""), або дійсна IP-адреса. Встановлення цього значення в "None" створює "headless service" (без віртуальної IP-адреси), що корисно, коли потрібні прямі зʼєднання з точками доступу, і проксіювання не потрібне. Застосовується лише до типів ClusterIP, NodePort і LoadBalancer. Якщо це поле вказано під час створення Service типу ExternalName, створення не вдасться. Це поле буде очищено під час оновлення Service до типу ExternalName. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)

- **clusterIPs** ([]string)

  *Atomic: буде замінено під час злиття*

  ClusterIPs — це список IP-адрес, призначених Service, і зазвичай вони призначаються випадковим чином. Якщо адреса вказана вручну, знаходиться в діапазоні (згідно з конфігурацією системи) і не використовується, вона буде виділена Service; інакше створення Service не вдасться. Це поле не може бути змінено через оновлення, якщо тип поля також не змінюється на ExternalName (що вимагає, щоб це поле було порожнім) або тип поля змінюється з ExternalName (у цьому випадку це поле може бути зазначено опціонально, як описано вище). Допустимі значення: "None", порожній рядок (""), або дійсна IP-адреса. Встановлення цього значення на "None" створює "headless service" (без віртуальної IP-адреси), що корисно, коли потрібні прямі зʼєднання з точками доступу, і проксіювання не потрібно. Застосовується лише до типів ClusterIP, NodePort і LoadBalancer. Якщо це поле вказано під час створення Service типу ExternalName, створення не вдасться. Це поле буде очищено під час оновлення Service до типу ExternalName. Якщо це поле не вказано, воно буде ініціалізовано з поля clusterIP. Якщо це поле вказано, клієнти повинні переконатися, що clusterIPs[0] і clusterIP мають однакове значення.

  Це поле може містити максимум два записи (IP-адреси подвійного стека в будь-якому порядку). Ці IP-адреси повинні відповідати значенням поля ipFamilies. Поля clusterIPs та ipFamilies керуються полем ipFamilyPolicy. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)

- **externalIPs** ([]string)

  *Atomic: буде замінено під час злиття*

  externalIPs — це список IP-адрес, для яких вузли в кластері також будуть приймати трафік для цього Service. Ці IP-адреси не керуються Kubernetes. Користувач несе відповідальність за забезпечення того, щоб трафік надходив на вузол з цією IP-адресою. Загальний приклад — зовнішні балансувальники навантаження, які не є частиною системи Kubernetes.

- **sessionAffinity** (string)

  Підтримує "ClientIP" і "None". Використовується для підтримки спорідненості сеансів. Вмикає спорідненість сеансів на основі IP-адреси клієнта. Значення повинно бути ClientIP або None. Стандартне значення — None. Більше інформації: [https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)

  Можливі значення переліку (enum):
  - `"ClientIP"` на основі IP-адреси клієнта.
  - `"None"` без спорідненості сеансів.

- **loadBalancerIP** (string)

  Застосовується лише до типу Service: LoadBalancer. Ця функція залежить від того, чи підтримує базовий хмарний провайдер вказівку loadBalancerIP під час створення балансувальника навантаження. Це поле буде ігноруватися, якщо постачальник хмари не підтримує цю функцію. Застаріле: це поле було недостатньо описане, і його значення варіюється залежно від реалізацій. Використання його не є переносимим і може не підтримувати подвійний стек. Користувачам рекомендується використовувати анотації специфічні для реалізації, коли це можливо.

- **loadBalancerSourceRanges** ([]string)

  *Atomic: буде замінено під час злиття*

  Якщо вказано і підтримується платформою, це обмежить трафік через балансувальник навантаження постачальника хмари до вказаних IP-адрес клієнтів. Це поле буде ігноруватися, якщо постачальник хмари не підтримує цю функцію. Більше інформації: [https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/](/docs/tasks/access-application-cluster/create-external-load-balancer/)

- **loadBalancerClass** (string)

  loadBalancerClass — це клас реалізації балансувальника навантаження, до якого належить Service. Якщо вказано, значення цього поля повинно бути ідентифікатором у стилі мітки з опціональним префіксом, наприклад, "internal-vip" або "example.com/internal-vip". Імена без префіксів зарезервовані для кінцевих користувачів. Це поле можна встановити лише при створенні або оновленні Service до типу ʼLoadBalancerʼ. Якщо не встановлено, використовується стандартна реалізація балансувальника навантаження, сьогодні це зазвичай робиться через інтеграцію з постачальником хмари, але має застосовуватися до будь-якої стандартної реалізації. Якщо встановлено, вважається, що реалізація балансувальника навантаження стежить за Service з відповідним класом. Будь-яка стандартна реалізація балансувальника навантаження (наприклад, постачальники хмари) повинна ігнорувати Service, які встановлюють це поле. Це поле можна встановити лише при створенні або оновленні Service до типу ʼLoadBalancerʼ. Після встановлення його не можна змінити. Це поле буде очищено при оновленні Service до типу, відмінного від ʼLoadBalancerʼ.

- **externalName** (string)

  externalName — це зовнішнє посилання, яке механізми виявлення будуть повертати як псевдонім для цього Service (наприклад, запис DNS CNAME). Проксіювання не буде. Повинно бути вказано в нижньому регістрі відповідно до RFC-1123 hostname (https://tools.ietf.org/html/rfc1123) і вимагає `type` бути "ExternalName".

- **externalTrafficPolicy** (string)

  externalTrafficPolicy описує, як вузли розподіляють трафік, який вони отримують на одній з "зовнішньо спрямованих" адрес Service (NodePorts, ExternalIPs і LoadBalancer IPs). Якщо встановлено значення "Local", проксі налаштує Service так, що передбачається, що зовнішні балансувальники навантаження будуть піклуватися про балансування трафіку Service між вузлами, і тому кожен вузол буде доставляти трафік лише до локальних точок доступу вузла цього Service, не маскуючи IP-адресу джерела клієнта. (Трафік, помилково надісланий на вузол без точок доступу, буде відхилений.) Стандартне значення "Cluster" використовує стандартну поведінку маршрутизації до всіх точок доступу рівномірно (можливо, змінену топологією та іншими функціями). Зверніть увагу, що трафік, надісланий на External IP або LoadBalancer IP зсередини кластера, завжди буде мати семантику "Cluster", але клієнти, які надсилають на NodePort зсередини кластера, можуть враховувати політику трафіку під час вибору вузла.

  Можливі значення переліку (enum):
  - `"Cluster"` спрямовує трафік до всіх точок доступу.
  - `"Local"` зберігає вихідну IP-адресу трафіку, маршрутизуючи його тільки до точок доступу на тому ж вузлі, на якому був отриманий трафік (відкидаючи трафік, якщо немає локальних точок доступу).

- **internalTrafficPolicy** (string)

  InternalTrafficPolicy описує, як вузли розподіляють трафік, який вони отримують на ClusterIP. Якщо встановлено значення "Local", проксі вважатиме, що Podʼи хочуть спілкуватися лише з точками доступу Service на тому ж вузлі, що й Pod, відхиляючи трафік, якщо немає локальних точок доступу. Стандартне значення "Cluster" використовує стандартну поведінку маршрутизації до всіх точок доступу рівномірно (можливо, змінено топологією та іншими функціями).

  Можливі значення переліку (enum):
  - `"Cluster"` спрямовує трафік до всіх точок доступу.
  - `"Local"` маршрутизує трафік тільки до точок доступу на тому ж вузлі, на якому знаходиться клієнт (відкидаючи трафік, якщо немає локальних точок доступу).

- **healthCheckNodePort** (int32)

  healthCheckNodePort визначає порт вузла перевірки справності Service. Це застосовується лише при встановленні типу на LoadBalancer і зовнішньому трафіку політики на Local. Якщо вказане значення, знаходиться в діапазоні і не використовується, воно буде використано. Якщо не вказано, значення буде автоматично призначено. Зовнішні системи (наприклад, балансувальники навантаження) можуть використовувати цей порт, щоб визначити, чи містить певний вузол точки доступу для цього Service чи ні. Якщо це поле вказано під час створення Service, яка цього не потребує, створення не вдасться. Це поле буде очищено при оновленні Service, щоб більше не потребувати його (наприклад, зміна типу). Це поле не можна оновити після встановлення.

- **publishNotReadyAddresses** (boolean)

  publishNotReadyAddresses вказує, що будь-який агент, який має справу з точками доступу для цього Service, повинен ігнорувати будь-які індикатори готовності/не готовності. Основний випадок використання цього поля — для Headless Service для StatefulSet, щоб поширювати SRV DNS-записи для своїх Podʼів з метою їх виявлення. Контролери Kubernetes, які генерують ресурси Endpoints і EndpointSlice для Service, інтерпретують це як ознаку того, що всі точки доступу вважаються "готовими", навіть якщо самі Podʼи не готові. Агенти, які використовують тільки точки доступу, створені Kubernetes, через ресурси Endpoints або EndpointSlice, можуть безпечно передбачати цю поведінку.

- **sessionAffinityConfig** (SessionAffinityConfig)

  sessionAffinityConfig містить конфігурації сеансової спорідненості.

  <a name="SessionAffinityConfig"></a>
  *SessionAffinityConfig представляє конфігурації сеансової спорідненості.*

  - **sessionAffinityConfig.clientIP** (ClientIPConfig)

    clientIP містить конфігурації сеансової спорідненості на основі IP клієнта.

    <a name="ClientIPConfig"></a>
    *ClientIPConfig представляє конфігурації сеансової спорідненості на основі IP клієнта.*

    - **sessionAffinityConfig.clientIP.timeoutSeconds** (int32)

      timeoutSeconds задає час залипання сесії типу ClientIP у секундах. Значення повинно бути >0 && \<=86400 (для 1 дня), якщо ServiceAffinity == "ClientIP". Стандартне значення — 10800 (3 години).

- **allocateLoadBalancerNodePorts** (boolean)

  allocateLoadBalancerNodePorts визначає, чи будуть автоматично виділені NodePorts для Service з типом LoadBalancer. Стандартне значення — "true". Його можна встановити у "false", якщо балансувальник навантаження кластера не покладається на NodePorts. Якщо абонент запитує конкретні NodePorts (вказуючи значення), ці запити будуть виконані, незалежно від цього поля. Це поле можна встановити лише для Service з типом LoadBalancer і воно буде очищено, якщо тип буде змінено на будь-який інший тип.

- **trafficDistribution** (string)

  TrafficDistribution надає спосіб виразити вподобання щодо того, як розподіляти трафік до точок доступу сервісу. Реалізації можуть використовувати це поле як підказку, але не зобовʼязані суворо дотримуватися вказівок. Якщо поле не встановлене, реалізація застосує свою стандартну стратегію маршрутизації. Якщо встановлено значення "PreferClose", реалізації повинні надавати пріоритет точкам доступу, які знаходяться у тій самій зоні.

## ServiceStatus {#ServiceStatus}

ServiceStatus представляє поточний стан Service.

---

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення за ключем type зберігаються під час злиття*

  Поточний стан Service

  <a name="Condition"></a>
  *Condition містить деталі для одного аспекту поточного стану цього API ресурсу.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли стан змінився з одного на інший. Це має бути тоді, коли змінився основний стан. Якщо це невідомо, то можна використати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message — це повідомлення, зрозуміле людині, яке вказує на деталі про зміну стану. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, який вказує на причину останньоїзміни стану. Виробники специфічних типів станів можуть визначати очікувані значення та значення для цього поля, і чи вважаються значення гарантованим API. Значення має бути рядком у CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    тип стану у CamelCase або у форматі foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якої встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, то стан не актуальний стосовно поточного стану екземпляра.

- **loadBalancer** (LoadBalancerStatus)

  LoadBalancer містить поточний статус балансувальника навантаження, якщо він присутній.

  <a name="LoadBalancerStatus"></a>
  *LoadBalancerStatus представляє статус балансувальника навантаження.*

  - **loadBalancer.ingress** ([]LoadBalancerIngress)

    *Atomic: буде замінено під час злиття*

    Ingress — це список точок входу для балансувальника навантаження. Трафік, призначений для Service, має надходити до цих точок входу.

    <a name="LoadBalancerIngress"></a>
    *LoadBalancerIngress представляє стаnec точки входу балансувальника навантаження: трафік, призначений для Service, має надходити до точки входу.*

    - **loadBalancer.ingress.hostname** (string)

      Hostname встановлюється для точок входу балансувальника навантаження, які базуються на DNS (зазвичай балансувальники навантаження AWS)

    - **loadBalancer.ingress.ip** (string)

      IP встановлюється для точок входу балансувальника навантаження, які базуються на IP (зазвичай балансувальники навантаження GCE або OpenStack)

    - **loadBalancer.ingress.ipMode** (string)

      IPMode визначає, як поводиться IP балансувальника навантаження, і може бути вказаний лише тоді, коли вказане поле ip. Встановлення цього значення на "VIP" означає, що трафік доставляється до вузла з встановленим призначенням на IP та порт балансувальника навантаження. Встановлення цього значення на "Proxy" означає, що трафік доставляється до вузла або Pod з встановленим призначенням на IP вузла та порт вузла або на IP Podʼа та порт. Реалізації Service можуть використовувати цю інформацію для налаштування маршрутизації трафіку.

    - **loadBalancer.ingress.ports** ([]PortStatus)

      *Atomic: буде замінено під час злиття*

      Ports — це список портів Service. Якщо використовується, кожен порт, визначений у Service, повинен мати запис у цьому списку.

      <a name="PortStatus"></a>
      *PortStatus представляє стан помилки порту сервісу*

      - **loadBalancer.ingress.ports.port** (int32), обовʼязково

        Port — це номер порту Service, стан якого записаний тут.

      - **loadBalancer.ingress.ports.protocol** (string), обовʼязково

        Protocol — це протокол порту Service, стан якого записаний тут. Підтримувані значення: "TCP", "UDP", "SCTP".

        Можливі значення переліку (enum):
        - `"SCTP"` протокол SCTP.
        - `"TCP"` протокол TCP.
        - `"UDP"` протокол UDP.

      - **loadBalancer.ingress.ports.error** (string)

        Error — це запис проблеми з портом Service. Формат помилки має відповідати наступним правилам:

        - значення вбудованих помилок повинні бути визначені у цьому файлі та повинні використовувати CamelCase імена;
        - значення помилок, специфічних для хмарних провайдерів, повинні мати імена, які відповідають формату foo.example.com/CamelCase.

## ServiceList {#ServiceList}

ServiceList містить список Serviceʼів.

---

- **apiVersion**: v1

- **kind**: ServiceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>), обовʼязково

  Список Serviceʼів

## Операції {#operations}

---

### `get` отримати вказаний Service {#get-read-the-specified-service}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/services/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

401: Unauthorized

### `get` отримати статус вказаного Service {#get-read-the-status-of-the-specified-service}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/services/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Service {#list-list-or-watch-objects-of-kind-service}

#### HTTP запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/services

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../service-resources/service-v1#ServiceList" >}}">ServiceList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Service {#list-list-or-watch-objects-of-kind-service-1}

#### HTTP запит {#http-request-3}

GET /api/v1/services

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../service-resources/service-v1#ServiceList" >}}">ServiceList</a>): OK

401: Unauthorized

### `create` створення Service {#create-create-a-service}

#### HTTP запит {#http-request-4}

POST /api/v1/namespaces/{namespace}/services

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

201 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Created

202 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Service {#update-replace-the-specified-service}

#### HTTP запит {#http-request-5}

PUT /api/v1/namespaces/{namespace}/services/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

201 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Service {#update-replace-the-status-of-the-specified-service}

#### HTTP запит {#http-request-6}

PUT /api/v1/namespaces/{namespace}/services/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

201 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Service {#patch-partially-update-the-specified-service}

#### HTTP запит {#http-request-7}

PATCH /api/v1/namespaces/{namespace}/services/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#patch" >}}">patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

201 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Service {#patch-partially-update-the-status-of-the-specified-service}

#### HTTP запит {#http-request-8}

PATCH /api/v1/namespaces/{namespace}/services/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

201 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Created

401: Unauthorized

### `delete` видалення Service {#delete-delete-a-service}

#### HTTP запит {#http-request-9}

DELETE /api/v1/namespaces/{namespace}/services/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя Service

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#deleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): OK

202 (<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>): Accepted

401: Unauthorized

### `deletecollection` видалити колекцію Service {#deletecollection-delete-collection-of-services}

#### HTTP запит {#http-request-10}

DELETE /api/v1/namespaces/{namespace}/services

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#deleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../service-resources/service-v1#ServiceList" >}}">ServiceList</a>): OK

401: Unauthorized
