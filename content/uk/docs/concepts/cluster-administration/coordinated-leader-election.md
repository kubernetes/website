---
title: Координовані вибори лідера
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}} містить бета-можливість, яка дозволяє компонентам {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} детерміновано обирати лідера через _координовані вибори лідера_. Це корисно для дотримання обмежень версійної розбіжності Kubernetes під час оновлення кластера. Наразі єдиною вбудованою стратегією вибору є `OldestEmulationVersion`, яка надає перевагу лідеру з найнижчою версією емуляції, потім за бінарною версією, а потім за позначкою часу створення.

## Увімкнення координованих виборів лідера {#enabling-coordinated-leader-election}

Переконайтеся, що під час запуску {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}} ввімкнено функціональну можливість [`CoordinatedLeaderElection`](/docs/reference/command-line-tools-reference/feature-gates/#CoordinatedLeaderElection) і що ввімкнено групу API `coordination.k8s.io/v1beta1`.

Це можна зробити, встановивши прапорці `--feature-gates="CoordinatedLeaderElection=true"` та `--runtime-config="coordination.k8s.io/v1beta1=true"`.

## Конфігурація компонентів {#component-configuration}

За умови, що ви ввімкнули функціональну можливість `CoordinatedLeaderElection` _та_ групу API `coordination.k8s.io/v1beta1`, сумісні компоненти панелі управління автоматично використовують API LeaseCandidate і Lease, щоб обирати лідера за потреби.

У Kubernetes {{< skew currentVersion >}} два компоненти панелі управління (kube-controller-manager і kube-scheduler) автоматично використовують координовані вибори лідера, коли ввімкнено функціональну можливість і групу API.

## Вибір лідера для компонентів Kubernetes {#leader-selection-for-kubernetes-components}

Kubernetes використовує [Lease API](/docs/concepts/architecture/leases/) для виборів лідера серед кількох екземплярів одного компонента панелі управління в кластері високої доступності, таких як `kube-controller-manager` або `kube-scheduler`.

[Lease](/docs/concepts/architecture/leases/) діє як легке розподілене блокування, збережене [API-сервером Kubernetes](/docs/reference/command-line-tools-reference/kube-apiserver/). Всі запущені екземпляри компонента спостерігають або періодично читають відповідний обʼєкт Lease, щоб визначити, який екземпляр наразі виконує роль лідера.

[Lease API](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) визначає, зокрема, такі поля:

`holderIdentity`
: ідентичність поточного лідера (наприклад, назва Podʼа або рядок на основі імені хоста).

`acquireTime`
: час, коли було отримано лідерство.

`renewTime`
: час останнього оновлення лідером.

`leaseDurationSeconds`
: період дії Lease (кандидати мають чекати цей час плюс невеликий запас часу, перш ніж намагатися отримати прострочений Lease).

`leaseTransitions`
: лічильник того, скільки разів лідерство переходило до іншого екземпляра.

Ці поля показують, який екземпляр утримує лідерство та як довго це лідерство залишається дійсним.

Коли [Lease](/docs/concepts/architecture/leases/) не існує або його термін дії минув (поточний час > `renewTime` + `leaseDurationSeconds`), екземпляри-кандидати намагаються оновити Lease, записавши свою ідентичність. Kubernetes покладається на _оптимістичне керування паралелізмом_ через `resourceVersion` обʼєкта: через невідповідність версій під час одночасних спроб успішним є лише одне оновлення. Екземпляр, чиє оновлення прийнято, стає _лідером_.

Kubernetes використовує API [LeaseCandidate](/docs/reference/kubernetes-api/cluster-resources/lease-candidate-v1beta1/) для керування виборами лідера. Компоненти панелі управління, такі як `kube-controller-manager` та `kube-scheduler`, реєструють свою роль кандидата, створюючи обʼєкти LeaseCandidate, які відстежують усі екземпляри, що змагаються за лідерство, і містять метадані, зокрема ідентичність кандидата, бінарну версію та версію емуляції.

Під час виборів кандидати координують свої дії через спільний [Lease](/docs/concepts/architecture/leases/). Панель управління Kubernetes гарантує, що лише один кандидат успішно отримує [Lease](/docs/concepts/architecture/leases/) і стає _лідером_, а всі інші залишаються послідовниками. Якщо поточний _лідер_ не оновлює [Lease](/docs/concepts/architecture/leases/) протягом вибраного часу очікування, інші кандидати змагаються за лідерство й обирають нового _лідера_.

Після обрання лідер періодично оновлює свій Lease, змінюючи поле `renewTime` (наприклад, виконуючи оновлення кожні `leaseDurationSeconds` ÷ 2, щоб уникнути конфліктів, коли термін дії [Lease](/docs/concepts/architecture/leases/) ось-ось закінчиться). Поки оновлення відбуваються до закінчення терміну дії Lease, поточний екземпляр-лідер зберігає лідерство. Якщо лідер аварійно завершує роботу, стає недоступним або припиняє оновлювати Lease, термін дії цього Lease минає. Інші справні екземпляри виявляють прострочений Lease і намагаються провести нові вибори.

Цей механізм гарантує, що хоча для стабільності та відновлення може працювати кілька реплік компонента, _лише один екземпляр одночасно активно виконує завдання керування_, а інші залишаються в режимі очікування, стежать за Lease і готові швидко перейняти роботу в разі потреби.
