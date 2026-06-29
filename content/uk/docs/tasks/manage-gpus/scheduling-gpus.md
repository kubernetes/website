---
content_type: concept
title: Планування GPU
description: Налаштування та планування GPU для використання як ресурсу вузлів у кластері.
weight: 170
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

Kubernetes має **стабільну** підтримку для управління графічними обчислювальними пристроями (GPU) від AMD та NVIDIA на різних вузлах вашого кластера, використовуючи {{< glossary_tooltip text="втулки пристроїв" term_id="device-plugin" >}}.

На цій сторінці описано, як користувачі можуть використовувати GPU і наведені деякі обмеження в реалізації.

<!-- body -->

## Використання втулків пристроїв {#using-device-plugins}

Kubernetes використовує втулки пристроїв, щоб дозволити Podʼам отримувати доступ до спеціалізованих апаратних можливостей, таких як GPU.

{{% thirdparty-content %}}

Як адміністратору, вам потрібно встановити драйвери GPU від відповідного виробника обладнання на вузлах і запустити відповідний втулок пристрою від виробника GPU. Ось кілька посилань на інструкції від виробників:

* [AMD](https://github.com/ROCm/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)

Після встановлення втулка ваш кластер використовує власний ресурс планування, такий як `amd.com/gpu` або `nvidia.com/gpu`.

Ви можете використовувати ці GPU у ваших контейнерах, запитуючи власний ресурс GPU,, так само як ви запитуєте `cpu` чи `memory`.
Однак є обмеження у специфікації вимог до ресурсів для власних пристроїв.

GPU повинні бути вказані тільки в розділі `limits`, що означає:

* Ви можете вказати `limits` для GPU без вказівки `requests`, оскільки Kubernetes за стандартно використовує ліміт як значення запиту.
* Ви можете вказати GPU як в `limits`, так і в `requests`, але ці два значення повинні бути рівними.
* Ви не можете вказати `requests` для GPU без вказівки `limits`.

Ось приклад маніфесту для Podʼі, який запитує GPU:

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

## Керуйте кластерами з різними типами GPU {#managing-clusters-with-different-types-of-gpus}

Якщо в різних вузлах вашого кластера є різні типи GPU, то ви можете використовувати [мітки вузлів і селектори вузлів](/docs/tasks/configure-pod-container/assign-pods-nodes/) для планування Podʼів на відповідних вузлах.

Наприклад:

```shell
# Позначте свої вузли з типом прискорювача, яким вони володіють.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

Ця мітка ключа `accelerator` лише приклад; ви можете використовувати інший ключ мітки, якщо це зручніше.

## Автоматичне позначення вузлів {#node-labelling}

Як адміністратор, ви можете автоматично виявляти та мітити всі ваши вузли з підтримкою GPU, розгорнувши [Виявлення функцій вузлів Kubernetes](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD). NFD виявляє апаратні функції, які доступні на кожному вузлі в кластері Kubernetes. Зазвичай NFD налаштовується таким чином, щоб оголошувати ці функції як мітки вузла, але NFD також може додавати розширені ресурси, анотації та заплямування вузла (node taints). NFD сумісний з усіма [підтримуваними версіями](/releases/version-skew-policy/#supported-versions) Kubernetes. Типово NFD створює [мітки функцій](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html) для виявлених функцій. Адміністратори можуть використовувати NFD, щоб також мітити вузли конкретними функціями, щоб на них можна було планувати лише Podʼи, які запитують ці функції.

Вам також потрібен втулок для NFD, який додає відповідні мітки до ваших вузлів; це можуть бути загальні мітки або вони можуть бути вендор-специфічними. Ваш вендор GPU може надати втулок від третіх сторін для NFD; перевірте їх документацію для отримання додаткової інформації.

{{< highlight yaml "linenos=false,hl_lines=6-18" >}}
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  # Виможете використовувати Kubernetes node affinity для планування цього Podʼа на вузол
  # який надає kind типу GPU, який потрібе його контейнеру для роботи
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt # (greater than)
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # NFD Feature label
            values: ["true"] # (optional) only schedule on nodes with PCI device 10
  restartPolicy: OnFailure
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # запит 1 GPU
{{< /highlight >}}

#### Вендори GPU {#gpu-vendor-implementations}

* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)
