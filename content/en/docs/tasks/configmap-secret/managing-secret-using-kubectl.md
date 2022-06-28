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
create a Secret that stores the username `admin` and the password `VLc5@#tym$HzBn@8`.

{{< tabs name="Secret data" >}}
{{% tab name="Raw data" %}}

Run the following command:

```shell
kubectl create secret generic database-creds \
    --from-literal='username=admin' \
    --from-literal='password=VLc5@#tym$HzBn@8'
```
You must use single quotes `''` to escape special characters such as `$`, `\`,
`*`, `=`, and `!` in your strings. If you don't, your shell will interpret these
characters.


{{% /tab %}}
{{% tab name="Files" %}}
1.  Store the credentials in files with the values encoded in base64:

    ```shell
    echo -n 'admin' | base64 > ./username.txt
    echo -n 'VLc5@#tym$HzBn@8' | base64 > ./password.txt
    ```
    The `-n` flag ensures that there's no newline character at the end of your
    files. You do not need to escape special characters in strings that you include in a file.

2.  Pass the file paths in the `kubectl` command:

    ```shell
    kubectl create secret generic database-creds \
        --from-file=./username.txt \
        --from-file=./password.txt
    ```
    The default key name for the values that you pass in the command is the file
    name. If you want to specify your own key name, use
    `--from-file=key=source`. For example:

    ```shell
    kubectl create secret generic db-user-pass \
        --from-file=username=./username.txt \
        --from-file=password=./password.txt
    ```
{{% /tab %}}
{{< /tabs >}}

The output is similar to:

```
secret/database-creds created
```

### Verify the Secret {#verify-the-secret}

Check that the Secret was created:

```shell
kubectl get secrets
```

The output is similar to:

```
NAME                  TYPE             DATA      AGE
database-creds        Opaque           2         51s
```

View the details of the Secret:

```shell
kubectl describe secret database-creds
```

The output is similar to:

```
Name:            database-creds
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    16 bytes
username:    5 bytes
```

The commands `kubectl get` and `kubectl describe` avoid showing the contents
of a `Secret` by default. This is to protect the `Secret` from being exposed
accidentally, or from being stored in a terminal log.

### Decode the Secret  {#decoding-secret}

1.  View the data stored in the Secret:

    ```shell
    kubectl get secret database-creds -o jsonpath='{.data}'
    ```

    The output is similar to:

    ```json
    {"password":"VkxjNUAjdHltJEh6Qm5AOA==","username":"YWRtaW4="}
    ```

1.  Decode the `password` data:

    ```shell
    echo 'VkxjNUAjdHltJEh6Qm5AOA==' | base64 --decode
    ```

    The output is similar to:

    ```
    VLc5@#tym$HzBn@8%
    ```

    {{<caution>}}This is an example for documentation purposes. In practice,
    this method could cause the command with the encoded data to be stored in
    your shell history. Anyone with access to your computer could find the
    command and decode the secret. A better approach is to combine the view and
    decode commands.{{</caution>}}

    ```shell
    kubectl get secret database-creds -o jsonpath='{.data.password}' | base64 --decode
    ```

## Edit a Secret {#edit-secret}

You can edit an existing `Secret` object unless it is
[immutable](/docs/concepts/configuration/secret/#secret-immutable). To edit a
Secret, run the following command:

```shell
kubectl edit secrets <secret-name>
```

This opens your default editor and allows you to update the base64 encoded
Secret values in the `data` field, such as in the following example:

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  password: VkxjNUAjdHltJEh6Qm5AOA==
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: database-creds
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## Delete a Secret {#clean-up}

To delete a Secret, run the following command:

```shell
kubectl delete secret <secret-name>
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using config files](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
