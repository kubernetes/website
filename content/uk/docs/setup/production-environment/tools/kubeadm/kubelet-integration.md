---
title: Налаштування кожного kubelet у кластері за допомогою kubeadm
content_type: concept
weight: 80
---

<!-- Overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Життєвий цикл інструменту командного рядка kubeadm відокремлений від [kubelet](/docs/reference/command-line-tools-reference/kubelet), який є демоном, що працює на кожному вузлі кластера Kubernetes. Інструмент командного рядка kubeadm запускає користувач під час ініціалізації або оновлення Kubernetes, тоді як kubelet завжди працює у фоновому режимі.

Оскільки kubelet — це демон, ним має керувати певна система ініціалізації або менеджер сервісів. Коли kubelet встановлено з пакунків DEB або RPM, systemd налаштовується для керування kubelet. Натомість ви можете використати інший менеджер сервісів, але його потрібно налаштувати вручну.

Деякі параметри конфігурації kubelet мають бути однаковими для всіх kubelet у кластері, тоді як інші аспекти конфігурації потрібно задавати для кожного kubelet окремо з урахуванням характеристик конкретної машини (як-от ОС, сховище та мережа). Ви можете керувати конфігурацією kubelet вручну, але тепер kubeadm надає тип API `KubeletConfiguration` для [централізованого керування конфігураціями kubelet](#configure-kubelets-using-kubeadm).

<!-- body -->

## Шаблони конфігурації kubelet {#kubelet-configuration-patterns}

У наступних розділах описано шаблони конфігурації kubelet, які спрощуються за допомогою kubeadm, замість керування конфігурацією kubelet для кожного вузла вручну.

### Поширення конфігурації на рівні кластера для кожного kubelet {#propagating-cluster-level-configuration-to-each-kubelet}

Ви можете надати kubelet стандартні значення, які використовуватимуть команди `kubeadm init` та `kubeadm join`. Цікаві приклади — використання іншого середовища виконання контейнерів або встановлення стандартної підмережі для Service.

Якщо ви хочете, щоб ваші Service стандартно використовували підмережу `10.96.0.0/12`, ви можете передати kubeadm параметр `--service-cidr`:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Віртуальні IP-адреси для Service тепер виділяються з цієї підмережі. Вам також потрібно задати адресу DNS, яку використовує kubelet, за допомогою прапорця `--cluster-dns`. Це налаштування має бути однаковим для кожного kubelet на кожному вузлі панелі управління та кожному вузлі в кластері. Kubelet надає версійований структурований обʼєкт API, який може налаштовувати більшість параметрів kubelet і розсилати цю конфігурацію кожному запущеному kubelet у кластері. Цей обʼєкт називається [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/). `KubeletConfiguration` дає змогу користувачу задавати прапорці, як-от IP-адреси DNS кластера, у вигляді списку значень для ключа в camelCase, як показано в цьому прикладі:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Докладніше про `KubeletConfiguration` можна знайти у [цьому розділі](#configure-kubelets-using-kubeadm).

### Надання конфігурації, специфічної для екземпляра {#providing-instance-specific-configuration-details}

Деяким хостам потрібні специфічні конфігурації kubelet через відмінності в апаратному забезпеченні, операційній системі, мережі чи інших параметрах, специфічних для хоста. Нижче наведено кілька прикладів.

- Шлях до файлу розпізнавання DNS, як вказано прапорцем конфігурації kubelet `--resolv-conf`, може відрізнятися залежно від операційної системи або від того, чи використовується `systemd-resolved`. Якщо цей шлях вказано неправильно, розпізнавання DNS буде невдалим на вузлі, конфігурація kubelet якого налаштована неправильно.

- `.metadata.name` обʼєкта API Node стандартно дорівнює імені хоста машини, якщо ви не використовуєте хмарного провайдера. Ви можете використати прапорець `--hostname-override`, щоб змінити стандартну поведінку, якщо потрібно задати імʼя вузла, відмінне від імені хоста машини.

- Зараз kubelet не може автоматично виявити драйвер cgroup, який використовується середовищем виконання контейнерів, але значення `--cgroup-driver` повинно відповідати драйверу cgroup, який використовується середовищем виконання контейнерів, щоб забезпечити нормальну роботу kubelet.

- Щоб вказати середовище виконання контейнерів, потрібно задати його точку доступу за допомогою прапорця `--container-runtime-endpoint=<path>`.

Рекомендований спосіб застосування такої конфігурації, специфічної для екземпляра, — використовувати [патчі для KubeletConfiguration](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Налаштування kubelet за допомогою kubeadm {#configure-kubelets-using-kubeadm}

Можна налаштувати kubelet, який запускатиме kubeadm, якщо передати власний обʼєкт API [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) у файлі конфігурації, наприклад, так: `kubeadm ... --config some-config-file.yaml`.

Виконавши `kubeadm config print init-defaults --component-configs KubeletConfiguration`, ви можете переглянути всі стандартні значення для цієї структури.

Також можна застосовувати специфічні для екземпляра патчі поверх базового `KubeletConfiguration`. Докладніше див. [Налаштування kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet).

### Послідовність дій під час використання `kubeadm init` {#workflow-when-using-kubeadm-init}

Коли ви викликаєте `kubeadm init`, конфігурація kubelet записується на диск у `/var/lib/kubelet/config.yaml` і також завантажується в ConfigMap `kubelet-config` у просторі імен `kube-system` кластера. Крім того, інструмент kubeadm виявляє сокет CRI на вузлі та записує його дані (зокрема шлях до сокета) у локальну конфігурацію `/var/lib/kubelet/instance-config.yaml`. Файл конфігурації kubelet також записується в `/etc/kubernetes/kubelet.conf` з базовою конфігурацією для всіх kubelet у кластері. Цей файл конфігурації вказує на клієнтські сертифікати, які дають змогу kubelet взаємодіяти з API-сервером. Так вирішується потреба в [поширенні конфігурації рівня кластера на кожен kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Щоб реалізувати другий шаблон, [надання конфігурації, специфічної для екземпляра](#providing-instance-specific-configuration-details), kubeadm записує файл середовища в `/var/lib/kubelet/kubeadm-flags.env`, який містить список прапорців, що передаються kubelet під час запуску. У файлі прапорці виглядають так:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Крім прапорців, які використовуються під час запуску kubelet, файл також містить динамічні параметри, такі як драйвер cgroup.

Після запису цих двох файлів на диск kubeadm намагається виконати такі дві команди, якщо ви використовуєте systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Якщо перезавантаження та перезапуск вдалися, продовжується звичайний робочий процес `kubeadm init`.

### Послідовність дій під час використання `kubeadm join` {#workflow-when-using-kubeadm-join}

Коли ви запускаєте `kubeadm join`, kubeadm використовує облікові дані Bootstrap Token для виконання TLS bootstrap, який отримує облікові дані, потрібні для завантаження ConfigMap `kubelet-config`, і записує її в `/var/lib/kubelet/config.yaml`. Крім того, інструмент kubeadm виявляє сокет CRI на вузлі та записує його дані (зокрема шлях до сокета) у локальну конфігурацію `/var/lib/kubelet/instance-config.yaml`. Динамічний файл середовища генерується точно так само, як і для `kubeadm init`.

Далі `kubeadm` виконує такі дві команди, щоб завантажити нову конфігурацію в kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Після того як kubelet завантажить нову конфігурацію, kubeadm записує файл KubeConfig `/etc/kubernetes/bootstrap-kubelet.conf`, який містить сертифікат CA та Bootstrap Token. Їх використовує kubelet для виконання TLS Bootstrap і отримання унікальних облікових даних, які зберігаються в `/etc/kubernetes/kubelet.conf`.

Коли файл `/etc/kubernetes/kubelet.conf` записаний, kubelet завершує виконання TLS Bootstrap. Kubeadm видаляє файл `/etc/kubernetes/bootstrap-kubelet.conf` після завершення TLS Bootstrap.

## Файл kubelet drop-in для systemd {#the-kubelet-drop-in-file-for-systemd}

`kubeadm` постачається з конфігурацією systemd для запуску kubelet. Зверніть увагу, що команда kubeadm CLI ніколи не торкається цього drop-in файлу.

Цей файл конфігурації, встановлений за допомогою [пакунка](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) `kubeadm`, записується в `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` та використовується systemd. Він доповнює основний [`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

Якщо ви хочете перевизначити це ще більше, ви можете створити теку `/etc/systemd/system/kubelet.service.d/` (не `/usr/lib/systemd/system/kubelet.service.d/`) і помістити туди файл із власними налаштуваннями. Наприклад, ви можете додати новий локальний файл `/etc/systemd/system/kubelet.service.d/local-overrides.conf`, щоб перевизначити налаштування юніта, задані `kubeadm`.

Ось що ви, імовірно, знайдете в `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
Наведений нижче вміст — це лише приклад. Якщо ви не хочете використовувати менеджер пакунків, дотримуйтеся інструкцій з розділу ([Без менеджера пакунків](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)).
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# Це файл, який "kubeadm init" та "kubeadm join" генерують в режимі виконання, заповнюючи
# змінну KUBELET_KUBEADM_ARGS динамічно
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# Це файл, який користувач може використовувати для заміщення аргументів kubelet як крайній засіб. В ідеалі,
# користувач має натомість використовувати обʼєкт .NodeRegistration.KubeletExtraArgs у файлах конфігурації.
# KUBELET_EXTRA_ARGS має братися з цього файлу.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Цей файл визначає стандартні розташування всіх файлів, якими kubeadm керує для kubelet.

- Файл KubeConfig для TLS Bootstrap — `/etc/kubernetes/bootstrap-kubelet.conf`, але він використовується тільки у випадку, якщо `/etc/kubernetes/kubelet.conf` не існує.
- Файл KubeConfig з унікальними ідентифікаційними даними kubelet — `/etc/kubernetes/kubelet.conf`.
- Файл, що містить ComponentConfig kubelet — `/var/lib/kubelet/config.yaml`.
- Динамічний файл середовища, що містить `KUBELET_KUBEADM_ARGS`, підключається з `/var/lib/kubelet/kubeadm-flags.env`.
- Файл, що може містити перевизначення прапорців, вказаних користувачем за допомогою `KUBELET_EXTRA_ARGS`, береться з `/etc/default/kubelet` (для DEB) або `/etc/sysconfig/kubelet` (для RPM). `KUBELET_EXTRA_ARGS` останній в ланцюжку прапорців та має найвищий пріоритет у випадку конфлікту налаштувань.

## Бінарні файли Kubernetes та вміст пакунків {#kubernetes-binaries-and-package-contents}

DEB та RPM-пакети, які постачаються з випусками Kubernetes:

| Назва пакунка | Опис |
|--------------|-------------|
| `kubeadm`    | Встановлює інструмент командного рядка `/usr/bin/kubeadm` та [файл drop-in для kubelet](#the-kubelet-drop-in-file-for-systemd) для kubelet. |
| `kubelet`    | Встановлює виконавчий файл `/usr/bin/kubelet`. |
| `kubectl`    | Встановлює виконавчий файл `/usr/bin/kubectl`. |
| `cri-tools` | Встановлює виконавчий файл `/usr/bin/crictl` з [репозиторію git cri-tools](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Встановлює бінарні файли `/opt/cni/bin` з [репозиторію git plugins](https://github.com/containernetworking/plugins). |
