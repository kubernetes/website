---
title: Создание кластера с помощью kubeadm
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
С помощью `kubeadm` можно создать минимальный работоспособный кластер Kubernetes,
соответствующий рекомендациям. Более того, такой кластер может пройти
[тесты соответствия Kubernetes](/blog/2017/10/software-conformance-certification/).
`kubeadm` также поддерживает другие функции жизненного цикла кластера, например
[токены начальной загрузки](/docs/reference/access-authn-authz/bootstrap-tokens/) и обновления кластера.

Инструмент `kubeadm` подходит, если вам нужен:

- Простой способ попробовать Kubernetes, возможно впервые.
- Способ автоматизировать создание кластера и тестирование приложения для существующих пользователей.
- Строительный блок для других инструментов экосистемы или установки с более широкой областью применения.

Установить и использовать `kubeadm` можно на разных машинах: ноутбуке, группе облачных серверов,
Raspberry Pi и других. При развёртывании в облаке или на собственной инфраструктуре
`kubeadm` можно интегрировать в системы подготовки инфраструктуры, такие как Ansible или Terraform.

## {{% heading "prerequisites" %}}

Для выполнения этого руководства необходимы:

- Одна или несколько машин с ОС Linux, совместимой с deb/rpm, например Ubuntu или CentOS.
- Не менее 2 ГиБ оперативной памяти на машину — при меньшем объёме приложениям останется мало памяти.
- Не менее 2 CPU на машине, используемой в качестве узла управляющего слоя.
- Полная сетевая связность между всеми машинами кластера. Подходит как общедоступная, так и частная сеть.

Также нужна версия `kubeadm`, способная развернуть выбранную для нового кластера версию Kubernetes.

[Политика поддержки версий и совместимости версий Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions)
применяется как к `kubeadm`, так и к Kubernetes в целом. Ознакомьтесь с ней, чтобы узнать,
какие версии Kubernetes и `kubeadm` поддерживаются. Эта страница относится к Kubernetes {{< param "version" >}}.

В целом инструмент `kubeadm` имеет статус общедоступности (General Availability, GA).
Некоторые отдельные возможности ещё активно разрабатываются. Реализация создания кластера
может немного меняться по мере развития инструмента, но в целом должна оставаться стабильной.

{{< note >}}
Все команды `kubeadm alpha` по определению поддерживаются на уровне альфа.
{{< /note >}}

<!-- steps -->

## Цели {#objectives}

* Установить кластер Kubernetes с одним узлом управляющего слоя.
* Установить сеть подов в кластере, чтобы поды могли взаимодействовать друг с другом.

## Инструкции {#instructions}

### Подготовка машин {#preparing-the-hosts}

#### Установка компонентов {#component-installation}

