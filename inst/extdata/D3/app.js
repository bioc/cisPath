// set up SVG for D3
var width  = 960,
    height = 600,
    colors = d3.scale.category10();

var svg = d3.select("#chart")
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('-webkit-user-select', 'none')
  .style('-moz-user-select', 'none')
  .style('-ms-user-select', 'none')
  .style('-o-user-select', 'none')
  .style('user-select', 'none');

// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [
    {id: 0, size:12, col:'#FF0000', txt: "Protein1", fixed: 0, posx:0, posy:0,txtsize:12, txtcol:'#FF0000',stosize:0,stocol:'#FF0000'},
    {id: 1, size:19, col:'#00FF00', txt: "Protein2", fixed: 0, posx:0, posy:0,txtsize:16, txtcol:'#00FF00',stosize:3,stocol:'#00FF00'},
    {id: 2, size:16, col:'#0000FF', txt: "Protein3", fixed: 0, posx:0, posy:0,txtsize:20, txtcol:'#0000FF',stosize:0,stocol:'#0000FF'}
  ],
  lastNodeId = 2,
  links = [
    {source: nodes[0], target: nodes[1], size: 3, col:'#00FF00', arrow:1, direction:0, dotted:0},
    {source: nodes[1], target: nodes[2], size: 6, col:'#FF0000', arrow:2, direction:0, dotted:1},
    {source: nodes[2], target: nodes[1], size: 5, col:'#0000FF', arrow:0, direction:2, dotted:2}
  ];
nodes = [];
lastNodeId=-1;
  links = [];
