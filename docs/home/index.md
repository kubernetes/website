---
approvers:
- chenopis
title: Kubernetes Documentation
layout: docsportal
cid: userJourneys
css: /css/style_user_journeys.css
js: /js/user-journeys/home.js, https://use.fontawesome.com/4bcc658a89.js
display_browse_numbers: true
---

{% unless page.notitle %}
<h1>{{ page.title }}</h1>
{% endunless %}

<div id="user-persona-data" class="hide">
  {{ site.data.user-personas | json | replace: "=>", ": " }}
</div>

<div class="hide">
{% assign skip_uj_paths = "migrators" | split: "," %}
{% for path in site.data.user-personas %}
  {% if skip_uj_paths contains path[0] %}
  {% else %}
    {% for persona in path[1] %}
      <div class="persona-def-data" data-name="{{ persona[0] }}">
      {% assign persona_info = persona[1] %}
      {% if persona_info.glossary_id %}
        {{ site.data.glossary[persona_info.glossary_id].short-description }}
      {% else if persona_info.short_desc %}
        {{ persona_info.short_desc }}
      {% endif %}
      </div>
    {% endfor %}
  {% endif %}
{% endfor %}
</div>

<div id='aboutWrapper'>
<div class="docsection1" markdown="1">

Kubernetes is an open source system for managing [containerized applications](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)
across multiple hosts, providing basic mechanisms for deployment, maintenance, and scaling of applications.
The open source project is hosted by the Cloud Native Computing Foundation ([CNCF](https://www.cncf.io/about)).

Kubernetes builds upon a decade and a half of experience at Google running
production workloads at scale using a system called [Borg](https://research.google.com/pubs/pub43438.html),
combined with best-of-breed ideas and practices from the community.

</div>
</div>

<div class="paths">
    <div class="navButton users">Users</div>
    <div class="navButton contributors">Contributors</div>
    <!-- div class="navButton migrators">Migration&nbsp;Paths</div -->
    <a> <div class="navButton browse">Browse Docs</div></a>
    <a> <div class="navButton about-k8s">About Kubernetes</div></a>
</div>

<div id="cardWrapper">
  <div class="display-bar">I AM...</div>
  <div class='cards' markdown="1">
  <div class='docsection1' id='persona-definition'>.</div>
  </div>
</div>

<div style='text-align: center;' class="applicationDeveloperContainer">
    <div class="display-bar" id="subTitle">LEVEL</div>
    <div class="levels">
        <div class="level" data-name="foundational">
            <i class="fa fa-sign-in" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>
            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Foundational
            </div>
            </div>
        <div class="level" data-name="intermediate">
            <i class="fa fa-university" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>

            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Intermediate
            </div>
        </div>
        <div class="level" data-name="advanced">
            <i class="fa fa-magic" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
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
        <div id="infobarLinks"></div>
    </div>
</div>


<div id='browsedocsWrapper'>
<div class="browseheader" id="browsedocs">
    <a name="browsedocs">  Browse Docs</a>
</div>

<div class="browsedocs">

{% assign sections = "setup,concepts,tasks,tutorials,reference" | split: "," %}

{% for section_id in sections %}

  {% assign section_data = site.data[section_id] %}
  {% assign section_toc = section_data.toc %}

  <div class="browsesection">
    <div class="docstitle">
      <a href="{{ section_data.landing_page }}">{{ section_data.bigheader }}</a>
    </div>

    {% assign section_toc = section_toc | where_exp: "elt", "elt.title != null" %}
    {% assign num_pages = section_toc | size | minus: 1 %}
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
</div>
