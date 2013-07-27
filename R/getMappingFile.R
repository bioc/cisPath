setMethod(getMappingFile, c("character","character"),
function(sprotFile, output, tremblFile="", taxonId="")
{   
    kk <- .C(".getMappingFileC",as.character(sprotFile), as.character(output), 
             as.character(tremblFile), as.character(taxonId))
    output
})
