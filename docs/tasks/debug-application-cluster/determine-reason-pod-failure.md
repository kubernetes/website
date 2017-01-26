---
title: Determining the Reason for Pod Failure
---

{% capture overview %}

This page shows how to write and read a Container
termination message.

Termination messages provide a way for containers to write
information about fatal events to a location where it can
be easily retrieved and surfaced by tools like dashboards
and monitoring software. In most cases, information that you
put in a termination message should also be written to
the general
[Kubernetes logs](/docs/user-guide/logging/).

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Writing and reading a termination message

In this exercise, you create a Pod that runs one container.
The configuration file specifies a command that runs when
the container starts.

{% include code.html language="yaml" file="termination.yaml" ghlink="/docs/tasks/debug-application-cluster/termination.yaml" %}

1. Create a Pod based on the YAML configuration file:

        kubectl create -f http://k8s.io/docs/tasks/debug-application-cluster/termination.yaml

    In the YAML file, in the `cmd` and `args` fields, you can see that the
    container sleeps for 10 seconds and then writes "Sleep expired" to
    the `/dev/termination-log` file. After the container writes
    the "Sleep expired" message, it terminates.

1. Display information about the Pod:

        kubectl get pod termination-demo

    Repeat the preceding command until the Pod is no longer running.

1. Display detailed information about the Pod:

        kubectl get pod --output=yaml

    The output includes the "Sleep expired" message:

        apiVersion: v1
        kind: Pod
        ...
            lastState:
              terminated:
                containerID: ...
                exitCode: 0
                finishedAt: ...
                message: |
                  Sleep expired
                ...

1. Use a Go template to filter the output so that it includes
only the termination message:

```
{% raw %}    kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"{% endraw %}
```

## Setting the termination log file

By default Kubernetes retrieves termination messages from
`/dev/termination-log`. To change this to a different file,
specify a `terminationMessagePath` field for your Container.

For example, suppose your Container writes termination messages to
`/tmp/my-log`, and you want Kubernetes to retrieve those messages.
Set `terminationMessagePath` as shown here:

    apiVersion: v1
    kind: Pod
    metadata:
      name: msg-path-demo
    spec:
      containers:
      - name: msg-path-demo-container
        image: debian
        terminationMessagePath: "/tmp/my-log"

{% endcapture %}

{% capture whatsnext %}

* See the `terminationMessagePath` field in
  [Container](/docs/api-reference/v1/definitions#_v1_container).
* Learn about [retrieving logs](/docs/user-guide/logging/).
* Learn about [Go templates](https://golang.org/pkg/text/template/).

{% endcapture %}


{% include templates/task.md %}
