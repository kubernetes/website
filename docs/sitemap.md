---
---
<script language="JavaScript">
var metadata;
var currentTopics;
var sortingBy;
var reverse = true;
var conceptList;
var objectList;
var commandList;
$( document ).ready(function() {
  // When the document loads, get the metadata JSON, and kick off tbl render
  $.get("/metadata.txt", function(data, status) {
    metadata = $.parseJSON(data);
    metadata.pages.sort(dynamicSort("t"));
    mainLogic()
  });
});
function mainLogic()
{
  // If there's a tag filter, change the table/drop down output
  populateDropdowns();
  var tag=window.location.hash.replace("#","");
  console.log(metadata)
  if(tag) {
    tag = $.trim(tag);
    if (tag.indexOf("object=" > -1))
    {
      tag = tag.replace("object=","");
      selectDropDown("o",tag);
      topicsFilter("object",tag);
    }
    if (tag.indexOf("concept=") > -1)
    {
      tag = tag.replace("concept=","");
      selectDropDown("c",tag);
      topicsFilter("concept",tag);
    }
    if (tag.indexOf("command=") > -1)
    {
      tag = tag.replace("command=","");
      selectDropDown("m",tag);
      topicsFilter("command",tag);
    }
  } else {
    currentTopics = metadata.pages;
  }
  renderTable(currentTopics);
}
function populateDropdowns()
{
  // Keeping mainLogic() brief by functionizing the initialization of the
  // drop-down filter boxes
  // Note the parallel ordering between tagName, storedTagsArrays, dropDowns, and metadataArrays
  // They must be in the same order for this to work:
  // 1. conceptsList/.cr/conceptFilter
  // 2. objectList/.or/objectFilter
  // 3. commandList/.mr/commandFilter
  var storedTagsArrays = [conceptList, objectList, commandList];
  var dropDowns = ["#conceptFilter", "#objectFilter", "#commandFilter"];
  var tagName = ["concept","object","command"];
  for(i=0;i<metadata.pages.length;i++)
  {
    var metadataArrays = [metadata.pages[i].cr,metadata.pages[i].or,metadata.pages[i].mr];
    for(j=0;j<metadataArrays.length;j++)
    {
      if (metadataArrays[j]) {
        for (k=0;k<metadataArrays[j].length;k++) {
          if (typeof storedTagsArrays[j] == 'undefined') storedTagsArrays[j] = new Array();
          storedTagsArrays[j][metadataArrays[j][k][tagName[j]]] = true;
          console.log("storing " + metadataArrays[j][k][tagName[j]] + " in " + storedTagsArrays[j])
          // ^ conceptList[metadata.pages[i].cr[k].concept] = true; (if rolling through concepts)
          // ^ conceptList['container'] = true; (ultimate result)
          // ^ objectList[metadata.pages[i].or[k].object] = true; (if rolling through objects)
          // ^ objectList['restartPolicy'] = true; (ultimate result)
        }
      }
    }
  }
  var output = new Array();
  for(i=0;i<dropDowns.length;i++)
  {
    output = [];
    output.push("<select id='" + dropDowns[i] + "DD' onChange='updateSelectedTag(this)'>");
    output.push("<option>---</option>");
    Object.keys(storedTagsArrays[i]).forEach(function (key) {
      output.push("<option>" + key + "</option>");
    });
    output.push("</select>")
    $(dropDowns[i]).html(output.join(""));
  }
}

