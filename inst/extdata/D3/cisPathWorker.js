var jsonOutput={};
var PPI_swissNums={};
var swiss2swissInfo={};
var swiss1="";
var swiss2="";
var valueFlag=1;
onmessage = function(event) {
   var jsonInput = event.data;
   PPI_swissNums=jsonInput.PPI_swissNums;
   swiss2swissInfo=jsonInput.swiss2swissInfo;
   swiss1=jsonInput.swiss1;
   swiss2=jsonInput.swiss2;
   valueFlag=jsonInput.valueFlag;
   ShowShortestPath1();
   postMessage(jsonOutput);
   close();
}
var swiss2dist={};
var swiss2prev={};
var valueINF=1000000;
function ShowShortestPath1(){
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
    swiss2paths={};
    if(swiss2prev.hasOwnProperty(swiss2)){
    	 if(swiss2prev[swiss2]!=swiss2){
         generatePaths(swiss2, swiss1);
       }else{
       	 swiss2paths[swiss2]=[];
       	 //alert("Sorry, detect no path from "+swiss1+" to "+ swiss2);
       }
    }else{
    	 swiss2paths[swiss2]=[];
    	 //alert("Sorry, detect no path from "+swiss1+" to "+ swiss2);
    }
    jsonOutput.resultPaths=swiss2paths[swiss2];
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