// init D3 force layout
var makers = {};
function addMaker(col){
	  if(makers[col]){
	  	 return;
	  }
	  makers[col]=1;
   	svg.append('svg:defs').append('svg:marker')
    .attr('id', col+"1")
    .attr('viewBox', '0 -7 14 14')
    .attr('refX', 6)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'miter ')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('stroke', col)
    .attr('stroke-dasharray', '10,0')
    .attr('fill', col);
    
    svg.append('svg:defs').append('svg:marker')
    .attr('id', col+"2")
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 0)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .attr('stroke-width', 3)
    .attr('stroke-linejoin', 'miter ')
  .append('svg:path')
    .attr('d', 'M0,-5L2,-5L2,5,L0,5,L0,-5')
    .attr('stroke', col)
    .attr('stroke-dasharray', '10,0')
    .attr('fill', col);
}

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(150)
    .distance(100)
    .charge(-120)
    .gravity(.06)
    .charge(-300)
    .on('tick', tick)

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -7 14 14')
    .attr('refX', 6)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('stoken', '#000000')
    .attr('stroke-linejoin', 'miter ')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('stoken', '#000000')
    .attr('fill', '#000000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow2')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 0)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .attr('stoken', '#000000')
    .attr('stroke-linejoin', 'miter ')
    .attr('stoken-width', 8)
  .append('svg:path')
    .attr('d', 'M0,-5L2,-5L2,5,L0,5,L0,-5')
    .attr('stoken', '#000000')
    .attr('fill', '#000000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0')
  .style("stroke-width", '4px')
  .style('stroke', '#000000');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        
        middleX=(d.target.x+d.source.x)/2;
        middleY=(d.target.y+d.source.y)/2;
        
        middleX1=middleX-(normY)*dist/4;
        middleY1=middleY+(normX)*dist/4;
        
        /////////////////////////////
        if(d.direction==1){
        	 middleX1=middleX+(normY)*dist/4;
           middleY1=middleY-(normX)*dist/4;
        }
        /////////////////////////////
        
        /////////////////////////////
        var deltaX1 = middleX1 - d.source.x,
        deltaY1 = middleY1 - d.source.y,
        dist1 = Math.sqrt(deltaX1 * deltaX1 + deltaY1 * deltaY1),
        normX1 = deltaX1 / dist1,
        normY1 = deltaY1 / dist1;
        
        var deltaX2 = d.target.x - middleX1,
        deltaY2 = d.target.y - middleY1,
        dist2 = Math.sqrt(deltaX2 * deltaX2 + deltaY2 * deltaY2),
        normX2 = deltaX2 / dist2,
        normY2 = deltaY2 / dist2,
        /////////////////////////////
        sourcePadding = 5,
        targetPadding = 8+d.target.size;
        if(!d.arrow){
        	 sourcePadding=0;
        	 targetPadding=0;
        }
        sourceX = d.source.x + (sourcePadding * normX1),
        sourceY = d.source.y + (sourcePadding * normY1),
        targetX = d.target.x - (targetPadding * normX2),
        targetY = d.target.y - (targetPadding * normY2);
        dr = dist;
        if(d.direction==2){
        	 sourceX = d.source.x + (sourcePadding * normX),
           sourceY = d.source.y + (sourcePadding * normY),
           targetX = d.target.x - (targetPadding * normX),
           targetY = d.target.y - (targetPadding * normY);
           return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
        }
        return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,"+d.direction+" " + targetX + "," + targetY;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
  //saveInfo();
}
var ctrl_key_flag = 0;
function changeStatus()
{   
	  var object=document.getElementById("ctrlkey");
    if (ctrl_key_flag == 0)
    {
        object.style.borderStyle="inset";
        ctrl_key_flag = 1;
        circle.call(force.drag);
        svg.classed('ctrl', true);
    }
    else
    {
       object.style.borderStyle="";
       ctrl_key_flag = 0;
       circle
        .on('mousedown.drag', null)
        .on('touchstart.drag', null);
        svg.classed('ctrl', false);
    }
}
var save_section=0;
function changeStatus2(){
	  var object=document.getElementById("savesection");
    if (save_section == 0)
    {
        object.style.borderStyle="inset";
        save_section = 1;
        document.getElementById("save_div").style.display="";
    }
    else
    {
        object.style.borderStyle="";
        save_section = 0;
        document.getElementById("save_div").style.display="none";
    }
}
var help_section=0;
function changeStatus3(){
	  var object=document.getElementById("helpsection");
    if (help_section == 0)
    {
        object.style.borderStyle="inset";
        help_section = 1;
        document.getElementById("help_div").style.display="";
    }
    else
    {
        object.style.borderStyle="";
        help_section = 0;
        document.getElementById("help_div").style.display="none";
    }
}
function drawMaker(d){
	if(d.arrow==0){
		 return '';
	}
	addMaker(d.col);
	if(d.arrow==1){
		 return 'url(#' + d.col + '1)';
	}
	if(d.arrow==2){
		 return 'url(#' + d.col + '2)';
	}
}
function drawLine(d){
	if(d === selected_link){
		 return '1,1';
	}
	if(d.dotted==0){
		 return '10,0';
	}
	if(d.dotted==1){
		 return '10,2';
	}
	if(d.dotted==2){
		 return '5,5';
	}
}
function drawCircle(d){
	if(d === selected_node){
		 return '10,2';
	}
	return '10,0';
}
// update graph (called when needed)
function restart() {
  // path (link) group
  path = path.data(links);

  // update existing links
  path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-end', function(d) {return drawMaker(d)})
    .style("stroke-width", function(d) { return d.size; })
    .style('stroke', function(d) { return (0) ? '#666666':d.col; })
    .style('stroke-dasharray', function(d) { return drawLine(d); })
    .style('fill', function(d) { return (d === selected_link) ? 'none':'none'; });

  // add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) { return d === selected_link; })
    //.style('marker-end', function(d) { return d.arrow==1 ? 'url(#end-arrow)' : (d.arrow==2 ? 'url(#end-arrow2)' : ''); })
    .style('marker-end', function(d) {return drawMaker(d)})
    .style('stroke', function(d) { return (0) ? '#666666':d.col; })
    .style("stroke-width", function(d) { return d.size; })
    .style('stroke-dasharray', function(d) { return drawLine(d); })
    .style('fill', function(d) { return (d === selected_link) ? 'none':'none'; })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey||ctrl_key_flag) return;
      // select link
      mousedown_link = d;
      if(mousedown_link === selected_link) selected_link = null;
      else selected_link = mousedown_link;
      selected_node = null;
      restart();
    });

  // remove old links
  path.exit().remove();


  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    .classed('selected', function(d) { return d === selected_node; })
    .attr("r", function(d) {return d.size;})
    .style('fill', function(d) { return (0) ? '#0000FF':d.col; })
    .style('stroke', function(d) { return d.stocol; })
    .style('stroke-width', function(d) { return ((d === selected_node)?(d.stosize==0?1:d.stosize):d.stosize); })
    .style('stroke-dasharray', function(d) { return drawCircle(d); });
    //.classed('reflexive', function(d) { return d.reflexive; });

  // add new nodes
  var g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .classed('selected', function(d) { return d === selected_node; })
    .attr('class', 'node')
    .attr("r", function(d) {return d.size;})
    .style('fill', function(d) { return (0) ? '#0000FF':d.col; })
    .style('stroke', function(d) { return d.stocol; })
    .style('stroke-width', function(d) { return ((d === selected_node)?(d.stosize==0?1:d.stosize):d.stosize); })
    .style('stroke-dasharray', function(d) { return drawCircle(d); })
    //.classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseover', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // enlarge target node
      d3.select(this).attr('transform', 'scale(1.1)');
    })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey||ctrl_key_flag) return;

      // select node
      clickOK();
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null;
      else selected_node = mousedown_node;
      selected_link = null;

      // reposition drag line
      drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .style("stroke-width", '4px')
        .style('stroke', '#000000')
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

      restart();
    })
    .on('mouseup', function(d) {
      if(!mousedown_node) return;

      // needed by FF
      drag_line
        .classed('hidden', true)
        .style('stroke', 'none')
        .style('marker-end', '');

      // check for drag-to-self
      mouseup_node = d;
      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

      // unenlarge target node
      d3.select(this).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      if(1) {
        source = mousedown_node;
        target = mouseup_node;
        //direction = 'right';
      } else {
        source = mouseup_node;
        target = mousedown_node;
        //direction = 'left';
      }

      var link;
      link = links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      if(link) {
        //link[direction] = true;
      } else {
        link = {source: source, target: target, arrow: 1, size:3, direction: 0, col: '#000000', dotted:0};
        //link[direction] = true;
        links.push(link);
      }

      // select new link
      selected_link = link;
      selected_node = null;
      restart();
    });

  // show node IDs
  circle.selectAll('text')
    .attr("x", function(d) { return (0.28*d.size+d.posx)+"mm"; })
    .attr("y", function(d) { return (1.7+d.posy)+"mm"; })
    .style('font-size', function(d) { return d.txtsize+"px"; })   
    .style('fill', function(d) { return d.txtcol; })
    .style('pointer-events', 'none')
    .text(function(d) { return d.txt; });
  g.append('svg:text')
      .attr("x", function(d) { return (0.28*d.size+d.posx)+"mm"; })
      .attr("y", function(d) { return (1.7+d.posy)+"mm"; })
      .attr('class', 'id')
      .style('font-size', function(d) { return d.txtsize+"px"; })
      .style('fill', function(d) { return d.txtcol; })
      .text(function(d) { return d.txt; });

  // remove old nodes
  circle.exit().remove();
  
  //if(d3.event) d3.event.preventDefault();

  // set the graph in motion
  force.start();
  checkSelectNode();
  checkSelectLink();
  saveInfo();
}

