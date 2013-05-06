getResults <- function(outputDir){
   jsDir <- file.path(outputDir, "js")
   files <- list.files(path=jsDir, pattern = "path",full.names = TRUE)
   results <- list()
   for(i in (1:length(files))){
       rt <- read.table(files[i], header=TRUE,sep="\t")
       rt <- as.vector(rt[,1])
       pathNum <- length(rt)
       paths <- list()
       proteinName <- ""
       swissId <- ""
       for(j in (1:pathNum)){
           tmp <- strsplit(rt[j], "=|;")
           tmp <- strsplit(tmp[[1]][2], " -> ")
           tmp <- as.vector(tmp[[1]])
           hops <- length(tmp)
           tmp2 <- strsplit(tmp[hops], ":")
           proteinName <- tmp2[[1]][1]
           swissId <- tmp2[[1]][2]
           paths[[j]] <- tmp 
       }
       results[[proteinName]] <- paths
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