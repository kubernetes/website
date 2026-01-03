---
title: kube-controller-manager Configuration (v1alpha1)
content_type: tool-reference
package: kubecontrollermanager.config.k8s.io/v1alpha1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)
- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)
- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

## `ClientConnectionConfiguration` {#ClientConnectionConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

ClientConnectionConfiguration містить деталі для конструювання клієнта.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>kubeconfig</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>kubeconfig — шлях до файлу KubeConfig.</p></td>
        </tr>
        <tr>
            <td>
                <code>acceptContentTypes</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>acceptContentTypes визначає заголовок Accept, що надсилається клієнтами при підключенні до сервера, замінюючи стандартне значення 'application/json'. Це поле буде контролювати всі зʼєднання з сервером, що використовуються конкретним клієнтом.</p></td>
        </tr>
        <tr>
            <td>
                <code>contentType</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>contentType — тип контенту, який використовується при надсиланні даних на сервер з цього клієнта.</p></td>
        </tr>
        <tr>
            <td>
                <code>qps</code> <b>[Обовʼязково]</b><br/>
                <code>float32</code>
            </td>
            <td><p>qps контролює кількість запитів на секунду, дозволених для цього зʼєднання.</p></td>
        </tr>
        <tr>
            <td>
                <code>burst</code> <b>[Обовʼязково]</b><br/>
                <code>int32</code>
            </td>
            <td><p>burst дозволяє накопичувати додаткові запити, коли клієнт перевищує свій ліміт.</p></td>
        </tr>
    </tbody>
</table>

## `DebuggingConfiguration` {#DebuggingConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

DebuggingConfiguration містить конфігурацію для функцій, повʼязаних з налагодженням.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>enableProfiling</code> <b>[Обовʼязково]</b><br/>
                <code>bool</code>
            </td>
            <td><p>enableProfiling вмикає профілювання через веб-інтерфейс host:port/debug/prof/</p></td>
        </tr>
        <tr>
            <td>
                <code>enableContentionProfiling</code> <b>[Обовʼязково]</b><br/>
                <code>bool</code>
            </td>
            <td><p>enableContentionProfiling вмикає профілювання блоків, якщо enableProfiling має значення true.</p></td>
        </tr>
    </tbody>
</table>

## `LeaderElectionConfiguration` {#LeaderElectionConfiguration}

**Зʼявляється у:**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

LeaderElectionConfiguration визначає конфігурацію клієнтів виборів лідера для компонентів, які можуть працювати з увімкненими виборами лідера.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>leaderElect</code> <b>[Обовʼязково]</b><br/>
                <code>bool</code>
            </td>
            <td><p>leaderElect дозволяє клієнту, який обирає лідера, отримати лідерство перед виконанням основного циклу. Увімкніть цей параметр під час запуску реплікованих компонентів для забезпечення високої доступності.</p></td>
        </tr>
        <tr>
            <td>
                <code>leaseDuration</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>leaseDuration — це тривалість, протягом якої кандидати, що не є лідерами, чекатимуть після поновлення лідерства, перш ніж спробувати зайняти лідерство в лідируючому, але не поновленому лідерському слоті. Це фактично максимальна тривалість, на яку лідер може бути зупинений, перш ніж його замінить інший кандидат. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
        </tr>
        <tr>
            <td>
                <code>renewDeadline</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>renewDeadline — інтервал між спробами виконуючого обов'язки майстра поновити слот лідерства до того, як він перестане бути лідером. Він має бути меншим або рівним тривалості оренди. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
        </tr>
        <tr>
            <td>
                <code>retryPeriod</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>retryPeriod — це час, протягом якого клієнти повинні чекати між спробою отримання та поновленням лідерства. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
        </tr>
        <tr>
            <td>
                <code>resourceLock</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>resourceLock вказує тип обʼєкта ресурсу, який буде використовуватися для блокування під час циклів обрання лідера.</p></td>
        </tr>
        <tr>
            <td>
                <code>resourceName</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>resourceName вказує імʼя обʼєкта ресурсу, який буде використовуватися для блокування під час циклів обрання лідера.</p></td>
        </tr>
        <tr>
            <td>
                <code>resourceNamespace</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>resourceName вказує на простір імен обʼєкта ресурсу, який буде використовуватися для блокування під час циклів обрання лідера.</p></td>
        </tr>
    </tbody>
</table>

## `NodeControllerConfiguration` {#NodeControllerConfiguration}

**Зʼявляється у:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

NodeControllerConfiguration містить елементи, що описують NodeController.</p>

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentNodeSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>ConcurrentNodeSyncs — це кількість процесів, які одночасно синхронізують вузли</p>
            </td>
        </tr>
    </tbody>
</table>

## `ServiceControllerConfiguration` {#ServiceControllerConfiguration}

**Зʼявляється у:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

