setMethod(combinePPI, c("character","character"),
function(input, output, mappingFile="", dbNames="", maxEdgeValue=-1)
{   
    htmlFile <- system.file("extdata", "statement.html", package="cisPath")
    htmlFile_out <- paste(output,".html",sep="")
    file.copy(htmlFile, htmlFile_out, overwrite = TRUE, copy.mode = TRUE)
    num <- length(input)
    if((length(dbNames)==1)&&(dbNames[1]=="")){
        dbNames <- basename(input)
    }
    if(length(input)!=length(dbNames)){
        dbNames <- basename(input)
    }
    kk <- .C(".combinePPIC",as.character(input),as.character(dbNames),
             as.integer(num),as.character(output), as.character(mappingFile),
                                                     as.double(maxEdgeValue))
    if(interactive()){
       browseURL(htmlFile_out)
    }
    output
})
