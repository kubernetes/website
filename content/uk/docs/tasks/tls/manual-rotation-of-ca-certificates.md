---
title: Ручна ротація сертифікатів центру сертифікації (CA)
content_type: task
---

<!-- overview -->

На цій сторінці показано, як вручну виконати ротацію сертифікатів центру сертифікації (CA).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

- Докладніше про автентифікацію в Kubernetes дивіться в розділі [Автентифікація](/docs/reference/access-authn-authz/authentication).
- Докладніше про рекомендації щодо сертифікатів CA дивіться в розділі [Один кореневий CA](/docs/setup/best-practices/certificates/#single-root-ca).

<!-- steps -->

## Ручна ротація сертифікатів CA {#rotate-the-ca-certificates-manually}

{{< caution >}}
Обовʼязково створіть резервну копію теки сертифікатів разом із файлами конфігурації та іншими потрібними файлами.

Цей підхід передбачає роботу панелі управління Kubernetes у конфігурації HA з кількома API-серверами. Також передбачається коректне завершення роботи API-сервера, щоб клієнти могли чисто відʼєднатися від одного API-сервера й підʼєднатися до іншого.

Конфігурації з одним API-сервером будуть недоступні під час перезапуску API-сервера.
{{< /caution >}}

1. Розподіліть нові сертифікати CA й приватні ключі (наприклад, `ca.crt`, `ca.key`, `front-proxy-ca.crt` і `front-proxy-ca.key`) на всі вузли панелі управління в теку сертифікатів Kubernetes.

1. Оновіть прапорець `--root-ca-file` для {{< glossary_tooltip term_id="kube-controller-manager" >}}, щоб він містив і старий, і новий CA, а потім перезапустіть kube-controller-manager.

   Будь-який {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}, створений після цього, отримає Secrets, що містять і старий, і новий CA.

   {{< note >}}
   Файли, вказані у прапорцях kube-controller-manager `--client-ca-file` і `--cluster-signing-cert-file`, не можуть бути наборами CA. Якщо ці прапорці та `--root-ca-file` вказують на той самий файл `ca.crt`, який тепер є набором (містить і старий, і новий CA), ви отримаєте помилку. Щоб обійти цю проблему, скопіюйте новий CA в окремий файл і вкажіть цю копію в прапорцях `--client-ca-file` і `--cluster-signing-cert-file`. Коли `ca.crt` більше не буде набором, ви зможете знову вказати `ca.crt` у цих прапорцях і видалити копію.

   [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350) для kubeadm відстежує помилку, через яку kube-controller-manager не може прийняти набір CA.
   {{< /note >}}

1. Зачекайте, поки менеджер контролерів оновить `ca.crt` у Secrets для ServiceAccount, щоб вони містили і старі, і нові сертифікати CA.

    Якщо якісь Podʼи запускаються до того, як API-сервери почнуть використовувати новий CA, нові Podʼи отримають це оновлення й довірятимуть і старим, і новим CA.

1. Перезапустіть усі Podʼи, що використовують конфігурації всередині кластера (наприклад, kube-proxy, CoreDNS тощо), щоб вони могли використовувати оновлені дані центру сертифікації із Secrets, повʼязаних із ServiceAccounts.

   - Переконайтеся, що CoreDNS, kube-proxy та інші Podʼи, які використовують конфігурації всередині кластера, працюють належним чином.

1. Додайте і старий, і новий CA до файлу, вказаного у прапорцях `--client-ca-file` і `--kubelet-certificate-authority`, у конфігурації `kube-apiserver`.

1. Додайте і старий, і новий CA до файлу, вказаного у прапорці `--client-ca-file`, у конфігурації `kube-scheduler`.

1. Оновіть сертифікати облікових записів користувачів, замінивши вміст `client-certificate-data` і `client-key-data` відповідно.

   Докладніше про створення сертифікатів для окремих облікових записів користувачів дивіться в розділі [Налаштування сертифікатів для облікових записів користувачів](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Крім того, оновіть розділ `certificate-authority-data` у файлах kubeconfig, вказавши відповідно закодовані в Base64 дані старого й нового центру сертифікації.

1. Оновіть прапорець `--root-ca-file` для {{< glossary_tooltip term_id="cloud-controller-manager" >}}, щоб він містив і старий, і новий CA, а потім перезапустіть cloud-controller-manager.

   {{< note >}}
   Якщо у вашому кластері немає cloud-controller-manager, цей крок можна пропустити.
   {{< /note >}}

1. Виконайте наведені нижче кроки поетапно.

   1. Перезапустіть усі інші [агреговані API-сервери](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) або обробники вебхуків, щоб вони довіряли новим сертифікатам CA.

   1. Перезапустіть kubelet, оновивши файл, вказаний у `clientCAFile` у конфігурації kubelet, і `certificate-authority-data` у `kubelet.conf`, щоб використовувати і старий, і новий CA на всіх вузлах.

      Якщо ваш kubelet не використовує ротацію клієнтських сертифікатів, оновіть `client-certificate-data` і `client-key-data` у `kubelet.conf` на всіх вузлах, а також файл клієнтського сертифіката kubelet, який зазвичай міститься в `/var/lib/kubelet/pki`.

   1. Перезапустіть API-сервери із сертифікатами (`apiserver.crt`, `apiserver-kubelet-client.crt` і `front-proxy-client.crt`), підписаними новим CA. Ви можете використовувати наявні або нові приватні ключі. Якщо ви змінили приватні ключі, оновіть їх і в теці сертифікатів Kubernetes.

      Оскільки Podʼи у вашому кластері довіряють і старим, і новим CA, буде короткочасне відʼєднання, після якого клієнти Kubernetes у Podʼах перепідʼєднаються до нового API-сервера. Новий API-сервер використовує сертифікат, підписаний новим CA.

      - Перезапустіть {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}, щоб він використовував нові CA й довіряв їм.
      - Переконайтеся, що логи компонентів панелі управління не містять помилок TLS.

      {{< note >}}
      Щоб згенерувати сертифікати й приватні ключі для вашого кластера за допомогою інструмента командного рядка `openssl`, дивіться [Сертифікати (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl). Також можна використовувати [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   1. Додайте анотації до DaemonSets і Deployments, щоб запустити заміну Podʼів безпечнішим поетапним способом.

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
      Щоб обмежити кількість одночасних порушень, яких зазнає ваш застосунок, дивіться [налаштування бюджету порушень Podʼів](/docs/tasks/run-application/configure-pdb/).
      {{< /note >}}

      Залежно від того, як ви використовуєте StatefulSets, вам також може знадобитися виконати подібну поетапну заміну.

1. Якщо ваш кластер використовує токени початкового завантаження для приєднання вузлів, оновіть ConfigMap `cluster-info` у просторі імен `kube-public`, додавши новий CA.

   ```shell
   base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

   kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
   ```

1. Перевірте роботу кластера.

    1. Перевірте логи компонентів панелі управління, а також kubelet і kube-proxy. Переконайтеся, що ці компоненти не повідомляють про помилки TLS; докладніше дивіться в розділі [перегляд логів](/docs/tasks/debug/debug-cluster/#looking-at-logs).

    1. Перевірте логи агрегованих API-серверів і Podʼів, що використовують конфігурацію всередині кластера.

1. Після успішної перевірки роботи кластера:

   1. Оновіть усі токени ServiceAccount, щоб вони містили лише новий сертифікат CA.

      - Усі Podʼи, що використовують kubeconfig всередині кластера, зрештою потрібно буде перезапустити, щоб вони отримали новий Secret і жоден Pod не залежав від старого CA кластера.

   1. Перезапустіть компоненти панелі управління, вилучивши старий CA з файлів kubeconfig і файлів, вказаних у прапорцях `--client-ca-file` і `--root-ca-file` відповідно.

   1. На кожному вузлі перезапустіть kubelet, вилучивши старий CA з файлу, вказаного в прапорці `clientCAFile`, і з файлу kubeconfig kubelet. Виконуйте це як поетапне оновлення.

      Якщо ваш кластер дозволяє внести цю зміну, ви також можете розгорнути її заміною вузлів, а не їх переналаштуванням.
