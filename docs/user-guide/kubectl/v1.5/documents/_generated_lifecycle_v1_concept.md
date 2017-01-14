

-----------
# Lifecycle v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Lifecycle







Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.

<aside class="notice">
Appears In <a href="#container-v1">Container</a> </aside>

Field        | Description
------------ | -----------
postStart <br /> *[Handler](#handler-v1)*  | PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: http://kubernetes.io/docs/user-guide/container-environment#hook-details
preStop <br /> *[Handler](#handler-v1)*  | PreStop is called immediately before a container is terminated. The container is terminated after the handler completes. The reason for termination is passed to the handler. Regardless of the outcome of the handler, the container is eventually terminated. Other management of the container blocks until the hook completes. More info: http://kubernetes.io/docs/user-guide/container-environment#hook-details






