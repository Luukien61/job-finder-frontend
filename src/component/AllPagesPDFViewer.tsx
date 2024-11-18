import React, {useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'react-pdf/dist/Page/AnnotationLayer.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


const FlexStickyLayout = ({url}) => {
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({numPages}: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className={`max-h-[650px] w-fit`}>
            <Document   file={`${url}`} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <Page scale={1.4} key={`page_${index + 1}`} pageNumber={index + 1}/>
                ))}
            </Document>
        </div>
    );
};

export default FlexStickyLayout;

export const OnePageCv = ({url}) => {
    return (
        <div className={`w-fit overflow-y-auto object-cover h-fit`}>
            <Document file={`${url}`} >
                <Page scale={0.3} pageNumber={1}/>
            </Document>
        </div>
    );
}