ServiceControllerConfiguration містить елементи, що описують ServiceController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentServiceSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentServiceSyncs — це кількість служб, які можуть синхронізуватися одночасно. Більше число = більш чутливе управління службами, але більше навантаження на процесор (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `CloudControllerManagerConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration}

CloudControllerManagerConfiguration містить елементи, що описують cloud-controller manager.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>apiVersion</code><br/>string
            </td>
            <td>
                <code>cloudcontrollermanager.config.k8s.io/v1alpha1</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>kind</code><br/>string
            </td>
            <td>
                <code>CloudControllerManagerConfiguration</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>Generic</code> <b>[Обовʼязкове]</b><br/>
                <a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration">
                    <code>GenericControllerManagerConfiguration</code>
                </a>
            </td>
            <td>
                <p>Generic містить конфігурацію для загального контролера-менеджера</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KubeCloudShared</code> <b>[Обовʼязкове]</b><br/>
                <a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration">
                    <code>KubeCloudSharedConfiguration</code>
                </a>
            </td>
            <td>
                <p>KubeCloudSharedConfiguration містить конфігурацію для функцій, що використовуються як в cloud controller manager, так і в kube-controller manager.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#NodeControllerConfiguration">
                    <code>NodeControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>NodeController містить конфігурацію для функцій, повʼязаних з контролером вузлів.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ServiceController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#ServiceControllerConfiguration">
                    <code>ServiceControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ServiceControllerConfiguration містить конфігурацію для функцій, повʼязаних з контролером служб.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeStatusUpdateFrequency</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>NodeStatusUpdateFrequency — це частота, з якою контролер оновлює статус вузлів</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>Webhook</code> <b>[Обовʼязкове]</b><br/>
                <a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration">
                    <code>WebhookConfiguration</code>
                </a>
            </td>
            <td>
                <p>Webhook — це конфігурація для вебхуків, розгорнутих в cloud-controller-manager</p>
            </td>
        </tr>
    </tbody>
</table>

## `CloudProviderConfiguration` {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration}

**Зʼявляється у:**

- [KubeCloudSharedConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration)

CloudProviderConfiguration містить елементи, що описують постачальника хмарних послуг.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>Name</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Name — це постачальник хмарних послуг.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>CloudConfigFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>cloudConfigFile — це шлях до файлу конфігурації постачальника хмарних послуг.</p>
            </td>
        </tr>
    </tbody>
</table>

## `KubeCloudSharedConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration}

**Зʼявляється у:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

KubeCloudSharedConfiguration містить елементи, які використовуються як kube-controller manager, так і cloud-controller manager, але не genericconfig.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>CloudProvider</code> <b>[Обовʼязкове]</b><br/>
                <a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration">
                    <code>CloudProviderConfiguration</code>
                </a>
            </td>
            <td>
                <p>CloudProviderConfiguration містить конфігурацію для функцій, повʼязаних з CloudProvider.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ExternalCloudVolumePlugin</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>externalCloudVolumePlugin вказує втулок, який використовувати, коли cloudProvider є "external". Наразі він використовується хмарними провайдерами з репо для керування вузлами та томами в KCM.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>UseServiceAccountCredentials</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>useServiceAccountCredentials вказує, чи повинні контролери працювати з окремими службовими обліковими даними.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>AllowUntaggedCloud</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>дозволяє запуск з непозначеними теґами хмарними екземплярами</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>RouteReconciliationPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>routeReconciliationPeriod — це період для узгодження маршрутів, створених для вузлів постачальником хмар.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeMonitorPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>nodeMonitorPeriod — це період для синхронізації NodeStatus в NodeController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ClusterName</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>clusterName — це префікс екземпляра для кластеру.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ClusterCIDR</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>clusterCIDR — це CIDR-діапазон для Pods у кластері.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>AllocateNodeCIDRs</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>AllocateNodeCIDRs дозволяє виділяти CIDR для Podʼів і, якщо ConfigureCloudRoutes є true, налаштовувати їх на постачальнику хмар.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>CIDRAllocatorType</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>CIDRAllocatorType визначає, який тип розподільника Pod CIDR буде використовуватися.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ConfigureCloudRoutes</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>configureCloudRoutes дозволяє налаштовувати CIDR, виділені з allocateNodeCIDRs, на постачальнику хмар.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeSyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>nodeSyncPeriod — це період для синхронізації вузлів з постачальником хмар. Довші періоди зменшать кількість викликів до постачальника хмар, але можуть затримати додавання нових вузлів в кластер.</p>
            </td>
        </tr>
    </tbody>
</table>

## `WebhookConfiguration` {#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration}

**Зʼявляється у:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

WebhookConfiguration містить конфігурацію, повʼязану з вебхуками, розгорнутими в cloud-controller-manager.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>Webhooks</code> <b>[Обовʼязкове]</b><br/>
                <code>[]string</code>
            </td>
            <td>
                <p>Webhooks — це список вебхуків для активації або деактивації:
                '*' означає "всі стандартно активовані вебхуки"
                'foo' означає "активувати 'foo'"
                '-foo' означає "деактивувати 'foo'"
                перший елемент для конкретного імені виграє</p>
            </td>
        </tr>
    </tbody>
</table>

## `LeaderMigrationConfiguration` {#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration}

**Зʼявляється у:**

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

