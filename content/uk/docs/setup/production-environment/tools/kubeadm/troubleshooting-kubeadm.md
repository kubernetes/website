---
title: Розвʼязання проблем kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

Так само як і з будь-якою іншою технологією, ви можете зіткнутися з проблемами під час встановлення або використання kubeadm. Цей документ містить список найпоширеніших проблем та їх рішень, пропонуючи вам кроки, які допоможуть зʼясувати та розвʼязати проблеми.

Якщо вашої проблеми немає в переліку нижче, будь ласка, скористайтесь настпуним:

- Ви вважаєте, що це помилка в kubeadm:
  - Відвідайте [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues), пошукайте в списку наявних повідомлень.
  - Якщо ви не знайшли свою проблему, створіть нове [повідомлення про проблему](https://github.com/kubernetes/kubeadm/issues/new) використовуючи готовий шаблон.

- Ви не впевнені, що це проблема в роботі kubeadm, ви можете запитати в [Slack](https://slack.k8s.io/) в каналі `#kubeadm`, або поставити питання на [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes). Будь ласка, додайте теґи `#kubeadm` та `#kubernetes`.

<!-- body -->

## Неможливо приєднати вузол v1.18 до кластера v1.17 через відсутність RBAC {#not-possible-to-join-a-v1-18-node-to-a-v1-17-cluster-due-to-missing-rbac}

У версії v1.18 kubeadm додав запобігання приєднання вузла до кластера, якщо вузол з таким самим імʼям вже існує. Це вимагало додавання RBAC для користувача bootstrap-token для можливості виконання операції GET обʼєкта Node.

Однак це викликає проблему, коли `kubeadm join` з v1.18 не може приєднатися до кластера, створеного за допомогою kubeadm v1.17.

Для того, щоб оминути цю проблему у вас є два варіанти:

Виконайте `kubeadm init phase bootstrap-token` на вузлі панелі управління за допомогою kubeadm v1.18. Зауважте, що це дозволяє інші дозволи bootstrap-token.

або

Застосуйте наступний RBAC вручну за допомогою `kubectl apply -f ...`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## `ebtables` або подібний виконавчий файл не знайдений під час встановлення {#ebtables-or-similar-executable-not-found-during-installation}

Якщо ви бачите наступні попередження під час виконання `kubeadm init`:

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Тоді вам може бракувати `ebtables`, `ethtool` або подібного виконавчого файлу на вашому вузлі. Ви можете встановити їх за допомогою наступних команд:

- Для користувачів Ubuntu/Debian виконайте `apt install ebtables ethtool`.
- Для користувачів CentOS/Fedora виконайте `yum install ebtables ethtool`.

## `kubeadm` блокується під час очікування на панель управління під час встановлення {#kubeadm-blocks-waiting-for-control-plane-during-installation}

Якщо ви помічаєте, що `kubeadm init` зупиняється після виведення наступного рядка:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Це може бути спричинено кількома проблемами. Найбільш поширеними є:

- проблеми з мережевим підключенням. Перш ніж продовжувати, перевірте, чи ваша машина має повне підключення до мережі.
- драйвер cgroup контейнера відрізняється від драйвера kubelet cgroup. Щоб зрозуміти, як правильно налаштувати це, див. [Налаштування драйвера cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- контейнери панелі управління впадають в цикл або зупиняються. Ви можете перевірити це, використовуючи `docker ps` та вивчаючи кожен контейнер за допомогою `docker logs`. Для інших середовищ виконання контейнерів, див. [Налагодження вузлів Kubernetes за допомогою crictl](/docs/tasks/debug/debug-cluster/crictl/).

## `kubeadm` блокується під час видалення керованих контейнерів {#kubeadm-blocks-when-removing-managed-containers}

Наступне може трапитися, якщо середовище виконання контейнерів зупиняється і не видаляє жодних керованих контейнерів Kubernetes:

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

Можливий варіант вирішення — перезапустити середовище виконання контейнерів, а потім знову запустити `kubeadm reset`. Ви також можете використовувати `crictl` для налагодження стану середовища виконання контейнерів. Див. [Налагодження вузлів Kubernetes за допомогою crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Podʼи у стані `RunContainerError`, `CrashLoopBackOff` або `Error` {#pods-in-runcontainererror-crashloopbackoff-or-error-state}

Відразу після виконання `kubeadm init` не повинно бути жодних контейнерів у таких станах.

- Якщо є контейнери в одному з цих станів _відразу після_ `kubeadm init`, будь ласка, створіть тікет в репозиторії kubeadm. `coredns` (або `kube-dns`) повинен перебувати у стані `Pending` до моменту розгортання додатка для мережі.
- Якщо ви бачите контейнери у стані `RunContainerError`, `CrashLoopBackOff` або `Error` після розгортання додатка для мережі та нічого не відбувається з `coredns` (або `kube-dns`), дуже ймовірно, що додаток Pod Network, який ви встановили, є пошкодженим. Можливо, вам потрібно надати йому більше привілеїв RBAC або використовувати новішу версію. Будь ласка, створіть тікет в системі відстеження проблем постачальника Pod Network та очікуйте розвʼязання проблеми там.

## `coredns` застрягає у стані `Pending` {#coredns-is-stuck-in-the-pending-state}

Це **очікувано** і є частиною дизайну. kubeadm є агностичним до мережі, тому адміністратор повинен [встановити вибраний додаток для мережі](/docs/concepts/cluster-administration/addons/) за власним вибором. Вам потрібно встановити Pod Network, перш ніж `coredns` може бути повністю розгорнутим. Таким чином, стан `Pending` перед налаштуванням мережі є нормальним.

## Сервіси `HostPort` не працюють {#hostport-services-do-not-work}

Функціональність `HostPort` та `HostIP` доступна залежно від вашого провайдера Pod Network. Будь ласка, звʼяжіться з автором додатка Pod Network, щоб дізнатися, чи
функціональність `HostPort` та `HostIP` доступна.

Перевірено, що Calico, Canal та Flannel CNI підтримують HostPort.

Для отримання додаткової інформації перегляньте [документацію CNI portmap](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Якщо ваш постачальник мережі не підтримує втулок CNI portmap, можливо, вам доведеться використовувати [функцію NodePort для сервісів](/docs/concepts/services-networking/service/#type-nodeport) або використовуйте `HostNetwork=true`.

## До Podʼів неможливо отримати доступ за їх Service IP {#pods-are-not-accessible-via-their-service-ip}

- Багато додатків для мережі ще не увімкнули [режим hairpin](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip), який дозволяє Podʼам звертатися до себе за їх Service IP. Це повʼязано з [CNI](https://github.com/containernetworking/cni/issues/476). Будь ласка, звʼяжіться з постачальником додатка для мережі, щоб дізнатися про останній статус підтримки режиму hairpin.

- Якщо ви використовуєте VirtualBox (безпосередньо, або через Vagrant), вам слід переконатися, що `hostname -i` повертає маршрутизовану IP-адресу. Типово перший інтерфейс підключений до немаршрутизованої мережі тільки для хосту. Як тимчасовий варіант, ви можете змінити `/etc/hosts`, подивіться цей [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) для прикладу.

## Помилки сертифіката TLS {#tls-certificate-errors}

Наступна помилка вказує на можливу несумісність сертифікатів.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Перевірте, що файл `$HOME/.kube/config` містить дійсний сертифікат, та перегенеруйте сертифікат за необхідності. Сертифікати у файлі конфігурації kubeconfig закодовані у форматі base64. Команда `base64 --decode` може бути використана для декодування сертифіката, а `openssl x509 -text -noout` може бути використано для перегляду інформації про сертифікат.

- Скасуйте змінну середовища `KUBECONFIG` за допомогою:

  ```sh
  unset KUBECONFIG
  ```

  Або встановіть його в типове розташування `KUBECONFIG`:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Іншим обхідним методом є перезапис наявного `kubeconfig` для користувача "admin":

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Помилка ротації сертифіката клієнта Kubelet {#kubelet-client-cert}

Стандартно `kubeadm` налаштовує `kubelet` на автоматичну ротацію сертифікатів клієнта за допомогою символічного посилання `/var/lib/kubelet/pki/kubelet-client-current.pem`, вказаного в `/etc/kubernetes/kubelet.conf`. Якщо цей процес ротації завершиться невдачею, ви можете побачити помилки, такі як `x509: certificate has expired or is not yet valid` в журналах `kube-apiserver`. Щоб виправити цю проблему, слід виконати наступні кроки:

1. Зробіть резервну копію та видаліть файли `/etc/kubernetes/kubelet.conf` та `/var/lib/kubelet/pki/kubelet-client*` з несправного вузла.
2. З робочого вузла панелі управління кластера, де є `/etc/kubernetes/pki/ca.key`, виконайте `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`. `$NODE` повинно бути встановлено на імʼя наявного несправного вузла в кластері. Вручну змініть отриманий `kubelet.conf`, щоб відкоригувати імʼя та endpoint сервера, або передайте `kubeconfig user --config` (див. see [Створення файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). Якщо в у вашому кластері немає `ca.key`, ви повинні вручну підписати вбудовані сертифікати в `kubelet.conf`.
3. Скопіюйте цей отриманий `kubelet.conf` в `/etc/kubernetes/kubelet.conf` на несправному вузлі.
4. Перезапустіть `kubelet` (`systemctl restart kubelet`) на несправному вузлі та зачекайте, доки `/var/lib/kubelet/pki/kubelet-client-current.pem` буде відновлено.
5. Вручну відредагуйте `kubelet.conf`, щоб вказати на обертані сертифікати клієнта `kubelet`, замінивши `client-certificate-data` та `client-key-data` на:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

6. Перезапустіть `kubelet`.
7. Переконайтеся, що вузол стає `Ready`.

## Типовий мережевий інтерфейс NIC при використанні Flannel як мережі для Podʼів у Vagrant {#default-nic-when-using-flannel-as-the-pod-network-in-vagrant}

Наступна помилка може свідчити про те, що щось пішло не так у мережі Podʼів:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Якщо ви використовуєте Flannel як мережу для Podʼів у Vagrant, тоді вам доведеться вказати типове імʼя інтерфейсу для Flannel.

  Зазвичай Vagrant призначає два інтерфейси всім віртуальним машинам. Перший, для якого всі хости мають IP-адресу `10.0.2.15`, призначено для зовнішнього трафіку, який проходить через NAT.

  Це може призвести до проблем із Flannel, яка стандартно він обирає перший інтерфейс на хості. Це призводить до того, що всі хости вважають, що у них однакова публічна IP-адреса. Щоб цього уникнути, передайте прапорець `--iface eth1` для Flannel, щоб обрати другий інтерфейс.

## Непублічні IP-адреси для контейнерів {#non-public-ip-used-for-containers}

У деяких ситуаціях команди `kubectl logs` та `kubectl run` можуть повертати помилки на функціональному кластері:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Це може бути викликано використанням Kubernetes IP-адреси, яка не може взаємодіяти з іншими IP-адресами на одній підмережі, можливо, через політику провайдера машин.
- DigitalOcean призначає публічний IP для `eth0`, а також приватний IP для внутрішнього використання як анкера для їхньої функції змінного IP. Однак, `kubelet` вибере останній як `InternalIP` вузла замість першого.

  Використовуйте `ip addr show` для перевірки цього сценарію, а не `ifconfig`, оскільки `ifconfig` не показує обрану адресу IP для аліаса. Альтернативно, API-точка, специфічна для DigitalOcean, дозволяє запитувати анкер IP-адресу з машини:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Обхідним рішенням є повідомлення `kubelet`, яку IP використовувати за допомогою `--node-ip`. Коли використовується DigitalOcean, це може бути публічний IP (призначений `eth0`) або приватний IP (призначений `eth1`), якщо ви хочете використовувати додаткову приватну мережу. Розділ `kubeletExtraArgs` структури kubeadm [`NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions) може бути використаний для цього.

  Потім перезапустіть `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Podʼи `coredns` перебувають у стані `CrashLoopBackOff` або `Error` {#coredns-pods-have-crashloopbackoff-or-error-state}

Якщо у вас є вузли, які працюють із SELinux та старішою версією Docker, ви можете стикнутися зі сценарієм, де Podʼи `coredns` не запускаються. Щоб вирішити це, ви можете спробувати один з наступних варіантів:

- Оновіться до [новішої версії Docker](/docs/setup/production-environment/container-runtimes/#docker).

- [Вимкніть SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Змініть розгортання `coredns`, встановивши `allowPrivilegeEscalation` в `true`:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

Іншою причиною того, що CoreDNS має `CrashLoopBackOff`, є те, що Pod CoreDNS, розгорнутий в Kubernetes, виявляє цикл. [Існують різні обхідні варіанти](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters), щоб уникнути спроб перезапуску Podʼа CoreDNS кожного разу, коли CoreDNS виявляє цикл та виходить.

{{< warning >}}
Вимкнення SELinux або встановлення `allowPrivilegeEscalation` в `true` може піддавати ризику безпеку вашого кластера.
{{< /warning >}}

## Podʼи etcd постійно перезапускаються {#etcd-pods-restart-contantly}

Якщо ви стикаєтеся з такою помилкою:

```console
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

Ця проблема виникає, якщо ви використовуєте CentOS 7 з Docker 1.13.1.84. Ця версія Docker може завадити kubelet виконуватися в контейнері etcd.

Для усунення цієї проблеми виберіть один з наступних варіантів:

- Поверніться до попередньої версії Docker, наприклад, 1.13.1-75

  ```bash
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Встановіть одну з новіших рекомендованих версій, наприклад 18.06:

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## Неможливо передати розділений комою список значень аргументів під прапорцем `--component-extra-args` {#not-possible-to-pass-comma-separated-list-of-values-to-arguments-inside-a-component-extra-args-flag}

Прапорці `kubeadm init`, такі як `--component-extra-args`, дозволяють передавати власні аргументи компоненту панелі управління, наприклад, kube-apiserver. Однак цей механізм обмежений через тип, який використовується для розбору значень (`mapStringString`).

Якщо ви вирішите передати аргумент, який підтримує кілька значень, розділених комами, такий як `--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`, цей прапорець видасть помилку `flag: malformed pair, expect string=string`. Це відбувається через те, що список аргументів для `--apiserver-extra-args` очікує пари `key=value`, і в цьому випадку `NamespacesExists` розглядається як ключ, якому не вистачає значення.

У іншому випадку ви можете спробувати розділити пари `key=value` так: `--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`, але це призведе до того, що ключ `enable-admission-plugins` матиме лише значення `NamespaceExists`.

Відомий обхід цього — використання [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm.

## kube-proxy плануєтья до того, як вузол ініціалізовано cloud-controller-manager {#kube-proxy-scheduled-before-node-is-initialized-by-cloud-controller-manager}

У сценаріях хмарних провайдерів kube-proxy може виявитися запланованим на нових робочих вузлах до того, як cloud-controller-manager ініціалізує адреси вузла. Це призводить до того, що kube-proxy не може належним чином отримати IP-адресу вузла, і це має негативний вплив на функцію проксі, що керує балансуванням навантаження.

У kube-proxy Pods можна побачити наступну помилку:

```console
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Відомий варіант рішення — виправлення DaemonSet kube-proxy, щоб дозволити його планування на вузлах панелі управління незалежно від їхніх умов, утримуючи його подальше від інших вузлів, доки їхні початкові умови зберігаються:

```bash
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

Тікет, що відстежує цю проблему, розташовано [тут](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` монтується тільки для читання на вузлах {#usr-mounted-read-only}

У дистрибутивах Linux, таких як Fedora CoreOS або Flatcar Container Linux, тека `/usr` монтується як файлова система тільки для читання. Для [підтримки flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) компоненти Kubernetes, такі як kubelet і kube-controller-manager, використовують типовий шлях `/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, проте тека flex-volume _має бути доступною для запису_, щоб ця функція працювала.

{{< note >}}
У випуску Kubernetes v1.23 функцію FlexVolume було визнано застарілою.
{{< /note >}}

Для усунення цієї проблеми ви можете налаштувати теку flex-volume, використовуючи [файл конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm.

На основному вузлі панелі управління (створеному за допомогою `kubeadm init`) передайте наступний файл, використовуючи параметр `--config`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

При долученні вузлів:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Альтернативно ви можете змінити файл `/etc/fstab`, щоб зробити монтування `/usr` доступним для запису, проте будьте обізнані, що це змінює принцип дизайну дистрибутиву Linux.

## `kubeadm upgrade plan` виводить повідомлення про помилку `context deadline exceeded` {#kubeadm-upgrade-plan-prints-out-context-deadline-exceeded-error-message}

Це повідомлення про помилку виводиться при оновленні кластера Kubernetes за допомогою `kubeadm` у випадку використання зовнішнього etcd. Це не критична помилка і виникає через те, що старі версії `kubeadm` виконують перевірку версії зовнішнього кластера etcd. Ви можете продовжити з `kubeadm upgrade apply ...`.

Цю проблему виправлено у версії 1.19.

## `kubeadm reset` відмонтовує `/var/lib/kubelet` {#kubeadm-reset-unmounts-var-lib-kubelet}

Якщо `/var/lib/kubelet` має точку монтування, виконання `kubeadm reset` фактично відмонтує його.

Для уникнення цієї проблеми повторно замонтуйте теку `/var/lib/kubelet` після виконання операції `kubeadm reset`.

Це вдосконалення було введено в kubeadm 1.15. Проблема виправлена в 1.20.

## Неможливо безпечно використовувати metrics-server в кластері kubeadm {#cannot-use-metrics-server-securely-in-a-kubeadm-cluster}

У кластері kubeadm [metrics-server](https://github.com/kubernetes-sigs/metrics-server) може бути використаний в небезпечний спосіб, передаючи йому параметр `--kubelet-insecure-tls`. Це не рекомендується для промислових кластерів.

Якщо ви хочете використовувати TLS між metrics-server та kubelet, виникає проблема, оскільки kubeadm розгортає самопідписний службовий сертифікат для kubelet. Це може призвести до наступних помилок з боку metrics-server:

```console
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

Дивіться [Увімкнення підписаних службових сертифікатів kubelet](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs), щоб зрозуміти, як налаштувати kubelet в кластері kubeadm для отримання належно підписаних службових сертифікатів.

Також перегляньте [Як запустити metrics-server безпечно](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## Оновлення не вдається через незмінність хешу etcd {#upgrade-fails-due-to-etcd-hash-not-changing}

Це стосується лише оновлення вузла панелі управління за допомогою бінарного файлу kubeadm v1.28.3 або пізніше, при умові, що вузол в цей час керується версіями kubeadm v1.28.0, v1.28.1 або v1.28.2.

Ось повідомлення про помилку, яке може виникнути:

```console
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

Причина цієї помилки полягає в тому, що пошкоджені версії генерують файл маніфесту etcd із небажаними стандартними в PodSpec. Це призводить до різниці в порівнянні маніфестів, і kubeadm буде очікувати зміни хешу в Pod, але kubelet ніколи не оновить хеш.

Є два способи обійти цю проблему, якщо ви бачите її у своєму кластері:

- Оновлення etcd може бути пропущено між пошкодженими версіями та v1.28.3 (або пізніше) за допомогою:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Це не рекомендується у випадку, якщо пізніше патч-версії v1.28 вводять нову версію etcd.

- Перед оновленням виправте маніфест для статичного Pod etcd, щоб видалити стандартні проблемні атрибути:

   ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

Більше інформації можна знайти в [тікеті](https://github.com/kubernetes/kubeadm/issues/2927) для цієї помилки.
