---
title: Деталі реалізації
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

`kubeadm init` та `kubeadm join` разом забезпечують гарну послідовність дій користувача для створення базового кластера Kubernetes з нуля, відповідно до найкращих практик. Однак може бути не очевидно, _як_ kubeadm це робить.

Цей документ надає додаткову інформацію про те, що відбувається за лаштунками, з метою поширення знань про найкращі практики для кластера Kubernetes.

<!-- body -->

## Основні принципи дизайну {#core-design-principles}

Кластер, який налаштовується за допомогою `kubeadm init` та `kubeadm join`, має бути:

- **Захищеним**: Він повинен дотримуватися останніх найкращих практик, таких як:
  - забезпечення RBAC
  - використання Node Authorizer
  - використання захищеного зв’язку між компонентами панелі управління
  - використання захищеного зв’язку між API-сервером і kubelet-ами
  - обмеження доступу до API kubelet-а
  - обмеження доступу до API для системних компонентів, таких як kube-proxy та CoreDNS
  - обмеження доступу до того, що може отримати Bootstrap Token
- **Зручним для користувачів**: Користувачеві не повинно знадобитися виконувати більше, ніж кілька команд:
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <network-plugin-of-choice.yaml>`
  - `kubeadm join --token <token> <endpoint>:<port>`
- **Розширюваним**:
  - Він не повинен віддавати перевагу жодному конкретному мережевому провайдеру. Налаштування мережі кластерів не входить до сфери компетенції
  - Він повинен надавати можливість використовувати конфігураційний файл для налаштування різних параметрів

## Константи та добре відомі значення та шляхи {#constants-and-well-known-values-and-paths}

Щоб зменшити складність і спростити розробку вищого рівня інструментів, що будуються на основі kubeadm, він використовує обмежений набір констант для добре відомих шляхів та імен файлів.

Тека Kubernetes `/etc/kubernetes` є константою в застосунку, оскільки вона є очевидним шляхом у більшості випадків і найінтуїтивнішим розташуванням; інші константні шляхи та імена файлів є такими:

- `/etc/kubernetes/manifests` як шлях, де kubelet повинен шукати маніфести статичних Podʼів.
  Імена маніфестів статичних Podʼів:

  - `etcd.yaml`
  - `kube-apiserver.yaml`
  - `kube-controller-manager.yaml`
  - `kube-scheduler.yaml`

- `/etc/kubernetes/` як шлях, де зберігаються файли kubeconfig з ідентифікаторами для компонентів панелі управління. Імена файлів kubeconfig:

  - `kubelet.conf` (`bootstrap-kubelet.conf` під час TLS bootstrap)
  - `controller-manager.conf`
  - `scheduler.conf`
  - `admin.conf` для адміністратора кластера і kubeadm
  - `super-admin.conf` для супер-адміністратора кластера, який може обходити RBAC

- Імена сертифікатів і ключових файлів:

  - `ca.crt`, `ca.key` для центру авторизації Kubernetes
  - `apiserver.crt`, `apiserver.key` для сертифіката API-сервера
  - `apiserver-kubelet-client.crt`, `apiserver-kubelet-client.key` для клієнтського сертифіката, що використовується API-сервером для безпечного підключення до kubelet-ів
  - `sa.pub`, `sa.key` для ключа, який використовується менеджером контролерів при підписанні ServiceAccount
  - `front-proxy-ca.crt`, `front-proxy-ca.key` для центру авторизації front-проксі
  - `front-proxy-client.crt`, `front-proxy-client.key` для клієнта front-проксі

## Формат конфігураційного файлу kubeadm {#the-kubeadm-configuration-file-format}

Більшість команд kubeadm підтримують прапорець `--config`, який дозволяє передавати конфігураційний файл з диска. Формат конфігураційного файлу відповідає загальній схемі API Kubernetes `apiVersion` / `kind`, але вважається форматом конфігурації компонентів. Деякі компоненти Kubernetes, такі як kubelet, також підтримують конфігурацію на основі файлів.

Різні підкоманди kubeadm вимагають різних `kind` файлів конфігурації. Наприклад, `InitConfiguration` для `kubeadm init`, `JoinConfiguration` для `kubeadm join`, `UpgradeConfiguration` для `kubeadm upgrade` і `ResetConfiguration` для `kubeadm reset`.

Командою `kubeadm config migrate` можна перенести файл конфігурації старого формату до нового (поточного) формату конфігурації. Інструмент kubeadm підтримує міграцію лише із застарілих форматів конфігурацій до поточного формату.

Докладні відомості наведено на сторінці [kubeadm configuration reference](/docs/reference/config-api/kubeadm-config.v1beta4/).

## Внутрішній дизайн робочого процесу `kubeadm init` {#kubeadm-init-workflow-internal-design}

Команда `kubeadm init` складається з послідовності атомарних завдань для виконання, як описано в [внутрішньому робочому процесі `kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow).

Команда [`kubeadm init phase`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) дозволяє користувачам викликати кожне завдання окремо, і в кінцевому підсумку пропонує багаторазовий і компонований API/інструментарій, який може бути використаний іншими інструментами початкового завантаження Kubernetes, будь-яким інструментом автоматизації ІТ або досвідченим користувачем для створення власних кластерів.

