---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

Ця команда ініціалізує вузол панелі управління Kubernetes.

<!-- body -->

{{< include "generated/kubeadm_init/_index.md" >}}

### Процес init {#init-workflow}

`kubeadm init` розгортає вузол панелі управління Kubernetes, виконуючи
наступні кроки:

1. Виконує серію попередніх перевірок, щоб перевірити стан системи
   перед внесенням змін. Деякі перевірки лише видають попередження, інші вважаються
   помилками, і kubeadm припиняє роботу, доки проблема не буде виправлена або
   користувач не вкаже `--ignore-preflight-errors=<list-of-errors>`.

1. Генерує самопідписний CA для налаштування ідентифікаційних даних для кожного компонента в кластері. Користувач може надати свої власні сертифікат та/або ключ CA, помістивши їх у теку сертифікатів, налаштовану через `--cert-dir`
   (типово `/etc/kubernetes/pki`).
   Сертифікати API-сервера матимуть додаткові записи SAN для будь-яких аргументів `--apiserver-cert-extra-sans`, з приведенням до нижнього регістру за потреби.

1. Записує файли kubeconfig у `/etc/kubernetes/` для kubelet, controller-manager та scheduler для підключення до API-сервера, кожен зі своїми ідентифікаційними даними. Також створюються додаткові файли kubeconfig: для kubeadm як адміністративної сутності (`admin.conf`) та для суперадміністратора, що може обходити RBAC (`super-admin.conf`).

1. Генерує маніфести статичних Podʼів для API-сервера, controller-manager та scheduler. Якщо зовнішній etcd не надано, створюється додатковий маніфест статичного Podʼа для etcd.

   Маніфести статичних Podʼів записуються у `/etc/kubernetes/manifests`; kubelet стежить за цією текою, щоб створити Podʼи під час запуску.

   Щойно Podʼи панелі управління будуть запущені та працюватимуть, процес `kubeadm init` може продовжитися.

1. Додає мітки та taint на вузол панелі управління, щоб жодні додаткові робочі навантаження не запускалися там.

