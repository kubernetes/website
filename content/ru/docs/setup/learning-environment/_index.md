---
title: Среда обучения
content_type: concept
weight: 20
aliases:
- /ru/docs/setup/learning-environment/kind/
- /ru/docs/setup/learning-environment/minikube/
---

<!-- overview -->

Для изучения Kubernetes нужна среда для практики. На этой странице описаны варианты
создания среды Kubernetes, в которой можно экспериментировать и учиться.

<!-- body -->

## Установка kubectl {#installing-kubectl}

Перед созданием кластера вам понадобится инструмент командной строки `kubectl`.
Он позволяет взаимодействовать с кластером Kubernetes и выполнять в нём команды.

Инструкции приведены в разделе [Установка и настройка kubectl](/docs/tasks/tools/install-kubectl/).

## Настройка локальных сред Kubernetes {#setting-up-local-kubernetes-environments}

Запуск Kubernetes на локальной машине обеспечивает безопасную среду для обучения и экспериментов.
Вы можете создавать и удалять кластеры, не беспокоясь о расходах или влиянии на производственные системы.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) — это инструмент для запуска локальных кластеров Kubernetes с помощью контейнеров Docker в качестве узлов.
Он потребляет мало ресурсов и предназначен прежде всего для тестирования самого Kubernetes, но также отлично подходит для обучения.

Смотрите страницу [по установке Kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) запускает одноузловой кластер Kubernetes на локальной машине.
Он поддерживает несколько сред выполнения контейнеров и работает в Linux, macOS и Windows.

Чтобы начать работу с minikube, ознакомьтесь с [руководством по началу работы](https://minikube.sigs.k8s.io/docs/start/).

### Другие варианты локального запуска {#other-local-options}

{{% thirdparty-content single="true" %}}

Существуют и сторонние инструменты для локального запуска Kubernetes. Kubernetes не предоставляет
поддержку этих инструментов, но они могут подойти для обучения:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) позволяет запустить локальный кластер Kubernetes.
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) позволяет запустить локальный кластер Kubernetes.
- [Rancher Desktop](https://docs.rancherdesktop.io/) предоставляет Kubernetes на вашем компьютере.
- [MicroK8s](https://canonical.com/microk8s) запускает кластер Kubernetes с небольшим потреблением ресурсов.
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) запускает минимальный кластер OpenShift локально (OpenShift соответствует требованиям Kubernetes).

Инструкции по настройке и сведения о поддержке приведены в документации соответствующего инструмента.

## Использование онлайн-площадок для практики {#using-online-playgrounds}

{{% thirdparty-content single="true" %}}

Онлайн-площадки позволяют попробовать Kubernetes, ничего не устанавливая на компьютер.
Эти среды работают в веб-браузере:

- **[Killercoda](https://killercoda.com/kubernetes)** предоставляет интерактивные сценарии Kubernetes и среду для практики.

Такие платформы удобны для быстрых экспериментов и прохождения руководств без локальной установки.

## Практика с кластерами, близкими к производственным {#practicing-with-production-like-clusters}

Если вы хотите попрактиковаться в настройке кластера, более близкого к производственному,
можно использовать **kubeadm**. Создание кластера с помощью kubeadm — сложная задача,
требующая нескольких машин (физических или виртуальных) и тщательной настройки.

Подробнее см. в разделе [Производственная среда](/docs/setup/production-environment/).

{{< note >}}
Настройка кластера, близкого к производственному, значительно сложнее настройки описанных выше
сред обучения. Начните с kind, minikube или онлайн-площадки для практики.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Пройдите руководство [Hello Minikube](/docs/tutorials/hello-minikube/), чтобы развернуть первое приложение.
- Узнайте о [компонентах Kubernetes](/docs/concepts/overview/components/).
- Изучите [команды kubectl](/docs/reference/kubectl/).
