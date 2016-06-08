---
---

{% assign concept="Replication Controller" %}

{% capture what_is %}
A Replication Controller does x and y and z...(etc, etc, text goes on)
{% endcapture %}

{% capture when_to_use %}
You should use Replication Controller when...
{% endcapture %}

{% capture when_not_to_use %}
You should not use Replication Controller if...
{% endcapture %}

{% capture status %}
The current status of Replication Controllers is...
{% endcapture %}

{% capture required_fields %}
* `kind`: Always `Pod`.
* `apiVersion`: Currently `v1`.
* `metadata`: An object containing:
    * `name`: Required if `generateName` is not specified. The name of this pod.
      It must be an
      [RFC1035](https://www.ietf.org/rfc/rfc1035.txt) compatible value and be
      unique within the namespace.
{% endcapture %}

{% include templates/concept-overview.md %}