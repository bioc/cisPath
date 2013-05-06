\name{cisPath}
\alias{cisPath}
\alias{cisPath,character,character,character-method}
\title{Visualization of the shortest paths of functional interaction between proteins}
\description{
  This method is used to identify and visualize the shortest functional paths between proteins in the protein-protein interaction (PPI) network.
}
\usage{
cisPath(infoFile, proteinName, outputDir, targetProteins=NULL, swissProtID=FALSE, name2IDFile=NULL, 
        nodeColors=c("#1F77B4", "#FF7F0E", "#D62728","#9467BD","#8C564B","#E377C2"), leafColor="#2CA02C", byStep=FALSE)
\S4method{cisPath}{character,character,character}(infoFile, proteinName, outputDir, targetProteins=NULL, swissProtID=FALSE, name2IDFile=NULL, 
        nodeColors=c("#1F77B4", "#FF7F0E", "#D62728","#9467BD","#8C564B","#E377C2"), leafColor="#2CA02C", byStep=FALSE)
}
\arguments{
 \item{infoFile}{File that contains PPI data (character(1)). \cr Please see the file \code{PPI_Info.txt} as an example.}
 \item{proteinName}{Gene name or Swiss-Prot number of the source protein (character(1)).}
 \item{outputDir}{Output directory (character(1)).}
 \item{targetProteins}{Gene names or Swiss-Prot numbers of the target proteins (character vector). \cr If \code{null}, treat all other proteins as potential targets.}
 \item{swissProtID}{A logical value. If \code{targetProteins} contains Swiss-Prot numbers, set as \code{TRUE}. \cr If \code{targetProteins} contains gene names, set as \code{FALSE}.}
 \item{name2IDFile}{File contains ID Mapping information (character(1)).  \cr Please see the file \code{name2prot.txt} as an example.}
 \item{nodeColors}{Represents colors for main nodes in the graph. If there are fewer values than main nodes, it will be recycled in the standard manner. \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.}
 \item{leafColor}{Represents color for leaf nodes in the graph. (character(1)) \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.
            }
 \item{byStep}{A logical value. If users wish to identify the paths utilizing the shortest steps (instead of minimal cost), set \code{byStep} as \code{TRUE}. 
               In this situation, all edge cost will be assigned the value \code{1}. \cr
               \code{Note:} If viewing more possible paths between two proteins is desired, we recommend this value be set as \code{TRUE}.
              }
}
\details{
  The input PPI data file  \code{infoFile} should follow the format as the output files of the method \code{\link{formatSTRINGPPI}} or \code{\link{formatPINAPPI}}. 
  See files files \code{STRINGPPI.txt} or \code{PINAPPI.txt} as examples.
  The fields one to four contain the Swiss-Prot accession numbers and gene names for two interacting proteins. 
  The \code{PubMed ID} field should be stated to be "NA" if unavailable. 
  The \code{evidence} field may present an introduction to the evidence. 
  The \code{edgeValue} field should be assigned a value no less than \code{1}. 
  This value will be treated as the cost of identifying the shortest paths. 
  If there is no method available to estimate this value, please give the value as \code{1}.
  
  The shortest functional paths between the proteins are calculated using Dijkstra's algorithm. 
  The results are shown in an HTML file, and users can easily query them using a browser. 
  Each shortest path is displayed as a Force-Directed Graph (\url{http://bl.ocks.org/4062045}) with JavaScript library D3 (\url{www.d3js.org}). 
  The HTML file follows HTML 4.01 Strict and CSS version 3 standards to maintain consistency across different browsers. 
  Chrome, Firefox, Safari, and IE9 will all properly display the PPI view. 
  Please contact us if the paths do not display correctly. \cr
  
  As an example, we have generated protein-protein interaction data for several species 
  from the PINA database (\url{http://cbg.garvan.unsw.edu.au/pina/}) and the STRING database (\url{http://string-db.org/}). 
  Users can download these files from \url{http://www.isb.pku.edu.cn/cisPath/}.  
  If you make use of these files, please cite PINA or STRING accordingly. 
  Users can edit the protein-protein interactions generated with these two databases, or combine them with their private data to construct more complete protein-protein interaction networks.
  In this package, we select only a small portion of the available protein-protein interaction data as an example. 
  An ID mapping file is also provided in this package, which was generated according to the data from the UniProt (\url{http://www.uniprot.org/}) database. \cr
  
  Using this method, a protein must be chosen as the source protein. 
  However, target proteins need not be chosen. 
  If target proteins are not provided, this method will identify the shortest paths between the source protein and all other relevant proteins. 
  The user can query the results whenever he finds an interesting "target" protein.
  Although the output in such cases is large, we strongly suggest users give this method of selecting a source but not a target a try.  \cr
    
  A protein often has several names, and some of these names have perhaps not been included in the input file \code{infoFile}.
  We therefore suggest users take a look at the output file \code{targetIDs.txt} to check whether the input protein names are valid.
  In order to avoid inputting invalid target protein names, the unique identifier Swiss-Prot numbers may alternately be used as input. 
  The Swiss-Prot numbers can be sought in the UniProt (\url{http://www.uniprot.org/}) database.
  The parameter \code{name2IDFile} allows users to add ID mapping information. 
  In this way, users can search for the shortest paths using the protein names with which they are familiar.
}
\value{
  A list will be returned, and each element will contains the shortest paths from the source protein to a target protein. \cr

  The output directory contains the shortest paths from a source protein to the target proteins.
  Users can search for the paths easily using a browser.
  The file \code{validInputProteins.txt} contains the proteins that are valid as input to the HTML file.
  Please take a look at the output file \code{targetIDs.txt} to check whether the input protein names to this method are valid. \cr
  
  With combined PPI data from PINA and STRING, the output from a single source protein is about \code{1.2G} in size.
}
\references{
  Cowley, M.J. and et al. (2012) PINA v2.0: mining interactome modules. \emph{Nucleic Acids Res}, \bold{40}, D862-865. 

  Wu, J. and et al. (2009) Integrated network analysis platform for protein-protein interactions. \emph{Nature methods}, \bold{6}, 75-77.
  
  Szklarczyk,D. and et al. (2011) The STRING database in 2011: functional interaction networks of proteins, globally integrated and scored. \emph{Nucleic Acids Res}, \bold{39}, D561-D568.
  
  The UniProt Consortium (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res} \bold{40}, D71-D75.
  
}
\seealso{
 \code{\link{formatSTRINGPPI}}, \code{\link{formatPINAPPI}}, \code{\link{combinePPI}}, \code{\link{addProteinNames}}, \code{\link{networkView}}, \code{\link{easyEditor}}.
}
\examples{
    # examples
    infoFile <- system.file("extdata", "PPI_Info.txt", package="cisPath")
    outputDir <- file.path(tempdir(), "TP53_example")
    
    # source protein: TP53
    # Identify the shortest functional paths from TP53 to all other relevant proteins 
    results <- cisPath(infoFile, "TP53", outputDir, byStep=TRUE)
    results["GH1"]
    results["P01241"]
    
    # Identify the shortest paths from TP53 to proteins MAGI1 and GH1
    results <- cisPath(infoFile, "TP53", outputDir, targetProteins=c("MAGI1", "GH1"), byStep=TRUE)
    results
    
    # Identify the shortest paths from TP53 to proteins Q96QZ7 and P01241 (with the Swiss-Prot numbers)
    results <- cisPath(infoFile, "TP53", outputDir, targetProteins=c("Q96QZ7", "P01241"), swissProtID=TRUE, byStep=TRUE)
    
    name2protFile <- system.file("extdata", "name2prot.txt", package="cisPath")
    results <- cisPath(infoFile, "P04637", outputDir, name2IDFile=name2protFile, byStep=TRUE)
    
\dontrun{
    # example of downloading PPI data from our website
    
    # Change to your own output directory
    outputDir <- "/home/user/TP53"
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
    
    results <- cisPath(infoFile, "TP53", outputDir)
    }
}
\keyword{methods}