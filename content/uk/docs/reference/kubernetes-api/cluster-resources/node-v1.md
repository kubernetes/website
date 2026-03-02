---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Node"
content_type: "api_reference"
description: "Node — робочий вузол в Kubernetes."
title: "Node"
weight: 8
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Node {#Node}

Node є робочим вузлом в Kubernetes. Кожен вузол буде мати унікальний ідентифікатор у кеші (тобто в etcd).

---

- **apiVersion**: v1

- **kind**: Node

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані об’єкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/node-v1#NodeSpec" >}}">NodeSpec</a>)

  Spec визначає поведінку вузла. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/node-v1#NodeStatus" >}}">NodeStatus</a>)

  Останній за часом спостереження статус вузла. Заповнюється системою. Тільки для читання. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NodeSpec {#NodeSpec}

NodeSpec описує атрибути, з якими створюється вузол.

---

- **configSource** (NodeConfigSource)

  Застаріло: Раніше використовувалося для вказівки джерела конфігурації вузла для функції DynamicKubeletConfig. Цю функцію вилучено.

  <a name="NodeConfigSource"></a>
  *NodeConfigSource вказує джерело конфігурації вузла. Тільки одне підполе (без урахування метаданих) має бути не нульовим. Цей API є застарілим з версії 1.22*

  - **configSource.configMap** (ConfigMapNodeConfigSource)

    ConfigMap є посиланням на ConfigMap вузла.

    <a name="ConfigMapNodeConfigSource"></a>
    *ConfigMapNodeConfigSource містить інформацію для посилання на ConfigMap як джерело конфігурації для вузла. Цей API є застарілим з версії 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*

    - **configSource.configMap.kubeletConfigKey** (string), обовʼязково

      KubeletConfigKey визначає, який ключ посилання ConfigMap відповідає структурі KubeletConfiguration. Це поле є обовʼязковим у всіх випадках.

    - **configSource.configMap.name** (string), обовʼязково

      Name — metadata.name посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

    - **configSource.configMap.namespace** (string), обовʼязково

      Namespace — metadata.namespace посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

    - **configSource.configMap.resourceVersion** (string)

      ResourceVersion — metadata.ResourceVersion посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

    - **configSource.configMap.uid** (string)

      UID є metadata.UID посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязково в Node.Status.

- **externalID** (string)

  Застаріло. Не всі kubelets встановлюватимуть це поле. Видаліть поле після версії 1.13. див.: https://issues.k8s.io/61966

- **podCIDR** (string)

  PodCIDR представляє діапазон IP-адрес Podʼів, призначених вузлу.

- **podCIDRs** ([]string)

  *Set: унікальні значення будуть збережені під час злиття*

  podCIDRs представляє діапазони IP-адрес, призначених вузлу для використання Podʼами на цьому вузлі. Якщо це поле вказане, перший запис повинен відповідати полю podCIDR. Воно може містити не більше одного значення для кожного з IPv4 та IPv6.

- **providerID** (string)

  Ідентифікатор вузла, призначений постачальником хмарних послуг у форматі: \<ProviderName>://\<ProviderSpecificNodeID>

- **taints** ([]Taint)

  *Atomic: буде замінено під час злиття*

  Якщо вказано, задає taints вузла.

  <a name="Taint"></a>
  *Вузол, до якого прив’язано цей Taint, має "ефект" на будь-який Pod, який не толерує Taint.*

  - **taints.effect** (string), обовʼязково

    Обовʼязково. Ефект taint на Podʼи, які не толерують taint. Допустимі ефекти: NoSchedule, PreferNoSchedule і NoExecute.

    Можливі значення переліку (enum):
    - `"NoExecute"` Виселяти всі вже запущені podʼи, які не толерантні до taint. Наразі застосовується NodeController.
    - `"NoSchedule"` Не дозволяти новим podʼам плануватися на вузол, якщо вони не толерані до taint, але дозволяти всім podʼам, переданим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним podʼам продовжувати роботу. Застосовується планувальником.
    - `"PreferNoSchedule"` Як і TaintEffectNoSchedule, але планувальник намагається не планувати нові podʼи на вузол, а не повністю забороняти планувати нові podsʼи на вузол. Застосовується планувальником.

  - **taints.key** (string), обовʼязково

    Обовʼязково. Ключ taint, який буде застосовано до вузла.

  - **taints.timeAdded** (Time)

    TimeAdded представляє час, коли taint було додано.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **taints.value** (string)

    Значення taint, що відповідає ключу taint.

- **unschedulable** (boolean)

  Unschedulable контролює можливість планування нових Podʼів на вузлі. Стандартно вузол є доступним для планування. Докладніше: [https://kubernetes.io/docs/concepts/nodes/node/#manual-node-administration](/docs/concepts/nodes/node/#manual-node-administration)

## NodeStatus {#NodeStatus}

NodeStatus — це інформація про поточний статус вузла.

---

- **addresses** ([]NodeAddress)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Список адрес, доступних вузлу. Запитується у постачальника хмарних послуг, якщо доступно. Докладніше: [https://kubernetes.io/docs/reference/node/node-status/#addresses](/docs/reference/node/node-status/#addresses) Примітка: Це поле визначено як доступне для злиття, але ключ злиття не є достатньо унікальним, що може призвести до пошкодження даних при злитті. Абоненти повинні використовувати патч для повної заміни. Див. приклад на https://pr.k8s.io/79391. Споживачі повинні припускати, що адреси можуть змінюватися протягом усього життя вузла. Однак є деякі винятки, коли це може бути неможливо, наприклад, Podʼи, які наслідують адресу вузла у своєму статусі, або споживачі API (status.hostIP).

  <a name="NodeAddress"></a>
  *NodeAddress містить інформацію про адресу вузла.*

  - **addresses.address** (string), обовʼязково

    Адреса вузла.

  - **addresses.type** (string), обовʼязково

    Тип адреси вузла, один із Hostname, ExternalIP або InternalIP.

- **allocatable** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Allocatable представляє ресурси вузла, доступні для планування. Стандартне значення — Capacity.

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Capacity представляє загальні ресурси вузла. Докладніше: [https://kubernetes.io/docs/reference/node/node-status/#capacity](/docs/reference/node/node-status/#capacity)

- **conditions** ([]NodeCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Conditions — це масив поточних спостережуваних станів вузла. Докладніше: [https://kubernetes.io/docs/reference/node/node-status/#condition](/docs/reference/node/node-status/#condition)

  <a name="NodeCondition"></a>
  *NodeCondition містить інформацію про стан вузла.*

  - **conditions.status** (string), обовʼязково

    Статус стану, один із True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану вузла.

  - **conditions.lastHeartbeatTime** (Time)

    Останній час отримання оновлення про певний стан.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastTransitionTime** (Time)

    Останній час переходу стану від одного статусу до іншого.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, що вказує на деталі останнього переходу.

  - **conditions.reason** (string)

    (коротко) причина останнього переходу стану.

- **config** (NodeConfigStatus)

  Статус конфігурації, призначеної вузлу через функцію динамічної конфігурації Kubelet.

  <a name="NodeConfigStatus"></a>
  *NodeConfigStatus описує статус конфігурації, призначеної Node.Spec.ConfigSource.*

  - **config.active** (NodeConfigSource)

    Active повідомляє про контрольовану конфігурацію, яку вузол активно використовує. Active представляє або поточну версію призначеної конфігурації, або поточну останню відому правильну конфігурацію, залежно від того, чи виникає помилка при спробі використати призначену конфігурацію.

    <a name="NodeConfigSource"></a>
    *NodeConfigSource вказує джерело конфігурації вузла. Тільки одне підполе (без урахування метаданих), має бути не нульовим. Цей API є застарілим з версії 1.22*

    - **config.active.configMap** (ConfigMapNodeConfigSource)

      ConfigMap є посиланням на ConfigMap вузла.

      <a name="ConfigMapNodeConfigSource"></a>
      *ConfigMapNodeConfigSource містить інформацію для посилання на ConfigMap як джерело конфігурації для вузла. Цей API є застарілим з версії 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*

      - **config.active.configMap.kubeletConfigKey** (string), обовʼязково

        KubeletConfigKey визначає, який ключ посилання ConfigMap відповідає структурі KubeletConfiguration. Це поле є обовʼязковим у всіх випадках.

      - **config.active.configMap.name** (string), обовʼязково

        Name — metadata.name посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.active.configMap.namespace** (string), обовʼязково

        Namespace — metadata.namespace посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.active.configMap.resourceVersion** (string)

        ResourceVersion — metadata.ResourceVersion посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

      - **config.active.configMap.uid** (string)

        UID — metadata.UID посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

  - **config.assigned** (NodeConfigSource)

    Assigned повідомляє про контрольовану конфігурацію, яку вузол спробує використовувати. Коли Node.Spec.ConfigSource оновлюється, вузол зберігає асоційоване конфігураційне навантаження на локальний диск разом із записом, що вказує на призначену конфігурацію. Вузол звертається до цього запису, щоб вибрати свою контрольовану конфігурацію, і повідомляє про цей запис в Assigned. Assigned оновлюється в статусі лише після того, як запис збережено на диск. Коли Kubelet перезавантажується, він намагається зробити призначену конфігурацію активною конфігурацією, завантажуючи та перевіряючи контрольоване навантаження, ідентифіковане Assigned.

    <a name="NodeConfigSource"></a>
    *NodeConfigSource вказує джерело конфігурації вузла. Тільки одне підполе (без урахування метаданих), має бути не нульовим. Цей API є застарілим з версії 1.22*

    - **config.assigned.configMap** (ConfigMapNodeConfigSource)

      ConfigMap є посиланням на ConfigMap вузла

      <a name="ConfigMapNodeConfigSource"></a>
      *ConfigMapNodeConfigSource містить інформацію для посилання на ConfigMap як джерело конфігурації для вузла. Цей API є застарілим з версії 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*

      - **config.assigned.configMap.kubeletConfigKey** (string), обовʼязково

        KubeletConfigKey визначає, який ключ посилання ConfigMap відповідає структурі KubeletConfiguration. Це поле є обовʼязковим у всіх випадках.

      - **config.assigned.configMap.name** (string), обовʼязково

        Name — metadata.name посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.assigned.configMap.namespace** (string), обовʼязково

        Namespace — metadata.namespace посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.assigned.configMap.resourceVersion** (string)

        ResourceVersion — metadata.ResourceVersion посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

      - **config.assigned.configMap.uid** (string)

        UID — metadata.UID посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

  - **config.error** (string)

    Error описує будь-які проблеми під час узгодження Spec.ConfigSource з Active конфігурацією. Помилки можуть виникати, наприклад, при спробі зберегти Spec.ConfigSource у локальний запис Assigned, при спробі зберегти повʼязане конфігураційне навантаження, при спробі завантажити або перевірити Assigned конфігурацію тощо. Помилки можуть виникати на різних етапах синхронізації конфігурації. Ранні помилки (наприклад, помилки завантаження або збереження) не призведуть до повернення до LastKnownGood і можуть бути виправлені під час повторних спроб Kubelet. Пізні помилки (наприклад, помилки завантаження або перевірки збереженої конфігурації) призведуть до повернення до LastKnownGood. У останньому випадку зазвичай можна вирішити помилку, виправивши конфігурацію, призначену в Spec.ConfigSource. Додаткову інформацію для налагодження можна знайти, шукаючи повідомлення про помилку в лозі Kubelet. Error є описом стану помилки, зрозумілим людині; машини можуть перевірити, чи порожній Error, але не повинні покладатися на стабільність тексту Error у різних версіях Kubelet.

  - **config.lastKnownGood** (NodeConfigSource)

    LastKnownGood повідомляє про контрольовану конфігурацію, до якої вузол повернеться при виникненні помилки під час спроби використати Assigned конфігурацію. Assigned конфігурація стає LastKnownGood, коли вузол визначає, що Assigned конфігурація стабільна і правильна. Це наразі реалізовано як 10-хвилинний період перевірки, що починається, коли локальний запис Assigned конфігурації оновлюється. Якщо Assigned конфігурація є Active наприкінці цього періоду, вона стає LastKnownGood. Зазначте, що якщо Spec.ConfigSource скидається до nil (використовуйте стандартні локальні налаштування), LastKnownGood також негайно скидається до nil, оскільки локальна стандартна конфігурація завжди вважається правильною. Ви не повинні робити припущення про метод вузла щодо визначення стабільності та правильності конфігурації, оскільки це може змінюватися або ставати налаштовуваним у майбутньому.

    <a name="NodeConfigSource"></a>
    *NodeConfigSource вказує джерело конфігурації вузла. Тільки одне підполе (без урахування метаданих), має бути не нульовим. Цей API є застарілим з версії 1.22*

    - **config.lastKnownGood.configMap** (ConfigMapNodeConfigSource)

      ConfigMap є посиланням на ConfigMap вузла.

      <a name="ConfigMapNodeConfigSource"></a>
      *ConfigMapNodeConfigSource містить інформацію для посилання на ConfigMap як джерело конфігурації для вузла. Цей API є застарілим з версії 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*

      - **config.lastKnownGood.configMap.kubeletConfigKey** (string), обовʼязково

        KubeletConfigKey визначає, який ключ посилання ConfigMap відповідає структурі KubeletConfiguration. Це поле є обовʼязковим у всіх випадках.

      - **config.lastKnownGood.configMap.name** (string), обовʼязково

        Name — metadata.name посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.lastKnownGood.configMap.namespace** (string), обовʼязково

        Namespace — metadata.namespace посилання ConfigMap. Це поле є обовʼязковим у всіх випадках.

      - **config.lastKnownGood.configMap.resourceVersion** (string)

        ResourceVersion — metadata.ResourceVersion посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

      - **config.lastKnownGood.configMap.uid** (string)

        UID — metadata.UID посилання ConfigMap. Це поле заборонено в Node.Spec, і обовʼязкове в Node.Status.

- **daemonEndpoints** (NodeDaemonEndpoints)

  Endpoints демонів, що працюють на вузлі.

  <a name="NodeDaemonEndpoints"></a>
  *NodeDaemonEndpoints містить порти, відкриті демонами, що працюють на вузлі.*

  - **daemonEndpoints.kubeletEndpoint** (DaemonEndpoint)

    Endpoint, на якому слухає Kubelet.

    <a name="DaemonEndpoint"></a>
    *DaemonEndpoint містить інформацію про один Endpoint демона.*

    - **daemonEndpoints.kubeletEndpoint.Port** (int32), обовʼязково

      Номер порту даного Endpoint.

- **declaredFeatures** ([]string)

  *Atomic: буде замінено під час злиття*

  DeclaredFeatures представляє функції, повʼязані з функціональними можливостями, які оголошені вузлом.

- **features** (NodeFeatures)

  Features описує набір функцій, реалізованих реалізацією CRI.

  <a name="NodeFeatures"></a>
  *NodeFeatures описує набір функцій, реалізованих реалізацією CRI. Функції, що містяться в NodeFeatures, повинні залежати лише від реалізації CRI, незалежно від обробників під час виконання.*

  - **features.supplementalGroupsPolicy** (boolean)

    SupplementalGroupsPolicy встановлюється в `true`, якщо середовище виконання підтримує SupplementalGroupsPolicy та ContainerUser.

- **images** ([]ContainerImage)

  *Atomic: буде замінено під час злиття*

  Список контейнерних образів на цьому вузлі.

  <a name="ContainerImage"></a>
  *Опис контейнерного образу*

  - **images.names** ([]string)

    *Atomic: буде замінено під час злиття*

    Імена, відомі для образу. Наприклад, ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]

  - **images.sizeBytes** (int64)

    Розмір образу у байтах.

- **nodeInfo** (NodeSystemInfo)

  Набір id/uuid для унікальної ідентифікації вузла. Докладніше: [https://kubernetes.io/docs/reference/node/node-status/#info](/docs/reference/node/node-status/#info)

  <a name="NodeSystemInfo"></a>
  *NodeSystemInfo є набором id/uuid для унікальної ідентифікації вузла.*

  - **nodeInfo.architecture** (string), обовʼязково

    Архітектура, повідомлена вузлом.

  - **nodeInfo.bootID** (string), обовʼязково

    Boot ID, повідомлений вузлом.

  - **nodeInfo.containerRuntimeVersion** (string), обовʼязково

    Версія контейнерного середовища, повідомлена вузлом через віддалений API середовища (наприклад, containerd://1.4.2).

  - **nodeInfo.kernelVersion** (string), обовʼязково

    Версія ядра, повідомлена вузлом з 'uname -r' (наприклад, 3.16.0-0.bpo.4-amd64).

  - **nodeInfo.kubeProxyVersion** (string), обовʼязково

    Застаріле: Версія KubeProxy, повідомлена вузлом.

  - **nodeInfo.kubeletVersion** (string), обовʼязково

    Версія Kubelet, повідомлена вузлом.

  - **nodeInfo.machineID** (string), обовʼязково

    MachineID, повідомлений вузлом. Для унікальної ідентифікації машини в кластері це поле є переважним. Докладніше у man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html

  - **nodeInfo.operatingSystem** (string), обовʼязково

    Операційна система, повідомлена вузлом.

  - **nodeInfo.osImage** (string), обовʼязково

    Образ ОС, повідомлений вузлом з /etc/os-release (наприклад, Debian GNU/Linux 7 (wheezy)).

  - **nodeInfo.systemUUID** (string), обовʼязково

    SystemUUID, повідомлений вузлом. Для унікальної ідентифікації машини переважним є MachineID. Це поле специфічне для хостів Red Hat https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid

  - **nodeInfo.swap** (NodeSwapStatus)

    Інформація про Swap, яку повідомляє Вузол.

    <a name="NodeSwapStatus"></a>
    *NodeSwapStatus представляє інформацію про памʼять підкачки.*

    - **nodeInfo.swap.capacity** (int64)

      Зангальний обсяг свопу в байта.

- **phase** (string)

  NodePhase є недавно спостережуваною фазою життєвого циклу вузла. Докладніше: [https://kubernetes.io/docs/concepts/nodes/node/#phase](/docs/concepts/nodes/node/#phase). Поле ніколи не заповнюється і тепер є застарілим.

  Можливі значення переліку (enum):
  - `"Pending"` означає, що вузол був створений/доданий системою, але не налаштований.
  - `"Running"` означає, що вузол був налаштований і на ньому працюють компоненти Kubernetes.
  - `"Terminated"` означає, що вузол був видалений з кластера.

- **runtimeHandlers** ([]NodeRuntimeHandler)

  *Atomic: буде замінено під час злиття*

  Доступні обробники середовища виконання.

  <a name="NodeRuntimeHandler"></a>
  *NodeRuntimeHandler — це набір інформації про обробники середовища виконання.*

  - **runtimeHandlers.features** (NodeRuntimeHandlerFeatures)

    Підтримувані функції.

    <a name="NodeRuntimeHandlerFeatures"></a>
    *NodeRuntimeHandlerFeatures — це набір функцій, реалізованих обробником середовища виконання.*

    - **runtimeHandlers.features.recursiveReadOnlyMounts** (boolean)

      RecursiveReadOnlyMounts встановлюється в `true`, якщо обробник середовища виконання підтримує RecursiveReadOnlyMounts.

    - **runtimeHandlers.features.userNamespaces** (boolean)

      UserNamespaces встановлюється в `true`, якщо обробник середовища виконання підтримує UserNamespaces, включаючи підтримку для томів.

  - **runtimeHandlers.name** (string)

    Назва обробника середовища виконання. Порожнє для стандартного обробника середовища виконання.

- **volumesAttached** ([]AttachedVolume)

  *Atomic: буде замінено під час злиття*

  Список томів, підключених до вузла.

  <a name="AttachedVolume"></a>
  *AttachedVolume описує том, підключений до вузла*

  - **volumesAttached.devicePath** (string), обовʼязково

    DevicePath представляє шлях пристрою, де том має бути доступний.

  - **volumesAttached.name** (string), обовʼязково

    Імʼя підключеного тому.

- **volumesInUse** ([]string)

  *Atomic: буде замінено під час злиття*

  Список підключених томів, що використовуються (змонтовані) вузлом.

## NodeList {#NodeList}

NodeList є повним списком усіх вузлів, які зареєстровані у панелі управління.

---

- **apiVersion**: v1

- **kind**: NodeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>), обовʼязково

  Список вузлів

## Операції {#operations}

---

### `get` отримати вказаний Node {#get-read-the-specified-node}

#### HTTP запит {#http-request}

GET /api/v1/nodes/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

### `get` отримати статус вказаного Node {#get-read-status-of-the-specified-node}

#### HTTP запит {#http-request-1}

GET /api/v1/nodes/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Node {#list-or-watch-objects-of-kind-node}

#### HTTP запит {#http-request-2}

GET /api/v1/nodes

#### Параметри {#parameters-2}

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

200 (<a href="{{< ref "../cluster-resources/node-v1#NodeList" >}}">NodeList</a>): OK

401: Unauthorized

### `create` створення Node {#create-create-a-node}

#### HTTP запит {#http-request-3}

POST /api/v1/nodes

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

202 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Node {#update-replace-the-specified-node}

#### HTTP запит {#http-request-4}

PUT /api/v1/nodes/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Node {#update-replace-status-of-the-specified-node}

#### HTTP запит {#http-request-5}

PUT /api/v1/nodes/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Node {#patch-partially-update-the-specified-node}

#### HTTP запит {#http-request-6}

PATCH /api/v1/nodes/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Node {#patch-partially-update-status-of-the-specified-node}

#### HTTP запит {#http-request-7}

PATCH /api/v1/nodes/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

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

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

### `delete` видалення Node {#delete-delete-a-node}

#### HTTP запит {#http-request-8}

DELETE /api/v1/nodes/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя Node

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Node {#deletecollection-delete-collection-of-node}

#### HTTP запит {#http-request-9}

DELETE /api/v1/nodes

#### Параметри {#parameters-9}

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
