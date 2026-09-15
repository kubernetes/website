---
title: Довідник
approvers:
- chenopis
linkTitle: "Довідники"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

Цей розділ документації Kubernetes містить довідники.

<!-- body -->

## Довідники API {#api-reference}

* [Глосарій](/docs/reference/glossary/) — докладний, стандартизований перелік термінології Kubernetes

* [Довідник API Kubernetes](/docs/reference/kubernetes-api/)
* [Довідник API Kubernetes {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/), все на одній сторінці
* [Використання API Kubernetes](/docs/reference/using-api/) — огляд API для Kubernetes.
* [API керування доступом](/docs/reference/access-authn-authz/) — докладно про те, як Kubernetes контролює доступи API
* [Добре відомі мітки (labels), анотації (annotations) та позначення (taints).](/docs/reference/labels-annotations-taints/)

## Офіційно підтримувані клієнтські бібліотеки {#officially-supported-client-libraries}

Для надсилання викликів до API Kubernetes використовуючи одну з мов програмування ви можете використовувати [клієнтські бібліотеки](/docs/reference/using-api/client-libraries/). Офіційно підтримуються наступні:

* [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
* [Kubernetes Python client library](https://github.com/kubernetes-client/python)
* [Kubernetes Java client library](https://github.com/kubernetes-client/java)
* [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
* [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
* [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)

## CLI

* [kubectl](/docs/reference/kubectl/) — Основний інструмент командного рядка для виконання команд та управління кластерами Kubernetes.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) — Посібник з синтаксису використання виразів [JSONPath](https://goessner.net/articles/JsonPath/) з kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) — Інструмент командного рядка для легкого налаштування захищеного кластера Kubernetes.

## Компоненти {#components}

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) — Основний агент, який працює на кожному вузлі. Kubelet отримує набір PodSpecs і переконується, що описані контейнери працюють і є справними.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) — REST API, що перевіряє та налаштовує дані для обʼєктів API, таких як Podʼи, Serviceʼи, контролери реплікацій.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) — Демон, який містить основні процеси управління, які постачаються з Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) — Може виконувати просте перенаправлення потоку TCP/UDP або перенаправляти потік TCP/UDP методом "round-robin" через набір бекендів.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) — Планувальник, який керує доступністю, продуктивністю та місткістю.

  * [Політики планування](/docs/reference/scheduling/policies)
  * [Профілі планування](/docs/reference/scheduling/config#profiles)

* Список [портів та протоколів](/docs/reference/networking/ports-and-protocols/), які повинні бути відкриті на вузлах панелі управління та робочих вузлах.

## Конфігураційні API {#config-apis}

Цей розділ містить документацію для "неопублікованих" API, які використовуються для налаштування компонентів або інструментів Kubernetes. Більшість з цих API не експонуються через API-сервер у стилі REST, хоча вони є важливими для користувача чи оператора для використання або управління кластером.

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) та [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) та [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) та
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) та
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/) та [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) та
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)

## Конфігураційні API kubeadm {#config-apis-for-kubeadm}

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)

## Зовнішні API {#external-apis}

Ці API, визначені проєктом Kubernetes, але не реалізовані в межах
основного проєкту:

* [API метрик (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [API власних метрик (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [API зовнішніх метрик (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)

## Документи проєктування {#design-docs}

Архів документів проєктування функціонала Kubernetes. Ви можете розпочати з

* [Архітектура Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) та
* [Огляд дизайну Kubernetes](https://git.k8s.io/design-proposals-archive).

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
