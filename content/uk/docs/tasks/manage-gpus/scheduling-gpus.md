---
content_type: concept
title: Планування GPU
description: Налаштування та планування GPU для використання як ресурсу вузлів у кластері.
weight: 170
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

Kubernetes містить **стабільну** підтримку керування GPU (графічними процесорами) AMD і NVIDIA на різних вузлах вашого кластера за допомогою {{< glossary_tooltip text="втулків пристроїв" term_id="device-plugin" >}}.

На цій сторінці описано, як користувачі можуть використовувати GPU, і наведено деякі обмеження реалізації.

<!-- body -->

## Використання втулків пристроїв {#using-device-plugins}

Kubernetes реалізує втулки пристроїв, щоб надати Podʼам доступ до спеціалізованих апаратних можливостей, таких як GPU.

{{% thirdparty-content %}}

Як адміністратору вам потрібно встановити на вузлах драйвери GPU від відповідного постачальника обладнання й запустити відповідний втулок пристроїв від постачальника GPU. Ось кілька посилань на інструкції постачальників:

* [AMD](https://github.com/ROCm/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)

Після встановлення втулка ваш кластер надає власний ресурс, придатний для планування, наприклад `amd.com/gpu` або `nvidia.com/gpu`.

Ви можете використовувати ці GPU у своїх контейнерах, запитуючи власний ресурс GPU так само, як ви запитуєте `cpu` чи `memory`. Однак є деякі обмеження щодо того, як вказувати вимоги до ресурсів для власних пристроїв.

GPU слід вказувати лише в розділі `limits`, що означає:

* Ви можете вказати `limits` для GPU без `requests`, оскільки Kubernetes стандартно використовує обмеження як значення запиту.
* Ви можете вказати GPU і в `limits`, і в `requests`, але ці два значення мають бути однаковими.
* Ви не можете вказати `requests` для GPU без `limits`.

Ось приклад маніфесту для Podʼа, який запитує GPU:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # запит на 1 GPU
```

## Керування кластерами з різними типами GPU {#manage-clusters-with-different-types-of-gpus}

Якщо різні вузли вашого кластера мають різні типи GPU, ви можете використовувати [мітки вузлів і селектори вузлів](/docs/tasks/configure-pod-container/assign-pods-nodes/) для планування Podʼів на відповідні вузли.

Наприклад:

```shell
# Додайте вузлам мітки з типом прискорювача, який вони мають.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

Ключ мітки `accelerator` — лише приклад; за бажання ви можете використовувати інший ключ мітки.

## Автоматичне додавання міток вузлам {#node-labeller}

Як адміністратор ви можете автоматично виявляти всі вузли з підтримкою GPU й додавати їм мітки, розгорнувши Kubernetes [Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD). NFD виявляє апаратні можливості, доступні на кожному вузлі кластера Kubernetes. Зазвичай NFD налаштовують оголошувати ці можливості як мітки вузлів, але NFD також може додавати розширені ресурси, анотації та taints вузлів. NFD сумісний з усіма [підтримуваними версіями](/releases/version-skew-policy/#supported-versions) Kubernetes. Стандартно NFD створює [мітки можливостей](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html) для виявлених можливостей. Адміністратори також можуть використовувати NFD, щоб додавати taints вузлам із певними можливостями, і тоді на цих вузлах можна буде планувати лише Podʼи, що запитують ці можливості.

Вам також потрібен втулок для NFD, який додає відповідні мітки вашим вузлам; це можуть бути загальні мітки або мітки конкретного постачальника. Ваш постачальник GPU може надавати сторонній втулок для NFD; докладніше дивіться в його документації.

{{< highlight yaml "linenos=false,hl_lines=7-18" >}}
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  # Ви можете використовувати спорідненість вузлів Kubernetes, щоб запланувати цей Pod на вузол,
  # який надає тип GPU, потрібний його контейнеру для роботи
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt # (більше ніж)
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # мітка можливості NFD
            values: ["true"] # (необовʼязково) планувати лише на вузли з пристроєм PCI 10
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # запит на 1 GPU
{{< /highlight >}}

#### Реалізації постачальників GPU {#gpu-vendor-implementations}

* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)
