---
title: tab test
---

{% capture tab1_var %}Lorem ipsum dolor{% endcapture %}
{% capture tab2_var %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3_var %}Praesent sed lacus augue{% endcapture %}

{% assign tab_set_name = "some_tabs" %}
{% assign tab_names = "Default, Tab1 Name, Tab2 Name, Tab3 Name" | split: ',' | compact %}
{% assign tab_contents = "Select one of the tabs.;" | split: ';' | compact | push: tab1_var | push: tab2_var | push: tab3_var %}

{% include tabs.html %}
