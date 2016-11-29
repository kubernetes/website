

-----------
# Container v1

>bdocs-tab:kubectl Container Config to run nginx (must be embedded in a PodSpec to run).

```bdocs-tab:kubectl_yaml

name: nginx
# Run the nginx:1.10 image
image: nginx:1.10


```
>bdocs-tab:curl Container Config to run nginx (must be embedded in a PodSpec to run).

```bdocs-tab:curl_yaml

name: nginx
# Run the nginx:1.10 image
image: nginx:1.10


```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Container

<aside class="warning">Containers are only ever created within the context of a <a href="#pod-v1">Pod</a>.  This is usually done using a Controller.  See Controllers: <a href="#deployment-v1beta1">Deployment</a>, <a href="#job-v1">Job</a>, or <a href="#statefulset-v1beta1">StatefulSet</a></aside>





A single application container that you want to run within a pod.

<aside class="notice">
Appears In <a href="#podspec-v1">PodSpec</a> </aside>

Field        | Description
------------ | -----------
args <br /> *string array*  | Arguments to the entrypoint. The docker image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME). Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/containers#containers-and-commands
command <br /> *string array*  | Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME). Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/containers#containers-and-commands
env <br /> *[EnvVar](#envvar-v1) array*  | List of environment variables to set in the container. Cannot be updated.
image <br /> *string*  | Docker image name. More info: http://kubernetes.io/docs/user-guide/images
imagePullPolicy <br /> *string*  | Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/images#updating-images
lifecycle <br /> *[Lifecycle](#lifecycle-v1)*  | Actions that the management system should take in response to container lifecycle events. Cannot be updated.
livenessProbe <br /> *[Probe](#probe-v1)*  | Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/pod-states#container-probes
name <br /> *string*  | Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
ports <br /> *[ContainerPort](#containerport-v1) array*  | List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.
readinessProbe <br /> *[Probe](#probe-v1)*  | Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/pod-states#container-probes
resources <br /> *[ResourceRequirements](#resourcerequirements-v1)*  | Compute Resources required by this container. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#resources
securityContext <br /> *[SecurityContext](#securitycontext-v1)*  | Security options the pod should run with. More info: http://releases.k8s.io/HEAD/docs/design/security_context.md
stdin <br /> *boolean*  | Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
stdinOnce <br /> *boolean*  | Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
terminationMessagePath <br /> *string*  | Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Defaults to /dev/termination-log. Cannot be updated.
tty <br /> *boolean*  | Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
volumeMounts <br /> *[VolumeMount](#volumemount-v1) array*  | Pod volumes to mount into the container's filesystem. Cannot be updated.
workingDir <br /> *string*  | Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.


### ContainerStatus v1

<aside class="notice">
Appears In <a href="#podstatus-v1">PodStatus</a> </aside>

Field        | Description
------------ | -----------
containerID <br /> *string*  | Container's ID in the format 'docker://<container_id>'. More info: http://kubernetes.io/docs/user-guide/container-environment#container-information
image <br /> *string*  | The image the container is running. More info: http://kubernetes.io/docs/user-guide/images
imageID <br /> *string*  | ImageID of the container's image.
lastState <br /> *[ContainerState](#containerstate-v1)*  | Details about the container's last termination condition.
name <br /> *string*  | This must be a DNS_LABEL. Each container in a pod must have a unique name. Cannot be updated.
ready <br /> *boolean*  | Specifies whether the container has passed its readiness probe.
restartCount <br /> *integer*  | The number of times the container has been restarted, currently based on the number of dead containers that have not yet been removed. Note that this is calculated from dead containers. But those containers are subject to garbage collection. This value will get capped at 5 by GC.
state <br /> *[ContainerState](#containerstate-v1)*  | Details about the container's current condition.





