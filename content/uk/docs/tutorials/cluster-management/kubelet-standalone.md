---
title: Запуск автономного Kublet
content_type: tutorial
weight: 10
---

<!-- overview -->

Цей посібник показує, як запустити автономний екземпляр kubelet.

У вас можуть бути різні причини для запуску автономного kubelet. Цей посібник спрямований на ознайомлення вас з Kubernetes, навіть якщо у вас немає багато досвіду роботи з ним. Ви можете слідувати цьому посібнику і дізнатися про налаштування вузла, основних (статичних) Podʼів та як Kubernetes керує контейнерами.

Після того, як ви пройдете цей посібник, ви можете спробувати використовувати кластер, який має {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} для керування podʼами та вузлами, а також іншими типами обʼєктів. Ознайомтесь з прикладом в розділі [Привіт, minikube](/docs/tutorials/hello-minikube/).

Ви також можете запустити kubelet в автономному режимі для задоволення операційних потреб, таких як запуск панелі управління для високо доступного, стійкого до збоїв кластера. Цей посібник не охоплює деталі, необхідні для запуску високодоступної панелі управління.

## {{% heading "objectives" %}}

* Встановлення `cri-o` та `kubelet` в системах Linux та їх запуск як служб `systemd`.
* Запуск Podʼа для `nginx` що очікує запитів на порту TCP 80 за IP адресою Podʼа.
* Дізнатись, як різні компоненти взаємодіють один з одним.

{{< caution >}}
Конфігурація kubelet, яка використовується у цьому посібнику, є небезпечною за своєю конструкцією і не повинна не повинна використовуватися в промисловому середовищі.
{{< /caution >}}

## {{% heading "prerequisites" %}}

