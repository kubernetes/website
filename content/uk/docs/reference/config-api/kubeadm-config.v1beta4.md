---
title: kubeadm Configuration (v1beta4)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta4
auto_generated: false
---

<h2>Огляд</h2>

Пакунок v1beta4 визначає версію v1beta4 формату конфігураційного файлу kubeadm. Ця версія покращує формат v1beta3, виправляючи деякі незначні проблеми і додаючи кілька нових полів.

Список змін з версії v1beta3:

v1.35:

- Додано поле `httpEndpoints` до `ClusterConfiguration.etcd.externalEtcd`, яке можна використовувати для налаштування точок доступу HTTP для комунікації etcd у v1beta4. Це поле використовується для відокремлення трафіку HTTP (такого як точки доступу `/metrics` та `/health`) від трафіку gRPC, що обробляється `endpoints`. Таке розділення дозволяє краще контролювати доступ, оскільки точки доступу HTTP можуть бути відкриті без відкриття основного інтерфейсу gRPC. Відповідає конфігурації etcd `--listen-client-http-urls`. Якщо не вказано, `endpoints` буде використовуватися як для трафіку gRPC, так і для трафіку HTTP.

v1.34:

- Додано "ECDSA-P384" до дозволених опцій алгоритму шифрування для `ClusterConfiguration.encryptionAlgorithm`

v1.33:

- Додає поле `EtcdUpgrade` до `UpgradeConfiguration.plan`, яке може бути використане для керування тим, чи треба показувати план оновлення etcd.

- Підтримуйте власні змінні оточення у компонентах панелі управління у розділі ClusterConfiguration. Використовуйте `apiServer.extraEnvs`, `controllerManager.extraEnvs`, `scheduler.extraEnvs`, `etcd.local.extraEnvs`.
- Тип API `ResetConfiguration` тепер підтримується у v1beta4. Користувачі можуть скинути конфігурацію вузла, передавши kubeadm reset файл `--config`.
- режим `dry-run` тепер налаштовується у `InitConfiguration` та `JoinConfiguration`.
- Замінено існуючі map додаткових аргументів типу рядок/рядок на структуровані додаткові аргументи, які підтримують дублікати. Зміни застосовано до `ClusterConfiguration` — `apiServer.extraArgs`, `controllerManager.extraArgs`, `scheduler.extraArgs`, `etcd.local.extraArgs`. Також до `nodeRegistration.kubeletExtraArgs`.
- Додано `ClusterConfiguration.encryptionAlgorithm`, за допомогою якого можна задати алгоритм асиметричного шифрування, що використовується для ключів і сертифікатів цього кластера. Може бути один з "RSA-2048" (стандартно), "RSA-3072", "RSA-4096" або "ECDSA-P256".
- Додано `ClusterConfiguration.dns.disabled` та `ClusterConfiguration.proxy.disabled`, за допомогою яких можна вимкнути надбудови CoreDNS та kube-proxy під час ініціалізації кластера. Якщо пропустити повʼязані з ними етапи під час створення кластера, ці ж поля буде встановлено у значення `true`.
- Додано поле `nodeRegistration.imagePullSerial` у `InitConfiguration` та `JoinConfiguration`, за допомогою якого можна контролювати, чи kubeadm витягує образи послідовно або паралельно.
- API kubeadm `UpgradeConfiguration` тепер підтримується у v1beta4 при передачі `--config` до команд `kubeadm upgrade`. Використання конфігурації компонентів для `kubelet` та `kube-proxy`, `InitConfiguration` та `ClusterConfiguration` є застарілим і буде проігноровано при передачі `--config` до команд `upgrade`.
- Додано структуру `Timeouts` до `InitConfiguration`, `JoinConfiguration`, `ResetConfiguration` та `UpgradeConfiguration`, яку можна використовувати для налаштування різних тайм-аутів. Поле `ClusterConfiguration.timeoutForControlPlane` замінено на `Timeouts.controlPlaneComponentHealthCheck`. Поле `JoinConfiguration.discovery.timeout` замінено на `timeouts.Discovery`.
- Додано поля `certificateValidityPeriod` та `caCertificateValidityPeriod` до `ClusterConfiguration`. Ці поля можна використовувати для контролю терміну дії сертифікатів, згенерованих kubeadm під час виконання таких підкоманд, як `init`, `join`, `upgrade` і `certs`. Стандартні значення залишаються 1 рік для сертифікатів без CA і 10 років для сертифікатів з CA. Лише сертифікати без CA можна поновлювати командою `kubeadm certs renew`.

<h1>Міграція зі старих версій конфігурації kubeadm</h1>

- kubeadm v1.15.x і новіше можна використовувати для міграції з v1beta1 на v1beta2.
- kubeadm v1.22.x і новіші більше не підтримують v1beta1 і старіші API, але можуть бути використані для міграції з v1beta2 на v1beta3.
- kubeadm v1.27.x і новіші більше не підтримують v1beta2 і старіші API.
- kubeadm v1.31.x і новіше можна використовувати для міграції з v1beta3 на v1beta4.

<h2>Основи</h2>

Найкращим способом налаштування kubeadm є передача конфігураційного файлу у форматі YAML з опцією `--config`. Деякі з параметрів конфігурації, визначених у конфігураційному файлі kubeadm, також доступні як прапорці командного рядка, але цей спосіб підтримує лише найпоширеніші/найпростіші випадки використання.

Конфігураційний файл kubeadm може містити декілька типів конфігурацій, розділених трьома тире (`---`).

kubeadm підтримує наступні типи конфігурацій:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration

apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: ResetConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
```

Для виведення стандартних значень для дій `init` та `join` скористайтеся наступними командами:

```shell
kubeadm config print init-defaults
kubeadm config print join-defaults
kubeadm config print reset-defaults
kubeadm config print upgrade-defaults
```

Перелік типів конфігурацій, які необхідно включити до конфігураційного файлу, залежить від дії, яку ви виконуєте (`init` або `join`), а також від параметрів конфігурації, які ви збираєтеся використовувати (стандартні або розширені налаштування).

Якщо деякі типи конфігурацій не передбачено або передбачено лише частково, kubeadm використовуватиме стандартні значення; стандартне налаштування kubeadm включає також забезпечення узгодженості значень між компонентами, коли це необхідно (наприклад, прапорець `--cluster-cidr` на менеджері контролерів та `clusterCIDR` на kube-proxy).

Користувачам завжди дозволено перевизначати стандартні значення, за винятком невеликої підгрупи налаштувань, що мають відношення до безпеки (наприклад, включення режиму авторизації Node і RBAC на api-сервері).

Якщо користувач надасть типи конфігурації, які не очікуються для дії, яку ви виконуєте, kubeadm проігнорує ці типи та виведе попередження.

<h2>Типи конфігурацій Kubeadm init</h2>

При виконанні kubeadm init з опцією `--config` можуть бути використані наступні типи конфігурацій: InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, але тільки один з них між InitConfiguration і ClusterConfiguration є обовʼязковим.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
bootstrapTokens:

	...

nodeRegistration:

	...
```

Тип InitConfiguration слід використовувати для налаштування параметрів часу виконання, якими у випадку kubeadm init є конфігурація токена завантажувача та всі параметри, специфічні для вузла, на якому виконується kubeadm, включно з:

- NodeRegistration, що містить поля, які стосуються реєстрації нового вузла у кластері; використовуйте його, щоб налаштувати імʼя вузла, сокет CRI для використання або будь-які інші параметри, які мають застосовуватися лише до цього вузла (наприклад, ip вузла).
- LocalAPIEndpoint, що представляє точку доступу до екземпляра сервера API, який буде розгорнуто на цьому вузлі; використовуйте його, наприклад, для налаштування адреси оголошень сервера API.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:

	...

etcd:

	...

apiServer:

	extraArgs:
	  ...
	extraVolumes:
	  ...

...
```

Тип ClusterConfiguration слід використовувати для налаштування параметрів всього кластера, включаючи налаштування для:

- `networking`, що зберігає конфігурацію мережевої топології кластера; використовуйте його, наприклад, для налаштування підмережі Pod або підмережі сервісів.
- `etcd`: використовуйте його, наприклад, для налаштування локального etcd або для налаштування сервера API для використання зовнішнього кластера etcd.
- конфігурації kube-apiserver, kube-scheduler, kube-controller-manager; використовуйте його для налаштування компонентів панелі управління, додаючи індивідуальні налаштування або перевизначаючи стандартні налаштування kubeadm.

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration

	...

```

Тип KubeProxyConfiguration слід використовувати для зміни конфігурації, що передається екземплярам kube-proxy, розгорнутим у кластері. Якщо цей обʼєкт не надано або надано лише частково, kubeadm застосовує стандартні значення.

Офіційну документацію про kube-proxy можна знайти на [https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/](/docs/reference/command-line-tools-reference/kube-proxy/) або https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

	...

```

Тип KubeletConfiguration слід використовувати для зміни конфігурацій, які буде передано всім екземплярам kubelet, розгорнутим у кластері. Якщо цей обʼєкт не надано або надано лише частково, kubeadm застосовує стандартні налаштування.

Офіційну документацію про kubelet можна знайти на [https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/](/docs/reference/command-line-tools-reference/kubelet/) або https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration.

Ось повністю заповнений приклад одного YAML-файлу, що містить декілька типів конфігурації для використання під час запуску `kubeadm init`.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
bootstrapTokens:
  - token: "9a08jv.c0izixklcxtmnze7"
    description: "kubeadm bootstrap token"
    ttl: "24h"
  - token: "783bde.3f89s0fje9f38fhf"
    description: "another bootstrap token"
    usages:
  - authentication
  - signing
    groups:
  - system:bootstrappers:kubeadm:default-node-token

nodeRegistration:
  name: "ec2-10-100-0-1"
  criSocket: "unix:///var/run/containerd/containerd.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    - name: v
      value: 5
  ignorePreflightErrors:
     - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"

localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443

certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - preflight

timeouts:
  controlPlaneComponentHealthCheck: "60s
  kubernetesAPICall: "40s"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:

  # локальний або зовнішній etcd
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      - name: listen-client-urls
        value: http://10.100.0.1:2379
    extraEnvs:
      - name: SOME_VAR
        value: SOME_VALUE
    serverCertSANs:
      -  ec2-10-100-0-1.compute-1.amazonaws.com
    peerCertSANs:
      - 10.100.0.1
# external:
  # endpoints:
  # - 10.100.0.1:2379
  # - 10.100.0.2:2379
  # caFile: "/etcd/kubernetes/pki/etcd/etcd-ca.crt"
  # certFile: "/etcd/kubernetes/pki/etcd/etcd.crt"
  # keyFile: "/etcd/kubernetes/pki/etcd/etcd.key"

networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "10.244.0.0/24"
  dnsDomain: "cluster.local"

kubernetesVersion: "v1.21.0"
controlPlaneEndpoint: "10.100.0.1:6443"
apiServer:

  extraArgs:
    - name: authorization-mode
      value: Node,RBAC
  extraEnvs:
    - name: SOME_VAR
      value: SOME_VALUE
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
  certSANs:
    - "10.100.1.1"
    - "ec2-10-100-0-1.compute-1.amazonaws.com"

controllerManager:
  extraArgs:
    - name: node-cidr-mask-size
      value: "20"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File

scheduler:
  extraArgs:
    - name: address
      value: 10.100.0.1
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File

certificatesDir: "/etc/kubernetes/pki"
imageRepository: "registry.k8s.io"
clusterName: "example-cluster"
encryptionAlgorithm: ECDSA-P256
dns:
  disabled: true  # disable CoreDNS
proxy:
  disabled: true   # disable kube-proxy
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
# параметри kubelet вказуються тут
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
# параметри kube-proxy вказуються тут
```

<h2>Типи конфігурацій Kubeadm join</h2>

При виконанні kubeadm join з опцією --config слід вказати тип JoinConfiguration.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: some-address:6443
    token: abcdef.0123456789abcdef
    unsafeSkipCAVerification: true
  tlsBootstrapToken: abcdef.0123456789abcdef
```

Тип JoinConfiguration слід використовувати для налаштування параметрів часу виконання, якими у випадку kubeadm join є метод виявлення, що використовується для доступу до інформації про кластер, а також всі налаштування, специфічні для вузла, на якому виконується kubeadm, включно з:

- `nodeRegistration`, що містить поля, які стосуються реєстрації нового вузла у кластері; використовуйте його, щоб налаштувати імʼя вузла, сокет CRI для використання або будь-які інші параметри, які мають застосовуватися лише до цього вузла (наприклад, ip вузла).
- `apiEndpoint`, що представляє точку доступу до екземпляра сервера API, який буде розгорнуто на цьому вузлі.

<h2>Типи конфігурацій Kubeadm reset</h2>

При виконанні `kubeadm reset` з опцією `--config` слід вказати тип `ResetConfiguration`.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ResetConfiguration
...
```

<h2>Типи конфігурацій Kubeadm upgrade</h2>

При виконанні `kubeadm upgrade` з опцією `--config` слід вказати тип `UpgradeConfiguration`.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  ...

diff:
  ...

node:
  ...

plan:
  ...