ControllerLeaderConfiguration надає конфігурацію для блокування мігруючого лідера.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>apiVersion</code><br/>
                <code>string</code>
            </td>
            <td>
                <code>controllermanager.config.k8s.io/v1alpha1</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>kind</code><br/>
                <code>string</code>
            </td>
            <td>
                <code>LeaderMigrationConfiguration</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>leaderName</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>LeaderName — це назва ресурсу вибору лідера, який захищає міграцію, наприклад, 1-20-KCM-to-1-21-CCM</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>resourceLock</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>ResourceLock вказує на тип обʼєкта ресурсу, який буде використовуватися для блокування. Має бути "leases" або "endpoints"</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>controllerLeaders</code> <b>[Обовʼязкове]</b><br/>
                <a href="#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration">
                    <code>[]ControllerLeaderConfiguration</code>
                </a>
            </td>
            <td>
                <p>ControllerLeaders містить список конфігурацій блокувань лідерів, які мігрують.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ControllerLeaderConfiguration` {#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration}

**Зʼявляється у:**

- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)

ControllerLeaderConfiguration надає конфігурацію для блокування мігруючого лідера.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>name</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Name — це назва контролера, що мігрує, наприклад, service-controller, route-controller, cloud-node-controller тощо</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>component</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Component — це назва компонента, в якому контролер має працювати, наприклад, kube-controller-manager, cloud-controller-manager тощо. Або '*' означає, що контролер може працювати під будь-яким компонентом, який бере участь у міграції.</p>
            </td>
        </tr>
    </tbody>
</table>

## `GenericControllerManagerConfiguration` {#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration}

**Зʼявляється у:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

GenericControllerManagerConfiguration містить конфігурацію для загального контролер-менеджера.


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>Port</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>port — це порт, на якому працює HTTP-сервіс контролера-менеджера.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>Address</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>address — це IP-адреса для обслуговування (встановіть на 0.0.0.0 для всіх інтерфейсів).</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MinResyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>minResyncPeriod — це період повторної синхронізації в рефлекторах; буде випадковим між minResyncPeriod і 2*minResyncPeriod.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ClientConnection</code> <b>[Обовʼязкове]</b><br/>
                <a href="#ClientConnectionConfiguration">
                    <code>ClientConnectionConfiguration</code>
                </a>
            </td>
            <td>
                <p>ClientConnection визначає файл kubeconfig та налаштування зʼєднання клієнта для використання проксі-сервером при спілкуванні з apiserver.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ControllerStartInterval</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>Як довго чекати між запуском контролер-менеджерів.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LeaderElection</code> <b>[Обовʼязкове]</b><br/>
                <a href="#LeaderElectionConfiguration">
                    <code>LeaderElectionConfiguration</code>
                </a>
            </td>
            <td>
                <p>leaderElection визначає конфігурацію клієнта вибору лідера.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>Controllers</code> <b>[Обовʼязкове]</b><br/>
                <code>[]string</code>
            </td>
            <td>
                <p>Controllers — це список контролерів для активації або деактивації:
                '*' означає "всі контролери, що стандартно активовані"
                'foo' означає "активувати 'foo'"
                '-foo' означає "деактивувати 'foo'"
                перший елемент для конкретного імені виграє</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>Debugging</code> <b>[Обовʼязкове]</b><br/>
                <a href="#DebuggingConfiguration">
                    <code>DebuggingConfiguration</code>
                </a>
            </td>
            <td>
                <p>DebuggingConfiguration містить конфігурацію для функцій, повʼязаних з відлагодженням.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LeaderMigrationEnabled</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>LeaderMigrationEnabled вказує, чи має бути увімкнена міграція лідера для контролер-менеджера.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LeaderMigration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration">
                    <code>LeaderMigrationConfiguration</code>
                </a>
            </td>
            <td>
                <p>LeaderMigration містить конфігурацію для міграції лідера.</p>
            </td>
        </tr>
    </tbody>
</table>

## `KubeControllerManagerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration}