Установите [среду выполнения контейнеров](/docs/setup/production-environment/container-runtimes/)
и kubeadm на всех машинах. Подробные инструкции и другие требования приведены
в разделе [Установка kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Если kubeadm уже установлен, инструкции по его обновлению приведены в первых двух шагах
документа [Обновление узлов Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes).

При обновлении kubelet перезапускается каждые несколько секунд, находясь в цикле сбоев
и ожидая указаний от kubeadm. Это ожидаемое и нормальное поведение.
После инициализации управляющего слоя kubelet работает нормально.
{{< /note >}}

#### Настройка сети {#network-setup}

Как и другие компоненты Kubernetes, kubeadm пытается найти подходящий IP-адрес
на сетевых интерфейсах, связанных со шлюзом по умолчанию на машине.
Этот адрес затем используется компонентом как объявляемый адрес и/или адрес прослушивания.

Чтобы определить этот IP-адрес на машине Linux, выполните:

```shell
ip route show # Look for a line starting with "default via"
```

{{< note >}}
Если на машине два или более шлюза по умолчанию, компонент Kubernetes попытается
использовать первый из найденных, у которого есть подходящий глобальный одноадресный IP-адрес.
Порядок выбора шлюзов может различаться между операционными системами и версиями ядра.
{{< /note >}}

Компоненты Kubernetes не принимают сетевой интерфейс в качестве параметра,
поэтому для нестандартной настройки нужно передать конкретный IP-адрес флагом
каждому экземпляру компонента, которому он требуется.

{{< note >}}
Если у машины нет шлюза по умолчанию и компоненту Kubernetes не передан
конкретный IP-адрес, компонент может завершиться с ошибкой.
{{< /note >}}

Для настройки объявляемого адреса сервера API узлов управляющего слоя, создаваемых
командами `init` и `join`, можно использовать флаг `--apiserver-advertise-address`.
Предпочтительно задавать этот параметр через [API kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4)
в полях `InitConfiguration.localAPIEndpoint` и `JoinConfiguration.controlPlane.localAPIEndpoint`.

Для kubelet на всех узлах параметр `--node-ip` можно передать в
`.nodeRegistration.kubeletExtraArgs` файла конфигурации kubeadm
(`InitConfiguration` или `JoinConfiguration`).

Для двухстековой сети см.
[Поддержка двух стеков с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

IP-адреса, назначаемые компонентам управляющего слоя, входят в поля альтернативных
имён субъекта их сертификатов X.509. Для изменения адресов потребуется подписать
новые сертификаты и перезапустить затронутые компоненты, чтобы они применили изменения файлов сертификатов.
Подробнее см. [Обновление сертификатов вручную](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal).

{{< warning >}}
Проект Kubernetes не рекомендует этот подход — настройку конкретных IP-адресов
для всех экземпляров компонентов. Вместо этого рекомендуется настроить сеть машины так,
чтобы компоненты Kubernetes автоматически обнаруживали и использовали IP-адрес,
соответствующий шлюзу по умолчанию. На узлах Linux для настройки сети можно использовать
команды вроде `ip route`; ОС может также предоставлять инструменты более высокого уровня.
Если IP-адрес шлюза по умолчанию вашего узла общедоступен, настройте фильтрацию пакетов
или другие меры защиты узлов и кластера.
{{< /warning >}}

### Подготовка необходимых образов контейнеров {#preparing-the-required-container-images}

Этот шаг необязателен и нужен только в том случае, если вы не хотите, чтобы `kubeadm init`
и `kubeadm join` скачивали стандартные образы контейнеров с `registry.k8s.io`.

В kubeadm есть команды для предварительной загрузки необходимых образов при создании
кластера, узлы которого не подключены к интернету. Подробнее см.
[Запуск kubeadm без подключения к интернету](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection).

Kubeadm позволяет использовать собственный репозиторий необходимых образов.
Подробнее см. [Использование собственных образов](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images).

### Инициализация узла управляющего слоя {#initializing-your-control-plane-node}

Узел управляющего слоя — машина, на которой работают его компоненты, включая
[etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd/) (базу данных кластера) и
[сервер API](/docs/reference/command-line-tools-reference/kube-apiserver/)
(с которым взаимодействует инструмент командной строки
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}).

1. Рекомендуется: если вы планируете в дальнейшем перевести этот кластер `kubeadm`
   с одним узлом управляющего слоя в режим
   [высокой доступности](/docs/setup/production-environment/tools/kubeadm/high-availability/),
   задайте `--control-plane-endpoint` — общую конечную точку всех узлов управляющего слоя.
   Ею может быть DNS-имя или IP-адрес балансировщика нагрузки.
1. Выберите сетевое дополнение подов и проверьте, нужны ли ему аргументы `kubeadm init`.
   В зависимости от выбранного стороннего поставщика может потребоваться задать
   `--pod-network-cidr` определённое им значение. См. [Установка сетевого дополнения подов](#pod-network).
1. Необязательно: `kubeadm` пытается обнаружить среду выполнения контейнеров по списку
   известных конечных точек. Чтобы использовать другую среду или выбрать одну из нескольких
   установленных на узле, передайте kubeadm аргумент `--cri-socket`.
   См. [Установка среды выполнения](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Для инициализации узла управляющего слоя выполните:

```bash
kubeadm init <args>
```

### Особенности apiserver-advertise-address и ControlPlaneEndpoint {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

`--apiserver-advertise-address` задаёт объявляемый адрес сервера API конкретного узла
управляющего слоя, а `--control-plane-endpoint` задаёт общую конечную точку всех таких узлов.

`--control-plane-endpoint` допускает как IP-адреса, так и DNS-имена, разрешаемые в IP-адреса.
Обратитесь к сетевому администратору для оценки возможных вариантов такого сопоставления.

Пример сопоставления:

```
192.168.0.102 cluster-endpoint
```

Здесь `192.168.0.102` — IP-адрес этого узла, а `cluster-endpoint` — собственное DNS-имя,
соответствующее этому адресу. Это позволяет передать `--control-plane-endpoint=cluster-endpoint`
команде `kubeadm init` и то же DNS-имя команде `kubeadm join`.
Позднее можно изменить `cluster-endpoint`, чтобы он указывал на адрес балансировщика нагрузки
в конфигурации высокой доступности.

kubeadm не поддерживает преобразование кластера с одним узлом управляющего слоя,
созданного без `--control-plane-endpoint`, в кластер высокой доступности.

### Дополнительная информация {#more-information}

Подробнее об аргументах `kubeadm init` см. [справочник kubeadm](/docs/reference/setup-tools/kubeadm/).

О настройке `kubeadm init` через файл конфигурации см.
[Использование kubeadm init с файлом конфигурации](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Для настройки компонентов управляющего слоя, включая необязательное назначение IPv6
пробе жизнеспособности компонентов и сервера etcd, передайте дополнительные аргументы
каждому компоненту, как описано в разделе
[Пользовательские аргументы](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Об изменении конфигурации уже созданного кластера см.
[Перенастройка кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Перед повторным запуском `kubeadm init` необходимо [удалить кластер](#tear-down).

При присоединении узла другой архитектуры убедитесь, что образы контейнеров
развёрнутых DaemonSet поддерживают эту архитектуру.

Сначала `kubeadm init` выполняет предварительные проверки готовности машины к запуску
Kubernetes. Проверки выводят предупреждения и завершают выполнение при ошибках.
Затем `kubeadm init` скачивает и устанавливает компоненты управляющего слоя.
Это может занять несколько минут. После завершения вы увидите:

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

Чтобы kubectl работал для пользователя без прав root, выполните следующие команды,
которые также присутствуют в выводе `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Если вы работаете от имени `root`, вместо этого можно выполнить:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Файл kubeconfig `admin.conf`, создаваемый `kubeadm init`, содержит сертификат с
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Группа `kubeadm:cluster-admins`
связана со встроенной ClusterRole `cluster-admin`. Никому не передавайте файл `admin.conf`.

`kubeadm init` создаёт ещё один файл kubeconfig, `super-admin.conf`, содержащий сертификат с
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` — группа суперпользователей для аварийного доступа, обходящая слой авторизации
(например, RBAC). Никому не передавайте `super-admin.conf`. Рекомендуется переместить его в безопасное место.

О создании файлов kubeconfig для дополнительных пользователей командой `kubeadm kubeconfig user`
см. [Создание файлов kubeconfig для дополнительных пользователей](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
{{< /warning >}}

Сохраните команду `kubeadm join`, выведенную `kubeadm init`.
Она понадобится для [присоединения узлов к кластеру](#join-nodes).

Токен используется для взаимной аутентификации узла управляющего слоя и присоединяющихся узлов.
Этот токен секретный. Храните его в безопасности: любой обладатель токена может добавлять
аутентифицированные узлы в кластер. Просматривать, создавать и удалять токены можно
командой `kubeadm token`. См. [справочник kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Установка сетевого дополнения подов {#pod-network}

{{< caution >}}
Этот раздел содержит важные сведения о настройке сети и порядке развёртывания.
Внимательно прочитайте все рекомендации, прежде чем продолжать.

**Необходимо развернуть сетевое дополнение подов на основе
[Container Network Interface](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (CNI),
чтобы поды могли взаимодействовать друг с другом.
DNS кластера (CoreDNS) не запустится до установки сети.**

- Сеть подов не должна пересекаться с сетями машин: пересечения, скорее всего,
  приведут к проблемам. Если предпочитаемая сеть подов вашего плагина пересекается
  с одной из сетей машин, выберите подходящий блок CIDR и используйте его
  в `kubeadm init` с `--pod-network-cidr`, а также замените соответствующее значение в YAML сетевого плагина.

- По умолчанию `kubeadm` настраивает кластер на обязательное использование
  [RBAC](/docs/reference/access-authn-authz/rbac/) — управления доступом на основе ролей.
  Убедитесь, что сетевой плагин подов и используемые для его развёртывания манифесты поддерживают RBAC.

- Если вы хотите использовать IPv6 — как в двухстековой сети, так и в сети только IPv6, —
  убедитесь, что сетевой плагин подов поддерживает IPv6.
  Поддержка IPv6 появилась в CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm должен быть независим от CNI, а проверка поставщиков CNI не входит в текущие сквозные тесты.
Если вы обнаружили проблему с плагином CNI, создайте обращение в системе отслеживания
ошибок этого плагина, а не kubeadm или kubernetes.
{{< /note >}}

Ряд внешних проектов предоставляет сети подов Kubernetes на основе CNI; некоторые также
поддерживают [Network Policy](/docs/concepts/services-networking/network-policies/).

См. список дополнений, реализующих
[сетевую модель Kubernetes](/ru/docs/concepts/cluster-administration/networking/#реализация-сетевой-модели-kubernetes).

Неполный список сетевых дополнений, поддерживаемых Kubernetes, приведён на странице
[Установка дополнений](/ru/docs/concepts/cluster-administration/addons/#сеть-и-сетевая-политика).
Установить сетевое дополнение подов можно следующей командой на узле управляющего слоя
или узле с учётными данными kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Только некоторые плагины CNI поддерживают Windows. Подробности и инструкции по настройке см.
[Добавление рабочих узлов Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-configuration).
{{< /note >}}

В кластере можно установить только одну сеть подов.

После установки сети подов убедитесь, что она работает: под CoreDNS должен иметь состояние
`Running` в выводе `kubectl get pods --all-namespaces`.
После запуска CoreDNS можно продолжить присоединение узлов.

Если сеть не работает или CoreDNS не находится в состоянии `Running`, обратитесь к
[руководству по устранению неполадок](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) `kubeadm`.

### Управляемые метки узлов {#managed-node-labels}

По умолчанию kubeadm включает контроллер допуска
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction),
ограничивающий метки, которые kubelet может самостоятельно назначать при регистрации узла.
В документации контроллера описано, какие метки разрешены с параметром `--node-labels` kubelet.

{{< caution >}}
Из-за контроллера допуска `NodeRestriction` вы **не можете** использовать флаг
`--node-labels` kubelet для назначения ограниченных меток (например, `node-role.kubernetes.io/*`)
при инициализации.

Попытка добавить такие метки этим флагом приведёт к тому, что узел не сможет
зарегистрироваться на сервере API.
{{< /caution >}}

Для ручного назначения этих меток используйте `kubectl label` после присоединения узла к кластеру.
Используйте привилегированный kubeconfig, например управляемый kubeadm `/etc/kubernetes/admin.conf`.

### Изоляция узлов управляющего слоя {#control-plane-node-isolation}

По умолчанию кластер не размещает поды на узлах управляющего слоя из соображений безопасности.
Чтобы разрешить размещение подов на этих узлах, например в кластере Kubernetes на одной машине, выполните:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Вывод будет примерно следующим:

```
node "test-01" untainted
...
```

Команда удаляет ограничение `node-role.kubernetes.io/control-plane:NoSchedule`
со всех узлов, на которых оно есть, включая узлы управляющего слоя.
После этого планировщик сможет размещать поды на любых узлах.

Дополнительно можно выполнить следующую команду, чтобы удалить с узла управляющего слоя метку
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers),
которая исключает его из списка серверов, обслуживающих запросы балансировщика:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Добавление узлов управляющего слоя {#adding-more-control-plane-nodes}

О создании кластера kubeadm высокой доступности добавлением узлов управляющего слоя см.
[Создание кластеров высокой доступности с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Добавление рабочих узлов {#join-nodes}

На рабочих узлах выполняются ваши рабочие нагрузки.

На следующих страницах описано добавление рабочих узлов Linux и Windows командой `kubeadm join`:

* [Добавление рабочих узлов Linux](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/).
* [Добавление рабочих узлов Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/).

### Управление кластером с других машин (необязательно) {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

Чтобы kubectl на другом компьютере (например, ноутбуке) мог обращаться к кластеру,
скопируйте файл kubeconfig администратора с узла управляющего слоя на рабочую станцию:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
Пример выше предполагает, что SSH-доступ для root включён. Если это не так,
скопируйте `admin.conf` в место, доступное другому пользователю,
и выполните `scp` от его имени.

Файл `admin.conf` предоставляет пользователю права _суперпользователя_ в кластере.
Используйте его лишь при необходимости. Для обычных пользователей рекомендуется создавать
уникальные учётные данные и предоставлять им необходимые права.
Это можно сделать командой `kubeadm kubeconfig user --client-name <CN>`.
Она выводит файл KubeConfig в STDOUT; сохраните его в файл и передайте пользователю.
Затем предоставьте права командой `kubectl create (cluster)rolebinding`.
{{< /note >}}

### Проксирование сервера API на localhost (необязательно) {#optional-proxying-api-server-to-localhost}

Для подключения к серверу API извне кластера можно использовать `kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Теперь сервер API доступен локально по адресу `http://localhost:8001/api/v1`.

## Очистка {#tear-down}

Если для тестирования использовались временные серверы, их можно выключить
без дальнейшей очистки. Удалить локальные ссылки на кластер можно командой
`kubectl config delete-cluster`.

Если вы хотите более тщательно удалить кластер, сначала
[освободите узел](/docs/reference/kubectl/generated/kubectl_drain/),
убедитесь, что он пуст, а затем удалите его конфигурацию.

### Удаление узла {#remove-the-node}

Обращаясь к узлу управляющего слоя с соответствующими учётными данными, выполните:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Перед удалением узла сбросьте состояние, настроенное `kubeadm`:

```bash
kubeadm reset
```

Сброс не очищает правила iptables и таблицы IPVS.
Если требуется сбросить iptables, сделайте это вручную:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Для сброса таблиц IPVS выполните:

```bash
ipvsadm -C
```

Теперь удалите узел:

```bash
kubectl delete node <node name>
```

Чтобы начать заново, выполните `kubeadm init` или `kubeadm join` с подходящими аргументами.

### Очистка управляющего слоя {#clean-up-the-control-plane}

Для очистки управляющего слоя в пределах возможностей инструмента
выполните `kubeadm reset` на соответствующей машине.

Подробнее об этой подкоманде и её параметрах см. справочную документацию
[`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).

## Политика совместимости версий {#version-skew-policy}

Хотя kubeadm допускает расхождение версий с некоторыми управляемыми компонентами,
рекомендуется использовать одинаковые версии kubeadm, компонентов управляющего слоя, kube-proxy и kubelet.

### Совместимость kubeadm с версией Kubernetes {#kubeadms-skew-against-the-kubernetes-version}

kubeadm можно использовать с компонентами Kubernetes той же версии или на одну версию старше.
Версию Kubernetes можно указать флагом `--kubernetes-version` команды `kubeadm init`
или полем [`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
при использовании `--config`. Этот параметр управляет версиями kube-apiserver,
kube-controller-manager, kube-scheduler и kube-proxy.

Пример:

* Версия kubeadm — {{< skew currentVersion >}}.
* `kubernetesVersion` должна быть {{< skew currentVersion >}} или {{< skew currentVersionAddMinor -1 >}}.

### Совместимость kubeadm с kubelet {#kubeadms-skew-against-the-kubelet}

Аналогично версии Kubernetes, kubeadm можно использовать с kubelet той же версии
или до трёх версий старше.

Пример:

* Версия kubeadm — {{< skew currentVersion >}}.
* Версия kubelet на машине должна быть {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} или {{< skew currentVersionAddMinor -3 >}}.

### Совместимость версий kubeadm {#kubeadms-skew-against-kubeadm}

Существуют ограничения на выполнение команд kubeadm для существующих узлов
или целых кластеров, управляемых kubeadm.

При присоединении новых узлов бинарный файл kubeadm для `kubeadm join` должен соответствовать
последней версии kubeadm, использованной для создания кластера командой `kubeadm init`
или обновления этого же узла командой `kubeadm upgrade`. Аналогичные правила действуют
для остальных команд kubeadm, кроме `kubeadm upgrade`.

Пример для `kubeadm join`:

* Кластер создан командой `kubeadm init` версии {{< skew currentVersion >}}.
* Присоединяемые узлы должны использовать kubeadm версии {{< skew currentVersion >}}.

Для обновления узла требуется kubeadm той же минорной версии или на одну минорную
версию новее, чем версия kubeadm, использованная для управления этим узлом.

Пример для `kubeadm upgrade`:

* Для создания или обновления узла использовался kubeadm версии {{< skew currentVersionAddMinor -1 >}}.
* Для обновления узла требуется kubeadm версии {{< skew currentVersionAddMinor -1 >}}
  или {{< skew currentVersion >}}.

Подробнее о совместимости версий компонентов Kubernetes см.
[Политика совместимости версий](/releases/version-skew-policy/).

## Ограничения {#limitations}

### Устойчивость кластера к сбоям {#resilience}

Созданный здесь кластер имеет один узел управляющего слоя с одной базой данных etcd.
Если этот узел выйдет из строя, кластер может потерять данные и потребовать создания с нуля.

Возможные меры:

* Регулярно [создавайте резервные копии etcd](https://etcd.io/docs/v3.5/op-guide/recovery/).
  Каталог данных etcd, настроенный kubeadm, находится в `/var/lib/etcd` на узле управляющего слоя.

* Используйте несколько узлов управляющего слоя. Раздел
  [Варианты топологии высокой доступности](/docs/setup/production-environment/tools/kubeadm/ha-topology/)
  поможет выбрать топологию, обеспечивающую
  [высокую доступность](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Совместимость с платформами {#multi-platform}

Пакеты deb/rpm и бинарные файлы kubeadm собираются для amd64, arm (32-бит), arm64, ppc64le и s390x
согласно [предложению о поддержке нескольких платформ](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Начиная с v1.12 также поддерживаются многоплатформенные образы контейнеров управляющего слоя и дополнений.

Только некоторые поставщики сетевых решений поддерживают все платформы.
Обратитесь к списку выше или документации поставщика, чтобы узнать,
поддерживается ли выбранная вами платформа.

## Устранение неполадок {#troubleshooting}

При возникновении проблем с kubeadm обратитесь к
[документации по устранению неполадок](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

<!-- discussion -->

## {{% heading "whatsnext" %}}

* Проверьте работоспособность кластера с помощью [Sonobuoy](https://github.com/heptio/sonobuoy).
* <a id="lifecycle" />Об обновлении кластера с помощью `kubeadm` см.
  [Обновление кластеров kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
* Изучите расширенные возможности `kubeadm` в [справочной документации kubeadm](/docs/reference/setup-tools/kubeadm/).
* Узнайте больше о [концепциях](/docs/concepts/) Kubernetes и [`kubectl`](/docs/reference/kubectl/).
* Более широкий список сетевых дополнений подов приведён на странице
  [Сеть кластера](/docs/concepts/cluster-administration/networking/).
* <a id="other-addons" />О других дополнениях, включая средства логирования, мониторинга,
  сетевых политик, визуализации и управления кластером Kubernetes, см.
  [список дополнений](/docs/concepts/cluster-administration/addons/).
* Настройте обработку логов событий кластера и приложений, работающих в подах.
  Обзор приведён в разделе [Архитектура логирования](/docs/concepts/cluster-administration/logging/).

### Обратная связь {#feedback}

* Сообщения об ошибках: [система отслеживания ошибок kubeadm на GitHub](https://github.com/kubernetes/kubeadm/issues).
* Поддержка: канал Slack [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/).
* Общий канал разработки SIG Cluster Lifecycle в Slack:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/).
* [Информация о SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/main/sig-cluster-lifecycle#readme).
* Список рассылки SIG Cluster Lifecycle:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle).
