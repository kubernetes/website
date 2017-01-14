

-----------
# NodeSystemInfo v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeSystemInfo







NodeSystemInfo is a set of ids/uuids to uniquely identify the node.

<aside class="notice">
Appears In <a href="#nodestatus-v1">NodeStatus</a> </aside>

Field        | Description
------------ | -----------
architecture <br /> *string*  | The Architecture reported by the node
bootID <br /> *string*  | Boot ID reported by the node.
containerRuntimeVersion <br /> *string*  | ContainerRuntime Version reported by the node through runtime remote API (e.g. docker://1.5.0).
kernelVersion <br /> *string*  | Kernel Version reported by the node from 'uname -r' (e.g. 3.16.0-0.bpo.4-amd64).
kubeProxyVersion <br /> *string*  | KubeProxy Version reported by the node.
kubeletVersion <br /> *string*  | Kubelet Version reported by the node.
machineID <br /> *string*  | MachineID reported by the node. For unique machine identification in the cluster this field is prefered. Learn more from man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html
operatingSystem <br /> *string*  | The Operating System reported by the node
osImage <br /> *string*  | OS Image reported by the node from /etc/os-release (e.g. Debian GNU/Linux 7 (wheezy)).
systemUUID <br /> *string*  | SystemUUID reported by the node. For unique machine identification MachineID is prefered. This field is specific to Red Hat hosts https://access.redhat.com/documentation/en-US/Red_Hat_Subscription_Management/1/html/RHSM/getting-system-uuid.html






