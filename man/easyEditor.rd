\name{easyEditor}
\alias{easyEditor}
\alias{easyEditor,character-method}
\title{Easy editor for network graphs}
\description{
  This method is used to open the editor for network graphs.
}
\usage{
easyEditor(outputDir)
\S4method{easyEditor}{character}(outputDir)
}
\arguments{
 \item{outputDir}{Output directory (character(1)).}
}
\value{
  The output HTML file of this method is a editor for network graphs. 
  Users can draw and edit their own network with this editor.
}
\examples{
    library(cisPath)
    outputDir <- file.path(tempdir(), "easyEditor")
    easyEditor(outputDir)
}
\keyword{methods}