* Адміністраторський (`root`) доступ до системи Linux, яка використовує `systemd` та `iptables` (або `nftables` з емуляцією `iptables`).
* Доступ до Інтернету для завантаження компонентів, необхідних для роботи з підручником, зокрема
  * {{< glossary_tooltip text="Середовище виконання контейнерів" term_id="container-runtime" >}} що підтримує Kubernetes {{< glossary_tooltip term_id="cri" text="(CRI)">}}.
  * Мережеві втулки (їх часто називають {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
  * Необхідні інструменти CLI: `curl`, `tar`, `jq`.

<!-- lessoncontent -->

## Підготовка системи {#prepare-the-system}

### Конфігурація підкачки {#swap-configuration}

Стандартно kubelet не запускається, якщо на вузлі виявлено використання файлу підкачки (swap). Це означає, що підкачку необхідно або вимкнути, або налаштувати толерантність до неї у kubelet.

{{< note >}}
Якщо налаштувати kubelet на толерантність до підкачки, kubelet все одно конфігурує Podʼи (та контейнери в цих Podʼах) таким чином, щоб вони не використовували область підкачки. Дізнатися, як Podʼи можуть фактично використовувати доступну підкачку, можна в розділі [управління памʼяттю підкачки](/docs/concepts/architecture/nodes/#swap-memory) на Linux-вузлах.
{{< /note >}}

Якщо у вас увімкнена підкачка, вимкніть її або додайте параметр `failSwapOn: false` у файл конфігурації kubelet.

Щоб перевірити, чи увімкнена підкачка:

```shell
sudo swapon --show
```

Якщо команда не виводить жодної інформації, то підкачка вже вимкнена.

Щоб тимчасово вимкнути підкачку:

```shell
sudo swapoff -a
```

Щоб зробити це налаштування постійним після перезавантаження:

Переконайтеся, що підкачка вимкнена в файлі `/etc/fstab` або у файлі `systemd.swap`, залежно від того, як вона була налаштована на вашій системі.

### Увімкнення пересилання пакетів IPv4 {#enable-ipv4-packet-forwarding}

Щоб перевірити, чи увімкнено пересилання пакетів IPv4:

```shell
cat /proc/sys/net/ipv4/ip_forward
```

Якщо результатом є `1`, пересилання вже увімкнено. Якщо результатом є `0`, виконайте наступні кроки.

Щоб увімкнути пересилання пакетів IPv4, створіть конфігураційний файл, який встановлює параметр `net.ipv4.ip_forward` у значення `1`:

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```

Застосуйте зміни до системи:

```shell
sudo sysctl --system
```

Результат буде подібним до цього:

```none
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

## Завантаження, встановлення та налаштування компонентів {#download-install-and-configure-the-components}

{{% thirdparty-content %}}

### Встановлення середовища виконання контейнерів {#container-runtime}

Завантажте найновіші доступні версії необхідних пакетів (рекомендовано).

Цей підручник пропонує встановити середовище виконання контейнерів [CRI-O](https://github.com/cri-o/cri-o) (зовнішнє посилання).

Існує кілька [способів встановлення](https://github.com/cri-o/cri-o/blob/main/install.md) середовища виконання CRI-O, залежно від вашого дистрибутиву Linux. Хоча CRI-O рекомендує використовувати пакети `deb` або `rpm`, у цьому підручнику використовується скрипт _статичного бінарного пакета_ проєкту [CRI-O Packaging](https://github.com/cri-o/packaging/blob/main/README.md), щоб спростити процес і зробити його незалежним від дистрибутиву.

Скрипт встановлює та налаштовує додаткове необхідне програмне забезпечення, таке як [`cni-plugins`](https://github.com/containernetworking/cni) для контейнерної мережі та [`crun`](https://github.com/containers/crun) і [`runc`](https://github.com/opencontainers/runc) для запуску контейнерів.

Скрипт автоматично визначить архітектуру процесора вашої системи (`amd64` або `arm64`), а також обере та встановить найновіші версії програмних пакетів.

### Налаштування CRI-O {#cri-o-setup}

Відвідайте сторінку [випусків](https://github.com/cri-o/cri-o/releases) (зовнішнє посилання).

Завантажте скрипт статичного бінарного пакета:

```shell
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

Запустіть інсталяційний скрипт:

```shell
sudo bash crio-install
```

Увімкніть і запустіть службу `crio`:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

Швидка перевірка:

```shell
sudo systemctl is-active crio.service
```

Результат подібний до:

```none
active
```

Детальна перевірка служби:

```shell
sudo journalctl -f -u crio.service
```

### Встановлення мережевих втулків {#install-network-plugins}

Інсталятор `cri-o` встановлює та налаштовує пакет `cni-plugins`. Ви можете перевірити встановлення, виконавши таку команду:

```shell
/opt/cni/bin/bridge --version
```

Результат буде подібний до:

```none
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

Щоб перевірити стандартну конфігурацію:

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

Результат буде подібний до:

```json
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```

{{< note >}}
Переконайтеся, що стандартний діапазон `subnet` (`10.85.0.0/16`) не перетинається з будь-якою з ваших активних мереж. Якщо є перетин, ви можете відредагувати файл і змінити його відповідно. Після зміни перезапустіть службу.
{{< /note >}}

### Завантаження та встановлення {#download-and-set-up-the-kubelet}

Завантажте [останній стабільний випуск](/releases/download/) kubelet.

{{< tabs name="download_kubelet" >}}
{{< tab name="x86-64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubelet"
{{< /tab >}}
{{< tab name="ARM64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubelet"
{{< /tab >}}
{{< /tabs >}}

Налаштування:

```shell
sudo mkdir -p /etc/kubernetes/manifests
```

```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # НЕ використовуйте у промислових кластерах!
authorization:
  mode: AlwaysAllow # НЕ використовуйте у промислових кластерах!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # НЕ використовуйте у промислових кластерах!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

{{< note >}}
Оскільки ви не встановлюєте промисловий кластер, у вас використовується звичайний HTTP порт (`readOnlyPort: 10255`) для неавтентифікованих запитів до API kubelet.

У цьому посібнику _вебхук автентифікації_ вимкнено, а _режим авторизації_ встановлено на `AlwaysAllow`. Ви можете дізнатися більше про [режими авторизації](/docs/reference/access-authn-authz/authorization/#authorization-modules) та [вебхук автентифікації](/docs/reference/access-authn-authz/webhook/), щоб правильно налаштувати kubelet в автономному режимі для вашого середовища.

Перегляньте розділ [Порти та протоколи](/docs/reference/networking/ports-and-protocols/), щоб зрозуміти, які порти використовують компоненти Kubernetes.
{{< /note >}}

Встановлення:

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

Створіть файл служби `systemd`:

```shell
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

Аргумент командного рядка `--kubeconfig` було навмисно пропущено у файлі конфігурації конфігураційного файлу служби. Цей аргумент задає шлях до файлу [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) файл, який визначає, як підключатися до сервера API, вмикаючи режим сервера API. Якщо його не вказати, увімкнеться автономний режим.

Увімкніть та запустіть службу `kubelet`:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

Швидкий тест:

```shell
sudo systemctl is-active kubelet.service
```

Вивід має бути подібним до:

```none
active
```

Докладна перевірка служби:

```shell
sudo journalctl -u kubelet.service
```

Перевірте точку доступу API kubelet `/healthz`:

```shell
curl http://localhost:10255/healthz?verbose
```

Вивід має бути подібним до:

```none
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

Запит до точки доступу до API kubelet `/pods`:

```shell
curl http://localhost:10255/pods | jq '.'
```

Вивід має бути подібним до:

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

## Запуск Podʼів в kubelet {#run-a-pod-in-the-kubelet}

В автономному режимі ви можете запускати Podʼи за допомогою маніфестів Pod'ів. Маніфести можуть або знаходитися у локальній файловій системі, або бути отриманими по HTTP з джерела конфігурації.

Створіть маніфест для Pod:

```shell
cat <<EOF > static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

Скопіюйте файл маніфесту `static-web.yaml` до теки `/etc/kubernetes/manifests`.

```shell
sudo cp static-web.yaml /etc/kubernetes/manifests/
```

### Дізнатись відомості про kubelet та Pod {#find-out-information}

Мережевий втулок Podʼа створює мережевий міст (`cni0`) і пару інтерфейсів `veth` для кожного Podʼа (один з пари знаходиться всередині новоствореного Podʼа, а інший — на рівні хосту).

Зверніться до точки доступу до API kubelet за адресою `http://localhost:10255/pods`:

```shell
curl http://localhost:10255/pods | jq '.'
```

Отримання IP-адреси `static-web` Podʼа:

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

Вивід має бути подібним до:

```none
"10.85.0.4"
```

Приєднайтеся до сервера `nginx` за адресою `http://<IP>:<Порт>` (стандартний порт 80), в цьому випадку:

```shell
curl http://10.85.0.4
```

Вивід має бути подібним до:

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

## Де шукати більш детальну інформацію {#where-to-look-for-more-details}

Якщо вам потрібно діагностувати проблему, пов'язану з роботою цього посібника, ви можете зазирнути в наступні теки для моніторингу та усунення несправностей:

```none
/var/lib/cni
/var/lib/containers
/var/lib/kubelet

/var/log/containers
/var/log/pods
```

## Очищення {#clean-up}

### kubelet

```shell
sudo systemctl disable --now kubelet.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/kubelet.service
sudo rm /usr/bin/kubelet
sudo rm -rf /etc/kubernetes
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/log/containers
sudo rm -rf /var/log/pods
```

### Середовище виконання контейнерів {#container-runtime}

```shell
sudo systemctl disable --now crio.service
sudo systemctl daemon-reload
sudo rm -rf /usr/local/bin
sudo rm -rf /usr/local/lib
sudo rm -rf /usr/local/share
sudo rm -rf /usr/libexec/crio
sudo rm -rf /etc/crio
sudo rm -rf /etc/containers
```

### Мережеві втулки {#network-plugins}

```shell
sudo rm -rf /opt/cni
sudo rm -rf /etc/cni
sudo rm -rf /var/lib/cni
```

## Висновок {#conclusion}

На цій сторінці було розглянуто основні аспекти розгортання kubelet в автономному режимі. Тепер ви готові розгортати Podʼи та тестувати додаткову функціональність.

Зверніть увагу, що в автономному режимі kubelet _не_ підтримує отримання конфігурацій Podʼів із панелі управління (оскільки немає підключення до панелі управління).

Також ви не можете використовувати {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} або {{< glossary_tooltip text="Secret" term_id="secret" >}} для налаштування контейнерів у статичному Pod.

## {{% heading "whatsnext" %}}

* Ознайомтесь з [Hello, minikube](/docs/tutorials/hello-minikube/), щоб дізнатися, як запускати Kubernetes _з_ панеллю управління. Інструмент minikube допоможе вам налаштувати тренувальний кластер на вашому компʼютері.
* Дізнайтесь більше про [Мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* Дізнайтесь більше про [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/)
* Дізнайтесь більше про [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* Дізнайтесь більше про [статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/)
