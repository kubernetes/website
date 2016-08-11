---
assignees:
- janetkuo

---

* TOC
{:toc}

A pod is a group of containers that are scheduled
onto the same host. Pods serve as units of scheduling, deployment, and
horizontal scaling/replication. Pods share fate, and share some resources, such
as storage volumes and IP addresses.

## Creating a pod

Multi-container pods must be created with the `create` command. Properties
are passed to the command as a YAML- or JSON-formatted configuration file.

The `create` command can be used to create a pod directly, or it can create
a pod or pods through a `Deployment`. It is highly recommended that
you use a
[Deployment](/docs/user-guide/deployments/)
to create your pods. It watches for failed pods and will start up
new pods as required to maintain the specified number.

If you don't want a Deployment to monitor your pod (e.g. your pod
is writing non-persistent data which won't survive a restart, or your pod is
intended to be very short-lived), you can create a pod directly with the
`create` command.

### Using `create`

Note: We recommend using a
[Deployment](/docs/user-guide/deployments/)
to create pods. You should use the instructions below only if you don't want
to create a Deployment.

If your pod will contain more than one container, or if you don't want to
create a Deployment to manage your pod, use the
`kubectl create` command and pass a pod specification as a JSON- or
YAML-formatted configuration file.

```shell
$ kubectl create -f FILE
```

Where:

* `-f FILE` or `--filename FILE` is the name of a
  [pod configuration file](#pod-configuration-file) in either JSON or YAML
  format.

A successful create request returns the pod name. Use the
[`kubectl get`](#viewing_a_pod) command to view status after creation.

### Pod configuration file

A pod configuration file specifies required information about the pod.
It can be formatted as YAML or as JSON, and supports the following fields:

{% capture tabspec %}configfiles
JSON,json,pod-config.json,/docs/user-guide/pods/pod-config.json
YAML,yaml,pod-config.yaml,/docs/user-guide/pods/pod-config.yaml{% endcapture %}
{% include tabs.html %}

Required fields are:

* `kind`: Always `Pod`.
* `apiVersion`: Currently `v1`.
* `metadata`: An object containing:
    * `name`: Required if `generateName` is not specified. The name of this pod.
      It must be an
      [RFC1035](https://www.ietf.org/rfc/rfc1035.txt) compatible value and be
      unique within the namespace.
    * `labels`: Optional. Labels are arbitrary key:value pairs that can be used
      by
      [Deployment](/docs/user-guide/deployments/)
      and [services](/docs/user-guide/services/) for grouping and targeting
      pods.
    * `generateName`: Required if `name` is not set. A prefix to use to generate
      a unique name. Has the same validation rules as `name`.
    * `namespace`: Required. The namespace of the pod.
    * `annotations`: Optional. A map of string keys and values that can be used
      by external tooling to store and retrieve arbitrary metadata about
      objects.
* `spec`: The pod specification. See [The `spec` schema](#the_spec_schema) for
  details.


### The `spec` schema

A full description of the `spec` schema is contained in the
[Kubernetes API reference](/docs/api-reference/v1/definitions/#_v1_podspec).

The following fields are required or commonly used in the `spec` schema:

{% capture tabspec %}specfiles
JSON,json,pod-spec-common.json,/docs/user-guide/pods/pod-spec-common.json
YAML,yaml,pod-spec-common.yaml,/docs/user-guide/pods/pod-spec-common.yaml{% endcapture %}
{% include tabs.html %}

#### `containers[]`

A list of containers belonging to the pod. Containers cannot be added or removed once the pod is created, and there must be at least one container in a pod.

The `containers` object **must contain**:

*   `name`: Name of the container. It must be a DNS_LABEL and be unique within the pod. Cannot be updated.
*   `image`: Docker image name.

The `containers` object **commonly contains** the following optional properties:

*   `command[]`: The entrypoint array. Commands are not executed within a shell. The docker image's entrypoint is used if this is not provided. Cannot be updated.
*   `args[]`: A command array containing arguments to the entrypoint. The docker image's `cmd` is used if this is not provided. Cannot be updated.
*   `env[]`: A list of environment variables in key:value format to set in the container. Cannot be updated.
    *   `name`: The name of the environment variable; must be a `C_IDENTIFIER`.
    *   `value`: The value of the environment variable. Defaults to empty string.
*   `imagePullPolicy`: The image pull policy. Accepted values are:
    *   `Always`
    *   `Never`
    *   `IfNotPresent`Defaults to `Always` if `:latest` tag is specified, or `IfNotPresent` otherwise. Cannot be updated.
*   `ports[]`: A list of ports to expose from the container. Cannot be updated.
    *   `containerPort`: The port number to expose on the pod's IP address.
    *   `name`: The name for the port that can be referred to by services. Must be a `DNS_LABEL` and be unique without the pod.
    *   `protocol`: Protocol for the port. Must be UDP or TCP. Default is TCP.
*   `resources`: The Compute resources required by this container. Contains:
    *   `cpu`: CPUs to reserve for each container. Default is whole CPUs; scale suffixes (e.g. `100m` for one hundred milli-CPUs) are supported. If the host does not have enough available resources, your pod will not be scheduled.
    *   `memory`: Memory to reserve for each container. Default is bytes; [binary scale suffixes](http://en.wikipedia.org/wiki/Binary_prefix) (e.g. `100Mi` for one hundred mebibytes) are supported. If the host does not have enough available resources, your pod will not be scheduled.Cannot be updated.

#### `restartPolicy`

Restart policy for all containers within the pod. Options are:

*   `Always`
*   `OnFailure`
*   `Never`

#### `volumes[]`

A list of volumes that can be mounted by containers belonging to the pod. You must specify a `name` and a source for each volume. The container must also include a `volumeMount` with matching `name`. Source is one of:

*   `emptyDir`: A temporary directory that shares a pod's lifetime. Contains:
    *   `medium`: The type of storage used to back the volume. Must be an empty string (default) or `Memory`.
*   `hostPath`: A pre-existing host file or directory. This is generally used for privileged system daemons or other agents tied to the host. Contains:
    *   `path`: The path of the directory on the host.
*   `secret`: Secret to populate volume. Secrets are used to hold sensitive information, such as passwords, OAuth tokens, and SSH keys. Learn more from [the docs on secrets](/docs/user-guide/secrets/). Contains:
    *   `secretName`: The name of a secret in the pod's namespace.

The `name` must be a DNS_LABEL and unique within the pod.


### Sample file

For example, the following configuration file creates two containers: a
`redis` key-value store image, and a `django` frontend image.

{% capture tabspec %}samplefiles
JSON,json,pod-sample.json,/docs/user-guide/pods/pod-sample.json
YAML,yaml,pod-sample.yaml,/docs/user-guide/pods/pod-sample.yaml{% endcapture %}
{% include tabs.html %}

## Viewing a pod

{% include_relative _viewing-a-pod.md %}

## Deleting a pod

If you created your pod directly with `kubectl create`, use `kubectl delete`:

```shell
$ kubectl delete pod NAME
```

A successful delete request returns the name of the deleted pod.
