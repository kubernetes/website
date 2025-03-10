---
title: Persistent Volume
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  API object that represents a piece of storage in the cluster.

aka: 
tags:
- core-object
- storage
---
An API object that represents a piece of storage in the cluster. Representation of as a general, pluggable storage
{{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}} that can persist beyond the lifecycle of any
individual {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more--> 

PersistentVolumes (PVs) provide an API that abstracts details of how storage is provided from how it is consumed.
PVs are used directly in scenarios where storage can be created ahead of time (static provisioning).
For scenarios that require on-demand storage (dynamic provisioning), PersistentVolumeClaims (PVCs) are used instead.

