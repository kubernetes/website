---
approvers:
- chenopis
title: Kubernetes Documentation
layout: docsportal
cid: userJourneys
css: /css/style_user_journeys.css
js: /js/user-journeys.js, https://use.fontawesome.com/4bcc658a89.js
display_browse_numbers: true
---

{% unless page.notitle %}
<h1>{{ page.title }}</h1>
{% endunless %}

<div class="bar1">
    <div class="navButton users" onClick="showOnlyDocs(false)">Users</div>
    <div class="navButton contributors" onClick="showOnlyDocs(false)">Contributors</div>
    <div class="navButton migrators" onClick="showOnlyDocs(false)">Migration&nbsp;Paths</div>
    <a onClick="showOnlyDocs(true)"> <div class="navButton">Browse Docs</div></a>
</div>

<div id="cardWrapper">
  <div class="bar2">I AM...</div>
  <div class='cards'></div>
</div>

<div style='text-align: center;' class="applicationDeveloperContainer">
    <div class="bar2" id="subTitle">LEVEL</div>
    <div class="bar3">
        <div class="tab1 foundational" id="beginner">
            <i class="fa fa-cloud-download" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>
            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Foundational
            </div>
            </div>
        <div class="tab1 intermediate">
            <i class="fa fa-check-square" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>

            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Intermediate
            </div>
        </div>
        <div class="tab1 advanced">
            <i class="fa fa-exclamation-circle" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>
            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Advanced Topics
            </div>
        </div>
      </div>
</div>

<div class='infobarWrapper'>
    <div class="infobar">
        <span style="padding-bottom: 3% ">I want to...</span>
        <a id="infolink1" href="docs.html"><div class="whitebar" >
            <div class="infoicon">
                <i class="fa fa-folder-open-o" aria-hidden="true" style="padding:%;float:left;color:#3399ff"></i>
            </div>
            <div id="info1" class='data'></div>
        </div></a>
        <a id="infolink2" href="docs.html"><div class="whitebar">
            <div class="infoicon">
                <i class="fa fa-retweet" aria-hidden="true" style="padding-bottom:%;float:left;color:#3399ff"></i>
            </div>
            <div id="info2" class='data'></div>
        </div></a>
        <a id="infolink3" href="docs.html"> <div class="whitebar">
            <div class="infoicon">
                <i class="fa fa-hdd-o" aria-hidden="true" style="padding:%;float:left;color:#3399ff;margin-right:9px"></i>
            </div>
            <div id="info3" class='data'></div>
        </div></a>
    </div>
</div>


<div class="browseheader" id="browsedocs">
    <a name="browsedocs">  Browse Docs</a>
</div>

<div class="browsedocs">

{% assign sections = "setup,concepts,tasks,tutorials,reference" | split: "," %}

{% for section_id in sections %}

  {% assign section_data = site.data.[section_id] %}
  {% assign section_toc = section_data.toc %}

  <div class="browsesection">
    <div class="docstitle">
      <a href="{{ section_data.landing_page }}">{{ section_data.bigheader }}</a>
    </div>

    {% assign section_toc = section_toc | where_exp: "elt", "elt.title != null" %}
    {% assign num_pages = section_toc | size - 1 %}
    {% assign column_size = num_pages | divided_by: 3.0 | ceil %}

    <div class="pages">

    {% for i in (1..num_pages) %}
      {% assign offset = i | modulo: column_size %}
      {% assign index = i | minus: 1 %}
      {% assign section_elt = section_toc[index] %}

      {% if page.display_browse_numbers %}
        {% assign browse_number = i | prepend: "0" | slice: -2, 2 | append: " - " %}
      {% else %}
        {% assign browse_number = "" %}
      {% endif %}

      {% if offset == 1 %}
        <div class="browsecolumn">
      {% endif %}

      {% assign elt_url = section_elt.path | default: section_elt.landing_page | default: "#" %}
      <a href="{{ elt_url }}">{{ section_elt.title | prepend: browse_number }}</a><br>
      {% if offset == 0 or i == num_pages %}
        </div>
      {% endif %}
    {% endfor %}
    </div>
  </div>

{% endfor %}
</div>
