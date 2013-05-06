setMethod(combinePPI, c("character","character"),
function(input, output, maxEdgeValue=-1)
{   
    num <- length(input)
    kk <- .C(".combinePPIC",as.character(input),as.integer(num),
             as.character(output), as.double(maxEdgeValue))
    output
})
