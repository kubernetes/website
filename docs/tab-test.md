---
title: tab test
---

{% assign tab_set_name = "tab_set" %}

{% capture tab1_capture %}Lorem ipsum dolor{% endcapture %}
{% capture tab2_capture %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3_capture %}Praesent sed lacus augue{% endcapture %}

{% assign tab_names[1] = "Tab1 Name" %}
{% assign tab_contents[1] = tab1_capture %}
{% assign tab_names[2] = "Tab2 Name" %}
{% assign tab_contents[2] = tab2_capture %}
{% assign tab_names[3] = "Tab3 Name" %}
{% assign tab_contents[3] = tab3_capture %}

{% include tabs.html %}
