---
title: Создание кластеров высокой доступности с помощью kubeadm
content_type: task
weight: 60
---

<!-- overview -->

На этой странице описаны два подхода к созданию кластера Kubernetes высокой доступности с помощью kubeadm:

- С совмещёнными узлами управляющего слоя и etcd. Этот подход требует меньше инфраструктуры:
  участники etcd размещаются на узлах управляющего слоя.
- С внешним кластером etcd. Этот подход требует больше инфраструктуры:
  узлы управляющего слоя и участники etcd размещаются отдельно.

Прежде чем продолжать, внимательно оцените, какой подход лучше соответствует приложениям
и вашей среде. Преимущества и недостатки каждого описаны в разделе
[Варианты топологии высокой доступности](/docs/setup/production-environment/tools/kubeadm/ha-topology/).

О проблемах при настройке кластера HA сообщайте в
[систему отслеживания ошибок](https://github.com/kubernetes/kubeadm/issues/new) kubeadm.

См. также [документацию по обновлению](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).

{{< caution >}}
Эта страница не рассматривает запуск кластера у облачного провайдера.
В облачной среде ни один из описанных подходов не обеспечивает работу объектов
Service типа LoadBalancer или динамических PersistentVolume.
{{< /caution >}}

## {{% heading "prerequisites" %}}

Требования зависят от выбранной топологии управляющего слоя кластера:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="Совмещённый etcd" %}}
<!--
    Примечание для рецензентов: эти требования должны совпадать с началом
    вкладки внешнего etcd.
-->

Вам понадобятся:

- Три или более машин для узлов управляющего слоя, соответствующих
  [минимальным требованиям kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin).
  Нечётное число узлов управляющего слоя может помочь при выборе лидера в случае отказа машины или зоны.
  - На них должна быть уже настроена и работать
    [среда выполнения контейнеров](/docs/setup/production-environment/container-runtimes/).
- Три или более машин для рабочих узлов, соответствующих
  [минимальным требованиям kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin).
  - На них должна быть уже настроена и работать среда выполнения контейнеров.
- Полная сетевая связность между всеми машинами кластера (общедоступная или частная сеть).
- Права суперпользователя на всех машинах через `sudo`.
  - Можно использовать другой инструмент; в примерах этого руководства используется `sudo`.
- SSH-доступ с одного устройства ко всем узлам системы.
- Уже установленные `kubeadm` и `kubelet` на всех машинах.

_Подробнее см. [Топология с совмещённым etcd](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology)._

{{% /tab %}}
{{% tab name="Внешний etcd" %}}
<!--
    Примечание для рецензентов: эти требования должны совпадать с началом
    вкладки совмещённого etcd.
-->
Вам понадобятся:

- Три или более машин для узлов управляющего слоя, соответствующих
  [минимальным требованиям kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin).
  Нечётное число узлов управляющего слоя может помочь при выборе лидера в случае отказа машины или зоны.
  - На них должна быть уже настроена и работать
    [среда выполнения контейнеров](/docs/setup/production-environment/container-runtimes/).
- Три или более машин для рабочих узлов, соответствующих
  [минимальным требованиям kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin).
  - На них должна быть уже настроена и работать среда выполнения контейнеров.
- Полная сетевая связность между всеми машинами кластера (общедоступная или частная сеть).
- Права суперпользователя на всех машинах через `sudo`.
  - Можно использовать другой инструмент; в примерах этого руководства используется `sudo`.
- SSH-доступ с одного устройства ко всем узлам системы.
- Уже установленные `kubeadm` и `kubelet` на всех машинах.

<!-- Конец общих требований -->

Дополнительно понадобятся:

- Три или более дополнительных машин, которые станут участниками кластера etcd.
  Нечётное число участников необходимо для оптимального кворума голосования.
  - На этих машинах также должны быть установлены `kubeadm` и `kubelet`.
  - На них также должна быть настроена и работать среда выполнения контейнеров.

_Подробнее см. [Топология с внешним etcd](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology)._
{{% /tab %}}
{{< /tabs >}}

### Образы контейнеров {#container-images}

Каждой машине нужен доступ для чтения и загрузки образов из реестра Kubernetes `registry.k8s.io`.
Кластер высокой доступности можно развернуть и на машинах без такого доступа.
В этом случае другим способом обеспечьте наличие нужных образов контейнеров
на соответствующих машинах заранее.

### Интерфейс командной строки {#kubectl}

Для управления Kubernetes после создания кластера
[установите kubectl](/docs/tasks/tools/) на свой компьютер.
Также полезно установить `kubectl` на каждый узел управляющего слоя для устранения неполадок.

<!-- steps -->

## Первые шаги для обоих подходов {#first-steps-for-both-methods}

### Создание балансировщика нагрузки для kube-apiserver {#create-load-balancer-for-kube-apiserver}

{{< note >}}
Существует множество конфигураций балансировщиков нагрузки. Следующий пример — лишь один вариант.
Требования вашего кластера могут потребовать другой конфигурации.
{{< /note >}}

