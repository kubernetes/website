<!-- Use include_cached when incorporating this file, in order to reduce computation/build time -->

{% assign glossary_terms = site.data.glossary | where_exp: "term", "term.id != '_example'" %}

{% assign tag_map = "" | split: " " %}

{% for tag in site.data.canonical-tags %}

{% assign term_list = glossary_terms | where_exp:"term", "term.tags contains tag" | map: "id" %}

{% assign tag_obj = "" | split: " " | push: tag | push: term_list %}

{% assign tag_map = tag_map | push: tag_obj %}

{% endfor %}
