---
title: Запуск kubelet в автономному режимі
content_type: tutorial
weight: 10
---

<!-- overview -->

Цей посібник показує, як запустити автономний екземпляр kubelet.

У вас можуть бути різні причини запускати автономний kubelet. Цей посібник має на меті ознайомити вас з Kubernetes, навіть якщо у вас небагато досвіду роботи з ним. Ви можете пройти цей посібник і дізнатися про налаштування вузла, базові (статичні) Podʼи та про те, як Kubernetes керує контейнерами.

Після цього посібника ви можете спробувати кластер, який має {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} для керування Podʼами, вузлами та іншими типами обʼєктів. Наприклад, [Привіт Minikube](/docs/tutorials/hello-minikube/).

Ви також можете запускати kubelet в автономному режимі для промислових сценаріїв, як-от запуск панелі управління для високодоступного кластера, розгорнутого стійко до збоїв. Цей посібник не охоплює подробиць, потрібних для запуску стійкої до збоїв панелі управління.

## {{% heading "objectives" %}} {#objectives}

* Встановлення `cri-o` та `kubelet` у системі Linux і їх запуск як сервісів `systemd`.
* Запуск Podʼа з `nginx`, що слухає запити на TCP-порту 80 за IP-адресою Podʼа.
* Дізнатись, як різні компоненти рішення взаємодіють між собою.

