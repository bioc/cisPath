setGeneric("cisPath",
           function(infoFile, outputDir, proteinName=NULL, targetProteins=NULL, 
           swissProtID=FALSE, sprotFile="", tremblFile="",
           nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                      "#9467BD", "#8C564B", "#E377C2"),
           leafColor="#2CA02C", byStep=FALSE)
           standardGeneric("cisPath"), 
           signature=c("infoFile", "outputDir"))
setGeneric("networkView",
           function(infoFile, proteinNames, outputDir, swissProtID=FALSE, 
                    mainNode=c(1), 
                    nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                                 "#9467BD", "#8C564B", "#E377C2"), 
                    displayMore=TRUE, leafColor="#2CA02C") 
                    standardGeneric("networkView"), 
                    signature=c("infoFile", "proteinNames", "outputDir"))
setGeneric("easyEditor",
           function(outputDir) 
                    standardGeneric("easyEditor"), 
                    signature=c("outputDir"))
setGeneric("getMappingFile",
           function(sprotFile, output, tremblFile="", taxonId="")
           standardGeneric("getMappingFile"), 
           signature=c("sprotFile", "output"))
setGeneric("formatSIFfile",
           function(input, mappingFile, output)
           standardGeneric("formatSIFfile"), 
           signature=c("input", "mappingFile", "output"))
setGeneric("formatPINAPPI",
           function(input, output)
           standardGeneric("formatPINAPPI"), 
           signature=c("input", "output"))
setGeneric("formatiRefIndex",
           function(input, output, taxonId="")
           standardGeneric("formatiRefIndex"), 
           signature=c("input", "output"))
setGeneric("formatSTRINGPPI",
           function(input, mappingFile, taxonId, output, minScore=700)
           standardGeneric("formatSTRINGPPI"), 
           signature=c("input", "mappingFile", "taxonId", "output"))
setGeneric("combinePPI",
           function(input, output, mappingFile="", dbNames="", maxEdgeValue=-1)
           standardGeneric("combinePPI"), 
           signature=c("input", "output"))
           