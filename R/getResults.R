getResults <- function(outputDir){
   jsDir <- file.path(outputDir, "js")
   files <- list.files(path=jsDir,pattern = "path",full.names = TRUE)
   results <- list()
   for(i in (1:length(files))){
       rt <- read.table(files[i], header=FALSE,sep="\t")
       rt <- as.vector(rt[,1])
       pathNum <- length(rt)
       paths <- list()
       swissId <- ""
       for(j in (3:(pathNum-2))){
           tmp <- strsplit(rt[j], "#|,")
           tmp <- as.vector(tmp[[1]])
           hops <- length(tmp)
           swissId <- tmp[hops]
           paths[[j-2]] <- tmp 
       }
       results[[swissId]] <- paths
   }
   results
}
copyHTML <- function(outputDir){
   dir.create(outputDir, showWarnings = FALSE, recursive = TRUE)
   dir.create(paste(outputDir,"/D3",sep=""), showWarnings = FALSE, 
                                                      recursive = TRUE)
   htmlFile <- system.file("extdata", "easyEditor.html", package="cisPath")
   htmlFile_out <- paste(outputDir,"/","easyEditor.html",sep="")
   file.copy(htmlFile, htmlFile_out, overwrite = TRUE, copy.mode = TRUE)
   #############################################################
   jsFile <- system.file("extdata", "D3/d3.v3.min.js", package="cisPath")
   js_out <- paste(outputDir,"/D3/","d3.v3.min.js",sep="")
   file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
   jsFile <- system.file("extdata", "D3/app.js", package="cisPath")
   js_out <- paste(outputDir,"/D3/","app.js",sep="")
   file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
   jsFile <- system.file("extdata", "D3/app.css", package="cisPath")
   js_out <- paste(outputDir,"/D3/","app.css",sep="")
   file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
   ##############################################################
   htmlFile_out
}