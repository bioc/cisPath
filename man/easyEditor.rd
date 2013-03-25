\name{easyEditor}
\alias{easyEditor}
\alias{easyEditor,character-method}
\title{Easy Editor for Network}
\description{
  This method is used to open the network editor.
}
\usage{
easyEditor(outputDir)
\S4method{easyEditor}{character}(outputDir)
}
\arguments{
 \item{outputDir}{Output directory (character(1)).}
}
\value{
  The output HTML file of this method is a network editor. 
  Users can generate and edit their own network by this editor.
}
\examples{
    library(cisPath)
    outputDir <- file.path(tempdir(), "easyEditor")
    easyEditor(outputDir)
}
\keyword{methods}