setMethod(easyEditor, c("character"),
function(outputDir)
{   
    if(!is.null(outputDir[1])){
       dir.create(outputDir, showWarnings = FALSE, recursive = TRUE)
       dir.create(paste(outputDir,"/D3",sep=""), showWarnings = FALSE, 
                                                      recursive = TRUE)
       htmlFile <- system.file("extdata", "easyEditor.html", package="cisPath")
       htmlFile_out <- paste(outputDir,"/","easyEditor.html",sep="")
       file.copy(htmlFile, htmlFile_out, overwrite = TRUE, copy.mode = TRUE)
       #############################################################
       jsFile <- system.file("extdata", "D3/d3.v3.min.js", package="cisPath")
       js_out <- paste(outputDir,"/D3/","d3.v3.min.js",sep="")
       file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
       jsFile <- system.file("extdata", "D3/app.js", package="cisPath")
       js_out <- paste(outputDir,"/D3/","app.js",sep="")
       file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
       jsFile <- system.file("extdata", "D3/app.css", package="cisPath")
       js_out <- paste(outputDir,"/D3/","app.css",sep="")
       file.copy(jsFile, js_out, overwrite = TRUE, copy.mode = TRUE)
       ##############################################################
    }else{
       htmlFile_out <- htmlFile
    }
    if(interactive()){
       browseURL(htmlFile_out)
    }
    cat("Please open the output HTML file using a browser!\n");
    htmlFile_out
})
