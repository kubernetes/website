---
title: Налаштування кожного kubelet у кластері за допомогою kubeadm
content_type: concept
weight: 80
---

<!-- Overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Життєвий цикл інструменту командного рядка kubeadm не повʼязаний з [kubelet](/docs/reference/command-line-tools-reference/kubelet), який є службою, що працює на кожному вузлі в кластері Kubernetes. Інструмент командного рядка kubeadm запускається користувачем під час ініціалізації або оновлення Kubernetes, тоді як kubelet завжди працює в фоновому режимі.

Оскільки kubelet — це демон, його потрібно обслуговувати за допомогою якоїсь системи ініціалізації або менеджера служб. Коли kubelet встановлено за допомогою DEB або RPM-пакунків, systemd налаштовується для управління kubelet. Ви можете використовувати інший менеджер служб, але його потрібно налаштувати вручну.

Деякі деталі конфігурації kubelet повинні бути однакові для всіх kubelet, які беруть участь в кластері, тоді як інші аспекти конфігурації повинні бути встановлені для кожного kubelet окремо, щоб врахувати різні характеристики кожної машини (такі як ОС, сховище та мережа). Ви можете керувати конфігурацією
kubelet вручну, але тепер kubeadm надає API-тип `KubeletConfiguration` для[централізованого управління конфігураціями kubelet](#configure-kubelets-using-kubeadm).

<!-- body -->

## Шаблони конфігурації kubelet {#kubelet-configuration-patterns}

У наступних розділах описано шаблони конфігурації kubelet, які спрощуються за допомогою kubeadm, замість керування конфігурацією kubelet для кожного вузла вручну.

### Поширення конфігурації на рівні кластера для кожного kubelet {#propagating-cluster-level-configuration-to-each-kubelet}

Ви можете надати kubelet стандартне значення для використання команд `kubeadm init` та `kubeadm join`. Цікаві приклади охоплюють використання іншого середовища виконання контейнерів або встановлення типової підмережі, яку використовують служби.

Якщо ви хочете, щоб ваші служби використовували мережу `10.96.0.0/12`, ви можете передати параметр `--service-cidr` в kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Віртуальні IP-адреси для сервісів тепер виділяються з цієї підмережі. Вам також потрібно встановити адресу DNS, яку використовує kubelet, за допомогою прапорця `--cluster-dns`. Ці налаштування мають бути однаковим для кожного kubelet
на кожному вузлі управління та вузлі в кластері. Kubelet надає структурований, версійований обʼєкт API, який може налаштовувати більшість параметрів в kubelet та розсилати цю конфігурацію кожному працюючому kubelet в кластері. Цей обʼєкт називається [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/). `KubeletConfiguration` дозволяє користувачу вказувати прапорці, такі як IP-адреси DNS кластера, у вигляді списку значень для camelCased ключа, як показано в наступному прикладі:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Докладніше про `KubeletConfiguration` можна знайти у [цьому розділі](#configure-kubelets-using-kubeadm).

### Надання конфігурації, специфічної для екземпляра {#providing-instance-specific-configuration-details}

Деякі хости вимагають специфічних конфігурацій kubelet через різницю в апаратному забезпеченні, операційній системі, мережевій конфігурації чи інших параметрах, специфічних для хосту. У наступному переліку наведено кілька прикладів.

- Шлях до файлу розпізнавання DNS, як вказано прапорцем конфігурації kubelet `--resolv-conf`, може відрізнятися залежно від операційної системи або від того, чи використовується `systemd-resolved`. Якщо цей шлях вказано неправильно, розпізнавання DNS буде невдалим на вузлі, конфігурація kubelet якого налаштована неправильно.

- Обʼєкт API вузла `.metadata.name` типово вказує імʼя хосту машини, якщо ви не використовуєте хмарного постачальника. Ви можете використовувати прапорець `--hostname-override`, щоб змінити типову поведінку, якщо вам потрібно вказати імʼя вузла, відмінне від імені хосту машини.

- Зараз kubelet не може автоматично виявити драйвер cgroup, який використовується середовищем виконання контейнерів, але значення `--cgroup-driver` повинно відповідати драйверу cgroup, який використовується середовищем виконання контейнерів, щоб забезпечити нормальну роботу kubelet.

- Щоб вказати середовище виконання контейнерів, вам потрібно встановити його endpoint за допомогою прапорця `--container-runtime-endpoint=<шлях>`.

Рекомендований спосіб застосування такої конфігурації, специфічної для екземпляра, — використовувати [патчі для KubeletConfiguration](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Налаштування kubelet за допомогою kubeadm {#configure-kubelets-using-kubeadm}

Можливо налаштувати kubelet, який запустить kubeadm, якщо вказано власний обʼєкт API [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
з конфігураційним файлом таким чином `kubeadm ... --config some-config-file.yaml`.

Викликаючи `kubeadm config print init-defaults --component-configs KubeletConfiguration`, ви можете переглянути всі типові значення для цієї структури.

Також можливо застосувати специфічні для екземпляра патчі до базового `KubeletConfiguration`. Див. [Налаштування kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet) для отримання докладнішої інформації.

### Послідовність дій при використанні `kubeadm init` {#workflow-when-using-kubeadm-init}

Коли ви викликаєте `kubeadm init`, конфігурація kubelet записується на диск в `/var/lib/kubelet/config.yaml` і також завантажується в ConfigMap `kubelet-config` в просторі імен `kube-system` кластера. Додатково, інструмент kubeadm виявляє сокет CRI на вузлі та записує його деталі (включаючи шлях до сокета) у локальну конфігурацію, `/var/lib/kubelet/instance-config.yaml`. Файл конфігурації kubelet також записується у `/etc/kubernetes/kubelet.conf` із базовою конфігурацією кластера для всіх kubelet в кластері. Цей файл конфігурації вказує на клієнтські сертифікати, які дозволяють kubelet взаємодіяти з сервером API. Це вирішує проблему [поширення конфігурації на рівні кластера для кожного kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Щоб вирішити другу проблему, повʼязану з [наданням конфігурації для конкретного екземпляра](#providing-instance-specific-configuration-details), kubeadm записує файл середовища у `/var/lib/kubelet/kubeadm-flags.env`, який містить список прапорців, які слід передати kubelet під час його запуску. Прапорці виглядають у файлі наступним чином:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Крім прапорців, які використовуються під час запуску kubelet, файл також містить динамічні параметри, такі як драйвер cgroup.

Після розміщення цих двох файлів на диску kubeadm спробує виконати дві команди, якщо ви використовуєте systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Якщо перезавантаження та перезапуск вдалися, продовжується звичайний робочий процес `kubeadm init`.

### Послідовність дій при використанні `kubeadm join` {#workflow-when-using-kubeadm-join}

Коли ви викликаєте `kubeadm join`, kubeadm використовує облікові дані Bootstrap Token, щоб виконати запуск TLS, який отримує необхідні облікові дані для завантаження ConfigMap `kubelet-config` та записує його в `/var/lib/kubelet/config.yaml`. Додатково, kubeadm виявляє сокет CRI на вузлі та записує його деталі (включаючи шлях до сокета) у локальну конфігурацію, `/var/lib/kubelet/instance-config.yaml`. Файл середовища генерується точно так само, як і при `kubeadm init`.

Далі `kubeadm` виконує дві команди для завантаження нової конфігурації в kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Після завантаження нової конфігурації kubelet, kubeadm записує `/etc/kubernetes/bootstrap-kubelet.conf` файл конфігурації KubeConfig, який містить сертифікат CA та Bootstrap Token. Ці дані використовуються kubelet для виконання TLS Bootstrap та отримання унікальних облікових даних, які зберігається в `/etc/kubernetes/kubelet.conf`.

Коли файл `/etc/kubernetes/kubelet.conf` записаний, kubelet завершує виконання TLS Bootstrap. Kubeadm видаляє файл `/etc/kubernetes/bootstrap-kubelet.conf` після завершення TLS Bootstrap.

## Файл kubelet drop-in для systemd {#the-kubelet-drop-in-file-for-systemd}

`kubeadm` постачається з конфігурацією systemd для запуску kubelet. Зверніть увагу, що команда kubeadm CLI ніколи не торкається цього drop-in файлу.

Цей файл конфігурації, встановлений за допомогою [пакунка](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) `kubeadm`, записується в `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` та використовується systemd. Він доповнює основний [`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

Якщо ви хочете внести зміні, ви можете створити теку `/etc/systemd/system/kubelet.service.d/` (зверніть увагу, не `/usr/lib/systemd/system/kubelet.service.d/`) та внести власні налаштування у файл там. Наприклад, ви можете додати новий локальний файл `/etc/systemd/system/kubelet.service.d/local-overrides.conf` для того, щоб перевизначити налаштування елементів в `kubeadm`.

Ось що ви, імовірно, знайдете в `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
Наведені нижче вміст — це лише приклад. Якщо ви не хочете використовувати менеджер пакунків, дотримуйтеся інструкції, описаної в розділі ([Без менеджера пакунків](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)).
{{< /note >}}

```ini
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# Це файл, який "kubeadm init" та "kubeadm join" генерують в режимі виконання, заповнюючи
# змінну KUBELET_KUBEADM_ARGS динамічно
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# Це файл, який користувач може використовувати для заміщення аргументів kubelet як останній захист. В ідеалі,
# користувач повинен використовувати обʼєкт .NodeRegistration.KubeletExtraArgs в файлах конфігурації.
# KUBELET_EXTRA_ARGS повинен бути джерелом цього файлу.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Цей файл вказує на типове знаходження для всіх файлів, які керуються kubeadm для kubelet.

- Файл KubeConfig для TLS Bootstrap — `/etc/kubernetes/bootstrap-kubelet.conf`, але він використовується тільки у випадку, якщо `/etc/kubernetes/kubelet.conf` не існує.
- Файл KubeConfig з унікальними ідентифікаційними даними kubelet — `/etc/kubernetes/kubelet.conf`.
- Файл, що містить ComponentConfig kubelet — `/var/lib/kubelet/config.yaml`.
- Динамічний файл середовища, що містить `KUBELET_KUBEADM_ARGS`, взятий з `/var/lib/kubelet/kubeadm-flags.env`.
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
