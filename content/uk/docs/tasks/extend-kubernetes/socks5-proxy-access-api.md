---
title: Використання SOCKS5-проксі для доступу до Kubernetes API
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Ця сторінка показує, як використовувати SOCKS5-проксі для доступу до API віддаленого кластера Kubernetes. Це корисно, коли кластер, до якого ви хочете отримати доступ, не відкриває свій API безпосередньо в інтернет.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібне програмне забезпечення для SSH-клієнта (інструмент `ssh`) і сервіс SSH, що працює на віддаленому сервері. Ви повинні мати можливість увійти до сервісу SSH на віддаленому сервері.

<!-- steps -->

## Контекст завдання {#task-context}

{{< note >}}
У цьому прикладі трафік тунелюється за допомогою SSH, де SSH-клієнт і сервер виступають як SOCKS-проксі. Ви можете також використовувати будь-які інші види [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) проксі.
{{</ note >}}

На схемі 1 представлено, що ви збираєтесь досягти в цьому завданні.

* У вас є компʼютер-клієнт, який називається локальним у подальших кроках, з якого ви будете створювати запити для спілкування з Kubernetes API.
* Сервер Kubernetes/API розміщений на віддаленому сервері.
* Ви будете використовувати програмне забезпечення SSH-клієнта і сервера для створення безпечного SOCKS5-тунелю між локальним і віддаленим сервером. HTTPS-трафік між клієнтом і Kubernetes API буде проходити через SOCKS5-тунель, який сам тунелюється через SSH.

{{< mermaid >}}
graph LR;

  subgraph local[Локальний клієнтський компʼютер]
  client([клієнт])-. локальний <br> трафік .->  local_ssh[Локальний SSH <br> SOCKS5 проксі];
  end
  local_ssh[SSH <br>SOCKS5 <br> проксі]-- SSH-тунель -->sshd
  
  subgraph remote[Віддалений сервер]
  sshd[SSH <br> сервер]-- локальний трафік -->service1;
  end
  client([клієнт])-. проксійований HTTPS-трафік <br> проходить через проксі .->service1[Kubernetes API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
Схема 1. Компоненти уроку про SOCKS5

## Використання ssh для створення SOCKS5-проксі {#using-ssh-to-create-a-socks5-proxy}

Наступна команда запускає SOCKS5-проксі між вашим клієнтським компʼютером і віддаленим SOCKS-сервером:

```shell
# SSH-тунель продовжує працювати у фоновому режимі після виконання цієї команди
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

SOCKS5-проксі дозволяє вам підключатися до сервера API вашого кластера на основі наступної конфігурації:

* `-D 1080`: відкриває SOCKS-проксі на локальному порту :1080.
* `-q`: тихий режим. Приглушує більшість попереджень і діагностичних повідомлень.
* `-N`: не виконувати віддалені команди. Корисно для простого пересилання портів.
* `username@kubernetes-remote-server.example`: віддалений SSH-сервер, за яким працює кластер Kubernetes  (наприклад, bastion host).

## Конфігурація клієнта {#client-configuration}

Щоб отримати доступ до сервера Kubernetes API через проксі, вам потрібно вказати `kubectl` надсилати запити через створений раніше `SOCKS` проксі. Зробіть це або налаштуванням відповідної змінної середовища, або через атрибут `proxy-url` у файлі kubeconfig. Використання змінної середовища:

```shell
export HTTPS_PROXY=socks5://localhost:1080
```

Щоб завжди використовувати це налаштування в конкретному контексті `kubectl`, вкажіть атрибут `proxy-url` у відповідному записі `cluster` у файлі `~/.kube/config`. Наприклад:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # скорочено для читабельності
    server: https://<API_SERVER_IP_ADDRESS>:6443  # сервер "Kubernetes API", тобто IP-адреса kubernetes-remote-server.example
    proxy-url: socks5://localhost:1080   # "SSH SOCKS5 проксі" на діаграмі вище
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CR== # скорочено для читабельності
    client-key-data: LS0tLS1CRUdJT=      # скорочено для читабельності
```

Після створення тунелю через команду ssh, зазначену вище, і визначення змінної середовища або атрибуту `proxy-url`, ви можете взаємодіяти з вашим кластером через цей проксі. Наприклад:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

{{< note >}}

* До версії `kubectl` 1.24 більшість команд `kubectl` працювали з використанням socks-проксі, за винятком `kubectl exec`.
* `kubectl` підтримує як змінні середовища `HTTPS_PROXY`, так і `https_proxy`. Вони використовуються іншими програмами, які підтримують SOCKS, такими як `curl`. Тому в деяких випадках краще визначити змінну середовища в командному рядку:

  ```shell
  HTTPS_PROXY=socks5://localhost:1080 kubectl get pods
  ```

* При використанні `proxy-url` проксі використовується лише для відповідного контексту `kubectl`, тоді як змінна середовища вплине на всі контексти.
* Імʼя хосту сервера k8s API можна додатково захистити від витоку DNS, використовуючи протокольну назву `socks5h` замість більш відомого протоколу `socks5`, показаного вище. У цьому випадку `kubectl` попросить проксі-сервер (наприклад, ssh bastion) виконати розвʼязання доменного імені сервера k8s API замість його розвʼязання у системі, яка запускає `kubectl`. Зауважте також, що з `socks5h` URL сервера k8s API, як-от `https://localhost:6443/api`, не стосується вашого локального клієнтського компʼютера. Натомість він стосується `localhost`, відомого на проксі-сервері (наприклад, ssh bastion).
{{</ note >}}

## Очищення {#clean-up}

Зупиніть процес пересилання портів ssh, натиснувши `CTRL+C` у терміналі, де він працює.

Введіть `unset https_proxy` у терміналі, щоб припинити пересилання HTTP-трафіку через проксі.

## Додаткові матеріали {#further-reading}

* [Віддалений клієнт OpenSSH](https://man.openbsd.org/ssh)
