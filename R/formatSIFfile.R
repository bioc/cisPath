setMethod(formatSIFfile, c("character","character","character"),
function(input, mappingFile, output)
{   
    kk <- .C(".formatSIFfileC",as.character(input), 
              as.character(mappingFile), as.character(output))
    output
})