KubeControllerManagerConfiguration містить елементи, що описують kube-controller manager.</p>

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>apiVersion</code><br/>string
            </td>
            <td>
                <code>kubecontrollermanager.config.k8s.io/v1alpha1</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>kind</code><br/>string
            </td>
            <td>
                <code>KubeControllerManagerConfiguration</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>Generic</code> <b>[Обовʼязкове]</b><br/>
                <a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration">
                    <code>GenericControllerManagerConfiguration</code>
                </a>
            </td>
            <td>
                <p>Generic містить конфігурацію для загального контролера-менеджера</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KubeCloudShared</code> <b>[Обовʼязкове]</b><br/>
                <a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration">
                    <code>KubeCloudSharedConfiguration</code>
                </a>
            </td>
            <td>
                <p>KubeCloudSharedConfiguration містить конфігурацію для спільних функцій як в cloud controller manager, так і в kube-controller manager.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>AttachDetachController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration">
                    <code>AttachDetachControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>AttachDetachControllerConfiguration містить конфігурацію для функцій, повʼязаних з AttachDetachController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>CSRSigningController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration">
                    <code>CSRSigningControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>CSRSigningControllerConfiguration містить конфігурацію для функцій, повʼязаних з CSRSigningController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>DaemonSetController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration">
                    <code>DaemonSetControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>DaemonSetControllerConfiguration містить конфігурацію для функцій, повʼязаних з DaemonSetController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>DeploymentController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration">
                    <code>DeploymentControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>DeploymentControllerConfiguration містить конфігурацію для функцій, повʼязаних з DeploymentController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>StatefulSetController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration">
                    <code>StatefulSetControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>StatefulSetControllerConfiguration містить конфігурацію для функцій, повʼязаних з StatefulSetController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>DeprecatedController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration">
                    <code>DeprecatedControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>DeprecatedControllerConfiguration містить конфігурацію для деяких застарілих функцій.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EndpointController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration">
                    <code>EndpointControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>EndpointControllerConfiguration містить конфігурацію для функцій, повʼязаних з EndpointController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EndpointSliceController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration">
                    <code>EndpointSliceControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>EndpointSliceControllerConfiguration містить конфігурацію для функцій, повʼязаних з EndpointSliceController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EndpointSliceMirroringController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration">
                    <code>EndpointSliceMirroringControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>EndpointSliceMirroringControllerConfiguration містить конфігурацію для функцій, повʼязаних з EndpointSliceMirroringController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EphemeralVolumeController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration">
                    <code>EphemeralVolumeControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>EphemeralVolumeControllerConfiguration містить конфігурацію для функцій, повʼязаних з EphemeralVolumeController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>GarbageCollectorController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration">
                    <code>GarbageCollectorControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>GarbageCollectorControllerConfiguration містить конфігурацію для функцій, повʼязаних з GarbageCollectorController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HPAController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration">
                    <code>HPAControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>HPAControllerConfiguration містить конфігурацію для функцій, повʼязаних з HPAController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>JobController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration">
                    <code>JobControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>JobControllerConfiguration містить конфігурацію для функцій, повʼязаних з JobController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>CronJobController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration">
                    <code>CronJobControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>CronJobControllerConfiguration містить конфігурацію для функцій, повʼязаних з CronJobController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LegacySATokenCleaner</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration">
                    <code>LegacySATokenCleanerConfiguration</code>
                </a>
            </td>
            <td>
                <p>LegacySATokenCleanerConfiguration містить конфігурацію для функцій, повʼязаних з LegacySATokenCleaner.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NamespaceController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration">
                    <code>NamespaceControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>NamespaceControllerConfiguration містить конфігурацію для функцій, повʼязаних з NamespaceController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeIPAMController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration">
                    <code>NodeIPAMControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>NodeIPAMControllerConfiguration містить конфігурацію для функцій, повʼязаних з NodeIPAMController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeLifecycleController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration">
                    <code>NodeLifecycleControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>NodeLifecycleControllerConfiguration містить конфігурацію для функцій, повʼязаних з NodeLifecycleController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PersistentVolumeBinderController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration">
                    <code>PersistentVolumeBinderControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>PersistentVolumeBinderControllerConfiguration містить конфігурацію для функцій, повʼязаних з PersistentVolumeBinderController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PodGCController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration">
                    <code>PodGCControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>PodGCControllerConfiguration містить конфігурацію для функцій, повʼязаних з PodGCController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ReplicaSetController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration">
                    <code>ReplicaSetControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ReplicaSetControllerConfiguration містить конфігурацію для функцій, повʼязаних з ReplicaSet.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ReplicationController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration">
                    <code>ReplicationControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ReplicationControllerConfiguration містить конфігурацію для функцій, повʼязаних з ReplicationController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ResourceQuotaController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration">
                    <code>ResourceQuotaControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ResourceQuotaControllerConfiguration містить конфігурацію для функцій, повʼязаних з ResourceQuotaController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>SAController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration">
                    <code>SAControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>SAControllerConfiguration містить конфігурацію для функцій, повʼязаних з ServiceAccountController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ServiceController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#ServiceControllerConfiguration">
                    <code>ServiceControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ServiceControllerConfiguration містить конфігурацію для функцій, повʼязаних з ServiceController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>TTLAfterFinishedController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration">
                    <code>TTLAfterFinishedControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>TTLAfterFinishedControllerConfiguration містить конфігурацію для функцій, повʼязаних з TTLAfterFinishedController.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ValidatingAdmissionPolicyStatusController</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration">
                    <code>ValidatingAdmissionPolicyStatusControllerConfiguration</code>
                </a>
            </td>
            <td>
                <p>ValidatingAdmissionPolicyStatusControllerConfiguration містить конфігурацію для функцій, повʼязаних з ValidatingAdmissionPolicyStatusController.</p>
            </td>
        </tr>
        <tr>
            <td><code>DeviceTaintEvictionController</code> <b>[Обовʼязкове]</b><br/>
            <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeviceTaintEvictionControllerConfiguration"><code>DeviceTaintEvictionControllerConfiguration</code></a> </td>
            <td> <p>DeviceTaintEvictionControllerConfiguration містить елементи, що конфігурують контролер виселення пристроїв позначених taint.</p></td>
        </tr>
    </tbody>
</table>

## `AttachDetachControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

AttachDetachControllerConfiguration містить елементи, що описують AttachDetachController.


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>DisableAttachDetachReconcilerSync</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>Reconciler виконує періодичний цикл для узгодження бажаного стану з фактичним станом, ініціюючи операції прикріплення/відкріплення. Цей прапорець включає або вимикає узгодження. Станадртне значення — false, отже, включено.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ReconcilerSyncLoopPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
                    <code>meta/v1.Duration</code>
                </a>
            </td>
            <td>
                <p>ReconcilerSyncLoopPeriod — це період часу, протягом якого цикл узгодження станів чекає між наступними виконаннями. Стандартне знаячення — 60 секунд.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>disableForceDetachOnTimeout</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>DisableForceDetachOnTimeout вимикає примусове відкріплення, коли максимальний час розмонтування перевищено. Стандартне значення — false, отже, примусове відкріплення при відключенні увімкнено.</p>
            </td>
        </tr>
    </tbody>
