

-----------
# Handler v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Handler







Handler defines a specific action that should be taken

<aside class="notice">
Appears In <a href="#lifecycle-v1">Lifecycle</a> </aside>

Field        | Description
------------ | -----------
exec <br /> *[ExecAction](#execaction-v1)*  | One and only one of the following should be specified. Exec specifies the action to take.
httpGet <br /> *[HTTPGetAction](#httpgetaction-v1)*  | HTTPGet specifies the http request to perform.
tcpSocket <br /> *[TCPSocketAction](#tcpsocketaction-v1)*  | TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported






