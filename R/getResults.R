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