</table>

## `CSRSigningConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration}


**Зʼявляється в:**

- [CSRSigningControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration)


CSRSigningConfiguration містить інформацію про конкретного підписувача CSR


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>CertFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>certFile — це імʼя файлу, що містить PEM-кодований
                сертифікат X509 CA, який використовується для видачі сертифікатів</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KeyFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>keyFile — це імʼя файлу, що містить PEM-кодований
                приватний ключ RSA або ECDSA, який використовується для видачі сертифікатів</p>
            </td>
        </tr>
    </tbody>
</table>

## `CSRSigningControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

CSRSigningControllerConfiguration містить елементи, що описують CSRSigningController.


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ClusterSigningCertFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>clusterSigningCertFile — це імʼя файлу, що містить PEM-кодований сертифікат X509 CA, використовується для видачі сертифікатів з обмеженням на кластер</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ClusterSigningKeyFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>clusterSigningKeyFile — це імʼя файлу, що містить PEM-кодований приватний ключ RSA або ECDSA, який використовується для видачі сертифікатів з обмеженням на кластер</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KubeletServingSignerConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
            </td>
            <td>
                <p>kubeletServingSignerConfiguration містить сертифікат і ключ, які використовуються для видачі сертифікатів для kubernetes.io/kubelet-serving</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KubeletClientSignerConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
            </td>
            <td>
                <p>kubeletClientSignerConfiguration містить сертифікат і ключ, які використовуються для видачі сертифікатів для kubernetes.io/kube-apiserver-client-kubelet</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>KubeAPIServerClientSignerConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
            </td>
            <td>
                <p>kubeAPIServerClientSignerConfiguration містить сертифікат і ключ, які використовуються для видачі сертифікатів для kubernetes.io/kube-apiserver-client</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LegacyUnknownSignerConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
            </td>
            <td>
                <p>legacyUnknownSignerConfiguration містить сертифікат і ключ, які використовуються для видачі сертифікатів для kubernetes.io/legacy-unknown</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ClusterSigningDuration</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>clusterSigningDuration — це максимальний період дії сертифікатів, які видаються. Окремі CSR можуть запитувати коротші сертифікати, встановлюючи spec.expirationSeconds.</p>
            </td>
        </tr>
    </tbody>
</table>

## `CronJobControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

CronJobControllerConfiguration містить елементи, що описують CronJobController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentCronJobSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentCronJobSyncs — це кількість обʼєктів job, які дозволено синхронізувати одночасно. Більше число = більш швидка реакція job, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `DaemonSetControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

DaemonSetControllerConfiguration містить елементи, що описують DaemonSetController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentDaemonSetSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentDaemonSetSyncs — це кількість обʼєктів daemonset, які дозволено синхронізувати одночасно. Більше число = більш швидка реакція daemonset, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `DeploymentControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

DeploymentControllerConfiguration містить елементи, що описують DeploymentController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentDeploymentSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentDeploymentSyncs — це кількість обʼєктів deployment, які дозволено синхронізувати одночасно. Більше число = більш швидка реакція deployments, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `DeprecatedControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

DeprecatedControllerConfiguration містить елементи, що мають бути застарілими.

## `DeviceTaintEvictionControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeviceTaintEvictionControllerConfiguration}


**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

DeviceTaintEvictionControllerConfiguration містить елементи, що конфігурують контролер виселення пристроїв позначених taint.


<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>ConcurrentSyncs</code> <b>[Обовʼязкове]</b><br/>
            <code>int32</code></td>
            <td><p>ConcurrentSyncs — це кількість операцій (видалення пода, оновлення статусу ResourcClaim тощо), які будуть виконуватися одночасно. Більше число = більше обробки, але більше навантаження на CPU (і мережу).</p>
            <p>Стнадртне значення — 10.</p></td>
        </tr>
    </tbody>
</table>

## `EndpointControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

EndpointControllerConfiguration містить елементи, що описують EndpointController

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentEndpointSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentEndpointSyncs — це кількість операцій синхронізації точок доступу, які будуть виконуватись одночасно. Більше число = швидше оновлення, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EndpointUpdatesBatchPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>EndpointUpdatesBatchPeriod описує тривалість періоду пакетного оновлення точок доступу. Обробка змін у pod буде затримана на цей час, щоб обʼєднати їх з потенційними майбутніми оновленнями та зменшити загальну кількість оновлень точок доступу.</p>
            </td>
        </tr>
    </tbody>
</table>

## `EndpointSliceControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration}

**Зʼявляєтсья в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

EndpointSliceControllerConfiguration містить елементи, що описують EndpointSliceController.


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentServiceEndpointSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentServiceEndpointSyncs — це кількість операцій синхронізації точок доступу сервісу, які будуть виконуватись одночасно. Більше число = швидше оновлення EndpointSlice, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MaxEndpointsPerSlice</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>maxEndpointsPerSlice — максимальна кількість точок доступу, які будуть додані до одного EndpointSlice. Більше точок доступу на один slice призведе до меншої кількості та більших за розміром endpoint slices, але більших ресурсів.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EndpointUpdatesBatchPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>EndpointUpdatesBatchPeriod описує тривалість періоду пакетного оновлення точок доступу. Обробка змін у pod буде затримана на цей час, щоб обʼєднати їх з потенційними майбутніми оновленнями та зменшити загальну кількість оновлень точок доступу.</p>
            </td>
        </tr>
    </tbody>
