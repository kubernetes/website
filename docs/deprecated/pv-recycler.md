---
layout: docwithnav
title: Persistent Storage Recycler Deprecation

assignees:
- thockin
- childsb
- erinboyd
---

## Feature description to be deprecated:

When a user creates a persistent volume, they can specify the volume be 'recycled' and reused for a different container or user.
The use case was driven by the fact 'users' did not have the permissions to create persistent volumes, only an admin can, and therefore
recycling and reusing a volume again and again, seemed like a desirable feature.

This option is specified in the persistent volume specification as follows:
```yaml
persistentVolumeReclaimPolicy: Recycle 
```
This feature was developed before users had the ability to dynamically provision volumes on demand. Now with dynamic provisioning fully
in place, the need to recycle a volume outweighs the risk it adds.
 
## Justification for deprecation:

The recycle option perfoms a simple "rm -rf" of the volume. Though this seems sufficient for most volumes to be erased, several
cases have arisen where data believed to have been removed from the volume is made available to the following user. This security risk is 
unacceptable.

In addition, the flakes and instability that seems to continually occur around this feature does not justify it use with the dynamic
provisioning feature made widely available.


## Results of community poll on deprecation:

[Community Poll] (https://docs.google.com/a/redhat.com/forms/d/1eMBRCwyBPYC4RJ4OJPeLiSZRzkMl2Rr_7E_zmEn4MJs/edit#responses)


