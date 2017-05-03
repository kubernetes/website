---
title: tab test
---

{% assign tab_set_name = "tab_set" %}

{% capture tab1 %}Lorem ipsum dolor{% endcapture %}
{% capture tab2 %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3 %}Praesent sed lacus augue{% endcapture %}

{% assign tab_names[1] = "Tab1 Name" %}
{% assign tab_contents[1] = tab1 %}
{% assign tab_names[2] = "Tab2 Name" %}
{% assign tab_contents[2] = tab2 %}
{% assign tab_names[3] = "Tab3 Name" %}
{% assign tab_contents[3] = tab3 %}

{% include tabs.html %}
