---
title: Створення кластера за допомогою kubeadm
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>

За допомогою `kubeadm` ви можете створити мінімально життєздатний кластер Kubernetes, який відповідає найкращим практикам. Фактично `kubeadm` можна використати для налаштування кластера, який пройде [тести відповідності Kubernetes](/blog/2017/10/software-conformance-certification/). `kubeadm` також підтримує інші функції життєвого циклу кластера, як-от [bootstrap-токени](/docs/reference/access-authn-authz/bootstrap-tokens/) та оновлення кластера.

Інструмент `kubeadm` добре підходить, якщо вам потрібен:

- Простий спосіб спробувати Kubernetes, можливо, вперше.
- Спосіб для наявних користувачів автоматизувати налаштування кластера й тестувати свій застосунок.
- Складовий елемент для інших інструментів екосистеми та/або інсталяторів ширшого призначення.

Ви можете встановлювати й використовувати `kubeadm` на різних машинах: на ноутбуці, наборі хмарних серверів, Raspberry Pi тощо. Незалежно від того, чи розгортаєте ви кластер у хмарі, чи на власній інфраструктурі, `kubeadm` можна інтегрувати в системи розгортання, як-от Ansible або Terraform.

## {{% heading "prerequisites" %}} {#before-you-begin}

Щоб виконати інструкції з цього посібника, вам потрібні:

- Одна чи кілька машин з ОС Linux, сумісною з deb/rpm, наприклад Ubuntu або CentOS.
- 2 ГіБ або більше оперативної памʼяті на кожній машині — якщо менше, залишиться мало місця для ваших застосунків.
- Щонайменше 2 CPU на машині, яку ви використовуєте як вузол панелі управління.
- Повне мережеве зʼєднання між усіма машинами в кластері. Можна використовувати як публічну, так і приватну мережу.

Також потрібно використовувати версію `kubeadm`, яка може розгорнути ту версію Kubernetes, яку ви хочете використовувати у своєму новому кластері.

[Політика підтримки версій і версійної розбіжності Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions) стосується як `kubeadm`, так і Kubernetes загалом. Ознайомтеся з цією політикою, щоб дізнатися, які версії Kubernetes і `kubeadm` підтримуються. Цю сторінку написано для Kubernetes {{< param "version" >}}.

Загальний стан можливостей інструменту `kubeadm` — загальна доступність (GA). Деякі окремі можливості ще активно розробляються. Реалізація створення кластера може дещо змінюватися з розвитком інструменту, але загалом реалізація має бути досить стабільною.

{{< note >}}
Будь-які команди під `kubeadm alpha` за визначенням підтримуються на рівні альфа-версії.
{{< /note >}}

<!-- steps -->

## Цілі {#objectives}

- Встановити кластер Kubernetes з одним вузлом панелі управління
- Встановити мережу для Podʼів у кластері, щоб ваші Podʼи могли взаємодіяти між собою

## Інструкції {#instructions}

### Підготовка хостів {#preparing-the-hosts}

#### Встановлення компонентів {#component-installation}

