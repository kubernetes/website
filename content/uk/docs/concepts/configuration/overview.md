---
reviewers:
- mikedanese
title: Поради щодо конфігурації
content_type: концепція
weight: 10
---

<!-- overview -->
Цей документ виділяє та консолідує найкращі практики конфігурації, які представлені в документації користувача, документації для початківців та прикладах.

Це живий документ. Якщо ви подумаєте про щось, що не включено до цього списку, але може бути корисним іншим користувачам, будь ласка, не соромтеся подати тікет або надіслати PR.

<!-- body -->

## Загальні поради щодо конфігурації {#general-configuration-tips}

- При створенні конфігурацій вкажіть останню стабільну версію API.

- Файли конфігурації повинні зберігатися у системі контролю версій, перш ніж бути перенесеними в кластер. Це дозволяє швидко відкочувати зміну конфігурації у разі необхідності. Це також сприяє перестворенню та відновленню кластера.

- Пишіть файли конфігурації за допомогою YAML, а не JSON. Хоча ці формати можна використовувати взаємозамінно практично в усіх сценаріях, YAML зазвичай є більш зручним для користувачів.

- Гуртуйте повʼязані обʼєкти в один файл, якщо це має сенс. Одним файлом часто легше
  керувати, ніж кількома. Podʼивіться на файл [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml) як приклад використання цього синтаксису.

- Також зверніть увагу, що багато команд `kubectl` можна виконувати з теками. Наприклад, ви можете застосувати `kubectl apply` в теці з файлами конфігурації.

- Не вказуйте типові значення без потреби: проста, мінімальна конфігурація зменшить ймовірність помилок.

- Додайте описи обʼєктів в анотації, щоб забезпечити кращий самоаналіз.

