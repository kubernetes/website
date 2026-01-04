---
title: Налаштування високодоступного кластера etcd за допомогою kubeadm
content_type: task
weight: 70
---

<!-- overview -->

Типово kubeadm запускає локальний екземпляр etcd на кожному вузлі панелі управління. Також можливо розглядати кластер etcd як зовнішній та розгортати екземпляри etcd на окремих хостах. Відмінності між цими підходами описано на сторінці
[Варіанти топології високої доступності](/docs/setup/production-environment/tools/kubeadm/ha-topology).

Це завдання описує процес створення зовнішнього кластера etcd з високою доступністю, що складається з трьох членів, який може використовуватися kubeadm під час створення кластера.

## {{% heading "prerequisites" %}}

У вас повинні бути такі ресурси:

- Три хости, які можуть взаємодіяти між собою через TCP-порти 2379 та 2380. Цей
  документ вважає, що це стандартні порти. Однак їх можна налаштувати через
  файл конфігурації kubeadm.
- На кожному хості повинен бути встановлений systemd та сумісна з bash оболонка.
- На кожному хості повинно бути встановлене [середовище виконання контейнерів, kubelet та kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Кожен хост повинен мати доступ до реєстру образів контейнерів Kubernetes (`registry.k8s.io`) або ви можете отримати перелік та/або витягти необхідний образ etcd, використовуючи `kubeadm config images list/pull`. У цьому посібнику екземпляри etcd налаштовані як [статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/), керовані kubelet.
- Є якась інфраструктура для копіювання файлів між хостами. Наприклад, `ssh` та `scp` можуть відповідати цієї вимозі.

<!-- steps -->

## Налаштування кластера {#setup-up-the-cluster}

Загальний підхід — генерувати всі сертифікати на одному вузлі та розповсюджувати лише _необхідні_ файли на інші вузли.

{{< note >}}
kubeadm містить усі необхідні криптографічні механізми для генерації описаних нижче сертифікатів; для цього прикладу не потрібні інші криптографічні інструменти.
{{< /note >}}

{{< note >}}
У прикладах нижче використовуються адреси IPv4, але ви також можете налаштувати kubeadm, kubelet та etcd на використання адрес IPv6. Підтримка подвійного стека передбачена для деяких параметрів Kubernetes, але не для etcd. Докладніше
щодо підтримки подвійного стека Kubernetes дивіться [Підтримка подвійного стека з kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Налаштуйте kubelet як менеджер служб для etcd.

   {{< note >}}Це потрібно зробити на кожному хості, на якому повинен працювати etcd.{{< /note >}}
   Оскільки etcd був створений першим, вам слід перевизначити пріоритет служби, створивши новий файл юніта, який має вищий пріоритет, ніж файл юніта kubelet, який надає kubeadm.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Замініть "systemd" на драйвер cgroup вашого середовища виконання контейнерів. Стандартне значення в kubelet - "cgroupfs".
   # Замініть значення "containerRuntimeEndpoint" на інше середовище виконання контейнерів за потреби.
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

2. Створіть конфігураційні файли для kubeadm.

   Згенеруйте один файл конфігурації kubeadm для кожного хосту, на якому буде запущений екземпляр etcd, використовуючи наступний сценарій.

   ```sh
   # Оновіть HOST0, HOST1 та HOST2 IP ваших хостів
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Оновіть NAME0, NAME1 та NAME2 іменами хостів
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

3. Згенеруйте центр сертифікації.

   Якщо у вас вже є ЦС, то єдине що треба зробити — скопіювати файли `crt` та `key` ЦС у `/etc/kubernetes/pki/etcd/ca.crt` та `/etc/kubernetes/pki/etcd/ca.key`. Після копіювання цих файлів перейдіть до наступного кроку — "Створення сертифікатів для кожного учасника".

   Якщо у вас ще немає ЦС, то виконайте цю команду на `$HOST0` (де ви згенерували файли конфігурації для kubeadm).

   ```sh
   kubeadm init phase certs etcd-ca
   ```

   Це створює два файли:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

4. Створення сертифікатів для кожного учасника.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # очистити одноразові сертифікати
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

   # приберемо сертифікати, які не повинні бути скопійовані з цього хоста
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

5. Скопіюйте сертифікати та конфігурації kubeadm.

   Сертифікати вже були згенеровані, і тепер їх потрібно перемістити на відповідні хости.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

6. Переконайтеся, що всі очікувані файли існують.

   Повний перелік обовʼязкових файлів на `$HOST0`:

   ```sh
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

   ```sh
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

   ```sh
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

7. Створіть маніфести статичних Podʼів.

   Тепер, коли сертифікати та конфігурації на місці, прийшов час створити маніфести для etcd. На кожному хості виконайте команду `kubeadm` для генерації статичного маніфесту для etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

8. Опціонально: Перевірте стан кластера.

    Якщо `etcdctl` недоступний, ви можете запустити цей інструмент в середовищі контейнера. Ви можете це зробити безпосередньо з вашим середовищем виконання контейнерів за допомогою такого інструменту, як `crictl run`, а не через Kubernetes

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

    - Встановіть `${HOST0}`на IP-адресу хосту, який ви тестуєте.

## {{% heading "whatsnext" %}}

Коли у вас є кластер etcd з 3 робочими учасниками, ви можете продовжити налаштування високодоступного вузла панелі управління, використовуючи [метод зовнішнього etcd з kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
