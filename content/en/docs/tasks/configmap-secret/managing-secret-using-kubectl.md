---
title: Managing Secrets using kubectl
content_type: task
weight: 10
description: Creating Secret objects using kubectl command line.
---

<!-- overview -->

This page shows you how to create, edit, manage, and delete Kubernetes
{{<glossary_tooltip text="Secrets" term_id="secret">}} using the `kubectl`
command-line tool.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create a Secret

A `Secret` object stores sensitive data such as credentials
used by Pods to access services. For example, you might need a Secret to store
the username and password needed to access a database.

You can create the Secret by passing the raw data in the command, or by storing
the credentials in files that you pass in the command. The following commands
create a Secret that stores the username `admin` and the password `S!B\*d$zDsb=`.

### Use raw data

Run the following command:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=devuser \
    --from-literal=password='S!B\*d$zDsb='
```
You must use single quotes `''` to escape special characters such as `$`, `\`,
`*`, `=`, and `!` in your strings. If you don't, your shell will interpret these
characters.

### Use source files

1.  Store the credentials in files with the values encoded in base64:

    ```shell
    echo -n 'admin' | base64 > ./username.txt
    echo -n 'S!B\*d$zDsb=' | base64 > ./password.txt
    ```
    The `-n` flag ensures that the generated files do not have an extra newline
    character at the end of the text. This is important because when `kubectl`
    reads a file and encodes the content into a base64 string, the extra
    newline character gets encoded too. You do not need to escape special
    characters in strings that you include in a file.

1.  Pass the file paths in the `kubectl` command:

    ```shell
    kubectl create secret generic db-user-pass \
        --from-file=./username.txt \
        --from-file=./password.txt
    ```
    The default key name is the file name. You can optionally set the key name
    using `--from-file=[key=]source`. For example:

    ```shell
    kubectl create secret generic db-user-pass \
        --from-file=username=./username.txt \
        --from-file=password=./password.txt
    ```

With either method, the output is similar to:

```
secret/db-user-pass created
```

### Verify the Secret {#verify-the-secret}

Check that the Secret was created:

```shell
kubectl get secrets
```

The output is similar to:

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

View the details of the Secret:

```shell
kubectl describe secret db-user-pass
```

The output is similar to:

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

The commands `kubectl get` and `kubectl describe` avoid showing the contents
of a `Secret` by default. This is to protect the `Secret` from being exposed
accidentally, or from being stored in a terminal log.

### Decode the Secret  {#decoding-secret}

1.  View the contents of the Secret you created:

    ```shell
    kubectl get secret db-user-pass -o jsonpath='{.data}'
    ```

    The output is similar to:

    ```json
    {"password":"UyFCXCpkJHpEc2I9","username":"YWRtaW4="}
    ```

1.  Decode the `password` data:

    ```shell
    echo 'UyFCXCpkJHpEc2I9' | base64 --decode
    ```

    The output is similar to:

    ```
    S!B\*d$zDsb=
    ```

    {{<caution>}}This is an example for documentation purposes. In practice,
    this method could cause the command with the encoded data to be stored in
    your shell history. Anyone with access to your computer could find the
    command and decode the secret. A better approach is to combine the view and
    decode commands.{{</caution>}}

    ```shell
    kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
    ```



In order to avoid storing a secret encoded value in your shell history, you can
run the following command:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
```

The output shall be similar as above.

## Clean Up

Delete the Secret you created:

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using config files](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
