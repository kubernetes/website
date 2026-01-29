---
title: Увімкнення або вимкнення функціональних можливостей
content_type: task
weight: 60
---

<!-- overview -->

На цій сторінці показано, як увімкнути або вимкнути функціональні можливості для керування певними функціями Kubernetes  у вашому кластері. Увімкнення функціональних можливостей дозволяє тестувати та використовувати функції Alpha або  Beta до того, як вони стануть загальнодоступними.

{{< note >}}
Деякі стабільні (GA) можливості також можна вимкнути, зазвичай через один мінорний реліз після GA; однак у цьому випадку ваш кластер може не відповідати вимогам Kubernetes.
{{< /note >}}

<!--
Зміни порівняно з оригінальною пропозицією PR:
- Додано примітку про наслідки для відповідності при вимкненні стабільних можливостей.
- Виправлено поведінку --help: всі компоненти показують всі можливості завдяки спільним визначенням.
- Уточнено, що не всі компоненти підтримують файли конфігурації (наприклад, kube-controller-manager).
- Вказано, що методи перевірки застосовуються до статичних розгортань kubeadm.
- Додано контекст про підхід kubeadm до розподіленої конфігурації.
-->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам також потрібно:

* Адміністративний доступ до вашого кластера
* Знання про те, яку функцію ви хочете увімкнути (див. [Довідку про функціональні можливості] (/docs/reference/command-line-tools-reference/feature-gates/))

{{< note >}}
Загально доступні функції (GA) є завжди стандартно увімкненими. Зазвичай ви налаштовуєте можливості для функцій Alpha або Beta.
{{< /note >}}

<!-- steps -->

## Understand feature gate maturity {#understand-feature-gate-maturity}

Перед увімкненням функціональної можливості перевірте [довідку про функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) щодо рівня зрілості функції:

* **Альфа**: стандартно вимкнена, може містити помилки. Використовуйте тільки в тестових кластерах.
* **Бета**: зазвичай стандартно увімкнена, добре протестована.
* **GA**: завжди стандартно увімкнена; іноді може бути вимкнена для одного випуску після GA.

## Визначте, які компоненти вимагають використання функціональної можливості {#identify-which-components-need-the-feature gate}

Різні функціональні можливості впливають на різні компоненти Kubernetes:

* Деякі функції вимагають увімкнення можливості на **декількох компонентах** (наприклад, API-сервері та менеджері контролерів)
* Інші функції вимагають увімкнення можливості лише на **одному компоненті** (наприклад, лише kubelet)

У [довідці про функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) зазвичай вказано, на які компоненти впливає кожна функція. Усі компоненти Kubernetes мають однакові визначення функціональних можливостей, тому всі функції відображаються у вікні довідки, але на поведінку кожного компонента впливають лише відповідні функції.

## Конфігурація {#configuration}

### Під час ініціалізації кластера {#during-cluster-initialization}

Створіть файл конфігурації, щоб увімкнути функціональні можливості для відповідних компонентів:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    feature-gates: "FeatureName=true"
controllerManager:
  extraArgs:
    feature-gates: "FeatureName=true"
scheduler:
  extraArgs:
    feature-gates: "FeatureName=true"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  FeatureName: true
```

Ініціалізуйте кластер:

```shell
kubeadm init --config kubeadm-config.yaml
```

### На наявному кластері {#on-an-existing-cluster}

Для кластерів kubeadm конфігурацію функціональних можливостей можна налаштувати в декількох місцях, включаючи файли маніфесту, файли конфігурації та конфігурацію kubeadm.

Відредагуйте маніфести компонентів панелі управління в `/etc/kubernetes/manifests/`:

1. Для kube-apiserver, kube-controller-manager або kube-scheduler додайте прапорець до команди:

   ```yaml
   spec:
     containers:
     - command:
       - kube-apiserver
       - --feature-gates=FeatureName=true
       # ... інші прапорці
   ```

   Збережіть файл. Pod автоматично перезапуститься.

2. Для kubelet, відредагуйте `/var/lib/kubelet/config.yaml`:

   ```yaml
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   featureGates:
     FeatureName: true
   ```

   Перезапустіть kubelet:

   ```shell
   sudo systemctl restart kubelet
   ```

3. Для kube-proxy, змініть ConfigMap:

   ```shell
   kubectl -n kube-system edit configmap kube-proxy
   ```

   Додайте функціональні можливості до конфігурації:

   ```yaml
   featureGates:
     FeatureName: true
   ```

   Перезапустіть DaemonSet:

   ```shell
   kubectl -n kube-system rollout restart daemonset kube-proxy
   ```

## Налаштування декількох функціональних можливостей {#configure-multiple-feature-gates}

Використовуйте списки, розділені комами, для прапорців командного рядка:

```shell
--feature-gates=FeatureA=true,FeatureB=false,FeatureC=true
```

Для компонентів, що підтримують файли конфігурації (kubelet, kube-proxy):

```yaml
featureGates:
  FeatureA: true
  FeatureB: false
  FeatureC: true