function mousedown() {
  // because :active only works in WebKit?
  svg.classed('active', true);

if(d3.event.ctrlKey || mousedown_node || mousedown_link ||ctrl_key_flag) return;

  // insert new node at point
  var point = d3.mouse(this),
      node = {id: ++lastNodeId, posx:0, posy:0, txtsize:12, txtcol:'#000000'};
  node.x = point[0];
  node.y = point[1];
  node.size=16;
  node.col=colors(node.id);
  node.txt="Protein"+(node.id+1);
  node.fixed=1;
  node.stocol='#000000';
  node.stosize=0; 
  nodes.push(node);
  clickOK();
  selected_node=node;
  selected_link=null;
  restart();
}

function mousemove() {
	saveInfo();
  if(!mousedown_node) return;

  // update drag line
  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

  restart();
}

function mouseup() {
	saveInfo();
  if(mousedown_node) {
    // hide drag line
    drag_line
      .classed('hidden', true)
      .style('stroke', 'none')
      .style('pointer-events', 'none')
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars();
  saveInfo();
}

function spliceLinksForNode(node) {
  var toSplice = links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    links.splice(links.indexOf(l), 1);
  });
}

function keydown() {
  // ctrl
  if(document.activeElement.id=="Submit_id"){
  	 return;
  }
  if(document.activeElement.id=="pro_name_id"){
  	 return;
  }
  if(document.activeElement.id=="graphname_id"){
  	 return;
  }
  if(document.activeElement.id.substr(0,3)=="red"){
  	 return;
  }
  if(document.activeElement.id.substr(0,4)=="blue"){
  	 return;
  }
  if(document.activeElement.id.substr(0,5)=="green"){
  	 return;
  }
  if(d3.event.keyCode === 17) {
    circle.call(force.drag);
    svg.classed('ctrl', true);
    if(ctrl_key_flag==0){
  	 document.getElementById("ctrlkey").click();
    }
  }
  if(!selected_node && !selected_link) return;
  //alert(d3.event.keyCode);
  switch(d3.event.keyCode) {
    case 46: // delete
      if(selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
      } else if(selected_link) {
        links.splice(links.indexOf(selected_link), 1);
      }
      selected_link = null;
      selected_node = null;
      restart();
      break;
    case 39: // +
      //alert("big O");
      if(selected_node) {
        // toggle node reflexivity
        selected_node.size = selected_node.size+1;
      } else if(selected_link) {
        // set link direction to right only
        selected_link.size = selected_link.size+1;
      }
      restart();
      break;
   case 37: // -
      //alert("small o");
      if(selected_node) {
        // toggle node reflexivity
        selected_node.size = selected_node.size-1;
        if(selected_node.size < 1){
        	 selected_node.size = 1;
        }
      } else if(selected_link) {
        // set link direction to right only
        selected_link.size = selected_link.size-1;
        if(selected_link.size < 1){
        	 selected_link.size = 1;
        }
      }
      restart();
      break;
   case 48: // )
      if(selected_link) {
        selected_link.direction = 1;
        restart();
      }
      break;
   case 57: // (
      if(selected_link) {
        selected_link.direction = (selected_link.direction+1)%3;
        restart();
      }
      break;
   case 186: // ;
      if(selected_link) {
        selected_link.dotted = (selected_link.dotted+1)%3;
        restart();
      }
      break;
   case 189: // -
      if(selected_link) {
        selected_link.direction = 2;
      }
      restart();
      break;
   case 190: // >
      if(selected_link) {
        selected_link.arrow = (selected_link.arrow+1)%3;
      }
      restart();
      break;
   case 82: // R
      if(selected_node) {
        // toggle node reflexivity
        if(selected_node.stosize==0){
        	 selected_node.stosize = 2;
        }else{
        	 selected_node.stosize = 0;
        }
        restart();        
      } 
      break;
   case 70: // F
      if(selected_node) {
        // toggle node reflexivity
        selected_node.fixed = !selected_node.fixed;
        restart();
      } 
      break;
  }
}