</table>

## `EndpointSliceMirroringControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

EndpointSliceMirroringControllerConfiguration містить елементи, що описують EndpointSliceMirroringController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>MirroringConcurrentServiceEndpointSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>mirroringConcurrentServiceEndpointSyncs — це кількість операцій синхронізації точок доступу сервісу, які будуть виконуватись одночасно. Більше число = швидше оновлення EndpointSlice, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MirroringMaxEndpointsPerSubset</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>mirroringMaxEndpointsPerSubset — максимальна кількість точок доступу, які будуть відображені в EndpointSlice для одного EndpointSubset.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MirroringEndpointUpdatesBatchPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>mirroringEndpointUpdatesBatchPeriod можна використовувати для пакетного оновлення EndpointSlice. Усі оновлення, викликані змінами в EndpointSlice, будуть затримані до 'mirroringEndpointUpdatesBatchPeriod'. Якщо інші адреси в тому ж ресурсі Endpoints зміняться в цей період, вони будуть обʼєднані в одне оновлення EndpointSlice. Стандартне значення 0 означає, що кожне оновлення Endpoints викликає оновлення EndpointSlice.</p>
            </td>
        </tr>
    </tbody>
</table>

## `EphemeralVolumeControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration}

**Зʼявляєтсья в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

