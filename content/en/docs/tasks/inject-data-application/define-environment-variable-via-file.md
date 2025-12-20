---
title: Define Environment Variable Values Using An Init Container
content_type: task
min-kubernetes-server-version: v1.34
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="EnvFiles" >}}

This page show how to configure environment variables for containers in a Pod via file.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{% version-check %}}

<!-- steps -->

## How the design works

In this exercise, you will create a Pod that sources environment variables from files, 
projecting these values into the running container.

{{% code_sample file="pods/inject/envars-file-container.yaml" %}}

In this manifest, you can see the `initContainer` mounts an `emptyDir` volume and writes environment variables to a file within it,
and the regular containers reference both the file and the environment variable key 
through the `fileKeyRef` field without needing to mount the volume. 
When `optional` field is set to false, the specified `key` in `fileKeyRef` must exist in the environment variables file.

The volume will only be mounted to the container that writes to the file
(`initContainer`), while the consumer container that consumes the environment variable will not have the volume mounted.

The env file format adheres to the [kubernetes env file standard](/docs/tasks/inject-data-application/define-environment-variable-via-file/#env-file-syntax).

During container initialization, the kubelet retrieves environment variables 
from specified files in the `emptyDir` volume and exposes them to the container.

{{< note >}}
All container types (initContainers, regular containers, sidecars containers,
and ephemeral containers) support environment variable loading from files.

While these environment variables can store sensitive information, 
`emptyDir` volumes don't provide the same protection mechanisms as
dedicated Secret objects. Therefore, exposing confidential environment variables 
to containers through this feature is not considered a security best practice.
{{< /note >}}


Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/envars-file-container.yaml
```

Verify that the container in the Pod is running:

```shell
# If the new Pod isn't yet healthy, rerun this command a few times.
kubectl get pods
```

Check container logs for environment variables:

```shell
kubectl logs dapi-test-pod -c use-envfile | grep DB_ADDRESS
```

The output shows the values of selected environment variables:

```
DB_ADDRESS=address
```

## Env file syntax {#env-file-syntax}

The env file format used by Kubernetes is a well-defined subset of the environment variable semantics for POSIX-compliant bash. Any env file supported by Kubernetes will produce the same environment variables as when interpreted by a POSIX-compliant bash. However, POSIX-compliant bash supports some additional formats that Kubernetes does not accept.

Example:

```
MY_VAR='my-literal-value'
```

### Rules

* Variable declaration: Use the form `VAR='value'`. Spaces surrounding `=` are ignored; leading spaces on a line are ignored; blank lines are ignored.
* Quoted values: Values must be enclosed in single quotes (`'`).
  * The content inside single quotes is preserved literally. No escape-sequence processing, whitespace folding, or character interpretation is applied.
  * Newlines inside single quotes are preserved (multi-line values are supported).
* Comments: Lines that begin with `#` are treated as comments and ignored. A `#` character inside a single-quoted value is not a comment.

Examples:

```
# comment
DB_ADDRESS='address'

MULTI='line1
line2'
```

### Unsupported forms

* Unquoted values are **prohibited**:
  * `VAR=value` — not supported.
* Double-quoted values are **prohibited**:
  * `VAR="value"` — not supported.
* Multiple adjacent quoted strings are **not** supported:
  * `VAR='val1''val2'` — not supported.
* Any form of interpolation, expansion, or concatenation is **not** supported:
  * `VAR='a'$OTHER` or `VAR=${OTHER}` — not supported.

The strict single-quote requirement ensures the value is taken literally by the kubelet when loading environment variables from files.


## {{% heading "whatsnext" %}}

* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read [Expose Pod Information to Containers Through Environment Variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information)