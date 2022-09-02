---
title: Volume
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  A directory containing data, accessible to the containers in a pod.

aka:
tags:
- core-object
- fundamental
---
 A directory containing data, accessible to the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip text="pod" term_id="pod" >}}.

<!--more-->

Kubernetes supports two fundamental types of volumes - ephemeral and persistent. 
Ephemeral volumes exist for the lifetime of their associated pods, while persistent volumes are designed to exist beyond the lifetime of pods associated with them. However, irrespective of the volume type, data is always preserved across container restarts.

See [storage](/docs/concepts/storage/) for more information.
