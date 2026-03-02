---
title: Використання тому Image в Pod
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
---

<!-- overview -->

{{< feature-state feature_gate_name="ImageVolume" >}}

Ця сторінка демонструє, як налаштувати Pod для використання томів image. Це дозволяє монтувати вміст з OCI реєстрів всередині контейнерів.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- Середовище виконання контейнерів має підтримувати функцію томів image.
- Вам потрібно мати можливість виконувати команди на хості.
- Вам потрібно мати можливість підключатися до pod.
- Вам потрібно увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `ImageVolume`.

<!-- steps -->

## Запуск Podʼа, що використовує том image {#create-pod}

Том image для Podʼа активується шляхом налаштування поля `volumes[*].image` у `.spec` на дійсне посилання та використання його в `volumeMounts` контейнера. Наприклад:

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

   Вивід буде подібний до:

   ```shell
   1
   ```

   Ви також можете перевірити інший файл з іншим шляхом:

   ```shell
   cat /volume/file
   ```

   Вивід буде подібний до:

   ```shell
   2
   ```

## Використання `subPath` (або `subPathExpr`) {#use-subpath-or-subpathexpr}

В Kubernetes v1.33 можливо використовувати [`subPath`](/docs/concepts/storage/volumes/#using-subpath) або [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) під час використання функціоналу тому образу.

{{% code_sample file="pods/image-volumes-subpath.yaml" %}}

1. Створіть pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes-subpath.yaml
   ```

2. Приєднайтесь до контейнера:

   ```shell
   kubectl exec image-volume -it -- bash
   ```

3. Перевірте вміст фала з шляху `dir` у томі:

   ```shell
   cat /volume/file
   ```

   Вивід буде подібним до:

   ```none
   1
   ```

## Додатково {#further-reading}

- [Томи `image`](/docs/concepts/storage/volumes/#image)
