---
layout: blog
title: "Kubernetes 1.31: Custom Profiling in Kubectl Debug Graduates to Beta"
date: 2024-08-22
slug: kubernetes-1-31-custom-profiling-kubectl-debug
author: >
  Arda Güçlü (Red Hat)
---

There are many ways of troubleshooting the pods and nodes in the cluster. However, `kubectl debug` is one of the easiest, highly used and most prominent ones. It
provides a set of static profiles and each profile serves for a different kind of role. For instance, from the network administrator's point of view, 
debugging the node should be as easy as this:

```shell
$ kubectl debug node/mynode -it --image=busybox --profile=netadmin
```

On the other hand, static profiles also bring about inherent rigidity, which has some implications for some pods contrary to their ease of use.
Because there are various kinds of pods (or nodes) that all have their specific
necessities, and unfortunately, some can't be debugged by only using the static profiles. 

Take an instance of a simple pod consisting of a container whose healthiness relies on an environment variable:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: example-container
    image: customapp:latest
    env:
    - name: REQUIRED_ENV_VAR
      value: "value1"
```

Currently, copying the pod is the sole mechanism that supports debugging this pod in kubectl debug. Furthermore, what if user needs to modify the `REQUIRED_ENV_VAR` to something different
for advanced troubleshooting?. There is no mechanism to achieve this.

## Custom Profiling

Custom profiling is a new functionality available under `--custom` flag, introduced in kubectl debug to provide extensibility. It expects partial `Container` spec in either YAML or JSON format. 
In order to debug the example-container above by creating an ephemeral container, we simply have to define this YAML:

```yaml
# partial_container.yaml
env:
  - name: REQUIRED_ENV_VAR
    value: value2
```

and execute:

```shell
kubectl debug example-pod -it --image=customapp --custom=partial_container.yaml
```

Here is another example that modifies multiple fields at once (change port number, add resource limits, modify environment variable) in JSON:

```json
{
  "ports": [
    {
      "containerPort": 80
    }
  ],
  "resources": {
    "limits": {
      "cpu": "0.5",
      "memory": "512Mi"
    },
    "requests": {
      "cpu": "0.2",
      "memory": "256Mi"
    }
  },
  "env": [
    {
      "name": "REQUIRED_ENV_VAR",
      "value": "value2"
    }
  ]
}
```

## Constraints

Uncontrolled extensibility hurts the usability. So that, custom profiling is not allowed for certain fields such as command, image, lifecycle, volume devices and container name.
In the future, more fields can be added to the disallowed list if required.

## Limitations

The `kubectl debug` command has 3 aspects: Debugging with ephemeral containers, pod copying, and node debugging. The largest intersection set of these aspects is the container spec within a Pod
That's why, custom profiling only supports the modification of the fields that are defined with `containers`. This leads to a limitation that if user needs to modify the other fields in the Pod spec, it is not supported.

## Acknowledgments

Special thanks to all the contributors who reviewed and commented on this feature, from the initial conception to its actual implementation (alphabetical order):

- [Eddie Zaneski](https://github.com/eddiezane)
- [Maciej Szulik](https://github.com/soltysh)
- [Lee Verberne](https://github.com/verb)