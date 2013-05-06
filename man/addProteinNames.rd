\name{addProteinNames}
\alias{addProteinNames}
\alias{addProteinNames,character,character-method}
\title{Add ID mapping information}
\description{
   This method is used to add more ID mapping information. 
}
\usage{
addProteinNames(name2IDFile, outputDir)
\S4method{addProteinNames}{character,character}(name2IDFile, outputDir)
}
\arguments{
 \item{name2IDFile}{File contains ID mapping information (character(1)). \cr Please see the file \code{name2prot.txt} as an example.}
 \item{outputDir}{Output directory (character(1)).}
}
\details{
  This method allows users to add more ID mapping information even after identification of the shortest paths.
  In this way, users can search for the shortest paths using the protein names with which they are familiar. 
}
\value{
  The corresponding ID mapping information will be added.
}
\references{
  Cowley, M.J. and et al. (2012) PINA v2.0:mining interactome modules. \emph{Nucleic Acids Res}, \bold{40}, D862-865. 

  Wu, J. and et al. (2009) Integrated network analysis platform for protein-protein interactions. \emph{Nature methods}, \bold{6}, 75-77.
  
  Szklarczyk,D. and et al. (2011) The STRING database in 2011: functional interaction networks of proteins, globally integrated and scored. \emph{Nucleic Acids Res}, \bold{39}, D561-D568.
  
  The UniProt Consortium (2012) Reorganizing the protein space at the Universal Protein Resource (UniProt). \emph{Nucleic Acids Res} \bold{40}, D71-D75.
}
\seealso{
 \code{\link{cisPath}}, \code{\link{networkView}}.
}
\examples{
    infoFile <- system.file("extdata", "PPI_Info.txt", package="cisPath")
    outputDir <- file.path(tempdir(), "TP53_example")
    results <- cisPath(infoFile, "TP53", outputDir)
    name2protFile <- system.file("extdata", "name2prot.txt", package="cisPath")
    addProteinNames(name2protFile, outputDir)
}
\keyword{methods}
