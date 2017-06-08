

-----------
# ServerAddressByClientCIDR unversioned



Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | ServerAddressByClientCIDR







ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match.

<aside class="notice">
Appears In <a href="#apigroup-unversioned">APIGroup</a> <a href="#apiversions-unversioned">APIVersions</a> </aside>

Field        | Description
------------ | -----------
clientCIDR <br /> *string*  | The CIDR with which clients can match their IP to figure out the server address that they should use.
serverAddress <br /> *string*  | Address of this server, suitable for a client that matches the above CIDR. This can be a hostname, hostname:port, IP or IP:port.






