---
layout: blog
title: 'Kubernetes v1.35: Деталізоване управління допоміжними групами переходить в стан загальної доступності (GA)'
date: 2025-12-23T10:30:00-08:00
slug: kubernetes-v1-35-fine-grained-supplementalgroups-control-ga
author: >
  Shingo Omura (LY Corporation)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

Від імені Kubernetes SIG Node, ми раді оголосити про перехід _деталізованого управління допоміжними групами_ до загальної доступності (GA) у Kubernetes v1.35!

Нове поле Pod `supplementalGroupsPolicy` було введено як opt-in альфа-функція для Kubernetes v1.31, а потім перейшло до бета у v1.33. Тепер ця функція є загальнодоступною. Ця функція дозволяє реалізувати більш точний контроль над допоміжними групами в контейнерах Linux, що може зміцнити позицію безпеки, особливо при доступі до томів. Крім того, вона також покращує прозорість деталей UID/GID у контейнерах, забезпечуючи покращений нагляд за безпекою.

Якщо ви плануєте оновити свій кластер з v1.32 або більш ранньої версії, будь ласка, зверніть увагу, що деякі зміни поведінки, що порушують сумісність, були введені з бета (v1.33). Для отримання додаткової інформації дивіться розділи [змін поведінки, введених у бета](/blog/2025/05/06/kubernetes-v1-33-fine-grained-supplementalgroups-control-beta/#the-behavioral-changes-introduced-in-beta) та [розгляди оновлення](/blog/2025/05/06/kubernetes-v1-33-fine-grained-supplementalgroups-control-beta/#upgrade-consideration) у попередньому блозі про перехід до бета.

## Мотивація: Неявні членства в групах, визначені в `/etc/group` в образі контейнера {#motivation-implicit-group-memberships-defined-in-etc-group-in-the-container-image}

Навіть якщо більшість адміністраторів/користувачів кластерів Kubernetes можуть не бути обізнаними з цим, за звичай Kubernetes _обʼєднує_ інформацію про групи з Podʼа з інформацією, визначеною в `/etc/group` в образі контейнера.

Ось приклад; маніфест Podʼа, який вказує `spec.securityContext.runAsUser: 1000`, `spec.securityContext.runAsGroup: 3000` та `spec.securityContext.supplementalGroups: 4000` як частину контексту безпеки Podʼа.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: implicit-groups-example
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    supplementalGroups: [4000]
  containers:
  - name: example-container
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false
```

Який результат команди `id` в контейнері `example-container`? Вихідні дані повинні бути схожими на це:

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

Звідки в групі допоміжних ідентифікаторів (`groups` поле) зʼявився ідентифікатор групи `50000`, навіть якщо `50000` взагалі не визначено в маніфесті Podʼа? Відповідь — файл `/etc/group` в образі контейнера.

Перевірка вмісту файлу `/etc/group` в образі контейнера містить щось подібне до наступного:

```none
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

Це показує, що первинний користувач контейнера `1000` належить до групи `50000` в останньому записі.

Таким чином, членство в групі, визначене в `/etc/group` в образі контейнера для первинного користувача контейнера, _неявно_ обʼєднується з інформацією з Podʼа. Будь ласка, зверніть увагу, що це було дизайнерським рішенням, яке поточні реалізації CRI успадкували від Docker, і спільнота насправді ніколи не переосмислювала це до теперішнього часу.

### Що з цим не так? {#what-s-wrong-with-it}

Неявно обʼєднана інформація про групи з `/etc/group` в образі контейнера становить ризик для безпеки. Ці неявні GID не можуть бути виявлені або перевірені механізмами політики, оскільки немає запису про них у маніфесті Podʼа. Це може призвести до несподіваних проблем з контролем доступу, особливо при доступі до томів (див. [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) для деталей), оскільки дозволи файлів контролюються UID/GIDs в Linux.

## Деталізоване управління допоміжними групами в Pod: `supplementaryGroupsPolicy` {#fine-grained-supplemental-groups-control-in-a-pod-supplementarygroupspolicy}

Щоб вирішити цю проблему, `.spec.securityContext` Pod тепер включає поле `supplementalGroupsPolicy`.

Це поле дозволяє вам контролювати, як Kubernetes обчислює допоміжні групи для процесів контейнера всередині Podʼа. Доступні політики:

* _Merge_: Інформація про членство в групі, визначена в `/etc/group` для первинного користувача контейнера, буде обʼєднана. Якщо не вказано, ця політика буде застосована (тобто типова поведінка для зворотної сумісності).

* _Strict_: Тільки ідентифікатори груп, вказані в `fsGroup`, `supplementalGroups` або `runAsGroup`, прикріплюються як допоміжні групи до процесів контейнера. Членства в групах, визначені в `/etc/group` для первинного користувача контейнера, ігноруються.

Я поясню, як працює політика `Strict`. Наступний маніфест Podʼа вказує `supplementalGroupsPolicy: Strict`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: strict-supplementalgroups-policy-example
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    supplementalGroups: [4000]
    supplementalGroupsPolicy: Strict
  containers:
  - name: example-container
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false
```

Результат команди `id` в контейнері `example-container` повинен бути схожим на це:

```none
uid=1000 gid=3000 groups=3000,4000
```

Ви можете побачити, що політика `Strict` може виключити групу `50000` з `groups`!

Таким чином, забезпечення `supplementalGroupsPolicy: Strict` (забезпечене якимось механізмом політики) допомагає запобігти неявним допоміжним групам у Podʼі.

{{< note >}}
Контейнер з достатніми привілеями може змінити ідентичність процесу. `supplementalGroupsPolicy` впливає лише на початкову ідентичність процесу.

Читайте далі для отримання додаткової інформації.
{{</ note >}}

## Приєднана ідентичність процесу в статусі Podʼа {#attached-process-identity-in-pod-status}

Ця функція також відкриває ідентичність процесу, прикріплену до першого процесу контейнера через поле `.status.containerStatuses[].user.linux`. Це буде корисно, щоб побачити, чи прикріплені неявні ідентифікатори груп.

```yaml
...
status:
  containerStatuses:
  - name: ctr
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{< note >}}
Будь ласка, зверніть увагу, що значення в полі `status.containerStatuses[].user.linux` є _спочатку приєднаною_ ідентичністю процесу до першого процесу контейнера в контейнері. Якщо контейнер має достатні привілеї для виклику системних викликів, повʼязаних з ідентичністю процесу (наприклад, [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html), [`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) або [`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) тощо), процес контейнера може змінити свою ідентичність. Таким чином, _фактична_ ідентичність процесу буде динамічною.

