---
title: Керівництво користувача агента маскування IP
content_type: task
weight: 230
---

<!-- overview -->

Ця сторінка показує, як налаштувати та ввімкнути `ip-masq-agent`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- discussion -->

## Керівництво користувача агента маскування IP {#ip-masquerade-agent-user-guide}

`ip-masq-agent` налаштовує правила iptables для приховування IP-адреси Podʼа за IP-адресою вузла кластера. Це зазвичай робиться, коли трафік надсилається до пунктів призначення за межами діапазону [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) Podʼів кластера.

### Основні терміни {#key-terms}

* **NAT (Network Address Translation)**:
  Це метод переназначення однієї IP-адреси на іншу шляхом модифікації інформації адреси відправника та/або одержувача у заголовку IP. Зазвичай виконується пристроєм, що здійснює маршрутизацію IP.
* **Маскування (Masquerading)**:
  Форма NAT, яка зазвичай використовується для здійснення трансляції багатьох адрес в одну, де декілька початкових IP-адрес маскуються за однією адресою, яка зазвичай є адресою пристрою, що виконує маршрутизацію. У Kubernetes це IP-адреса вузла.
* **CIDR (Classless Inter-Domain Routing)**:
  Заснований на маскуванні підмереж змінної довжини, дозволяє вказувати префікси довільної довжини. CIDR ввів новий метод представлення IP-адрес, тепер відомий як **нотація CIDR**, у якій адреса або маршрутизаційний префікс записується з суфіксом, що вказує кількість бітів префікса, наприклад 192.168.2.0/24.
* **Локальне посилання**:
  Локальна адреса посилання — це мережева адреса, яка є дійсною лише для комунікацій у межах сегмента мережі або домену розсилки, до якого підʼєднано хост. Локальні адреси для IPv4 визначені в блоку адрес 169.254.0.0/16 у нотації CIDR.

`ip-masq-agent` налаштовує правила iptables для обробки маскування IP-адрес вузлів/Podʼів при надсиланні трафіку до пунктів призначення за межами IP вузла кластера та діапазону IP кластера. Це по суті приховує IP-адреси Podʼів за IP-адресою вузла кластера. У деяких середовищах, трафік до "зовнішніх" адрес має походити з відомої адреси машини. Наприклад, у Google Cloud будь-який трафік до Інтернету має виходити з IP VM. Коли використовуються контейнери, як у Google Kubernetes Engine, IP Podʼа не буде мати виходу. Щоб уникнути цього, ми повинні приховати IP Podʼа за IP адресою VM — зазвичай відомою як "маскування". Типово агент налаштований так, що три приватні IP-діапазони, визначені [RFC 1918](https://tools.ietf.org/html/rfc1918), не вважаються діапазонами маскування [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). Ці діапазони — `10.0.0.0/8`, `172.16.0.0/12` і `192.168.0.0/16`. Агент також типово вважає локальне посилання (169.254.0.0/16) CIDR не-маскуванням. Агент налаштований на перезавантаження своєї конфігурації з розташування */etc/config/ip-masq-agent* кожні 60 секунд, що також можна налаштувати.

![приклад маскування/немаскування](/images/docs/ip-masq.png)

Файл конфігурації агента повинен бути написаний у синтаксисі YAML або JSON і може містити три необовʼязкові ключі:

* `nonMasqueradeCIDRs`: Список рядків у форматі [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing), які визначають діапазони без маскування.
* `masqLinkLocal`: Булеве значення (true/false), яке вказує, чи маскувати трафік до локального префіксу `169.254.0.0/16`. Типово — false.
* `resyncInterval`: Інтервал часу, через який агент намагається перезавантажити конфігурацію з диска. Наприклад: '30s', де 's' означає секунди, 'ms' — мілісекунди.

Трафік до діапазонів 10.0.0.0/8, 172.16.0.0/12 і 192.168.0.0/16 НЕ буде маскуватися. Будь-який інший трафік (вважається Інтернетом) буде маскуватися. Прикладом локального пункту призначення з Podʼа може бути IP-адреса його вузла, а також адреса іншого вузла або одна з IP-адрес у діапазоні IP кластера. Будь-який інший трафік буде стандартно маскуватися. Нижче наведено стандартний набір правил, які застосовує агент ip-masq:

```shell
iptables -t nat -L IP-MASQ-AGENT
```

```none
target     prot opt source               destination
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: клієнтський трафік в межах кластера не повинен піддаватися маскуванню */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: клієнтський трафік в межах кластера не повинен піддаватися маскуванню */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             172.16.0.0/12        /* ip-masq-agent: клієнтський трафік в межах кластера не повинен піддаватися маскуванню */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             192.168.0.0/16       /* ip-masq-agent: клієнтський трафік в межах кластера не повинен піддаватися маскуванню */ ADDRTYPE match dst-type !LOCAL
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: вихідний трафік повинен піддаватися маскуванню (ця відповідність повинна бути після відповідності клієнтським CIDR у межах кластера) */ ADDRTYPE match dst-type !LOCAL

```

Стандартно, в середовищі GCE/Google Kubernetes Engine, якщо ввімкнуто мережеву політику або ви використовуєте CIDR кластера не в діапазоні 10.0.0.0/8, агент `ip-masq-agent` буде запущений у вашому кластері. Якщо ви працюєте в іншому середовищі, ви можете додати [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) `ip-masq-agent` до свого кластера.

<!-- steps -->

## Створення агента маскування IP {#create-an-ip-masq-agent}

Щоб створити агента маскування IP, виконайте наступну команду kubectl:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/ip-masq-agent/master/ip-masq-agent.yaml
```

Також вам потрібно застосувати відповідну мітку вузла на будь-яких вузлах вашого кластера, на яких ви хочете запустити агента.

```shell
kubectl label nodes my-node node.kubernetes.io/masq-agent-ds-ready=true
```

Додаткову інформацію можна знайти в документації агента маскування IP [тут](https://github.com/kubernetes-sigs/ip-masq-agent).

У більшості випадків стандартний набір правил має бути достатнім; однак, якщо це не так для вашого кластера, ви можете створити та застосувати [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/), щоб налаштувати діапазони IP-адрес, що залучаються. Наприклад, щоб дозволити розгляд тільки діапазону 10.0.0.0/8 ip-masq-agent, ви можете створити наступний [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) у файлі з назвою "config".

{{< note >}}
Важливо, що файл називається config, оскільки стандартно це буде використано як ключ для пошуку агентом `ip-masq-agent`:

```yaml
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
```

{{< /note >}}

Виконайте наступну команду, щоб додати configmap до вашого кластера:

```shell
kubectl create configmap ip-masq-agent --from-file=config --namespace=kube-system
```

Це оновить файл, розташований у `/etc/config/ip-masq-agent`, який періодично перевіряється кожен `resyncInterval` та застосовується до вузла кластера. Після закінчення інтервалу синхронізації ви повинні побачити, що правила iptables відображають ваші зміни:

```shell
iptables -t nat -L IP-MASQ-AGENT
```

```none
Chain IP-MASQ-AGENT (1 references)
target     prot opt source               destination
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: outbound traffic should be subject to MASQUERADE (this match must come after cluster-local CIDR matches) */ ADDRTYPE match dst-type !LOCAL
```

Стандартно, діапазон локальних посилань (169.254.0.0/16) також обробляється агентом ip-masq, який налаштовує відповідні правила iptables. Щоб агент ip-masq ігнорував локальні посилання, ви можете встановити `masqLinkLocal` як true у ConfigMap.

```yaml
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
masqLinkLocal: true
```
