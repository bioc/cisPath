setMethod(getMappingFile, c("character","character"),
function(input, output, taxonId="")
{   
    kk <- .C(".getMappingFileC",as.character(input), as.character(output),  
             as.character(taxonId))
    output
})
