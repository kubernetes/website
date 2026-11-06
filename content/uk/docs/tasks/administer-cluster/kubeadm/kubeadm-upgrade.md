---
title: Оновлення кластерів з kubeadm
content_type: task
weight: 30
---

<!-- overview -->

Ця сторінка пояснює, як оновити кластер Kubernetes, створений за допомогою kubeadm, з версії {{< skew currentVersionAddMinor -1 >}}.x до версії {{< skew currentVersion >}}.x і з версії {{< skew currentVersion >}}.x до {{< skew currentVersion >}}.y (де `y > x`). Пропуск мінорних (MINOR) версій під час оновлення не підтримується. Докладніше див. [Політика версійної розбіжності](/releases/version-skew-policy/).

Щоб переглянути інформацію про оновлення кластерів, створених за допомогою старіших версій kubeadm, зверніться до таких сторінок:

- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -2 >}} на {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -3 >}} на {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -4 >}} на {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Оновлення кластера kubeadm з {{< skew currentVersionAddMinor -5 >}} на {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

Проєкт Kubernetes рекомендує оперативно оновлюватись до останніх випусків патчів, а також переконатися, що ви використовуєте підтримуваний мінорний випуск Kubernetes. Дотримання цих рекомендацій допоможе вам залишатись захищеними.

Загалом процес оновлення виглядає так:

1. Оновлення первинного вузла панелі управління.
1. Оновлення додаткових вузлів панелі управління.
1. Оновлення робочих вузлів.

## {{% heading "prerequisites" %}} {#before-you-begin}

- Переконайтеся, що ви уважно прочитали [примітки до випуску](https://git.k8s.io/kubernetes/CHANGELOG).
- Кластер повинен використовувати статичні Podʼи панелі управління та etcd або зовнішній etcd.
- Переконайтеся, що ви зробили резервне копіювання важливих компонентів, таких як стан на рівні застосунків, збережений у базі даних. `kubeadm upgrade` не торкнеться вашого робочого навантаження, лише компонентів, внутрішніх для Kubernetes, але резервне копіювання завжди є найкращою практикою.
- [Своп має бути вимкнено](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### Додаткова інформація {#additional-information}

- Наведені нижче інструкції описують, коли під час оновлення потрібно виконувати drain кожного вузла. Якщо ви виконуєте оновлення **мінорної** версії будь-якого kubelet, ви **мусите** спочатку виконати drain вузла (або вузлів), які оновлюєте. На вузлах панелі управління можуть працювати Podʼи CoreDNS або інші критичні робочі навантаження. Докладніше див. [Drain вузлів](/docs/tasks/administer-cluster/safely-drain-node/).
- Проєкт Kubernetes рекомендує, щоб версії kubelet і kubeadm збігалися. Натомість ви можете використовувати версію kubelet, старішу за kubeadm, за умови, що вона перебуває в межах підтримуваних версій. Докладніше див. [Розбіжність версій kubeadm і kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- Після оновлення всі контейнери перезапускаються, оскільки змінюється значення хешу специфікації контейнера.
- Щоб перевірити, що сервіс kubelet успішно перезапустився після оновлення kubelet, ви можете виконати `systemctl status kubelet` або переглянути логи сервісу за допомогою `journalctl -xeu kubelet`.
- `kubeadm upgrade` підтримує параметр `--config` із [типом API `UpgradeConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4), який можна використовувати для налаштування процесу оновлення.
- `kubeadm upgrade` не підтримує переналаштування наявного кластера. Замість цього виконайте кроки, описані в [Переналаштування кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

### Що враховувати під час оновлення etcd {#considerations-when-upgrading-etcd}

Оскільки статичний Pod `kube-apiserver` працює постійно (навіть якщо ви виконали drain вузла), коли ви виконуєте оновлення kubeadm, яке включає оновлення etcd, запити в процесі виконання (in-flight) до сервера зависнуть, поки новий статичний Pod etcd перезапускається. Як обхідний шлях можна активно зупинити процес `kube-apiserver` за кілька секунд до запуску команди `kubeadm upgrade apply`. Це дає змогу завершити запити в процесі виконання та закрити наявні зʼєднання і зменшує наслідки простою etcd. На вузлах панелі управління це можна зробити так:

```shell
killall -s SIGTERM kube-apiserver # виклик належного припинення роботи kube-apiserver
sleep 20 # зачекайте трохи, щоб завершити запити, які вже були відправлені
kubeadm upgrade ... # виконати команду оновлення kubeadm
```

<!-- steps -->

## Зміна репозиторію пакунків {#changing-the-package-repository}

Якщо ви використовуєте репозиторії пакунків, що керуються спільнотою (`pkgs.k8s.io`), вам потрібно увімкнути репозиторій пакунків для бажаної мінорної версії Kubernetes. Як це зробити можна дізнатись з документа [Зміна репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Визначення версії, на яку потрібно оновитися {#determine-which-version-to-upgrade-to}

Знайдіть останню версію виправлення для Kubernetes {{< skew currentVersion >}} за допомогою менеджера пакунків ОС:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian або HypriotOS" %}}

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній випуск виправлення.
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS, RHEL або Fedora" %}}

Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній випуск виправлення.
sudo dnf list --showduplicates kubeadm --disableexcludes=kubernetes
```

Для систем з DNF5:

```shell
# Знайдіть останню версію {{< skew currentVersion >}} у списку.
# Вона має виглядати як {{< skew currentVersion >}}.x-*, де x — останній випуск виправлення.
sudo dnf list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

Якщо ви не бачите версії, до якої очікуєте оновитися, [перевірте, чи використовуються репозиторії пакунків Kubernetes.](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)

## Оновлення вузлів панелі управління {#upgrading-control-plane-nodes}

Процедуру оновлення на вузлах панелі управління слід виконувати по одному вузлу за раз. Виберіть перший вузол панелі управління, який ви хочете оновити. Він повинен мати файл `/etc/kubernetes/admin.conf`.

### Виклик «kubeadm upgrade» {#call-kubeadm-upgrade}

**Для першого вузла панелі управління**

1. Оновіть kubeadm:

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu, Debian або HypriotOS" %}}

   ```shell
   # замініть x на останню версію виправлення
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL або Fedora" %}}

   Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

   ```shell
   # замініть x в {{< skew currentVersion >}}.x-* на останню версію виправлення
   sudo dnf install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   Для систем з DNF5:

   ```shell
   # замініть x в {{< skew currentVersion >}}.x-* на останню версію виправлення
   sudo dnf install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Перевірте, що завантаження працює і має очікувану версію:

   ```shell
   kubeadm version
   ```

1. Перевірте план оновлення:

   ```shell
   sudo kubeadm upgrade plan
   ```

   Ця команда перевіряє, чи можна оновити ваш кластер, і отримує версії, до яких ви можете оновитися. Вона також показує таблицю зі станами версій конфігурацій компонентів.

   {{< note >}}
   `kubeadm upgrade` також автоматично оновлює сертифікати, якими він керує на цьому вузлі. Щоб відмовитися від оновлення сертифікатів, можна використовувати прапорець `--certificate-renewal=false`. Для отримання додаткової інформації див. [керівництво з керування сертифікатами](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   {{</ note >}}

1. Виберіть версію для оновлення та виконайте відповідну команду. Наприклад:

   ```shell
   # замініть x на версію виправлення, яку ви вибрали для цього оновлення
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   Після завершення команди ви маєте побачити:

   ```
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   Для версій, старіших за v1.28, kubeadm стандартно використовував режим, у якому надбудови (зокрема CoreDNS і kube-proxy) оновлюються одразу під час `kubeadm upgrade apply`, незалежно від того, чи є інші екземпляри панелі управління, які ще не оновлено. Це може спричинити проблеми сумісності. Починаючи з v1.28, kubeadm стандартно використовує режим, у якому перед оновленням надбудов перевіряється, чи всі екземпляри панелі управління оновлено. Ви повинні оновлювати екземпляри панелі управління послідовно або принаймні не починати оновлення останнього екземпляра панелі управління, доки всі інші екземпляри не буде повністю оновлено; оновлення надбудов буде виконано після оновлення останнього екземпляра панелі управління.
   {{</ note >}}

1. Вручну оновіть втулок вашого постачальника CNI.

   Ваш постачальник Container Network Interface (CNI) може мати власні інструкції з оновлення. Перегляньте сторінку [надбудов](/docs/concepts/cluster-administration/addons/), щоб знайти свого постачальника CNI і перевірити, чи потрібні додаткові кроки оновлення.

   Цей крок не потрібен на додаткових вузлах панелі управління, якщо постачальник CNI працює як DaemonSet.

**Для інших вузлів панелі управління**

Те саме, що й для першого вузла панелі управління, але використовуйте:

```shell
sudo kubeadm upgrade node
```

замість:

```shell
sudo kubeadm upgrade apply
```

Також виклик `kubeadm upgrade plan` та оновлення втулка постачальника CNI більше не потрібні.

### Drain вузла {#drain-the-node}

Підготуйте вузол до обслуговування, позначивши його непридатним для планування та виселивши робочі навантаження:

```shell
# замініть <node-to-drain> на імʼя вузла, для якого виконуєте drain
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Оновлення kubelet та kubectl {#upgrade-kubelet-and-kubectl}

{{< note >}}
На вузлах Linux kubelet стандартно підтримує лише cgroups v2. Для Kubernetes {{< skew currentVersion >}} параметр конфігурації kubelet `FailCgroupV1` стандартно встановлено в `true`.

Щоб дізнатися більше, зверніться до [документації про визнання застарілим cgroup v1 у Kubernetes](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1).
{{</ note >}}

1. Оновіть kubelet та kubectl:

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu, Debian або HypriotOS" %}}

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію виправлення
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL або Fedora" %}}

   Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію виправлення
   sudo dnf install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   Для систем з DNF5:

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію виправлення
   sudo dnf install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Перезапустіть kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Uncordon вузла {#uncordon-the-node}

Поверніть вузол у роботу, позначивши його придатним для планування:

```shell
# замініть <node-to-uncordon> на імʼя вашого вузла
kubectl uncordon <node-to-uncordon>
```

## Оновлення робочих вузлів {#upgrade-worker-nodes}

Процедуру оновлення на робочих вузлах слід виконувати по одному або по кілька вузлів за раз, не порушуючи мінімально необхідної потужності для роботи ваших навантажень.

На цих сторінках показано, як оновити робочі вузли Linux і Windows:

- [Оновлення вузлів Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
- [Оновлення вузлів Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## Перевірка стану кластера {#verify-the-status-of-the-cluster}

Після оновлення kubelet на всіх вузлах перевірте, що всі вузли знову доступні, виконавши цю команду з будь-якого місця, звідки kubectl має доступ до кластера:

```shell
kubectl get nodes
```

У стовпці `STATUS` повинно бути вказано `Ready` для всіх ваших вузлів, а номер версії повинен бути оновлений.

## Відновлення після несправності {#recovering-from-a-failure-state}

Якщо `kubeadm upgrade` завершується невдачею і не виконує відкат, наприклад через неочікуване вимкнення під час виконання, ви можете виконати `kubeadm upgrade` ще раз. Ця команда ідемпотентна і зрештою гарантує, що фактичний стан відповідає заданому вами бажаному стану.

Для відновлення з несправного стану ви також можете запустити `sudo kubeadm upgrade apply --force` без зміни версії, яку використовує ваш кластер.

Під час оновлення kubeadm записує такі резервні теки в `/etc/kubernetes/tmp`:

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` містить резервну копію даних локального учасника etcd для цього вузла панелі управління. У разі невдалого оновлення etcd, якщо автоматичний відкат не спрацював, вміст цієї теки можна вручну відновити в `/var/lib/etcd`. Якщо використовується зовнішній etcd, ця тека резервних копій буде порожньою.

`kubeadm-backup-manifests` містить резервну копію файлів маніфестів статичних Podʼів для цього вузла панелі управління. У разі невдалого оновлення, якщо автоматичний відкат не спрацював, вміст цієї теки можна вручну відновити в `/etc/kubernetes/manifests`. Якщо з якоїсь причини для певного компонента немає різниці між файлом маніфесту до оновлення та після нього, резервну копію для нього не буде записано.

{{< note >}}
Після оновлення кластера за допомогою kubeadm, тека резервних копій `/etc/kubernetes/tmp` залишиться, і ці резервні файли потрібно буде очистити вручну.
{{</ note >}}

## Як це працює {#how-it-works}

`kubeadm upgrade apply` робить таке:

- Перевіряє, що ваш кластер можна оновити:
  - API-сервер доступний
  - Усі вузли перебувають у стані `Ready`
  - Панель управління працює належним чином
- Застосовує політики версійної розбіжності.
- Переконується, що образи панелі управління доступні на машині або їх можна туди завантажити.
- Генерує заміни та/або використовує надані користувачем перевизначення, якщо конфігурації компонентів потребують оновлення версії.
- Оновлює компоненти панелі управління або виконує відкат, якщо будь-який із них не вдається запустити.
- Застосовує нові маніфести `CoreDNS` і `kube-proxy` і переконується, що створені всі необхідні правила RBAC.
- Оновлює сертифікати, якими керує kubeadm і які використовують компоненти панелі управління, під час оновлення цих компонентів, використовуючи локальний сертифікат і ключ CA. Оновлення сертифікатів увімкнено стандартно; щоб вимкнути його, використовуйте `--certificate-renewal=false`.

`kubeadm upgrade node` робить таке на додаткових вузлах панелі управління:

- Отримує `ClusterConfiguration` kubeadm з кластера.
- Оновлює сертифікати, якими керує kubeadm і які використовують компоненти панелі управління, під час оновлення цих компонентів, використовуючи локальний сертифікат і ключ CA. Оновлення сертифікатів увімкнено стандартно; щоб вимкнути його, використовуйте `--certificate-renewal=false`.
- Оновлює маніфести статичних Podʼів для компонентів панелі управління.
- Оновлює конфігурацію kubelet для цього вузла.

`kubeadm upgrade node` робить таке на вузлах робочих навантажень:

- Отримує `ClusterConfiguration` kubeadm з кластера.
- Оновлює конфігурацію kubelet для цього вузла.
