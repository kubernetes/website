

-----------
# Eviction v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | Eviction







Eviction evicts a pod from its node subject to certain policies and safety constraints. This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to .../pods/<pod name>/evictions.



Field        | Description
------------ | -----------
deleteOptions <br /> *[DeleteOptions](#deleteoptions-v1)*  | DeleteOptions may be provided
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | ObjectMeta describes the pod that is being evicted.






