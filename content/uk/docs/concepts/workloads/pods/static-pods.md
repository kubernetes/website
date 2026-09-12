---
title: "Статичні Podʼи"
content_type: concept
weight: 150
---

Статичні Podʼи (_Static Pods_) керуються безпосередньо демоном kubelet на конкретному вузлі, без спостереження за ними з боку {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. На відміну від Podʼів, які керуються панеллю управління (наприклад, {{< glossary_tooltip text="Deployment" term_id="deployment" >}}), kubelet стежить за кожним статичним Podʼом і перезапускає його у разі збою.

Статичні Podʼи завжди привʼязані до одного {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} на конкретному вузлі.

Основне призначення статичних Podів — запуск самостійно розміщеної панелі управління: іншими словами, використання kubelet для контролю окремих [компонентів панелі управління](/docs/concepts/overview/components/#control-plane-components). Наприклад, [kubeadm](/docs/reference/setup-tools/kubeadm/) використовує статичні Podʼи для запуску `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `etcd` на вузлах панелі управління.

{{< note >}}
Якщо ваш кластер запускає компоненти панелі управління як Podʼи, вони, ймовірно, є статичними Podʼами. Ви можете розпізнати їхні дзеркальні Podʼи в просторі імен `kube-system` за анотацією `kubernetes.io/config.mirror`.
{{< /note >}}

## Дзеркальні Podʼи {#mirror-pods}

Kubelet автоматично намагається створити {{< glossary_tooltip text="дзеркальний Pod" term_id="mirror-pod" >}} на сервері API Kubernetes для кожного статичного Podʼа. Це означає, що Podʼи, що працюють на вузлі, видимі на сервері API, але не можуть бути керовані звідти. До назв Podів буде додано імʼя хоста вузла з дефісом перед ним.

Kubelet передає {{< glossary_tooltip text="мітки" term_id="label" >}} зі статичного Podʼа до дзеркального Podʼа. Ви можете використовувати ці мітки як зазвичай через {{< glossary_tooltip text="селектори" term_id="selector" >}}.

Якщо ви спробуєте використати `kubectl` для видалення дзеркального Podʼа з сервера API, kubelet _не_ видалить статичний Pod. Kubelet відтворить дзеркальний Pod.

## Обмеження {#limitations}

Специфікація статичного Podʼа не може посилатися на інші обʼєкти API, такі як {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}, {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, або {{< glossary_tooltip text="Secret" term_id="secret" >}}.

Статичні Podʼи не підтримують [ефемерні контейнери](/docs/concepts/workloads/pods/ephemeral-containers/).

## Статичні Podʼи чи DaemonSets {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
Якщо ви запускаєте кластер Kubernetes і використовуєте статичні Podʼи для запуску Podʼів на кожному вузлі, вам, ймовірно, слід використовувати {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.

Статичні Podʼи не керуються панеллю управління, тому їх не можна розгортати, відкатувати або масштабувати за допомогою стандартних механізмів Kubernetes. DaemonSet надає ці можливості і є рекомендованим підходом для запуску робочих навантажень на рівні вузла.

Статичні Podʼи запускаються kubelet до того, як API сервер стане доступним, що робить їх придатними для ініціалізації компонентів панелі управління. DaemonSet вимагає працюючої панелі управління.

## {{% heading "whatsnext" %}}

- Дізнайтеся, як [створювати статичні Podʼи](/docs/tasks/configure-pod-container/static-pod/).
- Дізнайтеся про [компоненти Kubernetes](/docs/concepts/overview/components/) та як панель управління використовує статичні Podʼи.
- Дізнайтеся про [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) як альтернативу статичним Podʼам.