function keyup() {
  // ctrl
  if(d3.event.keyCode === 17) {
    circle
      .on('mousedown.drag', null)
      .on('touchstart.drag', null);
    svg.classed('ctrl', false);
  }
  if(ctrl_key_flag==1){
  	 document.getElementById("ctrlkey").click();
  }
}

// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
restart();
onBegin();

function clickFix(){
   for(var i in nodes){
   	  nodes[i].fixed=1;
   }
}
function clickRelease(){
   for(var i in nodes){
   	  nodes[i].fixed=0;
   }
   force.resume();
}
function addfixButton(){
   var tmp = document.getElementById("fixButton");
   tmp.type="button";
   tmp.value="Release all nodes"; 
}

function checkSelectNode(){
	 if(selected_node==null){
	 	  document.getElementById("table_id1").style.display="none";
	 	  return;
	 }
	 document.getElementById("table_id1").style.display="";
	 // {id: 0, size:12, col:colors(0), txt: "Protein1", fixed: false, posx:0, posy:0,txtsize:12, txtcol:'#FF0000',stosize:0,stocol:'#FF0000'},
	 document.getElementById("pro_name_id").value=selected_node.txt;
	 document.getElementById("red1").value=(""+selected_node.col.charAt(1)+selected_node.col.charAt(2)).toUpperCase();
	 document.getElementById("green1").value=(""+selected_node.col.charAt(3)+selected_node.col.charAt(4)).toUpperCase();
	 document.getElementById("blue1").value=(""+selected_node.col.charAt(5)+selected_node.col.charAt(6)).toUpperCase();
	 document.getElementById("red2").value=(""+selected_node.stocol.charAt(1)+selected_node.stocol.charAt(2)).toUpperCase();
	 document.getElementById("green2").value=(""+selected_node.stocol.charAt(3)+selected_node.stocol.charAt(4)).toUpperCase();
	 document.getElementById("blue2").value=(""+selected_node.stocol.charAt(5)+selected_node.stocol.charAt(6)).toUpperCase();
	 document.getElementById("red3").value=(""+selected_node.txtcol.charAt(1)+selected_node.txtcol.charAt(2)).toUpperCase();
	 document.getElementById("green3").value=(""+selected_node.txtcol.charAt(3)+selected_node.txtcol.charAt(4)).toUpperCase();
	 document.getElementById("blue3").value=(""+selected_node.txtcol.charAt(5)+selected_node.txtcol.charAt(6)).toUpperCase();
}
function changeTxt(obj, newtxt){
   while(obj.lastChild != null){
      obj.removeChild(obj.lastChild);
   }
   obj.appendChild(document.createTextNode(newtxt));
   }
