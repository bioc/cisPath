setMethod(cisPath, c("character","character","character"),
function(infoFile, proteinName, outputDir, targetProteins=NULL, 
         swissProtID=FALSE, name2IDFile=NULL,
         nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                      "#9467BD", "#8C564B", "#E377C2"),
         leafColor="#2CA02C")
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
    htmlFile <- system.file("extdata", "network.html", package="cisPath")
    #cat("htmlFile: ", htmlFile, "\n")
    htmlFile_out <- paste(outputDir,"/","network.html",sep="")
    file.copy(htmlFile, htmlFile_out, overwrite = TRUE, copy.mode = TRUE)
    #############################################################
    jsFile <- system.file("extdata", "D3/d3.js", package="cisPath")
    js_out <- paste(outputDir,"/D3/","d3.js",sep="")
    file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
    jsFile <- system.file("extdata", "D3/d3.geom.js", package="cisPath")
    js_out <- paste(outputDir,"/D3/","d3.geom.js",sep="")
    file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
    jsFile <- system.file("extdata", "D3/d3.layout.js", package="cisPath")
    js_out <- paste(outputDir,"/D3/","d3.layout.js",sep="")
    file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
    ##############################################################
    targetFile <- paste(outputDir,"/","targets.txt",sep="")
    append <- FALSE
    if(is.null(targetProteins[1])){
       targetFile <- ""
    }else{
       for(i in (1:length(targetProteins))){
           if(swissProtID[1]==TRUE){
              cat(file=targetFile, ",", targetProteins[i], "\n", sep="", 
                                                          append=append)
           }else{
              cat(file=targetFile, targetProteins[i], ",", "\n", sep="", 
                                                          append=append)
           }
           append <- TRUE
       }
    }
    if(is.null(name2IDFile[1])){
       name2IDFile <- ""
    }
    kk <- .C(".cisPathC",as.character(infoFile),as.character(proteinName), 
             as.character(outputDir), as.character(targetFile), 
             as.character(name2IDFile), as.integer(10000))
    results <- getResults(outputDir)
    cat("Done.\n")
    name2protFile <- paste(outputDir,"/","js/name2prot.js",sep="");
    
    colstring <- "var mainNodeCols=[";
    for(i in (1:length(nodeColors))){
        if(i!=1){
           colstring <- paste(colstring, ",", sep="");
        }
        colstring <- paste(colstring, "\"", nodeColors[i], "\"", sep="");
    }
    colstring <- paste(colstring, "];\n", sep="");
    cat(file=name2protFile, colstring, append=TRUE)

    colstring <- "var leafNodeCol=";
    colstring <- paste(colstring, "\"", leafColor, "\";\n", sep="");
    cat(file=name2protFile, colstring, append=TRUE)
    
    if(interactive()){
       browseURL(htmlFile_out)
    }
    results
})
