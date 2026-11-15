---
title: Довідник
approvers:
- chenopis
linkTitle: "Довідник"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

Цей розділ документації Kubernetes містить довідники.

<!-- body -->

## Довідник API {#api-reference}

* [Глосарій](/docs/reference/glossary/) — докладний, стандартизований перелік термінології Kubernetes

* [Довідник API Kubernetes](/docs/reference/kubernetes-api/)
* [Односторінковий довідник API Kubernetes {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Використання API Kubernetes](/docs/reference/using-api/) — огляд API для Kubernetes.
* [Керування доступом до API](/docs/reference/access-authn-authz/) — докладно про те, як Kubernetes керує доступом до API
* [Відомі мітки, анотації та позначення](/docs/reference/labels-annotations-taints/)

## Офіційно підтримувані клієнтські бібліотеки {#officially-supported-client-libraries}

Щоб викликати API Kubernetes з мови програмування, ви можете використовувати [клієнтські бібліотеки](/docs/reference/using-api/client-libraries/). Офіційно підтримувані клієнтські бібліотеки:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)

## CLI

* [kubectl](/docs/reference/kubectl/) — Основний інструмент командного рядка для виконання команд і керування кластерами Kubernetes.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) — Посібник із синтаксису використання [виразів JSONPath](https://goessner.net/articles/JsonPath/) з kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) — Інструмент командного рядка для легкого налаштування захищеного кластера Kubernetes.

## Компоненти {#components}

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) — Основний агент, який працює на кожному вузлі. kubelet отримує набір PodSpec і забезпечує, що описані контейнери працюють і є справними.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) — REST API, що перевіряє та налаштовує дані для обʼєктів API, таких як Podʼи, Service, контролери реплікації.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) — Демон, який містить основні цикли керування, що постачаються з Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) — Може виконувати просте перенаправлення потоку TCP/UDP або перенаправляти потік TCP/UDP методом "round-robin" через набір бекендів.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) — Планувальник, який керує доступністю, продуктивністю та місткістю.

  * [Політики планування](/docs/reference/scheduling/policies)
  * [Профілі планування](/docs/reference/scheduling/config#profiles)

* Список [портів та протоколів](/docs/reference/networking/ports-and-protocols/), які повинні бути відкриті на вузлах панелі управління та робочих вузлах.

## Конфігураційні API {#config-apis}

Цей розділ містить документацію для "неопублікованих" API, які використовуються для налаштування компонентів або інструментів Kubernetes. Більшість із цих API не надаються API-сервером у стилі REST, хоча вони важливі для користувача чи оператора для використання кластера або керування ним.

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) та
  [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
  - `admission.k8s.io/v1`
    - [AdmissionReview](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionReview)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) та
  - `apiserver.k8s.io/v1`
    - [AdmissionConfiguration](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
    - [AuthenticationConfiguration](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)
    - [AuthorizationConfiguration](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration)
    - [EgressSelectorConfiguration](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
    - [TracingConfiguration](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-TracingConfiguration)
 
* [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/)
  - `apiserver.k8s.io/v1beta1`
    - [AuthenticationConfiguration](/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)
    - [AuthorizationConfiguration](/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-AuthorizationConfiguration)
    - [EgressSelectorConfiguration](/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)
    - [TracingConfiguration](/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-TracingConfiguration)
 
* [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
  - `apiserver.config.k8s.io/v1`
    - [AdmissionConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-config-k8s-io-v1-AdmissionConfiguration)
    - [AuthenticationConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-config-k8s-io-v1-AuthenticationConfiguration)
    - [AuthorizationConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-config-k8s-io-v1-AuthorizationConfiguration)
    - [EncryptionConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-config-k8s-io-v1-EncryptionConfiguration)
    - [TracingConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-config-k8s-io-v1-TracingConfiguration)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
  - `eventratelimit.admission.k8s.io/v1alpha1`
    - [Configuration](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/#eventratelimit-admission-k8s-io-v1alpha1-Configuration)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/)
  - `kubelet.config.k8s.io/v1alpha1`
    - [CredentialProviderConfig](/docs/reference/config-api/kubelet-config.v1alpha1/#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
    - [ImagePullIntent](/docs/reference/config-api/kubelet-config.v1alpha1/#kubelet-config-k8s-io-v1alpha1-ImagePullIntent)
    - [ImagePulledRecord](/docs/reference/config-api/kubelet-config.v1alpha1/#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)
* [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
  - `kubelet.config.k8s.io/v1beta1`
    - [CredentialProviderConfig](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-CredentialProviderConfig)
    - [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
    - [SerializedNodeConfigSource](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-SerializedNodeConfigSource)
* [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
  - `kubelet.config.k8s.io/v1`
    - [CredentialProviderConfig](/docs/reference/config-api/kubelet-config.v1/#kubelet-config-k8s-io-v1-CredentialProviderConfig)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
  - `credentialprovider.kubelet.k8s.io/v1`
    - [CredentialProviderRequest](/docs/reference/config-api/kubelet-credentialprovider.v1/#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest)
    - [CredentialProviderResponse](/docs/reference/config-api/kubelet-credentialprovider.v1/#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)
* [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
  - `kubescheduler.config.k8s.io/v1`
    - [DefaultPreemptionArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-DefaultPreemptionArgs)
    - [DynamicResourcesArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-DynamicResourcesArgs)
    - [InterPodAffinityArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs)
    - [KubeSchedulerConfiguration](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)
    - [NodeAffinityArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeAffinityArgs)
    - [NodeResourcesBalancedAllocationArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesBalancedAllocationArgs)
    - [NodeResourcesFitArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
    - [PodTopologySpreadArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-PodTopologySpreadArgs)
    - [VolumeBindingArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
  - `kubecontrollermanager.config.k8s.io/v1alpha1`
    - [LeaderMigrationConfiguration](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)
    - [KubeControllerManagerConfiguration](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)
  - `cloudcontrollermanager.config.k8s.io/v1alpha1`
    - [CloudControllerManagerConfiguration](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
  - `kubeproxy.config.k8s.io/v1alpha1`
    - [KubeProxyConfiguration](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
  - `audit.k8s.io/v1`
    - [Event](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)
    - [EventList](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-EventList)
    - [Policy](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)
    - [PolicyList](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-PolicyList)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
  - `client.authentication.k8s.io/v1beta1`
     - [ExecCredential](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
* [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
  - `client.authentication.k8s.io/v1`
     - [ExecCredential](/docs/reference/config-api/client-authentication.v1/#client-authentication-k8s-io-v1-ExecCredential)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
  - `apiserver.config.k8s.io/v1`
    - [WebhookAdmission](/docs/reference/config-api/apiserver-webhookadmission.v1/#apiserver-config-k8s-io-v1-WebhookAdmission)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
  - `imagepolicy.k8s.io/v1alpha1`
    - [ImageReview](/docs/reference/config-api/imagepolicy.v1alpha1/#imagepolicy-k8s-io-v1alpha1-ImageReview)

## Конфігураційний API для kubeadm {#config-api-for-kubeadm}

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)

## Зовнішні API {#external-apis}

Це API, визначені проєктом Kubernetes, але не реалізовані в межах
основного проєкту:

* [API метрик (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [API власних метрик (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [API зовнішніх метрик (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)

## Документи проєктування {#design-docs}

Архів документів проєктування функціональності Kubernetes. Для початку варто ознайомитися з [Архітектурою Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) та [Оглядом дизайну Kubernetes](https://git.k8s.io/design-proposals-archive).

## Кодування {#encodings}

Такі інструменти, як {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}, можуть працювати з різними форматами/кодуваннями. До них належать:

* [CBOR](https://cbor.io/), що використовується в мережі, але **не** доступний як формат виводу kubectl
  * Див. [Кодування ресурсів CBOR](/docs/reference/using-api/api-concepts/#cbor-encoding)
* [JSON](https://www.json.org/), доступний як формат виводу `kubectl`, а також використовується на рівні HTTP
* [KYAML](/docs/reference/encodings/kyaml), діалект YAML для Kubernetes
  * KYAML є, по суті, _форматом виводу_; у будь-якому місці, де ви можете надати KYAML для Kubernetes, ви також можете надати будь-який інший дійсний вхідний YAML
* [YAML](https://yaml.org/), доступний як формат виводу `kubectl`, а також використовується на рівні HTTP

Kubernetes також має власне [кодування protobuf](/docs/reference/using-api/api-concepts/#protobuf-encoding), яке використовується тільки в повідомленнях HTTP.

Інструмент `kubectl` підтримує деякі інші формати виводу, такі як _custom columns_; див. [формати виводу](/docs/reference/kubectl/#output-options) у довідці kubectl.