function selectDropDown(type,tag) {
//
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function renderTable(topiclist)
{
  var output = new Array();
  output.push("<table><thead><tr><th><a class='topicsort'><u style='cursor: pointer; cursor: hand;'>Topic</u></a></th><th><a class='sectionsort'><u style='cursor: pointer; cursor: hand;'>Section</u></a></th><th>Tags</th></tr></thead><tbody>");
  for(n=0;n<topiclist.length;n++) {
    output.push(topicToTableRow(topiclist[n]));
  }
  output.push("</tbody></table>");
  $("#output").html(output.join(""));
  $(".conceptfilter").click(function() {
    topicsFilter("concept",$(this).text());
  })
  $(".objectfilter").click(function() {
    topicsFilter("object",$(this).text());
  })
  $(".commandfilter").click(function() {
    topicsFilter("command",$(this).text());
  })
  $(".topicsort").click(function() {
    if (sortingBy == "topics") {
      if (reverse)
      {
        currentTopics.sort(dynamicSort('t'));
        reverse = false;
      } else {
        currentTopics.sort(dynamicSort('-t'));
        reverse = true;
      }
    } else {
      currentTopics.sort(dynamicSort('t'));
      reverse = false;
    }
    renderTable(currentTopics);
    sortingBy = "topics";
  })
  $(".sectionsort").click(function() {
    if (sortingBy == "section") {
      if (reverse)
      {
        currentTopics.sort(dynamicSort('s'));
        reverse = false;
      } else {
        currentTopics.sort(dynamicSort('-s'));
        reverse = true;
      }
    } else {
      currentTopics.sort(dynamicSort('s'));
      reverse = false;
    }
    renderTable(currentTopics);
    sortingBy = "section";
  })
}
function atScrub(string) { return string.replace(/'/g, "&#39;"); }
function topicToTableRow(topic)
{
  var output = new Array();
  output.push("<tr><td>");
  var title = (topic.g) ? atScrub(topic.g) : atScrub(topic.t);
  output.push("<b><a href='" + topic.u + "' title='" + title + "'>");
  output.push(topic.t);
  output.push("</a></b>");
  if (topic.g) output.push("<br/><span style='color:#999'>" + topic.g + "</span>");
  output.push("</td><td>")
  output.push(topic.s);
  output.push("</td><td>");
  if (topic.cr) {
    output.push("Concepts: ");
    for(i=0;i<topic.cr.length;i++)
    {
      if (i>0) output.push(", ");
      output.push("<a href='/docs/sitemap/#concept=" + topic.cr[i].concept + "' class='conceptfilter'>" + topic.cr[i].concept + "</a>");
    }
  }
  if (topic.or) {
    output.push("<br/>");
    output.push("Objects: ");
    for(i=0;i<topic.or.length;i++)
    {
      if (i>0) output.push(", ");
      output.push("<a href='/docs/sitemap/#object=" + topic.or[i].object + "' class='objectfilter'>" + topic.or[i].object + "</a>");
    }
  }
  if (topic.mr) {
    output.push("<br/>");
    output.push("Commands: ");
    for(i=0;i<topic.mr.length;i++)
    {
      if (i>0) output.push(", ");
      output.push("<a href='/docs/sitemap/#command=" + topic.mr[i].command + "' class='commandfilter'>" + topic.mr[i].command + "</a>");
    }
  }
  output.push("</td></tr>");
  return output.join("");
}
function topicsFilter(type,tag)
{
  console.log(type + ":" + tag);
  currentTopics=[];
  for(i=0;i<metadata.pages.length;i++)
  {
    if(type=="object") var tagsArray = metadata.pages[i].or;
    if(type=="concept") var tagsArray = metadata.pages[i].cr;
    if(type=="command") var tagsArray = metadata.pages[i].mr;
    if (tagsArray)
    {
      for(n=0;n<tagsArray.length;n++)
      {
        if (tagsArray[n][type]==tag) currentTopics.push(metadata.pages[i]);
      }
    }
  }
  if (currentTopics.length==0) currentTopics = metadata.pages;
  renderTable(currentTopics);
}
</script>
<style>
#filters select{
  font-size: 14px;
  border: 1px #000 solid;
}
#filters {
  padding-top: 20px;
}
</style>

Click tags or use the drop downs to filter. Click table headers to sort or reverse sort.

<p id="filters">
Filter by Concept: <span id="conceptFilter" /><br/>
Filter by Object: <span id="objectFilter" /><br/>
Filter by Command: <span id="commandFilter" />
</p>

<div id="output" />


