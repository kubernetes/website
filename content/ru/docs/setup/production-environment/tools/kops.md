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

kops lets you manage your clusters even after installation.  To do this, it must keep track of the clusters
that you have created, along with their configuration, the keys they are using etc.  This information is stored
in an S3 bucket.  S3 permissions are used to control access to the bucket.

Multiple clusters can use the same S3 bucket, and you can share an S3 bucket between your colleagues that
administer the same clusters - this is much easier than passing around kubecfg files.  But anyone with access
to the S3 bucket will have administrative access to all your clusters, so you don't want to share it beyond
the operations team.

So typically you have one S3 bucket for each ops team (and often the name will correspond
to the name of the hosted zone above!)

In our example, we chose `dev.example.com` as our hosted zone, so let's pick `clusters.dev.example.com` as
the S3 bucket name.

* Export `AWS_PROFILE` (if you need to select a profile for the AWS CLI to work)

* Create the S3 bucket using `aws s3 mb s3://clusters.dev.example.com`

* You can `export KOPS_STATE_STORE=s3://clusters.dev.example.com` and then kops will use this location by default.
   We suggest putting this in your bash profile or similar.


### (4/5) Build your cluster configuration

Run `kops create cluster` to create your cluster configuration:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops will create the configuration for your cluster.  Note that it _only_ creates the configuration, it does
not actually create the cloud resources - you'll do that in the next step with a `kops update cluster`.  This
give you an opportunity to review the configuration or change it.

It prints commands you can use to explore further:

* List your clusters with: `kops get cluster`
* Edit this cluster with: `kops edit cluster useast1.dev.example.com`
* Edit your node instance group: `kops edit ig --name=useast1.dev.example.com nodes`
* Edit your master instance group: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

If this is your first time using kops, do spend a few minutes to try those out!  An instance group is a
set of instances, which will be registered as kubernetes nodes.  On AWS this is implemented via auto-scaling-groups.
You can have several instance groups, for example if you wanted nodes that are a mix of spot and on-demand instances, or
GPU and non-GPU instances.


### (5/5) Create the cluster in AWS

Run "kops update cluster" to create your cluster in AWS:

`kops update cluster useast1.dev.example.com --yes`

That takes a few seconds to run, but then your cluster will likely take a few minutes to actually be ready.
`kops update cluster` will be the tool you'll use whenever you change the configuration of your cluster; it
applies the changes you have made to the configuration to your cluster - reconfiguring AWS or kubernetes as needed.

For example, after you `kops edit ig nodes`, then `kops update cluster --yes` to apply your configuration, and
sometimes you will also have to `kops rolling-update cluster` to roll out the configuration immediately.

Without `--yes`, `kops update cluster` will show you a preview of what it is going to do.  This is handy
for production clusters!

### Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization, and control of your Kubernetes cluster.

## Cleanup

* To delete your cluster: `kops delete cluster useast1.dev.example.com --yes`



## {{% heading "whatsnext" %}}


* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/overview/).
* Learn more about `kops` [advanced usage](https://kops.sigs.k8s.io/) for tutorials, best practices and advanced configuration options.
* Follow `kops` community discussions on Slack: [community discussions](https://github.com/kubernetes/kops#other-ways-to-communicate-with-the-contributors)
* Contribute to `kops` by addressing or raising an issue [GitHub Issues](https://github.com/kubernetes/kops/issues)

