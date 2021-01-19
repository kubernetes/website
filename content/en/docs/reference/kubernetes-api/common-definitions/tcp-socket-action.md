---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TCPSocketAction"
content_type: "api_reference"
description: "TCPSocketAction describes an action based on opening a socket."
title: "TCPSocketAction"
weight: 21
---



`import "k8s.io/api/core/v1"`


TCPSocketAction describes an action based on opening a socket

<hr>

- **port** (IntOrString), required

  Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

- **host** (string)

  Optional: Host name to connect to, defaults to the pod IP.





