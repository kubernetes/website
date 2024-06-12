---
reviewers:
- lavalamp
title: Компоненты Kubernetes
content_type: concept
weight: 20
card:
  name: concepts
  weight: 20
---

<!-- overview -->
При развёртывании Kubernetes вы имеете дело с кластером.
{{< glossary_definition term_id="cluster" length="all" prepend="Кластер Kubernetes cluster состоит из">}}

На этой странице в общих чертах описывается различные компоненты, необходимые для работы кластера Kubernetes.

Ниже показана диаграмма кластера Kubernetes со всеми связанными компонентами.

![Компоненты Kubernetes](/images/docs/components-of-kubernetes.png)



<!-- body -->

## Компоненты управляющего слоя

Компоненты управляющего слоя (control plane) отвечают за основные операции кластера (например, планирование), а также обрабатывают события кластера (например, запускают новый {{< glossary_tooltip text="под" term_id="pod">}}, когда поле `replicas` развертывания не соответствует требуемому количеству реплик).

Компоненты управляющего слоя могут быть запущены на любой машине в кластере. Однако для простоты сценарии настройки обычно запускают все компоненты управляющего слоя на одном компьютере и в то же время не позволяют запускать пользовательские контейнеры на этом компьютере. Смотрите страницу [Создание высоконадёжных кластеров](/docs/admin/high-availability/) для примера настройки нескольких ведущих виртуальных машин.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Эти контроллеры включают:

  * Контроллер узла (Node Controller): уведомляет и реагирует на сбои узла.
  * Контроллер репликации (Replication Controller): поддерживает правильное количество подов для каждого объекта контроллера репликации в системе.
  * Контроллер конечных точек (Endpoints Controller): заполняет объект конечных точек (Endpoints), то есть связывает сервисы (Services) и поды (Pods).
  * Контроллеры учетных записей и токенов (Account & Token Controllers): создают стандартные учетные записи и токены доступа API для новых пространств имен.

### cloud-controller-manager

[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) запускает контроллеры, которые взаимодействуют с основными облачными провайдерами. Двоичный файл cloud-controller-manager — это альфа-функциональность, появившиеся в Kubernetes 1.6.

cloud-controller-manager запускает только циклы контроллера, относящиеся к облачному провайдеру. Вам нужно отключить эти циклы контроллера в kube-controller-manager. Вы можете отключить циклы контроллера, установив флаг `--cloud-provider` со значением `external` при запуске kube-controller-manager.

С помощью cloud-controller-manager код как облачных провайдеров, так и самого Kubernetes может разрабатываться независимо друг от друга. В предыдущих версиях код ядра Kubernetes зависел от кода, предназначенного для функциональности облачных провайдеров. В будущих выпусках код, специфичный для облачных провайдеров, должен поддерживаться самим облачным провайдером и компоноваться с cloud-controller-manager во время запуска Kubernetes.

Следующие контроллеры зависят от облачных провайдеров:

  * Контроллер узла (Node Controller): проверяет облачный провайдер, чтобы определить, был ли удален узел в облаке после того, как он перестал работать
  * Контроллер маршрутов (Route Controller): настраивает маршруты в основной инфраструктуре облака
  * Контроллер сервисов (Service Controller): создаёт, обновляет и удаляет балансировщики нагрузки облачного провайдера.
  * Контроллер тома (Volume Controller): создаёт, присоединяет и монтирует тома, а также взаимодействует с облачным провайдером для оркестрации томов.

## Компоненты узла

Компоненты узла работают на каждом узле, поддерживая работу подов и среды выполнения Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Среда выполнения контейнера

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Дополнения

Дополнения используют ресурсы Kubernetes ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}} и т.д.) для расширения функциональности кластера. Поскольку дополнения охватывают весь кластер, ресурсы относятся к пространству имен `kube-system`.

Некоторые из дополнений описаны ниже; более подробный список доступных расширений вы можете найти на странице [Дополнения](/docs/concepts/cluster-administration/addons/).

### DNS

Хотя прочие дополнения не являются строго обязательными, однако при этом у всех Kubernetes-кластеров должен быть [кластерный DNS](/docs/concepts/services-networking/dns-pod-service/), так как многие примеры предполагают его наличие.

Кластерный DNS — это DNS-сервер наряду с другими DNS-серверами в вашем окружении, который обновляет DNS-записи для сервисов Kubernetes.

Контейнеры, запущенные посредством Kubernetes, автоматически включают этот DNS-сервер в свои DNS.

### Веб-интерфейс (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) — это универсальный веб-интерфейс для кластеров Kubernetes. С помощью этой панели, пользователи могут управлять и устранять неполадки кластера и приложений, работающих в кластере.

### Мониторинг ресурсов контейнера

[Мониторинг ресурсов контейнера](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) записывает общие метрики о контейнерах в виде временных рядов в центральной базе данных и предлагает пользовательский интерфейс для просмотра этих данных.

### Логирование кластера

Механизм [логирования кластера](/docs/concepts/cluster-administration/logging/) отвечает за сохранение логов контейнера в централизованном хранилище логов с возможностью их поиска/просмотра.


## {{% heading "whatsnext" %}}

* Подробнее про [узлы](/docs/concepts/architecture/nodes/)
* Подробнее про [контроллеры](/docs/concepts/architecture/controller/)
* Подробнее про [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Официальная [документация](https://etcd.io/docs/) etcd