```

{{< note >}}
У кластерах kubeadm компоненти панелі управління (kube-apiserver, kube-controller-manager та kube-scheduler) зазвичай налаштовуються за допомогою прапорців командного рядка в їх маніфестах статичних подів, розташованих у `/etc/kubernetes/manifests/`. Хоча ці компоненти підтримують файли конфігурації за допомогою прапорця `--config`, kubeadm в основному використовує прапорці командного рядка.
{{< /note >}}

<!-- discussion -->

## Перевірка конфігурації функціональних можливостей {#verify-feature-gate-configuration}

Після налаштування перевірте, чи функціональні можливості активні. Наступні методи застосовуються до кластерів kubeadm, де компоненти панелі управління працюють як статичні поди.

### Перевірка маніфестів компонентів панелі управління {#check-control-plane-manifests}

Перегляньте функціональні можливості, налаштовані в маніфесті статичного пода:

```shell
kubectl -n kube-system get pod kube-apiserver-<node-name> -o yaml | grep feature-gates
```

### Перевірка конфігурації kubelet {#check-kubelet-configuration}

Використовуйте точку доступу configz kubelet:

```shell
kubectl proxy --port=8001 &
curl -sSL «http://localhost:8001/api/v1/nodes/<node-name>/proxy/configz» | grep featureGates -A 5
```

Або перевірте файл конфігурації безпосередньо на вузлі:

```shell
cat /var/lib/kubelet/config.yaml | grep -A 10 featureGates
```

### Перевірка через точку доступу метрик {#check-via-metrics-endpoint}

Статус функціональної можливості виводиться в метриках у стилі Prometheus компонентами Kubernetes
(доступно в Kubernetes 1.26+). Запитайте точку доступу метрик, щоб перевірити, які функціональні можливості
включені:

```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled
```

Щоб перевірити конкретну функціональну можливість:

```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep FeatureName
```

Метрика показує `1` для увімкнених можливостей і `0` для вимкнених можливостей.

{{< note >}}
У кластерах kubeadm перевірте всі відповідні місця, де можуть бути налаштовані функціональні можливості, оскільки конфігурація розподілена між декількома файлами та місцями.
{{< /note >}}

### Перевірка через точку доступу /flagz {#check-via-flagz-endpoint}

Якщо ви маєте доступ до точок доступу для налагодження компонента і для цього компонента ввімкнено функціональну можливість `ComponentFlagz`, ви можете перевірити прапорці командного рядка, які використовувалися для запуску компонента, відвідавши точку доступу `/flagz`. Функціональні можливості, налаштовані за допомогою прапорців командного рядка, відображаються в цьому виводі.

Точка доступу `/flagz` є частиною Kubernetes *z-pages*, які надають зрозумілу для людини інформацію про налагодження під час виконання для основних компонентів.

Для отримання додаткової інформації див. [документацію z-pages](/docs/reference/instrumentation/zpages/).

## Розуміння вимог до конкретних компонентів {#understanding-component-specific-requirements}

Деякі приклади функціональних можливостей, специфічних для компонентів:

* **Орієнтовані на API-сервер**: такі функції, як `StructuredAuthenticationConfiguration`, в першу чергу впливають на kube-apiserver
* **Орієнтовані на Kubelet**: такі функції, як `GracefulNodeShutdown`, в першу чергу впливають на kubelet
* **Кілька компонентів**: деякі функції вимагають координації між компонентами

{{< caution >}}
Якщо для функції потрібно кілька компонентів, необхідно ввімкнути можливість на всіх відповідних компонентах. Увімкнення можливості лише на деяких компонентах може призвести до несподіваної поведінки або помилок.
{{< /caution >}}

Завжди спочатку тестуйте функціональні можливості на тестових середовищах. Функції Alpha можуть бути видалені без попередження.

## {{% heading "whatsnext" %}}

* Прочитайте [довідку про функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/)
* Дізнайтеся про [стадії функцій](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
* Перегляньте [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/)
