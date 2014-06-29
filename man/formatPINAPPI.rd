\name{formatPINAPPI}
\alias{formatPINAPPI}
\alias{formatPINAPPI,character,character-method}
\title{Format PPI files downloaded from the PINA database (MITAB Format)}
\description{
  This method is used to format the PPI file which is downloaded from the PINA database (MITAB Format).
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
  The input file (MITAB Format) is downloaded from the PINA database (\url{http://cbg.garvan.unsw.edu.au/pina/}). \cr
  Access \url{http://cbg.garvan.unsw.edu.au/pina/interactome.stat.do} to download PPI files with the \code{MITAB format} for different species. \cr
  If you make use of this file, please cite the PINA database.
}
\value{
  Each line of the output file contains Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The edge value will be assigned as \code{1} for each link between two interacting proteins. 
  This may be treated as the ``cost'' while identifying the shortest paths between proteins. 
  Advanced users can edit the file and change this value for each edge.
}
\references{
  Cowley, M.J. and et al. (2012) PINA v2.0: mining interactome modules. \emph{Nucleic Acids Res}, \bold{40}, D862-865. 

  Wu, J. and et al. (2009) Integrated network analysis platform for protein-protein interactions. \emph{Nature methods}, \bold{6}, 75-77.  
}
\seealso{
 \code{\link{cisPath}}, \code{\link{formatSIFfile}}, \code{\link{formatiRefIndex}}, \code{\link{formatSTRINGPPI}}, \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    input <- system.file("extdata", "Homo_sapiens_PINA100.txt", package="cisPath")
    output <- file.path(tempdir(), "PINAPPI.txt")
    formatPINAPPI(input, output)
    
\dontrun{
    outputDir <- file.path(getwd(), "cisPath_test")
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Download PINA PPI (MITAB format) for humans only (~96M)
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