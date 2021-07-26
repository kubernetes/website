---
title: Установка Kubernetes с помощью kops
content_type: task
weight: 20
---

<!-- overview -->

В этом кратком руководстве показанно, как легко установитькластер Kubernetes на AWS.
Он использует инструмент под названием [`kops`](https://github.com/kubernetes/kops).

kops является автоматизированой системой инициализации:

* Полная автоматизированная установка
* Использует DNS для идентификации кластеров
* Самовосстановление: все работает в группах автомасштабирования
* Поддержка нескольких ОС (поддерживается Debian, Ubuntu 16.04, CentOS и RHEL, Amazon Linux и CoreOS) - см. [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* Поддержка высокой доступности - см. [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/operations/high_availability.md)
* Может напрямую предоставлять или генерировать манифесты терраформ - см. [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)



## {{% heading "prerequisites" %}}


* У Вас должен быть установлен [kubectl](/docs/tasks/tools/).

* Вы должны [установить](https://github.com/kubernetes/kops#installing) `kops` на 64-битную архитектуру устройства (AMD64 или Intel 64).

* У Вас должна быть [учетная запись AWS](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html), сформированный [IAM ключи](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) и [настроенные](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration). Пользователю IAM потребуются [сответствующие разрешения](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user).



<!-- steps -->

## Создание кластера

### (1/5) Установка kops

#### Установка

Загрузите kops со [страницы релизов](https://github.com/kubernetes/kops/releases) (так же удобно собрать из исходных кодов):

{{< tabs name="kops_installation" >}}
{{% tab name="macOS" %}}

Загрузите последнюю версию с помощью команды::

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
```

Чтобы загрузить определенную версию, замените следующую часть команды конкретной версией kops.

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

Например, чтобы загрузить версию kops v1.20.0 введите:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-darwin-amd64
```

Сделайте исполняемый двоичный файл kops.

```shell
chmod +x kops-darwin-amd64
```

Переместите двоичный файл kops в свой PATH.

```shell
sudo mv kops-darwin-amd64 /usr/local/bin/kops
```

Вы также можете установить kops с помощью [Homebrew](https://brew.sh/).

```shell
brew update && brew install kops
```
{{% /tab %}}
{{% tab name="Linux" %}}

Загрузите последнюю версию с помощью команды:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
```
Чтобы загрузить определенную версию kops, замените следующую часть команды конкретной версией kops.

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

Например, чтобы загрузить версию kops v1.20.0, введите:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-linux-amd64
```

Сделайте двоичный файл kops исполняемым

```shell
chmod +x kops-linux-amd64
```

MПереместите двоичный файл kops в свой PATH.

```shell
sudo mv kops-linux-amd64 /usr/local/bin/kops
```

Вы также можете установить kops с помощью [Homebrew](https://docs.brew.sh/Homebrew-on-Linux).

```shell
brew update && brew install kops
```

{{% /tab %}}
{{< /tabs >}}


### (2/5) Создайте доомен route53 для вашего кластера

kops использует DNS для обнаружения как внутри кластера, так и за его пределами, чтобы вы могли получить доступ к серверу API Kubernetes от клиентов.

kops твердо придерживается мнения о названии кластера: это должно быть действительное DNS-имя. Поступая таким образом, вы больше не будете путать свои кластеры, вы сможете однозначно обмениваться кластерами со своими коллегами и сможете связаться с ними, не полагаясь на запоминание IP-адреса.

Вы можете и, вероятно, должны использовать поддомены для разделения кластеров. В качестве нашего примера мы будем использовать `useast1.dev.example.com`. Конечная точка сервера API буде`api.useast1.dev.example.com`.

Зона, размещенная на Route53, может обслуживать поддомены.  Ваша размещенная зона может быть `useast1.dev.example.com`,
но также `dev.example.com` или даже `example.com`.  kops работает с любыми из них, поэтому как правило вы выбираете по организационным соображениям (например, вам разрешено создавать записи в `dev.example.com`,
но не под `example.com`).

Предположим, вы используете `dev.example.com` в качестве размещенной зоны.  Вы создаете эту размещенную зону используя [нормальный процесс](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), или
с помощью такой команды `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.

Затем вы должны настроить свои NS-записи в родительском домене, чтобы разрешить записи в этом домене.  Здесь,
вы могли бы создать NS записи `example.com` для `dev`. Если это корневое доменное имя, вы должны настроить NS
запись у вашего доменного регистратора (например, `example.com` нужно настроить где вы приобрели `example.com`).

Проверьте настройку домена route53 (это причина проблем №1!). Вы можете дважды проверить настройки вашего кластерана правильность, если у вас имеется инструмент dig, запустив:

`dig NS dev.example.com`

Вы должны увидеть 4 NS записи, которые Route53 назначил вашей зоне хостинга.

### (3/5) Создание корзины S3 для хранения состояния ваших кластеров.

kops позволяет управлять вашими кластерами даже после установки. Для этого он должен отслеживать созданные вами кластеры, а также их конфигурацию, ключи, которые они используют, и т. Эта информация хранится в корзине S3. Разрешения S3 используются для управления доступок к корзине.

Несколько кластеров могут использовать одну и туже корзину S3 и вы можете совместно делиться корзиной S3 между вашими коллегами, которые управляют одними и теми же кластерами - это намного проще, чем передавать файлы kubecfg. Но любой, у кого имеется доступ к корзине S3, будет имеет управляемый доступ ка всем вашим кластерам, поэтому вы не захотите делиться им за пределами группы эксплуатации.

Так что обычно у вас есть одна корзина S3 для каждой операционной команды (и часто имя будет соответствовать названию размещенной зоны выше!)

В нашем примере мы выбрали `dev.example.com` в качестве нашей зоны хостинга, поэтому давайте выберем `clusters.dev.example.com` как имя для нашей корзины 
S3.

* Экспорт `AWS_PROFILE` (если вам нужно выбрать профиль для работы AWS CLI)

* Создайте корзину S3 использую `aws s3 mb s3://clusters.dev.example.com`

* Вы можете выполнить команду export KOPS_STATE_STORE=s3://clusters.dev.example.com` и тогда kops будет использовать это местоположение по умолчанию.
   We suggest putting this in your bash profile or similar.


### (4/5) Создание конфигурации вашего кластера

Выполните команду `kops create cluster` чтобы создать конфигурацию вашего кластера:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops создать конфигурацию для вашего кластера. Обратите внимание, что он только (_only_) создает конфигурацию, на самом деле не создает облочные ресурсы - вы сделаете это на следующем шаге с `kops update cluster`. Этодаст вам возможность пересмотреть конфигурацию или изменить ее.

Он печатает команды, которые можно использовать для дальнейшего изучения:

* Посмотреть список Ваших кластеров: `kops get cluster`
* Отредактировать этот кластер: `kops edit cluster useast1.dev.example.com`
* Отредактировать вашу группу экземпляра узла (node): `kops edit ig --name=useast1.dev.example.com nodes`
* Отредактировать вашу главную (master) группу экземпляра: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

Есои вы впервые используете kops, потратье несколько минрут, чтобы опробовать их! Группа элементов - это набор экземпляров, которые будут зарегестрированы как kubernetes nodes. В AWS это реализованно с помощью групп автоматического маштабирования. У вас может быть несколько групп экземпляров, например, если вам нужны node-ы, представляющие собой сочетание точечных экземпляров и экземпляров по запросу, или экземпляров GPU и не-GPU.


### (5/5) Создание кластера в AWS

Запустите "kops update cluster", чтобы создать ваш кластер в  AWS:

`kops update cluster useast1.dev.example.com --yes`

Это займет несколько секунд, но тогда вашему кластеру, скорее всего, потребуется несколько минут, чтобы быть действительно готовым.
`kops update cluster` будет инструментов, который будет использоваться вами всяки раз, когда вы изменяете  конфигурацию кластера; он применяет изменения, внесенные вами в конфигурацию вашего кластера - перенастраивая AWS или kubernetes по мере необходимости.

Например, после того как вы выполните `kops edit ig nodes`, далле нужно выполнить `kops update cluster --yes` чтобы применить вашу конфигурацию, а иногда вам придется выполнить`kops rolling-update cluster` чтобы немедленно развернуть конфигурацию.

Без `--yes`, `kops update cluster` покажет вам предварительный просмотр того, что он собирвается делать. Это удобно для производственных кластеров. 

### Изучите другие дополнения

Посмотрите [список дополнений](/docs/concepts/cluster-administration/addons/) чтобы изучить другие дополнения, включая инструменты для введения журнала, мониторинга, сетевой политиеи, визуализации и управления кластером Kubernetes.

## Очистка

* Чтобы удалить кластер: `kops delete cluster useast1.dev.example.com --yes`



## {{% heading "whatsnext" %}}


* Узнайте больше о Kubernetes [концепции](/docs/concepts/) и [`kubectl`](/docs/reference/kubectl/overview/).
* Узнайте больше о [расширенном использовании](https://kops.sigs.k8s.io/) `kops`, передовых методов и расширенных параметров конфигурации.
* Следите за обсуждениями сообщества kops` на Slack: [обсуждения сообщества](https://github.com/kubernetes/kops#other-ways-to-communicate-with-the-contributors)
* Внесите свой вклад в`kops` путем решения или поднятия вопроса в [GitHub Вопросы](https://github.com/kubernetes/kops/issues)

