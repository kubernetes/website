---
title: Клас виконання
content_type: concept
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Ця сторінка описує ресурс RuntimeClass та механізм вибору середовища виконання.

RuntimeClass — це функція для вибору конфігурації середовища виконання контейнерів. Конфігурація середовища виконання контейнерів використовується для запуску контейнерів у Pod.

<!-- body -->

## Обґрунтування {#motivation}

Ви можете встановити різне значення RuntimeClass для різних Podʼів, щоб забезпечити баланс між продуктивністю та безпекою. Наприклад, якщо частина вашого завдання вимагає високого рівня підтвердження захищеності інформації, ви можете вибрати планування цих Podʼів так, щоб вони працювали в середовищі виконання контейнерів, яке використовує апаратну віртуалізацію. Таким чином ви скористаєтеся додатковою ізоляцією альтернативного середовища коштом деякого додаткового навантаження.

Ви також можете використовувати RuntimeClass для запуску різних Podʼів з однаковим середовищем виконання, але з різними налаштуваннями.

## Налаштування {#setup}

1. Налаштуйте впровадження CRI на вузлах (залежить від середовища виконання).
2. Створіть відповідні ресурси RuntimeClass.

### 1. Налаштуйте впровадження CRI на вузлах {#1-configure-the-cri-implementation-on-nodes}

Конфігурації, доступні через RuntimeClass, залежать від конкретної реалізації інтерфейсу контейнера (CRI). Для отримання інструкцій щодо налаштування перегляньте відповідну документацію ([нижче](#cri-configuration)) для вашої реалізації CRI.

{{< note >}}
Стандартно RuntimeClass передбачає однорідну конфігурацію вузла в усьому кластері (що означає, що всі вузли налаштовані однаковим чином щодо контейнерних середовищ). Щоб підтримувати різнорідні конфігурації вузлів, див. [Планування](#scheduling) нижче.
{{< /note >}}

Кожна конфігурація має відповідний `handler`, на який посилається RuntimeClass. Handler повинен бути дійсним [імʼям DNS-мітки](/docs/concepts/overview/working-with-objects/names/#dns-label-names).

### 2. Створіть відповідні ресурси RuntimeClass {#2-create-the-corresponding-runtimeclass-resources}

Кожна конфігурація, налаштована на кроці 1, повинна мати асоційованій `handler`, який ідентифікує конфігурацію. Для кожного handler створіть обʼєкт RuntimeClass.

Ресурс RuntimeClass наразі має всього 2 значущі поля: імʼя RuntimeClass (`metadata.name`) та handler (`handler`). Визначення обʼєкта виглядає наступним чином:

```yaml
# RuntimeClass визначений у групі API node.k8s.io
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # Імʼя, за яким буде викликано RuntimeClass.
  # RuntimeClass - ресурс без простору імен.
  name: myclass
# Імʼя відповідної конфігурації CRI
handler: myconfiguration
```

Імʼя обʼєкта RuntimeClass повинно бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
Рекомендується обмежити операції запису RuntimeClass (create/update/patch/delete), щоб вони були доступні тільки адміністраторам кластера. Це, як правило, типове значення. Докладніше див. [Огляд авторизації](/docs/reference/access-authn-authz/authorization/).
{{< /note >}}

## Використання {#usage}

Після налаштування RuntimeClass для кластера, ви можете вказати `runtimeClassName` в специфікації Podʼа, щоб використовувати його. Наприклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Це доручить kubelet використовувати вказаний RuntimeClass для запуску цього Podʼа. Якщо зазначений RuntimeClass не існує або CRI не може виконати відповідний handler, Pod увійде в термінальну [фазу](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `Failed`. Шукайте відповідну [подію](/docs/tasks/debug/debug-application/debug-running-pod/) для отримання повідомлення про помилку.

Якщо `runtimeClassName` не вказано, буде використовуватися стандартний обробник, що еквівалентно поведінці при вимкненні функції RuntimeClass.

### Конфігурація CRI {#cri-configuration}

Докладніше про налаштування CRI див. у [Встановлення CRI](/docs/setup/production-environment/container-runtimes/).

#### {{< glossary_tooltip term_id="containerd" >}}

Обробники Runtime налаштовуються через конфігурацію containerd за шляхом
`/etc/containerd/config.toml`. Дійсні обробники налаштовуються в розділі runtimes:

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

Докладніше див. у [документації з конфігурації](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) containerd:

#### {{< glossary_tooltip term_id="cri-o" >}}

Обробники Runtime налаштовуються через конфігурацію CRI-O за шляхом `/etc/crio/crio.conf`. Дійсні обробники налаштовуються в таблиці [crio.runtime](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```toml
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Докладніше див. у [документації з конфігурації](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) CRI-O.

## Планування {#scheduling}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Зазначаючи поле `scheduling` для RuntimeClass, ви можете встановити обмеження, щоб забезпечити, що Podʼи, які працюють із цим RuntimeClass, плануються на вузли, які його підтримують. Якщо `scheduling` не встановлено, припускається, що цей RuntimeClass підтримується всіма вузлами.

Щоб гарантувати, що Podʼи потрапляють на вузли, які підтримують конкретний RuntimeClass, цей набір вузлів повинен мати спільні мітки, які потім обираються полем `runtimeclass.scheduling.nodeSelector`. NodeSelector RuntimeClass обʼєднується з nodeSelector Pod під час допуску, фактично беручи перетин множини вузлів, обраних кожним.

Якщо підтримувані вузли позначені, щоб завадити запуску інших Podʼів з іншим RuntimeClass на вузлі, ви можете додати `tolerations` до RuntimeClass. Як із `nodeSelector`, tolerations обʼєднуються з tolerations Podʼа у доступі, фактично беручи обʼєднання множини вузлів, які влаштовують всіх.

Щоб дізнатися більше про налаштування селектора вузла і tolerations, див. [Призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/).

### Надмірність Podʼів {#pod-overhead}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Ви можете вказати ресурси _overhead_, що повʼязані із запуском Pod. Вказівка надмірності дозволяє кластеру (включаючи планувальник) враховувати це при прийнятті рішень про Podʼи та ресурси.

Надмірність Podʼа визначається через поле `overhead` в RuntimeClass. За допомогою цього поля ви можете вказати надмірність запуску Podʼів, що використовують цей RuntimeClass, та забезпечити облік цих надмірностей в Kubernetes.

## {{% heading "whatsnext" %}}

- [Дизайн RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [Дизайн планування RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- Читайте про концепцію [Надмірності Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/)
- [Дизайн функції PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
