---
title: Container Command and Arguments
redirect_from:
- "/docs/user-guide/containers/"
- "/docs/user-guide/containers.html"
---

{% capture overview %}

In the configuration file for a Container, you can set the `command` and `args`
fields to override the default Entrypoint and Cmd of the the Container's image.

{% endcapture %}

{% capture body %}

## Container entry points and arguments

The configuration file for a Container has an `image` field that specifies
the Docker image to be run in the Container. A Docker image has metadata that includes
a default Entrypoint and a default Cmd.

When Kubernetes starts a Container, it runs the image's default Entrypoint and
passes the image's default Cmd as arguments.

If you want override the image's default Entrypoint and Cmd, you can use the
`command` and `args` fields in the Container's configuration.

*  The `command` field specifies the actual command run by the Container.
*  The `args` field specifies the arguments passed to the command.

This table summarizes the field names used by Docker and Kubernetes.

|              Description               |    Docker field name   | Kubernetes field name |
|----------------------------------------|------------------------|-----------------------|
|  The command run by the container      |   Entrypoint           |      command          |
|  The arguments passed to the command   |   Cmd                  |      args             |

Here's an example of a configuration file for a Pod that has one Container.

{% include code.html language="yaml" file="commands.yaml" ghlink="/docs/concepts/configuration/commands.yaml" %}

When Kubernetes starts the Container, it runs this command:

```shell
printenv HOSTNAME KUBERNETES_PORT
```

When you override the default Entrypoint and Cmd, these rules apply:

* If you do not supply `command` or `args` for a Container, the defaults defined
in the Docker image are used.

* If you supply a `command` but no `args` for a Container, only the supplied
`command` is used. The default EntryPoint and the default Cmd defined in the Docker
image are ignored.

* If you supply only `args` for a Container, the default Entrypoint defined in
the Docker image is run with the `args` that you supplied.

* If you supply a `command` and `args`, the default Entrypoint and the default
Cmd defined in the Docker image are ignored. Your `command` is run with your
`args`.

Here are some examples:

| Image Entrypoint   |    Image Cmd     | Container command   |  Container args    |    Command run   |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |   &lt;not set&gt;  | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      |   &lt;not set&gt;  |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |

{% endcapture %}

{% capture whatsnext %}

* [Defining a Command and Arguments for a Container](/docs/tasks/configure-pod-container/define-command-argument-container/)

* [Running Commands in a Container with kubectl exec](/docs/user-guide/getting-into-containers/)

* [Container](/docs/api-reference/v1/definitions/#_v1_container)

* [Docker Entrypoint field](https://docs.docker.com/engine/reference/builder/)

{% endcapture %}

{% include templates/concept.md %}
