---
title: Ручна ротація сертифікатів центру сертифікації (CA)
content_type: task
---

<!-- overview -->

Ця сторінка показує, як робити вручну ротацію сертифікатів центру сертифікації (CA).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

- Для отримання додаткової інформації про автентифікацію в Kubernetes, див.
  [Автентифікація](/docs/reference/access-authn-authz/authentication).
- Для отримання додаткової інформації про найкращі практики для сертифікатів CA, див. [Один кореневий CA](/docs/setup/best-practices/certificates/#single-root-ca).

<!-- steps -->

## Ручна ротація сертифікатів CA {#rotate-the-ca-certificates-manually}

{{< caution >}}
Обовʼязково створіть резервну копію вашої теки сертифікатів разом із конфігураційними файлами та будь-якими іншими необхідними файлами.

Цей підхід передбачає роботу панелі управління Kubernetes у конфігурації HA з декількома серверами API. Передбачається також коректне завершення роботи сервера API, щоб клієнти могли чисто відʼєднатися від одного сервера API та приєднатися до іншого.

Конфігурації з одним сервером API потрапляють в стан недоступності під час перезавантаження сервера API.
{{< /caution >}}

1. Розподіліть нові сертифікати CA та приватні ключі (наприклад: `ca.crt`, `ca.key`, `front-proxy-ca.crt` і `front-proxy-ca.key`) на всі вузли вашої панелі управління у теці сертифікатів Kubernetes.

1. Оновіть прапорець `--root-ca-file` для {{< glossary_tooltip term_id="kube-controller-manager" >}}, щоб включити як старий, так і новий CA, після чого перезавантажте kube-controller-manager.

   Будь-який {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}, створений після цього, отримає Secretʼи, що містять як старий, так і новий CA.

   {{< note >}}
   Файли, зазначені у прапорцях kube-controller-manager `--client-ca-file` та `--cluster-signing-cert-file`, не можуть бути наборами CA. Якщо ці прапорці та `--root-ca-file` вказують на один і той же файл `ca.crt`, який зараз є набором (включає як старий, так і новий CA), ви зіткнетеся з помилкою. Щоб обійти цю проблему, ви можете скопіювати новий CA до окремого файлу та змусити прапорці `--client-ca-file` та `--cluster-signing-cert-file` вказувати на копію. Коли `ca.crt` більше не буде набором, ви можете повернути проблемні прапорці, щоб вказувати на `ca.crt`, та видалити копію.

   [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350) для kubeadm відстежує помилку з тим, що kube-controller-manager не може прийняти набір CA.
   {{< /note >}}

1. Зачекайте, поки менеджер контролерів оновить `ca.crt` у Secretʼах облікових записів сервісів, щоб включити як старі, так і нові сертифікати CA.

    Якщо будь-які Podʼи були запущені до того, як новий CA буде використаний серверами API, нові Podʼи отримають це оновлення та будуть довіряти як старим, так і новим CA.

1. Перезавантажте всі Podʼи, що використовують внутрішні конфігурації (наприклад: kube-proxy, CoreDNS тощо), щоб вони могли використовувати оновлені дані сертифікату центру сертифікації із Secretʼів, що повʼязані з ServiceAccounts.

   - Переконайтеся, що CoreDNS, kube-proxy та інші Podʼи, що використовують внутрішні конфігурації, працюють належним чином.

1. Додайте як старий, так і новий CA до файлу, зазначеного у прапорці `--client-ca-file` та `--kubelet-certificate-authority` в конфігурації `kube-apiserver`.

1. Додайте як старий, так і новий CA до файлу, зазначеного у прапорці `--client-ca-file` в конфігурації `kube-scheduler`.

1. Оновіть сертифікати для облікових записів користувачів, замінивши вміст `client-certificate-data` та `client-key-data`.

   Для отримання інформації про створення сертифікатів для індивідуальних облікових записів користувачів, див. [Налаштування сертифікатів для облікових записів користувачів](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Крім того, оновіть розділ `certificate-authority-data` у kubeconfig файлах, відповідно до закодованих у Base64 даних старого та нового центру сертифікації.

1. Оновіть прапорець `--root-ca-file` для {{< glossary_tooltip term_id="cloud-controller-manager" >}}, щоб включити як старий, так і новий CA, після чого перезавантажте cloud-controller-manager.

   {{< note >}}
   Якщо ваш кластер не має cloud-controller-manager, ви можете пропустити цей крок.
   {{< /note >}}

1. Виконайте наступні кроки поступово.

   1. Перезавантажте будь-які інші [агреговані сервери API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) або обробники вебхуків, щоб довіряти новим сертифікатам CA.

   2. Перезавантажте kubelet, оновивши файл, зазначений у `clientCAFile` в конфігурації kubelet, та `certificate-authority-data` у `kubelet.conf`, щоб використовувати як старий, так і новий CA на всіх вузлах.

      Якщо ваш kubelet не використовує ротацію клієнтських сертифікатів, оновіть `client-certificate-data` та `client-key-data` у `kubelet.conf` на всіх вузлах разом із файлом клієнтського сертифіката kubelet, зазвичай розташованим у `/var/lib/kubelet/pki`.

   3. Перезавантажте сервери API із сертифікатами (`apiserver.crt`, `apiserver-kubelet-client.crt` та `front-proxy-client.crt`), підписаними новим CA. Ви можете використовувати наявні приватні ключі або нові приватні ключі. Якщо ви змінили приватні ключі, то також оновіть їх у теці сертифікатів Kubernetes.

      Оскільки Podʼи у вашому кластері довіряють як старим, так і новим CA, буде короткочасне відключення, після чого клієнти Kubernetes у Podʼах переприєднаються до нового сервера API. Новий сервер API використовує сертифікат, підписаний новим CA.

      - Перезавантажте {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}, щоб використовувати та
        довіряти новим CA.
      - Переконайтеся, що логи компонентів панелі управління не містять помилок TLS.

      {{< note >}}
      Для генерації сертифікатів та приватних ключів для вашого кластера за допомогою `openssl`, див. [Сертифікати (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl). Ви також можете використовувати [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   4. Анотуйте будь-які DaemonSets та Deployments, щоб викликати заміну Podʼів у більш безпечний спосіб.

      ```shell
      for namespace in $(kubectl get namespace -o jsonpath='{.items[*].metadata.name}'); do
          for name in $(kubectl get deployments -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch deployment -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
          for name in $(kubectl get daemonset -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch daemonset -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
      done
      ```

      {{< note >}}
      Щоб обмежити кількість одночасних порушень, з якими стикається ваш застосунок, див. [налаштування бюджетів порушень Podʼів](/docs/tasks/run-application/configure-pdb/).
      {{< /note >}}

      Залежно від того, як ви використовуєте StatefulSets, вам також може знадобитися виконати подібну поступову заміну.

1. Якщо ваш кластер використовує токени для початкового завантаження для приєднання вузлів, оновіть ConfigMap `cluster-info` в просторі імен `kube-public` з новим CA.

   ```shell
   base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

   kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
   ```

1. Перевірте функціональність кластера.

    1. Перевірте логи компонентів панелі управління, а також kubelet та kube-proxy. Переконайтеся, що ці компоненти не повідомляють про помилки TLS; див. [перегляд журналів](/docs/tasks/debug/debug-cluster/#looking-at-logs) для отримання додаткових деталей.

    1. Перевірте логи будь-яких агрегованих серверів API та Podʼів, що використовують внутрішню конфігурацію.

1. Після успішної перевірки функціональності кластера:

   1. Оновіть всі токени службових облікових записів, щоб включити лише новий сертифікат CA.

      - Всі Podʼи, що використовують внутрішній kubeconfig, згодом потрібно буде перезапустити, щоб отримати новий Secret, щоб жоден Pod не залежав від старого CA кластера.

   2. Перезавантажте компоненти панелі управління, видаливши старий CA з kubeconfig файлів та файлів, зазначених у прапорцях `--client-ca-file` та `--root-ca-file`.

   3. На кожному вузлі перезавантажте kubelet, видаливши старий CA з файлу, зазначеного у прапорі `clientCAFile`, та з файлу kubeconfig для kubelet. Ви повинні виконати це як поступове оновлення.

      Якщо ваш кластер дозволяє вам внести цю зміну, ви також можете здійснити це шляхом заміни вузлів, а не їх переконфігурування.
