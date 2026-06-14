---
title: Налаштування драйвера cgroup
content_type: task
weight: 50
---

<!-- overview -->

Ця сторінка пояснює, як налаштувати драйвер cgroup kubelet, щоб він відповідав драйверу cgroup контейнера для кластерів kubeadm.

## {{% heading "prerequisites" %}}

Вам слід ознайомитися з [вимогами до контейнерних середовищ](/docs/setup/production-environment/container-runtimes) Kubernetes.

<!-- steps -->

## Налаштування драйвера cgroup середовища виконання контейнерів {#configure-the-container-runtime-cgroup-driver}

Сторінка [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes) пояснює, що для налаштувань на основі kubeadm рекомендується використовувати драйвер `systemd` замість [типового](/docs/reference/config-api/kubelet-config.v1beta1) драйвера `cgroupfs` kubelet, оскільки kubeadm керує kubelet як [сервісом systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).

На сторінці також наведено деталі щодо того, як налаштувати різні контейнерні середовища зі стандартним використанням драйвера `systemd`.

## Налаштування драйвера cgroup для kubelet {#configure-the-kubelet-cgroup-driver}

kubeadm дозволяє передавати структуру `KubeletConfiguration` під час ініціалізації за допомогою `kubeadm init`. Ця структура `KubeletConfiguration` може включати поле `cgroupDriver`, яке контролює драйвер cgroup для kubelet.

{{< note >}}
Починаючи з v1.22, якщо користувач не встановить поле `cgroupDriver` у `KubeletConfiguration`, kubeadm стандартно задає його як `systemd`.

У Kubernetes v1.28 можна увімкнути автоматичне виявлення драйвера cgroup як експериментальну функцію. Див. [Драйвер cgroup системи systemd](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver) для отримання детальнішої інформації.
{{< /note >}}

Ось мінімальний приклад, який явним чином вказує значення поля `cgroupDriver`:

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta4
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

Такий файл конфігурації можна передати команді kubeadm:

```shell
kubeadm init --config kubeadm-config.yaml
```

{{< note >}}
Kubeadm використовує ту саму конфігурацію `KubeletConfiguration` для всіх вузлів у кластері. `KubeletConfiguration` зберігається в обʼєкті [ConfigMap](/docs/concepts/configuration/configmap) в просторі імен `kube-system`.

Виконання підкоманд `init`, `join` та `upgrade` призведе до запису kubeadm `KubeletConfiguration` у файл під `/var/lib/kubelet/config.yaml` і передачі його до kubelet локального вузла.

На кожному вузлі kubeadm виявляє сокет CRI та зберігає його деталі у файлі `/var/lib/kubelet/instance-config.yaml`. Коли виконуються підкоманди `init`, `join` або `upgrade`, kubeadm вносить зміни до значення `containerRuntimeEndpoint` з цієї конфігурації інстансу у `/var/lib/kubelet/config.yaml`.
{{< /note >}}

## Використання драйвера `cgroupfs` {#using-the-cgroupfs-driver}

Для використання `cgroupfs` і запобігання модифікації драйвера cgroup в `KubeletConfiguration` під час оновлення `kubeadm` в поточних налаштуваннях, вам потрібно явно вказати його значення. Це стосується випадку, коли ви не хочете, щоб майбутні версії `kubeadm` стандартно застосовували драйвер `systemd`.

Дивіться нижче розділ "[Зміна ConfigMap у kubelet](#modify-the-kubelet-configmap)" для отримання деталей щодо явного вказання значення.

Якщо ви хочете налаштувати середовище виконання контейнерів на використання драйвера `cgroupfs`, вам слід звернутися до документації вашого середовища виконання контейнерів.

## Міграція на використання драйвера `systemd` {#migrating-to-the-systemd-driver}

Щоб змінити драйвер cgroup поточного кластера kubeadm з `cgroupfs` на `systemd` на місці, потрібно виконати подібну процедуру до оновлення kubelet. Це повинно включати обидва зазначені нижче кроки.

{{< note >}}
Також можливо замінити старі вузли в кластері новими, які використовують драйвер `systemd`. Для цього потрібно виконати лише перший крок нижче перед приєднанням нових вузлів та забезпечити те, що робочі навантаження можуть безпечно переміщатися на нові вузли перед видаленням старих вузлів.
{{< /note >}}

### Зміна ConfigMap у kubelet {#modify-the-kubelet-configmap}

- Викличте `kubectl edit cm kubelet-config -n kube-system`.
- Змініть наявне значення `cgroupDriver` або додайте нове поле, яке виглядає наступним чином:

  ```yaml
  cgroupDriver: systemd
  ```

  Це поле повинно бути присутнє у розділі `kubelet:` в ConfigMap.

### Оновлення драйвера cgroup на всіх вузлах {#update-the-cgroup-driver-on-all-nodes}

Для кожного вузла в кластері:

- [Відключіть вузол](/docs/tasks/administer-cluster/safely-drain-node) за допомогою `kubectl drain <імʼя-вузла> --ignore-daemonsets`
- Зупиніть kubelet за допомогою `systemctl stop kubelet`
- Зупиніть середовище виконання контейнерів
- Змініть драйвер cgroup середовища виконання контейнерів на `systemd`
- Встановіть `cgroupDriver: systemd` у `/var/lib/kubelet/config.yaml`
- Запустіть середовище виконання контейнерів
- Запустіть kubelet за допомогою `systemctl start kubelet`
- [Увімкніть вузол](/docs/tasks/administer-cluster/safely-drain-node) за допомогою `kubectl uncordon <імʼя-вузла>`

Виконайте ці кроки на вузлах по одному, щоб забезпечити достатній час для розміщення робочих навантажень на різних вузлах.

Після завершення процесу переконайтеся, що всі вузли та робочі навантаження є справними.
