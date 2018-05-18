---
title: Defining Environment Variables for a Container
content_template: templates/task
---

{{% capture overview %}}

This page shows how to define environment variables when you run a container
in a Kubernetes Deployment.

{{% endcapture %}}


{{% capture prerequisites %}}

{{% include task-tutorial-prereqs.md %}}

{{% endcapture %}}


{{% capture steps %}}

## Defining an environment variable for a container

When you create a Deployment, you can set environment variables for the containers
that run in the Deployment. To set environment variables, include the `env` or
`envFrom` field in the configuration file.

In this exercise, you create a Deployment that runs one container. The configuration
file for the Deployment defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Deployment:

{{% include code.html language="yaml" file="envars.yaml" ghlink="/docs/tasks/inject-data-application/envars.yaml" %}}

1. Create a Deployment based on the YAML configuration file:

      kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml

1. List the running Deployments:

      kubectl get deployments -l name=demonstrate-envars

    The output is similar to this:

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s

1. Get a shell to the container running in your Deployment:

      kubectl exec -it envar-demo -- /bin/bash

1. In your shell, run the `printenv` command to list the environment variables.

      root@envar-demo:/# printenv

    The output is similar to this:

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment

1. To exit the shell, enter `exit`.

{{% endcapture %}}

{{% capture whatsnext %}}

* Learn more about [environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/api-reference/v1.6/#envvarsource-v1-core).

{{% endcapture %}}


{{% include templates/task.md %}}
