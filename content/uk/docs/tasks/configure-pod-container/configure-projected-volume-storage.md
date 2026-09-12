---
title: Налаштування Pod для використання projected тому для зберігання
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка показує, як використовувати [`projected`](/docs/concepts/storage/volumes/#projected) том, щоб змонтувати декілька наявних джерел томів у одну теку. Наразі можна проєктувати томи типів `secret`, `configMap`, `downwardAPI`, та `serviceAccountToken`.

{{< note >}}
`serviceAccountToken` не є типом тому.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Налаштування projected тому для Pod {#configure-a-projected-volume-for-a-pod}

У цьому завданні ви створите {{< glossary_tooltip text="Secrets" term_id="secret" >}} із локальних файлів для імені користувача та пароля. Потім ви створите Pod, який запускає один контейнер, використовуючи [`projected`](/docs/concepts/storage/volumes/#projected) том для монтування секретів у спільну теку.

Ось файл конфігурації для Pod:

{{% code_sample file="pods/storage/projected.yaml" %}}

1. Створіть Secrets:

    ```shell
    # Створіть файли, що містять імʼя користувача та пароль:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Запакуйте ці файли у секрети:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```

2. Створіть Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```

3. Перевірте, що контейнер Pod запущено, а потім слідкуйте за змінами в Podʼі:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```

    Вивід буде виглядати так:

    ```none
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```

4. В іншому терміналі отримайте оболонку до запущеного контейнера:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```

5. У вашій оболонці перевірте, що тека `projected-volume` містить ваші projected джерела:

    ```shell
    ls /projected-volume/
    ```

## Очищення {#clean-up}

Видаліть Pod та Secrets:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [`projected`](/docs/concepts/storage/volumes/#projected) томи.
* Прочитайте документ про проєктування [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).
