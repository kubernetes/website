---
title: Define Environment Variables for a Container
content_template: templates/task
weight: 20
---

{{% capture overview %}}

This page shows how to define environment variables for a container
in a Kubernetes Pod.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## Define an environment variable for a container

When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Pod:

{{< codenew file="pods/inject/envars.yaml" >}}

1. Create a Pod based on the YAML configuration file:

    ```shell
    kubectl create -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

1. List the running Pods:

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    The output is similar to this:

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

1. Get a shell to the container running in your Pod:

    ```shell
    kubectl exec -it envar-demo -- /bin/bash
    ```

1. In your shell, run the `printenv` command to list the environment variables.

    ```shell
    root@envar-demo:/# printenv
    ```

    The output is similar to this:

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

1. To exit the shell, enter `exit`.

{{< note >}}
The environment variables set using the `env` or `envFrom` field
will override any environment variables specified in the container image.
{{< /note >}}

## Using environment variables inside of your config

Environment variables that you define in a Pod's configuration can be used elsewhere in the configuration, for example in commands and arguments that you set for the Pod's containers. In the example configuration below, the `GREETING`, `HONORIFIC`, and `NAME` environment variables are set to `Warm greetings to`, `The Most Honorable`, and `Kubernetes`, respectively. Those environment variables are then used in the CLI arguments passed to the `env-print-demo` container.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

Upon creation, the command `echo Warm greetings to The Most Honorable Kubernetes` is run on the container.

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

{{% /capture %}}