Встановіть {{< glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів" >}} і kubeadm на всіх хостах. Докладні інструкції та інші передумови див. у [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Якщо ви вже встановили kubeadm, інструкції з оновлення kubeadm див. у перших двох кроках документа [Оновлення вузлів Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes).

Під час оновлення kubelet перезапускається кожні кілька секунд, бо в циклі аварійних перезапусків (crashloop) чекає, поки kubeadm скаже йому, що робити. Такий crashloop очікуваний і нормальний. Після ініціалізації панелі управління kubelet працює нормально.
{{< /note >}}

#### Налаштування мережі {#network-setup}

kubeadm, як і інші компоненти Kubernetes, намагається знайти придатну IP-адресу на мережевих інтерфейсах, повʼязаних зі стандартним шлюзом на хості. Потім ця IP-адреса використовується для оголошення та/або прослуховування, які виконує компонент.

Щоб дізнатися, яка це IP-адреса на хості Linux, можна виконати:

```shell
ip route show # Перегляньте рядок, який починається з "default via"
```

{{< note >}}
Якщо на хості є два або більше стандартних шлюзів, компонент Kubernetes спробує використати перший знайдений, який має придатну глобальну унікаст-адресу (global unicast). Під час цього вибору точний порядок шлюзів може відрізнятися в різних операційних системах і версіях ядра.
{{< /note >}}

Компоненти Kubernetes не приймають власний мережевий інтерфейс як параметр, тому власну IP-адресу потрібно передавати як прапорець усім екземплярам компонентів, яким потрібна така власна конфігурація.

{{< note >}}
Якщо хост не має стандартного шлюзу і компоненту Kubernetes не передано власну IP-адресу, компонент може завершити роботу з помилкою.
{{< /note >}}

Щоб налаштувати адресу оголошення API-сервера для вузлів панелі управління, створених як за допомогою `init`, так і `join`, можна використати прапорець `--apiserver-advertise-address`. Бажано задавати цей параметр в [API kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4) як `InitConfiguration.localAPIEndpoint` і `JoinConfiguration.controlPlane.localAPIEndpoint`.

Для kubelet на всіх вузлах параметр `--node-ip` можна передати в `.nodeRegistration.kubeletExtraArgs` у файлі конфігурації kubeadm (`InitConfiguration` або `JoinConfiguration`).

Про подвійний стек див. [Підтримка подвійного стека за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

IP-адреси, які ви призначаєте компонентам панелі управління, стають частиною полів subject alternative name їхніх сертифікатів X.509. Зміна цих IP-адрес потребуватиме підписання нових сертифікатів і перезапуску відповідних компонентів, щоб зміни у файлах сертифікатів набули чинності. Докладніше див. [Ручне поновлення сертифікатів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal).

{{< warning >}}
Проєкт Kubernetes не рекомендує цей підхід (налаштування всіх екземплярів компонентів із власними IP-адресами). Натомість супровідники Kubernetes радять налаштувати мережу хоста так, щоб IP-адреса стандартного шлюзу була тією, яку компоненти Kubernetes автоматично визначають і використовують. На вузлах Linux для налаштування мережі можна використовувати такі команди, як `ip route`; ваша операційна система також може надавати інструменти керування мережею вищого рівня. Якщо стандартний шлюз вашого вузла — публічна IP-адреса, слід налаштувати фільтрацію пакетів або інші заходи безпеки, що захищають вузли та ваш кластер.
{{< /warning >}}

### Підготовка необхідних образів контейнерів {#preparing-the-required-container-images}

Цей крок необовʼязковий і застосовується лише тоді, коли ви не хочете, щоб `kubeadm init` і `kubeadm join` завантажували стандартні образи контейнерів, розміщені в `registry.k8s.io`.

Kubeadm має команди, які допоможуть заздалегідь завантажити потрібні образи, коли ви створюєте кластер без підключення до інтернету на його вузлах. Докладніше див. [Використання kubeadm без підключення до Інтернету](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection).

Kubeadm дає змогу використовувати власний репозиторій образів для потрібних образів. Докладніше див. [Використання власних образів](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images).

### Ініціалізація вузла панелі управління {#initializing-your-control-plane-node}

Вузол панелі управління — це машина, на якій працюють компоненти панелі управління, зокрема {{< glossary_tooltip term_id="etcd" >}} (база даних кластера) і {{< glossary_tooltip text="API-сервер" term_id="kube-apiserver" >}} (з яким взаємодіє інструмент командного рядка {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}).

1. (Рекомендовано) Якщо ви плануєте перетворити цей кластер `kubeadm` з одним вузлом панелі управління на [високодоступний](/docs/setup/production-environment/tools/kubeadm/high-availability/), слід вказати `--control-plane-endpoint`, щоб задати спільну точку доступу для всіх вузлів панелі управління. Такою точкою доступу може бути DNS-імʼя або IP-адреса балансувальника навантаження.
1. Виберіть мережеву надбудову для Podʼів і перевірте, чи потрібно передавати їй якісь аргументи в `kubeadm init`. Залежно від вибраного стороннього постачальника може знадобитися встановити `--pod-network-cidr` у значення, специфічне для постачальника. Див. [Встановлення мережевої надбудови для Podʼів](#pod-network).
1. (Необовʼязково) `kubeadm` намагається виявити середовище виконання контейнерів за списком добре відомих точок доступу. Щоб використати інше середовище виконання контейнерів або якщо на вузлі встановлено більше одного, вкажіть для `kubeadm` аргумент `--cri-socket`. Див. [Встановлення середовища виконання контейнерів](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Щоб ініціалізувати вузол панелі управління, виконайте:

```bash
kubeadm init <args>
```

### Міркування щодо apiserver-advertise-address та ControlPlaneEndpoint {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

Хоча `--apiserver-advertise-address` можна використати для задання адреси оголошення API-сервера саме цього вузла панелі управління, `--control-plane-endpoint` можна використати для задання спільної точки доступу для всіх вузлів панелі управління.

`--control-plane-endpoint` приймає як IP-адреси, так і DNS-імена, які можуть зіставлятися з IP-адресами. Зверніться до свого мережевого адміністратора, щоб оцінити можливі рішення щодо такого зіставлення.

Ось приклад зіставлення:

```
192.168.0.102 cluster-endpoint
```

Де `192.168.0.102` — IP-адреса цього вузла, а `cluster-endpoint` — власне DNS-імʼя, яке зіставляється з цією IP-адресою. Це дасть змогу передати `--control-plane-endpoint=cluster-endpoint` у `kubeadm init` і те саме DNS-імʼя в `kubeadm join`. Пізніше ви зможете змінити `cluster-endpoint` так, щоб він вказував на адресу балансувальника навантаження у сценарії високої доступності.

kubeadm не підтримує перетворення кластера з однією панеллю управління, створеного без `--control-plane-endpoint`, на високодоступний кластер.

### Додаткова інформація {#more-information}

Докладніше про аргументи `kubeadm init` див. у [довідковому посібнику kubeadm](/docs/reference/setup-tools/kubeadm/).

Щоб налаштувати `kubeadm init` за допомогою файлу конфігурації, див. [Використання kubeadm init з конфігураційним файлом](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Щоб налаштувати компоненти панелі управління, зокрема необовʼязково призначити IPv6 для проб життєздатності компонентів панелі управління та сервера etcd, передайте додаткові аргументи кожному компоненту, як описано в [власних аргументах](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Щоб переналаштувати вже створений кластер, див. [Переконфігурація кластера за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Щоб знову виконати `kubeadm init`, спершу вам потрібно [розібрати кластер](#tear-down).

Якщо ви приєднуєте до кластера вузол з іншою архітектурою, переконайтеся, що образи контейнерів ваших розгорнутих DaemonSet підтримують цю архітектуру.

`kubeadm init` спочатку виконує низку попередніх перевірок, щоб переконатися, що машина готова до запуску Kubernetes. Ці попередні перевірки виводять попередження та завершують роботу в разі помилок. Потім `kubeadm init` завантажує та встановлює компоненти панелі управління кластера. Це може зайняти кілька хвилин. Після завершення ви маєте побачити:

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

Щоб kubectl працював для вашого користувача без прав root, виконайте ці команди, які є також частиною виводу `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Або, якщо ви користувач `root`, можна виконати:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Файл kubeconfig `admin.conf`, який генерує `kubeadm init`, містить сертифікат із `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Група `kubeadm:cluster-admins` привʼязана до вбудованої ClusterRole `cluster-admin`. Нікому не передавайте файл `admin.conf`.

`kubeadm init` генерує ще один файл kubeconfig — `super-admin.conf`, який містить сертифікат із `Subject: O = system:masters, CN = kubernetes-super-admin`. `system:masters` — це аварійна (break-glass) група суперкористувачів, яка обходить рівень авторизації (наприклад, RBAC). Нікому не передавайте файл `super-admin.conf`. Рекомендується перемістити цей файл у безпечне місце.

Про те, як використовувати `kubeadm kubeconfig user` для генерації файлів kubeconfig для додаткових користувачів, див. [Генерація файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
{{< /warning >}}

Збережіть команду `kubeadm join`, яку виводить `kubeadm init`. Ця команда знадобиться вам для [приєднання вузлів до кластера](#join-nodes).

Токен використовується для взаємної автентифікації між вузлом панелі управління та вузлами, що приєднуються. Наведений тут токен є секретним. Зберігайте його в безпеці, бо будь-хто з цим токеном може додавати автентифіковані вузли до вашого кластера. Ці токени можна переглядати, створювати й видаляти командою `kubeadm token`. Див. [довідковий посібник kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Встановлення мережевої надбудови для Podʼів {#pod-network}

{{< caution >}}
Цей розділ містить важливу інформацію про налаштування мережі та порядок розгортання. Уважно прочитайте всі ці поради, перш ніж продовжити.

**Потрібно розгорнути мережеву надбудову для Podʼів на основі {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}} (CNI), щоб ваші Podʼи могли взаємодіяти між собою. DNS кластера (CoreDNS) не запуститься, доки не буде встановлено мережу.**

- Стежте, щоб ваша мережа Podʼів не перетиналася з жодною з мереж хоста: якщо є будь-яке перетинання, імовірно, виникнуть проблеми. (Якщо ви виявили конфлікт між бажаною мережею Podʼів вашого мережевого втулка та деякими мережами хоста, слід натомість вибрати відповідний блок CIDR, а потім використати його під час `kubeadm init` з `--pod-network-cidr` і як заміну в YAML вашого мережевого втулка).

- Стандартно `kubeadm` налаштовує кластер на використання та примусове застосування [RBAC](/docs/reference/access-authn-authz/rbac/) (керування доступом на основі ролей). Переконайтеся, що ваш мережевий втулок для Podʼів підтримує RBAC, як і будь-які маніфести, які ви використовуєте для його розгортання.

- Якщо ви хочете використовувати у своєму кластері IPv6 — з подвійним стеком або лише одностекову мережу IPv6, — переконайтеся, що ваш мережевий втулок для Podʼів підтримує IPv6. Підтримку IPv6 додано до CNI у [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm має бути незалежним від CNI, а перевірка постачальників CNI виходить за межі нашого поточного e2e-тестування. Якщо ви виявили проблему, повʼязану з втулком CNI, створіть тікет у системі відстеження проблем цього втулка, а не в системах відстеження проблем kubeadm чи Kubernetes.
{{< /note >}}

Кілька зовнішніх проєктів надають мережі для Podʼів Kubernetes на основі CNI, і деякі з них також підтримують [мережеві політики](/docs/concepts/services-networking/network-policies/).

Див. список надбудов, які реалізують [мережеву модель Kubernetes](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

Неповний список мережевих надбудов, які підтримує Kubernetes, див. на сторінці [Встановлення надбудов](/docs/concepts/cluster-administration/addons/#networking-and-network-policy). Мережеву надбудову для Podʼів можна встановити такою командою на вузлі панелі управління або на вузлі, що має облікові дані kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Лише кілька втулків CNI підтримують Windows. Докладніше й інструкції з налаштування див. у [Додавання робочих вузлів Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

Можна встановити лише одну мережу для Podʼів на кластер.

Після встановлення мережі для Podʼів можна переконатися, що вона працює, перевіривши, що Pod CoreDNS має стан `Running` у виводі `kubectl get pods --all-namespaces`. А коли Pod CoreDNS запущено й він працює, можна продовжити, приєднавши вузли.

Якщо мережа не працює або CoreDNS не перебуває в стані `Running`, перегляньте [посібник з усунення несправностей](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) для `kubeadm`.

### Керовані мітки вузлів {#managed-node-labels}

Стандартно kubeadm вмикає контролер допуску [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction), який обмежує, які мітки kubelet може самостійно застосовувати під час реєстрації вузла. Документація контролера допуску описує, які мітки дозволено використовувати з параметром kubelet `--node-labels`.

{{< caution >}}
Через контролер допуску `NodeRestriction` ви **не можете** використовувати прапорець kubelet `--node-labels` для застосування обмежених міток (як-от `node-role.kubernetes.io/*`) під час ініціалізації.

Якщо ви спробуєте додати обмежені мітки за допомогою цього прапорця kubelet, вузол не зможе зареєструватися в API-сервері.
{{< /caution >}}

Щоб застосувати ці мітки вручну, використайте `kubectl label` після приєднання вузла до кластера. Переконайтеся, що ви використовуєте привілейований kubeconfig, як-от `/etc/kubernetes/admin.conf`, яким керує kubeadm.

### Ізоляція вузла панелі управління {#control-plane-node-isolation}

Стандартно з міркувань безпеки кластер не розміщує Podʼи на вузлах панелі управління. Якщо ви хочете мати змогу розміщувати Podʼи на вузлах панелі управління, наприклад, для кластера Kubernetes з однієї машини, виконайте:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Вивід буде схожим на:

```
node "test-01" untainted
...
```

Це прибере taint `node-role.kubernetes.io/control-plane:NoSchedule` з усіх вузлів, які його мають, зокрема з вузлів панелі управління, тобто планувальник зможе розміщувати Podʼи будь-де.

Крім того, можна виконати таку команду, щоб прибрати з вузла панелі управління мітку [`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers), яка виключає його зі списку бекенд-серверів:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Додавання додаткових вузлів панелі управління {#adding-more-control-plane-nodes}

Кроки зі створення високодоступного кластера kubeadm шляхом додавання вузлів панелі управління див. у [Створення високодоступних кластерів за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Додавання робочих вузлів {#join-nodes}

Робочі вузли — це місце, де запускаються ваші робочі навантаження.

На наступних сторінках показано, як додати до кластера робочі вузли Linux і Windows за допомогою команди `kubeadm join`:

- [Додавання робочих вузлів Linux](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
- [Додавання робочих вузлів Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Необовʼязково) Керування кластером з машин, відмінних від вузла панелі управління {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

Щоб kubectl на іншому компʼютері (наприклад, ноутбуці) міг взаємодіяти з вашим кластером, скопіюйте файл kubeconfig адміністратора з вузла панелі управління на свою робочу станцію так:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
У наведеному вище прикладі передбачено, що доступ SSH для root увімкнено. Якщо це не так, можна скопіювати файл `admin.conf` так, щоб він був доступний іншому користувачу, і виконати `scp` від імені цього користувача.

Файл `admin.conf` надає користувачу привілеї _суперкористувача_ в кластері. Цей файл слід використовувати обачно. Для звичайних користувачів рекомендовано генерувати унікальні облікові дані, яким ви надаєте привілеї. Це можна зробити командою `kubeadm kubeconfig user --client-name <CN>`. Ця команда виведе в STDOUT файл KubeConfig, який слід зберегти у файл і передати користувачу. Після цього надайте привілеї за допомогою `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Необовʼязково) Проксіювання API-сервера на localhost {#optional-proxying-api-server-to-localhost}

Якщо ви хочете підʼєднатися до API-сервера ззовні кластера, можна використати `kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Тепер ви можете звертатися до API-сервера локально за адресою `http://localhost:8001/api/v1`

## Очищення {#tear-down}

Якщо для кластера ви використовували одноразові сервери для тестування, можна просто вимкнути їх і нічого більше не очищати. Щоб видалити локальні посилання на кластер, можна використати `kubectl config delete-cluster`.

Однак, якщо ви хочете ретельніше вивести кластер з експлуатації, спочатку слід [виконати drain вузла](/docs/reference/generated/kubectl/kubectl-commands#drain) і переконатися, що вузол порожній, а потім зняти конфігурацію з вузла.

### Видалення вузла {#remove-the-node}

Звертаючись до вузла панелі управління з відповідними обліковими даними, виконайте:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Перед видаленням вузла скиньте стан, встановлений за допомогою `kubeadm`:

```bash
kubeadm reset
```

Процес скидання не скидає й не очищає правила iptables чи таблиці IPVS. Якщо ви хочете скинути iptables, це потрібно зробити вручну:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Якщо ви хочете скинути таблиці IPVS, виконайте таку команду:

```bash
ipvsadm -C
```

Тепер видаліть вузол:

```bash
kubectl delete node <node name>
```

Якщо ви хочете почати все спочатку, виконайте `kubeadm init` або `kubeadm join` з відповідними аргументами.

### Очищення панелі управління {#clean-up-the-control-plane}

Ви можете використати `kubeadm reset` на хості панелі управління, щоб запустити очищення в міру можливостей (best-effort).

Докладніше про цю підкоманду та її параметри див. у довідковій документації [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).

## Політика розбіжності версій {#version-skew-policy}

Хоча kubeadm допускає розбіжність версій з деякими компонентами, якими він керує, рекомендовано, щоб версія kubeadm збігалася з версіями компонентів панелі управління, kube-proxy і kubelet.

### Розбіжність версії kubeadm з версією Kubernetes {#kubeadm-s-skew-against-the-kubernetes-version}

kubeadm можна використовувати з компонентами Kubernetes тієї самої версії, що й kubeadm, або на одну версію старішими. Версію Kubernetes можна вказати kubeadm за допомогою прапорця `--kubernetes-version` команди `kubeadm init` або поля [`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/) під час використання `--config`. Цей параметр керуватиме версіями kube-apiserver, kube-controller-manager, kube-scheduler і kube-proxy.

Приклад:

- kubeadm має версію {{< skew currentVersion >}}
- `kubernetesVersion` має бути {{< skew currentVersion >}} або {{< skew currentVersionAddMinor -1 >}}

### Розбіжність версії kubeadm з версією kubelet {#kubeadm-s-skew-against-the-kubelet}

Як і з версією Kubernetes, kubeadm можна використовувати з kubelet тієї самої версії, що й kubeadm, або на три версії старішим.

Приклад:

- kubeadm має версію {{< skew currentVersion >}}
- kubelet на хості повинен мати версію {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}}, {{< skew currentVersionAddMinor -2 >}} або {{< skew currentVersionAddMinor -3 >}}

### Розбіжність між версіями kubeadm {#kubeadm-s-skew-against-kubeadm}

Є певні обмеження щодо того, як команди kubeadm можуть працювати з наявними вузлами або цілими кластерами, якими керує kubeadm.

Якщо до кластера приєднуються нові вузли, бінарний файл kubeadm, який використовується для `kubeadm join`, має відповідати останній версії kubeadm, що використовувалася або для створення кластера за допомогою `kubeadm init`, або для оновлення того самого вузла за допомогою `kubeadm upgrade`. Подібні правила стосуються решти команд kubeadm, за винятком `kubeadm upgrade`.

Приклад для `kubeadm join`:

- версія kubeadm {{< skew currentVersion >}} використовувалася для створення кластера за допомогою `kubeadm init`
- Вузли, що приєднуються, мають використовувати бінарний файл kubeadm версії {{< skew currentVersion >}}

Вузли, які оновлюються, мають використовувати версію kubeadm тієї самої MINOR-версії або на одну MINOR-версію новішу, ніж версія kubeadm, що використовувалася для керування вузлом.

Приклад для `kubeadm upgrade`:

- версія kubeadm {{< skew currentVersionAddMinor -1 >}} використовувалася для створення або оновлення вузла
- Версія kubeadm, яка використовується для оновлення вузла, має бути {{< skew currentVersionAddMinor -1 >}} або {{< skew currentVersion >}}

Докладніше про версійну розбіжність між різними компонентами Kubernetes див. [Політика версійної розбіжності](/releases/version-skew-policy/).

## Обмеження {#limitations}

### Стійкість кластера {#resilience}

Створений тут кластер має один вузол панелі управління, на якому працює одна база даних etcd. Це означає, що в разі відмови вузла панелі управління ваш кластер може втратити дані, і його, можливо, доведеться створювати заново з нуля.

Обхідні шляхи:

- Регулярно [створюйте резервні копії etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). Тека даних etcd, яку налаштовує kubeadm, розташована в `/var/lib/etcd` на вузлі панелі управління.

- Використовуйте кілька вузлів панелі управління. Прочитайте [Варіанти топології високої доступності](/docs/setup/production-environment/tools/kubeadm/ha-topology/), щоб вибрати топологію кластера, яка забезпечує [високу доступність](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Сумісність із платформами {#multi-platform}

Пакунки deb/rpm і бінарні файли kubeadm збираються для amd64, arm (32-біт), arm64, ppc64le та s390x відповідно до [пропозиції щодо багатоплатформності](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Багатоплатформні образи контейнерів для панелі управління та надбудов також підтримуються починаючи з v1.12.

Лише деякі постачальники мережі пропонують рішення для всіх платформ. Щоб дізнатися, чи підтримує постачальник вибрану вами платформу, зверніться до наведеного вище списку постачальників мережі або до документації кожного постачальника.

## Усунення несправностей {#troubleshooting}

Якщо у вас виникають труднощі з kubeadm, зверніться до нашої [документації з усунення несправностей](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

<!-- discussion -->

## {{% heading "whatsnext" %}} {#what-s-next}

- Перевірте, що ваш кластер працює належним чином, за допомогою [Sonobuoy](https://github.com/heptio/sonobuoy)
- <a id="lifecycle" />Докладніше про оновлення кластера за допомогою `kubeadm` див. [Оновлення кластерів з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
- Дізнайтеся про розширене використання `kubeadm` у [довідковій документації kubeadm](/docs/reference/setup-tools/kubeadm/)
- Дізнайтеся більше про [концепції](/docs/concepts/) Kubernetes і [`kubectl`](/docs/reference/kubectl/).
- Більший список мережевих надбудов для Podʼів див. на сторінці [Мережа в кластері](/docs/concepts/cluster-administration/networking/).
- <a id="other-addons" />Перегляньте [список надбудов](/docs/concepts/cluster-administration/addons/), щоб ознайомитися з іншими надбудовами, зокрема інструментами для логування, моніторингу, мережевих політик, візуалізації та керування вашим кластером Kubernetes.
- Налаштуйте, як ваш кластер обробляє логи подій кластера та застосунків, що працюють у Podʼах. Огляд того, що для цього потрібно, див. в [Архітектура логування](/docs/concepts/cluster-administration/logging/).

### Зворотний звʼязок {#feedback}

- Щоб повідомити про помилки, відвідайте [систему відстеження проблем kubeadm на GitHub](https://github.com/kubernetes/kubeadm/issues)
- Для отримання підтримки відвідайте канал Slack [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
- Загальний канал розробки SIG Cluster Lifecycle в Slack: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [Інформація про SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/main/sig-cluster-lifecycle#readme)
- Розсилка SIG Cluster Lifecycle: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