{{< alert color="caution" title="Увага" >}}
Конфігурація kubelet, яка використовується в цьому посібнику, навмисно небезпечна, і її _не_ слід використовувати в промисловому середовищі.
{{< /alert >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* Адміністраторський (`root`) доступ до системи Linux, яка використовує `systemd` та `iptables` (або `nftables` з емуляцією `iptables`).
* Доступ до інтернету для завантаження компонентів, потрібних для цього посібника, зокрема:
  * {{< glossary_tooltip text="Середовище виконання контейнерів" term_id="container-runtime" >}}, що реалізує {{< glossary_tooltip term_id="cri" text="(CRI)">}} Kubernetes.
  * Мережеві втулки (їх часто називають {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
  * Необхідні інструменти CLI: `curl`, `tar`, `jq`.

<!-- lessoncontent -->

## Підготовка системи {#prepare-the-system}

### Конфігурація свопу {#swap-configuration}

Стандартно kubelet не запускається, якщо на вузлі виявлено своп-памʼять. Це означає, що своп потрібно або вимкнути, або дозволити в kubelet.

{{< alert color="info" title="Примітка" >}}
Якщо налаштувати kubelet так, щоб він дозволяв своп, kubelet однаково налаштовує Podʼи (та контейнери в цих Podʼах) так, щоб вони не використовували своп. Як Podʼи можуть фактично використовувати доступний своп, можна дізнатися в розділі [керування своп-памʼяттю](/docs/concepts/architecture/nodes/#swap-memory) на вузлах Linux.
{{< /alert >}}

Якщо у вас увімкнено своп-памʼять, вимкніть її або додайте `failSwapOn: false` у файл конфігурації kubelet.

Щоб перевірити, чи увімкнено своп:

```shell
sudo swapon --show
```

Якщо команда нічого не виводить, своп-памʼять уже вимкнено.

Щоб тимчасово вимкнути своп:

```shell
sudo swapoff -a
```

Щоб ця зміна зберігалася після перезавантажень:

Переконайтеся, що своп вимкнено в `/etc/fstab` або в `systemd.swap`, залежно від того, як його налаштовано у вашій системі.

### Увімкнення пересилання пакетів IPv4 {#enable-ipv4-packet-forwarding}

Щоб перевірити, чи увімкнено пересилання пакетів IPv4:

```shell
cat /proc/sys/net/ipv4/ip_forward
```

Якщо вивід — `1`, пересилання вже увімкнено. Якщо вивід — `0`, виконайте подальші кроки.

Щоб увімкнути пересилання пакетів IPv4, створіть файл конфігурації, який встановлює параметр `net.ipv4.ip_forward` у значення `1`:

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```

Застосуйте зміни до системи:

```shell
sudo sysctl --system
```

Вивід подібний до:

```
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

## Завантаження, встановлення та налаштування компонентів {#download-install-and-configure-the-components}

{{% thirdparty-content %}}

### Встановлення середовища виконання контейнерів {#container-runtime}

Завантажте найновіші доступні версії необхідних пакетів (рекомендовано).

Цей посібник пропонує встановити [середовище виконання контейнерів CRI-O](https://github.com/cri-o/cri-o) (зовнішнє посилання).

Існує кілька [способів встановлення](https://github.com/cri-o/cri-o/blob/main/install.md) середовища виконання CRI-O залежно від вашого дистрибутива Linux. Хоча CRI-O рекомендує використовувати пакети `deb` або `rpm`, у цьому посібнику використовується скрипт _статичного бінарного пакета_ проєкту [CRI-O Packaging](https://github.com/cri-o/packaging/blob/main/README.md), щоб спростити процес і не залежати від дистрибутива.

Скрипт встановлює та налаштовує додаткове потрібне програмне забезпечення, як-от [`cni-plugins`](https://github.com/containernetworking/cni) для мережі контейнерів, а також [`crun`](https://github.com/containers/crun) і [`runc`](https://github.com/opencontainers/runc) для запуску контейнерів.

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

Увімкніть і запустіть сервіс `crio`:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

Швидка перевірка:

```shell
sudo systemctl is-active crio.service
```

Вивід подібний до:

```
active
```

Докладна перевірка сервісу:

```shell
sudo journalctl -f -u crio.service
```

### Встановлення мережевих втулків {#install-network-plugins}

Інсталятор `cri-o` встановлює та налаштовує пакет `cni-plugins`. Ви можете перевірити встановлення, виконавши таку команду:

```shell
/opt/cni/bin/bridge --version
```

Вивід подібний до:

```
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

Щоб перевірити стандартну конфігурацію:

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

Вивід подібний до:

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

{{< alert color="info" title="Примітка" >}}
Переконайтеся, що стандартний діапазон `subnet` (`10.85.0.0/16`) не перетинається з жодною з ваших активних мереж. Якщо перетин є, відредагуйте файл і змініть діапазон відповідно. Після зміни перезапустіть сервіс.
{{< /alert >}}

### Завантаження та налаштування kubelet {#download-and-set-up-the-kubelet}

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

{{< alert color="info" title="Примітка" >}}
Оскільки ви не налаштовуєте промисловий кластер, для неавтентифікованих запитів до API kubelet використовується звичайний HTTP (`readOnlyPort: 10255`).

У цьому посібнику _вебхук автентифікації_ вимкнено, а _режим авторизації_ встановлено в `AlwaysAllow`. Ви можете дізнатися більше про [режими авторизації](/docs/reference/access-authn-authz/authorization/#authorization-modules) та [вебхук автентифікації](/docs/reference/access-authn-authz/webhook/), щоб правильно налаштувати kubelet в автономному режимі для вашого середовища.

Перегляньте розділ [Порти та протоколи](/docs/reference/networking/ports-and-protocols/), щоб зрозуміти, які порти використовують компоненти Kubernetes.
{{< /alert >}}

Встановлення:

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

Створіть файл юніта сервісу `systemd`:

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

Аргумент командного рядка `--kubeconfig` навмисно пропущено у файлі конфігурації сервісу. Цей аргумент задає шлях до файлу [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), який визначає, як підключатися до API-сервера, і вмикає режим API-сервера. Якщо його пропустити, вмикається автономний режим.

Увімкніть і запустіть сервіс `kubelet`:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

Швидка перевірка:

```shell
sudo systemctl is-active kubelet.service
```

Вивід подібний до:

```
active
```

Докладна перевірка сервісу:

```shell
sudo journalctl -u kubelet.service
```

Перевірте точку доступу API kubelet `/healthz`:

```shell
curl http://localhost:10255/healthz?verbose
```

Вивід подібний до:

```
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

Надішліть запит до точки доступу `/pods` API kubelet:

```shell
curl http://localhost:10255/pods | jq '.'
```

Вивід подібний до:

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

## Запуск Podʼа в kubelet {#run-a-pod-in-the-kubelet}

В автономному режимі ви можете запускати Podʼи за допомогою маніфестів Podʼів. Маніфести можуть розташовуватися в локальній файловій системі або завантажуватися через HTTP з джерела конфігурації.

Створіть маніфест Podʼа:

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

### Відомості про kubelet і Pod {#find-out-information}

Мережевий втулок Podʼів створює мережевий міст (`cni0`) і пару інтерфейсів `veth` для кожного Podʼа (один із пари розташований усередині новоствореного Podʼа, а інший — на рівні хоста).

Зверніться до точки доступу до API kubelet за адресою `http://localhost:10255/pods`:

```shell
curl http://localhost:10255/pods | jq '.'
```

Щоб отримати IP-адресу Podʼа `static-web`:

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

Вивід подібний до:

```
"10.85.0.4"
```

Підʼєднайтеся до Podʼа сервера `nginx` за адресою `http://<IP>:<Port>` (стандартно порт 80), у цьому випадку:

```shell
curl http://10.85.0.4
```

Вивід подібний до:

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

## Де шукати докладнішу інформацію {#where-to-look-for-more-details}

Якщо вам потрібно діагностувати проблему з виконанням цього посібника, для моніторингу та усунення несправностей перегляньте такі теки:

```
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

### Середовище виконання контейнерів {#container-runtime-1}

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

На цій сторінці розглянуто основні аспекти розгортання kubelet в автономному режимі. Тепер ви готові розгортати Podʼи та тестувати додаткові можливості.

Зверніть увагу, що в автономному режимі kubelet _не_ підтримує отримання конфігурацій Podʼів із панелі управління (оскільки немає підключення до панелі управління).

Також ви не можете використовувати {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} або {{< glossary_tooltip text="Secret" term_id="secret" >}} для налаштування контейнерів у статичному Podʼі.

## {{% heading "whatsnext" %}} {#what-s-next}

* Пройдіть посібник [Привіт Minikube](/docs/tutorials/hello-minikube/), щоб дізнатися, як запускати Kubernetes _з_ панеллю управління. Інструмент minikube допоможе вам налаштувати тренувальний кластер на вашому компʼютері.
* Дізнайтесь більше про [Мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* Дізнайтесь більше про [Середовище виконання контейнерів](/docs/setup/production-environment/container-runtimes/)
* Дізнайтесь більше про [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* Дізнайтесь більше про [статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/)
