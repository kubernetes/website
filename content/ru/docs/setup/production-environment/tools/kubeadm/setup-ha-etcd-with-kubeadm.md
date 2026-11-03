---
title: Настройка кластера etcd высокой доступности с помощью kubeadm
content_type: task
weight: 70
---

<!-- overview -->

По умолчанию kubeadm запускает локальный экземпляр etcd на каждом узле управляющего слоя.
Также можно использовать внешний кластер etcd, разместив его экземпляры на отдельных машинах.
Различия подходов описаны на странице
[Варианты топологии высокой доступности](/docs/setup/production-environment/tools/kubeadm/ha-topology).

Это руководство описывает создание внешнего кластера etcd высокой доступности
из трёх участников, который kubeadm может использовать при создании кластера.

## {{% heading "prerequisites" %}}

- Три машины, которые могут взаимодействовать по TCP-портам 2379 и 2380.
  В документе предполагаются эти порты по умолчанию, но их можно изменить
  в файле конфигурации kubeadm.
- На каждой машине должны быть установлены systemd и оболочка, совместимая с bash.
- На каждой машине должны быть [установлены среда выполнения контейнеров, kubelet и kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Каждая машина должна иметь доступ к реестру образов контейнеров Kubernetes (`registry.k8s.io`),
  либо нужно получить список и загрузить необходимый образ etcd командами `kubeadm config images list/pull`.
  В этом руководстве экземпляры etcd настраиваются как
  [статические поды](/docs/tasks/configure-pod-container/static-pod/) под управлением kubelet.
- Средства копирования файлов между машинами, например `ssh` и `scp`.

<!-- steps -->

## Настройка кластера {#setting-up-the-cluster}

Общий подход — сгенерировать все сертификаты на одном узле и передать
другим узлам только _необходимые_ файлы.

{{< note >}}
kubeadm содержит все криптографические средства для генерации описанных ниже сертификатов.
Дополнительные криптографические инструменты для этого примера не нужны.
{{< /note >}}

{{< note >}}
В примерах ниже используются адреса IPv4, но kubeadm, kubelet и etcd можно настроить
на использование IPv6. Некоторые параметры Kubernetes поддерживают два стека, но etcd — нет.
Подробнее см. [Поддержка двух стеков с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Настройте kubelet для управления сервисом etcd.

   {{< note >}}Это необходимо сделать на каждой машине, где будет работать etcd.{{< /note >}}
   Поскольку etcd создаётся первым, переопределите приоритет конфигурации службы,
   создав новый файл модуля с более высоким приоритетом, чем файл kubelet, предоставляемый kubeadm.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Replace "systemd" with the cgroup driver of your container runtime. The default value in the kubelet is "cgroupfs".
   # Replace the value of "containerRuntimeEndpoint" for a different container runtime if needed.
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

   Проверьте состояние kubelet, чтобы убедиться, что он работает.

   ```sh
   systemctl status kubelet
   ```

1. Создайте файлы конфигурации kubeadm.

   Следующим скриптом создайте отдельный файл конфигурации kubeadm для каждой машины,
   на которой будет работать участник etcd.

   ```sh
   # Update HOST0, HOST1 and HOST2 with the IPs of your hosts
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Update NAME0, NAME1 and NAME2 with the hostnames of your hosts
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Create temp directories to store files that will end up on other hosts
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

1. Создайте центр сертификации.

   Если у вас уже есть CA, достаточно скопировать его файлы `crt` и `key`
   в `/etc/kubernetes/pki/etcd/ca.crt` и `/etc/kubernetes/pki/etcd/ca.key`.
   Затем переходите к следующему шагу — созданию сертификатов для каждого участника.

   Если CA ещё нет, выполните эту команду на `$HOST0`, где вы создали файлы конфигурации kubeadm.

   ```
   kubeadm init phase certs etcd-ca
   ```

   Будут созданы два файла:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Создайте сертификаты для каждого участника.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # cleanup non-reusable certificates
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
   # No need to move the certs because they are for HOST0

   # clean up certs that should not be copied off this host
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Скопируйте сертификаты и конфигурации kubeadm.

   Теперь созданные сертификаты необходимо перенести на соответствующие машины.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Убедитесь, что все необходимые файлы существуют.

   Полный список файлов на `$HOST0`:

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

1. Создайте манифесты статических подов.

   Когда сертификаты и конфигурации размещены, можно создавать манифесты.
   На каждой машине выполните команду `kubeadm` для генерации статического манифеста etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Необязательно: проверьте состояние кластера.

   Если `etcdctl` недоступен, его можно запустить из образа контейнера.
   Сделайте это напрямую через среду выполнения контейнеров инструментом вроде
   `crictl run`, без использования Kubernetes.

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

   - Задайте `${HOST0}` IP-адрес проверяемой машины.

## {{% heading "whatsnext" %}}

После создания кластера etcd с тремя работающими участниками можно продолжить настройку
управляющего слоя высокой доступности
[с внешним etcd с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
