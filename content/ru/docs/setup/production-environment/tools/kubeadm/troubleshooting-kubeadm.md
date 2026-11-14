---
title: Устранение неполадок kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

Как и при работе с любой программой, при установке или запуске kubeadm могут возникать ошибки.
На этой странице перечислены распространённые ситуации и действия, помогающие понять и устранить проблему.

Если вашей проблемы нет в списке, выполните следующие действия:

- Если вы считаете, что это ошибка kubeadm:
  - Найдите существующие обращения на [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues).
  - Если подходящего обращения нет, [создайте его](https://github.com/kubernetes/kubeadm/issues/new), следуя шаблону.

- Если вам непонятно, как работает kubeadm, задайте вопрос в канале `#kubeadm`
  в [Slack](https://slack.k8s.io/) или на [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes).
  Укажите подходящие теги, например `#kubernetes` и `#kubeadm`, чтобы вам могли помочь.

<!-- body -->

## Не удаётся присоединить узел v1.18 к кластеру v1.17 из-за отсутствующего RBAC {#not-possible-to-join-a-v118-node-to-a-v117-cluster-due-to-missing-rbac}

В v1.18 kubeadm стал предотвращать присоединение узла, если в кластере уже есть узел с таким именем.
Для этого пользователю bootstrap-token потребовались разрешения RBAC на GET объекта Node.

Однако из-за этого `kubeadm join` версии v1.18 не может присоединиться к кластеру,
созданному kubeadm v1.17.

Есть два способа обойти проблему:

Выполните `kubeadm init phase bootstrap-token` на узле управляющего слоя с kubeadm v1.18.
Учтите, что это также включает остальные разрешения bootstrap-token.

Или

Вручную примените следующую конфигурацию RBAC командой `kubectl apply -f ...`:

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

## При установке не найден `ebtables` или другой подобный исполняемый файл {#ebtables-or-some-similar-executable-not-found-during-installation}

Если при выполнении `kubeadm init` вы видите предупреждения:

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

возможно, на узле отсутствует `ebtables`, `ethtool` или другой подобный исполняемый файл.
Установить их можно следующими командами:

- Для Ubuntu/Debian: `apt install ebtables ethtool`.
- Для CentOS/Fedora: `dnf install ebtables ethtool`.

## kubeadm зависает в ожидании управляющего слоя при установке {#kubeadm-blocks-waiting-for-control-plane-during-installation}

Если `kubeadm init` зависает после вывода строки:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

причин может быть несколько. Наиболее распространённые:

- Проблемы сетевого соединения. Перед продолжением проверьте полную сетевую связность машины.
- Контейнеры управляющего слоя циклически завершаются с ошибкой или зависают.
  Проверьте их командой `docker ps` и исследуйте каждый с помощью `docker logs`.
  Для других сред выполнения см.
  [Отладка узлов Kubernetes с помощью crictl](/docs/tasks/debug/debug-cluster/crictl/).

## kubeadm зависает при удалении управляемых контейнеров {#kubeadm-blocks-when-removing-managed-containers}

Если среда выполнения контейнеров зависла и не удаляет контейнеры,
управляемые Kubernetes, возможна следующая ситуация:

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

Попробуйте перезапустить среду выполнения контейнеров, а затем повторить `kubeadm reset`.
Для диагностики её состояния также можно использовать `crictl`.
См. [Отладка узлов Kubernetes с помощью crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Поды в состоянии `RunContainerError`, `CrashLoopBackOff` или `Error` {#pods-in-runcontainererror-crashloopbackoff-or-error-state}

Сразу после `kubeadm init` подов в этих состояниях быть не должно.

- Если поды находятся в одном из этих состояний _сразу после_ `kubeadm init`,
  создайте обращение в репозитории kubeadm. `coredns` (или `kube-dns`) должен быть
  в состоянии `Pending` до развёртывания сетевого дополнения.
- Если после развёртывания сетевого дополнения поды находятся в состоянии
  `RunContainerError`, `CrashLoopBackOff` или `Error`, а с `coredns` (или `kube-dns`)
  ничего не происходит, скорее всего, установленное сетевое дополнение работает неправильно.
  Возможно, ему нужны дополнительные разрешения RBAC или более новая версия.
  Создайте обращение в системе отслеживания ошибок поставщика сетевого дополнения для разбора проблемы.

## `coredns` остаётся в состоянии `Pending` {#coredns-is-stuck-in-the-pending-state}

Это **ожидаемое** поведение. kubeadm не зависит от поставщика сети, поэтому администратор
должен [установить выбранное сетевое дополнение подов](/docs/concepts/cluster-administration/addons/).
Сеть подов необходима для полного развёртывания CoreDNS.
Поэтому до её настройки сохраняется состояние `Pending`.

## Сервисы `HostPort` не работают {#hostport-services-do-not-work}

Доступность функций `HostPort` и `HostIP` зависит от поставщика сети подов.
Уточните у автора сетевого дополнения, поддерживаются ли эти функции.

Поддержка HostPort проверена для поставщиков CNI Calico, Canal и Flannel.

Подробнее см. [документацию CNI portmap](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Если поставщик сети не поддерживает плагин portmap CNI, может потребоваться
[NodePort для сервисов](/docs/concepts/services-networking/service/#type-nodeport)
или `HostNetwork=true`.

## Поды недоступны по IP-адресу своего сервиса {#pods-are-not-accessible-via-their-service-ip}

- Многие сетевые дополнения ещё не включают
  [режим hairpin](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip),
  позволяющий подам обращаться к самим себе по IP-адресу сервиса.
  Это связано с [CNI](https://github.com/containernetworking/cni/issues/476).
  Уточните текущий статус поддержки hairpin у поставщика сетевого дополнения.

- При использовании VirtualBox напрямую или через Vagrant убедитесь, что `hostname -i`
  возвращает маршрутизируемый IP-адрес. По умолчанию первый интерфейс подключён
  к немаршрутизируемой сети только для хоста. Обойти это можно изменением `/etc/hosts`;
  пример приведён в [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11).

## Ошибки сертификатов TLS {#tls-certificate-errors}

Следующая ошибка может указывать на несоответствие сертификатов:

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Убедитесь, что `$HOME/.kube/config` содержит действительный сертификат,
  и при необходимости создайте сертификат заново. Сертификаты в kubeconfig
  закодированы в base64. Их можно декодировать командой `base64 --decode`,
  а сведения о сертификате просмотреть командой `openssl x509 -text -noout`.

- Удалите переменную окружения `KUBECONFIG`:

  ```sh
  unset KUBECONFIG
  ```

  Или задайте ей расположение `KUBECONFIG` по умолчанию:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Ещё один вариант — перезаписать существующий `kubeconfig` пользователя «admin»:

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Сбой ротации клиентского сертификата kubelet {#kubelet-client-cert}

По умолчанию kubeadm настраивает автоматическую ротацию клиентских сертификатов kubelet
через символическую ссылку `/var/lib/kubelet/pki/kubelet-client-current.pem`,
указанную в `/etc/kubernetes/kubelet.conf`. Если ротация не удалась, в логах kube-apiserver
могут появляться ошибки вроде `x509: certificate has expired or is not yet valid`.
Для исправления выполните следующие шаги:

1. Создайте резервные копии и удалите `/etc/kubernetes/kubelet.conf`
   и `/var/lib/kubelet/pki/kubelet-client*` с проблемного узла.
1. На работающем узле управляющего слоя с файлом `/etc/kubernetes/pki/ca.key` выполните
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   Задайте `$NODE` имя существующего проблемного узла кластера.
   Вручную скорректируйте имя кластера и конечную точку сервера в полученном `kubelet.conf`
   либо передайте `kubeconfig user --config` (см.
   [Создание файлов kubeconfig для дополнительных пользователей](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)).
   Если в кластере нет `ca.key`, подпишите встроенные в `kubelet.conf` сертификаты внешним способом.
1. Скопируйте полученный `kubelet.conf` в `/etc/kubernetes/kubelet.conf` на проблемном узле.
1. Перезапустите kubelet (`systemctl restart kubelet`) на проблемном узле
   и дождитесь повторного создания `/var/lib/kubelet/pki/kubelet-client-current.pem`.
1. Вручную измените `kubelet.conf`, чтобы он ссылался на ротируемые клиентские сертификаты kubelet,
   заменив `client-certificate-data` и `client-key-data` на:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. Перезапустите kubelet.
1. Убедитесь, что узел перешёл в состояние `Ready`.

## Сетевой интерфейс по умолчанию при использовании flannel в Vagrant {#default-nic-when-using-flannel-as-the-pod-network-in-vagrant}

Следующая ошибка может указывать на проблему в сети подов:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Если вы используете flannel как сеть подов внутри Vagrant,
  задайте для flannel имя интерфейса по умолчанию.

  Vagrant обычно назначает каждой виртуальной машине два интерфейса.
  Первый, с IP-адресом `10.0.2.15` на всех машинах, используется для внешнего трафика через NAT.

  Это может вызывать проблемы с flannel, который по умолчанию использует первый интерфейс машины.
  В результате все машины считают, что у них один и тот же общедоступный IP-адрес.
  Чтобы избежать этого, передайте flannel флаг `--iface eth1`, выбирающий второй интерфейс.

## Для контейнеров используется необщедоступный IP-адрес {#non-public-ip-used-for-containers}

Иногда в остальном работоспособном кластере команды `kubectl logs` и `kubectl run`
могут возвращать следующие ошибки:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Причиной может быть использование Kubernetes IP-адреса, не способного взаимодействовать
  с другими адресами в предположительно той же подсети, например из-за политики провайдера машин.
- DigitalOcean назначает `eth0` общедоступный IP-адрес и частный адрес,
  используемый как внутренний опорный адрес для плавающего IP.
  При этом `kubelet` выбирает частный адрес как `InternalIP` узла вместо общедоступного.

  Для проверки используйте `ip addr show`, а не `ifconfig`, поскольку `ifconfig`
  не показывает этот дополнительный IP-адрес. Также у DigitalOcean есть конечная точка API
  для запроса опорного IP-адреса из droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Для обхода проблемы задайте IP-адрес kubelet через `--node-ip`.
  В DigitalOcean это может быть общедоступный адрес `eth0` либо частный адрес `eth1`,
  если вы используете дополнительную частную сеть. Для этого подходит раздел `kubeletExtraArgs`
  [структуры `NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions) kubeadm.

  Затем перезапустите `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Поды `coredns` в состоянии `CrashLoopBackOff` или `Error` {#coredns-pods-have-crashloopbackoff-or-error-state}

На узлах с SELinux и старой версией Docker поды `coredns` могут не запускаться.
Попробуйте один из следующих вариантов:

- Обновите Docker до [более новой версии](/docs/setup/production-environment/container-runtimes/#docker).

- [Отключите SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Измените Deployment `coredns`, задав `allowPrivilegeEscalation` значение `true`:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

Ещё одна причина `CrashLoopBackOff` у CoreDNS — обнаружение цикла подом CoreDNS в Kubernetes.
Существует [несколько способов обхода](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters),
позволяющих избежать перезапусков пода Kubernetes каждый раз, когда CoreDNS обнаруживает цикл и завершается.

{{< warning >}}
Отключение SELinux или установка `allowPrivilegeEscalation` в `true`
может нарушить безопасность кластера.
{{< /warning >}}

## Поды etcd постоянно перезапускаются {#etcd-pods-restart-continually}

Если вы столкнулись со следующей ошибкой:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

она возникает при использовании CentOS 7 с Docker 1.13.1.84.
Эта версия Docker может мешать kubelet выполнять команды внутри контейнера etcd.

Для обхода выберите один из вариантов:

- Вернитесь к более ранней версии Docker, например 1.13.1-75:

  ```
  dnf downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Установите одну из более новых рекомендуемых версий, например 18.06:

  ```bash
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  dnf install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## Не удаётся передать список значений через запятую в аргументы флага `--component-extra-args` {#not-possible-to-pass-a-comma-separated-list-of-values-to-arguments-inside-a---component-extra-args-flag}

Флаги `kubeadm init`, такие как `--component-extra-args`, позволяют передавать
пользовательские аргументы компонентам управляющего слоя, например kube-apiserver.
Однако механизм ограничен используемым для разбора значений типом `mapStringString`.

Попытка передать аргумент с несколькими значениями через запятую, например
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`,
завершится ошибкой `flag: malformed pair, expect string=string`.
Список аргументов `--apiserver-extra-args` ожидает пары `key=value`,
и в данном случае `NamespacesExists` рассматривается как ключ без значения.

Можно попробовать разделить пары `key=value` так:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`,
но тогда ключ `enable-admission-plugins` получит только значение `NamespaceExists`.

Известный способ обхода — использование
[файла конфигурации kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).

## kube-proxy размещается до инициализации узла cloud-controller-manager {#kube-proxy-scheduled-before-node-is-initialized-by-cloud-controller-manager}

При использовании облачного провайдера kube-proxy может быть размещён на новых рабочих узлах
до того, как cloud-controller-manager инициализирует их адреса.
Из-за этого kube-proxy неправильно определяет IP-адрес узла,
что влияет на работу проксирования при управлении балансировщиками нагрузки.

В подах kube-proxy может появляться ошибка:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Известное решение — изменить DaemonSet kube-proxy, разрешив размещение на узлах
управляющего слоя независимо от их состояний, но не на остальных узлах,
пока не будут сняты начальные ограничения:

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

Обращение по этой проблеме находится [здесь](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` смонтирован на узлах только для чтения {#usr-mounted-read-only}

В дистрибутивах Linux, таких как Fedora CoreOS и Flatcar Container Linux,
каталог `/usr` смонтирован только для чтения. Для
[поддержки flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md)
компоненты Kubernetes, такие как kubelet и kube-controller-manager, используют
путь по умолчанию `/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`,
но для работы этой возможности каталог flex-volume _должен быть доступен для записи_.

{{< note >}}
FlexVolume объявлен устаревшим в Kubernetes v1.23.
{{< /note >}}

Для обхода проблемы настройте каталог flex-volume через
[файл конфигурации kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).

На первом узле управляющего слоя, создаваемом через `kubeadm init`,
передайте следующий файл параметром `--config`:

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

На присоединяемых узлах:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Другой вариант — изменить `/etc/fstab`, чтобы `/usr` монтировался с возможностью записи,
но это нарушает принцип устройства данного дистрибутива Linux.

## `kubeadm upgrade plan` выводит ошибку `context deadline exceeded` {#kubeadm-upgrade-plan-prints-out-context-deadline-exceeded-error-message}

Эта ошибка появляется при обновлении кластера Kubernetes с внешним etcd через `kubeadm`.
Она не критична и вызвана тем, что старые версии kubeadm проверяют версию внешнего кластера etcd.
Можно продолжить выполнение `kubeadm upgrade apply ...`.

Проблема исправлена в версии 1.19.

## `kubeadm reset` размонтирует `/var/lib/kubelet` {#kubeadm-reset-unmounts-varlibkubelet}

Если `/var/lib/kubelet` является точкой монтирования, выполнение `kubeadm reset` размонтирует её.

Для обхода повторно смонтируйте `/var/lib/kubelet` после `kubeadm reset`.

Это регрессия, появившаяся в kubeadm 1.15 и исправленная в 1.20.

## Не удаётся безопасно использовать metrics-server в кластере kubeadm {#cannot-use-the-metrics-server-securely-in-a-kubeadm-cluster}

В кластере kubeadm [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
можно использовать в небезопасном режиме, передав ему `--kubelet-insecure-tls`.
Это не рекомендуется для производственных кластеров.

При использовании TLS между metrics-server и kubelet возникает проблема:
kubeadm развёртывает для kubelet самоподписанный серверный сертификат.
Это может вызывать следующие ошибки на стороне metrics-server:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

О настройке kubelet с корректно подписанными серверными сертификатами см.
[Включение подписанных серверных сертификатов kubelet](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs).

См. также [Безопасный запуск metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## Обновление завершается ошибкой из-за неизменного хеша etcd {#upgrade-fails-due-to-etcd-hash-not-changing}

Это относится только к обновлению узла управляющего слоя с помощью kubeadm v1.28.3
или новее, если узлом сейчас управляет kubeadm v1.28.0, v1.28.1 или v1.28.2.

Возможное сообщение об ошибке:

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

Причина сбоя в том, что затронутые версии генерируют манифест etcd с нежелательными
значениями по умолчанию в PodSpec. При сравнении манифестов обнаруживается различие,
и kubeadm ожидает изменения хеша пода, однако kubelet его не обновляет.

Есть два способа обойти проблему:

- Пропустите обновление etcd при переходе с затронутых версий на v1.28.3 или новее:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Это не рекомендуется, если более поздний патч-релиз v1.28 содержит новую версию etcd.

- Перед обновлением измените манифест статического пода etcd, удалив проблемные атрибуты со значениями по умолчанию:

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

Подробнее см. [обращение по этой ошибке](https://github.com/kubernetes/kubeadm/issues/2927).