Існує кілька способів обмежити ці дозволи в контейнерах. Ми пропонуємо наступні як прості рішення:

* встановлення `privilege: false` та `allowPrivilegeEscalation: false` у `securityContext` вашого контейнера, або
* приведення вашого pod у відповідність до [`Restricted` політики в Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted).

Крім того, kubelet не має видимості у втулку NRI або внутрішній роботі середовища виконання контейнера. Адміністратор кластера, що налаштовує вузли або високо привілейовані робочі навантаження з дозволу локального адміністратора, може змінити допоміжні групи для будь-якого пода. Однак це поза сферою контролю Kubernetes і не повинно бути проблемою для вузлів з посиленою безпекою.
{{</ note >}}

## Політика `Strict` вимагає оновлених середовищ виконання контейнерів {#strict-policy-requires-up-to-date-container-runtimes}

Високорівневе середовище виконання контейнера (наприклад, containerd, CRI-O) відіграє ключову роль у обчисленні допоміжних ідентифікаторів груп, які будуть прикріплені до контейнерів. Таким чином, `supplementalGroupsPolicy: Strict` вимагає CRI-середовища, яке підтримує цю функцію. Стара поведінка (`supplementalGroupsPolicy: Merge`) може працювати з CRI-середовищем, яке не підтримує цю функцію, тому що ця політика є повністю зворотно сумісною.

Ось кілька CRI-середовищ, які підтримують цю функцію, і версії, які вам потрібно використовувати:

* containerd: v2.0 або новіше
* CRI-O: v1.31 або новіше

І ви можете побачити, чи підтримується ця функція в полі `.status.features.supplementalGroupsPolicy` вузла. Будь ласка, зверніть увагу, що це поле відрізняється від `status.declaredFeatures`, введеного в [KEP-5328: Node Declared Features(formerly Node Capabilities)](https://github.com/kubernetes/enhancements/issues/5328).

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

Оскільки середовища виконання контейнерів універсально підтримують цю функцію, різні політики безпеки можуть почати забезпечувати поведінку `Strict` як більш безпечну. Найкраща практика — переконатися, що ваші Podʼи готові до цієї вимоги, і всі допоміжні групи прозоро оголошені в специфікації Podʼа, а не в образах.

## Як долучитись {#getting-involved}

Це вдосконалення було ініційовано спільнотою [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node). Будь ласка, приєднуйтесь до нас, щоб звʼязатися зі спільнотою та поділитися своїми ідеями та відгуками щодо вищезазначеної функції та не тільки. Ми з нетерпінням чекаємо на ваші відгуки!

## Як дізнатися більше? {#how-can-i-learn-more}

<!-- https://github.com/kubernetes/website/pull/46920 -->
* [Налаштування контексту безпеки для Podʼа або контейнера](/docs/tasks/configure-pod-container/security-context/)
для отримання додаткової інформації про `supplementalGroupsPolicy`
* [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)
