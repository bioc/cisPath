\name{formatSTRINGPPI}
\alias{formatSTRINGPPI}
\alias{formatSTRINGPPI,character,character,character,character-method}
\title{Format PPI file downloaded from the STRING database}
\description{
  This method is used to format the PPI file which is downloaded from the STRING database.
}
\usage{
formatSTRINGPPI(input, mappingFile, taxonId, output, minScore=700)
\S4method{formatSTRINGPPI}{character,character,character,character}(input, mappingFile, taxonId, output, minScore=700)
}
\arguments{
 \item{input}{File downloaded from the STRING database (character(1)).}
 \item{mappingFile}{Identifier mapping file (character(1)). \cr
                    Generate this file with method \code{\link{getMappingFile}}.}
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
 \item{output}{Output file (character(1)).}
 \item{minScore}{Filter out PPI information with STRING scores less than this value. (integer(1)). \cr
                 Recommended default 700 (Only consider high confidence interactions).}
}
\details{
  The input file is downloaded from the STRING database (\url{http://string-db.org/}). 
  The URL of this file is \url{http://string-db.org/newstring_download/protein.links.v9.1.txt.gz}.  
  Access \url{http://string-db.org/newstring_download/species.v9.1.txt} to determine the parameter \code{taxonId}. 
  Access \url{http://string-db.org/newstring_cgi/show_download_page.pl} for more details. \cr
  If you make use of this file, please cite the STRING database.

}
\value{  
  Each line of the output file contains Swiss-Prot accession numbers and gene names for two interacting proteins. 
  An edge value is estimated for each link between two interacting proteins. 
  This value is defined as \code{max(1,log(1000-STRING_SCORE,100))}. 
  This may be treated as the ``cost'' while determining the shortest paths between proteins. 
  Advanced users can edit the file and change this value for each edge.
}
\references{
  Szklarczyk,D. and et al. (2011) The STRING database in 2011: functional interaction networks of proteins, globally integrated and scored. \emph{Nucleic Acids Res}, \bold{39}, D561-D568.
  
  Franceschini,A. and et al. (2013) STRING v9.1: protein-protein interaction networks, with increased coverage and integration. \emph{Nucleic Acids Res}, \bold{41}, D808-D815.
  
  UniProt Consortium and others. (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res} \bold{40}, D71-D75.
  
}
\seealso{
 \code{\link{cisPath}}, \code{\link{getMappingFile}}, \code{\link{formatPINAPPI}}, \code{\link{formatSIFfile}}, \code{\link{formatiRefIndex}}, \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    
    # Generate the identifier mapping file 
    input <- system.file("extdata", "uniprot_sprot_human10.dat", package="cisPath")
    mappingFile <- file.path(tempdir(), "mappingFile.txt")
    getMappingFile(input, output=mappingFile, taxonId="9606")
    
    # Format the file downloaded from STRING database
    output <- file.path(tempdir(), "STRINGPPI.txt")
    fileFromSTRING <- system.file("extdata", "protein.links.txt", package="cisPath")
    formatSTRINGPPI(fileFromSTRING, mappingFile, "9606", output, 700)
    
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
    
    # Download STRING PPI for Homo sapiens (compressed:~27M, decompressed:~213M)
    destfile <- file.path(outputDir, "9606.protein.links.v9.1.txt.gz")
    cat("Downloading...\n")
    download.file("http://string-db.org/newstring_download/protein.links.v9.1/9606.protein.links.v9.1.txt.gz", destfile)
    cat("Uncompressing...\n")
    gunzip(destfile, overwrite=TRUE, remove=FALSE)
    
    # Format STRING PPI
    fileFromSTRING <- file.path(outputDir, "9606.protein.links.v9.1.txt")
    STRINGPPI <- file.path(outputDir, "STRINGPPI.txt")
    formatSTRINGPPI(fileFromSTRING, mappingFile, "9606", output=STRINGPPI, 700)
    }    
}
\keyword{methods}