1. Генерує токен, який додаткові вузли зможуть використовувати в майбутньому для реєстрації в панелі управління. За бажанням користувач може надати токен через `--token`, як описано в документації [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

1. Виконує всі необхідні налаштування, щоб дозволити приєднання вузлів за допомогою механізму [токенів bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/) та [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/):

   - Записує ConfigMap, що надає всю необхідну для приєднання інформацію, та налаштовує відповідні правила доступу RBAC.

   - Надає токенам bootstrap доступ до API підписання CSR.

   - Налаштовує автоматичне схвалення нових запитів CSR.

   Див. [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для додаткової інформації.

1. Встановлює DNS-сервер (CoreDNS) та компоненти надбудови kube-proxy через API-сервер. Зверніть увагу, що хоча DNS-сервер розгорнуто, він не буде запланований до встановлення CNI.

### Використання фаз init з kubeadm {#init-phases}

kubeadm дозволяє створювати вузол панелі управління поетапно, використовуючи команду `kubeadm init phase`.

Щоб переглянути впорядкований список фаз та підфаз, можна викликати `kubeadm init --help`. Список буде розташований на початку екрана довідки, і кожна фаза матиме опис поруч із нею. Зверніть увагу, що під час виклику `kubeadm init` всі фази та підфази будуть виконані саме в такому порядку.

Деякі фази мають унікальні прапорці, тому, якщо ви хочете переглянути список доступних опцій, додайте `--help`, наприклад:

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

Ви також можете використовувати `--help`, щоб побачити список підфаз для певної батьківської фази:

```shell
sudo kubeadm init phase control-plane --help
```

`kubeadm init` також має прапорець `--skip-phases`, який можна використовувати для пропуску певних фаз. Прапорець приймає список назв фаз, які можна взяти з вищезгаданого впорядкованого списку.

Приклад:

```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# тепер ви можете змінити файли маніфестів панелі управління та etcd
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

Цей приклад записує файли маніфестів для панелі управління та etcd у `/etc/kubernetes/manifests` на основі конфігурації в `configfile.yaml`. Це дозволяє вам змінити файли, а потім пропустити ці фази, використовуючи `--skip-phases`. Викликом останньої команди ви створите вузол панелі управління з власними файлами маніфестів.

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Як альтернативу, ви можете використовувати поле `skipPhases` у `InitConfiguration`.

### Використання kubeadm init з конфігураційним файлом {#config-file}

{{< caution >}}
Конфігураційний файл все ще вважається бета-версією і може змінитися в майбутніх версіях.
{{< /caution >}}

Можна налаштувати `kubeadm init` за допомогою конфігураційного файлу замість прапорців командного рядка, а деякі розширені функції можуть бути доступні лише як опції конфігураційного файлу. Цей файл передається за допомогою прапорця `--config`, і він повинен містити структуру `ClusterConfiguration` і, за бажанням, інші структури, розділені `---\n`. Поєднання `--config` з іншими прапорцями в деяких випадках може бути недозволеним.

Типову конфігурацію можна вивести за допомогою команди [kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Якщо ваша конфігурація не використовує останню версію, **рекомендується** мігрувати її за допомогою команди [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Для отримання додаткової інформації про поля та використання конфігурації ви можете перейти на нашу [сторінку довідки API](/docs/reference/config-api/kubeadm-config.v1beta4/).

### Використання kubeadm init з функціональними можливостями {#feature-gates}

kubeadm підтримує набір функціональних можливостей (feature gates), які унікальні для kubeadm і можуть бути застосовані лише під час створення кластера за допомогою `kubeadm init`. Ці функції можуть керувати поведінкою кластера. Функціональні можливості видаляються після того, як функція переходить до стадії GA.

Щоб передати функціональну можливість, можна використати прапорець `--feature-gates` для `kubeadm init` або додати елементи до поля `featureGates`, коли ви передаєте [конфігураційний файл](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration) за допомогою `--config`.

Передача [функціональних можливостей для основних компонентів Kubernetes](/docs/reference/command-line-tools-reference/feature-gates) безпосередньо в kubeadm не підтримується. Натомість їх можна передати за допомогою [налаштування компонентів за допомогою API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Список функціональних можливостей:

{{< table caption="Функціональні можливості kubeadm" >}}
Функція | Типово | Alpha | Beta | GA | Застаріла
:-------|:--------|:------|:-----|:---|:----------
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}

Опис функціональних можливостей:

`RootlessControlPlane`
: Встановлення цього прапорця налаштовує контейнери статичних Podʼів компонентів панелі управління, розгорнутих kubeadm, для `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `etcd` так, щоб вони запускалися від імені користувачів без прав root. Якщо прапорець не встановлено, ці компоненти запускаються з правами root. Ви можете змінити значення цієї функціональної можливості перед оновленням до новішої версії Kubernetes.

Список видалених функціональних можливостей:

{{< table caption="Видалені функціональні можливості kubeadm" >}}
Функція | Alpha | Beta | GA | Видалена
:-------|:------|:-----|:---|:-------
`ControlPlaneKubeletLocalMode` | 1.31 | 1.33 | 1.35 | 1.36
`EtcdLearnerMode` | 1.27 | 1.29 | 1.32 | 1.33
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`NodeLocalCRISocket` | 1.32 | 1.34 | 1.36 | 1.37
`PublicKeysECDSA` | 1.19 | - | - | 1.37
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
`WaitForAllControlPlaneComponents` | 1.30 | 1.33 | 1.34 | 1.35
{{< /table >}}

Опис функціональних можливостей:

`ControlPlaneKubeletLocalMode`
: З увімкненою функціональною можливістю під час приєднання нового вузла панелі управління kubeadm налаштовуватиме kubelet для підключення до локального kube-apiserver. Це гарантує, що під час поступових оновлень (rolling upgrades) не буде порушено політику розбіжності версій.

`EtcdLearnerMode`
: Під час приєднання нового вузла панелі управління новий член etcd буде створений як учень (learner) і підвищений до члена з правом голосу лише після того, як дані etcd будуть повністю узгоджені.

`IPv6DualStack`
: Цей прапорець допомагає налаштувати компоненти для подвійного стека, поки функція перебуває в розробці. Для отримання докладнішої інформації про підтримку подвійного стека в Kubernetes дивіться [Підтримка подвійного стека за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).

`NodeLocalCRISocket`
: З увімкненою функціональною можливістю kubeadm читатиме/записуватиме CRI-сокет для кожного вузла з/до файлу `/var/lib/kubelet/instance-config.yaml` замість того, щоб читати/записувати його з/до анотації `kubeadm.alpha.kubernetes.io/cri-socket` в обʼєкті Node. Новий файл застосовується як патч конфігурації екземпляра перед застосуванням будь-яких інших патчів, керованих користувачем, коли використовується прапорець `--patches`. Він містить єдине поле `containerRuntimeEndpoint` з [формату файлу KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/). Якщо функціональну можливість увімкнено під час оновлення, але файл `/var/lib/kubelet/instance-config.yaml` ще не існує, kubeadm спробує прочитати значення CRI-сокета з файлу `/var/lib/kubelet/kubeadm-flags.env`.

`PublicKeysECDSA`
: Можна використовувати для створення кластера, який використовує сертифікати ECDSA замість типового алгоритму RSA. Поновлення наявних сертифікатів ECDSA також підтримується за допомогою `kubeadm certs renew`, але ви не можете перемикатися між алгоритмами RSA і ECDSA на льоту або під час оновлень. У версіях Kubernetes до v1.31 була помилка, через яку ключі у згенерованих файлах kubeconfig використовували RSA, навіть якщо ви увімкнули функціональну можливість `PublicKeysECDSA`. Ця функціональна можливість застаріла на користь функціональності `encryptionAlgorithm`, доступної у kubeadm v1beta4.

`UnversionedKubeletConfigMap`
: Цей прапорець керує назвою {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, в якому kubeadm зберігає дані конфігурації kubelet. Якщо цей прапорець не вказано або встановлено в `true`, ConfigMap називається `kubelet-config`. Якщо ви встановите цей прапорець у `false`, назва ConfigMap міститиме мажорну та мінорну версію Kubernetes (наприклад: `kubelet-config-{{< skew currentVersion >}}`). kubeadm забезпечує, що правила RBAC для читання та запису цього ConfigMap відповідають значенню, яке ви встановили. Коли kubeadm записує цей ConfigMap (під час `kubeadm init` або `kubeadm upgrade apply`), kubeadm враховує значення `UnversionedKubeletConfigMap`. Під час читання цього ConfigMap (під час `kubeadm join`, `kubeadm reset`, `kubeadm upgrade`...) kubeadm спочатку намагається використати назву ConfigMap без версії. Якщо це не вдається, kubeadm повертається до використання застарілої (версійної) назви для цього ConfigMap.

`UpgradeAddonsBeforeControlPlane`
: Цю функціональну можливість було видалено. Її було представлено у v1.28 як застарілу функцію, а потім видалено у v1.31. Для документації щодо старіших версій, будь ласка, перейдіть на відповідну версію вебсайту.

`WaitForAllControlPlaneComponents`
: З увімкненою функціональною можливістю kubeadm чекатиме, доки всі компоненти панелі управління (kube-apiserver, kube-controller-manager, kube-scheduler) на вузлі панелі управління не повідомлять про стан 200 на своїх точках доступу `/livez` або `/healthz`. Ці перевірки виконуються на `https://ADDRESS:PORT/ENDPOINT`.

  - `PORT` береться з `--secure-port` компонента.
  - `ADDRESS` — це `--advertise-address` для kube-apiserver та `--bind-address` для
     kube-controller-manager та kube-scheduler.
  - `ENDPOINT` — це лише `/healthz` для kube-controller-manager, доки він також не підтримуватиме `/livez`.

  Якщо ви вкажете власні `ADDRESS` або `PORT` у конфігурації kubeadm, їх буде враховано. Без увімкненої функціональної можливості kubeadm чекатиме лише на готовність kube-apiserver на вузлі панелі управління. Процес очікування починається одразу після того, як kubeadm запустить kubelet на хості. Рекомендується увімкнути цю функціональну можливість, якщо ви бажаєте спостерігати стан готовності всіх компонентів панелі управління під час виконання команд `kubeadm init` або `kubeadm join`.

### Додавання параметрів kube-proxy {#kube-proxy}

Для отримання інформації про параметри kube-proxy у конфігурації kubeadm дивіться:

- [Довідка kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

Для отримання інформації про увімкнення режиму IPVS за допомогою kubeadm дивіться:

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Передача власних прапорців компонентам панелі управління {#control-plane-flags}

Для отримання інформації про передачу прапорців компонентам панелі управління дивіться:

- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Використання kubeadm без підключення до Інтернету {#without-internet-connection}

Для запуску kubeadm без підключення до Інтернету необхідно попередньо завантажити потрібні образи панелі управління.

Ви можете отримати перелік та завантажити образи за допомогою підкоманди `kubeadm config images`:

```shell
kubeadm config images list
kubeadm config images pull
```

Ви можете передати `--config` вищенаведеним командам з [файлом конфігурації kubeadm](#config-file), щоб керувати полями `kubernetesVersion` та `imageRepository`.

Усі типові образи `registry.k8s.io`, необхідні kubeadm, підтримують кілька архітектур.

### Використання власних образів {#custom-images}

Типово kubeadm завантажує образи з `registry.k8s.io`. Якщо запитана версія Kubernetes є міткою CI (наприклад, `ci/latest`), використовується `gcr.io/k8s-staging-ci-images`.

Ви можете змінити цю поведінку, використовуючи [kubeadm з файлом конфігурації](#config-file). Дозволені налаштування:

* Вказати `kubernetesVersion`, що впливає на версію образів.
* Вказати альтернативний `imageRepository`, який буде використовуватися замість
  `registry.k8s.io`.
* Вказати конкретні `imageRepository` та `imageTag` для etcd або CoreDNS.

Шляхи образів у типовому `registry.k8s.io` та у власному репозиторії, вказаному за допомогою `imageRepository`, можуть відрізнятися з міркувань зворотної сумісності. Наприклад, образ може мати підшлях `registry.k8s.io/subpath/image`, але типово мати шлях `my.customrepository.io/image` під час використання власного репозиторію.

Щоб надіслати образи до вашого власного репозиторію за шляхами, які може використовувати kubeadm, вам потрібно:

* Завантажити образи з типових шляхів у `registry.k8s.io` за допомогою `kubeadm config images {list|pull}`.
* Надіслати образи за шляхами з `kubeadm config images list --config=config.yaml`,
  де `config.yaml` містить власне значення `imageRepository` та/або `imageTag` для etcd та CoreDNS.
* Передати той самий `config.yaml` до `kubeadm init`.

#### Власні образи sandbox (pause) {#custom-pause-image}

Щоб встановити для них власний образ, потрібно налаштувати ваше {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} на використання цього образу. Зверніться до документації вашого середовища виконання контейнерів, щоб дізнатися, як змінити це налаштування; для деяких середовищ виконання контейнерів ви також можете знайти поради у розділі [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/).

### Завантаження сертифікатів панелі управління до кластера {#uploading-control-plane-certificates-to-the-cluster}

Додавши прапорець `--upload-certs` до `kubeadm init`, ви можете тимчасово завантажити сертифікати панелі управління до Secret у кластері. Зверніть увагу, що термін дії цього Secret автоматично спливе через 2 години. Сертифікати шифруються за допомогою 32-байтного ключа, який можна задати за допомогою `--certificate-key`. Той самий ключ можна використовувати для завантаження сертифікатів під час приєднання додаткових вузлів панелі управління, передавши `--control-plane` та `--certificate-key` до `kubeadm join`.

Для повторного завантаження сертифікатів після закінчення їхнього терміну дії можна використовувати таку команду фази:

```shell
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```

{{< note >}}
Попередньо визначений `certificateKey` можна вказати в `InitConfiguration` під час передачі [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) за допомогою `--config`.
{{< /note >}}

Якщо попередньо визначений ключ сертифіката не передано до `kubeadm init` і
`kubeadm init phase upload-certs`, новий ключ буде згенеровано автоматично.

Для генерації нового ключа на вимогу можна використовувати таку команду:

```shell
kubeadm certs certificate-key
```

### Управління сертифікатами за допомогою kubeadm {#certificate-management-with-kubeadm}

Докладну інформацію про управління сертифікатами за допомогою kubeadm дивіться в розділі [Управління сертифікатами за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/). Документ містить інформацію про використання зовнішнього центру сертифікації (CA), власних сертифікатів
та поновлення сертифікатів.

### Керування drop-in файлом kubeadm для kubelet {#kubelet-drop-in}

Пакет `kubeadm` постачається з файлом конфігурації для запуску `kubelet` через `systemd`. Зауважте, що CLI kubeadm ніколи не торкається цього drop-in файлу. Цей drop-in файл є частиною DEB/RPM-пакунка kubeadm.

Для отримання додаткової інформації дивіться [Керування drop-in файлом kubeadm для systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).

### Використання kubeadm із середовищами виконання CRI {#use-kubeadm-with-cri-runtimes}

Типово kubeadm намагається виявити ваше середовище виконання контейнерів. Докладніше про це виявлення дивіться в [посібнику зі встановлення CRI для kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

### Встановлення імені вузла {#setting-the-node-name}

Типово kubeadm призначає імʼя вузла на основі адреси хоста машини. Ви можете змінити це налаштування за допомогою прапорця `--node-name`. Цей прапорець передає відповідне значення [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options) до kubelet.

Майте на увазі, що перевизначення імені хоста може
[заважати роботі хмарних провайдерів](https://github.com/kubernetes/website/pull/8873).

### Автоматизація kubeadm {#automating-kubeadm}

Замість копіювання токена, який ви отримали з `kubeadm init`, на кожний вузол, як у [базовому посібнику з kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), ви можете розподіляти токен паралельно для полегшення автоматизації. Щоб реалізувати цю автоматизацію, вам потрібно знати IP-адресу, яку матиме вузол панелі управління після запуску, або використовувати DNS-імʼя чи адресу балансувальника навантаження.

1. Згенеруйте токен. Цей токен повинен мати форму `<6 character string>.<16 character string>`.
   Формально він повинен відповідати регулярному виразу: `[a-z0-9]{6}\.[a-z0-9]{16}`.

   kubeadm може згенерувати токен для вас:

   ```shell
   kubeadm token generate
   ```

1. Запустіть одночасно вузол панелі управління та робочі вузли з цим токеном. Під час запуску вони мають знайти один одного та сформувати кластер. Той самий аргумент `--token` можна використовувати як у `kubeadm init`, так і у `kubeadm join`.

1. Аналогічно можна вчинити з `--certificate-key` під час приєднання додаткових вузлів панелі управління. Ключ можна згенерувати за допомогою:

   ```shell
   kubeadm certs certificate-key
   ```

Щойно кластер запуститься, ви зможете використовувати файл `/etc/kubernetes/admin.conf` з вузла панелі управління для взаємодії з кластером з обліковими даними адміністратора або скористатися розділом [Генерування файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).

Зауважте, що такий спосіб початкового розгортання має дещо послаблені гарантії безпеки, оскільки не дозволяє перевірити хеш кореневого CA за допомогою `--discovery-token-ca-cert-hash` (оскільки він не генерується під час підготовки вузлів). Докладніше дивіться в [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

## {{% heading "whatsnext" %}} {#what-s-next}

* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) — щоб дізнатися більше про
  фази `kubeadm init`
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) — щоб розгорнути робочий вузол
  Kubernetes і приєднати його до кластера
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) — щоб оновити кластер
  Kubernetes до новішої версії
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) — щоб скасувати будь-які зміни, внесені
  на цьому хості командами `kubeadm init` або `kubeadm join`
