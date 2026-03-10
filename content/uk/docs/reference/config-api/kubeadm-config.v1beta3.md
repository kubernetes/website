---
title: kubeadm Configuration (v1beta3)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta3
auto_generated: false
---

<h2>Огляд</h2>

Пакунок v1beta3 визначає версію v1beta3 формату конфігураційного файлу kubeadm. Ця версія покращує формат v1beta2, виправляючи деякі незначні проблеми і додаючи кілька нових полів.

Список змін з версії v1beta2:

- Видалено застаріле поле "ClusterConfiguration.useHyperKubeImage". Kubeadm більше не підтримує образ hyperkube.
- Поле "ClusterConfiguration.dns.type" було видалено, оскільки CoreDNS є єдиним типом DNS-сервера, який підтримується kubeadm.
- Додано теги "datapolicy" до полів, які містять секрети. Це призведе до того, що значення полів буде пропущено, коли структури API буде надруковано за допомогою klog.
- Додано "InitConfiguration.skipPhases", "JoinConfiguration.SkipPhases", щоб дозволити пропустити список фаз під час виконання команд kubeadm init/join.
- Додано "InitConfiguration.nodeRegistration.imagePullPolicy" та "JoinConfiguration.nodeRegistration.imagePullPolicy", щоб дозволити вказати політику отримання образів під час kubeadm "init" та "join". Значення має бути одним з "Always", "Never" або "IfNotPresent". "IfNotPresent" — це стандартне значення, яке використовувалося до цього оновлення.
- Додано "InitConfiguration.patches.directory", "JoinConfiguration.patches.directory", щоб дозволити користувачеві конфігурувати теку, з якої буде братися патч для компонентів, розгорнутих за допомогою kubeadm.
- Перенесено API BootstrapToken* та повʼязані з ним утиліти з групи API "kubeadm" до нової групи "bootstraptoken". API kubeadm версії v1beta3 більше не містить структур BootstrapToken*.

Міграція зі старих версій конфігурації kubeadm

- kubeadm v1.15.x і новіше можна використовувати для міграції з v1beta1 на v1beta2.
- kubeadm v1.22.x і новіші більше не підтримують v1beta1 і старіші API, але можуть бути використані для міграції з v1beta2 на v1beta3.
- kubeadm v1.27.x і новіші більше не підтримують v1beta2 і старіші API.

<h2>Основи</h2>

Найкращим способом налаштування kubeadm є передача конфігураційного файлу у форматі YAML з опцією `--config`. Деякі з параметрів конфігурації, визначених у конфігураційному файлі kubeadm, також доступні як прапорці командного рядка, але у цьому випадку підтримуються лише найпоширеніші/простіші випадки використання.

Конфігураційний файл kubeadm може містити декілька типів конфігурацій, розділених трьома тире `(---).`

kubeadm підтримує наступні типи конфігурацій:

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>JoinConfiguration<span style="color:#bbb">
</span></pre>

Щоб вивести стандартні значення для дій "init" і "join", скористайтеся наступними командами:

```shell
kubeadm config print init-defaults
kubeadm config print join-defaults
```

Перелік типів конфігурацій, які необхідно включити до конфігураційного файлу, залежить від дії, яку ви виконуєте (`init` або `join`), а також від параметрів конфігурації, які ви збираєтесь використовувати (стандартні або розширені налаштування).

Якщо деякі типи конфігурацій не передбачено або передбачено лише частково, kubeadm використовуватиме стандартні значення; стандартно kubeadm також забезпечує узгодженість значень між компонентами, коли це необхідно (наприклад, прапорець `--cluster-cidr` на менеджері контролерів та `clusterCIDR` у kube-proxy).

Користувачам завжди дозволено перевизначати стандартні значення, за винятком невеликої підгрупи налаштувань, що мають стосунок до безпеки (наприклад, примусово вмикати режим авторизації Node і RBAC на api-сервері).

Якщо користувач надасть типи конфігурації, які не очікуються для дії, яку ви виконуєте, kubeadm проігнорує ці типи і видасть попередження.

<h2>Типи конфігурації Kubeadm init</h2>

