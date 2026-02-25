---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

Ця команда ініціалізує вузол панелі управління Kubernetes.

<!-- body -->

{{< include "generated/kubeadm_init/_index.md" >}}

### Процес Init {#init-workflow}

`kubeadm init` розгортає вузол панелі управління Kubernetes, виконуючи
наступні кроки:

1. Виконує серію перевірок перед запуском, щоб перевірити стан системи
   перед внесенням змін. Деякі перевірки лише видають попередження, інші вважаються
   помилками, і kubeadm припиняє роботу, доки проблема не буде виправлена або
   користувач не вкаже `--ignore-preflight-errors=<list-of-errors>`.

2. Генерує самопідписний CA для налаштування ідентифікаторів для кожного компонента в кластері. Користувач може надати свої власні сертифікат та/або ключ CA, помістивши їх у теку сертифікатів, налаштовану через `--cert-dir` (типово `/etc/kubernetes/pki`). Сертифікати API Server матимуть додаткові записи SAN для будь-яких аргументів `--apiserver-cert-extra-sans`, з приведенням до нижнього регістру за потреби.

3. Записує файли kubeconfig у `/etc/kubernetes/` для kubelet, controller-manager та scheduler для підключення до API server, кожен зі своїм ідентифікатором. Також створюються додаткові файли kubeconfig, для kubeadm як адміністративної сутності (`admin.conf`) та для супер адміністратора, що може обходити RBAC (`super-admin.conf`).

4. Генерує манифести статичних Pod для API server, controller-manager та scheduler. Якщо зовнішній etcd не надано, створюється додатковий маніфест статичного Pod для etcd.

   Статичні манифести Pod записуються у `/etc/kubernetes/manifests`; kubelet спостерігає за цією текою для створення Podʼів при запуску.

   Як тільки Podʼи панелі управління будуть запущені та працюватимуть, процес `kubeadm init` може продовжитися.

5. Додає мітки та taint на вузол панелі управління, щоб жодні додаткові робочі навантаження не запускалися там.

