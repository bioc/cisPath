\name{formatPINAPPI}
\alias{formatPINAPPI}
\alias{formatPINAPPI,character,character-method}
\title{Format PPI files downloaded from the PINA database}
\description{
  This method is used to format the PPI file which is downloaded from the PINA database.
}
\usage{
formatPINAPPI(input, output)
\S4method{formatPINAPPI}{character,character}(input, output)
}
\arguments{
 \item{input}{File downloaded from the PINA database (character(1)).}
 \item{output}{Output file (character(1)).}
}
\details{
  The input file is downloaded from the PINA database (\url{http://cbg.garvan.unsw.edu.au/pina/}). \cr
  Access \url{http://cbg.garvan.unsw.edu.au/pina/interactome.stat.do} to download PPI files with the \code{MITAB format} for different species. \cr
  If you make use of this file, please cite the PINA database.
}
\value{
  Each line of the output file contains Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The edge value will be assigned as \code{1} for each link between two interacting proteins. 
  This may be treated as the "cost" of identifying the shortest paths between two proteins. 
  Advanced users can edit the file and change this value for each edge.
}
\seealso{
 \code{\link{cisPath}}, \code{\link{formatSTRINGPPI}}, \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    input <- system.file("extdata", "Homo_sapiens_PINA100.txt", package="cisPath")
    output <- file.path(tempdir(), "PINAPPI.txt")
    formatPINAPPI(input, output)
    
\dontrun{
    outputDir <- "/home/user/cisPath_test"
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Download PINA PPI for humans only (~96M)
    destfile <- file.path(outputDir, "Homo_sapiens.txt")
    cat("Downloading...\n")
    download.file("http://cbg.garvan.unsw.edu.au/pina/download/Homo\%20sapiens-20121210.txt", destfile)

    # Format PINA PPI
    fileFromPINA <- file.path(outputDir, "Homo_sapiens.txt")
    PINAPPI <- file.path(outputDir, "PINAPPI.txt")
    formatPINAPPI(fileFromPINA, output=PINAPPI)
    }
}
\keyword{methods}