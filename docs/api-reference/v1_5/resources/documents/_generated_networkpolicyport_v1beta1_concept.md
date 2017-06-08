

-----------
# NetworkPolicyPort v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | NetworkPolicyPort









<aside class="notice">
Appears In <a href="#networkpolicyingressrule-v1beta1">NetworkPolicyIngressRule</a> </aside>

Field        | Description
------------ | -----------
port <br /> *[IntOrString](#intorstring-intstr)*  | If specified, the port on the given protocol.  This can either be a numerical or named port on a pod.  If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.
protocol <br /> *string*  | Optional.  The protocol (TCP or UDP) which traffic must match. If not specified, this field defaults to TCP.






