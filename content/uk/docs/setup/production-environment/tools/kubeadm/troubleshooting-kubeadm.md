---
title: Усунення несправностей kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

Як і з будь-якою програмою, під час встановлення або використання kubeadm ви можете натрапити на помилку. На цій сторінці перелічено деякі поширені сценарії збоїв і наведено кроки, які допоможуть зрозуміти та виправити проблему.

Якщо вашої проблеми немає в переліку нижче, виконайте такі кроки:

- Якщо ви вважаєте, що ваша проблема — це помилка в kubeadm:
  - Перейдіть на [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) і пошукайте серед наявних тікетів.
  - Якщо такого тікета немає, [створіть його](https://github.com/kubernetes/kubeadm/issues/new) за шаблоном.

- Якщо ви не впевнені, як працює kubeadm, можете запитати в [Slack](https://slack.k8s.io/) у каналі `#kubeadm` або поставити питання на [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Додайте відповідні теґи, як-от `#kubernetes` і `#kubeadm`, щоб вам могли допомогти.

<!-- body -->

## Неможливо приєднати вузол v1.18 до кластера v1.17 через відсутність RBAC {#not-possible-to-join-a-v1-18-node-to-a-v1-17-cluster-due-to-missing-rbac}

У v1.18 kubeadm додав захист від приєднання вузла до кластера, якщо вузол з таким самим імʼям уже існує. Для цього довелося додати RBAC, щоб користувач bootstrap-token міг виконувати GET обʼєкта Node.

Однак через це `kubeadm join` з v1.18 не може приєднатися до кластера, створеного kubeadm v1.17.

Щоб обійти цю проблему, є два варіанти:

Виконайте `kubeadm init phase bootstrap-token` на вузлі панелі управління за допомогою kubeadm v1.18. Зауважте, що це також вмикає решту дозволів bootstrap-token.

або

Застосуйте такий RBAC вручну за допомогою `kubectl apply -f ...`:

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

## `ebtables` або подібний виконуваний файл не знайдено під час встановлення {#ebtables-or-some-similar-executable-not-found-during-installation}

Якщо під час виконання `kubeadm init` ви бачите такі попередження:

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Можливо, на вашому вузлі бракує `ebtables`, `ethtool` або подібного виконуваного файлу. Їх можна встановити такими командами:

- Для користувачів Ubuntu/Debian виконайте `apt install ebtables ethtool`.
- Для користувачів CentOS/Fedora виконайте `dnf install ebtables ethtool`.

## kubeadm блокується в очікуванні панелі управління під час встановлення {#kubeadm-blocks-waiting-for-control-plane-during-installation}

Якщо ви помітили, що `kubeadm init` зависає після виведення такого рядка:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Причин може бути кілька. Найпоширеніші з них:

- проблеми з мережевим зʼєднанням. Перш ніж продовжити, переконайтеся, що ваша машина має повне мережеве зʼєднання.
- контейнери панелі управління циклічно аварійно завершуються (crashloop) або зависають. Це можна перевірити, виконавши `docker ps` і дослідивши кожен контейнер за допомогою `docker logs`. Для інших середовищ виконання контейнерів див. [Налагодження вузлів Kubernetes за допомогою crictl](/docs/tasks/debug/debug-cluster/crictl/).

## kubeadm блокується під час видалення керованих контейнерів {#kubeadm-blocks-when-removing-managed-containers}

Таке може статися, якщо середовище виконання контейнерів зупиняється і не видаляє контейнери, якими керує Kubernetes:

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

Можливе рішення — перезапустити середовище виконання контейнерів, а потім знову виконати `kubeadm reset`. Також для налагодження стану середовища виконання контейнерів можна використати `crictl`. Див. [Налагодження вузлів Kubernetes за допомогою crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Podʼи у стані `RunContainerError`, `CrashLoopBackOff` або `Error` {#pods-in-runcontainererror-crashloopbackoff-or-error-state}

Одразу після `kubeadm init` не має бути жодних Podʼів у цих станах.

- Якщо _одразу після_ `kubeadm init` є Podʼи в одному з цих станів, створіть тікет у репозиторії kubeadm. `coredns` (або `kube-dns`) має перебувати в стані `Pending`, доки ви не розгорнете мережеву надбудову.
- Якщо ви бачите Podʼи в стані `RunContainerError`, `CrashLoopBackOff` або `Error` після розгортання мережевої надбудови, а з `coredns` (або `kube-dns`) нічого не відбувається, дуже ймовірно, що встановлена вами мережева надбудова для Podʼів якось пошкоджена. Можливо, їй потрібно надати більше привілеїв RBAC або використати новішу версію. Створіть тікет у системі відстеження проблем постачальника мережі для Podʼів і розберіться з проблемою там.

## `coredns` застрягає у стані `Pending` {#coredns-is-stuck-in-the-pending-state}

Це **очікувано** і є частиною задуму. kubeadm не залежить від постачальника мережі, тому адміністратор має [встановити мережеву надбудову для Podʼів](/docs/concepts/cluster-administration/addons/) на свій вибір. Перш ніж CoreDNS можна буде повністю розгорнути, потрібно встановити мережу для Podʼів. Звідси й стан `Pending` до налаштування мережі.

## Сервіси `HostPort` не працюють {#hostport-services-do-not-work}

Функціональність `HostPort` і `HostIP` доступна залежно від вашого постачальника мережі для Podʼів. Звʼяжіться з автором мережевої надбудови для Podʼів, щоб дізнатися, чи доступна функціональність `HostPort` і `HostIP`.

Перевірено, що постачальники CNI Calico, Canal і Flannel підтримують HostPort.

Докладніше див. [документацію CNI portmap](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Якщо ваш постачальник мережі не підтримує втулок CNI portmap, можливо, доведеться скористатися [можливістю NodePort для Service](/docs/concepts/services-networking/service/#type-nodeport) або використати `HostNetwork=true`.

## Podʼи недоступні через їхню Service IP {#pods-are-not-accessible-via-their-service-ip}

- Багато мережевих надбудов ще не вмикають [режим hairpin](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip), який дає змогу Podʼам звертатися до самих себе через їхню Service IP. Це проблема, повʼязана з [CNI](https://github.com/containernetworking/cni/issues/476). Звʼяжіться з постачальником мережевої надбудови, щоб дізнатися актуальний стан підтримки режиму hairpin.

- Якщо ви використовуєте VirtualBox (безпосередньо або через Vagrant), потрібно переконатися, що `hostname -i` повертає маршрутизовану IP-адресу. Стандартно перший інтерфейс підключено до немаршрутизованої мережі лише для хоста (host-only). Як обхідний шлях, можна змінити `/etc/hosts`; приклад див. у цьому [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11).

## Помилки сертифіката TLS {#tls-certificate-errors}

Така помилка вказує на можливу невідповідність сертифікатів.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Переконайтеся, що файл `$HOME/.kube/config` містить дійсний сертифікат, і за потреби перегенеруйте сертифікат. Сертифікати у файлі kubeconfig закодовано в base64. Для декодування сертифіката можна використати команду `base64 --decode`, а для перегляду інформації про сертифікат — `openssl x509 -text -noout`.

- Скиньте змінну середовища `KUBECONFIG` за допомогою:

  ```sh
  unset KUBECONFIG
  ```

  Або встановіть її на стандартне розташування `KUBECONFIG`:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Інший обхідний шлях — перезаписати наявний `kubeconfig` для користувача "admin":

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Помилка ротації сертифіката клієнта kubelet {#kubelet-client-cert}

Стандартно kubeadm налаштовує kubelet на автоматичну ротацію сертифікатів клієнта за допомогою символічного посилання `/var/lib/kubelet/pki/kubelet-client-current.pem`, вказаного в `/etc/kubernetes/kubelet.conf`. Якщо цей процес ротації не вдається, у журналах kube-apiserver можуть зʼявитися помилки, як-от `x509: certificate has expired or is not yet valid`. Щоб виправити проблему, виконайте такі кроки:

1. Зробіть резервну копію та видаліть файли `/etc/kubernetes/kubelet.conf` та `/var/lib/kubelet/pki/kubelet-client*` з несправного вузла.
1. На робочому вузлі панелі управління в кластері, де є `/etc/kubernetes/pki/ca.key`, виконайте `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`. `$NODE` має містити імʼя наявного несправного вузла в кластері. Вручну змініть отриманий `kubelet.conf`, щоб скоригувати імʼя кластера та точку доступу сервера, або передайте `kubeconfig user --config` (див. [Генерація файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). Якщо у вашому кластері немає `ca.key`, вбудовані сертифікати в `kubelet.conf` потрібно підписати зовні.
1. Скопіюйте отриманий `kubelet.conf` в `/etc/kubernetes/kubelet.conf` на несправному вузлі.
1. Перезапустіть kubelet (`systemctl restart kubelet`) на несправному вузлі та зачекайте, доки `/var/lib/kubelet/pki/kubelet-client-current.pem` буде створено повторно.
1. Вручну відредагуйте `kubelet.conf`, щоб він вказував на сертифікати клієнта kubelet після ротації, замінивши `client-certificate-data` і `client-key-data` на:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. Перезапустіть kubelet.
1. Переконайтеся, що вузол переходить у стан `Ready`.

## Стандартний NIC під час використання flannel як мережі для Podʼів у Vagrant {#default-nic-when-using-flannel-as-the-pod-network-in-vagrant}

Така помилка може вказувати на те, що з мережею для Podʼів щось не так:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Якщо ви використовуєте flannel як мережу для Podʼів у Vagrant, потрібно вказати стандартне імʼя інтерфейсу для flannel.

  Зазвичай Vagrant призначає два інтерфейси всім віртуальним машинам. Перший, для якого всі хости мають IP-адресу `10.0.2.15`, призначено для зовнішнього трафіку, який проходить через NAT.

  Це може спричинити проблеми з flannel, який стандартно використовує перший інтерфейс хоста. Через це всі хости вважають, що мають однакову публічну IP-адресу. Щоб цього уникнути, передайте flannel прапорець `--iface eth1`, щоб було вибрано другий інтерфейс.

## Для контейнерів використовується непублічна IP-адреса {#non-public-ip-used-for-containers}

У деяких ситуаціях команди `kubectl logs` і `kubectl run` можуть повертати такі помилки в кластері, який в іншому працює справно:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Це може статися через те, що Kubernetes використовує IP-адресу, яка не може взаємодіяти з іншими IP-адресами, здавалося б, у тій самій підмережі, можливо, через політику постачальника машин.
- DigitalOcean призначає `eth0` публічну IP-адресу, а також приватну для внутрішнього використання як якір для своєї функції плаваючих IP (floating IP), однак `kubelet` вибере останню як `InternalIP` вузла замість публічної.

  Щоб перевірити цей сценарій, використовуйте `ip addr show` замість `ifconfig`, оскільки `ifconfig` не показує проблемну IP-адресу аліасу. Або ж специфічна для DigitalOcean точка доступу API дає змогу запитати IP-адресу якоря з droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Обхідний шлях — вказати `kubelet`, яку IP-адресу використовувати, за допомогою `--node-ip`. У DigitalOcean це може бути публічна адреса (призначена `eth0`) або приватна (призначена `eth1`), якщо ви хочете використовувати необовʼязкову приватну мережу. Для цього можна використати розділ `kubeletExtraArgs` [структури `NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions) kubeadm.

  Потім перезапустіть `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Podʼи `coredns` перебувають у стані `CrashLoopBackOff` або `Error` {#coredns-pods-have-crashloopbackoff-or-error-state}

Якщо у вас є вузли із SELinux і старішою версією Docker, може статися так, що Podʼи `coredns` не запускаються. Щоб розвʼязати це, спробуйте один із таких варіантів:

- Оновіться до [новішої версії Docker](/docs/setup/production-environment/container-runtimes/#docker).

- [Вимкніть SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Змініть Deployment `coredns`, встановивши `allowPrivilegeEscalation` у `true`:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

Ще одна причина `CrashLoopBackOff` у CoreDNS — коли Pod CoreDNS, розгорнутий у Kubernetes, виявляє цикл. Доступні [кілька обхідних шляхів](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters), щоб Kubernetes не намагався перезапускати Pod CoreDNS щоразу, коли CoreDNS виявляє цикл і завершує роботу.

{{< warning >}}
Вимкнення SELinux або встановлення `allowPrivilegeEscalation` у `true` може поставити під загрозу безпеку вашого кластера.
{{< /warning >}}

## Podʼи etcd постійно перезапускаються {#etcd-pods-restart-continually}

Якщо ви стикаєтеся з такою помилкою:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

Ця проблема виникає, якщо ви використовуєте CentOS 7 з Docker 1.13.1.84. Ця версія Docker може не давати kubelet виконувати команди в контейнері etcd.

Щоб обійти проблему, виберіть один із таких варіантів:

- Поверніться до старішої версії Docker, наприклад 1.13.1-75

  ```
  dnf downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Встановіть одну з новіших рекомендованих версій, наприклад 18.06:

  ```bash
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  dnf install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## Неможливо передати розділений комами список значень аргументам у прапорці `--component-extra-args` {#not-possible-to-pass-a-comma-separated-list-of-values-to-arguments-inside-a-component-extra-args-flag}

Прапорці `kubeadm init`, як-от `--component-extra-args`, дають змогу передавати власні аргументи компоненту панелі управління, наприклад kube-apiserver. Однак цей механізм обмежений через базовий тип, який використовується для розбору значень (`mapStringString`).

Якщо ви вирішите передати аргумент, який підтримує кілька значень, розділених комами, такий як `--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`, цей прапорець видасть помилку `flag: malformed pair, expect string=string`. Це відбувається через те, що список аргументів для `--apiserver-extra-args` очікує пари `key=value`, і в цьому випадку `NamespacesExists` розглядається як ключ, якому не вистачає значення.

Або ж можна спробувати розділити пари `key=value` так: `--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`, але тоді ключ `enable-admission-plugins` матиме лише значення `NamespaceExists`.

Відомий обхідний шлях — використати [файл конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm.

## kube-proxy планується до того, як cloud-controller-manager ініціалізує вузол {#kube-proxy-scheduled-before-node-is-initialized-by-cloud-controller-manager}

У сценаріях із хмарними провайдерами kube-proxy може бути запланований на нові робочі вузли до того, як cloud-controller-manager ініціалізує адреси вузла. Через це kube-proxy не може правильно отримати IP-адресу вузла, що має побічні наслідки для функції проксі, яка керує балансувальниками навантаження.

У Podʼах kube-proxy можна побачити таку помилку:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Відоме рішення — застосувати патч до DaemonSet kube-proxy, щоб дозволити його планування на вузлах панелі управління незалежно від їхніх станів (conditions) і не допускати його на інші вузли, доки не зникнуть їхні початкові захисні стани:

```
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

Тікет для відстеження цієї проблеми — [тут](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` змонтовано лише для читання на вузлах {#usr-mounted-read-only}

У дистрибутивах Linux, як-от Fedora CoreOS або Flatcar Container Linux, тека `/usr` монтується як файлова система лише для читання. Для [підтримки flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) компоненти Kubernetes, як-от kubelet і kube-controller-manager, використовують стандартний шлях `/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, проте тека flex-volume _має бути доступною для запису_, щоб ця можливість працювала.

{{< note >}}
FlexVolume визнано застарілим у випуску Kubernetes v1.23.
{{< /note >}}

Щоб обійти цю проблему, можна налаштувати теку flex-volume за допомогою [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm.

На основному вузлі панелі управління (створеному за допомогою `kubeadm init`) передайте такий файл за допомогою `--config`:

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

На вузлах, що приєднуються:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Або ж можна змінити `/etc/fstab`, щоб змонтувати `/usr` з доступом для запису, але майте на увазі, що це змінює принцип дизайну дистрибутиву Linux.

## `kubeadm upgrade plan` виводить повідомлення про помилку `context deadline exceeded` {#kubeadm-upgrade-plan-prints-out-context-deadline-exceeded-error-message}

Це повідомлення про помилку показується під час оновлення кластера Kubernetes за допомогою `kubeadm`, якщо використовується зовнішній etcd. Це не критична помилка, і вона виникає через те, що старіші версії kubeadm перевіряють версію зовнішнього кластера etcd. Можна продовжити з `kubeadm upgrade apply ...`.

Цю проблему виправлено у версії 1.19.

## `kubeadm reset` відмонтовує `/var/lib/kubelet` {#kubeadm-reset-unmounts-var-lib-kubelet}

Якщо `/var/lib/kubelet` змонтовано, виконання `kubeadm reset` фактично відмонтує її.

Щоб обійти проблему, повторно змонтуйте теку `/var/lib/kubelet` після виконання операції `kubeadm reset`.

Це регресія, що зʼявилася в kubeadm 1.15. Проблему виправлено в 1.20.

## Неможливо безпечно використовувати metrics-server у кластері kubeadm {#cannot-use-the-metrics-server-securely-in-a-kubeadm-cluster}

У кластері kubeadm [metrics-server](https://github.com/kubernetes-sigs/metrics-server) можна використовувати небезпечно, передавши йому `--kubelet-insecure-tls`. Це не рекомендовано для промислових кластерів.

Якщо ви хочете використовувати TLS між metrics-server і kubelet, виникає проблема, оскільки kubeadm розгортає для kubelet самопідписаний службовий сертифікат (serving certificate). Через це з боку metrics-server можуть виникати такі помилки:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

Див. [Увімкнення підписаних службових сертифікатів kubelet](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs), щоб дізнатися, як налаштувати kubelet у кластері kubeadm, щоб вони мали належно підписані службові сертифікати.

Також див. [Як запустити metrics-server безпечно](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## Оновлення не вдається, бо хеш etcd не змінюється {#upgrade-fails-due-to-etcd-hash-not-changing}

Стосується лише оновлення вузла панелі управління за допомогою бінарного файлу kubeadm v1.28.3 або новішого, коли вузол наразі керується kubeadm версій v1.28.0, v1.28.1 або v1.28.2.

Ось повідомлення про помилку, яке ви можете побачити:

```
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

Причина цієї помилки в тому, що уражені версії генерують файл маніфесту etcd з небажаними стандартними значеннями в PodSpec. Через це порівняння маніфестів покаже різницю, і kubeadm очікуватиме зміни хешу Podʼа, але kubelet ніколи не оновить хеш.

Якщо ви бачите цю проблему у своєму кластері, є два способи її обійти:

- Оновлення etcd між ураженими версіями та v1.28.3 (або новішою) можна пропустити за допомогою:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Це не рекомендовано, якщо новішою патч-версією v1.28 було впроваджено нову версію etcd.

- Перед оновленням застосуйте патч до маніфесту статичного Podʼа etcd, щоб прибрати проблемні атрибути зі стандартними значеннями:

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

Докладніше див. [тікет для відстеження](https://github.com/kubernetes/kubeadm/issues/2927) цієї помилки.