1. Создайте балансировщик нагрузки kube-apiserver с именем, разрешаемым через DNS.

   - В облачной среде разместите узлы управляющего слоя за балансировщиком с перенаправлением TCP.
     Он распределяет трафик по всем исправным узлам управляющего слоя из списка целей.
     Проверка работоспособности apiserver — это TCP-проверка порта, прослушиваемого kube-apiserver
     (по умолчанию `:6443`).

   - В облачной среде не рекомендуется использовать IP-адрес напрямую.

   - Балансировщик должен обращаться ко всем узлам управляющего слоя на порту apiserver
     и разрешать входящий трафик на своём порту прослушивания.

   - Убедитесь, что адрес балансировщика всегда совпадает с `ControlPlaneEndpoint` kubeadm.

   - Подробнее см. [Варианты программной балансировки нагрузки](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing).

1. Добавьте первый узел управляющего слоя в балансировщик и проверьте соединение:

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Ошибка отказа в соединении ожидаема, поскольку сервер API ещё не работает.
   Однако тайм-аут означает, что балансировщик не может связаться с узлом управляющего слоя.
   В этом случае перенастройте балансировщик для связи с узлом.

1. Добавьте остальные узлы управляющего слоя в целевую группу балансировщика.

## Совмещённые узлы управляющего слоя и etcd {#stacked-control-plane-and-etcd-nodes}

### Действия на первом узле управляющего слоя {#steps-for-the-first-control-plane-node}

