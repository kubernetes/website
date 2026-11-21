---
title: Створення високодоступних кластерів за допомогою kubeadm
content_type: task
weight: 60
---

<!-- overview -->

На цій сторінці пояснено два різні підходи до налаштування високодоступного кластера Kubernetes за допомогою kubeadm:

- Із вузлами панелі управління зі спільним розміщенням (stacked). Цей підхід потребує менше інфраструктури. Члени etcd і вузли панелі управління розміщені разом.
- Із зовнішнім кластером etcd. Цей підхід потребує більше інфраструктури. Вузли панелі управління та члени etcd розділені.

Перш ніж продовжити, ретельно обміркуйте, який підхід найкраще відповідає потребам ваших застосунків і середовища. На сторінці [Варіанти топології високої доступності](/docs/setup/production-environment/tools/kubeadm/ha-topology/) описано переваги й недоліки кожного з них.

Якщо під час налаштування HA-кластера виникнуть проблеми, повідомте про них у [системі відстеження проблем](https://github.com/kubernetes/kubeadm/issues/new) kubeadm.

Див. також [документацію з оновлення](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).

{{< caution >}}
Ця сторінка не стосується запуску кластера в хмарного провайдера. У хмарному середовищі жоден із описаних тут підходів не працює з обʼєктами Service типу LoadBalancer або з динамічними PersistentVolume.
{{< /caution >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

Передумови залежать від топології, яку ви обрали для панелі управління кластера:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="etcd зі спільним розміщенням" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->

Вам потрібно:

- Три або більше машин, які відповідають [мінімальним вимогам kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) для вузлів панелі управління. Наявність непарної кількості вузлів панелі управління допомагає під час вибору лідера в разі відмови машини чи зони.
  - включаючи {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}, яке вже налаштоване та працює.
- Три або більше машин, які відповідають [мінімальним вимогам kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) для робочих вузлів,
  - включаючи середовище виконання контейнерів, яке вже налаштоване та працює.
- Повноцінне мережеве зʼєднання між усіма машинами в кластері (публічна чи
  приватна мережа).
- Привілеї суперкористувача на всіх машинах за допомогою `sudo`.
  - Ви можете використовувати інший інструмент; цей посібник використовує `sudo` у прикладах.
- SSH-доступ з одного пристрою до всіх вузлів системи.
- `kubeadm` та `kubelet` вже встановлені на всіх машинах.

_Контекст див. у розділі [Топологія etcd зі спільним розміщенням](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology)._

{{% /tab %}}
{{% tab name="Зовнішній etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
Вам потрібно:

- Три або більше машин, які відповідають [мінімальним вимогам kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) для вузлів панелі управління. Наявність непарної кількості вузлів панелі управління допомагає під час вибору лідера в разі відмови машини чи зони.
  - включаючи {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}, яке вже налаштоване та працює.
- Три або більше машин, які відповідають [мінімальним вимогам kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) для робочих вузлів,
  - включаючи середовище виконання контейнерів, яке вже налаштоване та працює.
- Повноцінне мережеве зʼєднання між усіма машинами в кластері (публічна чи
  приватна мережа).
- Привілеї суперкористувача на всіх машинах за допомогою `sudo`.
  - Ви можете використовувати інший інструмент; цей посібник використовує `sudo` у прикладах.
- SSH-доступ з одного пристрою до всіх вузлів системи.
- `kubeadm` та `kubelet` вже встановлені на всіх машинах.

<!-- end of shared prerequisites -->

І вам також потрібно:

- Три або більше додаткових машин, які стануть членами кластера etcd. Наявність непарної кількості членів у кластері etcd — це вимога для досягнення оптимального кворуму під час голосування.
  - Ці машини також повинні мати встановлені `kubeadm` та `kubelet`.
  - На цих машинах також потрібно мати середовище виконання контейнерів, яке вже налаштоване та працює.

_Контекст див. у розділі [Топологія із зовнішнім etcd](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology)._
{{% /tab %}}
{{< /tabs >}}

### Образи контейнерів {#container-images}

Кожен хост повинен мати доступ для читання та отримання образів із реєстру образів контейнерів Kubernetes `registry.k8s.io`. Якщо ви хочете розгорнути високодоступний кластер, хости якого не мають доступу для завантаження образів, це можливо. Ви маєте іншими засобами забезпечити, щоб на відповідних хостах уже були потрібні образи контейнерів.

### Інтерфейс командного рядка {#kubectl}

Щоб керувати Kubernetes після налаштування кластера, слід [встановити kubectl](/docs/tasks/tools/#kubectl) на вашому компʼютері. Також корисно встановити інструмент `kubectl` на кожному вузлі панелі управління, оскільки це може допомогти з усуненням несправностей.

<!-- steps -->

## Перші кроки для обох методів {#first-steps-for-both-methods}

### Створення балансувальника навантаження для kube-apiserver {#create-load-balancer-for-kube-apiserver}

{{< note >}}
Існує багато конфігурацій для балансувальників навантаження. Наведений нижче приклад — лише один із варіантів. Ваші вимоги до кластера можуть вимагати іншої конфігурації.
{{< /note >}}

1. Створіть балансувальник навантаження kube-apiserver з імʼям, яке розпізнається DNS.

   - У хмарному середовищі вузли панелі управління слід розмістити за балансувальником навантаження з TCP-переспрямуванням. Цей балансувальник розподіляє трафік між усіма справними вузлами панелі управління у своєму списку цілей. Перевірка справності apiserver — це TCP-перевірка порту, який слухає kube-apiserver (стандартне значення `:6443`).

   - Не рекомендується використовувати IP-адресу безпосередньо у хмарному середовищі.

   - Балансувальник навантаження має мати змогу взаємодіяти з усіма вузлами панелі управління через порт apiserver. Він також має дозволяти вхідний трафік на своєму порту прослуховування.

   - Переконайтеся, що адреса балансувальника завжди відповідає адресі `ControlPlaneEndpoint` kubeadm.

   - Докладніше див. посібник [Варіанти програмного балансування навантаження](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing).

1. Додайте перший вузол панелі управління до балансувальника навантаження та перевірте зʼєднання:

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Помилка connection refused очікувана, оскільки API-сервер ще не запущено. Натомість тайм-аут означає, що балансувальник навантаження не може взаємодіяти з вузлом панелі управління. Якщо виникає тайм-аут, переналаштуйте балансувальник навантаження для взаємодії з вузлом панелі управління.

1. Додайте решту вузлів панелі управління до цільової групи балансувальника навантаження.

## Вузли панелі управління та etcd зі спільним розміщенням {#stacked-control-plane-and-etcd-nodes}

### Кроки для першого вузла панелі управління {#steps-for-the-first-control-plane-node}

1. Ініціалізуйте панель управління:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Ви можете використовувати прапорець `--kubernetes-version`, щоб встановити версію Kubernetes, яку слід використовувати. Рекомендується, щоб версії kubeadm, kubelet, kubectl та Kubernetes відповідали одна одній.
   - Прапорець `--control-plane-endpoint` слід встановити на адресу або DNS-імʼя та порт балансувальника навантаження.

   - Прапорець `--upload-certs` використовується для завантаження в кластер сертифікатів, які мають бути спільними для всіх екземплярів панелі управління. Якщо натомість ви віддаєте перевагу копіюванню сертифікатів між вузлами панелі управління вручну або за допомогою засобів автоматизації, приберіть цей прапорець і зверніться до розділу [Розподіл сертифікатів вручну](#manual-certs) нижче.

   {{< note >}}
   Прапорці `--config` і `--certificate-key` команди `kubeadm init` не можна поєднувати, тому, якщо ви хочете використовувати [конфігурацію kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/), потрібно додати поле `certificateKey` у відповідні місця конфігурації (в `InitConfiguration` і `JoinConfiguration: controlPlane`).
   {{< /note >}}

   {{< note >}}
   Деякі мережеві втулки CNI потребують додаткового налаштування, наприклад, зазначення CIDR IP-адрес Podʼів, а інші — ні. Див. [документацію щодо мережі CNI](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network). Щоб додати CIDR для Podʼів, передайте прапорець `--pod-network-cidr`, або, якщо ви використовуєте файл конфігурації kubeadm, задайте поле `podSubnet` в обʼєкті `networking` у `ClusterConfiguration`.
   {{< /note >}}

   Вивід буде приблизно таким:

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Скопіюйте цей вивід у текстовий файл. Він знадобиться вам пізніше для приєднання вузлів панелі управління та робочих вузлів до кластера.
   - Коли `--upload-certs` використовується з `kubeadm init`, сертифікати основної панелі управління шифруються та завантажуються в Secret `kubeadm-certs`.
   - Щоб повторно завантажити сертифікати та згенерувати новий ключ розшифрування, виконайте таку команду на вузлі панелі управління, який уже приєднано до кластера:

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - Ви також можете задати власний `--certificate-key` під час `init`, який пізніше можна використати з `join`. Щоб згенерувати такий ключ, виконайте таку команду:

     ```sh
     kubeadm certs certificate-key
     ```

   Ключ сертифіката — це рядок, закодований у шістнадцятковій формі, який є ключем AES розміром 32 байти.

   {{< note >}}
   Термін дії Secret `kubeadm-certs` і ключа розшифрування спливає через дві години.
   {{< /note >}}

   {{< caution >}}
   Як зазначено у виводі команди, ключ сертифіката надає доступ до чутливих даних кластера, тримайте його в таємниці!
   {{< /caution >}}

1. Застосуйте вибраний вами втулок CNI: [дотримуйтеся цих інструкцій](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network), щоб встановити постачальника CNI. Переконайтеся, що конфігурація відповідає CIDR Podʼів, вказаному у файлі конфігурації kubeadm (якщо застосовно).

   {{< note >}}
   Потрібно вибрати мережевий втулок, який відповідає вашому сценарію використання, і розгорнути його, перш ніж переходити до наступного кроку. Якщо цього не зробити, ви не зможете належним чином запустити кластер.
   {{< /note >}}

1. Введіть таку команду та спостерігайте, як запускаються Podʼи компонентів панелі управління:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Кроки для інших вузлів панелі управління {#steps-for-the-rest-of-the-control-plane-nodes}

Для кожного додаткового вузла панелі управління виконайте такі дії:

1. Виконайте команду приєднання, яку вам раніше надав вивід `kubeadm init` на першому вузлі. Вона має виглядати приблизно так:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - Прапорець `--control-plane` вказує `kubeadm join` створити нову панель управління.
   - Прапорець `--certificate-key ...` спричинить завантаження сертифікатів панелі управління з Secret `kubeadm-certs` у кластері та їх розшифрування за допомогою вказаного ключа.

{{< note >}}
Оскільки вузли кластера зазвичай ініціалізуються послідовно, усі Podʼи CoreDNS, імовірно, працюватимуть на першому вузлі панелі управління. Щоб забезпечити вищу доступність, перебалансуйте Podʼи CoreDNS командою `kubectl -n kube-system rollout restart deployment coredns` після приєднання принаймні одного нового вузла.
{{< /note >}}

## Зовнішні вузли etcd {#external-etcd-nodes}

Налаштування кластера із зовнішніми вузлами etcd подібне до процедури для etcd зі спільним розміщенням, за винятком того, що спочатку потрібно налаштувати etcd, а інформацію про etcd слід передати у файлі конфігурації kubeadm.

### Налаштування кластера etcd {#set-up-the-etcd-cluster}

1. Дотримуйтеся цих [інструкцій](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/), щоб налаштувати кластер etcd.

1. Налаштуйте SSH, як описано [тут](#manual-certs).

1. Скопіюйте такі файли з будь-якого вузла etcd у кластері на перший вузол панелі управління:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Замініть значення `CONTROL_PLANE` на `user@host` першого вузла панелі управління.

### Налаштування першого вузла панелі управління {#set-up-the-first-control-plane-node}

1. Створіть файл `kubeadm-config.yaml` з таким вмістом:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # змініть це (див. нижче)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # змініть ETCD_0_IP відповідно
         - https://ETCD_1_IP:2379 # змініть ETCD_1_IP відповідно
         - https://ETCD_2_IP:2379 # змініть ETCD_2_IP відповідно
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   Різниця між etcd зі спільним розміщенням і зовнішнім etcd полягає в тому, що для зовнішнього etcd потрібен файл конфігурації з точками доступу etcd в обʼєкті `external` для `etcd`. У топології etcd зі спільним розміщенням це керується автоматично.
   {{< /note >}}

   - Замініть такі змінні в шаблоні конфігурації на відповідні значення для вашого кластера:

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

Наступні кроки подібні до налаштування etcd зі спільним розміщенням:

1. Виконайте команду `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` на цьому вузлі.

1. Запишіть повернуті команди приєднання з виводу в текстовий файл для подальшого використання.

1. Застосуйте вибраний вами втулок CNI.

   {{< note >}}
   Потрібно вибрати мережевий втулок, який відповідає вашому сценарію використання, і розгорнути його, перш ніж переходити до наступного кроку. Якщо цього не зробити, ви не зможете належним чином запустити кластер.
   {{< /note >}}

### Кроки для інших вузлів панелі управління {#steps-for-the-rest-of-the-control-plane-nodes-1}

Кроки такі самі, як і для налаштування etcd зі спільним розміщенням:

- Переконайтеся, що перший вузол панелі управління повністю ініціалізований.
- Приєднайте кожен вузол панелі управління за допомогою команди приєднання, яку ви зберегли в текстовий файл. Рекомендується приєднувати вузли панелі управління по одному.
- Не забувайте, що ключ розшифрування з `--certificate-key` стандартно спливає через дві години.

## Загальні завдання після початкового розгортання панелі управління {#common-tasks-after-bootstrapping-control-plane}

### Встановлення робочих вузлів {#install-workers}

Робочі вузли можна приєднати до кластера за допомогою команди, яку ви зберегли раніше як вивід з команди `kubeadm init`:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Розподіл сертифікатів вручну {#manual-certs}

Якщо ви вирішили не використовувати `kubeadm init` з прапорцем `--upload-certs`, це означає, що вам доведеться вручну скопіювати сертифікати з основного вузла панелі управління на вузли панелі управління, що приєднуються.

Є багато способів це зробити. У наведеному нижче прикладі використовуються `ssh` і `scp`:

SSH потрібен, якщо ви хочете керувати всіма вузлами з однієї машини.

1. Увімкніть ssh-agent на своєму основному пристрої, який має доступ до всіх інших вузлів у системі:

   ```shell
   eval $(ssh-agent)
   ```

1. Додайте свій SSH-ключ (identity) до сеансу:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. Підʼєднайтеся через SSH між вузлами, щоб перевірити, що зʼєднання працює правильно.

   - Коли ви підʼєднуєтеся через SSH до будь-якого вузла, додавайте прапорець `-A`. Цей прапорець дає змогу вузлу, на який ви увійшли через SSH, отримати доступ до агента SSH на вашому ПК. Розгляньте альтернативні методи, якщо ви не повністю довіряєте безпеці вашого сеансу користувача на вузлі.

     ```shell
     ssh -A 10.0.0.7
     ```

   - Використовуючи sudo на будь-якому вузлі, обовʼязково зберігайте середовище, щоб працювало переспрямування SSH (SSH forwarding):

     ```shell
     sudo -E -s
     ```

1. Після налаштування SSH на всіх вузлах виконайте такий скрипт на першому вузлі панелі управління після запуску `kubeadm init`. Цей скрипт скопіює сертифікати з першого вузла панелі управління на інші вузли панелі управління:

   У наведеному нижче прикладі замініть `CONTROL_PLANE_IPS` на IP-адреси інших вузлів панелі управління.

   ```sh
   USER=ubuntu # налаштовується
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Пропустіть наступний рядок, якщо використовуєте зовнішній etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   Копіюйте лише сертифікати з наведеного вище переліку. kubeadm подбає про генерування решти сертифікатів із потрібними SAN для екземплярів панелі управління, що приєднуються. Якщо ви помилково скопіюєте всі сертифікати, створення додаткових вузлів може завершитися невдачею через відсутність потрібних SAN.
   {{< /caution >}}

1. Потім на кожному вузлі панелі управління, що приєднується, виконайте такий скрипт перед запуском `kubeadm join`. Цей скрипт перемістить раніше скопійовані сертифікати з домашньої теки в `/etc/kubernetes/pki`:

   ```sh
   USER=ubuntu # налаштовується
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Пропустіть наступний рядок, якщо використовуєте зовнішній etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```
