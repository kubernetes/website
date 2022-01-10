---
title: Managing Secrets using kubectl
content_type: task
weight: 10
description: Creating Secret objects using kubectl command line.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create a Secret

A `Secret` can contain user credentials required by pods to access a database.
For example, a database connection string consists of a username and password.
You can store the username in a file `./username.txt` and the password in a
file `./password.txt` on your local machine.

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```
In these commands, the `-n` flag ensures that the generated files do not have
an extra newline character at the end of the text. This is important because
when `kubectl` reads a file and encodes the content into a base64 string, the
extra newline character gets encoded too.

The `kubectl create secret` command packages these files into a Secret and creates
the object on the API server.

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

The output is similar to:

```
secret/db-user-pass created
```

The default key name is the filename. You can optionally set the key name using
`--from-file=[key=]source`. For example:

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

You do not need to escape special characters in password strings that you 
include in a file.

You can also provide Secret data using the `--from-literal=<key>=<value>` tag.
This tag can be specified more than once to provide multiple key-value pairs.
Note that special characters such as `$`, `\`, `*`, `=`, and `!` will be
interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing))
and require escaping.

In most shells, the easiest way to escape the password is to surround it with
single quotes (`'`). For example, if your password is `S!B\*d$zDsb=`,
run the following command:

```shell
kubectl create secret generic db-user-pass \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

## Verify the Secret

Check that the Secret was created:

```shell
kubectl get secrets
```

The output is similar to:

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

You can view a description of the `Secret`:

```shell
kubectl describe secrets/db-user-pass
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

## Decoding the Secret  {#decoding-secret}

To view the contents of the Secret you created, run the following command:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

The output is similar to:

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

Now you can decode the `password` data:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

The output is similar to:

```
1f2d1e2e67df
```

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
