---
title: Налаштування Podʼа для використання проєкційного тому як сховища
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка показує, як використовувати проєкційний том ([`projected`](/docs/concepts/storage/volumes/#projected)), щоб змонтувати кілька наявних джерел томів в одну теку. Наразі можна проєктувати томи `secret`, `configMap`, `downwardAPI` і `serviceAccountToken`.

{{< note >}}
`serviceAccountToken` не є типом тому.
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Налаштування проєкційного тому для Podʼа {#configure-a-projected-volume-for-a-pod}

У цій вправі ви створюєте {{< glossary_tooltip text="Secret" term_id="secret" >}} з імʼям користувача та паролем із локальних файлів. Потім ви створюєте Pod з одним контейнером, який використовує проєкційний том ([`projected`](/docs/concepts/storage/volumes/#projected)) для монтування Secret в одну спільну теку.

Ось файл конфігурації Podʼа:

{{% code_sample file="pods/storage/projected.yaml" %}}

1. Створіть Secret:

    ```shell
    # Створіть файли, що містять імʼя користувача та пароль:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Запакуйте ці файли в Secret:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```

1. Створіть Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```

1. Перевірте, що контейнер Podʼа працює, а потім стежте за змінами Podʼа:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```

    Вивід виглядає так:

    ```
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```

1. В іншому терміналі отримайте доступ до оболонки запущеного контейнера:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```

1. У своїй оболонці перевірте, що тека `projected-volume` містить ваші джерела, що проєктуються:

    ```shell
    ls /projected-volume/
    ```

## Очищення {#clean-up}

Видаліть Pod і Secret:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про проєкційні томи ([`projected`](/docs/concepts/storage/volumes/#projected)).
* Прочитайте проєктний документ [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).