{{< note >}}
У специфікації булевих значень в [YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744) була введена переломну зміну у порівнянні з [YAML 1.1](https://yaml.org/spec/1.1/#id864510). Це відома [проблема](https://github.com/kubernetes/kubernetes/issues/34146) в Kubernetes. YAML 1.2 визнає лише **true** та **false** як дійсні булеві значення, тоді як YAML 1.1 також приймає **yes**, **no**, **on**, та **off** як булеві значення. Хоча Kubernetes використовує YAML [парсери](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024), які в основному сумісні з YAML 1.1, однак використання **yes** або **no** замість **true** або **false** у маніфесті YAML може призвести до непередбачених помилок або поведінки. Щоб уникнути цієї проблеми, рекомендується завжди використовувати **true** або **false** для булевих значень у маніфестах YAML, та використовувати лапки для будь-яких рядків, які можуть бути сплутані з булевими значеннями, таких як **"yes"** або **"no"**.

Крім булевих значень, є додаткові зміни у специфікаціях між версіями YAML. Будь ласка, зверніться до [Зміни в специфікації YAML](https://spec.yaml.io/main/spec/1.2.2/ext/changes) документації для отримання повного списку.
{{< /note >}}

## "Чисті" Podʼи проти ReplicaSets, Deployments та Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}

- Не використовуйте "чисті" Podʼи (тобто Podʼи, не повʼязані з [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) або [Deployment](/docs/concepts/workloads/controllers/deployment/)), якщо можна уникнути цього. "Чисті" Podʼи не будуть переплановані в разі відмови вузла.

  Використання Deployment, який як створює ReplicaSet для забезпечення того, що потрібна кількість Podʼів завжди доступна, так і вказує стратегію для заміни Podʼів (таку як [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), майже завжди є переважним варіантом на відміну від створення Podʼів безпосередньо, за винятком деяких явних сценаріїв [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy). Також може бути прийнятним використання [Job](/docs/concepts/workloads/controllers/job/).

## Services

- Створіть [Service](/docs/concepts/services-networking/service/) перед створенням відповідного робочого навантаження (Deployments або ReplicaSets), і перед будь-якими створенням робочих навантажень, які мають до нього доступ. Коли Kubernetes запускає контейнер, він надає змінні середовища, які вказують на всі Serviceʼи, які працювали під час запуску контейнера. Наприклад, якщо існує Service з іменем `foo`, то всі контейнери отримають наступні змінні у своєму початковому середовищі:

  ```shell
  FOO_SERVICE_HOST=<хост, на якому працює Service>
  FOO_SERVICE_PORT=<порт, на якому працює Service>
  ```

  *Це передбачає вимоги щодо черговості* — будь-який `Service`, до якого `Pod` хоче отримати доступ, повинен бути створений перед створенням цього `Pod`ʼу, бо змінні середовища не будуть заповнені. DNS не має такого обмеження.

- Необовʼязкова (хоча настійно рекомендована) [надбудова для кластера](/docs/concepts/cluster-administration/addons/) — це DNS-сервер. DNS-сервер спостерігає за Kubernetes API за появою нових `Serviceʼів` та створює набір DNS-записів для кожного з них. Якщо DNS було активовано в усьому кластері, то всі `Podʼи` повинні мати можливість автоматичного використовувати назви `Serviceʼів`.

- Не вказуйте `hostPort` для Podʼа, якщо це не є абсолютно необхідним. Коли ви привʼязуєте Pod до `hostPort`, це обмежує місця, де може бути запланований Pod, оскільки кожна комбінація <`hostIP`, `hostPort`, `protocol`> повинна бути унікальною. Якщо ви не вказуєте явно `hostIP` та `protocol`, Kubernetes використовуватиме `0.0.0.0` як типовий `hostIP` та `TCP` як типовий `protocol`.

  Якщо вам потрібен доступ до порту лише для налагодження, ви можете використовувати [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls) або [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  Якщо вам дійсно потрібно використовувати порт Подʼа на вузлі, розгляньте можливість використання [NodePort](/docs/concepts/services-networking/service/#type-nodeport) Service перед використанням `hostPort`.

- Уникайте використання `hostNetwork`, з тих самих причин, що й `hostPort`.

- Використовуйте [headless Service](/docs/concepts/services-networking/service/#headless-services) (які мають `ClusterIP` `None`) для виявлення Service, коли вам не потрібен балансувальник навантаження `kube-proxy`.

## Використання міток {#using-labels}

- Визначайте та використовуйте [мітки](/docs/concepts/overview/working-with-objects/labels/), які ідентифікують **семантичні атрибути** вашого застосунку або Deployment, такі як `{ app.kubernetes.io/name: MyApp, tier: frontend, phase: test, deployment: v3 }`. Ви можете використовувати ці мітки для вибору відповідних Podʼів для інших ресурсів; наприклад, Service, який вибирає всі Podʼи з `tier: frontend`, або всі складові `phase: test` з `app.kubernetes.io/name: MyApp`. Подивіться застосунок [гостьова книга](https://github.com/kubernetes/examples/tree/master/guestbook/) для прикладів застосування такого підходу.

  Service може охоплювати кілька Deploymentʼів, пропускаючи мітки, специфічні для релізу, від його селектора. Коли вам потрібно оновити робочий Service без простою, використовуйте [Deployment](/docs/concepts/workloads/controllers/deployment/).

  Бажаний стан обʼєкта описується Deploymentʼом, і якщо зміни до його специфікації будуть *застосовані*, контролер Deployment змінює фактичний стан на бажаний з контрольованою швидкістю.

- Використовуйте [загальні мітки Kubernetes](/docs/concepts/overview/working-with-objects/common-labels/) для загальних випадків використання. Ці стандартизовані мітки збагачують метадані таким чином, що дозволяють інструментам, включаючи `kubectl` та [інфопанель (dashboard)](/docs/tasks/access-application-cluster/web-ui-dashboard), працювати в сумісний спосіб.

- Ви можете маніпулювати мітками для налагодження. Оскільки контролери Kubernetes (такі як ReplicaSet) та Service отримують збіг з Podʼами за допомогою міток селектора, видалення відповідних міток з Podʼа зупинить його від обробки контролером або від обслуговування трафіку Serviceʼом. Якщо ви видалите мітки наявного Podʼа, його контролер створить новий Pod, щоб зайняти його місце. Це корисний спосіб налагоджувати раніше "справний" Pod в "карантинному" середовищі. Щоб інтерактивно видаляти або додавати мітки, використовуйте [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).

## Використання kubectl {#using-kubectl}

- Використовуйте `kubectl apply -f <directory>`. Виконання цієї команди шукає конфігурацію Kubernetes у всіх файлах `.yaml`, `.yml` та `.json` у `<directory>` та передає її до `apply`.

- Використовуйте селектори міток для операцій `get` та `delete` замість конкретних назв об'єктів. Подивіться розділи про [селектори міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors) та [ефективне використання міток](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively).

- Використовуйте `kubectl create deployment` та `kubectl expose`, щоб швидко створити Deployment з одним контейнером та Service. Подивіться [Використання Service для доступу до застосунку в кластері](/docs/tasks/access-application-cluster/service-access-application-cluster/) для прикладу.