### Перевірка перед установкою (Preflight checks) {#preflight-checks}

Kubeadm виконує набір перевірок перед початком ініціалізації з метою перевірки передумов і уникнення типових проблем під час запуску кластера.

Користувач може пропустити певні перевірки перед установкою або всі за допомогою опції `--ignore-preflight-errors`.

- [Попередження], якщо версія Kubernetes, яку слід використовувати (вказана за допомогою прапорця `--kubernetes-version`), є хоча б на одну мінорну версію вищою за версію kubeadm CLI.
- Вимоги до системи Kubernetes:
  - якщо використовується Linux:
    - [Помилка], якщо версія ядра старіша за мінімально необхідну версію
    - [Помилка], якщо не налаштовані необхідні підсистеми cgroups
- [Помилка], якщо точка доступу CRI не відповідає
- [Помилка], якщо користувач не є root
- [Помилка], якщо імʼя машини не є дійсним DNS-піддоменом
- [Попередження], якщо імʼя хосту неможливо знайти через мережевий пошук
- [Помилка], якщо версія kubelet нижча за мінімальну підтримувану версію kubelet, підтримувану kubeadm (поточна мінорна версія -1)
- [Помилка], якщо версія kubelet хоча б на одну мінорну версію вища за необхідну версію панелі управління (непідтримуване відхилення версій)
- [Попередження], якщо служба kubelet не існує або вона вимкнена
- [Попередження], якщо активний firewalld
- [Помилка], якщо використовується порт привʼязки API-сервера або порти 10250/10251/10252
- [Помилка], якщо тека `/etc/kubernetes/manifests` вже існує і не є порожньою
- [Помилка], якщо включений swap
- [Помилка], якщо команди `ip`, `iptables`, `mount`, `nsenter` відсутні в шляху до команд
- [Попередження], якщо команди `ethtool`, `tc`, `touch` відсутні в шляху до команд
- [Попередження], якщо додаткові аргументи для API-сервера, менеджера контролерів, планувальника містять недійсні параметри
- [Попередження], якщо зʼєднання з https://API.AdvertiseAddress:API.BindPort пройде через проксі
- [Попередження], якщо зʼєднання з підмережею сервісів пройде через проксі (перевіряється лише перша адреса)
- [Попередження], якщо зʼєднання з підмережею Podʼів пройде через проксі (перевіряється лише перша адреса)
- Якщо використовується зовнішній etcd:
  - [Помилка], якщо версія etcd старіша за мінімально необхідну версію
  - [Помилка], якщо сертифікати або ключі etcd вказані, але не надані
- Якщо використовується внутрішній etcd (і, таким чином, буде встановлений локальний etcd):
  - [Помилка], якщо використовується порт 2379
  - [Помилка], якщо тека Etcd.DataDir вже існує і не є порожньою
- Якщо режим авторизації — ABAC:
  - [Помилка], якщо abac_policy.json не існує
- Якщо режим авторизації — WebHook:
  - [Помилка], якщо webhook_authz.conf не існує

{{< note >}}
Перевірки перед установкою можна викликати індивідуально за допомогою команди [`kubeadm init phase preflight`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight).
{{< /note >}}

### Генерація необхідних сертифікатів {#generate-the-necessary-certificates}

Kubeadm генерує пари сертифікатів і приватних ключів для різних цілей:

- Самопідписаний центр сертифікації для кластера Kubernetes, збережений у файлі `ca.crt` і приватний ключ у файлі `ca.key`

- Сертифікат обслуговування для API-сервера, згенерований за допомогою `ca.crt` як CA, збережений у файлі `apiserver.crt` разом із приватним ключем `apiserver.key`. Цей сертифікат повинен містити наступні альтернативні імена:

  - Внутрішній clusterIP сервісу Kubernetes (перша адреса в CIDR служб, наприклад, `10.96.0.1`, якщо підмережа сервісів — `10.96.0.0/12`)
  - DNS-імена Kubernetes, наприклад `kubernetes.default.svc.cluster.local`, якщо значення прапорця `--service-dns-domain` є `cluster.local`, а також типові DNS-імена `kubernetes.default.svc`, `kubernetes.default`, `kubernetes`
  - Імʼя вузла (node-name)
  - `--apiserver-advertise-address`
  - Додаткові альтернативні імена, вказані користувачем

- Клієнтський сертифікат для API-сервера для безпечного підключення до kubelet-ів, згенерований за допомогою `ca.crt` як CA і збережений у файлі `apiserver-kubelet-client.crt` разом із його приватним ключем `apiserver-kubelet-client.key`. Цей сертифікат повинен бути в організації `system:masters`

- Приватний ключ для підпису токенів ServiceAccount, збережений у файлі `sa.key` разом із його публічним ключем `sa.pub`

- Центр сертифікації для front proxy, збережений у файлі `front-proxy-ca.crt` разом із його ключем `front-proxy-ca.key`

- Клієнтський сертифікат для клієнта front proxy, згенерований за допомогою `front-proxy-ca.crt` як CA і збережений у файлі `front-proxy-client.crt` разом із його приватним ключем `front-proxy-client.key`

Сертифікати зберігаються типово у `/etc/kubernetes/pki`, але цю теку можна налаштувати за допомогою прапорця `--cert-dir`.

