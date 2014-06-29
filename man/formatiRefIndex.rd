\name{formatiRefIndex}
\alias{formatiRefIndex}
\alias{formatiRefIndex,character,character-method}
\title{Format PPI files downloaded from the iRefIndex database}
\description{
  This method is used to format the PPI file which is downloaded from the iRefIndex database.
}
\usage{
formatiRefIndex(input, output, taxonId="")
\S4method{formatiRefIndex}{character,character}(input, output, taxonId="")
}
\arguments{
 \item{input}{File downloaded from the iRefIndex database (character(1)).}
 \item{output}{Output file (character(1)).}
 \item{taxonId}{NCBI taxonomy specie identifier (character(1)). \cr
                Process only data for this specie. \cr
                Examples: \cr
                \code{9606:  Homo sapiens}    \cr
                \code{4932:  Saccharomyces cerevisiae}   \cr
                \code{6239:  Caenorhabditis elegans}   \cr
                \code{7227:  Drosophila melanogaster}  \cr
                \code{10090: Mus musculus} \cr
                \code{10116: Rattus norvegicus} 
                }
}
\details{
  The input file is downloaded from the iRefIndex database (\url{http://irefindex.org/wiki/}). \cr
  Access \url{http://irefindex.org/download/irefindex/data/archive/release_13.0/psi_mitab/MITAB2.6/} to download PPI files with the \code{MITAB2.6 format} for different species. \cr
  If you make use of this file, please cite the iRefIndex database.
}
\value{
  Each line of the output file contains Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The edge value will be assigned as \code{1} for each link between two interacting proteins. 
  This may be treated as the ``cost'' while identifying the shortest paths between proteins. 
  Advanced users can edit the file and change this value for each edge.
}
\references{
  Razick S. and et al. (2008) iRefIndex: A consolidated protein interaction database with provenance. \emph{BMC Bioinformatics}, \bold{9}, 405
  
  Aranda, B. and et al. (2011) PSICQUIC and PSISCORE: accessing and scoring molecular interactions, \emph{Nat Methods}, \bold{8}, 528-529.
}
\seealso{
 \code{\link{cisPath}}, \code{\link{formatPINAPPI}}, \code{\link{formatSIFfile}}, \code{\link{formatSTRINGPPI}}, \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    input <- system.file("extdata", "9606.mitab.100.txt", package="cisPath")
    output <- file.path(tempdir(), "iRefIndex.txt")
    formatiRefIndex(input, output)
    
\dontrun{
    outputDir <- file.path(getwd(), "cisPath_test")
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Download iRefIndex PPI for humans only (compressed:~105M, decompressed:~757M)
    destfile <- file.path(outputDir, "9606.mitab.08122013.txt.zip")
    cat("Downloading...\n")
    httpURL <- "http://irefindex.org/download"
    filePath <- "irefindex/data/archive/release_13.0/psi_mitab/MITAB2.6"
    fileName <- "9606.mitab.08122013.txt.zip"
    URL <- paste(httpURL, filePath, fileName, sep="/")
    download.file(URL, destfile)
    unzip(destfile, overwrite=TRUE, exdir=outputDir)

    # Format iRefIndex PPI
    fileFromiRef <- file.path(outputDir, "9606.mitab.08122013.txt")
    iRefIndex <- file.path(outputDir, "iRefIndex.txt")
    formatiRefIndex(fileFromiRef, output=iRefIndex)
    }
}
\keyword{methods}