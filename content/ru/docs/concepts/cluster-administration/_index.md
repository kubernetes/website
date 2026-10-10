---
title: Администрирование кластера
reviewers:
- davidopp
- lavalamp
weight: 100
content_type: concept
description: >
  Lower-level detail relevant to creating or administering a Kubernetes cluster.
no_list: true
---

<!-- overview -->
Обзор администрирования кластера предназначен для всех, кто создает или администрирует кластер Kubernetes. Это предполагает некоторое знакомство с основными [концепциями](/docs/concepts/) Kubernetes. 


<!-- body -->
## Планирование кластера

См. Руководства в разделе [настройка](/docs/setup/) для получения примеров того, как планировать, устанавливать и настраивать кластеры Kubernetes. Решения, перечисленные в этой статье, называются *distros*.

   {{< note >}}
   не все дистрибутивы активно поддерживаются. Выбирайте дистрибутивы, протестированные с последней версией Kubernetes.
   {{< /note >}}

Прежде чем выбрать руководство, вот некоторые соображения:

 - Вы хотите опробовать Kubernetes на вашем компьютере или собрать много узловой кластер высокой доступности? Выбирайте дистрибутивы, наиболее подходящие для ваших нужд.
 - Будете ли вы использовать **размещенный кластер Kubernetes**, такой, как [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) или **разместите собственный кластер**?
 - Будет ли ваш кластер **в помещении** или **в облаке (IaaS)**? Kubernetes не поддерживает напрямую гибридные кластеры. Вместо этого вы можете настроить несколько кластеров.
 - **Если вы будете настраивать Kubernetes в помещении (локально)**, подумайте, какая [сетевая модель](/docs/concepts/cluster-administration/networking/) подходит лучше всего.
 - Будете ли вы запускать Kubernetes на **оборудований "bare metal"** или на **виртуальных машинах (VMs)**?
 - Вы хотите **запустить кластер** или планируете **активно разворачивать код проекта Kubernetes**? В последнем случае выберите активно разрабатываемый дистрибутив. Некоторые дистрибутивы используют только двоичные выпуски, но предлагают более широкий выбор.
 - Ознакомьтесь с [компонентами](/docs/concepts/overview/components/) необходимые для запуска кластера.


## Управление кластером

* Узнайте как [управлять узлами](/docs/concepts/architecture/nodes/).

* Узнайте как настроить и управлять [квотами ресурсов](/docs/concepts/policy/resource-quotas/) для общих кластеров.

## Обеспечение безопасности кластера

* [Сгенерировать сертификаты](/docs/tasks/administer-cluster/certificates/) описывает шаги по созданию сертификатов с использованием различных цепочек инструментов.

* [Kubernetes Container Environment](/docs/concepts/containers/container-environment/) описывает среду для управляемых контейнеров Kubelet на узле Kubernetes.

* [Управление доступом к Kubernetes API](/docs/concepts/security/controlling-access) описывает как Kubernetes реализует контроль доступа для своего собственного API.

* [Аутентификация](/docs/reference/access-authn-authz/authentication/) объясняет аутентификацию в Kubernetes, включая различные варианты аутентификации.

* [Авторизация](/docs/reference/access-authn-authz/authorization/) отделена от аутентификации и контролирует обработку HTTP-вызовов.

* [Использование контроллеров допуска](/docs/reference/access-authn-authz/admission-controllers/) explains plug-ins which intercepts requests to the Kubernetes API server after authentication and authorization.

* [Использование Sysctls в кластере Kubernetes](/docs/tasks/administer-cluster/sysctl-cluster/) описывает администратору, как использовать sysctl инструмент командной строки для установки параметров ядра.

* [Аудит](/docs/tasks/debug-application-cluster/audit/) описывает, как взаимодействовать с журналами аудита Kubernetes.

### Обеспечение безопасности kubelet
  * [Связь между управляющим слоем и узлом](/ru/docs/concepts/architecture/control-plane-node-communication/)
  * [Загрузка TLS](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Аутентификация/авторизация Kubelet](/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/)

## Дополнительные кластерные услуги

* [Интеграция DNS](/docs/concepts/services-networking/dns-pod-service/) описывает как разрешить DNS имя непосредственно службе Kubernetes.

* [Ведение журнала и мониторинг активности кластера](/docs/concepts/cluster-administration/logging/) объясняет, как работает ведение журнала в Kubernetes и как его реализовать.
