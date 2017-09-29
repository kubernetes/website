---
approvers:
- chenopis
- abiogenesis-now
title: Standardized Glossary
noedit: true
default_active_tag: fundamental
---
<link href="/css/glossary.css" rel="stylesheet">
<script src="/js/glossary.js"></script>

<p><b><i>This page is still a work-in-progress. More terms will be added.</i></b><p>

<p>This glossary is intended to be a comprehensive, standardized list of Kubernetes terminology. It includes technical terms that are specific to K8s, as well as more general terms that provide useful context.</p>

<div id="tag-container">
<p>Filter terms according to their tags:</p>
<div class="tag-description invisible" id="placeholder">.</div>
{% for tag in site.data.canonical-tags %}
{% assign tag_info = tag[1] %}
<div class="tag-description hide" id="{{ tag_info.id | prepend: "tag-" }}">
<i>{{ tag_info.description }}</i>
</div>
{% endfor %}

{% assign sorted_tags = site.data.canonical-tags | where_exp: "tag", "true" | sort: 'name' %}
{% for tag_info in sorted_tags %}

{% if tag_info.id == page.default_active_tag %}
{% assign tag_state_class = "active-tag" %}
{% else %}
{% assign tag_state_class = "" %}
{% endif %}

<span class="tag-option canonical-tag {{ tag_state_class }}" data-target="{{ tag_info.id | prepend: "tag-" }}">
<a href="javascript:void(0)">{{ tag_info.name }}</a>
</span>
{% endfor %}
<span class="tag-option"><a id="select-all-tags" href="javascript:void(0)">Select all</a></span>
<span class="tag-option"><a id="deselect-all-tags" href="javascript:void(0)">Deselect all</a></span>
</div>

<p>Click on the <a href="javascript:void(0)" class="no-underline">[+]</a> indicators below to get a longer explanation for any particular term.</p>

{% assign glossary_terms = site.data.glossary | where_exp: "term", "term.id != '_example'" | sort: 'name' %}

<ul>
{% for term in glossary_terms %}

{% assign tag_classes = term.tags | join: " tag-" | prepend: "tag-" %}

{% assign num_match = term.tags | where_exp: "tag", "tag == page.default_active_tag" | size %}
{% if num_match > 0 %}
{% assign term_visibility_class = "" %}
{% assign show_count = 1 %}
{% else %}
{% assign term_visibility_class = "hide" %}
{% assign show_count = 0 %}
{% endif %}

<li class="{{ tag_classes }} {{ term_visibility_class }}" data-show-count="{{ show_count }}">
<div>
<b>{{ term.name }}</b>
<br>
{% if term.formerly %}
Also known as: <i>{{ term.formerly | join: ", " }}</i>
<br>
{% endif %}
<span class="preview-text">{{ term.short-description | markdownify }} <a href="javascript:void(0)" class="click-controller no-underline" data-target="{{ term.id }}">[+]</a></span>
<br>
<div id="{{ term.id }}" class="hide">
{{ term.long-description | markdownify }}
</div>
{% endfor %}