При виконанні kubeadm init з опцією --config можуть бути використані наступні типи конфігурацій: InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, але тільки один з них поміж InitConfiguration та ClusterConfiguration є обовʼязковим.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
  ...
nodeRegistration:
  ...
```

Тип InitConfiguration слід використовувати для налаштування параметрів часу виконання, якими у випадку kubeadm init є конфігурація токена завантажувача та всі параметри, специфічні для вузла, на якому виконується kubeadm, включно з ними:

- NodeRegistration, що містить поля, які стосуються реєстрації нового вузла у кластері; використовуйте його, щоб налаштувати імʼя вузла, сокет CRI для використання або будь-які інші параметри, які мають застосовуватися лише до цього вузла (наприклад, ip вузла).
- LocalAPIEndpoint, що представляє точку доступу до екземпляра сервера API, який буде розгорнуто на цьому вузлі; використовуйте його, наприклад, для налаштування адреси оголошення сервера API.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
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

Тип InitConfiguration слід використовувати для налаштування параметрів часу виконання, якими у випадку kubeadm init є конфігурація токена завантажувача та всі параметри, специфічні для вузла, на якому виконується kubeadm, включно з ними:

- NodeRegistration, що містить поля, які стосуються реєстрації нового вузла у кластері; використовуйте його, щоб налаштувати імʼя вузла, сокет CRI для використання або будь-які інші параметри, які мають застосовуватися лише до цього вузла (наприклад, ip вузла).
- LocalAPIEndpoint, що представляє точку доступу до екземпляра сервера API, який буде розгорнуто на цьому вузлі; використовуйте його, наприклад, для налаштування адреси оголошення сервера API.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
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

- `networking`, що містить конфігурацію мережевої топології кластера; використовуйте їх, наприклад, для налаштування підмережі Pod або підмережі сервісів.
- `etcd`: використовуйте для налаштування локального etcd або для налаштування сервера API для використання зовнішнього кластера etcd.
- конфігурації kube-apiserver, kube-scheduler, kube-controller-manager; використовуйте для налаштування компонентів панелі управління шляхом додавання індивідуальних налаштувань або перевизначення стандартних налаштувань kubeadm.

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

Офіційну документацію про kubelet див. на [https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/](/docs/reference/command-line-tools-reference/kubelet/) або https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration.

Ось повністю заповнений приклад одного YAML-файлу, що містить декілька типів конфігурації для використання під час запуску `kubeadm init`.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
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
  criSocket: "/var/run/dockershim.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    v: 4
  ignorePreflightErrors:
    - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - addon/kube-proxy
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
etcd:
  # локальний або зовнішній etcd
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      listen-client-urls: "http://10.100.0.1:2379"
    serverCertSANs:
      -  "ec2-10-100-0-1.compute-1.amazonaws.com"
    peerCertSANs:
      - "10.100.0.1"
  # external:
    # endpoints:
    # - "10.100.0.1:2379"
    # - "10.100.0.2:2379"
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
    authorization-mode: "Node,RBAC"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
  certSANs:
    - "10.100.1.1"
    - "ec2-10-100-0-1.compute-1.amazonaws.com"
  timeoutForControlPlane: 4m0s
controllerManager:
  extraArgs:
    "node-cidr-mask-size": "20"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
scheduler:
  extraArgs:
    bind-address: "10.100.0.1"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
certificatesDir: "/etc/kubernetes/pki"
imageRepository: "registry.k8s.io"
clusterName: "example-cluster"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
# параметри kubelet вказуються тут
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
# параметри kube-proxy вказуються тут
```

<h2>Типи конфігурації Kubeadm join</h2>

При виконанні `kubeadm` join з опцією `--config` слід вказати тип JoinConfiguration.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration
  ...
