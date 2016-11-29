

-----------
# ContainerStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ContainerStatus







ContainerStatus contains details for the current status of this container.

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