1. Инициализируйте управляющий слой:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Флагом `--kubernetes-version` можно задать версию Kubernetes.
     Рекомендуется, чтобы версии kubeadm, kubelet, kubectl и Kubernetes совпадали.
   - Флаг `--control-plane-endpoint` должен задавать адрес или DNS-имя и порт балансировщика нагрузки.

   - Флаг `--upload-certs` загружает в кластер сертификаты, общие для всех экземпляров управляющего слоя.
     Если вы предпочитаете копировать сертификаты между узлами вручную или средствами автоматизации,
     уберите этот флаг и обратитесь к разделу [Ручное распространение сертификатов](#manual-certs).

   {{< note >}}
   Флаги `--config` и `--certificate-key` команды `kubeadm init` нельзя использовать вместе.
   При использовании [конфигурации kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
   добавьте поле `certificateKey` в соответствующие места конфигурации
   (в `InitConfiguration` и `JoinConfiguration: controlPlane`).
   {{< /note >}}

   {{< note >}}
   Некоторым сетевым плагинам CNI нужны дополнительные настройки, например CIDR IP-адресов подов,
   а другим — нет. См. [документацию по сети CNI](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
   Для добавления CIDR подов передайте флаг `--pod-network-cidr` либо задайте поле `podSubnet`
   объекта `networking` в `ClusterConfiguration`, если используете файл конфигурации kubeadm.
   {{< /note >}}

   Вывод будет примерно следующим:

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Сохраните вывод в текстовый файл. Он понадобится для присоединения узлов управляющего слоя
     и рабочих узлов к кластеру.
   - При использовании `--upload-certs` с `kubeadm init` сертификаты первого узла управляющего слоя
     шифруются и загружаются в Secret `kubeadm-certs`.
   - Для повторной загрузки сертификатов и создания нового ключа расшифровки выполните
     следующую команду на уже присоединённом узле управляющего слоя:

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - При `init` также можно указать собственный `--certificate-key`, который затем используется при `join`.
     Для создания такого ключа выполните:

     ```sh
     kubeadm certs certificate-key
     ```

   Ключ сертификатов — строка в шестнадцатеричном представлении, содержащая ключ AES размером 32 байта.

   {{< note >}}
   Срок действия Secret `kubeadm-certs` и ключа расшифровки истекает через два часа.
   {{< /note >}}

   {{< caution >}}
   Как указано в выводе команды, ключ сертификатов предоставляет доступ к конфиденциальным данным кластера.
   Храните его в секрете!
   {{< /caution >}}

1. Примените выбранный плагин CNI:
   [следуйте инструкции](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
   по установке поставщика CNI. Убедитесь, что конфигурация соответствует CIDR подов,
   указанному в файле конфигурации kubeadm, если он задан.

   {{< note >}}
   Выберите подходящий сетевой плагин и разверните его до перехода к следующему шагу.
   Иначе кластер не сможет запуститься корректно.
   {{< /note >}}

1. Выполните следующую команду и наблюдайте за запуском подов компонентов управляющего слоя:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Действия на остальных узлах управляющего слоя {#steps-for-the-rest-of-the-control-plane-nodes}

На каждом дополнительном узле управляющего слоя:

1. Выполните команду присоединения из вывода `kubeadm init` на первом узле.
   Она выглядит примерно так:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - Флаг `--control-plane` указывает `kubeadm join` создать новый экземпляр управляющего слоя.
   - Флаг `--certificate-key ...` обеспечивает загрузку сертификатов управляющего слоя
     из Secret `kubeadm-certs` кластера и их расшифровку указанным ключом.

{{< note >}}
Поскольку узлы кластера обычно инициализируются последовательно, все поды CoreDNS,
скорее всего, окажутся на первом узле управляющего слоя. Для повышения доступности
перераспределите их командой `kubectl -n kube-system rollout restart deployment coredns`
после присоединения хотя бы одного нового узла.
{{< /note >}}

## Внешние узлы etcd {#external-etcd-nodes}

Настройка кластера с внешними узлами etcd похожа на настройку с совмещённым etcd,
но сначала необходимо настроить etcd и передать сведения о нём в файле конфигурации kubeadm.

### Настройка кластера etcd {#set-up-the-etcd-cluster}

1. Настройте кластер etcd по [инструкции](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/).

1. Настройте SSH, как описано [ниже](#manual-certs).

1. Скопируйте следующие файлы с любого узла etcd кластера на первый узел управляющего слоя:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Замените значение `CONTROL_PLANE` на `user@host` первого узла управляющего слоя.

### Настройка первого узла управляющего слоя {#set-up-the-first-control-plane-node}

1. Создайте файл `kubeadm-config.yaml` со следующим содержимым:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   Отличие внешнего etcd от совмещённого состоит в том, что для внешнего etcd
   нужен файл конфигурации с конечными точками etcd в объекте `external` раздела `etcd`.
   При совмещённой топологии это настраивается автоматически.
   {{< /note >}}

   - Замените следующие переменные шаблона конфигурации значениями вашего кластера:

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

Следующие шаги аналогичны настройке совмещённого etcd:

1. Выполните `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` на этом узле.

1. Сохраните выведенные команды присоединения в текстовый файл для дальнейшего использования.

1. Примените выбранный плагин CNI.

   {{< note >}}
   Выберите подходящий сетевой плагин и разверните его до перехода к следующему шагу.
   Иначе кластер не сможет запуститься корректно.
   {{< /note >}}

### Действия на остальных узлах управляющего слоя {#steps-for-the-rest-of-the-control-plane-nodes-1}

Шаги совпадают с настройкой совмещённого etcd:

- Убедитесь, что первый узел управляющего слоя полностью инициализирован.
- Присоедините каждый узел управляющего слоя командой из сохранённого текстового файла.
  Рекомендуется присоединять узлы по одному.
- Помните, что срок действия ключа расшифровки из `--certificate-key` по умолчанию истекает через два часа.

## Общие задачи после создания управляющего слоя {#common-tasks-after-bootstrapping-control-plane}

### Установка рабочих узлов {#install-workers}

Рабочие узлы можно присоединить командой, сохранённой ранее из вывода `kubeadm init`:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Ручное распространение сертификатов {#manual-certs}

Если вы не используете флаг `--upload-certs` с `kubeadm init`, необходимо вручную
скопировать сертификаты с первого узла управляющего слоя на присоединяемые узлы управляющего слоя.

Это можно сделать разными способами. Следующий пример использует `ssh` и `scp`.

SSH необходим для управления всеми узлами с одной машины.

1. Включите ssh-agent на основном устройстве, имеющем доступ ко всем остальным узлам:

   ```shell
   eval $(ssh-agent)
   ```

1. Добавьте свой SSH-ключ в сеанс:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. Проверьте соединения SSH между узлами.

   - При подключении к любому узлу добавляйте флаг `-A`. Он позволяет узлу,
     на который вы вошли через SSH, обращаться к SSH-агенту вашего компьютера.
     Рассмотрите другие способы, если не полностью доверяете безопасности пользовательского сеанса на узле.

     ```shell
     ssh -A 10.0.0.7
     ```

   - При использовании sudo на узлах сохраняйте окружение, чтобы перенаправление SSH работало:

     ```shell
     sudo -E -s
     ```

1. После настройки SSH на всех узлах выполните следующий скрипт на первом узле
   управляющего слоя после `kubeadm init`. Скрипт копирует сертификаты с первого узла на остальные.

   В примере замените `CONTROL_PLANE_IPS` IP-адресами остальных узлов управляющего слоя.

   ```sh
   USER=ubuntu # customizable
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Skip the next line if you are using external etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   Копируйте только сертификаты из списка выше. Остальные сертификаты с необходимыми SAN
   для присоединяемых экземпляров управляющего слоя создаст kubeadm.
   Если по ошибке скопировать все сертификаты, создание дополнительных узлов может
   завершиться неудачно из-за отсутствия нужных SAN.
   {{< /caution >}}

1. Затем на каждом присоединяемом узле управляющего слоя перед `kubeadm join` выполните
   следующий скрипт. Он переносит скопированные сертификаты из домашнего каталога в `/etc/kubernetes/pki`:

   ```sh
   USER=ubuntu # customizable
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Skip the next line if you are using external etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```
