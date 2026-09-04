---
title: Встановлення прав доступу на том emptyDir
content_type: task
weight: 215
min-kubernetes-server-version: v1.37
---

<!-- overview -->

{{< feature-state feature_gate_name="EmptyDirVolumeMode" >}}

Ця сторінка показує, як встановити біти прав доступу Unix на теці тому `emptyDir` за допомогою поля `mode`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібно, щоб функціональна можливість [`EmptyDirVolumeMode`](/docs/reference/command-line-tools-reference/feature-gates/#EmptyDirVolumeMode) була увімкнена на API-сервері **та** на kubelet.

<!-- steps -->

## Створення Podʼа, який використовує том emptyDir з власними правами доступу {#create-pod}

Поле `emptyDir.mode` дозволяє встановити біти прав доступу Unix (від `0000` до `01777` у вісімковій системі) на теці тому. Якщо не вказано, тека створюється зі стандартними правами `0777`.

Наприклад, щоб створити спільну теку `/tmp` зі встановленим sticky bit так, щоб лише власники файлів могли видаляти власні файли:

{{% code_sample file="pods/emptydir-volume-mode.yaml" %}}

1. Створіть Pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/emptydir-volume-mode.yaml
   ```

1. Перевірте, що Pod працює:

   ```shell
   kubectl get pod emptydir-mode-demo
   ```

1. Перевірте права доступу на змонтованому томі:

   ```shell
   kubectl exec emptydir-mode-demo -- ls -ld /tmp
   ```

   Вивід подібний до:

   ```none
   drwxrwxrwt 2 root root 4096 Jul 28 00:00 /tmp
   ```

   `t` наприкінці підтверджує, що sticky bit встановлено.

1. Видаліть Pod, який ви створили для цієї вправи:

   ```shell
   kubectl delete pod emptydir-mode-demo
   ```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [томи `emptyDir`](/docs/concepts/storage/volumes/#emptydir)
