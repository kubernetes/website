---
title: Kubernetes API
id: kubernetes-api
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  The RESTful interface used to query and manipulate the state of objects in Kubernetes.

aka: 
tags:
- fundamental
- architecture
---
 The RESTful interface used to query and manipulate the state of objects in Kubernetes.

<!--more--> 

Kubernetes resources and "records of intent" are all stored as API objects, and modified via RESTful calls to the API. The API allows configuration to be managed in a declarative way. Users can interact with the Kubernetes API directly, or via tools like `kubectl`. The core Kubernetes API is flexible and can also be extended to support custom resources.

