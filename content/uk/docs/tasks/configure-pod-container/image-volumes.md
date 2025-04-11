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

Том image для Podʼа активується шляхом налаштування поля `volumes.[*].image` у `.spec` на дійсне посилання та використання його в `volumeMounts` контейнера. Наприклад:

{{% code_sample file="pods/image-volumes.yaml" %}}

1. Створіть Pod у вашому кластері:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

1. Приєднайтесь до контейнера:

   ```shell
   kubectl attach -it image-volume bash
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

## Додатково {#further-reading}

- [Томи `image`](/docs/concepts/storage/volumes/#image)
