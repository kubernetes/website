---
title: Вивчаємо Validating та Mutating Admission Policies
content_type: tutorial
description: >-
  Використовуйте декларативні політики допуску для перевірки або зміни ресурсів під час допуску за допомогою Common Expression Language (CEL).
weight: 70
min-kubernetes-server-version: v1.32
---
<!-- overview -->

Ця сторінка дозволяє вам спробувати декларативні _політики допуску_, які дають змогу використовувати Common Expression Language (CEL) для перевірки або зміни ресурсів.

Kubernetes {{< skew currentVersion >}} підтримує два види політик допуску:

- [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
- [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)

Цей посібник охоплює обидва види політик допуску.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Щоб визначати політики допуску, ви маєте бути адміністратором кластера. Переконайтеся, що маєте доступ адміністратора до кластера, на якому навчаєтеся.

Для ValidatingAdmissionPolicy вам потрібно:

* Кластер версії 1.30 або новішої.

Для MutatingAdmissionPolicy вам потрібно:

* Кластер версії 1.36 або новішої.

Щоб перевірити версію, виконайте `kubectl version`. Якщо ви використовуєте старішу версію Kubernetes, перегляньте документацію для цієї версії.

## Що таке декларативні політики допуску? {#what-are-declarative-admission-policies}

Декларативні політики допуску пропонують декларативну, вбудовану альтернативу вебхукам допуску.

Використовуючи Common Expression Language (CEL) для оголошення правил політики, ці політики оцінюються безпосередньо в API-сервері.

Ці політики мають широкі можливості налаштування, що дозволяє авторам політик визначати логіку, яку адміністратори кластерів можуть параметризувати та застосовувати до ресурсів залежно від потреб.

### Типи API для політик допуску {#api-types-for-admission-policies}

Ці два типи політик мають різне призначення.

ValidatingAdmissionPolicy призначена для _забезпечення обмежень_.

MutatingAdmissionPolicy призначена для _зміни ресурсів під час допуску_.

### Елементи політики {#policy-elements}

Кожна застосована політика завжди має обʼєкт _політики_ (ValidatingAdmissionPolicy або MutatingAdmissionPolicy) та окремий обʼєкт _привʼязки_ (ValidatingAdmissionPolicyBinding або MutatingAdmissionPolicyBinding).

Ви також можете використовувати _параметри_, які є **необовʼязковими**. Докладніше див. [ресурси параметрів](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) (ValidatingAdmissionPolicy) або [ресурси параметрів](/docs/reference/access-authn-authz/mutating-admission-policy/#parameter-resources) (MutatingAdmissionPolicy).

Обʼєкти політики описують абстрактну логіку політики за допомогою Common Expression Language (CEL). Наприклад, ValidatingAdmissionPolicy може обмежувати кількість реплік або гарантувати наявність певних міток, тоді як MutatingAdmissionPolicy може змінювати ресурси, наприклад додавати типову мітку до простору імен.

Обʼєкти привʼязки повʼязують політику з вашим кластером і визначають область її дії. ValidatingAdmissionPolicyBinding або MutatingAdmissionPolicyBinding зʼєднує політику з конкретними ресурсами. Якщо ви хочете застосовувати політику лише до певної підмножини ресурсів, саме в привʼязці ви звужуєте область дії політики (за допомогою `matchResources`).

Параметри дають змогу відокремити конфігурацію поведінки політики від її визначення. Ресурси параметрів — це ресурси Kubernetes, доступні в API. Це можуть бути вбудовані типи API (як-от ConfigMap) або [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/). Привʼязка політики потім використовує `spec.paramRef`, щоб посилатися на фактичний ресурс параметра.

Якщо політика не потребує параметрів, ви не вказуєте `spec.paramKind`.

### Вирази CEL {#cel-expressions}

Обидва види політик спираються на мову виразів, відому як Common Expression Language (CEL). Прочитайте [CEL у Kubernetes](/docs/reference/using-api/cel/), щоб дізнатися більше.

Якщо ви новачок у CEL, потренуйтеся писати дуже простий вираз, як-от `false || true`. Тестувати вирази CEL можна в [CEL Playground](https://playcel.undistro.io).

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

Невдала перевірка політики або помилка, що виникла, обробляються відповідно до цих дій. Збої, визначені `failurePolicy`, обробляються відповідно до цих дій, лише якщо `failurePolicy` встановлено в `Fail` (або не вказано).

Докладніше про логування аудиту для політик див. у розділі [Анотації аудиту: помилки перевірки](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure).

Не можна використовувати Deny і Warn разом, оскільки така комбінація дублювала б помилку перевірки і в тілі відповіді API, і в HTTP-заголовку `Warning:`.

#### MutatingAdmissionPolicyBinding {#policy-actions-mutating}

Для MutatingAdmissionPolicyBinding дія завжди полягає у зміні обʼєкта.

Ви можете використовувати JSON Patch або _apply configuration_ Kubernetes.

## Забезпечення дотримання шляхом перевірки {#enforcement-through-validation}

Тепер спробуйте визначити ValidatingAdmissionPolicy.

Нижче наведено приклад ValidatingAdmissionPolicy, яка вимагає, щоб будь-який Deployment мав кілька реплік.

{{< code_sample language="yaml" file="access/manifest-admission-control/vap-min-replicas.yaml" >}}

`spec.validations` містить вирази CEL, які використовують [Common Expression Language (CEL)](https://github.com/google/cel-spec) для перевірки запиту. Якщо вираз оцінюється як false, перевірка застосовується відповідно до поля `spec.failurePolicy`.

Напишіть подібну політику й застосуйте її.

Або, якщо ви хочете застосувати готовий маніфест:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/vap-min-replicas.yaml
```

Сама по собі вона нічого не робить.

Ви можете спробувати створити Deployment з 0 або 1 реплікою; це працюватиме (хіба що інша політика завадить цьому).

---

Щоб вона запрацювала, визначте ValidatingAdmissionPolicyBinding.

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

Мітка `kubernetes.io/metadata.name` захищена, але якщо ви використовуєте іншу мітку, подбайте, щоб видаляти або редагувати вибрану вами мітку могли лише довірені користувачі.
{{< /caution >}}

Створіть маніфест на основі цього прикладу YAML (якщо ви використовуєте простір імен `default`, ви можете використовувати його без змін). Застосуйте маніфест за допомогою `kubectl apply`.

### Тестування політики {#test-admission-policy-validation}

Тепер перевірте політику. Спробуйте [створити Deployment](/docs/tasks/run-application/run-stateless-application-deployment/), а потім масштабувати його до 0 реплік за допомогою `kubectl scale`. Що відбувається?

Ви можете змінити ValidatingAdmissionPolicyBinding, щоб використовувати іншу дію перевірки замість Deny. Якщо вибрати дію перевірки Warning і спробувати масштабувати Deployment до 0 реплік, що станеться?

{{< note >}}
Якщо ви дійсно змінили налаштування ValidatingAdmissionPolicyBinding так, щоб воно лише попереджало користувачів, то тут є проблема…

Назва неправильна! Якщо ви змінюєте ValidatingAdmissionPolicyBinding або повʼязану ValidatingAdmissionPolicy так, що вона лише попереджає людей, ви повинні перевірити, чи також потрібно змінити назву політики. Ви б змінили назву, щоб переконатися, що назва не вводить людей в оману.
{{< /note >}}

### Це не впливає на наявні ресурси {#limitation-admission-policy-validation}

Якщо у вас є Deployment з 0 або 1 реплікою і ви знову перемкнете ValidatingAdmissionPolicyBinding у режим Deny, це не вплине на жодні наявні ресурси.

(Якщо ви захочете масштабувати Deployment до щонайменше 2 реплік, цього можна досягти іншим способом — наприклад, за допомогою {{< glossary_tooltip text="контролера" term_id="controller" >}}).

На цьому все для ValidatingAdmissionPolicy. Тепер ви дізнаєтеся про MutatingAdmissionPolicies.

## Зміна ресурсів під час їх створення або зміни {#mutation}

Для цього прикладу уявіть, що ви хочете використовувати [Pod security admission](/docs/concepts/security/pod-security-admission/) для забезпечення того, щоб простори імен, окрім системних просторів імен, застосовували стандарт безпеки Podʼів.

Подібно до перевірки, ви можете створити MutatingAdmissionPolicy, яка може змінювати ресурси під час допуску. Тип API, який вам потрібно змінити, — це Namespace.

Ось MutatingAdmissionPolicy, яка робить частину цього:

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-baseline.yaml" >}}

{{< caution >}}
Ця політика встановлює **типове значення**. Той, хто має можливість оновлювати Namespace, може видалити мітку `pod-security.kubernetes.io/enforce` з простору імен.

Якщо ви не впевнені, що це означає, прочитайте документацію з [безпеки](/docs/concepts/security/) або зверніться по зовнішню консультацію з інформаційної безпеки.
{{< /caution >}}

Щоб застосувати цю політику:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/default-pod-security-baseline.yaml 
```

Щоб активувати цю політику, потрібен MutatingAdmissionPolicyBinding; наприклад:

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

Хоча ви не вказали рівень примусового застосування Pod security admission, мітку встановлено.

Далі перевірте, чи можете знайти спосіб обійти налаштування безпеки. Створіть YAML-маніфест для іншого Namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: another-example
  labels:
    pod-security.kubernetes.io/enforce: privileged
```

Ви можете створити цей простір імен з локального маніфесту за допомогою `kubectl apply --server-side`. Чи це працює?

Так, і новий простір імен дозволяє запускати привілейовані Podʼи.

Ця політика допуску **не** була налаштована для перевірки чи обмеження. Вона надає типове значення, але ви можете встановити власне. Однак ви можете поєднати змінювальний допуск із політикою перевірки допуску, щоб щось примусово забезпечити й водночас полегшити дотримання вимог. (Цей посібник цього не пояснює, але так можна зробити.)

Надання корисного типового значення означає, що коли люди нічого не встановлюють, вони отримують кращий результат, ніж просто повідомлення про помилку. Уявіть, що у вас є правило перевірки, згідно з яким усі простори імен мають примусово застосовувати щонайменше стандарт baseline. Той, хто не знає про це правило, може спробувати щось розгорнути й одразу побачити повідомлення про помилку, коли спробує створити простір імен.

### Використання ресурсу параметра {#use-a-parameter-resource}

Ресурси параметрів дають змогу відокремити конфігурацію політики від її визначення. Політика може визначати `paramKind`, який описує групу, версію та тип (також відомий як GVK) ресурсу параметра. Потім привʼязка політики повʼязує цю політику з областю дії, до якої її привʼязано, відповідно до налаштувань конкретного ресурсу параметра.

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
    # якщо ConfigMap відсутній або порожній, не встановлювати типове значення
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

Визначте обидва. Ви маєте **спочатку створити ConfigMap**; привʼязка очікує, що ресурс параметра вже існує (навіть якщо ви плануєте змінити його пізніше).

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

Чи отримали мітки типові значення?

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

Якщо ви створили тестові Podʼи або тестові простори імен, приберіть і їх.
