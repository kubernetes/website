## NetworkPolicyIngressRule v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | NetworkPolicyIngressRule

> Example yaml coming soon...



This NetworkPolicyIngressRule matches traffic if and only if the traffic matches both ports AND from.

<aside class="notice">
Appears In  <a href="#networkpolicyspec-v1beta1">NetworkPolicySpec</a> </aside>

Field        | Description
------------ | -----------
from <br /> *[NetworkPolicyPeer](#networkpolicypeer-v1beta1) array* | List of sources which should be able to access the pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is not provided, this rule matches all sources (traffic not restricted by source). If this field is empty, this rule matches no sources (no traffic matches). If this field is present and contains at least on item, this rule allows traffic only if the traffic matches at least one item in the from list.
ports <br /> *[NetworkPolicyPort](#networkpolicyport-v1beta1) array* | List of ports which should be made accessible on the pods selected for this rule. Each item in this list is combined using a logical OR. If this field is not provided, this rule matches all ports (traffic not restricted by port). If this field is empty, this rule matches no ports (no traffic matches). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.

