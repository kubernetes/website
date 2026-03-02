---
title: Управління сертифікатами з kubeadm
content_type: task
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.15" state="stable" >}}

Клієнтські сертифікати, що генеруються [kubeadm](/docs/reference/setup-tools/kubeadm/), закінчуються через 1 рік. Ця сторінка пояснює, як управляти поновленням сертифікатів за допомогою kubeadm. Вона також охоплює інші завдання, повʼязані з управлінням сертифікатами kubeadm.

Проєкт Kubernetes рекомендує оперативно оновлюватись до останніх випусків патчів, а також переконатися, що ви використовуєте підтримуваний мінорний випуск Kubernetes. Дотримання цих рекомендацій допоможе вам залишатися в безпеці.

## {{% heading "prerequisites" %}}

Ви повинні бути знайомі з [сертифікатами PKI та вимогами Kubernetes](/docs/setup/best-practices/certificates/).

Ви маєте знати, як передати файл [configuration](/docs/reference/config-api/kubeadm-config.v1beta4/) командам kubeadm.

Цей посібник описує використання команди `openssl` (використовується для ручного підписання сертифікатів, якщо ви обираєте цей підхід), але ви можете використовувати інші інструменти, яким надаєте перевагу.

Деякі кроки тут використовують `sudo` для адміністративного доступу. Ви можете використовувати будь-який еквівалентний інструмент.

<!-- steps -->

## Використання власних сертифікатів {#custom-certificates}

Типово, kubeadm генерує всі необхідні сертифікати для роботи кластера. Ви можете перевизначити цю поведінку, надавши власні сертифікати.

Для цього вам потрібно помістити їх у ту теку, яка вказується за допомогою прапорця `--cert-dir` або поля `certificatesDir` конфігурації кластера `ClusterConfiguration` kubeadm. Типово це `/etc/kubernetes/pki`.

Якщо певна пара сертифікатів і приватний ключ існують до запуску `kubeadm init`, kubeadm не перезаписує їх. Це означає, що ви можете, наприклад, скопіювати наявний ЦС (Центр сертифікації — Certificate authority) в `/etc/kubernetes/pki/ca.crt` та `/etc/kubernetes/pki/ca.key`, і kubeadm використовуватиме цей ЦС для підпису решти сертифікатів.

## Вибір алгоритму шифрування {#choosing-encryption-algorithm}

kubeadm дозволяє вибрати алгоритм шифрування, який використовується для створення відкритих і закритих ключів. Це можна зробити за допомогою поля `encryptionAlgorithm` у конфігурації kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
encryptionAlgorithm: <ALGORITHM>
```

`<ALGORITHM>` може бути одним з: `RSA-2048` (стандартно), `RSA-3072`, `RSA-4096` або `ECDSA-P256`.

## Вибір терміну дії сертифіката {#choosing-cert-validity-period}

kubeadm дозволяє вибирати період дії сертифікатів центрів сертифікації та листових сертифікатів. Це можна зробити за допомогою полів `certificateValidityPeriod` і `caCertificateValidityPeriod`
в конфігурації kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
certificateValidityPeriod: 8760h # Стандартно: 365 днів × 24 години = 1 рік
caCertificateValidityPeriod: 87600h # Стандартно: 365 днів × 24 години * 10 = 10 років
```

