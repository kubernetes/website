---
title: Встановлення параметрів bind mount для монтування томів
content_type: task
weight: 216
min-kubernetes-server-version: v1.37
---

<!-- overview -->

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

Ця сторінка показує, як застосувати повʼязані з безпекою параметри bind mount (`noexec`, `nodev`, `nosuid`) до монтування томів у Podʼі.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібно, щоб функціональна можливість [`VolumeBindMountOptions`](/docs/reference/command-line-tools-reference/feature-gates/#VolumeBindMountOptions) була увімкнена на API-сервері **та** на kubelet. Середовище виконання контейнерів також повинно підтримувати поле `mount_options` у повідомленні CRI `Mount`.

<!-- steps -->

## Створення Podʼа з параметрами bind mount {#create-pod}

Поле `.spec.containers[*].volumeMounts[*].bindMountOptions` приймає список прапорців bind mount. Допустимі значення: `noexec`, `nodev` та `nosuid`.

Наприклад, щоб змонтувати том emptyDir у `/tmp` з `noexec` та `nosuid` так, щоб двійкові файли не можна було виконувати, а біти set-user-ID ігнорувалися:

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

1. Перевірте, що виконання двійкового файлу на цьому монтуванні зазнає невдачі:

   ```shell
   kubectl exec bind-mount-options-demo -- sh -c 'cp /bin/ls /tmp/ls && /tmp/ls'
   ```

   Вивід подібний до:

   ```none
   sh: /tmp/ls: Permission denied
   ```

1. Видаліть Pod, який ви створили для цієї вправи:

   ```shell
   kubectl delete pod bind-mount-options-demo
   ```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [параметри bind mount](/docs/concepts/storage/volumes/#bind-mount-options) для томів