Зверніть увагу на наступне:

1. Якщо дані пари сертифікат-приватний ключ вже існують і їх зміст відповідає вищезазначеним вимогам, вони будуть використані, і фаза генерації для даного сертифіката буде пропущена. Це означає, що користувач може, наприклад, скопіювати поточний CA в `/etc/kubernetes/pki/ca.{crt,key}`, і після цього kubeadm використовуватиме ці файли для підпису інших сертифікатів. Див. також [використання власних сертифікатів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)
1. Для CA можливо надати файл `ca.crt`, але не надавати файл `ca.key`. Якщо всі інші сертифікати і файли kubeconfig вже на місці, kubeadm визнає цю умову і активує ExternalCA, що також означає, що контролер `csrsigner` в контролері-менеджері не буде запущений
1. Якщо kubeadm працює в режимі [зовнішньої CA](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode); всі сертифікати повинні бути надані користувачем, оскільки kubeadm не може їх генерувати самостійно
1. У випадку запуску kubeadm у режимі `--dry-run`, файли сертифікатів записуються в тимчасову теку
1. Генерацію сертифікатів можна викликати окремо за допомогою команди [`kubeadm init phase certs all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs)

It seems like you're referring to documentation or a detailed guide on how `kubeadm` handles various aspects of Kubernetes initialization and configuration. If you need a translation of this content into Ukrainian, I can provide that. Here's the translation:

### Генерація kubeconfig файлів для компонентів панелі управління {#generate-kubeconfig-files-for-control-plane-components}

Kubeadm генерує kubeconfig файли з ідентичностями для компонентів панелі управління:

- Файл kubeconfig для kubelet, який використовується під час ініціалізації TLS — `/etc/kubernetes/bootstrap-kubelet.conf`. У цьому файлі є bootstrap-token або вбудовані клієнтські сертифікати для автентифікації цього вузла у кластері.

  Цей клієнтський сертифікат повинен:

  - Бути в організації `system:nodes`, як вимагається модулем [Node Authorization](/docs/reference/access-authn-authz/node/)
  - Мати Загальне Імʼя (CN) `system:node:<hostname-lowercased>`

- Файл kubeconfig для контролера-менеджера, `/etc/kubernetes/controller-manager.conf`; у цьому файлі вбудований клієнтський сертифікат з ідентичністю контролера-менеджера. Цей клієнтський сертифікат повинен мати CN `system:kube-controller-manager`, як визначено стандартними [RBAC ролями ядра компонентів](/docs/reference/access-authn-authz/rbac/#core-component-roles)

- Файл kubeconfig для планувальника, `/etc/kubernetes/scheduler.conf`; у цьому файлі вбудований клієнтський сертифікат з ідентичністю планувальника. Цей клієнтський сертифікат повинен мати CN `system:kube-scheduler`, як визначено стандартними [RBAC ролями ядра компонентів](/docs/reference/access-authn-authz/rbac/#core-component-roles)

Додатково, kubeconfig файл для kubeadm як адміністративної сутності генерується і зберігається у `/etc/kubernetes/admin.conf`. Цей файл включає сертифікат з `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins` — це група, керована kubeadm. Вона повʼязана з `cluster-admin` ClusterRole під час `kubeadm init`, за допомогою `super-admin.conf` файлу, який не потребує RBAC. Файл `admin.conf` повинен залишатися на вузлах панелі управління і не повинен бути переданий іншим користувачам.

Під час `kubeadm init` генерується інший kubeconfig файл і зберігається у `/etc/kubernetes/super-admin.conf`. Цей файл включає сертифікат з `Subject: O = system:masters, CN = kubernetes-super-admin`. `system:masters` — це суперкористувачі, які обходять RBAC і роблять `super-admin.conf` корисним у випадку надзвичайної ситуації, коли кластер заблокований через неправильну конфігурацію RBAC. Файл `super-admin.conf` повинен зберігатися в безпечному місці і не повинен передаватися іншим користувачам.

Дивіться [RBAC user facing role bindings](/docs/reference/access-authn-authz/rbac/#user-facing-roles) для додаткової інформації про RBAC і вбудовані ClusterRoles та групи.

Ви можете запустити [`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig/#cmd-kubeconfig-user) для створення файлів kubeconfig для додаткових користувачів.

{{< caution >}}
Згенеровані конфігураційні файли містять вбудований ключ автентифікації, і ви повинні ставитися до них як до конфіденційних.
{{< /caution >}}

Також, зверніть увагу на наступне:

1. Всі kubeconfig файли включають в себе сертифікат `ca.crt`.
1. Якщо вказаний kubeconfig файл вже існує і його зміст відповідає вищезазначеним вимогам, то буде використано існуючий файл, і фаза генерації для даного kubeconfig буде пропущена.
1. Якщо kubeadm працює в режимі [ExternalCA mode](/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode), всі необхідні kubeconfig файли також повинні бути надані користувачем, оскільки kubeadm не може згенерувати їх самостійно.
1. У випадку виконання kubeadm в режимі `--dry-run`, файли kubeconfig записуються в тимчасову теку.
1. Генерацію kubeconfig файлів можна викликати окремо за допомогою команди [`kubeadm init phase kubeconfig all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig)

### Генерація маніфестів статичних Pod для компонентів панелі управління {#generate-static-pod-manifests-for-control-plane-components}

Kubeadm записує файли маніфестів статичних Pod для компонентів панелі управління до `/etc/kubernetes/manifests`. kubelet спостерігає за цією текою для створення Podʼів при запуску.

Маніфести статичних Podʼів мають спільний набір властивостей:

- Всі статичні Podʼи розгорнуті в просторі імен `kube-system`
- Всі статичні Podʼи мають мітки `tier:control-plane` та `component:{імʼя-компоненти}`
- Всі статичні Podʼи використовують клас пріоритету `system-node-critical`
- На всіх статичних Podʼах встановлено `hostNetwork: true`, щоб дозволити запуск панелі управління до налаштування мережі; в результаті:

  - Адреса, яку використовує контролер-менеджер та планувальник для посилання на API-сервер, є `127.0.0.1`
  - Якщо сервер etcd налаштовано локально, адреса `etcd-server` буде встановлена як `127.0.0.1:2379`

- Включено обрання лідера як для контролер-менеджера, так і для планувальника
- Контролер-менеджер та планувальник будуть посилатися на файли kubeconfig з їхніми відповідними, унікальними ідентифікаторами
- Всі статичні Podʼи отримують будь-які додаткові прапорці або патчі, вказані користувачем, як описано в [передача користувацьких аргументів компонентам панелі управління](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
- Всі статичні Podʼи отримують будь-які додаткові томи, вказані користувачем (Шлях хоста)

Зверніть увагу, що:

1. Усі образи типово будуть витягуватися з registry.k8s.io. Для налаштування репозиторію образів див. [використання власних образів](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)
1. У разі виконання kubeadm у режимі `--dry-run` файли статичних Podʼів записуються у тимчасову теку
1. Генерацію маніфестів статичних Podʼів для компонентів панелі управління можна запустити окремо за допомогою команди [`kubeadm init phase control-plane all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane)

#### Сервер API {#api-server}

Маніфест статичних Podʼів для сервера API обробляється наступними параметрами, наданими користувачами:

- `apiserver-advertise-address` та `apiserver-bind-port` для звʼязку; якщо вони не вказані, стандартне значення буде IP-адреса основного мережевого інтерфейсу на машині та порт 6443
- `service-cluster-ip-range` для використання сервісів
- Якщо вказаний зовнішній сервер etcd, то `etcd-servers` та повʼязані налаштування TLS (`etcd-cafile`, `etcd-certfile`, `etcd-keyfile`); якщо зовнішній сервер etcd не вказано, буде використовуватися локальний etcd (через мережу хосту)
- Якщо вказаний провайдер хмарних послуг, то налаштовується відповідний параметр `--cloud-provider` разом зі шляхом `--cloud-config`, якщо такий файл існує (експериментально, альфа версія, буде вилучено в майбутній версії)

Інші прапорці сервера API, що встановлені безумовно, включають:

- `--insecure-port=0` для уникнення небезпечних зʼєднань з сервером API
- `--enable-bootstrap-token-auth=true` для активації модуля автентифікації `BootstrapTokenAuthenticator`. Див. [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) для деталей
- `--allow-privileged` до `true` (необхідно, наприклад, для kube-proxy)
- `--requestheader-client-ca-file` до `front-proxy-ca.crt`
- `--enable-admission-plugins` до:

  - [`NamespaceLifecycle`](/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle) наприклад, для уникнення видалення системних зарезервованих просторів імен
  - [`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger) та [`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota) для встановлення обмежень на простори імен
  - [`ServiceAccount`](/docs/reference/access-authn-authz/admission-controllers/#serviceaccount) для автоматизації службових облікових записів
  - [`PersistentVolumeLabel`](/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel) приєднує мітки регіону або зони до PersistentVolumes, як визначено провайдером хмарних послуг (Цей контролер допуску є застарілим і буде вилучений у майбутній версії. Він типово не розгорнутий kubeadm починаючи з v1.9, якщо явно не вибрано використання `gce` або `aws` як провайдерів хмарних послуг)
  - [`DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) для встановлення типового класу зберігання на обʼєктах `PersistentVolumeClaim`
  - [`DefaultTolerationSeconds`](/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) для обмеження того, що kubelet може змінювати (наприклад, тільки Podʼи на цьому вузлі)

- `--kubelet-preferred-address-types` до `InternalIP,ExternalIP,Hostname;` це робить `kubectl logs` та іншу комунікацію API server-kubelet працюючою в середовищах, де імена хостів вузлів не розвʼязуються

- Прапорці для використання сертифікатів, згенерованих на попередніх етапах:

  - `--client-ca-file` до `ca.crt`
  - `--tls-cert-file` до `apiserver.crt`
  - `--tls-private-key-file` до `apiserver.key`
  - `--kubelet-client-certificate` до `apiserver-kubelet-client.crt`
  - `--kubelet-client-key` до `apiserver-kubelet-client.key`
  - `--service-account-key-file` до `sa.pub`
  - `--requestheader-client-ca-file` до `front-proxy-ca.crt`
  - `--proxy-client-cert-file` до `front-proxy-client.crt`
  - `--proxy-client-key-file` до `front-proxy-client.key`

- Інші прапорці для забезпечення безпеки front proxy
  ([Агрегація API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/))
  комунікацій:

  - `--requestheader-username-headers=X-Remote-User`
  - `--requestheader-group-headers=X-Remote-Group`
  - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
  - `--requestheader-allowed-names=front-proxy-client`

#### Менеджер контролерів {#controller-manager}

Маніфест статичного Podʼа для менеджера контролерів обробляється наступними параметрами, наданими користувачами:

- Якщо kubeadm запускається з вказанням `--pod-network-cidr`, активується функція менеджера підмережі, необхідна для деяких мережевих втулків CNI, встановлюючи:

  - `--allocate-node-cidrs=true`
  - Прапорці `--cluster-cidr` та `--node-cidr-mask-size` відповідно до заданого CIDR

Інші прапорці, які встановлюються безумовно, включають:

- `--controllers`, що активує всі стандартні контролери плюс контролери `BootstrapSigner` та `TokenCleaner` для TLS-запуску. Див. [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) для деталей.

- `--use-service-account-credentials` до `true`

- Прапорці для використання сертифікатів, згенерованих на попередніх етапах:

  - `--root-ca-file` до `ca.crt`
  - `--cluster-signing-cert-file` до `ca.crt`, якщо відключений зовнішній режим CA, в іншому випадку до `""`
  - `--cluster-signing-key-file` до `ca.key`, якщо відключений зовнішній режим CA, в іншому випадку до `""`
  - `--service-account-private-key-file` до `sa.key`.

#### Планувальник {#scheduler}

Маніфест статичного Podʼа для планувальника обробляється наступними параметрами, наданими користувачами.

### Генерація маніфесту статичного Pod для локального etcd {#generate-static-pod-manifest-for-local-etcd}

Якщо ви вказали зовнішній etcd, цей крок буде пропущено. В іншому випадку kubeadm генерує маніфест статичного Pod для створення локального екземпляра etcd, що працює в Pod з наступними характеристиками:

- слухати на `localhost:2379` і використовувати `HostNetwork=true`
- зробити монтування `hostPath` з `dataDir` до файлової системи хосту
- Будь-які додаткові прапорці, вказані користувачем

Зверніть увагу, що:

1. Образ контейнера etcd буде типово витягнутий з `registry.gcr.io`. Для налаштування власного репозиторію образів див. [використання власних образів](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images).
1. Якщо ви запускаєте kubeadm у режимі `--dry-run`, маніфест статичного Pod для etcd записується у тимчасову теку.
1. Ви можете безпосередньо викликати генерацію маніфесту статичного Pod для локального etcd за допомогою команди [`kubeadm init phase etcd local`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd).

### Очікування запуску панелі управління {#wait-for-the-control-plane-to-come-up}

На вузлах панелі управління kubeadm чекає до 4 хвилин, поки компоненти панелі управління та kubelet стануть доступними. Для цього виконується перевірка стану відповідних точок доступу компонентів `/healthz` або `/livez`.

Після того як панель управління буде запущена, kubeadm завершує виконання завдань, описаних у наступних розділах.

### Збереження конфігурації кластера kubeadm у ConfigMap для подальшого посилання {#save-the-kubeadm-clusterconfiguration-in-a-configmap-for-later-reference}

kubeadm зберігає конфігурацію, передану в `kubeadm init`, у ConfigMap з назвою `kubeadm-config` в просторі імен `kube-system`.

Це забезпечить можливість kubeadm у майбутньому (наприклад, під час оновлення `kubeadm upgrade`) визначати фактичний поточний стан кластера і приймати нові рішення на основі цих даних.

Зверніть увагу, що:

1. Перед збереженням конфігурації кластера чутлива інформація, така як токен, видаляється з конфігурації.
1. Завантаження конфігурації вузла панелі управління може бути викликане окремо за допомогою команди [`kubeadm init phase upload-config`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config).

### Позначення вузла як вузла панелі управління {#mark-the-node-as-a-control-plane}

Як тільки панель управління буде доступна, kubeadm виконує наступні дії:

- Позначає вузол як вузол панелі управління з міткою `node-role.kubernetes.io/control-plane=""`
- Додає на вузол taint `node-role.kubernetes.io/control-plane:NoSchedule`

Зверніть увагу, що фазу позначення вузла як вузла панелі управління можна викликати окремо за допомогою команди [`kubeadm init phase mark-control-plane`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane).

### Налаштування TLS-Bootstrapping для приєднання вузлів {#configure-tls-bootstrapping-for-node-join}

Kubeadm використовує [Автентифікацію за допомогою Запускових Токенів](/docs/reference/access-authn-authz/bootstrap-tokens/) для приєднання нових вузлів до існуючого кластера; для отримання більш детальної інформації дивіться також [пропозицію дизайну](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).

`kubeadm init` забезпечує належну конфігурацію всього процесу, включаючи наступні кроки, а також налаштування прапорців API-сервера та контролера, як вже було описано у попередніх розділах.

{{< note >}}
TLS-запуск для вузлів можна налаштувати за допомогою команди
[`kubeadm init phase bootstrap-token`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token), виконуючи всі кроки налаштування, описані в наступних розділаї; альтернативно, кожен крок може бути викликаний окремо.
{{< /note >}}

#### Створення bootstrap токена {#create-a-bootstrap-token}

`kubeadm init` створює перший bootstrap токен, що генерується автоматично або надається користувачем за допомогою прапорця `--token`. Згідно з документацією щодо специфікації bootstrap токена, токен слід зберегти як секрет з іменем `bootstrap-token-<token-id>` у просторі імен `kube-system`.

Зверніть увагу, що:

1. bootstrap токен, типово створений `kubeadm init`, використовуватиметься для перевірки тимчасових користувачів під час процесу TLS-запуску; ці користувачі будуть членами групи `system:bootstrappers:kubeadm:default-node-token`.
1. Токен має обмежену чинність, стандартно 24 години (цей інтервал можна змінити за допомогою прапорця `--token-ttl`).
1. Додаткові токени можна створити за допомогою команди [`kubeadm token`](/docs/reference/setup-tools/kubeadm/kubeadm-token/), яка також надає інші корисні функції для управління токенами.

#### Дозвіл на виклик API CSR вузлами, які приєднуються {#allow-joining-nodes-to-call-the-api-csr}

Kubeadm забезпечує можливість користувачам у групі `system:bootstrappers:kubeadm:default-node-token` доступ до API підпису сертифікатів.

Це реалізується створенням ClusterRoleBinding з назвою `kubeadm:kubelet-bootstrap` між вищезазначеною групою та рольовим доступом RBAC стандартно `system:node-bootstrapper`.

#### Налаштування автоматичного схвалення нових bootstrap токенів {#set-up-automatic-approval-for-new-bootstrap-tokens}

Kubeadm забезпечує автоматичне схвалення запитів на підпис сертифікату Bootstrap Token за допомогою контролера csrapprover.

Це реалізується створенням ClusterRoleBinding з назвою `kubeadm:node-autoapprove-bootstrap` між групою `system:bootstrappers:kubeadm:default-node-token` та стандартним рольовим доступом `system:certificates.k8s.io:certificatesigningrequests:nodeclient`.

Роль `system:certificates.k8s.io:certificatesigningrequests:nodeclient` також має бути створена, надаючи дозвіл POST на шлях `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`.

#### Налаштування ротації сертифікатів вузлів з автоматичним схваленням {#set-up-node-certificate-rotation-with-auto-approval}

Kubeadm забезпечує активацію ротації сертифікатів для вузлів і автоматичне схвалення запитів на підпис сертифікатів для вузлів за допомогою контролера csrapprover.

Це реалізується створенням ClusterRoleBinding з назвою `kubeadm:node-autoapprove-certificate-rotation` між групою `system:nodes` та стандартним  рольовим доступом `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`.

#### Створення публічного ConfigMap cluster-info {#create-the-public-cluster-info-configmap}

У цій фазі створюється ConfigMap `cluster-info` у просторі імен `kube-public`.

Додатково створюється Role та RoleBinding, які надають доступ до ConfigMap неавтентифікованим користувачам (тобто користувачам у RBAC групі `system:unauthenticated`).

{{< note >}}
Доступ до ConfigMap `cluster-info` _не обмежується за швидкістю_. Це може бути проблемою, якщо ваш API-сервер кластера відкритий для інтернету; у найгіршому випадку може виникнути атака типу DoS, коли атакуючий використовує всі вхідні запити, які може обробити kube-apiserver, щоб обслуговувати ConfigMap `cluster-info`.
{{< /note >}}

### Встановлення надбудов {#installing-addons}

Kubeadm встановлює внутрішній DNS-сервер і компоненти надбудов  kube-proxy через API-сервер.

{{< note >}}
Цю фазу можна викликати окремо за допомогою команди
[`kubeadm init phase addon all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon).
{{< /note >}}

#### proxy

Для `kube-proxy` створюється обліковий запис ServiceAccount у просторі імен `kube-system`, після чого `kube-proxy` розгортається як DaemonSet:

- Облікові дані (`ca.crt` та `token`) до панелі управління отримуються з облікового запису ServiceAccount.
- Місцезнаходження (URL) API-сервера отримується з ConfigMap.
- Обліковий запис ServiceAccount `kube-proxy` повʼязується з правами у рольовому доступі ClusterRole `system:node-proxier`.

#### DNS

- Сервіс CoreDNS називається `kube-dns` для сумісності з застарілою надбудовою `kube-dns`.

- У просторі імен `kube-system` створюється обліковий запис ServiceAccount для CoreDNS.

- Обліковий запис `coredns` привʼязаний до привілеїв у ClusterRole `system:coredns`.

У версії Kubernetes 1.21 була видалена підтримка використання `kube-dns` з kubeadm. Ви можете використовувати CoreDNS з kubeadm, навіть якщо повʼязаний сервіс називається `kube-dns`.

## Внутрішній дизайн фаз `kubeadm join` {#kubeadm-join-phases-internal-design}

Подібно до `kubeadm init`, внутрішній робочий процес `kubeadm join` також складається з послідовності атомарних завдань, що виконуються.

Вони поділені на дві частини: виявлення (щоб вузол довіряв Kubernetes API Server) та початкове завантаження TLS (щоб Kubernetes API Server довіряв вузлу).

Дивіться [Автентифікація за допомогою Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) або відповідну [пропозицію дизайну](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).

### Попередні перевірки {#preflight-checks}

`kubeadm` виконує набір попередніх перевірок перед початком приєднання, з метою перевірити попередні умови та уникнути поширених проблем запуску кластера.

Зверніть увагу на наступне:

1. Попередні перевірки `kubeadm join` є, по суті, підмножиною попередніх перевірок `kubeadm init`.
2. Якщо ви приєднуєтеся до вузла Windows, специфічні для Linux елементи керування пропускаються.
3. У будь-якому випадку користувач може пропустити певні попередні перевірки (або, врешті-решт, усі попередні перевірки) за допомогою опції `--ignore-preflight-errors`.

### Виявлення інформації про кластер {#discovery-cluster-info}

Є дві основні схеми для виявлення. Перша полягає у використанні спільного токена разом з IP-адресою сервера API. Друга — наданні файлу (який є підмножиною стандартного файлу kubeconfig).

#### Виявлення спільного токена {#shared-token-discovery}

Якщо `kubeadm join` викликається з параметром `--discovery-token`, використовується виявлення за допомогою токена; у цьому випадку вузол основному отримує сертифікати CA кластера з ConfigMap `cluster-info` у просторі імен `kube-public`.

Щоб запобігти атакам типу "особа посередині", вживаються кілька заходів:

- Спочатку сертифікат CA отримується через небезпечне зʼєднання (це можливо, тому що `kubeadm init` надає доступ користувачам `cluster-info` для `system:unauthenticated`)

- Потім сертифікат CA проходить наступні кроки перевірки:

  - Базова перевірка: використовуючи ID токена через підпис JWT
  - Перевірка публічного ключа: використовуючи наданий `--discovery-token-ca-cert-hash`. Це значення доступне у виводі `kubeadm init` або може бути обчислене за допомогою стандартних інструментів (хеш обчислюється над байтами обʼєкта Subject Public Key Info (SPKI) відповідно до RFC7469). Прапор `--discovery-token-ca-cert-hash` може бути повторений кілька разів, щоб дозволити більше одного публічного ключа.
  - Як додаткова перевірка, сертифікат CA отримується через безпечне зʼєднання і порівнюється з сертифікатом CA, отриманим спочатку

{{< note >}}
Ви можете пропустити перевірку CA, передавши в командному рядку прапорець `--discovery-token-unsafe-skip-ca-verification`. Це послаблює модель безпеки kubeadm, оскільки інші потенційно можуть видавати себе за сервер API Kubernetes.
{{< /note >}}

#### Виявлення файлу/HTTPS {#file-https-discovery}

Якщо `kubeadm join` викликається з параметром `--discovery-file`, використовується виявлення за допомогою файлу; цей файл може бути локальним файлом або завантаженим через HTTPS URL; у випадку HTTPS, використовується встановлений на хості пакет сертифікатів CA для перевірки зʼєднання.

При виявленні файлу сертифікат CA кластера надається у самому файлі; фактично, файл для виявлення є файлом kubeconfig з встановленими тільки атрибутами `server` і `certificate-authority-data`, як описано у референс-документації [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery); коли зʼєднання з кластером встановлено, kubeadm намагається отримати доступ до ConfigMap `cluster-info`, і якщо він доступний, використовує його.

## TLS Bootstrap

Після того, як інформація про кластер відома, записується файл `bootstrap-kubelet.conf`, що дозволяє kubelet виконати початкове завантаження TLS.

Механізм початкового завантаження TLS використовує спільний токен для тимчасової автентифікації з сервером API Kubernetes для подання запиту на підписання сертифіката (CSR) для локально створеної пари ключів.

Запит автоматично затверджується, і операція завершується збереженням файлів `ca.crt` і `kubelet.conf`, які використовуються kubelet для приєднання до кластера, тоді як `bootstrap-kubelet.conf` видаляється.

{{< note >}}
- Тимчасова автентифікація перевіряється через токен, збережений під час процесу `kubeadm init` (або за допомогою додаткових токенів, створених командою `kubeadm token`)
- Тимчасова автентифікація відноситься до користувача, який є членом групи `system:bootstrappers:kubeadm:default-node-token`, якій було надано доступ до API CSR під час процесу `kubeadm init`
- Автоматичне затвердження CSR управляється контролером csrapprover відповідно до конфігурації, присутньої в процесі `kubeadm init`
{{< /note >}}

## Внутрішній дизайн робочого процесу kubeadm upgrade {#kubeadm-upgrade-workflow-internal-design}

Команда `kubeadm upgrade` має підкоманди для керування оновленням кластера Kubernetes, створеного за допомогою kubeadm. Вам слід виконати `kubeadm upgrade apply` на одному з вузлів панелі управління (ви можете вибрати, на якому саме); це запустить процес оновлення. Потім виконайте `kubeadm upgrade node` на всіх інших вузлах (як на робочих вузлах, так і на вузлах панелі управління).

І `kubeadm upgrade apply`, і `kubeadm upgrade node` мають підкоманду `phase`, яка надає доступ до внутрішніх фаз процесу оновлення. Докладніші відомості наведено у статті [`kubeadm upgrade phase`](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade-phase/).

Додатковими командами оновлення утиліти є `kubeadm upgrade plan` та `kubeadm upgrade diff`.

Усі підкоманди оновлення підтримують передачу конфігураційного файлу.

### kubeadm upgrade plan

За бажанням ви можете запустити `kubeadm upgrade plan` перед запуском `kubeadm upgrade apply`. Підкоманда `plan` перевіряє, до яких версій можна оновитися, і перевіряє, чи можна оновити ваш поточний кластер.

### kubeadm upgrade diff

Показує, які відмінності буде застосовано до існуючих статичних маніфестів пакунків для вузлів панелі управління. Більш розлогий спосіб зробити те саме — виконати `kubeadm upgrade apply --dry-run` або `kubeadm upgrade node --dry-run`.

### kubeadm upgrade apply

Команда `kubeadm upgrade apply` готує кластер до оновлення всіх вузлів, а також оновлює вузол панелі управління, на якому вона виконується. Кроки, які вона виконує:

- Виконує передпольотні перевірки, подібні до `kubeadm init` та `kubeadm join`, переконуючись, що образи контейнерів завантажено і кластер перебуває у стані, придатному для оновлення.
- Оновлює файли маніфесту панелі управління на диску у `/etc/kubernetes/manifests` і чекає, поки kubelet перезапустить компоненти, якщо файли було змінено.
- Завантажує оновлені конфігурації kubeadm і kubelet в кластер у ConfigMaps `kubeadm-config` і `kubelet-config` (обидві у просторі імен `kube-system`).
- Записує оновлену конфігурацію kubelet для цього вузла у файл `/var/lib/kubelet/config.yaml`, а також читає файл `/var/lib/kubelet/instance-config.yaml` цього вузла і накладає латки на такі поля, як `containerRuntimeEndpoint` з цієї конфігурації інстансу у `/var/lib/kubelet/config.yaml`.
- Налаштовує токен bootstrap і `cluster-info` ConfigMap для правил RBAC. Це те ж саме, що і на етапі `kubeadm init` і гарантує, що кластер продовжує підтримувати приєднання вузлів за допомогою токенів bootstrap.
- Оновлює kube-proxy та надбудови CoreDNS умовно, якщо всі існуючі kube-apiservers у кластері вже було оновлено до цільової версії.
- Виконує будь-які завдання після оновлення, такі як очищення застарілих функцій, що залежать від релізу.

### kubeadm upgrade node

`kubeadm upgrade node` оновлює один вузол панелі управління або робочий вузол після запуску оновлення кластера (шляхом запуску `kubeadm upgrade apply`). Команда визначає, чи є вузол вузлом панелі управління, перевіряючи наявність файлу `/etc/kubernetes/manifests/kube-apiserver.yaml`. Знайшовши цей файл, інструмент kubeadm
припускає, що на цьому вузлі запущено Pod kube-apiserver.

- Виконує передпольотні перевірки подібно до `kubeadm upgrade apply`.
- Для вузлів панелі управління оновлює файли маніфесту панелі управління на диску у `/etc/kubernetes/manifests` і чекає, поки kubelet перезапустить компоненти, якщо файли було змінено.
- Запише оновлену конфігурацію kubelet для цього вузла у `/var/lib/kubelet/config.yaml`, а також читає файл `/var/lib/kubelet/instance-config.yaml` цього вузла і накладає латки на такі поля, як `containerRuntimeEndpoint` з цієї конфігурації інстансу у `/var/lib/kubelet/config.yaml`.
- (Для вузлів панелі управління) Оновлює kube-proxy та CoreDNS {{< glossary_tooltip text="надбудови" term_id="addons" >}} умовно, за умови, що всі наявні API-сервери у кластері вже оновлені до цільової версії.
- Виконує будь-які завдання після оновлення, такі як очищення застарілих функцій, специфічних для конкретного випуску.

## Внутрішній дизайн робочого процесу kubeadm reset {#kubeadm-reset-phases-internal-design}

Ви можете скористатися підкомандою `kubeadm reset` на вузлі, де раніше виконувалися команди kubeadm. Ця підкоманда виконує очищення вузла з  **best-effort** зусиллями. Якщо певні дії не вдасться виконати, ви маєте втрутитися і виконати очищення вручну.

Команда підтримує фази. Докладні відомості наведено у статті [`kubeadm reset phase`](/docs/reference/setup-tools/kubeadm/kubeadm-reset-phase/).

Команда підтримує файл конфігурації.

Додатково:

- Правила IPVS, iptables і nftables **не** очищуються.
- Конфігурацію CNI (мережевого втулка) **не** очищено.
- Файл `.kube/` у домашній теці користувача **не** очищується.

Команда виконує наступні етапи:

- Виконує передпольотну перевірку вузла, щоб визначити, чи є він справним.
- Для вузлів панелі управління видаляє всі локальні дані членів etcd.
- Зупиняє роботу kubelet.
- Зупиняє запуск контейнерів.
- Відмонтує усі змонтовані теки у `/var/lib/kubelet`.
- Видаляє усі файли та теки, якими керує kubeadm у `/var/lib/kubelet` та `/etc/kubernetes`.
