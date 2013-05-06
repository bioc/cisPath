setMethod(formatPINAPPI, c("character","character"),
function(input, output)
{   
    kk <- .C(".formatPINAPPIC",as.character(input), as.character(output))
    output
})
