setMethod(formatSTRINGPPI, c("character","character","character","character"),
function(input, mappingFile, taxonId, output, minScore=700)
{   
    kk <- .C(".formatSTRINGPPIC",as.character(input), 
              as.character(mappingFile), as.character(taxonId),
              as.character(output), as.integer(minScore))
    output
})
