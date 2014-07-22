setMethod(cisPath, c("character","character"),
function(infoFile, outputDir, proteinName=NULL, targetProteins=NULL, 
         swissProtID=FALSE, sprotFile="", tremblFile="",
         nodeColors=c("#1F77B4", "#FF7F0E", "#D62728",
                      "#9467BD", "#8C564B", "#E377C2"),
         leafColor="#2CA02C", byStep=FALSE)
{   
    if(is.null(outputDir[1])){
       outputDir <- paste(tempdir(),"/","outputFile",sep="")
    }
    dir.create(outputDir, showWarnings = FALSE, recursive = TRUE)
    dir.create(paste(outputDir,"/js",sep=""), showWarnings = FALSE, 
                                                     recursive = TRUE)
    dir.create(paste(outputDir,"/PPIinfo",sep=""), showWarnings = FALSE, 
                                                     recursive = TRUE)
                                                     
    cat("Please wait patiently!\n")
    htmlFile <- system.file("extdata", "cisPath.html", package="cisPath")
    #cat("htmlFile: ", htmlFile, "\n")
    if(is.null(proteinName[1])){
       proteinName <- "";
    }
    if(proteinName!=""){
       htmlFile_out1 <- paste(outputDir,"/","cisPath.html",sep="")
       file.copy(htmlFile, htmlFile_out1, overwrite = TRUE, copy.mode = TRUE)
    }
    htmlFile <- system.file("extdata", "cisPathWeb.html", package="cisPath")
    #cat("htmlFile: ", htmlFile, "\n")
    htmlFile_out2 <- paste(outputDir,"/","cisPathWeb.html",sep="")
    file.copy(htmlFile, htmlFile_out2, overwrite = TRUE, copy.mode = TRUE)
    copyHTML(outputDir)
    #############################################################
    jsFile <- system.file("extdata", "D3", package="cisPath")
    js_out <- paste(outputDir,sep="")
    file.copy(jsFile, js_out, overwrite = TRUE, recursive = TRUE, copy.mode = TRUE) 
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
    byScore <- 1
    if(byStep){
       byScore <- 0
    }
    nodeColorsStr <- "";
    for(i in (1:length(nodeColors))){
        if(nodeColorsStr==""){
           nodeColorsStr=nodeColors[i];
        }else{
           nodeColorsStr=paste(nodeColorsStr, nodeColors[i], sep=",");
        }
    }
    kk <- .C(".cisPathC",as.character(infoFile),as.character(proteinName), 
             as.character(outputDir), as.character(targetFile), 
             as.character(sprotFile), as.character(tremblFile),
             as.character(nodeColorsStr), as.character(leafColor),
             as.integer(byScore))
    cat("Done.\n")
    if(proteinName==""){
       htmlFile_out <- paste(outputDir,"/","cisPathWeb.html",sep="")
    }else{
       htmlFile_out <- paste(outputDir,"/","cisPath.html",sep="")
    }
    if(interactive()){
       browseURL(htmlFile_out)
    }
    results <- htmlFile_out
    if((proteinName!="")&&(targetFile!="")){
        results <- getResults(outputDir);
    }
    results
})
