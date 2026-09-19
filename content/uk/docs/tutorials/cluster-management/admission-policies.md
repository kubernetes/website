---
title: Вивчаємо Validating та Mutating Admission Policies
content_type: tutorial
description: >-
  Використовуйте декларативні політики допуску для перевірки або зміни ресурсів під час допуску за допомогою Common Expression Language (CEL).
weight: 70
min-kubernetes-server-version: v1.32
translator: >
  [Андрій Головін](https://github.com/Andygol)
---
<!-- overview -->

Ця сторінка дозволяє вам спробувати декларативні _політики допуску_, які дають змогу використовувати Common Expression Language (CEL) для перевірки або зміни ресурсів.

Kubernetes {{< skew currentVersion >}} підтримує два види політик допуску:

- [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
- [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)

Цей посібник охоплює обидва види політик допуску.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Для визначення політик допуску ви повинні бути адміністратором кластеру. Переконайтеся, що ви маєте доступ адміністратора до кластеру, у якому ви навчаєтеся.

Для ValidatingAdmissionPolicy вам потрібно:

- Кластер, що працює версією 1.30 або пізніше.

Для MutatingAdmissionPolicy вам потрібно:

- Кластер, що працює версією 1.36 або пізніше. Якщо ви використовуєте стару версію Kubernetes, перевірте документацію для цієї версії.

## Що таке декларативні політики допуску? {#what-are-declarative-admission-policies}

Декларативні політики допуску пропонують декларативну, вбудовану альтернативу вебхукам допуску.

Використовуючи Common Expression Language (CEL) для оголошення правил політики, ці політики оцінюються безпосередньо в API-сервері.

Ці політики мають широкі можливості налаштування, що дозволяє авторам політик визначати логіку, яку адміністратори кластерів можуть параметризувати та застосовувати до ресурсів залежно від потреб.

### Типи API для політик допуску {#api-types-for-admission-policies}

Обидва види політик мають різні цілі.

ValidatingAdmissionPolicy призначена для _забезпечення обмежень_.

MutatingAdmissionPolicy призначена для _зміни ресурсів під час допуску_.

### Елементи політики {#policy-elements}

Кожна застосована політика завжди має об’єкт _політики_ (ValidatingAdmissionPolicy або MutatingAdmissionPolicy) та окремий обʼєкт _звʼязку_ (ValidatingAdmissionPolicyBinding або MutatingAdmissionPolicyBinding).

Ви також можете використовувати _параметри_, які є **необов’язковими**. Щоб дізнатися більше, дивіться [ресурси параметрів](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) (ValidatingAdmissionPolicy) або [ресурси параметрів](/docs/reference/access-authn-authz/mutating-admission-policy/#parameter-resources) (MutatingAdmissionPolicy).

Об’єкти політики описують абстрактну логіку політики за допомогою Common Expression Language (CEL). Наприклад, ValidatingAdmissionPolicy може забезпечувати обмеження кількості реплік або гарантувати наявність певних міток, тоді як MutatingAdmissionPolicy може змінювати ресурси, такі як додавання стандартної мітки до простору імен.

Об’єкти зв’язку пов’язують політику з вашим кластером та забезпечують обмеження. ValidatingAdmissionPolicyBinding або MutatingAdmissionPolicyBinding з’єднує політику з конкретними ресурсами. Якщо ви хочете застосувати політику лише до певної підгрупи ресурсів, привʼязки — це місце, де ви звужуєте область застосування політики (за допомогою `matchResources`).

Параметри дозволяють відокремити конфігурацію поведінки політики від її визначення. Ресурси параметрів посилаються на ресурси Kubernetes, доступні в API. Вони можуть бути вбудованими типами API (такими як ConfigMap) або можуть бути [власними ресурсами](/docs/concepts/extend-kubernetes/api-extension/custom-resources/). Привʼязка політики потім використовує `spec.paramRef` для посилання на фактичний ресурс параметра.

Якщо політика не потребує параметрів, ви залишаєте `spec.paramKind` не вказаним.

### Вирази CEL {#cel-expressions}

Обидва види політик спираються на мову виразів, відому як Common Expression Language (CEL). Прочитайте [CEL у Kubernetes](/docs/reference/using-api/cel/), щоб дізнатися більше.

Якщо ви новачок у CEL, потренуйтеся писати дуже простий вираз, такий як `false || true`. Ви можете тестувати вирази CEL у [CEL Playground](https://playcel.undistro.io).

### Дії політики {#policy-actions}

Кожна привʼязка політики допуску повинна вказувати одну або кілька дій, щоб оголосити, як політика застосовується.

#### ValidatingAdmissionPolicyBinding {#policy-actions-validating}

Для ValidatingAdmissionPolicyBinding підтримуваними `validationActions` є:

Audit
: Помилка перевірки включається до події аудиту для API-запиту.

Warn
: Помилка перевірки повідомляється клієнту запиту як [попередження](/blog/2020/09/03/warnings/).

Deny
: Помилка перевірки призводить до відхилення запиту.

Перевірка політики, яка завершується невдачею або виникає помилка, застосовується відповідно до цих дій. Помилки, визначені `failurePolicy`, застосовуються відповідно до цих дій лише якщо `failurePolicy` встановлено як `Fail` (або не вказано).

Дивіться [Анотації аудиту: помилки перевірки](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure) для отримання додаткової інформації про аудит політик.

Вам не дозволяється використовувати Deny і Warn разом, оскільки така комбінація дублювала б помилку перевірки в обох тілі відповіді API та HTTP-заголовку `Warning:`.

#### MutatingAdmissionPolicyBinding {#policy-actions-mutating}

Для MutatingAdmissionPolicyBinding дія завжди полягає у зміні об’єкта.

Ви можете використовувати JSON Patch або конфігурацію Kubernetes _apply configuration_.

## Забезпечення дотримання шляхом перевірки {#enforcement-through-validation}

Тепер спробуйте визначити ValidatingAdmissionPolicy.

Нижче наведено приклад ValidatingAdmissionPolicy, яка вимагає, щоб будь-який Deployment мав кілька реплік.

{{< code_sample language="yaml" file="access/manifest-admission-control/vap-min-replicas.yaml" >}}

`spec.validations` містить вирази CEL, які використовують [Common Expression Language (CEL)](https://github.com/google/cel-spec) для перевірки запиту. Якщо вираз оцінюється як false, перевірка застосовується відповідно до поля `spec.failurePolicy`.

Напишіть політику подібним чином та застосуйте її.

Або, якщо ви хочете застосувати готовий маніфест:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/vap-min-replicas.yaml
```

Сама по собі вона нічого не робить.

Ви можете спробувати створити Deployment з 0 або 1 реплікою; це працюватиме (хіба що інша політика завадить цьому).

---

Щоб зробити це, ви визначаєте ValidatingAdmissionPolicyBinding.

Виберіть простір імен, де ви будете застосовувати нову політику.

Нижче наведено приклад ValidatingAdmissionPolicyBinding для політики, яку ви створили:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: enforce-multiple-replicas-deployments-binding
spec:
  policyName: "enforce-multiple-replicas-deployments"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: default # змініть це, щоб відповідати простору імен, який ви використовуєте
```

{{< caution >}}
Будь-хто з повним/адміністративним доступом до простору імен може записувати його мітки. Це включає видалення мітки з простору імен.

Мітка `kubernetes.io/metadata.name` захищена, але якщо ви використовуєте іншу мітку, будьте обережні, щоб переконатися, що лише довірені користувачі мають спосіб видалити або редагувати цю мітку, яку ви обираєте.
{{< /caution >}}

Створіть маніфест на основі цього прикладу YAML (якщо ви використовуєте простір імен `default`, ви можете використовувати його без змін). Застосуйте маніфест за допомогою `kubectl apply`.

### Тестування політики {#test-admission-policy-validation}

Тепер перевірте політику. Спробуйте [створити Deployment](docs/tasks/run-application/run-stateless-application-deployment/) та потім зменшити його до 0 реплік за допомогою `kubectl scale`. Що відбувається?

Ви можете змінити ValidatingAdmissionPolicyBinding, щоб мати іншу дію перевірки, замість Deny. Якщо ви обираєте дію перевірки Warning і спробуєте зменшити Deployment до 0 реплік, що відбувається?

{{< note >}}
Якщо ви дійсно змінили налаштування ValidatingAdmissionPolicyBinding так, щоб воно лише попереджало користувачів, то тут є проблема…

Назва неправильна! Якщо ви змінюєте ValidatingAdmissionPolicyBinding або повʼязану ValidatingAdmissionPolicy так, що вона лише попереджає людей, ви повинні перевірити, чи також потрібно змінити назву політики. Ви б змінили назву, щоб переконатися, що назва не вводить людей в оману.
{{< /note >}}

### Це не впливає на наявні ресурси  {#limitation-admission-policy-validation}

Якщо у вас є Deployment з 0 або 1 реплікою, і ви змінюєте ValidatingAdmissionPolicyBinding назад до Deny-режиму, це не впливає на жодні наявні ресурси.

(Якщо ви захочете спробувати збільшити Deployments до принаймні 2 реплік, ви можете досягти цього іншим способом — наприклад, використовуючи {{< glossary_tooltip text="controller" term_id="controller" >}}).

На цьому все для ValidatingAdmissionPolicy. Тепер ви дізнаєтеся про MutatingAdmissionPolicies.

## Зміна ресурсів під час їх створення або зміни {#mutation}

Для цього прикладу уявіть, що ви хочете використовувати [Pod security admission](/docs/concepts/security/pod-security-admission/) для забезпечення того, щоб простори імен, окрім системних просторів імен, застосовували стандарт безпеки Podʼів.

Подібно до перевірки, ви можете створити MutatingAdmissionPolicy, яка може змінювати ресурси під час допуску. Тип API, який вам потрібно змінити, — це Namespace.

Ось MutatingAdmissionPolicy, яка робить частину цього:

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-baseline.yaml" >}}

{{< caution >}}
Ця політика встановлює **стандартне значення**. Той, хто має можливість оновлювати Namespace, може видалити мітку `pod-security.kubernetes.io/enforce` з простору імен.

Якщо ви не впевнені, що це означає, прочитайте документацію з [Безпеки](/docs/concepts/security/) або отримайте іншу пораду з питань безпеки.
{{< /caution >}}

Щоб застосувати цю політику:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/default-pod-security-baseline.yaml
```

MutatingAdmissionPolicyBinding потрібна для активації цієї політики; наприклад:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-baseline
spec:
  # назва MutatingAdmissionPolicy, яку застосовувати
  policyName: default-pod-security-baseline
```

### Тестування політики {#test-admission-policy-mutation}

Спробуйте створити новий простір імен з назвою `example`:

```shell
kubectl create ns example
```

Перевірте його мітки:

```shell
kubectl describe ns example
```

Навіть якщо ви не вказали рівень забезпечення безпеки Podʼів, мітка була встановлена.

Далі перевірте, чи можете знайти спосіб обійти налаштування безпеки. Створіть YAML-маніфест для іншого Namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: another-example
  labels:
    pod-security.kubernetes.io/enforce: privileged
```

Ви можете створити цей простір імен з локального маніфесту за допомогою `kubectl apply --server-side`. Чи спрацювало?

Так, і новий простір імен дозволяє запускати привілейовані Podʼи.

Ця політика допуску **не** була налаштована для перевірки або обмеження. Вона забезпечує стандартне значення, але ви можете встановити свій власний. Однак ви можете поєднати мутаційний допуск з валідаційним допуском як спосіб забезпечення чогось, але також зробити легким дотримання. (Посібник не пояснює це, але ви можете це зробити).

Забезпечення корисного стандартного значення означає, що коли люди нічого не встановлюють, вони отримують кращий результат, ніж просто побачити повідомлення про помилку. Уявіть, що у вас було б правило перевірки, щоб усі простори імен мали забезпечувати принаймні базовий стандарт. Той, хто не знав про це правило, міг би спробувати розгорнути щось і одразу побачити повідомлення про помилку, коли він спробує створити простір імен.

### Використання ресурсу параметра {#use-a-parameter-resource}

Ресурси параметрів дозволяють відокремити конфігурацію політики від її визначення. Політика може визначити `paramKind`, який описує групу, версію та тип (також відомий як GVK, від group, version, kind) ресурсу параметра. Потім прив’язка політики пов’язує цю політику з областю дії, до якої вона прив’язана, відповідно до налаштувань конкретного ресурсу параметра.

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-configurable.yaml" >}}

Ось зразок MutatingAdmissionPolicyBinding:

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-configurable
spec:
  # назва MutatingAdmissionPolicy, яку застосовувати
  policyName: default-pod-security-configurable

  # параметри для використання
  paramRef:
    # якщо ConfigMap відсутній або порожній, не встановлювати стандартне значення
    # (але дозволити створення простору імен)
    parameterNotFoundAction: Allow

    # де знайти параметр
    namespace: kube-system
    name: default-pod-security-standard
```

і ось зразок ConfigMap, який потрібно помістити до простору імен kube-system:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: default-pod-security-standard
data:
  default: baseline # також може бути "restricted"
```

Визначте обидва. Ви повинні **створити ConfigMap першим**; привʼязка очікує, що ресурс параметра вже існує (навіть якщо ви плануєте змінити його пізніше).

Тепер видаліть попередній MutatingAdmissionPolicyBinding:

```shell
kubectl delete mutatingadmissionpolicybindings/default-pod-security-baseline
```

і створіть новий простір імен:

```shell
kubectl create ns yet-another-example
```

```shell
kubectl describe ns yet-another-example
```

Чи були мітки встановлені за замовчуванням?

### Зміна параметра {#change-the-parameter}

```shell
# Ця команда запускає редактор, який дозволяє змінити .data.default для параметра
kubectl --namespace kube-system edit configmap default-pod-security-standard
```

Після зміни спробуйте створити ще один простір імен. Що відбувається?

## Очищення {#clean-up}

Щоб видалити створені ресурси, виконайте такі команди:

```bash
kubectl delete validatingadmissionpolices/enforce-multiple-replicas-deployments \
               validatingadmissionpolicybindings/enforce-multiple-replicas-deployments

kubectl delete mutatingadmissionpolicies/default-pod-security-baseline \
               mutatingadmissionpolicybindings/default-pod-security-baseline

kubectl delete mutatingadmissionpolicies/default-pod-security-configurable \
               mutatingadmissionpolicybindings/default-pod-security-configurable

kubectl --namespace kube-system delete configmaps/default-pod-security-standard

kubectl delete namespaces/example namespaces/another-example namespaces/yet-another-example
```

Якщо ви створили будь-які тестові Podʼи або тестові простори імен, очистьте їх також.