```

Структура `UpgradeConfiguration` містить кілька підструктур, які застосовуються тільки різних команд `kubeadm upgrade`. Наприклад, `apply` використовується з командою `kubeadm upgrade apply` тож всі інші підструктури будуть проігноровані.

## Типи ресурсів {#resource-types}

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)
- [ResetConfiguration](#kubeadm-k8s-io-v1beta4-ResetConfiguration)
- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

## `BootstrapToken` {#BootstrapToken}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

BootstrapToken описує один bootstrap token, зберігається як Secret у кластері</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>token</code> <b>[Обовʼязкове]</b><br/>
<a href="#BootstrapTokenString"><code>BootstrapTokenString</code></a>
</td>
<td>
   <p><code>token</code> використовується для встановлення двосторонньої довіри між вузлами та панеллю управління. Використовується для приєднання вузлів до кластера.</p>
</td>
</tr>
<tr><td><code>description</code><br/>
<code>string</code>
</td>
<td>
   <p><code>description</code> встановлює зрозуміле людині повідомлення про те, чому існує цей токен і для чого він використовується, щоб інші адміністратори могли зрозуміти його призначення.</p>
</td>
</tr>
<tr><td><code>ttl</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>ttl</code> визначає час життя цього токена. Стандартно — <code>24h</code>.
<code>expires</code> та <code>ttl</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p><code>expires</code> вказує на момент, коли цей токен закінчує свою дію. Стандартно встановлюється динамічно під час виконання на основі <code>ttl</code>.
<code>expires</code> та <code>ttl</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>usages</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>usages</code> описує способи, якими цей токен може бути використаний. Може стандартно використовуватися для встановлення двосторонньої довіри, але це можна змінити тут.</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>groups</code> вказує на додаткові групи, до яких цей токен буде автентифікуватися при використанні для автентифікації</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenString` {#BootstrapTokenString}

**Зʼявляється в:**

- [BootstrapToken](#BootstrapToken)

BootstrapTokenString є токеном формату <code>abcdef.abcdef0123456789</code>, який використовується як для перевірки практичності API сервера з погляду вузла, що приєднується, так і як метод автентифікації вузла в фазі bootstrap команди &quot;kubeadm join&quot;. Цей токен є і має бути короткочасним.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>-</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>-</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `ClusterConfiguration` {#kubeadm-k8s-io-v1beta4-ClusterConfiguration}

ClusterConfiguration містить конфігурацію на рівні кластера для кластера kubeadm.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ClusterConfiguration</code></td></tr>
<tr><td><code>etcd</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Etcd"><code>Etcd</code></a>
</td>
<td>
   <p><code>etcd</code> містить конфігурацію для etcd.</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Networking"><code>Networking</code></a>
</td>
<td>
   <p><code>networking</code> містить конфігурацію для мережевої топології кластера.</p>
</td>
</tr>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <p><code>kubernetesVersion</code> — це цільова версія панелі управління.</p>
</td>
</tr>
<tr><td><code>controlPlaneEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p><code>controlPlaneEndpoint</code> встановлює стабільну IP-адресу або DNS-імʼя для панелі управління; Може бути дійсною IP-адресою або піддоменом RFC-1123 DNS, обидва з необовʼязковим TCP портом. Якщо <code>controlPlaneEndpoint</code> не зазначено, використовуються <code>advertiseAddress</code> + <code>bindPort</code>; якщо <code>controlPlaneEndpoint</code> зазначено, але без TCP порту, використовується <code>bindPort</code>. Можливі використання:</p>
<ul>
<li>У кластері з більше ніж однією панеллю управління, це поле має бути присвоєно адресі зовнішнього балансувальника навантаження перед екземплярами панелі управління.</li>
<li>У середовищах з примусовою утилізацією вузлів, <code>controlPlaneEndpoint</code> може використовуватися для присвоєння стабільного DNS панелі управління.</li>
</ul>
</td>
</tr>
<tr><td><code>apiServer</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIServer"><code>APIServer</code></a>
</td>
<td>
   <p><code>apiServer</code> містить додаткові налаштування для API сервера.</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p><code>controllerManager</code> містить додаткові налаштування для менеджера контролерів.</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p><code>scheduler</code> містить додаткові налаштування для планувальника.</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-DNS"><code>DNS</code></a>
</td>
<td>
   <p><code>dns</code> визначає параметри для нпдбудови DNS, встановленої в кластері.</p>
</td>
</tr>
<tr><td><code>proxy</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-Proxy"><code>Proxy</code></a>
</td>
<td>
   <p><code>proxy</code> визначає параметри для надбудови проксі, встановленої в кластері.</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificatesDir</code> вказує, де зберігати або шукати всі необхідні сертифікати.</p>
</td>
</tr>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <p><code>imageRepository</code> встановлює реєстр контейнерів для витягування зображень. Якщо порожньо, стандартно використовується <code>registry.k8s.io</code>. У випадку, якщо версія Kubernetes є CI-збіркою (версія Kubernetes починається з <code>ci/</code>) <code>gcr.io/k8s-staging-ci-images</code> буде використовуватись для компонентів панелі управління та для kube-proxy, тоді як <code>registry.k8s.io</code> буде використовуватися для всіх інших образів.</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <p><code>featureGates</code> містить функціональні можливості kubeadm, увімкнені користувачем.</p>
</td>
</tr>
<tr><td><code>clusterName</code><br/>
<code>string</code>
</td>
<td>
   <p>Назва кластера. Ця назва буде використовуватися у файлах kubeconfig, що генеруються kubeadm, а також буде передаватися як значення прапорця <code>--cluster-name</code> kube-controller-manager. Стандартне значенням — <code>&quot;kubernetes&quot;</code>.</p>
</td>
</tr>
<tr><td><code>encryptionAlgorithm</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-EncryptionAlgorithmType"><code>EncryptionAlgorithmType</code></a>
</td>
<td>
   <p><code>encryptionAlgorithm</code> містить тип асиметричного алгоритму шифрування, що використовується для ключів та сертифікатів. Може бути один з <code>&quot;RSA-2048&quot;</code> (стандартний алгоритм), <code>&quot;RSA-3072&quot;</code>, <code>&quot;RSA-4096&quot;</code>, <code>&quot;ECDSA-P256&quot;</code> або <code>&quot;ECDSA-P384&quot;</code>.</p>
</td>
</tr>
</tr>
<tr><td><code>certificateValidityPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>certificateValidityPeriod</code> вказує термін дії для не-СА сертифікату, згенерованого kubeadm. Стандартне значення: <code>8760h</code> (365 днів * 24 години = 1 рік)</p>
</td>
</tr>
<tr><td><code>caCertificateValidityPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>caCertificateValidityPeriod</code> вказує термін дії для СА сертифікату, згенерованого kubeadm. Стандартне значення:  <code>87600h</code> (365 днів * 24 годин * 10 = 10 років)</p>
</td>
</tbody>
</table>

## `InitConfiguration` {#kubeadm-k8s-io-v1beta4-InitConfiguration}

InitConfiguration містить список елементів, що специфічні для тільки для запуску <code>kubeadm init</code>. Ці поля використовуються лише під час першого запуску <code>kubeadm init</code>. Після цього інформація в цих полях НЕ завантажується до ConfigMap <code>kubeadm-config</code>, який використовується, наприклад, при <code>kubeadm upgrade</code>. Ці поля повинні бути опущені.</p>


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InitConfiguration</code></td></tr>
<tr><td><code>bootstrapTokens</code><br/>
<a href="#BootstrapToken"><code>[]BootstrapToken</code></a>
</td>
<td>
   <p><code>bootstrapTokens</code> враховується під час <code>kubeadm init</code> і описує набір Bootstrap Token для створення. Ця інформація НЕ завантажується до ConfigMap кластера kubeadm, частково через її чутливий характер.</p>
</td>
</tr>
<tr><td><code>dryRun</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим перевірки, не застосовувати жодні зміни в режимі перевірки, просто вивести те, що буде зроблено.</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p><code>nodeRegistration</code> містить поля, що стосуються реєстрації нового вузла панелі управління в кластері.</p>
</td>
</tr>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p><code>localAPIEndpoint</code> представляє точку доступу до екземпляра API сервера, що розгорнутий на цьому вузлі панелі управління. У налаштуваннях HA це відрізняється від <code>ClusterConfiguration.controlPlaneEndpoint</code> тим, що <code>controlPlaneEndpoint</code> є глобальною точкою доступу для кластера, яка потім розподіляє запити між кожним окремим API сервером. Цей обʼєкт конфігурації дозволяє налаштувати, на якій IP/DNS-імʼя та порт локальний API сервер оголошує свою доступність. Стандартно kubeadm намагається автоматично визначити IP адресу інтерфейсу та використовувати її, але якщо цей процес не вдалося, ви можете встановити бажане значення тут.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificateKey</code> встановлює ключ, яким шифруються сертифікати та ключі перед завантаженням в Secret в кластері під час фази <code>uploadcerts init</code>. Ключ сертифіката є рядком у форматі hex, що є AES ключем розміром 32 байти.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> є списком фаз, які потрібно пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm init --help</code>. Прапорець <code>--skip-phases</code> має пріоритет над цим полем.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить параметри, що стосуються застосування патчів до компонентів, розгорнутих kubeadm під час <code>kubeadm init</code>.</p>
</td>
</tr>
<tr><td><code>timeouts</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Timeouts"><code>Timeouts</code></a>
</td>
<td>
   <p><code>timeouts</code> містить різні тайм-аути, які застосовуються до команд kubeadm.</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration` {#kubeadm-k8s-io-v1beta4-JoinConfiguration}

JoinConfiguration містить елементи, що описують конкретний вузол.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>JoinConfiguration</code></td></tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим перевірки. Якщо він увімкнений, не застосовуються жодні зміни, просто виводиться те, що буде зроблено.</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p><code>nodeRegistration</code> містить поля, що стосуються реєстрації нового вузла панелі управління в кластері.</p>
</td>
</tr>
<tr><td><code>caCertPath</code><br/>
<code>string</code>
</td>
<td>
   <p><code>caCertPath</code> є шляхом до SSL центру сертифікації, що використовується для забезпечення комунікацій між вузлом та панеллю управління. Стандартно — <code>/etc/kubernetes/pki/ca.crt</code>.</p>
</td>
</tr>
<tr><td><code>discovery</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-Discovery"><code>Discovery</code></a>
</td>
<td>
   <p><code>discovery</code> вказує параметри, які kubelet використовує під час процесу TLS bootstrap.</p>
</td>
</tr>
<tr><td><code>controlPlane</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-JoinControlPlane"><code>JoinControlPlane</code></a>
</td>
<td>
   <p><code>controlPlane</code> визначає додатковий екземпляр панелі управління, який буде розгорнуто на вузлі, що приєднується. Якщо nil, жоден додатковий екземпляр панелі управління не буде розгорнуто.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> є списком фаз, які потрібно пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm join --help</code>. Прапорець <code>--skip-phases</code> має пріоритет над цим полем.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить параметри, що стосуються застосування патчів до компонентів, розгорнутих kubeadm під час <code>kubeadm join</code>.</p>
</td>
</tr>
<tr><td><code>timeouts</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Timeouts"><code>Timeouts</code></a>
</td>
<td>
   <p><code>timeouts</code> містить різні тайм-аути, які застосовуються до команд kubeadm.</p>
</td>
</tr>
</tbody>
</table>

## `ResetConfiguration` {#kubeadm-k8s-io-v1beta4-ResetConfiguration}

ResetConfiguration містить список полів, що є специфічними для режиму <code>kubeadm reset</code>.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ResetConfiguration</code></td></tr>
<tr><td><code>cleanupTmpDir</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>cleanupTmpDir</code> вказує, чи слід очищати теку <code>/etc/kubernetes/tmp</code> під час процесу скидання.</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificatesDir</code> вказує теку, де зберігаються сертифікати. Якщо вказано, вона буде очищена під час процесу скидання.</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <p><code>criSocket</code> використовується для отримання інформації про середовище виконання контейнерів для видалення контейнерів. Якщо <code>criSocket</code> не вказано через прапорець або файл конфігурації, kubeadm спробує виявити дійсний CRI сокет.</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим перевірки. Якщо так, жодні зміни не застосовуються, а просто виводиться те, що буде зроблено.</p>
</td>
</tr>
<tr><td><code>force</code><br/>
<code>bool</code>
</td>
<td>
   <p>Флаг <code>force</code> інструктує kubeadm скинути вузол без запиту підтвердження.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає список помилок перед стартом, які слід ігнорувати під час процесу скидання, наприклад, <code>IsPrivilegedUser,Swap</code>. Значення <code>all</code> ігнорує помилки з усіх перевірок.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> є списком фаз, які потрібно пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm reset phase --help</code>.</p>
</td>
</tr>
<tr><td><code>unmountFlags</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>unmountFlags</code> — список прапорців syscall <code>unmount2()</code>, які kubeadm може використовувати при розмонтуванні тек під час &quot; reset&quot;. Цей прапорець може бути одним з: <code>&quot;MNT_FORCE&quot;</code>, <code>&quot;MNT_DETACH&quot;</code>, <code>&quot;MNT_EXPIRE&quot;</code>, <code>&quot;UMOUNT_NOFOLLOW&quot;</code>. Стандартно цей список порожній.</p>
</td>
</tr>
<tr><td><code>timeouts</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Timeouts"><code>Timeouts</code></a>
</td>
<td>
   <p><code>timeouts</code> містить різні тайм-аути, які застосовуються до команд kubeadm.</p>
</td>
</tr>
</tbody>
</table>

## `UpgradeConfiguration` {#kubeadm-k8s-io-v1beta4-UpgradeConfiguration}

UpgradeConfiguration містить список опцій, специфічних для підкоманд <code>kubeadm upgrade</code>.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>UpgradeConfiguration</code></td></tr>
<tr><td><code>apply</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-UpgradeApplyConfiguration"><code>UpgradeApplyConfiguration</code></a>
</td>
<td>
   <p><code>apply</code> містить список опцій, специфічних для команди <code>kubeadm upgrade apply</code>.</p>
</td>
</tr>
<tr><td><code>diff</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-UpgradeDiffConfiguration"><code>UpgradeDiffConfiguration</code></a>
</td>
<td>
   <p><code>diff</code> містить список опцій, специфічних для команди <code>kubeadm upgrade diff</code>.</p>
</td>
</tr>
<tr><td><code>node</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-UpgradeNodeConfiguration"><code>UpgradeNodeConfiguration</code></a>
</td>
<td>
   <p><code>node</code> містить список опцій, специфічних для команди <code>kubeadm upgrade node</code>.</p>
</td>
</tr>
<tr><td><code>plan</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-UpgradePlanConfiguration"><code>UpgradePlanConfiguration</code></a>
</td>
<td>
   <p><code>plan</code> містить список опцій, специфічних для команди <code>kubeadm upgrade plan</code>.</p>
</td>
</tr>
<tr><td><code>timeouts</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Timeouts"><code>Timeouts</code></a>
</td>
<td>
   <p><code>timeouts</code> містить різні тайм-аути, які застосовуються до команд kubeadm.</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint` {#kubeadm-k8s-io-v1beta4-APIEndpoint}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinControlPlane](#kubeadm-k8s-io-v1beta4-JoinControlPlane)

Структура APIEndpoint містить елементи для екземпляра API сервера, розгорнутого на вузлі.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>advertiseAddress</code><br/>
<code>string</code>
</td>
<td>
   <p><code>advertiseAddress</code> встановлює IP-адресу, яку API сервер буде оголошувати.</p>
</td>
</tr>
<tr><td><code>bindPort</code><br/>
<code>int32</code>
</td>
<td>
   <p><code>bindPort</code> встановлює захищений порт, до якого API сервер буде привʼязаний. Стандартно — 6443.</p>
</td>
</tr>
</tbody>
</table>

## `APIServer` {#kubeadm-k8s-io-v1beta4-APIServer}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

APIServer містить налаштування, необхідні для розгортання API сервера в кластері.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ControlPlaneComponent</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>(Члени <code>ControlPlaneComponent</code> вбудовані в цей тип.)
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>certSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>certSANs</code> встановлює додаткові альтернативні імена субʼєкта (SAN) для сертифіката підпису API сервера.</p>
</td>
</tr>
</tbody>
</table>

## `Arg` {#kubeadm-k8s-io-v1beta4-Arg}

**Зʼявляється в:**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta4-ControlPlaneComponent)

- [LocalEtcd](#kubeadm-k8s-io-v1beta4-LocalEtcd)

- [NodeRegistrationOptions](#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)

Arg представляє собою аргумент з імʼям і значенням.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Імʼя аргументу.</p>
</td>
</tr>
<tr><td><code>value</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Значення аргументу.</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenDiscovery` {#kubeadm-k8s-io-v1beta4-BootstrapTokenDiscovery}

**Зʼявляється в:**

- [Discovery](#kubeadm-k8s-io-v1beta4-Discovery)

BootstrapTokenDiscovery використовується для налаштування параметрів для виявлення з використанням токенів.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>token</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>token</code> є токеном, що використовується для перевірки інформації про кластер, отриманої від панелі управління.</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p><code>apiServerEndpoint</code> є IP-адресою або доменним імʼям API-сервера, з якого буде отримана інформація.</p>
</td>
</tr>
<tr><td><code>caCertHashes</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>caCertHashes</code> вказує набір публічних ключів, які потрібно перевірити при використанні виявлення на основі токенів. Кореневий CA, знайдений під час виявлення, повинен відповідати одному з цих значень. Вказівка порожнього набору вимикає привʼязку кореневого CA, що може бути небезпечним. Кожен хеш вказується як <code>&lt;type&gt;:&lt;value&gt;</code>, де єдиний підтримуваний тип наразі — "sha256". Це хеш SHA-256 коду обʼєкта Subject Public Key Info (SPKI) у DER-кодованому ASN.1. Ці хеші можна розрахувати за допомогою, наприклад, OpenSSL.</p>
</td>
</tr>
<tr><td><code>unsafeSkipCAVerification</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>unsafeSkipCAVerification</code> дозволяє виявлення на основі токенів без перевірки CA через <code>caCertHashes</code>. Це може ослабити безпеку kubeadm, оскільки інші вузли можуть видавати себе за панель управління.</p>
</td>
</tr>
</tbody>
</table>

## `ControlPlaneComponent` {#kubeadm-k8s-io-v1beta4-ControlPlaneComponent}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

- [APIServer](#kubeadm-k8s-io-v1beta4-APIServer)

ControlPlaneComponent містить налаштування, загальні для компонентів панелі управління кластера.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>extraArgs</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Arg"><code>[]Arg</code></a>
</td>
<td>
   <p><code>extraArgs</code> — це додатковий набір прапорців, які передаються компоненту панелі управління. Назва аргументу в цьому списку є назвою прапорця, як вона зʼявляється в командному рядку, але без початковиї дефісів. Додаткові аргументи переважатимуть існуючі стандартні аргументи. Дублікати додаткових аргументів дозволені.</p>
</td>
</tr>
<tr><td><code>extraVolumes</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-HostPathMount"><code>[]HostPathMount</code></a>
</td>
<td>
   <p><code>extraVolumes</code> — це додатковий набір томів хостів, які монтуються до компонента панелі управління.</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-EnvVar"><code>[]EnvVar</code></a>
</td>
<td>
   <p><code>extraEnvs</code> — це додатковий набір змінних середовища, які передаються компоненту панелі управління. Змінні середовища, передані за допомогою <code>extraEnvs</code>, переважатимуть будь-які існуючі змінні середовища або змінні середовища <code>*_proxy</code>, які kubeadm додає стандартно.</p>
</td>
</tr>
</tbody>
</table>

## `DNS` {#kubeadm-k8s-io-v1beta4-DNS}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

DNS визначає аддон DNS, який має бути використаний у кластері.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ImageMeta</code> <b>[Обовʼязково]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>(Члени <code>ImageMeta</code> вбудовані в цей тип.)
   <p><code>imageMeta</code> дозволяє налаштувати образ, що використовується для надбудови DNS.</p>
</td>
</tr>
<tr><td><code>disabled</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p><code>disabled</code> вказує, чи слід вимкнути цю надбудовув кластері.</p>
</td>
</tr>
</tbody>
</table>

## `Discovery` {#kubeadm-k8s-io-v1beta4-Discovery}

**Зʼявляється в:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)

Discovery визначає параметри для kubelet під час процесу TLS Bootstrap.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>bootstrapToken</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-BootstrapTokenDiscovery"><code>BootstrapTokenDiscovery</code></a>
</td>
<td>
   <p><code>bootstrapToken</code> використовується для налаштування параметрів для виявлення за допомогою токена Bootstrap. <code>bootstrapToken</code> і <code>file</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>file</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-FileDiscovery"><code>FileDiscovery</code></a>
</td>
<td>
   <p><code>file</code> використовується для вказівки файлу або URL на kubeconfig файл, з якого завантажується інформація про кластер. <code>bootstrapToken</code> і <code>file</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>tlsBootstrapToken</code><br/>
<code>string</code>
</td>
<td>
   <p><code>tlsBootstrapToken</code> є токеном, що використовується для TLS bootstrapping. Якщо <code>bootstrapToken</code> встановлено, це поле стандартно буде дорівнювати <code>bootstrapToken.token</code>, але його можна перевизначити. Якщо <code>file</code> встановлено, це поле <strong>повинно бути встановлено</strong>, якщо файл KubeConfigFile не містить іншої інформації для автентифікації.</p>
</td>
</tr>
</tbody>
</table>

## `EncryptionAlgorithmType` {#kubeadm-k8s-io-v1beta4-EncryptionAlgorithmType}

(Аліас для `string`)

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

EncryptionAlgorithmType може визначити тип асиметричного алгоритму шифрування.

## `EnvVar` {#kubeadm-k8s-io-v1beta4-EnvVar}

**Зʼявляється в:**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta4-ControlPlaneComponent)

- [LocalEtcd](#kubeadm-k8s-io-v1beta4-LocalEtcd)

EnvVar представляє змінну середовища, присутню в контейнері.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>EnvVar</code> <b>[Обовʼязкове]</b><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#envvar-v1-core"><code>core/v1.EnvVar</code></a>
</td>
<td>(Члени <code>EnvVar</code> вбудовані в цей тип.)
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `Etcd` {#kubeadm-k8s-io-v1beta4-Etcd}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

Etcd містить елементи, що описують конфігурацію Etcd.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>local</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-LocalEtcd"><code>LocalEtcd</code></a>
</td>
<td>
   <p><code>local</code> надає конфігураційні параметри для налаштування локального екземпляра etcd.
<code>local</code> та <code>external</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>external</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ExternalEtcd"><code>ExternalEtcd</code></a>
</td>
<td>
   <p><code>external</code> описує, як підключитися до зовнішнього кластеру etcd.
<code>local</code> та <code>external</code> є взаємовиключними.</p>
</td>
</tr>
</tbody>
</table>

## `ExternalEtcd` {#kubeadm-k8s-io-v1beta4-ExternalEtcd}

**Зʼявляється в:**

- [Etcd](#kubeadm-k8s-io-v1beta4-Etcd)

ExternalEtcd описує зовнішній кластер etcd. Kubeadm не має інформації про те, де знаходяться файли сертифікатів, і їх необхідно надати.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>endpoints</code> <b>[Обовʼязкове]</b><br/>
<code>[]string</code>
</td>
<td>
   <p><code>endpoints</code> містить список членів etcd. Це визначає URL-адреси клієнта (зазвичай точки доступу gRPC) для звʼязку з etcd. Стандартно ці точки доступу обробляють як трафік gRPC (основний протокол etcd), так і трафік HTTP (метрики, перевірки працездатності). Однак, якщо налаштовано <code>httpEndpoints</code>, трафік gRPC і HTTP можна розділити для підвищення безпеки та продуктивності. Відповідає конфігурації etcd <code>--listen-client-urls</code>.</p>
</td>
</tr>
<tr><td><code>httpEndpoints</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>httpEndpoints</code> є спеціальними точками доступу HTTP для комунікації etcd. Після налаштування HTTP-трафік (такий як точки доступу <code>/metics</code> та <code>/health</code>) відокремлюється від gRPC-трафіку, що обробляється <code>endpoints</code>. Таке відокремлення дозволяє краще контролювати доступ, оскільки точки доступу HTTP можуть бути експоновані без відкриття основного інтерфейсу gRPC. Відповідає конфігурації etcd <code>--listen-client-http-urls</code>. Якщо не вказано, <code>endpoints</code> буде використовуватися як для трафіку gRPC, так і для трафіку HTTP.</p>
</td>
</tr>
<tr><td><code>caFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>caFile</code> є файлом центру сертифікації (CA) SSL, що використовується для захисту комунікації etcd. Необхідний, якщо використовується зʼєднання TLS.</p>
</td>
</tr>
<tr><td><code>certFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>certFile</code> є файлом сертифікації SSL, що використовується для захисту комунікації etcd. Необхідний, якщо використовується зʼєднання TLS.</p>
</td>
</tr>
<tr><td><code>keyFile</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>keyFile</code> є файлом ключа SSL, що використовується для захисту комунікації etcd. Необхідний, якщо використовується зʼєднання TLS.</p>
</td>
</tr>
</tbody>
</table>

## `FileDiscovery` {#kubeadm-k8s-io-v1beta4-FileDiscovery}

**Зʼявляється в:**

- [Discovery](#kubeadm-k8s-io-v1beta4-Discovery)

FileDiscovery використовується для вказівки файлу або URL на kubeconfig файл, з якого слід завантажити інформацію про кластер.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubeConfigPath</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>kubeConfigPath</code> використовується для вказівки фактичного шляху до файлу або URL на kubeconfig файл, з якого слід завантажити інформацію про кластер.</p>
</td>
</tr>
</tbody>
</table>

## `HostPathMount` {#kubeadm-k8s-io-v1beta4-HostPathMount}

**Зʼявляється в:**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta4-ControlPlaneComponent)

HostPathMount містить елементи, що описують томи, які монтуються з хоста.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>name</code> — це назва тому всередині шаблону Pod.</p>
</td>
</tr>
<tr><td><code>hostPath</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>hostPath</code> — це шлях на хості, який буде змонтований всередині Pod.</p>
</td>
</tr>
<tr><td><code>mountPath</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>mountPath</code> — це шлях всередині Pod, де буде змонтований <code>hostPath</code>.</p>
</td>
</tr>
<tr><td><code>readOnly</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>readOnly</code> контролює доступ на запис до тому.</p>
</td>
</tr>
<tr><td><code>pathType</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#hostpathtype-v1-core"><code>core/v1.HostPathType</code></a>
</td>
<td>
   <p><code>pathType</code> — це тип <code>hostPath</code>.</p>
</td>
</tr>
</tbody>
</table>

## `ImageMeta` {#kubeadm-k8s-io-v1beta4-ImageMeta}

**Зʼявляється в:**

- [DNS](#kubeadm-k8s-io-v1beta4-DNS)

- [LocalEtcd](#kubeadm-k8s-io-v1beta4-LocalEtcd)

ImageMeta дозволяє налаштувати образ, що використовується для компонентів, які не походять з процесу релізу Kubernetes/Kubernetes.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <p><code>imageRepository</code> визначає реєстр контейнерів, з якого потрібно завантажити образи. Якщо не вказано, буде використано <code>imageRepository</code>, визначений в ClusterConfiguration.</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <p><code>imageTag</code> дозволяє вказати тег для образу. У випадку, якщо це значення вказане, kubeadm не змінює автоматично версію вищезазначених компонентів під час оновлень.</p>
</td>
</tr>
</tbody>
</table>

## `JoinControlPlane` {#kubeadm-k8s-io-v1beta4-JoinControlPlane}

**Зʼявляється в:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)

JoinControlPlane містить елементи, що описують додатковий екземпляр контрольної плити, який має бути розгорнуто на приєднуючому вузлі.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p><code>localAPIEndpoint</code> представляє точку доступу екземпляра API сервера, яка має бути розгорнута на цьому вузлі.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificateKey</code> є ключем, що використовується для розшифрування сертифікатів після їх завантаження з Secret при приєднанні нового вузла панелі управління. Відповідний ключ шифрування знаходиться в InitConfiguration. Ключ сертифіката є рядком у шістнадцятковому кодуванні, який є AES ключем розміром 32 байти.</p>
</td>
</tr>
</tbody>
</table>

## `LocalEtcd` {#kubeadm-k8s-io-v1beta4-LocalEtcd}

**Зʼявляється в:**

- [Etcd](#kubeadm-k8s-io-v1beta4-Etcd)

LocalEtcd описує, що kubeadm має запустити кластер etcd локально.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ImageMeta</code> <b>[Обовʼязково]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>(Члени <code>ImageMeta</code> вбудовані в цей тип.)
   <p>ImageMeta дозволяє налаштувати образ контейнера, що використовується для etcd. Передача власного образу etcd повідомляє <code>kubeadm upgrade</code>, що цей образ управляється користувачем і що його оновлення необхідно пропустити.</p>
</td>
</tr>
<tr><td><code>dataDir</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>dataDir</code> є текою, в якій etcd розміщуватиме свої дані. Стандартно це &quot;/var/lib/etcd&quot;.</p>
</td>
</tr>
<tr><td><code>extraArgs</code> <b>[Обовʼязково]</b><br/>
<a href="#kubeadm-k8s-io-v1beta4-Arg"><code>[]Arg</code></a>
</td>
<td>
   <p><code>extraArgs</code> є додатковими аргументами, що передаються бінарному файлу etcd при його запуску всередині статичного Pod. Назва аргументу в цьому списку є іменем прапорця, як вона зʼявляється в командному рядку, за винятком тире на початку. Додаткові аргументи переважатимуть існуючі стандартні аргументи. Дублювання додаткових аргументів дозволяється.</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-EnvVar"><code>[]EnvVar</code></a>
</td>
<td>
   <p><code>extraEnvs</code> є додатковим набором змінних середовища для передачі компоненту панелі управління. Змінні середовища, передані за допомогою <code>extraEnvs</code>, перезаписуватимуть будь-які існуючі змінні середовища або змінні середовища <code>*_proxy</code>, які kubeadm додає стандартно.</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>serverCertSANs</code> встановлює додаткові Subject Alternative Names (SANs) для сертифіката підпису сервера etcd.</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>peerCertSANs</code> встановлює додаткові Subject Alternative Names (SANs) для сертифіката підпису peer etcd.</p>
</td>
</tr>
</tbody>
</table>

## `Networking` {#kubeadm-k8s-io-v1beta4-Networking}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

Networking містить елементи, що описують конфігурацію мережі кластера.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p><code>serviceSubnet</code> є підмережею, що використовується сервісами Kubernetes. Стандартно це &quot;10.96.0.0/12&quot;.</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p><code>podSubnet</code> є підмережею, що використовується Pod.</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <p><code>dnsDomain</code> є доменом DNS, що використовується сервісами Kubernetes. Стандартно це &quot;cluster.local&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `NodeRegistrationOptions` {#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)

NodeRegistrationOptions містить поля, що стосуються реєстрації новоїпанелі управління або вузла в кластері, або через <code>kubeadm init</code>, або <code>kubeadm join</code>.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p><code>name</code> є полем <code>.Metadata.Name</code> обʼєкта Node API, який буде створений в операціях <code>kubeadm init</code> або <code>kubeadm join</code>. Це поле також використовується в полі <code>CommonName</code> клієнтського сертифіката kubelet для API сервера. Стандартно використовується імʼя хосту вузла, якщо не задано.</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <p><code>criSocket</code> використовується для отримання інформації про середовище виконання контейнерів. Ця інформація буде анотована до обʼєкта Node API для подальшого використання.</p>
</td>
</tr>
<tr><td><code>taints</code> <b>[Обовʼязкове]</b><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <p><code>taints</code><p><code>taints</code> вказує на taints, з якими обʼєкт Node API повинен бути зареєстрований. Якщо це поле не встановлено, тобто nil, воно буде стандартно з control-plane taint для вузлів control-plane. Якщо ви не хочете taint для вашого вузла control-plane, встановіть в це поле порожній список, тобто <code>taints: []</code> у YAML файлі. Це поле використовується виключно для реєстрації вузлів.</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Arg"><code>[]Arg</code></a>
</td>
<td>
   <p><code>kubeletExtraArgs</code> передає додаткові аргументи до kubelet. Аргументи тут передаються командному рядку kubelet через файл середовища, який kubeadm записує під час виконання для джерела kubelet. Це переважає загальну базову конфігурацію у ConfigMap <code>kubelet-config</code>. Прапорці мають вищий пріоритет при розборі. Ці значення є локальними і специфічними для вузла, на якому виконується kubeadm. Назва аргументу в цьому списку є назвою прапорця, як вона зʼявляється в командному рядку, крім дефісів на початку. Додаткові аргументи переважають існуючі стандартні значення. Дублікати додаткових аргументів дозволені.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає масив помилок перед польотом, які слід ігнорувати при реєстрації поточного вузла, наприклад, 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки з усіх перевірок.</p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <p><code>imagePullPolicy</code> вказує політику витягування образів під час <code>kubeadm init</code> та <code>join</code> операцій. Значення цього поля має бути одне з &quot;Always&quot;, &quot;IfNotPresent&quot; або &quot;Never&quot;. Якщо це поле не задане, kubeadm стандартно встановить його в &quot;IfNotPresent&quot;, або витягне необхідні образи, якщо вони не присутні на хості.</p>
</td>
</tr>
<tr><td><code>imagePullSerial</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>imagePullSerial</code> вказує, чи витягування образів, яке виконує kubeadm, має відбуватися послідовно або паралельно. Стандартно: true</p>
</td>
</tr>
</tbody>
</table>

## `Patches` {#kubeadm-k8s-io-v1beta4-Patches}


**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)

- [UpgradeApplyConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeApplyConfiguration)

- [UpgradeNodeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeNodeConfiguration)

Patches містить опції, повʼязані із застосуванням патчів до компонентів, розгорнутих kubeadm.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <p><code>directory</code> є шляхом до теки, що містить файли, названі
&quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot; і відповідає форматам патчів, підтримуваним kubectl. Стандартно &quot;patchtype&quot; є &quot;strategic&quot;. &quot;extension&quot; має бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; є необовʼязковим рядком, який можна використовувати для визначення порядку застосування патчів за алфавітним порядком.</p>
</td>
</tr>
</tbody>
</table>

## `Proxy` {#kubeadm-k8s-io-v1beta4-Proxy}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

Proxy визначає надбудову проксі, яка має використовуватися в кластері.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>disabled</code> <b>[Обовʼязкове]</b><br/>
<code>bool</code>
</td>
<td>
   <p><code>disabled</code> визначає, чи слід вимкнути цю надбудову у кластері.</p>
</td>
</tr>
</tbody>
</table>

## `Timeouts` {#kubeadm-k8s-io-v1beta4-Timeouts}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)

- [ResetConfiguration](#kubeadm-k8s-io-v1beta4-ResetConfiguration)

- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

Timeouts містить різні тайм-аути, які застосовуються до команд kubeadm.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>controlPlaneComponentHealthCheck</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>controlPlaneComponentHealthCheck</code> є часом очікування для перевірки справності компонентів панелі управління, таких як API сервер, під час <code>kubeadm init</code> та <code>kubeadm join</code>. Стандартно — 4м</p>
</td>
</tr>
<tr><td><code>kubeletHealthCheck</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>kubeletHealthCheck</code> є часом очікування для перевірки здоровʼя kubelet під час <code>kubeadm init</code> та <code>kubeadm join</code>. Стандартно — 4м</p>
</td>
</tr>
<tr><td><code>kubernetesAPICall</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>kubernetesAPICall</code> є часом очікування для завершення запиту клієнта kubeadm до API сервера. Це застосовується до всіх типів методів (GET, POST тощо). Стандартно — 1м</p>
</td>
</tr>
<tr><td><code>etcdAPICall</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>etcdAPICall</code> є часом очікування для завершення запиту клієнта kubeadm до кластера etcd. Стандартно — 2м</p>
</td>
</tr>
<tr><td><code>tlsBootstrap</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>tlsBootstrap</code> є часом очікування для завершення TLS bootstrap для приєднуючого вузла. Стандартно — 5м</p>
</td>
</tr>
<tr><td><code>discovery</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>discovery</code> є часом очікування для перевірки ідентичності API сервера для приєднуючого вузла. Стандартно — 5м</p>
</td>
</tr>
<tr><td><code>upgradeManifests</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>upgradeManifests</code> є тайм-аутом для оновлення статичних манифестів Pod. Стандартно — 5м</p>
</td>
</tr>
</tbody>
</table>

## `UpgradeApplyConfiguration` {#kubeadm-k8s-io-v1beta4-UpgradeApplyConfiguration}

**Зʼявляється в:**

- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

UpgradeApplyConfiguration містить список параметрів конфігурації, які специфічні для команди `kubeadm upgrade apply`.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <p><code>kubernetesVersion</code> є цільовою версією панелі управління.</p>
</td>
</tr>
<tr><td><code>allowExperimentalUpgrades</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>allowExperimentalUpgrades</code> інструктує kubeadm показувати нестабільні версії Kubernetes як альтернативу оновленню та дозволяє оновлення до альфа/бета/версії-кандидата Kubernetes. Стандартно — false</p>
</td>
</tr>
<tr><td><code>allowRCUpgrades</code><br/>
<code>bool</code>
</td>
<td>
   <p>Увімкнення <code>allowRCUpgrades</code> покаже версії-кандидати релізів Kubernetes як альтернативу оновленню та дозволяє оновлення до версії-кандидата Kubernetes.</p>
</td>
</tr>
<tr><td><code>certificateRenewal</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>certificateRenewal</code> інструктує kubeadm виконати поновлення сертифікатів під час оновлень. Стандартно — true</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим перевірки без змін, не застосовувати жодних змін, а лише виводити те, що буде зроблено.</p>
</td>
</tr>
<tr><td><code>etcdUpgrade</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>etcdUpgrade</code> інструктує kubeadm виконати оновлення etcd під час оновлень. Стандартно — true</p>
</td>
</tr>
<tr><td><code>forceUpgrade</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>forceUpgrade</code> вказує kubeadm оновити кластер без запиту підтвердження.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає список помилок перевірки перед виконанням, які слід ігнорувати під час процесу оновлення, наприклад, <code>IsPrivilegedUser,Swap</code>. Значення <code>all</code> ігнорує помилки з усіх перевірок.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить параметри, повʼязані із застосуванням патчів до компонентів, розгорнутих kubeadm під час <code>kubeadm upgrade</code>.</p>
</td>
</tr>
<tr><td><code>printConfig</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>printConfig</code> вказує, чи слід вивести конфігураційний файл, який буде використаний в оновленні.</p>
</td>
</tr>
<tr><td><code>skipPhases</code> <b>[Обовʼязкове]</b><br/>
<code>[]string</code>
</td>
<td>
   <p><code>SkipPhases</code> є списком фаз, які слід пропустити під час виконання команди. ПРИМІТКА: Це поле наразі ігнорується для <code>kubeadm upgrade apply</code>, але в майбутньому буде підтримуватися.</p>
</td>
</tr>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <p><code>imagePullPolicy</code> визначає політику витягування образів під час операцій <code>kubeadm upgrade apply</code>. Значення цього поля має бути одним з &quot;Always&quot;, &quot;IfNotPresent&quot; або &quot;Never&quot;. Якщо це поле не встановлено, kubeadm автоматично встановить значення &quot;IfNotPresent&quot;, або витягне потрібні образи, якщо їх немає на хості.</p>
</td>
</tr>
<tr><td><code>imagePullSerial</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>imagePullSerial</code> вказує, чи витягування образів, яке виконує kubeadm, має відбуватися послідовно або паралельно. Стандартно: true</p>
</td>
</tr>
</tbody>
</table>

## `UpgradeDiffConfiguration` {#kubeadm-k8s-io-v1beta4-UpgradeDiffConfiguration}

**Зʼявляється в:**

- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

UpgradeDiffConfiguration містить список параметрів конфігурації, які специфічні для команди <code>kubeadm upgrade diff</code>.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <p><code>kubernetesVersion</code> є цільовою версією панелі управління.</p>
</td>
</tr>
<tr><td><code>contextLines</code><br/>
<code>int</code>
</td>
<td>
   <p><code>diffContextLines</code> є кількістю рядків контексту в diff.</p>
</td>
</tr>
</tbody>
</table>

## `UpgradeNodeConfiguration` {#kubeadm-k8s-io-v1beta4-UpgradeNodeConfiguration}

**Зʼявляється в:**

- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

UpgradeNodeConfiguration містить список параметрів конфігурації, які специфічні для команди "kubeadm upgrade node".


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>certificateRenewal</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>certificateRenewal</code> інструктує kubeadm виконати поновлення сертифікатів під час оновлень. Стандартно — true.</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим попереднього перегляду. Якщо так, зміни не будуть застосовані, а буде виведено тільки те, що було б зроблено.</p>
</td>
</tr>
<tr><td><code>etcdUpgrade</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>etcdUpgrade</code> інструктує kubeadm виконати оновлення etcd під час оновлень. Стандартно — true.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає список помилок попередньої перевірки, які слід ігнорувати під час процесу оновлення, наприклад, 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки з усіх перевірок.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> є списком фаз, які слід пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm upgrade node phase --help</code>.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить параметри, повʼязані із застосуванням патчів до компонентів, розгорнутих за допомогою kubeadm під час <code>kubeadm upgrade</code>.</p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <p><code>imagePullPolicy</code> визначає політику витягування образів під час операцій <code>kubeadm upgrade node</code>. Значенням цього поля має бути одне з &quot;Always&quot;, &quot;IfNotPresent&quot; або &quot;Never&quot;. Якщо це поле не встановлено, kubeadm автоматично встановить значення &quot;IfNotPresent&quot;, або витягне потрібні образи, якщо їх немає на хості.</p>
</td>
</tr>
<tr><td><code>imagePullSerial</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>imagePullSerial</code> вказує, чи витягування образів, яке виконує kubeadm, має відбуватися послідовно або паралельно. Стандартно: true</p>
</td>
</tr>
</tbody>
</table>

## `UpgradePlanConfiguration` {#kubeadm-k8s-io-v1beta4-UpgradePlanConfiguration}

**Зʼявляється в:**

- [UpgradeConfiguration](#kubeadm-k8s-io-v1beta4-UpgradeConfiguration)

UpgradePlanConfiguration містить список параметрів конфігурації, які специфічні для команди "kubeadm upgrade plan".


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubernetesVersion</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>kubernetesVersion</code> є цільовою версією панелі управління.</p>
</td>
</tr>
<tr><td><code>allowExperimentalUpgrades</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>allowExperimentalUpgrades</code> інструктує kubeadm показувати нестабільні версії Kubernetes як альтернативу для оновлення і дозволяє оновлювати до альфа/бета/реліз кандидата версій Kubernetes. Стандартно — false</p>
</td>
</tr>
<tr><td><code>allowRCUpgrades</code><br/>
<code>bool</code>
</td>
<td>
   <p>Увімкнення <code>allowRCUpgrades</code> показуватиме версії-кандидати релізу Kubernetes як альтернативу для оновлення та дозволить оновлення до версії кандидата релізу Kubernetes.</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>dryRun</code> вказує, чи увімкнено режим попереднього перегляду. Якщо так, зміни не будуть застосовані, а буде виведено тільки те, що було б зроблено.</p>
</td>
</tr>
<tr><td><code>etcdUpgrade</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>etcdUpgrade</code> наказує kubeadm виконувати оновлення etcd під час оновлень. Стандартно встановлено значення true.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає список помилок попередньої перевірки, які слід ігнорувати під час процесу оновлення, наприклад, 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки з усіх перевірок.</p>
</td>
</tr>
<tr><td><code>printConfig</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>printConfig</code> вказує, чи слід виводити конфігураційний файл, який буде використовуватися в процесі оновлення.</p>
</td>
</tr>
</tbody>
</table>
