\name{getMappingFile}
\alias{getMappingFile}
\alias{getMappingFile,character,character-method}
\title{Generate the identifier mapping file}
\description{
  This method is used to generate the identifier mapping file which is necessary for methods \code{\link{formatSIFfile}} and \code{\link{formatSTRINGPPI}}.
}
\usage{
getMappingFile(sprotFile, output, tremblFile="", taxonId="")
\S4method{getMappingFile}{character,character}(sprotFile, output, tremblFile="", taxonId="")
}
\arguments{
 \item{sprotFile}{Input: File downloaded from the UniProt database (UniProtKB/Swiss-Prot) (character(1)).}
 \item{output}{Output file (character(1)).}
 \item{tremblFile}{Input: File downloaded from the UniProt database (UniProtKB/TrEMBL) (character(1)).}
 \item{taxonId}{NCBI taxonomy specie identifier (character(1)). \cr
                This method will process only data for this specie. \cr
                Default: process all data (recommended).}
}
\details{
   UniProtKB/Swiss-Prot: fully annotated curated entries. \cr
   UniProtKB/TrEMBL: computer-generated entries enriched with automated classification and annotation. \cr
   \code{sprotFile} is mandatory, while \code{tremblFile} is optional. 
   If users only want to process the reviewed proteins from the UniProt database, \code{tremblFile} should be ignored. \cr  

  All species: 
  \url{ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_sprot.dat.gz}  \cr
  \url{ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_trembl.dat.gz}  \cr
  Taxonomic divisions: 
  \url{ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/taxonomic_divisions/} 

  uniprot_sprot_archaea.dat.gz and uniprot_trembl_archaea.dat.gz contain all archaea entries. \cr
  uniprot_sprot_bacteria.dat.gz and uniprot_trembl_bacteria.dat.gz contain all bacteria entries. \cr
  uniprot_sprot_fungi.dat.gz and uniprot_trembl_fungi.dat.gz contain all fungi entries. \cr
  uniprot_sprot_human.dat.gz and uniprot_trembl_human.dat.gz contain all human entries. \cr
  uniprot_sprot_invertebrates.dat.gz and uniprot_trembl_invertebrates.dat.gz contain all invertebrate entries. \cr
  uniprot_sprot_mammals.dat.gz and uniprot_trembl_mammals.dat.gz contain all mammalian entries except human and rodent entries. \cr
  uniprot_sprot_plants.dat.gz and uniprot_trembl_plants.dat.gz contain all plant entries. \cr
  uniprot_sprot_rodents.dat.gz and uniprot_trembl_rodents.dat.gz contain all rodent entries. \cr
  uniprot_sprot_vertebrates.dat.gz and uniprot_trembl_vertebrates.dat.gz contain all vertebrate entries except mammals. \cr
  uniprot_sprot_viruses.dat.gz and uniprot_trembl_viruses.dat.gz contain all eukaryotic entries except those from vertebrates, fungi and plants. \cr
  We suggest you take a look at the README file before you download these files.  \cr \cr
  
  If you make use of these files, please cite the UniProt database.
}
\value{
  The output file contains identifier mapping information which is necessary for methods \code{\link{formatSIFfile}} and \code{\link{formatSTRINGPPI}}.
  Each line contains both the Ensembl Genomes Protein identifier and the Swiss-Prot accession number for a given protein.
}
\references{
  UniProt Consortium and others. (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res} \bold{40}, D71-D75.
  
}
\seealso{
 \code{\link{cisPath}}, 
 \code{\link{formatSTRINGPPI}}, 
 \code{\link{formatSIFfile}},
 \code{\link{combinePPI}}.
}
\examples{
    library(cisPath)
    sprotFile <- system.file("extdata", "uniprot_sprot_human10.dat", package="cisPath")
    output <- file.path(tempdir(), "mappingFile.txt")
    getMappingFile(sprotFile, output, taxonId="9606")
    
\dontrun{
    if (!requireNamespace("BiocManager", quietly=TRUE))
        install.packages("BiocManager")
    BiocManager::install("R.utils")
    library(R.utils)
    
    outputDir <- file.path(getwd(), "cisPath_test")
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # Download protein information file for humans only from UniProt (decompressed:~246M)
    destfile <- file.path(outputDir, "uniprot_sprot_human.dat.gz");
    cat("Downloading...\n")
    download.file("ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/taxonomic_divisions/uniprot_sprot_human.dat.gz", destfile)
    gunzip(destfile, overwrite=TRUE, remove=FALSE)
    
    destfile <- file.path(outputDir, "uniprot_trembl_human.dat.gz");
    cat("Downloading...\n")
    download.file("ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/taxonomic_divisions/uniprot_trembl_human.dat.gz", destfile)
    gunzip(destfile, overwrite=TRUE, remove=FALSE)
    
    # Generate identifier mapping file
    sprotFile <- file.path(outputDir, "uniprot_sprot_human.dat")
    tremblFile <- file.path(outputDir, "uniprot_trembl_human.dat")
    mappingFile <- file.path(outputDir, "mappingFile.txt")
    getMappingFile(sprotFile, output=mappingFile, tremblFile)
    }
}
\keyword{methods}