function checkSelectLink(){
	 if(selected_link==null){
	 	  document.getElementById("table_id2").style.display="none";
	 	  return;
	 }
	 document.getElementById("table_id2").style.display="";
	 var tmp1 = document.getElementById("source_id");
	 changeTxt(tmp1, selected_link.source.txt);
	 var tmp2 = document.getElementById("target_id");
	 changeTxt(tmp2, selected_link.target.txt);
	 document.getElementById("red4").value=(""+selected_link.col.charAt(1)+selected_link.col.charAt(2)).toUpperCase();
	 document.getElementById("green4").value=(""+selected_link.col.charAt(3)+selected_link.col.charAt(4)).toUpperCase();
	 document.getElementById("blue4").value=(""+selected_link.col.charAt(5)+selected_link.col.charAt(6)).toUpperCase();
	 
}
function onBegin(){
	 document.getElementById("p_del_id").addEventListener("click", function(e){delete1();}, false);
	 document.getElementById("pro_name_id").addEventListener("change", function(e){clickOK();}, false);
	 document.getElementById("red1").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("green1").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("blue1").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("red2").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("green2").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("blue2").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("red3").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("green3").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("blue3").addEventListener("change", function(e){checkCol(this);}, false);
	 document.getElementById("pro_size1_id").addEventListener("click", function(e){clicksize1();}, false);
	 document.getElementById("pro_size2_id").addEventListener("click", function(e){clicksize2();}, false);
	 document.getElementById("pro_size1_id2").addEventListener("click", function(e){clicksize1_2();}, false);
	 document.getElementById("pro_size2_id2").addEventListener("click", function(e){clicksize2_2();}, false);
	 document.getElementById("pro_size1_id3").addEventListener("click", function(e){txtsize1();}, false);
	 document.getElementById("pro_size2_id3").addEventListener("click", function(e){txtsize2();}, false);
	 document.getElementById("txt_pos_id1").addEventListener("click", function(e){txtPos1();}, false);
	 document.getElementById("txt_pos_id2").addEventListener("click", function(e){txtPos2();}, false);
	 document.getElementById("txt_pos_id3").addEventListener("click", function(e){txtPos3();}, false);
	 document.getElementById("txt_pos_id4").addEventListener("click", function(e){txtPos4();}, false);
	 
	 document.getElementById("red4").addEventListener("change", function(e){checkCol2(this);}, false);
	 document.getElementById("green4").addEventListener("change", function(e){checkCol2(this);}, false);
	 document.getElementById("blue4").addEventListener("change", function(e){checkCol2(this);}, false);
	 document.getElementById("edgesize1_id").addEventListener("click", function(e){edgesize1();}, false);
	 document.getElementById("edgesize2_id").addEventListener("click", function(e){edgesize2();}, false);
	 
	 document.getElementById("curve1_id").addEventListener("click", function(e){selected_link.direction=1;restart();}, false);
	 document.getElementById("curve2_id").addEventListener("click", function(e){selected_link.direction=2;restart();}, false);
	 document.getElementById("curve3_id").addEventListener("click", function(e){selected_link.direction=0;restart();}, false);
	 
	 document.getElementById("arrow1_id").addEventListener("click", function(e){selected_link.arrow=1;restart();}, false);
	 document.getElementById("arrow2_id").addEventListener("click", function(e){selected_link.arrow=2;restart();}, false);
	 document.getElementById("arrow3_id").addEventListener("click", function(e){selected_link.arrow=0;restart();}, false);
	 
	 document.getElementById("dotted1_id").addEventListener("click", function(e){selected_link.dotted=0;restart();}, false);
	 document.getElementById("dotted2_id").addEventListener("click", function(e){selected_link.dotted=1;restart();}, false);
	 document.getElementById("dotted3_id").addEventListener("click", function(e){selected_link.dotted=2;restart();}, false);
	 
	 document.getElementById("del_id").addEventListener("click", function(e){links.splice(links.indexOf(selected_link), 1);restart();}, false);
	 
	 document.getElementById("Submit_id").addEventListener("click", function(e){parseText();}, false);
	 document.getElementById("Refresh_id").addEventListener("click", function(e){restart();}, false);
	 document.getElementById("saveid").value="";
	 document.getElementById("save_div").style.display="none";
	 document.getElementById("help_div").style.display="none";
	 
	 document.getElementById("saveGraphID").addEventListener("click", function(e){saveGraph();}, false);
	 document.getElementById("loadGraphID").addEventListener("click", function(e){loadGraph();}, false);
	 document.getElementById("DeleteGraphID").addEventListener("click", function(e){deleteGraph();}, false);
	 //localStorage.clear();
	 if(navigator.userAgent.indexOf("MSIE")>0) { 
      document.getElementById("cookie_div").style.display="none"; 
   } 
	 doShowAll();
}
function edgesize1(){
	 selected_link.size = selected_link.size+1;
	 restart();
}
function edgesize2(){
	 selected_link.size = selected_link.size-1;
	 if(selected_link.size < 1){
	 	  selected_link.size = 1;
	 }
	 restart();
}
function delete1(){
	 if(selected_node) {
      nodes.splice(nodes.indexOf(selected_node), 1);
      spliceLinksForNode(selected_node);
   }
   selected_node = null;
   restart();
}
function txtPos1(){
	 selected_node.posx--;
	 restart();
}
function txtPos2(){
	 selected_node.posx++;
	 restart();
}
function txtPos3(){
	 selected_node.posy--;
	 restart();
}
function txtPos4(){
	 selected_node.posy++;
	 restart();
}

