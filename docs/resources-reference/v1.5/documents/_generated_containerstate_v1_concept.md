

-----------
# ContainerState v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ContainerState







ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.

<aside class="notice">
Appears In <a href="#containerstatus-v1">ContainerStatus</a> </aside>

Field        | Description
------------ | -----------
running <br /> *[ContainerStateRunning](#containerstaterunning-v1)*  | Details about a running container
terminated <br /> *[ContainerStateTerminated](#containerstateterminated-v1)*  | Details about a terminated container
waiting <br /> *[ContainerStateWaiting](#containerstatewaiting-v1)*  | Details about a waiting container






