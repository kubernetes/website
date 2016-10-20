---
---

{% capture overview %}

This page shows how to define commands and arguments when you run a container
in a Kubernetes Pod.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

### Defining a command when you create a Pod

When you create a Pod, you can specify a command and arguments for the
containers that run in the Pod. To specify a command, include the `command`
field in the configuration file. To specify arguments for the command, include
the `args` field in the configuration file. The command that you specify in the
configuration file overrides the usual entry point for the container.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines a command and two arguments:

{% include code.html language="yaml" file="commands.yaml" ghlink="/docs/tasks/configure-pod-container/commands.yaml" %}

1. Create a Pod based on the YAML configuration file:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tasks/configure-pod-container/commands.yaml

1. List the running Pods:

        kubectl get pods

    The output shows that the container that ran in the command-demo Pod has
    completed.

1. To see the output of the command that ran in the container, view the logs
from the Pod:

        kubectl logs command-demo

    The output shows the values of the HOSTNAME and KUBERNETES_PORT environment
    variables:

        command-demo
        tcp://10.3.240.1:443

{% endcapture %}

{% capture whatsnext %}

* Learn more about [containers and commands](/docs/user-guide/containers/).
* Learn more about [configuring containers](/docs/user-guide/configuring-containers/).
* Learn more about [running commands in a container](/docs/user-guide/getting-into-containers/).
* See [Container](/docs/api-reference/v1/definitions/#_v1_container).

{% endcapture %}


{% include templates/task.md %}
