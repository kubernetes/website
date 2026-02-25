---
title: Створення кластера за допомогою kubeadm
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>

За допомогою `kubeadm` ви можете створити мінімальний кластер Kubernetes, який відповідає найкращим практикам. Фактично, ви можете використовувати `kubeadm` для налаштування кластера, який успішно пройде [тести відповідності Kubernetes](/blog/2017/10/software-conformance-certification/). `kubeadm` також підтримує інші функції життєвого циклу кластера, такі як [bootstrap-токени](/docs/reference/access-authn-authz/bootstrap-tokens/) та оновлення кластера.

Інструмент `kubeadm` корисний у випадках, коли вам потрібен:

- Простий спосіб спробувати Kubernetes, можливо, вперше.
- Спосіб для поточних користувачів автоматизувати налаштування кластера та протестувати свій застосунок.
- Компонент в інших екосистемах та/або інсталяторах із більшим функціоналом.

Ви можете встановлювати та використовувати `kubeadm` на різних машинах: на вашому ноутбуці, хмарних серверах, Raspberry Pi та інших. Незалежно від того, чи ви розгортаєте у хмарі, чи на власних серверах, ви можете інтегрувати `kubeadm` у системи постачання, такі як Ansible або Terraform.

## {{% heading "prerequisites" %}}

Для виконання цього керівництва вам потрібно мати:

- Одну чи кілька машин з операційною системою, сумісною з deb/rpm, наприклад: Ubuntu чи CentOS.
- 2 ГБ або більше оперативної памʼяті на кожній машині — менше може призвести до обмежень для вашого застосунку.
- Принаймні 2 процесори на машині, яку ви використовуєте як вузол панелі управління.
- Повну мережеву доступність між усіма машинами в кластері. Ви можете використовувати як публічні, так і приватні мережі.

Також вам потрібно використовувати версію `kubeadm`, яка може розгортати ту версію
Kubernetes, яку ви хочете використовувати у своєму новому кластері.

[Політика підтримки версій та їх розбіжностей в Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions) розповсюджується на `kubeadm` так само як і на Kubernetes в цілому. Перевірте цю політику, щоб дізнатися, які версії Kubernetes та `kubeadm` підтримуються. Ця сторінка написана для Kubernetes {{< param "version" >}}.

Загальний стан функцій інструменту `kubeadm` — Загальна Доступність (GA). Деякі підфункції ще перебувають на стадії активної розробки. Реалізація створення кластера може трохи змінитися, в міру розвитку інструменту, але загальна реалізація повинна бути досить стабільною.

{{< note >}}
Будь-які команди під `kubeadm alpha` за визначенням підтримуються на рівні альфа-версії.
{{< /note >}}

<!-- steps -->

## Мета {#Objectives}

- Встановити Kubernetes з одною панеллю управління
- Встановити мережу для Podʼів в кластері, так щоб вони могли спілкуватися один з одним

## Інструкції {#instructions}

### Підготовка хостів {#preparing-the-hosts}

#### Встановлення компонентів {#component-installation}

