setGeneric("cisPath",
           function(infoFile, proteinName, outputDir, targetProteins=NULL, 
                    swissProtID=FALSE, name2IDFile=NULL,
                    nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                           "#9467BD", "#8C564B", "#E377C2"),
                    leafColor="#2CA02C")
                    standardGeneric("cisPath"), 
                    signature=c("infoFile", "proteinName", "outputDir"))
setGeneric("addProteinNames",
           function(name2IDFile, outputDir) 
                    standardGeneric("addProteinNames"), 
                    signature=c("name2IDFile", "outputDir"))
setGeneric("networkView",
           function(infoFile, proteinNames, outputDir, swissProtID=FALSE, 
                    mainNode=c(1), 
                    nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                                 "#9467BD", "#8C564B", "#E377C2"), 
                    displayMore=TRUE, leafColor="#2CA02C") 
                    standardGeneric("networkView"), 
                    signature=c("infoFile", "proteinNames", "outputDir"))
           