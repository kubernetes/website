---
title: Налаштування високодоступного кластера etcd за допомогою kubeadm
content_type: task
weight: 70
---

<!-- overview -->

Стандартно kubeadm запускає локальний екземпляр etcd на кожному вузлі панелі управління. Також можна вважати кластер etcd зовнішнім і розгортати екземпляри etcd на окремих хостах. Відмінності між цими двома підходами описано на сторінці [Варіанти топології високої доступності](/docs/setup/production-environment/tools/kubeadm/ha-topology).

У цьому завданні описано процес створення зовнішнього високодоступного кластера etcd із трьох учасників, який kubeadm може використовувати під час створення кластера.

## {{% heading "prerequisites" %}} {#before-you-begin}

- Три хости, які можуть взаємодіяти між собою через TCP-порти 2379 та 2380. У цьому документі передбачено, що використовуються ці стандартні порти. Однак їх можна змінити у файлі конфігурації kubeadm.
- На кожному хості мають бути встановлені systemd і сумісна з bash оболонка.
- На кожному хості мають бути [встановлені середовище виконання контейнерів, kubelet і kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Кожен хост має мати доступ до реєстру образів контейнерів Kubernetes (`registry.k8s.io`), або ж потрібно отримати перелік і завантажити потрібний образ etcd за допомогою `kubeadm config images list/pull`. У цьому посібнику екземпляри etcd буде налаштовано як [статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/), якими керує kubelet.
- Певна інфраструктура для копіювання файлів між хостами. Наприклад, цю вимогу можуть задовольнити `ssh` і `scp`.

<!-- steps -->

## Налаштування кластера {#setting-up-the-cluster}

Загальний підхід — згенерувати всі сертифікати на одному вузлі й розповсюдити лише _потрібні_ файли на інші вузли.

{{< note >}}
kubeadm містить усі необхідні криптографічні механізми для генерації описаних нижче сертифікатів; для цього прикладу не потрібні інші криптографічні інструменти.
{{< /note >}}

{{< note >}}
У прикладах нижче використовуються адреси IPv4, але ви також можете налаштувати kubeadm, kubelet та etcd на використання адрес IPv6. Подвійний стек підтримують деякі параметри Kubernetes, але не etcd. Докладніше про підтримку подвійного стека в Kubernetes див. [Підтримка подвійного стека за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Налаштуйте kubelet як менеджер сервісів для etcd.

   {{< note >}}Це потрібно зробити на кожному хості, на якому повинен працювати etcd.{{< /note >}}
   Оскільки etcd було створено першим, потрібно перевизначити пріоритет сервісу, створивши новий файл юніта з вищим пріоритетом, ніж файл юніта kubelet, наданий kubeadm.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Замініть "systemd" на драйвер cgroup вашого середовища виконання контейнерів. Стандартне значення в kubelet — "cgroupfs".
   # За потреби замініть значення "containerRuntimeEndpoint" для іншого середовища виконання контейнерів.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   Перевірте статус kubelet, щоб переконатися, що він працює.

   ```sh
   systemctl status kubelet
   ```

1. Створіть файли конфігурації для kubeadm.

   Згенеруйте за допомогою такого скрипту один файл конфігурації kubeadm для кожного хоста, на якому працюватиме учасник etcd.

   ```sh
   # Замініть HOST0, HOST1 та HOST2 на IP-адреси ваших хостів
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Замініть NAME0, NAME1 та NAME2 на імена ваших хостів
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Створіть тимчасові теки для зберігання файлів, які потраплять на інші хости
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. Згенеруйте центр сертифікації (CA).

   Якщо у вас уже є CA, то єдине, що потрібно зробити, — скопіювати файли `crt` і `key` цього CA в `/etc/kubernetes/pki/etcd/ca.crt` та `/etc/kubernetes/pki/etcd/ca.key`. Після копіювання цих файлів перейдіть до наступного кроку — «Створіть сертифікати для кожного учасника».

   Якщо у вас ще немає CA, виконайте цю команду на `$HOST0` (де ви згенерували файли конфігурації для kubeadm).

   ```
   kubeadm init phase certs etcd-ca
   ```

   Буде створено два файли:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Створіть сертифікати для кожного учасника.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # приберіть сертифікати, які не можна використовувати повторно
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # Немає потреби переміщувати сертифікати, оскільки вони призначені для HOST0

   # приберіть сертифікати, які не слід копіювати з цього хоста
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Скопіюйте сертифікати та конфігурації kubeadm.

   Сертифікати згенеровано, і тепер їх потрібно перемістити на відповідні хости.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Переконайтеся, що всі очікувані файли існують.

   Повний перелік потрібних файлів на `$HOST0`:

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   На `$HOST1`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   На `$HOST2`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Створіть маніфести статичних Podʼів.

   Тепер, коли сертифікати та конфігурації на місці, час створити маніфести. На кожному хості виконайте команду `kubeadm`, щоб згенерувати статичний маніфест для etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Необовʼязково: перевірте стан кластера.

    Якщо `etcdctl` недоступний, ви можете запустити цей інструмент в образі контейнера. Це можна зробити безпосередньо через середовище виконання контейнерів за допомогою інструменту на кшталт `crictl run`, а не через Kubernetes

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - Встановіть `${HOST0}` на IP-адресу хоста, який ви тестуєте.

## {{% heading "whatsnext" %}} {#what-s-next}

Коли у вас буде кластер etcd із 3 робочими учасниками, ви можете продовжити налаштування високодоступної панелі управління, використовуючи [метод зовнішнього etcd з kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
