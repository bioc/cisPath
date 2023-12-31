\name{cisPath}
\alias{cisPath}
\alias{cisPath,character,character-method}
\title{Visualization of the shortest paths of functional interaction between proteins}
\description{
  This method is used to identify and visualize the shortest functional paths between proteins in the protein--protein interaction (PPI) network.
}
\usage{
cisPath(infoFile, outputDir, proteinName=NULL, targetProteins=NULL, swissProtID=FALSE, sprotFile="", tremblFile="", 
        nodeColors=c("#1F77B4", "#FF7F0E", "#D62728", "#9467BD", "#8C564B", "#E377C2"), leafColor="#2CA02C", byStep=FALSE)
\S4method{cisPath}{character,character}(infoFile, outputDir, proteinName=NULL, targetProteins=NULL, swissProtID=FALSE, sprotFile="", tremblFile="",  
        nodeColors=c("#1F77B4", "#FF7F0E", "#D62728", "#9467BD", "#8C564B", "#E377C2"), leafColor="#2CA02C", byStep=FALSE)
}
\arguments{
 \item{infoFile}{File that contains PPI data (character(1)). \cr Please see the file \code{PPI_Info.txt} as an example.}
 \item{outputDir}{Output directory (character(1)).}
 \item{proteinName}{Gene name or Swiss-Prot accession number of the source protein (character(1)). \cr If \code{null}, identify the shortest functional paths in the web page.}
 \item{targetProteins}{Gene names or Swiss-Prot accession numbers of the target proteins (character vector). \cr If \code{null}, treat all other proteins as potential targets.}
 \item{swissProtID}{A logical value. If \code{targetProteins} contains Swiss-Prot accession numbers, set as \code{TRUE}. \cr If \code{targetProteins} contains gene names, set as \code{FALSE}.}
 \item{sprotFile}{Input: File downloaded from the UniProt database (UniProtKB/Swiss-Prot) (character(1)).}
 \item{tremblFile}{Input: File downloaded from the UniProt database (UniProtKB/TrEMBL) (character(1)).}
 \item{nodeColors}{Represents colors for main nodes in the graph. If there are fewer values than main nodes, it will be recycled in the standard manner. \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.}
 \item{leafColor}{Represents color for leaf nodes in the graph. (character(1)) \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.
            }
 \item{byStep}{A logical value. If users wish to identify the paths utilizing the shortest number of steps (instead of minimal cost), set \code{byStep} as \code{TRUE}. \cr
               In this situation, all the edge costs will be assigned as \code{1}. \cr
               \code{Note:} If viewing more possible paths between two proteins is desired, we recommend this value be set as \code{TRUE}.
              }
}
\details{
  The input PPI data file  \code{infoFile} should follow the format as the output files of the method \code{\link{formatSTRINGPPI}}, \code{\link{formatPINAPPI}}, or \code{\link{formatiRefIndex}}. 
  See files \code{STRINGPPI.txt} or \code{PINAPPI.txt} as examples.
  The first four fields contain the Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The \code{PubMedID} field should be stated to be \code{NA} if unavailable. 
  The \code{evidence} field may present an introduction to the evidence. 
  The \code{edgeValue} field should be assigned a value no less than \code{1}. 
  This value will be treated as the cost while identifying the shortest paths. 
  If there is no method available to estimate this value, please give the value as \code{1}.
  
  The shortest functional paths between the proteins are calculated using Dijkstra's algorithm. 
  The results are shown in an HTML file, and users can easily query them using a browser. 
  Each shortest path is displayed as a force-directed graph (\url{http://bl.ocks.org/4062045}) with JavaScript library D3 (\url{www.d3js.org}). 
  The HTML file follows HTML 4.01 Strict and CSS version 3 standards to maintain consistency across different browsers. 
  Chrome, Firefox, Safari, and IE9 will all properly display the PPI view. 
  Please contact us if the paths do not display correctly. \cr
  
  As an example, we have generated PPI interaction data for several species 
  from the PINA database (\url{http://cbg.garvan.unsw.edu.au/pina/}), STRING database (\url{http://string-db.org/}), and iRefIndex database (\url{http://www.irefindex.org/wiki/}). 
  Users can download these files from \url{http://www.isb.pku.edu.cn/cisPath/}.  
  If you make use of these files, please cite PINA, STRING, and iRefIndex accordingly. 
  Users can edit the PPI interactions generated with these two databases, or combine them with their private data to construct more complete PPI interaction networks.
  In this package, we select only a small portion of the available PPI interaction data as an example. 
  An ID mapping file is also provided in this package, which was generated according to the data from the UniProt (\url{http://www.uniprot.org/}) database. \cr
  
  Using this method, a protein must be chosen as the source protein. 
  However, target proteins need not be chosen. 
  If target proteins are not provided, this method will identify the shortest paths between the source protein and all other relevant proteins. 
  The user can query the results upon finding an interesting ``target'' protein.
  Although the output in such cases is large, we strongly suggest users give this method of selecting a source but not a target a try.  \cr
    
  A protein often has several names, and some of these names have perhaps not been included in the input file \code{infoFile}.
  We therefore suggest users take a look at the output file \code{targetIDs.txt} to check whether the input protein names are valid.
  In order to avoid inputting invalid target protein names, the unique identifier Swiss-Prot accession numbers may alternatively be used as input. 
  The Swiss-Prot accession numbers can be sought in the UniProt (\url{http://www.uniprot.org/}) database. We strongly suggest users provide 
  the files from downloaded from the UniProt database (\code{sprotFile} and \code{tremblFile}).
  
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
  A list will be returned, and each element will contain the shortest paths from the source protein to a target protein. \cr

  The output directory contains the shortest paths from a source protein to the target proteins.
  Users can search for the paths easily using a browser.
  The file \code{validInputProteins.txt} contains the proteins that are valid as input to the HTML file.
  Please take a look at the output file \code{targetIDs.txt} to check whether the input protein names to this method are valid. \cr
}
\references{
  Cowley, M.J. and et al. (2012) PINA v2.0: mining interactome modules. \emph{Nucleic Acids Res}, \bold{40}, D862-865. 

  Wu, J. and et al. (2009) Integrated network analysis platform for protein-protein interactions. \emph{Nature methods}, \bold{6}, 75-77.
  
  Razick S. and et al. (2008) iRefIndex: A consolidated protein interaction database with provenance. \emph{BMC Bioinformatics}, \bold{9}, 405
  
  Aranda, B. and et al. (2011) PSICQUIC and PSISCORE: accessing and scoring molecular interactions, \emph{Nat Methods}, \bold{8}, 528-529.
  
  Szklarczyk,D. and et al. (2011) The STRING database in 2011: functional interaction networks of proteins, globally integrated and scored. \emph{Nucleic Acids Res}, \bold{39}, D561-D568.
  
  Franceschini,A. and et al. (2013) STRING v9.1: protein-protein interaction networks, with increased coverage and integration. \emph{Nucleic Acids Res}, \bold{41}, D808-D815.
  
  UniProt Consortium and others. (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res}, \bold{40}, D71-D75.
  
}
\seealso{
 \code{\link{formatSTRINGPPI}}, \code{\link{formatPINAPPI}}, \code{\link{formatSIFfile}}, \code{\link{formatiRefIndex}}, \code{\link{combinePPI}}, \code{\link{networkView}}, \code{\link{easyEditor}}.
}
\examples{
    # examples
    infoFile <- system.file("extdata", "PPI_Info.txt", package="cisPath")
    
    # source protein: TP53
    # Identify the shortest functional paths from TP53 to all other relevant proteins
    outputDir <- file.path(tempdir(), "TP53_example1")
    results <- cisPath(infoFile, outputDir, "TP53", byStep=TRUE)
    
    # Identify the shortest paths from TP53 to proteins MAGI1 and GH1
    outputDir <- file.path(tempdir(), "TP53_example2")
    results <- cisPath(infoFile, outputDir, "TP53", targetProteins=c("MAGI1", "GH1"), byStep=TRUE)
    results
    
    # Identify the shortest paths from TP53 to proteins Q96QZ7 and P01241 (with the Swiss-Prot accession numbers)
    outputDir <- file.path(tempdir(), "TP53_example3")
    results <- cisPath(infoFile, outputDir, "TP53", targetProteins=c("Q96QZ7", "P01241"), swissProtID=TRUE, byStep=FALSE)
    
    # Identify the shortest functional paths in the web page
    outputDir <- file.path(tempdir(), "cisPath_example")
    results <- cisPath(infoFile, outputDir)

\dontrun{
    # example of downloading PPI data from our website
    
    # Change to your own output directory
    outputDir <- file.path(getwd(), "TP53")
    # Create the output directory
    dir.create(outputDir, showWarnings=FALSE, recursive=TRUE)
    
    # infoFile: site where the PPI data file will be saved.
    infoFile <- file.path(outputDir, "PPIdata.txt")
    
    # Download PPI data from our website
    download.file("http://www.isb.pku.edu.cn/cispath/data/Homo_sapiens_PPI.txt", infoFile)
    download.file("http://www.isb.pku.edu.cn/cispath/data/Caenorhabditis_elegans_PPI.txt", infoFile)
    download.file("http://www.isb.pku.edu.cn/cispath/data/Drosophila_melanogaster_PPI.txt", infoFile)
    download.file("http://www.isb.pku.edu.cn/cispath/data/Mus_musculus_PPI.txt", infoFile)
    download.file("http://www.isb.pku.edu.cn/cispath/data/Rattus_norvegicus_PPI.txt", infoFile)
    download.file("http://www.isb.pku.edu.cn/cispath/data/Saccharomyces_cerevisiae_PPI.txt", infoFile)
    
    results <- cisPath(infoFile, outputDir, "TP53")
    outputDir <- file.path(getwd(), "cisPathWeb")
    results <- cisPath(infoFile, outputDir)
    }
}
\keyword{methods}