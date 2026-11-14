---
title: Використання тому image у Podʼі
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
---

<!-- overview -->

{{< feature-state feature_gate_name="ImageVolume" >}}

Ця сторінка показує, як налаштувати Pod з томами image. Це дає змогу монтувати вміст з OCI-реєстрів у контейнерах.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- Середовище виконання контейнерів має підтримувати можливість томів image
- Вам потрібно виконувати команди на хості
- Вам потрібно мати змогу виконувати команди в Podʼах (exec)

<!-- steps -->

## Запуск Podʼа, що використовує том image {#create-pod}

Том image для Podʼа вмикається встановленням поля `volumes[*].image` у `.spec` на коректне посилання й використанням його у `volumeMounts` контейнера. Наприклад:

{{% code_sample file="pods/image-volumes.yaml" %}}

1. Створіть Pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

1. Приєднайтесь до контейнера:

   ```shell
   kubectl exec image-volume -it -- bash
   ```

1. Перевірте вміст файлу в томі:

   ```shell
   cat /volume/dir/file
   ```

   Вивід подібний до такого:

   ```none
   1
   ```

   Також можна перевірити інший файл за іншим шляхом:

   ```shell
   cat /volume/file
   ```

   Вивід подібний до такого:

   ```none
   2
   ```

## Використання `subPath` (або `subPathExpr`) {#use-subpath-or-subpathexpr}

Починаючи з Kubernetes v1.33, з можливістю томів image можна використовувати [`subPath`](/docs/concepts/storage/volumes/#using-subpath) або [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment).

{{% code_sample file="pods/image-volumes-subpath.yaml" %}}

1. Створіть Pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes-subpath.yaml
   ```

1. Приєднайтесь до контейнера:

   ```shell
   kubectl exec image-volume -it -- bash
   ```

1. Перевірте вміст файлу з підшляху `dir` у томі:

   ```shell
   cat /volume/file
   ```

   Вивід подібний до такого:

   ```none
   1
   ```

## Додаткова інформація {#further-reading}

- [Томи `image`](/docs/concepts/storage/volumes/#image)
