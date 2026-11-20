---
title: Використання SOCKS5-проксі для доступу до Kubernetes API
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

На цій сторінці показано, як використовувати SOCKS5-проксі для доступу до API віддаленого кластера Kubernetes. Це корисно, коли кластер, до якого ви хочете отримати доступ, не відкриває свій API безпосередньо в публічному інтернеті.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібне клієнтське програмне забезпечення SSH (інструмент `ssh`) і сервіс SSH, що працює на віддаленому сервері. Ви повинні мати змогу увійти в сервіс SSH на віддаленому сервері.

<!-- steps -->

## Контекст завдання {#task-context}

{{< note >}}
У цьому прикладі трафік тунелюється через SSH, а клієнт і сервер SSH діють як SOCKS-проксі. Натомість можна використовувати будь-який інший вид проксі [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5).
{{</ note >}}

Схема 1 показує, чого ви досягнете в цьому завданні.

* У вас є клієнтський компʼютер, який у наступних кроках називається локальним, з якого ви надсилатимете запити до Kubernetes API.
* Сервер Kubernetes/API розміщений на віддаленому сервері.
* Ви використаєте клієнтське й серверне програмне забезпечення SSH, щоб створити захищений тунель SOCKS5 між локальним і віддаленим сервером. Трафік HTTPS між клієнтом і Kubernetes API проходитиме через тунель SOCKS5, який сам тунелюється через SSH.

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
Схема 1. Компоненти навчального матеріалу про SOCKS5

## Використання ssh для створення SOCKS5-проксі {#using-ssh-to-create-a-socks5-proxy}

Наведена нижче команда запускає SOCKS5-проксі між вашим клієнтським компʼютером і віддаленим SOCKS-сервером:

```shell
# SSH-тунель продовжує працювати на передньому плані після виконання цієї команди
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

SOCKS5-проксі дає змогу підʼєднуватися до API-сервера вашого кластера на основі такої конфігурації:

* `-D 1080`: відкриває SOCKS-проксі на локальному порту :1080.
* `-q`: тихий режим. Приглушує більшість попереджень і діагностичних повідомлень.
* `-N`: не виконувати віддалені команди. Корисно для простого пересилання портів.
* `username@kubernetes-remote-server.example`: віддалений SSH-сервер, за яким працює кластер Kubernetes (наприклад, bastion host).

## Конфігурація клієнта {#client-configuration}

Щоб отримати доступ до API-сервера Kubernetes через проксі, потрібно вказати `kubectl` надсилати запити через створений раніше проксі `SOCKS`. Зробіть це, встановивши відповідну змінну середовища або атрибут `proxy-url` у файлі kubeconfig. Використання змінної середовища:

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

Після створення тунелю згаданою вище командою ssh і визначення змінної середовища або атрибута `proxy-url` ви можете взаємодіяти з кластером через цей проксі. Наприклад:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

{{< note >}}

- До версії `kubectl` 1.24 більшість команд `kubectl` працювали із socks-проксі, за винятком `kubectl exec`.
- `kubectl` підтримує змінні середовища `HTTPS_PROXY` і `https_proxy`. Їх використовують інші програми, що підтримують SOCKS, як-от `curl`. Тому в деяких випадках краще визначити змінну середовища в командному рядку:

  ```shell
  HTTPS_PROXY=socks5://localhost:1080 kubectl get pods
  ```

- Якщо використовується `proxy-url`, проксі застосовується лише для відповідного контексту `kubectl`, тоді як змінна середовища впливає на всі контексти.
- Імʼя хоста API-сервера k8s можна додатково захистити від витоку DNS, використовуючи назву протоколу `socks5h` замість ширше відомого протоколу `socks5`, показаного вище. У цьому випадку `kubectl` попросить проксі-сервер (наприклад, ssh bastion) розвʼязати доменне імʼя API-сервера k8s замість того, щоб розвʼязувати його в системі, де працює `kubectl`. Зауважте також, що з `socks5h` URL API-сервера k8s, як-от `https://localhost:6443/api`, не вказує на ваш локальний клієнтський компʼютер. Натомість він вказує на `localhost`, відомий на проксі-сервері (наприклад, ssh bastion).
{{</ note >}}

## Очищення {#clean-up}

Зупиніть процес пересилання портів ssh, натиснувши `CTRL+C` у терміналі, де він працює.

Введіть `unset https_proxy` у терміналі, щоб припинити пересилання http-трафіку через проксі.

## Додаткові матеріали {#further-reading}

* [OpenSSH remote login client](https://man.openbsd.org/ssh)
