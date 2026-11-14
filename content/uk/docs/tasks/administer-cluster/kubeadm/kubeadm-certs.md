---
title: Управління сертифікатами з kubeadm
content_type: task
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.15" state="stable" >}}

Термін дії клієнтських сертифікатів, які генерує [kubeadm](/docs/reference/setup-tools/kubeadm/), спливає через 1 рік. Ця сторінка пояснює, як керувати поновленням сертифікатів за допомогою kubeadm. Вона також охоплює інші завдання, повʼязані з керуванням сертифікатами kubeadm.

Проєкт Kubernetes рекомендує оперативно оновлюватись до останніх випусків патчів, а також переконатися, що ви використовуєте підтримуваний мінорний випуск Kubernetes. Дотримання цих рекомендацій допоможе вам залишатися в безпеці.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви повинні бути знайомі з [сертифікатами PKI та вимогами Kubernetes](/docs/setup/best-practices/certificates/).

Ви маєте знати, як передати файл [конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) командам kubeadm.

Цей посібник описує використання команди `openssl` (використовується для ручного підписання сертифікатів, якщо ви обираєте цей підхід), але ви можете використовувати інші інструменти, яким надаєте перевагу.

Деякі кроки тут використовують `sudo` для адміністративного доступу. Ви можете використовувати будь-який еквівалентний інструмент.

<!-- steps -->

## Використання власних сертифікатів {#custom-certificates}

Стандартно, kubeadm генерує всі необхідні сертифікати для роботи кластера. Ви можете перевизначити цю поведінку, надавши власні сертифікати.

Для цього вам потрібно помістити їх у ту теку, яка вказується за допомогою прапорця `--cert-dir` або поля `certificatesDir` конфігурації кластера `ClusterConfiguration` kubeadm. Стандартно це `/etc/kubernetes/pki`.

Якщо певна пара сертифіката й приватного ключа вже існує до запуску `kubeadm init`, kubeadm не перезаписує їх. Це означає, що ви можете, наприклад, скопіювати наявний CA (центр сертифікації, certificate authority) в `/etc/kubernetes/pki/ca.crt` та `/etc/kubernetes/pki/ca.key`, і kubeadm використовуватиме цей CA для підпису решти сертифікатів.

## Вибір алгоритму шифрування {#choosing-encryption-algorithm}

kubeadm дозволяє вибрати алгоритм шифрування, який використовується для створення відкритих і закритих ключів. Це можна зробити за допомогою поля `encryptionAlgorithm` у конфігурації kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
encryptionAlgorithm: <ALGORITHM>
```

`<ALGORITHM>` може бути одним з: `RSA-2048` (стандартно), `RSA-3072`, `RSA-4096` або `ECDSA-P256`.

## Вибір терміну дії сертифіката {#choosing-cert-validity-period}

kubeadm дозволяє вибирати термін дії сертифікатів CA та кінцевих (leaf) сертифікатів. Це можна зробити за допомогою полів `certificateValidityPeriod` і `caCertificateValidityPeriod` у конфігурації kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
certificateValidityPeriod: 8760h # Стандартно: 365 днів × 24 години = 1 рік
caCertificateValidityPeriod: 87600h # Стандартно: 365 днів × 24 години * 10 = 10 років
```

