setMethod(addProteinNames, c("character","character"),
function(name2IDFile, outputDir)
{   
    if(!file.exists(name2IDFile)){
       cat("There is no file called ", name2IDFile, "\n", sep="")
       return()
    }
    if(!file.exists(outputDir)){
       cat("There is no directory called ", outputDir, "\n", sep="")
       return()
    }
    kk <- .C(".addInfoC",as.character(name2IDFile),as.character(outputDir))
    outputDir
})