function clicksize1(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.size = selected_node.size+1;
	 restart();
}
function clicksize2(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.size = selected_node.size-1;
   if(selected_node.size < 1){
      selected_node.size = 1;
   }
   restart();
}
function txtsize1(){
	 if(selected_node==null){
	 	  return;
	 }
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.txtsize = selected_node.txtsize+1;
	 restart();
}
function txtsize2(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.txtsize = selected_node.txtsize-1;
   if(selected_node.txtsize < 0){
      selected_node.txtsize = 0;
   }
   restart();
}
function clicksize1_2(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.stosize = selected_node.stosize+1;
	 restart();
}
function clicksize2_2(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.stosize = selected_node.stosize-1;
   if(selected_node.stosize < 0){
      selected_node.stosize = 0;
   }
   restart();
}
function validChar(chr){
	 if((chr>='0')&&(chr<='9')){
	 	   return 1;
	 }
	 if((chr>='A')&&(chr<='F')){
	 	   return 1;
	 }
	 return 0;
}
function checkCol(object){
	 object.value=object.value.toUpperCase();
	 var str=object.value;
	 if(str.length<2){
	 	  alert("Valid value: 00~FF");
	    checkSelectNode();
	    return;
	 }
	 if(str.length>2){
	 	  object.value=str.substr(str.length-2);
	 	  str=object.value;
	 }
	 if(validChar(str.charAt(0))&&validChar(str.charAt(1))){
	 	   clickOK();
	 	   return;
	 }
	 alert("Valid value: 00~FF");
	 checkSelectNode();
	 
}
function checkCol2(object){
	 object.value=object.value.toUpperCase();
	 var str=object.value;
	 if(str.length<2){
	 	  alert("Valid value: 00~FF");
	    checkSelectLink();
	    return;
	 }
	 if(str.length>2){
	 	  object.value=str.substr(str.length-2);
	 	  str=object.value;
	 }
	 if(validChar(str.charAt(0))&&validChar(str.charAt(1))){
	 	   clickOK2();
	 	   return;
	 }
	 alert("Valid value: 00~FF");
	 checkSelectLink();
	 
}
function clickOK(){
	 if(selected_node==null){
	 	  return;
	 }
	 selected_node.col="#"+document.getElementById("red1").value+document.getElementById("green1").value+document.getElementById("blue1").value;
	 selected_node.stocol="#"+document.getElementById("red2").value+document.getElementById("green2").value+document.getElementById("blue2").value;
	 selected_node.txtcol="#"+document.getElementById("red3").value+document.getElementById("green3").value+document.getElementById("blue3").value;
	 selected_node.txt=document.getElementById("pro_name_id").value;
	 //nodes[selected_node.id]=selected_node;
	 restart();
}
function clickOK2(){
	 if(selected_link==null){
	 	  return;
	 }
	 selected_link.col="#"+document.getElementById("red4").value+document.getElementById("green4").value+document.getElementById("blue4").value;
	 restart();
}
function saveInfo(){
	 if((document.activeElement)&&(document.activeElement.id=="Submit_id")){
  	  return;
   }
	 var string="";
	 for(var i in nodes){
	 	   var nodeInfo=""+nodes[i].id+","+parseInt(nodes[i].x)+","+parseInt(nodes[i].y)+","+nodes[i].size+","+nodes[i].col.toUpperCase()+","+nodes[i].txt+","+nodes[i].fixed;
	 	   nodeInfo=nodeInfo+","+nodes[i].posx+","+nodes[i].posy+","+nodes[i].txtsize+","+nodes[i].txtcol.toUpperCase()+","+nodes[i].stosize+","+nodes[i].stocol.toUpperCase()+"\n";
	 	   string += nodeInfo;
   }
   //{source: nodes[0], target: nodes[1], size: 3, col:'#00FF00', arrow:1, direction:0, dotted:0},
   for(var i in links){
   	   var linkInfo=""+links[i].source.id+","+links[i].target.id+","+links[i].size+","+links[i].col;
   	   linkInfo=linkInfo+","+links[i].arrow+","+links[i].direction+","+links[i].dotted+"\n";
	 	   string += linkInfo;
   }
   if(document.getElementById("saveid").value == string){
   	  return;
   }
	 document.getElementById("saveid").value=string;
}
function parseText(){
	 while(nodes.length!=0){
	 	   nodes.splice(nodes.length-1, 1);
	 }
	 while(links.length!=0){
	 	   links.splice(links.length-1, 1);
	 }
	 var strs= new Array();
	 strs=document.getElementById("saveid").value.split("\n");
   restart();
   lastNodeId=-1;
   var id2index={};
   var nodesFlag=0;
   var linksFlag=0;
	 for(var i in strs){
	 	   var tmps = strs[i].split(",");
	 	   if(tmps.length==13){
	 	   	  nodesFlag=1;
	 	   	  if(linksFlag==1){
	 	   	  	 alert("Wrong format!");
	 	   	  	 return;
	 	   	  }
	 	   	  var node = {id: parseInt(tmps[0]), x:parseInt(tmps[1]),y:parseInt(tmps[2]),size:parseInt(tmps[3]), col:tmps[4], txt:tmps[5], fixed:parseInt(tmps[6]), posx:parseInt(tmps[7]), posy:parseInt(tmps[8]),txtsize:parseInt(tmps[9]), txtcol:tmps[10],stosize:parseInt(tmps[11]),stocol:tmps[12]};
	 	   	  nodes.push(node);
	 	   	  id2index[node.id]=nodes.length-1;
	 	   	  if(parseInt(tmps[0]) >= lastNodeId){
	 	   	  	 lastNodeId=parseInt(tmps[0]);
	 	   	  }
	 	   }
	 	   if(tmps.length==7){
	 	   	  linksFlag=1;
	 	   	  if(nodesFlag==0){
	 	   	  	 alert("Wrong format!");
	 	   	  	 return;
	 	   	  }
	 	   	  var link ={size: parseInt(tmps[2]), col:tmps[3], arrow:parseInt(tmps[4]), direction:parseInt(tmps[5]), dotted:parseInt(tmps[6])};
	 	   	  link.source=nodes[id2index[parseInt(tmps[0])]];
	 	   	  link.target=nodes[id2index[parseInt(tmps[1])]];
	 	   	  links.push(link);
	 	   }
	 }
   selected_node=null;
   selected_link=null;
   restart();
}
function setValue(name,value)
{
  var timestamp = Date.parse(new Date());
  localStorage.setItem(name, ""+timestamp+"#"+value);
}
function getValue(name)
{
  var tmp=localStorage.getItem(name);
  if(tmp==null){
  	 return null;
  }
  return tmp.substr(14); 
}
function getTimestamp(name)
{
  var tmp=localStorage.getItem(name);
  if(tmp==null){
  	 return null;
  }
  return tmp.substr(0,13); 
}
function delValue(name)
{
  return localStorage.removeItem(name);
}
function deleteGraph(){
	var obj = document.getElementById("graphLoad_id");
	if(obj.selectedIndex < 0){
		 alert("Please input a graph name!");
		 return;
	}
	var graphName=obj.options[obj.selectedIndex].text;
	if(graphName==""){
		 alert("Please input a graph name!");
		 return;
	}
	graphName = "cisPathValue#"+graphName;
	delValue(graphName);
	doShowAll();
}
function saveGraph(){
	saveInfo();
	var graphValue=document.getElementById("saveid").value;
	var graphName=document.getElementById("graphname_id").value;
	if(graphName==""){
		 alert("Please input a graph name!");
		 return;
	}
	graphName = "cisPathValue#"+graphName;
	if(getValue(graphName)!=null){
    if(window.confirm('Do you want to replace the old graph?')){
    }else{
       return false;
    }
	}
	setValue(graphName, graphValue);
	doShowAll();
}
function loadGraph(){
	var obj = document.getElementById("graphLoad_id");
	if(obj.selectedIndex < 0){
		 alert("Please input a graph name!");
		 return;
	}
	var graphName=obj.options[obj.selectedIndex].text;
	if(graphName==""){
		 alert("Please input a graph name!");
		 return;
	}
	graphName = "cisPathValue#"+graphName;
  var graphValue=getValue(graphName);
  if(!graphValue){
  	 alert("Failed to find the graph!");
  }
  document.getElementById("graphname_id").value=graphName.substr(13);
	document.getElementById("saveid").value=graphValue;
	parseText();
}
function doShowAll(){
	if(navigator.userAgent.indexOf("MSIE")>0) { 
     return;
   } 
	var tmp=document.getElementById("graphLoad_id");
	tmp.options.length=0;
	var key = "";
  var i=0;
  for(i=0; i<=localStorage.length-1; i++) {
      key = localStorage.key(i);
      var filename=key.substr(13);
      var time=getTimestamp(key);
      var filedate=new Date(parseInt(time));
      var time_str=filedate.toLocaleString();
      var content=filename;
      var option = new Option(content,content);
	 	  option.value = content;
	 	  tmp.options.add(option);
  }
}

