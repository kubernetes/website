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

## Env File Syntax {#env-file-syntax}

The format of Kubernetes env files originates from `.env` files.

In a shell environment, `.env` files are typically loaded using the `source .env` command.

For Kubernetes, the defined env file format adheres to stricter syntax rules:

* Blank Lines: Blank lines are ignored.

* Leading Spaces: Leading spaces on all lines are ignored.

* Variable Declaration: Variables must be declared as `VAR=VAL`. Spaces surrounding `=` and trailing spaces are ignored.
    ```
    VAR=VAL → VAL
    ```

* Comments: Lines beginning with # are treated as comments and ignored.
    ```
    # comment
    VAR=VAL → VAL

    VAR=VAL # not a comment → VAL # not a comment
    ```

* Line Continuation: A backslash (`\`) at the end of a variable declaration line indicates the value continues on the next line. The lines are joined with a single space.
    ```
    VAR=VAL \
    VAL2
    → VAL VAL2
    ```



## {{% heading "whatsnext" %}}

* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read [Expose Pod Information to Containers Through Environment Variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information)