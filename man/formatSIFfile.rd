\name{formatSIFfile}
\alias{formatSIFfile}
\alias{formatSIFfile,character,character,character-method}
\title{Format PPI file downloaded from the PINA2 database (SIF Format)}
\description{
  This method is used to format the PPI file which is downloaded from the PINA2 database (SIF Format).
}
\usage{
formatSIFfile(input, mappingFile, output)
\S4method{formatSIFfile}{character,character,character}(input, mappingFile, output)
}
\arguments{
 \item{input}{File downloaded from the PINA2 database (SIF Format) (character(1)).}
 \item{mappingFile}{Identifier mapping file (character(1)). \cr
                    Generate this file with method \code{\link{getMappingFile}}.}
 \item{output}{Output file (character(1)).}
}
\details{
  The input file (SIF Format) is downloaded from PINA2 database (\url{http://cbg.garvan.unsw.edu.au/pina/}). \cr
  Access \url{http://cbg.garvan.unsw.edu.au/pina/interactome.stat.do} to download PPI files with the \code{SIF format} for different species. \cr
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
 \code{\link{cisPath}}, \code{\link{getMappingFile}}, \code{\link{formatPINAPPI}}, \code{\link{formatSTRINGPPI}}, \code{\link{formatiRefIndex}}, \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    
    # Generate the identifier mapping file 
    input <- system.file("extdata", "uniprot_sprot_human10.dat", package="cisPath")
    mappingFile <- file.path(tempdir(), "mappingFile.txt")
    getMappingFile(input, output=mappingFile, taxonId="9606")
    
    # Format the file downloaded from STRING database
    output <- file.path(tempdir(), "PINA2PPI.txt")
    fileFromPINA2 <- system.file("extdata", "Homo_sapiens_PINA2.sif", package="cisPath")
    formatSIFfile(fileFromPINA2, mappingFile, output)
    
\dontrun{
    source("http://bioconductor.org/biocLite.R")
    biocLite("R.utils")
    library(R.utils)
    
    outputDir <- file.path(getwd(), "cisPath_test")
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Generate the identifier mapping file 
    fileFromUniProt <- file.path(outputDir, "uniprot_sprot_human.dat")
    mappingFile <- file.path(outputDir, "mappingFile.txt")
    getMappingFile(fileFromUniProt, output=mappingFile)
    
    # Download PINA2 PPI (SIF format) for humans only (~2.8M)
    destfile <- file.path(outputDir, "Homo_sapiens.sif")
    cat("Downloading...\n")
    download.file("http://cbg.garvan.unsw.edu.au/pina/download/Homo\%20sapiens-20140521.sif", destfile)
    
    # Format PINA2 PPI
    fileFromPINA2 <- file.path(outputDir, "Homo_sapiens.sif")
    PINA2PPI <- file.path(outputDir, "PINA2PPI.txt")
    formatSIFfile(fileFromPINA2, mappingFile, output=PINA2PPI)
    }    
}
\keyword{methods}