```

Тип JoinConfiguration слід використовувати для налаштування параметрів часу виконання, якими у випадку kubeadm join є метод виявлення, що використовується для доступу до інформації про кластер, а також всі налаштування, специфічні для вузла, на якому виконується kubeadm, включно з:

- `nodeRegistration`, що містить поля, які стосуються реєстрації нового вузла у кластері; використовуйте його, щоб налаштувати імʼя вузла, сокет CRI для використання або будь-які інші параметри, які мають застосовуватися лише до цього вузла (наприклад, ip вузла).
- `apiEndpoint`, що представляє точку доступу до екземпляра сервера API, який буде розгорнуто на цьому вузлі.

ЗАСТАРІЛО: v1beta3 застаріло на користь v1beta4 і буде видалено в майбутньому випуску, 1.34 або пізнішому. Будь ласка, перейдіть на нову версію.

## Типи ресурсів {#resource-types}

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

## `BootstrapToken` {#BootstrapToken}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

BootstrapToken описує один bootstrap токен, збережений як Secret у кластері

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>token</code> <b>[Обовʼязково]</b><br/>
<a href="#BootstrapTokenString"><code>BootstrapTokenString</code></a>
</td>
<td>
   <p><code>token</code> використовується для встановлення двосторонньої довіри між вузлами та панелями управління. Використовується для приєднання вузлів до кластера.</p>
</td>
</tr>
<tr><td><code>description</code><br/>
<code>string</code>
</td>
<td>
   <p><code>description</code> встановлює зрозуміле людини повідомлення про те, чому існує цей токен і для чого він використовується, щоб інші адміністратори знали його призначення.</p>
</td>
</tr>
<tr><td><code>ttl</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>ttl</code> визначає час життя цього токена. Стандартно — <code>24h</code>.
<code>expires</code> та <code>ttl</code> взаємовиключні.</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p><code>expires</code> вказує на мітку часу, коли цей токен закінчується. Стандартно встановлюється динамічно під час виконання на основі <code>ttl</code>. <code>expires</code> та <code>ttl</code> взаємовиключні.</p>
</td>
</tr>
<tr><td><code>usages</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>usages</code> описує способи, якими цей токен може бути використаний. Стандартно може бути використаний для встановлення двосторонньої довіри, але це можна змінити тут.</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>groups</code> визначає додаткові групи, з якими цей токен буде автентифікуватися, якщо/коли використовуватиметься для автентифікації</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenString` {#BootstrapTokenString}

**Зʼявляється в:**

- [BootstrapToken](#BootstrapToken)

BootstrapTokenString — це токен у форматі <code>abcdef.abcdef0123456789</code>, який використовується як для валідації практичності API-сервера з погляду вузла, що приєднується, так і як метод автентифікації вузла на етапі завантаження
у фазі &quot;kubeadm join&quot;. Цей токен є і повинен бути короткотривалим.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>-</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>-</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
</tbody>
</table>

## `ClusterConfiguration` {#kubeadm-k8s-io-v1beta3-ClusterConfiguration}

ClusterConfiguration містить конфігурацію для всього кластера kubeadm.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ClusterConfiguration</code></td></tr>
<tr><td><code>etcd</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Etcd"><code>Etcd</code></a>
</td>
<td>
   <p><code>etcd</code> містить конфігурацію для etcd.</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Networking"><code>Networking</code></a>
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
   <p><code>controlPlaneEndpoint</code> встановлює стабільну IP-адресу або DNS-імʼя для панелі управління. Це може бути дійсна IP-адреса або субдомен RFC-1123 DNS з додатковим TCP портом. Якщо <code>controlPlaneEndpoint</code> не вказано, використовуються <code>advertiseAddress</code> + <code>bindPort</code>; якщо <code>controlPlaneEndpoint</code> вказано без TCP порту, використовується <code>bindPort</code>. Можливі варіанти використання:</p>
<ul>
<li>У кластері з більше ніж одним екземпляром панелі управління це поле повинно бути присвоєно адресу зовнішнього балансувальника навантаження перед екземплярами панелі управління.</li>
<li>У середовищах з обовʼязковим перерозподілом вузлів <code>controlPlaneEndpoint</code> може бути використаний для призначення стабільного DNS панелі управління.</li>
</ul>
</td>
</tr>
<tr><td><code>apiServer</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIServer"><code>APIServer</code></a>
</td>
<td>
   <p><code>apiServer</code> містить додаткові налаштування для API сервера.</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p><code>controllerManager</code> містить додаткові налаштування для менеджера контролерів.</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p><code>scheduler</code> містить додаткові налаштування для планувальника.</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-DNS"><code>DNS</code></a>
</td>
<td>
   <p><code>dns</code> визначає опції для DNS надбудови, встановленої в кластері.</p>
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
   <p><code>imageRepository</code> встановлює реєстр контейнерів для завантаження образів. Якщо порожнє, стандартно буде використано <code>registry.k8s.io</code>. Якщо версія Kubernetes є CI-збіркою (версія Kubernetes починається з <code>ci/</code>), <code>gcr.io/k8s-staging-ci-images</code> буде використовуватись для компонентів панелі управління та для kube-proxy, тоді як <code>registry.k8s.io</code> буде використано для всіх інших образів.</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <p><code>featureGates</code> містить функціональні можливості, увімкнені користувачем.</p>
</td>
</tr>
<tr><td><code>clusterName</code><br/>
<code>string</code>
</td>
<td>
   <p>Назва кластера. Ця назва буде використовуватися у файлах kubeconfig, що генеруються kubeadm, а також буде передаватися як значення прапорця <code>--cluster-name</code> kube-controller-manager. Стандартне значення — <code>&quot;kubernetes&quot;</code>.</p>
</td>
</tr>
</tbody>
</table>

## `InitConfiguration` {#kubeadm-k8s-io-v1beta3-InitConfiguration}

InitConfiguration містить список елементів, специфічних для "kubeadm init"-тільки під час виконання. Тільки інформація <code>kubeadm init</code>. Ці поля використовуються виключно під час першого запуску <code>kubeadm init</code>. Після цього інформація в цих полях НЕ завантажується в <code>kubeadm-config</code> ConfigMap, який використовується, наприклад, під час <code>kubeadm upgrade</code>. Ці поля мають бути порожніми.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InitConfiguration</code></td></tr>
<tr><td><code>bootstrapTokens</code><br/>
<a href="#BootstrapToken"><code>[]BootstrapToken</code></a>
</td>
<td>
   <p><code>bootstrapTokens</code> використовується під час <code>kubeadm init</code> і описує набір Bootstrap Tokens для створення. Ця інформація НЕ завантажується в kubeadm cluster configmap, частково через її конфіденційний характер</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p><code>nodeRegistration</code> містить поля, що стосуються реєстрації нового вузла панелі управління в кластері.</p>
</td>
</tr>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p><code>localAPIEndpoint</code> представляє точку доступу екземпляра API сервера, яка розгорнута на цьому вузлі панелі управління. У HA-налаштуваннях це відрізняється від <code>ClusterConfiguration.controlPlaneEndpoint</code> в тому сенсі, що <code>controlPlaneEndpoint</code> є глобальною точкою доступу для кластера, яка потім розподіляє запити на кожен окремий API сервер. Цей конфігураційний обʼєкт дозволяє налаштувати, яку IP-адресу/DNS-імʼя та порт локальний API сервер оголошує як доступні. Стандартно kubeadm намагається автоматично визначити типову IP-адресу інтерфейсу та використовувати її, але в разі невдачі ви можете встановити бажане значення тут.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificateKey</code> встановлює ключ, яким сертифікати та ключі шифруються перед завантаженням у Secret в кластері під час фази <code>uploadcerts init</code>. Ключ сертифіката є кодуванням шістнадцяткового рядка, який є AES ключем розміром 32 байти.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> — це список фаз, які потрібно пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm init --help</code>. Прапорець "--skip-phases" має пріоритет перед цим полем.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить опції, повʼязані з застосуванням патчів до компонентів, розгорнутих за допомогою kubeadm під час <code>kubeadm init</code>.</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration` {#kubeadm-k8s-io-v1beta3-JoinConfiguration}

JoinConfiguration містить елементи, що описують певний вузол.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>JoinConfiguration</code></td></tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p><code>nodeRegistration</code> містить поля, що стосуються реєстрації нового
вузла панелі управління в кластері.</p>
</td>
</tr>
<tr><td><code>caCertPath</code><br/>
<code>string</code>
</td>
<td>
   <p><code>caCertPath</code> — це шлях до SSL центра сертифікації, що використовується для захисту звʼязку між вузлом та панеллю управління. Стандартно — <code>/etc/kubernetes/pki/ca.crt</code>.</p>
</td>
</tr>
<tr><td><code>discovery</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta3-Discovery"><code>Discovery</code></a>
</td>
<td>
   <p><code>discovery</code> визначає параметри, які kubelet використовує під час процесу TLS старту.</p>
</td>
</tr>
<tr><td><code>controlPlane</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-JoinControlPlane"><code>JoinControlPlane</code></a>
</td>
<td>
   <p><code>controlPlane</code> визначає додатковий екземпляр панелі управління, який буде розгорнутий на приєднаному вузлі. Якщо nil, додатковий екземпляр панелі управління не буде розгорнуто.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>skipPhases</code> — це список фаз, які потрібно пропустити під час виконання команди. Список фаз можна отримати за допомогою команди <code>kubeadm join --help</code>. Прапорець <code>--skip-phases</code> має пріоритет перед цим полем.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
   <p><code>patches</code> містить параметри, повʼязані із застосуванням патчів до компонентів, розгорнутих за допомогою kubeadm під час <code>kubeadm join</code>.</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint` {#kubeadm-k8s-io-v1beta3-APIEndpoint}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [JoinControlPlane](#kubeadm-k8s-io-v1beta3-JoinControlPlane)

Структура APIEndpoint містить елементи екземпляра API сервера, розгорнутого на вузлі.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>advertiseAddress</code><br/>
<code>string</code>
</td>
<td>
   <p><code>advertiseAddress</code> встановлює IP-адресу, яку буде оголошувати API сервер.</p>
</td>
</tr>
<tr><td><code>bindPort</code><br/>
<code>int32</code>
</td>
<td>
   <p><code>bindPort</code> встановлює безпечний порт, до якого буде привʼязаний API сервер. Стандартно — 6443.</p>
</td>
</tr>
</tbody>
</table>

## `APIServer` {#kubeadm-k8s-io-v1beta3-APIServer}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

APIServer містить налаштування, необхідні для розгортання API сервера в кластері.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ControlPlaneComponent</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>(Члени <code>ControlPlaneComponent</code> вбудовані в цей тип.)
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>certSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>certSANs</code> встановлює додаткові альтернативні імена субʼєктів (SANs) для сертифіката підпису API сервера.</p>
</td>
</tr>
<tr><td><code>timeoutForControlPlane</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>timeoutForControlPlane</code> контролює тайм-аут, який ми очікуємо для появи API сервера.</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenDiscovery` {#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery}

**Зʼявляється в:**
- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

BootstrapTokenDiscovery використовується для налаштування параметрів виявлення на основі маркера початкового завантаження.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>token</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>token</code> — це маркер, що використовується для перевірки інформації про кластер, отриманої з панелі управління.</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p><code>apiServerEndpoint</code> — це IP-адреса або доменне імʼя до API сервера, з якого буде отримана інформація.</p>
</td>
</tr>
<tr><td><code>caCertHashes</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>caCertHashes</code> вказує набір публічних ключів для перевірки при використанні виявлення на основі маркера. Кореневий сертифікат CA, знайдений під час виявлення, повинен відповідати одному з цих значень. Зазначення порожнього набору відключає закріплення кореневого сертифіката CA, що може бути небезпечним. Кожен хеш зазначається у форматі <code>&lt;type&gt;:&lt;value&gt;</code>, де єдиним підтримуваним типом на даний момент є &quot;sha256&quot;. Це хеш SHA-256 у шістнадцятковому форматі, який обчислюється за допомогою обʼєкта Subject Public Key Info (SPKI) у DER-кодованому форматі ASN.1. Ці хеші можна обчислити за допомогою, наприклад, OpenSSL.</p>
</td>
</tr>
<tr><td><code>unsafeSkipCAVerification</code><br/>
<code>bool</code>
</td>
<td>
   <p><code>unsafeSkipCAVerification</code> дозволяє виявлення на основі маркера без перевірки CA за допомогою <code>caCertHashes</code>. Це може послабити безпеку kubeadm, оскільки інші вузли можуть видавати себе за панель управління.</p>
</td>
</tr>
</tbody>
</table>

## `ControlPlaneComponent` {#kubeadm-k8s-io-v1beta3-ControlPlaneComponent}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

- [APIServer](#kubeadm-k8s-io-v1beta3-APIServer)

ControlPlaneComponent містить налаштування, спільні для компонентів панелі управління кластера.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p><code>extraArgs</code> — це додатковий набір параметрів, що передаються компоненту панелі кправління. Ключ у цьому map — це імʼя параметра, як воно зʼявляється в командному рядку, без попереднього дефіса(ів).</p>
</td>
</tr>
<tr><td><code>extraVolumes</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-HostPathMount"><code>[]HostPathMount</code></a>
</td>
<td>
   <p><code>extraVolumes</code> — це додатковий набір хост-томів, змонтованих до компоненту панелі управління.</p>
</td>
</tr>
</tbody>
</table>

## `DNS` {#kubeadm-k8s-io-v1beta3-DNS}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

DNS визначає надбудовою DNS, що має використовуватися в кластері.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ImageMeta</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a></td>
<td>(Члени <code>ImageMeta</code> вбудовані в цей тип.)
   <p><code>imageMeta</code> дозволяє налаштувати образ, яке використовується для компонента DNS.</p>
</td>
</tr>
</tbody>
</table>

## `Discovery` {#kubeadm-k8s-io-v1beta3-Discovery}

**Зʼявляється в:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

Discovery визначає параметри для kubelet, які використовуються під час процесу TLS Bootstrap.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>bootstrapToken</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery"><code>BootstrapTokenDiscovery</code></a></td>
<td>
   <p><code>bootstrapToken</code> використовується для налаштування параметрів на основі токена bootstrap.
<code>bootstrapToken</code> і <code>file</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>file</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-FileDiscovery"><code>FileDiscovery</code></a></td>
<td>
   <p><code>file</code> використовується для вказівки файлу або URL-адреси до файлу kubeconfig, з якого завантажується інформація про кластер.
<code>bootstrapToken</code> і <code>file</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>tlsBootstrapToken</code><br/>
<code>string</code></td>
<td>
   <p><code>tlsBootstrapToken</code> є токеном, який використовується для TLS bootstrapping. Якщо <code>bootstrapToken</code> встановлено, це поле стандартно встановлюється на <code>.bootstrapToken.token</code>, але може бути перевизначено. Якщо встановлено <code>file</code>, це поле <strong>має бути встановлено</strong> у випадку, якщо KubeConfigFile не містить іншої інформації для автентифікації.</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a></td>
<td>
   <p><code>timeout</code> змінює час очікування під час виявлення.</p>
</td>
</tr>
</tbody>
</table>

## `Etcd` {#kubeadm-k8s-io-v1beta3-Etcd}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

Etcd містить елементи, що описують конфігурацію Etcd.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>local</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-LocalEtcd"><code>LocalEtcd</code></a></td>
<td>
   <p><code>local</code> надає параметри конфігурації для налаштування локального екземпляра etcd.
<code>local</code> і <code>external</code> є взаємовиключними.</p>
</td>
</tr>
<tr><td><code>external</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ExternalEtcd"><code>ExternalEtcd</code></a></td>
<td>
   <p><code>external</code> описує, як підключитися до зовнішнього кластера etcd.
<code>local</code> і <code>external</code> є взаємовиключними.</p>
</td>
</tr>
</tbody>
</table>

## `ExternalEtcd` {#kubeadm-k8s-io-v1beta3-ExternalEtcd}

**Зʼявляється в:**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

ExternalEtcd описує зовнішній кластер etcd. Kubeadm не має знань про знаходження файлів сертифікатів, і вони повинні бути надані.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>endpoints</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p><code>endpoints</code> містить список учасників etcd.</p>
</td>
</tr>
<tr><td><code>caFile</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>caFile</code> є файлом сертифіката SSL Certificate Authority (CA), який використовується для захисту звʼязку etcd. Обовʼязковий, якщо використовується TLS-зʼєднання.</p>
</td>
</tr>
<tr><td><code>certFile</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>certFile</code> є файлом сертифіката SSL, який використовується для захисту звʼязку etcd. Обовʼязковий, якщо використовується TLS-зʼєднання.</p>
</td>
</tr>
<tr><td><code>keyFile</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>keyFile</code> є файлом ключа SSL, який використовується для захисту звʼязку etcd. Обовʼязковий, якщо використовується TLS-зʼєднання.</p>
</td>
</tr>
</tbody>
</table>

## `FileDiscovery` {#kubeadm-k8s-io-v1beta3-FileDiscovery}

**Зʼявляється в:**

- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

FileDiscovery використовується для вказання файлу або URL до файлу kubeconfig, з якого завантажується інформація про кластер.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>kubeConfigPath</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>kubeConfigPath</code> використовується для вказання фактичного шляху до файлу або URL до файлу kubeconfig, з якого завантажується інформація про кластер.</p>
</td>
</tr>
</tbody>
</table>

## `HostPathMount` {#kubeadm-k8s-io-v1beta3-HostPathMount}

**Зʼявляється в:**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta3-ControlPlaneComponent)

HostPathMount містить елементи, що описують томи, які монтуються з хоста.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>name</code> — це імʼя тому всередині шаблону Pod.</p>
</td>
</tr>
<tr><td><code>hostPath</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>hostPath</code> — це шлях на хості, який буде змонтовано всередині Pod.</p>
</td>
</tr>
<tr><td><code>mountPath</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>mountPath</code> — це шлях всередині Pod, куди буде змонтовано <code>hostPath</code>.</p>
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

## `ImageMeta` {#kubeadm-k8s-io-v1beta3-ImageMeta}

**Зʼявляється в:**

- [DNS](#kubeadm-k8s-io-v1beta3-DNS)

- [LocalEtcd](#kubeadm-k8s-io-v1beta3-LocalEtcd)

ImageMeta дозволяє налаштувати образи, що використовуються для компонентів, які не походять з процесу випуску Kubernetes/Kubernetes

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <p><code>imageRepository</code> встановлює реєстр контейнерів, з якого будуть завантажені образи. Якщо не встановлено, буде використовуватися <code>imageRepository</code>, визначений у ClusterConfiguration.</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <p><code>imageTag</code> дозволяє вказати теґ для образу. Якщо це значення встановлено, kubeadm не буде автоматично змінювати версію вище зазначених компонентів під час оновлень.</p>
</td>
</tr>
</tbody>
</table>

## `JoinControlPlane` {#kubeadm-k8s-io-v1beta3-JoinControlPlane}

**Зʼявляється в:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

JoinControlPlane містить елементи, що описують додатковий екземпляр панелі управління, який потрібно розгорнути на приєднаному вузлі.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p><code>localAPIEndpoint</code> представляє точку доступу для екземпляра API-сервера, який буде розгорнуто на цьому вузлі.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p><code>certificateKey</code> є ключем, який використовується для дешифрування сертифікатів після їх завантаження з секрету під час приєднання нового вузла панелі упралвіння. Відповідний ключ шифрування знаходиться в InitConfiguration. Ключ сертифіката є рядком у шістнадцятковому кодуванні, що є AES-ключем розміром 32 байти.</p>
</td>
</tr>
</tbody>
</table>

## `LocalEtcd` {#kubeadm-k8s-io-v1beta3-LocalEtcd}

**Зʼявляється в:**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

LocalEtcd описує, що kubeadm має запускати кластер etcd локально.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ImageMeta</code> <b>[Обовʼязкове]</b><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>(Члени <code>ImageMeta</code> інтегровані в цей тип.)
   <p>ImageMeta дозволяє налаштувати образ контейнера, що використовується для etcd. Передача власного образу etcd повідомляє <code>kubeadm upgrade</code>, що цей образ управляється користувачем і його оновлення необхідно пропустити.</p>
</td>
</tr>
<tr><td><code>dataDir</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p><code>dataDir</code> — це тека, в якій etcd розміщуватиме свої дані. Стандартно використовується &quot;/var/lib/etcd&quot;.</p>
</td>
</tr>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p><code>extraArgs</code> — додаткові аргументи, що передаються бінарному файлу etcd при його запуску всередині статичного Pod. Ключ у цьому map є імʼям прапорця, як він зʼявляється на командному рядку, але без дефісів на початку.</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>serverCertSANs</code> задає додаткові Subject Alternative Names (SANs) для сертифіката підпису сервера etcd.</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>peerCertSANs</code> задає додаткові Subject Alternative Names (SANs) для сертифіката підпису peer etcd.</p>
</td>
</tr>
</tbody>
</table>

## `Networking` {#kubeadm-k8s-io-v1beta3-Networking}

**Зʼявляється в:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

Networking містить елементи, що описують конфігурацію мережі кластера.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p><code>serviceSubnet</code> — це підмережа, що використовується Kubernetes Services. Стандртно — &quot;10.96.0.0/12&quot;.</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p><code>podSubnet</code> — це підмережа, що використовується Pod.</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <p><code>dnsDomain</code> — це DNS домен, що використовується Kubernetes Services. Стандартно — &quot;cluster.local&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `NodeRegistrationOptions` {#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

NodeRegistrationOptions містить поля, що стосуються реєстрації нової панелі управління або вузла в кластері, як через <code>kubeadm init</code>, так і через <code>kubeadm join</code>.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p><code>name</code> — це поле <code>.metadata.name</code> обʼєкта Node API, який буде створений в процесі <code>kubeadm init</code> або <code>kubeadm join</code>. Це поле також використовується в полі <code>CommonName</code> клієнтського сертифікату kubelet до API сервера. Стандартно буде використано імʼя хоста вузла, якщо не надано.</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <p><code>criSocket</code> використовується для отримання інформації про середовище виконання контейнерів. Ця інформація буде анотована до обʼєкта Node API для подальшого використання.</p>
</td>
</tr>
<tr><td><code>taints</code> <b>[Обовʼязково]</b><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <p><code>taints</code> вказує на taints, з якими обʼєкт Node API повинен бути зареєстрований. Якщо це поле не встановлено, тобто nil, воно буде стандартно з control-plane taint для вузлів control-plane. Якщо ви не хочете taint для вашого вузла control-plane, встановіть в це поле порожній список, тобто <code>taints: []</code> у YAML файлі. Це поле використовується виключно для реєстрації вузлів.</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p><code>kubeletExtraArgs</code> передає додаткові аргументи до kubelet. Аргументи тут передаються в командний рядок kubelet через файл середовища kubeadm, що створюється під час виконання, щоб kubelet міг його використовувати. Це переважає загальну базову конфігурацію в ConfigMap <code>kubelet-config</code>. Прапорці мають вищий пріоритет під час парсингу. Ці значення локальні та специфічні для вузла, на якому виконується kubeadm. Ключ у цьому словнику — це назва прапорці, як вона зʼявляється в командному рядку, але без початкових дефісів.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>ignorePreflightErrors</code> надає список помилок перед запуском, які слід ігнорувати під час реєстрації поточного вузла, наприклад, <code>IsPrevilegedUser,Swap</code>. Значення <code>all</code> ігнорує помилки від усіх перевірок.</p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <p><code>imagePullPolicy</code> вказує політику для витягування образів під час операцій kubeadm &quot;init&quot; та &quot;join&quot;. Значення цього поля повинно бути одне з &quot;Always&quot;, &quot;IfNotPresent&quot; або &quot;Never&quot;. Якщо це поле не встановлено, kubeadm стандартно встановить його в &quot;IfNotPresent&quot;, або витягне необхідні образи, якщо вони не присутні на хості.</p>
</td>
</tr>
</tbody>
</table>

## `Patches` {#kubeadm-k8s-io-v1beta3-Patches}

**Зʼявляється в:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

Patches містить параметри, повʼязані з застосуванням патчів до компонентів, розгорнутих за допомогою kubeadm.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <p><code>directory</code> — це шлях до теки, що містить файли, названі
&quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot; та відповідати форматам патчів, підтримуваних kubectl. Стандартно &quot;patchtype&quot; — &quot;strategic&quot;. &quot;extension&quot; повинна бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; — це необовʼязковий рядок, який може бути використаний для визначення, які патчі застосовуються першими за алфавітним порядком.</p>
</td>
</tr>
</tbody>
</table>
