---
title: Налаштування свопу на вузлах Kubernetes
content_type: tutorial
weight: 35
min-kubernetes-server-version: "1.33"
---

<!-- огляд -->

Ця сторінка містить приклад того, як створити та налаштувати своп на вузлі Kubernetes за допомогою kubeadm.

<!-- зміст уроку -->

## {{% heading "цілі" %}}

* Створити своп на вузлі Kubernetes за допомогою kubeadm.
* Навчитися налаштовувати як зашифрований, так і незашифрований своп.
* Навчитися вмикати своп при завантаженні системи.

## {{% heading "передумови" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібен принаймні один робочий вузол у кластері, який має працювати під керуванням операційної системи Linux. Для цього прикладу необхідно встановити інструмент kubeadm, дотримуючись кроків, описаних у [інструкції з встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).

На кожному робочому вузлі, де ви будете налаштовувати своп, потрібні такі утиліти:

* `fallocate`
* `mkswap`
* `swapon`

Для зашифрованого свопу (рекомендовано) також потрібен:

* `cryptsetup`

<!-- lessoncontent -->

## Встановлення кластера з підтримкою свопу через kubeadm {#install-a-swap-enabled-cluster-with-kubeadm}

### Створення своп-файлу та активація свопу {#create-a-swap-file-and-turn-swap-on}

Якщо своп не увімкнено, потрібно створити своп на вузлі. У наступних розділах показано, як створити 4ГіБ своп як у зашифрованому, так і незашифрованому варіанті.

{{< tabs name="Створення своп-файлу та активація свопу" >}}

{{% tab name="Налаштування зашифрованого свопу" %}}
Зашифрований своп-файл можна налаштувати так. Зверніть увагу, що цей приклад використовує утиліту `cryptsetup` (доступна у більшості дистрибутивів Linux).

```bash
# Виділення місця та обмеження доступу
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Створення зашифрованого пристрою на основі виділеного місця
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# Форматування swap-простору
mkswap /dev/mapper/cryptswap

# Активація swap для підкачки
swapon /dev/mapper/cryptswap
```

{{% /tab %}}

{{% tab name="Налаштування незашифрованого swap" %}}
Незашифрований swap-файл можна налаштувати так.

```bash
# Виділення місця та обмеження доступу
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Форматування swap-простору
mkswap /swapfile

# Активація swap для підкачки
swapon /swapfile
```

{{% /tab %}}

{{< /tabs >}}

#### Перевірка, що своп увімкнено {#verify-that-swap-is-enabled}

Перевірити, чи своп увімкнено, можна за допомогою команд `swapon -s` або `free`.

Приклад `swapon -s`:

```console
Filename       Type		Size		Used		Priority
/dev/dm-0      partition 	4194300		0		-2
```

Приклад `free -h`:

```console
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.3Gi       249Mi        25Mi       2.5Gi       2.5Gi
Swap:          4.0Gi          0B       4.0Gi
```

#### Увімкнення swap при завантаженні {#enable-swap-on-boot}

Після налаштування swap, щоб він запускався при завантаженні, зазвичай або створюють systemd-юнит для активації (зашифрованого) swap, або додають рядок типу `/swapfile swap swap defaults 0 0` у `/etc/fstab`.

Використання systemd для активації swap дозволяє затримати запуск kubelet до моменту, коли swap буде доступний, якщо це потрібно. Аналогічно, systemd дозволяє залишати swap активним до завершення роботи kubelet (і, зазвичай, вашого контейнерного рантайму).

### Налаштування kubelet {#set-up-kubelet-configuration}

Після активації своп на вузлі потрібно налаштувати kubelet для його використання. Вам потрібно вибрати [поведінку свопу](/docs/reference/node/swap-behavior/) для цього вузла. Для цього посібника ви налаштуєте поведінку _LimitedSwap_.

Знайдіть і відредагуйте файл конфігурації kubelet, а також:

* встановіть `failSwapOn` на false
* встановіть `memorySwap.swapBehavior` на LimitedSwap

```yaml
 # цей фрагмент додається у конфігураційний файл kubelet
 failSwapOn: false
 memorySwap:
     swapBehavior: LimitedSwap
```

Щоб ці налаштування набули чинності, потрібно перезапустити kubelet. Зазвичай це робиться за допомогою команди:

```shell
systemctl restart kubelet.service
```

Ви повинні переконатися, що kubelet тепер працює нормально і що ви можете запускати Podʼи, які використовують своп-памʼять за потреби.
