// set up SVG for D3
var basePath1="./PPIinfo/";
var basePath2="./PPIinfo/";
var localInfo=0;
var width  = 1022,
    height = 400,
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
    .linkDistance(100)
    .distance(60)
    .charge(-20)
    .gravity(.08)
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
  
drag_line
        .classed('hidden', true)
        .style('stroke', 'none')
        .style('marker-end', '');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;
var shift_node1 = null;
var shift_node2 = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}
var id2active={};
//////////////////////////20140524
function updateactives(){
	if(selected_node==null){
		 id2active={};
		 return;
	}
	id2active={};
	id2active[selected_node.id]=1;
	for(x in links){
		  if(links[x].source==selected_node){
		  	 id2active[links[x].target.id]=1;
		  }
		  if(links[x].target==selected_node){
		  	 id2active[links[x].source.id]=1;
		  }
	}
}
//////////////////////////
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
var shift_key_flag = 0;

function changeStatus()
{   
    return; //2014-07-10
	var object=document.getElementById("ctrlkey");
    if (ctrl_key_flag == 0)
    {
        object.style.borderStyle="inset";
        object.style.color='#0000FF';
        ctrl_key_flag = 1;
        circle
        .on('mousedown.drag', null)
        //.on('touchstart.drag', null);
        selected_node = null;
        restart();
    }
    else
    {
       object.style.borderStyle="";
       object.style.color='#000000';
       ctrl_key_flag = 0;
       circle.call(force.drag);
    }
    shift_key_flag=ctrl_key_flag;
    shift_node1 = null;
    shift_node2 = null;
}
function changeStatus6()
{   
	  var object=document.getElementById("shiftkey");
    if (shift_key_flag == 0)
    {
        object.style.borderStyle="inset";
        shift_key_flag = 1;
        selected_node = null;
        selected_link = null;
        mousedown_link = null;
        mousedown_node = null;
        mouseup_node = null;
        shift_node1 = null;
        shift_node2 = null;
        restart();
    }
    else
    {
       object.style.borderStyle="";
       shift_key_flag = 0;
       shift_node1 = null;
       shift_node2 = null;
       changeSouce();  
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
        if(save_section==1){
    	     document.getElementById("savesection").click();
        }
        if(localInfo==1){
           document.getElementById("cookie_div").style.display="none"; 
        } 
        selected_node = null;
        shift_node1 = null;
        shift_node2 = null;
        restart();
    }
    else
    {
        object.style.borderStyle="";
        help_section = 0;
        document.getElementById("help_div").style.display="none";
        if(localInfo==1){
           //document.getElementById("cookie_div").style.display=""; 
        } 
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
		 return '';
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
	return '';
}
// update graph (called when needed)
function restart() {
  updateactives();
  // path (link) group
  force.charge(-200);
  if(nodes.length>=10){
     force.charge(-200);
  }
  if(nodes.length>=50){
     force.charge(-120);
  }
  if(nodes.length>=100){
     force.charge(-80);
  }
  if(nodes.length>=150){
     force.charge(-60);
  }
  if(nodes.length>=200){
     force.charge(-50);
  }
  if(nodes.length>=300){
     force.charge(-38);
  }
  force.charge(-200);
  path = path.data(links);

  // update existing links
  path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-end', function(d) {return drawMaker(d)})
    .style("stroke-width", function(d) { return (d === selected_link) ? d.size+2:d.size;  })
    .style('stroke', function(d) {if((d.source==selected_node)||(d.target==selected_node)){return d.col;};return d.col;})
    .style('stroke-dasharray', function(d) { return drawLine(d); })
    .style('fill', function(d) { return (d === selected_link) ? 'none':'none'; })
    .style('stroke-opacity', function(d) {if(!selected_node){return 1};if((d.source==selected_node)||(d.target==selected_node)){return 1;};return 0.1;});

  // add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) { return d === selected_link; })
    //.style('marker-end', function(d) { return d.arrow==1 ? 'url(#end-arrow)' : (d.arrow==2 ? 'url(#end-arrow2)' : ''); })
    .style('marker-end', function(d) {return drawMaker(d)})
    .style('stroke', function(d) {return (0) ? '#666666':d.col;})
    .style("stroke-width", function(d) { return d.size; })
    .style('stroke-dasharray', function(d) { return drawLine(d); })
    .style('fill', function(d) { return (d === selected_link) ? 'none':'none'; })
    .on('mousedown', function(d) {
      //if((d3.event.ctrlKey||d3.event.metaKey||ctrl_key_flag)) return;
      // select link
      mousedown_link = d;
      if(mousedown_link === selected_link) selected_link = null;
      else selected_link = mousedown_link;
      //selected_node = null;
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
    .style('stroke-dasharray', function(d) { return drawCircle(d); })
    .style('opacity', function(d) {if(!selected_node){return 1};if(id2active[d.id]){return 1;};return 0.1;})
    .style('stroke-opacity', function(d) {if(!selected_node){return 1};if(id2active[d.id]){return 1;};return 0.1;});
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
      if(d3.event.ctrlKey||d3.event.metaKey||ctrl_key_flag){
         d3.select(this).attr('transform', 'scale(1.2)');
      }
    })
    .on('mouseout', function(d) {
    	d3.select(this).attr('transform', '');
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
    })
    .on('mousedown', function(d) {
      //if(d3.event.ctrlKey||d3.event.metaKey||ctrl_key_flag) return;

      // select node
      svg.classed('ctrl', true);
      clickOK();
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null;
      else selected_node = mousedown_node;
      selected_link = null;
      //////////////////////
      if((shift_key_flag==1)&&(selected_node)){
      	 if(!shift_node1){
      	 	  shift_node1=selected_node;
      	 	  shift_node2=null;
      	 }else{
      	 	  if(shift_node1 != selected_node){
      	 	  	 shift_node2=selected_node;
      	 	  }
      	 }
      }
      //////////////////////

      // reposition drag line
      /*if(d3.event.ctrlKey||d3.event.metaKey||ctrl_key_flag){
        drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .style("stroke-width", '4px')
        .style('stroke', '#000000')
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
      }*/
      restart();
    })
    .on('mouseup', function(d) {
    	svg.classed('ctrl', false);
    	// unenlarge target node
      d3.select(this).attr('transform', '');
      if(!mousedown_node) return;

      // needed by FF
      drag_line
        .classed('hidden', true)
        .style('stroke', 'none')
        .style('marker-end', '');
      // check for drag-to-self
      mouseup_node = d;
      if((mouseup_node === mousedown_node)&&(shift_key_flag==0)) {resetMouseVars(); return; }
      if(mouseup_node === mousedown_node){
      	 if((shift_node1)&&(shift_node2)){
      	 	   mousedown_node=shift_node1;
      	 	   mouseup_node=shift_node2;
      	 	   shift_node1=null;
      	 	   shift_node2=null;
      	 	   //document.getElementById("shiftkey").style.borderStyle="";
             //shift_key_flag = 0;
      	 }else{
      	 	   resetMouseVars(); return;
      	 }
      }

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      if(d3.event.ctrlKey||d3.event.metaKey||ctrl_key_flag||shift_key_flag){
        source = mousedown_node;
        target = mouseup_node;
      }else{
      	restart();
      	return;
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
        //links.push(link);//2014-05-23
      }

      // select new link
      selected_link = link;
      //selected_node = null;
      restart();
    });

  // show node IDs
  circle.selectAll('text')
    .attr("x", function(d) { return (0.28*d.size+d.posx)+"mm"; })
    .attr("y", function(d) { return (1.7+d.posy)+"mm"; })
    .style('font-size', function(d) { return d.txtsize+"px"; })   
    .style('fill', function(d) { return d.txtcol; })
    .style('pointer-events', 'none')
    .style('opacity', function(d) {if(!selected_node){return 1};if(id2active[d.id]){return 1;};return 0;})
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
  circle.call(force.drag);
  if(ctrl_key_flag){
  	 circle.on('mousedown.drag', null)
  }
  checkSelectNode();
  checkSelectLink();
  saveInfo();
  changeSouce();
}

function mousedown() {
  // because :active only works in WebKit?
  svg.classed('active', true);
  if(mousedown_link){
  	 //selected_node=null;
  }
  if((mousedown_node||ctrl_key_flag) || mousedown_link) return;
  selected_node=null;
  restart();
  return;
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
  if(shift_key_flag==1){
  	 shift_node1=selected_node;
  }
  //document.getElementById("shiftkey").style.borderStyle="";
  //shift_key_flag = 0;
  restart();
}

function mousemove() {
	saveInfo();
  if(!mousedown_node) return;

  // update drag line
  if(d3.event.ctrlKey || d3.event.metaKey || mousedown_node || mousedown_link ||ctrl_key_flag){
  //drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
  }
  restart();
}

function mouseup() {
	saveInfo();
  if(1) {
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
  if((d3.event.keyCode === 17)||(d3.event.keyCode === 224)||(d3.event.keyCode === 91)||(d3.event.keyCode === 93)){
    circle
      .on('mousedown.drag', null)
      //.on('touchstart.drag', null);
    if(ctrl_key_flag==0){
  	 document.getElementById("ctrlkey").click();
    }
  }
  if(d3.event.keyCode === 16) {
    if(shift_key_flag==0){
  	   document.getElementById("shiftkey").click();
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
      shift_node1=null;
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
  if((d3.event.keyCode === 17)||(d3.event.keyCode === 224)||(d3.event.keyCode === 91)||(d3.event.keyCode === 93)){
    circle.call(force.drag);
    if(ctrl_key_flag==1){
  	 document.getElementById("ctrlkey").click();
    }
  }
  if(d3.event.keyCode === 16) {
    if(shift_key_flag==1){
  	   document.getElementById("shiftkey").click();
    }
    changeSouce(); 
  }
}

// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
window.onload=onBegin; 

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
	 document.getElementById("table_id1").style.display="none";
	 addSelectNodePPI();
}
function changeTxt(obj, newtxt){
   while(obj.lastChild != null){
      obj.removeChild(obj.lastChild);
   }
   obj.appendChild(document.createTextNode(newtxt));
}
function changeSouce(){
	 var obj=document.getElementById("source_name_id");
	 if(!shift_node1){
	 	  changeTxt(obj, "");
	 }else{
	 	  changeTxt(obj, "  source: "+shift_node1.txt);
	 }
}
var allStr=""
function logStr(str){
	 var obj=document.getElementById("log_id");
	 allStr=allStr+"~"+str;
	 changeTxt(obj, allStr);

}
function checkSelectLink(){
	 if(selected_link==null){
	 	  document.getElementById("table_id2").style.display="none";
	 	  //document.getElementById("table_id3").style.display="none";
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
	 document.getElementById("table_id2").style.display="none";
	 //getLinkInfo();
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
	 document.getElementById("red1").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("green1").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("blue1").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("red2").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("green2").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("blue2").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("red3").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("green3").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("blue3").addEventListener("keydown", function(e){pressEnter(this);}, false);
	 document.getElementById("red4").addEventListener("keydown", function(e){pressEnter2(this);}, false);
	 document.getElementById("green4").addEventListener("keydown", function(e){pressEnter2(this);}, false);
	 document.getElementById("blue4").addEventListener("keydown", function(e){pressEnter2(this);}, false);
	 
	 
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
	 document.getElementById("shiftkey").style.display="none";
	 
	 document.getElementById("saveGraphID").addEventListener("click", function(e){saveGraph();}, false);
	 document.getElementById("loadGraphID").addEventListener("click", function(e){loadGraph();}, false);
	 document.getElementById("DeleteGraphID").addEventListener("click", function(e){deleteGraph();}, false);
	 document.getElementById("DeleteAllID").addEventListener("click", function(e){deleteAll();}, false);
	 
	 /////////////////////////////
	 document.getElementById("cookie_div").style.display="none";
	 document.getElementById("ctrlkey").style.display="none";
	 document.getElementById("savesection").style.display="none";
	 document.getElementById("helpsection").style.display="none";
	 document.getElementById("detectPath").disabled=true;
	 document.getElementById("result6waitp").style.display="none";
	 document.getElementById("allShortestPaths").style.display="none";
	 document.getElementById("allShortestPathsP").style.display="none";
	 checkLeftNode();
	 document.getElementById('listgenesDiv').style.display="none";
	 document.getElementById("byStepid0").checked=true;
   document.getElementById("byStepid1").checked=false;
   document.getElementById("table_id3").style.display="none";
   disableInput();
     initCol0();
     initCol1();
	 /////////////////////////////
	 //localStorage.clear();
	 //if(navigator.userAgent.indexOf("MSIE")>0) { 
	 if(testLocal()!=1){
        document.getElementById("cookie_div").style.display="none"; 
     } 
     //showGraph("P04637", 0);
	 doShowAll();
	 if(!(ctrl_key_flag)){
          circle.call(force.drag);
     }
     restart();
     initializeSiders();
     getSwissDetail0();
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
      shift_node1=null;
      shift_node2=null;
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
function pressEnter(object){
	var event = window.event || arguments.callee.caller.arguments[0];
  if(event.keyCode == 13){
     checkCol(object);      
  }
}
function pressEnter2(object){
	var event = window.event || arguments.callee.caller.arguments[0];
  if(event.keyCode == 13){
     checkCol2(object);      
  }
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
function deleteAll(){
	if(window.confirm('Do you want to delete all graphs?')){
  }else{
       return false;
  }
	var validNames=[];
	var i=0;
	for(i=0; i<=localStorage.length-1; i++) {
      key = localStorage.key(i);
      //alert(key);
      if(key.substr(0,13)!="cisPathValue#"){
      	 continue;
      }
      validNames.push(key);
  }
  for(i=0; i < validNames.length; i++){
  	  localStorage.removeItem(validNames[i]);
  }
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
	if(localInfo==0) { 
		 //alert(localInfo);
     return;
  } 
	var tmp=document.getElementById("graphLoad_id");
	tmp.options.length=0;
	var key = "";
  var i=0;
  for(i=0; i<=localStorage.length-1; i++) {
      key = localStorage.key(i);
      //alert(key);
      if(key.substr(0,13)!="cisPathValue#"){
      	 continue;
      }
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
function testLocal(){
	try{
		var value_str="";
	    localStorage.setItem("easytest", "test");
	    value_str=localStorage.getItem("easytest");
	    if(value_str != "test"){
	    	 localInfo=0;
		     return 0;
	    }
	}
	catch(err){
		  localInfo=0;
		  return 0;
	}
	localInfo=1;
	return 1;
}
function getRealName(nameStr){
   var tmp_names = nameStr.split(":");
   var real_name = tmp_names[0];
   var swiss_prot = real_name;
   if(tmp_names[1]){
      swiss_prot = tmp_names[1];
   }
   return real_name;
}

function timerFun2(){
    showLink=1;
}
function timerFun(){
    document.getElementById("chart").style.display = "";
    restart();
}
function getCol(group){
  if(group > 1000){
     return leafNodeCol;
  }
  var len=mainNodeCols.length;
  var idx=(group)%len;
  idx=pathLen-1-idx;
  idx=idx%len;
  return mainNodeCols[idx];
}
function checkPPI(id1, id2){
	var tmp=PPI_info[id1];
	if((jQuery.inArray(parseInt(id2), tmp)) == -1){
      return 0;
  }
  return 1;
}
function addOneLink(node1, node2){
	if(node1==node2){
		 return;
	}
  var newLink = {col:'#666666', arrow:0, direction:2, dotted:0};
	newLink.source=nodes[node1];
	newLink.target=nodes[node2];
	newLink.size= 2;
	newLink.col='#666666';
	links.push(newLink);
}
var sourceSwiss="";
var targetSwiss="";
function getLinkInfo(){
	if(selected_link==null){
	 	 document.getElementById("table_id2").style.display="none";
	 	 document.getElementById("table_id3").style.display="none";
	 	 document.getElementById("table_id3P").style.display="none";
	 	 return;
	}
	document.getElementById("table_id3").style.display="none";
	document.getElementById("table_id3P").style.display="none";
	sourceSwiss=selected_link.source.swiss;
	targetSwiss=selected_link.target.swiss;
	var url=basePath2+sourceSwiss+".js";
	$.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    success:function(json){
    	var E1="";
    	var E2="";
    	if(json["Evidence1"][targetSwiss]){
    		 E1=json["Evidence1"][targetSwiss];
      }
      if(json["Evidence2"][targetSwiss]){
    		 E2=json["Evidence2"][targetSwiss];
      }
      addLinkInfo(sourceSwiss,targetSwiss,E1,E2);
    },
    error: function(XHR, textStatus, errorThrown) {
      alert("Network Error! Please try again!");
    }
  });
}
function addLinkInfo(S1,S2,E1,E2){
	 if(selected_link==null){
	 	  document.getElementById("table_id2").style.display="none";
	 	  document.getElementById("table_id3").style.display="none";
	 	  document.getElementById("table_id3P").style.display="none";
	 	  return;
	 }
	 var table=document.getElementById("table_id3");
	 while(table.lastChild != null){
         table.removeChild(table.lastChild);
   }
	 var mycurrent_row = document.createElement("tr");
   var mycurrent_cell;
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode("Source"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode("Target"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode("Evidence"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode("PubMed IDs"));
   mycurrent_row.appendChild(mycurrent_cell);
   table.appendChild(mycurrent_row);
   
   var source = S1;
   var target = S2;
   mycurrent_row = document.createElement("tr");
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.width=100;
   myLink = document.createElement("a");
   myLink.href = "http://www.uniprot.org/uniprot/"+source;
   myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
   myLink.appendChild(document.createTextNode(swiss2name[source]));
   mycurrent_cell.appendChild(myLink); 
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.width=100;
   myLink = document.createElement("a");
   myLink.href = "http://www.uniprot.org/uniprot/"+target;
   myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
   myLink.appendChild(document.createTextNode(swiss2name[target]));
   mycurrent_cell.appendChild(myLink);  
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode(strChange1(E2)));
   mycurrent_cell.align = 'center';
   mycurrent_row.appendChild(mycurrent_cell);
   if(E1!=""){
       mycurrent_cell = document.createElement("td");
       mycurrent_cell.className = "pubmed";
       mycurrent_cell.align = 'center';
       var tmp_m = E1.split(",");
       var first_a = 1;
       for(x in tmp_m) {
           if(first_a == 0){
              mycurrent_cell.appendChild(document.createTextNode(", "));
           }
           myLink = document.createElement("a");
           myLink.href = '#';
           if(execReg(/^\d+$/,tmp_m[x])){
              myLink.href = 'http://www.ncbi.nlm.nih.gov/pubmed/'+tmp_m[x];
           }
           if(execReg(/^10\./,tmp_m[x])){
              myLink.href = 'http://dx.doi.org/'+tmp_m[x];
           }
           myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
           myLink.appendChild(document.createTextNode(tmp_m[x]));
           mycurrent_cell.appendChild(myLink);
           first_a = 0;
       }
       mycurrent_row.appendChild(mycurrent_cell);
   }
   else{
      mycurrent_cell = document.createElement("td");
      mycurrent_cell.appendChild(document.createTextNode("Not presented"));
      mycurrent_cell.align = 'center';
      mycurrent_row.appendChild(mycurrent_cell);
   } 
   table.appendChild(mycurrent_row);
   document.getElementById("table_id3").style.display="";
   document.getElementById("table_id3P").style.display="";
}
function execReg(reg,str){
   var result =  reg.exec(str);
   return result;
}
function strChange1(str){
   var tmp =str;
   var parter=/,/g;
   tmp=tmp.replace(parter,", ");
   return tmp;
}
var showLinkInfoFirst=0;
var showLinkInfoEnd=10;
function showLinkInfo10(){
    calcurLinkInfoBeginEnd();
    var p=document.getElementById("table_id3P");
	while(p.lastChild != null){
       p.removeChild(p.lastChild);
    }
    addResultLinkInfo10(p);
    addFirstLinkInfo10(p);
    addPreviousLinkInfo10(p);
    addNextLinkInfo10(p);
    addLastLinkInfo10(p);
}
/////////////////////////////////////////////////////////////////
function addResultLinkInfo10(p){
	var resultSPAN = document.createElement("span");
    var content="Results: "+showLinkInfoFirst+"-"+showLinkInfoEnd+" of "+swissTarNums.length+" ";
    resultSPAN.appendChild(document.createTextNode(content));
    p.appendChild(resultSPAN);
}
function addFirstLinkInfo10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
	resultSPAN.value="|<";
    resultSPAN.appendChild(document.createTextNode("First"));
    if(showLinkInfoFirst==0){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    resultSPAN.addEventListener("click", function(e){showLinkInfoFirst=0;showLinkInfo10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addLastLinkInfo10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
	resultSPAN.value=">|";
	var newFirst=(swissTarNums.length-swissTarNums.length%10);
	if(newFirst==swissTarNums.length){
	   newFirst=swissTarNums.length-10;
	}
	if(newFirst < 0){
	   newFirst = 0;
	}
    resultSPAN.appendChild(document.createTextNode("Last"));
    if(showLinkInfoEnd==swissTarNums.length){
	   p.appendChild(resultSPAN);
	   resultSPAN.className = "linkindex";
	   resultSPAN.disabled="disabled";
	   return;
	}
    resultSPAN.addEventListener("click", function(e){showLinkInfoFirst=newFirst;showLinkInfo10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addPreviousLinkInfo10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
    resultSPAN.value="<";
    if(showLinkInfoFirst==0){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    var newFirst=showLinkInfoFirst-10;
    if(newFirst < 0){
    	 newFirst = 0;
    }
    resultSPAN.addEventListener("click", function(e){showLinkInfoFirst=newFirst;showLinkInfo10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addNextLinkInfo10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
    resultSPAN.value=">";
    if(showLinkInfoEnd==swissTarNums.length){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    var newFirst=showLinkInfoFirst+10;
    if(newFirst >= swissTarNums.length){
       newFirst = (swissTarNums.length-swissTarNums.length%10);
    }
    resultSPAN.addEventListener("click", function(e){showLinkInfoFirst=newFirst;showLinkInfo10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
/////////////////////////////////////////////////////////////////
function calcurLinkInfoBeginEnd(){
	var total=swissTarNums.length;
	if(showLinkInfoFirst >= total){
	   showLinkInfoFirst=(total-total%10);
	}
	if(showLinkInfoFirst == total){
	   showLinkInfoFirst = total-10;
	}
    if(showLinkInfoFirst < 0){
	   showLinkInfoFirst = 0;
	}
	showLinkInfoFirst=showLinkInfoFirst-(showLinkInfoFirst%10);
	showLinkInfoEnd=showLinkInfoFirst+10;
	if(showLinkInfoEnd > total){
	   showLinkInfoEnd = total;
	}
	for(var i=0;i<total;i++){
	  	document.getElementById("linkrow"+i).style.display="none";
	}
    for(var i=showLinkInfoFirst;i<showLinkInfoEnd;i++){
        document.getElementById("linkrow"+i).style.display="";
    }
}
//////////////////////////////////////////////////////////////////
function getLinkInfo2Res(json){
    addLinkHeader();
    for(x in swissTarNums){
    	var E1="";
    	var E2="";
        var swiss2=swissTarNums[x];
    	if(json["Evidence1"][swiss2]){
    	   E1=json["Evidence1"][swiss2];
        }
        if(json["Evidence2"][swiss2]){
    	   E2=json["Evidence2"][swiss2];
        }
        addLinkInfo2(swiss1,swiss2,E1,E2, x);
    }
    showLinkInfoFirst=0;
    showLinkInfo10();
}
function getLinkInfo2(){
	if(selected_node==null){
	   document.getElementById("table_id2").style.display="none";
	   document.getElementById("table_id3").style.display="none";
	   document.getElementById("table_id3P").style.display="none";
	   return;
	}
	document.getElementById("table_id3").style.display="none";
	document.getElementById("table_id3P").style.display="none";
	var url=basePath2+swiss1+".js";
	$.jsonp({ 
       url: url,
       callback: "cisPathCallBack",
       success:function(json){
           if(this.url==(basePath2+swiss1+".js")){
              getLinkInfo2Res(json);
           }
    },
    error: function(XHR, textStatus, errorThrown) {
       alert("There is something wrong. Please try again!");
    }
  });
}
var selected_PPI_node=null;
var swiss1="";
var swissTarNums=[];
function addSelectNodePPI(){
	 if(selected_node==null){
	 	  //document.getElementById("table_id3").style.display="none";
	 	  return;
	 }
	 if(selected_PPI_node!=null){
	 	  if(selected_PPI_node.id==selected_node.id){
	 	  	 if(document.getElementById("table_id3").style.display!="none"){
	 	  	 	return;
	 	  	 }
	 	  }
	 }
	 //debugObj(selected_node);
	 selected_PPI_node=selected_node;
	 swiss1=selected_node.swiss;
	 swissTarNums=[];
	 for(x in links){
	 	   var swiss2="";
	 	   if(links[x].source==selected_node){
	 	   	  swiss2=links[x].target.swiss;
	 	   }
	 	   if(links[x].target==selected_node){
	 	   	  swiss2=links[x].source.swiss;
	 	   }
	 	   if(swiss2!=""){
	        swissTarNums.push(swiss2);
	     }
	 }
	 getLinkInfo2();
} 
function addLinkHeader(){
   var table=document.getElementById("table_id3");
	while(table.lastChild != null){
         table.removeChild(table.lastChild);
   }
   var mycurrent_row = document.createElement("tr");
   var mycurrent_cell;
   mycurrent_cell = document.createElement("th");
   mycurrent_cell.appendChild(document.createTextNode("Source"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("th");
   mycurrent_cell.appendChild(document.createTextNode("Target"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("th");
   mycurrent_cell.appendChild(document.createTextNode("Evidence"));
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("th");
   mycurrent_cell.appendChild(document.createTextNode("PubMed IDs"));
   mycurrent_row.appendChild(mycurrent_cell);
   table.appendChild(mycurrent_row);
}
function addLinkInfo2(S1,S2,E1,E2, id_index){
   var table=document.getElementById("table_id3");
   var source = S1;
   var target = S2;
   mycurrent_row = document.createElement("tr");
   mycurrent_row.id="linkrow"+id_index;
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.width=100;
   myLink = document.createElement("a");
   myLink.href = "http://www.uniprot.org/uniprot/"+source;
   myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
   myLink.appendChild(document.createTextNode(swiss2name[source]));
   mycurrent_cell.appendChild(myLink); 
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.width=100;
   myLink = document.createElement("a");
   myLink.href = "http://www.uniprot.org/uniprot/"+target;
   myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
   myLink.appendChild(document.createTextNode(swiss2name[target]));
   mycurrent_cell.appendChild(myLink);  
   mycurrent_row.appendChild(mycurrent_cell);
   mycurrent_cell = document.createElement("td");
   mycurrent_cell.appendChild(document.createTextNode(strChange1(E2)));
   mycurrent_cell.align = 'center';
   mycurrent_row.appendChild(mycurrent_cell);
   if(E1!=""){
       mycurrent_cell = document.createElement("td");
       mycurrent_cell.className = "pubmed";
       mycurrent_cell.align = 'center';
       var tmp_m = E1.split(",");
       var first_a = 1;
       for(x in tmp_m) {
           if(first_a == 0){
              mycurrent_cell.appendChild(document.createTextNode(", "));
           }
           myLink = document.createElement("a");
           myLink.href = '#';
           if(execReg(/^\d+$/,tmp_m[x])){
              myLink.href = 'http://www.ncbi.nlm.nih.gov/pubmed/'+tmp_m[x];
           }
           if(execReg(/^10\./,tmp_m[x])){
              myLink.href = 'http://dx.doi.org/'+tmp_m[x];
           }
           myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
           myLink.appendChild(document.createTextNode(tmp_m[x]));
           mycurrent_cell.appendChild(myLink);
           first_a = 0;
       }
       mycurrent_row.appendChild(mycurrent_cell);
   }
   else{
      mycurrent_cell = document.createElement("td");
      mycurrent_cell.appendChild(document.createTextNode("Not presented"));
      mycurrent_cell.align = 'center';
      mycurrent_row.appendChild(mycurrent_cell);
   } 
   table.appendChild(mycurrent_row);
   document.getElementById("table_id3").style.display="";
   document.getElementById("table_id3P").style.display="";
}
function debugObj(object){
      return;
	  var output=JSON.stringify(object);
	  document.getElementById("debugOuput").appendChild(document.createTextNode(output));
	  document.getElementById("debugOuput").appendChild(document.createElement('br'));
}
function debugOutput(content){
      return;
	  document.getElementById("debugOuput").appendChild(document.createTextNode(content));
	  document.getElementById("debugOuput").appendChild(document.createElement('br'));
}
function checkGoogleDriver(){
  var url=basePath2+"A0A5B9.js";
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:10000,
    success:function(json){
        debugObj("Success:"+this.url);
        debugObj("basePath1:"+basePath1);
        loadExist();
    },
    error: function(XHR, textStatus, errorThrown) {
        basePath1="../geneset20140628/";
        basePath2="../20140628PPI/";
        debugObj("basePath1:"+basePath1);
        loadExist();
    }
  });
}
////////////////////////////////////////////////////////////////////////////
var mainNodes=[];
var swissDeatilSwiss2gene={};
var swissDeatilSwiss2swiss={};
var swissDeatilGene2swiss={};
var url2retry0={};
function getSwissDetail0(){
  var url=basePath2+"gene2swiss.js";
  url2retry0[url]=5;
  loadfileCount1=0;
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry0[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilGene2swiss=json;
    	getSwissDetail1();
    	url2retry0[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail0Retry(this.url);
    }
  });
}
function getSwissDetail0Retry(urltry){
  var url=urltry;
  if(url2retry0[url]==100){
     return;
  }
  url2retry0[url]=url2retry0[url]-1;
  if(url2retry0[url]<=0){
     debugObj("Failed:"+url);
     alert("Network Error! Please check your network connection!");
     return;
  }
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry0[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilGene2swiss=json;
    	getSwissDetail1();
    	url2retry0[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail0Retry(this.url);
    }
  });
}
var url2retry1={};
function getSwissDetail1(){
	var url=basePath2+"swiss2gene.js";
	url2retry1[url]=5;
	var p=document.getElementById("result1waitp");
	addProgressSpan2(p,1,5);
	$.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry1[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilSwiss2gene=json;
    	getSwissDetail2();
    	url2retry1[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail1Retry(this.url);
    }
  });
}
function getSwissDetail1Retry(urltry){
  var url=urltry;
  if(url2retry1[url]==100){
     return;
  }
  url2retry1[url]=url2retry1[url]-1;
  if(url2retry1[url]<=0){
     debugObj("Failed:"+url);
     alert("Network Error! Please check your network connection!");
     return;
  }
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry1[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilSwiss2gene=json;
    	getSwissDetail2();
    	url2retry1[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail1Retry(this.url);
    }
  });
}
var url2retry2={};
function getSwissDetail2(){
	var url=basePath2+"swiss2swiss.js";
	url2retry2[url]=5;
	var p=document.getElementById("result1waitp");
	addProgressSpan2(p,2,5);
	$.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry2[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilSwiss2swiss=json;
    	getPPIinfo();
    	url2retry2[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail2Retry(this.url);
    }
  });
}
function getSwissDetail2Retry(urltry){
  var url=urltry;
  if(url2retry2[url]==100){
     return;
  }
  url2retry2[url]=url2retry2[url]-1;
  if(url2retry2[url]<=0){
     debugObj("Failed:"+url);
     alert("Network Error! Please check your network connection!");
     return;
  }
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry2[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	swissDeatilSwiss2swiss=json;
	    getPPIinfo();
    	url2retry2[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getSwissDetail2Retry(this.url);
    }
  });
}
var PPI_info={};
var PPI_score={};
var PPI_swissNums=[];
var PPI_swiss2id=[];
var url2retry3={};
var swiss2swissInfo={};
function getPPIinfo(){
    var p=document.getElementById("result1waitp");
	addProgressSpan2(p,3,5);
	PPI_finish=0;
	PPI_swiss2id={};
	PPI_info={};
	PPI_score={};
	PPI_id2swiss=[];
	var url=basePath1+"PPI.js";
	url2retry3[url]=5;
	$.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:100000,
    success:function(json){
        if(url2retry3[url]==100){
           return;
        }
        url2retry3[url]=100;
        debugObj("Success:"+this.url);
    	PPI_swissNums=json.swissNums;
    	PPI_info=json.PPI;
    	PPI_score=json.Scores;
    	var p=document.getElementById("result1waitp");
	    addProgressSpan2(p,4,5);
	    processPPIFile();
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getPPIinfoRetry(this.url);
    }
  });
}
function getPPIinfoRetry(urltry){
	var url=urltry;
    if(url2retry3[url]==100){
       return;
    }
    url2retry3[url]=url2retry3[url]-1;
    if(url2retry3[url]<=0){
       debugObj("Failed:"+url);
       alert("Network Error! Please check your network connection!");
       return;
    }
    PPI_finish=0;
	PPI_swiss2id={};
	PPI_info={};
	PPI_id2swiss=[];	
	$.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:100000,
    success:function(json){
        if(url2retry3[url]==100){
           return;
        }
        url2retry3[url]=100;
        debugObj("Success:"+this.url);
    	PPI_swissNums=json.swissNums;
    	PPI_info=json.PPI;
    	var p=document.getElementById("result1waitp");
	    addProgressSpan2(p,4,5);
	    processPPIFile();
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getPPIinfoRetry(this.url);
    }
  });
}
function addProgressSpan2(p, num1, num2){
	var resultSPAN = document.createElement("span");
    var content="Loading necessary files: "+num1+" of "+num2;
    resultSPAN.appendChild(document.createTextNode(content));
    while(p.lastChild != null){
        p.removeChild(p.lastChild);
    }
    p.appendChild(resultSPAN);
    p.style.display="";
}
function processPPIFile(){
    PPI_swiss2id={};
    swiss2swissInfo={};
	for(x in PPI_swissNums){
	  	PPI_swiss2id[PPI_swissNums[x]]=x;
	}
	for(x in PPI_info){
	    var swiss1=PPI_swissNums[x];
	    for(y in PPI_info[x]){
	        var swiss2=PPI_swissNums[PPI_info[x][y]];
	        var edgeValue=PPI_score[x][y];
	        if(!swiss2swissInfo.hasOwnProperty(swiss1)){
	           swiss2swissInfo[swiss1]={};
	        }
	        swiss2swissInfo[swiss1][swiss2]=edgeValue;
	    }
	}
	getCisPathJS();
}
function addGeneListExp(){
	  var exampleTxt="DMD,IFT80,CDH3,CAPN3,CNBP,NAGA,DCN,DAG1,GSN,KRT3,LAMA2\nMYH7,RLBP1,TIMP3,FLNA,EMD,OPN1MW,RPGR,SGCA,GUCA1A\n";
	  exampleTxt=exampleTxt+"Q16585, Q13956, Q15149, Q99456, Q15582, Q86U42, Q6NZI2, O95461";
	  if(1){
	     exampleTxt="TP53, DNAJB6 NPM1 MAPK3 PSME3 CSNK2B GH1 BAI1 TFAP2A  CDH1 SFN TP53BP2 MAGI1";
	     document.getElementById("showleafid").checked=false;
       document.getElementById("showleafid2").checked=false;
       document.getElementById("showleafid2").disabled=true;
	  }
	  document.getElementById("geneListText").value=exampleTxt;
	  addGeneList();
}
var mainNodeSize=12;
var mainNodetxtSize=12;
var swiss2mainPPITimes={};
var leafNodes=[];
var leafNodeSize=6;
var leafNodetxtSize=12;
var leafNodecol="#2CA02C";
var swiss2name={};
function generateNetwork(){
     while(nodes.length!=0){
	 	   nodes.splice(nodes.length-1, 1);
	 }
	 while(links.length!=0){
	 	   links.splice(links.length-1, 1);
	 }
	 restart();
      swiss2mainPPITimes={};
      //alert(JSON.stringify(mainNodes));
      for(x in mainNodes){
          var geneSymbol=mainNodes[x];
          if(swissDeatilSwiss2gene.hasOwnProperty(geneSymbol)){
		     geneSymbol=swissDeatilSwiss2gene[geneSymbol];
	      }
          var newNode = {id:(nodes.length), fixed: 0, posx:0, posy:0, txtsize:mainNodetxtSize , size:mainNodeSize, txtcol:'#000000', stosize:2,stocol:'#000000'};
          if(mainNodeCol.length==1){
             newNode.col=mainNodeCol[0];
          }else{
             newNode.col=mainNodeCol[x%(mainNodeCol.length)];
          }
  	      //newNode.stocol=mainNodecol;
  	      newNode.txt=geneSymbol;
  	      newNode.swiss=mainNodes[x];
  	      newNode.mainNode=1;
  	      swiss2name[newNode.swiss]=newNode.txt;
  	      nodes.push(newNode);
  	      if(!swiss2swissInfo.hasOwnProperty(mainNodes[x])){
  	         continue;
  	      }
  	      for(y in swiss2swissInfo[mainNodes[x]]){
  	          var swiss2=y;
  	          if(!swiss2mainPPITimes.hasOwnProperty(swiss2)){
  	             swiss2mainPPITimes[swiss2]=0;
  	          }
  	          swiss2mainPPITimes[swiss2]=swiss2mainPPITimes[swiss2]+1;
  	      }
      }
      //debugObj(nodes);
      //alert(JSON.stringify(swiss2mainPPITimes));
      leafNodes=[];
      if(document.getElementById("showleafid").checked){
        $.each(swiss2mainPPITimes,function(k,v){
          if(v>=2){
             if((jQuery.inArray(k, mainNodes)) == -1){
                 leafNodes.push(k);
             }
          }
        });
      }
      //alert(JSON.stringify(leafNodes));
      for(x in leafNodes){
          var geneSymbol=leafNodes[x];
          if(swissDeatilSwiss2gene.hasOwnProperty(geneSymbol)){
		     geneSymbol=swissDeatilSwiss2gene[geneSymbol];
	      }
          var newNode = {id:(nodes.length), fixed: 0, posx:0, posy:0, txtsize:leafNodetxtSize , size:leafNodeSize, txtcol:'#000000', stosize:1,stocol:'#000000'};
          if(leafNodeCol.length==1){
             newNode.col=leafNodeCol[0];
          }else{
             newNode.col=leafNodeCol[x%(leafNodeCol.length)];
          }
  	      //newNode.stocol=leafNodecol;
  	      newNode.txt=geneSymbol;
  	      newNode.swiss=leafNodes[x];
  	      newNode.mainNode=0;
  	      swiss2name[newNode.swiss]=newNode.txt;
  	      nodes.push(newNode);
      }
      //debugObj("===========================================");
      //debugObj(nodes);
      for(var x=0; x < nodes.length; x++){
          for(var y=x+1; y < nodes.length; y++){
              if(!swiss2swissInfo.hasOwnProperty(nodes[x].swiss)){
  	             continue;
  	          }
  	          if(swiss2swissInfo[nodes[x].swiss].hasOwnProperty(nodes[y].swiss)){
  	             addOneLink(x, y);
  	          }
          }
      }
      restart();
}
function addOneLink(node1, node2){
  if(node1==node2){
	 return;
  }
  var newLink = {col:'#666666', arrow:0, direction:2, dotted:0};
  newLink.source=nodes[node1];
  newLink.target=nodes[node2];
  newLink.size= 2;
  newLink.col='#666666';
  if(nodes[node1].mainNode+nodes[node2].mainNode==0){
     if(document.getElementById("showleafid2").checked==false){
        return;
     }
  }
  if(nodes[node1].mainNode+nodes[node2].mainNode==2){
     newLink.size= 4;
     newLink.col='#000000';
  }
  links.push(newLink);
}
function addOneMainNode(geneTmp){
	var tmp=geneTmp;
	var validSwiss="";
	var validName="";
	if(swissDeatilGene2swiss[tmp]){
		 validSwiss=swissDeatilGene2swiss[tmp];
		 validName=tmp;
	}
	if(swissDeatilSwiss2swiss[tmp]){
		 validSwiss=swissDeatilSwiss2swiss[tmp];
		 validName=validSwiss;
		 if(swissDeatilSwiss2gene[validSwiss]){
		 	  validName=swissDeatilSwiss2gene[validSwiss];
		 }
	}
	if((jQuery.inArray(validSwiss, mainNodes)) == -1){
        mainNodes.push(validSwiss);
    }
}
function addGeneList(){
	  var tmpTxt=document.getElementById("geneListText").value;
	  if(tmpTxt==""){
	  	 alert("Please input a valid gene name or Swiss-Prot number!");
	  	 return;
	  }
	  mainNodes=[]
	  leafNodes=[];
	  var genesTmp=tmpTxt.split(/[\s,\n]+/);
	  var invliadInputs=[];
	  for(x in genesTmp){
	  	  if(genesTmp[x]==""){
	  	  	 continue;
	  	  }
	  	  if(checkValidInput(genesTmp[x])==0){
	  	  	 invliadInputs.push(genesTmp[x]);
	  	  	 continue;
	  	  }
	  	  addOneMainNode(genesTmp[x]);
	  } 
	  generateNetwork();
	  if(invliadInputs.length==0){
	  	 return;
	  }
	  if(invliadInputs.length==1){
	  	 alert("#"+invliadInputs[0]+"#"+" is not a valid gene name or Swiss-Prot number!");
	  	 return;
	  }
	  var validWar="";
	  for(x in invliadInputs){
	  	  if(validWar!=""){
	  	  	 validWar=validWar+",";
	  	  }
	  	  validWar=validWar+invliadInputs[x];
	  }
	  alert(validWar+" are not valid gene names or Swiss-Prot numbers!");
}
function checkValidInput(inputStr){
	  var validSwiss="";
	  var validName="";
	  if(swissDeatilGene2swiss[inputStr]){
		   validSwiss=swissDeatilGene2swiss[inputStr];
		   validName=inputStr;
	  }
	  if(swissDeatilSwiss2swiss[inputStr]){
		   validSwiss=swissDeatilSwiss2swiss[inputStr];
		   validName=validSwiss;
		   if(swissDeatilSwiss2gene[validSwiss]){
		 	    validName=swissDeatilSwiss2gene[validSwiss];
		   }
	  }
	  if(validSwiss==""){
		   return 0;
	  }
	  return 1;
}
function checkLeftNode(){
      if(document.getElementById("showleafid").checked==false){
         document.getElementById("showleafid2").checked=false;
         document.getElementById("showleafid2").disabled=true;
      }else{
         document.getElementById("showleafid2").disabled=false;
      }
}
function debugObj(object){
      return;
	  var output=JSON.stringify(object);
	  document.getElementById("debugOuput").appendChild(document.createTextNode(output));
	  document.getElementById("debugOuput").appendChild(document.createElement('br'));
}
function debugOutput(content){
      return;
	  document.getElementById("debugOuput").appendChild(document.createTextNode(content));
	  document.getElementById("debugOuput").appendChild(document.createElement('br'));
}
function refreshSize1(event, ui) {
    width=ui.value;
    $("#slider0s").text("Width = " + width);
    force.size([width, height]);
    document.getElementById("chartfather").style.width=width+2+"px";
    document.getElementById("chart").style.width=width+2+"px";
    svg.attr('width', width);
    restart();
}
function refreshSize2(event, ui) {
    height=ui.value;
    $("#slider1s").text("Height = " + height);
    force.size([width, height]);
    document.getElementById("chartfather").style.height=height+2+"px";
    document.getElementById("chart").style.height=height+2+"px";
    svg.attr('height', height);
    restart();
}
function initializeSiders()
{
    $("#slider0").slider(
    {
        orientation : "horizontal",
        slide : refreshSize1,
        max : 2000,
        min : 500,
        step : 10,
        value : width
    }
    );
    
    $("#slider1").slider(
    {
        orientation : "horizontal",
        slide : refreshSize2,
        max : 2000,
        min : 400,
        step : 10,
        value : height
    }
    );
}
function openEditor(){
    if(testLocal()==0){
       alert("Sorry, this browser does not support HTML5 storage!");
       var link_address="./easyEditor.html";
       window.open(link_address,'_blank');
       return;
    }
    var graphName="cisPathHTML";
    document.getElementById("graphname_id").value=graphName;
    saveGraph();
    var link_address="./easyEditor.html";
    window.open(link_address,'_blank');
}
///////////////////////////////////////////////////////////////////////shortest path
///////////////////////////////////////////////////////////////////////2014-07-12
function checkValid(Name){
    if(swissDeatilSwiss2swiss.hasOwnProperty(Name)){
       return 1;
    }
    if(swissDeatilGene2swiss.hasOwnProperty(Name)){
       return 1;
    }
    return 0;
}
var input1Valid=0;
var input2Valid=0;
function entersearch(event){
	  checkValid1();
	  checkValid2()
	  if(input1Valid==0){
	  	 return;
	  }
	  if(input2Valid==0){
	  	 return;
	  }
    var eventTmp = event ||window.event || arguments.callee.caller.arguments[0];
    if(!eventTmp){
    	 return;
    }
    if(eventTmp.keyCode == 13){
    	 ShowShortestPath();
    }
}
function checkValid1(){
    var inputBox=document.getElementById("sourcePtxt");
    var inputP=inputBox.value;
    if(checkValid(inputP)){
       inputBox.className="validInput";
       input1Valid=1;
       if(input2Valid==1){
          document.getElementById("detectPath").disabled=false;
       }
       return 1;
    }else{
       inputBox.className="invalidInput";
       document.getElementById("detectPath").disabled=true;
       input1Valid=0;
       return 0;
    }
}
function checkValid2(){
    var inputBox=document.getElementById("targetPtxt");
    var inputP=inputBox.value;
    if(checkValid(inputP)){
       inputBox.className="validInput";
       input2Valid=1;
       if(input1Valid==1){
          document.getElementById("detectPath").disabled=false;
       }
       return 1;
    }else{
       inputBox.className="invalidInput";
       document.getElementById("detectPath").disabled=true;
       input2Valid=0;
       return 0;
    }
}
function getSwiss(name){
    if(swissDeatilSwiss2swiss.hasOwnProperty(name)){
       return swissDeatilSwiss2swiss[name];
    }
    if(swissDeatilGene2swiss.hasOwnProperty(name)){
       return swissDeatilGene2swiss[name];
    }
    return name;
}
var swiss2dist={};
var swiss2prev={};
var valueINF=1000000;
var valueFlag=1;
function dictOrder(x1, x2){
    if(x1 < x2){
       return -1;
    }
    if(x1 == x2){
       return 0;
    }
    return 1;
}
function sortNodesU(a, b){
    if(swiss2dist[a] != swiss2dist[b]){
       return swiss2dist[b]-swiss2dist[a];
    }
    return dictOrder(b, a);
}
function ShowShortestPathWorker(){
   var worker = new Worker("./D3/cisPathWorker.js");
   document.getElementById("result6wait").style.display="";
   worker.onmessage = function(event) {
      var resultPaths=event.data.resultPaths;
      ShowPaths(resultPaths);
   };
   worker.onerror = function(error) {
      var resultPaths=[];
      ShowPaths(resultPaths);
      alert("Error!");
      alert("Error message:"+error.message);
   };
   var swiss1=getSwiss(document.getElementById("sourcePtxt").value);
   var swiss2=getSwiss(document.getElementById("targetPtxt").value);
   var messageData={};
   messageData.PPI_swissNums=PPI_swissNums;
   messageData.swiss2swissInfo=swiss2swissInfo;
   messageData.swiss1=swiss1;
   messageData.swiss2=swiss2;
   messageData.valueFlag=valueFlag;
   worker.postMessage(messageData);
}
function ShowShortestPath(){
    ///////////////////////////////////
    var swiss1=getSwiss(document.getElementById("sourcePtxt").value);
    var swiss2=getSwiss(document.getElementById("targetPtxt").value);
    if(!PPI_swiss2id.hasOwnProperty(swiss1)){
       alert("No path between this two proteins!");
       return;
    }
    if(!PPI_swiss2id.hasOwnProperty(swiss2)){
       alert("No path between this two proteins!");
       return;
    }
    ///////////////////////////////////
    document.getElementById("result6wait").style.display="none";
    document.getElementById("result6waitp").style.display="";
    document.getElementById("detectPathExp").disabled=true;
    document.getElementById("detectPath").disabled=true;
    if(document.getElementById("byStepid0").checked){
       valueFlag=1;
    }else{
       valueFlag=0;
    }
    document.getElementById("allShortestPaths").style.display="none";
    document.getElementById("allShortestPathsP").style.display="none";
    if(1){
    	 document.getElementById("result6wait").style.display="";
       var swiss2=getSwiss(document.getElementById("targetPtxt").value);
       if(!swiss2validTargets.hasOwnProperty(swiss2)){
          alert(document.getElementById("targetPtxt").value+" is not in the valid target protein list!");
          document.getElementById("result6waitp").style.display="none";
          document.getElementById("detectPathExp").disabled=false;
          document.getElementById("detectPath").disabled=false;
          return;
       }else{
          getPathsForTargetProtein(swiss2);
          return;
       }
    }
    if(window.Worker){
       try{
           ShowShortestPathWorker();
       }
       catch(err){
           //alert(err.message);
           setTimeout("ShowShortestPath1()",1000);
       }
       return;
    }else{
       //alert("HTML5 Web Workers Multithreading is not supported by your browser. It will take more time!");
    }
    setTimeout("ShowShortestPath1()",1000);
}
function addTh(obj, content, widthValue){
	var mycurrent_cell;
	mycurrent_cell = document.createElement("th");
    mycurrent_cell.appendChild(document.createTextNode(content));
    if(widthValue != "0px"){
       mycurrent_cell.style.width=widthValue;
    }
    obj.appendChild(mycurrent_cell); 
}
var resultPaths=[];
function ShowPaths(allPaths){
    resultPaths=allPaths;
    var table=document.getElementById("allShortestPaths");
	while(table.lastChild != null){
        table.removeChild(table.lastChild);
    }
    var mycurrent_row = document.createElement("tr");
    addTh(mycurrent_row, "Path");
    addTh(mycurrent_row, "Detail", "100px");
    table.appendChild(mycurrent_row); 
	for(var x in allPaths){
	    var nodes=allPaths[x].split("#");
	    var mycurrent_row = document.createElement("tr");
	    mycurrent_row.id="pathrow"+x;
	    var mycurrent_cell;
	    mycurrent_cell = document.createElement("td");
	    mycurrent_cell.className="tdleft";
	    for(var y in nodes){
	        if(y!=0){
	           mycurrent_cell.appendChild(document.createTextNode(" -> "));
	        }
	        var proteinName=nodes[y];
	        if(swissDeatilSwiss2gene.hasOwnProperty(proteinName)){
	           proteinName=swissDeatilSwiss2gene[proteinName];
	           debugObj(nodes[y]+":"+proteinName);
	        }
	        var myLink = document.createElement('a');
            myLink.href = "http://www.uniprot.org/uniprot/"+nodes[y];
            myLink.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
            myLink.appendChild(document.createTextNode(proteinName));
            mycurrent_cell.appendChild(myLink);
            mycurrent_cell.appendChild(document.createTextNode(" ("+nodes[y]+")"));
	    }
	    mycurrent_row.appendChild(mycurrent_cell);
	    mycurrent_cell = document.createElement("td");
	    mycurrent_cell.className="tdcenter";
	    var mycurrent_button = document.createElement("input");
        mycurrent_button.value="View";
        mycurrent_button.type="button";
        mycurrent_button.className="detailButton";
        mycurrent_button.id = "path"+x;
        mycurrent_button.addEventListener("click", function(e){ShowPathView(this.id);}, false);
        mycurrent_cell.appendChild(mycurrent_button); 
        mycurrent_row.appendChild(mycurrent_cell); 
        table.appendChild(mycurrent_row);
	}
	showPathFirst=0;
	showPath10();
    document.getElementById("result6waitp").style.display="none";
    document.getElementById("detectPathExp").disabled=false;
    document.getElementById("detectPath").disabled=false;
    document.getElementById("allShortestPaths").style.display="";
    document.getElementById("allShortestPathsP").style.display="";
    ShowPathView("path0");
}
function ShowPathView(index){
    var total=resultPaths.length;
    var i=index.substr(4);
    var nodes=resultPaths[i].split("#");
    mainNodes=nodes;
    document.getElementById("showleafid").checked=true;
    document.getElementById("showleafid2").checked=false;
    document.getElementById("showleafid2").disabled=false;
    for(var x=0;x<total;x++){
	  	document.getElementById("pathrow"+x).className="rowNotSelected";
	}
	document.getElementById("pathrow"+i).className="rowSelected";
    generateNetwork();
}
function ShowShortestPath1(){
    var swiss1=getSwiss(document.getElementById("sourcePtxt").value);
    var swiss2=getSwiss(document.getElementById("targetPtxt").value);
    var list=[];
    var nodesU=[];
    var nodesS=[];
    for(var x in PPI_swissNums){
        if(PPI_swissNums[x]!=swiss1){
           nodesU.push(PPI_swissNums[x]);
        }
        swiss2prev[PPI_swissNums[x]]=PPI_swissNums[x];
        swiss2dist[PPI_swissNums[x]]=valueINF;
    }
    swiss2dist[swiss1]=0;
    nodesU.push(swiss1);
    while(nodesU.length > 0){
        var nodeN=nodesU.pop();
        if(swiss2dist[nodeN]==valueINF){
           break;
        }
        nodesS.push(nodeN);
        if(nodeN==swiss2){
           break;
        }
        var valideSwisses=swiss2swissInfo[nodeN];
        var valueChangedNode={};
        for(var x in valideSwisses){
            if(x==nodeN){
               continue;
            }
            var edgeValue=1;
            if(valueFlag==1){
               edgeValue=valideSwisses[x];
            }
            if(swiss2dist[x] > swiss2dist[nodeN] + edgeValue){
               swiss2dist[x] = swiss2dist[nodeN] + edgeValue;
               swiss2prev[x] = nodeN;
               valueChangedNode[x]=1;
               continue;
            }
            if(swiss2dist[x] == swiss2dist[nodeN] + edgeValue){
               swiss2prev[x] = swiss2prev[x]+"#"+nodeN;
            }
        }
        var index=nodesU.length-1;
        while(index >= 0){
            if(!valueChangedNode.hasOwnProperty(nodesU[index])){
               index--;
               continue;
            }
            var index2=index;
            while(index2 < (nodesU.length-1)){
                var name1=nodesU[index2];
                var name2=nodesU[index2+1];
                if(swiss2dist[name1] > swiss2dist[name2]){
                   break;
                }
                if(swiss2dist[name1] == swiss2dist[name2]){
                   if(name1 > name2){
                      break;
                   }
                }
                nodesU[index2+1]=name1;
                nodesU[index2]=name2;
                index2=index2+1;
            }
            index--;
        }
        //nodesU.sort(sortNodesU);
    }
    if(swiss2prev[swiss2]==swiss2){
       alert("Sorry, detect no path from "+swiss1+" to "+ swiss2);
       return;
    }
    debugObj(swiss2prev[swiss2]);
    swiss2paths={};
    generatePaths(swiss2, swiss1);
    debugObj(swiss2paths[swiss2]);
    debugObj(swiss2paths[swiss2].length);
    ShowPaths(swiss2paths[swiss2]);
}
var swiss2paths={};
function generatePaths(swiss, root){
    swiss2paths[swiss]=[];
    if(swiss==root){
       swiss2paths[swiss].push(swiss);
       return;
    }
    if(!swiss2prev.hasOwnProperty(swiss)){
       return;
    }
    var nodes=swiss2prev[swiss].split("#");
    for(var x in nodes){
        generatePaths(nodes[x], root);
        for(var y in swiss2paths[nodes[x]]){
            swiss2paths[swiss].push(swiss2paths[nodes[x]][y]+"#"+swiss);
        }
    }
}
function ShowShortestPathExp(){
    //document.getElementById("byStepid0").checked=true;
    //document.getElementById("byStepid1").checked=false;
    checkValid1();
    document.getElementById("targetPtxt").value="";
    var expName="";
    if(validTargets.length==0){
    	 alert("No valid target protein!");
    	 return;
    }
    if((validTargets.length==1)&&(validTargets[x]==rootSwiss)){
    	 alert("No valid target protein!");
    	 return;
    }
    for(x in validTargets){
        if(validTargets[x]!=rootSwiss){
           expName=validTargets[x];
           if(expName=="P01241"){
           	  break;
           }
           //break;
        }
    }
    document.getElementById("targetPtxt").value=expName;
    checkValid2();
    if(validTargets.length<=20){
       var select= document.getElementById('targetSelectId');
       select[0].selected=true;
	   document.getElementById('targetPtxt').value=select[0].value;
	   checkValid2();
    }
    ShowShortestPath();
}
////////////////////////////////////////////////////
var showPathFirst=0;
var showPathEnd=10;
function showPath10(){
    calcurBeginEnd();
    var p=document.getElementById("allShortestPathsP");
	while(p.lastChild != null){
       p.removeChild(p.lastChild);
    }
    addResultPath10(p);
    addFirstPath10(p);
    addPreviousPath10(p);
    addNextPath10(p);
    addLastPath10(p);
}
/////////////////////////////////////////////////////////////////
function addResultPath10(p){
	var resultSPAN = document.createElement("span");
    var content="Results: "+showPathFirst+"-"+showPathEnd+" of "+resultPaths.length+" ";
    resultSPAN.appendChild(document.createTextNode(content));
    p.appendChild(resultSPAN);
}
function addFirstPath10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
	resultSPAN.value="|<";
    resultSPAN.appendChild(document.createTextNode("First"));
    if(showPathFirst==0){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    resultSPAN.addEventListener("click", function(e){showPathFirst=0;showPath10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addLastPath10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
	resultSPAN.value=">|";
	var newFirst=(resultPaths.length-resultPaths.length%10);
	if(newFirst==resultPaths.length){
	   newFirst=resultPaths.length-10;
	}
	if(newFirst < 0){
	   newFirst = 0;
	}
    resultSPAN.appendChild(document.createTextNode("Last"));
    if(showPathEnd==resultPaths.length){
	   p.appendChild(resultSPAN);
	   resultSPAN.className = "linkindex";
	   resultSPAN.disabled="disabled";
	   return;
	}
    resultSPAN.addEventListener("click", function(e){showPathFirst=newFirst;showPath10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addPreviousPath10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
    resultSPAN.value="<";
    if(showPathFirst==0){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    var newFirst=showPathFirst-10;
    if(newFirst < 0){
    	 newFirst = 0;
    }
    resultSPAN.addEventListener("click", function(e){showPathFirst=newFirst;showPath10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
function addNextPath10(p){
	p.appendChild(document.createTextNode("  "));
	var resultSPAN = document.createElement("input");
	resultSPAN.type="button";
    resultSPAN.value=">";
    if(showPathEnd==resultPaths.length){
       p.appendChild(resultSPAN);
       resultSPAN.className = "linkindex";
       resultSPAN.disabled="disabled";
	   return;
	}
    var newFirst=showPathFirst+10;
    if(newFirst >= resultPaths.length){
       newFirst = (resultPaths.length-resultPaths.length%10);
    }
    resultSPAN.addEventListener("click", function(e){showPathFirst=newFirst;showPath10();}, false);
    resultSPAN.className = "linkindex";
    p.appendChild(resultSPAN);
}
/////////////////////////////////////////////////////////////////
function calcurBeginEnd(){
	var total=resultPaths.length;
	if(showPathFirst >= total){
	   showPathFirst=(total-total%10);
	}
	if(showPathFirst == total){
	   showPathFirst = total-10;
	}
    if(showPathFirst < 0){
	   showPathFirst = 0;
	}
	showPathFirst=showPathFirst-(showPathFirst%10);
	showPathEnd=showPathFirst+10;
	if(showPathEnd > total){
	   showPathEnd = total;
	}
	for(var i=0;i<total;i++){
	  	document.getElementById("pathrow"+i).style.display="none";
	}
    for(var i=showPathFirst;i<showPathEnd;i++){
        document.getElementById("pathrow"+i).style.display="";
    }
}
////////////////////////////////////////////////
var selectcols=["#1F77B4","#FF7F0E","#D62728","#9467BD","#8C564B","#E377C2","#2CA02C"];
var selectcolsRandom0=["#1F77B4","#FF7F0E","#D62728","#9467BD","#8C564B","#E377C2"];
var selectcolsRandom1=["#1F77B4","#FF7F0E","#9467BD","#8C564B","#E377C2","#2CA02C"];
var mainNodeCol=["#1F77B4","#FF7F0E","#D62728","#9467BD","#8C564B","#E377C2"];
var leafNodeCol=["#1F77B4","#FF7F0E","#9467BD","#8C564B","#E377C2","#2CA02C"];
function initCol0(){
    var select=document.getElementById("selectid0");
    select.length=0;
    for(x in selectcols){
        var opt=new Option(selectcols[x],x);
        opt.style.backgroundColor=selectcols[x];
        opt.style.color=selectcols[x];
        select.add(opt);
    }
    var opt=new Option("Random",selectcols.length);
    opt.style.backgroundColor="#FFFFFF";
    opt.style.color="#000000";
    select.add(opt);
    select[select.options.length-1].selected=true;
    select.addEventListener("change", function(e){changeMainNodeCol0(this.value);}, false);
}
function changeMainNodeCol0(index){
    var select=document.getElementById("selectid0");
    if(index < selectcols.length){
       mainNodeCol=[];
       mainNodeCol.push(selectcols[index]);
       select.style.backgroundColor=selectcols[index];
       select.style.color=selectcols[index];
    }else{
       mainNodeCol=selectcolsRandom0;
       select.style.backgroundColor="#FFFFFF";
       select.style.color="#000000";
    }
    generateNetwork();
}
function initCol1(){
    var select=document.getElementById("selectid1");
    select.length=0;
    for(x in selectcols){
        var opt=new Option(selectcols[x],x);
        opt.style.backgroundColor=selectcols[x];
        opt.style.color=selectcols[x];
        select.add(opt);
    }
    var opt=new Option("Random",selectcols.length);
    opt.style.backgroundColor="#FFFFFF";
    opt.style.color="#000000";
    select.add(opt);
    select[select.options.length-1].selected=true;
    select.addEventListener("change", function(e){changeMainNodeCol1(this.value);}, false);
}
function changeMainNodeCol1(index){
    var select=document.getElementById("selectid1");
    if(index < selectcols.length){
       leafNodeCol=[];
       leafNodeCol.push(selectcols[index]);
       select.style.backgroundColor=selectcols[index];
       select.style.color=selectcols[index];
    }else{
       leafNodeCol=selectcolsRandom1;
       select.style.backgroundColor="#FFFFFF";
       select.style.color="#000000";
    }
    generateNetwork();
}
///////////////////////////////////////////
var validTargets=[];
var swiss2validTargets={};
var rootName="";
var rootSwiss="";
function processJS(json){
    rootName=json.root;
    rootSwiss=json.root;
    swiss2validTargets={};
    if(json.byscore=="0"){
       document.getElementById("byStepid0").checked=false;
       document.getElementById("byStepid1").checked=true;
    }else{
       document.getElementById("byStepid0").checked=true;
       document.getElementById("byStepid1").checked=false;
    }
    document.getElementById("byStepid0").disabled=true;
    document.getElementById("byStepid1").disabled=true;
    for(x in json.targets){
        swiss2validTargets[json.targets[x]]=1;
    }
    var p=document.getElementById("result1waitp");
    addProgressSpan2(p,5,5);
    if(swissDeatilSwiss2gene.hasOwnProperty(rootName)){
	   rootName=swissDeatilSwiss2gene[rootName];
	}
	var spanP=document.createElement("SPAN");
	spanP.className="spanInput";
	var spanName=document.createElement("SPAN");
	spanName.appendChild(document.createTextNode(rootName));
	spanName.className="spanlinkClass";
	spanName.href="http://www.uniprot.org/uniprot/"+rootSwiss;
	spanName.addEventListener("click", function(e){window.open(this.href,'_blank');e.preventDefault();return false;}, false);
	spanP.appendChild(spanName);
	spanP.appendChild(document.createTextNode(" ("+rootSwiss+")"));
	document.getElementById('sourcetd').insertBefore(spanP, document.getElementById('sourcePtxt'));
	document.getElementById('sourcePtxt').value=rootName;
	checkValid1();
	document.getElementById('sourcePtxt').disabled=true;
	document.getElementById('sourcePtxt').style.display="none";
	validTargets=json.targets;
	if((validTargets.length<=20)&&(validTargets.length!=0)){
	   var select=document.createElement("select");
	   select.id="targetSelectId";
	   select.className="selectClass";
	   for(x in validTargets){
	       if(validTargets[x]==rootSwiss){
	          continue;
	       }
	       var proteinName=validTargets[x];
	       if(swissDeatilSwiss2gene.hasOwnProperty(proteinName)){
	          proteinName=swissDeatilSwiss2gene[proteinName];
	       }
	       var opt=new Option(proteinName+" ("+validTargets[x]+")",validTargets[x]);
	       select.add(opt);
	   }
	   if(select.length==0){
	   	  alert("No valid target protein!");
	   	  document.getElementById("result1wait").style.display="none";
        document.getElementById("result1waitp").style.display="none";
        enableInput();
    	  return;
	   }
	   select[0].selected=true;
	   document.getElementById('targetPtxt').value=select[0].value;
	   checkValid2();
	   document.getElementById('targettd').insertBefore(select, document.getElementById('targetPtxt'));
	   document.getElementById('targetPtxt').disabled=true;
	   document.getElementById('targetPtxt').style.display="none";
	   select.addEventListener("change", function(e){document.getElementById('targetPtxt').value=this.value;checkValid2();ShowShortestPath();}, false);
	}else{
	   for(x in validTargets){
	       if(validTargets[x]==rootSwiss){
	          continue;
	       }
	       document.getElementById('targetPtxt').value=validTargets[x];
	       break;
	   }
	   checkValid2();
	}
	if(validTargets.length==0){
    	 alert("No valid target protein!");
    	 //return;
  }
  if((validTargets.length==1)&&(validTargets[x]==rootSwiss)){
    	 alert("No valid target protein!");
    	 //return;
  }
  document.getElementById("result1wait").style.display="none";
  document.getElementById("result1waitp").style.display="none";
  enableInput();
}
var url2retry8={};
function getCisPathJS(){
  var url="./js/results.js";
  url2retry8[url]=5;
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry8[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	processJS(json);
    	url2retry8[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getCisPathJSRetry(this.url);
    }
  });
}
function getCisPathJSRetry(urltry){
  var url=urltry;
  if(url2retry8[url]==100){
     return;
  }
  url2retry8[url]=url2retry8[url]-1;
  if(url2retry8[url]<=0){
     debugObj("Failed:"+url);
     alert("Network Error! Please check your network connection!");
     return;
  }
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry8[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
    	processJS(json);
    	url2retry8[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getCisPathJSRetry(this.url);
    }
  });
}

var url2retry9={};
function getPathsForTargetProtein(swissID){
   var url="./js/"+swissID+"_path.js";
   url2retry9[url]=5;
   $.jsonp({ 
     url: url,
     callback: "cisPathCallBack",
     timeout:60000,
     success:function(json){
        if(url2retry9[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
        json.paths.pop();
    	ShowPaths(json.paths);
    	url2retry9[url]=100;
     },
     error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getPathsForTargetProteinRetry(this.url);
     }
   });
}
function getPathsForTargetProteinRetry(urltry){
  var url=urltry;
  if(url2retry9[url]==100){
     return;
  }
  url2retry9[url]=url2retry9[url]-1;
  if(url2retry9[url]<=0){
     debugObj("Failed:"+url);
     alert("Network Error! Please check your network connection!");
     return;
  }
  $.jsonp({ 
    url: url,
    callback: "cisPathCallBack",
    timeout:60000,
    success:function(json){
        if(url2retry9[url]==100){
           return;
        }
        debugObj("Success:"+this.url);
        json.paths.pop();
    	ShowPaths(json.paths);
    	url2retry9[url]=100;
    },
    error: function(XHR, textStatus, errorThrown) {
        debugObj("Retry:"+this.url);
        getPathsForTargetProteinRetry(this.url);
    }
   });
}
function disableInput(){
	document.getElementById("sourcePtxt").disabled=true;
	document.getElementById("targetPtxt").disabled=true;
	document.getElementById("detectPathExp").disabled=true;
}
function enableInput(){
	document.getElementById("sourcePtxt").disabled=false;
	document.getElementById("targetPtxt").disabled=false;
	document.getElementById("detectPathExp").disabled=false;
}