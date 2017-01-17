## Probe v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Probe



Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.

<aside class="notice">
Appears In  <a href="#container-v1">Container</a> </aside>

Field        | Description
------------ | -----------
exec <br /> *[ExecAction](#execaction-v1)*  | One and only one of the following should be specified. Exec specifies the action to take.
failureThreshold <br /> *integer*  | Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.
httpGet <br /> *[HTTPGetAction](#httpgetaction-v1)*  | HTTPGet specifies the http request to perform.
initialDelaySeconds <br /> *integer*  | Number of seconds after the container has started before liveness probes are initiated. More info: http://kubernetes.io/docs/user-guide/pod-states#container-probes
periodSeconds <br /> *integer*  | How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.
successThreshold <br /> *integer*  | Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness. Minimum value is 1.
tcpSocket <br /> *[TCPSocketAction](#tcpsocketaction-v1)*  | TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported
timeoutSeconds <br /> *integer*  | Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: http://kubernetes.io/docs/user-guide/pod-states#container-probes

