---
title: Define Environment Variables for a Container
---

{% capture overview %}

This page shows how to define environment variables when you run a container
in a Kubernetes Pod.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Define an environment variable for a container

When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Pod:

{% include code.html language="yaml" file="envars.yaml" ghlink="/docs/tasks/inject-data-application/envars.yaml" %}

1. Create a Pod based on the YAML configuration file:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml

1. List the running Pods:

       kubectl get pods -l purpose=demonstrate-envars

    The output is similar to this:

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s

1. Get a shell to the container running in your Pod:

       kubectl exec -it envar-demo -- /bin/bash

1. In your shell, run the `printenv` command to list the environment variables.

       root@envar-demo:/# printenv

    The output is similar to this:

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment
        DEMO_FAREWELL=Such a sweet sorrow

1. To exit the shell, enter `exit`.

**Note:** The environment variables set using the `env` or `envFrom` field
will override any environment variables specified in the container image.
{: .note}

{% endcapture %}

{% capture whatsnext %}

* Learn more about [environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{page.version}}/#envvarsource-v1-core).

{% endcapture %}


{% include templates/task.md %}
