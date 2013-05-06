\name{networkView}
\alias{networkView}
\alias{networkView,character,character,character-method}
\title{Visualization of the interactions between input proteins}
\description{
  This method is used to visualize the input proteins in the PPI network, 
  and may be used to see the evidences supporting the interactions between proteins.
  With this method, users can choose the visual style (color and model size) in which the proteins will be displayed.
}
\usage{
networkView(infoFile, proteinNames, outputDir, swissProtID=FALSE, mainNode=c(1), nodeColors=c("#1F77B4", "#FF7F0E", "#D62728","#9467BD","#8C564B","#E377C2"), displayMore=TRUE, leafColor="#2CA02C")
\S4method{networkView}{character,character,character}(infoFile, proteinNames, outputDir, swissProtID=FALSE, mainNode=c(1), nodeColors=c("#1F77B4", "#FF7F0E", "#D62728","#9467BD","#8C564B","#E377C2"), displayMore=TRUE, leafColor="#2CA02C")
}
\arguments{
 \item{infoFile}{File that contains PPI data (character(1)). \cr Please see the file \code{PPI_Info.txt} as an example.}
 \item{proteinNames}{Gene names or Swiss-Prot numbers of the proteins (character vector).}
 \item{outputDir}{Output directory (character(1)).}
 \item{swissProtID}{A logical value. If \code{proteinNames} contains Swiss-Prot numbers, set as \code{TRUE}. \cr If \code{proteinNames} contains gene names, set as \code{FALSE}.}
 \item{mainNode}{A vector of value \code{0} and \code{1}. \cr 
                \code{0}: display the corresponding protein as a small node. \cr
                \code{1}: display the corresponding protein as a main node. \cr
                If there are fewer values than proteins, it will be recycled in the standard manner.}
 \item{nodeColors}{Represents colors for proteins. If there are fewer values than proteins, it will be recycled in the standard manner. \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.}
 \item{displayMore}{A logical value. If \code{TRUE}, proteins will be displayed which can interact with at least \code{two} proteins in \code{proteinNames}.}
 \item{leafColor}{Only used while \code{displayMore=TRUE}. This is the color for additional proteins. (character(1)) \cr
            Form: "#RRGGBB", each of the pairs RR, GG, BB consist of two hexadecimal digits giving a value in the range 00 to FF.
            }
}
\details{
  As an example, we have generated protein-protein interaction data for several species 
  from the PINA database (\url{http://cbg.garvan.unsw.edu.au/pina/}) and the STRING database (\url{http://string-db.org/}). 
  Users can download these files from \url{http://www.isb.pku.edu.cn/cisPath/}.  
  If you make use of these files, please cite PINA or STRING accordingly. 
  Users can edit the protein-protein interactions generated with these two databases,
  or combine them with their private data to construct more complete protein-protein interaction networks.
  In this package, we select only a small portion of the available protein-protein interaction data as an example.
  
  A protein often has several names, and some of these names have perhaps not been included in the input file \code{infoFile}.
  We therefore suggest users take a look at the output file \code{proteinIDs.txt} to check whether the input protein names are valid.
  In order to avoid inputting invalid target protein names, the unique identifier Swiss-Prot numbers may alternately be used as input. 
  The Swiss-Prot numbers can be sought in the UniProt (\url{http://www.uniprot.org/}) database.
}
\value{
  The output HTML file contains the protein-protein interactions and related supporting evidences.  
  Users can view the PPI network and obtain the supporting evidences for these interactions easily using a browser. 
  Please take a look at the output file \code{proteinIDs.txt} to determine whether the input protein names are valid.
}
\references{
  Cowley, M.J. and et al. (2012) PINA v2.0: mining interactome modules. \emph{Nucleic Acids Res}, \bold{40}, D862-865. 

  Wu, J. and et al. (2009) Integrated network analysis platform for protein-protein interactions. \emph{Nature methods}, \bold{6}, 75-77.
  
  Szklarczyk,D. and et al. (2011) The STRING database in 2011: functional interaction networks of proteins, globally integrated and scored. \emph{Nucleic Acids Res}, \bold{39}, D561-D568.
  
  The UniProt Consortium (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res} \bold{40}, D71-D75.
  
}
\seealso{
 \code{\link{cisPath}}, \code{\link{addProteinNames}}, \code{\link{easyEditor}}.
}
\examples{
    library(cisPath)
    infoFile <- system.file("extdata", "PPI_Info.txt", package="cisPath")
    outputDir <- file.path(tempdir(), "networkView")
    networkView(infoFile, c("MAGI1","TP53BP2","TP53", "PTEN"), outputDir, FALSE, c(1,1,1,0), displayMore=TRUE)
    
    outputDir2 <- file.path(tempdir(), "networkView2")
    inputFile <- system.file("extdata", "networkView.txt", package="cisPath")
    rt <- read.table(inputFile, sep=",", comment.char="", header=TRUE)
    proteins <- as.vector(rt[,1])
    sizes <- as.vector(rt[,2])
    nodeColors <- as.vector(rt[,3])
    networkView(infoFile, proteins, outputDir2, FALSE, sizes, nodeColors, displayMore=FALSE)
}
\keyword{methods}