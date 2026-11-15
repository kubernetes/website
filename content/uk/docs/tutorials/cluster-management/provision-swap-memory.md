---
title: Налаштування своп-памʼяті на вузлах Kubernetes
content_type: tutorial
weight: 35
min-kubernetes-server-version: "1.33"
---

<!-- overview -->

Ця сторінка містить приклад того, як виділити та налаштувати своп-памʼять на вузлі Kubernetes за допомогою kubeadm.

<!-- lessoncontent -->

## {{% heading "objectives" %}} {#objectives}

* Виділити своп-памʼять на вузлі Kubernetes за допомогою kubeadm.
* Навчитися налаштовувати як зашифрований, так і незашифрований своп.
* Навчитися вмикати своп під час завантаження системи.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібен принаймні один робочий вузол у кластері, який має працювати під керуванням операційної системи Linux. Для цього прикладу потрібно встановити інструмент kubeadm, дотримуючись кроків, описаних в [інструкції зі встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).

На кожному робочому вузлі, де ви будете налаштовувати своп, потрібні такі утиліти:

* `fallocate`
* `mkswap`
* `swapon`

* Для зашифрованого свопу (рекомендовано) вам також потрібен:
* `cryptsetup`

<!-- lessoncontent -->

## Встановлення кластера з підтримкою свопу через kubeadm {#install-a-swap-enabled-cluster-with-kubeadm}

### Створення своп-файлу та активація свопу {#create-a-swap-file-and-turn-swap-on}

Якщо своп не увімкнено, його потрібно виділити на вузлі. У розділах нижче показано, як створити 4 ГіБ свопу як у зашифрованому, так і в незашифрованому варіанті.

{{< tabs name="Створення своп-файлу та активація свопу" >}}

{{% tab name="Налаштування зашифрованого свопу" %}}
Зашифрований своп-файл можна налаштувати так. Зверніть увагу, що в цьому прикладі використовується виконуваний файл `cryptsetup` (доступний у більшості дистрибутивів Linux).

```bash
# Виділення місця та обмеження доступу
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Створення зашифрованого пристрою на основі виділеного місця
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# Форматування простору свопу
mkswap /dev/mapper/cryptswap

# Активація свопу для підкачки
swapon /dev/mapper/cryptswap
```

{{% /tab %}}

{{% tab name="Налаштування незашифрованого свопу" %}}
Незашифрований своп-файл можна налаштувати так.

```bash
# Виділення місця та обмеження доступу
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Форматування простору свопу
mkswap /swapfile

# Активація свопу для підкачки
swapon /swapfile
```

{{% /tab %}}

{{< /tabs >}}

#### Перевірка, що своп увімкнено {#verify-that-swap-is-enabled}

Перевірити, чи своп увімкнено, можна за допомогою команд `swapon -s` або `free`.

За допомогою `swapon -s`:

```
Filename       Type		Size		Used		Priority
/dev/dm-0      partition 	4194300		0		-2
```

За допомогою `free -h`:

```
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.3Gi       249Mi        25Mi       2.5Gi       2.5Gi
Swap:          4.0Gi          0B       4.0Gi
```

#### Увімкнення свопу під час завантаження {#enable-swap-on-boot}

Після налаштування свопу, щоб своп-файл запускався під час завантаження, зазвичай або налаштовують юніт systemd для активації (зашифрованого) свопу, або додають у `/etc/fstab` рядок, подібний до `/swapfile swap swap defaults 0 0`.

Використання systemd для активації свопу дає змогу системі відкласти запуск kubelet, доки своп не стане доступним, якщо ви хочете це забезпечити. Так само systemd дає змогу серверу тримати своп активним, доки kubelet (і, зазвичай, ваше середовище виконання контейнерів) не завершать роботу.

### Налаштування kubelet {#set-up-kubelet-configuration}

Після ввімкнення свопу на вузлі потрібно налаштувати kubelet на його використання. Вам потрібно вибрати [поведінку свопу](/docs/reference/node/swap-behavior/) для цього вузла. У цьому посібнику ви налаштуєте поведінку _LimitedSwap_.

Знайдіть і відредагуйте файл конфігурації kubelet, а також:

* встановіть `failSwapOn` у false
* встановіть `memorySwap.swapBehavior` у LimitedSwap

```yaml
 # цей фрагмент додається у файл конфігурації kubelet
 failSwapOn: false
 memorySwap:
     swapBehavior: LimitedSwap
```

Щоб ці налаштування набули чинності, потрібно перезапустити kubelet. Зазвичай це робиться за допомогою команди:

```shell
systemctl restart kubelet.service
```

Тепер kubelet має бути у справному стані, і ви можете запускати Podʼи, які за потреби використовують своп-памʼять.