Значення полів відповідають прийнятому формату для значень [Go's `time.Duration`](https://pkg.go.dev/time#ParseDuration), при цьому найдовшою одиницею виміру є `h` (години).

## Режим зовнішнього ЦС {#external-ca-mode}

Також можливо надати лише файл `ca.crt` і не файл `ca.key` (це доступно лише для файлу кореневого ЦС, а не інших пар сертифікатів). Якщо всі інші сертифікати та файли kubeconfig на місці, kubeadm розпізнає цю умову та активує режим "Зовнішній ЦС". kubeadm буде продовжувати без ключа ЦС на диску.

Замість цього, запустіть контролер-менеджер самостійно з параметром `--controllers=csrsigner` та вкажіть на сертифікат та ключ ЦС.

Існують різні способи підготовки облікових даних компонента при використанні режиму зовнішнього ЦС.

Цей посібник описує використання команди `openssl` (використовується для ручного підписання сертифікатів, якщо ви обираєте цей підхід), але ви можете використовувати інші інструменти, яким надаєте перевагу.

### Ручна підготовка облікових даних компонента {#manual-preparation-of-component-credentials}

[Сертифікати PKI та вимоги](/docs/setup/best-practices/certificates/) містять інформацію про те, як підготувати всі необхідні облікові дані для компонентів, які вимагаються kubeadm, вручну.

### Підготовка облікових даних компонента шляхом підпису CSR, що генеруються kubeadm {#preparation-of-credentials-by-signing-csrs-generated-by-kubeadm}

kubeadm може [генерувати файли CSR](#signing-csr), які ви можете підписати вручну за допомогою інструментів, таких як `openssl`, та вашого зовнішнього ЦС. Ці файли CSR будуть включати всі вказівки для облікових даних, які вимагаються компонентами, розгорнутими kubeadm.

### Автоматизована підготовка облікових даних компонента за допомогою фаз kubeadm {#automated-preparation-of-component-credentials-by-using-kubeadm-phases}

З іншого боку, можливо використовувати команди фаз kubeadm для автоматизації цього процесу.

- Перейдіть на хост, який ви хочете підготувати як вузол панелі управління kubeadm з зовнішнім ЦС.
- Скопіюйте зовнішні файли ЦС `ca.crt` та `ca.key`, які ви маєте, до `/etc/kubernetes/pki` на вузлі.
- Підготуйте тимчасовий [файл конфігурації kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) під назвою `config.yaml`, який можна використовувати з `kubeadm init`. Переконайтеся, що цей файл містить будь-яку відповідну інформацію на рівні кластера або хосту, яка може бути включена в сертифікати, таку як, `ClusterConfiguration.controlPlaneEndpoint`, `ClusterConfiguration.certSANs` та `InitConfiguration.APIEndpoint`.
- На тому ж самому хості виконайте команди `kubeadm init phase kubeconfig all --config config.yaml` та `kubeadm init phase certs all --config config.yaml`. Це згенерує всі необхідні файли kubeconfig та сертифікати у теці `/etc/kubernetes/` та її підтеці `pki`.
- Перевірте згенеровані файли. Видаліть `/etc/kubernetes/pki/ca.key`, видаліть або перемістіть в безпечне місце файл `/etc/kubernetes/super-admin.conf`.
- На вузлах, де буде викликано `kubeadm join`, також видаліть `/etc/kubernetes/kubelet.conf`. Цей файл потрібний лише на першому вузлі, де буде викликано `kubeadm init`.
- Зауважте, що деякі файли, такі як `pki/sa.*`, `pki/front-proxy-ca.*` та `pki/etc/ca.*`, спільно використовуються між вузлами панелі управління, Ви можете згенерувати їх один раз та [розподілити їх вручну](/docs/setup/production-environment/tools/kubeadm/high-availability/#manual-certs) на вузли, де буде викликано `kubeadm join`, або ви можете використовувати функціональність `--upload-certs` `kubeadm init` та `--certificate-key` `kubeadm join` для автоматизації цього розподілу.

Після того, як облікові дані будуть підготовлені на всіх вузлах, викличте `kubeadm init` та `kubeadm join` для цих вузлів, щоб приєднати їх до кластера. kubeadm використовуватиме наявні файли kubeconfig та сертифікати у теці `/etc/kubernetes/` та її підтеці `pki`.

## Закінчення терміну дії сертифікатів та управління ними {#check-sertificate-expiration}

{{< note >}}
`kubeadm` не може керувати сертифікатами, підписаними зовнішнім ЦС.
{{< /note >}}

Ви можете використовувати підкоманду `check-expiration`, щоб перевірити термін дії сертифікатів:

```shell
kubeadm certs check-expiration
```

Вивід подібний до наступного:

```console
CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
admin.conf                 Dec 30, 2020 23:36 UTC   364d                                    no
apiserver                  Dec 30, 2020 23:36 UTC   364d            ca                      no
apiserver-etcd-client      Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
apiserver-kubelet-client   Dec 30, 2020 23:36 UTC   364d            ca                      no
controller-manager.conf    Dec 30, 2020 23:36 UTC   364d                                    no
etcd-healthcheck-client    Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-peer                  Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-server                Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
front-proxy-client         Dec 30, 2020 23:36 UTC   364d            front-proxy-ca          no
scheduler.conf             Dec 30, 2020 23:36 UTC   364d                                    no

CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
ca                      Dec 28, 2029 23:36 UTC   9y              no
etcd-ca                 Dec 28, 2029 23:36 UTC   9y              no
front-proxy-ca          Dec 28, 2029 23:36 UTC   9y              no
```

Команда показує час закінчення та залишковий час для сертифікатів клієнта у теці `/etc/kubernetes/pki` та для сертифіката клієнта, вбудованого у файли kubeconfig, що використовуються kubeadm (`admin.conf`, `controller-manager.conf` та `scheduler.conf`).

Крім того, kubeadm повідомляє користувача, якщо керування сертифікатом відбувається ззовні; у цьому випадку користувачу слід самостійно забезпечити керування поновленням сертифікатів вручну/за допомогою інших інструментів.

Файл конфігурації `kubelet.conf` не включений у цей список, оскільки kubeadm налаштовує kubelet на [автоматичне поновлення сертифікатів](/docs/tasks/tls/certificate-rotation/) зі змінними сертифікатами у теці `/var/lib/kubelet/pki`. Для відновлення простроченого сертифіката клієнта kubelet див.
[Помилка оновлення сертифіката клієнта kubelet](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#kubelet-client-cert).

{{< note >}}
На вузлах, створених за допомогою `kubeadm init`, до версії kubeadm 1.17, існує [помилка](https://github.com/kubernetes/kubeadm/issues/1753), де вам потрібно вручну змінити зміст `kubelet.conf`. Після завершення `kubeadm init` ви повинні оновити `kubelet.conf`, щоб вказати на змінені сертифікати клієнта kubelet, замінивши `client-certificate-data` та `client-key-data` на:

```yaml
client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```

{{< /note >}}

## Автоматичне поновлення сертифікатів {#automatic-certificate-renewal}

kubeadm поновлює всі сертифікати під час оновлення [панелі управління](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).

Ця функція призначена для вирішення найпростіших випадків використання; якщо у вас немає конкретних вимог до поновлення сертифікатів і ви регулярно виконуєте оновлення версії Kubernetes (частіше ніж 1 раз на рік між кожним оновленням), kubeadm буде піклуватися про те, щоб ваш кластер був завжди актуальним і досить безпечним.

Якщо у вас є складніші вимоги до поновлення сертифікатів, ви можете відмовитися від стандартної поведінки, передавши `--certificate-renewal=false` до `kubeadm upgrade apply` або до `kubeadm upgrade node`.

## Ручне поновлення сертифікатів {#manual-certificate-renewal}

Ви можете в будь-який момент вручну оновити свої сертифікати за допомогою команди `kubeadm certs renew` з відповідними параметрами командного рядка. Якщо ви використовуєте кластер з реплікованою панеллю управління, цю команду потрібно виконати на всіх вузлах панелі управління.

Ця команда виконує поновлення за допомогою сертифіката та ключа ЦС (або front-proxy-CA), збережених у `/etc/kubernetes/pki`.

`kubeadm certs renew` використовує поточні сертифікати як авторитетне джерело для атрибутів ( Common Name, Organization, subject alternative name) і не покладається на `kubeadm-config` ConfigMap.  Незважаючи на це, проєкт Kubernetes рекомендує зберігати сертифікат, що обслуговується, та повʼязані з ним значення у цьому файлі ConfigMap синхронізовано, щоб уникнути будь-якого ризику плутанини.

Після виконання команди вам слід перезапустити Podʼи панелі управління. Це необхідно, оскільки
динамічне перезавантаження сертифікатів наразі не підтримується для всіх компонентів та сертифікатів. [Статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/) керуються локальним kubelet і не API-сервером, тому kubectl не може бути використаний для їх видалення та перезапуску. Щоб перезапустити статичний Pod, ви можете тимчасово видалити файл його маніфеста з `/etc/kubernetes/manifests/` і зачекати 20 секунд (див. значення `fileCheckFrequency` у [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/)). kubelet завершить роботу Pod, якщо він більше не знаходиться в теці маніфестів. Потім ви можете повернути файл назад і після ще одного періоду `fileCheckFrequency` kubelet знову створить Pod, і поновлення сертифікатів для компонента буде завершено.

`kubeadm certs renew` може оновити будь-який конкретний сертифікат або, за допомогою підкоманди `all`, він може оновити всі з них, як показано нижче:

```shell
# Якщо ви використовуєте кластер з реплікованою панеллю управління, цю команду
# потрібно виконати на всіх вузлах панеллі управління.
kubeadm certs renew all
```

### Копіювання сертифіката адміністратора (необовʼязково) {#admin-certificate-copy}

Кластери, побудовані за допомогою kubeadm, часто копіюють сертифікат `admin.conf` у `$HOME/.kube/config`, як вказано у [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/). У такій системі, для оновлення вмісту `$HOME/.kube/config` після поновлення `admin.conf`, вам треба виконати наступні команди:

```shell
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Поновлення сертифікатів за допомогою API сертифікатів Kubernetes {#renew-certificates-with-the-kubernetes-certificates-api}

У цьому розділі надаються додаткові відомості про те, як виконати ручне поновлення сертифікатів за допомогою API сертифікатів Kubernetes.

{{< caution >}}
Це розширені теми для користувачів, які потребують інтеграції сертифікатної інфраструктури своєї організації в кластер, побудований за допомогою kubeadm. Якщо типово конфігурація kubeadm відповідає вашим потребам, вам слід дозволити kubeadm керувати сертифікатами.
{{< /caution >}}

### Налаштування підписувача {#set-up-a-signer}

Kubernetes Certificate Authority не працює зразу. Ви можете налаштувати зовнішнього підписувача, такого як [cert-manager](https://cert-manager.io/docs/configuration/ca/), або можете використовувати вбудованого підписувача.

Вбудований підписувач є частиною [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Для активації вбудованого підписувача вам необхідно передати прапорці `--cluster-signing-cert-file` та `--cluster-signing-key-file`.

Якщо ви створюєте новий кластер, ви можете використовувати [файл конфігурації kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/):

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "cluster-signing-cert-file"
    value: "/etc/kubernetes/pki/ca.crt"
  - name: "cluster-signing-key-file"
    value: "/etc/kubernetes/pki/ca.key"
```

### Створення запитів на підпис сертифікатів (CSR) {#create-certificate-signing-requests-csr}

Дивіться [Створення CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatessigningrequest) для створення CSRs за допомогою API Kubernetes.

## Поновлення сертифікатів зовнішнім ЦС {#renew-certificates-with-external-ca}

У цьому розділі надаються додаткові відомості про те, як виконати ручне поновлення сертифікатів за допомогою зовнішнього ЦС.

Для кращої інтеграції з зовнішніми ЦС, kubeadm також може створювати запити на підпис сертифікатів (CSR). Запит на підпис сертифіката є запитом до ЦС на підписаний сертифікат для клієнта. За термінологією kubeadm, будь-який сертифікат, який зазвичай підписується ЦС на диску, може бути створений у вигляді CSR. Однак ЦС не може бути створено як CSR.

### Поновлення за допомогою запитів на підпис сертифікатів (CSR) {#create-certificate-signing-requests-csr}

Поновлення сертифікатів можливе шляхом генерації нових CSR і підпису їх зовнішнім ЦС. Для отримання докладнішої інформації щодо роботи з CSR, створеними kubeadm, див. розділ [Підпис запитів на підпис сертифікатів (CSR), згенерованих kubeadm](#signing-csr).

## Оновлення Certificate authority (ЦС) {#certificate-authority-rotation}

Kubeadm не підтримує автоматичне оновлення або заміну сертифікатів ЦС зразу.

Для отримання додаткової інформації про ручне оновлення або заміну ЦС дивіться [ручне оновлення сертифікатів ЦС](/docs/tasks/tls/manual-rotation-of-ca-certificates/).

## Ввімкнення підписаних службових сертифікатів kubelet {#kubelet-serving-certs}

Типово службовий сертифікат kubelet, розгорнутий за допомогою kubeadm, є самопідписним. Це означає, що зʼєднання зовнішніх служб, наприклад, [сервера метрик](https://github.com/kubernetes-sigs/metrics-server) з kubelet, не може бути захищено TLS.

Щоб налаштувати kubelet в новому кластері kubeadm для отримання належно підписаних службових сертифікатів, ви повинні передати наступну мінімальну конфігурацію до `kubeadm init`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
serverTLSBootstrap: true
```

Якщо ви вже створили кластер, вам слід адаптувати його, виконавши наступне:

- Знайдіть і відредагуйте ConfigMap `kubelet-config` в просторі імен `kube-system`. У ConfigMap ключ `kubelet` має документ [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/) як своє значення. Відредагуйте документ KubeletConfiguration, щоб встановити `serverTLSBootstrap: true`.
- На кожному вузлі додайте поле `serverTLSBootstrap: true` у `/var/lib/kubelet/config.yaml` і перезапустіть kubelet за допомогою `systemctl restart kubelet`.

Поле `serverTLSBootstrap: true` дозволить ініціювати завантаження службових сертифікатів kubelet, запитуючи їх з API `certificates.k8s.io`. Одне з відомих обмежень поля `serverTLSBootstrap: true` — CSRs (запити на підпис сертифікатів) для цих сертифікатів не можуть бути автоматично затверджені типовим підписувачем в kube-controller-manager — [`kubernetes.io/kubelet-serving`](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers). Це потребує дій користувача або стороннього контролера.

Ці CSRs можна переглянути за допомогою:

```shell
kubectl get csr
```

```console
NAME        AGE     SIGNERNAME                        REQUESTOR                      CONDITION
csr-9wvgt   112s    kubernetes.io/kubelet-serving     system:node:worker-1           Pending
csr-lz97v   1m58s   kubernetes.io/kubelet-serving     system:node:control-plane-1    Pending
```

Щоб затвердити їх, ви можете виконати наступне:

```shell
kubectl certificate approve <CSR-name>
```

Типово ці службові сертифікати закінчуються через рік. Kubeadm встановлює поле `rotateCertificates` в `true` у `KubeletConfiguration`, що означає, що близько до закінчення буде створено новий набір CSRs для службових сертифікатів і їх слід затвердити, щоб завершити оновлення. Для отримання додаткової інформації дивіться [Оновлення сертифікатів](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#certificate-rotation).

Якщо ви шукаєте рішення для автоматичного затвердження цих CSRs, рекомендується звернутися до свого постачальника хмарних послуг і дізнатись, чи він має підписувача CSR, який перевіряє ідентифікацію вузла за допомогою окремого механізму.

{{% thirdparty-content %}}

Ви можете використовувати власні контролери сторонніх постачальників:

- [kubelet-csr-approver](https://github.com/postfinance/kubelet-csr-approver)

Такий контролер не є безпечним механізмом, якщо він перевіряє лише CommonName в CSR, але також перевіряє запитані IP-адреси та доменні імена. Це запобігло б зловмиснику, який має доступ до сертифіката клієнта kubelet, створювати CSRs, запитуючи службові сертифікати для будь-якої IP-адреси або доменного імені.

## Генерація файлів kubeconfig для додаткових користувачів {#kubeconfig-additional-users}

Під час створення кластера, `kubeadm init` підписує сертифікат у `super-admin.conf`, щоб мати `Subject: O = system:masters, CN = kubernetes-super-admin`. [`system:masters`](/docs/reference/access-authn-authz/rbac/#user-facing-roles) є групою суперкористувачів, яка обходить рівень авторизації (наприклад, [RBAC](/docs/reference/access-authn-authz/rbac/)). Файл `admin.conf` також створюється за допомогою kubeadm на вузлах панелі управління і містить сертифікат з `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins` це група, яка логічно належить до kubeadm. Якщо ваш кластер використовує RBAC (стандартний параметр kubeadm), група `kubeadm:cluster-admins` буде привʼязана до ClusterRole групи [`cluster-admin`](/docs/reference/access-authn-authz/rbac/#user-facing-roles).

{{< warning >}}
Уникайте спільного доступу до файлів `super-admin.conf` або `admin.conf`. Замість цього створіть найменш привілейований доступ навіть для людей, які працюють адміністраторами, і використовуйте цю найменш привілейовану альтернативу для будь-чого, крім аварійного (екстреного) доступу.
{{< /warning >}}

Замість цього, ви можете використовувати команду [`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) для генерації файлів kubeconfig для додаткових користувачів. Команда приймає змішаний набір параметрів командного рядка та опцій конфігурації [kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/). Згенерований kubeconfig буде записаний до stdout і може бути перенаправлений у файл за допомогою `kubeadm kubeconfig user ... > somefile.conf`.

Приклад конфігураційного файлу, який можна використовувати з `--config`:

```yaml
# example.yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
# Буде використано як цільовий "кластер" у kubeconfig
clusterName: "kubernetes"
# Буде використано як "сервер" (IP або DNS-імʼя) цього кластера в kubeconfig
controlPlaneEndpoint: "some-dns-address:6443"
# Ключ і сертифікат ЦС кластера будуть завантажені з цієї локальної теки
certificatesDir: "/etc/kubernetes/pki"
```

Переконайтеся, що ці параметри відповідають бажаним параметрам цільового кластера. Щоб переглянути параметри поточного кластера, скористайтеся:

```shell
kubectl get cm kubeadm-config -n kube-system -o=jsonpath="{.data.ClusterConfiguration}"
```

Наступний приклад згенерує файл kubeconfig з обліковими даними, дійсними протягом 24 годин, для нового користувача `johndoe`, який належить до групи `appdevs`:

```shell
kubeadm kubeconfig user --config example.yaml --org appdevs --client-name johndoe --validity-period 24h
```

Наступний приклад згенерує файл kubeconfig з обліковими даними адміністратора, дійсними протягом 1 тижня:

```shell
kubeadm kubeconfig user --config example.yaml --client-name admin --validity-period 168h
```

## Підписування запитів на підпис сертифікатів (CSR), згенерованих kubeadm {#signing-csr}

Ви можете створювати запити на підпис сертифікатів за допомогою `kubeadm certs generate-csr`. Виклик цієї команди згенерує пари файлів `.csr` / `.key` для звичайних сертифікатів. Для сертифікатів, вбудованих у файли kubeconfig, команда згенерує пару файлів `.csr` / `.conf`, де ключ вже вбудований у файл `.conf`.

Файл CSR містить всю необхідну інформацію для ЦС для підпису сертифіката. kubeadm використовує [чітко визначену специфікацію](/docs/setup/best-practices/certificates/#all-certificates) для всіх своїх сертифікатів і CSR.

Типовою текою для сертифікатів є `/etc/kubernetes/pki`, тоді як типова тека для файлів kubeconfig є `/etc/kubernetes`. Ці стандартні значення можна змінити за допомогою прапорців `--cert-dir` та `--kubeconfig-dir`, відповідно.

Для передачі власних параметрів команді `kubeadm certs generate-csr` використовуйте прапорець `--config`, який приймає файл [конфігурації kubeadm](/docs/reference/config-api/kubeadm-config.4/), так само як і команди, такі як `kubeadm init`. Будь-яка специфікація, така як додаткові SAN та власні IP-адреси, повинна зберігатися в тому ж файлі конфігурації та використовуватися для всіх відповідних команд kubeadm, передаючи його як `--config`.

{{< note >}}
У цьому керівництві буде використано стандартну теку Kubernetes `/etc/kubernetes`, що вимагає прав доступу суперкористувача. Якщо ви дотримуєтесь цього керівництва та використовуєте теки, в яки ви можете писати, (зазвичай, це означає виконання `kubeadm` з `--cert-dir` та `--kubeconfig-dir`), ви можете пропустити команду `sudo`.

Потім ви повинні скопіювати створені файли до теки `/etc/kubernetes`, щоб `kubeadm init` або `kubeadm join` могли їх знайти.
{{< /note >}}

### Підготовка файлів ЦС та сервісного облікового запису {#prepare-ca-and-service-account-files}

На головному вузлі панелі управління, де буде виконано команду `kubeadm init`, виконайте наступні команди:

```shell
sudo kubeadm init phase certs ca
sudo kubeadm init phase certs etcd-ca
sudo kubeadm init phase certs front-proxy-ca
sudo kubeadm init phase certs sa
```

Це заповнить теки `/etc/kubernetes/pki` та `/etc/kubernetes/pki/etcd` усіма самопідписними файлами ЦС (сертифікати та ключі) та сервісним обліковим записом (публічні та приватні ключі), які необхідні kubeadm для вузла панелі управління.

{{< note >}}
Якщо ви використовуєте зовнішній ЦС, вам потрібно згенерувати ті ж самі файли окремо та вручну скопіювати їх на головний вузол панелі управління у `/etc/kubernetes`.

Після підписання всіх CSR ви можете видалити ключ кореневого ЦС (`ca.key`), як зазначено у розділі [Режим зовнішнього ЦС](#external-ca-mode).
{{< /note >}}

Для другорядних вузлів панелі управління (`kubeadm join --control-plane`) нема потреби викликати вищезазначені команди. Залежно від того, як ви налаштували [Високодоступний](/docs/setup/production-environment/tools/kubeadm/high-availability) кластер, вам або потрібно вручну скопіювати ті ж самі файли з головного вузла панелі управління, або використати автоматизовану функціональність `--upload-certs` від `kubeadm init`.

### Генерація CSR {#generate-csrs}

Команда `kubeadm certs generate-csr` генерує CSR для всіх відомих сертифікатів, якими керує kubeadm. Після завершення команди вам потрібно вручну видалити файли `.csr`, `.conf` або `.key`, які вам не потрібні.

### Врахування kubelet.conf {#considerations-kubelet-conf}

Цей розділ стосується як вузлів панелі управління, так і робочих вузлів.

Якщо ви видалили файл `ca.key` з вузлів панелі управління ([Режим зовнішнього ЦС](#external-ca-mode)), активний kube-controller-manager у цьому кластері не зможе підписати клієнтські сертифікати kubelet. Якщо у вашій конфігурації не існує зовнішнього методу для підписання цих сертифікатів (наприклад, [зовнішній підписувач](#set-up-a-signer)), ви могли б вручну підписати `kubelet.conf.csr`, як пояснено в цьому посібнику.

Зверніть увагу, що це також означає, що автоматичне [оновлення клієнтського сертифіката kubelet](/docs/tasks/tls/certificate-rotation/#enabling-client-certificate-rotation) буде відключено. Таким чином, близько до закінчення терміну дії сертифіката, вам потрібно буде генерувати новий `kubelet.conf.csr`, підписувати сертифікат, вбудовувати його в `kubelet.conf` і перезапускати kubelet.

Якщо це не стосується вашої конфігурації, ви можете пропустити обробку `kubelet.conf.csr` на другорядних вузлах панелі управління та на робочих вузлах (всі вузли, що викликають `kubeadm join ...`). Це тому, що активний kube-controller-manager буде відповідальний за підписання нових клієнтських сертифікатів kubelet.

{{< note >}}
Ви повинні обробити файл `kubelet.conf.csr` на первинному вузлі панелі управління (хост, на якому ви спочатку запустили `kubeadm init`). Це повʼязано з тим, що `kubeadm` розглядає цей вузол як вузол, з якого завантажується кластер, і попередньо заповнений файл `kubelet.conf` потрібен.
{{< /note >}}

#### Вузли панелі управління {#control-plane-nodes}

Виконайте наступну команду на головному (`kubeadm init`) та вторинних (`kubeadm join --control-plane`) вузлах панелі управління, щоб згенерувати всі файли CSR:

```shell
sudo kubeadm certs generate-csr
```

Якщо має використовуватися зовнішній etcd, дотримуйтесь керівництва [Зовнішній etcd з kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/#external-etcd-nodes), щоб зрозуміти, які файли CSR потрібні на вузлах kubeadm та etcd. Інші файли `.csr` та `.key` у теці `/etc/kubernetes/pki/etcd` можна видалити.

Виходячи з пояснення у розділі [Врахування kubelet.conf](#considerations-kubelet-conf), збережіть або видаліть файли `kubelet.conf` та `kubelet.conf.csr`.

#### Робочі вузли {#worker-nodes}

Згідно з поясненням у розділі [Врахування kubelet.conf](#considerations-kubelet-conf), за необхідності викличте:

```shell
sudo kubeadm certs generate-csr
```

та залиште лише файли `kubelet.conf` та `kubelet.conf.csr`. Альтернативно, повністю пропустіть кроки для робочих вузлів.

### Підписання CSR для всіх сертифікатів {#signing-csrs-for-all-certificates}

{{< note >}}
Якщо ви використовуєте зовнішній ЦС та вже маєте файли серійних номерів ЦС (`.srl`) для `openssl`, ви можете скопіювати такі файли на вузол kubeadm, де будуть оброблятися CSR. Файли `.srl`, які потрібно скопіювати, це: `/etc/kubernetes/pki/ca.srl`, `/etc/kubernetes/pki/front-proxy-ca.srl` та `/etc/kubernetes/pki/etcd/ca.srl`. Потім файли можна перемістити на новий вузол, де будуть оброблятися файли CSR.

Якщо файл `.srl` для ЦС відсутній на вузлі, скрипт нижче згенерує новий файл SRL з випадковим початковим серійним номером.

Щоб дізнатися більше про файли `.srl`, дивіться документацію [`openssl`](https://www.openssl.org/docs/man3.0/man1/openssl-x509.html) для прапорця `--CAserial`.
{{< /note >}}

Повторіть цей крок для всіх вузлів, що мають файли CSR.

Запишіть наступний скрипт у теку `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт. Скрипт згенерує сертифікати для всіх файлів CSR, які присутні в дереві `/etc/kubernetes`.

```bash
#!/bin/bash

# Встановіть термін дії сертифіката в днях
DAYS=365

# Обробіть всі файли CSR, крім тих, що призначені для front-proxy і etcd
find ./ -name "*.csr" | grep -v "pki/etcd" | grep -v "front-proxy" | while read -r FILE;
do
    echo "* Обробка ${FILE} ..."
    FILE=${FILE%.*} # Відкинути розширення
    if [ -f "./pki/ca.srl" ]; then
        SERIAL_FLAG="-CAserial ./pki/ca.srl"
    else
        SERIAL_FLAG="-CAcreateserial"
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/ca.crt -CAkey ./pki/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
    sleep 2
done

# Обробіть всі CSR для etcd
find ./pki/etcd -name "*.csr" | while read -r FILE;
do
    echo "* Обробка ${FILE} ..."
    FILE=${FILE%.*} # Відкинути розширення
    if [ -f "./pki/etcd/ca.srl" ]; then
        SERIAL_FLAG=-CAserial ./pki/etcd/ca.srl
    else
        SERIAL_FLAG=-CAcreateserial
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/etcd/ca.crt -CAkey ./pki/etcd/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
done

# Обробіть CSR для front-proxy
echo "* Обробка ./pki/front-proxy-client.csr ..."
openssl x509 -req -days "${DAYS}" -CA ./pki/front-proxy-ca.crt -CAkey ./pki/front-proxy-ca.key -CAcreateserial \
    -in ./pki/front-proxy-client.csr -out ./pki/front-proxy-client.crt
```

### Вбудовування сертифікатів у файли kubeconfig {#embedding-certificates-in-kubeconfig-files}

Повторіть цей крок для всіх вузлів, що мають файли CSR.

Запишіть наступний скрипт у теку `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт. Скрипт візьме файли `.crt`, які були підписані для файлів kubeconfig з CSR на попередньому кроці, та вбудує їх у файли kubeconfig.

```bash
#!/bin/bash

CLUSTER=kubernetes
find ./ -name "*.conf" | while read -r FILE;
do
    echo "* Обробка ${FILE} ..."
    KUBECONFIG="${FILE}" kubectl config set-cluster "${CLUSTER}" --certificate-authority ./pki/ca.crt --embed-certs
    USER=$(KUBECONFIG="${FILE}" kubectl config view -o jsonpath='{.users[0].name}')
    KUBECONFIG="${FILE}" kubectl config set-credentials "${USER}" --client-certificate "${FILE}.crt" --embed-certs
done
```

### Виконання очищення {#post-csr-cleanup}

Виконайте цей крок на всіх вузлах, які мають файли CSR.

Запишіть наступний скрипт у теці `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт.

```bash
#!/bin/bash

# Очищення файлів CSR
rm -f ./*.csr ./pki/*.csr ./pki/etcd/*.csr # Очистка всіх файлів CSR

# Очищення файлів CRT, які вже були вбудовані у файли kubeconfig
rm -f ./*.crt
```

За бажанням, перемістіть файли `.srl` на наступний вузол, який буде оброблено.

За бажанням, якщо використовується зовнішній ЦС, видаліть файл `/etc/kubernetes/pki/ca.key`, як пояснено у розділі [Вузол зовнішнього ЦС](#external-ca-mode).

### Ініціалізація вузла kubeadm {#kubeadm-node-initialization}

Як тільки файли CSR підписані і необхідні сертифікати розміщені на хостах, які ви хочете використовувати як вузли, ви можете використовувати команди `kubeadm init` та `kubeadm join` для створення Kubernetes кластера з цих вузлів. Під час `init` та `join`, kubeadm використовує існуючі сертифікати, ключі шифрування та файли kubeconfig, які він знаходить у дереві `/etc/kubernetes` у локальній файловій системі хоста.