EphemeralVolumeControllerConfiguration містить елементи, що описують EphemeralVolumeController.


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentEphemeralVolumeSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>ConcurrentEphemeralVolumeSyncs — це кількість операцій синхронізації ефемерних томів, які будуть виконуватись одночасно. Більше число = швидше оновлення ефемерних томів, але більше навантаження на CPU (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `GarbageCollectorControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

GarbageCollectorControllerConfiguration містить елементи, що описують GarbageCollectorController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>EnableGarbageCollector</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>Увімкнення загального збирача сміття. ПОВИННО бути синхронізовано з відповідним прапорцем kube-apiserver. УВАГА: загальний збирач сміття є альфа-функцією.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ConcurrentGCSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>ConcurrentGCSyncs — це кількість процесів збирача сміття, які дозволяється синхронізувати одночасно.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>GCIgnoredResources</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource"><code>[]GroupResource</code></a>
            </td>
            <td>
                <p>gcIgnoredResources — це список GroupResources, які збирач сміття має ігнорувати.</p>
            </td>
        </tr>
    </tbody>
</table>

## `GroupResource` {#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource}

**Зʼявляється в:**

- [GarbageCollectorControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration)

<p>GroupResource описує груповий ресурс.</p>

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>Group</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Group — це частина групи ресурсу GroupResource.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>Resource</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Resource — це частина ресурсу ресурсу GroupResource.</p>
            </td>
        </tr>
    </tbody>
</table>

## `HPAControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

HPAControllerConfiguration містить елементи, що описують HPAController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentHorizontalPodAutoscalerSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>ConcurrentHorizontalPodAutoscalerSyncs — кількість обʼєктів HPA, які дозволено синхронізувати одночасно. Більше число = більш чутка обробка HPA, але більше навантаження на CPU (та мережу).</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HorizontalPodAutoscalerSyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>HorizontalPodAutoscalerSyncPeriod — період для синхронізації кількості Podʼів в горизонтальному автомасштабувальнику Podʼів.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HorizontalPodAutoscalerDownscaleStabilizationWindow</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>HorizontalPodAutoscalerDownscaleStabilizationWindow — період, протягом якого автомасштабувальник буде переглядати і не зменшувати кількість Podʼів нижче будь-яких рекомендацій, зроблених протягом цього періоду.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HorizontalPodAutoscalerTolerance</code> <b>[Обовʼязкове]</b><br/>
                <code>float64</code>
            </td>
            <td>
                <p>HorizontalPodAutoscalerTolerance — допуск для ситуацій, коли використання ресурсів вказує на необхідність масштабування вгору/вниз.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HorizontalPodAutoscalerCPUInitializationPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>HorizontalPodAutoscalerCPUInitializationPeriod — період після запуску Podʼа, коли можуть бути пропущені проби CPU.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>HorizontalPodAutoscalerInitialReadinessDelay</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>HorizontalPodAutoscalerInitialReadinessDelay — період після запуску Podʼа, протягом якого зміни готовності вважаються як готовність, що встановлюється вперше. Єдиний ефект цього — HPA буде ігнорувати проби CPU від неготових Podʼів, у яких остання зміна готовності відбулася під час цього періоду.</p>
            </td>
        </tr>
    </tbody>
</table>

## `JobControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

JobControllerConfiguration містить елементи, що описують JobController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentJobSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentJobSyncs — кількість обʼєктів job, які дозволено синхронізувати одночасно. Більше число = більш чутка обробка job, але більше навантаження на CPU (та мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `LegacySATokenCleanerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

LegacySATokenCleanerConfiguration містить елементи, що описують LegacySATokenCleaner


<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>CleanUpPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>CleanUpPeriod — період часу з моменту останнього використання автоматично згенерованого токена службового облікового запису перед тим, як його можна буде видалити.</p>
            </td>
        </tr>
    </tbody>
</table>

## `NamespaceControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

NamespaceControllerConfiguration містить елементи, що описують NamespaceController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>NamespaceSyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>namespaceSyncPeriod — період для синхронізації оновлень життєвого циклу простору імен.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ConcurrentNamespaceSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentNamespaceSyncs — кількість обʼєктів простору імен, які можуть синхронізуватися одночасно.</p>
            </td>
        </tr>
    </tbody>
</table>

## `NodeIPAMControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

NodeIPAMControllerConfiguration містить елементи, що описують NodeIpamController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ServiceCIDR</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>serviceCIDR — CIDR-діапазон для сервісів в кластері.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>SecondaryServiceCIDR</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>secondaryServiceCIDR — CIDR-діапазон для сервісів в кластері, що використовується в двостекових кластерах. SecondaryServiceCIDR має бути іншої IP-сімʼї, ніж ServiceCIDR.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeCIDRMaskSize</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>NodeCIDRMaskSize — маска розміру для CIDR вузлів в кластері.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeCIDRMaskSizeIPv4</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>NodeCIDRMaskSizeIPv4 — маска розміру для CIDR вузлів в двостековому кластері.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeCIDRMaskSizeIPv6</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>NodeCIDRMaskSizeIPv6 — маска розміру для CIDR вузлів в двостековому кластері.</p>
            </td>
        </tr>
    </tbody>
</table>

## `NodeLifecycleControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

NodeLifecycleControllerConfiguration містить елементи, що описують NodeLifecycleController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>NodeEvictionRate</code> <b>[Обовʼязкове]</b><br/>
                <code>float32</code>
            </td>
            <td>
                <p>nodeEvictionRate — кількість вузлів за секунду, на яких видаляються контейнери у разі збоїв вузла, коли зона є справною.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>SecondaryNodeEvictionRate</code> <b>[Обовʼязкове]</b><br/>
                <code>float32</code>
            </td>
            <td>
                <p>secondaryNodeEvictionRate — кількість вузлів за секунду, на яких видаляються контейнери у разі збоїв вузла, коли зона є несправною.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeStartupGracePeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>nodeStartupGracePeriod — період часу, протягом якого дозволяється, щоб вузол не відгукувався, перш ніж позначити його як несправний.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>NodeMonitorGracePeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>nodeMonitorGracePeriod — період часу, протягом якого дозволяється вузлу не відгукуватись, перш ніж позначити його як несправний. Має бути N разів більше, ніж nodeStatusUpdateFrequency kubeletʼа, де N означає кількість спроб, дозволених для kubelet для надсилання статусу вузла. Це значення також має бути більшим за суму HTTP2_PING_TIMEOUT_SECONDS і HTTP2_READ_IDLE_TIMEOUT_SECONDS.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PodEvictionTimeout</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>podEvictionTimeout — період для належного видалення Podʼів на неактивних вузлах.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>LargeClusterSizeThreshold</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>secondaryNodeEvictionRate явно перезаписується на 0 для кластерів, менших або рівних largeClusterSizeThreshold.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>UnhealthyZoneThreshold</code> <b>[Обовʼязкове]</b><br/>
                <code>float32</code>
            </td>
            <td>
                <p>Зона вважається несправною в nodeEvictionRate та secondaryNodeEvictionRate, коли щонайменше unhealthyZoneThreshold (не менше 3) вузлів у зоні є NotReady.</p>
            </td>
        </tr>
    </tbody>
</table>

## `PersistentVolumeBinderControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

PersistentVolumeBinderControllerConfiguration містить елементи, що описують PersistentVolumeBinderController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>PVClaimBinderSyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>pvClaimBinderSyncPeriod — період для синхронізації постійних томів та заявок на постійні томи.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>VolumeConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration"><code>VolumeConfiguration</code></a>
            </td>
            <td>
                <p>volumeConfiguration містить конфігурацію для функцій, повʼязаних з томами.</p>
            </td>
        </tr>
    </tbody>
</table>

## `PersistentVolumeRecyclerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration}

**Зʼявляється в:**

- [VolumeConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration)

PersistentVolumeRecyclerConfiguration містить елементи, що описують втулки для постійних томів.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>MaximumRetry</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>maximumRetry — кількість спроб, які recycler PV виконає у разі невдачі при переробці PV.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MinimumTimeoutNFS</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>minimumTimeoutNFS — мінімальний ActiveDeadlineSeconds для використання для Podʼа NFS Recycler.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PodTemplateFilePathNFS</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>podTemplateFilePathNFS — шлях до файлу з визначенням Podʼа, що використовується як шаблон для переробки постійного тому NFS.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>IncrementTimeoutNFS</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>incrementTimeoutNFS — приріст часу, який додається за кожен Gi до ActiveDeadlineSeconds для Podʼа NFS scrubber.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PodTemplateFilePathHostPath</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>podTemplateFilePathHostPath — шлях до файлу з визначенням Podʼа, що використовується як шаблон для переробки постійного тому HostPath. Це лише для розробки та тестування і не працює в кластері з кількома вузлами.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>MinimumTimeoutHostPath</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>minimumTimeoutHostPath — мінімальний ActiveDeadlineSeconds для використання для Podʼа HostPath Recycler. Це лише для розробки та тестування і не працює в кластері з кількома вузлами.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>IncrementTimeoutHostPath</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>incrementTimeoutHostPath — приріст часу, який додається за кожен Gi до ActiveDeadlineSeconds для Podʼа HostPath scrubber. Це лише для розробки та тестування і не працює в кластері з кількома вузлами.</p>
            </td>
        </tr>
    </tbody>
</table>

## `PodGCControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

PodGCControllerConfiguration містить елементи, що описують PodGCController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>TerminatedPodGCThreshold</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>terminatedPodGCThreshold — кількість завершених Podʼів, які можуть існувати перед тим, як збирач сміття завершених почне видаляти завершені поди. Якщо &lt;= 0, збирач сміття завершених Podʼів вимкнено.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ReplicaSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

ReplicaSetControllerConfiguration містить елементи, що описують ReplicaSetController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentRSSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentRSSyncs — кількість replica set, які можуть синхронізуватися одночасно. Більше число = більш чутливе управління репліками, але більше завантаження на процесор (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `ReplicationControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

ReplicationControllerConfiguration містить елементи, що описують ReplicationController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentRCSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentRCSyncs — кількість контролерів реплікацій, які можуть синхронізуватися одночасно. Більше число = більш чутливе управління репліками, але більше завантаження на процесор (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `ResourceQuotaControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration}

**Зʼявляєтсья в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

ResourceQuotaControllerConfiguration містить елементи, що описують ResourceQuotaController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ResourceQuotaSyncPeriod</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td>
                <p>resourceQuotaSyncPeriod — період для синхронізації статусу використання квоти в системі.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ConcurrentResourceQuotaSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentResourceQuotaSyncs — кількість ресурсних квот, які можуть синхронізуватися одночасно. Більше число = більш чутливе управління квотами, але більше завантаження на процесор (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `SAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

SAControllerConfiguration містить елементи, що описують ServiceAccountController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ServiceAccountKeyFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>serviceAccountKeyFile — імʼя файлу, що містить PEM-кодований приватний RSA-ключ, який використовується для підписання токенів службовиї облікових записів.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>ConcurrentSATokenSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentSATokenSyncs — кількість операцій синхронізації токенів службових облікових записів які будуть виконуватись одночасно.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>RootCAFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>rootCAFile — кореневий сертифікат центру сертифікації, який буде включено у секрет токена службових облікових записів. Це має бути дійсний PEM-кодований CA пакет.</p>
            </td>
        </tr>
    </tbody>
</table>

## `StatefulSetControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

StatefulSetControllerConfiguration містить елементи, що описують StatefulSetController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentStatefulSetSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentStatefulSetSyncs — кількість обʼєктів StatefulSet, які дозволено синхронізувати одночасно. Більше число = більше чутливість statefulsets, але більше навантаження на ЦП (і мережу).</p>
            </td>
        </tr>
    </tbody>
</table>

## `TTLAfterFinishedControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

TTLAfterFinishedControllerConfiguration містить елементи, що описують TTLAfterFinishedController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentTTLSyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>concurrentTTLSyncs — кількість колекторів TTL-after-finished, які дозволено синхронізувати одночасно.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ValidatingAdmissionPolicyStatusControllerConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration}

**Зʼявляється в:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

ValidatingAdmissionPolicyStatusControllerConfiguration містить елементи, що описують ValidatingAdmissionPolicyStatusController.

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>ConcurrentPolicySyncs</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td>
                <p>ConcurrentPolicySyncs — кількість обʼєктів політики, які дозволено синхронізувати одночасно. Більша кількість = швидше перевірка типів, але більше навантаження на ЦП (і мережу). Стандартне значення — 5.</p>
            </td>
        </tr>
    </tbody>
</table>

## `VolumeConfiguration` {#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration}

**Зʼявляється в:**

- [PersistentVolumeBinderControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration)

VolumeConfiguration містить *усі* перераховані прапорці, призначені для конфігурації всіх втулків томів. З цієї конфігурації бінарний файл controller-manager створить багато екземплярів volume.VolumeConfig, кожен з яких містить лише конфігурацію, необхідну для конкретного втулка, які потім передаються відповідному втулку. Бінарний файл ControllerManager є єдиною частиною коду, яка знає, які втулки підтримуються і які прапорці відповідають кожному втулку.</p>

<table class="table">
    <thead>
        <tr>
            <th width="30%">Поле</th>
            <th>Опис</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>EnableHostPathProvisioning</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>enableHostPathProvisioning дозволяє створення PV HostPath при запуску без хмарного постачальника. Це дозволяє тестування та розробку функцій provisioning. HostPath provisioning не підтримується в жодному вигляді, не працює в кластері з кількома вузлами і не слід використовувати для нічого іншого, крім тестування або розробки.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>EnableDynamicProvisioning</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td>
                <p>enableDynamicProvisioning дозволяє створення томів при запуску в середовищі, яке підтримує динамічне створення. Стандартне значення — true.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>PersistentVolumeRecyclerConfiguration</code> <b>[Обовʼязкове]</b><br/>
                <a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration"><code>PersistentVolumeRecyclerConfiguration</code></a>
            </td>
            <td>
                <p>persistentVolumeRecyclerConfiguration містить конфігурацію для втулків persistent volume.</p>
            </td>
        </tr>
        <tr>
            <td>
                <code>FlexVolumePluginDir</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>volumePluginDir — це повний шлях до теки, в якій втулок flex volume має шукати додаткові сторонні втулки томів.</p>
            </td>
        </tr>
    </tbody>
</table>