6. Генерує токен, який додаткові вузли можуть використовувати для реєстрації у майбутньому на вузлі панелі управління. За бажанням, користувач може надати токен через `--token`, як описано в документації [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

7. Виконує всі необхідні налаштування для дозволу приєднання вузлів за допомогою механізмів [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) та [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/):

   - Записує ConfigMap для надання всієї необхідної інформації для приєднання, та налаштовує відповідні правила доступу RBAC.

   - Дозволяє Bootstrap Tokens доступ до API підписання CSR.

   - Налаштовує автоматичне схвалення нових запитів CSR.

   Див. [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для додаткової інформації.

8. Встановлює DNS сервер (CoreDNS) та компоненти надбудови kube-proxy через API server. У версії Kubernetes 1.11 і пізніших CoreDNS є типовим сервером DNS. Зверніть увагу, що хоча DNS сервер розгорнутий, він не буде запланований до встановлення CNI.

   {{< warning >}}
   Використання kube-dns у kubeadm визнано застарілим з v1.18 і видалене у v1.21.
   {{< /warning >}}

### Використання фаз ініціалізації з kubeadm {#init-phases}

Kubeadm дозволяє створювати вузол панелі управління поетапно, використовуючи команду `kubeadm init phase`.

Щоб переглянути впорядкований список фаз та підфаз, можна викликати `kubeadm init --help`. Список буде розташований на початку екрана довідки, і кожна фаза матиме опис поруч із нею. Зверніть увагу, що при виклику `kubeadm init` всі фази та підфази будуть виконані в точно такому порядку.

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

Цей приклад записує файли маніфесту для панелі управління та etcd у `/etc/kubernetes/manifests` на основі конфігурації в `configfile.yaml`. Це дозволяє вам змінювати файли, а потім пропускати ці фази, використовуючи `--skip-phases`. Викликом останньої команди ви створите вузол панелі управління з власними файлами маніфестів.

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Альтернативно, ви можете використовувати поле `skipPhases` у `InitConfiguration`.

### Використання kubeadm init з конфігураційним файлом {#config-file}

{{< caution >}}
Конфігураційний файл все ще вважається бета-версією і може змінюватися в майбутніх версіях.
{{< /caution >}}

Можна налаштувати `kubeadm init` за допомогою конфігураційного файлу замість прапорців командного рядка, а деякі більш розширені функції можуть бути доступні лише як опції конфігураційного файлу. Цей файл передається за допомогою прапорця `--config`, і він повинен містити структуру `ClusterConfiguration` і, за бажанням, інші структури, розділені `---\n`. Змішування `--config` з іншими прапорцями може не бути дозволеним у деяких випадках.

Ви можете вивести стандартну конфігурацію за допомогою команди [kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Якщо ваша конфігурація не використовує останню версію, **рекомендується** перейти на нову версію за допомогою команди [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Для отримання додаткової інформації про поля та використання конфігурації ви можете перейти на нашу [сторінку API-довідки](/docs/reference/config-api/kubeadm-config.v1beta4/).

### Використання kubeadm init з функціональними можливостями {#feature-gates}

Kubeadm підтримує набір функціональних можливостей (feature gate), які унікальні для kubeadm і можуть бути застосовані лише під час створення кластера за допомогою `kubeadm init`. Ці функціональні можливості можуть контролювати поведінку кластера. Функціональні можливості видаляються після того, як функція переходить до стадії GA (General Availability).

Щоб передати функціональні можливості, можна використовувати прапорець `--feature-gates` для `kubeadm init`, або можна додати елементи до поля `featureGates`, коли передаєте [конфігураційний файл](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration) за допомогою `--config`.

Передача [функціональних можливостей для основних компонентів Kubernetes](/docs/reference/command-line-tools-reference/feature-gates) безпосередньо в kubeadm не підтримується. Натомість це можливо зробити за допомогою [налаштування компонентів за допомогою API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Список функціональних можливостей:

{{< table caption="Прапорці функцій kubeadm" >}}
Функція | Стандартно | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `true` | 1.31 | 1.33 | -
`NodeLocalCRISocket` | `true` | 1.32 | 1.34 | -
{{< /table >}}

{{< note >}}
Після того, як функціональна можливість переходить до стадії GA, її стандартне значення стає `true`.
{{< /note >}}

Опис функціональних можливостей:

`ControlPlaneKubeletLocalMode`
: З цією функціональною можливістю, при приєднанні нового вузла панелі управління kubeadm налаштовуватиме kubelet для підключення до локального kube-apiserver. Це забезпечує дотримання політики щодо версійних розбіжностей під час постійних оновлень (rolling upgrades).

`NodeLocalCRISocket`
: З увімкненим функціоналом, kubeadm читатиме/записуватиме CRI-сокет для кожного вузла з/до файлу `/var/lib/kubelet/instance-config.yaml` замість того, щоб читати/записувати його з/до анотації `kubeadm.alpha.kubernetes.io/cri-socket` в обʼєкті Node. Новий файл застосовується як патч конфігурації екземпляра перед застосуванням будь-яких інших патчів, керованих користувачем, коли використовується прапорець `--patches`. Він містить єдине поле `containerRuntimeEndpoint` з [формат файлу KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/). Якщо під час оновлення функцію увімкнено, але файл `/var/lib/kubelet/instance-config.yaml` ще не існує, kubeadm спробує прочитати значення сокета CRI з файлу `/var/lib/kubelet/kubeadm-flags.env`.

Список застарілих функціональних можливостей:

{{< table caption="Застарілі функціональні можливості kubeadm" >}}
Функція | Стандартно | Alpha | Beta | GA | Deprecated
:-------|:-----------|:------|:-----|:---|:----------
`PublicKeysECDSA` | `false` | 1.19 | - | - | 1.31
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}

Опис застарілих функціональних можливостей:

`PublicKeysECDSA`
: Можна використовувати для створення кластера, який використовує сертифікати ECDSA замість стандартного алгоритму RSA. Поновлення існуючих сертифікатів ECDSA також підтримується за допомогою `kubeadm certs renew`, але ви не можете перемикатися між алгоритмами RSA і ECDSA на льоту або під час оновлень. У версіях Kubernetes до v1.31 була помилка, коли ключі у згенерованих файлах kubeconfig встановлювалися з використанням RSA, навіть якщо ви увімкнули `PublicKeysECDSA`. Ця функціональна можливість застаріла на користь функціональності `encryptionAlgorithm`, доступної у kubeadm v1beta4.

`RootlessControlPlane`
: Встановлення цього прапорця налаштовує розгорнуті компоненти панелі управління kubeadm у статичних Podʼах для `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `etcd` для запуску від імені користувачів без прав суперкористувача. Якщо прапорець не встановлений, ці компоненти запускаються з правами root. Ви можете змінити значення цього прапорця функції перед оновленням до нової версії Kubernetes.

Список видалених функціональних можливостей:

{{< table caption="Видалені функціональні можливості kubeadm" >}}
Елемент | Alpha | Beta | GA | Видалено
:-------|:------|:-----|:---|:-------
`EtcdLearnerMode` | 1.27 | 1.29 | 1.32 | 1.33
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
`WaitForAllControlPlaneComponents` | 1.30 | 1.33 | 1.34 | 1.35
{{< /table >}}

Опис видалених функціональних можливостей:

`EtcdLearnerMode`
: При приєднанні до нового вузла панелі управління, новий член etcd буде створений як учень і підвищений до члена з правом голосу тільки після того, як дані etcd будуть повністю вирівняні.

`IPv6DualStack`
: Цей прапорець допомагає налаштувати компоненти подвійного стека, коли функція знаходиться в процесі розробки. Для отримання більш детальної інформації про підтримку подвійного стека в Kubernetes дивіться [Підтримка подвійного стека за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).

`UnversionedKubeletConfigMap`
: Цей прапорець контролює назву {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, в якому kubeadm зберігає дані конфігурації kubelet. Якщо цей прапорець не вказаний або встановлений у `true`, ConfigMap називається `kubelet-config`. Якщо ви встановите цей прапорець у `false`, назва ConfigMap включатиме основну та додаткову версію для Kubernetes (наприклад: `kubelet-config-{{< skew currentVersion >}}`). Kubeadm забезпечує, що правила RBAC для читання та запису цього ConfigMap є відповідними до значення, яке ви встановили. Коли kubeadm записує цей ConfigMap (під час `kubeadm init` або `kubeadm upgrade apply`), kubeadm дотримується значення `UnversionedKubeletConfigMap`. При читанні цього ConfigMap (під час `kubeadm join`, `kubeadm reset`, `kubeadm upgrade ...`), kubeadm спочатку намагається використовувати назву ConfigMap без версії; якщо це не вдається, kubeadm переходить до використання застарілої (версійної) назви для цього ConfigMap.

`UpgradeAddonsBeforeControlPlane`
: Цю функціональну можливість було видалено. Вона була визнана у версії v1.28 як застаріла функція і потім видалена у версії v1.31. Для документації щодо старіших версій, будь ласка, перейдіть на відповідну версію вебсайту.

`WaitForAllControlPlaneComponents`
: З увімкненою функціональною можливістю, kubeadm чекатиме, доки всі компоненти панелі управління (kube-apiserver, kube-controller-manager, kube-scheduler) на вузлі панелі управління не повідомлять про стан 200 на своїх точках доступу `/livez` або `/healthz`. Ці перевірки виконуються на `https://ADDRESS:PORT/ENDPOINT`.

  - `PORT` береться з `--secure-port` компонента.
  - `ADDRESS` — це `--advertise-address` для kube-apiserver та `--bind-address` для kube-controller-manager та kube-scheduler.
  - `ENDPOINT` — це лише `/healthz` для kube-controller-manager, доки не буде підтримано `/livez`.

  Якщо ви вкажете власні `ADDRESS` або `PORT` у конфігурації kubeadm, вони будуть враховані. Без увімкненої функціональної можливості, kubeadm лише чекатиме на готовність kube-apiserver на вузлі панелі управління. Процес очікування починається одразу після запуску kubelet на хості за допомогою kubeadm. Рекомендується увімкнути цю функцію, якщо ви бажаєте спостерігати стан готовності всіх компонентів панелі управління під час виконання команд `kubeadm init` або `kubeadm join`.

### Додавання параметрів kube-proxy {#kube-proxy}

Для отримання інформації про параметри kube-proxy у конфігурації kubeadm дивіться:

- [Довідка з налаштування kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

Для отримання інформації про увімкнення режиму IPVS за допомогою kubeadm дивіться:

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Передача власних прапорців користувача до компонентів панелі управління {#control-plane-flags}

Для отримання інформації про передачу прапорців до компонентів панелі управління дивіться:

- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Використання kubeadm без підключення до Інтернету {#without-internet-connection}

Для запуску kubeadm без підключення до Інтернету необхідно попередньо завантажити необхідні образи панелі управління.

Ви можете отримати перелік та завантажити образи за допомогою команди `kubeadm config images`:

```shell
kubeadm config images list
kubeadm config images pull
```

Ви можете використати `--config` з вищенаведеними командами з [файлом конфігурації kubeadm](#config-file) для контролю полів `kubernetesVersion` та `imageRepository`.

Усі стандартні образи `registry.k8s.io`, необхідні kubeadm, підтримують кілька архітектур.

### Використання власних образів {#custom-images}

Стандартно, kubeadm завантажує образи з `registry.k8s.io`. Якщо запитана версія Kubernetes є CI міткою (наприклад, `ci/latest`), використовується `gcr.io/k8s-staging-ci-images`.

Ви можете змінити цю поведінку, використовуючи [kubeadm з файлом конфігурації](#config-file). Дозволені налаштування:

- Вказати `kubernetesVersion`, що впливає на версію образів.
- Вказати альтернативний `imageRepository`, який буде використовуватися замість `registry.k8s.io`.
- Вказати конкретний `imageRepository` та `imageTag` для etcd або CoreDNS.

Шляхи образів між стандартним `registry.k8s.io` та власним репозиторієм, зазначеним за допомогою `imageRepository`, можуть відрізнятися з причин зворотної сумісності. Наприклад, один образ може мати підшлях у `registry.k8s.io/subpath/image`, але стандартно бути `my.customrepository.io/image` при використанні власного репозиторію користувача.

Щоб переконатися, що ви завантажуєте образи до вашого власного репозиторію у шляхи, які може використовувати kubeadm, вам потрібно:

- Завантажити образи зі стандартних шляхів з `registry.k8s.io` за допомогою `kubeadm config images {list|pull}`.
- Завантажити образи до шляхів з `kubeadm config images list --config=config.yaml`, де `config.yaml` містить власне значення `imageRepository` та/або `imageTag` для etcd та CoreDNS.
- Передати той самий `config.yaml` до `kubeadm init`.

#### Власні образи sandbox (pause) {#custom-pause-image}

Щоб встановити власний образ для цих контейнерів, потрібно налаштувати ваше {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} для використання цього образу. Зверніться до документації вашого середовища виконання контейнерів, щоб дізнатися, як змінити це налаштування; для певних середовищ виконання контейнерів ви також можете знайти поради у розділі [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/).

### Завантаження сертифікатів панелі управління до кластера {#uploading-control-plane-certificates-to-cluster}

Додавши прапорець `--upload-certs` до `kubeadm init`, ви можете тимчасово завантажити сертифікати панелі управління до Secret у кластері. Зверніть увагу, що дія цього Secret автоматично спливає через 2 години. Сертифікати шифруються за допомогою 32-байтного ключа, який можна задати за допомогою `--certificate-key`. Той самий ключ можна використовувати для завантаження сертифікатів при приєднанні додаткових вузлів панелі управління, передавши `--control-plane` та `--certificate-key` до `kubeadm join`.

Для повторного завантаження сертифікатів після закінчення їхнього терміну дії можна використовувати таку команду фази:

```shell
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```

{{< note >}}
Попередньо визначений `certificateKey` можна вказати в `InitConfiguration` при передачі [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) за допомогою `--config`.
{{< /note >}}

Якщо попередньо визначений ключ сертифіката не передано до `kubeadm init` і
`kubeadm init phase upload-certs`, новий ключ буде згенеровано автоматично.

Для генерації нового ключа за запитом можна використовувати наступну команду:

```shell
kubeadm certs certificate-key
```

### Управління сертифікатами за допомогою kubeadm {#certificate-management-with-kubeadm}

Для отримання докладної інформації про управління сертифікатами за допомогою kubeadm перегляньте [Управління сертифікатами за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/). Документ містить інформацію про використання зовнішнього центру сертификації (CA), власні сертифікати
та оновлення сертифікатів.

### Керування drop-in файлом для kubelet у kubeadm {#kubelet-drop-in}

Пакет `kubeadm` постачається з файлом конфігурації для запуску `kubelet` через `systemd`. Зауважте, що CLI kubeadm ніколи не торкається цього drop-in файлу. Цей drop-in файл є частиною пакунка kubeadm DEB/RPM.

Для отримання додаткової інформації дивіться [Керування drop-in файлом для systemd в kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).

### Використання kubeadm з CRI runtimes {#use-kubeadm-with-cri-runtimes}

Стандартно kubeadm намагається зʼясувати яке у вас середовище виконання контейнерів. Для детальнішої інформації щодо цього, дивіться [посібник з установки CRI для kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

### Налаштування імені вузла {#setting-the-node-name}

Типово `kubeadm` присвоює імʼя вузла на основі мережевої адреси машини. Ви можете змінити це налаштування за допомогою прапорця `--node-name`. Цей прапорець передає відповідне значення [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options) до kubelet.

Зверніть увагу, що заміна імені хосту може вплинути на роботу хмарних провайдерів,
[деталі за посиланням](https://github.com/kubernetes/website/pull/8873).

### Автоматизація kubeadm {#automating-kubeadm}

Замість копіювання токену, який ви отримали з `kubeadm init` на кожний вузол, як у [базовому посібнику з kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), ви можете паралельно розподіляти токен для полегшення автоматизації. Щоб реалізувати цю автоматизацію, вам потрібно знати IP-адресу, яку матиме вузол панелі управління після запуску, або використовувати DNS-імʼя чи адресу балансувальника навантаження.

1. Згенеруйте токен. Цей токен повинен мати форму `<6 символьний рядок>.<16 символьний рядок>`. Формально він повинен відповідати регулярному виразу: `[a-z0-9]{6}\.[a-z0-9]{16}`.

   kubeadm може згенерувати токен для вас:

   ```shell
   kubeadm token generate
   ```

1. Запустіть одночасно вузол панелі управління та робочі вузли з цим токеном. Під час їх запуску вони мають знайти один одного та сформувати кластер. Той самий аргумент `--token` можна використовувати як у `kubeadm init`, так і у `kubeadm join`.

1. Аналогічно можна поступити з `--certificate-key` при приєднанні додаткових вузлів панелі управління. Ключ можна згенерувати за допомогою:

   ```shell
   kubeadm certs certificate-key
   ```

Як тільки кластер буде запущений, ви зможете використовувати файл `/etc/kubernetes/admin.conf` з вузла панелі управління для спілкування з кластером з адміністративними правами чи [Генерація файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).

Зауважте, що цей спосіб ініціалізації має деякі спрощені гарантії безпеки, оскільки не дозволяє перевіряти кореневий хеш сертифіката з `--discovery-token-ca-cert-hash` (оскільки він не генерується при проведенні вузлів). Докладні відомості дивіться в [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

## {{% heading "whatsnext" %}}

- [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) для отримання більш детальної інформації про фази `kubeadm init`.
- [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для налаштування робочого вузла Kubernetes та його приєднання до кластера.
- [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) для оновлення кластера Kubernetes до новішої версії.
- [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скидання будь-яких змін, внесених до цього хосту за допомогою `kubeadm init` або `kubeadm join`.
