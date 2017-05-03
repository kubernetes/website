---
title: tab test
---

{% assign tab_set_name = "tab_set" %}

{% capture tabspec %}some_tabs
Tab1 Name, tab1_var
Tab2 Name, tab2_var
Tab3 Name, tab3_var
{% endcapture%}
{% capture tab1_var %}Lorem ipsum dolor{% endcapture %}
{% capture tab2_var %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3_var %}Praesent sed lacus augue{% endcapture %}

{% include tabs.html %}

<ul id="profileTabs" class="nav nav-tabs">
    <li class="active"><a href="#profile" data-toggle="tab">Profile</a></li>
    <li><a href="#about" data-toggle="tab">About</a></li>
    <li><a href="#match" data-toggle="tab">Match</a></li>
</ul>
<div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="profile">
        <h2>Profile</h2>
        <p>Praesent sit amet fermentum leo....</p>
    </div>

    <div role="tabpanel" class="tab-pane" id="about">
        <h2>About</h2>
        <p>Lorem ipsum ...</p>
    </div>

    <div role="tabpanel" class="tab-pane" id="match">
        <h2>Match</h2>
        <p>Vel vehicula ....</p>
    </div>
</div>