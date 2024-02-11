import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5.js';
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// import 'react-pdf/dist/esm/Page/TextLayer.css';

function PdfViewer({url}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  console.log(url)
  // <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          // <Page pageNumber={pageNumber} />
        // </Document>

  return (
    <div>
    <div style={{overflowY: 'scroll', width: "100%"}}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}

export default PdfViewer
