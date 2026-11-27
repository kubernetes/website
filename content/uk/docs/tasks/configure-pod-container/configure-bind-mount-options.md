---
title: Встановлення параметрів bind mount для монтування томів
content_type: task
weight: 216
min-kubernetes-server-version: v1.37
---

<!-- overview -->

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

Ця сторінка показує, як застосувати повʼязані з безпекою параметри bind mount (`noexec`, `nodev`, `nosuid`) до монтування томів у Podʼі.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Потрібно, щоб функціональну можливість [`VolumeBindMountOptions`](/docs/reference/command-line-tools-reference/feature-gates/#VolumeBindMountOptions) було увімкнено на API-сервері **і** на kubelet. Середовище виконання контейнерів також має підтримувати поле `mount_options` у повідомленні CRI `Mount`.

<!-- steps -->

## Створення Podʼа з параметрами bind mount {#create-pod}

Поле `.spec.containers[*].volumeMounts[*].bindMountOptions` приймає список прапорців bind mount. Допустимі значення: `noexec`, `nodev` та `nosuid`.

Наприклад, щоб змонтувати том emptyDir у `/tmp` з `noexec` і `nosuid`, щоб двійкові файли не можна було виконувати, а біти set-user-ID ігнорувалися:

{{% code_sample file="pods/bind-mount-options.yaml" %}}

1. Створіть Pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/bind-mount-options.yaml
   ```

1. Перевірте, що Pod працює:

   ```shell
   kubectl get pod bind-mount-options-demo
   ```

1. Перевірте параметри монтування тому:

   ```shell
   kubectl exec bind-mount-options-demo -- mount | grep /tmp
   ```

   Вивід повинен містити `noexec` та `nosuid` у параметрах монтування.

1. Перевірте, що виконати двійковий файл з цього монтування не вдається:

   ```shell
   kubectl exec bind-mount-options-demo -- sh -c 'cp /bin/ls /tmp/ls && /tmp/ls'
   ```

   Вивід подібний до такого:

   ```none
   sh: /tmp/ls: Permission denied
   ```

1. Видаліть Pod, який ви створили для цієї вправи:

   ```shell
   kubectl delete pod bind-mount-options-demo
   ```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [параметри bind mount](/docs/concepts/storage/volumes/#bind-mount-options) для томів
