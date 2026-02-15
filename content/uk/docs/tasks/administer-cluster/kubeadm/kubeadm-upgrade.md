---
title: Оновлення кластерів з kubeadm
content_type: task
weight: 30
---

<!-- overview -->

Ця сторінка пояснює, як оновити кластер Kubernetes, створений за допомогою kubeadm, з версії {{< skew currentVersionAddMinor -1 >}}.x до версії {{< skew currentVersion >}}.x і з версії {{< skew currentVersion >}}.x до {{< skew currentVersion >}}.y (де `y > x`). Пропуск МІНОРНИХ версій при оновленні не підтримується. Для отримання додаткових відомостей відвідайте [Політику версій зміни](/releases/version-skew-policy/).

Щоб переглянути інформацію про оновлення кластерів, створених за допомогою старіших версій kubeadm, зверніться до наступних сторінок:

- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -2 >}} на {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -3 >}} на {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -4 >}} на {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -5 >}} на {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

Проєкт Kubernetes рекомендує оперативно оновлюватись до останніх випусків патчів, а також переконатися, що ви використовуєте підтримуваний мінорний випуск Kubernetes. Дотримання цих рекомендацій допоможе вам залишатись захищеними.

Процес оновлення загалом виглядає наступним чином:

1. Оновлення первинного вузла панелі управління.
1. Оновлення додаткових вузлів панелі управління.
1. Оновлення вузлів робочого навантаження.

## {{% heading "prerequisites" %}}

- Переконайтеся, що ви уважно прочитали [примітки до випуску](https://git.k8s.io/kubernetes/CHANGELOG).
- Кластер повинен використовувати статичні вузли керування та контейнери etcd або зовнішній etcd.
- Переконайтеся, що ви зробили резервне копіювання важливих компонентів, таких як стан на рівні застосунків, збережений у базі даних. `kubeadm upgrade` не торкнеться вашого робочого навантаження, лише компонентів, внутрішніх для Kubernetes, але резервне копіювання завжди є найкращою практикою.
- [Своп має бути вимкнено](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### Додаткова інформація {#additional-information}

- Наведені нижче інструкції описують, коли потрібно вивести з експлуатації кожний вузол під час процесу оновлення. Якщо ви виконуєте оновлення для **мінорного** номера версії для будь-якого kubelet, ви **обовʼязково** спочатку повинні вивести вузол (або вузли) з експлуатації, які ви оновлюєте. У випадку вузлів панелі управління, на них можуть працювати контейнери CoreDNS або інші критичні робочі навантаження. Для отримання додаткової інформації дивіться [Виведення вузлів з експлуатації](/docs/tasks/administer-cluster/safely-drain-node/).
- Проєкт Kubernetes рекомендує щоб версії kubelet і kubeadm збігались. Замість цього ви можете використовувати версію kubelet, яка є старішою, ніж kubeadm, за умови, що вона знаходиться в межах підтримуваних версій. Для отримання додаткових відомостей, будь ласка, відвідайте [Відхилення kubeadm від kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- Всі контейнери перезавантажуються після оновлення, оскільки змінюється значення хешу специфікації контейнера.
- Щоб перевірити, що служба kubelet успішно перезапустилась після оновлення kubelet, ви можете виконати `systemctl status kubelet` або переглянути логи служби за допомогою `journalctl -xeu kubelet`.
- `kubeadm upgrade` підтримує параметр `--config` із [типом API `UpgradeConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4), який можна використовувати для налаштування процесу оновлення.
- `kubeadm upgrade` не підтримує переналаштування наявного кластера. Замість цього виконайте кроки, описані в [Переналаштування кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

### Що треба враховувати при оновленні etcd {#considerations-when-upgrading-etcd}

Оскільки статичний Pod `kube-apiserver` працює постійно (навіть якщо ви вивели вузол з експлуатації), під час виконання оновлення kubeadm, яке включає оновлення etcd, запити до сервера зупиняться, поки новий статичний Pod etcd не перезапуститься. Як обхідний механізм, можна активно зупинити процес `kube-apiserver` на кілька секунд перед запуском команди `kubeadm upgrade apply`. Це дозволяє завершити запити, що вже відправлені, і закрити наявні зʼєднання, що знижує наслідки перерви роботи etcd. Це можна зробити на вузлах панелі управління таким чином:

```shell
killall -s SIGTERM kube-apiserver # виклик належного припинення роботи kube-apiserver
sleep 20 # зачекайте трохи, щоб завершити запити, які вже були відправлені
kubeadm upgrade ... # виконати команду оновлення kubeadm
```

<!-- steps -->

## Зміна репозиторію пакунків {#change-the-package-repository}

Якщо ви використовуєте репозиторії пакунків, що керуються спільнотою (`pkgs.k8s.io`), вам потрібно увімкнути репозиторій пакунків для бажаної мінорної версії Kubernetes. Як це зробити можна дізнатись з документа [Зміна репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Визначення версії, на яку потрібно оновитися {#determine-which-version-to-upgrade-to}

Знайдіть останнє патч-видання для Kubernetes {{< skew currentVersion >}} за допомогою менеджера пакунків ОС:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian або HypriotOS" %}}

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній патч.
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS, RHEL або Fedora" %}}

Для систем з DNF:

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній патч.
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```

Для систем з DNF5:

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній патч.
sudo yum list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

Якщо ви не бачите версію, до якої очікуєте оновитися, [перевірте, чи використовуються сховища пакунків Kubernetes.](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)

## Оновлення вузлів панелі управління {#upgrading-control-plane-nodes}

Процедуру оновлення на вузлах панелі управління слід виконувати по одному вузлу за раз. Виберіть перший вузол панелі управління, який ви хочете оновити. Він повинен мати файл `/etc/kubernetes/admin.conf`.

Here's the translation:

### Виклик "kubeadm upgrade" {#call-kubeadm-upgrade}

**Для першого вузла панелі управління**

1. Оновіть kubeadm:

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu, Debian або HypriotOS" %}}

   ```shell
   # замініть x на останню версію патча
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL або Fedora" %}}

   Для систем з DNF:

   ```shell
   # замініть x в {{< skew currentVersion >}}.x-* на останню версію патча
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   Для систем з DNF5:

   ```shell
   # замініть x в {{< skew currentVersion >}}.x-* на останню версію патча
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

2. Перевірте, що завантаження працює і має очікувану версію:

   ```shell
   kubeadm version
   ```

3. Перевірте план оновлення:

   ```shell
   sudo kubeadm upgrade plan
   ```

   Ця команда перевіряє можливість оновлення вашого кластера та отримує версії, на які ви можете оновитися. Також вона показує таблицю стану версій компонентів.

   {{< note >}}
   `kubeadm upgrade` також автоматично оновлює сертифікати, якими він керує на цьому вузлі. Щоб відмовитися від оновлення сертифікатів, можна використовувати прапорець `--certificate-renewal=false`. Для отримання додаткової інформації див. [керівництво з керування сертифікатами](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   {{</ note >}}

4. Виберіть версію для оновлення та запустіть відповідну команду. Наприклад:

   ```shell
   # замініть x на версію патча, яку ви вибрали для цього оновлення
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   Після завершення команди ви маєте побачити:

   ```none
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   Для версій, старіших, ніж v1.28, kubeadm типово використовував режим, який оновлює надбудови (включно з CoreDNS та kube-proxy) безпосередньо під час `kubeadm upgrade apply`, незалежно від того, чи є інші екземпляри вузлів панелі управління, які не були оновлені. Це може викликати проблеми сумісності. Починаючи з v1.28, kubeadm стандартно перевіряє, чи всі
   екземпляри вузлів панелі управління були оновлені, перед початком оновлення надбудов. Ви повинні виконати оновлення екземплярів вузлів керування послідовно або принаймні забезпечити, що останнє оновлення екземпляра вузла панелі управління не розпочато, поки всі
   інші екземпляри вузлів панелі управління не будуть повністю оновлені, і оновлення надбудов буде виконано після останнього оновлення екземпляра вузла керування.
   {{</ note >}}

5. Вручну оновіть втулок постачальник мережевого інтерфейсу контейнера (CNI).

   Ваш постачальник мережевого інтерфейсу контейнера (CNI) може мати власні інструкції щодо оновлення. Перевірте [надбудови](/docs/concepts/cluster-administration/addons/) для знаходження вашого постачальника CNI та перегляньте, чи потрібні додаткові кроки оновлення.

   Цей крок не потрібен на додаткових вузлах панелі управління, якщо постачальник CNI працює як DaemonSet.

**Для інших вузлів панелі управління**

Те саме, що для першого вузла керування, але використовуйте:

```shell
sudo kubeadm upgrade node
```

замість:

```shell
sudo kubeadm upgrade apply
```

Також виклик `kubeadm upgrade plan` та оновлення постачальника мережевого інтерфейсу контейнера (CNI) вже не потрібні.

### Виведення вузла з експлуатації {#draining-the-node}

Готуємо вузол для обслуговування, відмітивши його як непридатний для планування та вивівши з нього робочі навантаження:

```shell
# замініть <node-to-drain> іменем вашого вузла, який ви хочете вивести з експлуатації
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Оновлення kubelet та kubectl {#upgrade-kubelet-and-kubectl}

{{< note >}}
На вузлах Linux kubelet стандартно підтримує тільки cgroups v2. Для Kubernetes {{< skew currentVersion >}} опція конфігурації kubelet `FailCgroupV1` типово встановлена на `true`.

Щоб дізнатися більше, зверніться до [документації про виведення з експлуатації Kubernetes cgroup v1](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1).
{{</ note >}}

1. Оновіть kubelet та kubectl:

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu, Debian або HypriotOS" %}}

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню патч-версію
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL або Fedora" %}}

   Для систем з DNF:

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню патч-версію
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   Для систем з DNF:

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню патч-версію
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

2. Перезапустіть kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Повернення вузла до експлуатації {#uncordoning-the-node}

Відновіть роботу вузла, позначивши його як доступний для планування:

```shell
# замініть <node-to-uncordon> на імʼя вашого вузла
kubectl uncordon <node-to-uncordon>
```

## Оновлення вузлів робочих навантажень {#upgrade-worker-nodes}

Процедуру оновлення на робочих вузлах слід виконувати один за одним або декільком вузлами одночасно, не посягаючи на мінімально необхідні можливості для виконання вашого навантаження.

Наступні сторінки показують, як оновити робочі вузли у Linux та Windows:

- [Оновлення вузлів Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
- [Оновлення вузлів Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## Перевірка стану кластера {#verify-the-status-of-the-cluster}

Після оновлення kubelet на всіх вузлах перевірте доступність всіх вузлів, виконавши наступну команду з будь-якого місця, де кubectl має доступу до кластера:

```shell
kubectl get nodes
```

У стовпці `STATUS` повинно бути вказано `Ready` для всіх ваших вузлів, а номер версії повинен бути оновлений.

## Відновлення після несправності {#recovery-from-a-failure-state}

Якщо `kubeadm upgrade` виявляється несправним і не відновлює роботу, наприклад через неочікуване вимкнення під час виконання, ви можете виконати `kubeadm upgrade` ще раз. Ця команда є ідемпотентною і, зрештою, переконується, що фактичний стан відповідає заданому вами стану.

Для відновлення з несправного стану ви також можете запустити `sudo kubeadm upgrade apply --force` без зміни версії, яку використовує ваш кластер.

Під час оновлення kubeadm записує наступні резервні теки у `/etc/kubernetes/tmp`:

- `kubeadm-backup-etcd-<дата>-<час>`
- `kubeadm-backup-manifests-<дата>-<час>`

`kubeadm-backup-etcd` містить резервну копію даних локального etcd для цього вузла панелі управління. У разі невдачі оновлення etcd і якщо автоматичне відновлення не працює, вміст цієї теки може бути відновлений вручну в `/var/lib/etcd`. У разі використання зовнішнього etcd ця тека резервного копіювання буде порожньою.

`kubeadm-backup-manifests` містить резервну копію файлів маніфестів статичних Podʼів для цього вузла панелі управління. У разі невдачі оновлення і якщо автоматичне відновлення не працює, вміст цієї теки може бути відновлений вручну в `/etc/kubernetes/manifests`. Якщо з будь-якої причини немає різниці між попереднім та файлом маніфесту після оновлення для певного компонента, резервна копія файлу для нього не буде записана.

{{< note >}}
Після оновлення кластера за допомогою kubeadm, тека резервних копій `/etc/kubernetes/tmp` залишиться, і ці резервні файли потрібно буде очистити вручну.
{{</ note >}}

## Як це працює {#how-it-works}

`kubeadm upgrade apply` робить наступне:

- Перевіряє, що ваш кластер можна оновити:
  - Сервер API доступний
  - Всі вузли знаходяться у стані `Ready`
  - Панель управління працює належним чином
- Застосовує політику різниці версій.
- Переконується, що образи панелі управління доступні або доступні для отримання на машині.
- Генерує заміни та/або використовує зміни підготовлені користувачем, якщо компонентні конфігурації вимагають оновлення версії.
- Оновлює компоненти панелі управління або відкочується, якщо будь-який з них не може бути запущений.
- Застосовує нові маніфести `CoreDNS` і `kube-proxy` і переконується, що створені всі необхідні правила RBAC.
- Створює нові сертифікати та файли ключів API-сервера і робить резервні копії старих файлів, якщо вони мають закінчитися за 180 днів.

`kubeadm upgrade node` робить наступне на додаткових вузлах панелі управління:

- Витягує `ClusterConfiguration` kubeadm з кластера.
- Опційно робить резервні копії сертифіката kube-apiserver.
- Оновлює маніфести статичних Podʼів для компонентів панелі управління.
- Оновлює конфігурацію kubelet для цього вузла.

`kubeadm upgrade node` робить наступне на вузлах робочих навантажень:

- Витягує `ClusterConfiguration` kubeadm з кластера.
- Оновлює конфігурацію kubelet для цього вузла.
