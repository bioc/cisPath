\name{getMappingFile}
\alias{getMappingFile}
\alias{getMappingFile,character,character-method}
\title{Generate the identifier mapping file}
\description{
  This method is used to generate the identifier mapping file which is necessary for the method \code{\link{formatSTRINGPPI}}.
}
\usage{
getMappingFile(input, output, taxonId="")
\S4method{getMappingFile}{character,character}(input, output, taxonId="")
}
\arguments{
 \item{input}{File downloaded from UniProt database (character(1)).}
 \item{output}{Output file (character(1)).}
 \item{taxonId}{NCBI taxonomy specie identifier (character(1)). \cr
                This method will process only data for this specie. \cr
                Default: process all data (recommended).}
}
\details{
   The input file is downloaded from the UniProt (\url{http://www.uniprot.org/}) database. 

  All species: 
  \url{ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_sprot.dat.gz}  \cr
  Taxonomic divisions: 
  \url{ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/taxonomic_divisions/} 

  uniprot_sprot_archaea.dat.gz contains all archaea entries. \cr
  uniprot_sprot_bacteria.dat.gz contains all bacteria entries. \cr
  uniprot_sprot_fungi.dat.gz contains all fungi entries. \cr
  uniprot_sprot_human.dat.gz contains all human entries. \cr
  uniprot_sprot_invertebrates.dat.gz contains all invertebrate entries. \cr
  uniprot_sprot_mammals.dat.gz contains all mammalian entries except human and rodent entries. \cr
  uniprot_sprot_plants.dat.gz contains all plant entries. \cr
  uniprot_sprot_rodents.dat.gz contains all rodent entries. \cr
  uniprot_sprot_vertebrates.dat.gz contains all vertebrate entries except mammals. \cr
  uniprot_sprot_viruses.dat.gz contains all eukaryotic entries except those from vertebrates, fungi and plants. \cr
  We suggest you take a look at the README file before you download these files.  \cr \cr

  If you make use of these files, please cite the UniProt database.
}
\value{
  The output file contains identifier mapping information which is necessary for the method \code{\link{formatSTRINGPPI}}.
  Each line contains both the Ensembl Genomes Protein identifier and the Swiss-Prot accession number for a given protein.
}
\seealso{
 \code{\link{cisPath}}, 
 \code{\link{formatSTRINGPPI}}.
}
\examples{
    library(cisPath)
    input <- system.file("extdata", "uniprot_sprot_human10.dat", package="cisPath")
    output <- file.path(tempdir(), "mappingFile.txt")
    getMappingFile(input, output, taxonId="9606")
    
\dontrun{
    source("http://bioconductor.org/biocLite.R")
    biocLite("R.utils")
    library(R.utils)
    
    outputDir <- "/home/user/cisPath_test"
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Download protein information file for humans only from UniProt (decompressed:~246M)
    destfile <- file.path(outputDir, "uniprot_sprot_human.dat.gz");
    cat("Downloading...\n")
    download.file("ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/taxonomic_divisions/uniprot_sprot_human.dat.gz", destfile)
    gunzip(destfile, overwrite=TRUE, remove=FALSE)
    
    # Generate identifier mapping file
    fileFromUniProt <- file.path(outputDir, "uniprot_sprot_human.dat")
    mappingFile <- file.path(outputDir, "mappingFile.txt")
    getMappingFile(fileFromUniProt, output=mappingFile)
    }
}
\keyword{methods}