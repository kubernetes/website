## HTTPGetAction v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | HTTPGetAction

> Example yaml coming soon...



HTTPGetAction describes an action based on HTTP Get requests.

<aside class="notice">
Appears In  <a href="#handler-v1">Handler</a> </aside>

Field        | Description
------------ | -----------
host <br /> *string* | Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.
httpHeaders <br /> *[HTTPHeader](#httpheader-v1) array* | Custom headers to set in the request. HTTP allows repeated headers.
path <br /> *string* | Path to access on the HTTP server.
port <br /> *[IntOrString](#intorstring-intstr)* | Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.
scheme <br /> *string* | Scheme to use for connecting to the host. Defaults to HTTP.

