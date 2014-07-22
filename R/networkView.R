setMethod(networkView, c("character","character","character"),
function(infoFile, proteinNames, outputDir, swissProtID=FALSE, mainNode=c(1), 
         nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                      "#9467BD", "#8C564B", "#E377C2"),
         displayMore=TRUE, leafColor="#2CA02C")
{   
    if(is.null(outputDir[1])){
       outputDir <- paste(tempdir(),"/","outputFile",sep="")
    }else{
       dir.create(outputDir, showWarnings = FALSE, recursive = TRUE)
       dir.create(paste(outputDir,"/js",sep=""), showWarnings = FALSE,
                                                     recursive = TRUE)
       dir.create(paste(outputDir,"/D3",sep=""), showWarnings = FALSE,
                                                     recursive = TRUE)
    }
    cat("Please wait patiently!\n")
    htmlFile <- system.file("extdata", "graphView.html", package="cisPath")
    #cat("htmlFile: ", htmlFile, "\n")
    htmlFile_out <- paste(outputDir,"/","graphView.html",sep="")
    file.copy(htmlFile, htmlFile_out, overwrite = TRUE, copy.mode = TRUE)
    copyHTML(outputDir)
    #############################################################
    jsFile <- system.file("extdata", "D3", package="cisPath")
    js_out <- paste(outputDir,sep="")
    file.copy(jsFile, js_out, overwrite = TRUE, recursive = TRUE, copy.mode = TRUE) 
    ##############################################################
    proteinFile <- paste(outputDir,"/","proteins.txt",sep="")
    len <- length(proteinNames)
    if(is.null(mainNode)){
       mainNode <- rep(0, len)
    }
    if(length(mainNode) < len){
       mainNode <- rep(mainNode, len)
    }
    if(length(nodeColors) < len){
       nodeColors <- rep(nodeColors, len)
    }
    swissNote <- "0"
    if(swissProtID[1]==TRUE){
       swissNote <- "1"
    }
    append <- FALSE
    for(i in (1:length(proteinNames))){
        cat(file=proteinFile, proteinNames[i],",", swissNote,",", mainNode[i],
            ",", nodeColors[i], "\n", sep="", append=append)
        append <- TRUE
    }
    addMore <- 0
    if(displayMore[1]==TRUE){
       addMore <- 1
    }
    kk <- .C(".viewGraphC",as.character(infoFile), as.character(proteinFile), 
             as.character(outputDir), as.integer(addMore), 
             as.character(leafColor))
    cat("Done.\n")
    if(interactive()){
       browseURL(htmlFile_out)
    }
    htmlFile_out
})
