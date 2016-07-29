---
assignees:
- bprashanth

---
* TOC
{:toc}

A replication controller ensures that a specified number of pod "replicas" are
running at any one time. If there are too many, it will kill some. If there are
too few, it will start more.

## Creating a replication controller

Replication controllers are created with `kubectl create`:

```shell
$ kubectl create -f FILE
```

Where:

* `-f FILE` or `--filename FILE` is a relative path to a
  [configuration file](#replication_controller_configuration_file) in
  either JSON or YAML format.

You can use the [sample file](#sample_file) below to try a create request.

A successful create request returns the name of the replication controller. To
view more details about the controller, see
[Viewing replication controllers](#viewing_replication_controllers) below.

### Replication controller configuration file

When creating a replication controller, you must point to a configuration file
as the value of the `-f` flag. The configuration
file can be formatted as YAML or as JSON, and supports the following fields:

```json
{
  "apiVersion": "v1",
  "kind": "ReplicationController",
  "metadata": {
    "name": "",
    "labels": "",
    "namespace": ""
  },
  "spec": {
    "replicas": int,
    "selector": {
      "":""
    },
    "template": {
      "metadata": {
        "labels": {
          "":""
        }
      },
      "spec": {
        // See 'The spec schema' below
      }
    }
  }
}
```

Required fields are:

* `kind`: Always `ReplicationController`.
* `apiVersion`: Currently `v1`.
* `metadata`: An object containing:
    * `name`: Required if `generateName` is not specified. The name of this
      replication controller. It must be an
      [RFC1035](https://www.ietf.org/rfc/rfc1035.txt) compatible value and be
      unique within the namespace.
    * `labels`: Optional. Labels are arbitrary key:value pairs that can be used
      for grouping and targeting by other resources and services.
    * `generateName`: Required if `name` is not set. A prefix to use to generate
      a unique name. Has the same validation rules as `name`.
    * `namespace`: Optional. The namespace of the replication controller.
    * `annotations`: Optional. A map of string keys and values that can be used
      by external tooling to store and retrieve arbitrary metadata about
      objects.
* `spec`: The configuration for this replication controller. It must
  contain:
    * `replicas`: The number of pods to create and maintain.
    * `selector`: A map of key:value pairs assigned to the set of pods that
      this replication controller is responsible for managing. **This must**
      **match the key:value pairs in the `template`'s `labels` field**.
    * `template` contains:
        * A `metadata` object with `labels` for the pod.
        * The [`spec` schema](#the_spec_schema) that defines the pod
          configuration.

### The `spec` schema

The `spec` schema (that is a child of `template`) is described in the locations
below:

* The [`spec` schema](/docs/user-guide/pods/multi-container/#the_spec_schema)
  section of the Creating Multi-Container Pods page covers required and
  frequently-used fields.
* The entire `spec` schema is documented in the
  [Kubernetes API reference](/docs/api-reference/v1/definitions/#_v1_podspec).

### Sample file

The following sample file creates 2 pods, each containing a single container
using the `redis` image. Port 80 on each container is opened. The replication
controller is tagged with the `serving` label. The pods are given the label
`frontend` and the `selector` is set to `frontend`, to indicate that the
controller should manage pods with the `frontend` label.

```json
{
  "kind": "ReplicationController",
  "apiVersion": "v1",
  "metadata": {
    "name": "frontend-controller",
    "labels": {
      "state": "serving"
    }
  },
  "spec": {
    "replicas": 2,
    "selector": {
      "app": "frontend"
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "frontend"
        }
      },
      "spec": {
        "volumes": null,
        "containers": [
          {
            "name": "php-redis",
            "image": "redis",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "dnsPolicy": "ClusterFirst"
      }
    }
  }
}
```

## Updating replication controller pods

See [Rolling Updates](/docs/user-guide/rolling-updates/).

## Resizing a replication controller

See
[Resizing a replication controller](/docs/user-guide/resizing-a-replication-controller/).

## Viewing replication controllers

To list replication controllers on a cluster, use the `kubectl get` command:

```shell
$ kubectl get rc
```

A successful get command returns all replication controllers on the cluster in
the specified or default namespace. For example:

```shell
CONTROLLER            CONTAINER(S)   IMAGE(S)  SELECTOR        REPLICAS
frontend              php-redis      redis     name=frontend   2
```

You can also use `get rc NAME` to return information about a specific
replication controller.

To view detailed information about a specific replication controller, use the
`kubectl describe` command:

```shell
$ kubectl describe rc NAME
```

A successful describe request returns details about the replication controller
including number and status of pods managed, and recent events:

```conf
Name:        frontend
Namespace:      default
Image(s):       gcr.io/google_samples/gb-frontend:v3
Selector:       name=frontend
Labels:        name=frontend
Replicas:       2 current / 2 desired
Pods Status:    2 Running / 0 Waiting / 0 Succeeded / 0 Failed
Events:
  FirstSeen                        LastSeen                        Count   From                         SubobjectPath  Reason            Message
  Fri, 06 Nov 2015 16:52:50 -0800  Fri, 06 Nov 2015 16:52:50 -0800 1       {replication-controller }                   SuccessfulCreate  Created pod: frontend-gyx2h
  Fri, 06 Nov 2015 16:52:50 -0800  Fri, 06 Nov 2015 16:52:50 -0800 1       {replication-controller }                   SuccessfulCreate  Created pod: frontend-vc9w4
```

## Deleting replication controllers

To delete a replication controller as well as the pods that it controls, use
`kubectl delete`:

```shell
$ kubectl delete rc NAME
```

By default, `kubectl delete rc` will resize the controller to zero (effectively
deleting all pods) before deleting it.

To delete a replication controller without deleting its pods, use
`kubectl delete` and specify `--cascade=false`:

```shell
$ kubectl delete rc NAME --cascade=false
```

A successful delete request returns the name of the deleted resource.
