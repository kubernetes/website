---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "NetworkPolicy"
content_type: "api_reference"
description: "NetworkPolicy описує, який мережевий трафік дозволено для набору Podʼів."
title: "NetworkPolicy"
weight: 4
auto_generated: false
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## NetworkPolicy {#NetworkPolicy}

NetworkPolicy описує, який мережевий трафік дозволений для набору Podʼів

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: NetworkPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicySpec" >}}">NetworkPolicySpec</a>)

  spec представляє специфікацію бажаної поведінки для цього NetworkPolicy.

## NetworkPolicySpec {#NetworkPolicySpec}

NetworkPolicySpec надає специфікацію NetworkPolicy

<hr>

- **podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  podSelector вибирає Podʼи, до яких застосовується цей обʼєкт NetworkPolicy. Масив правил застосовується до будь-яких Podʼів, вибраних цим полем. Порожній селектор відповідає всім подам у просторі імен політики. Кілька мережевих політик можуть вибирати той самий набір Podʼів. У цьому випадку правила ingress для кожного з них поєднуються. Це поле НЕ є необовʼязковим і слідує стандартним семантикам вибору міток. Це поле є необовʼязковим. Якщо воно не вказане, стандартно використовується порожній селектор.

- **policyTypes** ([]string)

  *Atomic: буде замінено під час злиття*

  policyTypes — це список типів правил, до яких відноситься NetworkPolicy. Дійсні опції включають [“Ingress"], [“Egress"] або [“Ingress", “Egress"]. Якщо це поле не вказано, воно буде визначено стандартно на основі наявності правил ingress або egress; політики, які містять розділ egress, вважаються такими, що впливають на egress, а всі політики (незалежно від того, чи містять вони розділ ingress) вважаються такими, що впливають на ingress. Якщо ви хочете написати політику тільки для egress, ви повинні явно вказати policyTypes [“Egress"]. Аналогічно, якщо ви хочете написати політику, яка визначає, що egress не дозволений, ви повинні вказати значення policyTypes, яке включає “Egress" (оскільки така політика не включатиме розділ egress і стандартно буде просто [“Ingress" ]). Це поле є рівнем бета у версії 1.8.

- **ingress** ([]NetworkPolicyIngressRule)

  *Atomic: буде замінено під час злиття*

  ingress  — це список правил ingress, які застосовуються до вибраних Podʼів. Трафік дозволено до Podʼа, якщо немає мережевих політик, які вибирають Pod (і кластерна політика інакше дозволяє трафік), АБО якщо джерелом трафіку є локальний вузол Podʼа, АБО якщо трафік відповідає принаймні одному правилу ingress серед усіх обʼєктів NetworkPolicy, чий podSelector відповідає Podʼу. Якщо це поле порожнє, ця NetworkPolicy не дозволяє жодного трафіку (і стандартно слугує виключно для того, щоб забезпечити ізоляцію вибраних Podʼів).

  <a name="NetworkPolicyIngressRule"></a>
  *NetworkPolicyIngressRule описує конкретний набір трафіку, який дозволено до Podʼів, вибраних podSelector у NetworkPolicySpec. Трафік повинен відповідати як ports, так і from.*

  - **ingress.from** ([]NetworkPolicyPeer)

    *Atomic: буде замінено під час злиття*

    from — це список джерел, яким дозволено доступ до Podʼів, вибраних для цього правила. Елементи в цьому списку комбінуються за допомогою логічної операції OR. Якщо це поле порожнє або відсутнє, це правило збігається з усіма джерелами (трафік не обмежений за джерелом). Якщо це поле присутнє і містить принаймні один елемент, це правило дозволяє трафік лише у разі відповідності принаймні одному елементу зі списку from.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer описує однорангового учасника для дозволу трафіку до/від. Допускаються лише певні комбінації полів.*

    - **ingress.from.ipBlock** (IPBlock)

      ipBlock визначає політику для конкретного IPBlock. Якщо це поле встановлено, то жодне інше поле не може бути встановлене.

      <a name="IPBlock"></a>
      *IPBlock описує конкретний CIDR (наприклад, “192.168.1.0/24",“2001:db8::/64"), який дозволено для Podʼів, вибраних podSelector у NetworkPolicySpec. Поле except описує CIDR, які не повинні бути включені до цього правила.*

      - **ingress.from.ipBlock.cidr** (string), обовʼязково

        cidr — це рядок, що представляє IPBlock. Дійсні приклади: “192.168.1.0/24" або “2001:db8::/64".

      - **ingress.from.ipBlock.except** ([]string)

        *Atomic: буде замінено під час злиття*

        except — це перелік CIDR, які не повинні бути включені до IPBlock. Дійсні приклади: “192.168.1.0/24" або “2001:db8::/64". Значення except будуть відхилені, якщо вони виходять за межі діапазону cidr.

    - **ingress.from.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector вибирає простори імен за допомогою кластерних міток. Це поле слідує стандартним семантикам вибору міток; якщо присутнє, але порожнє, воно вибирає всі простори імен.

      Якщо також встановлено podSelector, тоді NetworkPolicyPeer загалом вибирає Podʼи, які відповідають podSelector у просторах імен, вибраних namespaceSelector. Інакше він вибирає всі Podʼи в просторах імен, вибраних namespaceSelector.

    - **ingress.from.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector — це вибір міток, що вибирає Podʼи. Це поле слідує стандартним семантикам вибору міток; якщо присутнє, але порожнє, воно вибирає всі Podʼи.

      Якщо також встановлено namespaceSelector, тоді NetworkPolicyPeer загалом вибирає Podʼи, які відповідають podSelector у просторах імен, вибраних NamespaceSelector. Інакше він вибирає Podʼи, які відповідають podSelector у власному просторі імен політики.

  - **ingress.ports** ([]NetworkPolicyPort)

    *Atomic: буде замінено під час злиття*

    ports — це список портів, які повинні бути доступні у Podʼах, вибраних для цього правила. Кожен елемент у цьому списку комбінується за допомогою логічної операції OR. Якщо це поле порожнє або відсутнє, це правило збігається з усіма портами (трафік не обмежений за портом). Якщо це поле присутнє і містить принаймні один елемент, тоді це правило дозволяє трафік лише у разі відповідності принаймні одному порту зі списку.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort описує порт, на якому дозволено трафік*

    - **ingress.ports.port** (IntOrString)

      port представляє порт на заданому протоколі. Це може бути числовий або іменований порт на Podʼі. Якщо це поле не вказане, це збігається з усіма іменами та номерами портів. Якщо присутнє, то відповідає лише трафік на вказаному протоколі ТА порті.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

    - **ingress.ports.endPort** (int32)

      endPort вказує, що діапазон портів від port до endPort, якщо встановлено, включно, повинен бути дозволений політикою. Це поле не може бути визначене, якщо поле port не визначене або якщо поле port визначене як іменований (string) порт. Поле endPort повинно бути рівним або більшим за port.

    - **ingress.ports.protocol** (string)

      protocol представляє протокол (TCP, UDP або SCTP), якому повинен відповідати трафік. Якщо не вказано, це поле стандартно встановлюється у TCP.

      Можливі значення переліку (enum):
      - `"SCTP"` є протоколом SCTP.
      - `"TCP"` є протоколом TCP.
      - `"UDP"` є протоколом UDP.

- **egress** ([]NetworkPolicyEgressRule)

  *Atomic: буде замінено під час злиття*

  egress — це список правил egress, які застосовуються до вибраних Podʼів. Вихідний трафік дозволений, якщо немає мережевих політик, які вибирають Pod (і кластерна політика інакше дозволяє трафік), АБО якщо трафік відповідає принаймні одному правилу egress серед усіх обʼєктів NetworkPolicy, чий podSelector відповідає Podʼу. Якщо це поле порожнє, ця NetworkPolicy обмежує весь вихідний трафік (і слугує виключно для того, щоб стандартно забезпечити ізоляцію вибраних Podʼів). Це поле є рівнем бета у версії 1.8.

  <a name="NetworkPolicyEgressRule"></a>
  *NetworkPolicyEgressRule описує конкретний набір трафіку, який дозволено від Podʼів, вибраних podSelector у NetworkPolicySpec. Трафік повинен відповідати як ports, так і to. Цей тип є рівнем бета у версії 1.8.*

  - **egress.to** ([]NetworkPolicyPeer)

    *Atomic: буде замінено під час злиття*

    to — це список пунктів призначення для вихідного трафіку Podʼів, вибраних для цього правила. Елементи в цьому списку комбінуються за допомогою логічної операції OR. Якщо це поле порожнє або відсутнє, це правило збігається з усіма пунктами призначення (трафік не обмежений за пунктом призначення). Якщо це поле присутнє і містить принаймні один елемент, це правило дозволяє трафік лише у разі відповідності принаймні одному елементу зі списку to.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer описує однорангового учасника для дозволу трафіку до/від. Допускаються лише певні комбінації полів.*

    - **egress.to.ipBlock** (IPBlock)

      ipBlock визначає політику для конкретного IPBlock. Якщо це поле встановлено, то жодне інше поле не може бути встановлене.

      <a name="IPBlock"></a>
      *IPBlock описує конкретний CIDR (наприклад, “192.168.1.0/24",“2001:db8::/64"), який дозволено для Podʼів, вибраних podSelector у NetworkPolicySpec. Поле except описує CIDR, які не повинні бути включені до цього правила.*

      - **egress.to.ipBlock.cidr** (string), обовʼязково

        cidr — це рядок, що представляє IPBlock. Дійсні приклади: “192.168.1.0/24" або “2001:db8::/64".

      - **egress.to.ipBlock.except** ([]string)

        *Atomic: буде замінено під час злиття*

        except — це перелік CIDR, які не повинні бути включені до IPBlock. Дійсні приклади: “192.168.1.0/24" або “2001:db8::/64". Значення except будуть відхилені, якщо вони виходять за межі діапазону cidr.

    - **egress.to.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector вибирає простори імен за допомогою кластерних міток. Це поле слідує стандартним семантикам вибору міток; якщо присутнє, але порожнє, воно вибирає всі простори імен.

      Якщо також встановлено podSelector, тоді NetworkPolicyPeer загалом вибирає Podʼи, які відповідають podSelector у просторах імен, вибраних namespaceSelector. Інакше він вибирає всі Podʼи в просторах імен, вибраних namespaceSelector.

    - **egress.to.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector — це вибір міток, що вибирає Podʼи. Це поле слідує стандартним семантикам вибору міток; якщо присутнє, але порожнє, воно вибирає всі Podʼи.

      Якщо також встановлено namespaceSelector, тоді NetworkPolicyPeer загалом вибирає Podʼи, які відповідають podSelector у просторах імен, вибраних NamespaceSelector. Інакше він вибирає Podʼи, які відповідають podSelector у власному просторі імен політики.

  - **egress.ports** ([]NetworkPolicyPort)

    *Atomic: буде замінено під час злиття*

    ports — це список портів призначення для вихідного трафіку. Кожен елемент у цьому списку комбінується за допомогою логічної операції OR. Якщо це поле порожнє або відсутнє, це правило збігається з усіма портами (трафік не обмежений за портом). Якщо це поле присутнє і містить принаймні один елемент, тоді це правило дозволяє трафік лише у разі відповідності принаймні одному порту зі списку.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort описує порт, на якому дозволено трафік*

    - **egress.ports.port** (IntOrString)

      port представляє порт на заданому протоколі. Це може бути числовий або іменований порт у Podʼі. Якщо це поле не вказане, воно збігається з усіма іменами та номерами портів. Якщо присутнє, то відповідає лише трафік на вказаному протоколі ТА порті.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

    - **egress.ports.endPort** (int32)

      endPort вказує, що діапазон портів від port до endPort, якщо встановлено, включно, повинен бути дозволений політикою. Це поле не може бути визначене, якщо поле port не визначене або якщо поле port визначене як іменований (string) порт. Поле endPort повинно бути рівним або більшим за port.

    - **egress.ports.protocol** (string)

      protocol представляє протокол (TCP, UDP або SCTP), якому повинен відповідати трафік. Якщо не вказано, це поле стандартно встановлюється у TCP.

      Можливі значення переліку (enum):
      - `"SCTP"` є протоколом SCTP.
      - `"TCP"` є протоколом TCP.
      - `"UDP"` є протоколом UDP.

## NetworkPolicyList {#NetworkPolicyList}

NetworkPolicyList — це список обʼєктів NetworkPolicy.

---

- **apiVersion**: networking.k8s.io/v1

  Вказує версію API.

- **kind**: NetworkPolicyList

  Вказує тип ресурсу, в цьому випадку NetworkPolicyList.

- **metadata** (<a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="#NetworkPolicy">NetworkPolicy</a>), обовʼязково

  items — це список обʼєктів NetworkPolicy.

## Операції {#operations}

---

### `get` отримату ввказану NetworkPolicy {#get-read-the-specified-networkpolicy}

#### HTTP запит {#http-request}

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя NetworkPolicy

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу NetworkPolicy {#list-list-or-watch-objects-of-kind-networkpolicy}

#### HTTP запит {#http-request-1}

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

#### Параметри {#parameters-1}

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

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу {#list-list-or-watch-objects-of-kind-networkpolicy-1}

#### HTTP запит {#http-request-2}

GET /apis/networking.k8s.io/v1/networkpolicies

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

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

### `create` створення NetworkPolicy {#create-create-a-networkpolicy}

#### HTTP запит {#http-request-3}

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Accepted

401: Unauthorized

### `update` заміна вказаної NetworkPolicy {#update-replace-the-specified-networkpolicy}

#### HTTP запит {#http-request-4}

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя NetworkPolicy

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної NetworkPolicy {#patch-partially-update-the-specified-networkpolicy}

#### HTTP запит {#http-request-5}

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя NetworkPolicy

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

### `delete` видалення NetworkPolicy {#delete-delete-a-networkpolicy}

#### HTTP запит {#http-request-6}

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя NetworkPolicy

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції NetworkPolicy {#deletecollection-delete-collection-of-networkpolicy}

#### HTTP запит {#http-request-7}

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

#### Параметри {#parameters-7}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
