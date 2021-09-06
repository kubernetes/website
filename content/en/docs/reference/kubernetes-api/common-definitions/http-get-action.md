---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "HTTPGetAction"
content_type: "api_reference"
description: "HTTPGetAction describes an action based on HTTP Get requests."
title: "HTTPGetAction"
weight: 4
---



`import "k8s.io/api/core/v1"`


HTTPGetAction describes an action based on HTTP Get requests.

<hr>

- **port** (IntOrString), required

  Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

- **host** (string)

  Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

- **httpHeaders** ([]HTTPHeader)

  Custom headers to set in the request. HTTP allows repeated headers.

  <a name="HTTPHeader"></a>
  *HTTPHeader describes a custom header to be used in HTTP probes*

  - **httpHeaders.name** (string), required

    The header field name

  - **httpHeaders.value** (string), required

    The header field value

- **path** (string)

  Path to access on the HTTP server.

- **scheme** (string)

  Scheme to use for connecting to the host. Defaults to HTTP.