Встановіть {{< glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів" >}} та `kubeadm` на всіх хостах. За докладними інструкціями та іншими вимогами звертайтесь до [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Якщо ви вже встановили `kubeadm`, перегляньте перші два кроки документації
[Оновлення вузлів Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) для отримання інструкцій щодо оновлення `kubeadm`.

Під час оновлення `kubelet` перезапускається кожні кілька секунд, очікуючи в crashloop на команди від `kubeadm`. Цей цикл аварійного перезавантаження є очікуваним і нормальним. Після ініціалізації панелі управління `kubelet` працює в нормальному режимі.
{{< /note >}}

#### Налаштування мережі {#network-setup}

`kubeadm`, подібно до інших компонентів Kubernetes, намагається знайти доступну IP-адресу на мережевих інтерфейсах, повʼязаних із вказаним типовим шлюзом на хості.
Ця IP-адреса використовується для оголошення та/або прослуховування, яке виконується компонентом.

Щоб дізнатися, яка це IP-адреса на Linux-хості, ви можете використовувати:

```shell
ip route show # Перегляньте рядок, який починається з "default via"
```

{{< note >}}
Якщо на хості присутні два або більше стандартних шлюзи, компонент Kubernetes буде намагатися використовувати перший, який зустрічається із відповідною глобальною унікальною IP-адресою. При здійсненні цього вибору точний порядок шлюзів може відрізнятися між різними операційними системами та версіями ядра.
{{< /note >}}

Компоненти Kubernetes не приймають мережевий інтерфейс як параметр, тому потрібно передавати власну IP-адресу як прапорець для всіх екземплярів компонентів, які потребують такої конфігурації.

{{< note >}}
Якщо на хості відсутній стандартний шлюз і якщо не передано власну IP-адресу
компоненту Kubernetes, робота компонента може завершитися з помилкою.
{{< /note >}}

Для налаштування IP-адреси оголошення API-сервера для вузлів панелі управління, створених із `init` та `join`, можна використовувати прапорець `--apiserver-advertise-address`. Переважно, варто встановлювати цю опцію в [API-інтерфейсі kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4)
як `InitConfiguration.localAPIEndpoint` та `JoinConfiguration.controlPlane.localAPIEndpoint`.

Для kubelet на всіх вузлах опцію `--node-ip` можна передати в `.nodeRegistration.kubeletExtraArgs` всередині конфігураційного файлу kubeadm (`InitConfiguration` або `JoinConfiguration`).

Для роботи з двома стеками дивіться [Підтримка двох стеків із kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

IP-адреси, які ви призначаєте компонентам панелі управління, стають частиною полів імені альтернативного підлеглого X.509 сертифікату. Зміна цих IP-адрес може вимагати підписання нових сертифікатів і перезапуску відповідних компонентів, щоб задіяти зміни у файлах сертифікатів. Дивіться [Ручне поновлення сертифікатів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal) для отримання докладнішої інформації з цього питання.

{{< warning >}}
Проєкт Kubernetes не рекомендує використовувати цей підхід (налаштування всіх екземплярів компонентів власними IP-адресами). Замість цього рекомендується встановити мережу хосту так, щоб IP-адреса стандартного шлюзу була тією, яку компоненти Kubernetes автоматично визначають і використовують. На Linux-вузлах ви можете використовувати команди, такі як `ip route` для налаштування мережі; ваша операційна система може також надавати засоби управління мережею вищого рівня. Якщо стандартний шлюз вашого вузла має публічну IP-адресу, слід налаштувати фільтрацію пакетів чи інші заходи безпеки, що захищають вузли та ваш кластер.
{{< /warning >}}

### Підготовка необхідних образів контейнерів {#preparing-the-required-container-images}

Цей крок є необовʼязковим і застосовується тільки у випадку, якщо ви бажаєте, щоб `kubeadm init` та `kubeadm join` не завантажували типові образи контейнерів, які розміщені на `registry.k8s.io`.

Kubeadm має команди, які можуть допомогти вам попередньо витягти необхідні образи
при створенні кластера без Інтернет-зʼєднання на його вузлах. Дивіться [Запуск kubeadm без Інтернет-зʼєднання](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection) для отримання докладнішої інформації.

Kubeadm дозволяє вам використовувати власний репозиторій образів для необхідних образів. Дивіться [Використання власних образів](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images) для отримання більше інформації.

### Ініціалізація вузла панелі управління {#initializing-your-control-plane-node}

Вузол панелі управління — це машина, де працюють компоненти панелі управління, включаючи {{< glossary_tooltip term_id="etcd" >}} (база даних кластера) та {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} (з яким взаємодіє інструмент командного рядка {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}).

1. (Рекомендовано) Якщо у вас є плани оновлення цього кластера з одною панеллю управління за допомогою `kubeadm` до рівня [високої доступності](/docs/setup/production-environment/tools/kubeadm/high-availability/), ви повинні вказати `--control-plane-endpoint`, щоб встановити загальний endpoint для всіх вузлів панелі управління. Такий endpoint може бути іменем DNS або IP-адресою балансувальника навантаження.
1. Виберіть надбудову мережі Pod та перевірте, чи для її налаштування потрібно передати будь-які аргументи в `kubeadm init`. Залежно від того, якого постачальника вибрано, вам може бути потрібно встановити значення `--pod-network-cidr` в значення, специфічне для постачальника. Дивіться [Встановлення надбудови мережі Podʼів](#pod-network).
1. (Необовʼязково) `kubeadm` намагається визначити середовище виконання контейнерів, використовуючи список відомих точок входу. Щоб використовувати інше середовище виконання контейнерів або якщо встановлено більше одного на наданому вузлі, вкажіть аргумент `--cri-socket` для `kubeadm`. Дивіться [Встановлення середовища виконання](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Щоб ініціалізувати вузол панелі управління, виконайте:

```bash
kubeadm init <args>
```

### Міркування щодо apiserver-advertise-address та ControlPlaneEndpoint {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

Хоча `--apiserver-advertise-address` може бути використано для встановлення оголошення адреси для API-сервера цього конкретного вузла панелі управління, `--control-plane-endpoint` може бути використано для встановлення загальної endpoint для всіх вузлів управління.

`--control-plane-endpoint` дозволяє використовувати як IP-адреси, так і DNS-імена, які можуть транслюватись у IP-адреси. Будь ласка, зверніться до вашого адміністратора мережі, щоб оцінити можливі рішення щодо такого перетворення.

Ось приклад:

```none
192.168.0.102 cluster-endpoint
```

Де `192.168.0.102` — це IP-адреса цього вузла, а `cluster-endpoint` — це власне DNS-імʼя, яке повʼязується з цим IP. Це дозволить вам передавати `--control-plane-endpoint=cluster-endpoint` у `kubeadm init` і передавати те ж саме DNS-імʼя до `kubeadm join`. Пізніше ви можете змінити `cluster-endpoint`, щоб вказати адресу вашого балансувальника навантаження в сценарії високої доступності.

Перетворення кластера з одною панеллю управлінням, створеного без `--control-plane-endpoint`, у високодоступний кластер не підтримується kubeadm.

### Додаткова інформація {#more-information}

Для отримання додаткової інформації щодо аргументів `kubeadm init`, див. [посібник kubeadm](/docs/reference/setup-tools/kubeadm/).

Щоб налаштувати `kubeadm init` за допомогою файлу конфігурації, див. [Використання kubeadm init з файлом конфігурації](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Для налаштування компонентів панелі управління, включаючи необовʼязкове призначення IPv6 для перевірки наявності для компонентів панелі управління та сервера etcd, надайте додаткові аргументи кожному компоненту, як описано на сторінці про [додаткові аргументи](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Щоб переналаштувати кластер, який вже був створений, див. [Переконфігурування кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Щоб знову виконати `kubeadm init`, спершу вам потрібно [розібрати кластер](#tear-down).

Якщо ви приєднуєте вузол з іншою архітектурою до вашого кластера, переконайтеся, що ваші розгорнуті DaemonSets мають підтримку образів контейнерів для цієї архітектури.

`kubeadm init` спочатку виконує серію попередніх перевірок, щоб забезпечити готовність машини до запуску Kubernetes. Ці попередні перевірки виводять попередження та виходять при помилках. Потім `kubeadm init` завантажує та встановлює компоненти управління кластером. Це може зайняти кілька хвилин. Після завершення ви повинні побачити:

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Щоб кubectl працював для вашого користувача без прав root, виконайте ці команди, які є також частиною виводу `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Або, якщо ви є користувачем `root`, ви можете виконати:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Файл конфігурації kubeconfig `admin.conf`, який створює `kubeadm init`, містить сертифікат із `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Група `kubeadm:cluster-admins` привʼязана до вбудованої ролі кластера `cluster-admin`.
Не діліться файлом `admin.conf` будь з ким.

`kubeadm init` генерує інший файл kubeconfig `super-admin.conf`, який містить сертифікат із `Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` — це суперкористувацька група, яка обходить рівень авторизації (наприклад, RBAC). Не діліться файлом `super-admin.conf` будь з ким. Рекомендується перемістити файл в безпечне місце.

Див. [Генерація файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users) щодо того, як використовувати `kubeadm kubeconfig user` для генерації файлів kubeconfig для додаткових користувачів.
{{< /warning >}}

Запишіть команду `kubeadm join`, яку виводить `kubeadm init`. Вам потрібна ця команда для [приєднання вузлів до вашого кластера](#join-nodes).

Токен використовується для взаємної автентифікації між вузлом панелі управління та приєднуваними вузлами. Токен, який включено тут, є секретним. Зберігайте його у безпеці, оскільки будь-хто з цим токеном може додавати автентифіковані вузли до вашого кластера. Ці токени можна подивитись, створити та видалити за допомогою команди `kubeadm token`. Див. [посібник посилань для kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Встановлення надбудови для мережі Pod {#pod-network}

{{< caution >}}
Цей розділ містить важливу інформацію щодо налаштування мережі та порядку розгортання. Уважно прочитайте всі ці поради перед продовженням.

**Вам потрібно розгорнути надбудову мережі Pod на основі {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}} (CNI), щоб ваші Podʼи могли взаємодіяти один з одним. Кластерний DNS (CoreDNS) не буде запущений, доки не буде встановлена мережа.**

- Пильнуйте, щоб мережа ваших Podʼів не перетиналася з будь-якою з мереж хосту. (Якщо ви знаходите колізію між вашою пропонованою мережею Podʼів та деякими мережами вашого хосту, вам слід обрати відповідний блок CIDR для використання його під час виконання `kubeadm init` з `--pod-network-cidr` та як заміну у вашому YAML-файлі налаштувань мережевого втулка.)

- Типово `kubeadm` налаштовує ваш кластер на використання та забезпечення використання [RBAC](/docs/reference/access-authn-authz/rbac/) (контроль доступу на основі ролей). Переконайтеся, що ваш мережевий втулок для Pod підтримує RBAC, так само як і будь-які маніфести, які ви використовуєте для його розгортання.

- Якщо ви хочете використовувати IPv6, як з подвійним стеком, так і в одностековій IPv6-мережі, для вашого кластера, переконайтеся, що ваш мережевий втулок для Podʼів підтримує IPv6. Підтримку IPv6 було додано до CNI у [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm повинен бути агностичним до CNI, а перевірка постачальників CNI виходить за рамки наших поточних e2e-тестів. Якщо ви знайшли проблему, повʼязану з втулком CNI, вам слід створити тікет у відповідному репозиторії втулка CNI, а не у репо kubeadm чи Kubernetes.
{{< /note >}}

Кілька зовнішніх проєктів надають мережі Pod Kubernetes за допомогою CNI, деякі з яких також підтримують [Network Policy](/docs/concepts/services-networking/network-policies/).

Див. список надбудов, які реалізують [Модель мережі Kubernetes](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

Будь ласка, звертайтеся до сторінки [Встановлення надбудов](/docs/concepts/cluster-administration/addons/#networking-and-network-policy) для списку мережевих надбудов (може бути неповним), які підтримуються в Kubernetes. Ви можете встановити надбудову мережі Pod за допомогою наступної команди на вузлі панелі управління
або вузлі, на якому є облікові дані kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Лише кілька втулків CNI підтримують Windows. Більше деталей та інструкцій щодо налаштування можна знайти в розділі [Додавання Windows worker вузлів](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

Ви можете встановити лише одну мережу Pod на кластер.

Як тільки мережу Pod буде створено, ви можете підтвердити, що вона працює, перевіривши, що Pod CoreDNS у стані `Running` у виводі `kubectl get pods --all-namespaces`. І як тільки Pod CoreDNS запущено і він працює, ви можете продовжити приєднувати ваші вузли.

Якщо ваша мережа не працює або CoreDNS не перебуває у стані `Running`, перегляньте
[посібник з усунення несправностей](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) для `kubeadm`.

### Керовані мітки вузлів {#managed-node-labels}

Типово kubeadm вмикає контролер доступу [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction), що обмежує, які мітки можуть бути самостійно застосовані kubelet під час реєстрації вузла. Документація контролера доступу описує, які мітки можна використовувати з параметром kubelet `--node-labels`. Мітка `node-role.kubernetes.io/control-plane` є такою обмеженою міткою, і kubeadm вручну застосовує її, використовуючи привілейований клієнт після створення вузла. Щоб зробити це вручну, ви можете використовувати `kubectl label`
та переконатися, що використовується привілейований kubeconfig, такий як керований kubeadm `/etc/kubernetes/admin.conf`.

### Ізоляція вузла панелі управління {#control-plane-node-isolation}

Типово, з міркувань безпеки, кластер не виконує розміщення Podʼів на вузлах панелі управління. Якщо ви хочете мати можливість розміщувати Podʼи на вузлах панелі управління, наприклад, для кластера Kubernetes на одній машині, виконайте команду:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Вивід буде схожим на:

```none
node "test-01" untainted
...
```

Це видалить позначку `node-role.kubernetes.io/control-plane:NoSchedule` з будь-яких вузлів, які мають її, включаючи вузли панелі управління, що означає, що планувальник зможе розміщувати Podʼи всюди.

Додатково ви можете виконати наступну команду, щоб видалити мітку [`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) з вузла панелі управління, що виключає його зі списку бекенд-серверів:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Додавання додаткових вузлів панелі управління {#adding-more-control-plane-nodes}

Дивіться [Створення кластерів з високою доступністю за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) для інструкцій щодо створення кластеру з високою доступністю за допомогою kubeadm шляхом додавання додаткових вузлів панелі управління.

### Додавання робочих вузлів {#join-nodes}

Робочі вузли — це місце, де запускаються ваші робочі навантаження.

Наступні сторінки показують, як додати Linux та Windows робочі вузли до кластеру за допомогою команди `kubeadm join`:

- [Додавання Linux робочих вузлів](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
- [Додавання Windows робочих вузлів](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Опціонально) Керування кластером з інших машин, крім вузла панелі управління {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

Щоб отримати доступ до кластера з іншого компʼютера (наприклад, з ноутбука), вам потрібно скопіювати файл kubeconfig з вузла панелі управління на ваш робочий компʼютер:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
У даному прикладі вважається, що доступ SSH увімкнено для користувача root. Якщо цього не відбувається, ви можете скопіювати файл `admin.conf` так, щоб його можна було отримати через обліковий запис іншого користувача, і використовувати цього користувача для `scp`.

Файл `admin.conf` надає користувачеві привілеї _superuser_ у кластері. Його слід використовувати обережно. Для звичайних користувачів рекомендується генерувати унікальні облікові дані, до яких ви надаєте привілеї. Це можна зробити за допомогою команди `kubeadm kubeconfig user --client-name <CN>`. Ця команда виведе файл KubeConfig у STDOUT, який вам слід зберегти в файл та розповсюджувати поміж користувачів. Після цього надайте привілеї за допомогою `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Опціонально) Проксі-доступ до API Server на localhost {#optional-proxying-api-server-to-localhost}

Якщо ви хочете підʼєднатися до API Server ззовні кластера, ви можете використовувати `kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Тепер ви можете отримати доступ до API Server локально за адресою `http://localhost:8001/api/v1`.

## Очищення {#tear-down}

Якщо ви використовували тимчасові сервери для свого кластера для тестування, ви можете вимкнути їх і не проводити додаткового очищення. Ви можете використовувати `kubectl config delete-cluster`, щоб видалити ваші локальні посилання на кластер.

Однак, якщо ви хочете розібрати ваш кластер відповіднішим чином, вам слід спочатку [перевести вузол в режим обслуговування](/docs/reference/generated/kubectl/kubectl-commands#drain) і переконатися, що на вузлі немає ресурсів, а потім виконайте деконфігурацію вузла.

### Видалення вузла {#remove-node}

Зверніться до вузла панелі управління використовуючи відповідний обліковий запис та виконайте:

```bash
kubectl drain <імʼя вузла> --delete-emptydir-data --force --ignore-daemonsets
```

Перед видаленням вузла скиньте стан, встановлений за допомогою `kubeadm`:

```bash
kubeadm reset
```

Процес скидання не відновлює або не очищає правила iptables чи таблиці IPVS. Якщо ви хочете скинути iptables, вам слід це зробити вручну:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Якщо ви хочете скинути таблиці IPVS, вам слід виконати наступну команду:

```bash
ipvsadm -C
```

Тепер видаліть вузол:

```bash
kubectl delete node <імʼя вузла>
```

Якщо ви хочете почати спочатку, запустіть `kubeadm init` або `kubeadm join` з відповідними аргументами.

### Очищення панелі управління {#clean-up-the-control-plane}

Ви можете використовувати `kubeadm reset` на хості панелі управління для виконання очищення.

Дивіться [довідкову документацію](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для `kubeadm reset` для отримання додаткової інформації щодо цієї команди та її параметрів.

## Політика розбіжності версій {#version-skew-policy}

Хоча kubeadm дозволяє розбіжність версій деяких компонентів, якими він керує, рекомендується узгодити версію kubeadm з версіями компонентів панелі управління, kube-proxy та kubelet.

### Відхилення версії kubeadm від версії Kubernetes {#kubeadm-s-skew-against-the-kubernetes-version}

kubeadm можна використовувати із компонентами Kubernetes, які мають таку саму версію, як і kubeadm, або версію, яка є старішою на один пункт. Версію Kubernetes можна вказати для kubeadm, використовуючи прапорець `--kubernetes-version` команди `kubeadm init` або поле [`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/) при використанні `--config`. Ця опція буде контролювати версії kube-apiserver, kube-controller-manager, kube-scheduler та kube-proxy.

Приклад:

- kubeadm має версію {{< skew currentVersion >}}
- `kubernetesVersion` повинна бути {{< skew currentVersion >}} або {{< skew currentVersionAddMinor -1 >}}

### Відхилення версії kubeadm від версії kubelet {#kubeadm-s-skew-against-the-kubelet}

Аналогічно до версії Kubernetes, kubeadm можна використовувати з версією kubelet, яка є такою ж самою версією, що й kubeadm, або на три версії старішою.

Приклад:

- kubeadm має версію {{< skew currentVersion >}}
- kubelet на хості повинен мати версію {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}}, {{< skew currentVersionAddMinor -2 >}} або {{< skew currentVersionAddMinor -3 >}}

### Різниця між версіями kubeadm {#kubeadm-s-skew-against-kubeadm}

Є певні обмеження на те, як можна використовувати команди kubeadm на поточних вузлах або цілих кластерах, що управляються kubeadm.

Якщо до кластера приєднуються нові вузли, використана для `kubeadm join` бінарна версія kubeadm повинна відповідати останній версії kubeadm, що використовувалася або для створення кластера за допомогою `kubeadm init`, або для оновлення того самого вузла за допомогою `kubeadm upgrade`. Подібні правила застосовуються до інших команд kubeadm з винятком `kubeadm upgrade`.

Приклад для `kubeadm join`:

- версія kubeadm {{< skew currentVersion >}} використовувалася для створення кластера за допомогою `kubeadm init`
- Приєднувані вузли повинні використовувати бінарний файл kubeadm версії {{< skew currentVersion >}}

Вузли, які оновлюються, повинні використовувати версію kubeadm, яка є тією ж самою MINOR версією або на одну MINOR версію новішою, ніж версія kubeadm, яка використовувалася для управління вузлом.

Приклад для `kubeadm upgrade`:

- версія kubeadm {{< skew currentVersionAddMinor -1 >}} використовувалася для створення або оновлення вузла
- Версія kubeadm, використана для оновлення вузла, повинна бути на {{< skew currentVersionAddMinor -1 >}} або {{< skew currentVersion >}}

Щоб дізнатися більше про різницю версій між різними компонентами Kubernetes, див. [Політику відхилень версій](/releases/version-skew-policy/).

### Обмеження {#limitations}

### Витривалість кластера {#resilience}

Створений тут кластер має один вузол для панелі управління з однією базою даних etcd, яка працює на ньому. Це означає, що якщо вузол для панелі управління вийде з ладу, ваш кластер може втратити дані і може деведеться його перестворювати з нуля.

Обхідні шляхи:

- Регулярно [робіть резервні копії etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). Тека даних etcd, налаштована за допомогою kubeadm, розташована за адресою `/var/lib/etcd` на вузлі панелі управління.

- Використовуйте кілька вузлів для панелі управління. Ви можете прочитати про   [Варіанти високодоступної топології](/docs/setup/production-environment/tools/kubeadm/ha-topology/), щоб вибрати топологію кластера, яка забезпечує [високу доступність](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Платформна сумісність {#multi-platform}

Пакунки та бінарні файли kubeadm для deb/rpm будуються для amd64, arm (32-біт), arm64, ppc64le та s390x, відповідають [пропозиції щодо багатоплатформності](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Багатоплатформні образи контейнерів для вузла панелі управління та надбудов також підтримуються з версії 1.12.

Не всі, тільки деякі постачальники підсистем мережевих рішень пропонують рішення для всіх платформ. Зверніться до списку постачальників мережевих рішень вище або до документації кожного постачальника, щоб визначити, чи підтримує постачальник вашу платформу.

### Усунення несправностей {#troubleshooting}

Якщо ви стикаєтеся з труднощами у роботі з kubeadm, будь ласка, звертайтеся до наших
[порад з усунення несправностей](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

<!-- discussion -->

### {{% heading "whatsnext" %}}

- Перевірте, що ваш кластер працює належним чином за допомогою [Sonobuoy](https://github.com/heptio/sonobuoy).
- <a id="lifecycle" />Дивіться [Оновлення кластерів за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) для отримання деталей щодо оновлення кластеру з використанням `kubeadm`.
- Дізнайтесь про розширене використання `kubeadm` у [довідковій документації  кubeadm](/docs/reference/setup-tools/kubeadm/).
- Дізнайтеся більше про концепції Kubernetes [тут](/docs/concepts/) та про [`kubectl`](/docs/reference/kubectl/).
- Дивіться розділ [Мережа в кластері](/docs/concepts/cluster-administration/networking/) для отримання великого списку додаткових надбудов мережі Pod.
- <a id="other-addons" />Дивіться [список надбудов](/docs/concepts/cluster-administration/addons/) для ознайомлення з іншими надбудовами, включаючи інструменти для ведення логів, моніторингу, мережевої політики, візуалізації та управління вашим кластером Kubernetes.
- Налаштуйте спосіб обробки вашим кластером логів подій кластера та застосунків, які працюють у Podʼах. Дивіться [Архітектуру ведення логів](/docs/concepts/cluster-administration/logging/) для отримання огляду того, що для цього потрібно.

### Зворотній звʼязок {#feedback}

- Для ознайомлення з повідомленями про помилки відвідайте [трекер проблем kubeadm на GitHub](https://github.com/kubernetes/kubeadm/issues)
- Для отримання підтримки відвідайте канал Slack [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
- Загальний канал розробки SIG Cluster Lifecycle в Slack: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [Інформація про SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
- Розсилка SIG Cluster Lifecycle: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
