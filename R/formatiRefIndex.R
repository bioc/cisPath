setMethod(formatiRefIndex, c("character","character"),
function(input, output, taxonId="")
{   
    kk <- .C(".formatiRefC",as.character(input), 
             as.character(output), as.character(taxonId))
    output
})
