\name{combinePPI}
\alias{combinePPI}
\alias{combinePPI,character,character-method}
\title{Combine PPI information from databases}
\description{
  This method is used to combine the PPI information generated from different databases.
}
\usage{
combinePPI(input, output, maxEdgeValue=-1)
\S4method{combinePPI}{character,character}(input, output, maxEdgeValue=-1)
}
\arguments{
 \item{input}{Files that contain PPI information (character vector).}
 \item{output}{Output file (character(1)).}
 \item{maxEdgeValue}{Filter out PPI information with edge cost greater than this value. (double(1)). \cr
                     Default: no filter}
}
\details{
  The input files should follow the format as the output files of the method \code{\link{formatSTRINGPPI}} or \code{\link{formatPINAPPI}}. 
  See the files \code{STRINGPPI.txt} or \code{PINAPPI.txt} as examples.
  Fields from one to four contain the Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The \code{PubMed ID} field should be stated to be "NA" if unavailable. 
  The \code{evidence} field may present an introduction to the evidence. 
  The \code{edgeValue} field should be given a value no less than \code{1}. 
  This value will be treated as the cost of identifying the shortest paths. 
  If there is no method available to estimate this value, please give the value as \code{1}.
}
\seealso{
 \code{\link{formatSTRINGPPI}}, \code{\link{formatPINAPPI}}, \code{\link{cisPath}}.
}
\examples{
    library(cisPath)
    inputFile1 <- system.file("extdata", "PINAPPI.txt", package="cisPath")
    inputFile2 <- system.file("extdata", "STRINGPPI.txt", package="cisPath")
    output <- file.path(tempdir(), "STRINGANDPINA.txt")
    combinePPI(c(inputFile1, inputFile2), output, maxEdgeValue=1.4)
}
\keyword{methods}