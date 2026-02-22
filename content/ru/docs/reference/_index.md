---
title: Ссылки
approvers:
- chenopis
linkTitle: "Ссылки"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

Этот раздел документации Kubernetes содержит ссылки (референсы).

<!-- body -->

## Ссылки по API

* [Глоссарий](/docs/reference/glossary/) — обширный, стандартизированный список терминологии Kubernetes.

* [Референс по Kubernetes API](/docs/reference/kubernetes-api/).
* [Одностраничный референс по Kubernetes API для {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Использование Kubernetes API](/docs/reference/using-api/) — обзор API в Kubernetes.
* [Контроль доступа к API](/docs/reference/access-authn-authz/) — подробности о том, как Kubernetes контролирует доступ к API.
* [Известные метки, аннотации и taints](/docs/reference/labels-annotations-taints/).

## Официально поддерживаемые клиентские библиотеки

Для вызова API Kubernetes из языка программирования вы можете использовать
[клиентские библиотеки](/docs/reference/using-api/client-libraries/). Официально
поддерживаемые клиентские библиотеки:

- [Клиентская библиотека Go](https://github.com/kubernetes/client-go/).
- [Клиентская библиотека Python](https://github.com/kubernetes-client/python).
- [Клиентская библиотека Java](https://github.com/kubernetes-client/java).
- [Клиентская библиотека JavaScript](https://github.com/kubernetes-client/javascript).
- [Клиентская библиотека C#](https://github.com/kubernetes-client/csharp).
- [Клиентская библиотека Haskell](https://github.com/kubernetes-client/haskell).

## CLI

* [kubectl](/ru/docs/reference/kubectl/) — основной CLI-инструмент для запуска команд и управления кластерами Kubernetes.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) — руководство по синтаксису [выражений JSONPath](http://goessner.net/articles/JsonPath/) с kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) — CLI-инструмент для легкого разворачивания защищенного кластера Kubernetes.

## Компоненты

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) — основной
  агент, запускаемый на каждом узле. Kubelet получает набор PodSpecs и
  гарантирует, что описанные контейнеры запущены и корректно работают.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) —
  REST API, который валидирует данные для таких объектов API, как поды,
  сервисы, контроллеры репликации, и управляет ими.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) —
  демон, который обеспечивает работу ключевых циклов контроля (control loops)
  в Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) —
  может выполнять простое перенаправление TCP/UDP-потоков или round-robin
  для них по множеству бэкендов.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) —
  планировщик, который управляет доступностью, производительностью и нагрузкой.
  
  * [Политики планировщика](/docs/reference/scheduling/policies)
  * [Профили планировщика](/docs/reference/scheduling/config#profiles)

* Список [портов и протоколов](/docs/reference/networking/ports-and-protocols/),
  которые должны быть открыты у управляющего слоя и рабочих узлов.

## Конфигурационные API

В этой секции содержится документация для «неопубликованных» API, которые
используются для конфигурации компонентов или инструментов Kubernetes.
API-сервер не публикует бОльшую часть этих API как REST, хотя они могут
быть важны для пользователя или администратора при использовании кластера
или управлении им.


* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) и
  [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) и
  [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) и
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) и
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/) и
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) и 
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)

## Конфигурационные API для kubeadm

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)

## Внешние API

Эти API определены проектом Kubernetes, но не реализованы в рамках ядра
Kubernetes:

* [Metrics API (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [Custom Metrics API (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [External Metrics API (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)

## Архитектурная документация

Существует архив документации с архитектурой того, как функционирует Kubernetes.
Хорошими стартовыми точками здесь являются документ по [архитектуре Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) 
и [репозиторий с предложениями по дизайну Kubernetes](https://git.k8s.io/design-proposals-archive).

## Форматы

Инструменты вроде {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 
могут работать с разными форматами/кодировками. К ним относятся:

* [CBOR](https://cbor.io/), который используется по сети, но **не** доступен как формат вывода в kubectl.
  * См. [CBOR resource encoding](https://kubernetes.io/docs/reference/using-api/api-concepts/#cbor-encoding).
* [JSON](https://www.json.org/), доступный как формат вывода в `kubectl` и используемый на уровне HTTP.
* [KYAML](/docs/reference/encodings/kyaml), Kubernetes-диалект YAML.
  * KYAML — это по сути _формат вывода_; в любом месте, где можно передать данные в KYAML в Kubernetes, аналогично можно использовать любой другой валидный YAML.
* [YAML](https://yaml.org/), доступный как формат вывода в `kubectl` и используемый на уровне HTTP.

У Kubernetes также есть кастомное [protobuf-кодирование](/docs/reference/using-api/api-concepts/#protobuf-encoding), которое используется только в HTTP-сообщениях.

Инструмент `kubectl` поддерживает некоторые другие форматы вывода — например, _custom columns_;
см. [форматы вывода](/docs/reference/kubectl/#output-options) в референсной документации kubectl.