Значення полів відповідають прийнятому формату [значень Go `time.Duration`](https://pkg.go.dev/time#ParseDuration), при цьому найбільшою підтримуваною одиницею є `h` (години).

## Режим зовнішнього CA {#external-ca-mode}

Також можна надати лише файл `ca.crt` без файлу `ca.key` (це доступно лише для файлу кореневого CA, а не для інших пар сертифікатів). Якщо всі інші сертифікати та файли kubeconfig на місці, kubeadm розпізнає цю ситуацію та вмикає режим "External CA". kubeadm продовжить роботу без ключа CA на диску.

Натомість запустіть controller-manager окремо з `--controllers=csrsigner` і вкажіть сертифікат і ключ CA.

Існують різні способи підготовки облікових даних компонентів під час використання режиму зовнішнього CA.

### Ручна підготовка облікових даних компонента {#manual-preparation-of-component-credentials}

[Сертифікати PKI та вимоги](/docs/setup/best-practices/certificates/) містять інформацію про те, як вручну підготувати всі облікові дані компонентів, які потрібні kubeadm.

Цей посібник описує використання команди `openssl` (використовується для ручного підписання сертифікатів, якщо ви обираєте цей підхід), але ви можете використовувати інші інструменти, яким надаєте перевагу.

### Підготовка облікових даних компонента шляхом підпису CSR, що генеруються kubeadm {#preparation-of-credentials-by-signing-csrs-generated-by-kubeadm}

kubeadm може [генерувати файли CSR](#signing-csr), які ви можете підписати вручну за допомогою інструментів, таких як `openssl`, та вашого зовнішнього CA. Ці файли CSR міститимуть усю специфікацію облікових даних, потрібних компонентам, розгорнутим kubeadm.

### Автоматизована підготовка облікових даних компонента за допомогою фаз kubeadm {#automated-preparation-of-component-credentials-by-using-kubeadm-phases}

Як альтернатива, можна використовувати команди фаз kubeadm для автоматизації цього процесу.

- Перейдіть на хост, який ви хочете підготувати як вузол панелі управління kubeadm з зовнішнім CA.
- Скопіюйте зовнішні файли CA `ca.crt` та `ca.key`, які ви маєте, до `/etc/kubernetes/pki` на вузлі.
- Підготуйте тимчасовий [файл конфігурації kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) під назвою `config.yaml`, який можна використовувати з `kubeadm init`. Переконайтеся, що цей файл містить будь-яку відповідну інформацію на рівні кластера або хосту, яка може бути включена в сертифікати, таку як, `ClusterConfiguration.controlPlaneEndpoint`, `ClusterConfiguration.certSANs` та `InitConfiguration.APIEndpoint`.
- На тому ж самому хості виконайте команди `kubeadm init phase kubeconfig all --config config.yaml` та `kubeadm init phase certs all --config config.yaml`. Це згенерує всі необхідні файли kubeconfig та сертифікати у теці `/etc/kubernetes/` та її підтеці `pki`.
- Перевірте згенеровані файли. Видаліть `/etc/kubernetes/pki/ca.key`, видаліть або перемістіть в безпечне місце файл `/etc/kubernetes/super-admin.conf`.
- На вузлах, де буде викликано `kubeadm join`, також видаліть `/etc/kubernetes/kubelet.conf`. Цей файл потрібний лише на першому вузлі, де буде викликано `kubeadm init`.
- Зауважте, що деякі файли, такі як `pki/sa.*`, `pki/front-proxy-ca.*` та `pki/etc/ca.*`, спільні для вузлів панелі управління. Ви можете згенерувати їх один раз і [розподілити їх вручну](/docs/setup/production-environment/tools/kubeadm/high-availability/#manual-certs) на вузли, де буде викликано `kubeadm join`, або використати функціональність [`--upload-certs`](/docs/setup/production-environment/tools/kubeadm/high-availability/#stacked-control-plane-and-etcd-nodes) команди `kubeadm init` та `--certificate-key` команди `kubeadm join` для автоматизації цього розподілу.

Після того, як облікові дані будуть підготовлені на всіх вузлах, викличте `kubeadm init` та `kubeadm join` для цих вузлів, щоб приєднати їх до кластера. kubeadm використовуватиме наявні файли kubeconfig та сертифікати у теці `/etc/kubernetes/` та її підтеці `pki`.

## Закінчення терміну дії сертифікатів і керування ними {#check-certificate-expiration}

{{< note >}}
`kubeadm` не може керувати сертифікатами, підписаними зовнішнім CA.
{{< /note >}}

Ви можете використовувати підкоманду `check-expiration`, щоб перевірити термін дії сертифікатів:

```shell
kubeadm certs check-expiration
```

Вивід подібний до такого:

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

Команда показує час закінчення терміну дії та залишковий час для клієнтських сертифікатів у теці `/etc/kubernetes/pki` та для клієнтського сертифіката, вбудованого у файли kubeconfig, які використовує kubeadm (`admin.conf`, `controller-manager.conf` та `scheduler.conf`).

Крім того, kubeadm повідомляє користувача, якщо керування сертифікатом відбувається ззовні; у цьому випадку користувачу слід самостійно забезпечити керування поновленням сертифікатів вручну/за допомогою інших інструментів.

Файл конфігурації `kubelet.conf` не включено в цей список, оскільки kubeadm налаштовує kubelet на [автоматичне поновлення сертифікатів](/docs/tasks/tls/certificate-rotation/) з ротацією сертифікатів у `/var/lib/kubelet/pki`. Щоб виправити прострочений клієнтський сертифікат kubelet, див. [Збій ротації клієнтського сертифіката kubelet](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#kubelet-client-cert).

{{< note >}}
На вузлах, створених за допомогою `kubeadm init` у версіях kubeadm до 1.17, існує [помилка](https://github.com/kubernetes/kubeadm/issues/1753), через яку вам потрібно вручну змінити вміст `kubelet.conf`. Після завершення `kubeadm init` слід оновити `kubelet.conf`, щоб він вказував на ротовані клієнтські сертифікати kubelet, замінивши `client-certificate-data` та `client-key-data` на:

```yaml
client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```

{{< /note >}}

## Автоматичне поновлення сертифікатів {#automatic-certificate-renewal}

kubeadm поновлює всі сертифікати під час [оновлення](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) панелі управління.

Ця функція призначена для найпростіших випадків використання; якщо у вас немає особливих вимог до поновлення сертифікатів і ви регулярно оновлюєте версію Kubernetes (з інтервалом менше 1 року між оновленнями), kubeadm подбає про те, щоб ваш кластер був актуальним і достатньо безпечним.

Якщо у вас є складніші вимоги до поновлення сертифікатів, ви можете відмовитися від стандартної поведінки, передавши `--certificate-renewal=false` до `kubeadm upgrade apply` або до `kubeadm upgrade node`.

## Ручне поновлення сертифікатів {#manual-certificate-renewal}

Ви можете в будь-який момент вручну поновити свої сертифікати за допомогою команди `kubeadm certs renew` з відповідними параметрами командного рядка. Якщо ви використовуєте кластер з реплікованою панеллю управління, цю команду потрібно виконати на всіх вузлах панелі управління.

Ця команда виконує поновлення за допомогою сертифіката та ключа CA (або front-proxy-CA), збережених у `/etc/kubernetes/pki`.

`kubeadm certs renew` використовує наявні сертифікати як авторитетне джерело атрибутів (Common Name, Organization, subject alternative name) і не покладається на ConfigMap `kubeadm-config`. Попри це, проєкт Kubernetes рекомендує тримати сертифікат, що обслуговується, і повʼязані з ним значення в цьому ConfigMap синхронізованими, щоб уникнути будь-якого ризику плутанини.

Після виконання команди вам слід перезапустити Podʼи панелі управління. Це необхідно, оскільки динамічне перезавантаження сертифікатів наразі підтримується не для всіх компонентів і сертифікатів. [Статичними Podʼами](/docs/tasks/configure-pod-container/static-pod/) керує локальний kubelet, а не API-сервер, тому kubectl не можна використати для їх видалення та перезапуску. Щоб перезапустити статичний Pod, ви можете тимчасово прибрати файл його маніфесту з `/etc/kubernetes/manifests/` і зачекати 20 секунд (див. значення `fileCheckFrequency` у [структурі KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/)). kubelet завершить роботу Podʼа, якщо його маніфесту більше немає в теці маніфестів. Потім ви можете повернути файл назад, і після ще одного періоду `fileCheckFrequency` kubelet знову створить Pod, і поновлення сертифікатів для компонента буде завершено.

`kubeadm certs renew` може поновити будь-який конкретний сертифікат або, за допомогою підкоманди `all`, поновити їх усі:

```shell
# Якщо ви використовуєте кластер з реплікованою панеллю управління, цю команду
# потрібно виконати на всіх вузлах панелі управління.
kubeadm certs renew all
```

### Копіювання сертифіката адміністратора (необовʼязково) {#admin-certificate-copy}

Кластери, побудовані за допомогою kubeadm, часто копіюють сертифікат `admin.conf` у `$HOME/.kube/config`, як описано в [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/). У такій системі, щоб оновити вміст `$HOME/.kube/config` після поновлення `admin.conf`, можна виконати такі команди:

```shell
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Поновлення сертифікатів за допомогою API сертифікатів Kubernetes {#renew-certificates-with-the-kubernetes-certificates-api}

У цьому розділі надаються додаткові відомості про те, як виконати ручне поновлення сертифікатів за допомогою API сертифікатів Kubernetes.

{{< caution >}}
Це розширені теми для користувачів, яким потрібно інтегрувати інфраструктуру сертифікатів своєї організації в кластер, побудований за допомогою kubeadm. Якщо стандартна конфігурація kubeadm відповідає вашим потребам, натомість дозвольте kubeadm керувати сертифікатами.
{{< /caution >}}

### Налаштування підписувача {#set-up-a-signer}

Центр сертифікації Kubernetes (Kubernetes Certificate Authority) не працює одразу після встановлення. Ви можете налаштувати зовнішнього підписувача, такого як [cert-manager](https://cert-manager.io/docs/configuration/ca/), або використовувати вбудованого підписувача.

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

Як створювати CSR за допомогою API Kubernetes, див. [Створення CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatessigningrequest).

## Поновлення сертифікатів зовнішнім CA {#renew-certificates-with-external-ca}

У цьому розділі надаються додаткові відомості про те, як виконати ручне поновлення сертифікатів за допомогою зовнішнього CA.

Для кращої інтеграції із зовнішніми CA kubeadm також може створювати запити на підпис сертифікатів (CSR). CSR — це запит до CA на підписаний сертифікат для клієнта. У термінах kubeadm будь-який сертифікат, який зазвичай підписується CA на диску, натомість можна створити як CSR. Однак сам CA не можна створити як CSR.

### Поновлення за допомогою запитів на підпис сертифікатів (CSR) {#renewal-by-using-certificate-signing-requests-csr}

Поновлення сертифікатів можливе шляхом генерації нових CSR і підписання їх зовнішнім CA. Докладніше про роботу з CSR, згенерованими kubeadm, див. розділ [Підписування запитів на підпис сертифікатів (CSR), згенерованих kubeadm](#signing-csr).

## Ротація центру сертифікації (CA) {#certificate-authority-rotation}

Kubeadm не підтримує ротацію або заміну сертифікатів CA одразу після встановлення.

Докладніше про ручну ротацію або заміну CA див. [ручна ротація сертифікатів CA](/docs/tasks/tls/manual-rotation-of-ca-certificates/).

## Ввімкнення підписаних службових сертифікатів kubelet {#kubelet-serving-certs}

Стандартно службовий сертифікат kubelet, який розгортає kubeadm, є самопідписним. Це означає, що зʼєднання зовнішніх служб, таких як [metrics-server](https://github.com/kubernetes-sigs/metrics-server), з kubelet не можна захистити за допомогою TLS.

Щоб налаштувати kubelet у новому кластері kubeadm на отримання належно підписаних службових сертифікатів, ви повинні передати `kubeadm init` таку мінімальну конфігурацію:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
serverTLSBootstrap: true
```

Якщо ви вже створили кластер, вам потрібно адаптувати його, виконавши такі дії:

- Знайдіть і відредагуйте ConfigMap `kubelet-config` в просторі імен `kube-system`. У ConfigMap ключ `kubelet` має документ [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/) як своє значення. Відредагуйте документ KubeletConfiguration, щоб встановити `serverTLSBootstrap: true`.
- На кожному вузлі додайте поле `serverTLSBootstrap: true` у `/var/lib/kubelet/config.yaml` і перезапустіть kubelet за допомогою `systemctl restart kubelet`.

Поле `serverTLSBootstrap: true` увімкне початкове отримання (bootstrap) службових сертифікатів kubelet через запит їх з API `certificates.k8s.io`. Одне з відомих обмежень полягає в тому, що CSR (запити на підпис сертифікатів) для цих сертифікатів не можуть бути автоматично затверджені стандартним підписувачем у kube-controller-manager — [`kubernetes.io/kubelet-serving`](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers). Для цього потрібні дії користувача або стороннього контролера.

Ці CSR можна переглянути за допомогою:

```shell
kubectl get csr
```

```console
NAME        AGE     SIGNERNAME                        REQUESTOR                      CONDITION
csr-9wvgt   112s    kubernetes.io/kubelet-serving     system:node:worker-1           Pending
csr-lz97v   1m58s   kubernetes.io/kubelet-serving     system:node:control-plane-1    Pending
```

Щоб затвердити їх, ви можете виконати таке:

```shell
kubectl certificate approve <CSR-name>
```

Стандартно термін дії цих службових сертифікатів спливає через рік. Kubeadm встановлює поле `rotateCertificates` у `KubeletConfiguration` в `true`, що означає, що близько до закінчення терміну дії буде створено новий набір CSR для службових сертифікатів, і їх потрібно затвердити, щоб завершити ротацію. Докладніше див. [Ротація сертифікатів](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#certificate-rotation).

Якщо ви шукаєте рішення для автоматичного затвердження цих CSR, рекомендується звернутися до свого хмарного провайдера й запитати, чи має він підписувача CSR, який перевіряє ідентичність вузла за допомогою позасмугового (out of band) механізму.

{{% thirdparty-content %}}

Можна використовувати сторонні власні контролери:

- [kubelet-csr-approver](https://github.com/postfinance/kubelet-csr-approver)

Такий контролер не є безпечним механізмом, якщо він не перевіряє, окрім CommonName у CSR, ще й запитані IP-адреси та доменні імена. Це завадить зловмиснику, який має доступ до клієнтського сертифіката kubelet, створювати CSR із запитом службових сертифікатів для будь-якої IP-адреси або доменного імені.

## Генерація файлів kubeconfig для додаткових користувачів {#kubeconfig-additional-users}

Під час створення кластера `kubeadm init` підписує сертифікат у `super-admin.conf` з `Subject: O = system:masters, CN = kubernetes-super-admin`. [`system:masters`](/docs/reference/access-authn-authz/rbac/#user-facing-roles) — це аварійна (break-glass) група суперкористувачів, яка обходить рівень авторизації (наприклад, [RBAC](/docs/reference/access-authn-authz/rbac/)). Файл `admin.conf` також створюється kubeadm на вузлах панелі управління і містить сертифікат з `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins` — це група, яка логічно належить до kubeadm. Якщо ваш кластер використовує RBAC (стандартно для kubeadm), групу `kubeadm:cluster-admins` привʼязано до ClusterRole [`cluster-admin`](/docs/reference/access-authn-authz/rbac/#user-facing-roles).

{{< warning >}}
Уникайте спільного доступу до файлів `super-admin.conf` або `admin.conf`. Замість цього створіть найменш привілейований доступ навіть для людей, які працюють адміністраторами, і використовуйте цю найменш привілейовану альтернативу для будь-чого, крім аварійного (екстреного) доступу.
{{< /warning >}}

Ви можете використовувати команду [`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) для генерації файлів kubeconfig для додаткових користувачів. Команда приймає поєднання прапорців командного рядка та параметрів [конфігурації kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/). Згенерований kubeconfig буде записано в stdout, і його можна перенаправити у файл за допомогою `kubeadm kubeconfig user ... > somefile.conf`.

Приклад файлу конфігурації, який можна використовувати з `--config`:

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

Наведений нижче приклад згенерує файл kubeconfig з обліковими даними, дійсними протягом 24 годин, для нового користувача `johndoe`, який належить до групи `appdevs`:

```shell
kubeadm kubeconfig user --config example.yaml --org appdevs --client-name johndoe --validity-period 24h
```

Наведений нижче приклад згенерує файл kubeconfig з обліковими даними адміністратора, дійсними протягом 1 тижня:

```shell
kubeadm kubeconfig user --config example.yaml --client-name admin --validity-period 168h
```

## Підписування запитів на підпис сертифікатів (CSR), згенерованих kubeadm {#signing-csr}

Ви можете створювати запити на підпис сертифікатів за допомогою `kubeadm certs generate-csr`. Виклик цієї команди згенерує пари файлів `.csr` / `.key` для звичайних сертифікатів. Для сертифікатів, вбудованих у файли kubeconfig, команда згенерує пару файлів `.csr` / `.conf`, де ключ вже вбудований у файл `.conf`.

Файл CSR містить всю необхідну інформацію для CA для підпису сертифіката. kubeadm використовує [чітко визначену специфікацію](/docs/setup/best-practices/certificates/#all-certificates) для всіх своїх сертифікатів і CSR.

Стандартна тека для сертифікатів — `/etc/kubernetes/pki`, а стандартна тека для файлів kubeconfig — `/etc/kubernetes`. Ці стандартні значення можна змінити за допомогою прапорців `--cert-dir` та `--kubeconfig-dir` відповідно.

Щоб передати власні параметри команді `kubeadm certs generate-csr`, використовуйте прапорець `--config`, який приймає файл [конфігурації kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/), так само як команди на кшталт `kubeadm init`. Будь-яку специфікацію, таку як додаткові SAN та власні IP-адреси, потрібно зберігати в тому самому файлі конфігурації та використовувати для всіх відповідних команд kubeadm, передаючи його як `--config`.

{{< note >}}
У цьому посібнику використовується стандартна тека Kubernetes `/etc/kubernetes`, що вимагає прав суперкористувача. Якщо ви дотримуєтесь цього посібника та використовуєте теки, у які можете записувати (зазвичай це означає запуск `kubeadm` з `--cert-dir` та `--kubeconfig-dir`), ви можете пропустити команду `sudo`.

Потім ви повинні скопіювати створені файли до теки `/etc/kubernetes`, щоб `kubeadm init` або `kubeadm join` могли їх знайти.
{{< /note >}}

### Підготовка файлів CA та службового облікового запису {#preparing-ca-and-service-account-files}

На головному вузлі панелі управління, де буде виконано `kubeadm init`, виконайте такі команди:

```shell
sudo kubeadm init phase certs ca
sudo kubeadm init phase certs etcd-ca
sudo kubeadm init phase certs front-proxy-ca
sudo kubeadm init phase certs sa
```

Це заповнить теки `/etc/kubernetes/pki` та `/etc/kubernetes/pki/etcd` усіма самопідписними файлами CA (сертифікатами та ключами) і файлами службового облікового запису (відкритими та закритими ключами), які потрібні kubeadm для вузла панелі управління.

{{< note >}}
Якщо ви використовуєте зовнішній CA, вам потрібно згенерувати ті самі файли окремо (out of band) та вручну скопіювати їх на головний вузол панелі управління в `/etc/kubernetes`.

Після підписання всіх CSR ви можете видалити ключ кореневого CA (`ca.key`), як зазначено у розділі [Режим зовнішнього CA](#external-ca-mode).
{{< /note >}}

Для другорядних вузлів панелі управління (`kubeadm join --control-plane`) немає потреби викликати наведені вище команди. Залежно від того, як ви налаштували [високодоступний](/docs/setup/production-environment/tools/kubeadm/high-availability) кластер, вам потрібно або вручну скопіювати ті самі файли з головного вузла панелі управління, або використати автоматизовану функціональність `--upload-certs` команди `kubeadm init`.

### Генерація CSR {#generate-csrs}

Команда `kubeadm certs generate-csr` генерує CSR для всіх відомих сертифікатів, якими керує kubeadm. Після завершення команди вам потрібно вручну видалити файли `.csr`, `.conf` або `.key`, які вам не потрібні.

#### Врахування kubelet.conf {#considerations-kubelet-conf}

Цей розділ стосується як вузлів панелі управління, так і робочих вузлів.

Якщо ви видалили файл `ca.key` з вузлів панелі управління ([Режим зовнішнього CA](#external-ca-mode)), активний kube-controller-manager у цьому кластері не зможе підписати клієнтські сертифікати kubelet. Якщо у вашій конфігурації не існує зовнішнього методу для підписання цих сертифікатів (наприклад, [зовнішній підписувач](#set-up-a-signer)), ви могли б вручну підписати `kubelet.conf.csr`, як пояснено в цьому посібнику.

Зверніть увагу, що це також означає, що автоматичну [ротацію клієнтського сертифіката kubelet](/docs/tasks/tls/certificate-rotation/#enabling-client-certificate-rotation) буде вимкнено. У такому разі близько до закінчення терміну дії сертифіката вам потрібно буде згенерувати новий `kubelet.conf.csr`, підписати сертифікат, вбудувати його в `kubelet.conf` і перезапустити kubelet.

Якщо це не стосується вашої конфігурації, ви можете пропустити обробку `kubelet.conf.csr` на другорядних вузлах панелі управління та на робочих вузлах (всі вузли, що викликають `kubeadm join ...`). Це тому, що активний kube-controller-manager буде відповідальний за підписання нових клієнтських сертифікатів kubelet.

{{< note >}}
Ви повинні обробити файл `kubelet.conf.csr` на первинному вузлі панелі управління (хості, де ви спочатку запустили `kubeadm init`). Це тому, що `kubeadm` вважає його вузлом, з якого починається розгортання кластера, і для нього потрібен попередньо заповнений `kubelet.conf`.
{{< /note >}}

#### Вузли панелі управління {#control-plane-nodes}

Виконайте таку команду на головному (`kubeadm init`) та другорядних (`kubeadm join --control-plane`) вузлах панелі управління, щоб згенерувати всі файли CSR:

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
Якщо ви використовуєте зовнішній CA та вже маєте файли серійних номерів CA (`.srl`) для `openssl`, ви можете скопіювати такі файли на вузол kubeadm, де будуть оброблятися CSR. Файли `.srl`, які потрібно скопіювати, це: `/etc/kubernetes/pki/ca.srl`, `/etc/kubernetes/pki/front-proxy-ca.srl` та `/etc/kubernetes/pki/etcd/ca.srl`. Потім файли можна перемістити на новий вузол, де будуть оброблятися файли CSR.

Якщо файл `.srl` для CA відсутній на вузлі, скрипт нижче згенерує новий файл SRL з випадковим початковим серійним номером.

Щоб дізнатися більше про файли `.srl`, дивіться документацію [`openssl`](https://www.openssl.org/docs/man3.0/man1/openssl-x509.html) для прапорця `--CAserial`.
{{< /note >}}

Повторіть цей крок для всіх вузлів, що мають файли CSR.

Запишіть такий скрипт у теку `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт. Скрипт згенерує сертифікати для всіх файлів CSR, які є в дереві `/etc/kubernetes`.

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

Запишіть такий скрипт у теку `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт. Скрипт візьме файли `.crt`, які були підписані для файлів kubeconfig з CSR на попередньому кроці, та вбудує їх у файли kubeconfig.

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

Запишіть такий скрипт у теку `/etc/kubernetes`, перейдіть до цієї теки та виконайте скрипт.

```bash
#!/bin/bash

# Очищення файлів CSR
rm -f ./*.csr ./pki/*.csr ./pki/etcd/*.csr # Очистка всіх файлів CSR

# Очищення файлів CRT, які вже були вбудовані у файли kubeconfig
rm -f ./*.crt
```

За бажанням, перемістіть файли `.srl` на наступний вузол, який буде оброблено.

За бажанням, якщо використовується зовнішній CA, видаліть файл `/etc/kubernetes/pki/ca.key`, як пояснено в розділі [Режим зовнішнього CA](#external-ca-mode).

### Ініціалізація вузла kubeadm {#kubeadm-node-initialization}

Щойно файли CSR підписано і потрібні сертифікати розміщено на хостах, які ви хочете використовувати як вузли, ви можете використати команди `kubeadm init` та `kubeadm join`, щоб створити з цих вузлів кластер Kubernetes. Під час `init` та `join` kubeadm використовує наявні сертифікати, ключі шифрування та файли kubeconfig, які виявляє в дереві `/etc/kubernetes` у локальній файловій системі хоста.
