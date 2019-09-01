---
content_template: templates/concept
title: Creating your own Secrets
---

{{% capture overview %}}

This page describes how users can create their own secrets. See [Secrets](/docs/concepts/configuration/secret/) for more information.

{{% /capture %}}

{{% capture body %}}

## Creating a Secret Using kubectl create secret

Say that some pods need to access a database.  The
username and password that the pods should use is in the files
`./username.txt` and `./password.txt` on your local machine.

```shell
# Create files needed for rest of example.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

The `kubectl create secret` command
packages these files into a Secret and creates
the object on the Apiserver.

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```
```
secret "db-user-pass" created
```
{{< note >}}
Special characters such as `$`, `\*`, and `!` require escaping.
If the password you are using has special characters, you need to escape them using the `\\` character. For example, if your actual password is `S!B\*d$zDsb`, you should execute the command this way:
     kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\\*d\\$zDsb
 You do not need to escape special characters in passwords from files (`--from-file`).
{{< /note >}}

You can check that the secret was created like this:

```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```
```shell
kubectl describe secrets/db-user-pass
```
```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
`kubectl get` and `kubectl describe` avoid showing the contents of a secret by
default.
This is to protect the secret from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
{{< /note >}}

See [decoding a secret](/docs/concepts/configuration/secret/#decoding-a-secret) for how to see the contents of a secret.

## Creating a Secret Manually

You can also create a Secret in a file first, in json or yaml format,
and then create that object. The
[Secret](/docs/reference/generated/kubernetes-api/v1.12/#secret-v1-core) contains two maps:
data and stringData. The data field is used to store arbitrary data, encoded using
base64. The stringData field is provided for convenience, and allows you to provide
secret data as unencoded strings.

For example, to store two strings in a Secret using the data field, convert
them to base64 as follows:

```shell
echo -n 'admin' | base64
YWRtaW4=
echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm
```

Write a Secret that looks like this:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Now create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

```shell
kubectl apply -f ./secret.yaml
```
```
secret "mysecret" created
```

For certain scenarios, you may wish to use the stringData field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.

A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.

If your application uses the following configuration file:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

You could store this in a Secret using the following:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

Your deployment tool could then replace the `{{username}}` and `{{password}}`
template variables before running `kubectl apply`.

stringData is a write-only convenience field. It is never output when
retrieving Secrets. For example, if you run the following command:

```shell
kubectl get secret mysecret -o yaml
```

The output will be similar to:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

If a field is specified in both data and stringData, the value from stringData
is used. For example, the following Secret definition:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

Results in the following secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

Where `YWRtaW5pc3RyYXRvcg==` decodes to `administrator`.

The keys of data and stringData must consist of alphanumeric characters,
'-', '_' or '.'.

**Encoding Note:** The serialized JSON and YAML values of secret data are
encoded as base64 strings.  Newlines are not valid within these strings and must
be omitted.  When using the `base64` utility on Darwin/macOS users should avoid
using the `-b` option to split long lines.  Conversely Linux users *should* add
the option `-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if
`-w` option is not available.

## Creating a Secret from Generator
Kubectl supports [managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
since 1.14. With this new feature,
you can also create a Secret from generators and then apply it to create the object on
the Apiserver. The generators
should be specified in a `kustomization.yaml` inside a directory.

For example, to generate a Secret from files `./username.txt` and `./password.txt`
```shell
# Create a kustomization.yaml file with SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```
Apply the kustomization directory to create the Secret object.
```shell
$ kubectl apply -k .
secret/db-user-pass-96mffmfh4k created
```

You can check that the secret was created like this:

```shell
$ kubectl get secrets
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s

$ kubectl describe secrets/db-user-pass-96mffmfh4k
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

For example, to generate a Secret from literals `username=admin` and `password=secret`,
you can specify the secret generator in `kustomization.yaml` as
```shell
# Create a kustomization.yaml file with SecretGenerator
$ cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```
Apply the kustomization directory to create the Secret object.
```shell
$ kubectl apply -k .
secret/db-user-pass-dddghtt9b5 created
```
{{< note >}}
The generated Secrets name has a suffix appended by hashing the contents. This ensures that a new
Secret is generated each time the contents is modified.
{{< /note >}}

{{% /capture %}}